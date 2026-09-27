---
name: pmo-reporting
description: "Use for PMO metrics, status reporting, and dashboards."
version: 0.1.0
author: ARKAN (for Shams Tabrez), Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [PMO-Metrics, Status, Dashboards, RAG, Automation]
    related_skills: [powerbi-architect, pmo-advisor, executive-reporting, pmo-copilot]
---

# PMO Reporting Skill

PMO metrics and reporting procedures: the standard metric set with definitions, report hierarchy, evidence-based RAG, dashboard design, and automation of the reporting pipeline.

## When to Use
- Designing PMO/portfolio metrics and status report formats
- Building delivery dashboards (Power BI/Fabric per powerbi-architect)
- Automating reporting from source systems
- Don't use for: executive brief narrative (executive-reporting), AI drafting of reports (pmo-copilot)

## Procedure
1. **Standard metric set.** Budget variance, schedule variance, project health, resource utilization, benefits realization, risk exposure, strategic alignment. Completion criterion: each metric has formula + data source + threshold + owner.
2. **Definitions locked.** A metric without a formula is an opinion. Write each: e.g., schedule variance = (actual/plan milestone progress - 1); health = evidence-based RAG per pmo-advisor thresholds. Completion criterion: metric dictionary published.
3. **Report hierarchy.** Project status (weekly, 1 page) -> program rollup (biweekly, exceptions) -> portfolio dashboard (monthly, executive). Completion criterion: formats published, cadence scheduled.
4. **Evidence-based RAG.** Colors come from thresholds, not moods. Red = trigger hit, with mitigation stated. Completion criterion: every RAG change traceable to a threshold or documented exception.
5. **Dashboard build.** One page, trend + exception, drill-through to detail; built per powerbi-architect standards on a certified semantic model. Completion criterion: p95 render < 5s; refresh automated.
6. **Automate the pipeline.** Pull from Planner/DevOps/finance APIs; zero manual rekeying - manual numbers rot and lie. Completion criterion: refresh failures alert a named owner.
7. **Narrative layer.** Numbers + three bullets: what changed, why, decision needed. Completion criterion: every report answers "what do you need from me?"

## Quick Reference
- **The seven metrics cover 90% of executive questions**; add more only on demand.
- **Report = decision tool, not history lesson.** If no decision is enabled, cut the section.
- **Variance thresholds** (e.g., >10% budget/schedule = red) agreed once, applied always.
- **Trend beats snapshot:** arrow > number for executive reading.

## Pitfalls
- **Vanity metrics:** activity counts that measure nothing. Every metric maps to a decision.
- **Manual massage:** numbers edited by hand before publishing. Automate or they drift.
- **Dashboard sprawl:** 12 pages nobody reads. One page, drilled.
- **Green bias:** status colored by fear of the sponsor. Evidence thresholds disarm it.

## Verification
- Metric dictionary current; every published RAG evidence-backed.
- Dashboard refreshes automatically; failure alerts fire.
- Reports delivered on cadence with decision bullets present.

## Deeper Sources
- microsoft/PowerBI-Developer-Samples + MicrosoftDocs/powerbi-docs
- microsoft/fabric-samples (executive dashboard patterns)
- See powerbi-architect for semantic model and workspace design
