---
name: agent-export
description: "Use when exporting a skill library to a sibling agent."
category: autonomous-ai-agents
---

# Agent-Setup Export (cloning a library to a sibling agent)

Packaging a whole Hermes agent's skill library (+ referenced machine scripts) so a sibling agent (NFARKAN and future ones) installs it in one pass. This is a recurring class, not a one-off — every export follows this shape.

## Procedure

1. Stage a fresh tree — never export from inside ~/.hermes directly (caches and state ride along): copytree skills/ with `ignore_patterns("__pycache__", ".git", "node_modules", "*.pyc", ".DS_Store", "Thumbs.db")`.
2. Walk every SKILL.md for referenced machine artifacts — pattern `.hermes/scripts/<name>` — and copy exactly those from `~/.hermes/scripts/`. A wildcard family mention (e.g. `memory-*.sh`) means bundle the WHOLE family (list the directory first), not one 'missing' filename parsed out of the regex.
3. Write INVENTORY.md: counts per category, custom-built vs stock split, an explicit referenced-but-NOT-bundled list, and environment-dependency notes (Memory OS docker stack, camofox browser, machine-local CLIs — what degrades gracefully without them).
4. Write INSTALL.md: unzip → two rsync lines (skills/, scripts/) → verify (`hermes skills list`, `hermes doctor`) → the recipient's own install gate rule for FUTURE skills → adaptation section (recipient platform/model differences). Identity rule: the recipient gets its OWN soul — never ship the source agent's SOUL.md.
5. Per-file SHA256SUMS.txt manifest, then zip, then append the zip's own hash to the manifest.
6. SECURITY GATE over the package itself (security-gate skill): gitleaks with `--no-git` over the whole tree (pass = final line 'no leaks found'); SkillSpector `--recursive` — AND separately per category directory, since one top-level scan silently misses nested content; triage every finding per that skill's operational lessons (prose mentions on markdown-only files = FP; executable code or secrets = hard stop).
7. Deliver zipfile + checksum; record the gate verdicts with the package notes.

## Rules

- No secrets ever: tokens, API keys, credentials, config-embedded values. Gitleaks is the gate, not a formality — a leak fails the export outright; fix by re-staging, never by redacting inside the zip.
- Skills carry procedures, not personal state: memories/, cron/, sessions/, messaging tokens, .env never enter an export.
- Versioned package: date-stamped filename; SHA256SUMS.txt inside lists every file, then the package hash itself.

## Pitfalls

- Flat skills vs category dirs: a skills tree can hold both flat skill directories and category subdirectories — verify the scan's skill count against the inventory, not the tool's silence.
- A wildcard-named script reference is a family reference, not a missing file — glob the scripts dir before declaring gaps.
- Late additions invalidate the audit: after ANY post-build fix, rebuild the zip and re-stamp hashes — a package whose checked content diverges from what was verified is a failed audit.
- Report file_count and total SKILL.md count separately (507 files ≠ 156 skills) — install verification matches on SKILL count; quoting the wrong one makes every future install look 'incomplete'.
