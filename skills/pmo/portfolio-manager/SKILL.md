---
name: portfolio-manager
description: "Use for portfolio intake, prioritization, and balance."
version: 0.1.0
author: ARKAN (for Shams Tabrez), Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [Portfolio, Intake, Prioritization, Capacity, Alignment]
    related_skills: [pmo-advisor, ai-portfolio-advisor, program-manager]
---

# Portfolio Manager Skill

Portfolio procedures: demand intake, scoring-based prioritization, capacity checks, and portfolio balancing across run/grow/transform. The single front door for work entering the IT department.

## When to Use
- Managing demand intake and the project request pipeline
- Prioritization conflicts; scoring models; capacity vs commitments
- Quarterly portfolio balancing and strategic alignment checks
- Don't use for: PMO governance design (pmo-advisor), delivery of a program (program-manager)

## Procedure
1. **Single intake door.** One form, one page: problem, business value, requested by, size estimate, risk. No side doors - side-channel requests get routed in. Completion criterion: intake form live and referenced by leadership.
2. **Score everything.** Weighted score: business value (revenue/cost/risk/strategic) 40, effort 25, risk 20, strategic alignment 15. Weights agreed ONCE with leadership, then applied without exception. Completion criterion: scoring sheet with weights signed off.
3. **Prioritize into lanes.** Must-do (regulatory/operational) / High-value / Fill-in / Parked. Every parked item has a revisit trigger. Completion criterion: portfolio table with lanes, no unranked items.
4. **Capacity check.** Team capacity math: available person-months vs committed load; WIP limits per team. Overcommitment is cut here, not in the sprint. Completion criterion: capacity table; committed load <= 85%.
5. **Balance the mix.** Run (keep lights on) / Grow (enhance) / Transform (new capability) - target roughly 60/25/15; quick wins vs structural. Completion criterion: mix reviewed against target each quarter.
6. **Strategic alignment test.** Every item maps to a business objective; orphans are challenged or killed. Completion criterion: zero ownerless, objective-less active items.
7. **Kill review.** Monthly: items with slipping start, lost sponsor, or stale benefit get killed or re-scoped. Completion criterion: kill decisions logged, not deferred.

## Quick Reference
- **Cost of delay ranking:** what does waiting a month cost? Rank by that, not by who shouts.
- **Everything is Priority 1** means no prioritization exists; scoring removes politics.
- **Capacity is the constraint:** a plan ignoring capacity is a wish list.
- **Zombie projects** die in step 7 or they eat the portfolio.

## Pitfalls
- **Pet projects** exempt from scoring - kills credibility instantly. Apply weights to everything.
- **Scoring gamed** after the fact to save a favorite. Weights change only at quarterly review.
- **Intake bypass:** executive side-door requests. Route them through scoring transparently.
- **100% committed teams:** zero slack = zero responsiveness. Protect the buffer.

## Verification
- Scored portfolio inventory current within 30 days; capacity table attached.
- Quarterly mix review completed with documented kill/re-scope decisions.
- Every active item: owner, sponsor, objective link, benefit statement, end date.

## Deeper Sources
- PMI portfolio management practice (github.com/PMI)
- SAFe Lean Portfolio Management concepts (community resources)
