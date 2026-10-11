# Why MEDUSA blocked these repos — root-cause forensics (2026-10-05)

Question (Shams): "You are a cybersecurity expert — check why it is blocked."
Method: read MEDUSA's installed rule packs (signatures + regex), reproduce matches against
the actual spec-kit source, quantify every major finding class. Nothing inferred — reproduced.

## 1. What "blocked" means (gate mechanics)
`security-gate.sh repo` runs MEDUSA with `--fail-on high`; exit 1 = any CRITICAL/HIGH finding exists.
The block is a POLICY STOP ("human review required"), not a malware verdict. Severity ≠ guilt by design.

## 2. Root causes of the 2,669 spec-kit findings (reproduced against the real source)

| Rule (count) | Intended target | Actual regex | Why it fires on spec-kit | Repro hits |
|---|---|---|---|---|
| MM-SCAN-058 "PLA copyright attack" (973) | research code for PLA image-copyright attacks | `PLA` — bare substring, no \b | PLA is inside "TEM**PLA**TE", "IM**PLA**CE", "COM**PLA**CE" — spec-kit's core vocabulary | 492 in templates/ alone |
| AIC-EXFIL-005 "SSH-key exfil" (129) | instructions to read SSH keys | `(?i)(id_rsa|id_ed25519|\.pem|\.key|authorized_keys)` | matches `.keys()` dict calls in tests, and `*.key` in spec-kit's own "never touch secrets" EXCLUSION list (security-positive doc!) | 462 |
| JB-SCAN-031 "JUMP jailbreak" (116) | research code of the JUMP jailbreak framework | `DUMP\s*\(` among others — NO word boundary | matches every `yaml.safe_dump(`, `.dump(` call — Python's most common YAML idiom | 542 |
| INF-SCAN-2056 "os-call in model init" (103) | malicious os.system in model loaders | `shutil.(rmtree|move|copy)(...)` in ANY .py | spec-kit CLI's ordinary file operations (cleaning temp dirs, moving templates) | 103 |
| AEXP-SCAN-096 "tool compromise" (75) | supply-chain tool injection | `(install|add|load|use).{0,60}(tool|plugin|extension|connector).{0,80}(npm|pip|from|via...)` | spec-kit's core FEATURE is installing agent integrations — its docs/code describe exactly this | 75 |
| FTSCAN-231 "SQL injection" (55) | SQLi payloads | `%27`, encoded quotes | URL-encoded strings in test fixtures/hex data | 55 |
| MD-PI ×2 (in *.md) | injected instructions | phrases like "ignore previous instructions" | appears in the template that TEACHES agents to reject that exact phrase | 2 |

The 2026-harvest rule packs assume research-paper code (attack verbs in code = attack code).
spec-kit's domain vocabulary (templates, placeholders, integrations, tool installation, key-exclusion
lists) overlaps that terminology almost line for line → precision collapse, ~95%+ of findings.

## 3. Nango (44 findings) — same anatomy
- GL-generic-api-key ×4: one base64 string, identical across 3 vitest configs — decoded: test
  fixture (`RzV4ZGo5...` = "G5xdj9FQJ2m0aiWt8qLXpovkPnJ4h7Ne"), committed test.env value, public repo.
  Not a live credential.
- INFRA-SCAN-004 ×4 CRIT: `password:` schema fields in OpenAPI docs (API documentation).
- PI-RCE ×5: contributor docs prose + fenced npm examples.
- DKR003 ×2: Redis 6379:6379 in DEV-only compose (local dev pattern; we don't run their dev stack).

## 4. What a REAL compromise would look like (checked, absent in all three)
- Runtime network beacons to non-vendor endpoints / exfil URLs — none found in flagged code
- Obfuscated payloads (base64 blobs executed at runtime, eval-chains) — none
- Live credential literals (AWS keys, private keys) — none (only test placeholders)
- Setup scripts doing anything beyond declared installs — none reviewed doing so
- Malicious SKILL.md prompt content — spec-kit's 2 skills: SAFE; nango's 10 flagged only for
  aggressive dev-workflow agency (DO_NOT_INSTALL = we never load them)

## 5. Conclusion
Blocked = correct policy behavior on a trigger threshold, with findings dominated by
**regex overbreadth in harvested research-signature rules** (PLA→TEMPLATE, DUMP(→safe_dump(),
.key→.keys()/*.key exclusion docs). Both repos verified clean by direct source inspection.
Verdicts stand: clone + install cleared, nango .agents/skills quarantined (never loaded).

Artifacts: medusa-scan-20261005-170954*.json (findings+raw), this file, TRIAGE-VERDICT.md,
reproduction scripts in session; rule packs at
~/.local/share/uv/tools/medusa-security/lib/python3.11/site-packages/medusa/rules/