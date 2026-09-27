---
name: enterprise-risk-advisor
description: "Use for enterprise risk registers and appetite mapping."
version: 0.1.0
author: ARKAN (for Shams Tabrez), Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [Enterprise-Risk, Taxonomy, Appetite, Register, KRI]
    related_skills: [risk-manager, ai-governance, nca-advisor, pdpl-advisor]
---

# Enterprise Risk Advisor Skill

Enterprise-level risk management procedures extending risk-manager from project RAID to organizational risk: risk taxonomy, appetite mapping, register governance, and integration of the governance stack (NCA, PDPL, AI tiers) into one enterprise view.

## When to Use
- Building or reviewing an enterprise risk register for IT/digital
- Mapping risk appetite and escalation thresholds with leadership
- Consolidating regulatory + delivery + AI risks into one view
- Don't use for: project RAID logs (risk-manager), security engineering (security-architect), regulatory verdicts (sub-skills)

## Procedure
1. **Risk taxonomy.** Enterprise-level categories: strategic, operational, technology & cyber, data & privacy, compliance & regulatory, people, third-party, financial. Map the governance stack into it (NCA posture -> cyber; PDPL exposure -> data & privacy; AI systems -> technology + compliance via ai-governance tiers). Completion criterion: taxonomy adopted with mapping.
2. **Register establishment.** Per risk: description (specific, not "cyber risk"), owner (a person), inherent assessment, controls in place, residual assessment, treatment plan, review date. Completion criterion: register with zero ownerless or vague entries.
3. **Appetite and thresholds.** With leadership: which risks are tolerated at what level, which are intolerable; thresholds for escalation to the executive level. Completion criterion: appetite statement signed.
4. **Integration discipline.** One register feeds all reporting: project risks roll up (risk-manager), AI tiers feed it (ai-governance), NCA gap register links (nca-advisor), PDPL transfer register links (pdpl-advisor). No parallel risk truths. Completion criterion: cross-references live.
5. **Top-risk review cadence.** Monthly top-10 with movement; quarterly full-register review with leadership; emerging-risk scan (new tech, regulatory change - e.g., evolving AI regulation) each quarter. Completion criterion: reviews evidenced.
6. **KRIs.** Indicators that move BEFORE incidents: overdue remediations, ungoverned AI systems count, expired reviews, unresolved transfer registrations. Completion criterion: KRI dashboard live with thresholds.
7. **Reporting.** Risk report in business language for leadership (cost/exposure/decisions), consistent with executive-reporting tone. Completion criterion: report accepted without rework two cycles.

## Quick Reference
- **Residual risk is the honest number:** inherent minus working controls - not the raw scary score.
- **Risk appetite belongs to leadership,** documented and reported against - not PM intuition.
- **Emerging-risk scan is a CAIO habit:** regulatory and tech shifts surface here before they land in projects.
- **One register:** governance stack outputs (NCA, PDPL, AI tiers) are inputs to ONE enterprise view.

## Pitfalls
- **Score inflation politics:** inflating scores to win budget - destroys register credibility.
- **Register as graveyard:** annual dust-off instead of monthly movement review.
- **Vague risks:** "cybersecurity" is a category, not a risk. Specific threat + asset + consequence.
- **Silo registers:** security, privacy, AI each keeping separate truths - integrate or mislead.

## Verification
- Register current with owners and residual scores; appetite statement on file.
- KRIs live with thresholds; top-risk reviews evidenced monthly.
- Governance-stack registers (NCA, PDPL, AI) cross-linked and current.

## Deeper Sources
- risk-manager (project layer), ai-governance (AI tiers), nca-advisor, pdpl-advisor
- COSO ERM / ISO 31000 practice (structure vocabulary)
