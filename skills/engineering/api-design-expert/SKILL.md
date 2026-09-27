---
name: api-design-expert
description: "Use for API contract design and versioning standards."
version: 0.1.0
author: ARKAN (for Shams Tabrez), Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [API, REST, OpenAPI, Versioning, Error-Handling]
    related_skills: [dotnet-architect, security-architect, devops-architect]
---

# API Design Expert Skill

API contract design procedures: resource modeling, REST conventions, versioning, error semantics, pagination, and contract governance for ASP.NET Core and general HTTP APIs.

## When to Use
- Designing a new API surface or reviewing a proposed contract
- Versioning, pagination, filtering, error-response standards
- API governance: naming, consistency, breaking-change review
- Don't use for: internal layering (dotnet-architect), API security (security-architect)

## Procedure
1. **Resource model first.** Nouns for resources, HTTP verbs for actions; model the business domain, not database tables. Non-CRUD operations: sub-resources or action endpoints with justification. Completion criterion: resource list reviewed against domain language.
2. **Contract conventions.** Consistent plural naming, JSON casing, date format (ISO 8601 UTC), money as decimal+currency. Completion criterion: style guide published and lint-checked.
3. **Error semantics.** ProblemDetails (RFC 7807) everywhere: 400 validation, 401/403 auth, 404 not-found, 409 conflicts, 422 semantic errors. Never 200-wrapped errors. Completion criterion: error catalog with codes documented.
4. **Pagination standard.** Cursor-based for large/high-churn sets, offset for small admin lists; every list response declares hasMore + next link. Completion criterion: no unbounded endpoints.
5. **Versioning decision.** URI segment (/v1/) default; header versioning where URLs must stay stable; deprecation policy: N+1 notice + sunset date in headers. Completion criterion: ADR + deprecation policy published.
6. **Contract as artifact.** OpenAPI spec generated from code, reviewed in PRs; breaking changes require compatibility check. Completion criterion: spec diff gate in CI (devops-architect).
7. **Consumer experience pass.** Onboarding: one call works from docs alone; idempotency keys for retryable POSTs; rate-limit headers present. Completion criterion: sample curl from docs succeeds on staging.

## Quick Reference
- **Status codes:** 200 ok, 201 created+Location, 204 no-content, 202 accepted (async), 304 not-modified.
- **Idempotency:** PUT/DELETE naturally idempotent; POST retry needs Idempotency-Key header.
- **Filtering/sorting:** consistent query conventions (filter[field]=, sort=-date); document every operator.
- **Etag + If-None-Match** for cache-friendly reads.

## Pitfalls
- **Leaky contracts:** field names and shapes mirroring DB schema. Consumers then block refactors.
- **Chatty APIs:** requiring five calls to render one screen - add aggregation endpoints deliberately.
- **Silent breaking changes:** renamed fields without version bump. Contract diff gate prevents.
- **Error sprawl:** every endpoint inventing its own error shape - consumers drown.

## Verification
- OpenAPI spec current and diff-gated; error catalog documented.
- No unbounded list endpoints; pagination standard applied.
- Deprecation policy live with sunset headers on old versions.

## Deeper Sources
- dotnet/aspnetcore minimal APIs + MVC patterns
- security-architect (authZ on endpoints), dotnet-architect (implementation layering)
