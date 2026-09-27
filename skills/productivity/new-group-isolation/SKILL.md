---
name: new-group-isolation
description: Isolate a new chat group into a 7-layer workspace.
version: 1.0.0
author: Shams Tabrez (ArkanForShams), Hermes Agent
license: MIT
platforms: [linux]
metadata:
  hermes:
    tags: [isolation, groups, memory-os, workspaces]
    related_skills: []
---

# New Group Isolation Skill

Creates a fully isolated workspace for a new chat group, mapped onto the seven-layer Memory OS. Everything learned inside the group stays inside the group's own folders. Nothing reaches global memory, global memory files, or other chats unless Shams personally says to push it global.

## When to Use

- Shams creates a new group and says to use the new group isolation skill (or "isolate this group").
- Don't use for: the main ARKAN control group, or any group Shams did not explicitly flag for isolation.

## Isolation Invariants (never violate)

1. Group learnings are written ONLY to the group's own folder tree — never to global `MEMORY.md`, `USER.md`, the `memory` tool, or `user` profile.
2. Group content is never referenced in other chats, cron briefs, or subagent contexts, except as "an isolated project exists" with no details.
3. `push global` is a manual, explicit command from Shams — never inferred, never automated.
4. Each group maps its knowledge into the 7-layer structure so Memory OS can evolve per-group (see Layer Mapping).
5. Memory extraction (Icarus) still runs — but group-session learnings are curated into the group's own `fabric/` and `facts/` folders during session-end review, not into global stores.

## Quick Reference

- Init: `terminal(command="bash ~/.hermes/skills/productivity/new-group-isolation/scripts/init_group.sh <slug> \"<purpose>\" <chat_id>")`
- Promote one item: `bash .../scripts/promote_global.sh <slug> <file-in-group-tree>`
- Registry: `~/hermes-groups/REGISTRY.md`
- Group tree: `~/hermes-groups/<slug>/`

## Procedure

1. **Confirm scope.** Get the group's `chat_id` from session context and the group's purpose from Shams. If the group already has a folder in the registry, stop — one folder per group, reuse it.
2. **Create the workspace.** Run `init_group.sh <slug> "<purpose>" <chat_id>` (slug: lowercase-hyphen). It creates the 7-layer tree, `GROUP.md`, `soul/GROUP_RULES.md`, and appends to `REGISTRY.md`. Completion check: `search_files(target='files', path='~/hermes-groups/<slug>')` shows all layer folders.
3. **Confirm boundaries to Shams.** One line: workspace path, isolation strict, promotion only on his explicit order.
4. **Work group-local.** During sessions in that group: durable facts → `facts/`, session insights and decisions → `fabric/`, reference knowledge → `wiki/raw/`, session summaries → `sessions/`, standing group rules → `soul/GROUP_RULES.md`. Update `GROUP.md` learnings log as work progresses.
5. **Session-end curation.** At the end of a group session, extract learnings into the group's own folders (this is how the group's layers evolve). Global memory stays untouched.
6. **Promotion (only on explicit order).** When Shams says push a specific item global: run `promote_global.sh <slug> <file>` — it copies the item into `~/vault/wiki/raw/` prefixed `group-<slug>-`, logs it in `GROUP.md`, and leaves the group copy in place. For a fact-level push, add it to global memory in the same turn and say so plainly.

## Layer Mapping (per-group tree)

| Layer | Global (Memory OS) | Group-local equivalent |
|---|---|---|
| 1 Workspace | MEMORY.md / USER.md / CREATIVE.md | `GROUP.md` (+ learnings log) |
| 2 Sessions | state.db full-text search | `sessions/` (one summary file per session) |
| 3 Structured facts | memory_store.db + trust scoring | `facts/` (one MD file per durable fact) |
| 4 Fabric cross-session | Icarus fabric store | `fabric/` (insights, decisions, patterns) |
| 5 Vector DB | Qdrant knowledge_base | `wiki/` content, ingested on promotion with `group-<slug>` source tag |
| 6 LLM Wiki | self-curating vault | `wiki/{concepts,entities,comparisons}` |
| 7 Ground truth | SOUL.md hierarchy | `soul/GROUP_RULES.md` (group-specific rules that bind work in this group) |

## Pitfalls

- **Slug collisions:** `init_group.sh` refuses an existing slug; never "temp" names — use the company/project name.
- **Context drift:** if a session in the isolated group starts referencing global memory as if it were group knowledge, stop and re-anchor: group first, global only for universal ARKAN behavior.
- **Promotion is selective:** pushing one file does not push the group. Never bulk-promote without an explicit per-item order.
- **chat_id binding:** if messages arrive from a different chat_id than `GROUP.md` records, flag it before treating them as group business.

## Verification

- `ls ~/hermes-groups/<slug>/` shows: GROUP.md, sessions/, facts/, fabric/, wiki/{raw,concepts,entities,comparisons}, soul/, archive/.
- `REGISTRY.md` contains the new group row.
- After a working session: `GROUP.md` learnings log updated; global memory files untouched (diff against session start if unsure).
