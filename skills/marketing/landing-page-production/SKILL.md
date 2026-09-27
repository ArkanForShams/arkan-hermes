---
name: landing-page-production
description: Use when building landing pages or multi-page HTML sites.
---

# Landing Page Production

Brand-aligned, production-grade single-page HTML sites. The design playbooks live in the third-party marketing pack at `~/.hermes/skills/marketing/` (`website-brand-analysis`, `page-designer`, `frontend-design`, `ad-designer`, `creative-director`) — those SKILL.md files are authored for OpenClaw, so read `~/.hermes/skills/marketing/INSTALL-NOTES.md` FIRST for the Hermes tool translations before running any of them. This skill carries the end-to-end procedure and Shams's standing rules; the pack carries the per-role depth.

## Standing rules (every build)

- Person-brand copy is sourced from `~/hermes-workspace/USER.md` with strict privacy guardrails: never place children's details, family matters, core fears, stress patterns, or finances on a public page.
- Never fabricate metrics, claims, credentials, or a real photo of Shams. Abstract generated artwork + a monogram stands in for portraits; every claim on the page must trace to USER.md.
- Contact links default to `#` placeholders with `<!-- TODO: ... -->` comments at every occurrence plus a `README-hosting.txt` listing what to replace — ONLY while the real links are unknown. Once Shams supplies links, wire them into EVERY occurrence (nav, hero CTAs, contact cards, footer), delete the TODO comments, and verify with `grep 'href="#"' *.html` returning zero. His public links (confirmed): LinkedIn `https://www.linkedin.com/in/shams2tabrez`, email `mailto:Shams090484@gmail.com`, GitHub `https://github.com/Shams090484`.
- Nothing ships without the visual QA gate: rendered screenshots (desktop hero, mobile hero, every section) actually inspected, defects fixed, fixes re-verified by a second capture.
- Keep one consistent brand language across deliverables. Shams's established personal brand: "Ink & Brass" palette (deep midnight ink #0B1524, warm cream #F7F2E9, brass #C39A45) + a six-pillars motif (arkān = pillars; one pillar per AI-department team, one rising highest). Reuse for matching assets (LinkedIn banner, CV) unless he redirects.
- His personal site theme is LIGHT-dominant — his words: "professional and elegant theme rather dark". Ivory/warm-paper background, dark-ink typography, brass accents; midnight ink reserved for the hero and feature bands only. Implement a theme flip as a scoped override block APPENDED to `site.css` (never rewrite the base token file), then visual-QA the nav/hero transition zones before delivering (see Pitfalls).
- Deliver on Telegram as MEDIA: zip + a hero screenshot, report what was QA'd and what he must fill in, and close by offering the next matching asset in the same design language.

## Pipeline

1. **Brand bible** → `{brand}-brand-bible.md`: positioning, audience, voice/tone, copy guidelines, visual style, layout patterns, privacy guardrails. Source: the brand's website when one exists; for person-brands, USER.md.
2. **Design tokens** → `{brand}-design-system.css`: named CSS custom properties (colors, type scale, spacing, radii, shadows) plus core component classes. Commit to ONE bold aesthetic direction (per the frontend-design playbook — never generic AI-slop defaults).
3. **Hero art** → `image_generate` (landscape, palette-locked, explicit "NO text / NO logos / NO people" in the prompt), then `vision_analyze` QA before use. Regenerate on any text, faces, off-palette, or garish result; keep negative space where the headline sits.
4. **Build** one self-contained `index.html`: tokens inlined, fonts via Google Fonts, mobile-first, staggered reveal animations honoring `prefers-reduced-motion`, semantic landmarks + aria labels. Write with a `__HERO_B64__` placeholder, compress the art (PIL → JPEG quality ~78, max width 1920, target ≤120 KB), then base64-inject via execute_code and verify the placeholder is gone. Target <200 KB total so the page works anywhere with zero broken links.
5. **Visual QA** → follow `references/headless-visual-qa.md`. Inspect every section; fix each defect, then re-capture to confirm.
6. **Package** → zip (`index.html`, css, brand bible, `README-hosting.txt`, standalone hero art) and deliver.

## Multi-page sites (business/corporate websites)

Same brand discipline and QA gate as single pages, with a shared build system:

