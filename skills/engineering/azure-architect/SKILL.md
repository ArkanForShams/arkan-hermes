---
name: azure-architect
description: "Use for Azure service selection, identity, and cost."
version: 0.1.0
author: ARKAN (for Shams Tabrez), Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [Azure, Landing-Zone, Identity, Cost, Reliability]
    related_skills: [solution-architect, devops-architect, security-architect, dotnet-architect]
---

# Azure Architect Skill

Azure solution architecture: landing zone placement, service selection, identity, networking, cost engineering, and reliability design. Source basis: Azure architecture patterns and Azure-Samples.

## When to Use
- Choosing Azure services and designing hosting for workloads
- Landing zone / subscription design, identity and network posture
- Cost engineering, reliability targets, scaling design
- Don't use for: CI/CD pipelines (devops-architect), security controls detail (security-architect)

## Procedure
1. **Workload placement.** Map workload to landing zone: subscription per workload/owner; management-group policy inheritance; tagging standards (owner, env, cost-center) from day one. Completion criterion: placement decision + tag schema applied.
2. **Service selection.** PaaS-first (App Service, Azure SQL, Service Bus) over IaaS unless control demands VMs; managed > self-managed; every pick has a rejection note for the runner-up. Completion criterion: service ADRs with alternatives rejected.
3. **Identity design.** Managed identities for service-to-service; no connection strings with keys where identity works; PIM for privileged access; workload identities federated - no long-lived secrets. Completion criterion: identity matrix per service; zero standing secrets where avoidable.
4. **Network posture.** Private endpoints for PaaS data services; hub-spoke alignment to enterprise network; egress control; TLS everywhere. Completion criterion: network diagram reviewed with group network team.
5. **Reliability engineering.** Per workload: SLOs (availability, latency), failure-mode analysis, multi-AZ default, DR per RPO/RTO (geo-redundancy vs backup-restore), backup testing. Completion criterion: reliability sheet per workload; restore drill scheduled.
6. **Cost engineering.** Right-size from metrics, reserved/savings plans for steady load, autoscale with min/max floors, dev/test shutdown policies, cost alerts per workload. Completion criterion: cost model per workload; alerts active.
7. **Governance gates.** Policy-as-code (deny public blobs, require tags, allowed regions); resource locks on production data; deployment stacks for cleanup. Completion criterion: policy assignments documented.

## Quick Reference
- **PaaS-first heuristic:** if a managed service covers 80% of needs, take it; the remaining 20% rarely justifies IaaS.
- **Identity over keys:** managed identity eliminates the secret rotation problem class.
- **Cost levers ranked:** right-size > reserved capacity > scheduling shutdown > tiering storage.
- **Well-Architected pillars:** cost, reliability, security, ops excellence, performance - review workloads against them quarterly.

## Pitfalls
- **Lift-and-shift inertia:** VMs where PaaS would cut cost and toil. Re-platform deliberately.
- **Secret sprawl:** connection strings in app settings. Managed identity or vault - everywhere.
- **Tag neglect:** untagged resources become unbillable, unownable, unretirable. Policy-enforce tags.
- **DR as document:** untested recovery plans fail on the day. Drills with timings or it's fiction.

## Verification
- Landing-zone placement, identity matrix, reliability sheets, cost models per workload current.
- Restore/DR drill evidence within the last 6 months.
- Policy compliance report clean (tags, regions, locks).

## Deeper Sources
- Azure Well-Architected Framework patterns; Azure-Samples reference implementations
- devops-architect (pipelines), security-architect (controls), performance-tuning-advisor (scale)
