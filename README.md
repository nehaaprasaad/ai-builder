# AyurGuard

<p align="center">
  <b>Domain-aware plagiarism and originality prototype for Ayurvedic research</b><br/>
  Built for PG scholars, PhD researchers, faculty, and editorial workflows.
</p>

---

## What is AyurGuard?

AyurGuard is a modern web prototype that demonstrates how plagiarism screening can feel more relevant for Ayurvedic writing, where manuscripts often include:

- Sanskrit and transliterated terminology
- Classical formulations and traditional references
- Shloka-adjacent phrasing and semantic paraphrase

This version is intentionally a **UI + mock intelligence prototype**. It simulates realistic analysis output and interaction flow while keeping the architecture ready for backend integration.

## Current status

### Included in this prototype
- Paste-text analysis experience
- Loading state with realistic delay
- Overall similarity score visualization
- Highlighted suspicious segments with explanations
- Top similar source cards
- Professional, landing-page style interface

### Not included yet
- Real plagiarism backend/API calls
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

---

## Quick start

### 1) Prerequisites
- Node.js `20+`
- npm `10+`

### 2) Install & run

```bash
cd /path/to/ai-builder
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 3) Production build

```bash
npm run build
npm start
```

---

## Customize the demo

- Update UI and copy in `components/ayur-guard/ayur-guard-app.tsx`
- Adjust score logic and source mocks in `lib/mock-analysis.ts`
- Tune typography/colors/background mesh in `app/globals.css`

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

If you later connect a backend API, add environment variables in Vercel (for example, `NEXT_PUBLIC_API_URL`) and redeploy.

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
  mock-analysis.ts             # Mock plagiarism logic/results
  types.ts                     # Shared TS types
  utils.ts                     # Utility helpers

docs/
  PRD-AyurGuard.md             # Product Requirements Document
```

---

## Product documentation

See `docs/PRD-AyurGuard.md` for product goals, scope, and roadmap.

## License

Private repository. Use according to your organization policy.
