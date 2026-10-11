# Corporate Customer Portal — Phase 1 Architecture Baseline

Status: Proposed baseline for architecture gate; not build approval
Date: 2026-10-11
Prepared by: dynamic-worker-2 (Software Architect + Integration Architecture lens)
Evidence reviewed: PROJECT-CHARTER.md, 01-discovery-product.md, and source `CCP BRD v1.0`.

## 1. Executive position and challenge to discovery

The supplied material describes a dealer-agent leasing portal with corporate and individual journeys, a separate operational database, and many external dependencies. It is not yet sufficiently evidenced for a production microservices/Kubernetes commitment or for regulatory compliance claims. This baseline therefore recommends a domain-oriented modular monolith with explicit ports/adapters, an outbox-backed integration layer, and asynchronous workflows. The design keeps extraction paths open without paying the operational cost of distributed services before boundaries and ownership are validated.

Important challenges carried forward from discovery:

- Product scope is unresolved: “Corporate Customer Portal” conflicts with a dealer portal covering corporate and individual customers. Individual and any direct customer self-service experience are excluded from the Phase 1 build boundary until D-01 is decided.
- The BRD's Azure AD B2B/B2C terminology conflicts. The identity topology and whether customers authenticate are open decisions, not architecture facts.
- Availability, session timeout, sync frequency, and retention requirements conflict across the BRD and must be resolved by named owners.
- The BRD names government, credit, tax, payment, and enterprise interfaces but provides no authoritative API specifications, SLA, legal opinion, credentials, or version dates. All such integrations below are validation items.
- “Real-time” is replaced here by explicit consistency classes: synchronous gate, asynchronous command, or replicated/read-only data. Release gates must never infer success from eventual delivery.

## 2. Recommended architecture style

Recommended: domain-oriented modular monolith, hexagonal/ports-and-adapters inside the application, plus an integration gateway/worker tier and object storage for media. Use a relational transactional store for operational records, an append-only audit/event log, and a message broker for durable asynchronous work. Prefer a single deployable business core initially; separate deployment units only where scaling, isolation, or ownership evidence justifies it.

Why this fits the evidence:

- Core workflows (quote, approval, contract, e-check, settlement) need transactional invariants and explainable state transitions.
- The team has not yet proven independent service boundaries, team ownership, or traffic patterns. Microservices now would add distributed transaction, observability, deployment, and contract-versioning cost.
- Integrations are numerous and failure-prone; ports/adapters plus an anti-corruption layer prevent external models from leaking into the domain.
- Media capture has different storage and bandwidth characteristics from transactional data, so it should be an explicit media subsystem, not database blobs.

Options considered:

1. Microservices/event-first: strong independent scaling and isolation, but premature; increases operational and consistency complexity and needs mature platform ownership.
2. Conventional layered monolith: simpler, but risks direct controller/repository coupling and external-model leakage as workflows grow.
3. Recommended modular monolith + async integration workers: preserves transactional clarity and a migration path to services. Trade-off: initial shared runtime/database requires strict module boundaries and may limit independent scaling.

Non-negotiable dependency rule: domain modules do not import HTTP, ORM, broker, cloud SDK, or provider types. Application services invoke ports; adapters translate external contracts; repositories are module-owned. Cross-module calls use application interfaces or published domain events, never tables owned by another module.

## 3. Bounded contexts and context map

