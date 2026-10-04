#!/usr/bin/env bash
# deploy-vps-manual.sh — SSH-LESS deploy of aboutme.ideaorbit.cloud. Run on the VPS HOST shell.
# Self-guarding: aborts politely if accidentally run inside a container.
set -u

echo "=== SSH-LESS DEPLOY: aboutme.ideaorbit.cloud ==="
echo "step 0: environment check"
if [ -f /.dockerenv ]; then
  echo "ABORT: you are INSIDE the hermes container. First type:  exit   ...then re-run this script."
  exit 1
fi
command -v docker >/dev/null 2>&1 || { echo "ABORT: docker not found on host"; exit 1; }
echo "host: $(hostname) | user: $(whoami)"

echo "step 1: fetch package (from the preview tunnel)"
BASE="https://stolen-size-society-ours.trycloudflare.com"
if command -v curl >/dev/null 2>&1; then
  curl -fsSL --max-time 120 "$BASE/aboutme-site.tar.gz" -o /tmp/aboutme-site.tar.gz || { echo "ABORT: download failed"; exit 1; }
elif command -v wget >/dev/null 2>&1; then
  wget -q -T 120 "$BASE/aboutme-site.tar.gz" -O /tmp/aboutme-site.tar.gz || { echo "ABORT: download failed"; exit 1; }
else
  echo "ABORT: neither curl nor wget present"; exit 1
fi
EXPECT="e0f34f534d17a4c6b0ecfd99da3e56da0fcbd2ef7b98df3c2d139e9f4c88ea36"
GOT=$(sha256sum /tmp/aboutme-site.tar.gz | awk '{print $1}')
if [ "$GOT" != "$EXPECT" ]; then echo "ABORT: checksum mismatch (got $GOT)"; exit 1; fi
echo "checksum OK ($GOT)"

echo "step 2: unpack site"
mkdir -p /srv/aboutme
tar -xzf /tmp/aboutme-site.tar.gz -C /srv/aboutme
echo "serving files:"; ls -la /srv/aboutme

echo "step 3: discover Traefik"
TRC=$(docker ps --format '{{.Names}}' 2>/dev/null | grep -i traefik | head -1)
if [ -n "$TRC" ]; then
  echo "traefik container: $TRC"
  echo "-- args (entrypoints/resolvers) --"
  docker inspect "$TRC" --format '{{range .Args}}{{println .}}{{end}}' | grep -E "entrypoints|certificatesresolvers" | head -8
  echo "-- networks --"
  docker inspect "$TRC" --format '{{range $k,$v := .NetworkSettings.Networks}}{{$k}} {{end}}'
  echo "-- mounts (looking for dynamic-config dir) --"
  docker inspect "$TRC" --format '{{range .Mounts}}{{.Source}} -> {{.Destination}}{{println}}{{end}}'
  EP=$(docker inspect "$TRC" --format '{{range .Args}}{{println .}}{{end}}' | grep -oE "entrypoints\.[a-z0-9]+" | head -4)
  RESNAME=$(docker inspect "$TRC" --format '{{range .Args}}{{println .}}{{end}}' | grep -oE "certificatesresolvers\.[a-z0-9]+" | head -1 | cut -d. -f2)
  NET=$(docker inspect "$TRC" --format '{{range $k,$v := .NetworkSettings.Networks}}{{$k}} {{end}}' | awk '{print $1}')
  echo "entrypoints: $EP | resolver: $RESNAME | network: $NET"
  WEBSECP=""
  for e in $EP; do case "$e" in *443*|*secure*) WEBSECP=$(echo "$e" | cut -d. -f2);; esac; done
  [ -z "$WEBSECP" ] && WEBSECP=$(echo "$EP" | awk '{print $1}' | cut -d. -f2)
  echo "websecure entrypoint chosen: '$WEBSECP'"

  case "$WEBSECP" in
    ""|"web") echo "NOTE: defaulting to 'websecure' if empty"; WEBSECP="websecure";;
  esac

  echo "step 4: launch auxiliary nginx container (additive; no existing container touched)"
  docker rm -f aboutme-web >/dev/null 2>&1 || true
  LABELS="--label traefik.enable=true"
  LABELS="$LABELS --label traefik.http.routers.aboutme.rule=Host(\`aboutme.ideaorbit.cloud\`)"
  LABELS="$LABELS --label traefik.http.routers.aboutme.entrypoints=$WEBSECP"
  LABELS="$LABELS --label traefik.http.routers.aboutme.service=aboutme-svc"
  LABELS="$LABELS --label traefik.http.services.aboutme-svc.loadbalancer.server.port=80"
  if [ -n "$RESNAME" ]; then
    LABELS="$LABELS --label traefik.http.routers.aboutme.tls.certresolver=$RESNAME"
  else
    echo "WARN: no certresolver found in traefik args — TLS may need manual wiring; reporting for review"
    LABELS="$LABELS --label traefik.http.routers.aboutme.tls=true"
  fi
  docker run -d --name aboutme-web --restart unless-stopped \
    --network "$NET" -v /srv/aboutme:/usr/share/nginx/html:ro \
    $LABELS nginx:alpine
  echo "auxiliary container 'aboutme-web' is up (separate from hermes stack)"
else
  echo "no docker traefik found — checking binary-style install"
  ls /etc/traefik 2>/dev/null || { echo "ABORT: neither docker traefik nor /etc/traefik found — send this output to ARKAN"; exit 1; }
  DYN=""
  for cand in /etc/traefik/dynamic /etc/traefik/conf.d /etc/traefik/conf; do
    [ -d "$cand" ] && DYN="$cand" && break
  done
  [ -z "$DYN" ] && DYN="/etc/traefik/dynamic" && mkdir -p "$DYN"
  cat > "$DYN/aboutme.yml" <<'YMLEOF'
http:
  routers:
    aboutme:
      rule: "Host(`aboutme.ideaorbit.cloud`)"
      entryPoints: ["websecure"]
      service: aboutme-svc
      tls: {}
  services:
    aboutme-svc:
      file:
        directory: /srv/aboutme
YMLEOF
  echo "file-provider router written: $DYN/aboutme.yml"
fi

echo "step 5: verification"
sleep 4
CODE=$(curl -sk -o /dev/null -w "%{http_code}" --max-time 20 https://aboutme.ideaorbit.cloud/ || echo "ERR")
echo "https://aboutme.ideaorbit.cloud -> HTTP $CODE"
echo "=== DEPLOY SCRIPT FINISHED — copy ALL output above to ARKAN ==="