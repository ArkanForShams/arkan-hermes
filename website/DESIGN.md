# DESIGN.md — "Ink & Brass" Design System

*Author: ARKAN website crew. Extends the brand established on the shams-tabrez-landing page. All tokens authored here are the single source of truth for the website build.*

## Brand Colors

| Token | Hex | Usage |
|---|---|---|
| `--ink` | `#0B1524` | Deep midnight — dark sections, hero, footer, nav |
| `--ink-2` | `#101E32` | Elevated dark surfaces / cards on dark |
| `--ink-3` | `#16273E` | Hover surface on dark |
| `--paper` | `#F7F2E9` | Warm cream — main light background |
| `--paper-2` | `#EFE7D8` | Deeper cream — alternate light section |
| `--brass` | `#C39A45` | Primary accent — CTAs, key lines, highlights |
| `--brass-bright` | `#E3B95C` | Accent hover state |
| `--brass-deep` | `#9A7830` | Accent on light backgrounds (AA-safe) |
| `--lapis` | `#2E5E8C` | Secondary accent — informational, links |
| `--text-dark` | `#17263B` | Body text on light |
| `--text-muted-light` | `#5A6B80` | Muted text on light |
| `--text-light` | `#EDE6D6` | Body text on dark |
| `--text-muted-dark` | `rgba(237,230,214,.66)` | Muted text on dark |
| `--hairline-dark` | `rgba(237,230,214,.14)` | Borders on dark |
| `--hairline-light` | `rgba(23,38,59,.14)` | Borders on light |

**Semantic:** success `#2F7D5B` · warning `#B07A28` · danger `#A03D3D` (all AA on their grounds).

**Dark mode:** dark theme is the brand default (`ink` grounds); light theme = cream grounds. Both ship; `prefers-color-scheme` + manual toggle.

## Typography

| Role | Family | Weight | Size (desktop → mobile) |
|---|---|---|---|
| Display / H1 | Fraunces (serif, opsz) | 500–600 | clamp(2.6rem, 7vw, 4.6rem) |
| H2 | Fraunces | 500 | clamp(1.9rem, 4vw, 2.75rem) |
| H3 | Fraunces | 500 | 1.25–1.75rem |
| Body | Manrope | 400–500 | 1–1.125rem, line-height 1.6 |
| Micro-label | IBM Plex Mono | 400–500 | 0.75rem, tracking .18em, uppercase |

- Fonts: Google Fonts with `display=swap`, `preconnect` + `preload` (self-host later if latency demands).
- Minimum body size on any viewport: 15px. Minimum contrast: WCAG AA (4.5:1 body, 3:1 large text) in BOTH themes.

## Spacing Scale (4/8 rhythm)

```
--space-1: 4px   --space-2: 8px    --space-3: 12px  --space-4: 16px
--space-5: 20px  --space-6: 24px   --space-8: 32px  --space-10: 40px
--space-12: 48px --space-16: 64px  --space-20: 80px --space-24: 96px
--space-28: 112px
```

- Section padding: 96px desktop → 64px mobile. Component gaps: 16/24px. Card padding: 24/28px.
- Container: max-width 1100px, side padding 24px.
- Border radius: sm 6 / md 12 / lg 18 / pill 999. Shadows: sm/md/lg + brass glow for CTAs.

## Motion

- Staggered fade-up reveals (0.08s steps), 0.25s hover lifts. `prefers-reduced-motion: reduce` disables all.
- No parallax, no autoplay video, no scroll-hijacking. Restraint is the brand.

## Breakpoints

`375px` (mobile) → `768px` (tablet) → `1280px` (desktop). Mobile-first authored at every step.

## Accessibility Contract

- Full keyboard navigation (skip-link, visible focus rings brass `#C39A45`)
- aria-labels on all interactive elements; landmarks (`nav`, `main`, `footer`)
- Color never the sole carrier of meaning (status = icon + text + color)

## License Law (crew rule)

- MIT/Apache-2.0 components only in the shipped project.
- Cruip open-react-template = **study-only reference** (GPL) — nothing copied from it into shipped code.
- Every copied component records its origin repo + license in `ATTRIBUTIONS.md`.
---

## Build record (2026-09-28)
- Project: `shams-website/` — Next.js 15.5 + Tailwind 4, static export (`out/`)
- Lighthouse: **P98 / A100 / BP100 / SEO100** (slow-4G simulated, gzip origin)
- All four DONE gates met. Git initialized, node_modules excluded.
