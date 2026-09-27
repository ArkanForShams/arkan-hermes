---
name: agent-work-status-report
version: 0.1.0
description: Build verified status reports of agent setup work.
author: Shams Tabrez (shams), Hermes Agent
license: MIT
platforms: [linux]
metadata:
  hermes:
    tags: [status, reporting, sessions, kanban, cron, verification]
---

# Agent Work Status Report

Produces the user's expected format when they ask for a status report on setup
work done by agent sessions: per-workstream tables with progress bars and
percentages, wall-clock durations, live-verified state, and honest caveats.
The reporting rule this user cares about most: **verify against live system
state; agent self-reports are claims, not facts.**

## User format requirements (every report)

- One table per workstream or work session: Workstream | progress bar (█ and ░,
  10 chars) | % | time spent | verified state.
- A combined "In progress / scheduled" table with concrete ETAs (next cron run
  times, container build estimates).
- A separate "waiting on user" section for items blocked on them.
- End with honest caveats: what was verified vs self-reported, interruptions
  that cost time, what only activates at next session start.
- Report wall-clock total and note overlapping parallel workstreams — never sum
  overlapping durations into one total.

## Procedure

1. Enumerate the work: `hermes sessions list`, then per-session detail from the
   `sessions` table in `~/.hermes/state.db` (exact schema and ready-made SQL in
   `references/state-db-activity-queries.md`). Subagent runs live in the
   `async_delegations` table; durations come from epoch-float timestamps.
2. Pull each work session's self-reported progress: the last long assistant
   message (>400 chars) usually contains the agent's own progress board with
   bars, percentages, and time accounting.
3. VERIFY every load-bearing claim before repeating it:
   - `hermes cron list` — jobs actually armed, next-run times real
   - `docker ps --format '{{.Names}}\t{{.Status}}'` — containers healthy + uptime
   - `ls -la` on files/dirs the work claims to have created — timestamps match
   - ports/endpoints claimed live actually answer
   Downgrade anything that fails verification to "unverified" in the report.
4. Durations: `started_at → last_activity_at` per session; open sessions shown
   as "(open)". For delegations: `completed_at − dispatched_at`.
5. Compose per the format rules above; lead with an overall completion
   estimate and the time window covered.

## Pitfalls

- The `sessions` table's key column is `id`, NOT `session_id` — `messages`
  references it as `session_id`. Join on `sessions.id = messages.session_id`.
- Timestamps are epoch floats in some tables and ISO strings in others; try
  `float()` first, fall back to string slicing.
- The default kanban board is typically empty on this install — don't present
  kanban as the task source; sessions + async_delegations are the real record.
- Don't total the "time spent" column when workstreams ran in parallel; state
  the wall-clock span of the earliest start to the latest activity instead.
- A heavily retried or interrupted step that never finished is "in progress
  with blocker", never a completed percentage — report the retry cost honestly.
- Pull pending-item ETAs from `hermes cron list` next-run times, never from a
  previous session's memory of them — schedules change and stale ETAs read as
  false precision. When the user asks "what's pending / in progress", lead
  with the cron schedule table plus a short "waiting on user" list.
