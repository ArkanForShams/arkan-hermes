# Privacy deletion (erasure of personal content)

Procedure for honoring "do not record this" / "delete that" requests. The mechanism matters: every tool call and tool result is persisted into `state.db` verbatim, so a personal topic discussed WITH tool calls leaves traces in `messages.content`, `messages.tool_calls`, `messages.reasoning*`, `messages.api_content`, the `messages_fts` search index, and scratch files.

## Prevention (the rule that makes deletion rare)

- For anything the user marks personal, keep the reply chat-only: NO tool calls that quote or embed their words (no searches, no memory writes, no logs echoing the topic). If analysis requires tools, reference the topic obliquely — never copy their sentences into a command.
- The `memory` tool's threat-pattern filter may refuse personal writes anyway; never retry around a refusal.

## Deletion procedure

1. **Announce scope BEFORE executing** — list exactly which rows/files will be deleted and what stays untouched. The user must be able to veto scope.
2. **Locate** with distinctive keywords unique to the exchange (not generic words — 'guardrail' matches config dumps and docs). Sweep:
   - SQLite `~/.hermes/state.db`: every text column of every table (`content`, `tool_calls`, `reasoning`, `reasoning_content`, `api_content`), case-insensitive LIKE per keyword.
   - `messages_fts` (MATCH per keyword) — the search index surfaces rows even after other cleanup.
   - Filesystem: `~/.hermes`, workspace, group dirs — `.md/.json/.jsonl/.txt/.yaml/.yml/.log` under ~8 MB, plus memory files (MEMORY.md/USER.md) and scratch dir.
   - Skip known false positives (vendored docs, config files with generic terms) — judge by whether the hit carries the PERSONAL content.
3. **Scope the delete set**: only rows whose text carries the personal content, plus the tool-call/tool-result rows created DURING the deletion work itself — those echo the keywords inside commands and outputs. Do a second pass keyed on `timestamp >= deletion-start` to catch them, then a final zero-hit verification.
4. **Delete from BOTH tables**: `DELETE FROM messages WHERE rowid IN (...)` AND `DELETE FROM messages_fts WHERE rowid IN (...)` — the FTS index keeps surfacing rows after the messages deletion alone.
5. **Physically overwrite**: `VACUUM` the database so freed pages don't retain the text; scrub (delete) scratch files created by the sweep itself.
6. **Verify**: 0 keyword hits across all text columns, FTS, and files; `PRAGMA integrity_check` = ok; memory files contain 0 hits.
7. **Report verifiably**: state exactly what was deleted (row counts, files) and what was untouched, so the user can trust completion without taking it on faith.

## Pitfalls

- Deleting rows writes NEW rows (your own tool calls/results quote the keywords) — a single-pass delete always leaves traces; the second pass is mandatory.
- Sweeping only `content` misses `tool_calls`/`reasoning`/`api_content`, which is where command text lives.
- `VACUUM` is not optional — SQLite marks rows deleted but keeps bytes in free pages until vacuum.
- Backup before deleting ONLY if the user wants reversibility; a privacy erasure usually wants NO backup containing the content.
