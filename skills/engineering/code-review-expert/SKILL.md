---
name: code-review-expert
description: "Use for code review checklists, PRs, and severity."
version: 0.1.0
author: ARKAN (for Shams Tabrez), Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [Code-Review, PR-Standards, Severity, Culture, AI-Assist]
    related_skills: [ai-coding-advisor, devops-architect, engineering-leadership]
---

# Code Review Expert Skill

Code review standards and culture: PR hygiene, review checklists, severity taxonomy, review SLAs, and AI-assisted review boundaries. Makes review a quality service, not a bottleneck or an ego contest.

## When to Use
- Setting or auditing PR/review standards for the team
- Reviewing a PR with structure (checklist + severity labels)
- Tuning review culture: SLAs, tone, what blocks vs what suggests
- Don't use for: CI quality gates setup (devops-architect), AI delegation policy (ai-coding-advisor)

## Procedure
1. **PR standards.** Small (<400 changed lines), one concern per PR, description states intent + test evidence + rollback note, linked work item. Big designs get a design doc, not a mega-PR. Completion criterion: standards published; oversized PRs challenged at review.
2. **Review checklist.** Correctness (does it do what the ticket says), security (authZ on new endpoints, injection surfaces), error handling (failure paths, not just happy path), tests cover the behavior change, naming and readability, performance-sensitive paths justified, breaking changes flagged for consumers. Completion criterion: checklist in PR template.
3. **Severity taxonomy.** Blocker (must fix before merge - bugs, security, data loss), Should-fix (real issues, discuss if disputed), Nit (optional, author decides), Question (understanding, not judgment). Labels make reviews scalable and unemotional. Completion criterion: severity labels used in comments.
4. **Review SLAs and culture.** First response < 24h (working day); review the code, never the coder; nits phrased as optional ("consider X - not blocking"); approval means "I would stand behind this in production." Completion criterion: SLA met >= 90%; tone rule holds.
5. **Author discipline.** Self-review the diff before requesting (authors catch 30%+ themselves); tests green; no WIP dumps - draft PRs for early feedback explicitly labeled. Completion criterion: self-review note or diff comments present on requested PRs.
6. **AI-assist boundaries.** Automation pre-human: lint, SAST, secret scan (devops-architect gates). AI pre-review may flag obvious issues; humans review design, security, and domain correctness - AI never approves a PR. AI-generated code routes through the extended checklist (ai-coding-advisor). Completion criterion: no AI-approved merges; extended checklist on AI-code PRs.
7. **Feedback automation loop.** Recurring findings become linter rules, analyzers, or PR-template items - automation beats nagging. Monthly: top-5 recurring findings -> 5 new automated checks or checklist lines. Completion criterion: recurring findings converting to automation monthly.

## Quick Reference
- **Comment style:** "consider X because Y" not "this is wrong"; questions before verdicts; scope comments to the diff (architecture debates go to a design doc).
- **Approval semantics:** approve = production-ready as far as I can tell; comment = issues to resolve, re-review needed; request-changes = blocker present.
- **Two-reviewer rule** for critical paths (payments, migrations, auth) - one for everything else.
- **Review time budget:** 30-60 min per PR; a review longer than that means the PR was too big.

## Pitfalls
- **Rubber stamps:** LGTM without reading - the review that ships the incident. Approval without evidence is noise.
- **Mega-PRs:** 2000-line PRs get skim-approvals; design reviews exist for a reason.
- **Nit floods:** 30 style comments bury the one real bug. Nits consolidated, blockers first.
- **Gatekeeper ego:** review as dominance vs quality service - kills velocity and honesty.
- **"Internal apps need no security review":** attackers do not read your perimeter policy. Checklist applies to all.

## Verification
- PR size/test standards met; severity labels in use; SLA >= 90%.
- Monthly recurring-findings report with automation conversions.
- Zero security-relevant merges without checklist evidence.

## Deeper Sources
- requesting-code-review skill (Hermes pre-commit flow), ai-coding-advisor (AI-code checklist)
- devops-architect (automated gates), engineering-leadership (culture)
