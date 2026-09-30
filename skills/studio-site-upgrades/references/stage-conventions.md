# Stage conventions — 'Ink & Brass: Hall of Pillars'

The established brand stage for Shams Tabrez's sites (tokens: ink #0B1524, ink-2/ink-3 elevations, paper #F7F2E9, brass #C39A45/#E3B95C/#9A7830, creamtext #EDE6D6, onyx fixed-dark; type: Fraunces display ≤650 weight, Manrope body, IBM Plex Mono annotations).

## Decorative-layer paint order (hero 'Hall')
1. Night-gradient base (background never flat — falls off like a wall at night)
2. Lamp glow (radial brass, the ONLY glow in the system, ≤2 instances/page)
3. Colonnade (six pillars, deterministic `left: 58%`, bleeding off right edge; pillar III lit brass; heights staggered, non-symmetric)
4. Cursor lamp (pointer-fine only, `display:none` on coarse/reduced-motion)
5. Text veil AFTER pillars so it sits ABOVE them: opaque over text zone 0–44%, released by ~78% — protects copy while pillars breathe
6. Brass hairline floor line
Content container: `relative z-10`, owns the left ~55% (`max-w-[34rem]` subhead).

## Motion canon ('candlelight physics')
- Entrances: `cubic-bezier(0.16, 1, 0.3, 1)` (out-expo); exits `cubic-bezier(0.4, 0, 0.2, 1)`; spine `cubic-bezier(0.22, 1, 0.36, 1)`.
- Entrance grammar: eyebrow keyline draws (scaleX) → text fades up 16px, 60ms stagger → structure fades WITHOUT movement.
- Hover: translateY(-4px) lift + border warms to brass + numeral glint (background-position sweep 0.6s) or draw-line underline (scaleX 0.45s).
- Light-line spine: fixed 1px left-edge filament, `scaleY(0→1)` driven by `scroll(root)`.
- Scroll hint pulses; parallax only on hero pillar layer (≤0.3×).
- Reduced motion + JS-off: everything instant and visible. Hiding rules (`width: 0` type-on, opacity-0) live INSIDE the @supports gate, not beside it — unsupported renderers then see the plain visible text, never absence.

## Wayfinding & texture
- Section eyebrows: Plex Mono uppercase, brass keyline dash, engraved room numbers `NN / NAME · SECTION`.
- Grain: 2%-opacity SVG fractal-noise overlay (64px tile, data-URI, ~1KB) on every section — kills gradient banding, reads as stone.
- Full-bleed is reserved for the emotional apex (quote band); everything else stays in the container.

## Default stage — 'Soft Light' (light default; Dusk behind the toggle)
- Shams's pages open in LIGHT: the noon hall. Ship a STATIC `light` class on `<html>` in layout.tsx so SSR/no-JS first paint is light (no dark flash); `themeColor` = cream; the provider restores only a saved 'dark'.
- Invert ONLY dark bands via `html.light` overrides on the same custom properties: ink/ink-2/ink-3 → cream ramp, creamtext → navy, brass deepens to #9A7830 for contrast, hairlines darken.
- Cream sections keep identity in both themes (paper stays cream, inktext stays navy).
- Fixed `--color-onyx` (#0B1524) for text-on-brass in any theme.
- Footer and the quote band are FIXED navy in both themes via inline var() styles — a fixed 'inscription' close no theme should flip.

## Section architecture (six rooms)
Hero (hall: noon default, dusk behind toggle; orient, soft CTA) → About (cream, trust) → Research/Education (cream; featured published-paper card) → Department (adaptive band: ink elevation at dusk, deepened cream + white cards in light) → Principles (cream, roman numerals, draw-line names) → Quote (fixed navy band, type-on attribution, NO CTA) → Contact (cream → fixed navy footer, primary CTA, light-line 'arrives').

## Anti-generic list (never)
Purple gradients, glassmorphism cards, blob backgrounds, emoji bullets, 'trusted by' logo rows, stock 3D shapes, gradient text, rounded-everything.