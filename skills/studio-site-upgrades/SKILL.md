---
name: studio-site-upgrades
description: Use when upgrading a site to premium or studio quality.
---

# Studio-Pass Site Upgrades (premium/cinematic quality)

Procedure for 'make it $10K/$20K studio quality' upgrade passes on an existing branded site. Design-first, document-first, verification-gated.

## Sequence (never skip to code)
1. **Creative direction document first.** Write visual narrative, art direction, typography rules, palette law, composition grammar, lighting law, motion language with named easings, per-section emotional intent, and an explicit anti-generic list (what this brand will never use). This is the contract every later edit cites.
2. **Experience map second.** Room-by-room: message, layout, interaction, animation, conversion goal; global systems (scroll spine, grain, header states) specified once.
3. **Motion system as ONE appended CSS block** in the brand's globals stylesheet: grain overlay, lamp/glow accent, scroll spine (`animation-timeline: scroll(root)`), entrance grammar (`view()` ranges), hover effects, type-on `steps()`. All behind `@supports` + `prefers-reduced-motion` gates; transform/opacity only so CLS stays 0.
4. **Implement → build → verify compiled CSS → screenshot QA → fix → re-run Lighthouse.** Expect the prior score HELD (CSS-only motion usually improves TBT).
5. **Deliver with an audit-report PDF** (pattern below) + before/after screenshots.

## Standing rules
- Shams's profile/landing brand opens in the SOFT LIGHT stage: light 'noon hall' default — his standing brief for profile presentation is top-percentile elegant, sober, very soft — with Dusk (night hall) as the toggle's optional mode. New sections obey the theme-adaptive token law in references/stage-conventions.md.
- Hero text and CTAs never sit inside reveal animations (LCP law); reveals are for below the fold.
- One glow accent per page section, max two instances; one saturated focal element; structure fades without movement ('columns stand, inscriptions rise'); easings from one named canon (out-expo entrances, standard exits).
- Deterministic positioning (`style={{ left: "58%" }}`) for hero decorative geometry — not chains of utility-class guesses. After two failed visual iterations, READ the component source and rewrite that block cleanly; screenshot-only loops cannot distinguish 'CSS wrong' from 'CSS absent'.
- Brand continuity: load the brand's design-system docs (tokens, palette, type) before writing anything new; extend, never re-skin.

## Verification discipline (settles 'is it styled?' disputes)
- Computed-style probes beat screenshots: per-section `getComputedStyle(...).backgroundColor`, plus root custom-property values. Screenshot claims require corroboration.
- fullPage captures with scroll-driven animations show blank bands below the fold (stitch artifact) — verify sections via probe + scrollIntoView before calling it a bug.
- Verify light/alternate themes through the REAL toggle interaction in Playwright; injecting classes into static HTML for capture tests has failed twice (hydration races, duplicate attributes).
- After any source edit: grep the compiled CSS in `out/` for the new class before debugging rendering — webpack production cache serves stale builds that print success.

## Audit-report PDF pattern (reportlab direct)
The pdf skill's create script ignores per-table widths; long cells overflow the page. Build directly: colWidths from content-length weights normalized to usable width (min ~52pt/col), Paragraph-wrapped cells, navy header row + zebra rows, page-number footer. Render pages to PNG and inspect visually before delivering. Structure: portfolio table → measured scores → findings ranked by severity → new-capability map → applied-vs-recommended roadmap → deployment/sharing → owner checklist.

See references/stage-conventions.md for the concrete paint-order, geometry, and theming conventions of the current brand stage.