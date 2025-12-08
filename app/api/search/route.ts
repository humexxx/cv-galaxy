import { NextRequest, NextResponse } from "next/server";
import { cvService } from "@/lib/services/cv-service";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query) {
      // Return top results when no query
      const results = await cvService.getTopResults();
      return NextResponse.json({ results, top: results });
    }

    const results = await cvService.searchCVs(query);
    const top = await cvService.getTopResults();

    return NextResponse.json({ results, top });
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json(
      { error: "Failed to search CVs" },
      { status: 500 }
    );
  }
}
