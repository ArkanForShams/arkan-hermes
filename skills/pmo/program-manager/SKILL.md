---
name: program-manager
description: "Use for program delivery, milestones, and escalations."
version: 0.1.0
author: ARKAN (for Shams Tabrez), Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [Program, Milestones, Dependencies, Escalation, Tranches]
    related_skills: [risk-manager, pmo-advisor, portfolio-manager, executive-reporting]
---

# Program Manager Skill

Program delivery procedures: charter and outcome definition, tranche planning with acceptance criteria, dependency management, status rollups, and escalation discipline.

## When to Use
- Running a program (multiple related projects toward one outcome)
- Milestone planning, dependency mapping, escalation management
- Program status rollups and steering preparation
- Don't use for: portfolio-level balancing (portfolio-manager), RAID detail (risk-manager)

## Procedure
1. **Charter the outcome.** One sentence: what becomes true when the program succeeds (outcome, not output). Success measures + boundaries + named sponsor. Completion criterion: charter signed; measures measurable.
2. **Tranche plan.** Break into tranches with milestones that have ACCEPTANCE CRITERIA, not just dates. A milestone without acceptance criteria is a hope. Completion criterion: every milestone has criteria + owner.
3. **Dependency map.** Cross-project and external dependencies: what, who owns, due date, fallback if late. Review weekly; dependencies discovered at deadline are a planning failure. Completion criterion: dependency register current, each with fallback.
4. **Status rollup.** Weekly: per-project one-pagers -> program rollup with exceptions only. Green projects get one line. Completion criterion: rollup ready every week, under 2 pages.
5. **Escalation ladder.** Project PM -> program -> steering, with the 48-hour rule: anything stuck 48h escalates one level. Completion criterion: escalations logged with resolution dates.
6. **Benefits tracking.** With finance: baseline set at Gate 1, realized benefits measured at tranche ends. Completion criterion: benefits ledger updated per tranche.
7. **Close-out.** Outcome verified against success measures; lessons written; benefits owner handed to operations. Completion criterion: closure report accepted by sponsor.

## Quick Reference
- **Exception-based reporting:** executives read exceptions; green noise hides red signals.
- **Critical path review weekly:** the longest dependency chain is the program's real schedule.
- **Escalation ladder pre-agreed:** nobody wonders whether escalation is "allowed".
- **Milestone = criteria + date + owner.** Two of three is not a milestone.

## Pitfalls
- **Milestone theater:** dates celebrated, criteria ignored, integration deferred to the end.
- **Optimism rollups:** status by hope. Evidence-based RAG (pmo-advisor) is the cure.
- **Dependency ambush:** cross-team dependencies with no fallback. Plan B before Gate 2.
- **Benefits hand-waved:** claimed at kickoff, never measured. Finance partnership is mandatory.

## Verification
- Charter, tranche plan, dependency register, benefits ledger all exist and current.
- Weekly rollup delivered on schedule; escalations resolved within their level or moved up.
- No milestone passed without its acceptance criteria met.

## Deeper Sources
- PMI program management practice (github.com/PMI)
- SAFe program/ART patterns (community resources)
