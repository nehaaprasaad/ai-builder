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

### Dashboard method
1. Push this repo to GitHub/GitLab/Bitbucket.
2. Go to [vercel.com](https://vercel.com) and import the repository.
3. Keep default Next.js settings.
4. Click **Deploy**.

### CLI method (optional)

```bash
npm i -g vercel
vercel
vercel --prod
```

Set `NEXT_PUBLIC_API_URL` in Vercel to your deployed backend URL and redeploy.

---

## Project structure

```text
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
