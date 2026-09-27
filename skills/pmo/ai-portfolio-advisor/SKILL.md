---
name: ai-portfolio-advisor
description: "Use for AI use-case portfolios and pilot gates."
version: 0.1.0
author: ARKAN (for Shams Tabrez), Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [AI-Portfolio, Use-Cases, Pilot-Gates, Value-Tracking]
    related_skills: [portfolio-manager, caio-advisor, ai-governance, ai-architect]
---

# AI Portfolio Advisor Skill

Managing the AI initiative portfolio as a portfolio discipline: intake scoring adapted for AI, use-case triage, pilot-to-production gates, value tracking, and portfolio-level AI risk view. Bridges portfolio-manager and caio-advisor.

## When to Use
- Building or reviewing the AI use-case portfolio for the department
- Deciding which AI pilots graduate to production (gate criteria)
- Tracking AI value realization and portfolio risk
- Don't use for: single-system architecture (ai-architect), enterprise AI strategy (caio-advisor)

## Procedure
1. **AI intake scoring.** Adapt portfolio-manager weights: business value 40, feasibility (data readiness + integration surface) 25, risk (privacy, compliance, error cost) 20, strategic fit 15. Completion criterion: scoring sheet applied to all candidate use cases.
2. **Triage into lanes.** Automate (high value, high confidence), Assist (human-in-loop copilots), Explore (timeboxed experiments with kill dates), Park (no data or no owner). Completion criterion: every use case in a lane with an owner.
3. **Pilot gate criteria.** A pilot graduates only with: eval results at threshold, named production owner, integration path, data-flow map (ai-governance), cost model. Anything else: kill at 90 days. Completion criterion: gate checklist applied per pilot.
4. **Value ledger.** Per production system: baseline measured before launch, value tracked monthly (hours saved, error reduction, cost per task). Completion criterion: ledger current; no system without a baseline.
5. **Portfolio risk view.** Aggregate: data exposure across systems, vendor concentration, model drift status, autonomous-action surface. Completion criterion: AI risk summary reviewed quarterly with ai-governance.
6. **Balance the AI mix.** Assist-heavy early (safer adoption), Automate where confidence proven; cap Explore spend; report mix to leadership. Completion criterion: mix reported with recommended shifts.
7. **Retire deliberately.** Systems whose value stalls or whose risk grows get sunset with data/deletion plan. Completion criterion: sunset decisions logged with cleanup dates.

## Quick Reference
- **Value before novelty:** score every use case by cost of the current manual process first.
- **90-day pilot rule:** no graduation by month 3 means kill or re-scope - pilot purgatory is the default failure.
- **Assist before Automate** where error cost is high; the autonomy ladder (ai-governance) governs the climb.
- **Portfolio-level thinking:** one hero pilot impresses; a balanced, gated pipeline transforms.

## Pitfalls
- **Demo-itis:** pilots chosen for wow factor, not scored value. The scoring sheet disarms this.
- **Value amnesia:** benefits claimed at kickoff, never measured. The ledger makes value real.
- **Risk silos:** each system assessed alone; portfolio aggregates hide exposure. Review the aggregate.
- **Orphaned pilots:** no production owner identified until after "success". Name the owner at intake.

## Verification
- Scored AI portfolio current; every pilot has gate status and owner.
- Value ledger live with baselines; quarterly AI risk review held.
- Kill/graduate decisions logged with dates - no zombie pilots.

## Deeper Sources
- caio-advisor (strategy, maturity), ai-governance (gates), ai-architect (build patterns)
- Azure-Samples/AI-Foundry-Samples (evaluation frameworks)
