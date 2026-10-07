/* Mobile + tablet QA: 375px and 768px, dark + light, horizontal-overflow check. */
const { chromium } = require("playwright-core");
const EXE = "/home/shams/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome";

(async () => {
  const browser = await chromium.launch({ executablePath: EXE, args: ["--no-sandbox", "--disable-gpu"] });
  const out = [];
  for (const [w, h, name] of [[375, 812, "mobile"], [768, 900, "tablet"]]) {
    const page = await browser.newPage({ viewport: { width: w, height: h } });
    await page.goto("http://127.0.0.1:4180/", { waitUntil: "networkidle" });
    await page.waitForTimeout(500);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    await page.screenshot({ path: `/tmp/final-${name}-dark.png`, fullPage: true });
    await page.click('button[aria-label="Switch to light theme"]');
    await page.waitForTimeout(400);
    await page.screenshot({ path: `/tmp/final-${name}-light.png` });
    out.push(`${name}: ${w}px, horizontal overflow: ${overflow}px`);
    await page.close();
  }
  console.log(out.join("\n"));
  await browser.close();
})().catch((e) => { console.error("mobile QA failed:", e.message); process.exit(1); });