import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/core/supabase/server";
import { getActiveCloneId } from "@/lib/integrations/credentials";

/**
 * GET /api/memory/recent?cloneId=<uuid>&limit=20&since=<ISO_timestamp>
 *
 * Returns the most recent fact memories for a specific clone.
 * If cloneId is not provided, falls back to the active clone.
 * Used by the Continual Learning panel to poll for new entries
 * from any source (chat, Slack webhook, integration sync, etc.).
 */
export async function GET(request: NextRequest) {
  try {
    const url = request.nextUrl;
    const limit = Math.min(parseInt(url.searchParams.get("limit") || "20", 10), 50);
    const since = url.searchParams.get("since") || null;
    const cloneIdParam = url.searchParams.get("cloneId")?.trim() || null;

    const cloneId = cloneIdParam || (await getActiveCloneId());

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      const { mockMemories } = await import("@/lib/memory/mock-data");
      const matched = mockMemories.filter((m) => !cloneId || m.clone_id === cloneId || cloneId === "clone_self");
      const entries = matched.slice(0, limit).map((m) => ({
        id: m.id,
        fact: m.fact || (m as unknown as { content?: string }).content || "",
        source: "slack",
        confidence: m.confidence || 0.9,
        timestamp: m.created_at || new Date().toISOString(),
        metadata: {
          channel_name: "general",
          sender_name: "Team Lead",
        },
      }));
      return NextResponse.json({ entries });
    }

    const supabase = createServerSupabaseClient();

    let query = supabase
      .from("memories")
      .select("id, content, source, confidence, metadata, created_at")
      .eq("clone_id", cloneId)
      .eq("type", "fact")
      .order("created_at", { ascending: false })
      .limit(limit);

    // If `since` is provided, only return entries newer than that timestamp
    if (since) {
      query = query.gt("created_at", since);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const entries = (data ?? []).map((row) => {
      const meta = (row.metadata || {}) as Record<string, unknown>;
      return {
        id: row.id,
        fact: row.content,
        source: row.source,
        confidence: row.confidence,
        timestamp: row.created_at,
        metadata: {
          conversation_id: meta.conversation_id as string | undefined,
          channel_name: meta.channel_name as string | undefined,
          sender_name: meta.sender_name as string | undefined,
          title: meta.title as string | undefined,
          category_key: meta.category_key as string | undefined,
          compaction_state: meta.compaction_state as string | undefined,
          reinforcement_count: meta.reinforcement_count as number | undefined,
          last_reinforced: meta.last_reinforced as string | undefined,
        },
      };
    });

    return NextResponse.json({ entries });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
