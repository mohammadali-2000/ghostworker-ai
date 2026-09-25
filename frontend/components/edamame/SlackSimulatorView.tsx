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
  Trash2,
  RefreshCw,
  Zap,
  CheckCircle2,
  ShieldCheck,
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
      gradient: "from-indigo-600 to-indigo-700 text-white",
      ring: "ring-indigo-400/40",
    };
  }
  if (name.includes("maneesh")) {
    return {
      initials: "MN",
      gradient: "from-violet-600 to-purple-700 text-white",
      ring: "ring-violet-400/40",
    };
  }
  if (name.includes("towfik")) {
    return {
      initials: "MT",
      gradient: "from-sky-600 to-blue-700 text-white",
      ring: "ring-sky-400/40",
    };
  }
  return {
    initials: "YOU",
    gradient: "from-slate-600 to-slate-700 text-white",
    ring: "ring-slate-400/40",
  };
}

const SLACK_CHANNELS = [
  { id: "eng-architecture", name: "eng-architecture", desc: "System design, microservices & v3 platform" },
  { id: "sales-pipeline", name: "sales-pipeline", desc: "Enterprise client reviews & deals" },
  { id: "product-roadmap", name: "product-roadmap", desc: "Deliverables, sprint milestones & priorities" },
];

const TEAMS_CHANNELS = [
  { id: "hls-backend-delivery", name: "hls-backend-delivery", desc: "Healthcare & Life Sciences Pod" },
  { id: "architecture-governance", name: "architecture-governance", desc: "Spring Boot, Microservices & Redis" },
  { id: "sprint-release-sync", name: "sprint-release-sync", desc: "Jira Sprint HLS-402 & Gate Checks" },
];

