---
name: security-triage
description: "Use when a gate scan blocks a repo or skill — triage it."
category: security
---

# Scanner Triage — Interpreting a Block with Evidence

Companion to the user-owned `security-gate` skill, which owns RUNNING scans. This skill owns INTERPRETING a block: deciding pass/block with evidence, and leaving an audit trail.

## Always-on rules

1. **Severity ≠ verdict on LLM-heavy repos.** Repos full of agent/LLM code, prompt templates, or test fixtures trip ML-research, prompt-injection, and fixture rules en masse. Score 0 on such a repo is noise, not a breach — triage before deciding.
2. **Read the flagged source, never judge from the rule name.** Two subtle FP classes hide here: *defensive content* (a repo's own hardening module or a template teaching agents to REFUSE injections gets flagged for exactly the phrases it defends against) and *fixture noise* (finding mass concentrated in tests/ — spend manual reads on src/ only).
3. **Every manual override leaves a paper trail**: a `TRIAGE-VERDICT.md` in the per-repo triage dir plus one registry line in `~/hermes-workspace/github-skills-sources.md`. The 'why we overrode' must outlive the chat that reasoned it. If the evidence is incomplete, record BLOCK rather than manufacturing an override.
4. **Do not clone a blocked repository merely to inspect it.** Fetch only the distinct flagged source files from the verified upstream raw endpoint into `~/hermes-workspace/security/quarantine/<repo>-triage/`; this preserves the gate boundary while allowing line-level review.
5. **Separate repository risk from install-surface risk.** Classify findings into docs, tests/fixtures, benchmarks, release tooling, local-development infrastructure, build scripts, and runtime paths. A finding is cleared only when its source and execution context support the classification; unresolved runtime findings keep the repository blocked.
6. **Repo-carried agent skills** (`.claude/skills`, `.agents/skills`, `.github/skills` dirs) get one `security-gate.sh skill <dir>` scan; a DO_NOT_INSTALL verdict marks them inert references — keep the clone, never load those skills into Hermes.
7. **Verify a README's install name before installing** — docs go stale: `npm view <pkg> bin dist-tags.latest` or `uv tool install <pkg> --dry-run` confirms the package exists and which package owns the CLI binary; unpublished or absorbed names fail only at install time, after the gate is already passed.

## Triage procedure

1. Read the gate's JSON report in `~/hermes-workspace/security/reports/`: summary block first (`files_scanned`, `total_issues`, `false_positives_filtered`, `security_score`).
2. Group findings by `(severity, rule_id)`; note top files per rule. 180+ distinct rule groups on a big repo is normal noise, not 180 problems.
3. Preserve the detailed `medusa-scan-*.json` report; do not use `scan_history.json` or an aggregate exit code as the evidence record. Group findings by severity, scanner, rule, and file, then fetch only the distinct flagged files from `raw.githubusercontent.com/<org>/<repo>/<default-branch>/...` into a per-repo quarantine dir (the scan's temp clone is already deleted). Read each flagged line with ±3 lines of context; sample 2–3 instances per rule group when counts are large, but read EVERY flagged line under CRITICAL.
4. Judge each group against the FP classes below and inspect the actual install surface separately. A false positive in a test, benchmark, or document does not clear an unrelated runtime finding; anything matching no class is a real finding → hard stop, no override.
5. FP-dominated → write the TRIAGE-VERDICT file and registry entry before any override; real or unresolved runtime findings → stay blocked, report to Shams with the specific lines and do not install or execute setup scripts.

## FP classes (confirm from source, never from the rule name)

| Class | Trigger signature | How to confirm |
|---|---|---|
| Docs prose | Injection/ML rules on README, AGENTS.md, docs/ markdown | Text aims at repo contributors, not an agent runtime |
| Test fixtures | Finding mass concentrated in tests/ (hundreds per file) | pytest/fixture files with crafted strings |
| Defensive content | Rules firing on hardening code or refuse-instructions templates | Flagged file defends against the pattern |
| Prompt-kit product | Command templates that ARE the delivered product | Content is the deliverable, not runtime code |
| Dev-config literals | Compose port bindings, test-only keys in vite/pytest configs | Decode the literal: placeholder/test env = fixture; live-format secret = real |
| LLM-research vocabulary | ML-attack rule names on ordinary code | Rule name is a research term; code does something mundane |

## Real signals (never auto-dismissable)

Exfil endpoints; subprocess/shell out of place; obfuscation; unknown/unrelated domains; credential literals decoding to live-format secrets; install scripts that fetch-then-execute.

## TRIAGE-VERDICT.md format

- Header: repo URL, branch, medusa raw counts, auto-filter count, verdict.
- Table: rule group → severity × count → files → what the source shows → verdict.
- Decision: override/block WITH conditions ("skills inside stay inert; setup scripts not executed; prompts treated as data").
- License note when restrictive (ELv2/BSL: self-host fine, managed-resale not).

## Calibration (score-0 repos cleared after full source reads)

memory-os 275 findings · spec-kit 2,669 (prompt-kit product) · nango 44 (fixtures + docs). All three: every flagged line individually read before override.
