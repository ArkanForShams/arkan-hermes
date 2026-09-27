# Headless visual QA recipe

Validated path for rendered-page QA when the Camofox browser backend is not running. Core principle: never ship a page that has not been SEEN rendered — static capture + vision inspection of every section.

## 1. Serve the page

- `python3 -m http.server <port> --bind 127.0.0.1` as a background terminal process (no nohup wrappers — Hermes must track it).
- Verify readiness with `curl -s -o /dev/null -w "%{http_code} %{size_download}"` before capturing.

## 2. Find a Chrome binary

- Playwright's Chromium works: `/home/shams/.cache/ms-playwright/chromium-*/chrome-linux64/chrome` (discover with a bounded `find`; version dirs change).
- Verify with `--version` before batch captures.

## 3. Capture

```bash
CHROME=<path-to-chrome>
"$CHROME" --headless --disable-gpu --no-sandbox --hide-scrollbars \
  --force-device-scale-factor=1 --window-size=1440,900 \
  --screenshot=out.png --virtual-time-budget=9000 "http://127.0.0.1:8471/index.html"
```

- Mobile viewport: `--window-size=390,844`.
- Full page: one tall viewport (try 8800 first) rather than many small captures — page height is unknown up front.
- `--virtual-time-budget=9000` lets fonts/images settle.

## 4. QA copy for animated pages (delete after QA)

Scroll-reveal pages show only the hero in static captures — everything below stays `opacity: 0`. Build a `qa.html` copy with:

- Reveals forced visible: `.reveal { opacity: 1 !important; transform: none !important; transition: none !important; }`
- Hero height pinned to its real viewport height (e.g. `min-height: 828px !important` for a 900px viewport) — otherwise a vh-based hero (92vh) explodes to ~7000px in a tall full-page capture and every sliced "section" is just sky.
- Slice sections by MEASURED boundaries (brightness profile down the left edge → dark/light transitions), never guessed offsets; or inspect a 400px-wide full-page overview first to map the layout, then crop targeted bands.

## Known limits and heuristics

- Anchor URLs (`page.html#section`) do NOT scroll in headless static screenshots — they produce blank tiles. Capture full page + slice instead.
- Several screenshots with IDENTICAL byte sizes = blank captures; investigate the capture method, do not send them to vision.
- Verify each fix with a fresh capture (name files `-v2`, `-v3`); a fix without a re-capture is unverified.
- Close the loop: after QA, delete the qa copy, re-verify the real `index.html` (no placeholder strings, expected size), then package.