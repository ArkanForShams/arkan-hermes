---
name: executive-briefing-ai
description: "Use for AI-drafted executive briefs with verification."
version: 0.1.0
author: ARKAN (for Shams Tabrez), Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [Briefings, Summarization, Verification, Digests]
    related_skills: [executive-reporting, pmo-reporting, prompt-engineer, executive-coach]
---

# Executive Briefing AI Skill

AI-assisted generation of executive briefings from project and portfolio data: status summaries, meeting briefs, decision memos, and weekly digests - with verification gates so nothing reaches an executive unverified.

## When to Use
- Producing weekly/monthly executive summaries from delivery data
- Drafting pre-reads, decision memos, and meeting briefs at scale
- Summarizing project one-pagers into portfolio narratives
- Don't use for: metric definitions (pmo-reporting), steering pack structure (executive-reporting), human prep drills (executive-coach)

## Procedure
1. **Source inventory.** Map data feeds: status one-pagers, RAID logs, decision log, metrics dashboard, calendar. Completion criterion: feeds listed with freshness and owner each.
2. **Template set.** Weekly digest (<=1 page), decision memo (options + recommendation), meeting brief (context + likely questions), exception alert. Completion criterion: templates approved by the executive audience once.
3. **Generation pass.** Draft per template from sources only; every figure carries a source reference; no invented numbers, no smoothed-over reds. Completion criterion: draft with source annotations on all figures.
4. **Verification gate.** Cross-check each claim against source; flag anything stale (> 7 days); RAG colors must match evidence thresholds (pmo-reporting). Completion criterion: zero unsourced claims; stale items marked.
5. **Tone pass.** For Shams: formal, tactful, calm; problems framed with options; no alarm language, no sugar-coating. Completion criterion: tone checklist passes.
6. **Human review before send.** Shams reviews/approves every executive-bound output (standing rule: nothing sends on his behalf without approval). Completion criterion: approval recorded.
7. **Feedback loop.** Track which sections get read/questioned; prune what executives skip. Completion criterion: template revised quarterly on observed usage.

## Quick Reference
- **AI drafts, human signs:** generation accelerates; accountability stays with Shams. Always.
- **Red stays red:** never let summarization soften a red status. Verification gate exists for exactly this.
- **Three numbers rule** (executive-reporting) applies to AI drafts too.
- **Freshness floor:** any source older than 7 days is flagged, not silently included.

## Pitfalls
- **Hallucinated status:** inventing progress from plausible text. Sources-only generation prevents it.
- **Green-washing drift:** iterative summarization slowly brightens bad news. Compare against raw data each cycle.
- **Template bloat:** digests growing toward 5 pages. Enforce the page limit ruthlessly.
- **Automation without review:** an unverified AI brief reaching an executive is a one-strike reputation risk.

## Verification
- Briefings produced on cadence with 100% source-backed figures.
- Approval trail exists for every sent briefing.
- Stale-data flags present where applicable; reds preserved verbatim.

## Deeper Sources
- prompt-engineer (generation and validation patterns)
- executive-reporting (pack structure), pmo-reporting (metric feeds)
