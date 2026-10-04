---
name: hermes-agent-profiles
version: 1.2.0
description: Create Hermes agent profiles with original SOUL.md souls, and wire a profile's own Telegram bot.
license: MIT
platforms: [linux, wsl]
---

# Hermes Agent Profiles — multi-agent setup with souls

Standing up additional named Hermes agents (each = one profile home: config, .env, SOUL.md, memories, sessions, cron, state.db) and making each behave as its own person via SOUL.md.
Use for Shams's AI-department agent roster work. Not for delegate_task subagents — those are session-scoped with no persistent home; a profile is the durable home for a long-lived agent.

## Hard rules (always apply)

- **A new profile gets an original SOUL.md — never run it on the source agent's cloned soul.** `--clone` copies the soul of the creating session's profile; slot #1 of the system prompt is loaded verbatim from `~/.hermes/profiles/<name>/SOUL.md`, so an untouched clone answers and behaves as the source agent, not the new hire.
- **Keep operational state out of the clone's memory.** `--clone` copies `memories/MEMORY.md` wholesale, including the source's cron roster and running-jobs notes — false for the new profile whose `cron/` starts empty. Read `memories/MEMORY.md`, replace all source-operational lines with a one-line neutral statement about this profile, keep the user-portrait lines, and copy the cleaned file across same-batch profiles.
- **Messaging credentials split: access rules are mine, the token is Shams's.** I set TELEGRAM_ALLOWED_USERS / TELEGRAM_HOME_CHANNEL (his caller ID — non-secret, safe to set without asking). The token he alone adds. Give him the exact command with a `<paste token here>` placeholder and never the bare key alone: `hermes -p <name> config set KEY VALUE` is two-argument, NOT an interactive prompt — bare it prints usage help, and following it with a real token in chat pastes the secret into the transcript. Any token that reached chat or a screenshot gets revoked at BotFather immediately (/mybots → API Token → Revoke) before reuse.
- **Profile creation itself is local/additive — execute it**, then report the roster. Config-only `--clone` is the safe default; reach for `--clone-all` only when Shams asks for everything state-wise.
- **Name agents per Shams's department convention:** one-word Arabic names with a stated meaning (arkan = pillars, hakim = the wise one, basir = the perceptive one). Propose name + meaning together so he can approve the person, not just a slug.

## Procedure

1. **Scope.** `hermes profile list` for the current roster. Agree the name (Arabic-meaning persona) and role as one `--description` sentence usable for kanban routing. Creating 2–3 pilots is safe without asking; expanding the roster is a decision to surface, not assume.
2. **Create:** `hermes profile create <name> --clone --description "<role sentence>"`
   - `--clone` carries config.yaml, .env provider keys, SOUL.md, skills, and curated memory — the agent is functional immediately. Messaging tokens, cron, sessions, state.db stay behind by design.
   - `hermes` creates a CLI alias automatically: `hakim`, `hakim setup`, `hakim chat` all just work.
   - Verify with `hermes profile list` — a multiplexed gateway lists and serves new profiles without restart.
3. **Forge the soul.** See `templates/soul-persona.md` (copy-and-modify skeleton) and `references/soul-authoring.md` (writing conventions). Sections: Identity / Core Functions / Communication Style / Values / Avoid / Defaults (~2.5–3.5 KB).
   - Write to `<name>/SOUL.md.new` then `mv` over `SOUL.md` — avoids wasting a full-read of the cloned soul while honoring the overwrite guard.
4. **Clean memory** per the hard rule above; same-batch profiles share one cleaned MEMORY.md.
5. **Smoke test before reporting live:**
   `hermes -p <name> chat -q "Smoke test: state your name, your role, and the one thing you must never do to Shams. 3 short lines."`
   A soul-load failure answers as the source agent (e.g. "I am ARKAN") — retell the roster only after the agent answers as itself.
