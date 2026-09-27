---
name: memory-os-troubleshooting
description: "Use when Memory OS layers go offline or wiki-ingest fails."
---

# Memory OS Troubleshooting

## Architecture (what lives where)

Seven-layer Memory OS on Shams's machine (WSL Ubuntu on Windows host):

- **L1** workspace memory: `~/hermes-workspace/MEMORY.md`, `USER.md`
- **L2** session search: `~/.hermes/state.db`
- **L3** structured facts: `~/.hermes/memory_store.db`
- **L4** fabric (Icarus plugin): `C:\docker-shares\fabric` (bind-mounted to worker `/fabric`)
- **L5** Qdrant vector DB: Docker container `docker-qdrant-1`, port 127.0.0.1:6333, collection `knowledge_base` (dense 4096d + sparse; status must be `green`)
- **L6** wiki ingest: hourly cron `memory-wiki-ingest` (job `d07076b7354f`, script `~/.hermes/scripts/memory-wiki-ingest.sh`) → Redis queue → ARQ worker (`docker-worker-1`) → Qdrant
- **L7** ground truth: `~/.hermes/SOUL.md`

Compose stack: `~/memory-os/docker/docker-compose.yml` (services: redis, qdrant, worker, ollama). Paths from `~/memory-os/docker/.env` (`MEMORY_OS_WIKI_PATH`, `MEMORY_OS_HERMES_HOME`, `MEMORY_OS_FABRIC_DIR`).

## CRITICAL RULE: Docker Desktop drops WSL bind mounts after host restarts

**Symptom:** containers all show `healthy`, but worker sees empty `/wiki`, `/fabric`, `/hermes`. Cron wiki-ingest logs repeat `⚠️ Redis indisponível: Error 111 connecting to 127.0.0.1:6379` (message is misleading — Redis itself is fine).

**Root cause (seen in Docker Desktop 29.8.0, msstore install):** `C:/Users/<user>/AppData/Local/Docker/log/host/monitor.log` shows `hostPathOfVolume /home/shams/... failed, skipping bind`. WSL-path binds (`/home/shams/...`) silently resolve to empty overlay dirs; container mounts stay broken even after restarting Docker Desktop, the docker-desktop WSL distro, or full `wsl --shutdown`.

**Fix in place (durable):** all bind mounts use **Windows paths** (`C:/docker-shares/wiki`, `C:/docker-shares/fabric`, `C:/docker-shares/hermes`) in `~/memory-os/docker/.env`. Ubuntu-side `~/vault/wiki` and `~/vault/fabric` are archives only; live content lives at `/mnt/c/docker-shares/`. The cron script sets `export WIKI_ROOT=/mnt/c/docker-shares/wiki`. Never switch these back to WSL paths.

Ingest state file: `~/.hermes/wiki_ingest_state.json` (worker reads `/hermes/state.db` from the Windows share copy for reflection budget).

## Diagnostic sequence (if memory layers look down)

1. `docker.exe ps --format "{{.Names}}: {{.Status}}"` (PATH += `/mnt/c/Users/SHAMS/AppData/Local/Programs/DockerDesktop/resources/bin`) — if engine unreachable, launch Docker Desktop: `cd /mnt/c/Windows && cmd.exe /c start "" "C:\Users\SHAMS\AppData\Local\Programs\DockerDesktop\Docker Desktop.exe"` (run from `/mnt/c/Windows` or cmd errors on UNC cwd).
2. Verify mounts INSIDE worker: `docker.exe exec docker-worker-1 ls /wiki/raw/` — must list files. If empty → the bind-mount bug; check `monitor.log` for `hostPathOfVolume ... failed`. Windows-path mounts never exhibit this.
3. Qdrant: `curl -s http://localhost:6333/collections/knowledge_base | grep points_count` — status `green` expected.
4. Redis from WSL: `redis.Redis(host='127.0.0.1', port=6379, password=<from docker/.env>).ping()` → True. `NOAUTH` = wrong password; connection reset = port-forward glitch → `docker compose down && docker compose up -d` in `~/memory-os/docker` (fixes forwarding).
5. WSL→Windows localhost ports reset after recreate: recreate stack before deeper debugging.
6. End-to-end test: drop a small markdown file with YAML frontmatter (`id`, `type`, `summary`) into `/mnt/c/docker-shares/wiki/raw/`, run `bash ~/.hermes/scripts/memory-wiki-ingest.sh` (expect `✅ Enfileirado`), wait ~30s, confirm `points_count` increments, then delete test file + its `wiki_ingest_state.json` entry + the Qdrant point by id (scroll with payload → POST delete).

## Related gotchas

- Docker via `docker.exe` (Windows) is intentional — Ubuntu has no docker CLI and WSL integration is deliberately unused (user decision). Docker Desktop auto-starts the memory stack containers with the engine.
- `hermes cron run <id>` triggers immediately; output lands in `~/.hermes/cron/output/<id>/`. Portuguese log text (`Enfileirado`, `Nada novo`) is normal — Memory OS scripts are Portuguese-authored.
- After host restarts, camofox (port 9377) and the site http.server (port 8765) also need manual restarts — they don't survive reboots.
- Fabric dir counts: ~94 entries is normal (Icarus session extractions).

## Verification of the fix (Sep 2026)

Full pipeline proven: file → Redis queue → worker embed (Qwen3-8B via OpenRouter) → Qdrant upsert, points 5→6→7 during tests, then cleaned back to exactly 5, collection `green`, all 4 containers healthy.