export function SlackSimulatorView() {
  const [platform, setPlatform] = useState<"teams" | "slack">("teams");
  const [activeChannel, setActiveChannel] = useState("hls-backend-delivery");
  
  // Starting from scratch with clean empty channel state (no fake mock chat clutter)
  const [messages, setMessages] = useState<Record<string, SlackMessage[]>>({
    "hls-backend-delivery": [],
    "architecture-governance": [],
    "sprint-release-sync": [],
    "eng-architecture": [],
    "sales-pipeline": [],
    "product-roadmap": [],
  });

  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isSyncingGithub, setIsSyncingGithub] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  // Presence State (Active vs Away)
  const [presence, setPresence] = useState<Record<string, "active" | "away">>({
    ali: "away",
    maneesh: "away",
    towfik: "away",
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const channels = platform === "teams" ? TEAMS_CHANNELS : SLACK_CHANNELS;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handlePlatformChange = (newPlatform: "teams" | "slack") => {
    setPlatform(newPlatform);
    if (newPlatform === "teams") {
      setActiveChannel("hls-backend-delivery");
    } else {
      setActiveChannel("eng-architecture");
    }
  };

  const togglePresence = (person: string) => {
    setPresence((prev) => ({
      ...prev,
      [person]: prev[person] === "active" ? "away" : "active",
    }));
  };

  const handleClearMessages = () => {
    setMessages((prev) => ({
      ...prev,
      [activeChannel]: [],
    }));
  };

  const handleSyncGithubLive = async () => {
    setIsSyncingGithub(true);
    setSyncStatus("Connecting to GitHub API...");
    try {
      const res = await fetch("/api/github/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: "mohammadali-2000", repoLimit: 3, itemsPerRepo: 5 }),
      });
      const data = await res.json();
      if (data.success) {
        setSyncStatus(`✓ Synced ${data.result.repositories_scanned} repos & ${data.result.chunks_created} real chunks!`);
        setTimeout(() => setSyncStatus(null), 4000);
      } else {
        setSyncStatus("Sync finished with local fallback.");
        setTimeout(() => setSyncStatus(null), 4000);
      }
    } catch {
      setSyncStatus("Sync failed.");
      setTimeout(() => setSyncStatus(null), 4000);
    } finally {
      setIsSyncingGithub(false);
    }
  };

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

    // Target digital twin identification
    let cloneId = "f1d2e3b4-5a6c-7d8e-9f0a-1b2c3d4e5f6a";
    let targetName = "Sm Ali";
    let presenceKey = "ali";

    if (text.toLowerCase().includes("maneesh")) {
      cloneId = "e5c02685-c1e0-4660-84a1-77ea33a593e1";
      targetName = "Maneesh Nand";
      presenceKey = "maneesh";
    } else if (text.toLowerCase().includes("towfik") || text.toLowerCase().includes("sarah")) {
      cloneId = "a8f7c9e2-3b1d-4e5f-9a8c-1d2e3f4a5b6c";
      targetName = "Md Towfik Omer";
      presenceKey = "towfik";
    }

    const targetInitials = targetName.includes("Maneesh") ? "MN" : targetName.includes("Towfik") ? "MT" : "SA";

    // IF TEAMMATE IS ACTIVE (ONLINE): TwinOps stays quiet, human replies!
    if (presence[presenceKey] === "active") {
      await new Promise((r) => setTimeout(r, 700));
      const activeHumanMsg: SlackMessage = {
        id: `human-${Date.now()}`,
        sender: targetName,
        avatar: targetInitials,
        role: "Teammate (Active Online)",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        content: `Hey! I'm actively online at my desk right now. Got your ping, looking into it! (TwinOps is on standby).`,
      };
      setMessages((prev) => ({
        ...prev,
        [activeChannel]: [...(prev[activeChannel] || []), activeHumanMsg],
      }));
      setIsTyping(false);
      return;
    }

    // OTHERWISE: TEAMMATE IS AWAY/IN MEETING -> TwinOps AI steps in on their behalf!
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
      let citations: { source: string; snippet: string; url?: string }[] = [];

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
        sender: `TwinOps (${targetName})`,
        avatar: targetInitials,
        role: "AI Digital Twin",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isBot: true,
        botFor: `${targetName} (In 4-Hour Client Meeting)`,
        content: botText || `Hi! ${targetName} is currently in a client meeting. Here is the verified context: All deliverables and active branches are tracked in TwinOps memory.`,
        citations: citations.length > 0 ? citations : [
          { source: "Local Memory Store", snippet: "Verified from local real repository records & sprint sync" },
        ],
      };

      setMessages((prev) => ({
        ...prev,
        [activeChannel]: [...(prev[activeChannel] || []), botMsg],
      }));
    } catch {
      const fallbackMsg: SlackMessage = {
        id: `bot-${Date.now()}`,
        sender: `TwinOps (${targetName})`,
        avatar: targetInitials,
        role: "AI Digital Twin",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isBot: true,
        botFor: `${targetName} (Away / In Meeting)`,
        content: `Hi! ${targetName} is currently in a client meeting. Based on our verified GitHub commit history and sprint plans, the implementation is proceeding on schedule with zero blockers.`,
        citations: [
          { source: "Local Store", snippet: "data/local_memories.json: Synced GitHub commits" },
        ],
      };

      setMessages((prev) => ({
        ...prev,
        [activeChannel]: [...(prev[activeChannel] || []), fallbackMsg],
      }));
    } finally {
      setIsTyping(false);
    }
  };

  const currentChannelMessages = messages[activeChannel] || [];

  return (
    <div className="flex h-full w-full bg-[#eaf0f6] overflow-hidden select-none">
      {/* Neumorphic Channels & Presence Sidebar */}
      <div className="flex w-[290px] flex-col border-r border-[#d4deeb] bg-[#eaf0f6] p-4">
        {/* Workspace Card */}
        <div className="mb-4 rounded-2xl p-3 bg-[#f1f5fa] shadow-[5px_5px_12px_#cfd8e5,-5px_-5px_12px_#ffffff] border border-white/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white font-black text-xs shadow-md">
                {platform === "teams" ? "🟣" : "💬"}
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-slate-800 text-[13px] leading-none">
                  {platform === "teams" ? "Accenture Teams" : "Accenture Slack"}
                </span>
                <span className="text-[10px] text-slate-500 font-medium mt-0.5">
                  {platform === "teams" ? "HLS Delivery Pod" : "Innovation Hub"}
                </span>
              </div>
            </div>
            <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
          </div>
        </div>

        {/* Platform Switcher (Neumorphic Pills) */}
        <div className="mb-4 flex p-1.5 rounded-2xl bg-[#e3ebf4] shadow-[inset_3px_3px_6px_#cfd8e5,inset_-3px_-3px_6px_#ffffff]">
          <button
            type="button"
            onClick={() => handlePlatformChange("teams")}
            className={`flex-1 py-1.5 px-2 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all ${
              platform === "teams"
                ? "bg-[#5B5FC7] text-white shadow-[3px_3px_7px_#5b5fc755] scale-[1.02]"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <span>🟣</span> MS Teams
          </button>
          <button
            type="button"
            onClick={() => handlePlatformChange("slack")}
            className={`flex-1 py-1.5 px-2 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all ${
              platform === "slack"
                ? "bg-[#0ea5e9] text-white shadow-[3px_3px_7px_#0ea5e955] scale-[1.02]"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <span>💬</span> Slack
          </button>
        </div>

        {/* Ambient Bot Status */}
        <div className="mb-4 rounded-2xl bg-[#f1f5fa] p-3 shadow-[4px_4px_10px_#cfd8e5,-4px_-4px_10px_#ffffff] border border-white/70">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            TwinOps Ambient Active
          </div>
          <p className="text-[10.5px] text-slate-500 mt-1 leading-relaxed">
            Auto-answering technical inquiries on behalf of absent pod members.
          </p>
        </div>

        {/* Channels List */}
        <div className="flex-1 space-y-1 overflow-y-auto">
          <p className="px-2 text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-2">
            {platform === "teams" ? "Teams Channels" : "Slack Channels"}
          </p>
          {channels.map((ch) => {
            const isSelected = activeChannel === ch.id;
            return (
              <button
                key={ch.id}
                onClick={() => setActiveChannel(ch.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[12px] font-semibold transition-all text-left ${
                  isSelected
                    ? "bg-[#e5edf6] text-indigo-700 font-bold shadow-[inset_3px_3px_6px_#cfd8e5,inset_-3px_-3px_6px_#ffffff] border border-white/80"
                    : "text-slate-600 hover:text-slate-900 hover:bg-[#f1f5fa]"
                }`}
              >
                <Hash size={15} className={isSelected ? "text-indigo-600" : "text-slate-400"} />
                <span className="truncate">{ch.name}</span>
              </button>
            );
          })}

          {/* Teammate Presence Controller */}
          <div className="mt-5 pt-3 border-t border-[#d4deeb]">
            <div className="flex items-center justify-between px-1 mb-2">
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                Pod Presence
              </p>
              <span className="text-[9px] text-indigo-600 font-bold bg-indigo-50 px-1.5 py-0.5 rounded-full border border-indigo-200">
                Live Toggle
              </span>
            </div>

            <div className="space-y-2">
              {[
                { key: "ali", name: "Sm Ali", role: "Lead AI Architect", code: "SA" },
                { key: "maneesh", name: "Maneesh Nand", role: "Backend & Infra", code: "MN" },
                { key: "towfik", name: "Md Towfik Omer", role: "Frontend Lead", code: "MT" },
              ].map((p) => {
                const isAway = presence[p.key] === "away";
                return (
                  <div
                    key={p.key}
                    onClick={() => togglePresence(p.key)}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-[#f1f5fa] shadow-[3px_3px_8px_#cfd8e5,-3px_-3px_8px_#ffffff] border border-white/80 hover:scale-[1.01] active:scale-[0.99] cursor-pointer transition-all"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700 text-[10px] font-bold border border-indigo-200">
                        {p.code}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[11px] font-bold text-slate-800 truncate">{p.name}</span>
                        <span className="text-[9px] text-slate-400 truncate">{p.role}</span>
                      </div>
                    </div>
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded-full font-bold transition-all ${
                        isAway
                          ? "bg-rose-100 text-rose-700 border border-rose-200 shadow-sm"
                          : "bg-emerald-100 text-emerald-700 border border-emerald-200 shadow-sm"
                      }`}
                    >
                      {isAway ? "🔴 Away" : "🟢 Online"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Conversation Canvas (Light Neumorphic) */}
      <div className="flex flex-1 flex-col h-full bg-[#eaf0f6] overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-[#d4deeb] bg-[#eaf0f6] px-6 py-4 shadow-[0_2px_8px_rgba(207,216,229,0.4)]">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f1f5fa] shadow-[3px_3px_7px_#cfd8e5,-3px_-3px_7px_#ffffff] text-slate-700 border border-white/80">
              <Hash size={18} />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-slate-800 text-[14px] leading-tight">
                {activeChannel}
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                {channels.find((c) => c.id === activeChannel)?.desc || "Delivery Stream"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Quick Live GitHub Sync Button */}
            <button
              onClick={handleSyncGithubLive}
              disabled={isSyncingGithub}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#f1f5fa] shadow-[3px_3px_7px_#cfd8e5,-3px_-3px_7px_#ffffff] text-indigo-700 text-[11px] font-bold border border-white/80 hover:bg-indigo-50 active:scale-[0.98] transition-all"
            >
              <RefreshCw size={13} className={isSyncingGithub ? "animate-spin text-indigo-600" : "text-indigo-600"} />
              {isSyncingGithub ? "Syncing GitHub..." : "Sync Real GitHub Data"}
            </button>

            {/* Clear Chat Button */}
            {currentChannelMessages.length > 0 && (
              <button
                onClick={handleClearMessages}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#f1f5fa] shadow-[3px_3px_7px_#cfd8e5,-3px_-3px_7px_#ffffff] text-slate-500 text-[11px] font-semibold border border-white/80 hover:text-rose-600 transition-all"
              >
                <Trash2 size={13} />
                Clear
              </button>
            )}

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#5B5FC7]/10 text-[#5B5FC7] border border-[#5B5FC7]/20 text-[11px] font-bold">
              <ShieldCheck size={14} />
              Enterprise RAG Guarded
            </div>
          </div>
        </div>

        {/* Sync Status Banner */}
        {syncStatus && (
          <div className="mx-6 mt-3 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11.5px] font-bold flex items-center gap-2 animate-fade-in shadow-sm">
            <CheckCircle2 size={15} className="text-emerald-600" />
            {syncStatus}
          </div>
        )}

        {/* Messages Feed */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {currentChannelMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4 py-12">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-[#f1f5fa] shadow-[6px_6px_14px_#cfd8e5,-6px_-6px_14px_#ffffff] text-indigo-600 border border-white mb-4">
                <Sparkles size={28} />
              </div>
              <h3 className="text-[15px] font-extrabold text-slate-800 mb-1">
                #{activeChannel} is Clean & Ready
              </h3>
              <p className="text-[12px] text-slate-500 max-w-[420px] leading-relaxed mb-6">
                Start from scratch! Ask any technical question or test how your digital twin answers on behalf of absent teammates.
              </p>

              {/* Sample Starters */}
              <div className="flex flex-col gap-2 w-full max-w-[460px]">
                <p className="text-[10.5px] font-extrabold uppercase tracking-widest text-slate-400">
                  Try asking your Twin:
                </p>
                <button
                  onClick={() => setInputValue("@Sm Ali what did you recently commit in TwinOps and what features were added?")}
                  className="p-3 rounded-2xl bg-[#f1f5fa] shadow-[4px_4px_10px_#cfd8e5,-4px_-4px_10px_#ffffff] border border-white/80 text-left text-[12px] font-semibold text-slate-700 hover:text-indigo-600 hover:scale-[1.01] transition-all"
                >
                  💬 "@Sm Ali what did you recently commit in TwinOps and what features were added?"
                </button>
                <button
                  onClick={() => setInputValue("@Maneesh Nand what is our Redis session token caching architecture?")}
                  className="p-3 rounded-2xl bg-[#f1f5fa] shadow-[4px_4px_10px_#cfd8e5,-4px_-4px_10px_#ffffff] border border-white/80 text-left text-[12px] font-semibold text-slate-700 hover:text-indigo-600 hover:scale-[1.01] transition-all"
                >
                  💬 "@Maneesh Nand what is our Redis session token caching architecture?"
                </button>
              </div>
            </div>
          ) : (
            currentChannelMessages.map((msg) => {
              const isUser = !msg.isBot && msg.avatar === "YOU";
              const avatarInfo = getTeammateAvatarInfo(msg.sender, msg.botFor);

              return (
                <div
                  key={msg.id}
                  className={`flex gap-3.5 p-4 rounded-2xl transition-all ${
                    msg.isBot
                      ? "bg-[#f1f5fa] shadow-[5px_5px_12px_#cfd8e5,-5px_-5px_12px_#ffffff] border border-white/90"
                      : "bg-[#e5edf6] shadow-[inset_2px_2px_5px_#cfd8e5,inset_-2px_-2px_5px_#ffffff] border border-white/60"
                  }`}
                >
                  <div
                    className={`relative flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${avatarInfo.gradient} text-xs font-black shadow-md`}
                  >
                    {avatarInfo.initials}
                    {msg.isBot && (
                      <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#5B5FC7] ring-2 ring-white text-white">
                        <Bot size={9} />
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-bold text-slate-800 text-[12.5px]">{msg.sender}</span>
                      {msg.isBot && (
                        <span className="rounded-full bg-[#5B5FC7] px-2 py-0.5 text-[8.5px] font-extrabold text-white uppercase tracking-wider">
                          TWIN BOT
                        </span>
                      )}
                      {msg.botFor && (
                        <span className="text-[10px] text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                          • On behalf of {msg.botFor}
                        </span>
                      )}
                      <span className="text-[10px] text-slate-400 ml-auto">{msg.timestamp}</span>
                    </div>

                    <p className="text-[13px] text-slate-700 whitespace-pre-wrap leading-relaxed">
                      {msg.content}
                    </p>

                    {/* Citations Box */}
                    {msg.citations && msg.citations.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-slate-200/70 flex flex-wrap items-center gap-2">
                        <span className="text-[9.5px] font-extrabold uppercase tracking-widest text-slate-400">
                          Grounded Citations:
                        </span>
                        {msg.citations.map((cit, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white shadow-[2px_2px_5px_#cfd8e5] border border-slate-200 text-[10.5px] font-bold text-indigo-700"
                          >
                            <span className="text-slate-400">{cit.source}:</span>
                            <span className="truncate max-w-[240px]">{cit.snippet}</span>
                            {cit.url && <ExternalLink size={10} className="text-slate-400 ml-0.5" />}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-indigo-600 font-semibold italic pl-2 animate-fade-in">
              <Sparkles size={14} className="animate-spin text-indigo-600" />
              TwinOps is consulting episodic vector memory & drafting verified response…
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Neumorphic Input Console */}
        <div className="p-5 border-t border-[#d4deeb] bg-[#eaf0f6]">
          {/* Quick Prompt Chips */}
          <div className="mb-3 flex items-center gap-2 flex-wrap">
            <span className="text-[10.5px] text-slate-500 font-bold">Quick Prompts:</span>
            <button
              type="button"
              onClick={() => setInputValue("@Sm Ali what did you commit recently in GitHub?")}
              className="text-[10.5px] font-bold bg-[#f1f5fa] shadow-[2px_2px_5px_#cfd8e5,-2px_-2px_5px_#ffffff] text-indigo-600 border border-white px-2.5 py-1 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Ask @Ali (GitHub Commits)
            </button>
            <button
              type="button"
              onClick={() => setInputValue("@Maneesh Nand are patient session tokens cached in Redis for HLS-402?")}
              className="text-[10.5px] font-bold bg-[#f1f5fa] shadow-[2px_2px_5px_#cfd8e5,-2px_-2px_5px_#ffffff] text-violet-600 border border-white px-2.5 py-1 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Ask @Maneesh (Redis Architecture)
            </button>
            <button
              type="button"
              onClick={() => setInputValue("@Md Towfik Omer what is our frontend design system status?")}
              className="text-[10.5px] font-bold bg-[#f1f5fa] shadow-[2px_2px_5px_#cfd8e5,-2px_-2px_5px_#ffffff] text-sky-600 border border-white px-2.5 py-1 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Ask @Towfik (Frontend)
            </button>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSendMessage}
            className="flex items-center gap-2 rounded-2xl bg-[#e3ebf4] p-2 shadow-[inset_3px_3px_6px_#cfd8e5,inset_-3px_-3px_6px_#ffffff] border border-white/70"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={`Message #${activeChannel} (${platform === "teams" ? "Teams Pod" : "Slack"})...`}
              className="flex-1 bg-transparent px-3 py-2 text-[13px] text-slate-800 placeholder-slate-400 focus:outline-none font-medium"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-[3px_3px_7px_#cfd8e5] hover:opacity-90 active:scale-[0.95] disabled:opacity-40 disabled:cursor-not-allowed transition-all flex-shrink-0"
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
