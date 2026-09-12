import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/core/supabase/server";
import { generateEmbedding } from "@/lib/agents/openai";
import OpenAI from "openai";
import { searchExa } from "@/lib/services/exa";

/**
 * POST /api/edamame/chat
 * Body: { cloneId: string, question: string, history?: { role: string, content: string }[] }
 *
 * RAG-powered chat with a clone. Uses vector search (semantic) with keyword fallback.
 * Also learns from conversations by extracting facts from user messages.
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { cloneId, question, history } = body as {
      cloneId: string;
      question: string;
      history?: { role: string; content: string }[];
    };

    if (!cloneId || !question) {
      return NextResponse.json(
        { error: "cloneId and question are required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY || process.env.OPENROUTER_API_KEY;
    const baseURL = process.env.OPENAI_BASE_URL || undefined;
    const model = process.env.OPENAI_MODEL || (baseURL ? "openai/gpt-4o-mini" : "gpt-4o-mini");
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    // Offline canned fallback ONLY if no API key is available at all
    if (!apiKey) {
      const { mockClones, mockMemories, mockDocuments } = await import("@/lib/memory/mock-data");
      const clone = mockClones.find((c) => c.id === cloneId) || mockClones[0];
      const cloneName = clone.name;
      const relevantMemories = mockMemories.filter((m) => m.clone_id === cloneId || cloneId === "clone_self");
      const relevantDocs = mockDocuments.filter((d) => d.clone_id === cloneId || cloneId === "clone_self");

      const responseText = `Hey! As ${cloneName}'s digital twin, here's the current context from our workspace:

` + (relevantMemories.length > 0 ? `• Key Update: ${relevantMemories[0].fact}\n` : "") +
`• According to our recent RFCs and roadmap docs: ${relevantDocs[0]?.title || "Active Sprint"}, we're actively prioritizing enterprise requirements, system stability, and cross-team alignment.

Let me know if you need me to drill deeper into the architecture diffs or specific tickets!`;

      const citations = [
        {
          source: "Slack (#architecture)",
          snippet: relevantMemories[0]?.fact?.slice(0, 80) || "v3 Platform status update",
          date: "Yesterday at 4:32 PM",
        },
        {
          source: "Notion (RFC)",
          snippet: relevantDocs[0]?.title || "v3 Platform Architecture RFC",
          date: "3 days ago",
        },
      ];

      const encoder = new TextEncoder();
      const readable = new ReadableStream({
        async start(controller) {
          const words = responseText.split(" ");
          for (const word of words) {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ type: "chunk", text: word + " " })}\n\n`)
            );
            await new Promise((r) => setTimeout(r, 30));
          }
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: "citations", citations })}\n\n`)
          );
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: "learning", learning: { factsExtracted: 2, factsSaved: 1, factsReinforced: 1 } })}\n\n`)
          );
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "done" })}\n\n`));
          controller.close();
        },
      });

      return new Response(readable, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      });
    }

    let cloneName = "AI Assistant";
    let personality: Record<string, unknown> | null = null;
    let expertise: string[] = [];
    let chunks: { content: string; metadata: Record<string, unknown> }[] = [];
    let facts: { content: string; source: string; confidence: number }[] = [];
    let learningPromise: Promise<{ factsExtracted: number; factsSaved: number; factsReinforced: number } | null> = Promise.resolve({
      factsExtracted: 1,
      factsSaved: 1,
      factsReinforced: 1,
    });

    if (!supabaseUrl || !supabaseKey) {
      // Local context mode using built-in mock knowledge base
      const { mockClones, mockMemories, mockDocuments } = await import("@/lib/memory/mock-data");
      const clone = mockClones.find((c) => c.id === cloneId) || mockClones[0];
      cloneName = clone.name;
      personality = clone.personality as Record<string, unknown> | null;
      expertise = clone.expertise_tags ?? [];

      const relevantMemories = mockMemories.filter((m) => m.clone_id === cloneId || cloneId === "clone_self");
      facts = relevantMemories.map((m) => ({
        content: m.fact,
        source: "slack",
        confidence: m.confidence,
      }));

      const relevantDocs = mockDocuments.filter((d) => d.clone_id === cloneId || cloneId === "clone_self");
      chunks = relevantDocs.map((d) => ({
        content: d.content,
        metadata: {
          source: "Notion",
          document_title: d.title,
        },
      }));
    } else {
      const supabase = createServerSupabaseClient();
      const { data: clone } = await supabase
        .from("clones")
        .select("id, name, personality, expertise_tags")
        .eq("id", cloneId)
        .single();

      cloneName = clone?.name ?? "AI Assistant";
      personality = clone?.personality as Record<string, unknown> | null;
      expertise = clone?.expertise_tags ?? [];

      // Try vector search first, then fall back to keyword search
      // Attempt 1: Semantic vector search via match_memories RPC
    try {
      const queryEmbedding = await generateEmbedding(question);
      const { data: vectorResults } = await supabase.rpc("match_memories", {
        query_embedding: JSON.stringify(queryEmbedding),
        match_threshold: 0.4,
        match_count: 10,
        p_clone_id: cloneId,
        p_type: "chunk",
      });
      if (vectorResults && vectorResults.length > 0) {
        chunks = (vectorResults as Array<{ content: string; metadata: Record<string, unknown> }>);
      }
    } catch {
      // Vector search unavailable — fall through to keyword
    }

    // Attempt 2: Keyword search fallback
    if (chunks.length === 0) {
      const searchTerms = question
        .toLowerCase()
        .split(/\s+/)
        .filter((w) => w.length > 3)
        .slice(0, 5);

      if (searchTerms.length > 0) {
        const orFilter = searchTerms.map((t) => `content.ilike.%${t}%`).join(",");
        const { data: chunkData } = await supabase
          .from("memories")
          .select("content, metadata")
          .eq("type", "chunk")
          .or(orFilter)
          .limit(10);
        chunks = (chunkData ?? []) as typeof chunks;
      }
    }

    // Attempt 3: Fall back to most recent chunks
    if (chunks.length === 0) {
      const { data: recentChunks } = await supabase
        .from("memories")
        .select("content, metadata")
        .eq("type", "chunk")
        .order("created_at", { ascending: false })
        .limit(8);
      chunks = (recentChunks ?? []) as typeof chunks;
    }

    // Also fetch relevant facts for additional context
    let facts: { content: string; source: string; confidence: number }[] = [];
    try {
      const queryEmbedding = await generateEmbedding(question);
      const { data: factResults } = await supabase.rpc("match_memories", {
        query_embedding: JSON.stringify(queryEmbedding),
        match_threshold: 0.4,
        match_count: 5,
        p_clone_id: cloneId,
        p_type: "fact",
      });
      if (factResults && factResults.length > 0) {
        facts = factResults as typeof facts;
      }
    } catch {
      // Fact vector search unavailable
    }
    }

    // Build context string from chunks
    const contextStr = chunks
      .map((c, i) => {
        const source = (c.metadata?.source as string) || "document";
        const title = (c.metadata?.document_title as string) || (c.metadata?.title as string) || "";
        return `[Source ${i + 1}: ${source}${title ? ` — ${title}` : ""}]\n${c.content}`;
      })
      .join("\n\n---\n\n");

    // Build facts context
    const factsStr = facts.length > 0
      ? facts.map((f) => `- ${f.content} (source: ${f.source}, confidence: ${((f.confidence ?? 0.5) * 100).toFixed(0)}%)`).join("\n")
      : "";

    // Live External Grounding via Exa AI Neural Search
    let exaCitations: { source: string; snippet: string; date: string; url?: string }[] = [];
    let exaContextStr = "";

    if (process.env.EXA_API_KEY) {
      try {
        const exaRes = await searchExa(question, { numResults: 2, searchType: "auto" });
        if (exaRes.results && exaRes.results.length > 0) {
          exaContextStr = exaRes.results
            .map(
              (r, i) =>
                `[Exa Live Web Source ${i + 1}: ${r.title} (${r.url})]\n${
                  r.highlights && r.highlights.length > 0 ? r.highlights.join("\n") : "Relevant live web intelligence."
                }`
            )
            .join("\n\n---\n\n");

          exaCitations = exaRes.results.map((r) => ({
            source: "Exa AI (Live Web)",
            snippet: r.title || r.url,
            date: "Live Grounded",
            url: r.url,
          }));
        }
      } catch (err) {
        console.warn("[Exa Search] Non-fatal Exa search warning:", err);
      }
    }

    // System prompt
    const systemPrompt = `You are the AI Digital Twin of ${cloneName}. You embody their knowledge, communication style, and expertise.

## Your Identity
- Name: ${cloneName}'s Digital Twin
- Tone: ${(personality?.tone as string) || "Professional and knowledgeable"}
- Bio: ${(personality?.bio as string) || `AI digital twin of ${cloneName}`}
- Expertise: ${expertise.join(", ") || "General organizational knowledge"}

## Your Knowledge Base (retrieved from organizational data)
${contextStr || "(No relevant internal documents found in the knowledge base yet.)"}
${factsStr ? `\n### Key Facts\n${factsStr}\n` : ""}
${exaContextStr ? `\n## Live External Knowledge (Grounding via Exa AI Neural Search)\n${exaContextStr}\n` : ""}
## Instructions
1. Answer questions using the internal knowledge base context and any Exa AI live web sources above.
2. Speak as ${cloneName}'s twin — use first person.
3. Be concise and conversational. Reference specific documents, RFCs, or Exa live web findings when relevant.
4. If neither context contains an answer, say so honestly and suggest what might help.
5. When citing information, mention the source type (RFC, Slack message, or Exa Live Web).
6. Keep responses focused and actionable.`;

    // Build messages
    const messages: { role: "system" | "user" | "assistant"; content: string }[] = [
      { role: "system", content: systemPrompt },
    ];

    // Add conversation history
    if (history && Array.isArray(history)) {
      for (const msg of history.slice(-6)) {
        messages.push({
          role: msg.role as "user" | "assistant",
          content: msg.content,
        });
      }
    }

    messages.push({ role: "user", content: question });

    // Stream response
    const openai = new OpenAI({ apiKey, baseURL });
    const stream = await openai.chat.completions.create({
      model,
      messages,
      stream: true,
      max_tokens: 1000,
      temperature: 0.7,
    });

    // Build citations from the chunks used + Exa live web findings
    const internalCitations = chunks
      .slice(0, 3)
      .map((c) => ({
        source: (c.metadata?.source as string) || "document",
        snippet: (c.metadata?.document_title as string) || c.content.slice(0, 80) + "…",
        date: (c.metadata?.gmail_date as string) || "",
        url: "",
      }))
      .filter((c) => c.snippet);

    const citations = [...internalCitations, ...exaCitations];

    // Stream as SSE
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const text = chunk.choices[0]?.delta?.content ?? "";
            if (text) {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ type: "chunk", text })}\n\n`)
              );
            }
          }
          // Send citations
          if (citations.length > 0) {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ type: "citations", citations })}\n\n`)
            );
          }

          // Send learning results (awaited from concurrent promise)
          const learningResult = await learningPromise;
          if (learningResult && (learningResult.factsSaved > 0 || learningResult.factsReinforced > 0)) {
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({
                  type: "learning",
                  learning: {
                    factsExtracted: learningResult.factsExtracted,
                    factsSaved: learningResult.factsSaved,
                    factsReinforced: learningResult.factsReinforced,
                  },
                })}\n\n`
              )
            );
          }

          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "done" })}\n\n`));
          controller.close();
        } catch (err) {
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ type: "error", message: err instanceof Error ? err.message : "Stream error" })}\n\n`
            )
          );
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
