/**
 * Exa AI Search Integration for GhostWorker AI
 * Provides real-time neural web search & live grounding for digital twin responses.
 */

export interface ExaSearchResult {
  id: string;
  title: string;
  url: string;
  publishedDate?: string;
  author?: string;
  highlights?: string[];
  score?: number;
}

export interface ExaSearchResponse {
  results: ExaSearchResult[];
  searchTime?: number;
  error?: string;
}

export async function searchExa(
  query: string,
  options: {
    numResults?: number;
    searchType?: "auto" | "fast" | "deep";
  } = {}
): Promise<ExaSearchResponse> {
  const apiKey = process.env.EXA_API_KEY;

  if (!apiKey) {
    return { results: [], error: "EXA_API_KEY not configured" };
  }

  try {
    const res = await fetch("https://api.exa.ai/search", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        type: options.searchType || "auto",
        numResults: options.numResults || 3,
        contents: {
          highlights: true,
        },
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.warn("[Exa Search] API returned error:", res.status, errText);
      return { results: [], error: `Exa API error: ${res.status}` };
    }

    const data = await res.json();
    const results: ExaSearchResult[] = (data.results || []).map((item: any) => ({
      id: item.id || item.url,
      title: item.title || item.url,
      url: item.url,
      publishedDate: item.publishedDate,
      author: item.author,
      highlights: item.highlights || [],
      score: item.score,
    }));

    return {
      results,
      searchTime: data.searchTime,
    };
  } catch (err) {
    console.error("[Exa Search] Network or parsing failure:", err);
    return {
      results: [],
      error: err instanceof Error ? err.message : "Exa search failed",
    };
  }
}
