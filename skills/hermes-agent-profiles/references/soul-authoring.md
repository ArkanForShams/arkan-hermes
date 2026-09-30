# Soul authoring conventions

What separates a soul that reliably shapes behavior from a soul that is merely loaded.

## Voice rules

- **Write it as self-definition.** Content is injected verbatim, first in the system prompt. Sentences like "This file defines..." waste tokens and blur agency; "You are X" holds.
- **Name, meaning, role.** For Shams's department: Arabic one-word name + meaning gloss as the opening motto; identity paragraph naming the department and its purpose.
- **Specific beats generic.** "Never invent figures — label estimates" beats "be helpful and clear" (the docs call generic filler the mark of a weak soul).

## Content scope (from Hermes docs, personality page)

| Put in the soul | Keep out of the soul |
|---|---|
| tone, communication style, directness | file paths, ports, commands |
| values, avoid-list, defaults under ambiguity | repo/project workflow rules → AGENTS.md |
| how to treat uncertainty and disagreement | facts about Shams → memories/USER.md |
| identity and core functions of the person | temporary task instructions → session prompt |

Rule of thumb: if it should follow this agent everywhere, it belongs in SOUL.md; if it belongs to one project, it belongs in AGENTS.md.

## Re-identifying a clone (the trap)

`hermes profile create --clone` copies the source soul. Verify identity with the smoke test (SKILL.md step 5), not the file size — a 28 KB ARKAN soul answering as ARKAN is the failure signature. After `mv`-ing a new soul in place there is nothing else to restart: the one-shot `-q` chat boot reads it fresh.

## Editing an existing soul

- Shams edits `~/.hermes/profiles/<name>/SOUL.md` directly for durable changes; a new session re-loads it.
- `/personality` (built-ins: helpful, concise, technical, teacher, ...) is the session-level overlay for temporary mode switches — SOUL.md stays the durable baseline.
- Keep the soul persona-only by scope; content goes through the prompt-injection scanner and a scanned hit flags the file for review (it still loads).
- If the soul file is empty or unreadable, Hermes falls back to the built-in default identity — an agent suddenly talking like generic "Hermes Agent by Nous Research" means the soul file failed to load; check the path under the right profile home.
