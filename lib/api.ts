import type { AnalysisResult } from "@/lib/types";

/** Local dev: full URL. Vercel Services: often `/_backend` (same origin, no trailing slash). */
function apiBase(): string {
  const raw =
    process.env.NEXT_PUBLIC_API_URL?.trim() ?? "http://127.0.0.1:8000";
  return raw.replace(/\/$/, "");
}

export async function analyzeText(text: string): Promise<AnalysisResult> {
  const response = await fetch(`${apiBase()}/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    let detail = "Analysis request failed.";
    try {
      const payload = (await response.json()) as { detail?: string };
      if (payload?.detail) detail = payload.detail;
    } catch {
      
    }
    throw new Error(detail);
  }

  return (await response.json()) as AnalysisResult;
}
