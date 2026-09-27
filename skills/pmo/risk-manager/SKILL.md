---
name: risk-manager
description: "Use for RAID logs, project risk, and escalation."
version: 0.1.0
author: ARKAN (for Shams Tabrez), Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [RAID, Risk, Issues, Assumptions, Dependencies]
    related_skills: [program-manager, pmo-advisor, ai-governance]
---

# Risk Manager Skill

RAID discipline and project risk management: Risks, Assumptions, Issues, Dependencies in one living log; assessment, ownership, mitigation, and escalation.

## When to Use
- Setting up or auditing RAID logs for projects/programs
- Risk assessment, mitigation planning, contingency triggers
- Assumption validation and dependency tracking
- Don't use for: portfolio-level risk appetite (portfolio-manager), AI-specific risk tiers (ai-governance)

## Procedure
1. **One log, four views.** Single RAID log: Risks (future harm), Assumptions (believed facts), Issues (present harm), Dependencies (external needs). Consistent IDs, owners, dates. Completion criterion: log live, linked from project status.
2. **Assess risks.** Probability 1-5 x Impact 1-5 = exposure. Response: avoid, mitigate, transfer, accept. Every risk: owner (a person, not a team), action, due date, review date. Completion criterion: no ownerless risks; red risks have mitigation with date.
3. **Validate assumptions.** Each assumption: how it will be validated, by when, by whom. An assumption that expires unvalidated becomes a risk automatically. Completion criterion: assumption register with validation dates.
4. **Drive issues.** Every issue: action, owner, due date. Aging > 7 days escalates automatically. Completion criterion: issue aging report reviewed weekly.
5. **Track dependencies.** Owner, due date, fallback plan, blast radius if missed. Completion criterion: every dependency has a fallback note.
6. **Top-5 review weekly.** Top five by exposure, with movement: worsening / stable / improving. New risks entered since last week called out. Completion criterion: top-5 discussed in the weekly review, not just emailed.
7. **Contingency triggers.** For red risks: pre-agreed trigger ("if X happens by date Y") and the pre-planned response. Completion criterion: trigger + plan written before the risk fires.

## Quick Reference
- **Risk vs issue:** risk = might happen; issue = happening. Different handling, same log.
- **A risk without an owner is a wish.** A mitigation without a date is a hope.
- **Escalate early:** bad news does not improve with age.
- **Risk appetite belongs to the sponsor**, not the PM; record it and report against it.

## Pitfalls
- **Graveyard log:** updated monthly, read never. The weekly top-5 keeps it alive.
- **Double-counting:** the same risk listed in three views with three IDs. One entry, many references.
- **Vague risks:** "resources" is not a risk; "DBA team unavailable during migration window in November" is.
- **Mitigation theater:** actions without dates or evidence of completion.

## Verification
- RAID log current within 7 days; weekly top-5 review evidenced.
- All red risks have owned mitigations with dates; assumption validation on schedule.
- Escalations fired per the aging rules.

## Deeper Sources
- PMI risk management practice (github.com/PMI)
- NIST risk frameworks (usnistgov) for governance-grade risk structure
