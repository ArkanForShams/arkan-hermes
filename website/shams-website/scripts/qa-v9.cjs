
const { chromium } = require('playwright-core');
(async () => {
  const b = await chromium.launch({ executablePath: '/home/shams/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome', args: ['--no-sandbox','--disable-gpu'] });
  const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await p.goto('http://127.0.0.1:4181/', { waitUntil: 'networkidle' });
  const light = await p.evaluate(() => ({
    heroBg: getComputedStyle(document.querySelector('section[aria-label="Introduction"]')).backgroundColor,
    h1: getComputedStyle(document.querySelector('section[aria-label="Introduction"] h1')).color,
    rootHasLight: document.documentElement.classList.contains('light'),
  }));
  await p.screenshot({ path: '/tmp/v9-light-hero.png' });
  await p.click('button[aria-label="Switch to dark theme"]');
  await p.waitForTimeout(700);
  const dark = await p.evaluate(() => ({
    heroBg: getComputedStyle(document.querySelector('section[aria-label="Introduction"]')).backgroundColor,
    h1: getComputedStyle(document.querySelector('section[aria-label="Introduction"] h1')).color,
    rootHasLight: document.documentElement.classList.contains('light'),
  }));
  await p.screenshot({ path: '/tmp/v9-dusk-hero.png' });
  await p.click('button[aria-label="Switch to light theme"]');
  // mobile
  const m = await b.newPage({ viewport: { width: 375, height: 812 } });
  await m.goto('http://127.0.0.1:4181/', { waitUntil: 'networkidle' });
  const overflow = await m.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  await m.screenshot({ path: '/tmp/v9-mobile.png' });
  console.log(JSON.stringify({ light, dark, mobileOverflow: overflow, consoleErrors: errs }, null, 1));
  await b.close();
})();
