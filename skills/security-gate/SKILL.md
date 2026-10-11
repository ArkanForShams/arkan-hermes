---
name: security-gate
description: "Use before any skill install or repo clone. 3-scanner gate."
version: 1.0.0
created_by: agent
---

# ARKAN Security Gate

Three scanners protect this Hermes installation. Run them BEFORE trusting anything new. Tools live in `~/.local/bin` (medusa, skillspector, bumblebee); clones under `~/hermes-workspace/security/`; unified entry: `bash ~/hermes-workspace/scripts/security-gate.sh`.

## The three scanners

| Tool | Source | Purpose | Command |
|---|---|---|---|
| **SkillSpector** (NVIDIA) | github.com/NVIDIA/SkillSpector | Vet agent skills BEFORE install: prompt injection, exfiltration, dangerous code, supply chain (71 patterns, 17 categories) | `security-gate.sh skill <path\|url\|zip>` |
| **MEDUSA** (Pantheon-Security) | github.com/Pantheon-Security/medusa | Vet repos before clone/install: AI supply-chain attacks, repo poisoning, MCP tool poisoning, leaked secrets (40k+ patterns) | `security-gate.sh repo <url\|path>` |
| **Bumblebee** (Perplexity) | github.com/perplexityai/bumblebee | Read-only inventory of packages/extensions/MCP configs on this machine; exposure checks when an advisory names a package | `security-gate.sh baseline` |

## Mandatory gates

1. **New skill (any source)** → `security-gate.sh skill <path>` FIRST. Read the verdict: `DO_NOT_INSTALL` = stop and inspect each issue manually (docs that merely *mention* credential paths can be false positives — check `code_snippet`; executable scripts or literal secrets are hard stops).
2. **New GitHub repo (clone, install, or extract)** → `security-gate.sh repo <url>` FIRST. `--fail-on high` blocks on CRITICAL/HIGH. Full local scans of big repos are slow — run in background with notify.
3. **After cloning anything new** → run the skill gate on any `SKILL.md` it carries before loading it into Hermes.
4. **Weekly** (pair with the Sunday backup) → `security-gate.sh baseline` + `security-gate.sh secrets` to keep inventory fresh and confirm no credentials leaked into histories.

## Hard rules

- Never install a skill, clone a repo, or execute setup scripts from a source that hasn't passed the gate. If triage is necessary after a failed gate, keep the source in `~/hermes-workspace/security/quarantine/`, treat it as inert data, and do not run its toolchain, package manager, Docker, hooks, or bootstrap scripts.
- Separate repository-risk from install-surface risk: a full scan may be dominated by tests, benchmarks, fixtures, agent documentation, and release tooling, but the install surface still needs its own explicit review and scan before execution.
- Never inspect or compare secret-bearing `.env` files with a command that can print their contents. Use a small allowlisted metadata probe that emits only file existence, owner-only permissions, approved key names, and present/missing status; never emit values, hashes of whole secret files, shell-expanded commands, process environments, or unredacted error logs, because shell filters can accidentally leak API keys and tokens into logs or model context.
- After any suspected exposure, rotate every affected credential before continuing, then verify only local presence/permissions/non-empty status; do not accept replacement secrets in chat or paste them into third-party forms.
- Verify binary downloads against published checksums (bumblebee release tarballs ship checksums.txt).
- `medusa secrets purge` is interactive and destructive-by-design (byte-identical backup first) — only run interactively with Shams's approval.
- Reports accumulate in `~/hermes-workspace/security/reports/` — commit notable ones to the archive repo.

## Update procedure

`uv tool upgrade medusa-security`; `uv tool update skillspector`; bumblebee: download new release tarball + verify checksum. Re-run each tool's self-test/version check after upgrade.

## Operational lessons (hard-won)

