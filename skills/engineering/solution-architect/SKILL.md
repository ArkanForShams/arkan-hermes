---
name: solution-architect
description: "Use for solution design, integrations, and ADRs."
version: 0.1.0
author: ARKAN (for Shams Tabrez), Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [Architecture, ADR, Integration, NFR, Design-Review]
    related_skills: [dotnet-architect, azure-architect, security-architect, devops-architect]
---

# Solution Architect Skill

Solution-level architecture procedures: requirements-to-design translation, component design with ADRs, integration patterns, non-functional requirements engineering, and design reviews.

## When to Use
- Designing a new application/feature architecture end-to-end
- Integration design between systems (sync/async, contracts, failure modes)
- NFR engineering: performance, availability, security, maintainability targets
- Design reviews and architecture sign-offs
- Don't use for: enterprise landscape strategy (technology-portfolio-advisor), cloud landing zones (azure-architect)

## Procedure
1. **Requirements decomposition.** Functional requirements traceable to components; NFRs quantified (availability %, latency budgets, RPO/RTO, security posture) - unquantified NFRs are decoration. Completion criterion: requirements traceability matrix; NFRs with numbers.
2. **Component design.** Bounded components with owned data; interfaces explicit; coupling map drawn. Completion criterion: component diagram with data ownership marked.
3. **ADR per significant decision.** Context / options / decision / consequences / review trigger - decisions without ADRs get re-litigated forever. Completion criterion: ADRs in repo, linked from design doc.
4. **Integration patterns.** Sync (REST/gRPC) for immediate answers, async (queues/events) for decoupling and resilience; contract-first with versioned schemas; define failure modes per integration (timeout, retry, poison handling). Completion criterion: integration catalog with failure handling per connection.
5. **NFR engineering.** Each NFR gets: budget, design mechanism (caching, queueing, replication, encryption), and a verification method (load test, failover drill, pen test). Completion criterion: NFR -> mechanism -> verification table complete.
6. **Design review.** Peer review with structured checklist: coupling, failure modes, security, operability, cost. Findings as ADRs or accepted risks, not verbal. Completion criterion: review log with dispositions.
7. **Delivery bridge.** Design hands to delivery with: build order, riskiest-first plan, test strategy, ops handover checklist. Completion criterion: kickoff-ready pack handed to program-manager.

## Quick Reference
- **ADR skeleton:** Title / Status / Context / Options / Decision / Consequences / Review trigger.
- **Integration rule of thumb:** queries -> sync; state changes -> async events; always ask "what happens when it fails?"
- **NFR budgets live in the design**, not a wish list: latency, availability, throughput, RPO/RTO with mechanisms.
- **Riskiest-first sequencing:** prove the scariest assumption in week one, not month six.

## Pitfalls
- **PowerPoint architecture:** diagrams without failure modes or NFR numbers.
- **Distributed monolith:** microservices sharing one database - worst of both worlds.
- **NFR amnesia:** "it should be fast/secure" with no numbers, then production surprises.
- **Review-less design:** decisions fossilize unchallenged until rewrite time.

## Verification
- Design doc with traceability matrix, ADRs, integration catalog, NFR verification table.
- Design review held with dispositions; riskiest-first plan agreed with delivery.
- Post-implementation review compares NFR budgets vs reality.

## Deeper Sources
- microsoft/architecture-center (patterns, cloud design principles)
- cto-advisor (decision memos), azure-architect (cloud specifics), security-architect (threat model input)
