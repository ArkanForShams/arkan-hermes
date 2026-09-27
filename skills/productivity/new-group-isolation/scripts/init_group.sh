#!/usr/bin/env bash
# ARKAN new-group-isolation: create an isolated 7-layer group workspace.
# Usage: init_group.sh <slug> "<purpose>" [chat_id]
set -euo pipefail

SLUG="${1:?usage: init_group.sh <slug> \"<purpose>\" [chat_id]}"
PURPOSE="${2:?purpose required}"
CHAT_ID="${3:-unknown}"
ROOT="$HOME/hermes-groups/$SLUG"

if [ -e "$ROOT" ]; then
  echo "EXISTS: $ROOT — pick another slug or reuse the group"
  exit 1
fi

mkdir -p "$ROOT"/sessions "$ROOT"/facts "$ROOT"/fabric "$ROOT"/soul "$ROOT"/archive \
         "$ROOT"/wiki/raw "$ROOT"/wiki/concepts "$ROOT"/wiki/entities "$ROOT"/wiki/comparisons

cat > "$ROOT/GROUP.md" <<EOF
# Group: $SLUG

- chat_id: $CHAT_ID
- created: $(date -Iseconds)
- purpose: $PURPOSE
- isolation: STRICT — nothing leaves this tree without Shams's explicit "push global"
- pushed_global: (nothing yet)

## Learnings Log

EOF

cat > "$ROOT/soul/GROUP_RULES.md" <<'EOF'
# Group Rules (Layer 7 — binds all work in this group)

1. Group context stays in this group. No cross-posting, no global memory writes.
2. Facts, insights, and session notes are curated into this workspace at session end.
3. Global/ARKAN identity and values still apply; group rules add to them, never replace them.
4. Promotion to global happens only on Shams's explicit, per-item order.

EOF

REG="$HOME/hermes-groups/REGISTRY.md"
if [ ! -f "$REG" ]; then
  printf '# Isolated Groups Registry\n\n| group | chat_id | created | purpose |\n|---|---|---|---|\n' > "$REG"
fi
printf '| %s | %s | %s | %s |\n' "$SLUG" "$CHAT_ID" "$(date +%F)" "$PURPOSE" >> "$REG"

echo "created $ROOT"
find "$ROOT" -type d | sort
echo "registered in $REG"