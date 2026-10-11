# Corporate Customer Portal — Validation Gates 2–3 Source-of-Truth, State and Integration Pack

Date: 2026-10-11
Status: Validation output; proposed decisions are not approvals
Prepared by: dynamic-worker-2 (temporary Software Architect + Integration Architecture capability)
Scope: Phase 1.5 Validation Gates 2 (source of truth/state) and 3 (provider/API evidence)

## 1. Evidence discipline and decision posture

This pack is an implementation-oriented decision instrument, not proof that an API, regulatory obligation, provider behavior, legal interpretation, or production control exists.

Labels used throughout:

- Source evidence: explicit in the supplied BRD or current project artifacts. It is a claim to validate unless an authoritative contract, policy, or test is attached.
- Proposed decision: recommended working model for the controlled Phase 1 corporate dealer pilot. It becomes authoritative only when the named owner accepts it in the decision record.
- Validation needed: no sufficient evidence is present; do not implement or release on assumption.
- Conflict: source artifacts disagree. No silent normalization is permitted.

Reviewed: PROJECT-CHARTER.md; 00-phase1-consolidated-gate.md; 01-discovery-product.md; 02-architecture-baseline.md; 03-security-pdpl-review.md; 04-phase1.5-workplan.md; 05-scope-mvp-decision-pack.md; source CCP BRD v1.0.

Current readiness: GREEN for controlled validation/design and synthetic-data contract testing; AMBER/RED for production build, real personal data, production credentials, regulatory claims, and provider-backed release.

## 2. Recommended authority model

The portal is the system of workflow truth for dealer-originated pilot work, but it is not automatically the master or legal authority for every fact. External systems remain authoritative only for facts explicitly accepted through provider evidence and an owner decision.

| Domain / fact | Authoritative owner candidate | Portal responsibility | Proposed status | Accountable owner / acceptance |
|---|---|---|---|---|
| Dealer company, showroom, membership | Auto Lead organisation/governance registry | Versioned scoped projection; deny-by-default if stale | Proposed; BRD says portal admin, ownership conflicts | Auto Lead Operations + IT |
| User authentication and MFA context | Approved enterprise IdP | Validate token; map principal to effective scope; no password store | Validation needed; BRD alternates B2B/B2C | IT/Identity + Security |
| Vehicle specification/ownership | AutoLease Core | Read projection with source version/time | Proposed by BRD/architecture; API absent | Auto Lead Fleet + IT |
| Vehicle availability/reservation | One agreed reservation owner; candidate AutoLease | Hold intent/reference; never claim reservation from cache | Unresolved P0 | Fleet Operations + Integration |
| Approved rates/products | Auto Lead rate governance; publication mechanism to be confirmed | Immutable versioned copy and quote snapshot | Proposed; BRD splits Admin upload and AutoLease | Operations + Finance |
| Corporate origination profile | Portal until accepted/synced; downstream master to confirm | Consent, duplicate review, lifecycle, source references | Unresolved | Operations + Privacy + D365/AutoLease owners |
| Contract workflow before external registration | Portal | Own versioned workflow, approvals, documents, audit and release gates | Proposed for pilot | Operations + Legal/Compliance |
| Registered contract status | Tajeer or AutoLease, only after evidence of legal/system ownership | Projection plus provider reference and reconciliation | Unresolved P0 | Compliance/Legal + Operations |
| Driver authorisation | TAMM or approved government source | Request/status projection and evidence reference | Validation needed | Operations + Compliance |
| Signature/document evidence | Portal/DMS owner to be selected | Hash, immutable manifest, version and retention/hold metadata | Unresolved P0 | Legal/Compliance + IT |
| Inspection media bytes | Approved object/document store | Evidence metadata, manifest, checksums, lock status | Proposed; residency/immutability absent | Security/Privacy + IT Ops |
| Invoice/tax document | D365/ZATCA after accepted posting/reporting; portal draft before posting | Calculation snapshot, posting/reporting status, no blind retry | Unresolved P0 | Finance + Tax/Compliance |
| Payment settlement | Gateway transaction plus D365 ledger | Intent/status/allocation projection and exception queue | Validation needed | Finance + Payment owner |
| Fines/violations | Actual authority/feed source | Match proposal and charge/dispute workflow | Validation needed; BRD names Saher/RTA | Operations + Compliance |
| Insurance/assessment outcome | Contracted insurer/accredited assessor | Case, evidence and billable projection | Validation needed | Fleet/Operations + Legal |
| Notifications/delivery | Approved messaging provider receipt | Message intent, template/version, delivery state | Validation needed | Operations + Privacy |
| Audit evidence | Append-only controlled audit/evidence store | Emit actor, scope, before/after, reason, correlation, outcome | Proposed; retention unresolved | Security/Privacy + Compliance |

