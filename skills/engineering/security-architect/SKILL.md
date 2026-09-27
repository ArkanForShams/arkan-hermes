---
name: security-architect
description: "Use for threat modeling, authN/Z, and OWASP review."
version: 0.1.0
author: ARKAN (for Shams Tabrez), Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [Security, OWASP, Threat-Model, AuthN, AuthZ, Secrets]
    related_skills: [devops-architect, ai-governance, azure-architect, sqlserver-architect]
---

# Security Architect Skill

Application and platform security procedures: threat modeling, authentication/authorization design, OWASP-aligned review, secrets management, and security gates in delivery. Aligned with group IT security policy (source of truth).

## When to Use
- Threat modeling a new system or feature
- AuthN/authZ design review, OWASP Top-10 checks
- Secrets handling, security review before launches
- Don't use for: AI-specific risk tiers (ai-governance), compliance law (qualified counsel)

## Procedure
1. **Threat model per system.** STRIDE per trust boundary: what do we protect (data, flows), who are the actors, where are the boundaries. Completion criterion: model documented with mitigations per high risk.
2. **Authentication posture.** Modern protocols only: OAuth2/OIDC via the enterprise IdP; no custom crypto, no homebrew token formats; MFA for admin surfaces. Completion criterion: auth flow diagram reviewed; no legacy auth paths.
3. **Authorization design.** Deny by default; permissions checked server-side on every request (never client-only); RBAC mapped to business roles; object-level checks (IDOR testing). Completion criterion: authZ matrix per role per resource.
4. **OWASP Top-10 pass.** Per release: injection (parameterized everywhere), XSS (output encoding + CSP), CSRF ( SameSite + tokens for state-changing calls), SSRF, deserialization, misconfig, vulnerable components (SCA in CI). Completion criterion: checklist executed with findings tracked.
5. **Secrets discipline.** No secrets in code/config/repos (gitleaks gate); managed identity/Key Vault for runtime secrets; rotation schedule; least-privilege service identities. Completion criterion: secret scan green; vault inventory current.
6. **Data protection.** Classify data; encrypt in transit (TLS 1.2+) and at rest per policy; PII minimization in logs; retention rules. Completion criterion: data classification sheet per system.
7. **Security gates in delivery.** SAST + dependency scan + secret scan in CI; security review gate for launches (matches ai-governance Tier gates for AI systems). Completion criterion: CI gates blocking on critical findings.
8. **Incident readiness.** Security runbook: detect, contain, notify (per group policy), preserve evidence, post-incident review. Completion criterion: runbook exists; tabletop exercised.

## Quick Reference
- **Deny by default, log everything privileged, rotate everything.**
- **IDOR is the most-missed vulnerability:** test every endpoint with another user's IDs.
- **Secrets in repos are forever:** rotation + history purge; prevention via pre-commit gates.
- **The human layer:** phishing-resistant MFA for admins outweighs any code hardening.

## Pitfalls
- **Security as a phase:** reviewed after build, findings too expensive to fix. Gates in CI from day one.
- **Checklist theater:** scanning tools green while authZ logic is broken. Manual threat modeling complements tools.
- **Over-blocking:** security gates that cry wolf get bypassed. Tune to critical-blocking, advisory-rest.
- **Shadow integrations:** new third-party tools outside the security review. Vendor review (ai-governance pattern) applies.

## Verification
- Threat model + authZ matrix current per system.
- CI security gates green (SAST, SCA, secrets); critical findings = zero in production.
- Secret scan clean across repos; rotation schedule on file.

## Deeper Sources
- OWASP guides (Top 10, ASVS); NIST CSF structure (usnistgov)
- microsoft/security patterns; ai-governance (AI system gates), devops-architect (CI integration)
