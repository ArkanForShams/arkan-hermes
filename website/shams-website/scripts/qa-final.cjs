/* Full QA suite: theme toggle both ways, all sections, console clean check.
   Outputs one JSON verdict. */
const { chromium } = require("playwright-core");
const EXE = "/home/shams/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome";

(async () => {
  const browser = await chromium.launch({ executablePath: EXE, args: ["--no-sandbox", "--disable-gpu"] });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errors = [];
  const failed = [];
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  page.on("response", (r) => { if (r.status() >= 400) failed.push(r.status() + " " + r.url()); });
  page.on("pageerror", (e) => errors.push("PAGEERROR: " + e.message));

  await page.goto("http://127.0.0.1:4180/", { waitUntil: "networkidle" });
  await page.waitForTimeout(600);

  // dark screenshots (default)
  await page.screenshot({ path: "/tmp/final-dark.png" });
  await page.screenshot({ path: "/tmp/final-dark-full.png", fullPage: true });

  // to light
  await page.click('button[aria-label="Switch to light theme"]');
  await page.waitForTimeout(500);
  const lightProbe = await page.evaluate(() => {
    const q = (sel) => { const el = document.querySelector(sel); return el ? getComputedStyle(el).backgroundColor : null; };
    return {
      hero: q("section[aria-label='Introduction']"),
      about: q("section[aria-label='About']"),
      dept: q("section[aria-label='The AI department']"),
      principles: q("section[aria-label='Principles']"),
      quote: q("section[aria-label='Words I live by']"),
      contact: q("section[aria-label='Contact']"),
      footer: q("footer"),
    };
  });
  await page.screenshot({ path: "/tmp/final-light.png" });
  await page.screenshot({ path: "/tmp/final-light-full.png", fullPage: true });

  // back to dark
  await page.click('button[aria-label="Switch to dark theme"]');
  await page.waitForTimeout(400);
  const darkRestored = await page.evaluate(() => !document.documentElement.classList.contains("light"));

  // keyboard nav: tab reaches skip link, then nav links
  await page.keyboard.press("Tab");
  const firstFocus = await page.evaluate(() => document.activeElement?.textContent?.trim() || document.activeElement?.tagName);
  const focusVisible = await page.evaluate(() => {
    const el = document.activeElement;
    return el ? getComputedStyle(el).outlineWidth !== "0px" : false;
  });

  console.log(JSON.stringify({ lightProbe, darkRestored, firstFocus, focusVisible, consoleErrors: errors, httpFailures: failed }, null, 1));
  await browser.close();
})().catch((e) => { console.error("QA failed:", e.message); process.exit(1); });