Interim rule: until acceptance, external status is an observed provider fact, portal status is a workflow projection, and neither is silently substituted for the other.

## 3. Conflict and reconciliation rules

1. Every aggregate stores provider name, external ID, source version/watermark, observed-at time, correlation ID and operation ID where applicable.
2. A provider assertion cannot move a domain aggregate unless the callback/request matches the expected tenant, operation, contract/version and allowed transition.
3. Newer timestamps do not automatically win. Authority and version precede recency; clock semantics must be evidenced.
4. Reference-data conflicts quarantine the affected record, retain both payloads and create a reconciliation case. Do not overwrite an accepted quote/rate snapshot.
5. Vehicle allocation is fail-closed when reservation authority is unavailable, stale beyond an approved TTL, or contradictory. A manual override requires named authority, reason and audit event.
6. Contract conflicts create `ExternalStatusConflict`; no activation, closure or amendment proceeds until an owner resolves it.
7. Financial conflicts reconcile by invoice/payment/settlement reference, amount, currency, tax period and ledger posting. Ambiguous write outcomes become `PostingUnknown` or `PaymentUnknown`; no blind retry.
8. Duplicate callbacks/messages are idempotently acknowledged only after payload identity and semantic equality checks. Same key with different payload is an error and security signal.
9. Late or out-of-order messages are retained and evaluated against event version/sequence. They cannot regress a terminal state without an approved compensating action.
10. Provider outage creates visible pending/unknown state and queue ownership. Manual fallback is prohibited unless regulation, contract and authority are evidenced.
11. Reconciliation jobs must produce counts, mismatches, aging, owner, next action and closure evidence. “No errors returned” is not reconciliation.
12. Any conflict affecting legal release, tax reporting, money movement, customer identity, vehicle ownership or evidence integrity blocks the relevant release gate.

## 4. Canonical state machines (proposed, validation required)

External provider enums must be mapped through adapters; they must not become the portal's canonical enums without contract evidence. Every transition is authorized, invariant-checked, idempotency-keyed, audit-emitted and correlated.

### 4.1 Quote

`Draft → Shared → Accepted → Converted`

Exceptional: `Draft/Shared → Rejected | Expired | Cancelled`.

Invariants: accepted quote references exact version/hash, customer and rate snapshot; validity and approval conditions are evaluated at conversion; expired/rejected versions cannot convert.

### 4.2 Approval case

`NotRequired → Pending → Approved | Rejected | ChangesRequested → Pending`

Exceptional: `Pending → Escalated | Withdrawn`; `Approved → Superseded` if the bound quote/contract version changes.

Invariants: maker-checker separation; approver authority is evaluated for the exact amount, discount, fleet size, credit result and terms; a changed version invalidates prior approval.

### 4.3 Contract

`Draft → PendingApproval → ApprovedPendingSignature → SignedPendingRelease → Active → PendingCheckIn → PendingSettlement → Closed`

Exceptional: `Draft/PendingApproval → Cancelled`; `Approved* → Rejected | Cancelled`; `Active → Suspended` only under accepted policy; `Active → EarlyClosurePending → PendingCheckIn`; `PendingSettlement → DisputedSettlement` for held items; `SignedPendingRelease → ReleasePending` when an asynchronous mandatory gate is outstanding.

`Amended` is a version/effective-date marker, not a replacement lifecycle state. Every state binds a contract version, customer, vehicle, rate/tax snapshot and required evidence manifest.

### 4.4 Vehicle

`Available → Reserved → OnLease → PendingReturn → Available`

