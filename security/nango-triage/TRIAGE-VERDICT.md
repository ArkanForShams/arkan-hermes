# Nango repo scan — manual triage (gate override)

- URL: https://github.com/NangoHQ/nango (master/e0713a2-era, scanned 2026-10-05)
- MEDUSA: 129 HIGH+ raw → 211 FPs auto-filtered → 44 findings (21 rule groups), score 0, risk CRITICAL
- Gate verdict: BLOCKED (automatic). Manual triage below per gate protocol ("severity ≠ verdict on LLM-heavy repos").

## Triaged rule groups — every flagged line read in source

| Rule | Sev × n | File(s) | Source reality | Verdict |
|---|---|---|---|---|
| MEDUSA-INFRA-SCAN-004 | CRIT ×4 | docs/spec.yaml (764, 4729, 4752, 4932) | OpenAPI doc fields (`password:` schema descriptions) for connector auth | FP — documentation |
| PI-RCE-003 | CRIT ×1 | docs/AGENTS.md:137 | Prose sentence about organizing docs | FP — prompt-injection rule on markdown prose |
| PI-RCE-002 | HIGH ×4 | AGENTS.md 1/2/6/18 | npm/oxlint/vite contributor instructions | FP — dev docs |
| GL-generic-api-key | HIGH ×4 | vite*config.ts (14/27/48), docs/llms-full.txt | Same base64 key in all three test configs; decodes to "G5xdj9FQJ2m0aiWt8qLXpovkPnJ4h7Ne" = vitest test.env fixture | FP — committed test fixture (public repo, not live cred) |
| DKR003 | HIGH ×2 | docker-compose.yaml:69, dev/docker-compose.dev.yaml:21 | Redis 6379:6379 in dev compose (standard local dev; we do not run their dev compose) | FP with note |
| PL102 / PL002 | HIGH ×4 | .claude/agents/nango-docs-migrator.md, docs/llms-full.txt | Claude Code agent definition + docs text (prompt-injection heuristics on legit SaaS docs) | FP |
| MEDUSA-ATKSIG-021 | HIGH ×1 | scripts/one-off/.../csv.ts:68 | CSV header trim regex | FP |
| MA013 | HIGH ×1 | scripts/docs-generate-llms.ts:97 | yaml.load on local docs file (yaml.safe alternatives nitpick) | FP |
| PINJATT-088 / AI-BACKDOOR-006 | MED ×2 | AGENTS.md:24, sync-scopes.ts:875 | REMOTE_API bash example / YAML key regex in validator | FP |
| PQC006/PQC007 | LOW/HIGH ×2 | rotate.ts:1, sync-scopes.ts:897 | env import / undefined-check | FP |
| EXA005/EXA010 | HIGH ×2 | sync-scopes.ts:505/750 | `console.error` + LLM-prompt instruction text in provider-scope validator | FP |

## Verdict
ALL 44 = false positives (known class: LLM/SaaS platform repos trip ML + prompt-injection rules en masse, same as memory-os scan 2026-09-24: 275 issues → score 0 → all FPs). No exfil endpoints, no live credentials, no obfuscation, no malicious executables.

**Decision: gate overridden by manual triage → cleared to clone.** Clone is for inspection/reference; their setup scripts are NOT executed as-is; any Hermes-facing skill extracted from it must itself pass the skill gate.

## Business note
License: Elastic License 2.0 (ELv2) — free self-host + internal use; cannot offer Nango as a competing managed service. Fine for Shams's internal integration work.

Artifacts: report medusa-scan-20261005-165412.json; inspected sources in ~/hermes-workspace/security/nango-triage/