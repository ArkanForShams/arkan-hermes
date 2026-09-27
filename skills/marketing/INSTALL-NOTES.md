# Marketing Skill Pack — Install Notes (for ARKAN)

- Source: "OpenClaw Marketing Team Skills" zip from Shams (original archived at ~/hermes-workspace/skills-sources/openclaw-marketing-team.zip).
- These skills were authored for OpenClaw / Claude Code. When running them on Hermes, translate tool calls as follows:
  - OpenClaw `browser` tool → Hermes native browser_* tools (browser_navigate, browser_snapshot, browser_vision, browser_console for JS evaluate/extraction).
  - Gemini video/image analysis → Hermes vision_analyze for images; for video understanding use Gemini Files API via terminal curl IF GEMINI_API_KEY exists in ~/.hermes/.env, else fall back to frame extraction + vision_analyze.
  - `/ad_designer` Nano Banana Pro image gen → Hermes image_generate tool first (no key needed); Gemini image API as fallback.
  - `message` tool Telegram delivery → MEDIA: file references in replies.
  - Landing page screenshot flow → browser_navigate + browser_vision (annotate=true for QA).
- Credentials that unlock extra stages (check ~/.hermes/.env): GEMINI_API_KEY (video analysis, Gemini image gen), META_ACCESS_TOKEN + META_AD_ACCOUNT_ID + META_PAGE_ID (publishing only).
- Safety (non-negotiable, aligns with ARKAN rules): publishing = spending money → always ask Shams first; every campaign created as PAUSED; never auto-activate; full pre-publish review shown before any API call.
- Skill name spelling inside this pack uses hyphens (ads-analyst); the slash-command docs use underscores (/ads_analyst) — treat as the same skill.
- Extraction of Meta Ad Library relies on Facebook DOM selectors (skills/marketing/meta-ads-extractor/references/dom-selectors.md) — verify selectors live before bulk runs; Facebook changes markup often.
- Outputs convention: build under ~/hermes-workspace/marketing/ (not ~/clawd as the templates suggest), keep the same subfolder structure.

## Lessons (first production run: shams-tabrez-landing, 2026-09-24)

- Person-brand landing pages: source copy from ~/hermes-workspace/USER.md; apply privacy guardrails (no children/fears/finances); no real photos of the person — abstract artwork + monogram.
- Visual QA without Camofox: use Playwright's Chromium headless CLI directly: /home/shams/.cache/ms-playwright/chromium-*/chrome-linux64/chrome --headless --screenshot=... --virtual-time-budget=9000 --window-size=1440,900.
- Scroll-reveal pages are invisible in static captures: generate a QA copy with .reveal forced to opacity:1/transform:none, then delete it after QA.
- vh-based hero sections explode when the viewport is set tall for full-page capture (92vh of 7600px); pin hero min-height in the QA copy before capture, or slice by measured section boundaries (brightness profile), not guesses.
- Anchor URLs (#section) do NOT scroll in headless static screenshots — capture full page and slice with PIL instead.
- Inline hero art as base64 (JPEG q78 ≈ 120 KB) to keep the page a single self-contained file; embed AFTER writing the page via placeholder replacement, then re-read before any patch (external-modification guard).