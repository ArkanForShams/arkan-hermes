#!/usr/bin/env bash
# ARKAN new-group-isolation: push ONE group item to the global wiki (explicit order only).
# Usage: promote_global.sh <slug> <file-in-group-tree>
set -euo pipefail

SLUG="${1:?usage: promote_global.sh <slug> <file>}"
FILE="${2:?file required}"
ROOT="$HOME/hermes-groups/$SLUG"

[ -d "$ROOT" ] || { echo "no such group: $ROOT"; exit 1; }
[ -f "$FILE" ] || { echo "no such file: $FILE"; exit 1; }

case "$FILE" in
  "$ROOT"/*) ;; *) echo "file is not inside $ROOT — refusing"; exit 1;;
esac

DEST="$HOME/vault/wiki/raw/group-${SLUG}-$(basename "$FILE")"
cp "$FILE" "$DEST"

printf '- pushed global: %s -> %s (%s)\n' "$FILE" "$DEST" "$(date -Iseconds)" >> "$ROOT/GROUP.md"
echo "promoted: $DEST"
echo "note: run wiki ingest (or ask ARKAN) to index it into Qdrant with the group-${SLUG} source tag."