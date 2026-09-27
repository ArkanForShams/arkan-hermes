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
4. Report to the user: what changed, commit hash, repo link, and confirm repo is still private (API field `"private": true`) whenever you touched repo settings.

## Hard rules

- NEVER commit secrets: no tokens, no `.env`, no `auth.json` (`.gitignore` guards these). The GitHub token lives only in local `~/.git-credentials` and `~/.hermes/.env`.
- The repo must stay PRIVATE. If it ever shows public, flip it back immediately:
  `curl -X PATCH -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/repos/ArkanForShams/arkan-hermes -d '{"private":true}'`
- Weekly cadence is the minimum; big milestones get an immediate manual run.

## Restore (for inheriting this setup)

Point at `docs/RESTORE.md` in the repo and `scripts/restore.sh`. One-command revival on any machine: install Hermes, clone repo, run restore script, re-add secrets via `hermes setup`.

## Weekly cron

A cron job named `arkan-hermes-weekly-backup` runs this procedure every Sunday morning and reports to the Telegram home chat. Recreate it with cronjob if missing (schedule `every sunday 9am`, skills: github-backup).