---
name: performance-tuning-advisor
description: "Use for cross-stack performance tuning and budgets."
version: 0.1.0
author: ARKAN (for Shams Tabrez), Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [Performance, Profiling, Budgets, Caching, Load-Testing]
    related_skills: [sqlserver-architect, react-architect, dotnet-architect, azure-architect]
---

# Performance Tuning Advisor Skill

Cross-stack performance engineering procedure: measure first, establish budgets, profile the right layer, fix the dominant cost, verify - for web apps, APIs, databases, and reports.

## When to Use
- "It's slow" complaints needing a systematic approach
- Setting performance budgets before optimization work
- Choosing profilers and interpreting what they found
- Don't use for: component-specific deep dives (dotnet-architect, sqlserver-architect, react-architect)

## Procedure
1. **Quantify the complaint.** Turn "slow" into numbers: which operation, measured by whom, p50/p95/p99, from where (client-perceived vs server). Completion criterion: measured baseline from production-like conditions.
2. **Set the budget.** Target per operation (e.g., API p95 < 300ms, page interactive < 2s, report < 5s) agreed with the business. No budget = no definition of done. Completion criterion: budgets documented per operation.
3. **Profile the suspect layer, not all layers.** Symptom -> layer mapping: slow first-byte -> server/DB; slow after data arrives -> frontend render; intermittent -> concurrency/caching. Completion criterion: profiling evidence for the chosen layer.
4. **Fix the dominant cost only.** Rank costs by share; fix the top item; re-measure; repeat. Optimization before measurement is guessing. Completion criterion: each change tied to a measured before/after.
5. **Common fixes by layer.** DB: indexes, query shape, N+1 elimination. API: payload trimming, caching, pagination. App: async I/O, connection pooling, algorithmic complexity. Frontend: bundle size, image formats, render path. Completion criterion: fixes chosen from evidence, not fashion.
6. **Caching with invalidation.** Cache what is expensive AND stable; define invalidation per cache; measure hit ratio. Completion criterion: cache design documented with invalidation path.
7. **Load test for headroom.** Simulate peak (2x expected) on production-like data; find the breaking point and its cause. Completion criterion: load report with breaking point + remediation.
8. **Guardrails.** Perf regression tests on hot paths; budgets monitored via metrics dashboards; alerting on SLO breach. Completion criterion: regression gate active in CI (devops-architect).

## Quick Reference
- **Order of investigation:** measure -> budget -> profile dominant layer -> fix top cost -> verify. Never skip to fixes.
- **The 90/10 rule:** a handful of hot paths dominate; profile real usage to find them.
- **Utilization kills latency:** queueing math - past ~70% sustained utilization, latency climbs non-linearly.
- **Caching is a bet:** unbounded caches become correctness bugs and memory leaks.

## Pitfalls
- **Micro-optimizing cold paths:** code-level tricks where the DB waits. Profile, don't guess.
- **Dev-machine benchmarks:** noise levels, tiny datasets. Production-like data or the numbers lie.
- **Fixing p50 while p99 burns users:** tail latency is where pain lives.
- **One-shot tuning:** no regression gate means performance silently decays.

## Verification
- Baseline and post-fix measurements recorded for every tuning case.
- Budgets documented and monitored; regression gates active.
- Load test report current within 6 months or after major architecture change.

## Deeper Sources
- dotnet-architect, sqlserver-architect, react-architect (layer specifics)
- azure-architect (scale patterns), devops-architect (perf gates in CI)