1. **Theme extraction first**: pull the live site's HTML (`curl -sL https://domain`) and grep its inline CSS for real colors/fonts before designing anything. Extend the found DNA with ONE new accent color rather than inventing a palette. If the live site has no logo file, design an inline SVG monogram in the same DNA — never ship a mismatched external asset. When the client later supplies the REAL logo, re-skin to the logo, not the old site's DNA: sample the accent hexes from the logo image itself, pick a typeface echoing its letterforms (rounded wordmark → rounded font like Nunito), swap the placeholder in the single LOGO constant in `site.js` plus each standalone page's header markup, rebuild all pages via `build_pages.py`, then grep the built output for the old accent hex to catch stragglers. Ask for PNG/SVG logo originals — a JPG wordmark shows edge artifacts on dark backgrounds.
2. **Shared system, never N hand-copied pages**: one `styles.css` (design tokens + component classes, CSS logical properties so the same file serves RTL), one `site.js` that renders header/nav/footer/logo into `[data-al-header]`/`[data-al-footer]` placeholders (one brand edit updates every page), and a `build_pages.py` that stamps HEAD/FOOT templates around per-page bodies. Hand-maintaining nav in N files guarantees drift.
3. **Pricing honesty**: anchor every tariff to a live market study via `web_search` (cite the anchor and month in a page footnote); render unapproved prices with a visible DRAFT badge. A dynamic-pricing page is a client-side engine: base tariff × factors (term, mileage, season, volume) with the formula AND a live breakdown of each factor shown — model/price data as arrays in the build script so one edit reprices everything.
4. **Contract-condition matrices**: B2B and B2C each get a full conditions table (term, mileage, deposit, termination, billing, eligibility) — the user reads these as the product. Flag all terms as draft pending legal/Shariah review; never present placeholder terms as final.
5. **Approved pages are immutable**: after the user has accepted a page, write revisions to a NEW file (`index-bilingual.html`), never overwrite the approved one. `write_file` on a previously-shipped file also trips the read-before-overwrite guard.
6. **Bilingual EN/AR**: one page with two DOM trees toggled by swapping `dir` beats two files; Arabic needs its own type rules — no letter-spacing or uppercase (both break Arabic script), taller line-height, phone numbers and prices stay LTR, and the visitor's language choice persists (localStorage).
7. **Verify without a browser when needed**: HTMLParser tag-balance check per page + HTTP 200 per page on the running server (snippet in `references/local-preview-and-lan-access.md`); run the full visual QA gate when the browser stack is up.
8. **Splitting an existing single-page site into multi-page**: externalize the inline `<style>` to `site.css` and link it; locate section boundaries by grepping `<section`/`</section>` line numbers in the original; build each subpage from that line-range, stripping the section's own label/heading (the subpage's subhero replaces them); generate ALL pages with a `build_pages.py` written via `write_file` and run once (not a giant execute_code f-string — see Pitfalls); update the home nav anchors to page links; verify zero `TODO`/`href="#"`, every internal href resolves, curl 200 per page; commit and push.

## Pitfalls

- The base64 injection rewrites the file outside the patch tool's memory — re-read the file before any later `patch`, or the write is refused as externally modified.
- Artwork can collide with overlaid text — add a directional gradient veil over the busy side of the hero before restructuring anything else.
- Do not zero a padded container's side padding in a full-width wrapper (e.g. `padding: 140px 0 96px` on a `.container` child silently strips mobile side padding) — keep top/bottom padding as separate properties so inherited horizontal padding survives.
- Full QA procedure, commands, and capture gotchas: `references/headless-visual-qa.md`.
- `pkill -f "http.server 8472"` kills the calling shell too (exit -15) when the pattern appears in your own command line — use a character class like `pkill -f "http.serve[r] 8472"` or kill the recorded PID.
- On a WSL2 host, the WSL IP (172.x.x.x) is unreachable from other devices — localhost links work only on the PC; phone/LAN links require the Windows-side server procedure: `references/local-preview-and-lan-access.md`.
- Python 3.11 f-strings reject backslashes inside `{}` expressions — an HTML generator with escaped quotes/apostrophes in a giant `execute_code` f-string dies with SyntaxError. Write the generator as a real `.py` file with `write_file` (plain %-formatting or concatenation) and run it once; iterate on the file, not the cell.
- A light-theme override flips nav link colors globally, but the UNSCROLLED nav sits over the dark hero → dark-on-dark invisible links. Scope nav colors by scroll state inside the override block: default `nav .nav-links a` light (over hero), `nav.scrolled .nav-links a` dark (over the light glass bar), then re-capture the hero to confirm.
