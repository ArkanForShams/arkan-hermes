# SKILL.md skeleton — copy and fill per skill

Frontmatter template (name/description mandatory; description hardline: <=60 chars, trigger-first, one sentence, ends with a period):

```
---
name: <lowercase-hyphens>
description: "Use for <trigger phrase>."
version: 0.1.0
author: ARKAN (for Shams Tabrez), Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [Tag1, Tag2, Tag3]
    related_skills: [neighbor-skill]
---
```

Body template (sections in this order; cut sections that do not apply, keep When to Use + Procedure + Pitfalls + Verification):

```markdown
# <Name> Skill

<2-3 sentences: what it does, scope boundary, which neighbor skills own adjacent territory.>

## When to Use
- <trigger 1>
- <trigger 2>
- Don't use for: <adjacent task> (<neighbor-skill>)

## Procedure
1. **<Step>.** <What to do.> Completion criterion: <checkable result>.
2. ...

## Quick Reference
- **<Heuristic name>:** <rule>.

## Pitfalls
- **<Rule>** <one clause of WHY — the mechanism, imperative>.

## Verification
- <observable end-state 1>

## Deeper Sources
- <source repo or doc> (<what it covers>)
```

Rules while filling:
- Every Procedure step ends with "Completion criterion:" — checkable, not aspirational.
- Pitfall = generalizable rule + one clause of why; no incident narratives, no dates, no ticket IDs.
- ASCII-safe arrows ("->") in anything passed through tool-call payloads; unicode escapes are where corruption enters.
- Body target 3-5 KB; move long tables/checklists into references/ when a skill grows past that.