# 📋 RepoLens AI — Pre-Development Document

> **Version:** 1.0  
> **Date:** March 2025  
> **Author:** Sumit (B.Tech 3rd Year, CSE)  
> **Status:** Planning Complete — Ready for Development

---

## 1. Project Overview

**Project Name:** RepoLens AI  
**Tagline:** "Understand Any GitHub Repository in Seconds with AI"  
**Type:** Single Page Application (SPA) with Serverless Backend  
**Deployment Target:** Vercel (Frontend + Serverless Functions)

---

## 2. Technology Stack Selection

After careful evaluation of available options, the following technologies were selected. Each choice was made considering performance, developer experience, ecosystem maturity, and learning value.

### 2.1 Frontend Stack

| Technology | Version | Purpose | Why This Over Alternatives |
|---|---|---|---|
| **React** | 18.3.1 | UI framework | Component-based, massive ecosystem, industry standard |
| **TypeScript** | 5.8.x | Type safety | Catches bugs at compile time, better IDE support, easier refactoring |
| **Vite** | 5.4.x | Build tool & dev server | 10x faster than CRA/Webpack, native ESM, instant HMR |
| **Tailwind CSS** | 3.4.x | Utility-first CSS | Rapid styling, consistent design tokens, built-in dark mode |
| **Shadcn/UI** | Latest | Component library | Beautiful, accessible components built on Radix UI primitives |
| **Framer Motion** | 12.x | Animations | Declarative, performant, production-quality animations |
| **React Router DOM** | 6.30.x | Client-side routing | Industry standard for React SPA routing |
| **TanStack React Query** | 5.x | Server state management | Automatic caching, refetching, and error handling |
| **Lucide React** | 0.462.x | Icon library | Consistent, customizable SVG icons |
| **Sonner** | 1.7.x | Toast notifications | Beautiful, minimal toast system |

### 2.2 Backend Stack

| Technology | Purpose | Why This |
|---|---|---|
| **Vercel Serverless Functions** | API routes | Zero-config, auto-scaling, integrated with frontend deployment |
| **Google Gemini AI (2.5 Flash)** | Code analysis & file explanation | Powerful reasoning, generous free tier, fast inference |
| **GitHub REST API v3** | Repository data fetching | Well-documented, comprehensive, reliable |

### 2.3 Development Tools

| Tool | Purpose |
|---|---|
| **ESLint** | Code linting with React-specific rules |
| **Vitest** | Unit testing (Vite-native, fast) |
| **PostCSS + Autoprefixer** | CSS processing and browser compatibility |
| **@vitejs/plugin-react-swc** | SWC-based React compilation (faster than Babel) |
| **tailwindcss-animate** | Additional animation utilities for Tailwind |

---

## 3. Project Structure (Planned Architecture)

```
quickcode-lens-main/
├── api/                          # Vercel Serverless Functions
│   ├── analyze.js                # Main AI analysis endpoint
│   ├── explain.js                # File explanation endpoint
│   └── github.js                 # GitHub API proxy
│
├── src/
│   ├── components/
│   │   ├── analysis/             # Analysis result components
│   │   │   ├── Insights.tsx      # Health indicators & suggestions
│   │   │   ├── KeyModules.tsx    # Key module cards
│   │   │   ├── LoadingState.tsx  # Step-by-step loading animation
│   │   │   ├── OverviewCard.tsx  # Project overview & architecture
│   │   │   ├── RepoHeader.tsx    # Repository info header
│   │   │   └── TechStack.tsx     # Tech stack grouped display
│   │   │
│   │   ├── file-explorer/        # File tree & viewer components
│   │   │   ├── FileTree.tsx      # Recursive, collapsible file tree
│   │   │   └── FileViewer.tsx    # Code viewer with line numbers
│   │   │
│   │   ├── repo-input/           # Input & selection components
│   │   │   ├── ExampleRepos.tsx  # Quick-start example buttons
│   │   │   ├── RecentRepos.tsx   # Recently analyzed repos
│   │   │   └── RepoInput.tsx     # Main URL input form
│   │   │
│   │   ├── ui/                   # Shadcn/UI primitive components
│   │   │   └── (40+ components)  # Badge, Button, Card, Dialog, etc.
│   │   │
│   │   └── NavLink.tsx           # Router-aware navigation link
│   │
│   ├── hooks/
│   │   ├── useRepoAnalysis.ts    # Core analysis orchestration hook
│   │   ├── useLocalStorage.ts    # Persistent local storage hook
│   │   ├── use-mobile.tsx        # Mobile detection hook
│   │   └── use-toast.ts          # Toast notification hook
│   │
│   ├── lib/
│   │   ├── github.ts             # GitHub API client utilities
│   │   └── utils.ts              # Tailwind merge utility
│   │
│   ├── pages/
│   │   ├── Index.tsx             # Main application page
│   │   └── NotFound.tsx          # 404 page
│   │
│   ├── types/
│   │   └── repo.ts               # TypeScript type definitions
│   │
│   ├── test/
│   │   ├── example.test.ts       # Example tests
│   │   └── setup.ts              # Test setup
│   │
│   ├── App.tsx                   # Root app component with providers
│   ├── App.css                   # App-specific styles
│   ├── main.tsx                  # React entry point
│   └── index.css                 # Global styles & design tokens
│
├── index.html                    # HTML entry point with SEO meta
├── tailwind.config.ts            # Tailwind configuration
├── vite.config.ts                # Vite build configuration
├── vite-api-plugin.ts            # Custom Vite plugin for local API dev
├── vercel.json                   # Vercel deployment config
├── package.json                  # Dependencies & scripts
├── tsconfig.json                 # TypeScript configuration
└── .env.example                  # Environment variable template
```

