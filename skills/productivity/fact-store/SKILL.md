---
name: fact-store
description: Layer 3 CRUD for Memory OS structured facts with trust.
version: 1.0.0
author: Shams Tabrez (ArkanForShams), Hermes Agent
license: MIT
platforms: [linux]
metadata:
  hermes:
    tags: [memory-os, facts, layer3, sqlite]
    related_skills: []
---

# Fact Store Skill (Layer 3)

CRUD + trust scoring for structured durable facts in `~/.hermes/memory_store.db`, implementing the interface from memory-os `layers/03-fact-store.md` (this fork ships only the injection read-path; this skill completes the write-path).

## When to Use

- A durable fact about Shams, his environment, projects, or tools should persist with entity linkage and trust scoring.
- Shams corrects or confirms something previously stored (update/feedback path).
- Before writing a possibly-contradicting fact (contradict check).
- Don't use for: ephemeral session state, task tracking (that's fabric), or vector knowledge (that's the wiki/Qdrant path).

## Quick Reference

CLI: `python3 ~/.hermes/scripts/fact_store.py <action> [args]` — all output JSON.

- add: `add --content "..." --category user_pref|project|tool|general --entities "X,Y" --tags "a,b"`
- search: `search --query "..." [--limit N]` (FTS5, falls back to LIKE)
- probe: `probe --entity "Ollama"` (all facts about one entity)
- reason: `reason --entities "Ollama,Memory OS"` (facts linking 2+ entities)
- contradict: `contradict --content "..." [--exclude-fact-id N]` (candidates before add)
- update: `update --fact-id N --content/--tags/--category/--trust-delta`
- remove: `remove --fact-id N`
- feedback: `feedback --fact-id N --helpful yes|no` (recomputes Bayesian trust)

## Procedure

1. **Add:** store fact with category + entities (entities power probe/reason). Completion: JSON `status: added` with fact_id.
2. **Before add when topic feels known:** run `contradict --content "..."`; review candidates; update the existing fact instead of adding a duplicate when one matches.
3. **After using a retrieved fact in a reply:** call `feedback --fact-id N --helpful yes` in the same turn (or `no` when it misled). This is the SOUL Layer 7 rule — without feedback trust scores never move.
4. **Corrections from Shams:** `update` the fact (or remove + re-add if fundamentally different), never leave both versions standing.

## Pitfalls

- content is UNIQUE — exact duplicates are rejected by SQLite; catch and treat as "already known" (optionally update instead).
- category is constrained: user_pref, project, tool, general.
- FTS query syntax: plain words OR-separated; quoted phrases for exact match; avoid bare `*`.
- The fork's Icarus `_search_facts` reads this same DB — writes here become injectable `[facts]` context on first turns of future sessions.
- Script is ARKAN-local (in `~/.hermes/scripts/`, not in the upstream repo) — re-check the repo on updates before diverging further.

## Verification

- `add` then `search --query "<term>"` returns the fact with retrieval_count incremented.
- `probe --entity X` shows the new linkage.
- `feedback --fact-id N --helpful yes` moves trust_score above 0.5; `no` moves it below.