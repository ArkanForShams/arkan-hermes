# Corporate Customer Portal — Phase 1 Discovery Baseline

Status: Discovery baseline for sponsor review
Date: 2026-10-11
Prepared by: dynamic-worker-1 (Product Manager + Business Analyst capability)
Evidence base: PROJECT-CHARTER.md and “CCP BRD v1.0” (the BRD describes an Auto Lead Dealer Agent Portal for corporate and individual leasing customers).

## 1. Evidence discipline and scope

This baseline converts the supplied charter and BRD into a discovery view. Statements marked **Source** are explicit in the supplied documents. Statements marked **Assumption** are working hypotheses only. Statements marked **Unknown / validation needed** are not evidenced and must not be treated as decisions.

The charter names the project “Corporate Customer Portal”; the BRD names the product “Auto Lead Dealer Agent Portal” and includes both corporate and individual customers. This naming/scope mismatch is a material discovery item.

## 2. Business objectives and outcomes

| Objective | Desired outcome | Evidence / confidence | Candidate measure |
|---|---|---|---|
| Extend market reach through authorised dealers | Dealers can originate leases for corporate and individual customers | Source: BRD §1.1 | Active dealers/showrooms; activated contracts by channel |
| Retain central control while delegating origination | Auto Lead controls master data, rates, pricing, compliance and reconciliation | Source: BRD §1.1–1.2 | Rate/master-data governance incidents; approval adherence |
| Improve operational visibility and incentives | Performance is visible at agent, showroom and dealer-company levels | Source: BRD §1.1, §6 | Dashboard usage; points accuracy; contract/revenue reporting |
| Reduce regulatory and data risk | Contracts, identity, consent, audit, retention and residency controls are enforceable | Source: BRD §1.1, §2, §21 | Registration timeliness; audit completeness; segregation defects; compliance findings |
| Make origination fast and usable | End-to-end contract creation is efficient across desktop/tablet and Arabic/English | Source: BRD success criteria and §21.5 | Contract creation under 20 minutes; completion/drop-off; task error rate |
| Provide dependable operations | Portal remains available and integrations recover safely | Source: BRD §1.4, §21.2 | Availability, RTO/RPO, integration failure/recovery rates |

No baseline values, customer research, support analysis, adoption data, cost model, or target launch date were supplied. Success targets therefore remain proposed acceptance hypotheses, not committed outcomes.

## 3. Stakeholder analysis

| Stakeholder | Interest / responsibility | Influence | Discovery need |
|---|---|---:|---|
| Auto Lead Business Operations | Owns business rules, rates, vehicles, approvals and operating policy | High | Confirm lifecycle, authorities, exception policy, ownership of decisions |
| Auto Lead IT / platform governance | Integrations, environments, reliability and technical controls | High | Confirm existing APIs, identity, environments, SLAs and operational ownership |
| Finance & Billing | Invoices, collections, D365 posting, reconciliation and settlements | High | Validate accounting, tax, payment, credit-note and settlement rules |
| Compliance & Legal | NAQL/TGA, SAMA, Tajeer, PDPL, NCA obligations | High | Obtain authoritative interpretations, retention/erasure boundaries and evidence requirements |
| Dealer company administrators | Manage branches, agents and company-level visibility | Medium/High | Validate onboarding, access scopes, reporting and incentives |
| Showroom managers | Manage branch operations, agents and approvals | Medium | Validate queue, approval, allocation and exception workflows |
| Dealer agents | Create quotations/contracts; perform checkout/check-in and servicing | High for usability | Observe real work, device/connectivity constraints and workarounds |
| Corporate customers | Lease fleets; provide business/KYC data; receive invoices and settlements | High for value | Validate fleet quotation, approval, document, billing and support journeys |
| Individual customers | Lease single vehicles and complete identity/signature/payment steps | Medium | Confirm whether in scope and differences from corporate journey |
| Government / regulated platforms | Tajeer, TAMM, ZATCA and identity/credit services | High dependency | Confirm API contracts, legal duties, failure and manual fallback paths |
| Service, insurance and assessment partners | Perform maintenance, assessment and claims activities | Medium | Confirm handoffs, evidence, SLAs and billing responsibility |

