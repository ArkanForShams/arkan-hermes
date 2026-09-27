# Mission 03 — MERIDIAN BEVERAGE CO. — Build Log

## Brief
- **Company**: Meridian Beverage Co. — "Drinks in tune with the planet." Founded 1987 in Valencia as a citrus spring water bottler; today a global house of brands across 42 markets, 11 production hubs, 4,800 employees. Revenue €1.9B. B-Corp certified; water-positive since 2021 (120% replenishment).
- **Deliverables**: (1) single-file landing page `index.html`; (2) 14-slide 16:9 deck `deck-meridian.pptx`.
- **Owner course correction (mid-build)**: Meridian must be explicitly and proudly **100% NON-ALCOHOLIC** as a core brand pillar — announcement bar/hero badges, brand story ("by conviction, not by omission"), halal-certified lines among certifications, GCC + Indonesia/Malaysia positioned as strategic growth markets *because* of the non-alcoholic portfolio; same positioning added to the deck (cover, brand story, market expansion, ESG/values slides).

## Asset pipeline (image_generate, 8 finals)
| File | Use | Notes |
|---|---|---|
| assets/hero-lineup.png | Hero composition | All 5 brand labels legible & correctly spelled (verified via vision_analyze) |
| assets/springs-bottle.png | Story section | "MERIDIAN" label verified legible |
| assets/groves.png | Journey step 1 | — |
| assets/harvest-hands.png | Journey step 2 | — |
| assets/citrus-glass.png | Journey step 3 | — |
| assets/market.png | Journey step 4 | — |
| assets/solar-plant.png | Journey step 5 + sustainability | — |
| assets/family-toast.png | Journey step 6 | **regenerated once** — first render contained wine bottles (off-brief for a 100% non-alcoholic brand); replacement shows only soft drinks |

## Landing page — version history
- **v1 (initial build)**: full single-file page — announcement bar, sticky nav, hero + floating product composition, story, 5 brand cards with distinct sub-palettes, 6-step grove-to-glass journey with photos, dark numbers band, sustainability pillars + honest-gaps box, markets grid, leadership, certifications, investor CTA + newsletter, rich footer with legal lines. Google Fonts (Marcellus + Jost). Scroll reveals, wave parallax, counter animations. 100% non-alcoholic positioning applied from the start (announcement bar, badges, story conviction quote, markets callout, halal cert cards, footer legal).
- **v1 → v2 (verification pass 1 fixes)**:
  1. Sticky nav background 0.82 → 0.96 alpha (headline bled through behind nav while scrolling).
  2. Brand-card h3 flex-wrap (Meridian Springs title/tag wrap collision).
- **v2 → v3 (verification pass 2 fixes)**:
  3. Sticky nav made fully opaque `#FAFCFC` (Camofox screenshot still showed ghosting through translucency).
  4. Added `section[id]{scroll-margin-top:86px}` so anchor jumps don't tuck headings under the nav.
- **Verification performed**: browser_navigate (content OK) + browser_vision on hero, brands, journey (×2), numbers band, markets; browser_console image-load sweep (9/9 loaded after scroll-triggered lazy load; earlier "broken" list was pre-scroll lazy state, confirmed false alarm via HTTP 200s); JS toggle checks for mobile menu; no console errors. Mobile: 3 media-query blocks verified in source; live 375px viewport emulation not available in this headless backend (documented limitation) — desktop 1920px render has zero horizontal scroll.
- **Non-alcoholic positioning confirmed in final page**: announcement bar ("100% Non-Alcoholic · Halal-Certified Lines · B-Corp · Water-Positive"), hero badge, story conviction quote + competitive-engine paragraph, house-rule card, markets strategic callout (GCC/Indonesia/Malaysia 28% growth), halal cert card, footer legal.

## Deck — version history
- **v1 (initial build)**: 14-slide spec; **discovered in render**: `pptx_create.py` has no `texts` key (free textboxes) → slides 1–2 textless; 10-inch coordinate grid on a 13.33-inch slide → left-packed layout; default Calibri fonts (Marcellus/Jost absent on host); default shape outlines visible; cover image buried under full-slide background rect; default Office chart palette.
- **v2 fixes**: coordinate grid rebuilt for 13.33×7.5in; Marcellus + Jost installed on the Windows render host (per-user registry + AddFontResource); outline stripping (66 autoshapes) + table styling + 127 textboxes via post_process.py; pictures lifted above background rects (z-order).
- **v3 fixes**: badge chips rebuilt as empty rects + separate vertically-centered textboxes (single line, no wrap); accent bars moved clear of headlines (top 0.78→0.42) on all 12 content slides; hub-table cells shortened to stop wrapping; slide 5 side stats added after a duplicate-`texts`-key JSON bug silently dropped the headline (found via render sweep, fixed by merging keys); leadership name/bio column widths widened to stop mid-word wraps; chart series recolored to brand teal/amber.
- **Verification**: full PowerPoint COM render (1280×720 PNG/slide) + vision_analyze on all 14 slides across 2 full passes (v2: 14/14 → issues found; v3: 14/14 → clean; targeted re-checks on slides 2,3,4,5,6,8,9,10,12,13,14 + zoom crops of cover chips). Charts verified teal (line + bars), table banding verified, no overlap/truncation remaining.
- **Non-alcoholic positioning confirmed in final deck**: cover chips ("100% NON-ALCOHOLIC · HALAL-CERTIFIED"), slide 2 subtitle ("built entirely without alcohol — by conviction, not by omission"), slide 3 bottom band ("every line alcohol-free by design · every line halal-certified"), slide 6 strategic-growth callout (GCC + Indonesia/Malaysia growing 28% *because* of the 100% non-alcoholic halal-certified portfolio), slide 10 Gulf zero-proof craft programme, slide 13 halal cert card + values statement, slide 14 closing line ("100% non-alcoholic since 1987").

## Files
- `index.html` — landing page (single file)
- `deck-meridian.pptx` — 14-slide deck
- `deck-spec.json` — deck build spec
- `post_process.py`, `strip_lines.py`, `fix_charts.py` — deck post-processing (textboxes, z-order, outlines, tables, chart colors)
- `render.ps1` — PowerPoint COM render script (Windows host)
- `assets/` — 8 generated images + `assets/deck/` cropped JPEGs
- `render/` — rendered slide PNGs (final state)
- `fonts/` — Marcellus/Jost TTFs used for host install