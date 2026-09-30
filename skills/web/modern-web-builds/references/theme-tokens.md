# Theme Tokens — Dual-Mode Recipe (Light 'Soft Light' Default)

The token architecture that survived full QA in the Ink & Brass build. Copy this shape for any Shams site with dark + light modes. Shams's standing brand stage: LIGHT ('noon hall', sober, soft) is the default presentation; the dark night hall is 'Dusk', optional behind the toggle.

## Rules
1. **Raw hex lives only in `@theme`** (Tailwind 4 CSS-first; no tailwind.config).
2. **Semantic aliases in `:root`** (`--bg`, `--fg`, `--fg-muted`, `--accent`, `--accent-hover`, `--line`, `--surface-text`) point at brand tokens; components consume semantic aliases, not raw tokens.
3. **Light mode inverts ONLY the dark bands**: ink-family surfaces flip to cream, creamtext flips to navy, brass deepens for contrast. Cream-identity tokens (paper, inktext) NEVER appear in the light override — they ARE the light theme, and flipping them turns cream sections navy.
4. **Fixed accent-text token (`--color-onyx`)**: text sitting on brass must reference a token no theme overrides, or light mode renders navy-on-brass (ink got inverted under it).
5. **Hairlines and veils use `--line` / `color-mix`**: hardcoded `white/10` or navy rgba breaks exactly one theme; `color-mix(in srgb, var(--color-ink) N%, transparent)` tracks both.
6. **One token, one role.** A token used as both a background and a text color across themes guarantees a half-inverted page.

## @theme block

```css
@theme {
  --color-ink: #0B1524;      --color-ink-2: #101E32;   --color-ink-3: #16273E;
  --color-paper: #F7F2E9;    --color-paper-2: #EFE7D8;
  --color-brass: #C39A45;    --color-brass-bright: #E3B95C;  --color-brass-deep: #9A7830;
  --color-lapis: #2E5E8C;    --color-inktext: #17263B; --color-muted-light: #5A6B80;
  --color-creamtext: #EDE6D6; --color-onyx: #0B1524;
  --font-display: var(--font-fraunces), Georgia, serif;
  --font-body: var(--font-manrope), "Segoe UI", sans-serif;
  --font-mono: var(--font-plex-mono), "Courier New", monospace;
}
```

## Light-mode override block

```css
html.light {
  --color-ink: #F7F2E9;   --color-ink-2: #FFFDF8;  --color-ink-3: #EFE7D8;
  --color-creamtext: #17263B;
  --color-brass: #9A7830; --color-brass-bright: #B8923B;
  --color-muted-light: #46586E;
  --fg: #17263B;  --fg-muted: rgba(23, 38, 59, 0.66);
  --accent: var(--color-brass-deep);  --accent-hover: var(--color-brass);
  --line: rgba(23, 38, 59, 0.14);     --surface-text: #17263B;
}
```

Note what is absent: paper, paper-2, inktext — untouched on purpose.

## Default-mode wiring ('Soft Light': light default)

The default is architecture, not opinion — wire SSR, no-JS, and hydration to agree:
- `layout.tsx`: put `light` statically on `<html>` (`className={...fonts + " light"} suppressHydrationWarning`) so the first paint AND no-JS visitors get light immediately — no flash of the dark theme before hydration. `themeColor` in the Viewport export matches the default (`#F7F2E9`).
- `theme-provider.tsx`: default state `light`; the restore effect upgrades ONLY a saved `'dark'` preference. Keep the class-sync effect for toggle round-trips.
- Surfaces that must change per theme use the flipping tokens (`bg-ink`, `text-creamtext`); surfaces fixed in one look (footer, quote band) use inline `style={{ backgroundColor: 'var(--color-x)' }}` — deterministic in any theme and immune to ungenerated utility classes.
