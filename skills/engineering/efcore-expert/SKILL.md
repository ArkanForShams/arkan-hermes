---
name: efcore-expert
description: "Use for EF Core mapping, migrations, and query tuning."
version: 0.1.0
author: ARKAN (for Shams Tabrez), Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [EF-Core, Migrations, Queries, Concurrency, Bulk-Ops]
    related_skills: [dotnet-architect, sqlserver-architect, performance-tuning-advisor]
---

# EF Core Expert Skill

EF Core implementation depth: entity mapping, migration discipline, query performance, transactions and concurrency, bulk operations, and testing with the real provider. Promoted from a fold into dotnet-architect - this skill owns the daily data-access layer; architecture decisions stay there.

## When to Use
- Mapping entities (keys, owned types, value conversions, navigation config)
- Migration creation, review, and production deployment strategy
- Query performance: N+1, tracking, projections, split queries
- Concurrency handling, bulk operations, connection resilience
- Don't use for: SQL Server engine tuning (sqlserver-architect), solution structure (dotnet-architect)

## Procedure
1. **Mapping conventions.** One IEntityTypeConfiguration<T> per entity (ApplyConfigurationsFromAssembly); keys, indexes, and relationships explicit - never rely on conventions alone for production schemas; value conversions for enums/VOs; owned types for DDD value objects. Completion criterion: mapping config reviewed; no orphan fluent calls in OnModelCreating.
2. **Migration discipline.** One migration per logical change, generated (never hand-edited after generation), reviewed in PR like code; applied migrations are immutable - fixes go in a NEW migration; production deploys via idempotent script or migration bundle (CI/CD), not runtime Migrate(). Completion criterion: migration history linear; no manual edits to applied migrations.
3. **Query discipline.** AsNoTracking default for all reads; projections (Select to DTO) before materializing; Include only what the screen needs; split queries for multi-collection includes; filtered include where partial graphs are needed. Completion criterion: hot-path queries logged and reviewed - N+1 check passes.
4. **Transactions and concurrency.** SaveChanges is atomic per call; explicit transactions only across multiple SaveChanges (with execution strategy compatibility); optimistic concurrency via rowversion/token column + DbUpdateConcurrencyException handling path designed, not discovered in production. Completion criterion: concurrency strategy per aggregate documented and tested.
5. **Bulk operations.** ExecuteUpdateAsync/ExecuteDeleteAsync for set-based changes (no entity materialization); insert patterns for batches; drop to raw SQL or Dapper for extreme paths - with ADR note. Completion criterion: bulk paths measured; no row-by-row loops on large sets.
6. **Connection resilience.** EnableRetryOnFailure caveats: incompatible with user-initiated transactions unless wrapping strategy used; transient-failure awareness for every integration; pooled context factory (AddDbContextPool) for hot paths. Completion criterion: retry strategy + transaction usage consistent.
7. **Testing with the real provider.** Integration tests against real SQL (Testcontainers or dedicated DB) - SQLite/in-memory providers give false confidence (different SQL dialect, no real constraints); deterministic data factories; concurrency and migration tests included. Completion criterion: integration suite runs the actual dialect.
8. **Performance verification.** Log the generated SQL for every hot query; check plans for index seeks vs scans; measure before/after for every optimization (performance-tuning-advisor method). Completion criterion: plans on file for hot paths; measured deltas recorded.

## Quick Reference
- **Tracking table:** tracked (SaveChanges flows) vs AsNoTracking (pure reads) vs AsNoTrackingWithIdentityResolution (graphs with shared refs).
- **Global query filters:** soft-delete and multi-tenant filters in one place (HasQueryFilter) - but remember they apply silently; document them.
- **Interceptors:** SaveChangesInterceptor for audit columns (createdBy/modifiedAt) - cross-cutting without polluting entities.
- **Compiled queries:** EF.CompileAsyncQuery for extreme hot paths measured first.
- **Split vs single query:** single for few includes, split for multiple collection includes (cartesian explosion avoidance).

## Pitfalls
- **Lazy loading in web requests:** the classic N+1 generator - navigation access in loops. Prefer explicit Include/projection.
- **Client evaluation surprises:** complex WHERE logic silently evaluated client-side, pulling whole tables. Watch the logs; EF Core throws only in some cases.
- **Editing applied migrations:** breaks every environment that already ran them. New migration, always.
- **In-memory provider false confidence:** tests pass, production fails on dialect, constraints, or transactions. Real provider for integration.
- **Retry + ambient transactions:** EnableRetryOnFailure with BeginTransaction throws on retries unless execution strategy wraps them - design it, don't discover it.

## Verification
- Migration history clean (no hand-edited applied migrations, bundles used in CI/CD).
- No client-evaluation warnings in logs; N+1 check passes on hot paths.
- Concurrency handling demonstrably tested; bulk paths measured with before/after.

## Deeper Sources
- dotnet/efcore docs (change tracking, migrations, performance, querying)
- dotnet-architect (structure), sqlserver-architect (engine side), performance-tuning-advisor (method)
