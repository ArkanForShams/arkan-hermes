---
name: static-site-deploy
description: Use when publishing static sites to GitHub Pages or hosts.
---

# Static Site Deployment (GitHub Pages first, then managed hosts)

Procedure for publishing a pre-built static site (Next.js export, plain HTML, Astro) to a live shareable URL, verified before reporting success.

## GitHub Pages (project subpath)

1. **Make asset paths relative to the repo subpath.** For Next.js: gate `basePath` + `assetPrefix` on an env var (e.g. `DEPLOY_TARGET=gh-pages`) in `next.config.ts`, plus `images: { unoptimized: true }`; build with `DEPLOY_TARGET=gh-pages npx next build`. Plain HTML sites: keep relative asset paths.
2. **Copy the export into the target repo** (`cp -r out/* <repo>/<site-path>/`), commit, push. Credentials: `~/.git-credentials` store helper — extract the token inline (`grep … | sed …`), never echo or display it.
3. **Enable Pages via API** (one-time): POST `/repos/<owner>/<repo>/pages` with `{"source":{"branch":"main","path":"/"}}`. Path must be `/` or `/docs` — subdirectory paths are rejected; the site lives at a subpath of the repo root.
4. **`.nojekyll` at REPO ROOT, before debugging anything else.** Without it GitHub Pages runs Jekyll, which silently DROPS every file/dir whose name starts with `_`. Symptom: `index.html` serves 200 while all `_next` assets 404, and raw.githubusercontent.com serves the same file fine. Commit `.nojekyll` + empty commit to retrigger the Pages build.
5. **Visibility gate:** free-plan repos must be PUBLIC for Pages (private → "plan does not support GitHub Pages"). Flipping repo visibility is a standing user decision — ask/confirm, never do it silently.
6. **Verify before reporting live:** poll `GET /repos/<owner>/<repo>/pages/builds/latest` (first build takes 1–2 min; poll, don't sleep blind), then confirm the CSS asset returns 200 AND take a headless-Chromium screenshot to confirm the page is fully styled. An unstyled live page is not 'deployed'. Also diff the served HTML against the repo copy — a build-marker comment or `<html>` class list disagreeing with the freshly pushed file means the queue hasn't applied the new commit; inspect build history (`GET …/pages/builds`) and re-trigger with `POST …/pages/builds` rather than assuming the push failed.

## Managed hosts (Vercel / Netlify)
- Netlify Drop: drag the `out/` folder at app.netlify.com/drop — zero config, custom domain in settings.
- Vercel: needs the USER's account (signup with GitHub). MCP connections authorize through the user's own login flow — never create hosting accounts on the user's behalf and never route account credentials through chat or files. Note plan terms when relevant: Vercel Hobby is free but non-commercial-only; Supabase free tier pauses projects after one week of inactivity (no card required anywhere).

## Pitfalls
- **A legacy Pages queue can pin the published site to an OLD commit for hours while reporting `building`/`errored`.** Diagnose: diff the served HTML's Next.js build-marker comment (`<!--<hash>-->` after `<!DOCTYPE html>`) or `<html>` class list against the freshly pushed repo file — divergence means the live copy is stale, not your build. **Never delete the repo copy while unwedging** — the live site keeps serving the last built commit, so deleting the local/repo copy during the wait turns 'stale but live' into fully dead; fix forward by re-running the build and pushing.
- **Modern Actions-based Pages deploys (actions/deploy-pages) change the whole failure surface**: they need the workflow file committed, Pages set to 'GitHub Actions' source in repo settings (a UI action for the user, not the API path), and the artifact uploaded from the repo path. If the legacy builder wedged, migrating the Pages source to Actions is the escape — but it costs a settings change the user performs; offer it, don't assume it.
- Deployed-but-unstyled = asset path mismatch OR Jekyll dropping `_` dirs. Diagnose in this order: (1) does the HTML reference the basePath-prefixed asset URL? (2) does that exact URL return 200? (3) does raw.githubusercontent serve the same file (yes + Pages 404 ⇒ `.nojekyll` missing)?
- Grep the pushed commit (`git show --stat`, or the contents API for the asset's directory) before assuming the file wasn't uploaded — if the API lists the file but Pages 404s it, it's a Pages-layer cause, not a git one.
- Subpath hosting changes EVERY absolute URL: verify a JS chunk as well as CSS, and re-run the site's QA probe against the LIVE URL (console errors + failed requests + computed-style check), not just the local server.
- **The legacy Pages builder can sit in `building` far past any reasonable window and fail with an empty log.** Handle, don't stall: report the live URL stating which version it serves (stale vs pushed), give the elapsed breakdown (actual build work vs queue wait), and offer the host fallback (Vercel path in this skill) instead of blocking the user's delivery on GitHub's queue. What we own and verify is the content in the repo; the publish queue is not.