| Context | Responsibility / invariants | Initial form | Upstream/downstream relationship |
|---|---|---|---|
| Identity & Organisation | Users, dealer-company/showroom hierarchy, role/scope, effective membership; deny cross-tenant access | Module | Enterprise IdP upstream; all contexts consume signed principal/scope |
| Customer & Consent | Corporate/individual profile, duplicate review, KYC status, consent versions, document metadata | Module | Portal owns origination record; identity/verification providers are external validation sources |
| Catalogue & Fleet Projection | Vehicle/rate/service read models, effective dates, allocation/reservation invariants | Module | AutoLease is proposed upstream for vehicle master/status; Auto Lead governance upstream for rates |
| Pricing & Quotation | Quote versions, price snapshots, validity, discount rules, acceptance/conversion | Module | Consumes approved catalogue/rates; publishes accepted quote |
| Contract & Approval | Contract aggregate, authority matrix, signatures, amendments, activation/release gates | Module | Owns dealer-originated lifecycle until explicitly accepted by system-of-record agreement |
| E-Check & Evidence | Offline-capable inspection session, immutable evidence manifest, baseline comparison, media references | Module + media adapter | Contract/Fleet consume completed inspection; object store owns bytes, portal owns evidence metadata |
| Operations & Incidents | Service, damage, assessment, insurance, fines, dispute holds | Module | External providers are translated through adapters; finance consumes billable outcomes |
| Billing & Settlement | Invoice lines, tax calculation inputs, payment allocation, settlement and reconciliation status | Module | D365/payment/ZATCA contracts are external; no direct provider schema in domain |
| Incentives | Points ledger, tier evaluation, disputes, redemption request | Module (P1/P2) | Consumes committed activation/revenue events; finance may settle outside portal |
| Integration Control Plane | Outbox/inbox, provider operation records, correlation, retries, DLQ, reconciliation jobs | Shared platform module | Downstream adapter boundary; never owns business truth |
| Reporting & Audit | Read projections, operational reports, immutable audit evidence, exports | Read model / platform | Subscribes to domain facts; no write-back to source aggregates |

Context mapping: Portal-to-provider adapters are anti-corruption layers. External identifiers and provider statuses are stored as references plus mapped status, not as the domain's canonical enum. Events are facts (`ContractActivated`, `InvoiceIssued`), not commands disguised as events. At-least-once delivery is assumed; consumers are idempotent.

## 4. Source-of-truth matrix

“Source of truth” means authoritative owner for the named fact, not merely the latest copy. Items marked validation needed are architecture assumptions.

| Data/fact | Proposed authoritative owner | Portal responsibility | Consistency / reconciliation | Evidence status |
|---|---|---|---|---|
| Dealer company/showroom/agent relationship | Auto Lead governance / agreed organisation registry | Enforce scoped projection and effective membership | Versioned import; quarantine conflicting changes | BRD says Portal Admin owns dealer master; validate enterprise owner |
| User authentication | Approved enterprise identity provider | Map principal to roles/scopes; no password store | Token validation; periodic membership sync | IdP topology unresolved |
| Vehicle specification/ownership | AutoLease Core | Cached projection with source version | Event + scheduled full/delta reconciliation; block unsafe allocation on stale status | BRD explicitly proposes AutoLease; cadence conflicts |
| Vehicle availability/reservation | Must be one agreed owner; proposed AutoLease reservation API with portal reservation intent | Hold reference and local workflow state | Compare reservation tokens; compensate expiry; manual queue on conflict | Critical unresolved decision |
| Rates/products | Auto Lead rate governance | Versioned approved copy and price snapshot | Publish event + checksum/version check; never overwrite referenced versions | Split BRD ownership (admin upload vs AutoLease) |
| Customer origination profile | Portal until accepted/synced; downstream master ownership to confirm | Duplicate review, consent, lifecycle and source reference | Idempotent upsert; exception queue for identity collision | Discovery/BRD proposal; validate with D365/AutoLease |
| Contract lifecycle | Portal for dealer workflow until activation; AutoLease/Tajeer authoritative for registered external status | Own workflow history, release gates, provider refs | State projection from provider; reconcile daily/after event | Ownership explicitly unresolved at boundary |
| Signature/document evidence | Portal/DMS agreed owner | Hash, immutable manifest, retention/hold metadata | Hash and reference reconciliation; no silent replacement | DMS/API not supplied |
| Inspection media/evidence metadata | Portal | Immutable inspection record and media manifest | Object-store checksum, resumable upload, orphan scan | Architecture recommendation |
| Invoice/tax document | D365/ZATCA after posting/reporting; portal before posting | Draft calculation, line-item snapshot, posting status | Financial reconciliation by invoice ID/amount/tax period; no auto-retry of ambiguous posting | BRD asserts D365/ZATCA roles; authoritative contracts absent |
| Payment settlement | Payment gateway transaction plus D365 ledger | Payment intent/status and allocation projection | Provider settlement file/API vs ledger; unmatched cash queue | Payment model/API unknown |
| Fines/violations | Authority/feed source | Match proposal, charge/dispute status | Replayable ingestion, duplicate key, manual unmatched queue | Source and feed not evidenced |
| Audit evidence | Append-only audit store with controlled retention | Emit complete actor/action/before-after/correlation evidence | Hash/immutability verification and export test | Retention conflicts require legal decision |

