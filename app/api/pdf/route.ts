import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";
import { existsSync } from "fs";
import { getCVByUsername } from "@/data/cvs";
import { generateCVHTML } from "@/lib/templates/cv-pdf-template";

// Configure chromium for Vercel
chromium.setGraphicsMode = false;

function findChromeExecutable(): string | undefined {
  const possiblePaths = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    process.env.LOCALAPPDATA + '\\Google\\Chrome\\Application\\chrome.exe',
  ];
  
  for (const path of possiblePaths) {
    try {
      if (existsSync(path)) {
        return path;
      }
    } catch {
      continue;
    }
  }
  return undefined;
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
    const isProduction = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production';
    
    console.log('Environment check:', { VERCEL: process.env.VERCEL, NODE_ENV: process.env.NODE_ENV, isProduction });
    
    if (isProduction) {
      // Production: Use Chromium from Sparticuz
      console.log('Launching Chromium for production...');
      
      const executablePath = await chromium.executablePath();
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
      // Local development: Try to find Chrome
      console.log('Looking for Chrome executable for local development...');
      const chromeExecutable = findChromeExecutable();
      
      if (!chromeExecutable) {
        console.error("Chrome not found. Please install Google Chrome or set CHROME_EXECUTABLE_PATH environment variable.");
        return NextResponse.json(
          { error: "Chrome browser not found. Please install Google Chrome to generate PDFs locally." },
          { status: 500 }
        );
      }
      
      console.log('Chrome found at:', chromeExecutable);
      browser = await puppeteer.launch({
        executablePath: process.env.CHROME_EXECUTABLE_PATH || chromeExecutable,
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
      console.log('Chrome launched successfully');
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