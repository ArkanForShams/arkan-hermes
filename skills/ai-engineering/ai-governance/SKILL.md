---
name: ai-governance
description: "Use for AI risk tiers, policy gates, and compliance."
version: 0.1.0
author: ARKAN (for Shams Tabrez), Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [Governance, Risk, Compliance, Responsible-AI, Approvals]
    related_skills: [ai-architect, caio-advisor]
---

# AI Governance Skill

Operational governance for AI systems: risk tiering, approval gates, data privacy rules, security review, and responsible-AI checklists. Aligned with group IT/security policy. Produces governance artifacts, not legal opinions - regulatory questions go to qualified counsel and, for Shariah-specific questions, to qualified scholars.

## When to Use
- Classifying an AI system or agent by risk before deployment
- Defining approval gates, review cadences, and audit trails
- Data privacy review: what data may enter prompts, logs, training
- Vendor AI feature assessment (does the tool train on your data? where is it processed?)
- Don't use for: architecture design (ai-architect), strategy (caio-advisor)

## Procedure
1. **Risk tier every system.** Tier 1 (low): internal drafts, summarization, no personal data, human-final. Tier 2 (medium): customer-visible text, internal personal data, semi-autonomous actions, reversible. Tier 3 (high): decisions affecting people/finance/production, autonomous external actions, regulated data. Completion criterion: tier recorded with one-line justification.
2. **Set gates per tier.** Tier 1: self-serve, spot-audit monthly. Tier 2: review before launch, eval pass required, named owner. Tier 3: security review, data assessment (DPIA-style), human approval gate on every irreversible action, incident runbook. Completion criterion: gates documented and agreed with IT security.
3. **Data boundary review.** For each system: what data enters (prompts/attachments), where processed, retained how long, who can access logs. Rule: no card/bank/payment data, no credentials, no special-category personal data without explicit approval. Completion criterion: data-flow map exists for every Tier 2+ system.
4. **Vendor AI review.** Questions: training-on-your-data? (must be no, or opt-out), data residency, sub-processors, deletion on exit, audit rights. Completion criterion: answers on file before adoption.
5. **Evaluation and monitoring standard.** Per system: quality metrics, drift signals, incident reporting path, re-review date. Completion criterion: monitoring assigned to a named owner.
6. **Incident runbook.** Tier 2+: who to tell, how to pause the system, how to preserve evidence, post-incident review format. Completion criterion: runbook tested once (tabletop).
7. **Audit trail.** Keep approvals, eval results, and changes logged per system. Completion criterion: any system's approval history retrievable in 5 minutes.

## Quick Reference
- **Approval gate checklist:** tier / owner / eval results / data-flow map / rollback plan / review date - all six before launch.
- **Red lines (never):** personal data in public models, autonomous spend, autonomous messages on behalf of a person, production changes without approval, credentials in prompts or logs.
- **Autonomy ladder for agents:** read-only -> draft-for-review -> execute-and-report -> full autonomy (granted per task type, revocable, with log).
- **Governance artifacts:** risk register, gate log, vendor review file, incident log, quarterly review deck.

## Pitfalls
- **Shadow AI:** unapproved tools processing company data. Inventory quarterly; make the sanctioned path easier than the workaround.
- **Policy theater:** governance docs nobody applies. Attach gates to the deployment pipeline, not a wiki.
- **One-size-fits-all:** applying Tier 3 ceremony to Tier 1 tasks kills adoption. Proportionality is the point.
- **Stale approvals:** a Tier 2 system that drifted into Tier 3 use. Re-tier on any material change.

## Verification
- Every deployed AI system has a recorded tier, owner, gate status, and review date.
- Quarterly audit completed: inventory matches reality, no red-line violations.
- Incident runbook exists and was exercised at least once.


## International Standards Overlay (added 2026-09-24)
When external assurance or cross-border credibility is required, map internal gates to recognized standards:
- **NIST AI RMF:** Govern/Map/Measure/Manage functions - our tier gates and evals cover Measure/Manage; use Map for context-setting on Tier 2+ systems.
- **ISO/IEC 42001 (AI management system):** if the organization pursues certification, the gate log + eval records + governance artifacts here form the management-system backbone.
- **Microsoft Responsible AI / SDAIA AI Ethics principles:** the ethics checklist in sdaia-advisor serves SDAIA alignment; internal red lines already cover Microsoft's core commitments.
- Mapping rule: one evidence trail, many standards - map the internal artifacts to each framework's vocabulary rather than producing parallel evidence.

## Deeper Sources
- Azure-Samples/AI-Foundry-Samples (evaluation frameworks)
- microsoft/architecture-center (governance models)
- Group IT risk, security, and compliance policies (internal, source of truth)
