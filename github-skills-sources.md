# GitHub Repos Behind ARKAN's Skills — Verified 2026-10-02

Source: scan of all 158 SKILL.md files in ~/.hermes/skills + GitHub API verification (18/18 resolve; 2 had moved — new homes noted).

## Core platform
- https://github.com/NousResearch/hermes-agent — the platform itself (★250k, MIT). Source of the hermes-agent skill + google-workspace wiring.
- https://github.com/ClaudioDrews/memory-os — the seven-layer Memory OS (memory-os-ops skill; deployed via Docker).
- https://github.com/ArkanForShams/arkan-hermes — Shams's master archive: skills/, SOUL.md, USER.md, wiki, cron, scripts, security reports.

## Security gate (3-scanner)
- https://github.com/Pantheon-Security/medusa (repo scanner, AGPL-3.0)
- https://github.com/perplexityai/bumblebee (scanner)
- https://github.com/NVIDIA/SkillSpector (skill-level scanner, Apache-2.0)

## Research & knowledge
- https://github.com/Panniantong/Agent-Reach — 16-platform research router (installed as adapted knowledge-only skill).
- https://github.com/atomicstrata/llm-wiki-compiler — llm-wiki (moved from atomicmemory org; incl. Karpathy gist 442a6bf555914893e9891c11519de94f as reference).

## Creative & design
- https://github.com/blader/humanizer — humanizer.
- https://github.com/JimLiu/baoyu-skills — baoyu-infographic.
- https://github.com/Cocoon-AI/architecture-diagram-generator — architecture-diagram.

## Development & delegation
- https://github.com/openai/codex — codex CLI delegation.
- https://github.com/gsd-build/get-shit-done — spike skill base.
- https://github.com/trycua/cua — computer-use driver.

## Media, email, social
- https://github.com/openclaw/songsee — audio analysis (moved from steipete).
- https://github.com/pimalaya/himalaya — terminal email.
- https://github.com/xdevplatform/xurl — X/Twitter CLI (+ https://github.com/openclaw/openclaw ecosystem reference).

## Upgrade lineage for NF ARKAN
- https://github.com/<NF-org>/NFARKAN — Shams's second agent build (create this; clone from ArkanForShams/arkan-hermes skills/ + new SOUL.md).

## Daily batch — 2026-10-05 (gated + triaged, see security/reports + *-triage/TRIAGE-VERDICT.md)
- https://github.com/github/spec-kit — spec-driven dev toolkit (MIT, ★140k). Cloned ~/hermes-workspace/speckit; CLI installed: specify 1.0.13 (uv tool). Medusa 2669 findings → all FPs (prompt-kit/test-noise class; src triaged line-by-line).
- https://github.com/GorvGoyl/Clone-Wars — 100+ site clones list (MIT). Cloned ~/website-arsenal/clone-wars. Medusa clean: score 100.
- https://github.com/NangoHQ/nango — 1000+ API integration platform (Elastic License 2.0). Cloned ~/hermes-workspace/security/nango-triage/nango (source-reference only; .agents/skills = DO_NOT_INSTALL, never load). CLI installed: nango 0.71.12 (npm nango; @nangohq/cli name unpublished). Medusa 44 findings → all FPs (test fixtures + docs).

Export bundles on disk: ~/arkan-claude-bundle/ (folder), ~/arkan-chatgpt-bundle(.zip), ~/arkan-desktop-bundle(.zip). Secrets never shipped — verify before redistributing.