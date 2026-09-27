---
name: dax-expert
description: "Use for DAX measures, time intelligence, KPI models."
version: 0.1.0
author: ARKAN (for Shams Tabrez), Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [DAX, Time-Intelligence, KPI, Financial-Models, Performance]
    related_skills: [powerbi-architect, fabric-architect]
---

# DAX Expert Skill

Enterprise DAX and semantic-modeling procedures: time intelligence, KPI and financial calculation patterns, model hygiene, and performance-safe formulas. Patterns follow SQLBI DaxPatterns conventions. Pair with powerbi-architect for workspace and security design.

## When to Use
- Writing or reviewing complex DAX measures (time intelligence, ratios, running totals)
- Designing KPI calculations with correct filter-context semantics
- Financial models: YoY, YTD, MTD, variance-to-budget, ABC classification
- Diagnosing slow measures or wrong totals
- Don't use for: model architecture decisions (powerbi-architect)

## Procedure
1. **Model check before formula check.** Wrong totals are usually a model problem: confirm star schema, correct date dimension marked as date table, proper relationships (one-to-many, single direction). Completion criterion: model checklist passes before any formula work.
2. **Measure spec.** Write business definition in words first (numerator, denominator, filter behavior, blank handling). Completion criterion: spec approved by the business owner.
3. **Implement with patterns.** Time intelligence via CALCULATE + date-table filters (or dedicated time-intel functions); totals-safe logic via iterators and SUMMARIZE; ratio = divide sums, never sum of ratios. Completion criterion: measure returns correct grand totals and per-slice values.
4. **Filter-context tests.** Test each measure: grand total, single category, date slice, cross-filter from another table. Completion criterion: all four contexts verified in a test page.
5. **Variable discipline.** VAR for repeated expressions; RETURN single expression; comment the business rule inline. Completion criterion: no measure longer than needed; readable top-to-bottom.
6. **Performance pass.** Avoid FILTER over whole tables; prefer CALCULATE modifiers; check with DAX Studio query plans; materialize heavy logic in the model where possible. Completion criterion: measure evaluates < 100ms on production volumes (or documented exception).
7. **Documentation.** Each business KPI has: description, formula owner, refresh dependency, known caveats. Completion criterion: description fields filled in the model.

## Quick Reference
- **Golden rules:** DIVIDE() always (blank-safe); never SUMX over CALCULATE loops for simple aggregations; TREATAS for virtual relationships; KEEPFILTERS to respect slicers inside CALCULATE.
- **Time intelligence:** mark the date table; use DATESYTD/DATESMTD/DATESQTD or CALCULATE with date bounds; fiscal calendars need custom date tables, not built-ins.
- **Financial patterns:** YTD + prior-year via SAMEPERIODLASTYEAR; variance = actual - budget on a dimension-adjusted model; ABC/Pareto via running percentage over ranked SUMMARIZE.
- **Debug order:** context filters -> relationships -> iterator cardinality -> formula.

## Pitfalls
- **Totals that lie:** measure correct per row, wrong at total. Use iterator + context-aware logic, verify at grand total.
- **Implicit measures:** dragging columns instead of explicit measures bypasses standards. Disable implicit measures tenant-side.
- **Bidirectional filters as crutch:** fixes a blank today, breaks totals tomorrow. Fix the relationship direction.
- **Copy-paste measures:** one KPI defined three ways across models. Central shared model prevents dialect drift.

## Verification
- Test page with context matrix passes for every shipped measure.
- Performance profile attached for heavy measures; descriptions complete.

## Deeper Sources
- sql-bi/DaxPatterns (financial, time-intelligence, KPI patterns)
- MicrosoftDocs/powerbi-docs (DAX reference)
