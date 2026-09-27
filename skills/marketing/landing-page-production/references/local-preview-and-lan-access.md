# Local preview & LAN access (WSL2 host)

How to give the user working preview links for a static site from this WSL2 machine, and where each option stops.

## Procedure

1. **Serve inside WSL for the PC**: `terminal(background=true)`: `python3 -m http.server 8472 --bind 0.0.0.0` with workdir = site dir. Foreground `&` servers die when the tool call returns — always use background=true for servers. PC link: `http://localhost:8472/<page>.html`.
2. **For phone / other LAN devices**, WSL's own IP (`hostname -I`, 172.x.x.x) is unreachable — WSL2 sits behind a virtual NAT. Working option (no admin rights needed):
   - Windows has Python: launch the server on the Windows side pointing at the WSL folder:
     ```
     powershell.exe -NoProfile -Command "Start-Process -FilePath 'python' -ArgumentList '-m','http.server','8473','--bind','0.0.0.0','--directory','\\\\wsl.localhost\\<distro>\\home\\shams\\<site-dir>' -WindowStyle Minimized"
     ```
   - Verify BOTH from the Windows side before handing over links: `powershell.exe Invoke-WebRequest http://localhost:8473/...` AND `http://<windows-lan-ip>:8473/...` — both must return 200.
   - Windows LAN IP: `powershell (Get-NetIPAddress -AddressFamily IPv4 | ? {$_.InterfaceAlias -notmatch 'vEthernet|Loopback' -and $_.IPAddress -notlike '169.*'}).IPAddress`. DHCP-assigned — re-check whenever the link 'stops working'.
   - First phone load may require the user to click **Allow** on the Windows firewall prompt for Python.
3. **Admin bridge (portproxy)** — `netsh interface portproxy add v4tov4` + firewall rule via elevated PowerShell — only in an interactive session where the user can approve the UAC popup; with no user present the approval times out and the command is blocked. Prefer option 2.
4. **Public URL — Cloudflare quick tunnel (instant, no account, works from any device worldwide)**:
   - Prereq: serve the site inside WSL (option 1), and `cloudflared` at `~/.local/bin/cloudflared`.
   - Start with `terminal(background=true, notify=['trycloudflare.com'])`: `cloudflared tunnel --url http://localhost:8472 --protocol http2` — a foreground call with `nohup … &` is refused by the tool wrapper; background=true is the only way.
   - ALWAYS pass `--protocol http2` — the default QUIC transport fails to register in this environment while http2 connects and registers cleanly.
   - Get the issued URL — the `https://<random>.trycloudflare.com` line appears ~10 s in. Most reliable: append `> /tmp/cloudflared-site.log 2>&1` INSIDE the background command, then `grep -oE "https://[a-z0-9-]+\.trycloudflare\.com" /tmp/cloudflared-site.log | head -1` (session logs can truncate; the file always carries it).
   - Verify END-TO-END through the edge, not just tunnel registration: `curl -s -o /dev/null -w "%{http_code}" --max-time 25 https://<url>/<page>.html` for EVERY page plus css/js/logo assets. A registered tunnel with a dead origin still serves errors — the per-page 200s are the proof users will get the page.
   - Kill stale tunnels from earlier sessions first: list with `pgrep -af cloudflared` (tunnels from OTHER sites may still run on other ports), kill the recorded PID. `kill $(pgrep -f "cloudflared tunnel")` can self-terminate the calling shell (exit -15) and triggers an approval prompt — prefer the exact PID.
   - Every tunnel restart (process death, network hiccup, PC event) issues a NEW random URL — the old link starts returning HTTP 530. After any restart: re-grep the log, re-verify EVERY page end-to-end through the edge, and proactively tell the user the link changed. 530 = tunnel down/dead origin; per-page 200 is the only proof.
   - Honest limits to state to the user: random unshareable name, no uptime guarantee, dies with the process or PC. Permanent options: named Cloudflare tunnel (free account, stable name, auto-restart) or Netlify/Vercel hosting.
   - GitHub Pages needs a PUBLIC repo on the free plan (private repo → 422 'plan does not support Pages'); the private archive repo can't host.

## Verify every page (no browser stack needed)

```python
from html.parser import HTMLParser
import glob
class Check(HTMLParser):
    def __init__(self):
        super().__init__(); self.stack=[]; self.errors=[]
        self.void={'meta','link','br','hr','img','input','source','path','circle','rect','stop'}
    def handle_starttag(self,tag,attrs):
        if tag not in self.void: self.stack.append(tag)
    def handle_endtag(self,tag):
        if tag in self.void: return
        if self.stack and self.stack[-1]==tag: self.stack.pop()
        else: self.errors.append(tag)
for f in sorted(glob.glob('*.html')):
    c=Check(); c.feed(open(f).read())
    print(f, 'OK' if not c.stack and not c.errors else f'UNCLOSED:{c.stack} ERR:{c.errors[:3]}')
```
Plus `curl -s -o /dev/null -w "%{http_code}"` per page against the running server. Run the full visual QA gate (`references/headless-visual-qa.md`) whenever the browser stack is actually up — structural checks are the fallback, not a substitute.

## Pitfalls

- A link that works on the PC but not the phone is almost always the WSL IP — don't debug the server first; check which IP is in the link.
- WSL IP and Windows LAN IP both drift (WSL restart / DHCP) — re-verify IPs before reusing any previous-session link.
- Killing servers: see the pkill self-kill pitfall in SKILL.md.