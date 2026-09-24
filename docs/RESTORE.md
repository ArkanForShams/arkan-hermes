# ARKAN HERMES — Revival Runbook

This document is written for a future machine — a new laptop, a new city, a new decade, or a new person. Follow it top to bottom and Shams's Hermes comes back to life.

## Who this is for

Shams Tabrez, or anyone he has given access to his GitHub (`ArkanForShams/arkan-hermes`, private). The goal: **anywhere in the world, one command brings Hermes back** with the same soul, the same skills, the same memory.

## What you need

1. A Linux/macOS/WSL machine with internet.
2. `git` installed.
3. Access to the private repo — either:
   - a GitHub Personal Access Token with `repo` scope (stored securely, never committed), or
   - SSH keys already added to the `ArkanForShams` account.

## Revival — step by step

### 1. Authenticate with GitHub (one-time)

```bash
# HTTPS + token (replace YOUR_TOKEN — keep it out of any committed file)
git config --global credential.helper store
git config --global user.name  "Shams Tabrez (Hermes)"
git config --global user.email "ArkanForShams@users.noreply.github.com"
printf 'https://ArkanForShams:YOUR_TOKEN@github.com\n' > ~/.git-credentials
chmod 600 ~/.git-credentials
```

### 2. Run the restore script

```bash
bash <(git clone https://github.com/ArkanForShams/arkan-hermes.git /tmp/arkan && cat /tmp/arkan/scripts/restore.sh) 
# or, simpler:
git clone https://github.com/ArkanForShams/arkan-hermes.git ~/hermes-workspace
bash ~/hermes-workspace/scripts/restore.sh
```

The script installs Hermes (if missing), clones the archive, restores `SOUL.md`, `USER.md`, `MEMORY.md`, `skills/`, and `config.yaml`, then runs a health check.

### 3. Re-add secrets (they never travel in the repo)

```bash
# ~/.hermes/.env — model provider API keys (hermes setup will guide you)
hermes setup
hermes model   # pick provider + model
```

Then reconnect your messaging platform (Telegram etc.) per its token in `hermes setup`.

### 4. Re-arm the weekly backup

```bash
# inside a Hermes chat:
#   "create the weekly github-backup cron job using the github-backup skill"
# or manually:
hermes cron add --schedule "every sunday 9am" --prompt "Run the ARKAN HERMES weekly backup: bash ~/hermes-workspace/scripts/backup-to-github.sh, verify the push, and report what changed."
```

## What is restored vs. what is re-created

| Restored from repo | Re-created on new machine |
|---|---|
| SOUL.md, USER.md, MEMORY.md | API keys (`.env`) |
| All skills | GitHub push credentials |
| config.yaml (settings) | Messaging platform connections |
| Cron job definitions | Cron scheduler state |

## If the repo is the only thing left

Everything above is enough. The archive is designed so that **the repo is the single source of truth**: from it alone, Hermes's soul, skills, and configuration come back exactly as Shams left them.