import { NextRequest, NextResponse } from "next/server";
import { cvService } from "@/lib/services/cv-service";
import { generateCVHTML } from "@/lib/templates/cv-pdf-template";
import { env } from "@/lib/env";

// URL to the Chromium binary package hosted in /public
// Use production URL if available, otherwise use the current deployment URL
const CHROMIUM_PACK_URL = env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${env.VERCEL_PROJECT_PRODUCTION_URL}/chromium-pack.tar`
  : env.VERCEL_URL
  ? `https://${env.VERCEL_URL}/chromium-pack.tar`
  : "https://github.com/humexxx/cv-galaxy/raw/refs/heads/develop/public/chromium-pack.tar";

// Cache the Chromium executable path to avoid re-downloading on subsequent requests
let cachedExecutablePath: string | null = null;
let downloadPromise: Promise<string> | null = null;

/**
 * Downloads and caches the Chromium executable path.
 * Uses a download promise to prevent concurrent downloads.
 */
async function getChromiumPath(): Promise<string> {
  // Return cached path if available
  if (cachedExecutablePath) return cachedExecutablePath;

  // Prevent concurrent downloads by reusing the same promise
  if (!downloadPromise) {
    const chromium = (await import("@sparticuz/chromium-min")).default;
    downloadPromise = chromium
      .executablePath(CHROMIUM_PACK_URL)
      .then((path) => {
        cachedExecutablePath = path;
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

    const cvData = await cvService.getCVByUsername(userId);

    if (!cvData) {
      return NextResponse.json(
        { error: "CV not found for the specified user" },
        { status: 404 }
      );
    }

    // Configure browser based on environment
    const isVercel = !!env.VERCEL_ENV;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let puppeteer: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let launchOptions: any = {
      headless: true,
    };

    if (isVercel) {
      // Vercel: Use puppeteer-core with downloaded Chromium binary
      const chromium = (await import("@sparticuz/chromium-min")).default;
      puppeteer = await import("puppeteer-core");
      const executablePath = await getChromiumPath();
      launchOptions = {
        ...launchOptions,
        args: chromium.args,
        executablePath,
      };
    } else {
      // Local: Use regular puppeteer with bundled Chromium
      puppeteer = await import("puppeteer");
    }

    // Launch browser
    const browser = await puppeteer.launch(launchOptions);
    const page = await browser.newPage();

    // Generate HTML and set content
    const htmlContent = generateCVHTML(cvData);
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

    // Generate PDF
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

    await browser.close();

    // Create filename with proper encoding for non-ASCII characters
    const filename = `${cvData.fullName.replace(/\s+/g, '_')}_CV.pdf`;
    const encodedFilename = encodeURIComponent(filename);

    // Return PDF as response
    return new Response(Buffer.from(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${encodedFilename}"; filename*=UTF-8''${encodedFilename}`,
      },
    });

  } catch (error) {
    console.error("PDF generation error:", error);
    return NextResponse.json(
      { 
        error: "Failed to generate PDF",
        details: env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Unknown error') : undefined
      },
      { status: 500 }
    );
  }
}