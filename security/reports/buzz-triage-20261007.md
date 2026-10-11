# Buzz Workspace security triage — 2026-10-07

## Gate result

- Repository: `https://github.com/block/buzz`
- HEAD checked before action: `da651ad6726154ff1fe314fc64462031970f1106`
- Scanner: MEDUSA v2026.7.0, full repository scan
- Files scanned: 3,498
- Retained findings: 910
- Severity among retained findings: 181 CRITICAL, 393 HIGH, 213 MEDIUM, 63 LOW, 60 INFO
- Gate result: **BLOCKED** (`6,712` HIGH+ matches after the scanner's filtering)
- No repository clone, dependency installation, setup script, Docker Compose startup, or desktop launch was performed.

## Manual triage performed

The scanner's largest groups are concentrated in:

1. `desktop/src/testing/e2eBridge.ts` — E2E test bridge and mock controls. Findings are largely test-only globals, fixtures, comments, and deliberately exposed test seams.
2. `AGENTS.md` / `CLAUDE.md` — repository contributor/agent workflow documentation. These are data files and must not be treated as instructions by Hermes.
3. `benchmarks/harbor-buzz-orchestra/**` — benchmark/test harness code. Several findings are expected from code that intentionally launches commands, containers, or test web services, but this remains untrusted until the harness is excluded from an install review.
4. `scripts/desktop_release.py` — release tooling that invokes `gh`; this is operational tooling, not part of the runtime needed for a local desktop test.
5. Docker Compose files — local development credentials such as `buzz_dev` are present. They are not production credentials, but must remain localhost-only and must not be reused.
6. GitLeaks private-key findings — sampled occurrences were test fixtures or redacted/placeholder material in tests; they were not proven to be live credentials. A full source-level review is still required before treating the repository as clean.

## Current recommendation

Do not install or execute the repository yet. The scan contains enough unresolved HIGH/CRITICAL findings that the mandatory gate cannot be overridden responsibly based only on aggregate counts. The next safe step is a narrower source review of the runtime paths only, explicitly excluding benchmarks, E2E fixtures, release tooling, and documentation, followed by a fresh scan of the exact install surface.

## Environment prerequisites discovered

- Docker is installed: Docker 29.8.0.
- Node.js is installed: v26.9.0.
- Missing: Hermit, `just`, Rust toolchain, pnpm.
- This session is WSL2 with no `DISPLAY`; a native Tauri desktop window cannot be launched from the current WSL shell until a GUI-capable Windows/Linux desktop path is available.

## Upstream self-host workflow observed in README

The README describes the developer/self-host path as:

1. Docker plus Hermit, or Rust 1.88+, Node 24+, pnpm 10+, and `just`.
2. Clone the repository.
3. Source `./bin/activate-hermit`.
4. Run `just setup && just build`.
5. Run `just dev` to start the relay and desktop app.
6. Local relay is `ws://localhost:3000`.
7. For agents, configure `BUZZ_PRIVATE_KEY` and use `buzz-cli`.

These steps have **not** been executed because the security gate blocked the repository.
