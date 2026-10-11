const { chromium } = require("playwright-core");
(async () => {
  const browser = await chromium.launch({ executablePath: "/home/shams/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome", args: ["--no-sandbox"] });
  const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
  await page.goto("http://127.0.0.1:4181/", { waitUntil: "networkidle" });
  const secs = ["about", "research", "department", "principles"];
  for (const id of secs) {
    await page.evaluate((id) => document.getElementById(id).scrollIntoView({ block: "start" }), id);
    await page.waitForTimeout(900);
    const el = page.locator(`#${id}`);
    await el.screenshot({ path: `/tmp/sec-${id}.png` });
  }
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(900);
  await page.screenshot({ path: "/tmp/sec-footer.png" });
  console.log("done");
  await browser.close();
})().catch(e => { console.error("ERR", e.message); process.exit(1); });