## 5. C4 textual architecture

### C1 — System context

Actors: Dealer Agent, Showroom Manager, Dealer Admin, Auto Lead Operations/Finance/Compliance, and (scope decision pending) Corporate/Individual Customer. The Corporate Customer Portal supports origination and lease operations. It exchanges identity and organisation assertions with an enterprise IdP; vehicle/rate/customer/contract information with AutoLease and/or D365; registrations/authorisations with Tajeer/TAMM; credit/identity checks with approved providers; invoices/payments with D365, tax and payment providers; notifications through approved channels; and fines/insurance/assessment data through agreed providers.

External systems are not assumed available or compliant until their owners provide contracts and test environments.

### C2 — Containers

- Bilingual web/PWA client: guided quote, contract, e-check, queues, dashboards; offline storage limited to approved inspection data and encrypted device policy (validation needed).
- Portal API/application: modular domain use cases, authorization checks, transaction boundaries, workflow state machines.
- Integration gateway/workers: provider adapters, translation, idempotency, retries, circuit breakers, provider operation ledger, reconciliation.
- Relational operational database: module-owned tables, aggregate state, outbox/inbox, workflow data, references and projections.
- Object/document storage: inspection media and generated documents; immutable manifest, checksum, lifecycle/hold metadata.
- Message broker: durable domain/integration messages, retry topics and DLQ; not the source of truth.
- Read/reporting store: projections and exports isolated from OLTP workloads; rebuildable from facts where feasible.
- Audit/evidence store: append-only, access-controlled audit events and export package metadata.
- Observability/security platform: logs, metrics, traces, alerting, SIEM integration subject to validation.

### C3 — Component view of the portal application

API edge → authentication/authorization middleware → use-case façade → bounded-context modules. Context modules contain aggregates, policies, repositories (ports), and domain-event publishers. An outbox dispatcher publishes committed facts. Integration workers consume commands, call adapters, record provider operation results, and publish mapped completion/failure facts. Read projections consume facts asynchronously. Controllers never call provider SDKs or repositories directly.

Key component contracts: `QuotePricingPort`, `CustomerVerificationPort`, `VehicleAvailabilityPort`, `ContractRegistrationPort`, `DriverAuthorisationPort`, `InvoicePostingPort`, `PaymentPort`, `NotificationPort`, and `MediaObjectPort`. Each port has a versioned internal contract and explicit timeout/error taxonomy.

## 6. Data model domains

- Organisation: DealerCompany, Showroom, UserPrincipal, RoleAssignment, ScopeGrant, FleetPool.
- Customer: Customer, CorporateProfile, IndividualProfile, AuthorisedSignatory, Driver, Consent, VerificationCase, CustomerDocumentRef.
- Catalogue/fleet: Vehicle, VehicleSpecification, VehicleComplianceSnapshot, RateTable, RateVersion, Product, ServicePackage, AvailabilityProjection, Reservation.
- Commercial: Quote, QuoteVersion, PriceComponent, Discount, ApprovalCase, Acceptance.
- Contract: Contract, ContractVersion, ContractParty, ContractVehicle, ContractDriver, Signature, ContractDocumentRef, Amendment.
- Evidence: Inspection, InspectionItem, DamageObservation, ChecklistResult, EvidenceObject, MediaManifest, SyncSession.
- Operations: ServiceRequest, Incident, DamageAssessment, InsuranceClaim, Fine, Dispute, Hold.
- Finance: Invoice, InvoiceLine, TaxSnapshot, PaymentIntent, Payment, CreditNote, Settlement, SettlementLine, ReconciliationCase.
- Incentives/reporting: PointsLedgerEntry, TierPeriod, RedemptionRequest, read projections.
- Platform: OutboxMessage, InboxReceipt, IntegrationOperation, RetryAttempt, DeadLetter, ReconciliationRun, AuditEvent, DataRequest, RetentionHold.

