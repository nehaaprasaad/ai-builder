# AyurGuard

<p align="center">
  <b>Domain-aware plagiarism and originality tool for Ayurvedic research</b><br/>
  Built for PG scholars, PhD researchers, faculty, and editorial workflows.
</p>

---

## What is AyurGuard?

AyurGuard is a modern web application for plagiarism screening in Ayurvedic writing, where manuscripts often include:

- Sanskrit and transliterated terminology
- Classical formulations and traditional references
- Shloka-adjacent phrasing and semantic paraphrase

This version includes a working frontend and backend flow with FastAPI-powered analysis using sentence embeddings, cosine similarity, fuzzy matching, and Ayurvedic keyword boosting.

## Current status

### Included in this release
- Paste-text analysis experience
- Loading state with realistic delay
- Overall similarity score visualization
- Highlighted suspicious segments with explanations
- Top similar source cards
- FastAPI analysis endpoint (`/analyze`)
- `all-MiniLM-L6-v2` embeddings + cosine + fuzzy + domain keyword boost
- Professional, landing-page style interface

### Not included yet
- URL fetching (shown as coming soon)
- PDF parsing and ingestion
- User auth, history, and downloadable reports

---

## Tech stack

- `Next.js 15` (App Router)
- `TypeScript`
- `Tailwind CSS`
- `shadcn/ui`
- `Lucide` icons
- `FastAPI` + `sentence-transformers` + `rapidfuzz`

---

## Quick start

### 1) Prerequisites
- Node.js `20+`
- npm `10+`

### 2) Run backend (FastAPI)

```bash
cd /path/to/ai-builder/backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Backend health check: [http://127.0.0.1:8000/health](http://127.0.0.1:8000/health)

Copy `backend/.env.example` to `.env` if you need to customize `CORS_ORIGINS`.

### 3) Run frontend (Next.js)

```bash
cd /path/to/ai-builder
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

If your backend runs on a different URL, set:

```bash
export NEXT_PUBLIC_API_URL="http://127.0.0.1:8000"
```

Or copy `.env.example` to `.env.local`.

From the project root you can also run:

```bash
npm run backend:dev
```

in one terminal, and:

```bash
npm run dev
```

in a second terminal.

### 4) Production build

```bash
npm run build
npm start
```

---

## Backend tests

```bash
cd /path/to/ai-builder/backend
source .venv/bin/activate
pytest -q
```

or from repo root:

```bash
npm run backend:test
```

---

## Customize the analysis

- Update UI and copy in `components/ayur-guard/ayur-guard-app.tsx`
- Tune typography/colors/background mesh in `app/globals.css`
- Adjust backend scoring logic in `backend/app/main.py`
- Edit reference corpus entries (`CORPUS`) in `backend/app/main.py`

---

## Deploy on Vercel

This repo includes root [`vercel.json`](vercel.json) using [Vercel Services](https://vercel.com/docs/services) (`experimentalServices`): **Next.js** at `/` and **FastAPI** at `/_backend`.

### Before you deploy

1. **Project framework:** In the Vercel import flow, choose the **Services** / multi-service option when prompted (framework must match `vercel.json`).
2. **Root directory:** `./` (repository root — where `package.json` and `vercel.json` live).
3. **Environment variables** (Project → Settings → Environment Variables):
   - **`NEXT_PUBLIC_API_URL`** — For Services, Vercel usually injects a client-safe value like `/_backend` for the service named `api`. If it is not set after the first deploy, add:
     - Production / Preview: `/_backend`  
     (no trailing slash; the app calls `/_backend/analyze`.)
   - **`CORS_ORIGINS`** (for the Python service): comma-separated origins that may call the API from the browser, e.g. `https://<your-project>.vercel.app,http://localhost:3000`. Include preview URLs if you need previews to hit production API.

Redeploy after changing env vars.

### Caveat (ML backend)

The API depends on **sentence-transformers** and related libraries. Bundles are large and cold starts can be slow; Vercel [function limits](https://vercel.com/docs/functions/runtimes) may cause the Python service to fail on size or timeout. If that happens, deploy **only the Next.js app** on Vercel, host FastAPI on Railway / Render / Fly.io / similar, and set `NEXT_PUBLIC_API_URL` to that **full HTTPS origin** (no path), then redeploy.

### CLI (optional)

```bash
npm i -g vercel
vercel
vercel --prod
```

Use `vercel dev -L` to run all services locally per [Vercel docs](https://vercel.com/docs/services#local-development).

---

## Project structure

```text
vercel.json                    # Vercel Services: Next.js + FastAPI route prefixes
.env.example                   # NEXT_PUBLIC_API_URL (local vs Vercel)

app/
  globals.css                  # Theme, tokens, mesh background, utility font classes
  layout.tsx                   # Fonts + metadata
  page.tsx                     # Entry page

components/
  ayur-guard/
    ayur-guard-app.tsx         # Main landing + analysis flow
    score-display.tsx          # Score card UI
  ui/                          # shadcn/ui building blocks

lib/
  api.ts                       # Frontend API client for FastAPI
  mock-analysis.ts             # Optional local mock generator
  types.ts                     # Shared TS types
  utils.ts                     # Utility helpers

backend/
  app/main.py                  # FastAPI analysis service
  requirements.txt             # Backend Python dependencies

docs/
  PRD-AyurGuard.md             # Product Requirements Document
```

---

## Product documentation

See `docs/PRD-AyurGuard.md` for product goals, scope, and roadmap.

## License

Private repository. Use according to your organization policy.
