# 👻 GhostWorker AI

> **Autonomous Workplace Digital Twins Living in Slack, GitHub & Team Memory.**  
> *Built for the **AI Tinkerers & OpenAI Hackathon: "Agents Everywhere"**.*

🔗 **Live Production URL:** [https://eight-margin-supplier-delicious.trycloudflare.com](https://eight-margin-supplier-delicious.trycloudflare.com)  
🔗 **Vercel Deployment:** [https://ghostworker-ai.vercel.app](https://ghostworker-ai.vercel.app)  
🐙 **GitHub Repository:** [https://github.com/mohammadali-2000/ghostworker-ai](https://github.com/mohammadali-2000/ghostworker-ai)

### 👥 Team GhostWorker
- **Sm Ali (Mohammad Ali)** — Lead Full Stack & AI Architect
- **Maneesh Nand** — Backend & Infrastructure Lead
- **Md Towfik Omer** — Frontend & Product Lead

---

## 🎯 The Core Concept: "Leaving the Chatbox"

Most workplace AI tools make a fundamental mistake: **they trap the agent inside an external chatbox**. To get help, you have to leave your work, open a new browser tab, and spend 10 minutes typing context into a blank prompt.

**GhostWorker flips this paradigm.** 

Instead of forcing users to visit an AI, **the AI lives where the work is already happening**:
- Inside your **Slack channels** (`#eng-architecture`, `#sales-pipeline`, `#product-roadmap`)
- Inside your **GitHub PR discussions** and RFCs
- Inside your **Workspace Documentation** and meeting decisions

When key engineers, PMs, or sales leads are asleep, in back-to-back meetings, or on vacation, **their GhostWorker digital twin monitors team threads ambiently and answers technical questions on their behalf—backed by verified citations from real internal code and docs.**

---

## ⚡ Key Capabilities

### 1. 💬 In-Situ Slack Channel Interception
- Teammates ask natural questions in team channels (e.g., *"@Jason Park when does our auth token expire in v3?"*).
- If the engineer is away, their **GhostWorker Twin** steps in seamlessly:
  - Ingests the thread context
  - Searches internal RFCs, PR diffs, and Slack discussions
  - Posts a verified answer on their behalf with clickable citations back to the exact document.

### 2. 🧠 Continual Episodic Learning
- GhostWorker does not require rigid manual retraining.
- As teammates chat and resolve issues, the agent automatically extracts facts, calculates confidence scores, and reinforces memory.

### 3. 👔 CEO Multi-Clone Strategic Polling
- Executives don't have to schedule 4 different status meetings to understand sprint health.
- A CEO can ask a single high-level question (e.g., *"Are we on track for our enterprise v3 release?"*).
- GhostWorker polls the **Engineering Lead twin, Sales VP twin, and Product VP twin** simultaneously, aggregating agreement levels, risk areas, and cross-team themes.

### 4. 🌐 Real-Time Neural Grounding via Exa AI ($1,000 Bounty Track)
- GhostWorker blends internal company memory with live web intelligence via **Exa AI's Neural Search API**.
- When teammates ask about external dependencies, latest framework releases (e.g. Next.js 16), or competitor benchmarks, the agent livecrawls and highlights verified web sources with clickable URLs.

### 5. 🎙️ Natural Voice Interaction
- Conversational audio powered by OpenAI Whisper (STT) and OpenAI TTS.

---

## 🏗️ Architecture & Data Flow

```
┌────────────────────────────────────────────────────────────────────────┐
│                        WHERE WORK ALREADY HAPPENS                      │
│                                                                        │
│   💬 Slack Channels    │   🐙 GitHub Commits/PRs   │   📋 Notion RFCs  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ (Ambient Thread Ingestion)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                      GHOSTWORKER MEMORY ENGINE                         │
│                                                                        │
│  • Persona Alignment: Tone, communication style, domain boundaries     │
│  • Semantic Chunking & Retrieval: Hybrid RAG across internal docs      │
│  • Continual Fact Extractor: Dynamic knowledge reinforcement           │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                 LLM REASONING & IN-SITU EXECUTION                      │
│                                                                        │
│  • Model: OpenAI GPT-4o-mini via OpenRouter API                        │
│  • In-Thread Slack Responses with source citations                     │
│  • Multi-Agent Executive Theme Synthesis                               │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Quickstart & Local Setup

### 1. Prerequisites
- Node.js 18+
- npm or pnpm

### 2. Clone & Install
```bash
git clone <repo-url>
cd ghostworker/frontend
npm install
```

### 3. Configure Environment Variables
Create a `.env.local` file in `frontend/`:
```env
# OpenRouter / OpenAI Key
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxxxxxxxxx
OPENAI_API_KEY=sk-or-v1-xxxxxxxxxxxxxxxxxxxx
OPENAI_BASE_URL=https://openrouter.ai/api/v1
OPENAI_MODEL=openai/gpt-4o-mini
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Exa AI Search Key (For Live Web Grounding)
EXA_API_KEY=772e5dd2-xxxxxxxxxxxxxxxxxxxx
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🎬 How to Demo to Judges (2-Minute Script)

1. **The Problem (20s)**:
   *"Today, when a senior tech lead goes on leave, the whole team gets blocked on architectural questions. Generic chatbots can't fix this because they don't know your internal code and nobody wants to copy-paste context."*
2. **The In-Situ Solution (40s)**:
   - Navigate to `/employee`.
   - Show the **Live Slack Channels** tab (`#eng-architecture`).
   - Type a question asking `@Jason Park` about the v3 platform rollout or auth tokens.
   - Watch the GhostWorker bot reply in real-time on Jason's behalf with verified RFC citations.
3. **Continual Learning (30s)**:
   - Click **My Twin Clone** to show how every message extracts facts with confidence scores.
4. **The Executive Multi-Agent View (30s)**:
   - Open `/ceo` and run *"Are we on track for the v3 release?"*.
   - Show the multi-agent cascade polling Eng, Sales, and Product in parallel to synthesize risks.

---

## 🏆 Hackathon Alignment ("Agents Everywhere")

- **Theme**: Agents living directly where people communicate (Slack, GitHub, Team Docs).
- **Zero Hallucination Guarantee**: Every claim links to verified internal sources.
- **Resilient Offline Architecture**: Graceful fallback ensures zero demo crashes on slow venue networks.
