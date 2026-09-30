---
name: github-backup
description: "Use when syncing Hermes state to the GitHub backup repo."
version: 1.0.0
created_by: agent
---

# ARKAN HERMES GitHub Backup

Keep `github.com/ArkanForShams/arkan-hermes` (PRIVATE) in sync with live Hermes state at `~/.hermes`. This archive is Shams's inheritance copy — soul, user profile, memory, skills, config.

## Standard backup procedure

1. Run the sync script:
   ```bash
   bash ~/hermes-workspace/scripts/backup-to-github.sh
   ```
   (timeout ≥ 120s). It rsyncs SOUL.md, skills/, config.yaml, cron snapshots into `~/hermes-workspace`, commits, and pushes — and is a no-op when nothing changed.
2. Verify from output: a pushed commit hash, or "No changes since last backup".
3. If push failed:
   - Check credentials: `~/.git-credentials` must contain the GitHub HTTPS line (chmod 600).
   - Check token: `curl -s -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/user` — `GITHUB_TOKEN` lives in `~/.hermes/.env`.
   - Retry once after fixing; report exact errors if still failing.
4. Report to the user: what changed, commit hash, repo link, and the repo visibility posture (public by design — see below) whenever you touched repo settings.

## Repo visibility posture (updated 2026-09-30)

The repo is **PUBLIC by design** — it hosts Shams's live personal site via GitHub
Pages (`pages.yml` deploys `website/site-live/` as artifact root; site URL is the
repo root `https://arkanforshams.github.io/arkan-hermes/`). Do NOT flip it private
without Shams's explicit decision — that takes his live site offline. Safety holds
because: secrets are gitignored (.env, auth.json, .git-credentials), gitleaks
(pre-commit + weekly) scans clean, and secret-bearing files have never been pushed
(verified across all 32 commits on 2026-09-30).

## Secret scan (weekly)

- Vendored Hermes source tree (`~/.hermes/hermes-agent/`) generates ~850 gitleaks
  FPs (test fixtures, unsloth reference docs). Use the filtered config instead:
  ```bash
  /home/shams/.local/bin/gitleaks detect --source ~/.hermes --no-git --redact \
    --config ~/hermes-workspace/security/gitleaks.config.toml \
    --report-format json --report-path /tmp/gitleaks.json
  ```
  Expected: ~13 findings, ALL expected (`.env` files + `auth.json` + `supabase.client.json`
  credential stores + 1 vendored-header FP). Report anything OUTSIDE those files.
- Also run weekly: `gitleaks detect --source ~/hermes-workspace` (git mode, all
  commits) — must stay "no leaks found" (exit 0).

## Hard rules

- NEVER commit secrets: no tokens, no `.env`, no `auth.json` (`.gitignore` guards these). The GitHub token lives only in local `~/.git-credentials` and `~/.hermes/.env`.
- Don't flip the repo private unilaterally (kills the live site; see posture above).
- Weekly cadence is the minimum; big milestones get an immediate manual run.

## Restore (for inheriting this setup)

Point at `docs/RESTORE.md` in the repo and `scripts/restore.sh`. One-command revival on any machine: install Hermes, clone repo, run restore script, re-add secrets via `hermes setup`.

## Weekly cron

A cron job named `arkan-hermes-weekly-backup` runs this procedure every Sunday morning and reports to the Telegram home chat. Recreate it with cronjob if missing (schedule `every sunday 9am`, skills: github-backup).