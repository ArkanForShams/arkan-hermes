#!/usr/bin/env bash
# ARKAN security gate: unified entry to the 3-scanner stack.
# Usage:
#   security-gate.sh repo <git-url-or-local-path>   # vet a repo before cloning/installing (medusa)
#   security-gate.sh skill <path|url|zip>           # vet an agent skill before install (skillspector)
#   security-gate.sh baseline                       # read-only supply-chain inventory (bumblebee)
#   security-gate.sh secrets                        # scan chat/shell histories for leaked credentials (medusa)
set -uo pipefail
export PATH="$HOME/.local/bin:$PATH"
SEC_DIR="$HOME/hermes-workspace/security"
REPORT_DIR="$HOME/hermes-workspace/security/reports"
mkdir -p "$REPORT_DIR"
STAMP=$(date +%Y%m%d-%H%M%S)
CMD="${1:-}"; TARGET="${2:-}"

case "$CMD" in
  repo)
    [ -z "$TARGET" ] && { echo "usage: security-gate.sh repo <url|path>"; exit 2; }
    echo "== MEDUSA repo vet: $TARGET =="
    if [[ "$TARGET" == http* ]]; then
      medusa scan --git "$TARGET" --fail-on high
    else
      medusa scan "$TARGET" --fail-on high
    fi
    ;;
  skill)
    [ -z "$TARGET" ] && { echo "usage: security-gate.sh skill <path|url|zip>"; exit 2; }
    echo "== SKILLSPECTOR skill vet: $TARGET =="
    skillspector scan "$TARGET" --no-llm --format json > "$REPORT_DIR/skillscan-$STAMP.json" 2>/dev/null
    python3 - "$REPORT_DIR/skillscan-$STAMP.json" <<'EOF'
import json, sys
d = json.load(open(sys.argv[1]))
ra = d.get('risk_assessment', {})
print(f"score: {ra.get('score')}  severity: {ra.get('severity')}  recommendation: {ra.get('recommendation')}")
for i in d.get('issues', []):
    loc = i.get('location') or {}
    print(f"  [{i.get('severity')}] {i.get('category')} / {i.get('pattern')} -> {loc.get('file','?')}:{loc.get('start_line','?')} :: {str(i.get('finding',''))[:60]}")
print(f"report saved: {sys.argv[1]}")
EOF
    ;;
  baseline)
    echo "== BUMBLEBEE baseline inventory (read-only) =="
    OUT="$REPORT_DIR/inventory-$STAMP.ndjson"
    bumblebee scan --profile baseline > "$OUT" 2>/dev/null
    python3 - "$OUT" <<'EOF'
import json, sys, collections
ecos = collections.Counter()
for line in open(sys.argv[1]):
    line = line.strip()
    if line:
        ecos[json.loads(line).get('ecosystem', '?')] += 1
print(f"records: {sum(ecos.values())} -> {dict(ecos)}")
print(f"saved: {sys.argv[1]}")
EOF
    ;;
  secrets)
    echo "== MEDUSA secrets scan (read-only; purge is interactive & manual) =="
    medusa secrets scan
    ;;
  *)
    echo "ARKAN security gate — commands: repo | skill | baseline | secrets"
    [ -n "$CMD" ] && { echo "unknown command: $CMD"; exit 2; }
    ;;
esac