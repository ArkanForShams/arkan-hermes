---
name: skill-library-ops
description: "Use for building and ingesting user-local Hermes skills."
version: 0.1.0
author: ARKAN (for Shams Tabrez), Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [Skills, Authoring, Knowledge-Base, Validation]
    related_skills: [hermes-agent-skill-authoring]
---

# Skill Library Ops

Workflow for growing Shams's user-local skill library (~/.hermes/skills/): ingesting the consolidated agent-skills knowledge bases he pastes, creating skills in bulk, validating them, and parking the remainder. In-repo authoring (PRs to the hermes-agent repo) is a different discipline covered by hermes-agent-skill-authoring - load that one for repo work. This skill carries the user-local bulk pattern and Shams's standing rules.

## When to Use
- Shams pastes a consolidated "skills knowledge base" (repo list + Create-skills list) for an agent domain
- Creating or repairing multiple user-local skills in one pass
- Deciding build-now vs fold-in vs park for requested skills
- Don't use for: in-repo/bundled skill authoring (hermes-agent-skill-authoring), installing external skill packs (see marketing/INSTALL-NOTES.md)

## Standing rules
- Dedupe before building: run skills_list first; skip anything that exists; fold narrow siblings into the owning skill (a "PromptOptimizer" request extends prompt-engineer, it does not become a sibling) - thin sibling skills dilute description routing for every session.
- Build only the requester's stated priorities; park the rest in ~/hermes-workspace/skills-backlog.md with fold-in guidance. Build a parked skill only when a real task demands it - never speculatively.
- Any finance/investment skill must carry Shariah-compliant framing (riba-free screening, no speculative instruments) before any advisory logic is written.
- After a build wave, update the backlog file (BUILT + PARKED sections) and the memory pointer in ONE consolidated memory operations batch; consolidate stale memory entries in that same batch when usage approaches the cap.

## Procedure
1. **Load the format rules first.** skill_view hermes-agent-skill-authoring: frontmatter shape, description hardline (60 chars, trigger-first, one sentence, ends with a period), body section order. Completion criterion: format rules in context before any file is written.
2. **Classify every requested skill.** For each entry in the KB: BUILT (new, covers a stated priority), FOLD (add a section to the existing owning skill), or PARK (backlog with fold-in guidance). Completion criterion: classification list exists before creation starts.
3. **Bulk-create via execute_code, not giant skill_manage arrays.** Write a create_skill(name, description, tags, related, body) helper that emits the frontmatter template + body per category directory and asserts validation inline - one bad skill fails alone instead of rolling back a batch. Completion criterion: helper script created once, reused per category.
4. **Body template.** Copy `templates/skill-skeleton.md` and fill it - sections in order: intro (2-3 sentences, scope + neighbor skills), When to Use (triggers + Don't-use-for), Procedure (numbered steps, each ending "Completion criterion: ..."), Quick Reference (heuristics), Pitfalls (rule + why), Verification, Deeper Sources (source repos). Completion criterion: every created skill passes the inline asserts.
5. **Verify across ALL target category directories.** Enumerate the exact set of (category, name) pairs you created and check each SKILL.md path - a verify loop that only scans one base directory reports skills living in other categories as MISSING and triggers a false alarm hunt. Completion criterion: every created pair confirmed parseable, count matches the classification list.

## Pitfalls
- Pass bulk skill content through execute_code file writes - long skill_manage operations arrays with escaped quotes or unicode arrive corrupted ("operations[0] needs an 'action'") and the whole batch rolls back atomically.
- Validate description length inside the creation loop BEFORE writing - the skill_manage validator rejects on a single violation and rolls back every touched skill in the batch, not just the offender.
- Use the memory tool's operations-array shape for multi-part memory updates; the single-op shape has repeatedly failed with 'Unknown action' errors.
- Keep skill content ASCII-safe in tool-call payloads (write "->" not unicode arrows) - escaping through JSON layers is where corruption enters.
- Frontmatter must start at byte 0 with --- and close with a newline before the body; a leading blank line or BOM fails validation.

## Verification
- Filesystem enumeration of the target category dirs shows every new SKILL.md parseable with valid frontmatter (yaml.safe_load on the header block).
- Backlog file carries the new BUILT entries and PARKED guidance; memory pointer reflects the new totals.
- Next-session skills_list shows the new skills live (the loader is session-cached - absence in the current session is expected, not a bug).