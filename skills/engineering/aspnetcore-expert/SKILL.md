---
name: aspnetcore-expert
description: "Use for ASP.NET Core implementation and runtime patterns."
version: 0.1.0
author: ARKAN (for Shams Tabrez), Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [ASPNET-Core, Auth, Caching, Resilience, SignalR, gRPC]
    related_skills: [dotnet-architect, api-design-expert, security-architect, performance-tuning-advisor]
---

# ASP.NET Core Expert Skill

Daily-driver implementation patterns for ASP.NET Core (.NET 8+): middleware pipeline, authentication/authorization configuration, caching layers, resilience, background processing, gRPC/SignalR, JSON rules, and runtime diagnostics. Architecture decisions live in dotnet-architect; contracts in api-design-expert; security design in security-architect.

## When to Use
- Implementing or debugging ASP.NET Core features (auth, caching, middleware order)
- Background work, resilience/retry policies, rate limiting
- gRPC or SignalR services; JSON serialization behavior
- Performance diagnostics on a running ASP.NET Core app
- Don't use for: solution structure decisions (dotnet-architect), API contract design (api-design-expert)

## Procedure
1. **Middleware order audit.** Order matters: ExceptionHandler -> HSTS/HTTPS -> StaticFiles -> Routing -> CORS -> Authentication -> Authorization -> custom -> endpoints. Wrong order = security holes that tests miss. Completion criterion: Program.cs pipeline documented in order with rationale per entry.
2. **Authentication implementation.** JWT bearer config: issuer/audience validation, clock skew, signing keys from config/IdP discovery - never hardcoded. Claims transformation for app roles; map external identity to app permissions centrally. Completion criterion: auth events (OnTokenValidated etc.) reviewed; no manual JWT parsing in controllers.
3. **Authorization implementation.** Policy-based everywhere: services.AddAuthorization with named policies; resource-based handlers (IAuthorizationHandler) for object-level checks; fallback policy = deny by default. Completion criterion: every endpoint covered by a policy; [AllowAnonymous] only with a written reason.
4. **Caching decision ladder.** Output caching (whole responses) -> HybridCache/IDistributedCache (shared data, Redis) -> IMemoryCache (per-instance hot data). Every cache: expiration + invalidation owner defined. Never cache per-user data in shared caches without keying by user. Completion criterion: cache inventory with TTL + invalidation per entry.
5. **Resilience.** Standard resilience components (Microsoft.Extensions.Http.Resilience / Polly) on ALL HttpClient calls: timeout, retry with jittered backoff, circuit breaker; idempotency considered before retrying POSTs. Completion criterion: zero naked HttpClient registrations.
6. **Background work.** IHostedService/BackgroundService for in-process jobs with: cancellation-token respect, error handling that does not silently kill the loop, and graceful shutdown. Durable/long-running work -> queue (Storage/Service Bus) + worker, not in-process. Completion criterion: hosted services reviewed for cancellation + logging.
7. **Real-time and RPC.** SignalR: backplane (Redis) for multi-instance, auth via access tokens on negotiate, reconnection design. gRPC: deadline propagation, retry policy per method, keepalive tuning. Completion criterion: chosen per integration with ADR note.
8. **JSON discipline.** One JsonSerializerOptions (web defaults); case policy fixed app-wide; enums as strings or numbers - decided once; custom converters versioned. Completion criterion: no ad-hoc serializer settings sprinkled in controllers.
9. **Runtime diagnostics.** When slow or leaking: dotnet-counters (GC, threadpool), dotnet-trace for hot paths, App Insights/OpenTelemetry traces for request flows; Kestrel limits reviewed under load. Completion criterion: diagnostic evidence captured before code changes.
10. **Rate limiting and protection.** Rate limiter middleware (partitioned by user/IP) on public endpoints; request size limits; health endpoints unauthenticated but non-sensitive. Completion criterion: limits configured and load-tested.

## Quick Reference
- **Scope bugs:** scoped service into singleton = captive dependency; background singletons must create scopes via IServiceScopeFactory.
- **Configuration:** options pattern with validation (ValidateDataAnnotations) - fail fast at startup, not in production.
- **Global error handling:** IExceptionHandler + ProblemDetails; never try/catch-and-swallow in controllers.
- **Health checks:** AddHealthChecks with DB/queue dependency checks; liveness vs readiness separated.
- **Kestrel under load:** MaxConcurrentConnections, request body size, and graceful shutdown period - tune with evidence from load tests (performance-tuning-advisor).

## Pitfalls
- **Middleware order regressions:** a "harmless" reorder that puts CORS before auth or auth after endpoint routing. Pipeline is a security artifact - review it as code.
- **Singleton HttpClient without resilience:** socket exhaustion and no retry story. Use IHttpClientFactory + resilience handlers.
- **In-process background jobs for critical work:** app restart = lost work. Queue-backed workers for anything that must survive.
- **Cache stampedes:** expiration without jitter or locking; warming storms on cold start. HybridCache handles this - use it.
- **Blocking calls in async paths:** .Result/.Wait() in controllers deadlocks threadpool under load. Async all the way.

## Verification
- Pipeline order documented; authZ policy matrix complete; zero naked HttpClient registrations.
- Cache inventory with TTL/invalidation current; background services respect cancellation.
- Diagnostics evidence on file for every performance complaint acted on.

## Deeper Sources
- dotnet/aspnetcore docs (auth, output caching, rate limiting, SignalR, gRPC)
- dotnet/extensions (resilience, hosted services, options validation)
- dotnet-architect (structure), api-design-expert (contracts), security-architect (threat model), performance-tuning-advisor (method)
