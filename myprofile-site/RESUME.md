# RESUME CARD — aboutme.ideaorbit.cloud deploy (paused 2026-10-04)

## State at pause
- Site: BUILT + QA'd (2 visual passes, boardroom-ready) at ~/hermes-workspace/myprofile-site/site/
- Domain: aboutme.ideaorbit.cloud — DNS → 187.127.167.84 ✅ (Traefik answers 404 = router missing)
- VPS: 187.127.167.84 (Hostinger). Hermes runs INSIDE docker container hermes-agent-oluq-hermes-agent-1
  (2f8d70f27459) — browser terminal opens INSIDE it; type `exit` to reach HOST shell.
- SSH: NOT working (key offered, refused 3×).authorized_keys edits may sit in /opt/data (container) — inert.
- Deploy kit: READY, checksummed (e0f34f53…), self-guarding script staged.

## To resume (one-liner for Shams to paste on VPS HOST shell)
bash <(curl -fsSL https://<TUNNEL-URL>/deploy-vps-manual.sh)

## Resume checklist (ARKAN)
1. Restart local preview server (port 8412) + NEW cloudflared tunnel (quick tunnels are ephemeral!)
   → refresh /srv tarball + deploy script availability at the new URL
2. Give Shams the one-liner WITH THE NEW tunnel URL
3. On script output OK: verify https + cert, show Shams for final review
4. Only after review: announce/publish the link anywhere
5. Outstanding assets: VICSEE photos, university logos (JNTUH ×2, SSSUTMS), degree years
6. Telegram topics watcher (f6113a320ea1) still armed; toggles may have landed meanwhile — check on resume

## Revert (if ever needed)
docker rm -f aboutme-web && rm -rf /srv/aboutme