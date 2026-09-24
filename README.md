# ARKAN HERMES — The Living Archive

This repository is the complete, restorable backup of **Shams Tabrez's Hermes Agent** — his soul, memory, skills, configuration, and automation. It exists so that Shams's Hermes can be revived anywhere on Earth with a single command, and so his family, friends, and future generations can inherit a working, evolving AI agent.

**Owner:** Shams Tabrez (GitHub: `ArkanForShams`)
**Repo visibility:** PRIVATE
**Update cadence:** Weekly (automated Hermes cron job) + on-demand

---

## What lives here

| Path | What it is |
|---|---|
| `SOUL.md` | Hermes's soul — his personality and operating principles |
| `USER.md` | Who Shams is — the master user profile |
| `MEMORY.md` | Durable memory notes that must survive every session |
| `skills/` | Every installed skill (full tree, as installed in `~/.hermes/skills/`) |
| `config/config.yaml` | Hermes settings (no secrets — secrets never leave `.env`) |
| `cron/` | Snapshot of scheduled jobs |
| `scripts/backup-to-github.sh` | The weekly sync script (idempotent, safe to run any time) |
| `scripts/restore.sh` | One-command restore onto a fresh machine |
| `docs/RESTORE.md` | Full revival runbook — read this on a new machine |

## Revive Hermes anywhere (short version)

```bash
# 1. Get this repo (needs GitHub access to Shams's account)
git clone https://github.com/ArkanForShams/arkan-hermes.git ~/hermes-workspace

# 2. Restore everything
bash ~/hermes-workspace/scripts/restore.sh
```

Full details, including how to authenticate: **see `docs/RESTORE.md`**.

## Rules of this archive

1. **Never commit secrets.** API keys, tokens, `.env` files stay local. The repo holds settings, not credentials. (Exception: the GitHub token lives only in local `~/.git-credentials` and `~/.hermes/.env` on machines that need push access.)
2. **Every project we work on gets committed here.** If it isn't in this repo, it isn't real.
3. **Weekly is the minimum.** The cron job syncs weekly; any big milestone gets an immediate manual sync.
4. **Restore > rebuild.** Anyone inheriting this repo should be able to reconstruct Shams's Hermes exactly.