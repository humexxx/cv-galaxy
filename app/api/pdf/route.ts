import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";
import { getCVByUsername } from "@/data/cvs";
import { generateCVHTML } from "@/lib/templates/cv-pdf-template";

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

    const browser = await puppeteer.launch(
      process.env.VERCEL
        ? {
            args: chromium.args,
            executablePath: await chromium.executablePath(),
            headless: true,
          }
        : {
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
          }
    );

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

    // Return PDF as response
    return new Response(Buffer.from(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${cvData.fullName.replace(/\s+/g, '_')}_CV.pdf"`,
      },
    });

  } catch (error) {
    console.error("PDF generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}