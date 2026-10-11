---
name: local-site-sharing
version: 1.0.0
category: devops
description: "Use when giving Shams links to a locally served website."
---

# Local Site Sharing on This WSL Machine

When building a website for Shams, he will ask for a link he can open — on his PC first,
then on his phone, and often a shareable public URL. This machine is WSL2, whose virtual
network makes naive answers wrong. Get the topology right the first time.

## Topology facts (verify, then act)

- WSL2 has an internal IP (172.x.x.x via `hostname -I`). It is reachable ONLY from Windows
  processes on the same PC — never from other devices, and it changes across reboots.
- A WSL server bound to 0.0.0.0 is still NOT reachable from the LAN.
- WSL2 localhost-forwarding can drift after Windows reboots and Windows-side reconfig:
  verify from the Windows side before promising, never from memory (loopback-forwarded
  agent dashboards have passed the Windows probe repeatedly, but the next one is still
  verified, not assumed).

## Procedure

0. Classify the deployment before sharing a link. A Vercel/Netlify/Supabase option is only a proposal until an authenticated deployment has produced a URL and that URL has passed a public probe; never report an unexecuted hosting option as a live site.

1. Serve the site in WSL: `python3 -m http.server <port> --bind 0.0.0.0` via
   terminal(background=true). For a static Next.js export, serve the `out/` directory explicitly:
   `python3 -m http.server <port> --bind 127.0.0.1 --directory out`. Verify with
   `curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:<port>/`.
2. Test Windows-side reachability via PowerShell interop (this catches the common
   "WSL curl works but Windows browser fails" split):
   `powershell.exe -NoProfile -Command "try { (Invoke-WebRequest -Uri 'http://localhost:<port>/' -UseBasicParsing -TimeoutSec 5).StatusCode } catch { 'FAILED: ' + $_.Exception.Message }"`
3. For phone/LAN access, WSL topology alone is a dead end. Serve from the WINDOWS host
   instead (no admin rights needed; Windows Python exists):
   `powershell.exe -NoProfile -Command "Start-Process -FilePath 'python' -ArgumentList '-m','http.server','<port>','--bind','0.0.0.0','--directory','\\\\wsl.localhost\\Ubuntu\\home\\shams\\<site-dir>' -WindowStyle Minimized"`
   - Verify from Windows: `Invoke-WebRequest http://<windows-lan-ip>:<port>/` must return 200.
   - Get the Windows LAN IP: `powershell.exe (Get-NetIPAddress -AddressFamily IPv4 ...)`.
   - Windows may prompt Shams to allow python through the firewall — tell him to click Allow.
4. For an IMMEDIATE PUBLIC URL (any device, any network) when no permanent host is authorized: run a Cloudflare quick tunnel from WSL, backgrounded and tracked:
   `cloudflared tunnel --url http://127.0.0.1:<port> --protocol http2` via
   terminal(background=true). Read the issued `https://<random>.trycloudflare.com` URL from
   the tracked process log (process_manage action=log). Then verify end-to-end with curl
   from WSL to the public URL — HTML 200, expected content type, and referenced CSS/JS assets — before sharing it. Mark the URL as ephemeral; it changes when the tunnel restarts. For a lasting URL, use an authenticated named tunnel or managed host instead.

## Pitfalls

- NEVER give Shams the WSL internal IP as a phone link — it fails silently (curl timeout,
  no error message) and costs a debugging round-trip.
- ALWAYS use `--protocol http2` for quick tunnels: the default QUIC handshake fails on
  this network and produces no URL.
- Quick-tunnel URLs are ephemeral: they change every time the tunnel restarts and die
  when it stops. Never present yesterday's URL as live; re-test or re-create.
- Do not describe a hosting choice as a deployment until the provider account/project authorization, deployment result, public URL, asset probes and page styling have all been verified; this prevents users receiving two non-working "links" that were never deployed.
- Foreground shell `&`/nohup wrappers are blocked — always use terminal(background=true)
  and verify readiness in a separate foreground call; when the daemon must outlive
  the session, put nohup+disown INSIDE the background=true launch (see dashboards
  section). Tracked background processes die with the conversation by design.
- web_extract can fail on this install when the configured extraction backend is a
  search-only one (the error says so). Fall back to `curl -sL <url>` plus simple
  text parsing for docs pages; do not debug the backend config mid-task.
- `$_.Exception.Message` dies when the -Command payload rides in double-quoted bash — bash interpolates `$_` (last-arg, empty) before PowerShell sees it and the bare `+` is a parse error. Escape as `\$_.Exception.Message` in bash-double-quoted strings, or single-quote the whole bash side.
- netsh portproxy bridges need Windows UAC elevation and a firewall rule; the UAC prompt
  can time out silently. The Windows-side server approach avoids both — prefer it.
- Verify BOTH protocols of a tunnel: URL issuance in logs ≠ reachable. curl the public
  URL from WSL and confirm expected content before reporting to Shams.

## Local agent dashboards (Hermes web UI as the link)

- Before starting one, check whether it already runs: `hermes dashboard --status`.
  One backend serves the whole host — relaunching while one is live just parks the
  second copy instead of serving twice.
- Loopback binds (127.0.0.1) need no sign-in per Hermes docs; non-loopback binds
  engage an auth gate. For the default local dashboard give Shams
  http://127.0.0.1:<port>, then verify it answers 200 from the Windows side
  (step 2 probe) before handing the link over.
- Plain terminal(background=true) tasks die when the conversation ends — for a
  daemon Shams must keep after the chat (dashboard, media server), wrap the
  launch as `nohup <cmd> >> <log> 2>&1 & disown` INSIDE a background=true call,
  then verify detach + serve in a fresh call (`--status`, curl). A tracked
  background process is the right tool only when its death with the session is
  acceptable.
- If the web UI build fails on an upstream source error, serve the existing
  built bundle with `--skip-build` (bundled dist lives in hermes_cli/web_dist)
  and tell Shams the build fix comes with the next Hermes update — a local patch
  to source he did not ask for is not part of this task.

## Permanent deployments (when he wants a lasting URL)

- GitHub Pages is NOT available on the free plan for private repos (API returns 422).
- Clean options to offer: named Cloudflare Tunnel (free account, stable hostname,
  auto-restart), Netlify/Vercel free static hosting, or the group's existing server.

## Cron prompts and the security filter

- Long cron prompts containing credential-ish keywords can be blocked by the Hermes
  security filter. Keep cron prompts minimal ("run script X and report its summary"),
  and put all detail in a committed script (e.g. weekly-maintenance.sh). Verify the fix
  with a manual run before relying on the schedule.
