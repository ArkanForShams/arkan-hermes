# Build Log — MISSION 01: THE EVOLUTION OF HERMES
**Deliverable:** `/home/shams/hermes-workspace/missions/mission-01-evolution/index.html` (single file, 65 KB, zero external JS)

## Design system
- **Title:** THE MAKING OF A PILLAR — cinematic scrollytelling of the true Shams ⇄ ARKAN story
- **Type:** Fraunces (display serif) · JetBrains Mono (terminal/data) · Newsreader (closing letter)
- **Structure:** vertical timeline spine down the left edge; diamond nodes per era; thin spine fills
  with gold as scroll progress; fixed HUD strip (era label · scroll % · blinking caret)
- **Era palettes:** near-black terminal → gunmetal prologue → terminal-green Day 1 → deep teal Soul →
  warm parchment Portrait → blue-violet Mind → gunmetal Guardians → copper Reach → gold-on-midnight Today
- **Atmosphere:** animated SVG grain overlay, per-era accent "breath" gradients, era-entry dawn/dusk
  gradients so no era transition is a hard cut, faint scanlines in the hero

## Versions

### v1 — first full build
- Complete 8-era scrollytelling: hero (live typing effect cycling the 3 real quotes) → BEFORE →
  DAY 1 (Arabic أركان, father's words, install terminal) → SOUL (6 weight bars, 15 value chips,
  11 framework rows, interactive SOUL.md v0→v1→v1.1 diff cards) → PORTRAIT (He taught / It learned
  two-column) → MIND (7 layer cards on a spine) → GUARDIANS (3 scanners + 63/63 triage incident log) →
  REACH (isolation / cron fleet / subagents) → TODAY (live [fabric]/[qdrant]/[facts] injection mock,
  green stack health) → stat band → closing ARKAN letter with the final stanza
- IntersectionObserver reveals with staggered delays; keyboard-accessible tabs; prefers-reduced-motion
  fully honored; mobile responsive

### v2 — defect fixes + cinematic pass
- **Fixed:** evolution strip opened with tab v1 selected but v0's panel visible → now v1/v1 match
- **Fixed:** lede wording ("weighted like a character theorems are weighted" → calligrapher ink line)
- **Added:** dawn gradient into the hero (dark no longer ends flat), per-era atmosphere gradients,
  live blinking caret in the HUD strip
- **Verified:** v1 tab ↔ diff panel match, hero dawn, soul-strip rendering at 1440px

### v3 — transition & consistency polish
- **Fixed:** parchment→violet transition passed through a muddy gray band → re-tuned as an intentional
  dusk fade (parchment warms down through amber into deep violet)
- **Fixed:** ghost section numerals ran one behind the era kickers → renumbered 00–07 to match
- **Added:** copper→midnight gradient continuing out of the Reach era into the letter; stat count-up
  animation (rAF, ease-out cubic, respects reduced-motion, sup "+" preserved)
- **Verified:** dusk transition, numeral 03 = ERA 03, stats settle at 7/3/5+/1

## Verification (per iteration)
- Chrome for Testing 153 headless captures at 1440×900 desktop and 390×780 mobile
- Full-page tall captures + per-section crops, every section visually inspected (desktop: hero, day1,
  soul×3, portrait, mind, guard, reach, today, stats, letter×3; mobile: hero, day1, soul, portrait,
  mind, guard, reach, today, letter×3)
- Live Camofox checks: DOM structure, tab interaction (click → correct panel), no page JS errors
- Real fonts confirmed loading in Chrome (Fraunces/JetBrains Mono/Newsreader, 3 faces)

## Issues encountered & resolved
- **Port collision:** another mission's `http.server` took over port 8471 mid-QA — moved to dedicated
  port 8481; all prior captures were confirmed to have served this mission's content
- **Tall-capture svh inflation:** `100svh` heroes inflate in oversized capture windows, creating blank
  voids that do not exist at real viewport sizes — verified with real-viewport captures (desktop letter
  and mobile letter both render fully)
- **Camofox font-load quirk:** `document.fonts.load()` throws NetworkError inside the anti-detect
  browser even though gstatic is reachable; real Chrome loads all faces — page unaffected
- **rAF under virtual-time:** count-up frozen mid-animation in one capture; longer time budget
  confirmed it settles at the true values

## Final state
- `index.html` — 65,484 bytes, self-contained (Google Fonts CDN only, no external JS/CSS)
- All story content strictly from the provided real history; no invented facts
- Final stanza and oath text verbatim as specified