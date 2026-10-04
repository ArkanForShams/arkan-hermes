#!/usr/bin/env bash
# Deploy the topic taxonomy into one forum-enabled Telegram group.
# Usage: bash tg_topic_deploy.sh <chat_id>      (deploys, records OK lines per topic)
#        DRY=1 bash tg_topic_deploy.sh <chat_id> (plan preview, no API calls)
# Prereqs: group is forum (getChat is_forum:true) AND bot has can_manage_topics.
# Resumable: per-chat results file skips topics already OK — partial failures never duplicate.
set -u
source /home/shams/.hermes/.env 2>/dev/null
TGIP="149.154.167.220"
API="https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN"
res_args=(--resolve "api.telegram.org:443:$TGIP")
CID="${1:?usage: tg_topic_deploy.sh <chat_id>}"
DRY="${DRY:-0}"

OUT="/home/shams/.hermes/cache/scratch/deployed_topics_${CID}.txt"
touch "$OUT"

# Telegram-documented icon_color palette (6 valid values)
COLORS=(7322096 16766590 13338331 9237968 9444819 16372466)

# title | description | color-index   (edit the taxonomy here; keep ~10 topics)
TOPICS=(
"💼 CTO/CAIO Career Path|Executive coaching: presentations, meeting prep, difficult conversations, monthly strategic reviews.|0"
"🏗️ AI Department & Agents|Agent roster and orchestration: ARKAN + hakim (Business Architect) + basir (Analyst). New agents, souls, delegation patterns.|1"
"🧠 Memory OS & Knowledge|Seven-layer memory: wiki, fabric, Qdrant, fact store, sessions. Ingestion, extraction hooks, dedup, decay.|2"
"🦸 Skills Library|151-skill library, 50 custom verified. New skill requests, review gates, backlog.|3"
"🌐 Websites & Presence|arkan-hermes live site, hosting, publish queue, LinkedIn/GitHub identity, ad-hoc builds.|4"
"💰 Wealth & Shariah|Halal planning, screening, basket watch, independence roadmap, scholar referrals.|5"
"🎨 Missions & Design|Landing pages (KINETIQ, MERIDIAN), decks, design language, creative explorations.|0"
"🚗 Cinematic Builds|Deepal launch site: repo ~/deepal-launch; keyframes, Veo cards, scrollytelling.|2"
"🔧 System Ops|Gateway, cron roster, backups, restarts, network quirks, daily system reviews.|3"
"📥 New Topics|Inbox: anything new starts here; promoted to its own thread when it earns one.|4"
)

created=0; skipped=0; failed=0
i=0
for row in "${TOPICS[@]}"; do
  i=$((i+1))
  title="${row%%|*}"; rest="${row#*|}"; desc="${rest%%|*}"; ci="${rest##*|}"
  color="${COLORS[$ci]}"
  # resume guard: success lines only — a FAIL must never block retry
  if grep '^OK' "$OUT" 2>/dev/null | grep -qF "| $title"; then
    skipped=$((skipped+1)); continue
  fi
  if [ "$DRY" = "1" ]; then
    echo "DRY [$i] color=$color -> $title"
    created=$((created+1)); continue
  fi
  r=$(curl -s --max-time 20 "${res_args[@]}" "$API/createForumTopic" \
    -d "chat_id=$CID" \
    --data-urlencode "name=$title" \
    -d "icon_color=$color")
  tid=$(echo "$r" | sed -n 's/.*"message_thread_id":\([0-9]*\).*/\1/p')
  if [ -n "$tid" ]; then
    curl -s --max-time 20 "${res_args[@]}" "$API/editForumTopicInfo" \
      -d "chat_id=$CID" -d "message_thread_id=$tid" \
      --data-urlencode "description=$desc" > /dev/null
    echo "OK [$i] tid=$tid | $title" >> "$OUT"
    created=$((created+1))
    sleep 0.4
  else
    echo "FAIL [$i] | $title :: $(echo "$r" | head -c 120)" >> "$OUT"
    failed=$((failed+1))
  fi
done
echo "RESULT $CID: created=$created skipped=$skipped failed=$failed"
[ "$DRY" = "1" ] || cat "$OUT"
[ "$failed" -eq 0 ] || exit 1
exit 0
