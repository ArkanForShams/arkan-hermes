# Token-Efficiency Baseline — 2026-10-07

## Observed baseline

- 7-day model usage: 18,342,848 input tokens; 2,130,696 output tokens.
- Input/output ratio: approximately 8.6:1.
- Daily system review: 7,883,359 prompt tokens over 9 runs; approximately 875,928 per run.
- Weekly backup: 3,379,595 prompt tokens over 2 runs; approximately 1,689,797 per run.
- Daily collector observed on 2026-10-07: 751,924 prompt tokens and 20,481 completion tokens for the prior day.

## Changes implemented

- Added deterministic daily evidence collector: `~/.hermes/scripts/collect_daily_review.sh`.
- Daily review cron `e6b72655589b` now uses the collector and bounded `glm-5.3-flash` / `ollama-cloud` synthesis.
- Added deterministic backup runner: `~/.hermes/scripts/weekly_backup_noagent.sh`.
- Weekly backup cron `a8b9f2c384f2` now runs no-agent with full workspace/history and filtered Hermes gitleaks scans.
- Added aliases:
  - `plan` = `ollama-cloud/glm-5.3-flash`
  - `work` = `ollama-cloud/deepseek-v4.1-flash`
  - `deep` = `openai-codex/gpt-5.6-luna`
- Global default remains `gpt-5.6-luna` / `openai-codex`.
- Added and lint-corrected skill: `quality-token-lexicon`.

## Live verification

- Both shell scripts pass `bash -n`.
- Daily collector runs successfully and emits valid JSON.
- Model aliases resolve in Hermes.
- Ollama Cloud smoke test returned exactly `ROUTER_SMOKE_OK` using `glm-5.3-flash`.

## Quality measurement plan

After three daily-review runs and the next weekly backup, compare:

1. Prompt and completion tokens.
2. Report completeness against the existing five-section format.
3. Factual accuracy against collector evidence.
4. Missing-data and anomaly detection.
5. False-positive or hallucination rate.

If quality drops, route synthesis to `deep` without changing the deterministic collector.
