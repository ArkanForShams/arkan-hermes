---
name: cto-caio-presentation-master
description: "Use for end-to-end executive deck production."
version: 0.1.0
author: ARKAN (for Shams Tabrez), Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [Executive-Decks, CTO, CAIO, Board, Production-Flow]
    related_skills: [presentation-architect, slide-design-expert, executive-presenter-coach, caio-advisor, powerpoint]
---

# CTO/CAIO Presentation Master Skill

The end-to-end executive deck production procedure for technology leadership: from raw idea to rehearsed, board-grade presentation. Orchestrates the presentation stack (presentation-architect, slide-design-expert, executive-presenter-coach) and sources content from the domain skills. This is the single entry point for CTO/CAIO-grade decks.

## When to Use
- Any deck that will face executives, steering, or a board: AI strategy, transformation business case, architecture review, technology roadmap, PMO/portfolio review
- "Build me a presentation about X" - where X is technology leadership territory
- Don't use for: single-level tasks (storyline only -> presentation-architect; visuals only -> slide-design-expert; delivery only -> executive-presenter-coach)

## Procedure
1. **Intake.** Audience + decision (presentation-architect step 1), slot length, mode (projection vs handout), deadline. No deck starts without the decision it seeks. Completion criterion: intake sheet complete.
2. **Storyline.** SCQA + governing thought + MECE pillars + action titles via presentation-architect procedure. Completion criterion: storyline outline approved by Shams before any slide is built - structure first, always.
3. **Content sourcing from domain skills.** Pull substance, not folklore: AI strategy -> caio-advisor (maturity, operating model, value case); data platform -> fabric-architect / powerbi-architect (current/target architecture); status/portfolio -> pmo-reporting (metric dictionary numbers, evidence-based RAG); landscape -> technology-portfolio-advisor (health, debt); decisions -> cto-advisor (options tables, ADRs). Every number traceable to its source skill output. Completion criterion: content inventory with source annotations.
4. **Deck-type pattern selection.** AI Strategy Board Deck: maturity baseline -> vision -> use-case portfolio (ai-portfolio-advisor) -> governance gates (ai-governance) -> roadmap -> investment ask. Architecture Review: current state -> target state -> delta/migration -> risk -> investment. Transformation Business Case: problem quantified -> options -> ROI ranges -> ask. Technology Roadmap: now/next/later -> dependencies -> capacity. PMO/Steering: executive-reporting skeleton. Completion criterion: pattern chosen; deviations noted.
5. **Design pass.** Build slides under slide-design-expert rules: one message per slide, chart selection, palette discipline, readability gates. Completion criterion: design gates pass.
6. **File build.** Generate via the powerpoint skill (python-pptx) for .pptx, or single-file HTML for interactive review decks - brand template applied consistently. Completion criterion: file opens clean; template consistent; notes embedded.
7. **QA gate before it leaves the desk.** Render slides and inspect visually (vision_analyze): text overflow, contrast, chart correctness, number consistency with sources; verify title-only read-through tells the story. Completion criterion: QA pass with zero overflow and zero unsourced numbers.
8. **Speaker prep.** executive-presenter-coach procedure: time budget, notes, Q&A layers, rehearsal with ARKAN simulating the panel. Completion criterion: timed rehearsal within budget.
9. **Deliver + debrief.** Present; log debrief (executive-presenter-coach step 8); file the deck + notes + Q&A doc in the presentation archive for reuse. Completion criterion: archive updated; lessons captured.

## Quick Reference
- **Order is the method:** decision -> storyline -> content -> design -> build -> QA -> rehearsal. Skipping to slides produces beautiful nonsense.
- **Three numbers per slide, all sourced:** unsourced numbers do not survive a board.
- **The ask slide is the contract:** owner, date, decision requested - vague asks die in silence.
- **Reuse archive:** keep winning decks as pattern sources; the second AI strategy deck should start from the first one's skeleton.
- **Honesty rule:** ranges not promises, risks beside benefits, options with trade-offs - credibility is the product.

## Pitfalls
- **Skipping the storyline gate:** the most common failure is building slides before the argument exists. No outline approval, no slides.
- **Content laundering:** paraphrasing domain analysis until numbers lose their source. Trace or delete.
- **Overproduction:** 60 slides for a 20-minute slot. The pattern library keeps decks in the 10-15 slide band.
- **Template amnesia:** rebuilding brand styles every time. One master template, versioned.
- **Presenting un-rehearsed:** an unrehearsed board deck is a reputation risk - the rehearsal is not optional.

## Verification
- Deck passed the QA gate (visual + numbers + title-read-through); sources annotated.
- Rehearsal completed within time; Q&A doc ready; archive updated after delivery.
- The ask was explicit and landed - confirmed in the debrief.

## Deeper Sources
- presentation-architect, slide-design-expert, executive-presenter-coach (the stack)
- caio-advisor, cto-advisor, pmo-reporting, fabric-architect, powerbi-architect (content sources)
- Minto, Duarte, Reynolds (craft tradition); Microsoft/Ignite executive deck patterns (style reference)
