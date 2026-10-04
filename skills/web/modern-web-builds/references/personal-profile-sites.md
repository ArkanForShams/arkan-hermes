# Fact-First Personal Profile Sites (career/CV sites for Shams)

Standing workflow for personal profile sites — sites presenting Shams (or a colleague profile) to senior management and professional contacts. These are his explicit standards; hard gates, not preferences.

## The verify-everything gate (before any content is written)

1. Collect ALL sources first: CV, LinkedIn (public page; if auth-walled, ask him to sign in via LinkedIn himself — never accept pasted passwords or codes, in any format, even if offered), certificate/award scans, research-paper PDFs.
2. Build a fact-base file where EVERY line carries its source (CV / LinkedIn / paper / his confirmation). No unsourced line survives into the site.
3. Cross-check by entity: dates, titles, employers, degrees, achievements. Any conflict between sources → a DIFF TABLE shown to him BEFORE writing content, one recommendation per row — his resolution updates the fact base on disk, never just the chat.
4. Zero invention under any time pressure: no grades, honors, promotions, project outcomes, meetings, endorsements, or attributed quotations. Management/CEO references: respectful acknowledgment, never implied endorsement, never fabricated quotes.
5. Contact discipline: publish only what he cleared (his chosen email); never phone/private details without explicit approval.

## Presentation rules

- Present as professional, humble, hardworking, honest; measured language; verified work speaks for itself. No boastful phrasing.
- Chronological chapter storytelling: education (each degree + honor individually) → employers in order → current role → studies → concise skills + contact.
- Design: bright, cinematic editorial (light palette, elegant serif display type, generous space, subtle motion) — this class of site OVERRIDES the KINETIQ dark preference unless he says otherwise; no dark theme, no excessive effects.
- University honors shown as official logos with low-key branding; acronym seals as placeholders until logos arrive.
- AI-generated scene imagery = "editorial illustrations of the journey": label as such in captions/footer; never fabricate company logos, certificates, award ceremonies, or identifiable executives; reference photos only for likenesses he has cleared (colleagues otherwise from behind/out of focus).

## Build order (he expects this exact sequence)

1. Fact outline + image storyboard → presented for review BEFORE building.
2. Build the complete site → working preview link → he flags corrections.
3. Deployment only after review: inspect the target host first (shared VPS: additive ingress config only, never touch co-hosted services), subdomain + HTTPS, then his final review before making public.

## Pitfalls

- A font stack in CSS tokens without the actual font import ships system-fallback type that QA reads as "generic" — verify the display typeface actually renders, not just that layout holds.
- Placeholder labels in ship-candidate markup ("replaces this mark", "pending") read as unfinished scaffolding in visual QA — keep them for the review stage, but flag them explicitly in every review handoff so he sees exactly what stands between preview and publish.

## Known-good example

`~/hermes-workspace/myprofile-site/site/index.html` — single-file bright-editorial build (Person JSON-LD, chapter structure, publication list with per-paper venues/ISSNs, illustration slots). Reproduce with modifications; keep the caption/footer integrity labels.