RACI ownership, decision rights, escalation paths and named accountable teams are not supplied and require validation.

## 4. Personas

These are role-based personas derived from the BRD, not research-validated profiles.

### P1 — Dealer Agent (primary operational user)
Context: Front-line showroom user creating quotations/contracts and executing e-checks. Needs rapid guided workflows, bilingual UI, mobile/tablet support, clear validation and resilient media capture. Pain hypotheses: repeated data entry, approval uncertainty, poor connectivity during inspection, unclear integration errors. Success: accurate contract and e-check completed without avoidable rework.

### P2 — Showroom Manager
Context: Branch supervisor who monitors agents, approves eligible exceptions and oversees local performance. Needs approval queues, visibility within showroom scope, SLA escalation and drill-down reporting. Success: timely decisions and compliant branch operations.

### P3 — Dealer Company Admin
Context: Partner-company administrator across several showrooms. Needs onboarding/deactivation, company-wide dashboards, controlled visibility and incentive reporting. Success: staff and performance managed without cross-company data exposure.

### P4 — Auto Lead Operations User
Context: Central operator controlling master data, approvals, vehicle allocation, Tajeer registration and exceptions. Needs maker-checker controls, queues, auditability, bulk uploads and integration status. Success: central policy is consistently enforced while throughput remains acceptable.

### P5 — Finance / Billing User
Context: Reviews invoices, reconciles payments, handles disputes and settlements, and posts to D365. Needs traceable calculations, tax-compliant outputs, approval thresholds and exception queues. Success: balanced and explainable financial records.

### P6 — Compliance / Legal User
Context: Reviews audit logs, regulatory reporting, consent/data requests and control evidence. Needs immutable records, retention controls, data export/anonymisation workflow and alerts. Success: defensible compliance evidence without unnecessary PII exposure.

### P7 — Corporate Customer / authorised representative
Context: Business customer evaluating vehicles and terms, supplying corporate documents and approving/signing contracts for one or more vehicles. Needs transparent pricing, status visibility, document exchange, invoices, disputes and settlement clarity. Success: confident, compliant fleet lease with low administrative effort.

### P8 — Individual Customer
Context: Retail lessee completing identity, credit, signature, payment and vehicle handover steps. Included by the BRD but not confirmed by the project title. Needs simple self-service communication and privacy controls. Scope must be confirmed.

## 5. Key journeys

### J1 — Corporate quote to active lease
1. Agent selects or registers corporate customer; duplicate/KYC/consent checks run.
2. Agent selects category/vehicle, duration, mileage, payment frequency and product/components.
3. Pricing engine displays itemised charges, VAT, total term cost and validity.
4. Quote is shared; customer accepts a version.
5. Agent converts to draft contract; required drivers/documents are captured.
6. Authority matrix routes approval or auto-approves.
7. Arabic contract is generated; signature is captured.
8. Vehicle is reserved; checkout e-check captures required media, checklist and baseline damage.
9. TAMM authorisation and Tajeer registration are initiated; contract becomes active when release gates pass.

Critical outcomes: accurate price disclosure, valid customer/vehicle, authorised approval, immutable baseline, auditable regulatory submission.

### J2 — E-check checkout/check-in and settlement
Checkout records condition, odometer, fuel, accessories, GPS/time and signatures. At return, the agent sees checkout baseline, records the same inspection evidence, and the system identifies new damage, excess mileage, fuel/accessory differences and fair-wear exceptions. Settlement aggregates invoices, fines, services, damages, deposits and credits; approval, customer notification, payment/refund, D365 posting and closure follow.

Critical outcomes: evidence integrity, fair classification, explainable charges and no premature closure.

