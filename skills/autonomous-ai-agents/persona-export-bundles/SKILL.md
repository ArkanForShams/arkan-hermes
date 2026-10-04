---
name: persona-export-bundles
version: 1.0.0
description: Use when porting ARKAN personas to Claude/ChatGPT bundles.
license: MIT
platforms: [linux, wsl]
---

# Persona Export Bundles — porting the agent stack off Hermes

Carry ARKAN's persona stack to non-Hermes platforms as install-ready bundles. Master sources live on the Hermes machine — never build from memory: `~/.hermes/SOUL.md` (ARKAN full soul), `~/hermes-workspace/USER.md` (user portrait), `~/.hermes/profiles/<name>/SOUL.md` (department agents), `~/.hermes/skills/<category>/<skill>/SKILL.md` (curated skills). Shams wants the same person everywhere — a bundle that answers in the wrong voice is a failed port.

## Hard rules (always apply)

- **No secrets ship, ever.** Audit every file in the bundle for token/key-shaped strings before zipping (hermes .env patterns, `<digits>:AA…` bot tokens). Souls, portraits, and curated skill rule-text only. All bundles so far are clean — keep it invariant.
- **Condensed instructions for ≤8,000-char boxes.** ChatGPT Custom GPTs and Claude Desktop project instructions cap at 8k characters — verify with `len()` during the build; a trimmed copy is normal, the full soul + portrait always ship as knowledge/rules files so nothing is lost.
- **Never archive a directory into itself.** `make_archive` pointing the containing dir into itself grows unbounded (observed 20 GB runaway) and can hang the execute_code kernel; enumerate target files explicitly and write each with a relative arcname inside one ZipFile context.
- **Adapt Hermes-isms out; keep the person in.** Replace "Read together with User.md" with the platform equivalent (Claude rules file / ChatGPT knowledge file); drop Memory-OS sections (`[fabric]`/`[qdrant]`/Icarus layers — they don't exist on targets); keep identity, mission, values, decision framework, forbidden behaviours whole.

## Platform formats (verified shapes)

| Platform | Identity | Agents | Skills | Portrait |
|---|---|---|---|---|
| Claude Code | `~/.claude/CLAUDE.md` (full soul, adapted) | `~/.claude/agents/<name>.md` — frontmatter (`name/description/tools`) + persona body; invoked `@name` | `~/.claude/skills/<category>--<skill>/SKILL.md` (flat dirs) | `~/.claude/rules/shams-user.md` |
| Claude Desktop | Project instructions box (≤8k) — one Project per persona | one Project per persona (Hakim/Basir = their own rooms) | knowledge files (RAG, effectively unlimited) | knowledge file |
| ChatGPT | Custom GPT instructions box (≤8k) — one GPT per persona | one Custom GPT per persona | ≤20 knowledge files; consolidate skills into per-category packs | knowledge file 01 |

## Procedure

1. **Read masters fresh** (soul, portrait, each agent soul) — a stale remembered version bakes old text into the bundle.
2. **Adapt + condense** per platform: Claude Code gets the near-full soul (only the memory section swapped); ChatGPT/Desktop get the ≤8k condensed instructions with the full text as knowledge.
3. **Assemble** a per-platform folder: adapted files + `INSTALL.md` with literal copy/paste recipes + conversation starters for GPTs (Hakim/Basir get their skills as knowledge too where load-bearing, e.g. shariah-screening for Basir).
4. **Package:** python `zipfile` with explicit enumeration (hard rule above); add `tar.gz` when the target is another WSL box.
5. **Audit + report:** grep the bundle for secret shapes; report file inventory with sizes and bytes; deliver via `MEDIA:`.

## Pitfalls (verified this stack)

- Claude Desktop's persona lives in **Projects**, not app config: install app from claude.ai/download, but identity = "Set project instructions" text + knowledge uploads; project chats inherit instructions and RAG'd knowledge automatically — that's the feature, not a limitation.
- Subagent files need BOTH frontmatter and the persona body — body alone renders as plain prose with no `@name` invocation.
- Skills consolidated for ChatGPT/Claude keep rule content but drop Hermes tool lists (those tools don't exist there) — port the judgment, not the tool schema.
- Verification is Shams's greeting: the target persona must answer as itself ("Who are you?" → "I am ARKAN, Shams") before any port is declared done.
- **Refresh after soul edits:** bundles are artifacts; rebuild only changed files from the Hermes masters and ship a delta — Shams re-runs just those install lines.