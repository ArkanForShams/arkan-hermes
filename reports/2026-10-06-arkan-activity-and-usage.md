# ARKAN Activity and Usage Report

**Prepared for:** Shams Tabrez  
**Report date:** October 6, 2026  
**Platform:** Hermes Agent / Telegram / WSL

## 1. Executive summary

The Hermes ecosystem has been expanded from one default agent into a three-agent roster, connected to Telegram, with soul files, skills, memory, and cross-platform export bundles. Security-gated skill and repository work is active. The Hostinger VPS connection remains incomplete because SSH continues to reject the installed key, and the newly referenced `Arkan_WebApp_bot` is not connected to the current local Hermes gateway.

## 2. Completed tasks

### Hermes agents and souls

- Created and verified the three-agent roster:
  - **ARKAN** — default strategist and executive advisor.
  - **Hakim** — Business Architect and Strategist.
  - **Basir** — Analyst and Researcher.
- Created independent Hermes profiles for Hakim and Basir.
- Created separate SOUL.md files for Hakim and Basir.
- Smoke-tested Hakim successfully; he responded in his Business Architect identity.
- Cloned the appropriate user context and skills into the profiles while keeping sessions and cron schedules isolated.

### Telegram

- Connected Hakim's Telegram bot: `8850440193`.
- Connected Basir's Telegram bot: `8795413379`.
- Configured the allowed human user ID as `8812850993`.
- Confirmed the existing Telegram gateway and group routing are working for established chats and topics.
- Created and organized Telegram forum topics and pinned directories for existing groups.

### Cross-platform ARKAN exports

Created verified bundles with no credentials or payment details:

- Claude Code bundle: `~/arkan-claude-bundle.zip`
  - ARKAN `CLAUDE.md`.
  - Shams user portrait and rules.
  - Hakim and Basir Claude subagents.
  - 51 custom skills.
- ChatGPT bundle: `~/arkan-chatgpt-bundle.zip`
  - Three Custom GPT instruction sets.
  - ARKAN full soul and Shams user portrait.
  - Consolidated skill knowledge packs.
- Claude Desktop bundle: `~/arkan-desktop-bundle.zip`
  - Three Claude Projects: ARKAN, Hakim, and Basir.
  - Project instructions and knowledge files.

### Skills and security

- Built and maintained the custom skill library across governance, wealth, PMO, engineering, leadership, and AI engineering.
- Installed and security-gated the Agent Reach skill after manual triage of scanner findings.
- Established the three-scanner security gate workflow: MEDUSA, SkillSpector, and Bumblebee.
- Validated the requested GitHub repositories for existence, ownership, activity, and basic suspicious-pattern signals.
- Started deeper MEDUSA scans for the requested repository list; large repositories require extended scan time.
- Confirmed that several alarming scanner findings were false positives caused by defensive security code, documentation, or ML/agent pattern matching.

### Memory and operations

- Maintained the seven-layer memory and knowledge workflow.
- Saved important operating procedures into Hermes skills.
- Created Telegram topic taxonomy and deployment procedures.
- Added lessons for Telegram token handling, profile isolation, bot allowlists, and security-gate triage.

## 3. Current subscription and credential state

### Ollama Cloud

- **Configured:** Yes.
- **Current model:** `glm-5.3-flash` in the Hermes credential pool.
- **Usage period reported by Ollama:** September 14, 2026 through October 6, 2026 UTC.
- **Reported usage ratio:** `0.502` — approximately 50.2% used if the provider's ratio is normalized to 1.000.
- **Estimated remaining:** approximately 49.8%.
- **Requests:** 6,555.
- **Reported cost:** `$0.00`.
- **Exact input/output token count:** Not exposed by the usage endpoint, so exact tokens consumed and remaining cannot be stated honestly.

### OpenAI / ChatGPT

- **Configured access:** OpenAI Codex OAuth using ChatGPT authentication.
- **API key:** None found locally.
- **Remaining subscription quota:** Not readable from this Hermes machine.
- **Exact token usage:** Not available locally.

### OpenRouter

- **API key:** Not configured.
- **Usage:** None available.

### Other configured credentials

- GitHub token.
- Telegram bot tokens.
- Embedding API key.
- Vicsee API key.
- Icarus/memory credentials.

Their provider quotas were not available from the inspected local endpoints.

## 4. Pending tasks and blockers

### Hostinger VPS

- Hermes dashboard was found running at `187.127.167.84:32772`.
- Ubuntu/OpenSSH was reachable.
- SSH key authentication is still rejected by the VPS.
- Root password was not shared in chat.
- VPS user, hardening, VPS Hermes soul, and `st_arkan_bot` deployment are not yet verified complete.

### `Arkan_WebApp_bot`

- A test mention was logged in the existing ARKAN private chat, not as a message from the target group.
- The current local gateway has no connected profile record for `Arkan_WebApp_bot`.
- The bot needs its token configured on the intended Hermes host, its Telegram Group Privacy setting disabled or the bot explicitly mentioned, and a fresh group test.

### Repository validation

- Identity checks completed for all 12 requested repositories.
- Initial forensic checks completed for smaller repositories.
- Deep MEDUSA scans were started for the full list and require final report collection and manual triage before any installation decision.

## 5. Important usage limitation

The phrase "tokens consumed" can refer to either:

1. **API/model tokens** — prompt and completion tokens. Exact counts are not available from the Ollama usage endpoint or the local Codex OAuth record.
2. **Provider usage/quota** — Ollama reports a usage ratio and request count, currently approximately 50.2% used and 6,555 requests.

This report uses the second category where available and does not invent an exact token total.

## 6. Recommended next actions

1. Finish the VPS SSH-key verification before installing or modifying anything remotely.
2. Configure `Arkan_WebApp_bot` on the correct Hermes host and confirm a `telegram connected` log entry.
3. Collect and manually triage the completed MEDUSA reports before cloning or installing repository skills.
4. Review Ollama usage again before running the VPS and local gateways concurrently.
5. Obtain usage details directly from the ChatGPT/Codex account dashboard if exact OpenAI subscription consumption is required.
