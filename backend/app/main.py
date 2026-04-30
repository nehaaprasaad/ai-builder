from __future__ import annotations

import re
import time
import os
from contextlib import asynccontextmanager
from functools import lru_cache
from typing import Literal

# Limit BLAS/thread pools before numpy/torch pull them in (helps small hosts like Render free).
os.environ.setdefault("OMP_NUM_THREADS", "1")
os.environ.setdefault("MKL_NUM_THREADS", "1")

import numpy as np
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from rapidfuzz import fuzz
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity


AYURVEDIC_KEYWORDS = {
    "triphala",
    "ashwagandha",
    "chyawanprash",
    "chyavanaprasha",
    "rasayana",
    "agni",
    "ojas",
    "dravya",
    "shloka",
    "samhita",
    "charaka",
    "sushruta",
    "bhavaprakasha",
    "churna",
    "pathya",
    "virya",
    "vipaka",
    "dosha",
    "vata",
    "pitta",
    "kapha",
}


class SourceDoc(BaseModel):
    id: str
    title: str
    venue: str
    year: str
    text: str


CORPUS: list[SourceDoc] = [
    SourceDoc(
        id="s1",
        title="Rasayana in Ayurveda: Classical Foundations and Modern Therapeutic Perspectives",
        venue="Journal of Ayurveda and Integrative Medicine",
        year="2021",
        text=(
            "Rasayana supports preservation of Dhatu integrity and Ojas. Contemporary"
            " interpretation links Rasayana interventions with adaptive resilience,"
            " cognition support, and improved quality of life while retaining classical"
            " principles described in Charaka Samhita."
        ),
    ),
    SourceDoc(
        id="s2",
        title="Clinical Evaluation of Triphala in Gastrointestinal Disorders: A Randomized Pilot",
        venue="AYU (Quarterly Journal of Research in Ayurveda)",
        year="2019",
        text=(
            "Triphala churna was administered at 5 grams twice daily before food for"
            " eight weeks with pathya guidance. Outcomes included bowel habit,"
            " appetite, and Agni-related symptom scores."
        ),
    ),
    SourceDoc(
        id="s3",
        title="Textual Analysis of Medhya Rasayana in Chikitsa Sthana",
        venue="International Journal of Ayurvedic Medicine",
        year="2020",
        text=(
            "Commentarial readings of Chikitsa Sthana verses describe Medhya Rasayana"
            " as enhancing smriti and medha. Comparative references to Achara Rasayana"
            " emphasize conduct, cognition, and mental clarity."
        ),
    ),
    SourceDoc(
        id="s4",
        title="Ashwagandha Root Extract: Standardization and Adaptogenic Potential",
        venue="Ancient Science of Life",
        year="2018",
        text=(
            "Withania somnifera root extract is discussed under Balya and Rasayana"
            " indications. Standardization focuses on withanolide content and"
            " reproducible therapeutic quality for stress and vitality endpoints."
        ),
    ),
]


class AnalyzeRequest(BaseModel):
    text: str = Field(min_length=30, max_length=60000)


class SuspiciousSegment(BaseModel):
    id: str
    text: str
    explanation: str


class SimilarSource(BaseModel):
    id: str
    title: str
    venue: str
    year: str
    similarity: int
    snippet: str


class AnalyzeResponse(BaseModel):
    score: int
    scoreBand: Literal["low", "medium", "high"]
    summaryExplanation: str
    segments: list[SuspiciousSegment]
    sources: list[SimilarSource]
    processingMs: int


def split_sentences(text: str) -> list[str]:
    parts = re.split(r"(?<=[.!?])\s+", text.strip())
    clean = [p.strip() for p in parts if len(p.strip()) > 25]
    if clean:
        return clean
    return [text.strip()]


def normalize(text: str) -> str:
    lowered = text.lower()
    lowered = re.sub(r"[^a-z0-9\s-]", " ", lowered)
    return re.sub(r"\s+", " ", lowered).strip()


