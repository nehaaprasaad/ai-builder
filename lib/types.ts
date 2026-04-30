export type ScoreBand = "low" | "medium" | "high";

export interface SuspiciousSegment {
  id: string;
  text: string;
  explanation: string;
}

export interface SimilarSource {
  id: string;
  title: string;
  venue: string;
  year: string;
  similarity: number;
  snippet: string;
}

export interface AnalysisResult {
  score: number;
  scoreBand: ScoreBand;
  summaryExplanation: string;
  segments: SuspiciousSegment[];
  sources: SimilarSource[];
  processingMs?: number;
}