Rules: monetary values use integer minor units plus currency; timestamps are UTC with business timezone rendered explicitly; external IDs are namespaced by provider; PII is separated from operational references where practical; immutable snapshots preserve the rate/tax/contract/evidence inputs used in a decision. Every tenant-scoped aggregate carries an organisation scope and is checked server-side and at the data layer where supported.

## 7. Contract and state model

### Contract lifecycle (proposed; BRD state names normalized)

`Draft → PendingApproval → ApprovedPendingSignature → SignedPendingRelease → Active → PendingCheckIn → PendingSettlement → Closed`.

Exceptional terminal paths: `Draft/PendingApproval → Cancelled`; `Approved* → Rejected/Cancelled`; `Active → EarlyClosurePending → PendingCheckIn`; `PendingSettlement → DisputedSettlement` (hold); `Active → Suspended` only if policy permits. `Amended` is a version/effective-change marker, not a replacement lifecycle state.

Release gate for `SignedPendingRelease → Active`: required approvals, valid contract/signature, vehicle reservation, e-check complete, driver authorisation where required, and registration submission/acceptance semantics agreed. If a provider is asynchronous, state is `RegistrationPending` and release policy must explicitly decide whether operation is allowed; never infer success from enqueueing.

### Other key states

- Quote: `Draft → Shared → Accepted → Converted`, with `Expired` and `Rejected`; acceptance must reference exact version/hash.
- Customer: `PendingVerification → Active`, or `Suspended/Blacklisted/Inactive/Anonymised`; anonymisation must preserve legal operational references.
- Vehicle: source projection states `Available/Reserved/OnLease/InMaintenance/InTransit/AccidentRepair/WriteOff/Decommissioned`; provider version and observed time are mandatory.
- Invoice: `Draft → Issued → PartiallyPaid/Paid/Overdue/Disputed`; dispute may lead to `UnderReview → CreditNoteIssued` or upheld `Issued`; ambiguous provider results become `PostingUnknown`, not a duplicate retry.
- Inspection: `Capture → Uploading → SyncPending → CompleteLocked`; failures are resumable and never partially treated as a completed baseline.

Every transition is command-authorized, invariant-checked, audit-emitted, idempotency-keyed, and associated with actor/correlation/time. State machines should be executable from a transition table and contract-tested.

## 8. Integration catalogue and failure/reconciliation patterns

| Integration | Initial mode | Failure pattern | Reconciliation / manual path | Validation item |
|---|---|---|---|---|
| Enterprise IdP / organisation | Sync token + membership projection | deny-by-default on invalid token; stale membership alert | periodic membership diff; access review queue | B2B/B2C, provisioning, MFA/session policy |
| AutoLease Core | async events + scheduled pull; sync gate for availability if API supports | timeout/circuit breaker; outbox retry; stale projection blocks risky actions | watermark/checksum full compare; duplicate/conflict queue | API, owner, SLA, reservation semantics, cadence |
| D365 Finance/CRM | async commands/events | idempotency key; ambiguous response becomes unknown; no blind retry | invoice/payment/CRM crosswalk and balance reconciliation | exact endpoints, posting semantics, ownership |
| Tajeer | async registration command with status polling/webhook if supported | retry only provider-declared transient errors; DLQ; registration deadline alert | portal-vs-provider status report, operator remediation | current API/legal requirements and release gate |
| TAMM | synchronous or async command | block release if mandated; explicit manual escalation | request/reference reconciliation; expired authorisation queue | API availability, allowed fallback |
| SIMAH | synchronous request with cached validity | timeout means pending, not pass; no stale use beyond policy | request/result hash and expiry report | contract, consent, retention, SLA |
| Identity/CR verification | synchronous or async case | pending/manual review; rate limit and provider outage queue | match source reference and verification timestamp | provider/API and lawful basis |
| ZATCA/FATOORA | async reporting/status | preserve signed payload; no duplicate submission; quarantine rejection | invoice register vs accepted/rejected/status report | exact phase/format/authority requirements |
| Payment gateway | payment intent + webhook/reconciliation file | webhook dedupe; timeout unknown; never repeat capture without status lookup | gateway settlement vs D365 vs portal ledger; unmatched cash queue | payment methods, chargeback/refund policy |
| Fines/RTA/Saher | scheduled pull/file | replay from cursor; schema quarantine | dedupe by source reference; unmatched plate/time queue | actual source/feed and SLA |
| Insurance/assessment | API/file/manual case | case state pending; evidence attachment retries | claim/assessment register vs portal incidents | accreditation/legal/API assertions |
| SMS/email/WhatsApp | async notification command | provider retry/DLQ; user-visible delivery state | provider delivery receipts and suppression list | channels, consent, templates, retention |
| Object/document store | signed/resumable upload | checksum retry; orphan cleanup; quota alert | manifest-to-object inventory and document hash check | residency, immutability, retention/hold |

