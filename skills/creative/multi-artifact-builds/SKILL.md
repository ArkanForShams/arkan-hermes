---
name: multi-artifact-builds
description: Use for parallel site+deck builds; QA every artifact after.
version: 1.0.0
author: ARKAN (for Shams Tabrez)
license: MIT
platforms: [linux, windows]
---

# Multi-Artifact Builds

Orchestrate big creative builds (brand worlds / missions: several landing pages + PPT decks at once) through parallel subagent builders, then personally QA every artifact before delivery. The quality bar Shams sets: "would I believe this company actually exists?" Builder self-reports are claims, not verification — QA steps are mandatory.

## Procedure

1. **Toolchain before dispatch.** `uv venv <workspace>/.venv && uv pip install python-pptx pillow` (add `pymupdf` if PDF fallback wanted). Subagents that discover missing deps late burn iterations rebuilding environments.
2. **One builder per artifact, one delegate_task call.** Every brief carries: exact working dir + file paths, the full invented universe (names, founding dates, revenue figures, believable names with real-feeling numbers), art direction committed fully (palette hexes, display+mono font pairing, complete section list, micro-interactions), the quality bar quote, and "verify visually at least twice; never stop at version one".
3. **Steer, don't respawn.** Course corrections go to `delegate_task action=steer` with the subagent_id from the spawn response — a repositioning ("make X a proud visible pillar, not an absence") lands cleanly in an in-flight build.
4. **Long builds: report on cadence.** For runs over ~10 min, spawn a dedicated status-reporter subagent (tail each builder transcript, list artifact sizes/mtimes, deliver one compact report per cycle, final inventory then stop). Stop the reporter with `action=stop` the moment builders finish — a reporter that outlives the build spams the chat.
5. **QA pages personally.** Serve the workspace root over HTTP; walk each page in the browser (hero → mid sections → bottom) with browser_vision asking PRECISE questions. Confirm fixes with fresh, cache-busted loads.
6. **QA decks structurally + visually.** python-pptx pass (slide count, shape count, no empty slides) + `scripts/make_contact_sheet.py` over the rendered slide PNGs → ONE vision_analyze per deck for a whole-deck defect scan, then zoomed region crops of chart/table slides (axis labels, markers, chips hide at sheet scale).
7. **Fix in source, re-verify fresh.** Patch the artifact, then reload with a `?v=N` query param — the QA browser serves stale copies after file edits, making verified fixes look unfixed.
8. **Deliver** with file paths + one-line design summaries per artifact; offer a zip.

## Rendering decks on this host (no LibreOffice)

WSL here has no soffice/pdftoppm. Validated path: render via Windows PowerPoint COM through `powershell.exe`. Copy the .pptx to `/mnt/c/Users/SHAMS/<workdir>/` FIRST (COM cannot open WSL UNC paths reliably; the directory must exist), then:

```powershell
$ErrorActionPreference = "Stop"
$pp = New-Object -ComObject PowerPoint.Application
$pres = $pp.Presentations.Open("C:\Users\SHAMS\<workdir>\deck.pptx", $true, $true, $false)
$pres.Slides.Item(7).Export("C:\Users\SHAMS\<workdir>\Slide7.PNG", "PNG", 1600, 900)
```

- Wrap in try/catch and print failures: piping the output through `tail` eats COM error text and a failed export silently no-ops (Test-Path the PNG afterward).
- Windows user dir is `SHAMS` (capitalized) — `/mnt/c/Users/shams` does not exist.
- Recolor charts with python-pptx: `series.format.line.color`, AND `ser.marker.style/size/format.fill`, AND the legend glyph inherit — default Office-blue survives in line-chart MARKERS and legend even after the line is rebranded. Recolor all three, then re-export and re-inspect.

## Pitfalls

- **Mid-scroll browser screenshots create phantom defects.** Sticky navs captured mid-animation and fixed HUD strips overlap content in a way real scrolling never shows. Before patching any suspected clip, verify with element geometry (`getBoundingClientRect` via browser_console). Two missions' "defects" were artifacts; real ones (contrast, alignment) were found by the same discipline.
- **`document.fonts.check()` lies in the Camofox QA browser** — it reports false even for fonts that render fine. Judge fonts by the letterforms in a zoomed vision crop, not by the API.
- **Google Fonts is unreliable inside the QA browser.** For must-precise fonts (Arabic calligraphy especially), self-host: fetch the css2 endpoint with a Chrome User-Agent, download the unicode-range woff2 files locally, and write a local `@font-face` CSS — with URLs relative to the CSS file itself (`url('amiri.woff2')`, NOT `'fonts/amiri.woff2'` from inside `fonts/` — that resolves to `fonts/fonts/…` and 404s silently).
- **Anchor-jump sections need `scroll-margin-top` ≥ sticky-nav height**, or every nav link lands with the section top clipped under the bar.
- **Art direction default for Shams when unspecified:** bold kinetic dark — void-black base, ONE electric accent, oversized display type colliding with mono data labels, scroll motion. Light editorial reads as admired-but-not-loved; reserve it for briefs that explicitly ask for premium/calm.