def keyword_boost(segment: str, source: str) -> float:
    seg_tokens = set(normalize(segment).split())
    src_tokens = set(normalize(source).split())
    overlap = seg_tokens.intersection(src_tokens).intersection(AYURVEDIC_KEYWORDS)
    # 0.0 .. 0.12 boost window
    return min(0.12, len(overlap) * 0.03)


def score_band(score: int) -> Literal["low", "medium", "high"]:
    if score < 30:
        return "low"
    if score <= 60:
        return "medium"
    return "high"


def explain(cosine: float, fuzzy_score: float, boost: float) -> str:
    if cosine >= 0.72:
        return (
            "High semantic proximity to indexed Ayurvedic literature (embedding cosine"
            f" {cosine:.2f}). Review paraphrase quality and citation completeness."
        )
    if fuzzy_score >= 0.72:
        return (
            "Strong lexical/fuzzy overlap on transliterated terms or structured phrasing"
            f" (fuzzy {fuzzy_score:.2f}). Confirm this wording is appropriately attributed."
        )
    if boost >= 0.06:
        return (
            "Contains dense overlap of domain-specific Ayurvedic terminology (formulations,"
            " Shloka-adjacent terms, or classical references). Validate context and attribution."
        )
    return "Moderate mixed overlap. Manual review recommended for citation and source phrasing."


@lru_cache(maxsize=1)
def get_model() -> SentenceTransformer:
    return SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")


def _encode_batch_size() -> int:
    return max(1, int(os.getenv("AYUR_ENCODE_BATCH_SIZE", "8")))


@lru_cache(maxsize=1)
def get_corpus_embeddings() -> np.ndarray:
    model = get_model()
    texts = [doc.text for doc in CORPUS]
    return model.encode(
        texts,
        convert_to_numpy=True,
        normalize_embeddings=True,
        batch_size=_encode_batch_size(),
    )


@asynccontextmanager
async def lifespan(app: FastAPI):
    # After upgrading RAM on Render/Railway, set AYUR_PRELOAD_MODEL=1 so the first user
    # request is not killed by cold-start model load + gateway timeout.
    if os.getenv("AYUR_PRELOAD_MODEL", "").lower() in ("1", "true", "yes"):
        get_model()
        get_corpus_embeddings()
    yield


app = FastAPI(title="AyurGuard API", version="1.0.0", lifespan=lifespan)
cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000")
origin_list = [o.strip() for o in cors_origins.split(",") if o.strip()]
# Browsers require Access-Control-Allow-Origin for cross-site fetch (e.g. Vercel → Render).
# By default, also allow any https://*.vercel.app host so preview URLs work without
# listing each one. Set CORS_DISABLE_VERCEL_REGEX=1 to turn that off.
_cors_kw: dict = {
    "allow_origins": origin_list,
    "allow_credentials": False,
    "allow_methods": ["*"],
    "allow_headers": ["*"],
}
if os.getenv("CORS_DISABLE_VERCEL_REGEX", "").lower() not in ("1", "true", "yes"):
    _cors_kw["allow_origin_regex"] = os.getenv(
        "CORS_VERCEL_REGEX",
        r"https://.*\.vercel\.app",
    )
app.add_middleware(CORSMiddleware, **_cors_kw)


