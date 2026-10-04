# Telegram Topic Map — Shams's Organized Chats

Built 2026-10-02 by ARKAN from full conversation-history mining (sessions 2026-09-21 → 2026-10-02).
Purpose: segregate chats into topic threads so every future conversation lands organized.

## Proposed topics (10)

| # | Topic | Description | Anchor/history |
|---|---|---|---|
| 1 | 💼 CTO/CAIO Career Path | Executive coaching, presentations, meeting prep, monthly strategic reviews | cto-caio presentation stack, exec coaching skills |
| 2 | 🏗️ AI Department & Agents | Agent roster, profiles, souls (hakim/basir), orchestration, new agents | hakim+basir created 2026-09-29 +29 Sep session |
| 3 | 🧠 Memory OS & Knowledge | Seven-layer memory, Qdrant, fact store, wiki ingest, extraction hooks | deployed 2026-09-24, docker stack |
| 4 | 🦸 Skills Library | 151 SKILL.md library, waves 1-5, new skill requests, backlog | skills ingest + 46 custom skills built |
| 5 | 🌐 Websites & Public Presence | arkan-hermes live site, shams-website, hosting, publish queue, LinkedIn/GitHub identity | site LIVE, Lighthouse 98+ |
| 6 | 🎨 Missions & Design | Landing pages, KINETIQ taste, decks, creative explorations | missions 01-03, design-taste fact |
| 7 | 🚗 Cinematic Builds | Deepal launch site, keyframes, Veo shots, scrollytelling | 751-message Deepal build |
| 8 | 💰 Wealth & Shariah | Halal planning, screening, basket watch, independence roadmap | wealth skills + Mon-Fri watch cron |
| 9 | 🔧 System Ops | Gateway, cron roster, backups, restarts, WSL/DNS, daily reviews | daily-system-review, weekly backup |
| 10 | 📥 New Topics (Inbox) | Anything new starts here; promoted to its own topic when it earns one | open-ended |

## Group placement

- ARKAN HERMES UPGRADE GROUP (-5134379055): basic group — needs Topics toggle by Shams (30 sec, auto-converts to supergroup)
- Expert Cinematic (-1003984392699): forum ALREADY ON, bot admin — topics creatable now
- ARKAN Hermes Skills (-5571268681): basic group, not forum, bot left
- ARKAN Hermes Isolated (-5320598062): basic group, not forum, bot admin

## API notes (for reuse)

- WSL DNS broke after 2026-10-01 sleep cycle — Bot API calls must use `--resolve api.telegram.org:443:149.154.167.220`
- Token lives in ~/.hermes/.env (TELEGRAM_BOT_TOKEN); never print it
- createForumTopic returns message_thread_id; deleteForumTopic removes cleanly
- Bot ID 8831608846 (@Shams9484bot); getMe flag has_topics_enabled is a bot-setting echo, not group forum status
- Probe scripts: ~/.hermes/cache/scratch/tg_forum_check.sh, tg_groups_survey.sh, tg_probe_topic.sh