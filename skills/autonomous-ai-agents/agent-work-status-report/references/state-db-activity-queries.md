# state.db Activity Queries

Schema notes and ready-made queries for building status reports from
`~/.hermes/state.db` (SQLite). Read-only access; open with `sqlite3.connect(...)`.

## Schema notes

- `sessions` key column is **`id`** (e.g. `20260924_163921_620346f5`), NOT
  `session_id`. The `messages` table FK column IS `session_id` — join with
  `sessions.id = messages.session_id`.
- Useful `sessions` columns: `title`, `source` (telegram/cli/subagent),
  `started_at`, `ended_at`, `last_activity_at`, `message_count`,
  `tool_call_count`, `input_tokens`, `output_tokens`, `profile_name`,
  `archived`, `hidden`.
- Timestamps are epoch floats in `sessions`/`async_delegations`; format with
  `datetime.fromtimestamp(float(ts))`. Handle `None` (open sessions).
- `async_delegations`: `delegation_id`, `parent_session_id`, `state`,
  `dispatched_at`, `completed_at` (epoch floats; duration = completed −
  dispatched), `task_json` (batch shape: `goals` list + per-task `results`),
  `result_json` (per-task `summary`, `duration_seconds`, `tool_trace`).
- `messages`: `role` (assistant/tool/user), `content`, `tool_name`, `timestamp`.

## Queries

### Recent work sessions with activity stats

```sql
SELECT id, title, source, started_at, ended_at, last_activity_at,
       message_count, tool_call_count, input_tokens, output_tokens
FROM sessions WHERE archived=0
ORDER BY last_activity_at DESC LIMIT 8;
```

### Tool usage mix per session (what the session actually did)

```sql
SELECT tool_name, COUNT(*) AS n
FROM messages WHERE session_id=:sid AND role='tool'
GROUP BY tool_name ORDER BY n DESC;
```

### Subagent delegation runs and durations

```sql
SELECT delegation_id, parent_session_id, state, dispatched_at, completed_at,
       (completed_at - dispatched_at) AS duration_s, task_json
FROM async_delegations ORDER BY dispatched_at;
```

Parse `task_json` for the goal text and per-task results (batch delegations
carry `goals: [...]` plus a `results` array with per-task `summary` and
`duration_seconds`).

### An agent's own final progress report

```sql
SELECT content FROM messages
WHERE session_id=:sid AND role='assistant' AND length(content) > 400
ORDER BY id DESC LIMIT 1;
```

Long final assistant messages typically contain the agent's self-reported
progress table — treat as claims to verify (cron list, `docker ps`, file
timestamps), never as the report itself.

## Live-state cross-checks (run these, don't assume)

- `hermes cron list` — scheduled jobs, active state, next-run times
- `docker ps --format '{{.Names}}\t{{.Status}}'` — container health + uptime
- `hermes kanban stats` — usually empty on this install; do not treat kanban as
  the task source
- `ls -la` on claimed output files — creation timestamps must match the session
  window
