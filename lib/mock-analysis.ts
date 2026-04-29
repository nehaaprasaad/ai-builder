import type { AnalysisResult, ScoreBand } from "@/lib/types";

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function bandForScore(score: number): ScoreBand {
  if (score < 30) return "low";
  if (score <= 60) return "medium";
  return "high";
}

function excerpt(text: string, max: number): string {
  const t = text.trim().replace(/\s+/g, " ");
  if (!t) return "";
  if (t.length <= max) return t;
  const cut = t.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > 40 ? cut.slice(0, lastSpace) : cut).trim() + "…";
}

function firstSentence(text: string): string {
  const t = text.trim();
  const m = t.match(/[^.!?]+[.!?]?/);
  return m ? m[0].trim() : excerpt(t, 160);
}

export function generateMockAnalysis(text: string): AnalysisResult {
  const trimmed = text.trim();
  const h = hashString(trimmed.slice(0, 800));
  const lenFactor = Math.min(18, Math.floor(trimmed.length / 400));

  const score = Math.min(
    86,
    Math.max(24, 32 + (h % 38) + lenFactor)
  );
  const scoreBand = bandForScore(score);

  const userBit = excerpt(firstSentence(trimmed) || trimmed, 140);

  const segments = [
    {
      id: "1",
      text:
        userBit ||
        "Rasayana therapy aims at conservation and transformation of energy for maintenance of homeostasis, with emphasis on Ojas and Agni in contemporary clinical interpretation.",
      explanation:
        "High semantic similarity (embedding cosine ~0.81) to published discussion of Rasayana and Ojas in a 2021 review abstract. Shared English gloss of classical concepts without verbatim match—typical Ayurvedic paraphrase pattern our model flags for manual review.",
    },
    {
      id: "2",
      text: "Triphala (Haritaki, Bibhitaki, Amalaki) was administered in churna form at 5 g twice daily before meals for eight weeks, alongside Pathya.",
      explanation:
        "Dense overlap on standard formulation nomenclature and dosing template. Fuzzy token match scores high on transliteration variants (e.g., Amalaki/Amlaki). Often legitimate in methods sections—cross-check against your prior publications and cited protocols.",
    },
    {
      id: "3",
      text: "As per Charaka Samhita, the Chikitsa Sthana verses on Medhya Rasayana emphasize rejuvenation of intellect and memory; the Shloka context aligns with later commentaries on Achara Rasayana.",
      explanation:
        "Segment clusters near indexed commentary passages that quote Sanskrit technical terms (Medhya, Achara Rasayana) in similar order. Suggests possible structural similarity to secondary sources—verify attribution if this parallels a published translation.",
    },
  ];

  const sources: AnalysisResult["sources"] = [
    {
      id: "s1",
      title:
        "Rasayana in Ayurveda: Classical Foundations and Modern Therapeutic Perspectives",
      venue: "Journal of Ayurveda and Integrative Medicine",
      year: "2021",
      similarity: Math.min(94, 68 + (h % 18)),
      snippet:
        "…conservation of Dhatu Sara and promotion of Ojas through Achara Rasayana and Aushadha Rasayana remains central to textual interpretation…",
    },
    {
      id: "s2",
      title:
        "Clinical Evaluation of Triphala in Gastrointestinal Disorders: A Randomized Pilot",
      venue: "AYU (Quarterly Journal of Research in Ayurveda)",
      year: "2019",
      similarity: 52 + (h % 12),
      snippet:
        "…Triphala churna 5 g BD before meals with Pathya for 8 weeks; primary outcomes included Agni assessment and subjective digestion scores…",
    },
    {
      id: "s3",
      title: "Semantic Models for Detecting Paraphrase in Sanskrit-English Medical Abstracts",
      venue: "Proceedings, CompMed-Ayur NLP Workshop",
      year: "2023",
      similarity: 41 + (h % 15),
      snippet:
        "…domain embeddings surface near-duplicates when classical terms (Rasa, Virya, Vipaka) co-occur in boilerplate pharmacology paragraphs…",
    },
    {
      id: "s4",
      title: "Ashwagandha (Withania somnifera) Root Extract: Standardization and Adaptogenic Claims",
      venue: "Ancient Science of Life",
      year: "2018",
      similarity: 36 + (h % 10),
      snippet:
        "…standardized extract containing withanolides; classical indication under Balya and Rasayana categories per API and Bhavaprakasha references…",
    },
  ];

  const summaryExplanation =
    scoreBand === "low"
      ? "This manuscript shows relatively limited overlap with our current reference snapshot. Shared Ayurvedic vocabulary (formulation names, theoretical constructs) is common in legitimate work; the score mainly reflects routine semantic proximity in methods-style language."
      : scoreBand === "medium"
        ? "Moderate overlap: several passages align semantically or lexically with indexed abstracts—especially where classical formulations and Rasayana framing appear. This is often expected in Ayurvedic research; review highlighted segments for citation and paraphrase quality rather than treating the score as a verdict."
        : "Elevated overlap signal: sustained similarity to one or more reference passages, including possible template-like structure around formulations or classical citations. We recommend prioritizing review of highlighted segments and verifying Shloka or translation attributions.";

  return {
    score,
    scoreBand,
    summaryExplanation,
    segments,
    sources: [...sources].sort((a, b) => b.similarity - a.similarity),
  };
}
