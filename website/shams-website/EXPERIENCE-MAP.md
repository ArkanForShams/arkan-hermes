# EXPERIENCE MAP — first second to final CTA
*Section-by-section spec: message, layout, interaction, animation, conversion · 2026-09-28*

Global systems first, then each room.

**Global constants:** light-line spine (fixed 1px brass filament at the left content edge, height = scroll progress, CSS `animation-timeline: scroll()`); grain overlay; dawn/dusk toggle in header; every section gets `keyline` eyebrow + Plex Mono coordinate tag (e.g. `01 / PASSAGE`).

**Conversion goal per visitor:** one action — LinkedIn connect (primary), email (secondary). CTAs appear at hero (soft), after department (context), contact (final). Never two competing CTAs in one viewport.

---

### 00 · PRELOAD (0–600ms)
Background: ink. Center: the ST monogram inside its brass ring, drawn by stroke animation (SVG stroke-dashoffset, 500ms). Beneath it, Plex Mono caption types on: *"RIYADH · 24.7°N 46.7°E"*. Total under 600ms; static fallback = monogram visible instantly. Only shown once per session (sessionStorage flag).

### 01 · HERO — "NIGHT" (first screen)
- **Scene:** 92vh ink field, night-gradient base. Six pillars right-of-center, pillar III lit (brass gradient + lamp glow). Text block left: eyebrow (mono, brass keyline), name in Fraunces 76px, value line in brass-bright, positioning line in cream/85. CTAs: primary brass pill "See the department", ghost pill "Connect on LinkedIn".
- **Entrance (600–1400ms):** lamp fades in behind pillars → keyline draws → name rises 16px → subhead rises 60ms later → CTAs last. Pillars: opacity 0→final over 800ms, *no movement* — the hall was already standing.
- **Cursor interaction:** a very soft brass radial follows the pointer (40px, 8% opacity, 300ms lag) — "your presence lights the hall."
- **Scroll behavior:** pillar layer drifts at 0.3× parallax; light-line begins its journey; scroll hint (mono "SCROLL · ↓", pulsing 2s) fades once scroll > 100px.
- **Header:** transparent until 40px scroll, then ink/90 + blur + hairline. ST monogram ring, anchor links, coordinate badge, dawn/dusk toggle.
- **Conversion goal:** orient + first soft CTA impression.

### 02 · ABOUT — "PASSAGE" (cream)
- Message: "Steady hands for complex systems." Eyebrow `02 / PASSAGE · ABOUT`.
- Layout: 64ch column, three paragraphs with <strong> anchor phrases (AlMajdouie, engineering, business value). One margin rule: 24px brass hairline along the left, marking the walkway.
- Interaction: light-line passes; paragraph anchor phrases warm to brass on first view (scroll-driven, 400ms).
- Conversion: none — trust building.

### 03 · DEPARTMENT — "THE COLONNADE" (ink, six cards)
- Message: "Not a tool. A team." Eyebrow `03 / THE COLONNADE · DEPARTMENT`.
- Layout: colonnade grid (left-aligned, numerals 01–06 oversized in Plex Mono, ink-2 cards, shared baseline). Cards rise 4px on hover, border warms, numeral glints.
- Sequence: the grid reveals as a colonnade being lit — card by card, 90ms stagger, driven by the light-line entering the section.
- MY ROLE strip beneath: brass/5 field, delegation model in one line.
- Conversion: soft — "See the department" was here; now the strip ends with a mono link `→ HOW I WORK` to Principles (narrative carry).

### 04 · PRINCIPLES — "THE LOAD-BEARING WALLS" (cream, six cards)
- Message: "What I stand on." Eyebrow `04 / FOUNDATIONS`.
- Layout: same colonnade rhythm, roman numerals I–VI engraved (Fraunces), cards on #FFFDF8 with paper shadow.
- Interaction: identical grammar to 03 (consistency), hover reveals a 1px brass underline that draws left→right under the principle name.
- Conversion: none.

### 05 · QUOTE — "THE INSCRIPTION" (full-bleed ink)
- The only full-bleed moment. Father's words, Fraunces italic, brass for "Don't be afraid of anything, I am there." Text breaks container -6% left. Lamp glow behind, dimmest in the system.
- Interaction: words reveal in three fragments (Steady work / discipline / I am there) each fading up as the light-line crosses; attribution `— MY FATHER` types on (mono, 30ms/char).
- This is the emotional apex — nothing competes. No CTA here.

### 06 · CONTACT — "THE OPEN DOOR" (cream → ink footer)
- Message: "Let's connect." Eyebrow `06 / THE DOOR`.
- Layout: h2 60px, one line of invitation, LinkedIn (primary brass) + Write to me (ghost). Coordinate plaque: `RIYADH · KINGDOM OF SAUDI ARABIA · UTC+3`.
- Interaction: CTAs repeat hero motion (lift + glow). The light-line completes its journey here — it arrives and settles into a full brass hairline above the footer, a closing bracket.
- Footer: ST ring, copyright, crew plaque. 
- Conversion: primary action, maximum clarity.

---

## Cross-cutting requirements
- **Responsiveness:** 375 (single column, pillars become a low horizontal band), 768 (2-col colonnade), 1280 (3-col). Touch targets ≥ 44px. No hover-dependent information.
- **Accessibility:** landmarks + aria-labels per room; focus ring brass 2px offset 3; skip-link; reduced-motion = instant reveals; the dawn/dusk toggle is a real `<button>` with pressed state.
- **Performance budgets:** JS ≤ 110KB first load; LCP < 1.4s (4G); CLS 0 (all animation transform/opacity only); fonts preloaded (4 woff2 max).
- **Scroll choreography law:** one spine (light-line), staggered entries, zero scroll-jacking. Every animation must survive prefers-reduced-motion and JS-off.
- **Loading sequence:** 00 → 01 with no layout shift; everything below fold reveals on arrival of the light-line, never on a timer.