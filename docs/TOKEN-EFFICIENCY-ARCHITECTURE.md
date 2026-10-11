# ARKAN Token-Efficiency Architecture

**Implemented:** October 7, 2026  
**Owner:** Shams Tabrez / ARKAN

## Objective

Reduce token consumption without reducing factual accuracy, completeness, safety, or decision quality.

## Baseline observed

From the last seven days of Hermes usage:

- 18.3M input tokens vs 2.1M output tokens.
- Input/output ratio: approximately 8.6:1.
- `daily-system-review`: approximately 876k prompt tokens per run.
- `arkan-hermes-weekly-backup`: approximately 1.69M prompt tokens per run.

The primary waste was repeated context collection by an LLM. Deterministic scripts can collect the same evidence at zero model-token cost.

## Implemented controls

### 1. Deterministic evidence collection

`~/.hermes/scripts/collect_daily_review.sh`

- Collects Docker health, disk, memory, load, token audit totals, wiki count, backup marker, and recent session activity.
- Writes `/home/shams/.hermes/cron/output/daily-input-latest.json`.
- Produces a compact digest.
- Tested live and validated as JSON.

### 2. Daily review routing

Cron job `e6b72655589b` now:

- Runs the collector first.
- Sends only the compact evidence file to the model.
- Uses `glm-5.3-flash` on Ollama Cloud for bounded synthesis.
- Must not rescan the workspace or session history unless the evidence shows an anomaly.
- Keeps the existing under-300-word output contract.

### 3. Deterministic weekly backup

`~/.hermes/scripts/weekly_backup_noagent.sh`

Cron job `a8b9f2c384f2` now runs in no-agent mode and:

- Executes the proven backup sync script.
- Verifies local and remote commit hashes.
- Runs the full workspace/history gitleaks scan with the filtered config.
- Runs the filtered `~/.hermes` scan.
- Writes a compact Telegram-ready report.

No LLM context is used for routine backup work.

### 4. Model aliases

Configured through Hermes, not by hand-editing YAML:

- `plan` → `ollama-cloud/glm-5.3-flash`
- `work` → `ollama-cloud/deepseek-v4.1-flash`
- `deep` → `openai-codex/gpt-5.6-luna`

The global default remains OpenAI Codex `gpt-5.6-luna`.

## Routing policy

- **Deterministic scripts first:** collection, validation, checksums, status, backups, scans, and transformations.
- **Work model:** bounded, reversible, low-risk execution and routine synthesis.
- **Plan model:** decomposition, prioritization, prompt compression, and first-pass analysis.
- **Deep model:** architecture, security exceptions, high-stakes finance/family/faith/reputation decisions, final review, and ambiguous work.
- **Escalate upward:** if the lower-cost model reports uncertainty, contradicts evidence, fails schema validation, or reaches a risk boundary.

Lower cost never overrides an approval gate or quality requirement.

## Prompt quality controls

Skill installed: `quality-token-lexicon`.

It preserves objective, facts, constraints, acceptance criteria, uncertainty, safety boundaries, and output contracts while removing repetition and vague padding. It includes multimodal vocabulary for material realism, lighting, camera, composition, anatomy, product geometry, and artifact prevention.

The phrase `AI synthetic` is treated as a user heuristic to evaluate experimentally, not as a guaranteed universal modifier.

## Not changed deliberately

- Global default model.
- Compression thresholds and protected context settings.
- High-stakes workflows.
- Human approval requirements.
- The Hermes update, because the current installation reports an unfinished update 371 commits behind and updating would restart the gateway.

## Verification criteria

1. Daily collector exits successfully and emits valid JSON.
2. Daily cron points to the collector and bounded synthesis prompt.
3. Weekly backup is no-agent and points to the deterministic script.
4. Aliases resolve to the intended provider/model pairs.
5. No quality-sensitive context is removed without regression evidence.
6. Actual token usage is compared after at least three daily-review runs and one weekly-backup run.
