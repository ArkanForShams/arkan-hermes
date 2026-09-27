---
name: technical-debt-advisor
description: "Use for codebase debt scoring and paydown planning."
version: 0.1.0
author: ARKAN (for Shams Tabrez), Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [Tech-Debt, Hotspots, Refactoring, Guardrails, Strangler]
    related_skills: [technology-portfolio-advisor, cto-advisor, devops-architect, code-review-expert]
---

# Technical Debt Advisor Skill

Codebase-level technical debt management: inventory via hotspots, interest/principal scoring, paydown strategies, refactor-vs-rewrite decisions, and guardrails that stop debt accumulating silently.

## When to Use
- Building or refreshing the codebase debt register
- Deciding and sequencing refactoring work; refactor vs rewrite calls
- Setting up anti-accumulation guardrails (complexity gates, dependency automation)
- Don't use for: portfolio-level debt funding (technology-portfolio-advisor), delivery scheduling (program-manager)

## Procedure
1. **Debt inventory.** Hotspots = code churn x complexity (the highest-churn, most-complex files are where debt bites); known pain areas from incident history and team survey; dependency staleness (outdated, vulnerable, abandoned packages). Completion criterion: hotspot list + dependency report current.
2. **Score each item.** Interest rate (how much it costs NOW: slowdown, bugs, onboarding pain), principal (cost to fix, in person-days), risk of inaction (incident probability, security exposure). Completion criterion: scored register; items measurable in days, not vibes.
3. **Prioritize and fund.** High-interest + high-risk first; feed the top items into technology-portfolio-advisor scoring so debt competes for capacity like features - debt without a value case never gets funded. Completion criterion: top items in the funded backlog.
4. **Paydown strategies.** Boy-scout rule (touched code leaves better - bounded, not balloon refactors); strangler-fig for legacy replacement (route-by-route, module-by-module); dedicated debt capacity (15-20% per sprint, protected); DEBT comment convention (// DEBT: <issue> tracked in register). Completion criterion: strategy per debt class chosen and visible.
5. **Refactor vs rewrite decision.** Rewrite only when: change cost > rebuild + run cost AND the domain is stable enough to specify AND the team can own the new thing. Otherwise refactor incrementally. Decision via ADR (cto-advisor memo). Completion criterion: ADR for any rewrite call.
6. **Guardrails.** CI complexity/coverage gates for NEW code (old code grandfathered but tracked); dependency update automation (Renovate/Dependabot + test gate); architecture conformance tests for layering rules (dotnet-architect). Completion criterion: gates active; debt trend not rising.
7. **Monthly review.** Debt burned down vs added; trend reported in business terms (cost of change, incident rate) to leadership via technology-portfolio-advisor. Completion criterion: monthly trend with one committed action.

## Quick Reference
- **Debt language for leadership:** "feature X takes 3 weeks instead of 3 days because of Y" - cost of change, not code aesthetics.
- **Strangler fig steps:** intercept facade -> route slices to new code -> retire old slice -> remove facade. Never big-bang.
- **15-20% debt capacity** is the sustainable rate; zero capacity means the debt compounds silently.
- **Churn x complexity matrix:** fix what changes often AND hurts; frozen ugly code is low priority.

## Pitfalls
- **The big rewrite that never ships:** 18 months of parallel development, zero delivered value. Incremental or ADR-justified.
- **Debt as guilt trip:** nagging without cost language stays unfunded. Score it in days and risk.
- **Boy-scout scope creep:** "just cleaning up" consuming a sprint - bound it to the touched code.
- **Style preferences masquerading as debt:** naming taste is not debt; measurable cost is.
- **Gate avoidance:** complexity gates bypassed with exceptions until meaningless. Exceptions require ADR.

## Verification
- Debt register current with interest/principal/risk scores; top items funded.
- Guardrails active in CI; dependency automation running with green tests.
- Monthly trend reported; refactors and rewrites documented via ADRs.

## Deeper Sources
- technology-portfolio-advisor (funding), cto-advisor (ADRs), devops-architect (gates), code-review-expert (new-debt prevention)
