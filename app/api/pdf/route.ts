import { NextRequest, NextResponse } from "next/server";
import { getCVByUsername } from "@/data/cvs";
import { generateCVHTML } from "@/lib/templates/cv-pdf-template";

const CHROMIUM_PACK_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}/chromium-pack.tar`
  : process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}/chromium-pack.tar`
  : undefined;

let cachedExecutablePath: string | null = null;
let downloadPromise: Promise<string> | null = null;

async function getChromiumPath(): Promise<string> {
  if (cachedExecutablePath) return cachedExecutablePath;

  if (!downloadPromise) {
    const chromium = (await import("@sparticuz/chromium-min")).default;
    downloadPromise = chromium
      .executablePath(CHROMIUM_PACK_URL)
      .then((path) => {
        cachedExecutablePath = path;
        console.log("Chromium path resolved:", path);
        return path;
      })
      .catch((error) => {
        console.error("Failed to get Chromium path:", error);
        downloadPromise = null;
        throw error;
      });
  }

  return downloadPromise;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId parameter is required" },
        { status: 400 }
      );
    }

    const cvData = getCVByUsername(userId);

    if (!cvData) {
      return NextResponse.json(
        { error: "CV not found for the specified user" },
        { status: 404 }
      );
    }

    let browser;
    const isVercel = !!process.env.VERCEL_ENV;
    
    console.log('Environment check:', { VERCEL_ENV: process.env.VERCEL_ENV, isVercel });
    
    if (isVercel) {
      // Vercel: Use puppeteer-core with downloaded Chromium binary
      console.log('Launching Chromium for Vercel...');
      const chromium = (await import("@sparticuz/chromium-min")).default;
      const puppeteer = await import("puppeteer-core");
      const executablePath = await getChromiumPath();
      
      console.log('Chromium executable path:', executablePath);
      
      browser = await puppeteer.launch({
        args: chromium.args,
        defaultViewport: {
          width: 1920,
          height: 1080,
        },
        executablePath,
        headless: true,
      });
      console.log('Chromium launched successfully');
    } else {
      // Local: Use regular puppeteer with bundled Chromium
      console.log('Launching Chromium for local development...');
      const puppeteer = await import("puppeteer");
      browser = await puppeteer.launch({
        headless: true,
      });
      console.log('Chromium launched successfully');
    }

    console.log('Creating new page...');
    const page = await browser.newPage();

    // Generate HTML and set content
    console.log('Generating HTML content...');
    const htmlContent = generateCVHTML(cvData);
    console.log('Setting page content...');
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

    // Generate PDF
    console.log('Generating PDF...');
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '18mm',
        right: '16mm',
        bottom: '16mm',
        left: '16mm'
      }
    });

    console.log('PDF generated successfully, size:', pdfBuffer.length, 'bytes');
    await browser.close();

    // Return PDF as response
    return new Response(Buffer.from(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${cvData.fullName.replace(/\s+/g, '_')}_CV.pdf"`,
      },
    });

  } catch (error) {
    console.error("PDF generation error:", error);
    console.error("Error details:", {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined,
    });
    
    return NextResponse.json(
      { 
        error: "Failed to generate PDF",
        details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Unknown error') : undefined
      },
      { status: 500 }
    );
  }
}