---

## 4. API Design (Pre-Development Planning)

### 4.1 Endpoint Specifications

We planned three serverless API endpoints, each serving a specific purpose:

#### `POST /api/github` — GitHub API Proxy

| Field | Details |
|---|---|
| **Purpose** | Securely proxy GitHub API requests (hide GITHUB_TOKEN from client) |
| **Actions** | `repoInfo`, `repoTree`, `fileContent` |
| **Input** | `{ action, owner, repo, path? }` |
| **Output** | Raw GitHub API response |
| **Error Handling** | 404 (repo not found), 403 (rate limit), 500 (server error) |

#### `POST /api/analyze` — AI Repository Analysis

| Field | Details |
|---|---|
| **Purpose** | Send repo metadata + key files to Gemini AI for analysis |
| **Input** | `{ owner, repo, description, language, treeString, keyFiles }` |
| **Output** | Structured JSON with overview, techStack, architecture, modules, health |
| **AI Model** | Google Gemini 2.5 Flash |
| **Prompt Strategy** | System prompt instructs JSON-only output; user prompt provides repo context |

#### `POST /api/explain` — AI File Explanation

| Field | Details |
|---|---|
| **Purpose** | Explain a single file's purpose, components, and architecture role |
| **Input** | `{ filePath, content }` |
| **Output** | Human-readable text explanation |
| **Content Limit** | First 8000 characters of file content |

### 4.2 Security Considerations (Planned)

| Security Measure | Implementation |
|---|---|
| **API Key Protection** | All API keys stored as Vercel environment variables, never in client bundle |
| **CORS Headers** | Properly configured on all endpoints |
| **Method Validation** | Only POST requests accepted; OPTIONS handled for preflight |
| **Input Truncation** | Tree string limited to 5000 chars, file content to 8000 chars to prevent abuse |
| **Error Sanitization** | Error messages returned to client are generic; detailed errors logged server-side |

---

## 5. Data Flow Design

The application follows a clear, linear data flow:

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER INTERACTION                         │
│                                                                 │
│  User enters a GitHub URL (e.g., "facebook/react")              │
│                           │                                     │
│                           ▼                                     │
│              ┌──────────────────────┐                           │
│              │   RepoInput.tsx      │  Parses URL → owner/repo  │
│              │   (URL Validation)   │                           │
│              └──────────────────────┘                           │
│                           │                                     │
│                           ▼                                     │
│              ┌──────────────────────┐                           │
│              │  useRepoAnalysis.ts  │  Analysis Orchestrator    │
│              │  (Custom React Hook) │                           │
│              └──────────────────────┘                           │
│                     │    │    │                                  │
│      ┌──────────────┤    │    ├──────────────┐                  │
│      ▼              ▼    │    ▼              ▼                  │
│  Step 1          Step 2  │  Step 3        Step 4                │
│  Fetch Repo      Fetch   │  Fetch Key     Send to               │
│  Info            Tree    │  Files         Gemini AI             │
│  /api/github     /api/   │  /api/github   /api/analyze          │
│                  github  │                                      │
│      │              │    │    │              │                   │
│      ▼              ▼    │    ▼              ▼                   │
│  RepoInfo       FileNode │  Key File     AnalysisResult         │
│  Object         Tree[]   │  Contents     (JSON)                 │
│                          │                                      │
│                          ▼                                      │
│              ┌──────────────────────┐                           │
│              │    RENDER RESULTS    │                            │
│              │  RepoHeader          │                           │
│              │  OverviewCard        │                           │
│              │  TechStack           │                           │
│              │  KeyModules          │                           │
│              │  Insights            │                           │
│              │  FileTree            │                           │
│              └──────────────────────┘                           │
│                                                                 │
│  Optional: User clicks a file → FileViewer → "Explain with AI" │
│            → /api/explain → Display AI explanation              │
└─────────────────────────────────────────────────────────────────┘
```

---

## 6. Component Breakdown (Planned)

### 6.1 Component Hierarchy

```
App
├── QueryClientProvider (TanStack)
├── TooltipProvider
├── Toaster (Shadcn)
├── Sonner
└── BrowserRouter
    ├── Route "/" → Index
    │   ├── Header (Logo + Navigation)
    │   ├── RepoInput (Input State)
    │   │   ├── ExampleRepos
    │   │   └── RecentRepos
    │   ├── LoadingState (Loading State)
    │   └── Results (Analysis State)
    │       ├── RepoHeader
    │       ├── OverviewCard
    │       ├── TechStack
    │       ├── KeyModules
    │       ├── Insights
    │       ├── FileTree
    │       └── FileViewer
    └── Route "*" → NotFound
