---
name: sqlserver-architect
description: "Use for SQL Server design, tuning, and availability."
version: 0.1.0
author: ARKAN (for Shams Tabrez), Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [SQL-Server, TSQL, Indexing, HA, Query-Tuning]
    related_skills: [performance-tuning-advisor, security-architect, dax-expert]
---

# SQL Server Architect Skill

SQL Server design and operations procedures: schema design, indexing strategy, T-SQL quality, query tuning, and high-availability choices. Source basis: microsoft/sql-server-samples and engine docs.

## When to Use
- Designing schemas, indexes, or reviewing T-SQL quality
- Query performance problems (plans, waits, missing indexes)
- Availability decisions (AG, Failover Cluster, backup/restore posture)
- Don't use for: DAX/semantic models (dax-expert), Fabric storage (fabric-architect)

## Procedure
1. **Schema quality pass.** Normalized core with deliberate denormalization only for measured read paths; correct types (no NVARCHAR(4000) everything); constraints enforce integrity (FK, CHECK) not app code alone. Completion criterion: schema review checklist passes.
2. **Index strategy.** Clustered = narrow, ever-increasing key; covering indexes for hot queries (INCLUDE columns); filtered indexes for skewed access; verify usage - drop unused indexes (they tax writes). Completion criterion: index inventory with usage stats reviewed.
3. **T-SQL standards.** SET NOCOUNT ON; no SELECT *; parameterized everywhere (never string-built SQL); set-based over loops; transactions short with explicit error handling (THROW). Completion criterion: code review checklist enforced.
4. **Query tuning workflow.** Reproduce -> actual execution plan -> find the dominant operator -> check waits (page latches vs CPU vs IO) -> fix (index, SARGability, statistics, hint as last resort) -> re-measure. Completion criterion: before/after timings recorded.
5. **Statistics and maintenance.** Ola Hallengren-style maintenance: integrity checks (DBCC CHECKDB), index/statistics maintenance scheduled; monitor fragmentation in context, not blindly. Completion criterion: maintenance jobs documented and monitored.
6. **Availability decision.** RPO/RTO per database -> availability group (enterprise, readable secondaries) vs failover cluster instance vs simple backup+restore. Recovery testing is part of the design, not an option. Completion criterion: ADR with RPO/RTO; restore rehearsed with timings.
7. **Security baseline.** Least-privilege roles (no app-owned sysadmin), contained users, TDE at rest where required, audit for sensitive tables. Completion criterion: security baseline reviewed (security-architect alignment).

## Quick Reference
- **SARGable predicates:** avoid wrapping indexed columns in functions (WHERE YEAR(d)=2024 kills the index).
- **Parameter sniffing:** parameter-sensitive plans - fix with OPTIMIZE FOR, RECOMPILE, or plan guides after measuring.
- **Wait stats first, not gut:** the dominant wait type names the fix area.
- **Isolation levels:** RSI (READ_COMMITTED_SNAPSHOT) to cut reader/writer blocking; verify app tolerance.

## Pitfalls
- **Index worship:** adding indexes per-complaint until writes crawl. Review and prune.
- **Implicit conversions:** NVARCHAR vs VARCHAR mismatches silently scanning indexes.
- **Restore assumptions:** backups untested = no backups. Timed restore rehearsal is the only proof.
- **Blind rebuilds:** nightly full index maintenance ignoring actual fragmentation and cost.

## Verification
- Index inventory with usage data; unused indexes pruned.
- Tuning cases documented with before/after evidence.
- Restore rehearsal completed within RPO/RTO targets, evidence on file.

## Deeper Sources
- microsoft/sql-server-samples (performance, HA samples)
- performance-tuning-advisor (cross-stack), security-architect (DB security)