### J3 — Corporate customer exception / dispute
Customer receives an invoice, fine, damage assessment or settlement, disputes an item, and the item is held while Finance/Operations/Compliance review evidence and decide. The system records the decision, adjustment/credit note, communication and audit trail. Exact customer-facing channels, SLAs and appeal rights require validation.

### J4 — Master data and rate governance
Auto Lead uploads or configures vehicles/rates/services; validation detects duplicates and invalid dependencies; rate uploads use maker-checker approval; effective dates and immutable historical versions govern new versus running contracts. Dealers consume approved data read-only. Confirm who owns each catalogue and what happens when source systems disagree.

### J5 — Integration failure / degraded operation
A downstream service fails during identity, credit, TAMM, Tajeer, D365, payment or notification processing. The portal must expose status, prevent unsafe release/duplication, retry idempotently where allowed, route failures to a queue/DLQ, and provide an authorised manual fallback where regulation permits. The BRD describes patterns but does not define business-specific fallback authority or customer communication.

## 6. Business processes

1. Dealer/company/agent onboarding and access lifecycle.
2. Customer registration, KYC, duplicate resolution, consent and verification.
3. Vehicle catalogue allocation and compliance validation.
4. Rate/product configuration, versioning, effective dating and approval.
5. Quotation creation, version comparison, sharing, acceptance and expiry.
6. Contract drafting, approval, Arabic document generation, signature and activation.
7. Vehicle reservation, checkout e-check, driver authorisation and Tajeer registration.
8. Active-lease operations: amendments, services, fines, incidents, claims and notifications.
9. Check-in e-check, damage classification, mileage/fuel reconciliation and vehicle disposition.
10. Billing: recurring/ad-hoc invoices, tax, payment, dispute, credit/debit note and D365 posting.
11. Natural/early closure, settlement approval, refund/payment, Tajeer/TAMM updates and archival.
12. Points accrual, tiers, disputes, redemption approval and financial settlement.
13. Reporting, audit, data access/export, anonymisation and compliance evidence.

Process maps, SLAs, exception paths, manual controls and segregation-of-duties matrices are not supplied.

## 7. Functional requirements baseline

Priority: P0 = regulatory/safety/core release gate; P1 = core operational value; P2 = later or validation-dependent.

### Identity, tenancy and roles
- FR-01 P0: Authenticate users through the approved enterprise identity flow with MFA and session controls.
- FR-02 P0: Enforce server/API/database-level tenant and organisational segregation by dealer, showroom and role.
- FR-03 P0: Support role permissions for Auto Lead, dealer company, showroom, agent, finance, compliance and auditor scopes.
- FR-04 P1: Onboard, deactivate and review agents with auditable effective dates.

### Customer and compliance
- FR-05 P0: Register corporate and individual customers with type-specific required fields/documents.
- FR-06 P0: Detect duplicates using approved identifiers and support authorised linking/review.
- FR-07 P0: Capture versioned PDPL consent and stated processing purposes.
- FR-08 P0: Integrate or queue identity/credit checks with validity, outcome, error and retry status.
- FR-09 P1: Support customer lifecycle states, document expiry and approval queues.
- FR-10 P1: Provide authorised data export and anonymisation workflows preserving legally required operational history.

### Catalogue, pricing and quotation
- FR-11 P0: Consume approved vehicle/rate/service master data with version, effective date and source traceability.
- FR-12 P0: Validate vehicle age, insurance, Fahs, Istimara, allocation and availability gates.
- FR-13 P0: Calculate itemised pricing, discounts, VAT and total term cost using the applicable rate version.
- FR-14 P1: Create, compare, share, expire and convert quotation versions.
- FR-15 P0: Apply configurable approval thresholds and maker-checker controls with escalation.

