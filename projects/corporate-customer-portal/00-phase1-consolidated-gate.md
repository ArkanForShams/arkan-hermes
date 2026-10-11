# Corporate Customer Portal — Phase 1 Consolidated Gate Report

**Date:** 2026-10-11
**Project:** Auto Lead Corporate Customer Portal
**Collaboration environment:** Local Buzz Workspace
**Buzz channel:** `Corporate Customer Portal` (`369b68ff-02cb-48ea-b473-d65b7e134040`)
**Status:** Phase 1 discovery/design complete; production build approval denied

## Executive decision

The project has a strong business scope and a credible initial architecture direction, but it is **not ready for production implementation or regulatory/compliance claims**.

Controlled discovery, architecture work, synthetic-data spikes and provider/API validation may continue. Production implementation should begin only after the P0 gates below are closed and accepted by the accountable business, IT, Finance, Security, Privacy and Legal owners.

## Reviewed deliverables

1. `PROJECT-CHARTER.md`
2. `01-discovery-product.md`
3. `02-architecture-baseline.md`
4. `03-security-pdpl-review.md`
5. Source: `CCP BRD v1.0.md`

All three worker handoffs were posted and verified in Buzz.

## Consolidated findings

### 1. Product boundary is unresolved

The project title says **Corporate Customer Portal**, while the BRD describes a dealer-agent portal serving corporate and individual customers, with additional requirements for customer mobile, service, loyalty, CRM, CMS, ERP and dealer networks.

**Decision required:** define the Phase 1 product boundary, primary users, non-goals and pilot cohort.

Recommended initial boundary:

- Dealer-facing corporate quote-to-contract journey
- Corporate customer onboarding and consent
- Pricing, quotation and approval
- Contract draft/signature handoff
- Tenant-aware access and audit
- Integration control plane
- E-check feasibility spike using synthetic data

Defer individual customers, full customer self-service, loyalty redemption, full service ecosystem and GCC expansion until the boundary is approved.

### 2. Architecture direction is accepted as a proposal

Recommended starting architecture:

- Domain-oriented modular monolith
- Hexagonal ports and adapters
- Relational operational database
- Object storage for documents and inspection media
- Transactional outbox/inbox
- Asynchronous integration workers
- Explicit provider operation ledger
- Rebuildable reporting projections
- State machines with pending/unknown outcomes

Microservices should be considered only after scale, ownership and independent deployment evidence exists.

### 3. Security and privacy are release blockers

The BRD contains control intentions but no proof of implementation, legal interpretation, provider contract, residency evidence, DPIA/PIA, penetration testing or operational readiness.

Do not describe the solution as PDPL-compliant, NCA-compliant or fully compliant until the relevant control owners and qualified Saudi counsel have approved the evidence.

## P0 gates before production build approval

1. Scope, MVP and customer/dealer identity boundary approved.
2. B2B/B2C/customer authentication and federation topology approved.
3. Tenant, role, object, report, export and privileged-access matrix approved.
4. Identity lifecycle, MFA, step-up authentication, PAM/JIT, revocation and break-glass design approved.
5. PDPL data inventory, purpose/minimisation model, notices/consent, controller/processor roles and rights workflows approved.
6. Retention, deletion, anonymisation, backup, legal-hold and provider-copy matrix approved.
7. Current API/provider evidence obtained for AutoLease, D365, Tajeer, TAMM, SIMAH, ZATCA, identity, payment, messaging, fines, insurance and assessment providers.
8. Source-of-truth and reconciliation decisions made for vehicles, reservations, rates, contracts, invoices, tax, payments and settlements.
9. Offline e-check trust model proven through a device/network/security spike; production offline permissions explicitly approved.
10. Financial and workflow invariants validated using worked examples and concurrency/idempotency tests.
11. Security architecture, network boundaries, secrets/key management, media controls, SIEM, backup and DR evidence produced.
12. Security test plan, incident runbook, breach decision workflow, restore drill and risk-acceptance process approved.

## Highest-risk assumptions challenged

- “Corporate Customer Portal” is not automatically the same product as the Dealer Agent Portal in the BRD.
- A cached vehicle status is not equivalent to an authoritative reservation.
- A queued government/API request is not proof of registration or approval.
- Offline media capture is not automatically legally admissible evidence.
- A mutable points, balance or settlement field is not an adequate financial audit trail.
- “Zero trust” is not a control until trust boundaries, policies and tests are defined.
- Hosting in an intended KSA region does not prove every dependent service, log, backup or subprocessor remains in KSA.
- Data anonymisation is not complete until secondary stores, backups, exports and provider copies are addressed.
- A BRD statement is not evidence of a current regulatory obligation.

## Recommended next phase

Run a controlled **Phase 1.5 validation programme** before implementation:

1. Sponsor scope and MVP workshop.
2. Regulatory/API evidence register.
3. Source-of-truth and state-machine workshop.
4. Identity and tenant authorization workshop.
5. Finance/tax/payment worked-example workshop.
6. Offline e-check device and connectivity spike.
7. PDPL data mapping and retention workshop.
8. Provider sandbox and contract-test inventory.
9. Security threat-model review.
10. Cost, capacity, DR and support-readiness assessment.

## Gate outcome

**Current outcome: AMBER/RED — discovery/design continuation approved; production build approval denied.**

The project can move to implementation planning after the P0 gates have named owners, target dates, evidence requirements and explicit acceptance decisions.
