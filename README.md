# AyurGuard

Prototype web app: **plagiarism and originality signals** for **Ayurvedic research** (PG/PhD manuscripts, abstracts, journal submissions). Built with **Next.js 15** (App Router), **TypeScript**, **Tailwind CSS**, and **shadcn/ui**.

> This repository runs **mock analysis** after a short delay. Connect a FastAPI backend and embedding pipeline when you are ready for production.

## Prerequisites

- **Node.js** 20.x or newer (LTS recommended)
- **npm** 10+ (ships with Node)

## Run locally

```bash
cd /path/to/ai-builder
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Edit `components/ayur-guard/ayur-guard-app.tsx` and `lib/mock-analysis.ts` to adjust the UI or demo results.

### Production build

```bash
npm run build
npm start
```

## Deploy on Vercel

1. Push this repo to **GitHub**, **GitLab**, or **Bitbucket**.
2. Go to [vercel.com](https://vercel.com) and sign in.
3. **Add New Project** → import the repository.
4. Vercel detects **Next.js** automatically. Defaults are fine:
   - **Framework Preset:** Next.js  
   - **Build Command:** `next build` (or `npm run build`)  
   - **Output:** Next.js default  
5. Click **Deploy**.

Environment variables are optional for this prototype. When you add a real API, set e.g. `NEXT_PUBLIC_API_URL` in **Project → Settings → Environment Variables** and redeploy.

### CLI (optional)

```bash
npm i -g vercel
vercel
```

Follow prompts; `vercel --prod` deploys to production.

## Project layout

| Path | Purpose |
|------|---------|
| `app/page.tsx` | Home page |
| `app/layout.tsx` | Fonts, metadata |
| `app/globals.css` | Theme (AyurGuard palette) |
| `components/ayur-guard/` | Main UI |
| `lib/mock-analysis.ts` | Demo analysis payload |
| `components/ui/` | shadcn components |

## Product spec

See `docs/PRD-AyurGuard.md`.

## License

Private / use per your organization.
