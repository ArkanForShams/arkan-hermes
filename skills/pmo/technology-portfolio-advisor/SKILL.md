---
name: technology-portfolio-advisor
description: "Use for tech landscape health, debt, platform bets."
version: 0.1.0
author: ARKAN (for Shams Tabrez), Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [Landscape, Tech-Debt, Platforms, Consolidation, Strategy]
    related_skills: [portfolio-manager, cto-advisor, solution-architect]
---

# Technology Portfolio Advisor Skill

Strategic view of the technology portfolio: application landscape health, platform bets, technical debt as a portfolio item, and technology radar maintenance - the bridge between PMO portfolio and CTO strategy.

## When to Use
- Reviewing the application/technology landscape for health and overlap
- Deciding platform bets and consolidation opportunities
- Managing technical debt as portfolio items with value cases
- Don't use for: project-level delivery (program-manager), vendor selection detail (cto-advisor)

## Procedure
1. **Landscape inventory.** Applications: business function, users, criticality, health (support status, tech age, incident trend), annual cost. Completion criterion: inventory complete with health and cost per app.
2. **Health assessment.** Classify each: Invest / Maintain / Migrate / Retire. Overlap analysis: duplicate capability flagged for consolidation. Completion criterion: classification per app with rationale.
3. **Technical debt register.** Debt items scored as portfolio items: risk of inaction, cost to fix, value unlocked. Top debt competes in the normal portfolio scoring - debt without a value case never gets funded. Completion criterion: debt items scored alongside features.
4. **Platform bets.** Where to standardize (integration platform, identity, data platform, AI platform) vs stay heterogeneous. Each bet: ADR with exit analysis (cto-advisor scorecard). Completion criterion: platform ADRs current.
5. **Strategic alignment check.** Technology map vs business strategy: gaps (missing capability) and orphans (tech serving no objective). Completion criterion: gap/orphan list reviewed with leadership.
6. **Roadmap integration.** Landscape moves (migrations, consolidations) enter the portfolio roadmap via portfolio-manager intake. Completion criterion: no shadow roadmaps.
7. **Annual refresh.** Full landscape re-assessment yearly; health data (incidents, costs) monthly. Completion criterion: refresh scheduled and owned.

## Quick Reference
- **Treat debt as a product:** backlog, value case, roadmap slot - or it accumulates invisibly.
- **Consolidation beats addition:** every duplicate app is run-cost and risk.
- **Criticality drives investment:** revenue-touching systems get Invest first.
- **The landscape you don't measure, you don't manage:** incidents and cost per app are the health vitals.

## Pitfalls
- **Inventory rot:** landscape documented once, never updated. Tie refresh to the annual cycle.
- **Debt as guilt:** nagging without value cases. Score it or it stays unfunded.
- **Platform religion:** standardizing everything for its own sake. Standardize where integration cost dominates.
- **Shadow IT blindness:** untracked apps carrying real risk. Inventory includes discovery passes.

## Verification
- Landscape inventory current (annual refresh + monthly health data).
- Debt register scored in the live portfolio; platform ADRs on file.
- Gap/orphan review held with leadership; actions in the portfolio roadmap.

## Deeper Sources
- microsoft/architecture-center (landscape and modernization patterns)
- cto-advisor (ADR, vendor, platform decisions), portfolio-manager (intake)
