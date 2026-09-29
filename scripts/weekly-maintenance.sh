#!/usr/bin/env bash
# Weekly archive maintenance — run by cron a8b9f2c384f2
# Keeps the prompt that triggers this file minimal; all detail lives here.
set -uo pipefail
WS=~/hermes-workspace
STAMP=$(date +%Y-%m-%d)
OUT="$WS/security/reports/weekly-$STAMP.txt"
mkdir -p "$WS/security/reports"

{
  echo "=== ARKAN weekly maintenance — $STAMP $(date +%H:%M) ==="
  echo ""
  echo "--- 1. GitHub archive sync ---"
  bash "$WS/scripts/backup-to-github.sh" 2>&1 | tail -3
  echo ""
  echo "--- 2. Archive integrity (gitleaks on working tree) ---"
  if command -v gitleaks >/dev/null; then
    (cd "$WS" && gitleaks detect --no-git --report-path /dev/null --report-format json 2>&1 | tail -2) || echo "gitleaks flagged findings — review!"
  else
    echo "gitleaks binary missing!"
  fi
  echo ""
  echo "--- 3. Gate baseline (skill/repo posture) ---"
  bash "$WS/scripts/security-gate.sh" baseline 2>&1 | tail -4 || true
  echo ""
  echo "--- 4. Machine snapshot ---"
  echo "disk: $(df -h / | awk 'NR==2{print $4" free"}')"
  echo "mem:  $(free -h | awk 'NR==2{print $7" available"}')"
  echo "date: $(date -u '+%Y-%m-%d %H:%M UTC')"
} > "$OUT" 2>&1

# archive the report
cd "$WS"
git add security/reports/weekly-$STAMP.txt >/dev/null 2>&1
git commit -m "weekly maintenance report $STAMP" >/dev/null 2>&1 && git push >/dev/null 2>&1
echo "SUMMARY_FILE=$OUT"
echo "HEAD=$(git rev-parse --short HEAD 2>/dev/null)"
tail -20 "$OUT"