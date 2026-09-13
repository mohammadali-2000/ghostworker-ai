"use client";

import { useState, type FormEvent } from "react";
import { Sparkles, Loader2, UserCheck, Shield } from "lucide-react";

const CEO_EMAIL = "ceo@ghostworker.ai";

const EMAIL_TO_CLONE: Record<string, string> = {
  "smali@ghostworker.ai": "Sm Ali",
  "maneesh@ghostworker.ai": "Maneesh Nand",
  "towfik@ghostworker.ai": "Md Towfik Omer",
  "ceo@ghostworker.ai": "Angelina Quan",
  "ella2happy@gmail.com": "Ella Lan",
  "mvideet@gmail.com": "Videet Mehta",
  "angelinaquan2024@gmail.com": "Angelina Quan",
  "jamesliu535b@gmail.com": "James Liu",
};

const DEMO_PERSONAS = [
  { name: "Sm Ali", role: "Lead AI Architect", email: "smali@ghostworker.ai", isCeo: false, initials: "SA", color: "from-emerald-500 to-teal-600" },
  { name: "Maneesh Nand", role: "Backend & Infra", email: "maneesh@ghostworker.ai", isCeo: false, initials: "MN", color: "from-indigo-500 to-violet-600" },
  { name: "Md Towfik Omer", role: "Frontend & Product", email: "towfik@ghostworker.ai", isCeo: false, initials: "MT", color: "from-cyan-500 to-blue-600" },
  { name: "Angelina Quan", role: "CEO Strategic Polling", email: "ceo@ghostworker.ai", isCeo: true, initials: "AQ", color: "from-amber-500 to-orange-600" },
];

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}

export default function LandingPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const loginWithEmail = (targetEmail: string, cloneName?: string, isCeo?: boolean) => {
    const trimmed = targetEmail.trim().toLowerCase();
    setLoading(true);
    sessionStorage.setItem("ghostworker_email", trimmed);
    sessionStorage.setItem("edamame_email", trimmed);
    const resolvedName = cloneName || EMAIL_TO_CLONE[trimmed] || "Sm Ali";
    sessionStorage.setItem("ghostworker_clone_name", resolvedName);
    sessionStorage.setItem("edamame_clone_name", resolvedName);
    
    // Always navigate using relative paths on current origin -- NEVER localhost
    window.location.href = isCeo || trimmed === CEO_EMAIL ? "/ceo" : "/employee";
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !trimmed.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    loginWithEmail(trimmed);
  };

  const handleGoogleAuth = () => {
    setLoading(true);
    // Directly log into verified demo workspace as Sm Ali on the active domain
    loginWithEmail("smali@ghostworker.ai", "Sm Ali", false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#111113] p-4">
      <div className="w-full max-w-[460px]">
        {/* Card */}
        <div className="rounded-2xl border border-[#2a2a2e] bg-[#19191d] p-6 sm:p-8 shadow-2xl">
          {/* Logo icon */}
          <div className="mb-4 flex justify-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-lg shadow-emerald-900/30">
              <Sparkles size={22} />
            </div>
          </div>

          {/* Title */}
          <h1 className="mb-1 text-center text-[22px] font-bold text-white tracking-tight">
            Sign in to GhostWorker
          </h1>
          <p className="mb-6 text-center text-[13.5px] text-[#8e8e93]">
            Autonomous Workplace Digital Twins Living in Slack & Docs
          </p>

          {/* Quick 1-Click Demo Login */}
          <div className="mb-6 rounded-xl border border-[#2a2a2e] bg-[#141416] p-3.5">
            <div className="mb-2.5 flex items-center justify-between">
              <span className="text-[11.5px] font-semibold uppercase tracking-wider text-[#a1a1aa] flex items-center gap-1.5">
                <UserCheck size={13} className="text-emerald-400" />
                1-Click Instant Demo Login
              </span>
              <span className="text-[10.5px] text-[#71717a] font-mono">Live Session</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {DEMO_PERSONAS.map((p) => (
                <button
                  key={p.email}
                  type="button"
                  onClick={() => loginWithEmail(p.email, p.name, p.isCeo)}
                  disabled={loading}
                  className="flex items-center gap-2.5 rounded-lg border border-[#27272a] bg-[#1c1c20] p-2 text-left transition-all hover:border-[#3f3f46] hover:bg-[#25252b] active:scale-[0.98]"
                >
                  <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-gradient-to-br ${p.color} text-[11px] font-bold text-white shadow-sm`}>
                    {p.initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[12px] font-medium text-white">{p.name}</div>
                    <div className="truncate text-[10px] text-[#a1a1aa]">{p.role}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Email input */}
          <form onSubmit={handleSubmit} className="mb-4">
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              placeholder="Enter your business email*"
              className="mb-3 w-full rounded-lg border border-[#2a2a2e] bg-[#111113] px-4 py-3 text-[14px] text-white placeholder:text-[#555] focus:border-emerald-500 focus:outline-none transition-colors"
            />
            {error && (
              <p className="mb-2 text-[12px] text-red-400">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-white px-4 py-3 text-[14px] font-semibold text-black transition-all hover:bg-[#e8e8e8] active:scale-[0.99] disabled:opacity-50"
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                "Continue to Workspace"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="mb-4 flex items-center gap-3">
            <div className="h-px flex-1 bg-[#2a2a2e]" />
            <span className="text-[11px] font-medium uppercase text-[#555]">OR</span>
            <div className="h-px flex-1 bg-[#2a2a2e]" />
          </div>

          {/* Google auth */}
          <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={loading}
            className="flex w-full items-center justify-center gap-3 rounded-lg border border-[#2a2a2e] bg-[#141416] px-4 py-3 text-[13.5px] font-medium text-[#ccc] transition-all hover:border-[#3f3f46] hover:bg-[#1c1c20] hover:text-white active:scale-[0.99] disabled:opacity-50"
          >
            <GoogleIcon />
            Continue with Google (Demo Sign In)
          </button>
        </div>
      </div>
    </div>
  );
}
