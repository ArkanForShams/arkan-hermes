---
name: modern-web-builds
description: "Use for building modern Next.js/Tailwind websites for Shams."
version: 0.1.0
author: ARKAN (for Shams Tabrez), Hermes Agent
license: MIT
platforms: [linux]
metadata:
  hermes:
    tags: [Next.js, Tailwind4, Design-Systems, Component-Arsenal, Dark-Light]
    related_skills: [webpage-visual-qa, ksa-web-builds, frontend-design, local-site-sharing]
---

# Modern Web Builds (Next.js + Tailwind)

Class procedure for Shams's modern sites — personal brand, venture sites, product pages — as owned-code Next.js static exports with a real design system, dark+light themes, and zero black boxes. Python-generated marketing/RTL sites are a different class: ksa-web-builds. Visual QA is a different class: webpage-visual-qa.

## When to Use
- "Build me a website" with modern stack expectations (Next.js, Tailwind, shadcn-style components)
- Editing or extending an existing Next.js build in `~/hermes-workspace/website/`
- Don't use for: python-generated marketing pages (ksa-web-builds), one-off HTML artifacts (frontend-design), QA itself (webpage-visual-qa)

## Procedure
1. **Design system before any page.** Write DESIGN.md first: palette tokens, type scale, spacing rhythm (4/8/16/24/48), component rules, and BOTH themes defined up front. Shams's brand = Ink & Brass: ink `#0B1524`/`#101E32`/`#16273E`, paper cream `#F7F2E9`, brass `#C39A45`/`#E3B95C`/`#9A7830`, onyx fixed for text-on-brass; Fraunces display / Manrope body / IBM Plex Mono labels. Map to Tailwind 4 via `@theme` in globals.css — CSS-first tokens, no tailwind.config (recipe: references/theme-tokens.md).
2. **Scaffold first, content second.** Copy templates/nextjs-tailwind4-scaffold.md (package.json, configs, globals skeleton, layout with next/font, theme-provider, Reveal). `npm install`, then run `npx next build` IMMEDIATELY — surface type/config errors while the app is 3 files, not 30. LSP diagnostics like "Cannot find module 'react'" before install are expected noise; judge types by the real build, not the LSP.
3. **Own every component.** Copy patterns from `~/website-arsenal/` (shadcn/ui primitives, shadcn-landing-page structure, magicui motion ideas, tweakcn themes), adapt them to the design tokens, and record every copied origin in ATTRIBUTIONS.md (repo, license, adaptation). License law: MIT/Apache-2.0 only in shipped code; GPL repos (Cruip) are study-only, never copied.
4. **Progressive enhancement by default.** Content must be visible with JavaScript off. Scroll reveals = CSS scroll-driven animation (`@supports (animation-timeline: view())`, see Reveal in the scaffold template) — never IntersectionObserver-gated opacity on a static export, which leaves JS-off and slow-hydration visitors staring at blank sections. Motion that HIDES content by default (`width: 0` type-on, opacity-0 reveals) must place the hiding rule itself INSIDE the `@supports` block — a top-level hide applies even where scroll-driven animation doesn't exist, and the text vanishes outright for those renderers. JS enhances; it never gates.
5. **Static export for delivery.** `output: "export"` + `trailingSlash: true` → `out/` hosts anywhere (GitHub Pages, Netlify, nginx). Run server mode only when ISR/API routes are genuinely needed — and then only for development.
6. **Server discipline on every rebuild.** Kill the listener by PID from `ss -tlnp`, confirm the port is free, start, confirm HTTP 200 — then, before any QA, confirm the server serves the build on disk (see first pitfall).
7. **QA handoff.** webpage-visual-qa for captures and bands; then the interaction pass: launch playwright-core (`npm i -D playwright-core`) with `executablePath` pointing at the Playwright-cache Chromium, click the theme toggle in both directions, keyboard-walk the nav, and collect console errors + ≥400 responses in the same session. Completion criterion: toggle verified both ways, console clean.

## Pitfalls
- **Verify served == disk before believing ANY QA output.** Fetch the exact CSS/chunk URL the served HTML references and compare against `out/` on disk; a hash mismatch means a zombie server is serving stale in-memory manifests, and every screenshot you take is of a build that no longer exists — you will 're-fix' bugs that were already fixed.
- **Kill servers by PID from `ss -tlnp`, never `pkill -f "next start"`** — the Hermes terminal wrapper embeds your command string in its own process, so a pattern-kill SIGTERMs the tool call itself (-15) and leaves the real listener untouched.
- **One server instance per port.** After any restart failure, list listeners first (`ss -tlnp | grep <port>`); two `next start` processes on one port = the first (stale) one answers and the second silently never binds. Background servers also die between conversation sessions — curl a fresh 200 from a relaunched server before any QA on a previously-verified port.
- **Paint decorative layers AFTER the elements they must cover.** DOM order is paint order for stacked siblings: a text 'veil' placed before the pillar shapes paints beneath them and the motif crosses the headline. Content sits at z-10 above everything.
- **Theme tokens: fixed `onyx` for text-on-accent, `--line` for hairlines, `color-mix` for veils.** Hardcoded `text-ink` on a brass button resolves through the inverted ink token in light mode; hardcoded white/10 or navy rgba veils break exactly one theme.
- **Never let one token serve as both a background and a text color across themes.** `--color-paper` used as both light-bg and light-text made light mode turn cream sections navy; split the roles into separate tokens instead.
- **A theme DEFAULT and theme-adaptive tokens are two different decisions.** Wiring light as default (static `light` class + provider restore) does nothing for a section styled with light-identity tokens (paper/inktext) — it renders identically in both modes and the alternate theme silently dies on that surface. Surfaces that must re-theme use the flipping tokens (ink/ink-2/creamtext); surfaces fixed in one look use inline `style={{ ...: 'var(--color-x)' }}` styles, which flip nothing and never become no-op utility classes.
- **Grep the compiled CSS in `out/` for any newly-used utility class before QA'ing its rendering** — an ungenerated class is a silent no-op surface (e.g. a background that resolves transparent), and screenshots under-read it as 'fine'.
- **Test themes the real user path.** Click the toggle with playwright-core; injecting `class="light"` into served HTML creates a duplicate class attribute and races hydration, and the capture shows a phantom half-applied theme.
- **Targeted edits go through `patch`, never full-file `write_file`** — one full-file write submitted with partial content in mind deleted an entire token system, and the symptom (every page unstyled) looked like a build bug for three QA passes. read_file first, patch second.
- **QA scripts live in `<project>/scripts/`, not /tmp** — `require()` from /tmp cannot resolve project node_modules (MODULE_NOT_FOUND); copy the script into the project and run it there.

## Verification
- `npx next build` clean; static `out/` exists; First Load JS well under budget.
- Served asset hashes match disk; console error list empty (playwright-core session).
- Theme toggle verified in both directions with screenshots; keyboard focus visible on first Tab.
- webpage-visual-qa pass: hero + full-page bands + 375px mobile inspected, zero unresolved defects.

## Deeper Sources
- references/theme-tokens.md — the dual-mode token recipe
- templates/nextjs-tailwind4-scaffold.md — known-good scaffold to copy
- webpage-visual-qa (QA procedure); ksa-web-builds (marketing/RTL variant); frontend-design (craft layer); local-site-sharing (serving links to Shams)
- `~/website-arsenal/` — component sources with licenses