Other source/projection states: `InMaintenance`, `InTransit`, `AccidentRepair`, `WriteOff`, `Decommissioned`.

Invariants: one active reservation/lease per vehicle under the authoritative reservation owner; hold expiry is explicit; portal cache never grants allocation authority.

### 4.5 Provider operation

`Created → Queued → InFlight → Succeeded | FailedRetryable | FailedPermanent | PendingProvider | Unknown → Reconciled | ManualAction | Cancelled`

`Unknown` means side effect may have occurred and forbids blind retry. `Succeeded` means provider evidence meets the operation's success contract, not merely HTTP acceptance or message enqueue.

### 4.6 Invoice and payment

Invoice: `Draft → UnderReview → Issued → PartiallyPaid | Paid | Overdue | Disputed → UnderReview → CreditNoteIssued | WrittenOff`; `Draft → Cancelled`.

Posting side-state: `PostingPending | PostingUnknown | Posted | PostingRejected`.

Payment: `Created → RequiresAction → Authorized → Captured | CaptureUnknown | Failed | Refunded | RefundUnknown | Chargeback`; settlement: `Unmatched → Matched → Reconciled | Exception`.

No duplicate capture, refund, tax submission or posting is allowed when result is unknown.

### 4.7 Inspection/evidence

`SessionCreated → Capture → Uploading → SyncPending → Validating → CompleteLocked`

Exceptional: `Capture/Uploading/SyncPending → FailedRecoverable | Expired | Conflict | ManualReview`.

Completion requires all mandatory objects, metadata, checksum/manifest, server receipt and session authorization. Partial media is never a completed baseline.

### 4.8 Customer/verification

`PendingVerification → Active`; exceptional `PendingVerification → Rejected | ManualReview`; active can become `Suspended | Blacklisted | Inactive | Anonymised` only under accepted policy and evidence.

Credit/identity result states must preserve provider result, timestamp, validity/expiry and consent/lawful-purpose reference; timeout is pending, not pass.

## 5. Release gates: synchronous versus asynchronous

A release gate is a business decision, not a transport property. The table is a proposed classification for workshop acceptance.

| Gate / operation | Proposed mode | Release rule | Evidence needed before implementation |
|---|---|---|---|
| Authenticate and authorize agent | Synchronous | Valid issuer/audience/signature/expiry, current membership and scope; otherwise deny | Identity topology, token profile, MFA/step-up, lifecycle and negative tests |
| Customer consent and required profile validation | Synchronous | Required fields, purpose/consent version and duplicate policy pass | Approved data map, notice/consent text, duplicate and identity contract |
| SIMAH/identity/credit result | Sync if provider guarantees bounded response; otherwise async hold | Valid non-expired result; timeout/pending never passes | API contract, consent, validity, adverse/manual-review semantics, SLA |
| Catalogue/rate read | Read projection | Source version/effective date known; stale display visible | Schema, publication/version rules, freshness/TTL decision |
| Vehicle reservation | Synchronous business gate | Authoritative reservation token/reference and expiry obtained | Reservation API semantics, race/timeout/idempotency tests, owner decision |
| Quote acceptance/conversion | Synchronous portal transaction | Exact version/hash, validity, approvals and customer reference bound | Acceptance evidence, signature/identity assurance decision |
| Approval decision | Synchronous portal transaction | Authorized maker-checker decision for exact version and authority band | Approved matrix, SoD, escalation and audit tests |
| Signature/document completion | Synchronous evidence gate | Approved signature/acceptance evidence and immutable document hash | Provider/DMS contract and qualified Legal/Compliance acceptance |
| Tajeer registration | Asynchronous provider operation unless contract proves bounded sync | `Active` only after accepted success evidence; otherwise `RegistrationPending` | Current API/manual process, required fields, registration outcome semantics, deadlines, legal owner |
| TAMM driver authorization | Sync only if bounded acceptance; otherwise async block | Release blocked unless required authorization success is evidenced | Current interface, identity/consent, retry/expiry/revocation semantics |
| E-check capture/sync | Capture may be offline; completion is server gate | `CompleteLocked` only after validation of all required evidence | Device/MDM, protocol, tamper/replay/cleanup tests, legal evidence decision |
| Vehicle release/checkout | Synchronous composite gate | approvals + signature + reservation + e-check + mandatory authorizations + policy checks all pass | Worked transition examples and exception authority |
| Customer notification | Async advisory, except where policy makes proof mandatory | Do not block core release unless explicit policy requires delivery; show delivery state | Consent/channel/template/receipt/retention evidence |
| Invoice draft calculation | Synchronous portal transaction | Immutable calculation snapshot and Finance review state | Worked examples, rounding/VAT/tax decisions |
| D365 posting | Async command with unknown outcome | Invoice remains posting pending/unknown until provider reference and reconciliation | Endpoint/auth/schema/idempotency/error/reconciliation contract |
| ZATCA reporting/status | Async unless authoritative current requirement says otherwise | Do not claim tax/reporting completion from enqueue; retain payload/response/status | Current technical/regulatory specification and acceptance evidence |
| Payment capture/refund | Async intent/webhook/reconciliation | Unknown blocks duplicate retry and settlement finality | Gateway contract, webhook verification, idempotency, settlement files and Finance approval |
| Fines/insurance/assessment | Async case | Holds/charges remain pending until source evidence and review policy pass | Source/feed or provider contract, accreditation/authority evidence, matching and dispute rules |
| Contract closure | Synchronous composite decision over async facts | All mandatory invoices, disputes, fines, assessment, payment/refund, Tajeer/TAMM and release conditions reconciled | Finance/Operations/Legal state table and closure examples |

