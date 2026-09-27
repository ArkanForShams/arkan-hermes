---
name: skill-authoring-batch
description: "Use for creating Hermes skills in batch via generator."
version: 0.1.0
author: ARKAN (for Shams Tabrez), Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [Skills, Authoring, Batch, Validation, Backlog]
    related_skills: [hermes-agent]
---

# Skill Authoring (Batch) Skill

Procedure for creating multiple user-local Hermes skills in one pass from a knowledge base or skill list - the proven alternative to hand-writing SKILL.md files one at a time. The bundled hermes-agent-skill-authoring skill covers IN-REPO authoring (committed to the hermes-agent source tree); this skill covers the user-local tree (~/.hermes/skills/) where department skills live.

## When to Use
- Building a set of skills from a user-provided knowledge base (dedup, prioritize, build, park)
- Creating several related skills in one session
- Promoting a folded topic to its own standalone skill
- Don't use for: in-repo/committed skills (hermes-agent-skill-authoring), single small edits (just patch)

## Procedure
1. **Dedup before building.** Run skills_list; for every requested skill decide: already exists / fold into an existing skill (name the destination) / genuinely new. Rule: extend before siblings - a thin sibling skill dilutes skill-index routing; fold unless the topic has real daily-usage depth. Completion criterion: decision table with destination per item.
2. **Record the backlog.** Park non-built items in ~/hermes-workspace/skills-backlog.md with fold destinations, so nothing is silently dropped. Completion criterion: backlog updated in the same session as the builds.
3. **Write a generator script, not N write_file calls.** In execute_code, define create_skill(category, name, description, tags, related, body) that writes SKILL.md with full frontmatter and asserts per-create: starts with '---', description <= 60 chars and ends with '.', required sections present. This catches violations at creation instead of at skill-index load. Completion criterion: generator runs clean for the whole batch.
4. **Frontmatter and body standards.** Description: one sentence, trigger-first ('Use for...'), <= 60 characters - the skill index truncates at ~57 and the skill_manage validator rejects longer; 61 chars = failed batch. Body sections: When to Use (+ 'Don't use for') / Procedure (numbered steps, each with a completion criterion) / Quick Reference / Pitfalls / Verification / Deeper Sources. related_skills must name skills that already exist. Completion criterion: every file passes the generator asserts.
5. **Batch verification pass.** After all creates, re-scan every touched category with yaml.safe_load: frontmatter parses, description within limit, Pitfalls + Verification sections present, count printed. A skill missing from the roster is a silent failure - find it before reporting. Completion criterion: N/N valid printed.
6. **Cross-reference consistency.** When a new skill takes over a topic from a donor (e.g. implementation depth split from an architect skill), update the donor's related_skills and its 'Don't use for' line in the same pass, then update the backlog and the memory entry (memory: use the operations[] batch shape - the single-op add shape dropped its content field repeatedly). Completion criterion: no donor still points at the folded topic as its own.

## Quick Reference
- Proven generator pattern: create_skill(category, name, description, tags, related, body) with f-string frontmatter + body.strip() + newline; keep bodies as plain triple-quoted strings with ASCII-safe punctuation.
- Categories in use: leadership, ai-engineering, pmo, engineering, wealth, marketing.
- Wave discipline: build the user's stated priorities; park the rest with destinations; close the backlog file with a status note when a knowledge base is fully resolved.

## Pitfalls
- skill_manage with very large batched operation strings corrupts on JSON escaping - use the execute_code generator for anything beyond a small patch.
- Do not verify skill existence with search_files content search over the skills tree (unreliable for directory names) - check os.path.isdir/os.path.isfile on the expected SKILL.md path.
- A failed operation in a skill_manage batch rolls back ALL operations in that call - keep risky ops in separate calls.
- Description length counts the description string only (quotes excluded) - still keep raw text <= 60 to survive both the validator and the index.
- Agent-generated skills are created_by=None (user-owned): autonomous skill_manage PATCHES to them are refused until the user runs 'hermes curator adopt <name>' in a foreground session. Capture the intended improvement in the reply instead; do not loop on the refusal.

## Verification
- Batch verification pass printed N/N valid with the full roster.
- Backlog file and memory entry both reflect the new state.
- Donor skills updated where topics were split.

## Deeper Sources
- hermes-agent-skill-authoring (in-repo standards - frontmatter reference)
- hermes-agent skill (skill system overview)