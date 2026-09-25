import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/core/supabase/server";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

async function getLocalProfiles() {
  const { mockClones } = await import("@/lib/memory/mock-data");
  return mockClones.map((clone) => {
    const personality = clone.personality as unknown as Record<string, unknown> | null;
    const tone = (personality?.tone as string) || "";
    const bio = (personality?.bio as string) || "";
    const expertiseAreas = (personality?.expertise_areas as string[]) || [];
    const displayName = clone.name.replace(/\s*\(Clone\)$/i, "");

    return {
      employee: {
        id: clone.id,
        name: displayName,
        role: expertiseAreas[0] ? expertiseAreas[0].toUpperCase() : "Lead AI Architect",
        team: clone.id === "clone_jason" ? "Healthcare & Life Sciences" : clone.id === "clone_sarah" ? "Enterprise Architecture" : "Engineering",
        tenure: "3 years",
        initials: getInitials(displayName),
      },
      personality: tone || bio || `AI digital twin of ${displayName}.`,
      expertise: clone.expertise_tags ?? ["Architecture", "TypeScript", "Next.js", "AI Agents"],
      suggestedQuestions: [
        "What are you currently working on?",
        "What's the most important thing I should know?",
        "What are the biggest risks right now?",
        "Tell me about recent decisions and their context.",
      ],
    };
  });
}

export async function GET() {
  try {
    const supabase = createServerSupabaseClient();

    const { data: clones, error } = await supabase
      .from("clones")
      .select(
        "id, name, avatar_url, personality, expertise_tags, status, owner_name, owner_email, owner_role, owner_department, created_at"
      )
      .order("created_at", { ascending: true });

    if (error || !clones || clones.length === 0) {
      const profiles = await getLocalProfiles();
      return NextResponse.json({ profiles, total: profiles.length });
    }

    const profiles = clones.map((clone) => {
      const personality = clone.personality as unknown as Record<string, unknown> | null;
      const tone = (personality?.tone as string) || "";
      const bio = (personality?.bio as string) || "";
      const expertiseAreas = (personality?.expertise_areas as string[]) || [];
      const displayName = clone.name.replace(/\s*\(Clone\)$/i, "");

      return {
        employee: {
          id: clone.id,
          name: displayName,
          role: clone.owner_role || expertiseAreas[0] || "Team Member",
          team: clone.owner_department || expertiseAreas[0] || "General",
          tenure: "",
          initials: getInitials(displayName),
        },
        personality: tone || bio || `AI digital twin of ${displayName}.`,
        expertise: clone.expertise_tags ?? [],
        suggestedQuestions: [
          "What are you currently working on?",
          "What's the most important thing I should know?",
          "What are the biggest risks right now?",
          "Tell me about recent decisions and their context.",
        ],
      };
    });

    return NextResponse.json({ profiles, total: profiles.length });
  } catch {
    const profiles = await getLocalProfiles();
    return NextResponse.json({ profiles, total: profiles.length });
  }
}
