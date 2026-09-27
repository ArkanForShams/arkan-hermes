---
name: memory-os-ops
description: Operate and evolve the seven-layer Memory OS stack.
version: 1.0.0
author: Shams Tabrez (ArkanForShams), Hermes Agent
license: MIT
platforms: [linux]
metadata:
  hermes:
    tags: [memory-os, docker, qdrant, ollama, infrastructure]
    related_skills: [new-group-isolation, security-gate]
---

# Memory OS Operations Skill

Runs, repairs, and extends the seven-layer Memory OS at `~/memory-os` (upstream github.com/ClaudioDrews/memory-os, commit e03db1f1, MEDUSA-gated before install). Covers the container stack, ingestion pipeline, Icarus plugin, and maintenance crons. Group-isolated memory is governed by `new-group-isolation`; vetting repo updates is `security-gate`'s job.

## When to Use

- Stack down after reboot/power cut, ingestion failing, retrieval returning nothing, or a layer needs wiring.
- Adding durable knowledge to the vault; changing the embedding backend; updating the upstream repo.
- Don't use for: group-local workspaces (new-group-isolation), repo vetting (security-gate).

## Architecture Map

| Piece | Location | Notes |
|---|---|---|
| Container stack | `~/memory-os/docker` (compose + ARKAN override) | redis, qdrant, worker, ollama (local, embeddings only) |
| Compose secrets | `~/memory-os/docker/.env` (chmod 600) | REDIS_PASSWORD, WORKER_LLM_* — never display |
| Session + facts DBs | `~/.hermes/state.db`, `~/.hermes/memory_store.db` | additive schemas from `setup/setup_db.py` |
| Vector collection | Qdrant `knowledge_base`, dense 768 + BM25 sparse | localhost:6333, keyless (port bound to 127.0.0.1) |
| Icarus plugin | `~/.hermes/plugins/icarus` | hooks inject `[fabric]`/`[qdrant]`/`[facts]`/`[sessions]` blocks |
| Knowledge vault | `~/vault/wiki/raw/` | markdown with YAML frontmatter → hourly auto-ingest |
| Maintenance crons | Hermes cronjobs (5, all `deliver: local`, `no_agent`) | wrappers in `~/.hermes/scripts/memory-*.sh` |
| Layer 7 | `~/.hermes/SOUL.md` § Memory Ground Truth | adapted text; NEVER append the repo's `execution-agent-protocol.md` — its wait-for-authorization gate conflicts with ARKAN autonomy levels |

## Standing Rules

- **Ollama cloud only** for all LLM wiring (Shams's explicit order): chat via `https://ollama.com/v1` or native `/api/generate` with the existing `OLLAMA_API_KEY`. Never introduce OpenRouter or any other provider.
- **ollama.com has NO embedding endpoints** — embeddings run on the local ollama container (`nomic-embed-text`, 768 dims) at `http://localhost:11434/v1`. Any new component that must embed reads `EMBEDDING_API_BASE`/`EMBEDDING_MODEL`/`EMBEDDING_DIMS` from `~/.hermes/.env`.
- **768-dim invariant:** collection, worker env, and every host-side script must agree. A mismatch yields silently empty search results, not errors — check dims first when retrieval returns nothing.
- **Host memory scripts use `~/memory-os/.venv`**, never Hermes's venv (it lacks arq/redis/qdrant_client/fastembed, and Hermes's venv is not ours to grow).

## Procedures

1. **Boot after power cut / reboot.** Start Docker Desktop from Windows (`powershell.exe -NoProfile -Command "Start-Process ...'Docker Desktop.exe'"`), wait for engine, then `wsl.exe -e bash -lc 'cd ~/memory-os/docker && docker compose up -d --build'`. Layer cache resumes interrupted builds — never delete images or cache to "fix" a partial build. Completion: `docker compose ps` shows 4 healthy containers.
2. **Verify health (one pass):** containers healthy → `curl localhost:6333/collections` lists `knowledge_base` → `curl localhost:11434/v1/embeddings` returns 768 dims → `fabric_brief` answers.
3. **Manual (re)ingest:** `cd ~/memory-os && EMBEDDING_API_BASE=http://localhost:11434/v1 EMBEDDING_MODEL=nomic-embed-text EMBEDDING_DIMS=768 WIKI_ROOT=$HOME/vault/wiki .venv/bin/python scripts/bulk_wiki_ingest.py`. Use after collection rebuild or bulk edits; the hourly cron handles normal additions.
4. **Add durable knowledge:** write markdown with frontmatter (`title`, `tags`) into `~/vault/wiki/raw/` — ingestion is automatic. Completion: next hourly run logs it, or run the bulk script and `points_count` rises.
5. **Change embedding model:** pull the model into the ollama container, set `EMBEDDING_DIMS` consistently in compose `.env` + Hermes `.env`, DELETE and recreate the Qdrant collection, re-run bulk ingest. Old-dimension points poison a renamed collection — always rebuild, never mix.
6. **Update upstream repo:** re-run the MEDUSA gate on the new commit (see `security-gate`), diff against `~/memory-os`, re-apply ARKAN local changes (compose override, Qdrant key removal, ollama-only script patches, reflection_trigger env path), then `docker compose up -d --build`.

## Pitfalls

- **Qdrant v1.17+ enables auth when `QDRANT__SERVICE__API_KEY` is present-but-empty** (401 for every localhost client). The compose file must have that line REMOVED, not set empty — keyless is the intended posture because the port is 127.0.0.1-only.
- **`context_enhancer.py` sparse path needs `FASTEMBED_VENV` + `FASTEMBED_SITEPKGS`** in Hermes `.env` pointing at the memory-os venv; without them it fails-open to dense-only search (lower recall, no error surfaced).
- **Worker writes to `state.db`** (reflection budget) — the `~/.hermes` mount into the worker container must stay read-write; a read-only hardening pass will break micro-reflections.
- **Retrieval empty but no errors** → dims mismatch or collection missing before anything else.
- **`fact_store` is injection-only in this fork** (no add/remove tool); durable-fact writes go through `fabric_write` and the vault, not a CRUD tool.
- **Icarus extraction is env-routed**: `ICARUS_ENDPOINT=https://ollama.com/v1/chat/completions`, `ICARUS_API_KEY_ENV=OLLAMA_API_KEY`, `ICARUS_EXTRACTION_MODEL=glm-5.3-flash` in `~/.hermes/.env` — the defaults point at OpenRouter/DeepSeek and must stay overridden.

## Verification

- `docker compose ps`: 4 containers healthy; `curl localhost:6333/collections/knowledge_base` → 768 dims, points_count matches ingested files.
- End-to-end retrieval: run `scripts/context_enhancer.py "<known-topic>"` with the env vars from the bulk ingest — expect the source doc at score ≥ 0.6 and no `[CE-ERROR]` lines.
- Fabric layer: `fabric_brief` returns recent session entries.
- Full env/cron/repair tables: `references/deployment.md`.
- Erasing personal content the user asked to delete: `references/privacy-deletion.md` (state.db + FTS + filesystem sweep, two-pass, VACUUM).
