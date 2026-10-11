# spec-kit repo scan — manual triage (gate override)

- URL: https://github.com/github/spec-kit (main, scanned 2026-10-05)
- MEDUSA: 2669 findings, 181 rule groups, score 0, risk CRITICAL (3759 FPs auto-filtered first)
- Gate verdict: BLOCKED (automatic). Manual triage below.

## Where the 2669 findings live
- Overwhelming majority in tests/ fixture files (e.g., test_manager_commands.py 136 hits, test_manager_skills.py 93, test_setup_tasks.py 85) — pytest fixtures with crafted strings.
- Prompt/command markdown (extensions/*.md, presets) triggering prompt-injection & ML rules — the product IS a prompt-template kit.
- src/ hits individually inspected.

## src/ triage (sources fetched to this dir, every flagged line read)
| Rule group | File(s) | Source reality | Verdict |
|---|---|---|---|
| B602 / WEB-CMDI-001 | workflows/step/shell/__init__.py:56-58 | Intentional shell=True in a workflow step executor, commented noqa + "catalog-installed workflows should be reviewed" security note; timeout validation hardened | FP-by-design (we author our own workflows; never run unreviewed catalog workflows) |
| MEDUSA-MM-SCAN-058 (973) | src/__init__.py:38, tests/* | Import line + pytest fixture noise | FP |
| AIC-EXFIL-005 (129) | _console.py:134, tests/* | readchar keypress handling (key.UP/CTRL_P) + test fixtures | FP |
| MEDUSA-JB-SCAN-031 (116) | _utils.py:117, tests/* | yaml.safe_dump + fixture noise | FP |
| MEDUSA-INF-SCAN-2056/AEXP-096 | extensions/__init__.py, events | Module import/init lines | FP |
| MEDUSA-FTSC-089 / TC004 / FTSCAN-231 | _download_security.py, mcp/server.py, bundles | repo's OWN hardening module (zip-slip, SSRF IP guards, download caps); MCP stdio server | FP (security-positive content triggers rules) |
| MD-PI (2) | extensions/assess|bug commands md | Security-positive: templates explicitly teach agents to REFUSE injected instructions, redact creds, sandbox writes | FP — scanner fired on the phrases the template defends against (same class as browse-safe rewrite, Sep 30) |
| SAST-ENV-002 (5) | tests/* | test env fixtures | FP |

## Notable real observations (not attacks)
1. Shell-step executor is a designed arbitrary-command tool for workflow authors inside a project — do not install untrusted third-party spec-kit workflow catalogs.
2. `specify init` fetches release bundles from GitHub at runtime (network activity is expected and normal).
3. Bundled SKILL.md/command md files are agent prompt content — treated as data; never auto-loaded into ARKAN; anything adapted for Hermes passes the SkillSpector skill gate first.

## Verdict
FP-dominated (prompt-kit/test-noise class). No exfil endpoints, no live secrets, no obfuscation, no malicious executables; repo ships its own download hardening.
**Decision: gate overridden by manual triage → cleared to clone + install CLI (specify-cli via uv).**

## License / facts
MIT · GitHub-official org · ★140k · Python 3.11+ requirement (host has 3.11.16) · default branch main.

Artifacts: report medusa-scan-20261005-170954.json (+raw-payloads); inspected sources in ~/hermes-workspace/security/speckit-triage/