Cross-cutting patterns: transactional outbox; inbox dedupe by provider/message ID; idempotency key per business operation; exponential backoff with jitter only for classified transient failures; circuit breaker; bounded timeout; DLQ with replay tooling; correlation/causation IDs; provider operation ledger; reconciliation jobs with watermarks and reports; operator-approved compensating actions. Compensation is a business action, not a database rollback across systems.

## 9. NFR design mapping

| NFR theme | Baseline design response | Acceptance/validation needed |
|---|---|---|
| Availability/reliability | Stateless API replicas, managed DB HA/backup, broker durability, provider isolation, health/readiness, tested restore and failover | Resolve 99.5 vs 99.9, exclusions, RTO/RPO, DR region/ownership |
| Performance | Indexes and bounded queries, cache only non-authoritative/reference data, async reports/media, load tests at agreed envelope | Confirm concurrency and p95 workload; test offline sync and 5MB media assumption |
| Scale/cost | OLTP/report separation, object storage for media, partition/archive strategy, worker concurrency controls | Validate 200k contracts/10TB and cost model; do not infer from BRD alone |
| Security/access | Central authorization policy, tenant scope in every use case/query, defense-in-depth row policies where supported, secret/key manager, least privilege, audit privileged actions | Security/privacy worker and platform review; exact control obligations/version dates |
| Privacy/data lifecycle | data inventory, purpose/consent versioning, minimised logs, PII tokenisation/separation, export/anonymisation workflow, legal holds | Legal retention/residency/erasure decisions; no regulatory claim yet |
| Auditability | append-only audit event with actor, action, target, before/after or diff, reason, correlation, source; tamper/immutability controls | retention, access, export and evidentiary requirements |
| Offline field work | encrypted local queue, bounded media, per-object checksum, resumable upload, conflict policy (server decision + operator queue), visible sync state | device/browser/storage/connectivity spike; decide permitted offline actions |
| Usability/localisation | AR/EN resource keys, RTL tests, domain errors mapped to actionable bilingual messages, accessible component library | WCAG/device/browser and Arabic legal/content review |
| Maintainability | module dependency tests, API/event contract tests, migration discipline, ADRs, CI quality gates, feature flags | team ownership, coverage target, release/change process |
| Observability | structured logs without raw secrets/PII, metrics per state/provider, traces with correlation/causation, dashboards and alerts | on-call, severity, SLO and runbook decisions |

The BRD targets are hypotheses until workload tests and owner decisions approve them. No regulatory control is certified by this document.

## 10. ADR shortlist

1. **ADR-001 — Modular monolith versus microservices**: choose modular monolith + workers for Phase 1; revisit after measured scale/ownership evidence.
2. **ADR-002 — System-of-record and reservation authority**: decide AutoLease versus portal for vehicle availability and contract authority; define conflict semantics.
3. **ADR-003 — Identity topology and customer access**: resolve enterprise B2B/B2C terminology, customer authentication, MFA, provisioning, session policy.
4. **ADR-004 — Integration consistency and release gates**: classify each provider operation as synchronous gate, async pending, or advisory; define manual fallback authority.
5. **ADR-005 — Offline e-check trust boundary**: define device encryption, media limits, tamper evidence, conflict handling, and allowed offline transitions.
6. **ADR-006 — Financial/tax ownership**: decide calculation, invoice numbering, tax document signing/reporting, D365/ZATCA authority and reconciliation cadence.
7. **ADR-007 — Data lifecycle and evidence retention**: resolve conflicting retention statements and legal hold/anonymisation semantics.
8. **ADR-008 — Media/document platform**: object/document store, immutability, residency, lifecycle, retrieval and cost tiering.
9. **ADR-009 — Event and API contract governance**: event envelope/versioning, schema registry policy, compatibility and replay rules.
10. **ADR-010 — Reporting architecture**: rebuildable projections versus warehouse dependency, freshness and export requirements.

