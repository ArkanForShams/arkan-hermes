# KINETIQ — Build Log (Mission 02: Sports Company World)

Company: KINETIQ — performance sportswear & equipment, Portland, OR (est. 2019).
Mission: "Measured in milliseconds." Revenue $210M FY2025, +68% YoY, 34 countries.

## Deliverables

| File | What |
|---|---|
| `index.html` | Single-file landing page, Google Fonts (Anton / Archivo / JetBrains Mono), no frameworks, 36 KB |
| `deck-kinetiq.pptx` | 14-slide 16:9 Series C investor deck, void-black + volt |
| `deck-spec.json` | Structural deck spec (pptx_create.py input) |
| `deck_style.py` | Brand post-processor (typography, dark tables, volt chart, outline cleanup) |
| `deck-img/`, `assets/` | 6 AI-generated brand images (hero, 3 products, lab, campaign still) + web/deck-optimized variants |
| `render/` | QA captures: desktop/mobile heroes, full-page slices, all 14 deck slide PNGs (rendered by real PowerPoint COM), final-desktop.png |
| `render_deck.ps1` | PowerShell COM script that exports slides to PNG via installed Microsoft PowerPoint |

## Image pipeline
6 images generated (gpt-image-2 via image_generate). One defect found and fixed in QA:
hero sprinter carried a swoosh-style logo → image-edit pass removed it → re-verified clean.
All processed with PIL: web JPEGs (≤300 KB) and deck variants (darkened backgrounds
for text overlay, exact placement-ratio center-crops).

## Version history

### v1 — initial build
- Landing page: full section stack (sticky nav, hero, marquee ticker, The Lab,
  product grid, athletes, campaign, animated counters band, testimonials,
  partnerships, sustainability, honest-signup email capture, footer), grain
  overlay, scroll reveals, hover volt glows, mobile responsive.
- Deck: 14 slides generated via pptx_create.py + post-processor.

### v2 — first verification pass fixes
- Landing (iteration 1→2): desktop+mobile full-page captures via headless Chromium.
  Defects found: nav links washed out over stadium lights → added top gradient veil.
  Zoom QA confirmed ticker marquee intact and counters animating ($0M→210M captured
  mid-count under virtual time). Live-browser pass (browser_navigate + browser_vision)
  confirmed hero composition, nav, chips: no overlap/cut-off; art direction confirmed.
- Deck (render pass 1 → 2): rendered all 14 slides with real PowerPoint (COM export,
  1600×900 PNG). Critical defect: post-processor slide indices were off by one from
  slide 6 onward → content landed on wrong slides (default-colored chart on the model
  slide, roster text over the campaign photo, unstyled blue tables, team text colliding
  with $40M shapes). Rebuilt with explicit slide map; dark-themed tables with cell
  borders; volt column chart with per-point 2026E highlight; global autoshape
  outline/shadow cleanup; removed colliding spec shapes.

### v3 — second deck verification pass (final)
- Render pass 2 → 3 found and fixed: s4 title underline clipping first product image
  (image row + captions moved down, underline rule made optional per-slide);
  s5 "CARBONDRIVE PLATE" wrapping into its description (name box height + size fixed);
  s6 sub-labels straddling the 61/39 bar edge + kicker collision (labels inset into
  segments, kicker moved to y=3.62); s7 stray dim "Revenue ($M)" chart title
  (has_title=False); s10 director credit wrapping (copy shortened, band lowered);
  s11 accent rule touching table top (removed on table slides, note moved down);
  s13 use-of-funds rows colliding with founder card 2 (rows moved right/above the
  allocation bar, tightened spacing).
- Final 4 contact sheets reviewed: zero overlap/truncation defects remaining.
  PowerPoint COM open+export doubles as a strict file-validity check.

## Verification summary
- Landing: 2 full verification passes (static full-page desktop + mobile with
  reveal-forced copy; live browser pass) + final hero re-capture after fix. PASS.
- Deck: 3 PowerPoint render passes, 2 fix cycles, every slide visually inspected
  via contact sheets + targeted zooms. PASS. File re-validated by PowerPoint itself.
- `index.html` tag-balance check: NONE errors, 36 KB.

## Iteration counts
- Landing page: 2 verification passes, 1 fix cycle → shipped v2.
- Deck: 3 render/verification passes, 2 fix cycles → shipped v3.

## Known notes
- Fictional company; all metrics/claims are invented world-building per mission brief.
- Deck fonts are Windows-universal (Arial Black / Consolas / Arial) because the
  deck was rendered and verified with the user's installed PowerPoint; on machines
  without them, PowerPoint substitutes automatically.
- `lab@kinetiq.example` / `partners@kinetiq.example` are fictional placeholders.