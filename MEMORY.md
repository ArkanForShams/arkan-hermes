# Durable Memory — ARKAN HERMES Archive

Living memory notes that must survive machine loss. Updated by the weekly backup job.

## Infrastructure (set up 2026-09-24)

- Public GitHub repo `ArkanForShams/arkan-hermes` = complete Hermes archive (SOUL.md, USER.md, MEMORY.md, skills/, config.yaml, cron snapshots, backup + restore scripts). PUBLIC by design since 2026-09-28: it hosts the live personal site (GitHub Pages workflow `pages.yml` deploys `website/site-live/` as artifact root → site URL is `https://arkanforshams.github.io/arkan-hermes/`). gitleaks scans all 32 commits clean; secret-bearing files (.env, auth.json, .git-credentials) are gitignored and never pushed.
- Weekly cron job syncs `~/.hermes` live state → `~/hermes-workspace` → GitHub (public, secrets-free).
- Revival runbook: `docs/RESTORE.md` in the repo. One-command restore: `scripts/restore.sh`.
- Git identity: `Shams Tabrez (Hermes) <ArkanForShams@users.noreply.github.com>`; token in local `~/.git-credentials` and `~/.hermes/.env` as `GITHUB_TOKEN` (never committed).
- Secrets policy: repo holds settings, never secrets.

## Notes

(append new durable facts below — the cron job commits this file weekly)