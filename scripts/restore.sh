#!/usr/bin/env bash
# ARKAN HERMES restore: bring Shams's Hermes back to life on ANY machine.
# Usage: bash scripts/restore.sh [git-url]
set -euo pipefail

HERMES_HOME="${HERMES_HOME:-$HOME/.hermes}"
WORKSPACE="${HERMES_WORKSPACE:-$HOME/hermes-workspace}"
REPO="${1:-https://github.com/ArkanForShams/arkan-hermes.git}"

echo "== ARKAN HERMES restore =="

# --- 1. Install Hermes if missing ---
if ! command -v hermes >/dev/null 2>&1; then
  echo "[1/4] Installing Hermes Agent..."
  curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
else
  echo "[1/4] Hermes already installed."
fi

# --- 2. Get the archive ---
if [ ! -d "$WORKSPACE/.git" ]; then
  echo "[2/4] Cloning archive from $REPO ..."
  git clone "$REPO" "$WORKSPACE"
else
  echo "[2/4] Archive already present, pulling latest..."
  git -C "$WORKSPACE" pull origin main || true
fi

# --- 3. Restore files ---
echo "[3/4] Restoring soul, memory, skills, config..."
mkdir -p "$HERMES_HOME/skills" "$HERMES_HOME/cron"
rsync -a "$WORKSPACE/SOUL.md" "$HERMES_HOME/SOUL.md"
rsync -a "$WORKSPACE/config/config.yaml" "$HERMES_HOME/config.yaml"
rsync -a --delete "$WORKSPACE/skills/" "$HERMES_HOME/skills/"
if [ -f "$WORKSPACE/cron/jobs.yaml" ]; then
  rsync -a "$WORKSPACE/cron/jobs.yaml" "$HERMES_HOME/cron/jobs.yaml"
fi

# --- 4. Health check ---
echo "[4/4] Running health check..."
hermes doctor || true

echo ""
echo "RESTORE COMPLETE."
echo "Next steps (one-time):"
echo "  1. hermes setup     # add your API keys / model provider"
echo "  2. hermes model     # pick your model"
echo "  3. hermes           # start talking to your restored Hermes"
echo ""
echo "Secrets were never stored in the repo — add them fresh:"
echo "  ~/.hermes/.env (API keys), ~/.git-credentials (GitHub push access)."