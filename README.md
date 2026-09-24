# 🟣 TwinOps Enterprise

> **Autonomous Workplace Digital Twins for Enterprise Delivery Pods.**  
> *Seamlessly integrated into Microsoft Teams, Slack, GitHub, Jira, and Episodic Team Memory.*

[![TwinOps Enterprise CI](https://github.com/mohammadali-2000/ghostworker-ai/actions/workflows/ci.yml/badge.svg)](https://github.com/mohammadali-2000/ghostworker-ai/actions/workflows/ci.yml)
![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?style=flat&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)
![Microsoft Teams](https://img.shields.io/badge/Microsoft%20Teams-Adaptive%20Cards%20v1.4-5B5FC7?style=flat&logo=microsoft-teams)
![Enterprise Security](https://img.shields.io/badge/Security-Zero%20Data%20Leakage-10B981?style=flat)

---

## 🎯 The Enterprise Problem

In high-velocity enterprise consulting and engineering pods (e.g., Accenture, Microsoft, AWS delivery partners), **delivery bottlenecks are rarely about writing code—they are about blocked communication**:

1. **Lead Architects in 4-Hour Client Meetings:** When a Senior Tech Lead is tied up in client governance calls or on leave, junior developers and external contractors are blocked on architecture, API contracts, and schema designs.
2. **Context Scattered Across Silos:** Decisions are buried across Jira tickets, closed GitHub PR reviews, Teams threads, and internal RFCs.
3. **The "Generic Chatbot" Failure:** Generic AI chatbots (like standard ChatGPT) know nothing about private corporate codebases, sprint user stories, or client compliance requirements.

**TwinOps solves this by creating ambient, verified Digital Twins of your delivery leads.**

---

## ⚡ Core Capabilities

### 1. 🟣 Microsoft Teams & Slack In-Situ Interception
- Teammates ask natural questions in delivery channels (e.g., `"#hls-backend-delivery"`: *"@Sm Ali is patient auth token verification using in-memory or Redis caching?"*).
- When the architect is **Away** or **In Meeting**, their **TwinOps Twin** responds in 2 seconds directly in the thread:
  - Formatted as a rich **Microsoft Teams Adaptive Card** (via modern Power Automate Workflows).
  - Backed by **verifiable source citations** with clickable links to Jira User Stories (e.g., `HLS-402`) and GitHub PRs (`#142`).

### 2. 🎛️ Human-in-the-Loop Governance & Presence Cockpit
- **Presence Modes:**
  - 🔴 **At Desk (Online):** Twin stays silent; human answers natively.
  - 🟡 **Shadow Mode:** Twin drafts responses to the employee's private dashboard for 1-click review without auto-sending.
  - 🟢 **Autonomous (In Meeting / On Leave):** Twin answers high-confidence architectural inquiries automatically.
- **Risk Approval Gate:** High-impact operations (prod deployments, client commitments) require explicit human sign-off.

### 3. 🧠 Continual Episodic Memory & Vector RAG
- Automatically ingests Confluence docs, GitHub commits, Jira tickets, and meeting summaries into an encrypted vector store (`pgvector`).
- Extracts architectural facts, tracks confidence scores, and reinforces memory dynamically without manual fine-tuning.

### 4. 👔 Executive Multi-Twin Pod Polling
- Project Directors and Delivery Managers can poll multiple lead twins simultaneously:
  - *"Are we on track for the Friday v3 healthcare compliance release?"*
  - The **Tech Lead Twin**, **Product Compliance Twin**, and **QA Lead Twin** respond in parallel, generating instant consensus percentages and flagging unmerged blockers.

### 5. 🔒 Enterprise Security & Compliance
- **Zero Client Data Leakage:** No training on client intellectual property. Deterministic RAG bounded by tenant ID.
- **DLP & PII Redaction:** Automated sanitization of secrets, tokens, and patient/customer data.
- **Azure OpenAI Service Alignment:** Built to connect with corporate Azure OpenAI instances inside private enterprise VPCs.

---

## 🏗️ Architecture & Data Flow

```
┌────────────────────────────────────────────────────────────────────────┐
│                        WHERE WORK ALREADY HAPPENS                      │
│                                                                        │
│   🟣 MS Teams (Workflows) │  💬 Slack Webhooks  │  🐙 GitHub / Jira    │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ (Inbound Webhooks / Event Triggers)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        TWINOPS MEMORY COCKPIT                          │
│                                                                        │
│  • Persona Alignment: Tone, communication style, domain boundaries     │
│  • Hybrid RAG: Semantic pgvector search + keyword BM25 retrieval      │
│  • Episodic Fact Extraction: Dynamic confidence reinforcement          │
│  • DLP Guardrails: Regex & semantic stripping of API keys and PII      │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                      ENTERPRISE LLM INFERENCE                          │
│                                                                        │
│  • Engine: Azure OpenAI (GPT-4o) / Anthropic Claude                    │
│  • Output: Microsoft Teams Adaptive Card v1.4 Payload                  │
│  • Governance: Human-in-the-Loop Approval Queue & Audit Logs           │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Quickstart & Local Setup

### 1. Prerequisites
- Node.js 20+
- npm or pnpm

### 2. Clone & Install
```bash
git clone https://github.com/mohammadali-2000/ghostworker-ai.git twinops
cd twinops
npm install
```

### 3. Environment Configuration
Copy the template to create your local config:
```bash
cp .env.example .env.local
```
Fill in the minimal required parameters:
```env
# LLM Inference
OPENAI_API_KEY=your_openai_or_azure_api_key_here
OPENAI_MODEL=gpt-4o

# Vector Store
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# Microsoft Teams Webhook (Optional for live delivery)
TEAMS_WEBHOOK_URL=https://prod-xx.eastus.logic.azure.com:443/workflows/...
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to access the TwinOps Command Center.

---

## 🌿 Enterprise Git Workflow & Branching Strategy

This project follows enterprise trunk-based development with feature branch protection:

| Branch | Purpose |
| :--- | :--- |
| `main` | Production-ready stable release. Protected by CI automation. |
| `feature/teams-adaptive-cards` | Microsoft Teams Power Automate webhook integration & Adaptive Card v1.4 engine. |
| `feature/omnichannel-simulator` | In-app dark mode simulator with real-time toggle between Microsoft Teams & Slack. |
| `feature/episodic-rag-memory` | Vector memory, fact extraction, and citation engine. |
| `feature/enterprise-security` | Zero client data leakage, AES-256 token validation, PII redaction, HIPAA guardrails. |

Every pull request runs automated GitHub Actions for:
1. **Secret & DLP Scanning** (checks for hardcoded API keys or client tokens).
2. **TypeScript 5 Typechecking** (`tsc --noEmit`).
3. **Next.js Production Build Validation** (`npm run build`).

---

## 👥 Core Team
- **Sm Ali (Mohammad Ali)** — Lead Full Stack & AI Architect
- **Maneesh Nand** — Backend & Infrastructure Lead
- **Md Towfik Omer** — Frontend & Product Lead

---

## 📄 Documentation Links
- [Master Plan & 5-Minute Demo Script](TWINOPS_ACCENTURE_MASTER_PLAN.md)
- [Project Overview & Solution](docs/PROJECT_OVERVIEW_AND_SOLUTION.md)
