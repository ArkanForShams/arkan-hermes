---
name: repo-batch-validation
description: "Use when several GitHub repos need vetting for trust."
version: 1.0.0
created_by: agent
---

# Repo Batch Validation (ARKAN)

Proven workflow for validating a LIST of GitHub repos in one request. The security-gate skill governs WHEN and the scanner mechanics; this adds the batch orchestration layer.

## Procedure

1. **Identity pass first** — free, no clone: GET `api.github.com/repos/<owner>/<slug>` per repo (Accept: application/vnd.github+json; User-Agent header required). Capture: existence (404 = renamed/gone — say so, never guess a replacement), stars, last-push age, size, default branch. Deliver this table BEFORE any scanning claim.
2. **Check prior verdicts** — `~/hermes-workspace/security/reports/` (medusa-scan-*, skillscan-*). A repo already triaged recently is reported from its stored verdict, not re-scanned.
3. **Shallow-clone** (`git clone --depth 1`) into `~/hermes-workspace/security/clones/<owner>-<repo>/`. Clone once, reuse.
4. **Parallel medusa batches, not one queue**: repos <10MB in one loop; 100MB+ giants in their own batch so giants never block small verdicts. Per repo: `printf 'YES\n' | ~/.local/bin/medusa scan <clone-dir> --fail-on high --workers 2 --format json -o reports/batch-<run>/<repo> > <repo>.log 2>&1` under terminal(background=true, notify=true). Medusa headless mechanics (TTY/OOM/stdin pitfalls) live in security-gate — follow exactly.
5. **Forensic quick-pass on small repos while medusa runs** — grep files (<400KB) for danger signals: curl-pipe-to-shell, eval of decoded payloads, exfil endpoints (telegram send*, discord webhooks), SSH-key/credential access in EXECUTABLE code, unexplained public IPs. Classify:
   - Doc/comment mention of a credential path = noise (same FP class as SkillSpector prose).
   - Code that REFUSES symlink-to-ssh-key tricks or EXCLUDES credential files = defensive engineering — the repo is stronger for it; state this explicitly or the scary grep lines get misread later.
   - Exfil endpoint or credential read in executable code = hard stop: quarantine the clone (`~/hermes-workspace/security/quarantine/`) and stop.
6. **Verdict table, never raw severity.** LLM-heavy repos trip ML-research rules en masse, scoring 0 — noise, not breach; spot-check findings by (severity, rule, file), read flagged lines, then verdict.
7. **Nickname mapping check**: a user-supplied name ("defuddle") may point at an umbrella repo whose tool is one subdir inside. Verify in step 1, state it. Flag repos that are Shams's OWN — posture is adoption review, not external threat.

## Pitfalls

- `--workers 2` prevents the OOM kill that mimics a hang on big repos.
- Giant-repo scans never run in the foreground chain — foreground terminal caps below a giant scan's runtime; plan background from the start.
- GitHub raw: freshly-pushed files can 404 at `raw.githubusercontent.com/<o>/<r>/<branch>/...` while `.../refs/heads/<branch>/...` serves 200 — try the refs form before concluding a file is missing.
- A repo >1GB even shallow means LFS blobs — prefer API file listing for forensics; clone only what medusa needs.

## Deliverable (what Shams sees)

One table: # | repo | exists/pushed | size | forensic reading | medusa (triaged) | verdict (SAFE/CAUTION/BLOCK, one-line reason). Then: which repos are his own + adoption posture. No severity dumps, no raw grep transcripts.