---
name: cto-advisor
description: "Use for tech strategy, vendor choices, and tech roadmaps."
version: 0.1.0
author: ARKAN (for Shams Tabrez), Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [CTO, Technology-Strategy, Vendor-Assessment, Roadmap]
    related_skills: [caio-advisor, ai-architect, executive-coach]
---

# CTO Advisor Skill

Advisory skill for technology strategy, architecture decisions, vendor assessment, and engineering leadership. Turns technical positions into business-language decisions with options tables and risk registers. It does not write code or design agent internals (use ai-architect).

## When to Use
- Build-vs-buy decisions, vendor selection, architecture reviews
- Technology roadmaps, platform strategy, legacy modernization
- Preparing CTO-track artifacts: decision memos, ADRs, risk registers
- Engineering team health and delivery-process questions
- Don't use for: AI strategy/operating model (caio-advisor), governance gates (ai-governance)

## Procedure
1. **Decision memo first.** Before any deep analysis, write: decision needed, options (3+), recommendation, why now. Completion criterion: memo fits one page.
2. **Options analysis.** For each option: 2-year TCO (licenses, people, migration, exit), fit with existing stack, security/compliance impact, team learning curve, exit cost. Completion criterion: comparison table with weights agreed by stakeholders.
3. **Vendor assessment scorecard.** Weight: business fit 30, technical fit 25, security & compliance 20, vendor viability & roadmap 15, exit & lock-in 15. Require: reference calls with two customers of similar size, sandbox proof-of-concept on YOUR data, contract exit clauses read before signing. Completion criterion: scorecard completed and a red-flag list written.
4. **Architecture decision record (ADR).** Capture: context, decision, alternatives rejected, consequences, review date. Completion criterion: ADR stored and linked from the decision memo.
5. **Roadmap with capacity.** Now / Next / Later, each item sized against real team capacity; nothing enters Now without a named owner. Completion criterion: no item is ownerless; buffer ≥20%.
6. **Risk register.** Top risks with likelihood, impact, mitigation, owner. Completion criterion: every red risk has a mitigation and a date.
7. **Engineering health check.** Delivery lead time, change-failure rate, on-call load, bus factor per critical system. Completion criterion: baseline measured, one improvement action chosen.

## Quick Reference
- **Build vs buy heuristic:** buy commodity, build differentiation; build only if you can own maintenance for 3+ years.
- **Vendor red flags:** no exit path, pricing cliffs at renewal, roadmap-only features, security review refused, single-tenant unavailable.
- **ADR template:** Context / Decision / Alternatives / Consequences / Review date.
- **Executive translation:** uptime → revenue protection; tech debt → cost of change; migration → risk window; PoC → de-risking spend.

## Pitfalls
- **Resume-driven architecture:** choosing technology for marketability, not fit. Ask: what problem does this remove?
- **PoC theater:** demos on toy data. Always PoC on real data volumes and real integration surfaces.
- **Lock-in blindness:** exit cost evaluated after commitment. Price the exit first.
- **Roadmap without capacity:** committing 120% of team hours. Cut scope, not quality.

## Verification
- Decision memo + scorecard + ADR exist for every significant choice.
- Roadmap has owners and capacity math; risk register reviewed within the last month.

## Deeper Sources
- microsoft/architecture-center (reference architectures, governance models)
- microsoft/semantic-kernel (platform build patterns)