### Contract and vehicle lifecycle
- FR-16 P0: Create versioned contracts with mandatory Tajeer data, drivers, terms, pricing, documents and audit history.
- FR-17 P0: Generate Arabic primary contract documents and supplementary English outputs where applicable.
- FR-18 P0: Capture signature, reserve/release vehicles and gate activation on required approvals and checks.
- FR-19 P0: Initiate and track Tajeer registration and TAMM authorisation with status/error visibility.
- FR-20 P1: Support amendments, swaps, extensions, driver changes and rate/mileage changes with approvals and versioning.

### E-check, operations and closure
- FR-21 P0: Capture mandatory checkout/check-in photos, video, damage map, checklist, odometer, fuel, accessories, signature, timestamp and location.
- FR-22 P0: Lock completed checkout/check-in records and preserve immutable evidence references.
- FR-23 P1: Compare check-in against checkout baseline; classify fair wear, pre-existing, chargeable and disputed items.
- FR-24 P1: Manage services, incidents, accredited assessments, insurance claims and customer-borne charges.
- FR-25 P1: Ingest/match fines and support dispute holds and notifications.
- FR-26 P0: Calculate settlement from invoices, mileage, damage, fines, services, deposits, credits and penalties; apply approval matrix.
- FR-27 P0: Prevent closure until required financial/regulatory conditions are met, with authorised exception handling.

### Billing, incentives and reporting
- FR-28 P0: Generate tax-compliant recurring/ad-hoc/settlement invoices with traceable line items and statuses.
- FR-29 P0: Integrate D365/payment flows with idempotency, reconciliation and exception handling.
- FR-30 P1: Maintain points ledger, tiers, history, disputes and authorised redemption workflow.
- FR-31 P1: Provide role-scoped operational, revenue, ageing, VAT, dispute, performance and compliance reports.
- FR-32 P0: Log security, data, configuration, approval, integration and financial changes in immutable/auditable form.

## 8. Non-functional requirements baseline

- NFR-01 Availability: BRD gives two values that conflict: 99.5% during business hours in §1.4 and 99.9% uptime in §21.2. Target and exclusions require decision.
- NFR-02 Performance: initial page <3s, subsequent navigation <1s, standard API <500ms p95, search <2s p95, report and invoice targets as stated in BRD §21.1.
- NFR-03 Scale: target envelope stated as 500 dealer companies, 2,000 showrooms, 10,000 agents, 100,000 vehicles, 200,000 active contracts, 50,000 monthly invoices and 10TB+ media.
- NFR-04 Resilience: RTO <1h critical/<4h non-critical, RPO <15m, backups/replication and KSA active-passive DR as stated; validate feasibility and tiering.
- NFR-05 Security: MFA/SSO, least-privilege RBAC, tenant isolation, TLS 1.2+, AES-256, masking, privileged-access controls, monitoring, vulnerability testing and NCA alignment.
- NFR-06 Privacy/data: KSA residency, purpose limitation, minimisation, consent, access/export, anonymisation/deletion handling, retention and restricted operational logs.
- NFR-07 Usability: Arabic RTL and English LTR, responsive desktop/tablet/mobile experience, WCAG 2.1 AA, supported browsers, actionable bilingual errors and guided onboarding.
- NFR-08 Field resilience: PWA/mobile experience and offline e-check capture with safe sync and conflict handling.
- NFR-09 Integration quality: versioned APIs, idempotency, correlation IDs, rate limits, circuit breakers, retries, DLQ and monitoring.
- NFR-10 Maintainability: automated CI/CD, environment promotion, API documentation, automated tests (BRD states 80% unit coverage), structured logs, feature flags and ADRs.
- NFR-11 Audit/retention: requirements conflict across BRD sections (audit logs 2 vs 5 years; contracts/financial records 10 years; inspection media 5 years). Legal decision required.

## 9. Assumptions and dependencies