Default Phase 1 recommendation: support quote-to-draft-contract and controlled handoff; keep registration, payment, tax posting and other provider-backed activation pending/out of scope until evidence closes.

## 6. Provider/API evidence register (Gates 2–3)

No row below is “closed” from the BRD alone. A provider pack must contain: accountable owner; current contract/terms and version/date; OpenAPI/schema or authoritative interface description; environment/sandbox and test access path; authentication/signing and key rotation; data dictionary/classification; residency/subprocessors/DPA and deletion support; rate limits/SLA/maintenance; timeout/error/retry semantics; idempotency and duplicate behavior; callback/webhook verification; reconciliation/reporting; manual fallback and escalation; sample success/failure/unknown payloads using synthetic data; and contract-test evidence.

| Provider / domain | Exact evidence to obtain | Gate / owner | Current status and safe interim posture |
|---|---|---|---|
| AutoLease Core | Vehicle/rate/customer/contract schemas; ownership and reservation semantics; event/pull cadence; version/watermark; availability race and expiry; write idempotency; error/maintenance/SLA; sandbox and reconciliation extracts | Integration + Fleet/Operations | BRD proposes AutoLease for vehicle/rates and portal for contracts; conflict unresolved; projection only, allocation blocked if stale |
| D365 Finance/CRM | Exact endpoint/entity/version; customer/invoice/journal/payment mapping; posting/duplicate/unknown semantics; auth; tax/accounting ownership; batch/event cadence; sandbox data and balance reconciliation | Finance + D365 owner | BRD asserts roles but no contract; no production posting or ledger claim |
| Tajeer | Current integration/manual channel; required fields and statuses; lessor authority; registration/amendment/termination/damage semantics; deadlines; callback/polling; rejection/duplicate behavior; legal owner and test environment | Compliance/Legal + Operations | BRD describes mandated behavior; no authoritative API/legal evidence; registration pending until accepted result |
| TAMM | Driver/vehicle authorization interface; identity and consent; request status, expiry and revocation; sync/async semantics; failure/manual process; audit/reference requirements | Operations + Compliance | BRD says real-time API; unverified; release blocked where authorization is required |
| SIMAH | Commercial/individual products; consent/lawful basis; request/result schema; score/decision validity; caching limits; manual review/adverse action; retention/deletion; SLA and sandbox | Finance/Risk + Privacy/Legal | BRD says 30-day cache and mandatory check; validation-needed; timeout is pending |
| ZATCA/FATOORA | Current applicable phase/technical specification; invoice formats, signing, UUID/sequence/QR; reporting/clearance/status; rejection and duplicate semantics; certificate/key custody; sandbox; retention and tax owner | Finance + Tax/Compliance | BRD contains unverified tax/retention claims; preserve payload/status, no compliance claim |
| Identity / enterprise IdP | Tenant/federation topology; B2B/B2C decision; OIDC/OAuth metadata; issuer/audience/algorithm/key rotation; MFA/step-up; provisioning/deprovisioning; session/revocation; service identities; test tenants | IT/Identity + Security | B2B/B2C conflict; deny-by-default and synthetic users only |
| Payments | Merchant/acquirer/gateway contract; MADA/Visa/Mastercard/Apple Pay applicability; auth/capture/refund/chargeback; webhook signature/replay; idempotency; PCI boundary; settlement files; unknown outcomes; reconciliation and support | Finance + Payment owner + Security | BRD lists methods but gives no provider; no real capture/refund |
| Messaging (SMS/email/WhatsApp) | Approved channels/provider; consent and opt-out; template/version ownership; OTP assurance; delivery receipts; attachment/document sharing; retries/DLQ; data residency/subprocessors; retention and suppression | Operations + Privacy | Async advisory by default; no sensitive payload until approved |
| Fines / traffic authority feeds | Actual authority/feed (BRD names Saher/RTA/Muroor); schema/cursor/file/API; plate/time matching; correction/reversal; source reference; cadence/SLA; dispute/late fine behavior; manual import controls | Operations + Compliance | Source not evidenced; ingest to review queue only |
| Insurance providers | Provider/accreditation; policy verification fields and effective dates; claim submission/status/payout; deductible/coverage semantics; auth/webhook/file; evidence retention; settlement reconciliation | Fleet/Operations + Legal | API/file is only a BRD assertion; case remains pending/manual |
| Assessment providers | Accredited-centre registry/eligibility evidence; report schema; assessor identity; photos/estimate/body map; second-assessment/dispute process; signatures and retention; API/file/manual workflow | Operations + Compliance/Legal | Accreditation and interface unverified; no charge finalization from unverified assessment |
| Document/object/DMS | Region/residency; immutability/versioning/WORM; checksum; malware scanning; scoped access; lifecycle/hold/delete propagation; DPA/subprocessors; size limits and restore test | IT Ops + Security/Privacy | Proposed object storage only; synthetic media and no public links |

