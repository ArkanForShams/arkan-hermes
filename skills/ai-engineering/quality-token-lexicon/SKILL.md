---
name: quality-token-lexicon
description: "Use when reducing prompt tokens without reducing quality."
version: 1.0.0
author: ARKAN for Shams Tabrez
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [prompt-optimization, token-efficiency, multimodal, quality-preservation]
---

# Quality-Token Lexicon

## When to Use

Use when a prompt, agent instruction, or multimodal brief is too expensive, repetitive, or vague. Optimize wording only after preserving the objective, required facts, constraints, acceptance criteria, and quality bar.

Optimize prompts for **information density**, not minimum length. A shorter prompt is only better when it preserves the same decision-relevant information and produces equal or better evaluated output.

## Non-negotiable quality invariant

Never remove or weaken:

- The user's objective and intended audience.
- Required entities, facts, URLs, files, quantities, dates, and identifiers.
- Acceptance criteria and failure conditions.
- Safety, privacy, legal, faith, or approval boundaries.
- Output format, language, tone, depth, and delivery requirements.
- Uncertainty handling: say `unknown`, `not found`, or `needs verification` rather than inventing.

Remove only politeness padding, duplicated context, repeated constraints, vague intensifiers, and narration about the act of asking.

## Prompt structure

Use this order when it improves clarity:

1. **Role** — the capability required, not theatrical identity.
2. **Context** — only facts needed for this task.
3. **Objective** — one observable outcome.
4. **Constraints** — hard limits and prohibited actions.
5. **Method** — tools, sources, decomposition, or verification steps.
6. **Output contract** — exact sections, schema, length, and quality bar.
7. **Quality gate** — verify factual accuracy, completeness, and regression against the acceptance criteria.

Put the final objective, constraints, and output contract after long context so they remain salient.

## High-information vocabulary

Prefer precise terms that encode an operational requirement:

- `evidence-grounded` → base factual claims on supplied or verified evidence.
- `source-of-truth` → resolve conflicts against the named authoritative source.
- `reproducible` → record commands, inputs, versions, and observed outputs.
- `line-by-line triage` → inspect the exact flagged source, not just a summary.
- `fail closed` → stop rather than proceed when a required check is unavailable.
- `bounded` → define a limit for turns, files, scope, time, or retries.
- `idempotent` → safe to repeat without duplicating side effects.
- `read-only` → no writes, messages, transactions, or irreversible actions.
- `diff-aware` → inspect only changed or relevant material first, then widen if needed.
- `decision-relevant` → retain information that can change the recommendation or result.
- `acceptance criteria` → measurable conditions for completion.
- `regression set` → representative cases that must keep passing after a change.
- `structured output` → return a defined schema that can be validated.
- `confidence / severity / disposition` → distinguish uncertainty, risk, and action.
- `human approval gate` → pause before external, financial, production, or irreversible actions.
- `preserve semantics` → rewrite wording without changing meaning.

Do not use a high-information term unless its operational meaning is actually intended.

## Multimodal prompt vocabulary

Use these as explicit modifiers only when they describe the desired result; they are not magic guarantees:

- **Material realism:** physically plausible material response, surface microtexture, controlled specular highlights, coherent roughness, contact shadows.
- **Lighting:** motivated key light, soft fill, rim separation, volumetric falloff, consistent shadow direction, exposure-balanced highlights.
- **Camera:** lens and perspective, camera height, subject distance, depth of field, shutter/motion treatment, deliberate framing.
- **Composition:** visual hierarchy, negative space, focal subject, foreground-midground-background separation, readable silhouette.
- **Human/character quality:** anatomically coherent proportions, natural joint articulation, believable gaze, consistent identity, clean hands.
- **Product/vehicle quality:** correct model geometry, production-accurate proportions, badge placement, panel continuity, wheel/contact alignment.
- **Anti-artifact constraints:** no extra limbs, no duplicated objects, no melted text, no impossible reflections, no floating contact points, no unintended logos.
- **User heuristic:** Shams uses the phrase `AI synthetic` as a realism-oriented prompt modifier. Treat it as an experiment, not a universal guarantee; retain it only when the target model's evaluation shows improvement.

## Compression procedure

1. Extract the prompt's objective, constraints, inputs, and output contract.
2. Delete greetings, apologies, repeated context, and meta-narration.
3. Replace vague phrases with one precise operational term.
4. Preserve every named entity, number, boundary, and acceptance test.
5. Add a compact output schema if the answer will be machine-checked or repeatedly consumed.
6. Compare the rewritten prompt against the original using a checklist: intent, facts, constraints, quality bar, and failure behavior.
7. Evaluate on a small regression set before making the rewrite the default.

## Example

**Verbose:**
> Please act as a very experienced security expert and carefully look through all of the files in detail, and make sure that you don't miss anything important, and tell me honestly if there are any risks.

**Dense, equivalent:**
> Perform a read-only, line-by-line security triage of the supplied files. Report evidence, severity, exploitability, confidence, and disposition. Do not infer from scanner scores alone; identify unknowns and stop on unverified critical risks.

The second prompt is shorter because it is more precise, not because quality was removed.

## Quality gate

Before adopting an optimization, verify:

- Same or better rubric score on representative inputs.
- No required fact or constraint disappeared.
- No uncertainty was converted into false certainty.
- No safety or approval boundary weakened.
- Output remains complete, readable, and fit for its audience.
- Token reduction is measured from actual usage, not estimated from character count.
