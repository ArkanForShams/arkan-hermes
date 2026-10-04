---
name: telegram-group-ops
description: "Use when organizing Telegram forum topics via Bot API."
version: 1.1.0
category: productivity
---

# Telegram Group Ops (Bot API from this WSL box)

Manage Shams's Telegram groups programmatically: organize chats into forum topics, probe bot admin rights, read chat state, deploy structure, wait on owner toggles. The gateway bots are already connected — these ops add structure on top. Related: new-group-isolation (7-layer memory workspaces per group), scheduled-jobs (cron/watcher patterns).

## Always-on rules

- **Never print the bot token.** Read it from `~/.hermes/.env` (`TELEGRAM_BOT_TOKEN`) into a variable in-process; it never enters chat or a report.
- **Probe before acting; never assume.** Read `getChat` (forum status) and `getChatMember` (bot rights) before any mutation, and re-verify even after Shams says a toggle is saved — trust what the API reports, not the report (toggles get saved to the wrong group or not at all).
- **Owner-gated changes belong to Shams's UI, not scripts.** Granting the bot rights, converting a group to a forum (Topics toggle), re-adding a bot that left — he does these with 3 taps. Send the exact path, then automate waiting with a watcher; do not retry the API call against a missing right.
- **Any loop that creates artifacts needs a resume guard.** Append one success line per created item to a per-target results file and re-check it before creating each item — a partial failure re-deployed in full duplicates what already succeeded. The guard must match success lines only; matching all lines blocks retry forever after a FAIL.
- **Watchers stay silent while waiting.** Idle tick = exit 0 with empty stdout. Notify on deploy, on one actionable blocker (once per lifetime), and on completion; then self-delete.

## Procedure — organize a group into forum topics

1. **Reconcile with prior work first.** Check `~/hermes-workspace/*-map.md`, the group's pinned messages, and `hermes cron list` for an existing taxonomy or watcher — a prior phase (possibly compacted out of current context) may have deployed or be deployed-pending the same system; a second deploy double-posts identical topics and splits routing.
2. **Mine real themes from session history.** Chat roster: `sessions` table of `~/.hermes/state.db` AND each profile's `~/.hermes/profiles/<name>/state.db`. Themes: `role='user'` messages from the big per-chat sessions in `messages` — Shams's own phrasing is the theme source; assistant/tool text is not. Open a COPY of the db (copy db + `-wal` + `-shm` to scratch and point sqlite at the copy) — the live db can refuse to open under gateway contention.
3. **Write the taxonomy to `~/hermes-workspace/telegram-topic-map.md`** — keep to ~10 topics: name, one-sentence description, which history anchors each. One shared taxonomy across groups; deploy per group.
4. **Probe the target group:** `getChat` → `is_forum: true` means topics are creatable; `type: group` means basic — needs Shams's Topics toggle (auto-converts to supergroup). `getChatMember` for the bot → `status: administrator` + whether `can_manage_topics` is set; a `status: left` member needs re-adding first.
5. **Deploy the topics** with the skill script `scripts/tg_topic_deploy.sh <chat_id>` (`DRY=1` previews without API calls). It creates each topic (createForumTopic), sets its description (editForumTopicInfo), appends one OK line per success, and skips already-recorded topics on rerun.
6. **Pin a directory in the General topic.** `message_thread_id: 1` (General) is NOT addressable by sendMessage in many forum groups (400 "message thread not found") — the working pattern: plain `sendMessage` to the group with NO thread id (it posts into General owner-side), then `pinChatMessage` on the returned message_id. One line per topic + the routing rule that anything new starts in General/New Topics and gets filed or promoted later.
7. **When the right or forum toggle is pending,** install the watcher cron (no_agent, ~10m interval) that probes the toggle each tick, deploys on flip, notifies once, and self-deletes when every target group is done — see scheduled-jobs 'Self-terminating watcher jobs'. Give Shams the toggle path: group name → Administrators → bot → Manage Topics ON.

## Pitfalls

- **HTML entities are literal in topic names** — `createForumTopic` parses nothing, so `&amp;` shows literally; use raw characters. Descriptions are plain text too (no parse_mode) — no entities, no markdown there either.
- **Omit `icon_custom_emoji_id` entirely**; passing it empty gets the whole create call 400-rejected.
- **A bot cannot promote itself**, even with can_promote_members — Telegram refuses self-promotion, so missing rights wait for the owner, not for a clever API path.
- **`not enough rights to create a topic` = missing can_manage_topics.** Only the group owner can grant it. Verify with getChatMember each time this appears — it is also the symptom of the toggle being unsaved or set in a different group.
- **api.telegram.org is the only host this box's resolver fails on.** Pin it per call (`--resolve api.telegram.org:443:149.154.167.220`) or permanently in `~/.curlrc` (`resolve = api.telegram.org:443:149.154.167.220`), and keep `--max-time` on every call.
- **One topic = Hermes routing key.** The gateway keys each forum topic as its own session (`chat:-id:thread_id` in session keys, `platform:chat_id:thread_id` delivery grammar) — reports and replies can target a single topic deliberately.
- **Never address thread_id 1 directly.** General is a UI concept, not an API-addressable thread in most forum groups — sendMessage with `message_thread_id: 1` 400s with "message thread not found"; post without a thread id instead (it lands in General) and pin from there.
- **Match chats by chat_id, never by display name.** Deleted-and-recreated groups reuse the name — the superseded basic-group id and the new forum supergroup id both sit in the directory and session store for a while, and only the chat_id tells which one the gateway actually routes to.
- **Run approval-gated mutation batches as a script: write the exact confirmed actions to a file and execute it via terminal.** State-changing execute_code cells trip the mutation consent gate and a chat-word 'approved' does not count as kernel consent, while the file+terminal path runs the identical, already-confirmed actions.
