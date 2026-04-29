# AyurGuard — Product Requirements Document

**Version:** 1.0 (MVP)  
**Document type:** Product specification for stakeholder submission  
**Status:** Draft for review  

---

## Executive summary

**AyurGuard** is a plagiarism and originality-assistance product for **Ayurvedic research**. It addresses limitations of generic detectors on **Sanskrit and transliterated terms**, **classical formulations**, **Shlokas**, and **shared domain vocabulary**—where lexical overlap is often legitimate and semantic paraphrase matters.

**MVP delivers:** text or URL input; an overall **0–100%** overlap signal; **highlighted segments** with short explanations; **ranked similar sources** with similarity scores; a **professional** web UI. **v1 explicitly excludes** PDF upload, user accounts/history, formal PDF reports, and guaranteed real-time scraping of external databases.

**Stack (as specified):** Next.js 15 (App Router), TypeScript, Tailwind, shadcn/ui; Python/FastAPI backend; `sentence-transformers/all-MiniLM-L6-v2` with **Ayurvedic keyword boosting**; **cosine similarity** plus **fuzzy matching** on domain terms.

---

## 1. Problem

Generic plagiarism tools are tuned for general academic prose and broad web corpora. In Ayurvedic papers they tend to:

- **Over-flag** unavoidable shared terms (e.g., classical drugs, formulations, theoretical constructs).
- **Under-detect** paraphrase of **Shlokas**, summaries of **Samhita** concepts, and equivalent wording under **different transliterations**.
- Provide **weak explanations**, which weakens trust for **guides, editors, and committees**.

AyurGuard is scoped to treat **Ayurvedic research text as a first-class domain**: combine **semantic similarity** with **term-level fuzzy logic** and **calibrated boosting** so scores and highlights support **human review**, not automated accusation.

---

## 2. Objectives

| Objective | Description |
|-----------|-------------|
| **Domain fit** | Meaningful signals on real Ayurvedic research (mixed English, transliterated Sanskrit, classical references). |
| **Actionability** | Users can see *which* passages drive concern and *why*, with ranked candidate matches. |
| **Performance** | **p95 response under 6 seconds** for defined input size (validated in testing). |
| **Trust** | Measured language, clear limits of the method and corpus, professional UI suitable for institutions. |

---

## 3. Target users

1. **PG scholars and PhD researchers** — self-check drafts before submission.  
2. **Faculty and research guides** — triage advisee work and target feedback.  
3. **Journal editors and peer reviewers** — integrity triage without replacing judgment.  
4. **Ayurvedic colleges and institutions** — consistent, domain-aware pre-check (deployment and governance can evolve post–v1).

---

## 4. Scope

### 4.1 In scope (MVP / v1)

- **Input:** pasted text **or** a **single URL** (server-side fetch and **main-body text extraction**; user informed if extraction fails).  
- **Output:**  
  - **Overall score 0–100%** with a **fixed, user-visible definition** (overlap / similarity signal vs. reference corpus and retrieval—not a legal finding).  
  - **Suspicious segments** with **brief, structured explanations** (e.g., sustained semantic nearness to a retrieved passage; long rare n-gram overlap; high-confidence fuzzy alignment on boosted terms in template-like order).  
  - **Top similar sources** with **per-source similarity %** and **evidence snippets**.  
- **UI:** clean, accessible, trustworthy; summary → priorities → highlighted text → sources.

### 4.2 Out of scope (v1)

- PDF upload and parsing  
- Authentication, profiles, and history  
- Advanced / branded PDF report packs  
- Committed **real-time** crawling of arbitrary external databases (v1 uses **bounded** retrieval/index; copy must not imply exhaustive coverage)

---

## 5. Functional requirements

**FR-1 — Input handling**  
Accept text within published limits; accept one URL with validation, timeouts, and SSRF-safe fetching. On failed extraction, return a clear error and recommend paste.

**FR-2 — Analysis pipeline**  
Segment input with sensible overlap; embed segments; retrieve/compare against an **allowed, bounded** reference set; apply **cosine similarity**, **fuzzy matching** on Ayurvedic/transliteration variants, and **documented keyword boosting/discount rules** to reduce false alarms on ubiquitous terms.

**FR-3 — Aggregate score**  
Compute and display **0–100%** per the published definition; tie the number to **top contributing factors** on the results screen.

**FR-4 — Highlights and explanations**  
Surface a **ranked list** of segments to review first; map highlights to **short rationale** and, where applicable, to **source evidence**.

**FR-5 — Similar sources**  
List **top matches** with **similarity %**, snippet, and **provenance** (e.g., indexed snapshot label or metadata link where permitted).

**FR-6 — Non-functional**  
**p95 latency < 6 s** for agreed reference inputs; HTTPS; input size limits; minimal sensitive logging; **privacy notice** stating processing purpose and **no v1 user history** by design.

---

## 6. User experience and positioning

- **Tone:** scholarly and neutral; avoid criminal framing.  
- **Transparency:** score definition, corpus limitations, and “assistive not definitive” disclaimer **in-product**.  
- **Trust:** consistent typography, clear hierarchy, no sensational red/green-only semantics without explanatory context.

---

## 7. Success criteria

- **Quality:** Internal **golden set** (including benign shared terminology, paraphrase of classical content, and clear patchwriting cases); targets for reviewer-rated usefulness of top alerts to be set with pilot users.  
- **Latency:** **p95 < 6 seconds** under agreed caps.  
- **Usability:** Users correctly identify **priority passages** in structured tests.  
- **Stakeholder fit:** Guides/editors rate UI and copy as **professional** and appropriate for formal use.

---

## 8. Risks and mitigations (summary)

- **Corpus limits → false negatives:** state coverage explicitly; avoid “complete internet” claims.  
- **Domain vocabulary → false positives:** boosting/discount rules and segment-level evidence, not score alone.  
- **URL fragility:** telemetry, fallbacks, paste path.  
- **Score misread:** definition + segment-first layout + conservative language.

---

## 9. Release checklist (v1)

- All **§5** requirements met for defined inputs.  
- Latency and error handling verified.  
- Golden-set evaluation documented with **known limitations**.  
- Legal/ethical copy: disclaimer, corpus bounds, processing notice.

---

*End of document.*
