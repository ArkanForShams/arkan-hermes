# Bot API quick reference — literal-safe call patterns

Condensed, cron-safe (fully literal, no pipes into python) call patterns for the endpoints this work needs. Base: `API=https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN` sourced from `~/.hermes/.env`. DNS pin everywhere: `--resolve api.telegram.org:443:149.154.167.220`.

## Probes

```bash
# Bot identity (id = digits before ':' in token)
curl -s --max-time 20 "$API/getMe"

# Chat state: is_forum / type are the fields that decide deployability
curl -s --max-time 20 "$API/getChat" -d "chat_id=<CHAT_ID>"

# Bot's membership in a chat: status / can_manage_topics
# 'status: left' = bot must be re-added; no topics until it is
curl -s --max-time 20 "$API/getChatMember" \
  -d "chat_id=<CHAT_ID>" -d "user_id=<BOT_ID>"
```

Literal-status checks from saved files (cron-safe):

```bash
curl ... "$API/getChatMember" ... -o /home/shams/.hermes/cache/scratch/cin_rights.json
grep -c '"can_manage_topics": *true' /home/shams/.hermes/cache/scratch/cin_rights.json
curl ... "$API/getChat" ... -o /home/shams/.hermes/cache/scratch/chat.json
grep -c '"is_forum": *true' /home/shams/.hermes/cache/scratch/chat.json
```

## Mutations

curl -d for typed params, `--data-urlencode` for free text:

```bash
# Create topic -> parse thread id from response
curl -s --max-time 20 "$API/createForumTopic" -d "chat_id=<CHAT_ID>" \
  --data-urlencode "name=<topic name>" -d "icon_color=<palette value>"

# Thread id extraction WITHOUT python:
tid=$(echo "$r" | sed -n 's/.*"message_thread_id":\([0-9]*\).*/\1/p')

# Description (plain text; no parse_mode; NO html entities)
curl ... "$API/editForumTopicInfo" -d "chat_id=<CHAT_ID>" \
  -d "message_thread_id=$tid" --data-urlencode "description=<desc>"

# Post a description into a topic — plain text, so OMIT parse_mode entirely
# (a JSON null parse_mode 400s 'unsupported parse_mode'; the form-data HTML call below is fine)
curl ... "$API/sendMessage" -d "chat_id=<CHAT_ID>" \
  -d "message_thread_id=<TID>" --data-urlencode "text=📌 <topic description>"

# Pin the topic's description message
curl ... "$API/pinChatMessage" -d "chat_id=<CHAT_ID>" -d "message_id=$pid"

# Cleanup (removes a topic cleanly)
curl ... "$API/deleteForumTopic" -d "chat_id=<CHAT_ID>" -d "message_thread_id=$tid"

# Notify Shams's home DM from a watcher
curl ... "$API/sendMessage" \
  -d "chat_id=8812850993" --data-urlencode "text=<msg>" -d "parse_mode=HTML"
```

## icon_color palette

Documented values: `7322096` `16766590` `13338331` `9237968` `9444819` `16372466`. The API accepts undocumented ones too (9367192, 7325668, 16761727 observed OK) — fine for visual distinction; fall back to the documented six when guaranteed support matters more than variety. Do NOT pass `icon_custom_emoji_id` unless you have a real emoji id — an empty value 400s the call.

## Common refusals

- `not enough rights to create a topic` — bot lacks can_manage_topics; owner must grant (group name > Administrators > bot > Manage Topics).
- `can't promote self` — bots cannot grant themselves rights; a bot with can_promote_members is refused all the same.
- `type: group` in getChat — basic group; Shams flips Topics ON (Edit > Topics), which converts to supergroup automatically.
- No `getMessages` for bots — you cannot read messages back to verify; treat the create/send response body (`message_thread_id`, `message_id`) as the verification artifact.
- `unsupported parse_mode` — a null/none parse_mode was sent; omit the field entirely for plain text.
