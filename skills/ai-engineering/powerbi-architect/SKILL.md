---
name: powerbi-architect
description: "Use for Power BI architecture, embedding, governance."
version: 0.1.0
author: ARKAN (for Shams Tabrez), Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [Power-BI, Semantic-Model, Embedding, RLS, Performance]
    related_skills: [fabric-architect, dax-expert, ai-governance]
---

# Power BI Architect Skill

Design and governance procedures for enterprise Power BI: semantic model standards, workspace architecture, embedding, report automation, and performance tuning. Source material: Microsoft Power BI developer samples and powerbi-docs governance guidance. DAX detail lives in dax-expert.

## When to Use
- Designing workspace architecture, deployment pipelines, or the semantic model layer
- Embedded analytics (app-owns-data / user-owns-data decisions)
- Automating report generation, refresh, and distribution
- Performance tuning of slow reports or models
- Don't use for: Fabric storage design (fabric-architect), DAX formula patterns (dax-expert)

## Procedure
1. **Workspace architecture.** One workspace per stage per domain (dev/test/prod); apps for distribution; no personal workspaces in production. Completion criterion: workspace map with role assignments (viewer/contributor/member) documented.
2. **Semantic model standards.** Star schema mandatory; one shared model per domain consumed by thin reports; naming conventions; date dimension always. Completion criterion: model ERD reviewed against star-schema checklist.
3. **Governance setup.** Sensitivity labels end-to-end, certified/promoted endorsement, usage metrics review cadence, lineage review. Completion criterion: endorsement applied; orphaned reports retired quarterly.
4. **Embedding decision.** App-owns-data (SaaS product embedding, service principal + workspace v2) vs user-owns-data (internal portals where users have their own licenses, RLS flows from user identity). Completion criterion: ADR with auth flow, tenant settings, and cost model.
5. **Automation layer.** REST/XMLA for dataset operations, Power BI API for refresh + export (paginated report rendering for scheduled PDF), deployment pipelines for promotion. Completion criterion: refresh failures alert a named owner.
6. **Performance pass.** Measure with Performance Analyzer + DAX Studio: reduce visual count per page, avoid bidirectional filters, use measure references not recompute, star-schema join hygiene, incremental refresh for fact tables. Completion criterion: report opens < 5s p95 on production data.
7. **Security model.** RLS roles tested with the Test-as-role feature; dynamic RLS via USERPRINCIPALNAME where roles explode; OLS where column-level secrecy required. Completion criterion: RLS test matrix executed for every role.

## Quick Reference
- **Thin reports, fat models:** all logic in the shared model; visuals bind to measures only.
- **Refresh strategy:** incremental refresh policies for fact tables > millions of rows; XMLA endpoints for external refresh orchestration.
- **Governance artifacts:** tenant inventory, certified dataset list, RLS matrix, endorsement log.
- **Embedding cost levers:** capacity autoscale, caching, report-level filters to trim dataset scans.

## Pitfalls
- **Report sprawl:** hundreds of unowned reports with duplicated logic. Certified-model + thin-report policy prevents it.
- **Import-mode everything:** large datasets without incremental refresh; move to Direct Lake/DirectQuery per pattern.
- **Bidirectional relationship accidents:** ambiguity and slow queries. Use them only with written justification.
- **Ignoring tenant limits:** API and refresh throttling discovered in production. Capacity planning before rollout.

## Verification
- Workspace map, standards doc, RLS matrix, and performance baselines exist and reviewed.
- Refresh and alerting demonstrably working (evidence: alert history).

## Deeper Sources
- microsoft/PowerBI-Developer-Samples (embedding, APIs, automation)
- MicrosoftDocs/powerbi-docs (governance, security, performance)
- sql-bi/DaxPatterns (see dax-expert skill)
