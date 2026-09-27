---
name: dotnet-architect
description: "Use for .NET solution architecture and EF Core design."
version: 0.1.0
author: ARKAN (for Shams Tabrez), Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [DotNet, ASPNET-Core, EF-Core, Clean-Architecture, DI]
    related_skills: [efcore-expert, aspnetcore-expert, api-design-expert, azure-architect]
---

# DotNet Architect Skill

.NET architecture and design procedures: solution structure, Clean Architecture layering, dependency injection, EF Core data access, and ASP.NET Core application patterns. Covers .NET 6+ including minimal APIs. Source basis: dotnet/runtime, aspnetcore, efcore docs and samples.

## When to Use
- Structuring a new .NET solution or reviewing an existing one
- Clean Architecture / vertical slice decisions, DI composition
- EF Core data access design (contexts, migrations, performance basics)
- ASP.NET Core middleware, minimal API vs controller organization
- Don't use for: EF Core implementation depth (efcore-expert), daily ASP.NET Core implementation (aspnetcore-expert), API contract design (api-design-expert), cloud hosting (azure-architect)

## Procedure
1. **Solution structure decision.** Clean Architecture (domain/application/infrastructure/presentation) for complex domains; feature-slices (vertical slices) for CRUD-heavy apps; modular monolith default - microservices only when independent scaling/deployment is proven necessary. Completion criterion: ADR with reasoning.
2. **Dependency discipline.** Dependencies point inward; domain has zero framework references; interfaces for external concerns; composition root wires everything in Program.cs. Completion criterion: no domain -> infrastructure references (verify with dependency scan).
3. **DI registration audit.** Lifetimes correct (singleton stateless/shared, scoped per-request, transient cheap); no captive dependencies (singleton capturing scoped); options pattern for config. Completion criterion: DI graph reviewed; captive-dependency check passes.
4. **EF Core setup.** One context per bounded area; migrations as code reviewed in PRs; no lazy-loading without explicit need; AsNoTracking for reads; compiled queries for hot paths. Completion criterion: query patterns reviewed against N+1 checklist.
5. **API surface organization.** Minimal APIs for small focused services; controllers for larger surfaces; group by feature; consistent error handling via exception middleware + ProblemDetails. Completion criterion: error responses uniform across endpoints.
6. **Cross-cutting.** Logging (structured, scoped), validation (FluentValidation or DataAnnotations at boundary), health checks, config tiers (appsettings + env + secrets). Completion criterion: middleware pipeline documented in order.
7. **Testing strategy.** Unit on domain logic, integration on EF Core (in-memory only for simple cases; prefer real-provider integration tests), TestServer for API contracts. Completion criterion: test pyramid agreed with named coverage targets.

## Quick Reference
- **Clean Architecture layers:** Domain (entities, rules) / Application (use cases) / Infrastructure (EF, external) / Presentation (API, UI).
- **Captive dependency red flag:** singleton injecting a scoped service - fix by injecting IServiceScopeFactory or restructuring.
- **EF Core speed levers:** AsNoTracking, projections (Select to DTO), split queries for large includes, bulk operations via ExecuteUpdate/ExecuteDelete.
- **Minimal API route grouping:** MapGroup for shared filters/authorization per feature.

## Pitfalls
- **Anemic Clean Architecture:** layers exist but everything leaks through - repository-of-repository indirection with no value.
- **Repository over EF Core everywhere:** DbContext already is a unit-of-work; wrap only when domain tests demand isolation.
- **Migration drift:** generated migrations edited carelessly or applied out of order. Migrations are code - review them.
- **DI service-locator smells:** runtime resolution via IServiceProvider everywhere hides the graph.

## Verification
- Solution builds with dependency rules intact (architecture tests pass, e.g. dependency-constraint tests).
- DI audit and N+1 checklist clean for touched code paths.
- ADR exists for structure and any framework-excepting decision.

## Deeper Sources
- dotnet/aspnetcore + dotnet/efcore docs; dotnet/extensions (DI, hosting patterns)
- api-design-expert (contracts), azure-architect (hosting), security-architect (auth patterns)
