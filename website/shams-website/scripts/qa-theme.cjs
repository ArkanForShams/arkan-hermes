/* Real-interaction QA: load page, click theme toggle, screenshot light mode,
   then capture full page + check console errors. Uses playwright-core with
   the installed Chromium. */
const { chromium } = require("playwright-core");

const EXE = "/home/shams/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome";
const URL = "http://127.0.0.1:4180/";

(async () => {
  const browser = await chromium.launch({
    executablePath: EXE,
    args: ["--no-sandbox", "--disable-gpu"],
  });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errors = [];
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  page.on("pageerror", (e) => errors.push("PAGEERROR: " + e.message));

  await page.goto(URL, { waitUntil: "networkidle" });
  await page.waitForTimeout(800);

  // 1. Click the theme toggle (aria-label "Switch to light theme")
  await page.click('button[aria-label="Switch to light theme"]');
  await page.waitForTimeout(600);
  await page.screenshot({ path: "/tmp/qa-light-real.png" });

  const isLight = await page.evaluate(() => document.documentElement.classList.contains("light"));
  const heroBg = await page.evaluate(() => getComputedStyle(document.querySelector("section")).backgroundColor);
  console.log("light class applied:", isLight);
  console.log("hero section bg now:", heroBg);

  // 2. Full-page light screenshot
  await page.screenshot({ path: "/tmp/qa-light-full.png", fullPage: true });

  // 3. Toggle back to dark, verify restore
  await page.click('button[aria-label="Switch to dark theme"]');
  await page.waitForTimeout(400);
  const backDark = await page.evaluate(() => !document.documentElement.classList.contains("light"));
  console.log("toggle back to dark works:", backDark);

  console.log("console errors:", errors.length ? errors : "NONE");
  await browser.close();
})().catch((e) => {
  console.error("QA script failed:", e.message);
  process.exit(1);
});