# Discovery Backlog — Sequential Cross-Functional Workplan

**Rule:** Complete discovery gates in order. No implementation handoff until the preceding gate is accepted.

## Gate 0 — Sponsor framing

**Owner:** Chief of Staff / Product Manager  
**Outputs:** product charter, brand decision, launch markets, MVP decision, named business owners.  
**Open questions:** Quicklead vs Auto Lead branding; Saudi-only vs GCC launch; B2B pilot timing.

## Gate 1 — Operations-system discovery

**Owner:** Enterprise Architect + Operations SME  
**Outputs:** current-state architecture, source-of-truth matrix, API catalogue, status mapping, booking-capacity model, integration constraints.  
**Must resolve:** branch/bay/technician/service capacity; RO status taxonomy; pricing and invoice ownership; webhooks/polling; retry and reconciliation.

## Gate 2 — Domain and data model

**Owner:** Business Analyst + Data Architect  
**Outputs:** canonical entity model, data dictionary, identity/vehicle matching rules, tenant model, data classification, retention/deletion matrix.  
**Must resolve:** duplicate customer/vehicle handling; plate/VIN validation; ownership evidence; organization/fleet/cost-center hierarchy.

## Gate 3 — UX and service blueprint

**Owner:** UX/UI Lead + Customer Experience Lead  
**Outputs:** validated journeys, Arabic/English IA, accessibility requirements, wireframes, prototype scope, service blueprint and error/offline states.  
**Must validate:** four priority journeys from the supplied UX brief; realistic Saudi branch/service scenarios; price/VAT clarity; support and complaint paths.

## Gate 4 — Security, privacy and compliance

**Owner:** Security Architect + Privacy/Compliance  
**Outputs:** threat model, RBAC/ABAC model, consent design, PDPL applicability assessment, data residency/cross-border assessment, payment security boundary, audit design, secure SDLC controls.  
**Rule:** conclusions require current official-source verification and legal/compliance review; this backlog is not legal advice.

## Gate 5 — Solution architecture

**Owner:** Solution Architect + CTO/CAIO review  
**Outputs:** target architecture, component/data-ownership diagram, integration catalogue, ADRs, NFR budget, failure-mode design, environment/release model, observability plan.  
**Riskiest-first proof:** validate operational-system integration and capacity-aware booking before building broad UI.

## Gate 6 — Delivery plan

**Owner:** Program Manager + Engineering Lead  
**Outputs:** epics, stories, API contracts, test strategy, release plan, dependency map, RACI, RAID log, UAT plan, support/runbook outline.

## Gate 7 — Prototype validation

**Owner:** Product + UX + Operations + selected customer/fleet reviewers  
**Outputs:** findings, acceptance decisions, revised backlog, signed MVP scope.

## Gate 8 — Build readiness

**Exit criteria:** gates 0–7 accepted; unresolved risks have owners and dates; no unbounded external integration; security/privacy review complete for MVP scope; measurable NFRs approved.

## Proposed agent handoff order

1. Chief of Staff / Product Manager — scope and decision register.
2. Business Analyst — requirements traceability and domain questions.
3. Enterprise/Solution Architect — current/target architecture and ADRs.
4. Data Architect — canonical model, classification and retention.
5. UX/UI + CX — journeys, bilingual design and prototype acceptance.
6. Security/Privacy/Compliance — threat model and Saudi applicability dossier.
7. Integration Architect — API/event contracts and reconciliation.
8. DevOps/SRE — environments, deployment, observability and DR.
9. CRM/Payments/Fleet specialists — bounded domain validation.
10. Program Manager — delivery plan, RAID and governance pack.
11. Chief of Staff — cross-functional review, decision routing and sponsor brief.
