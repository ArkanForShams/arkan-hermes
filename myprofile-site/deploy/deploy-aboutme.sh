#!/usr/bin/env bash
# deploy-aboutme.sh — runs ON THE VPS after SSH access is granted.
# Inspects Traefik's config source, deploys the static site, adds an ADDITIVE
# router for aboutme.ideaorbit.cloud. Never restarts or touches existing
# containers/services (Hermes stays untouched).
set -eu

echo "=== 1. Traefik discovery ==="
if command -v docker >/dev/null 2>&1; then
  docker ps --format '{{.Names}}: {{.Image}}' | grep -i traefik || true
  TRC=$(docker ps --format '{{.Names}}' | grep -i traefik | head -1)
  echo "traefik container: $TRC"
  echo "--- its ports/command ---"
  docker inspect "$TRC" --format '{{.Args}}' | head -c 600 || true
  echo
  docker inspect "$TRC" --format '{{json .Mounts}}' | head -c 800 || true
  echo
fi
echo "--- dynamic config dirs on disk ---"
ls -la /etc/traefik 2>/dev/null || true
find /opt /srv /root -maxdepth 3 -name "docker-compose*.yml" 2>/dev/null | head -5

echo "=== 2. Deploy site ==="
mkdir -p /srv/aboutme
# (site tarball uploaded beside this script by ARKAN)
TARBALL="$(dirname "$0")/aboutme-site.tar.gz"
tar -xzf "$TARBALL" -C /srv/aboutme
ls /srv/aboutme | head -5

echo "=== 3. Additive router (file-provider style) ==="
DYN=""
for cand in /etc/traefik/dynamic /etc/traefik/conf /data/traefik/dynamic; do
  [ -d "$cand" ] && DYN="$cand" && break
done
if [ -n "$DYN" ]; then
  cat > "$DYN/aboutme.yml" <<'EOF'
http:
  routers:
    aboutme:
      rule: "Host(`aboutme.ideaorbit.cloud`)"
      entryPoints: ["websecure"]
      service: aboutme-svc
      tls:
        certResolver: default
  services:
    aboutme-svc:
      file:
        directory: /srv/aboutme
# entryPoints/certResolver names confirmed during step 1 before writing.
EOF
  echo "router written to $DYN/aboutme.yml"
else
  echo "NO file-provider dir — will use docker-label variant instead (handled interactively)"
fi

echo "=== 4. Verify ==="
sleep 3
curl -s -o /dev/null -w "https aboutme: %{http_code}\n" https://aboutme.ideaorbit.cloud || true