- **Medusa headless: the definitive pattern.** Three root causes, each mimicking a different failure: (1) a PTY wrapper (`script`) ACTIVATES the Rich Live renderer (`parallel.py:1232`: `use_live = stdout.isatty()`) which then self-terminates headless — run medusa with stdout NOT a tty instead; (2) default 22 workers OOM-kill inside memory cgroups (`dmesg: Memory cgroup out of memory: Killed process medusa`) — always pass `--workers 2`; (3) it prompts "Continue without optional tools?" — answer via `printf 'yes\n' | medusa scan <target> --fail-on high --workers 2 --format json -o <dir> > log 2>&1`. Symptom decoder: exit 143 `tcsetattr` = TTY present (remove `script`); exit 137 = OOM (lower workers); all scanners "Queued" = stdin closed early; exit 0 with 0 files = allowlisted test fixture, check the JSON report.
- **Optional scanners are worth installing** — bandit (uv tool install bandit), hadolint + gitleaks (static binaries into ~/.local/bin) widen medusa's coverage and remove the prompt entirely.
- **Full medusa scans of large repos take >7 min** — never run in foreground; use terminal(background=true, notify=true) and keep total runtime under the background timeout.
- **Foreground terminal calls cap at 420s** even when timeout= is set higher — plan big scans for background from the start.
- **SkillSpector severity ≠ guilt.** Docs that MENTION credential paths (e.g. `~/.git-credentials` in troubleshooting text) score HIGH. Always read `code_snippet` per finding: prose mentions = false positive; executable scripts or literal secrets = hard stop.
- **Medusa severity ≠ verdict on LLM-heavy repos.** Repos full of agent/LLM code trip ML-research rules en masse. Security score 0 on such a repo is noise, not a breach. Triage protocol: dump findings by severity, rule, and file; read the flagged source lines; classify findings by production code versus tests, fixtures, benchmarks, docs, and release tooling; judge only what is visible. Re-run a focused scan on the actual install surface, but do not call it clean merely because the count fell. Real signals: exfil endpoints, subprocess or shell execution out of place, obfuscation, unknown domains, credential literals, unsafe network binds, and unverified bootstrap downloads.
- **Scan SKILLS at skill granularity, not repo granularity (2026-10-07, batch of 11 clones / 292 skills).** Whole-repo SkillSpector/MEDUSA runs conflate the repo's APP CODE with its installable skills (composio: repo scored CRITICAL 2187 but its actual `skills/composio` dir scored LOW/60; OpenMontage's 138 knowledge skills scored LOW-0 while its 17 CLI/registry helpers scored CRITICAL). Per-skill runs (`find <clone> -name SKILL.md` → `skillspector scan <skill_dir> --no-llm`) give the true install matrix. Medusa `--format json -o <dir>` returns a one-item LIST whose entries are summaries (security_score/risk_level/total_issues); the findings detail lives in `medusa-scan-*.json` (same dir, key `findings`) — copy THAT file, not scan_history.json, when archiving; and medusa's `match`/`code_snippet` fields can be None, so read the flagged source lines directly.
- **Bootstrap-banner FP class:** `EXTREMELY_IMPORTANT` text inside plugin JS that pre-loads skill content (superpowers.js:133) trips agent-exploitation rules — it's host-adaptation prose, not injection: no fetch, no exec, no target system. Same for tool-mapping template strings (EXA/AIC rules) and `.pi/extensions` mapping prose.
- **Install matrix pattern that worked:** per-skill verdicts → install LOW (score ≤25) with collision-suffix by clone slug + category routing via SKILL.md/body keywords; write an INSTALL-MANIFEST (installed ∪ held-back ∪ repo-layer table); held-back HIGH/CRIT recorded with reasons for Shams's later review. 250 installed / 46 held from 292 scans, no false-NEGATIVE observed.
- **2026-10-05 forensics — harvested research rules are regex-broad; verify against rule packs.** Rule YAML lives at `~/.local/share/uv/tools/medusa-security/lib/python3.11/site-packages/medusa/rules/**/*.yaml`. Reproduced overbreadth on github/spec-kit: `MEDUSA-MM-SCAN-058` pattern is bare `PLA` (no \b) → matches "TEMPLATE/IMPLACE/COMPLIANCE" (492 hits on templates/); `MEDUSA-JB-SCAN-031` has `DUMP\s*\(` with no boundary → matches every `yaml.safe_dump(`/`.dump(` (542 hits); `AIC-EXFIL-005` `.key` → matches `.keys()` dict calls and `*.key` in a repo's own secret-exclusion docs (462). When a count looks insane (hundreds from one rule), read the rule's own YAML patterns FIRST, reproduce the match against the cloned-free source, then judge — 30 min of forensics beats a wrong verdict either way.
- **Review setup before execution.** For a source-built application, inspect the task runner, bootstrap/activation wrapper, setup script, package manifests, and `.env.example` before running anything. Verify pinned download checksums, identify every command that starts services or installs dependencies, and force development services to bind to localhost rather than `0.0.0.0`; never place Hermes, provider, GitHub, or personal credentials in a first-boot `.env`.
- **Bumblebee is read-only by design** — safe to run any time; it never executes package managers and never emits MCP env/credential values.