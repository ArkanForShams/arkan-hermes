---
name: saudi-caio-advisor
description: "Use for Saudi regulatory alignment of AI and data work."
version: 0.1.0
author: ARKAN (for Shams Tabrez), Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [Saudi, SDAIA, NDMO, PDPL, NCA, Vision-2030, CAIO]
    related_skills: [sdaia-advisor, ndmo-advisor, pdpl-advisor, nca-advisor, ai-governance]
---

# Saudi CAIO Advisor Skill

The integrated Saudi-regulatory advisory procedure for AI, data, and digital transformation initiatives: SDAIA/NDMO/PDPL/NCA/DGA alignment, Vision 2030 mapping, and enterprise architecture - combined into one CAIO-grade workflow. The orchestrator above the individual governance skills (sdaia-advisor, ndmo-advisor, pdpl-advisor, nca-advisor) and the existing ai-governance/ai-architect stack.

REGULATORY DISCIPLINE (applies to this and all governance skills): this skill encodes procedures and interpretation discipline, NOT legal conclusions. Regulatory texts change (PDPL regulations, NCA controls, SDAIA guidance all evolve); every compliance-relevant output MUST (a) cite the official source it relies on, (b) carry the as-of date it was verified, (c) route final compliance conclusions to compliance/legal and, where needed, the regulator itself. Never invent clause numbers, thresholds, or control IDs - verify or label.

## When to Use
- Standing up or reviewing any AI/data initiative that must align with Saudi regulatory frameworks
- Preparing regulatory-alignment sections for CAIO-grade decks and business cases
- Mapping initiatives to Vision 2030 and national data/AI strategy
- Don't use for: single-framework deep dives (sdaia/ndmo/pdpl/nca-advisor), internal risk tiers (ai-governance), architecture mechanics (solution-architect)

## Procedure
1. **Regulatory applicability screen.** Determine which frameworks bind the entity: PDPL (personal data processing), NCA controls (cybersecurity - ECC baseline, sector/cloud controls), NDMO policies (data management for public entities and their ecosystem), SDAIA AI guidance, DGA (if government/semi-government service delivery), CST (if telecom/cloud service provisioning). Output: applicability table with rationale per framework. Completion criterion: no framework assumed binding without a stated reason.
2. **Vision 2030 alignment map.** Per initiative: which national priority it serves (digital economy, human capability, government efficiency, data/AI leadership), stated in one evidence-backed sentence - alignment claims without substance are noise. Completion criterion: alignment statement per initiative.
3. **Data compliance path (via ndmo-advisor).** Classification, quality, sharing rules - any dataset entering an AI system is classified first. Completion criterion: classification record exists per data domain.
4. **Privacy path (via pdpl-advisor).** Personal data in scope? -> PDPL review: lawful basis, consent where applicable, data-subject rights handling, cross-border transfer assessment. Completion criterion: privacy review recorded before any personal-data processing goes live.
5. **Security path (via nca-advisor).** ECC-aligned control check for the systems involved; cloud workloads checked against cloud controls posture. Completion criterion: security review logged with findings.
6. **AI governance overlay (via ai-governance + sdaia-advisor).** Standard risk tiers PLUS SDAIA AI-ethics principles alignment (fairness, transparency, explainability, accountability); GenAI and agent governance per ai-architect patterns. Completion criterion: AI system passes both the internal tier gates and the ethics checklist.
7. **Architecture coherence (via solution-architect + saudi sections).** Target architecture documented with current-state delta; cloud placement consistent with security posture. Completion criterion: ADRs current.
8. **Integration into delivery.** The aligned initiative enters portfolio-manager intake with its regulatory dossier attached; compliance artifacts live with the system, not in a drawer. Completion criterion: dossier linked from the project record.

## Quick Reference
- **The four authorities map:** SDAIA (data & AI - PDPL enforcement, AI ethics, national data strategy via NDMO) / NCA (cybersecurity controls incl. cloud) / DGA (digital government services & maturity) / CST (telecom-ICT-cloud regulation). Know which one owns your question.
- **Order of paths:** classify data -> privacy check -> security check -> AI ethics check -> architecture. Data comes first; every later step depends on it.
- **The alignment sentence formula:** "<Initiative> supports <Vision 2030 objective> by <measurable contribution>."
- **CAIO positioning:** fluency in this stack IS the differentiator for Saudi AI leadership roles - it is the language of every transformation conversation in the Kingdom.

## Pitfalls
- **Citing stale thresholds:** regulations evolve (PDPL enforcing instruments, NCA control updates). The as-of date is part of the answer.
- **Framework collision confusion:** NCA (security) vs SDAIA (data/AI) vs DGA (services) overlap - attribute each control to the right authority.
- **Compliance theater:** mapping slides without artifact evidence. Every alignment claim carries an artifact.
- **Private-sector blind spot:** some NDMO instruments bind public entities first - applicability screening (step 1) exists precisely for this. Do not assume private-sector scope without checking.

## Verification
- Every governance-relevant initiative has: applicability table, classification record, privacy review, security review, AI-governance pass - all dated with sources.
- Regulatory citations carry as-of dates; no invented clause numbers anywhere in artifacts.
- Quarterly refresh: re-verify orientation knowledge against official sources (sdaia.gov.sa, nca.gov.sa, dga.gov.sa, cst.gov.sa, Vision 2030 site).

## Deeper Sources
- sdaia.gov.sa, nca.gov.sa, dga.gov.sa, cst.gov.sa (official texts - always current authority)
- vision2030.gov.sa (national strategy), sdaia AI Ethics principles
- Sub-skills: sdaia-advisor, ndmo-advisor, pdpl-advisor, nca-advisor; ai-governance (international overlay)
