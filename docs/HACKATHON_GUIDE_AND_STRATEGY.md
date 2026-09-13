# 🏆 OpenAI & AI Tinkerers Hackathon: "Agents, Everywhere"
### The Ultimate Playbook: What Judges Want, Scoring Rubric, Winning Formulas & Game Plan

---

## 🎯 1. What Do They ACTUALLY Want? (The Core Mandate in Plain English)

The organizers named the hackathon **"Agents, Everywhere"** with one strict, uncompromising theme:
> **"Agents are leaving the chatbox. Build an agent for a place people already work, talk, or live, then make it meaningfully more useful because of that context."**

### ❌ What Will Score 1/5 or Lose Immediately (The "Chatbox Trap"):
- A website with a chat widget in the bottom right corner.
- A chatbot wrapped in an iframe or generic modal.
- A tool where you manually paste context into a text prompt and wait for an answer.
- An agent where the location/environment does not matter (i.e., if it could just be a ChatGPT custom GPT, it fails).

### ✅ What Will Score 5/5 and Win:
- **Zero Prompting Needed:** The agent is already present inside the environment (IDE, browser tab, Figma canvas, WhatsApp/Slack thread, spreadsheet, CAD software, voice call, camera/wearable).
- **Environment-Aware Context:** The agent *sees* the user’s active screen state, DOM, active spreadsheet cell, git branch, or live meeting context without the user having to explain it.
- **Autonomous In-Situ Action:** It doesn't just reply with text advice; it clicks, edits the cell, moves a Figma node, generates and commits code, modifies the DOM, drafts the reply directly into the email/ticket system, or triggers an external workflow.
- **"Could NOT exist in a standalone chatbox"**: Its killer value only exists *because* it lives directly inside that software or workflow.

---

## ⏱️ 2. Critical Schedule & Build Window (Only ~4 Hours to Code!)

| Time (IST) | Phase | Strategic Objective |
| :--- | :--- | :--- |
| **10:00 – 10:30 AM** | Check-in & Breakfast | Arrive, network, grab breakfast. |
| **10:30 – 11:00 AM** | Global Briefing | Watch kickoff & starter-kit walkthrough. |
| **11:00 – 11:15 AM** | Team & Idea Lock | Register team on portal. Lock **ONE** idea. No scope creep. |
| **11:15 AM – 1:00 PM** | Sprint 1: Core Agent Plumbing | Setup starter kit / CopilotKit / OpenAI Agents SDK + tool execution. |
| **1:00 – 2:30 PM** | Sprint 2: Environment Integration | Connect live context (DOM, canvas, IDE, Slack/messaging, or voice). |
| **2:30 – 3:15 PM** | Sprint 3: UI Polish & "WOW" Factor | Smooth micro-animations, fast response, zero friction. |
| **3:15 – 3:30 PM** | Final Testing & Code Push | Freeze code, ensure reproducible demo. |
| **3:30 – 4:00 PM** | **SUBMISSIONS CLOSE** | Submit repository, description, architecture, and demo video. |
| **4:00 – 4:45 PM** | Live Show & Tell | 2-minute live demo in front of judges & peers. |

---

## 📊 3. The 4 Judging Criteria (How Every Judge Scores You 1–5)

To win, your project needs a **20 / 20**:

| Criterion | What Judges Look For | How to Guarantee a 5/5 |
| :--- | :--- | :--- |
| **1. Core Requirements & Functionality** | Does a working agent run inside a real place people live/work? Does the core workflow work end-to-end? | It must NOT be a mockup or faked demo. A live, working flow where action A leads to autonomous agent execution B. |
| **2. Innovation & Theme Alignment** | Does the environment materially improve what the agent can do? | The agent's value is impossible in ChatGPT. Context is ambiently ingested from the host environment. |
| **3. Technical Execution & Integration** | Code quality, multi-tool agent orchestration, error recovery, depth of host integration. | Clean tool calling (OpenAI Agents SDK / LangChain / CopilotKit), bi-directional state sync, Exa search or Auth0 tokens. |
| **4. Usefulness & Agentic UX** | Clear practical value, intuitive interaction, appropriate human-in-the-loop controls. | High utility for real professionals or everyday users; non-intrusive; effortless. |

