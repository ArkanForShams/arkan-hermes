const { chromium } = require("playwright-core");
const EXE = "/home/shams/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome";
(async () => {
  const browser = await chromium.launch({ executablePath: EXE, args: ["--no-sandbox", "--disable-gpu"] });
  // DARK hero
  let page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto("http://127.0.0.1:4181/", { waitUntil: "networkidle" });
  await page.waitForTimeout(600);
  await page.screenshot({ path: "/tmp/ship-dark-hero.png" });
  await page.screenshot({ path: "/tmp/ship-dark-full.png", fullPage: true });
  // toggle to LIGHT via real button
  await page.click('button[aria-label="Switch to light theme"]');
  await page.waitForTimeout(500);
  await page.screenshot({ path: "/tmp/ship-light-hero.png" });
  await page.close();
  // MOBILE dark
  page = await browser.newPage({ viewport: { width: 375, height: 812 } });
  await page.goto("http://127.0.0.1:4181/", { waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  await page.screenshot({ path: "/tmp/ship-mobile.png" });
  await browser.close();
  console.log("proof captures done");
})().catch((e) => { console.error(e.message); process.exit(1); });
