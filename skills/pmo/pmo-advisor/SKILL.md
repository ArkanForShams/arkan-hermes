---
name: pmo-advisor
description: "Use for PMO setup, governance, and delivery assurance."
version: 0.1.0
author: ARKAN (for Shams Tabrez), Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [PMO, Governance, Stage-Gates, Delivery-Assurance, RAG]
    related_skills: [portfolio-manager, program-manager, risk-manager, pmo-reporting]
---

# PMO Advisor Skill

Governance and delivery-assurance procedures for standing up and running an IT PMO: PMO type selection, stage-gate governance, cadence design, and delivery health checks. Modeled on how a mature PMO organisation works - governance, delivery, portfolio, reporting, risk - not on administrative paperwork.

## When to Use
- Designing or maturing a PMO function for an IT department
- Defining project governance: stage gates, decision rights, review cadence
- Delivery assurance: health checks, gate reviews, escalation design
- Don't use for: portfolio prioritization (portfolio-manager), program delivery (program-manager), metrics design (pmo-reporting)

## Procedure
1. **Assess current state.** Inventory active projects, pain points (late surprises? budget overruns? zombie projects?), and what executives actually ask for. Completion criterion: pain-point list ranked with one example each.
2. **Choose the PMO type.** Supportive (templates + help on demand), Controlling (compliance gates), Strategic (portfolio + value + delivery assurance). For an IT department serving a group: start Strategic-lite - governance + reporting + portfolio input. Completion criterion: type chosen and charter written.
3. **Design stage gates.** Gate 0 Initiate (charter, sponsor, benefit) -> Gate 1 Plan (scope, schedule, budget, RAID baseline) -> Gate 2 Execute checkpoints -> Gate 3 Close (benefits review). Each gate: entry criteria, decision-maker, evidence required. Completion criterion: gate checklist per gate with named decision-maker.
4. **Set the cadence.** Weekly delivery review (status, blockers), monthly steering (decisions, exceptions), quarterly portfolio review. Completion criterion: calendar slots exist with named chairs.
5. **Define RAG with evidence.** Red/Green only with evidence: date slippage > X, variance > Y, blocked > Z days. Opinion-based RAG is banned. Completion criterion: thresholds documented and agreed.
6. **Standards pack.** Charter, one-page status, RAID log, milestone tracker, decision log - templates ≤ 2 pages each. Completion criterion: pack published, used by next project.
7. **Delivery assurance reviews.** Independent check at each gate: plan realistic? risks owned? dependencies mapped? Completion criterion: findings logged with actions and dates.
8. **Rollout.** Pilot on 2-3 live projects, iterate the pack, then scale. Completion criterion: pilot retrospective completed before scaling.

## Quick Reference
- **PMO success test:** fewer surprises for executives, faster decisions, no collapse-without-warning projects.
- **Escalation is a gift:** a stuck item escalated in 48h is professionalism, not failure.
- **Gate discipline:** no gate passes on promises; evidence or it does not pass.
- **Lighter is stronger:** every template page added reduces compliance.

## Pitfalls
- **Governance theater:** meetings that inform but decide nothing. Every meeting ends with decisions logged.
- **Green-until-collapse:** politics-driven RAG. Evidence thresholds are the antidote.
- **Template sprawl:** PMO as paperwork factory. Track decisions and risks, not documents.
- **PMO as police:** enforcement without service loses the room. Deliver value to PMs first.

## Verification
- Every active project has: charter, owner, sponsor, RAG with evidence, RAID log current within 7 days.
- Gate reviews held on schedule; decisions log maintained.
- Executive report accepted without rework two cycles running.

## Deeper Sources
- PMI (github.com/PMI) - PMBOK governance and delivery practice
- Microsoft Project/Planner and Power Platform PMO patterns (github.com/microsoft)