---

## 🎁 4. Strategic Prize Targets & Sponsor Bounties

Aiming for global top 3 + sponsor bounties simultaneously:
1. **First Place Overall:** $10k OpenAI credits + Mac mini for each member + $1k Exa.
2. **Best Use of CopilotKit (AirPods Max for every team member):**
   - By utilizing [CopilotKit](https://docs.copilotkit.ai/quickstart) (in-app copilot, canvas actions, or Slack/Teams channels), you qualify for this top-tier hardware bounty.
3. **Best Use of Ambiguous AI (NVIDIA DGX Spark):**
   - Ambiguous AI provides workspace integration (documents, email, tasks, CRM). Integrating an agent into workplace tasks hits this.
4. **Exa API Integration:**
   - Incorporating live semantic web intelligence using Exa (`exa.ai`) satisfies both global judges and Exa sponsors.

---

## 💡 5. Top 4 Winning Project Concepts Tailored for This Hackathon

### Concept 1: "CanvasCopilot" — The Agent Living Inside Web Design / Infinite Canvas (Highest Probability for CopilotKit Bounty)
- **The Place:** An interactive canvas (like Figma, Miro, or a visual web page builder).
- **The Ambient Context:** Knows the coordinates, DOM elements, CSS styles, and bounding boxes of whatever the user selects or hovers over.
- **The Agent Action:** User says "Refactor this hero section to match dark cyberpunk theme and add responsive pricing cards," and the agent directly modifies the live canvas elements in real time with visual animations.
- **Sponsor Tech:** CopilotKit frontend hooks (`useCopilotAction`, `useCopilotReadable`) + OpenAI Agents SDK.

### Concept 2: "AmbientScribe" — The Ghost Agent in Medical / Legal / Interview Workflows
- **The Place:** A real-time audio/voice layer that sits over browser/meeting calls.
- **The Ambient Context:** Listens to the conversation live using OpenAI Realtime Voice / Whisper.
- **The Agent Action:** Automatically drafts clinical notes, detects compliance red flags, queries Exa live for medical/case citations, and automatically updates the CRM/EHR without the user ever touching the keyboard.
- **Sponsor Tech:** OpenAI Realtime/Voice Agents + Exa API + Auth0.

### Concept 3: "DOMNavigator" — Ambient Browser Extension Agent
- **The Place:** Chrome Extension / Side-panel injected directly into active websites (e.g., LinkedIn, GitHub, or AWS Console).
- **The Ambient Context:** Directly parses page state, pending pull requests, or cloud resource tables.
- **The Agent Action:** Executes complex multi-step workflows directly into the active tab (e.g., triage 10 issues, fill form data across 3 pages, automate deployment verification).
- **Sponsor Tech:** Chrome Extension (Manifest V3) + OpenAI Agents SDK + Exa.

### Concept 4: "SlackOps / WhatsApp Micro-Agent" — Ambient Team Collab Agent
- **The Place:** Live Slack / Discord / WhatsApp group where daily work talks happen.
- **The Ambient Context:** Monitors discussion threads where team members report bugs or ask questions.
- **The Agent Action:** Resolves the bug by cloning repo context, running checks, proposing a PR, and returning interactive cards into the chat with one-click approval buttons.
- **Sponsor Tech:** CopilotKit Channels (Slack/Teams) + OpenAI Agents SDK + Trigger.dev.

---

## 🚀 6. Next Steps for Today's Build

1. **Pick your team & track** (Join team or create one on the hackathon portal before 11:30 AM).
2. **Unlock your Sponsor Credits:** Complete the 3-minute survey on the hackathon portal to get your OpenAI & Exa keys.
3. **Clone Starter Kit:** Clone `https://github.com/CopilotKit/agents-everywhere-starter-kit`.
4. **Decide your build direction now:** Let's choose the concept and start engineering immediately!
