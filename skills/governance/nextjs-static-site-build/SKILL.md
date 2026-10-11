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
4. For interactive customer portals, separate the canonical domain model from the UI: keep typed contracts, mock data, and a replaceable HTTP adapter so the frontend can be exercised before upstream APIs exist.
5. Treat static export routing as a hard constraint: every dynamic URL that the client can navigate to must be present in `generateStaticParams()` or be replaced with a query/static route; arbitrary IDs generated at runtime cannot open a detail page in a static-only host.
6. If demo mutations must survive navigation, use a clearly named browser-local store (for example, `localStorage`) behind helper functions; label the experience demo mode and do not imply server persistence, ownership checks, payments, or production execution.
7. Server components everywhere possible; "use client" only for interactivity (theme toggle, scroll header, forms, filters, and local demo mutations).
8. Scroll reveals: pure CSS `animation-timeline: view()` behind `@supports` — content visible with JS off. Never opacity-0-until-JS (breaks headless captures and JS-off users).
9. LCP rule: nothing above-the-fold inside reveal animations — Lighthouse scores the animated element's late paint.

## QA loop (works, in this order)
1. `pnpm typecheck && pnpm build` — compile and generate the static export before visual QA.
2. Enumerate the generated route list from the build output; include list, create, detail, invoice, and any demo-created static detail routes in the acceptance matrix.
3. Serve `out/` and probe every important route locally with HTTP 200 plus a content assertion; then repeat the same probes against the public URL. A successful build alone does not prove navigation works.
4. For booking/customer portals, exercise the complete demo flow: create → list/search by reference → open detail → modify branch/date/time/services/offer → comment → cancel/delete where permitted → inspect activity log and attached invoice links.
5. Verify local persistence behavior separately from server behavior: reload after a mutation and confirm the browser store is read back, while explicitly documenting that a real backend is still required for multi-device persistence and authorization.
6. Serve `out/` with gzip (python http.server does NOT gzip and unfairly tanks Lighthouse LCP; write a 30-line node gzip server).
7. Playwright-core scripts for: theme toggle round-trip, section-by-section background probe (getComputedStyle), console errors, failed requests, horizontal overflow at 375/768/1280.
8. Screenshots: viewport shots are reliable; fullPage shots with scroll-driven animations show blank bands below the fold (artifact, not a bug) — verify sections via computed-style probes + scrollIntoView before claiming failure.
9. Lighthouse: `CHROME_PATH=<chromium path> npx lighthouse <url> --chrome-flags="--headless=new --no-sandbox"`.

## Pitfalls (all hit for real)
- next.config: `import type { NextConfig }` (v15) — not `{ Config }`.
- Zombie next-server holding the port with stale chunks: HTTP 400 on CSS, unstyled page that looks like every other bug. Check `ss -tlnp`, kill by PID.
- A botched write_file (truncated globals.css) = utilities compile away entirely; symptom: css exists but `.bg-ink` missing.
- Duplicate `class="..."` attribute on `<html>` when injecting a light class into static HTML for tests — regex into the existing attribute instead.
- vh-based hero heights inflate in tall test viewports (92vh of 4400px) — pin hero height in QA copies.
- `text-brass/75` (opacity modifier) fails 4.5:1 contrast; use full-brass on dark navy.