```

### 6.2 State Management Strategy

| State Type | Solution | Scope |
|---|---|---|
| **Analysis State** | `useRepoAnalysis` custom hook (React `useState`) | Entire analysis lifecycle |
| **Server State** | TanStack React Query (`QueryClient`) | Global, with caching |
| **UI State** | React `useState` in components | Component-local |
| **Persistent State** | `useLocalStorage` custom hook | Browser localStorage |
| **File Selection** | React `useState` (lifted to `Index.tsx`) | Page-level |

**Decision: No Redux.** After evaluating the state management needs, I concluded that the app's state is simple enough to manage with React's built-in hooks and a custom `useRepoAnalysis` hook. Adding Redux would be over-engineering for this use case.

---

## 7. Deployment Plan

### 7.1 Platform Selection

**Vercel** was chosen for deployment because:
- Native support for serverless functions in the `/api` directory
- Automatic SSL and CDN
- GitHub integration for continuous deployment
- Free tier is generous enough for this project

### 7.2 Environment Configuration

```bash
# Required Environment Variables on Vercel
GEMINI_API_KEY=your_google_gemini_api_key
GITHUB_TOKEN=your_github_personal_access_token  # (optional, increases rate limit)
```

### 7.3 Local Development Strategy

For local development, a **custom Vite plugin** (`vite-api-plugin.ts`) was designed to:
1. Intercept `/api/*` requests during development
2. Load environment variables from `.env` file
3. Patch Node.js `res` object to mimic Express/Vercel behavior
4. Dynamically import and execute the serverless function handlers

This approach allows the same API handler code to work both locally (via Vite dev server) and in production (via Vercel serverless functions) — **zero code changes needed between environments**.

---

## 8. Testing Strategy

| Testing Layer | Tool | Coverage Plan |
|---|---|---|
| **Unit Tests** | Vitest | Utility functions (URL parsing, tree building) |
| **Component Tests** | @testing-library/react | Component rendering and interaction |
| **Integration Tests** | Vitest + JSDOM | Hook behavior with mocked API calls |
| **Manual Testing** | Browser | Full user flow, responsive design, error states |

---

## 9. Risk Assessment

| Risk | Severity | Mitigation |
|---|---|---|
| **GitHub API Rate Limiting** | High | Add `GITHUB_TOKEN` for authenticated rate (5000/hr vs 60/hr) |
| **Gemini API Downtime** | Medium | Graceful error handling with user-friendly error messages |
| **Large Repo Timeout** | Medium | Tree depth limited to 3 levels, file content truncated |
| **AI Hallucination** | Low | Structured JSON output with response validation |
| **Security (API Key Exposure)** | High | All keys in serverless env vars, never in client |

---

## 10. Development Timeline (Estimated)

| Phase | Duration | Activities |
|---|---|---|
| **Phase 1: Setup & Core** | 2 days | Project scaffolding, design system, basic components |
| **Phase 2: GitHub Integration** | 2 days | API proxy, repo fetching, file tree building |
| **Phase 3: AI Integration** | 2 days | Gemini API integration, prompt engineering, response parsing |
| **Phase 4: UI Polish** | 2 days | Animations, loading states, error handling, responsive design |
| **Phase 5: Deployment** | 1 day | Vercel setup, environment config, testing |
| **Phase 6: Documentation** | 1 day | README, docs, code comments |

**Total Estimated Time:** ~10 days (part-time, alongside college)

---

## 11. AI & Tool Assistance Acknowledgment

> As a 3rd-year B.Tech student, I leveraged AI tools to accelerate development while focusing on learning and understanding every decision. Specifically:
> 
> - **Lovable:** Used for initial project scaffolding and component generation
> - **Google Gemini (via Antigravity):** Used for code refactoring, bug fixing, deployment preparation, and prompt engineering
> - **GitHub Copilot:** Used for code completion and boilerplate generation
> 
> All architectural decisions, feature choices, and design patterns were researched and decided by me. AI was used as a productivity multiplier, not a replacement for understanding.

---

*Document maintained by Sumit. Last updated: March 2025.*
