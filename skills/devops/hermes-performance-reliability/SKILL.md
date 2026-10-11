---
name: hermes-performance-reliability
description: "Use when auditing Hermes performance or reliability."
version: 0.1.0
author: ARKAN
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [hermes, performance, reliability, gateway, profiles, telegram, mcp, providers, systemd, wsl, diagnostics]
---

# Hermes Performance and Reliability

## When to Use

Use when performing a complete Hermes health audit, investigating gateway/profile reliability, or applying approved reversible performance improvements across local Hermes, WSL, systemd, Telegram, MCP, providers, Docker, or the web UI.

Use this class-level workflow for complete Hermes audits and approved optimization. The user's standing requirements are: diagnose before changing; preserve credentials, sessions, memories, profiles, and user data; back up before every modification; redact secrets and personal data from reports; prefer reversible changes; and obtain approval before changing credentials, Telegram settings, systemd, firewall, Docker, network, MCP authentication, deleting data, installing software, or sending external messages.

## Procedure

### 1. Establish a read-only baseline

Record the exact time, Hermes version, Git revision, update state, active profiles, and running services before touching anything:

```bash
hermes --version
hermes update --check
hermes update --plan
hermes doctor
hermes gateway status
git -C ~/.hermes/hermes-agent status --short --branch
git -C ~/.hermes/hermes-agent rev-parse HEAD
```

Also inspect Python, Node, pnpm/npm, Rust/Cargo, Docker, Git, systemd, WSL/kernel, CPU/memory/disk, clock/timezone, listening ports, and Hermes/gateway processes. Capture logs from gateway, errors, agent, update, MCP, provider, web UI, and tool subsystems. Never include token values, cookies, private keys, passwords, personal identifiers, or full authorization headers.

### 2. Inventory the fleet and integrations

For every profile under `~/.hermes/profiles/`, record only safe metadata: profile name, existence of config/soul/memory/session stores, enabled platforms, model/provider names, and service ownership. Confirm Telegram configuration using redacted environment-key names and API probes that return only bot identity, webhook state, pending updates, and error metadata.

Check MCP definitions and provider status without printing secrets. Check Buzz by executable discovery and non-secret environment presence (`BUZZ_CLI_PATH`, `BUZZ_RELAY_URL`, authentication variable presence); do not install or configure it during an audit.

### 3. Classify findings before fixing

Use these severity levels:

- **Critical:** Hermes or Telegram cannot operate.
- **High:** repeated failures, lost messages, severe delays, or mixed runtime versions.
- **Medium:** measurable reliability/performance degradation.
- **Low:** optional, cosmetic, or unrelated capability gaps.

For each finding record evidence, root cause, safe fix, restart requirement, expected improvement, risk, and rollback. Separate unrelated warnings from failures and distinguish runtime health from optional integration health.

### 4. Back up before approved changes

For approved update or configuration work, create and verify a full backup first:

```bash
hermes backup -l pre-update
stat -c 'path=%n size=%s bytes mtime=%y' ~/hermes-backup-*.zip
sha256sum ~/hermes-backup-<timestamp>.zip
```

Record the exact path, file count/size, and checksum. Never report secret contents. Keep the backup path available for rollback with:

```bash
hermes import <verified-backup.zip>
```

### 5. Execute one approved change at a time

For a Git installation, update only after the read-only plan and backup are complete:

```bash
hermes update --backup --yes
```

Do not use `--no-backup` or `--force` to bypass a refusal. Treat code pull, config migration, dependency/build follow-ups, and service restart as separate outcomes. A message such as `Code updated` is not proof that live gateways use the new code.

### 6. Handle restart boundaries safely

After an update, verify the runtime fleet independently:

```bash
hermes gateway status
systemctl --user status hermes-gateway --no-pager
```

Require a fresh gateway code version and no `restart pending`, `mixed sys.modules`, or active drain-for-restart warning. If the audit is running inside the gateway process tree, do not invoke `hermes gateway restart` inline: Hermes blocks self-restart because termination propagates to child processes. Give the user the exact command to run from a separate shell:

```bash
systemctl --user restart hermes-gateway
```

Then stop completion claims until a fresh status check confirms the new process.

### 7. Verify after every change

Re-run the relevant baseline checks and compare before/after:

```bash
hermes update --check
hermes --version
hermes gateway status
hermes doctor
hermes cron list
```

Verify all profiles, sessions, memories, Telegram connectivity, provider resolution, and resource usage. For a provider-preservation check, use a harmless minimal chat only when authorized and safe. If the web UI build fails while the gateway is healthy, report the UI failure separately; do not edit frontend code or claim the dashboard build passed.

## Optimization priorities

1. Reliability: eliminate duplicate/conflicting gateway ownership, finish interrupted updates, validate service restart behavior, preserve profile isolation, and prevent token collisions.
2. Performance: measure model/tool latency, find stuck sessions and runaway subprocesses, then tune only safe limits for concurrency, iterations, timeouts, and memory.
3. Integrations: repair MCP OAuth only with approval; validate providers without exposing credentials; configure Buzz only when its official binary, relay, and authentication are actually available.
4. Maintenance: provide a reusable read-only health check, safe log-retention guidance, verified backup/restore steps, and a short daily diagnostic report.

## Reusable pitfalls

- **Do not use `hermes update --check` alone as proof that an update is fully live.** It may say the checkout is up to date while a running gateway still serves pre-update modules; `hermes gateway status` is the runtime authority.
- **Do not restart a gateway from inside its own process tree.** The CLI blocks the operation to avoid SIGTERM propagation; use a separate shell outside the gateway and verify afterward.
- **Do not combine gateway, Telegram, MCP, network, Docker, and dependency changes in one batch.** Isolated changes make failures attributable and rollback safe.
- **Do not treat optional dependency warnings as gateway failures.** Report runtime health, frontend build health, and optional tool availability separately.
- **Do not print environment files or raw logs in a report.** Redact values before counting or quoting patterns, because tokens and personal data can appear in otherwise ordinary diagnostics.
- **Do not retry an update blindly after a partial result.** Read the update receipt, inspect the current revision and service state, then resume only through the supported update path.
- **Do not remove caches, sessions, locks, or temporary files merely because they are large or old.** First prove they are rebuildable and outside active ownership; otherwise report them and obtain approval.

## Deliverable format

End an audit with:

- Overall health: Healthy, Degraded, or Critical.
- Top five problems.
- Evidence-backed changes completed.
- Changes requiring user action or approval.
- Exact recovery/rollback commands.
- Separate status for Telegram, MCP, Buzz, model providers, gateway, profiles, and web UI.