6. **Report:** roster line per agent, what each does, how to reach (`hakim chat` from terminal; the profiles are already gateway-served), and the remaining step that needs Shams (bot token for a new platform connection, if he wants one — see the wiring section below). Match length to the ask: quick factual questions ("how many agents", "what are the skills", status checks) get a short bullet list — full tables are for decisions and analysis, not status checks. Explicit length requests ("answer in one line") are hard constraints: give exactly the requested shape, even mid-rich-answer.

## Telegram wiring per profile (env-var install; verified path)

1. **Shams creates the bot** at @BotFather: `/newbot` → friendly name (e.g. "Hakim — Business Architect") → username ending in `bot` (e.g. `hakim_shams_bot`) → copy the token (`<botid>:AA…`). One fresh bot per agent — never reuse the default ARKAN bot's token, never share one token across two profiles (Hermes refuses token collisions).
2. **I pre-set access** (non-secret):
   ```
   hermes -p <name> config set TELEGRAM_ALLOWED_USERS 8812850993
   hermes -p <name> config set TELEGRAM_HOME_CHANNEL 8812850993
   ```
   Shams's user ID is the one allowed value in EVERY profile — it is his badge at each door. The bot's own ID (digits before `:` in its token) is the bot's identity card, never an allowed user.
3. **Shams adds the token himself** in the WSL terminal — BotFather's copy action frequently truncates the token (a captured half is a ~35-char colonless string and the gateway then logs `✗ telegram failed to connect (profile: X)` after each rescan). Use a hidden read-prompt so the terminal never truncates and the token never appears in chat or a screenshot:
   ```bash
   read -rp "Paste <name> token: " T && hermes -p <name> config set TELEGRAM_BOT_TOKEN "$T"
   ```
   Env-routed keys are written into the profile's `.env` — the tool confirms "✓ Set … in …/.env".
4. **The gateway connects it automatically** — the running multiplexed gateway picks up the profile the moment the token exists; no restart, and this install needs no `platforms:` block (env-var based). `hermes tools setup` does not exist in this version — the config-set path is the working one.
5. **Verify:** the connectivity verdict is the gateway's own log line — `✓ telegram connected (profile: <name>)` in `~/.hermes/logs/gateway.log` (each profile rescan follows its .env change within ~1 min; the successful line may lag the last failure by a minute — grep the tail, judge by the latest line). Validate token SHAPE offline (`^\d{6,12}:[A-Za-z0-9_-]+$`, full length) while printing only structure — bot-ID and secret length, never the secret. Skip ad-hoc `api.telegram.org/getMe` probes: WSL's direct HTTPS path differs from the gateway's, so a probe failure does not prove the token is bad. Then Shams sends "hi" to each bot; each must answer in its own soul's voice (Hakim boardroom, Basir evidence, ARKAN strategist). If one stays silent, check `hermes profile list` gateway column and `hermes logs` on my side before claiming a fault.

## Pitfalls

- `write_file` refuses to overwrite an existing SOUL.md until that exact file was read this session — even for a byte-identical clone. Use the `.new`-then-`mv` dance (step 3) rather than burning a 28 KB read per file.
- One-shot `hermes -p <name> chat -q` boots the profile fresh per call — correct tool for smoke tests; the running gateway never needs interruption.
- Never hand-edit `config.yaml`; use `hermes -p <name> config set` / model pickers for per-profile settings.
- Docs retrieval: `curl https://hermes-agent.nousresearch.com/docs/llms.txt` is the primary index; individual doc pages are Docusaurus HTML — fetching `<page>.md` 404s, fetch the page URL itself and strip tags. If web_extract reports a search-only backend, curl directly or tell Shams to configure `web.extract_backend`.
- Terminal screenshots Shams shares can carry live secrets mid-line — scan for token-shaped strings (`<digits>:AA…`) before anything else, and on a hit call for immediate BotFather revocation. The rule binds MY OWN transcription too: echoing even a fragment of a token from a screenshot into the reply IS the leak, same as pasting it in chat — state the verdict ("token exposed → revoke now") and reproduce zero secret characters.