### Working assumptions (must be confirmed)
- A1: The immediate product is a dealer-facing portal, not a separate end-customer self-service portal; corporate customers may interact through dealer-assisted flows.
- A2: Auto Lead remains the lessor and policy/master-data owner; dealers do not edit authoritative fleet/rate data.
- A3: Existing enterprise integrations or approved interface owners exist for AutoLease, Azure AD, D365, Tajeer, TAMM, SIMAH, ZATCA, identity, payments, notifications, fines and insurance.
- A4: Regulatory interpretations in the BRD are accurate and current; Compliance/Legal will approve them before build.
- A5: Tablet/offline e-check is a launch-critical path rather than a later enhancement.
- A6: Corporate and individual journeys share a platform but have different KYC, credit and approval rules.

### Dependencies
- Regulatory/legal validation and access to current government/API specifications.
- Identity tenant, dealer federation, MFA, role/group provisioning and support model.
- AutoLease catalogue/rate/vehicle availability APIs and source-of-truth agreement.
- D365 Finance/CRM interfaces and accounting/tax mapping.
- Tajeer, TAMM, SIMAH, Elm/Absher, ZATCA, payment, messaging, fines, insurance and assessment integrations.
- KSA Azure landing zone, network/IP allowlists, certificates/keys, monitoring/SIEM, backup/DR and data residency evidence.
- Approved dealer/company master data, contractual terms, approval matrix, service providers and fleet pools.
- UX/content localisation, Arabic legal templates, accessibility testing and field devices/connectivity.

## 10. Missing requirements and challenged assumptions

### Missing requirements
- Confirm product name, target users and whether the customer-facing portal is in scope.
- Define MVP release boundary, rollout cohort, launch date, non-goals and budget/capacity.
- Provide research evidence: interviews, dealer/customer observations, analytics, support themes and current process baselines.
- Define end-to-end SLAs for approvals, registrations, integrations, disputes, refunds and support.
- Define authoritative source and reconciliation rules where BRD sync frequencies/ownership differ.
- Define payment methods, deposit policy, collections escalation, refunds, failed payments and chargebacks.
- Define corporate fleet bulk operations, multi-vehicle contract models and authorised signatory rules.
- Define notification consent, channel fallback, templates, delivery evidence and customer communication ownership.
- Define offline conflict resolution, media limits, device storage, sync retry and tamper evidence.
- Define accessibility acceptance tests, browser/device matrix and Arabic legal/content review.
- Define audit-log access, immutable storage, legal hold, deletion/anonymisation exceptions and evidence export.
- Define operational support, incident severity, on-call ownership, runbooks and manual fallback authority.
- Define reporting dimensions, export formats, reconciliation cadence and data quality ownership.

### Challenged assumptions / contradictions
- **Scope challenge:** “Corporate Customer Portal” versus BRD’s dealer portal for corporate and individual customers.
- **Availability challenge:** 99.5% business-hours criterion versus 99.9% overall target.
- **Security challenge:** idle timeout is 15 minutes in §5.3 and 30 minutes in §21.4.
- **Sync challenge:** vehicle sync is every 15 minutes in §3.4 but every 4 hours + event in §20.4; customer/contract/invoice source-of-truth statements also need reconciliation.
- **Retention challenge:** audit logs are 5 years in NCA section and 2 years in data-management section; contract, financial and inspection-media periods differ by section.
- **Regulatory challenge:** BRD references NAQL/TGA, Tajeer, SAMA, PDPL, NCA and ZATCA obligations without attached authoritative legal/API evidence or version dates.
- **Architecture challenge:** BRD alternates Azure AD B2B and Azure AD B2C terminology; identity boundary must be decided.
- **Delivery challenge:** offline e-check, 10TB+ media, 500 concurrent users and 99.9% availability create material architecture/operational cost that has not been sized.
- **Process challenge:** “real-time” integration is not defined by latency, consistency, or acceptable stale data; business release gates need explicit semantics.

## 11. Prioritized discovery backlog

Scoring uses impact (I), urgency/risk (U), uncertainty (Un) on 1–5; score = I + U + Un. Scores are prioritization aids, not validated estimates.

