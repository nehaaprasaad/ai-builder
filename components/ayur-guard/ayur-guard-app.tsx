"use client";

import { useCallback, useRef, useState } from "react";
import { ArrowRight, Loader2, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { ScoreDisplay } from "@/components/ayur-guard/score-display";
import { analyzeText } from "@/lib/api";
import type { AnalysisResult } from "@/lib/types";
import { cn } from "@/lib/utils";

const PLACEHOLDER = `Paste abstract, methods, or discussion — including IAST or popular transliteration (Triphala, Aśvagandhā), classical citations, or śloka glosses as in your draft.`;

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const trustPoints = [
  "Sanskrit & hybrid English",
  "Formulation & śloka context",
  "Semantic + fuzzy match",
];

export function AyurGuardApp() {
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const resultsRef = useRef<HTMLElement | null>(null);

  const analyze = useCallback(async () => {
    const t = text.trim();
    if (!t) {
      setError("Add manuscript text to run an analysis.");
      setResult(null);
      return;
    }
    setError(null);
    setLoading(true);
    setResult(null);
    try {
      const [apiResult] = await Promise.all([
        analyzeText(t),
        delay(1500 + Math.random() * 500),
      ]);
      setResult(apiResult);
      requestAnimationFrame(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to analyze right now. Please check backend service and try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [text]);

  return (
    <div className="ayur-surface relative min-h-screen">
      <div
        className="ayur-grid pointer-events-none absolute inset-0 -z-10 min-h-full"
        aria-hidden
      />

      <header className="sticky top-0 z-50 border-b border-black/[0.06] bg-white/75 backdrop-blur-xl backdrop-saturate-150">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <span className="text-lg font-medium tracking-[-0.02em] text-[#1a1a1a]">
            AyurGuard
          </span>
          <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
            Research integrity
          </span>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 pb-20 pt-12 sm:px-6 sm:pt-16 lg:px-8 lg:pt-20">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
            Plagiarism screening for Ayurveda
          </p>
          <h1
            className={cn(
              "mx-auto mt-5 bg-clip-text text-4xl font-medium leading-[1.08] tracking-[-0.02em] text-transparent sm:text-5xl md:mt-7 md:text-6xl md:leading-[1.06]",
              "bg-[linear-gradient(158deg,#1f1f1f_0%,#454240_32%,#3f5c52_58%,#6f7f7a_85%,#8a9490_100%)]"
            )}
          >
            Originality signals
            <br />
            <span className="font-medium">scholars actually trust.</span>
          </h1>
          <p className="font-subtitle mx-auto mt-5 max-w-md text-sm font-normal leading-[1.68] tracking-[0.01em] text-[#5a5a5a] antialiased sm:max-w-lg sm:text-[0.9375rem] sm:leading-[1.7] md:mt-6 md:max-w-xl">
            Built for PG, PhD, and journal workflows where generic detectors
            drown in shared dravya names and miss paraphrased ślokas. This
            release runs domain-tuned scoring via FastAPI with embeddings,
            cosine similarity, fuzzy matching, and Ayurvedic keyword boosting.
          </p>
          <ul className="mt-8 flex flex-wrap justify-center gap-x-8 gap-y-3 md:mt-10">
            {trustPoints.map((item) => (
              <li
                key={item}
                className="flex items-center gap-2 text-sm font-medium text-foreground/90"
              >
                <span
                  className="size-1.5 shrink-0 rounded-full bg-primary"
                  aria-hidden
                />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-14 lg:mt-16">
          <div className="relative rounded-2xl border border-black/[0.07] bg-white p-1 shadow-[0_1px_0_rgba(0,0,0,0.04),0_32px_64px_-32px_rgba(15,45,40,0.18)]">
            <div className="rounded-[14px] bg-white px-4 py-8 sm:px-8 sm:py-10">
              <div className="flex flex-col gap-2 border-b border-black/[0.06] pb-6 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold tracking-[-0.02em] text-foreground sm:text-2xl">
                    Analyze manuscript
                  </h2>
                  <p className="mt-1 max-w-lg text-sm leading-relaxed text-muted-foreground">
                    Paste text below. Screening is assistive not a misconduct
                    finding.
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">
                  {result?.processingMs
                    ? `Processed in ~${(result.processingMs / 1000).toFixed(1)}s`
                    : "Typical response in ~1.5–6s"}
                </p>
              </div>

              <div className="mt-8 space-y-8">
                <div className="space-y-3">
                  <Label
                    htmlFor="manuscript"
                    className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground"
                  >
                    Manuscript excerpt
                  </Label>
                  <Textarea
                    id="manuscript"
                    placeholder={PLACEHOLDER}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    disabled={loading}
                    rows={11}
                    className="min-h-[260px] resize-y rounded-xl border-black/[0.08] bg-[oklch(0.985_0.006_95)] text-[15px] leading-[1.65] shadow-inner placeholder:text-muted-foreground/55 focus-visible:border-primary/35 focus-visible:ring-primary/15 md:text-[15px]"
                  />
                  <p className="text-xs text-muted-foreground">
                    {text.trim().length > 0
                      ? `${text.trim().length.toLocaleString()} characters`
                      : "Longer excerpts yield stronger segment-level analysis."}
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
                  <div className="space-y-3">
                    <Label
                      htmlFor="url"
                      className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground"
                    >
                      Source URL
                    </Label>
                    <div className="relative">
                      <Link2
                        className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/45"
                        aria-hidden
                        strokeWidth={1.75}
                      />
                      <Input
                        id="url"
                        disabled
                        placeholder="https://…"
                        className="h-11 cursor-not-allowed rounded-xl border-black/[0.08] bg-black/[0.03] pl-10 text-muted-foreground"
                      />
                    </div>
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      URL ingestion is on the roadmap — paste article text for
                      now.
                    </p>
                  </div>
                  <Button
                    type="button"
                    disabled={loading}
                    onClick={analyze}
                    className="h-11 shrink-0 rounded-xl px-6 text-sm font-semibold tracking-tight shadow-sm sm:h-11"
                  >
                    {loading ? (
                      <>
                        <Loader2
                          className="size-4 animate-spin"
                          aria-hidden
                          strokeWidth={2}
                        />
                        Running
                      </>
                    ) : (
                      <>
                        Run analysis
                        <ArrowRight className="size-4" strokeWidth={2} />
                      </>
                    )}
                  </Button>
                </div>

                {error ? (
                  <p
                    className="rounded-xl border border-destructive/25 bg-destructive/[0.06] px-4 py-3 text-sm text-destructive"
                    role="alert"
                  >
                    {error}
                  </p>
                ) : null}

                {loading ? (
                  <div className="space-y-3 border-t border-black/[0.06] pt-8">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2
                        className="size-4 animate-spin text-primary"
                        aria-hidden
                      />
                      Embedding segments, fuzzy-match on transliterations…
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Skeleton className="h-28 rounded-xl bg-black/[0.05]" />
                      <Skeleton className="h-28 rounded-xl bg-black/[0.05]" />
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        {result ? (
          <section
            ref={resultsRef}
            className="mt-16 scroll-mt-24 space-y-10 lg:mt-20"
            aria-live="polite"
          >
            <div className="flex flex-col gap-2 border-b border-black/[0.06] pb-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
                  Results
                </p>
                <h2 className="font-display mt-2 text-2xl font-normal tracking-tight text-foreground sm:text-3xl">
                  Similarity report
                </h2>
              </div>
              <p className="max-w-sm text-sm text-muted-foreground">
                Generated from live backend analysis using domain-aware scoring.
              </p>
            </div>

            <ScoreDisplay score={result.score} band={result.scoreBand} />

            <div className="rounded-2xl border border-black/[0.06] bg-white/90 px-6 py-6 shadow-sm sm:px-8 sm:py-7">
              <h3 className="font-display text-base font-normal tracking-tight text-foreground">
                Interpreting the index
              </h3>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-[15px] md:leading-relaxed">
                The score blends{" "}
                <span className="font-medium text-foreground">
                  sentence-level semantics
                </span>{" "}
                with{" "}
                <span className="font-medium text-foreground">
                  character-level fuzzy matching
                </span>{" "}
                (e.g. Chyavanaprāśa vs. Chyawanprash) and boosts aligned
                classical phrasing. Dense shared terminology in methods sections
                is discounted when it matches known boilerplate patterns.
              </p>
            </div>

            <Card className="overflow-hidden rounded-2xl border-black/[0.06] bg-white shadow-[0_1px_0_rgba(0,0,0,0.04)] ring-0">
              <CardHeader className="space-y-1 border-b border-black/[0.06] bg-black/[0.02] px-6 py-5 sm:px-8">
                <CardTitle className="font-display text-lg font-normal tracking-tight">
                  Flagged segments
                </CardTitle>
                <CardDescription className="text-sm leading-relaxed">
                  Review for citation, paraphrase quality, or template overlap
                  with indexed literature.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5 px-4 py-6 sm:px-8 sm:py-8">
                {result.segments.map((seg, i) => (
                  <article
                    key={seg.id}
                    className={cn(
                      "rounded-xl border border-black/[0.06] bg-[oklch(0.995_0.004_95)] px-5 py-5 sm:px-6",
                      "border-l-[3px]",
                      result.scoreBand === "high"
                        ? "border-l-[oklch(0.58_0.2_25)]"
                        : result.scoreBand === "medium"
                          ? "border-l-[oklch(0.72_0.14_75)]"
                          : "border-l-[oklch(0.52_0.14_155)]"
                    )}
                  >
                    <p className="font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
                      Segment {String(i + 1).padStart(2, "0")}
                    </p>
                    <p className="mt-3 text-[15px] font-medium leading-relaxed text-foreground">
                      {seg.text}
                    </p>
                    <p className="mt-4 border-t border-black/[0.06] pt-4 text-sm leading-relaxed text-muted-foreground">
                      {seg.explanation}
                    </p>
                  </article>
                ))}
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-black/[0.06] bg-white shadow-[0_1px_0_rgba(0,0,0,0.04)] ring-0">
              <CardHeader className="border-b border-black/[0.06] px-6 py-5 sm:px-8">
                <CardTitle className="font-display text-lg font-normal tracking-tight">
                  Closest references
                </CardTitle>
                <CardDescription className="text-sm">
                  Best-matching indexed references with similarity percentages.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 px-4 py-6 sm:px-8 sm:py-8">
                {result.sources.map((src) => (
                  <div
                    key={src.id}
                    className="group rounded-xl border border-black/[0.06] bg-white px-5 py-4 transition-colors hover:bg-black/[0.02] sm:px-6"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0 flex-1">
                        <h3 className="text-[15px] font-semibold leading-snug tracking-tight text-foreground">
                          {src.title}
                        </h3>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {src.venue} · {src.year}
                        </p>
                      </div>
                      <span
                        className={cn(
                          "shrink-0 rounded-lg px-2.5 py-1 text-center font-mono text-xs font-semibold tabular-nums",
                          src.similarity >= 60
                            ? "bg-[oklch(0.96_0.04_25)] text-[oklch(0.4_0.15_25)]"
                            : src.similarity >= 40
                              ? "bg-[oklch(0.97_0.04_85)] text-[oklch(0.42_0.1_65)]"
                              : "bg-[oklch(0.96_0.04_155)] text-[oklch(0.38_0.1_155)]"
                        )}
                      >
                        {src.similarity}%
                      </span>
                    </div>
                    <p className="mt-4 border-l-2 border-primary/25 pl-4 text-sm leading-relaxed text-muted-foreground">
                      {src.snippet}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <p className="text-center text-xs text-muted-foreground">
              AyurGuard analysis is assistive and should be reviewed by faculty,
              reviewers, or editors before final decisions.
            </p>
          </section>
        ) : null}
      </div>

      <footer className="border-t border-black/[0.06] bg-white/60 py-10 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-4 text-center text-xs leading-relaxed text-muted-foreground sm:px-6">
          For Ayurvedic colleges, guides, and editorial desks. Does not replace
          publisher policy or committee judgment.
        </div>
      </footer>
    </div>
  );
}
