---
name: devops-architect
description: "Use for CI/CD design, IaC, and release engineering."
version: 0.1.0
author: ARKAN (for Shams Tabrez), Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [DevOps, CI-CD, IaC, GitHub-Actions, DORA]
    related_skills: [azure-architect, security-architect, dotnet-architect, ai-architect]
---

# DevOps Architect Skill

Delivery pipeline and platform engineering procedures: CI/CD design, environments strategy, IaC standards, release engineering, DORA metrics, and developer experience.

## When to Use
- Designing CI/CD pipelines (GitHub Actions or Azure DevOps)
- Environment strategy, IaC standards, release/rollback design
- Delivery flow improvement (DORA metrics, lead time reduction)
- Don't use for: cloud resource architecture (azure-architect), code security checks (security-architect)

## Procedure
1. **Pipeline architecture.** Trunk-based development, PR-gated builds; pipeline-as-code in-repo; stages: build -> test -> scan -> deploy (dev) -> approve -> prod. Completion criterion: pipeline diagrams per app class; templates shared.
2. **Quality gates that block.** Build, unit tests, SAST, dependency scan, secret scan block merges; perf/contract tests gate releases. Completion criterion: gate matrix (blocking vs advisory) documented and enforced.
3. **IaC standards.** Bicep/Terraform in-repo, plan reviewed in PR, no portal changes to governed resources (drift detection), state secured, modules versioned. Completion criterion: drift report clean; module registry live.
4. **Environment strategy.** Dev/test/prod parity (same deployment mechanism); ephemeral PR environments where cheap; config via environment-scoped variables, never baked images. Completion criterion: environment map; parity verified.
5. **Release engineering.** Semantic versioning; changelog generated; feature flags decouple deploy from release; DB migrations backward-compatible (expand/contract pattern); rollback = redeploy previous version + compatible schema. Completion criterion: rollback rehearsed per major release.
6. **Observability baseline.** Structured logs, metrics, traces per service; dashboards + alerts tied to SLOs, not CPU noise. Completion criterion: golden signals dashboarded per service.
7. **DORA measurement.** Lead time, deploy frequency, change-failure rate, MTTR tracked monthly; improve the worst metric deliberately. Completion criterion: DORA dashboard live with monthly review.
8. **Developer experience.** Time-to-first-PR for new joiners measured; onboarding docs; local run story. Completion criterion: onboarding < 1 day to first merged PR.

## Quick Reference
- **Expand/contract migrations:** add nullable -> backfill -> switch reads -> drop old. Never breaking schema in one step.
- **Feature flags are release control,** not just toggles: kill switches, A/B, gradual rollout.
- **Pipeline = production system:** owned, monitored, versioned - not a scripts folder.
- **Four DORA metrics** cover delivery health; change-failure rate guards against speed-without-quality.

## Pitfalls
- **Snowflake environments:** hand-built prod differing from IaC. Drift detection is the cure.
- **Gates as suggestion:** flaky tests disabled instead of fixed - gate credibility dies.
- **Migration drama:** breaking schema changes without expand/contract = deploy lock-in and risky releases.
- **Metrics without action:** DORA dashboards nobody acts on. Monthly review with one committed improvement.

## Verification
- Gate matrix enforced in CI; drift report clean; rollback rehearsed per service.
- DORA metrics trending (lead time down, CFR down) with monthly review notes.

## Deeper Sources
- github/actions + Azure DevOps patterns; microsoft/azuredevopsdemo
- security-architect (gates detail), azure-architect (platform), performance-tuning-advisor (perf gates)