| ID | Discovery item / output | Evidence activity | Owner to confirm | I/U/Un | Score | Exit criterion |
|---|---|---|---|---:|---:|---|
| D-01 | Lock product scope, users, MVP and non-goals | Sponsor/Operations workshop; scope decision record | Sponsor + Operations | 5/5/5 | 15 | Signed scope and release boundary |
| D-02 | Validate regulatory obligations and authoritative sources | Compliance/Legal review with current references | Compliance/Legal | 5/5/5 | 15 | Approved obligation/control matrix |
| D-03 | Establish source-of-truth and integration contracts | Architecture + IT/API inventory; failure workshop | IT + Integration owners | 5/5/5 | 15 | Catalogue of systems, owners, contracts, SLAs |
| D-04 | Observe dealer-agent and showroom workflows | At least 5 structured interviews plus field observation target | Product/Research | 5/4/5 | 14 | Validated journey, pain points and baseline times |
| D-05 | Validate corporate-customer journey and fleet use cases | Interviews with corporate buyers/authorised signatories; document review | Sales/CS | 5/4/5 | 14 | Journey, roles, fleet/bulk requirements |
| D-06 | Resolve policy contradictions | Decision log for availability, timeout, retention, sync and identity | Product + IT + Legal | 5/5/4 | 14 | No conflicting normative requirements remain |
| D-07 | Define MVP contract/quote/approval state model | Cross-functional event/state workshop | Operations + Finance | 5/4/4 | 13 | Approved state transitions and exception rules |
| D-08 | Validate e-check offline/media feasibility | Device/connectivity spike and field test | Architecture + Ops | 5/4/4 | 13 | Tested capture/sync design and limits |
| D-09 | Define finance, tax, payment and settlement rules | Finance process walkthrough and sample reconciliation | Finance | 5/4/4 | 13 | Signed calculation and reconciliation examples |
| D-10 | Define tenant isolation and access-control matrix | Role/permission/data-scope workshop; negative-test scenarios | IT + Security | 5/4/4 | 13 | Approved RBAC/ABAC and test catalogue |
| D-11 | Establish baseline metrics and instrumentation plan | Analytics/support data audit | Product + Operations | 4/4/5 | 13 | Baselines, targets, event taxonomy and dashboard owner |
| D-12 | Confirm data lifecycle and privacy operating model | Data inventory, DPIA-style workshop, retention matrix | Privacy + Legal | 5/4/4 | 13 | Data map, purpose, retention and request workflows |
| D-13 | Define launch/support/incident readiness | Service design and pre-mortem | IT Ops + Support | 4/4/4 | 12 | SLA, severity, runbooks and rollback criteria |
| D-14 | Validate incentive/points rules and business value | Dealer/Operations review with worked examples | Operations + Finance | 3/3/4 | 10 | Approved rules or explicit deferral |
| D-15 | Validate accessibility/localisation/content | Arabic/English content and WCAG review | UX + Compliance | 4/3/3 | 10 | Content standards and acceptance tests |

Recommended sequence: D-01–D-03 first; D-04–D-06 in parallel; then D-07–D-13; D-14–D-15 can proceed as capacity permits unless incentives or localisation are launch gates.

## 12. Readiness assessment

Readiness: **Not ready for architecture/build approval; ready for structured discovery continuation.**

The BRD is rich in desired scope and technical targets, but it lacks validated user evidence, an agreed MVP, authoritative regulatory/API confirmation, resolved contradictions, named owners, operational baselines and tested feasibility for offline media capture and integrations. Architecture work may proceed only as a hypothesis inventory and dependency catalogue until the first discovery gate decisions are approved.

## 13. Source traceability

- Project scope, operating model, assignments, gates and safety constraints: PROJECT-CHARTER.md.
- Objectives, stakeholders, success criteria, regulatory requirements, workflows, integrations, scale, NFRs and glossary: CCP BRD v1.0, sections 1–22.
- No interviews, analytics, support exports, contracts, API specifications, legal opinions, architecture diagrams, cost estimates or named operational owners were supplied with the source set.
