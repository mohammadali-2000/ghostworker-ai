import { NextRequest, NextResponse } from "next/server";
import { searchExa } from "@/lib/services/exa";

export async function POST(request: NextRequest) {
  try {
    const { query, numResults, searchType } = await request.json();
    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    const response = await searchExa(query, { numResults, searchType });
    return NextResponse.json(response);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal error" },
      { status: 500 }
    );
  }
}
