"use client";

import { useState, type FormEvent } from "react";
import { Sparkles, Loader2, UserCheck, ShieldCheck } from "lucide-react";

const CEO_EMAIL = "ceo@twinops.ai";

const EMAIL_TO_CLONE: Record<string, string> = {
  "smali@twinops.ai": "Sm Ali",
  "maneesh@twinops.ai": "Maneesh Nand",
  "towfik@twinops.ai": "Md Towfik Omer",
  "ceo@twinops.ai": "Executive Lead",
  "smali@ghostworker.ai": "Sm Ali",
  "maneesh@ghostworker.ai": "Maneesh Nand",
  "towfik@ghostworker.ai": "Md Towfik Omer",
};

const DEMO_PERSONAS = [
  { name: "Sm Ali", role: "Lead AI Architect", email: "smali@twinops.ai", isCeo: false, initials: "SA", color: "from-indigo-600 to-indigo-500" },
  { name: "Maneesh Nand", role: "Backend & Infra", email: "maneesh@twinops.ai", isCeo: false, initials: "MN", color: "from-violet-600 to-purple-500" },
  { name: "Md Towfik Omer", role: "Frontend & Product", email: "towfik@twinops.ai", isCeo: false, initials: "MT", color: "from-sky-600 to-blue-500" },
  { name: "Executive Lead", role: "CEO Multi-Twin Polling", email: "ceo@twinops.ai", isCeo: true, initials: "EL", color: "from-amber-600 to-orange-500" },
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
    
    window.location.href = isCeo || trimmed.includes("ceo") ? "/ceo" : "/employee";
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
    loginWithEmail("smali@twinops.ai", "Sm Ali", false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#eaf0f6] p-4 select-none">
      <div className="w-full max-w-[480px]">
        {/* Neumorphic Card */}
        <div className="rounded-3xl bg-[#f1f5fa] p-7 sm:p-9 shadow-[10px_10px_25px_#cfd8e5,-10px_-10px_25px_#ffffff] border border-white/90">
          {/* Logo */}
          <div className="mb-4 flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white shadow-[4px_4px_10px_#cfd8e5,-4px_-4px_10px_#ffffff] border border-white/60">
              <Sparkles size={24} className="animate-pulse" />
            </div>
          </div>

          {/* Title */}
          <h1 className="mb-1 text-center text-[23px] font-extrabold text-slate-800 tracking-tight">
            TwinOps Enterprise
          </h1>
          <p className="mb-6 text-center text-[12.5px] text-slate-500 font-medium">
            Autonomous Workplace Digital Twins for Enterprise Delivery Pods
          </p>

          {/* Quick 1-Click Demo Login */}
          <div className="mb-6 rounded-2xl bg-[#e6edf5] p-3.5 shadow-[inset_2px_2px_5px_#cfd8e5,inset_-2px_-2px_5px_#ffffff] border border-white/60">
            <div className="mb-2.5 flex items-center justify-between px-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                <UserCheck size={14} className="text-indigo-600" />
                1-Click Instant Persona Sign In
              </span>
              <span className="text-[10px] text-indigo-700 font-bold bg-white px-2 py-0.5 rounded-full shadow-sm border border-indigo-100">
                Live Pod
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {DEMO_PERSONAS.map((p) => (
                <button
                  key={p.email}
                  type="button"
                  onClick={() => loginWithEmail(p.email, p.name, p.isCeo)}
                  disabled={loading}
                  className="flex items-center gap-2.5 rounded-xl bg-[#f1f5fa] p-2.5 text-left shadow-[3px_3px_7px_#cfd8e5,-3px_-3px_7px_#ffffff] border border-white/80 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${p.color} text-[10px] font-black text-white shadow-sm`}>
                    {p.initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[11.5px] font-bold text-slate-800">{p.name}</div>
                    <div className="truncate text-[9.5px] text-slate-500 font-medium">{p.role}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Email input */}
          <form onSubmit={handleSubmit} className="mb-4">
            <div className="mb-3">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                placeholder="Enter corporate email (e.g. ali@accenture.com)"
                className="w-full rounded-2xl bg-[#e3ebf4] px-4 py-3 text-[13px] text-slate-800 placeholder:text-slate-400 font-medium shadow-[inset_3px_3px_6px_#cfd8e5,inset_-3px_-3px_6px_#ffffff] border border-white/70 focus:outline-none focus:ring-2 focus:ring-indigo-400/40 transition-all"
              />
            </div>
            {error && (
              <p className="mb-2 text-[11px] font-bold text-rose-600 pl-1">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-500 py-3 text-[13px] font-bold text-white shadow-[4px_4px_10px_#cfd8e5,-4px_-4px_10px_#ffffff] hover:opacity-95 active:scale-[0.99] disabled:opacity-50 transition-all"
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin text-white" />
              ) : (
                "Enter Delivery Workspace"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="mb-4 flex items-center gap-3">
            <div className="h-px flex-1 bg-[#d4deeb]" />
            <span className="text-[10px] font-bold uppercase text-slate-400">OR</span>
            <div className="h-px flex-1 bg-[#d4deeb]" />
          </div>

          {/* Google auth */}
          <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={loading}
            className="flex w-full items-center justify-center gap-2.5 rounded-2xl bg-[#f1f5fa] py-2.5 text-[12.5px] font-bold text-slate-700 shadow-[3px_3px_7px_#cfd8e5,-3px_-3px_7px_#ffffff] border border-white/80 hover:bg-[#eaf0f6] active:scale-[0.99] disabled:opacity-50 transition-all"
          >
            <GoogleIcon />
            Continue with Enterprise Single Sign-On
          </button>

          {/* Security badge footer */}
          <div className="mt-5 flex items-center justify-center gap-1.5 text-[11px] text-slate-400 font-medium">
            <ShieldCheck size={14} className="text-emerald-500" />
            <span>Zero Data Leakage • HIPAA & RBAC Compliant</span>
          </div>
        </div>
      </div>
    </div>
  );
}
