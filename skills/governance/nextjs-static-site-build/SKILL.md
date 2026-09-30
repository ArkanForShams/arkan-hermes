---
name: nextjs-static-site-build
description: Use when building, QA-ing, or shipping static Next.js sites.
---

# Next.js Static Site Build (WSL, no sudo)

Proven workflow from the shams-website build (2026-09-28, Lighthouse 98/100/100/100).

## Environment facts
- No unzip: use `python3 -m zipfile` or Python `zipfile` module.
- Node via nvm; python-pptx etc. via `/tmp` uv venvs (PEP 668 blocks pip).
- Playwright browsers at `~/.cache/ms-playwright/` — use `playwright-core` with `executablePath` (`chromium-XXXX/chrome-linux64/chrome`).
- No sudo/LibreOffice: cannot render pptx locally; HTML previews via Chromium `--headless --screenshot` instead.
- Hermes `terminal` kills its own wrapper on `pkill -f "next"` (pattern self-match) — never background-kill by a pattern that matches the calling wrapper; kill by PID from `ss -tlnp`.

## Workflow
1. Scaffold manually (faster than create-next-app): package.json, tsconfig, next.config, postcss.config.mjs, src/app.
2. Tailwind 4: tokens in `@theme` in globals.css. Theme overrides via `html.light { }` on the SAME custom properties — utilities compile to `var()` references, so overrides cascade.
3. `output: "export"` + `trailingSlash: true` for a static `out/` dir (hostable on Netlify Drop / GitHub Pages).
4. Server components everywhere possible; "use client" only for interactivity (theme toggle, scroll header).
5. Scroll reveals: pure CSS `animation-timeline: view()` behind `@supports` — content visible with JS off. Never opacity-0-until-JS (breaks headless captures and JS-off users).
6. LCP rule: nothing above-the-fold inside reveal animations — Lighthouse scores the animated element's late paint.

## QA loop (works, in this order)
1. `npx next build` — static export.
2. Serve `out/` with gzip (python http.server does NOT gzip and unfairly tanks Lighthouse LCP; write a 30-line node gzip server).
3. Playwright-core scripts for: theme toggle round-trip, section-by-section background probe (getComputedStyle), console errors, failed requests, horizontal overflow at 375/768/1280.
4. Screenshots: viewport shots are reliable; fullPage shots with scroll-driven animations show blank bands below the fold (artifact, not a bug) — verify sections via computed-style probes + scrollIntoView before claiming failure.
5. Lighthouse: `CHROME_PATH=<chromium path> npx lighthouse <url> --chrome-flags="--headless=new --no-sandbox"`.

## Pitfalls (all hit for real)
- next.config: `import type { NextConfig }` (v15) — not `{ Config }`.
- Zombie next-server holding the port with stale chunks: HTTP 400 on CSS, unstyled page that looks like every other bug. Check `ss -tlnp`, kill by PID.
- A botched write_file (truncated globals.css) = utilities compile away entirely; symptom: css exists but `.bg-ink` missing.
- Duplicate `class="..."` attribute on `<html>` when injecting a light class into static HTML for tests — regex into the existing attribute instead.
- vh-based hero heights inflate in tall test viewports (92vh of 4400px) — pin hero height in QA copies.
- `text-brass/75` (opacity modifier) fails 4.5:1 contrast; use full-brass on dark navy.