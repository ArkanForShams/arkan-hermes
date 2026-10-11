# Corporate Customer Portal — Validation Gate 1
# Sponsor Scope and MVP Decision Pack

Date: 2026-10-11
Status: Sponsor decision pack — recommendations, not approvals
Prepared by: dynamic-worker-1 (Product Manager + Business Analyst capability)
Sponsor: Shams Tabrez
Source evidence: PROJECT-CHARTER.md; 01-discovery-product.md; 02-architecture-baseline.md; 03-security-pdpl-review.md; 00-phase1-consolidated-gate.md; source CCP BRD v1.0.

## 1. Executive recommendation

Proceed with a controlled, dealer-facing corporate pilot rather than a broad “customer portal” or full leasing platform. The recommended Phase 1 MVP is a thin, auditable quote-to-contract workflow for a small, explicitly selected dealer cohort, with corporate-customer onboarding performed through dealer-assisted flows. The MVP should prove operational value and the authorization/integration boundaries without claiming production regulatory compliance or implementing the full service, finance, individual, or customer-self-service surface.

This is a recommendation for sponsor decision, not an approved scope. The evidence base contains no interviews, usage/support baselines, capacity/cost model, provider contracts or current legal opinions. Architecture and security documents explicitly deny production-build approval until P0 evidence is closed.

Recommended decision posture: approve the boundary for validation and synthetic-data/controlled pilot design; do not approve production implementation, regulatory claims, or real-customer-data use until the required gates below are accepted by accountable owners.

## 2. Product boundary

### Product being validated

A multi-tenant dealer-agent operating portal for Auto Lead’s corporate leasing origination. It helps authorised dealer staff create and manage corporate quotes, obtain required approvals, prepare/sign contracts, and hand off a controlled vehicle-release/e-check workflow. Auto Lead retains policy, master-data and central-operation control unless a signed source-of-truth decision says otherwise.

The title “Corporate Customer Portal” is not evidence that a direct customer self-service portal is intended. The BRD instead describes an “Auto Lead Dealer Agent Portal” serving corporate and individual customers. This pack resolves the working boundary only by recommendation; Shams must decide the product name and boundary explicitly.

### Primary users

1. Dealer Agent — primary daily operator; creates quotes, captures corporate information, progresses approvals and coordinates contract/e-check steps.
2. Showroom Manager — approves within authority, manages queues and exceptions, and monitors branch throughput.
3. Auto Lead Operations — controls policies, approved catalogue/rates, central queues, release gates and exceptions.

Secondary users for the pilot: Dealer Company Admin (membership and scoped visibility), Finance/Compliance reviewers (read/review and evidence functions required by the pilot controls). Corporate customer authorised representatives are participants in the business journey, but are not recommended as authenticated portal users in Phase 1.

### Experience model: dealer versus direct corporate customer

Recommended Phase 1 experience:

- Dealer-facing web/tablet experience is the system’s primary UI.
- Dealer staff conduct corporate onboarding, quote preparation and status coordination.
- Corporate representatives receive controlled quote/contract outputs and complete the explicitly approved acceptance/signature handoff through the selected mechanism; they do not receive a general portal account in Phase 1.
- Any document exchange or notification channel must be confirmed by Operations, Security/Privacy and Legal/Compliance; do not infer that email, messaging or a signature scan is legally sufficient.
- Direct corporate login, self-service fleet management, invoices, disputes and support are out unless Shams selects the broader option and the identity/privacy evidence is produced.

Rationale: this follows the architecture recommendation and reduces unresolved B2B/B2C identity, tenant-sharing, consent, support and data-rights complexity. Trade-off: it limits self-service value and may leave dealer-assisted administration in place.

### Individual-customer treatment

Recommendation: exclude individual customers from Phase 1 MVP and pilot data. Keep individual-customer data model and future journey as a separately gated option, not an implicit extension of the corporate workflow. Individual leasing introduces materially different identity, credit, consent, signature, payment, fraud and customer-support requirements. It must not be enabled merely because the BRD lists it.

No legal or regulatory conclusion is made here. Compliance/Legal must determine whether any shared model, data processing, notices, verification or signature treatment is permissible before individual scope is reconsidered.

## 3. Recommended Phase 1 MVP

### In scope for validation/build planning

A. Organisation, identity and access
- Approved enterprise/dealer identity flow for pilot users.
- Dealer-company/showroom/agent scope enforcement and central-operations roles.
- MFA/session/revocation behavior only after the identity topology and policy are approved.
- Tenant, object, report and export authorization matrix with negative-test cases.