@app.get("/")
def root() -> dict[str, str]:
    """Public base URL — browsers and HEAD / probes otherwise see 404."""
    return {
        "service": "AyurGuard API",
        "health": "/health",
        "analyze": "POST /analyze",
        "docs": "/docs",
    }


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/analyze", response_model=AnalyzeResponse)
def analyze(payload: AnalyzeRequest) -> AnalyzeResponse:
    started = time.perf_counter()
    text = payload.text.strip()
    if not text:
        raise HTTPException(status_code=400, detail="Text is required.")

    segments = split_sentences(text)
    model = get_model()
    corpus_embeddings = get_corpus_embeddings()

    seg_embeddings = model.encode(
        segments,
        convert_to_numpy=True,
        normalize_embeddings=True,
        batch_size=_encode_batch_size(),
    )
    cosine_matrix = cosine_similarity(seg_embeddings, corpus_embeddings)

    suspicious_rows: list[tuple[float, SuspiciousSegment]] = []
    source_best: dict[str, float] = {doc.id: 0.0 for doc in CORPUS}

    for i, segment in enumerate(segments):
        row = cosine_matrix[i]
        best_idx = int(np.argmax(row))
        best_doc = CORPUS[best_idx]

        cos = float(row[best_idx])
        fuzzy_raw = fuzz.token_set_ratio(normalize(segment), normalize(best_doc.text))
        fuzzy_score = fuzzy_raw / 100.0
        boost = keyword_boost(segment, best_doc.text)

        combined = (0.65 * cos) + (0.25 * fuzzy_score) + (0.10 * boost)
        source_best[best_doc.id] = max(source_best[best_doc.id], combined)

        if combined >= 0.53:
            suspicious_rows.append(
                (
                    combined,
                    SuspiciousSegment(
                        id=str(len(suspicious_rows) + 1),
                        text=segment,
                        explanation=explain(cos, fuzzy_score, boost),
                    ),
                )
            )

    # If no segment crosses threshold, still return top 2 for actionable output.
    if not suspicious_rows:
        scored = []
        for i, segment in enumerate(segments):
            row = cosine_matrix[i]
            best_idx = int(np.argmax(row))
            best_doc = CORPUS[best_idx]
            cos = float(row[best_idx])
            fuzzy_raw = fuzz.token_set_ratio(normalize(segment), normalize(best_doc.text))
            fuzzy_score = fuzzy_raw / 100.0
            boost = keyword_boost(segment, best_doc.text)
            combined = (0.65 * cos) + (0.25 * fuzzy_score) + (0.10 * boost)
            scored.append((combined, segment, cos, fuzzy_score, boost))

        scored.sort(key=lambda x: x[0], reverse=True)
        for combined, segment, cos, fuzzy_score, boost in scored[:2]:
            suspicious_rows.append(
                (
                    combined,
                    SuspiciousSegment(
                        id=str(len(suspicious_rows) + 1),
                        text=segment,
                        explanation=explain(cos, fuzzy_score, boost),
                    ),
                )
            )

    suspicious_rows.sort(key=lambda x: x[0], reverse=True)
    top_scores = [x[0] for x in suspicious_rows[:4]]
    raw_overall = float(np.mean(top_scores)) if top_scores else 0.0
    # Calibrated mapping for 0..100 signal (keeps typical academic overlap in moderate range)
    overall_score = int(round(np.clip((raw_overall - 0.25) * 140, 0, 100)))
    band = score_band(overall_score)

    if band == "low":
        summary = (
            "Lower overlap signal. Shared Ayurvedic terminology appears mostly in expected"
            " contexts; highlighted segments are still worth citation checks."
        )
    elif band == "medium":
        summary = (
            "Moderate overlap. Multiple segments align semantically or lexically with"
            " indexed Ayurvedic literature. Review highlighted passages before submission."
        )
    else:
        summary = (
            "Elevated overlap signal. Several passages show strong semantic/lexical alignment."
            " Prioritize attribution and paraphrase revision."
        )

    sources: list[SimilarSource] = []
    for doc in CORPUS:
        sim = int(round(np.clip(source_best[doc.id] * 100, 0, 100)))
        if sim <= 0:
            continue
        snippet = doc.text if len(doc.text) < 220 else f"{doc.text[:220].rstrip()}..."
        sources.append(
            SimilarSource(
                id=doc.id,
                title=doc.title,
                venue=doc.venue,
                year=doc.year,
                similarity=sim,
                snippet=snippet,
            )
        )
    sources.sort(key=lambda s: s.similarity, reverse=True)

    elapsed = int((time.perf_counter() - started) * 1000)
    return AnalyzeResponse(
        score=overall_score,
        scoreBand=band,
        summaryExplanation=summary,
        segments=[row[1] for row in suspicious_rows[:4]],
        sources=sources[:4],
        processingMs=elapsed,
    )
