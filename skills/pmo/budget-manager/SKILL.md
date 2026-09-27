---
name: budget-manager
description: "Use for IT budget tracking, forecasting, and variance."
version: 0.1.0
author: ARKAN (for Shams Tabrez), Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [Budget, Forecast, Variance, Cost, Business-Case]
    related_skills: [portfolio-manager, pmo-reporting, cto-advisor]
---

# Budget Manager Skill

IT budget and portfolio finance procedures: budget structure, variance tracking, forecasting, and cost-per-initiative visibility. Analysis and reporting only - spending decisions and payment execution stay with Shams and finance (standing rule; never execute transactions).

## When to Use
- Setting up IT budget tracking and monthly variance reporting
- Forecasting spend, run-rate analysis, cost-per-initiative views
- Business case cost sides and ROI math support
- Don't use for: investment product analysis (wealth/investing skills), payment execution (never)

## Procedure
1. **Budget structure.** Split: Run (operations, licenses, support) / Grow (enhancements) / Transform (new capability) aligned to portfolio lanes; capex vs opex tagged. Completion criterion: chart of accounts mapped to portfolio lanes.
2. **Baseline and track.** Budget per initiative approved at Gate 1; actuals loaded monthly; variance = actual vs plan with threshold flags (>10% amber, >20% red). Completion criterion: variance table current within 30 days.
3. **Forecast.** Rolling 3-month forecast per initiative: committed + expected + risk buffer. Completion criterion: forecast updated monthly with assumption notes.
4. **Cost-per-initiative.** Fully-loaded cost (people, licenses, infra) per initiative; cost per expected benefit unit where possible. Completion criterion: cost table reconcilable to finance numbers.
5. **Value case support.** For business cases: cost model, benefit model, payback period, sensitivity on key assumptions. Completion criterion: assumptions explicit; no single-point estimates presented as certain.
6. **Review cadence.** Monthly finance review with PMO: overruns surfaced with options (re-scope, re-fund, stop). Completion criterion: decisions logged in the decision register.
7. **Benefits handoff.** Realized benefits tracked with finance post-delivery (feeds benefits realization in portfolio reviews). Completion criterion: benefits ledger linked to budget lines.

## Quick Reference
- **Run/Grow/Transform visibility** prevents the silent growth of Run eating Transform.
- **Variance flags are thresholds, not opinions** (same discipline as RAG).
- **Forecast = committed + expected + buffer;** a forecast of only committed spend understates reality.
- **ARKAN boundary:** analysis and reporting only; never execute payments or hold payment data.

## Pitfalls
- **Spreadsheet sprawl:** budgets in 12 files with three versions of truth. One source, finance-reconciled.
- **Surprise renewals:** license/subscription renewals untracked. Renewal calendar with 90-day alerts.
- **Benefits claimed, costs hidden:** value cases that omit run costs. Fully-loaded or it does not pass review.
- **Budget as annual theater:** set in January, ignored until Q4 panic. Monthly variance review is the fix.

## Verification
- Variance table current; forecast with assumptions on file.
- Every active initiative has a cost line reconcilable to finance.
- Renewal calendar maintained; no unbudgeted auto-renewals.

## Deeper Sources
- Portfolio finance practice (PMI); finance system integrations per group policy
- budget decisions executed only through approved group finance processes