B. Corporate customer onboarding
- Corporate profile and authorised-signatory capture sufficient for the pilot journey.
- Required document metadata and controlled document handoff; use synthetic data until privacy/security gates permit otherwise.
- Duplicate review, consent/purpose capture and verification status as approved by Compliance/Privacy.
- No assumption that the portal becomes the authoritative enterprise customer master.

C. Catalogue, pricing and quotation
- Approved vehicle/rate/service projection with version/effective-date traceability.
- Itemised price, VAT/discount inputs as approved by Finance, and total-term calculation.
- Quote versions, validity, sharing, acceptance reference and conversion to a draft contract.
- No authoritative rate or availability ownership is assumed until the source-of-truth workshop closes it.

D. Approval, contract and handoff
- Configurable approval thresholds and maker-checker separation.
- Versioned contract draft, document generation and selected signature/acceptance handoff.
- Explicit pending/unknown/error states for provider operations; never treat queueing as registration or approval success.
- Contract state and release-gate table agreed by Operations, Finance, Security/Privacy and Legal/Compliance as applicable.

E. Evidence and operations
- A controlled e-check capture/sync feasibility spike using synthetic data and approved test devices.
- If the pilot includes production e-check, only capture for an already authorized session unless business/legal/security owners explicitly approve more offline actions.
- Audit events, correlation IDs, integration operation status, reconciliation/manual queues and operator-visible errors.
- Basic pilot dashboards: eligible users, quote funnel, approval age, errors, pending operations and evidence-sync outcomes.

F. Pilot readiness
- Feature flag/cohort controls, support owner, incident severity and rollback procedure.
- Contract/API inventory and sandbox/contract-test evidence for each integration actually used.
- No production regulatory certification claim; no unvalidated provider behavior presented as a committed capability.

### Explicitly out of Phase 1 MVP

- Individual-customer journey, retail self-service and individual customer authentication.
- General direct corporate customer portal account, fleet self-service, invoices, settlements, disputes or customer support portal.
- Full active-lease servicing: amendments, swaps, extensions, maintenance, insurance, incidents and claims.
- Full fines ecosystem and autonomous charge/dispute decisions.
- Production payment capture, refunds, chargebacks, D365 posting or tax filing unless separately evidenced, approved and included by decision.
- Loyalty/points tiers, redemption and incentive settlement.
- Broad reporting warehouse, cross-dealer benchmarking beyond authorized pilot views, and unrestricted exports.
- GCC/multi-country rollout, non-KSA residency assumptions, and autonomous manual fallback for regulated operations.
- Production offline permissions beyond the approved e-check trust model.
- Claims of PDPL/NCA/other regulatory compliance or legal enforceability based solely on the BRD.

## 4. Phase 1 pilot cohort

Recommended cohort: 1–2 authorised dealer companies, 2–4 showrooms total, and a small named set of trained dealer agents and showroom managers; one Auto Lead Operations group should act as the central control team. Use a single agreed corporate leasing product/rate family and a constrained vehicle pool. Keep the cohort small enough for observed workflow testing, manual reconciliation and rapid rollback.

This is a cohort shape, not an approved participant list. The sponsor and Operations owner must select the actual cohort and confirm contractual permission, training, support coverage, device/connectivity conditions, and whether any real customer data may be used. Until Privacy/Security/Legal evidence is accepted, use synthetic data and test/sandbox integrations only.

Pilot entry criteria:
- Named dealer companies, showrooms, roles and accountable operational owner.
- Approved pilot use cases and excluded workflows.
- Identity/access and tenant negative tests passed.
- Current integration/API evidence for the pilot path, or an explicitly approved stub/sandbox boundary.
- Data classification, notice/consent, retention and test-data decision recorded.
- Support, incident, rollback and reconciliation runbooks exercised.

## 5. Outcomes and success metrics

No baselines were supplied. The targets below are proposed pilot acceptance hypotheses, not commitments. Product and Operations must baseline them before final target approval.

