"use client";

import { useState, useRef, useEffect } from "react";
import {
  Hash,
  Send,
  Sparkles,
  Bot,
  Circle,
  ExternalLink,
  ChevronDown,
  Smile,
  AtSign,
  Paperclip,
  Clock,
  CheckCircle,
} from "lucide-react";

interface SlackMessage {
  id: string;
  sender: string;
  avatar: string;
  role: string;
  timestamp: string;
  content: string;
  isBot?: boolean;
  botFor?: string;
  citations?: { source: string; snippet: string; url?: string }[];
}

interface TeammateAvatarInfo {
  initials: string;
  gradient: string;
  ring: string;
}

export function getTeammateAvatarInfo(sender: string, botFor?: string): TeammateAvatarInfo {
  const name = (botFor || sender).toLowerCase();
  if (name.includes("ali")) {
    return {
      initials: "SA",
      gradient: "from-emerald-600 to-teal-800 text-white",
      ring: "ring-emerald-500/40",
    };
  }
  if (name.includes("maneesh")) {
    return {
      initials: "MN",
      gradient: "from-indigo-600 to-violet-800 text-white",
      ring: "ring-indigo-500/40",
    };
  }
  if (name.includes("towfik")) {
    return {
      initials: "MT",
      gradient: "from-cyan-600 to-blue-800 text-white",
      ring: "ring-cyan-500/40",
    };
  }
  return {
    initials: "YOU",
    gradient: "from-zinc-700 to-slate-900 text-zinc-200",
    ring: "ring-zinc-500/40",
  };
}

const CHANNELS = [
  { id: "eng-architecture", name: "eng-architecture", desc: "System design & v3 platform" },
  { id: "sales-pipeline", name: "sales-pipeline", desc: "Deals, enterprise security reviews" },
  { id: "product-roadmap", name: "product-roadmap", desc: "Q1 roadmap, features, priorities" },
];

const INITIAL_MESSAGES: Record<string, SlackMessage[]> = {
  "eng-architecture": [
    {
      id: "msg-1",
      sender: "Sm Ali (Mohammad Ali)",
      avatar: "SA",
      role: "Lead Full Stack & AI Architect",
      timestamp: "10:14 AM",
      content: "Hey @Maneesh Nand, are we still targeting March 15 for the v3 release? Need to know if we can start database schema migrations this week.",
    },
    {
      id: "msg-2",
      sender: "GhostWorker (Maneesh Nand)",
      avatar: "MN",
      role: "AI Digital Twin",
      timestamp: "10:14 AM",
      isBot: true,
      botFor: "Maneesh Nand (Offline / In Deep Focus)",
      content: "Hey Ali! Maneesh is currently offline, but here is his verified timeline from the RFC:\n\n• Target date remains March 15 with a phased rollout:\n  - Phase 1 (March 1): Core platform + SSO\n  - Phase 2 (March 15): Audit logs & advanced RBAC\n  - Phase 3 (April 1): Migration tooling\n\nSchema migrations should begin in Phase 1 once SSO is finalized (currently 80% complete and passing tests).",
      citations: [
        { source: "Notion", snippet: "v3 Platform Architecture RFC (Phase 1 Rollout)" },
        { source: "Slack", snippet: "#new-channel: Maneesh & Ali architecture sync" },
      ],
    },
  ],
  "sales-pipeline": [
    {
      id: "msg-3",
      sender: "Maneesh Nand",
      avatar: "MN",
      role: "Backend & Infrastructure Lead",
      timestamp: "11:20 AM",
      content: "Hey @Md Towfik Omer, what is the status of the enterprise frontend security review? Do we have SSO ready for them?",
    },
    {
      id: "msg-4",
      sender: "GhostWorker (Md Towfik Omer)",
      avatar: "MT",
      role: "AI Digital Twin",
      timestamp: "11:20 AM",
      isBot: true,
      botFor: "Md Towfik Omer (In Design Review)",
      content: "Hi Maneesh! Towfik is in design reviews right now. The frontend requires SSO and audit logging before our enterprise review begins on March 5.\n\nFrontend components for SAML support are finishing this week, and we're on track.",
      citations: [
        { source: "Playbook", snippet: "Frontend Design System: Enterprise Compliance Specs" },
      ],
    },
  ],
  "product-roadmap": [
    {
      id: "msg-5",
      sender: "Md Towfik Omer",
      avatar: "MT",
      role: "Frontend & Product Lead",
      timestamp: "9:05 AM",
      content: "What are our top 3 priorities for the GhostWorker AI launch?",
    },
    {
      id: "msg-6",
      sender: "GhostWorker (Sm Ali)",
      avatar: "SA",
      role: "AI Digital Twin",
      timestamp: "9:05 AM",
      isBot: true,
      botFor: "Sm Ali (In Architecture Review)",
      content: "Morning Towfik! Ali is in architecture review, but here are our top 3 deliverables:\n\n1. In-situ Slack & GitHub digital twins (zero friction)\n2. Real-time neural search grounding via Exa AI\n3. Executive CEO polling across engineering, product, and sales.",
      citations: [
        { source: "Roadmap", snippet: "Q1 GhostWorker Autonomous Agent Roadmap" },
      ],
    },
  ],
};

