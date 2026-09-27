---
name: data-governance-advisor
description: "Use for data governance frameworks and operating models."
version: 0.1.0
author: ARKAN (for Shams Tabrez), Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [Data-Governance, DAMA, COBIT, ISO-8000, Stewardship]
    related_skills: [ndmo-advisor, fabric-architect, enterprise-risk-advisor]
---

# Data Governance Advisor Skill

General data governance framework design (international practice): DAMA-DMBOK-aligned operating model, COBIT governance interface, ISO 8000 quality vocabulary - the worldwide complement to ndmo-advisor (which handles the Saudi national layer). For building a data governance function that would satisfy both an international auditor and NDMO alignment.

## When to Use
- Designing a data governance operating model from scratch
- Data governance assessment or maturity review (international lens)
- Harmonizing DAMA/COBIT practice with NDMO requirements
- Don't use for: Saudi regulatory specifics (ndmo-advisor), privacy law (pdpl-advisor), DAX models (dax-expert)

## Procedure
1. **Operating model.** Central council (standards, arbitration) + domain federated ownership (business domains own their data) + platform team (enables). Decision rights documented: who decides definitions, quality bars, access. Completion criterion: operating model one-pager signed.
2. **Policy set.** Data governance policy + per-domain standards: classification (link ndmo-advisor scheme), quality, retention, access, sharing. Policies short, owned, enforced by platform where possible. Completion criterion: policy set published.
3. **Roles.** Council chair (senior exec), domain data owners, stewards, custodians (technical), governance lead. RACI for the ten most common decisions. Completion criterion: role chart live.
4. **Quality framework.** Dimensions (completeness, validity, consistency, timeliness, uniqueness), measurement per critical dataset, scorecards, remediation loop. Completion criterion: scorecards running monthly.
5. **Metadata & lineage.** Business glossary (definitions business-agreed), technical catalog, lineage for critical flows. Completion criterion: catalog covers critical domains.
6. **Assessment.** Maturity vs DAMA wheel / COBIT data objectives with evidence; gap plan with owners feeding enterprise-risk-advisor register. Completion criterion: baseline + plan.
7. **Value narrative.** Frame governance in business outcomes: faster delivery (trusted data), lower risk (classified, controlled), AI readiness (quality inputs). Completion criterion: value statement for leadership deck.

## Quick Reference
- **Governance succeeds at the decision-rights level:** most failures are undefined "who decides", not missing tooling.
- **Start where AI starts:** the domains feeding AI systems get governance first - data quality is AI readiness.
- **DAMA wheel domains** cover the practice map; COBIT frames IT governance interface; ISO 8000 frames quality.

## Pitfalls
- **Council bloat:** meetings without decision rights become theater. Small council, real authority.
- **Tool-first:** buying a catalog before naming owners produces an empty catalog.
- **Framework fundamentalism:** DAMA vs COBIT vs NDMO arguments waste months - compose them by purpose.

## Verification
- Operating model, policies, role chart, scorecards, catalog all live and current.
- Assessment evidence-based; gap plan tracked; value narrative accepted by leadership.

## Deeper Sources
- DAMA-DMBOK (practice body), COBIT (governance objectives), ISO 8000 (quality)
- ndmo-advisor (Saudi layer), fabric-architect (platform), enterprise-risk-advisor (register)