| Outcome | Proposed pilot metric | Proposed threshold / observation |
|---|---|---|
| Faster, less error-prone origination | Median time from quote start to approved contract draft; rework rate | Baseline first; target at least 25% faster than current observed process and <10% avoidable rework, subject to evidence |
| Reliable quote/approval flow | Eligible quotes reaching a valid approved contract draft | At least 80% completion in pilot, with every failure classified and no silent state loss |
| Pricing/control integrity | Quotes using approved rate/version and authorized discount | 100% of sampled pilot transactions; zero unexplained price/version mismatch |
| Tenant and authorization safety | Cross-tenant/object/role negative-test attempts | 100% blocked in test catalogue; zero confirmed pilot leakage |
| Operational recoverability | Integration operations with visible status, idempotency and reconciliation outcome | 100% of pilot-path failures classified; zero duplicate business side effects in tested scenarios |
| E-check feasibility | Mandatory evidence objects synced and locked without unsafe completion | Target to be set after device/network spike; no incomplete evidence treated as complete |
| User usability | Agent/showroom task success and post-task rating | At least 80% observed task success; baseline and sample size set by Product/Research |
| Pilot service health | Availability/error/queue age for the pilot path | Set SLO after workload and support assessment; do not inherit conflicting 99.5%/99.9% BRD values |

Required instrumentation: quote start/version/share/accept/convert, approval submit/decision, contract state transitions, provider operation/pending/unknown/reconciliation, e-check capture/upload/sync/lock, authorization denials, error class, support issue and rollback events. Metrics must be scoped and privacy-reviewed.

## 6. Non-goals and guardrails

- This pack does not approve legal, regulatory, privacy, accounting, tax, signature or evidentiary interpretations.
- It does not declare the BRD’s retention, residency, availability, session timeout or integration assertions correct.
- It does not choose B2B versus B2C identity topology, source-of-truth ownership, payment/tax treatment or release semantics by implication.
- It does not authorize real personal data, production credentials, production integrations or production rollout.
- It does not commit budget, staffing, launch date or a microservices/Kubernetes implementation.
- It does not make the e-check evidence legally admissible; qualified counsel/Compliance must decide the applicable standard.

## 7. Decision options for Shams

### D1 — Product boundary

A. Recommended: dealer-facing corporate quote-to-contract pilot; dealer-assisted corporate participant; individual and direct self-service deferred.
B. Broader: corporate dealer portal plus authenticated direct corporate customer experience; requires identity, privacy, support and customer-journey evidence before commitment.
C. Full BRD breadth: corporate and individual, dealer and direct customer, servicing/finance/loyalty; not recommended for Phase 1 because evidence, risk and delivery boundary are insufficient.

Recommendation: choose A.

### D2 — Individual customers

A. Recommended: out of Phase 1 and pilot; create a separate validation track.
B. Include a controlled individual slice; requires distinct requirements, identity/credit/privacy/legal review and named funding/owner.

Recommendation: choose A.

### D3 — Pilot posture

A. Recommended: synthetic-data/non-production validation first, then a small controlled pilot only after P0 entry criteria.
B. Real-data pilot before all P0 gates; not recommended and unsupported by current evidence.
C. Defer pilot until all full-platform requirements are specified; safer but loses learning and increases scope risk.

Recommendation: choose A.

### D4 — Release capability

A. Recommended: quote-to-draft-contract and controlled handoff; provider registration/payment/settlement remain pending or out unless contracts and approvals close.
B. Include end-to-end activation and registration in pilot; requires current provider APIs, release semantics, source-of-truth and legal/operational acceptance.

Recommendation: choose A.

### D5 — Architecture commitment

A. Recommended: retain the proposed modular monolith with ports/adapters, async integration workers, outbox/inbox, object storage and explicit state/reconciliation patterns.
B. Commit to microservices/event-first now; requires scale, team ownership, operational and cost evidence not supplied.

Recommendation: choose A.

## 8. Decisions still required and named owners

“Owner” below means accountable decision role; names and dates must be confirmed in the sponsor decision record.

