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
  citations?: { source: string; snippet: string }[];
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
      sender: "David Kim",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
      role: "Senior Backend Eng",
      timestamp: "10:14 AM",
      content: "Hey @Jason Park, are we still targeting March 15 for the v3 release? Need to know if we can start database schema migrations this week.",
    },
    {
      id: "msg-2",
      sender: "GhostWorker (Jason Park)",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
      role: "AI Digital Twin",
      timestamp: "10:14 AM",
      isBot: true,
      botFor: "Jason Park (Offline / In Planning)",
      content: "Hey David! Jason is currently offline, but here is his verified timeline from the RFC:\n\n• Target date remains March 15 with a phased rollout:\n  - Phase 1 (March 1): Core platform + SSO\n  - Phase 2 (March 15): Audit logs & advanced RBAC\n  - Phase 3 (April 1): Migration tooling\n\nSchema migrations should begin in Phase 1 once SSO is finalized (currently 80% complete and passing tests).",
      citations: [
        { source: "Notion", snippet: "v3 Platform Architecture RFC (Phase 1 Rollout)" },
        { source: "Slack", snippet: "#eng-platform commit log: SSO test suite passing" },
      ],
    },
  ],
  "sales-pipeline": [
    {
      id: "msg-3",
      sender: "Marcus Vance",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
      role: "Account Executive",
      timestamp: "11:20 AM",
      content: "Hey @Sarah Chen, what is the status of the TechFlow $3.2M security review? Do we have SSO ready for them?",
    },
    {
      id: "msg-4",
      sender: "GhostWorker (Sarah Chen)",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
      role: "AI Digital Twin",
      timestamp: "11:20 AM",
      isBot: true,
      botFor: "Sarah Chen (In Executive Review)",
      content: "Hi Marcus! Sarah is in customer reviews right now. TechFlow requires SSO and audit logging before their security review begins on March 5.\n\nEngineering is finishing SAML support this week, and we're on track. CTO Maria Santos is our primary decision maker.",
      citations: [
        { source: "Playbook", snippet: "Q1 Sales Playbook: TechFlow $3.2M ARR compliance specs" },
      ],
    },
  ],
  "product-roadmap": [
    {
      id: "msg-5",
      sender: "Rachel Green",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80",
      role: "Product Ops",
      timestamp: "9:05 AM",
      content: "What are our top 3 enterprise priorities for Q1?",
    },
    {
      id: "msg-6",
      sender: "GhostWorker (Alex Morgan)",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80",
      role: "AI Digital Twin",
      timestamp: "9:05 AM",
      isBot: true,
      botFor: "Alex Morgan (VP Product)",
      content: "Alex's Q1 roadmap priorities:\n\n1. Enterprise Security (SSO + Audit logs to unlock the $8.7M pipeline)\n2. Platform Reliability (99.95% uptime SLA)\n3. Developer Experience (API docs & webhook management)",
      citations: [
        { source: "Roadmap", snippet: "Q1 Product Roadmap: Enterprise Tier Requirements" },
      ],
    },
  ],
};

export function SlackSimulatorView() {
  const [activeChannel, setActiveChannel] = useState("eng-architecture");
  const [messages, setMessages] = useState<Record<string, SlackMessage[]>>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
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
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80",
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
    let cloneId = "clone_jason";
    let targetName = "Jason Park";
    if (activeChannel === "sales-pipeline" || text.toLowerCase().includes("sarah")) {
      cloneId = "clone_sarah";
      targetName = "Sarah Chen";
    } else if (activeChannel === "product-roadmap" || text.toLowerCase().includes("alex")) {
      cloneId = "clone_self";
      targetName = "Alex Morgan";
    }

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
        avatar: targetName.includes("Jason")
          ? "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
          : targetName.includes("Sarah")
          ? "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80"
          : "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80",
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
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
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

          {/* Active Digital Twins */}
          <p className="px-2 text-[11px] font-bold text-[#868686] uppercase tracking-wider mt-5 mb-2">
            Digital Twins Online (3)
          </p>
          <div className="space-y-1.5 px-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-white flex items-center gap-1.5">
                <Circle size={8} className="fill-[#2eb67d] text-[#2eb67d]" />
                Jason's Twin
              </span>
              <span className="text-[10px] text-[#e01e5a]">Jason Away</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white flex items-center gap-1.5">
                <Circle size={8} className="fill-[#2eb67d] text-[#2eb67d]" />
                Sarah's Twin
              </span>
              <span className="text-[10px] text-[#ecb22e]">In Meeting</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white flex items-center gap-1.5">
                <Circle size={8} className="fill-[#2eb67d] text-[#2eb67d]" />
                Alex's Twin
              </span>
              <span className="text-[10px] text-[#9a9b9e]">Focus Time</span>
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
          <div className="flex items-center gap-2 text-xs bg-[#222529] px-2.5 py-1 rounded-full text-[#c4b5a0] border border-[#383a40]">
            <Sparkles size={12} />
            Theme: Agent in the Workplace
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
              <img
                src={msg.avatar}
                alt={msg.sender}
                className="h-9 w-9 rounded-md object-cover flex-shrink-0"
              />
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
                      <CheckCircle size={10} className="text-[#2eb67d]" /> Verified Citations:
                    </span>
                    {msg.citations.map((cit, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-[11px] text-[#4a9eff]">
                        <ExternalLink size={10} />
                        <span className="font-semibold text-[#c4b5a0]">{cit.source}:</span>
                        <span className="text-[#bcabbc] truncate">{cit.snippet}</span>
                      </div>
                    ))}
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
              placeholder={`Message #${activeChannel} (e.g. Ask @Jason about v3 architecture or @Sarah about deals)...`}
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
