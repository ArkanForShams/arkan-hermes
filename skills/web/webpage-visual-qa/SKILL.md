---
name: webpage-visual-qa
description: "Use when verifying web pages render correctly, browserless."
version: 0.1.0
author: ARKAN (for Shams Tabrez), Hermes Agent
license: MIT
platforms: [linux]
metadata:
  hermes:
    tags: [Visual-QA, Headless-Chromium, Screenshots, Landing-Pages]
    related_skills: [browser-stack-ops, dogfood, frontend-design, modern-web-builds]
---

# Webpage Visual QA

Verify a built web page actually renders correctly — layout, readability, responsiveness, below-fold sections — without the interactive browser stack, using headless Chromium (Playwright cache) + PIL slicing + vision inspection. Applies to any HTML artifact before delivery; born from landing-page production QA.

## When to Use
- After building a landing page or HTML artifact, before delivering it
- Verifying responsive behavior (desktop + mobile widths)
- Checking below-fold sections for overflow, overlap, contrast, alignment
- Don't use for: interactive app exploration (browser_* tools / dogfood), finding functional bugs (dogfood), restarting the Camofox stack (browser-stack-ops)

## Procedure
1. **Serve, never file://.** `python3 -m http.server <port> --bind 127.0.0.1` with background=true from the artifact dir; confirm readiness with `curl -s -o /dev/null -w "%{http_code}"`. Fonts, relative assets, and base64 behave differently under file:// — serve over HTTP. Completion criterion: HTTP 200 from the exact URL under test. Background servers do not survive between sessions — a port that 'already worked' in an earlier session needs a fresh curl 200 (relaunch first) before QA begins.
2. **Capture hero + mobile first.** Chromium binary: `~/.cache/ms-playwright/chromium-*/chrome-linux64/chrome`. Screenshot: `chrome --headless --disable-gpu --no-sandbox --hide-scrollbars --force-device-scale-factor=1 --window-size=1440,900 --screenshot=<out.png> --virtual-time-budget=9000 <url>`; repeat at 390x844 for mobile. Completion criterion: both files exist with plausible sizes (not byte-identical).
3. **QA copy for animated pages.** Pages that reveal content on scroll render below-fold content invisible in static captures. Write a qa.html copy with reveals forced: `.reveal { opacity: 1 !important; transform: none !important; }`. Pin any vh-based hero to its real viewport height (`min-height: 828px !important` for a 900px design). Delete the QA copy after the pass. Completion criterion: below-fold content visible in captures.
4. **Full-page capture, slice by measurement.** One tall-viewport capture (e.g. `--window-size=1440,8800`) with the QA copy; slice into overlapping bands with PIL. Find section boundaries with a brightness profile (sample edge pixels down the page, log dark/light transitions) instead of guessed offsets. Completion criterion: every section falls entirely inside one band image.
5. **Inspect every band with vision.** vision_analyze per band with specific questions (text overflow? overlap? contrast? alignment? button placement?). Fix defects in the source file, re-capture, re-inspect — a fix without a fresh shot is an unverified fix. Completion criterion: zero unresolved defects across all bands, desktop and mobile.
6. **Interaction QA — capture the state after user actions.** Static `--screenshot` only shows initial load. For toggles, menus, and stateful UI: in the project, `npm i -D playwright-core`, then launch with `executablePath` = the Playwright-cache Chromium (`launch({ executablePath, args: ["--no-sandbox", "--disable-gpu"] })`), drive the REAL user path (click the actual toggle button, not DOM injection), screenshot after each action, and collect console errors + ≥400 responses in the same session. Keep the QA script inside `<project>/scripts/` — a `require()` from /tmp cannot resolve project node_modules. Completion criterion: every stateful behavior verified in both directions; console error list empty.
7. **Deliver clean.** Remove QA copies and scratch shots; package the artifact (zip + short README when the user will host it); explicitly list remaining user actions (placeholder links, TODO markers) in the delivery message.

## Pitfalls
- **vh-based heroes explode under tall capture viewports** — 92vh of an 8800px window stretches the hero across the whole capture; pin hero min-height in the QA copy before full-page shots.
- **Anchor URLs (#section) do not scroll in headless static screenshots** — identical tiny blank output files are the tell; capture the full page and slice instead of navigating to anchors.
- **Scroll-reveal content is invisible without the QA-copy trick** — a clean-looking full-page capture of an animated page proves nothing about below-fold content.
- **Identical file sizes across captures = blank shots** — check sizes and image dimensions before spending vision calls.
- **Inject inline art as base64 AFTER writing the page** (placeholder replacement via code), keeping the source file hand-editable; after such a programmatic rewrite, re-read the file before patch-tool edits — the injection counts as an external modification and the patch tool refuses stale reads.
- **Optimize hero art before embedding** (JPEG quality ~78, ~120KB) — raw PNG hero images balloon self-contained pages to multiple MB.
- **Cache-bust after every source patch** — re-navigate with a `?v=N` query; a plain reload can serve the cached pre-fix page and make a real fix look unfixed (wasting a vision pass on the old file).
- **Judge clipping only from a settled scroll position** — a capture taken mid-programmatic-scroll shows the sticky nav over section content: phantom clipping a settled capture disproves. Scroll, verify the position, then capture.
- **Identify fixed-position elements before calling an overlap a defect** — fixed HUD/progress strips overlay page text at arbitrary scroll offsets; check computed `position` first.
- **`document.fonts.check` can report false for fonts that ARE rendering** — prove application via `performance.getEntriesByType('resource')` (the woff2 being fetched proves use) plus a zoomed vision check of letterform character; never trust the check API alone.
- **Self-host webfonts when the CDN is unreliable in the environment**: download the woff2 unicode-range splits, write a local `@font-face` CSS, link it before the CDN link. Paths inside a CSS file resolve relative to the CSS file, not the page — `url('fonts/x.woff2')` inside `fonts/amiri.css` 404s; use `url('x.woff2')`.
- **A screenshot of a stale build is worse than no screenshot.** Before trusting any capture or probe, verify the server serves the build on disk: fetch the exact CSS/chunk URL the served HTML references and compare with what's in the build directory. A zombie dev/preview server serves stale in-memory manifests (CSS 400/404, unstyled pages) and every QA pass then 're-fixes' bugs that were already fixed — kill listeners by PID from `ss -tlnp` and re-serve first.
- **Test stateful behavior through the real user path, not synthetic DOM changes.** Injecting `class="light"` into served HTML duplicates the class attribute and races hydration, producing phantom half-applied themes; click the actual control with playwright-core and let the app apply its own state. Even a `.click()` dispatched from inside `page.evaluate` can no-op a React handler that the driver's real input path works on — click by aria-label with `page.click`, and settle any 'did it apply' dispute with computed-style probes (section backgroundColor, root custom properties), not screenshots alone.

## Verification
- Desktop + mobile + every full-page band inspected; all defects fixed and re-verified with fresh captures.
- Final artifact contains no QA copies; every user-action placeholder marked with TODO comments.
- Self-contained pages: artwork embedded, no broken relative links (grep for src/href pointing at missing files).

## Deeper Sources
- marketing pack INSTALL-NOTES.md (landing-page production lessons — same workflow, marketing context)
- browser-stack-ops (when the interactive Camofox stack IS available)
- frontend-design (build-side craft these QA gates protect)