---
name: research-agent
description: "Use for cited research briefs and due diligence."
version: 0.1.0
author: ARKAN (for Shams Tabrez), Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [Research, Synthesis, Verification, Briefs, Due-Diligence]
    related_skills: [prompt-engineer, arxiv, grounded-citations]
---

# Research Agent Skill

End-to-end research procedures: question framing, source gathering with verification, synthesis, and cited deliverables. Combines Hermes retrieval tools (web_search, web_extract, arxiv) with grounding discipline. Deep academic search lives in the arxiv skill; citation formatting in grounded-citations. Produces decision-ready briefs, not essay dumps.

## When to Use
- Technology, market, competitor, or vendor research briefs
- Evidence gathering before strategic decisions (build-vs-buy, adoption)
- Literature scans and technical due diligence
- Don't use for: prompt design (prompt-engineer), monitoring named companies over time (competitor-news-monitor)

## Procedure
1. **Frame the question.** Convert the request into: primary question, sub-questions (3-5), decision it feeds, definition of "enough evidence". Completion criterion: the requester confirms the framing before search begins.
2. **Plan source classes.** For each sub-question assign: primary sources (docs, filings, papers), secondary (analyst reports, reputable press), practitioner signals (forums, repos, benchmarks). Completion criterion: source plan written with target counts.
3. **Gather with breadth-first passes.** Round 1: broad web_search per sub-question (3-5 results each). Round 2: web_extract the 5-8 strongest candidates. Round 3: targeted follow-ups on gaps only. Completion criterion: each sub-question has 2+ independent sources or a documented gap.
4. **Verify before trusting.** Date-check everything (stale docs are the top failure); triangulate any load-bearing claim across two independent sources; distinguish vendor claims from third-party evidence; capture access date. Completion criterion: no single-source load-bearing claim survives.
5. **Synthesize, don't compile.** Structure: answer first, then evidence per sub-question, then confidence levels (high/medium/low), then open questions. Completion criterion: a decision-maker gets the point in the first 10 lines.
6. **Cite everything.** Every factual claim carries a source link; quotes marked; paraphrase distinguished from quotation. Completion criterion: zero uncited load-bearing claims.
7. **Deliver with an expiry.** Mark findings with a review date (tech: 3-6 months; market: 1-3 months). Completion criterion: brief states when it goes stale.

## Quick Reference
- **Search operator toolkit:** site:, filetype:, intitle:, "exact phrase", -excluded_term.
- **Source hierarchy for tech claims:** official docs > changelogs > issue trackers > benchmarks > blog posts > social.
- **Confidence language:** high = 2+ independent primaries agree; medium = one primary + plausible seconds; low = practitioner chatter only.
- **Two-hour cap:** if breadth-first passes exceed two hours, deliver the best-supported brief with explicit gaps - perfect is the enemy of decided.

## Pitfalls
- **Answer-shaped searching:** seeking evidence for the preferred conclusion. Write disconfirming searches (search for why-it-fails too).
- **SEO sludge:** content farms ranking over primary sources. Prefer docs and primary papers first.
- **Recency blindness:** citing a 2022 benchmark against a 2026 product. Check versions and dates every time.
- **Synthesis drift:** copying fragments instead of integrating. The brief must read as one voice with one conclusion.

## Verification
- Brief: answer, per-sub-question evidence, confidence levels, open questions, expiry date.
- Spot-check: 3 random citations resolve and support their claims.
- Disconfirming evidence explicitly noted for each major claim.

## Deeper Sources
- openai/openai-cookbook (RAG and evaluation patterns for knowledge retrieval)
- anthropics/prompt-eng-interactive-tutorial (structured analysis prompts)
- Hermes arxiv skill (academic search), grounded-citations skill (citation formats)
