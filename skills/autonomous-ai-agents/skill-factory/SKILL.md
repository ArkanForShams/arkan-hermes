---
name: skill-factory
description: "Use when building user-local skills from knowledge bases."
version: 0.1.0
author: ARKAN (for Shams Tabrez), Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [Skills, Authoring, Bulk-Create, Validation, Backlog]
    related_skills: [hermes-agent-skill-authoring, hermes-agent]
---

# Skill Factory

Build and curate user-local Hermes skills (`~/.hermes/skills/<category>/<name>/SKILL.md`) from user-provided knowledge bases, requests, or session learnings. Covers deduplication, bulk creation with validation, cross-referencing, and the backlog discipline. For authoring skills that ship inside the hermes-agent repo (tests, docs regen, PRs), use hermes-agent-skill-authoring instead — different standards, different tree.

## When to Use
- User delivers a knowledge base or skill list and asks to build/update them
- Expanding or restructuring the personal skill library after a session
- Promoting a folded lesson into a standalone skill on real demand
- Don't use for: in-repo skill authoring (hermes-agent-skill-authoring), curator ops on bundled/pinned/external skills (off-limits — adopt or ask the user)

## Procedure
1. **Survey before building.** `skills_list()` plus `search_files` across `~/.hermes/skills`. Classify every requested item into a lane before writing anything: BUILT (new standalone), FOLDED (merge into an existing skill — name the destination), DUPLICATE (exists — skip), PARKED (defer until real demand). Completion criterion: every requested item has a lane; nothing written yet.
2. **Build class-level, not session-level.** One skill per class of task with an always-on procedure; depth goes in `references/`, one-off sessions never become skills. Fold-before-sibling is the default: a thin sibling dilutes routing; extend the existing skill's sections instead. Completion criterion: each new skill name is a class a future session would recognize.
3. **Create via the helper script, not hand-typed files.** Write body markdown per skill, then run `scripts/make_skill.py` (in this skill's dir) per skill or in a loop — it writes the standard frontmatter, enforces the description budget, and validates required sections. For batches, generate bodies in one execute_code pass and loop the helper. Completion criterion: every file written through validation; zero hand-typed raw files.
4. **Respect the description budget.** ≤60 chars, one sentence, ends with a period, trigger-first ("Use for/when …"). The skill index truncates at 57+"…" — the trigger must live in that window, and an over-budget description is rejected outright on create. Keep 44–58 chars.
5. **Cross-reference honestly.** `related_skills` must name skills that actually exist (dead references strand routing); add Don't-use-for lines pointing at the sibling that owns adjacent territory; when promoting a skill out of a fold, update the source skill's related_skills and Don't-use lines in the same pass. Completion criterion: every reference resolves on disk.
6. **Roster-sweep verification.** After any batch, sweep every touched category with `make_skill.py --check <category>` (or `--check ALL`): yaml-parse frontmatter, assert description budget + final period, assert When to Use / Procedure / Pitfalls / Verification present. Per-file "created OK" prints are not verification — sweep or it did not happen. Completion criterion: sweep reports N/N valid.
7. **Backlog discipline.** Folded/parked items land in one backlog file (default `~/hermes-workspace/skills-backlog.md`) with the named destination skill for every fold — a fold without a destination is a silent drop. Revisit rule: build a parked skill only when a real task demands it; record the rule at the top of the file.
8. **Close the loop in memory.** Record final category counts + backlog path via the memory tool using the operations[] batch shape (also the schema-preferred form — the bare single-op shape failed repeatedly in practice); consolidate stale entries in the same batch when the char limit bites. Completion criterion: memory reflects final counts, one entry, no duplicates.

## Pitfalls
- **skill_manage batch creates with long escaped bodies corrupt or fail** ("needs an 'action'", JSON-escape breakage) — bulk creation goes through direct file writes via the helper script; reserve skill_manage for small patches and single short creates.
- **The 60-char description budget is a hard gate, not style** — over-budget descriptions are rejected on create and starve routing if hand-written; count before submitting.
- **Programmatic rewrites make the patch tool refuse** ("modified since last read") — after any execute_code write to a skill file, re-read (skill_view or read_file) before the next patch; the helper's writes count as external modifications.
- **Folds need destinations, parks need triggers** — an unnumbered "fold later" loses the item; write destination skill names down, and apply the real-demand trigger before building anything parked.
- **Categories are load-bearing** — files live under `~/.hermes/skills/<category>/<name>/SKILL.md`; keep the category set small and class-level; the helper creates missing dirs but does not police sprawl.
- **Frontmatter must start at byte 0** — no leading blank line or BOM; the validator and skill_view both fail otherwise.

## Verification
- Roster sweep reports N/N valid for every touched category.
- Backlog file names a destination for every folded item; parked items carry the real-demand trigger rule.
- Memory reflects final counts via a batch-shaped update; related_skills all resolve on disk.

## Deeper Sources
- `scripts/make_skill.py` — create + sweep validator (run, don't retype)
- hermes-agent-skill-authoring (in-repo standards — for repo PRs only)
- hermes-agent skill (skill system overview, curator/pin rules)