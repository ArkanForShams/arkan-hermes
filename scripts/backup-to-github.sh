#!/usr/bin/env bash
# ARKAN HERMES weekly backup: sync live Hermes state -> GitHub.
# Idempotent: commits and pushes only when something changed.
# Run manually any time, or via the Hermes weekly cron job.
set -euo pipefail

HERMES_HOME="${HERMES_HOME:-$HOME/.hermes}"
WORKSPACE="${HERMES_WORKSPACE:-$HOME/hermes-workspace}"

cd "$WORKSPACE"

echo "== ARKAN HERMES backup $(date -u '+%Y-%m-%d %H:%M UTC') =="

# --- 1. Sync live state into the repo ---
rsync -a "$HERMES_HOME/SOUL.md" SOUL.md
mkdir -p skills config cron
rsync -a --delete "$HERMES_HOME/skills/" skills/
rsync -a "$HERMES_HOME/config.yaml" config/config.yaml

# cron jobs snapshot (jobs.yaml if present + CLI listing)
if [ -f "$HERMES_HOME/cron/jobs.yaml" ]; then
  rsync -a "$HERMES_HOME/cron/jobs.yaml" cron/jobs.yaml
fi
if command -v hermes >/dev/null 2>&1; then
  hermes cron list > cron/cron-snapshot.txt 2>/dev/null || echo "cron listing unavailable" > cron/cron-snapshot.txt
fi

# --- 2. Commit + push only real changes ---
git add -A
if git diff --cached --quiet; then
  echo "No changes since last backup. Repo already up to date."
else
  git commit -m "Hermes backup: $(date -u '+%Y-%m-%d %H:%M UTC') [auto]"
  git push origin main
  echo "Pushed to github.com/ArkanForShams/arkan-hermes (private)."
fi