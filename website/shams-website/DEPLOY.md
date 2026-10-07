# Deploying shams-website

Static export in `out/` — hostable anywhere. Recommended, in order of simplicity:

## 1. Netlify Drop (fastest — 2 minutes)
1. Go to https://app.netlify.com/drop
2. Drag the `out/` folder onto the page
3. Done — live URL immediately. Custom domain: Site settings → Domain management.

## 2. GitHub Pages (free, versioned)
1. Create repo, e.g. `shams-website` (private or public)
2. `cd out && git init && git add -A && git commit -m "site build"`
3. `git push` to the repo, then enable Pages: repo Settings → Pages → Deploy from branch → main → root
4. Live at `https://<username>.github.io/shams-website/`

## 3. Vercel (best DX)
1. Push the whole project to GitHub
2. vercel.com → Import project → framework auto-detected (Next.js)
3. Note: with `output: "export"`, Vercel serves the static `out/` build.

## Before you deploy — 4 TODOs (search for `TODO(shams)`)
- [ ] `src/app/page.tsx` hero "Connect on LinkedIn" → your LinkedIn URL (https://linkedin.com/in/shams2tabrez)
- [ ] `src/app/page.tsx` contact LinkedIn button → same URL
- [ ] `src/app/page.tsx` contact "Write to me" → `mailto:Shams090484@gmail.com`
- [ ] Optional: update `metadataBase` in `src/app/layout.tsx` to your final domain

Then `npx next build` once more and redeploy the fresh `out/`.

## Local preview
`node scripts/serve-gzip.cjs` → http://127.0.0.1:4181 (gzip, mimics real CDN)

## QA evidence (this build)
- Lighthouse: Performance 98 · Accessibility 100 · Best Practices 100 · SEO 100 (slow-4G simulated)
- LCP 2.4 s · FCP 0.8 s · TBT 40 ms · CLS 0
- Zero console errors, zero failed requests (full interaction QA script: scripts/qa-final.cjs)
- Responsive: 0px horizontal overflow at 375px and 768px
- Dark + light themes verified via real toggle interaction
- Total build: 1.4 MB folder, ~588 KB transfer uncompressed / well under 2 MB page-weight cap