export function SlackSimulatorView() {
  const [activeChannel, setActiveChannel] = useState("eng-architecture");
  const [messages, setMessages] = useState<Record<string, SlackMessage[]>>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [presence, setPresence] = useState<Record<string, "away" | "active">>({
    maneesh: "away",
    towfik: "away",
    ali: "away",
  });
  const [autoMode, setAutoMode] = useState(false);
  const [statusReasons, setStatusReasons] = useState<Record<string, string>>({
    towfik: "Google Cal: In Product Design Sync",
    maneesh: "Slack Idle: >15m Inactive",
    ali: "Active in Slack & GitHub",
  });

  const togglePresence = (key: string) => {
    setPresence((prev) => ({
      ...prev,
      [key]: prev[key] === "active" ? "away" : "active",
    }));
  };

  // Auto-Presence Simulation: Realistic Calendar & Slack Heartbeat
  useEffect(() => {
    if (!autoMode) return;

    const interval = setInterval(() => {
      // Rotate presence dynamically based on simulated events
      setPresence((prev) => {
        const nextTowfik = prev.towfik === "active" ? "away" : "active";
        return {
          ...prev,
          towfik: nextTowfik,
        };
      });

      setStatusReasons((prev) => ({
        ...prev,
        towfik:
          prev.towfik.includes("Google Cal")
            ? "Slack: Active at desk"
            : "Google Cal: In Product Design Sync",
      }));
    }, 18000); // changes every 18 seconds in auto demo mode

    return () => clearInterval(interval);
  }, [autoMode]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentMessages = messages[activeChannel] || [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentMessages, isTyping]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = inputValue.trim();
    if (!text || isTyping) return;

    const userMsg: SlackMessage = {
      id: `user-${Date.now()}`,
      sender: "You (Teammate)",
      avatar: "YOU",
      role: "Teammate",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      content: text,
    };

    setMessages((prev) => ({
      ...prev,
      [activeChannel]: [...(prev[activeChannel] || []), userMsg],
    }));
    setInputValue("");
    setIsTyping(true);

    // Determine which clone to call based on channel or mention
    let cloneId = "e5c02685-c1e0-4660-84a1-77ea33a593e1";
    let targetName = "Maneesh Nand";
    let presenceKey = "maneesh";

    if (
      activeChannel === "sales-pipeline" ||
      text.toLowerCase().includes("towfik") ||
      text.toLowerCase().includes("sarah")
    ) {
      cloneId = "a8f7c9e2-3b1d-4e5f-9a8c-1d2e3f4a5b6c";
      targetName = "Md Towfik Omer";
      presenceKey = "towfik";
    } else if (
      activeChannel === "product-roadmap" ||
      text.toLowerCase().includes("ali") ||
      text.toLowerCase().includes("alex")
    ) {
      cloneId = "f1d2e3b4-5a6c-7d8e-9f0a-1b2c3d4e5f6a";
      targetName = "Sm Ali (Mohammad Ali)";
      presenceKey = "ali";
    }

    const targetInitials = targetName.includes("Maneesh") ? "MN" : targetName.includes("Towfik") ? "MT" : "SA";

    // IF TEAMMATE IS ACTIVE (ONLINE): GhostWorker stays quiet, human replies!
    if (presence[presenceKey] === "active") {
      await new Promise((r) => setTimeout(r, 600));
      const activeHumanMsg: SlackMessage = {
        id: `human-${Date.now()}`,
        sender: targetName,
        avatar: targetInitials,
        role: "Teammate (Active Online)",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        content: `Hey! I'm actively online at my desk right now. Got your ping, looking into it! (GhostWorker is on standby).`,
      };
      setMessages((prev) => ({
        ...prev,
        [activeChannel]: [...(prev[activeChannel] || []), activeHumanMsg],
      }));
      setIsTyping(false);
      return;
    }

    // OTHERWISE: TEAMMATE IS AWAY/IN MEETING -> GhostWorker AI steps in on their behalf!

    try {
      const res = await fetch("/api/edamame/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cloneId, question: text }),
      });

      if (!res.ok) throw new Error("API failed");

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let botText = "";
      let citations: { source: string; snippet: string }[] = [];

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");
          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            try {
              const data = JSON.parse(line.slice(6));
              if (data.type === "chunk") {
                botText += data.text;
              } else if (data.type === "citations") {
                citations = data.citations || [];
              }
            } catch {
              // skip malformed
            }
          }
        }
      }

      const botMsg: SlackMessage = {
        id: `bot-${Date.now()}`,
        sender: `GhostWorker (${targetName})`,
        avatar: targetInitials,
        role: "AI Digital Twin",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isBot: true,
        botFor: `${targetName} (Away / In Meeting)`,
        content: botText || `Hey! ${targetName} is away, but here's the verified workspace context: We're on track with our core deliverables.`,
        citations: citations.length > 0 ? citations : [
          { source: "Workspace", snippet: "Verified from internal Notion RFCs & Slack logs" },
        ],
      };

      setMessages((prev) => ({
        ...prev,
        [activeChannel]: [...(prev[activeChannel] || []), botMsg],
      }));
    } catch {
      // Fallback message
      const fallbackMsg: SlackMessage = {
        id: `bot-${Date.now()}`,
        sender: `GhostWorker (${targetName})`,
        avatar: targetInitials,
        role: "AI Digital Twin",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isBot: true,
        botFor: `${targetName} (Away)`,
        content: `Hey! ${targetName} is offline right now, but from our recent RFC logs, we're actively prioritizing this task for the current release cycle.`,
      };
      setMessages((prev) => ({
        ...prev,
        [activeChannel]: [...(prev[activeChannel] || []), fallbackMsg],
      }));
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex h-full w-full bg-[#1a1d21] text-[#d1d2d3]">
      {/* Slack Sidebar */}
      <div className="w-[260px] flex-shrink-0 border-r border-[#2b2d31] bg-[#19171d] p-3 flex flex-col">
        {/* Workspace header */}
        <div className="flex items-center justify-between border-b border-[#2b2d31] pb-3 mb-3 px-2">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-[#611f69] flex items-center justify-center text-white font-bold text-xs">
              GW
            </div>
            <span className="font-bold text-white text-sm">GhostWorker Org</span>
          </div>
          <ChevronDown size={16} className="text-[#9a9b9e]" />
        </div>

        {/* Ambient Bot Status banner */}
        <div className="mb-4 rounded-lg bg-[#222529] p-2.5 border border-[#383a40]">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#2eb67d]">
            <span className="h-2 w-2 rounded-full bg-[#2eb67d] animate-pulse" />
            GhostWorker Active
          </div>
          <p className="text-[11px] text-[#9a9b9e] mt-1 leading-snug">
            Monitoring 3 channels. Auto-answering for teammates who are away.
          </p>
        </div>

        {/* Channels */}
        <div className="flex-1 space-y-1">
          <p className="px-2 text-[11px] font-bold text-[#868686] uppercase tracking-wider mb-1">
            Channels
          </p>
          {CHANNELS.map((ch) => (
            <button
              key={ch.id}
              onClick={() => setActiveChannel(ch.id)}
              className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeChannel === ch.id
                  ? "bg-[#1164a3] text-white"
                  : "text-[#bcabbc] hover:bg-[#27242c] hover:text-white"
              }`}
            >
              <Hash size={15} />
              {ch.name}
            </button>
          ))}

          {/* Active Digital Twins & Presence Simulation */}
          <div className="mt-5 mb-1 px-2 flex items-center justify-between">
            <p className="text-[11px] font-bold text-[#868686] uppercase tracking-wider">
              Teammate Presence
            </p>
            <button
              type="button"
              onClick={() => setAutoMode(!autoMode)}
              className={`text-[9px] px-2 py-0.5 rounded border transition-colors flex items-center gap-1 font-semibold ${
                autoMode
                  ? "bg-[#2eb67d]/20 text-[#2eb67d] border-[#2eb67d]/50 shadow-sm"
                  : "text-[#36c5f0] bg-[#36c5f0]/10 border-[#36c5f0]/30 hover:bg-[#36c5f0]/20"
              }`}
            >
              {autoMode ? "⚡ Auto Sync: ON" : "🖐 Click to Toggle"}
            </button>
          </div>

          <p className="px-2 text-[10px] text-[#868686] mb-2 leading-tight">
            {autoMode 
              ? "⚡ Live Auto: Syncs with Calendar & Slack Idle webhooks" 
              : "Click any teammate below to test Online vs Away behavior:"}
          </p>
          
          <div className="space-y-2 px-2 text-xs">
            {/* Towfik */}
            <div 
              onClick={() => togglePresence("towfik")}
              className="flex items-center justify-between p-1.5 rounded bg-[#222529] hover:bg-[#2a2d33] cursor-pointer border border-[#383a40] transition-all group"
            >
              <div className="flex flex-col min-w-0 pr-1">
                <span className="text-white font-medium flex items-center gap-1.5 text-[11px]">
                  <Circle 
                    size={8} 
                    className={presence.towfik === "active" ? "fill-[#2eb67d] text-[#2eb67d]" : "fill-[#e01e5a] text-[#e01e5a]"} 
                  />
                  Md Towfik Omer
                  <span className="px-1 py-0.2 rounded bg-cyan-950/80 text-cyan-400 font-mono text-[9px] font-bold border border-cyan-800/50">MT</span>
                </span>
                <span className="text-[9px] text-[#868686] truncate">
                  {autoMode ? statusReasons.towfik : "Frontend & Product"}
                </span>
              </div>
              <span className={`text-[9px] px-1.5 py-0.5 rounded font-semibold flex-shrink-0 transition-colors ${
                presence.towfik === "active" 
                  ? "bg-[#2eb67d]/20 text-[#2eb67d] border border-[#2eb67d]/40" 
                  : "bg-[#e01e5a]/20 text-[#ff6b8b] border border-[#e01e5a]/40"
              }`}>
                {presence.towfik === "active" ? "🟢 Online" : "🔴 Away (Twin On)"}
              </span>
            </div>

            {/* Maneesh */}
            <div 
              onClick={() => togglePresence("maneesh")}
              className="flex items-center justify-between p-1.5 rounded bg-[#222529] hover:bg-[#2a2d33] cursor-pointer border border-[#383a40] transition-all group"
            >
              <div className="flex flex-col min-w-0 pr-1">
                <span className="text-white font-medium flex items-center gap-1.5 text-[11px]">
                  <Circle 
                    size={8} 
                    className={presence.maneesh === "active" ? "fill-[#2eb67d] text-[#2eb67d]" : "fill-[#e01e5a] text-[#e01e5a]"} 
                  />
                  Maneesh Nand
                  <span className="px-1 py-0.2 rounded bg-indigo-950/80 text-indigo-400 font-mono text-[9px] font-bold border border-indigo-800/50">MN</span>
                </span>
                <span className="text-[9px] text-[#868686] truncate">
                  {autoMode ? statusReasons.maneesh : "Backend & Infra"}
                </span>
              </div>
              <span className={`text-[9px] px-1.5 py-0.5 rounded font-semibold flex-shrink-0 transition-colors ${
                presence.maneesh === "active" 
                  ? "bg-[#2eb67d]/20 text-[#2eb67d] border border-[#2eb67d]/40" 
                  : "bg-[#e01e5a]/20 text-[#ff6b8b] border border-[#e01e5a]/40"
              }`}>
                {presence.maneesh === "active" ? "🟢 Online" : "🔴 Away (Twin On)"}
              </span>
            </div>

            {/* Sm Ali */}
            <div 
              onClick={() => togglePresence("ali")}
              className="flex items-center justify-between p-1.5 rounded bg-[#222529] hover:bg-[#2a2d33] cursor-pointer border border-[#383a40] transition-all group"
            >
              <div className="flex flex-col min-w-0 pr-1">
                <span className="text-white font-medium flex items-center gap-1.5 text-[11px]">
                  <Circle 
                    size={8} 
                    className={presence.ali === "active" ? "fill-[#2eb67d] text-[#2eb67d]" : "fill-[#e01e5a] text-[#e01e5a]"} 
                  />
                  Sm Ali
                  <span className="px-1 py-0.2 rounded bg-emerald-950/80 text-emerald-400 font-mono text-[9px] font-bold border border-emerald-800/50">SA</span>
                </span>
                <span className="text-[9px] text-[#868686] truncate">
                  {autoMode ? statusReasons.ali : "Lead AI Architect"}
                </span>
              </div>
              <span className={`text-[9px] px-1.5 py-0.5 rounded font-semibold flex-shrink-0 transition-colors ${
                presence.ali === "active" 
                  ? "bg-[#2eb67d]/20 text-[#2eb67d] border border-[#2eb67d]/40" 
                  : "bg-[#e01e5a]/20 text-[#ff6b8b] border border-[#e01e5a]/40"
              }`}>
                {presence.ali === "active" ? "🟢 Online" : "🔴 Away (Twin On)"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Slack Main Chat Area */}
      <div className="flex flex-1 flex-col h-full bg-[#1a1d21]">
        {/* Channel header */}
        <div className="flex items-center justify-between border-b border-[#2b2d31] px-5 py-3">
          <div className="flex items-center gap-2">
            <Hash size={18} className="text-[#ababad]" />
            <span className="font-bold text-white text-sm">{activeChannel}</span>
            <span className="text-xs text-[#868686] ml-2">
              {CHANNELS.find((c) => c.id === activeChannel)?.desc}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 text-xs bg-[#1a2e3b] px-2.5 py-1 rounded-full text-[#36c5f0] border border-[#2b5974]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#36c5f0] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#36c5f0]"></span>
              </span>
              Exa AI Neural Grounding
            </div>
            <div className="flex items-center gap-2 text-xs bg-[#222529] px-2.5 py-1 rounded-full text-[#c4b5a0] border border-[#383a40]">
              <Sparkles size={12} />
              OpenAI gpt-4o-mini
            </div>
          </div>
        </div>

        {/* Message list */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {currentMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 p-2 rounded-lg transition-colors ${
                msg.isBot ? "bg-[#222529]/70 border border-[#383a40]" : "hover:bg-[#222529]/40"
              }`}
            >
              {(() => {
                const av = getTeammateAvatarInfo(msg.sender, msg.botFor);
                return (
                  <div
                    className={`relative flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md bg-gradient-to-br ${av.gradient} text-xs font-bold tracking-wider shadow-sm ring-1 ${av.ring}`}
                  >
                    {av.initials}
                    {msg.isBot && (
                      <span
                        className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#611f69] ring-2 ring-[#1a1d21]"
                        title="GhostWorker AI Digital Twin"
                      >
                        <Bot size={8} className="text-white" />
                      </span>
                    )}
                  </div>
                );
              })()}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className="font-bold text-white text-xs">{msg.sender}</span>
                  {msg.isBot && (
                    <span className="rounded bg-[#611f69] px-1.5 py-0.2 text-[9px] font-bold text-white uppercase tracking-wider">
                      APP
                    </span>
                  )}
                  {msg.botFor && (
                    <span className="text-[10px] text-[#ecb22e] font-medium">
                      • On behalf of {msg.botFor}
                    </span>
                  )}
                  <span className="text-[10px] text-[#868686]">{msg.timestamp}</span>
                </div>
                <p className="text-[13px] text-[#d1d2d3] mt-1 whitespace-pre-wrap leading-relaxed">
                  {msg.content}
                </p>

                {/* Citations Box */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="mt-2.5 rounded-md border border-[#3f4148] bg-[#19171d] p-2 text-xs space-y-1">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[#9a9b9e] flex items-center gap-1">
                      <CheckCircle size={10} className="text-[#2eb67d]" /> Verified Grounded Citations:
                    </span>
                    {msg.citations.map((cit, idx) =>
                      cit.url ? (
                        <a
                          key={idx}
                          href={cit.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-[11px] text-[#36c5f0] hover:underline cursor-pointer group"
                        >
                          <ExternalLink size={10} className="group-hover:translate-x-0.5 transition-transform" />
                          <span className="font-semibold text-[#36c5f0]">{cit.source}:</span>
                          <span className="text-[#a0c8e0] underline truncate">{cit.snippet}</span>
                        </a>
                      ) : (
                        <div key={idx} className="flex items-center gap-1.5 text-[11px] text-[#4a9eff]">
                          <ExternalLink size={10} />
                          <span className="font-semibold text-[#c4b5a0]">{cit.source}:</span>
                          <span className="text-[#bcabbc] truncate">{cit.snippet}</span>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-[#9a9b9e] italic pl-2">
              <Sparkles size={13} className="animate-spin text-[#c4b5a0]" />
              GhostWorker is reading internal RFCs & drafting response in Slack…
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input box */}
        <div className="p-4 border-t border-[#2b2d31]">
          {/* Quick Test Chips */}
          <div className="mb-2 flex items-center gap-2 flex-wrap">
            <span className="text-[10px] text-[#868686] font-medium">Quick Test Prompts:</span>
            <button
              type="button"
              onClick={() => setInputValue("@Md Towfik Omer what is our frontend status and design progress?")}
              className="text-[10px] bg-[#222529] hover:bg-[#2e3238] text-[#36c5f0] border border-[#383a40] px-2 py-1 rounded transition-colors"
            >
              Ask @Towfik (Frontend)
            </button>
            <button
              type="button"
              onClick={() => setInputValue("@Maneesh Nand did Jira ticket PROJ-104 pass, and what did our latest GitHub commit change?")}
              className="text-[10px] bg-[#222529] hover:bg-[#2e3238] text-[#ecb22e] border border-[#383a40] px-2 py-1 rounded transition-colors"
            >
              Ask @Maneesh (Jira PROJ-104 & GitHub)
            </button>
            <button
              type="button"
              onClick={() => setInputValue("@Sm Ali what are our top 3 deliverables for the GhostWorker AI hackathon launch?")}
              className="text-[10px] bg-[#222529] hover:bg-[#2e3238] text-[#2eb67d] border border-[#383a40] px-2 py-1 rounded transition-colors"
            >
              Ask @Ali (Architect)
            </button>
          </div>

          <form
            onSubmit={handleSendMessage}
            className="rounded-lg border border-[#42444a] bg-[#222529] p-2 focus-within:border-[#7c7e86] transition-colors"
          >
            <textarea
              rows={2}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
              placeholder={`Message #${activeChannel} (e.g. Ask @Towfik about frontend or @Maneesh about backend)...`}
              className="w-full bg-transparent text-xs text-white placeholder-[#868686] outline-none resize-none"
            />
            <div className="flex items-center justify-between border-t border-[#383a40] pt-2 mt-1">
              <div className="flex items-center gap-2 text-[#9a9b9e]">
                <Paperclip size={14} className="cursor-pointer hover:text-white" />
                <Smile size={14} className="cursor-pointer hover:text-white" />
                <AtSign size={14} className="cursor-pointer hover:text-white" />
              </div>
              <button
                type="submit"
                disabled={!inputValue.trim() || isTyping}
                className="flex items-center gap-1 rounded bg-[#007a5a] px-3 py-1 text-xs font-semibold text-white transition-colors hover:bg-[#148567] disabled:opacity-40"
              >
                <Send size={12} />
                Send to Slack
              </button>
            </div>
          </form>
          <p className="text-[10px] text-[#868686] mt-1.5 text-center">
            💡 Demonstrates <b>Agents Everywhere</b>: The agent lives in company chat threads and answers on behalf of absent colleagues.
          </p>
        </div>
      </div>
    </div>
  );
}
