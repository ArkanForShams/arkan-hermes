---
name: slide-design-expert
description: "Use for slide visual design and chart craft."
version: 0.1.0
author: ARKAN (for Shams Tabrez), Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [Slides, Design, Charts, Typography, Hierarchy]
    related_skills: [presentation-architect, cto-caio-presentation-master, executive-presenter-coach, powerpoint]
---

# Slide Design Expert Skill

Visual craft for executive slides: one-message layout, visual hierarchy, chart selection, color and typography discipline, and the readability checks that separate board-grade decks from slide-ware. Influenced by Duarte, Presentation Zen, Microsoft Fluent design restraint. Structure lives in presentation-architect; file build via the powerpoint skill.

## When to Use
- Designing or repairing slide visuals: layout, charts, hierarchy
- Reviewing a deck for readability before an executive audience
- Setting a reusable deck template (colors, type scale, layout grid)
- Don't use for: storyline and structure (presentation-architect), deck content (cto-caio-presentation-master)

## Procedure
1. **One message, one slide.** Title asserts the message (presentation-architect); everything on the slide proves or supports it. Anything else is deleted or moved to appendix. Completion criterion: each slide passes the "what is this slide proving?" test.
2. **Text discipline.** Slide text: headline + max 3 short bullets or a single visual; no paragraph walls. Detail goes in speaker notes (executive-presenter-coach) or appendix. If a slide needs 60+ words to make its point, it is a document - split or simplify. Completion criterion: word budget per slide <= 40 (exceptions: quotes, definitions).
3. **Chart selection by message.** Comparison -> bar; trend over time -> line; part-to-whole -> stacked bar (pie only for 2-3 slices); correlation/scatter -> scatter; flow/process -> diagram. Every chart carries its takeaway as title or callout - a chart without a message is decoration. Completion criterion: chart type matches message; no chart without a callout.
4. **Chart hygiene.** Y-axis from zero for bars (truncate only with a note); no 3D, no gradients on data; gridlines minimal or off; label directly on data instead of legend-chasing; highlight the one series that matters, mute the rest. Completion criterion: chart checklist passes per visual.
5. **Hierarchy and alignment.** One obvious focal point per slide; consistent margins and grid; title zone fixed; size encodes importance (title > key number > support > footnote). Completion criterion: alignment grid applied; focal point identifiable in 1 second.
6. **Color discipline.** 2-3 colors total: one brand/base, one accent for THE important element, one semantic red/amber/green reserved strictly for status. Color is meaning, not decoration - rainbow slides are unreadable. Dark text on light ground for print/handout decks; verify contrast (WCAG AA for text). Completion criterion: palette documented in the template; semantic colors reserved.
7. **Typography scale.** Two fonts maximum (one display for titles, one body); minimum body size 16-18pt for projection; no font soup; numbers that matter get their own visual weight. Completion criterion: type scale in template; no slide under minimum size.
8. **Readability gates.** Squint test (blur it - is the focal point still visible?), 5-second test (message lands?), projector check (contrast on washed-out projection), consistency sweep (fonts, colors, margins identical across slides). Completion criterion: all four gates pass on the full deck.

## Quick Reference
- **The 5-second rule:** an executive should extract the slide's message in 5 seconds without help.
- **Emphasis by restraint:** the quietest way to highlight (space + one accent color) outperforms bold-everything.
- **Tables are for reference, charts for messages** - if the audience must compare cells, it is a chart.
- **Consistency beats creativity:** a disciplined template with one accent reads as senior; slide-per-slide reinvention reads as amateur.
- **Handout vs projection:** projection decks carry less text; handout decks must survive without the speaker - decide which mode first.

## Pitfalls
- **Chart junk:** legends with 12 entries, gridline forests, 3D perspective that distorts data.
- **Template drift:** every author restyling - one template, enforced.
- **Decoration over meaning:** icons, gradients, and clip-art that carry no information. Cut.
- **The wall of text:** slides doubling as documents - split, simplify, or move to appendix.
- **Invisible contrast:** light-gray text on white projectors unreadable from row three. Test on a projector.

## Verification
- Full deck passes squint, 5-second, projector, and consistency gates.
- Every chart has a message callout and matches its message type.
- Template documented; palette and type scale enforced across slides.

## Deeper Sources
- Nancy Duarte, Resonate; Garr Reynolds, Presentation Zen
- Microsoft Fluent design restraint principles; Nielsen Norman Group readability guidance
- powerpoint skill (file generation), presentation-architect (structure), executive-presenter-coach (notes)