## 11. Phased delivery boundary

Phase 1 architecture/build recommendation (subject to D-01): dealer-facing corporate quote-to-contract thin slice for one pilot cohort, with organisation/tenant access, customer onboarding and consent, catalogue/rate projection, pricing/quote versioning, approval, contract draft/signature handoff, integration control plane, audit, and a tested e-check capture/sync spike. Include contract and provider status visibility; do not promise provider registration without validated interfaces.

Phase 1 explicitly excludes until decisions/evidence exist: individual customer journey, direct customer portal/authentication, full in-service/fines/insurance ecosystem, points redemption, broad reporting warehouse, production regulatory certification, multi-country/GCC expansion, and autonomous manual fallback.

Phase 1.5: pilot hardening—offline e-check production path, vehicle reservation/availability, Tajeer/TAMM integration, document/media lifecycle, notification delivery, operational dashboards, reconciliation queues, DR/restore tests, and finance sample reconciliation.

Phase 2: billing/D365/payment/tax workflows, settlement and disputes, service/fines/insurance, customer-facing access if approved, incentives, advanced reporting, and scaled rollout. Sequence each integration only after contract/API/security/legal validation.

Exit gates: approved scope and owner matrix; system-of-record decisions; provider contracts/test access; state/approval tables; security/privacy review; representative load/offline tests; runbooks and reconciliation playbooks; sponsor acceptance of residual risks.

## 12. Architecture risks and mitigations

| Risk | Impact | Mitigation / trigger |
|---|---|---|
| Scope ambiguity (corporate vs individual/customer portal) | rework and unsafe authorization model | ADR/scope decision before build; separate personas and data journeys |
| Unverified regulatory/API claims | non-compliant or blocked release | Compliance/API evidence register; contract tests; label all claims validation-needed |
| Conflicting source-of-truth ownership | duplicate contracts, vehicle double allocation, financial mismatch | owner matrix and provider operation ledger; reconciliation before launch |
| Offline media integrity/cost | disputed handover evidence, storage/latency blowout | field spike, checksums, immutable manifests, quotas, explicit offline gate |
| Distributed workflow partial failure | premature release or duplicate charges | state machine + outbox/inbox + explicit pending/unknown states + operator queue |
| Tenant isolation defect | cross-dealer disclosure | centralized policy, DB defense-in-depth, negative tests, audit alerts |
| Financial/tax semantics unresolved | incorrect invoices/ledger/tax submissions | worked examples with Finance; dual reconciliation; no automatic posting assumptions |
| Retention/erasure conflict | legal or operational loss | legal decision matrix, holds, anonymisation boundary, retention enforcement tests |
| Over-architecting too early | delivery delay and operational burden | modular monolith; ADR triggers for extraction based on evidence |
| Provider availability/rate limits unknown | poor throughput and queue growth | synthetic tests, backpressure, circuit breakers, dashboards, manual runbooks |
| NFR targets unsized | cost or failed SLA | workload model, performance/DR/media tests and revised targets |

## 13. Open decisions and validation backlog

Highest priority: D-01 scope; D-02 regulatory evidence; D-03 source-of-truth/API inventory; D-06 contradictions; D-07 state model; D-08 offline/media feasibility; D-09 finance/tax/payment; D-10 tenant/access matrix; D-12 lifecycle/privacy; D-13 operations/readiness. Architecture gate should not treat any item as closed based solely on the BRD.

Evidence to obtain: current provider OpenAPI/schema and sandbox details; API SLAs/error semantics; legal/compliance citations and version dates; identity topology; D365/AutoLease ownership; representative master data; sample invoices/settlements; device/network test results; support/on-call model; cost and capacity model.

## 14. Traceability

- Charter: project identity, role assignment, sequential gates, Buzz channel, safety constraints.
- Discovery baseline: scope mismatch, unresolved decisions D-01–D-15, contradictions, readiness not yet build-approved.
- BRD: desired journeys, state/data entities, proposed technologies/integrations, NFR targets and event/error patterns.
- This baseline intentionally distinguishes proposed architecture from evidenced facts and does not certify regulatory, API, residency, or provider behavior.
