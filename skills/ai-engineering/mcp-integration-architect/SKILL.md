---
name: mcp-integration-architect
description: "Use for MCP server design and system integrations."
version: 0.1.0
author: ARKAN (for Shams Tabrez), Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [MCP, Integrations, Tools, Credentials, Safety-Gates]
    related_skills: [ai-architect, ai-governance, hermes-agent]
---

# MCP Integration Architect Skill

Designing MCP (Model Context Protocol) servers and system integrations for the Hermes ecosystem: when MCP vs custom tool vs script, tool/resource/prompt surface design, credential scoping, and integration reliability. The connective tissue that lets agents safely act on external systems.

## When to Use
- Exposing a new system (internal API, database, SaaS) to agents
- Deciding MCP server vs custom Hermes tool vs one-off script
- Designing tool granularity, auth scoping, and error semantics for integrations
- Don't use for: agent reasoning design (ai-architect), governance tiers (ai-governance)

## Procedure
1. **Integration decision first.** One-off data pull -> script (terminal). Recurring action surface for agents -> MCP server or custom tool. Multi-agent/multi-surface reuse, or third-party ecosystem value -> MCP. Completion criterion: decision noted with reasoning; no MCP server for a task a script does better.
2. **Surface design.** Tools = actions (verbs, side-effectful, few and focused); resources = read context (uris, cacheable); prompts = reusable task templates. Granularity: coarse enough to be useful, fine enough to authorize. One server per system/bounded context - not a mega-server. Completion criterion: tool list with side-effect classification per tool (read/append/act).
3. **Safety classification per tool.** read-only (default) / append (create items, reversible) / act (external side effects - payments, sends, deletes). Act-class tools require: confirmation gates in the client, dry-run mode, and audit logging (ai-governance red lines apply: no autonomous spend, no autonomous messages). Completion criterion: every tool classified; act-tools gated.
4. **Credential scoping.** Least privilege per server: read-only keys where possible; scoped service accounts; secrets in env/vault - never in prompts, tool args in logs redacted, never in code. Per-origin binding where the platform supports it. Completion criterion: credential matrix per server; secret scan clean.
5. **Error semantics.** Tools return structured, actionable errors (what failed, why, what to try) - errors are context the model reasons over; timeouts and retry rules per tool; idempotency keys for retryable actions. Completion criterion: error catalog per tool; no naked stack traces.
6. **Reliability.** Contract tests per tool against a sandbox; schema validation on inputs and outputs; version the server; changelog on tool changes; health check exposed. Completion criterion: tests in CI; sandbox mode demonstrated.
7. **Observability.** Log calls (tool, args shape, latency, outcome) with sensitive args redacted; per-server usage review monthly - dead tools removed, hot tools optimized. Completion criterion: usage stats reviewed; surface pruned.
8. **Hermes wiring.** Register via Hermes MCP support (hermes mcp - see hermes-agent skill references/native-mcp.md); verify tool listing, one live smoke test per tool, then enable in profiles deliberately. Completion criterion: smoke test evidence per tool before production use.

## Quick Reference
- **The question that matters:** "what can this tool do on its worst day?" - classify and gate accordingly.
- **Few sharp tools beat many blunt ones:** model tool-choice degrades past ~15-20 per context; consolidate or split servers.
- **Read-only by default;** write access is granted per server per profile with a reason.
- **Dry-run flag on every destructive/external tool** - test the surface without the consequences.
- **Errors are prompts:** write them for the model to recover from, not for humans to mourn.

## Pitfalls
- **MCP for everything:** a server with one wrapper around curl. Scripts exist; use them.
- **Scope creep per server:** one server touching five systems - blast radius and audit trail both unmanageable.
- **Secrets via tool arguments:** credentials passed in tool calls end up in transcripts. Environment-side resolution only.
- **Ungated act-tools:** an agent calling a send/spend tool without confirmation is the incident waiting to happen (ai-governance).
- **Silent schema drift:** upstream API changes, tool breaks mid-session. Contract tests catch it - run them.

## Verification
- Per-server: tool classification, credential matrix, error catalog, sandbox tests green.
- Act-class tools demonstrably gated (dry-run + confirmation path tested).
- Smoke-test evidence per tool in Hermes; usage review held monthly; surface pruned.

## Deeper Sources
- Hermes MCP support: hermes-agent skill -> references/native-mcp.md
- punkpeye/awesome-mcp-servers (ecosystem patterns, prior art)
- ai-governance (gates), ai-architect (agent design), prompt-engineer (tool-result quality)
