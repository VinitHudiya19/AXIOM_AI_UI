# AXIOM AI — Frontend

> Production-ready Next.js 16 UI for the **AXIOM AI Orchestrator** — a multi-agent data analysis platform.
> Upload a dataset, ask a question in plain English, and watch AI agents plan, execute, and visualize results in real time.

---

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Plotly](https://img.shields.io/badge/Charts-Plotly-3F4F75?logo=plotly&logoColor=white)
![NextAuth](https://img.shields.io/badge/Auth-NextAuth.js-blueviolet?logo=next.js&logoColor=white)

---

## ✨ Features

### Real-time Execution
- **SSE Streaming** — connects to `/analyze/stream`, handles `plan`, `task_start`, `task_complete`, `result`, and `error` events live.
- **Animated Execution Graph** — React Flow DAG with per-node state: pending (faded), running (glowing pulse), completed (green flash), failed (red). Edges animate when data flows.
- **Clickable Nodes** — Click any node to open a side panel showing agent name, task description, payload, result preview, error, and timing.

### Interactive Visualizations & Widgets
- **Production Chart Widget** — Fully handles the `viz-agent` response format.
  - Interactive **Plotly.js** charts rendered client-side.
  - Supports `/auto-insights` format with a built-in interactive **Carousel** for multiple charts.
  - **Download PNG** button uses exact backend-rendered PNGs if available, or gracefully falls back to Plotly exports.
  - **Graceful Fallbacks** — Displays backend PNG server renders if Plotly fails to load on the client.
- **Data Tables** — Client-side paginated tables built via TanStack React Table with sortable columns.
- **Smart Markdown** — Output formatting via `react-markdown` and `rehype-highlight`.

### Live Logs Terminal
- **VS Code-style bottom panel** — Sliding terminal displaying real-time stream logs.
- **Terminal output** — Monospace font, color-coded rows by level (`SYS`, `INFO`, `OK`, `WARN`, `ERR`), millisecond precision.
- **Auto-scroll** — Detects manual scroll-up and shows "↓ jump to latest".

### Secure Authentication
- **NextAuth.js (v5)** — Fully integrated OAuth 2.0 flow using Google and GitHub providers.
- **Middleware Protected** — The main orchestrator workspace is securely locked behind the authentication boundary.

---

## 🚀 Quick Start

### 1. Prerequisites

- Node.js 18+
- [AXIOM AI Orchestrator backend](https://github.com/VinitHudiya19/AXIOM_AI_UI) running on port `8000`
- [Visualization Agent backend] running on port `8003`

### 2. Installation

```bash
git clone https://github.com/VinitHudiya19/AXIOM_AI_UI.git
cd AXIOM_AI_UI/frontend

npm install
```

### 3. Configure Environment Variables

Create `.env.local` in the frontend root directory and configure NextAuth:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000

# NextAuth Secret
AUTH_SECRET=generate_a_random_base64_string_here

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# GitHub OAuth
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

### 4. Run the Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). You will be automatically redirected to the `/login` page if unsigned.

---

## 🔌 API Proxying & Rewrites

The Next.js app natively proxies upstream backend requests via `next.config.ts`:

- `/api/*` proxies to orchestration engine (`localhost:8000`), excluding NextAuth paths.
- `/viz/*` routes natively to the Visualization Microservice (`localhost:8003`).

---

## 🏗️ Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout, ThemeProvider, Toaster
│   ├── page.tsx                # Main workspace — locked behind auth
│   ├── login/                  # NextAuth OAuth login page
│   └── api/auth/[...nextauth]/ # NextAuth dynamic route handler
├── auth.ts                     # NextAuth v5 Configuration
├── components/
│   ├── interactive/            # React Flow DAG, Logs Panel, Input commands
│   ├── panels/                 # Dataset inspector, Sidebar
│   └── widgets/
│       ├── ResultsPanel.tsx    # Routes agent results
│       ├── ChartWidget.tsx     # Enhanced Plotly chart system
│       ├── DataTableWidget.tsx # TanStack Table
│       └── MarkdownReport.tsx  # GFM markdown
├── hooks/
│   └── useOrchestratorSSE.ts   # Streams events from FastAPI
├── store/
│   └── useWorkspaceStore.ts    # Global Zustand state
└── types/
    └── axiom.ts                # Shared TypeScript models
```

---

## 🛠️ Tech Stack

| Type | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router, Turbopack) |
| **Logic** | React 19, TypeScript 5, Zustand (State) |
| **Styling** | Tailwind CSS 4, Framer Motion |
| **Visualization**| Plotly.js (`react-plotly.js`), TanStack Table v8 |
| **Graphing** | React Flow |
| **Auth** | NextAuth.js (Auth.js beta) |

---

## 📄 License
Internal project — AXIOM AI