Evidence acceptance rule: a document or verbal assertion is not enough for a release-critical integration. The owner must identify the exact version/date, approve the mapping and demonstrate at least success, timeout, duplicate, malformed, authorization failure, provider rejection and ambiguous-outcome tests.

## 7. Implementation contract and observability requirements

Every integration operation must record: operation ID, business idempotency key, provider, endpoint/action and version, tenant/scope, request schema hash, redacted payload reference, correlation/causation IDs, attempt count, started/completed times, HTTP/transport result where applicable, provider reference, mapped status, next retry time, owner queue, and reconciliation disposition.

Required platform behavior: transactional outbox; inbox dedupe; provider adapter/anti-corruption layer; bounded timeouts; classified retry; circuit breaker; DLQ with authorized replay; callback signature/freshness/replay verification; redaction; dashboards by provider and state; alerting on aged pending/unknown/conflict; manual action with maker-checker where financial/legal release is affected.

The portal must expose state reason and next action to operators. “Success” must mean a domain-specific acceptance contract, never HTTP 200, queue acceptance, or a provider request ID by itself.

## 8. Workshop agenda (Gates 2–3)

Duration: 2.5 hours; facilitator: Architecture; decision recorder: PM/BA; required participants: Sponsor delegate, Operations/Fleet, Integration/IT, Finance, Security, Privacy, Legal/Compliance, Identity, D365/AutoLease owners and provider owners where available.

1. 10 min — Confirm Phase 1 boundary, evidence labels, decision rights and no-build/no-real-data guardrails.
2. 20 min — Walk the recommended authority model; mark each row Accept / Reject / Conditional / Evidence-needed.
3. 25 min — Vehicle, rate, customer, contract and document source-of-truth decisions; resolve portal versus AutoLease/D365/Tajeer boundaries.
4. 30 min — Execute quote → approval → signature → reservation → e-check → registration → release state walkthrough with happy path and timeout/duplicate/conflict examples.
5. 20 min — Agree synchronous, asynchronous, advisory and fail-closed gates; identify where manual fallback is legally/operationally allowed.
6. 35 min — Review provider/API evidence register; assign named owners, due dates, evidence format, sandbox/test path and acceptance authority for each row.
7. 15 min — Finance/tax/payment unknown-outcome and reconciliation examples; confirm no blind retry rules.
8. 15 min — Security/privacy review of data minimisation, consent, identity, callbacks, media/evidence and residency evidence.
9. 10 min — Record unresolved decisions, blockers, assumptions and next gate entry criteria.

