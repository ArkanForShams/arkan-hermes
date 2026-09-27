---
name: safe-hermes-update
version: 0.1.0
description: "Update Hermes safely with backup, config diff, and rollback."
author: Shams Tabrez (shams), Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [hermes, update, backup, configuration, maintenance]
    related_skills: [hermes-agent]
---

# Safe Hermes Update Skill

Updates Hermes to the newest version while protecting the user's configuration,
secrets, skills, sessions, and cron jobs. Philosophy: **back up first, diff the
config against the new version's defaults, update, then verify — with a clean
rollback path at every step.**

## When to Use

- User asks to update Hermes, or reports something broke after an update.
- Before any `hermes update` on this machine.
- Don't use for: plugin installs (`hermes plugins ...`), profile creation, or
  fresh installs.

## Prerequisites

- `hermes` on PATH; know `$HERMES_HOME` (default `~/.hermes`).
- Git-installed Hermes: `~/.hermes/hermes-agent/` is a git checkout.
- No sudo required for any step.

## Procedure

### Step 0 — Pre-flight (read-only)

1. `hermes update --check` — is an update actually available? If not, stop.
2. `hermes update --plan` — read-only inventory: install kind (git/docker/nix),
   every live gateway across profiles, supervisor, and running code version.
   Note any profile that would need a restart.
3. Record current state for later comparison:
   - `hermes --version` (or the git SHA: `git -C ~/.hermes/hermes-agent rev-parse HEAD`)
   - `hermes doctor` output (baseline health)
   - `git -C ~/.hermes/hermes-agent status --porcelain` — a dirty tree blocks
     the update; ask the user how to handle local changes before proceeding.

### Step 1 — Back up everything

1. Full backup (config + skills + sessions + data; excludes codebase):
   `terminal(command="hermes backup -l pre-update", timeout=300)`
2. Confirm the zip exists and is non-trivial in size (default output:
   `~/hermes-backup-<timestamp>.zip`).
3. The update itself also takes a quick state snapshot into
   `~/.hermes/state-snapshots/` per profile — leave `updates.pre_update_backup`
   at its current setting unless the user asks otherwise.

Completion check: one full-backup zip path recorded, size > 1 MB.

### Step 2 — Diff current config against the incoming version

Do this BEFORE updating, so the user knows what the update may change:

1. Fetch the new version's defaults:
   `terminal(command="git -C ~/.hermes/hermes-agent fetch origin", timeout=120)`
   then read `hermes_cli/config_defaults.py` from `origin/main` without
   switching branches:
   `git -C ~/.hermes/hermes-agent show origin/main:hermes_cli/config_defaults.py > /tmp/new_defaults.py`
   (if missing there, locate with `git -C ~/.hermes/hermes-agent ls-tree -r
   origin/main --name-only | grep -i config_default`)
2. Compare with the live defaults: extract every `DEFAULT_CONFIG` key from both
   files and list (a) keys the new version adds, (b) keys it removes, (c) keys
   whose default VALUES change. Ignore keys the user never set — they follow the
   new default automatically, which is fine.
3. Check `_config_version` in both. If the new version bumps it, the update
   migrates `config.yaml` automatically — say so, and note the migration means
   the old file is transformed (rollback = restore from the Step 1 backup).
4. Cross-check the user's `config.yaml` against anything the new version
   renames or restructures (release notes: `git -C ~/.hermes/hermes-agent log
   origin/main --oneline -20`).

Report to the user: added/removed/changed keys, migration expected or not, and
anything that touches a setting they explicitly use (gateway, profiles,
messaging, cron). Get a go-ahead before updating when a used key is affected.

### Step 3 — Update

1. `terminal(command="hermes update --backup --yes", timeout=600)` —
   `--backup` forces the full pre-update backup + quick snapshot; `--yes`
   accepts the plan printed earlier. Never use `--no-backup`.
2. Never interrupt mid-run; the updater re-execs into the pulled tree and
   restarts gateways fleet-wide. A foreground timeout converts it to a tracked
   background process — poll it, don't relaunch.
3. On refusal (dirty tree, venv holders on Windows), resolve the named cause —
   don't reach for `--force` without the user's explicit OK.

### Step 4 — Verify (update is not done until this passes)

1. Version moved: `hermes update --check` reports up-to-date; git SHA changed.
2. Config intact: `hermes config get gateway.multiplex_profiles` (or any key
   the user explicitly set in Step 2) returns the SAME value as before.
3. Health: `hermes doctor` — no NEW warnings vs the Step 0 baseline.
4. Gateway alive (if it was running): `hermes gateway status` shows running,
   with the NEW `code_version` stamped (fleet matrix check).
5. Secrets still load: a trivial `hermes chat -q "reply with ok"` (or any
   command that resolves a provider key) succeeds — proves `.env`/auth.json
   survived.
6. Cron jobs intact: `hermes cron list` matches the pre-update count.

### Step 5 — Rollback (only if verification fails)

1. `hermes import <zip-from-step-1>` restores the full home.
2. Code rollback: `git -C ~/.hermes/hermes-agent checkout <old-sha>` then
   reinstall deps per the update receipt's post-swap step.
3. `hermes gateway restart` if a gateway was running.
4. Re-run Step 4 verification on the rolled-back state, then STOP and report
   the failure to the user — don't retry blind.

## Pitfalls

- **Never edit `config.yaml` by hand** during the diff step — read-only
  comparison only; use `hermes config get/set` if a change is truly needed.
- **Update receipts** land in `~/.hermes/logs/update_receipts/latest.json` —
  read it when diagnosing a failed step; it records skips WITH reasons.
- **Fleet rule:** updates restart EVERY profile's gateway, not just this chat's.
  A mixed-version fleet is a failed update, not a steady state.
- **The dirty-tree ZIP fallback destroys untracked files** — commit or stash
  local hermes-agent changes before updating.
- **Fresh-session effect:** the running session keeps old code; new behavior
  shows up next session. Don't claim new features work in-session.

## Verification

- All five Step 4 checks pass and were actually run (not assumed).
- Backup zip path + new version/SHA reported to the user.
