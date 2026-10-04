---
name: browser-stack-ops
version: 0.1.0
description: Restart, health-check, and drive the Camofox browser stack.
author: Shams Tabrez (shams), Hermes Agent
license: MIT
platforms: [linux]
metadata:
  hermes:
    tags: [browser, camofox, camoufox, wsl, troubleshooting]
---

# Browser Stack Operations (Camofox)

Keeps Hermes's local anti-detect browser running on this WSL machine (camofox
server on port 9377 + Camoufox engine) and covers the login limits hit when
driving real sites through it.

## When to Use

- `browser_navigate` / other browser tools fail with "Cannot connect to Camofox
  at http://localhost:9377" (typical after a PC restart — the server ran in a
  terminal session that died).
- First-time install or reinstall of the browser backend.
- A site login through the browser stalls on credentials or verification.

## Procedure

1. Health check:
   `terminal(command="curl -s --max-time 5 http://localhost:9377/health")` —
   `{"ok": true, ...}` means the stack is up; go drive it. Anything else → step 2.
2. Start the server (it is an npm package run by hand, not a service):
   `terminal(command="cd ~/.hermes/node/lib/node_modules/@askjo/camofox-browser && export PATH=\"$HOME/.hermes/node/bin:$PATH\" && node server.js", background=true, notify=true)`
3. First launch after (re)install downloads the Camoufox engine itself (~663 MB,
   several minutes). The log shows a progress bar; a "Version information not
   found at ~/.cache/camoufox/version.json" error during this window is the
   download still running, not a failure. Poll the background process log and
   wait for `~/.cache/camoufox/version.json` to appear. Never restart the
   server mid-download.
4. Reinstall path (user-provided canonical command):
   `curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash -s -- --ensure browser`
   The script's output ends right after "Installing camofox browser server..."
   even on success — the package lands in `~/.hermes/node/lib/node_modules/
   @askjo/camofox-browser`. It does NOT start the server; run step 2 after it.
5. Verify end-to-end with a real `browser_navigate` before telling the user the
   stack is fixed.

## Logins through the anti-detect browser

- A fresh browser profile is signed into NOTHING, even when the user's desktop
  apps and normal browser are — expect the full login flow every time.
- `browser_vault_save_login` needs BOTH a password field on the current page
  AND a surface that can render a masked prompt (CLI, TUI, Desktop). On
  messaging-gateway surfaces (Telegram) the prompt callback is never installed,
  so the call fails with "Open the site's login page first" even on a genuine
  login page — that error names the wrong cause. Do not retry it; the surface
  is the blocker.
- Never collect the password via `hermes vault add` in a background/pty
  terminal — the hidden password prompt is invisible to the user and they will
  ask "where do I enter this". Route them instead: Desktop app → Settings →
  Passwords & Logins, or `hermes vault add` in their own visible terminal.
- Microsoft sign-in: reusing a captured `/authorize` URL from an earlier
  attempt fails with `invalid_request: Proof Key for Code Exchange is
  required` — PKCE state/nonce are single-use. Always restart the flow from the
  site's own Sign in link, never from a URL in history or a previous snapshot.

## Pitfalls

- Don't chase the Docker hint in the connection error text: the
  `jo-inc/camofox-browser` image does not exist on Docker Hub, and Docker
  Desktop is not integrated into this Ubuntu WSL distro. The npm package +
  `node server.js` is the working path.
- Don't flip `interactive.mode` in `camofox.config.json` to surface a visible
  window for manual password entry unless the user explicitly asks — and if you
  do experiment, restore `"off"` immediately after; the config lives inside the
  npm package and the change persists silently across restarts.
- Trust the `/health` endpoint over `netstat` — the port can serve fine while
  netstat shows nothing for 9377 inside the distro.
- Camofox in-page sessions reset when the server restarts; the persistence
  plugin saves profile state under `~/.camofox/profiles`, but an in-flight
  login flow must be restarted from scratch after any server restart.
- A 400 on `/tabs` with `/health` reporting `"browserConnected": true` is a route-contract mismatch, not a dead stack: probe POST /tabs with the adapter's literal JSON body (`-H 'Content-Type: application/json'`, userId + listItemId + url) to surface the real server-side error, then read the vendored `server.js` (grep `app.post('/tabs'`) for its required body fields and whether the route parses a body. One build shipped `/tabs` WITHOUT an `express.json()` parser while destructuring `req.body` — re-attach the top-of-file `globalJsonParser` to the route and restart. Re-check any vendored-package patch after a camofox reinstall/update.
- `file://` URLs are refused by the camofox navigate layer (`Blocked URL scheme: file: (only http/https allowed)`) no matter what the engine could render — serve the artifact with `python3 -m http.server` and navigate to the 127.0.0.1 URL.
- `pgrep -af` the target BEFORE `pkill -f`, then kill the specific PID — the Hermes command wrapper embeds the pattern text in its own shell command line, so a naive `pkill -f` matches and kills its own wrapper (exit -15, step dies mid-flight).