Workshop outputs: signed decision log; owner/date/evidence register; approved state/transition tables; release-gate matrix; conflict/reconciliation examples; provider contract-test plan; risk acceptance or explicit deferral.

## 9. Acceptance criteria for Gates 2 and 3

Gate 2 is accepted only when:

- Every release-critical fact has an accepted authoritative owner or an explicitly recorded unresolved decision.
- Quote, approval, contract, vehicle, invoice, payment, provider operation and evidence states have transition tables, invariants, terminal/exception states and authorization rules.
- Synchronous versus asynchronous release semantics are approved for each pilot operation, including timeout, duplicate, stale, late and unknown outcomes.
- Conflict, reconciliation, manual queue, override and compensation authority is named and tested with worked examples.
- State changes bind the exact version/hash and emit auditable, idempotent events with correlation IDs.

Gate 3 is accepted only when:

- Every integration in the pilot has a named business/technical owner and current contract or an approved sandbox/stub boundary.
- Current API/schema/version, authentication, data classification, residency/DPA, rate/SLA, error/retry, idempotency, callback and reconciliation evidence is attached or explicitly marked missing.
- Synthetic contract tests cover success, timeout, duplicate, malformed, unauthorized, throttled, provider-rejected and ambiguous side-effect outcomes.
- Government, tax, identity, credit, payment, messaging, fines, insurance and assessment claims remain validation-needed until the accountable qualified owner accepts authoritative evidence.
- No production credential, real personal data, payment data or regulatory/compliance claim is used to close a gate.
- Readiness is reported as validation/design ready only; production build approval remains blocked by the consolidated P0 list.

## 10. Unresolved decisions and handoff

1. Is Tajeer or AutoLease the authoritative registered-contract status source, and what exact event constitutes registration acceptance?
2. Is AutoLease the reservation authority, and can it provide atomic reservation/idempotency semantics suitable for a release gate?
3. Who owns the customer master after activation, and how are duplicate corporate identities reconciled across Portal, AutoLease and D365 CRM?
4. Which identity topology is approved, and are corporate representatives non-authenticated participants in Phase 1?
5. Which signature mechanism and evidence standard is accepted for the pilot?
6. Which TAMM action is mandatory for release, and is its success synchronous or an asynchronous accepted status?
7. What exact finance/tax/payment behavior is in pilot scope, including D365 posting, ZATCA status and real payment exclusion?
8. What authority and evidence allow manual fallback for each provider outage or unknown outcome?
9. Which actual fines, insurance and assessment providers/feed sources are contracted and in scope?
10. What retention, residency, DPA/subprocessor and deletion/hold evidence applies to each provider and media store?

Recommended handoff: Worker 3 should challenge this pack against identity/tenant, finance, offline/evidence and PDPL blockers; sponsor/Operations should accept or reject the authority and release model before implementation planning proceeds.

## 11. Traceability

- Scope and pilot posture: 05-scope-mvp-decision-pack.md §§2–5, 7–11.
- Architecture/context and initial source-of-truth proposals: 02-architecture-baseline.md §§3–8, 10–13.
- Security/privacy P0 blockers and API evidence requirements: 03-security-pdpl-review.md §§8–10, 12–18.
- Gate sequence and completion rule: 04-phase1.5-workplan.md §§1–5.
- Discovery conflicts and BRD source claims: 01-discovery-product.md §§8–12 and source CCP BRD v1.0 §§2–5, 8–12, 17–21.
- Consolidated production-readiness blockers: 00-phase1-consolidated-gate.md §§67–80.

Final status: Gates 2–3 package produced for workshop and evidence collection. It is not an approval, certification, legal opinion, or provider capability commitment.