| Decision / question | Recommended interim position | Accountable decision owner | Required evidence / acceptance |
|---|---|---|---|
| Product name, boundary and D1 option | D1-A | Shams Tabrez (Sponsor) | Written decision with in/out scope and pilot cohort |
| Individual-customer treatment | D2-A | Shams + Auto Lead Operations | Explicit inclusion/exclusion record; Legal/Privacy review if reconsidered |
| Direct corporate authentication | Dealer-assisted only for MVP | Shams + IT/Identity owner | Identity topology, MFA, provisioning and customer-access decision |
| Pilot cohort and real-data permission | Small cohort; synthetic until cleared | Auto Lead Operations + Privacy/Security | Named cohort, training/support, data-use approval |
| Tenant/role/privilege model | Deny-by-default, scoped access | IT/Security owner | Approved matrix, SoD/break-glass design and negative tests |
| Regulatory, PDPL, signature and evidence interpretation | Validation-needed | Auto Lead Compliance/Legal | Current authoritative references, notices/consent, DPIA/PIA decision, legal sign-off where material |
| Vehicle/rate/contract source of truth | Unresolved; no unsafe assumption | IT/Integration + Operations | Provider contracts/API specs and signed source-of-truth/reconciliation matrix |
| Quote/approval/activation state semantics | Proposed states only | Operations + Finance + IT | Approved transition table, exception authority and worked examples |
| Finance/tax/payment scope | Out unless separately approved | Finance owner | Calculation, tax, posting, payment/refund and reconciliation examples |
| Offline e-check permissions | Capture-only spike default | Security/Privacy + Operations + Legal/Compliance | Device/network/tamper test, retention/evidence decision and residual-risk acceptance |
| Availability, timeout, retention and residency | Unresolved contradictions | IT Ops + Security/Privacy + Legal/Compliance | Approved SLO/policy matrix and evidence plan |
| Pilot support, incident and rollback | Required before entry | IT Ops/Support owner | Runbooks, severity/on-call, dashboards, restore/recovery rehearsal |

## 9. Unresolved questions that block final MVP approval

1. Is the sponsor approving a dealer-agent product under the “Corporate Customer Portal” name, or a direct customer portal?
2. Which dealer companies/showrooms and corporate use cases are the pilot cohort, and who authorizes their participation?
3. What exact corporate customer fields, documents, signatory authority and verification steps are necessary for the pilot?
4. Which identity topology applies to Auto Lead, dealers and any corporate participants? Are customer accounts prohibited in Phase 1?
5. Which system owns vehicle availability/reservation, rate governance, customer master, contract status and document/signature evidence?
6. Which provider interfaces are actually required for the pilot, and do owners provide current specifications, sandboxes, test data and failure semantics?
7. Is contract signature/handoff legally and operationally acceptable for the selected pilot process, and what evidence must be retained?
8. What is the approved approval matrix, state transition table and manual-exception authority?
9. What finance/tax/payment behavior is required to call the pilot successful, if any?
10. What offline e-check actions are permitted, on which managed devices, with what local-storage and evidence controls?
11. Which PDPL purposes, notices/consent, controller/processor roles, data-subject workflows and retention/hold rules apply?
12. What are the pilot baseline process time, drop-off, rework, support, error and queue metrics?
13. What availability, performance, recovery, support hours and rollback thresholds are affordable and testable for the pilot?
14. What budget, team capacity and target decision date constrain the recommended boundary?

## 10. Acceptance criteria for Gate 1

Gate 1 can be marked complete only when all of the following are evidenced:

- Sponsor has selected and recorded the product boundary option, individual-customer treatment, direct-customer posture and pilot posture.
- In-scope, out-of-scope, non-goals, primary users and pilot cohort are explicit and internally consistent.
- Every open decision has an accountable owner, target date, required evidence and acceptance authority; legal/regulatory items remain validation-needed until qualified approval.
- A pilot data-use decision distinguishes synthetic data, test data and any permitted real data; no personal data or production credentials are used without explicit approval.
- Success metrics have named owners, event definitions, baselines or a dated baseline plan, and pilot thresholds.
- MVP journey/state and release gates are reconciled with architecture, security and privacy blockers.
- Required provider/API, identity, source-of-truth, finance, offline, retention and operational evidence is tracked in the Phase 1.5 programme.
- Sponsor accepts residual risks and the explicit readiness status: validation/design ready; production build not approved until P0 gates close.

## 11. Current readiness and handoff

Readiness: AMBER/RED for production; GREEN for continued controlled validation and sponsor decision-making.

Recommended next actions after sponsor decision:
1. Record Shams’s D1–D5 decisions and name accountable owners/dates.
2. Run the source-of-truth/state workshop and identity/tenant workshop in parallel.
3. Establish the regulatory/API evidence register and privacy data/retention decision log.
4. Run the synthetic-data e-check device/network spike and finance worked examples.
5. Re-baseline pilot metrics through observed dealer workflows before committing targets.
6. Return to the consolidated gate with evidence; do not convert this recommendation into build approval by silence.

Traceability: the recommendation narrows the discovery backlog D-01, D-02, D-03, D-04, D-05, D-06, D-07, D-08, D-09, D-10, D-11, D-12 and D-13; it carries forward the architecture boundary in 02-architecture-baseline.md §11 and the P0 blockers in 03-security-pdpl-review.md §17 and 00-phase1-consolidated-gate.md §67–80.
