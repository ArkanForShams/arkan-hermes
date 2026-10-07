const { chromium } = require("playwright-core");
const EXE = "/home/shams/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome";
(async () => {
  const browser = await chromium.launch({ executablePath: EXE, args: ["--no-sandbox", "--disable-gpu"] });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto("http://127.0.0.1:4180/", { waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  // REAL user path: click toggle
  await page.click('button[aria-label="Switch to light theme"]');
  await page.waitForTimeout(500);
  // Scroll through the whole page so every scroll-driven animation completes
  await page.evaluate(async () => {
    const h = document.body.scrollHeight;
    for (let y = 0; y <= h; y += 700) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 120)); }
    window.scrollTo(0, 0); await new Promise(r => setTimeout(r, 300));
  });
  await page.screenshot({ path: "/tmp/proof-light-real.png", fullPage: true });
  const probe = await page.evaluate(() => ({
    htmlClass: document.documentElement.className,
    heroBg: getComputedStyle(document.querySelector("section")).backgroundColor,
  }));
  console.log(JSON.stringify(probe));
  await browser.close();
})().catch((e) => { console.error("failed:", e.message); process.exit(1); });
