---
name: fabric-architect
description: "Use for Microsoft Fabric estate design decisions."
version: 0.1.0
author: ARKAN (for Shams Tabrez), Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [Fabric, OneLake, Lakehouse, Medallion, Real-Time]
    related_skills: [powerbi-architect, dax-expert, ai-governance]
---

# Fabric Architect Skill

Design procedures for Microsoft Fabric analytics estates: lakehouse vs warehouse choices, medallion architecture, OneLake governance, Real-Time Intelligence, and workload placement. Complements powerbi-architect (semantic layer and reporting live there). Source material: microsoft/fabric-samples patterns.

## When to Use
- Planning or reviewing a Fabric workspace architecture
- Choosing lakehouse vs warehouse vs eventstream for a workload
- Medallion (bronze/silver/gold) layer design and data flow
- Fabric capacity planning, governance, or domain partitioning
- Don't use for: DAX/semantic model internals (dax-expert), report apps (powerbi-architect)

## Procedure
1. **Workload inventory.** List sources, volumes, velocities, consumers, SLAs. Completion criterion: table with source -> landing -> serving path per data product.
2. **Storage decision.** Lakehouse (Delta, Spark, data science, semi-structured) vs Warehouse (SQL, warehouse-scale modeling, strong T-SQL needs) vs Real-Time (eventstream, KQL). Default: bronze in lakehouse; silver/gold per query pattern. Completion criterion: ADR per major data product.
3. **Medallion design.** Bronze = raw immutable + lineage metadata; silver = cleansed/conformed; gold = business aggregates consumed by semantic models. Completion criterion: each layer has named tables, owners, and refresh SLAs.
4. **Workspace & domain partitioning.** Separate dev/test/prod workspaces; align domains to business units; OneLake shortcuts for sharing without copying. Completion criterion: workspace map with access model.
5. **Capacity plan.** SKUs vs workload profiles; burst/smooth behavior; pause capacity for dev; monitor CU consumption. Completion criterion: capacity per environment documented with cost owner.
6. **Real-time layer (if needed).** Eventstream -> KQL database -> Real-Time Dashboards; define retention and alerting. Completion criterion: latency budget documented end-to-end.
7. **Governance handoff.** Sensitivity labels, lineage, endorsement (promoted/certified), deployment pipelines. Completion criterion: governance checklist passes before production.

## Quick Reference
- **Shortcuts over copies:** OneLake shortcuts keep single source of truth; copy only at bronze boundaries.
- **Notebooks vs Dataflows:** notebooks for code-controlled transformations; Dataflows Gen2 for low-code ETL with CI/CD limits understood.
- **Deployment pipelines:** promote workspace content dev -> test -> prod; keep rules-as-code where possible.
- **Direct Lake:** semantic models read Delta directly - refresh-free, but watch partition and file health.

## Pitfalls
- **Lakehouse sprawl:** ad-hoc notebooks creating untracked tables. Every table has an owner and a pipeline.
- **Warehouse envy:** forcing T-SQL warehouse patterns into Spark lakehouses (or vice versa) - pick by query pattern.
- **Capacity starvation:** unmonitored CU burn from heavy Spark jobs. Set alerts on CU thresholds.
- **Skipping bronze immutability:** transforming in place destroys replay and audit ability.

## Verification
- Workspace map, medallion table registry, capacity plan, and governance checklist all exist and current.
- Each data product traceable from source to dashboard via lineage.

## Deeper Sources
- microsoft/fabric-samples (lakehouse, warehouse, RTI, data science samples)
- microsoft/architecture-center (Fabric reference architectures)
