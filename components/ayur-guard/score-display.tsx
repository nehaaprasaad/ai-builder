"use client";

import { cn } from "@/lib/utils";
import type { ScoreBand } from "@/lib/types";

const bandCopy: Record<
  ScoreBand,
  { label: string; barClass: string; accent: string; sub: string }
> = {
  low: {
    label: "Within expected range",
    barClass: "bg-[oklch(0.52_0.14_155)]",
    accent: "text-[oklch(0.38_0.12_155)]",
    sub: "Low overlap vs. reference snapshot",
  },
  medium: {
    label: "Manual review advised",
    barClass: "bg-[oklch(0.72_0.14_75)]",
    accent: "text-[oklch(0.45_0.1_65)]",
    sub: "Several passages align with indexed abstracts",
  },
  high: {
    label: "Elevated signal",
    barClass: "bg-[oklch(0.58_0.2_25)]",
    accent: "text-[oklch(0.45_0.17_25)]",
    sub: "Prioritize attribution & paraphrase checks",
  },
};

export function ScoreDisplay({
  score,
  band,
}: {
  score: number;
  band: ScoreBand;
}) {
  const cfg = bandCopy[band];
  const rounded = Math.round(score);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-[0_1px_0_rgba(0,0,0,0.04),0_24px_48px_-24px_rgba(15,40,35,0.14)]">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-black/[0.08] to-transparent" />
      <div className="grid gap-8 p-6 sm:grid-cols-[auto_1fr] sm:items-center sm:gap-10 sm:p-8">
        <div
          className="flex flex-col items-start gap-1"
          aria-label={`Similarity score ${rounded} percent`}
        >
          <span
            className={cn(
              "font-display text-[3.25rem] font-normal leading-none tracking-tight tabular-nums sm:text-[3.5rem]",
              cfg.accent
            )}
          >
            {rounded}
            <span className="text-[0.45em] font-normal tracking-normal text-muted-foreground/80">
              %
            </span>
          </span>
          <span className="font-display text-sm font-normal tracking-tight text-foreground">
            {cfg.label}
          </span>
          <span className="max-w-[14rem] text-xs leading-relaxed text-muted-foreground">
            {cfg.sub}
          </span>
        </div>

        <div className="min-w-0 space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
              Domain-adjusted index
            </p>
            <p className="text-xs text-muted-foreground">
              &lt;30 · 30–60 · &gt;60
            </p>
          </div>
          <div
            className="h-1.5 w-full overflow-hidden rounded-full bg-black/[0.06]"
            role="progressbar"
            aria-valuenow={rounded}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className={cn(
                "h-full rounded-full transition-[width] duration-700 ease-out",
                cfg.barClass
              )}
              style={{ width: `${rounded}%` }}
            />
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Weighted blend of embedding cosine similarity, fuzzy transliteration
            match, and boosted Ayurvedic terminology — boilerplate terms
            down-weighted.
          </p>
        </div>
      </div>
    </div>
  );
}
