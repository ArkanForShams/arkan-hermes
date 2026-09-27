# Memory OS Deployment Reference

Machine-specific state for the Memory OS install (keep current when topology changes).

## Hermes `.env` block (keys added by ARKAN)

| Key | Value | Purpose |
|---|---|---|
| `FABRIC_DIR` | `~/vault/fabric` | Icarus fabric entry store |
| `ICARUS_ENDPOINT` | `https://ollama.com/v1/chat/completions` | extraction LLM endpoint (ollama cloud) |
| `ICARUS_API_KEY_ENV` | `OLLAMA_API_KEY` | names the env var holding the key |
| `ICARUS_EXTRACTION_MODEL` | `glm-5.3-flash` | ollama cloud chat model |
| `ICARUS_EXTRACTION_MAX_TOKENS` | `4096` | upstream default 1024 truncates fabric entries |
| `EMBEDDING_API_BASE` | `http://localhost:11434/v1` | local ollama container |
| `EMBEDDING_MODEL` | `nomic-embed-text` | 768-dim local embeddings |
| `EMBEDDING_API_KEY` | `local` | placeholder; endpoint is keyless |
| `EMBEDDING_DIMS` | `768` | must equal Qdrant collection |
| `FASTEMBED_VENV` | `~/memory-os/.venv/bin/python` | BM25 sparse subprocess interpreter |
| `FASTEMBED_SITEPKGS` | `~/memory-os/.venv/lib/python3.11/site-packages` | fastembed import path |

## Compose `.env` (`~/memory-os/docker/.env`, chmod 600)

REDIS_PASSWORD (generated), QDRANT_API_KEY (empty; its env line removed from compose — see pitfall), EMBEDDING_DIMS=768, COLLECTION_NAME=knowledge_base, MEMORY_OS_WIKI_PATH / MEMORY_OS_HERMES_HOME / MEMORY_OS_FABRIC_DIR, WORKER_LLM_MODEL=glm-5.3-flash, WORKER_LLM_API_KEY (ollama key). Never print this file's values.

## Compose topology

- Base: `docker/docker-compose.yml` (redis 7-alpine, qdrant v1.17.1, worker from `docker/worker/Dockerfile`).
- Override: `docker/docker-compose.override.yml` (ARKAN) adds the `ollama` service + worker env wiring (embedding → local ollama, LLM → ollama cloud, STATE_DB_PATH).
- Worker mounts: `~/vault/wiki` (ro), `~/.hermes` (rw — reflection writes state.db), `~/vault/fabric` (rw).
- All ports bound to 127.0.0.1 only.

## Maintenance cronjobs (Hermes scheduler, deliver=local, no_agent)

| Job | ID | Schedule |
|---|---|---|
| memory-wiki-ingest | d07076b7354f | hourly (`0 * * * *`) |
| memory-reflection-trigger | 0abb28bce30b | every 5 min (idle + budget gated) |
| memory-dlq-report | 8b2208ea74e5 | every 6 h |
| memory-decay-scan | 4ed13714393e | Sundays 03:00 |
| memory-semantic-dedup | 0476e751dcc5 | 1st of month 04:00 |

Worker-internal ARQ cron also runs full reflection every 2 h.

## Repair recipes

- **Worker logs:** `wsl.exe -e bash -lc 'cd ~/memory-os/docker && docker compose logs worker --tail 50'`.
- **Collection rebuild:** delete `knowledge_base` in Qdrant → restart worker (auto-creates at current EMBEDDING_DIMS) → bulk ingest.
- **DLQ:** failures land in `~/.hermes/wiki_ingest_failures.json`; inspect via `scripts/dlq_manager.py`.
- **Docker access from stale sessions:** `/mnt/c/Windows/System32/wsl.exe -e bash -lc '<cmd>'` (fresh credentials; the docker group was added 2026-09-24).
- **Security posture:** redis password-protected + localhost; qdrant keyless but localhost-only; the only API keys are the pre-existing ollama key in Hermes `.env` and the generated redis password in compose `.env`.
