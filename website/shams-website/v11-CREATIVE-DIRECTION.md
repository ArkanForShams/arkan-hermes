# Shams Tabrez — Site v11 "Manuscript" — Creative Direction

> Design-first, document-first (studio-pass rule). This file is the contract every
> later edit cites. Base: v9 "Soft Light" Ink & Brass system — extended, never re-skinned.

## Visual narrative — "The Manuscript"

A scholar'sfolio rendered in a browser: one continuous parchment sheet
(cream paper, visible grain) on which the whole career is inscribed. Where v9 showed
a light hall with dark ceilings, v11 makes the **paper itself the theme-carrying
surface** and hangs everything on a single structural idea: a **brass plumb line**
that hangs the page's rooms from the header, growing as you descend the page.
The visitor isn't touring a palace in daylight — they're reading a fine printed
document that happens to glow.

## Art direction

- **Canvas:** paper (`#F7F2E9` / `#EFE7D8`) across ALL sections, both themes. The dark
  navy `#17263B` appears only as *ink* (type, numerals, hairlines) and as exactly two
  "ink bands": the father's inscription (quote) and the footer. This is the manuscript
  discipline: ink sits on paper, never the reverse.
- **Brass:** #C39A45 family unchanged. Brass marks 3 things only: the plumb line,
  numerals/eyebrows, and interactive affordances. Not decoration — wayfinding.
- **Lapis:** #2E5E8C used sparingly as the *research* accent (lab-bench blue ink).

## Typography rules

- Fraunces (display, optical size axis) for headings — unchanged.
- Manrope body — unchanged.
- IBM Plex Mono for eyebrows/numerals/metadata — unchanged.
- **New:** display headings gain a subtle brass underline hairline on the FIRST word
  group (`.h-underline`) — manuscript chapter-opening feel.

## Palette law

Same tokens as v9 (`@theme` in globals.css). Law of v11: **no section background may
be ink-colored** except quote band + footer. The `html.light` inversion keeps working
unchanged (it now inverts *ink elements*, while paper sections hold).

## Composition grammar

- **Plumb line:** fixed 1px brass filament at the left margin (replaces .lightline)
  with a small hanging bob that appears after 400px scroll; scroll-progress fill.
- **Room numbering continues:** 01–07 eyebrows in mono brass — unchanged.
- **Cards:** cream `#FFFDF8` on paper with navy-12% hairline borders; on hover they
  lift 2px and gain a brass-kissed shadow. Hover NEVER flips a whole surface to ink.
- **Numerals:** department "01–06" and principles "I–VI" in 11px mono brass, tracking
  0.18em — unchanged.

## Lighting law

- One lamp per page max (hero colonnade glow). No new glows.
- Grain opacity 0.014 — unchanged.

## Motion language (all behind @supports + reduced-motion gates; transform/opacity only)

- Easing canon: out-expo entrances (`cubic-bezier(0.16, 1, 0.3, 1)`), standard exits.
- `.rv` entrance: entry 0% → entry 40% (v10 value — keep).
- `.typeon` attribution: steps(11) 0.9s within entry 20%–85%.

## Per-section emotional intent

1. **Hero "The Cover":** paper cover plate with brass-stamped name. Colonnade kept
   but lightened to 3 pillars, lamp glow lower. The name must land like a foil stamp.
2. **About "The Passage":** prose paragraphs with a 12px brass drop-cap rule.
3. **Research "The Foundation":** paper + lapis accents on the published-paper card
   (journal metadata in lapis mono), education triptych.
4. **Department "The Roster":** six cream cards with brass numerals; "My role" strip
   in brass-tinted paper band.
5. **Principles "The Six":** same card grammar, Roman numerals.
6. **Quote "The Inscription":** full-width ink band, paper-colored italic Fraunces,
   brass type-on attribution — the page's emotional anchor, unchanged.
7. **Contact "The Door":** paper, real working links (LinkedIn + email).
8. **Footer:** ink band, brass hairline, credit line.

## Anti-generic list (this brand will NEVER use)

- Purple gradients, Inter/Roboto/Arial, system-ui default look.
- Glassmorphism blur-cards, neon dark-mode dashboards, generic SaaS hero with
  centered text + gradient blob.
- Dark section backgrounds scattered mid-page (ink = text & two bands only).
- Emoji as decoration or iconography; stock-photo humans; gradient buttons.

## Conversion goals

- Primary CTA: See the department → #department.
- Secondary: Connect on LinkedIn → real profile URL (linkedin.com/in/shams2tabrez).
- Tertiary: Write to me → mailto:Shams090484@gmail.com (fixes v9 TODO(shams) stubs).