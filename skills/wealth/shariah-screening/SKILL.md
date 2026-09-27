---
name: shariah-screening
description: "Use for Shariah screening of investments and businesses."
version: 0.1.0
author: ARKAN (for Shams Tabrez), Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [Shariah, Screening, AAOIFI, Halal, Purification]
    related_skills: [wealth-advisor]
---

# Shariah Screening Skill

Research and screening methodology for instruments and businesses under Shariah principles: business-activity screens, financial-ratio screens (AAOIFI-style), purification awareness, and documentation discipline. Produces screening RECORDS as research input - the compliance verdict itself belongs to qualified scholars (Shams's framework: Haramain-aligned scholars).

## When to Use
- Screening a stock, fund, or business for halal investment research
- Comparing screening standards and documenting the basis used
- Preparing material for a scholar's review
- Don't use for: issuing verdicts (scholars), portfolio planning (wealth-advisor), transaction execution (never)

## Procedure
1. **Identify the standard.** State which screening basis applies: AAOIFI, or a specific scholar/board (e.g., a fund's Shariah board). Standards differ in thresholds - the record must say which was used. Completion criterion: standard named in the record header.
2. **Business activity screen.** Primary business must be permissible. Commonly excluded activities: alcohol, tobacco, pork products, gambling/betting, conventional banking/insurance (interest-based), adult entertainment, weapons where prohibited. Secondary (impure) income generally tolerated under a threshold (commonly ~5% of revenue) - documented, not assumed. Completion criterion: activity assessment with revenue-segment evidence from filings.
3. **Financial ratio screen (AAOIFI-style).** Commonly applied: interest-bearing debt / market cap (or total assets) below ~30-33%; interest-bearing securities/cash similar threshold; interest income / revenue below ~5%. Compute from latest filings; note the numbers and dates. Completion criterion: ratio table with source figures and dates.
4. **Debatable-area flagging.** Items scholars differ on (some receivable-heavy business models, certain tech/platform classifications, crypto assets, small impure-income cases): flag as "requires scholar input", never resolve unilaterally. Completion criterion: debatable items listed with both views noted.
5. **Purification awareness.** If invested despite minor impurity (per a scholar's allowance): the standard practice is divesting the impure proportion and donating it to charity (not counted as zakat). Record what purification applies per the referenced standard. Completion criterion: purification note in the record when relevant.
6. **Documentation.** Screening record per instrument: date, standard used, activity result, ratio table, debatable flags, sources (filings, official reports), and status: "passes this standard / fails / requires scholar input". Completion criterion: record filed in the wealth workspace.
7. **Refresh discipline.** Companies change: re-screen annually or on major events (acquisition, new business line, debt raise). Fund screening relies on the fund's board but spot-check methodology. Completion criterion: re-screen dates in the register.

## Quick Reference
- **Two-stage memory hook:** what they DO (activity) + how they FINANCE it (ratios). Both must pass.
- **Thresholds are scholar-dependent:** AAOIFI ~5% income / ~30-33% debt are common defaults, not universal law. Name the standard every time.
- **Screening output = research input.** "Passes AAOIFI screens" is a finding, not a fatwa.
- **The record is the amanah:** a future reader must reconstruct the decision without guessing.

## Pitfalls
- **Screening drift:** applying thresholds from one standard to a fund governed by another. Name and match standards.
- **Stale screens:** a compliant company raised conventional debt last quarter - the old pass is now wrong. Refresh on events.
- **False precision:** computing ratios to two decimals on estimates. State data quality honestly.
- **Delegating the verdict:** "the app says halal" is not screening. Verify the basis; flag what needs a scholar.
- **Overstepping into ruling:** the skill documents and researches; it never declares something halal/haram. That boundary is the whole skill.

## Verification
- Screening register current; every holding/instrument considered has a dated record with the standard named.
- Debatable items visibly flagged for scholar input; none silently resolved.
- Annual re-screen completed; event-triggered re-screens done when filings show material change.

## Deeper Sources
- AAOIFI Shariah standards (published methodology)
- Fund Shariah-board disclosures (methodology transparency check)
- wealth-advisor (planning context); qualified scholars - final authority always
