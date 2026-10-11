# Corporate Customer Portal — Adversarial Validation Gates 4–7 Review

Date: 2026-10-11
Status: Adversarial validation plan and challenge; not approval, certification, or legal opinion
Reviewer capability: Security Architect + Data Privacy Officer (temporary)

## 1. Decision and evidence posture

Read evidence: `PROJECT-CHARTER.md`, source `CCP BRD v1.0`, `00-phase1-consolidated-gate.md`, `01-discovery-product.md`, `02-architecture-baseline.md`, `03-security-pdpl-review.md`, `04-phase1.5-workplan.md`, `05-scope-mvp-decision-pack.md`, and `06-source-truth-state-integration-pack.md`.

Evidence means an explicit source statement. Proposed control means a design recommendation that is not yet implemented or tested. Validation-needed means the evidence needed to accept or reject it is absent. A BRD assertion, architecture pattern, owner suggestion, or verbal/provider claim is not closure evidence.

Overall outcome: Gates 4–7 are NOT CLOSED. Readiness is GREEN only for continued controlled validation/design and synthetic-data spikes; AMBER/RED for production build approval, real personal data, production credentials, provider-backed activation, payment/tax/settlement, production offline capture, and any PDPL/NCA/compliance claim.

P0 release blockers carried forward:

1. Scope and identity topology are unresolved (corporate-only dealer-assisted pilot is recommended, but not sponsor-approved; BRD alternates B2B/B2C).
2. Tenant, object, export, privileged-access and segregation-of-duties matrix is proposed but unapproved and untested.
3. Identity lifecycle, MFA/step-up, revocation/offboarding, service identities, PAM/JIT and break-glass controls lack evidence.
4. Finance/tax/payment/settlement source-of-truth, calculation semantics and unknown-outcome handling lack worked examples and provider contracts.
5. Offline e-check trust model, managed-device posture, local-key protection, manifest protocol, replay/tamper tests and evidence acceptance are absent.
6. PDPL data inventory, purpose/minimization/basis decision, notices, controller/processor roles, rights workflow, retention/legal-hold/deletion matrix and qualified review are absent.
7. Provider/API, residency, DPA/subprocessor, deletion and security evidence is missing for every release-critical integration.

No legal opinion is expressed. Current PDPL obligations, rights, retention, transfers, signature/evidence sufficiency, tax treatment and regulatory timelines remain validation-needed with qualified Auto Lead Compliance/Legal and accountable system owners.

## 2. Cross-cutting challenge to Gates 1–3

The packs correctly narrow Phase 1 and introduce explicit pending/unknown, reconciliation and synthetic-data guardrails. They still contain unsafe release assumptions if readers treat recommendations as approvals:

- The recommended dealer-facing corporate pilot is not a sponsor decision. A build must not silently implement direct customer, individual, or customer-account paths because the BRD contains them.
- “Portal workflow truth” is not authority for reservation, registration, tax, payment, settlement, signature, or evidence. Each fact needs an accepted owner and a tested mapping.
- `Active`/`Closed` transitions in the proposed state model are unsafe unless mandatory external gates and financial conditions are explicitly bound to the exact contract/version.
- “Capture may be offline” is not permission to store sensitive media locally. It requires managed-device, key, cache expiry, wipe, sync authorization and retention evidence.
- “Anonymised” is not deletion. It must specify fields, derived copies, indexes, audit, backups, DLQs, exports, providers, legal holds and re-identification testing.
- “System-wide” roles are not automatically legitimate broad access. Central operations must be purpose-bound, time-bound where possible, and independently reviewable.
- BRD figures conflict: B2B versus B2C; 15 versus 30-minute idle timeout; 99.5% versus 99.9% availability; vehicle sync every 15 minutes versus four hours plus events; audit retention 2 versus 5 years; media 5 years versus contracts/financial records 10 years; Tajeer/AutoLease and rate ownership; portal/D365/customer-master ownership. No implementation may normalize these silently.
- Provider success cannot mean HTTP 200, enqueue acknowledgement, request ID, or “no error.” It must satisfy a domain-specific acceptance contract and reconciliation evidence.

## 3. Gate 4 — Identity, tenant authorization and privileged access

### 3.1 Challenge and abuse cases

Threats to test adversarially:

- A dealer user changes tenant, showroom, customer, contract, fleet-pool, report or object identifiers in a request and obtains BOLA/IDOR access.
- A valid dealer credential is used to enumerate predictable IDs, search/export another dealer's records, access signed media URLs, or infer data from counts/errors/cache hits.
- A showroom manager approves outside threshold by changing amount, discount, fleet size, credit result, quote version or authority context after the approval decision.
- A dealer company admin grants self or colluding users central/system-wide scope, future-dated membership, or access to a different showroom.
- A central operator uses broad access for unbounded browsing, bulk export, or support impersonation without purpose, ticket, step-up, time bound or review.
- A stale token or cached membership survives suspension, dealer offboarding, role removal, or contract termination.
- A forged/misconfigured token passes due to wrong issuer, audience, algorithm, key set, tenant/federation claim, missing expiry/not-before, nonce/state or group-only role mapping.
- A background worker, reporting connection, migration, restore tool, cache, search index or DB owner bypasses API authorization or row-level policies.
- Mass assignment accepts hidden `role`, `tenant`, `scope`, `approved`, `status`, `amount`, `effectiveDate` or `breakGlass` fields.
- An agent account is shared; an administrator impersonates a user; a break-glass account is used without dual approval or retrospective review.
- Cross-tenant customer duplicate linking exposes KYC documents, signatory data or credit results without a defined sharing rule.

### 3.2 Required controls (proposed, not evidence)

1. Decide identity topology: Auto Lead workforce, federated dealer users, service identities, and the explicit Phase 1 posture for corporate representatives. Do not blend B2B/B2C by inference.
2. Define hierarchy and policy: Auto Lead → dealer company → showroom → agent, fleet pool and customer relationship. Every aggregate, command, query, export, event, cache key, object path, report and provider operation carries server-derived scope.
3. Validate tokens against allowlisted issuer, algorithm, keys, audience, expiry, not-before and relevant nonce/state; map effective membership from an authoritative registry, not group names alone.
4. Require MFA for all interactive access; phishing-resistant MFA/step-up for approvals, rate changes, exports, deletion/anonymisation, refunds/credit notes, role changes and break-glass.
5. Define joiner/mover/leaver ownership, approval, recertification cadence, stale-access alerting and hard deprovisioning SLA. Define session invalidation, one-session behavior if retained, recovery and support impersonation.
6. Separate tenant roles from global roles; use RBAC plus scope/attribute checks, maker-checker and effective dates. Central access is not unrestricted by default.
7. Use JIT/PAM for privileged access, time-bound elevation, separate administration, reason codes, session/audit capture where approved, dual control for high-impact changes and independent review of break-glass.
8. Enforce authorization at API/use-case and data layers. Prove coverage for ordinary connections, reports, workers, migrations, admin tools, restore, object storage, search and caches; do not rely on a privileged DB owner being constrained by row-level security.
9. Strict input schemas with allowlists and immutable server fields. Return generic authorization errors and avoid existence leaks.
10. Minimize and redact audit data; record actor, principal, effective role/scope, tenant, target, action, reason, before/after safe diff, correlation, outcome and source/device/IP only where justified.

### 3.3 Gate 4 evidence, owner and exact acceptance criteria

Accountable decision owner: IT/Identity owner + Security; business acceptance: Auto Lead Operations; Privacy acceptance for identity data: Privacy; sponsor accepts residual risk.

Required evidence:

- Signed identity topology and token/claim profile, including B2B/B2C decision and customer-account exclusion/inclusion.
- Versioned permission/data-scope matrix for every role × action × object × dealer/showroom/fleet/export/report scope, including SoD and break-glass.
- Provisioning/deprovisioning/recertification runbook with measured offboarding SLA and test records.
- MFA/step-up, session/revocation and support-impersonation design plus negative tests.
- Authorization test catalogue and results covering every API/use case and representative DB, worker, report, object, cache and export path.
- Independent review of central-operations and privileged access; PAM/JIT logs and break-glass exercise.

Gate 4 is accepted only when all are true:

- A request cannot widen scope by changing client-supplied tenant, role, object, status or approval fields; 100% of the negative catalogue is denied and logged.
- Cross-tenant, cross-showroom, object, report, search, export, signed-URL, cache and background-worker tests show zero unauthorized disclosure or mutation.
- Disabled, expired, removed and stale-membership principals are denied within the approved measured SLA; token issuer/audience/algorithm/key/expiry failures are denied.
- No user can approve their own proposal or approve a changed quote/contract/version outside authority; concurrent and threshold-splitting tests pass.
- Privileged/break-glass actions require approved elevation/reason, are time-bounded, emit immutable audit evidence and receive independent review.
- Evidence is attached, dated, reproducible in the approved test environment, and accepted by named owners. Until then: P0 open; no real-data pilot or production build.

## 4. Gate 5 — Finance, tax, payment and settlement invariants

### 4.1 Challenge and abuse cases

- Negative/zero/overflow monetary values, precision loss, currency confusion, VAT-base errors, discount order errors, pro-rata day-count differences and rounding divergence across portal/D365/tax outputs.
- Client changes price, rate version, tax rate, deposit, beneficiary, payment destination, settlement line, mileage or damage charge after approval.
- Effective-date overlap or rate mutation changes a quoted/accepted/signed contract; an approval is reused for a different version.
- Vehicle reservation race or timeout causes two contracts to allocate one vehicle; stale cache is treated as authoritative.
- Payment capture, refund, credit note, tax submission, D365 journal or settlement is retried after an ambiguous outcome and creates a duplicate side effect.
- Forged/replayed webhook, duplicate callback, same idempotency key with a different payload, out-of-order event or settlement file mismatch changes a terminal state.
- Disputed amount, legal hold, pending fine, unresolved damage, insurance proceeds or partially paid invoice is omitted to close early.
- Threshold splitting, collusive goodwill credit, unauthorized write-off, refund to changed beneficiary, or points/commission generated twice from duplicate activation.
- Manual operator fallback bypasses maker-checker or is treated as provider success without a source reference.

### 4.2 Required controls (proposed, not evidence)

1. Finance owns the signed calculation specification and worked examples. Use integer minor units, explicit currency, decimal policy, tax-category inputs, effective-dated rate/tax snapshots and deterministic rounding at each defined boundary.
2. Bind every quote, approval, contract, invoice, tax payload, payment intent and settlement to immutable version/hash snapshots, tenant, actor, authority band and correlation/idempotency keys.
3. Separate portal draft/calculation truth from D365 ledger, payment gateway transaction, settlement file and tax authority status. Never infer posting/reporting/capture from enqueue or HTTP success.
4. Maintain provider operation ledger and reconciliation by provider reference, invoice/payment/settlement reference, amount, currency, tax period and ledger posting. Unknown means unknown; no blind retry.
5. Verify callbacks cryptographically, with freshness/replay protection, semantic payload equality and expected tenant/operation/version/state. Quarantine conflicts.
6. Enforce one active reservation/lease per vehicle at the authority; stale/contradictory availability fails closed. Manual overrides require named authority, reason, expiry and audit.
7. Make settlement closure a composite gate: all required invoices in terminal/approved states, disputes/holds resolved or explicitly held, fines/assessments/insurance outcomes reconciled, D365/tax/payment references matched, refunds/payments settled, and release authority present.
8. Keep finance and approval roles separate; require step-up and dual control for refunds, credit notes, write-offs, beneficiary changes, rate publication and manual compensation.
9. Preserve immutable ledger entries and correction/compensation entries rather than mutable balances. Treat points as deferred/out of Phase 1 unless a signed ledger/invariant design exists.

### 4.3 Gate 5 evidence, owner and exact acceptance criteria

Accountable owner: Finance; tax acceptance: Finance/Tax/Compliance; payment acceptance: Payment owner + Security; D365 acceptance: D365 owner; Operations accepts release/closure semantics.

Required evidence:

- Signed source-of-truth and ownership matrix for rates, reservation, contract, invoice, tax, payment, settlement and points.
- Worked synthetic examples for standard, discount, VAT, pro-rata, partial payment, deposit, refund, credit note, damage, fine, insurance, early termination, write-off and dispute hold; expected outputs independently recomputed.
- Provider contracts/schemas and sandbox results for D365, ZATCA/tax and payment, including duplicate, timeout, rejection, throttling, webhook replay and ambiguous side-effect outcomes.
- Executable invariant/property tests and concurrency tests; reconciliation report samples and operator runbook.

Gate 5 is accepted only when:

- 100% of worked examples match independently approved expected results, including rounding and tax snapshots; no client field can alter server-calculated totals or tax inputs without an authorized versioned change.
- Duplicate capture/refund/posting/tax submission/settlement tests produce at most one business side effect; ambiguous outcomes remain `CaptureUnknown`, `RefundUnknown`, `PostingUnknown` or equivalent until reconciled.
- Reservation race/timeout tests never create two active allocations; stale/contradictory availability blocks release.
- Approval tests reject self-approval, threshold splitting, changed-version approval reuse, unauthorized goodwill/write-off and beneficiary changes.
- Closure tests cannot pass with unresolved disputes, holds, unmatched settlement, missing mandatory provider references or unbalanced D365 entries.
- Finance and qualified tax/compliance owners sign the exact rules; no tax or regulatory claim is made from the BRD alone.

Phase 1 safe interim posture: quote and draft-contract calculation only with synthetic data; no production capture, refund, tax submission, D365 posting, settlement finality or points redemption.

## 5. Gate 6 — Offline e-check feasibility and evidence integrity

### 5.1 Challenge and unsafe assumptions

The BRD requires photos, video, damage map, signatures, GPS/time and immutable checkout/check-in records, and also permits PWA offline capture. A browser/PWA cache on an unmanaged or rooted device is not automatically a trustworthy evidence store. “Checksum,” “encrypted queue,” “timestamp” and “uneditable video” by themselves do not prove origin, custody, context, completeness, or admissibility.

Abuse/failure cases:

- Lost, rooted, jailbroken or shared device exposes local media, keys, cached customer/contract data or session tokens.
- Agent changes clock/GPS, replaces media, omits mandatory objects, records another vehicle, or captures under a stale/removed authorization.
- Offline session is replayed, duplicated, synced to the wrong tenant/contract/vehicle, or synced after expiry to overwrite a newer baseline.
- Partial upload or object collision is marked complete; a derived thumbnail replaces original bytes; same checksum is trusted without session binding.
- Connectivity returns after provider state changed, contract was cancelled, vehicle reassigned or another inspection already completed.
- Deliberately poor evidence is locked to shift damage liability; operator manually bypasses missing media.
- Local deletion leaves recoverable remnants or backups; sync retries expose media through broad signed URLs or logs.

### 5.2 Required controls (proposed, not evidence)

1. Default production permission is capture-only for a server-issued inspection session already authorized for the exact tenant, contract, vehicle, actor, checklist and expiry. No offline approval, allocation, activation, payment, refund, registration, closure or financial/legal decision.
2. Prove supported device/OS/browser matrix, MDM enrollment, screen lock, OS storage encryption, secure key storage, remote wipe, app version enforcement, rooted-device handling, cache expiry and local quota.
3. Create server-issued session nonce and scope; use per-object encryption, authenticated integrity protection, sequence numbers, signed/hash-linked manifest, original/derived distinction, app/device version and capture metadata. Server receipt time must be distinct from claimed capture time.
4. Require all mandatory objects and metadata, validated file type/magic bytes, size/duration/dimensions, malware/content inspection, checksum/manifest match, session authorization and server receipt before `CompleteLocked`.
5. Reject replay, duplicate session, altered payload, same idempotency key with changed payload, wrong tenant/vehicle/contract, expired session, sequence gap and clock anomaly; quarantine for manual review.
6. Use private scoped storage, no public listing, short-lived single-object access, no sensitive URLs/logs, orphan cleanup and quota/backpressure. Preserve original bytes separately from derivatives.
7. Delete local data only after confirmed server persistence and approved retention/hold state; test forensic remnants, crash recovery and backup behavior.
8. Define operator exception policy with reason, authority, evidence of review and no silent completion. Obtain qualified Compliance/Legal decision on signature/evidence sufficiency; security controls do not establish legal admissibility.

### 5.3 Gate 6 evidence, owner and exact acceptance criteria

Accountable owners: Security + IT/MDM for device/key controls; Operations for workflow/exception authority; Privacy for local data/retention; qualified Compliance/Legal for evidence/signature sufficiency.

Required evidence:

- Device threat model and supported device/browser/OS matrix; MDM enrollment and remote wipe/version enforcement proof.
- Protocol specification for session issuance, manifest, sequence, encryption, sync, idempotency, receipt, lock and conflict states.
- Synthetic field test across online/offline/intermittent connectivity, low storage, app restart, clock/GPS anomalies, expired session and device loss.
- Adversarial tamper/replay/wrong-tenant/duplicate/partial-upload tests, local cleanup/forensic test and restore/backup test.
- Media inventory and retention/hold/deletion propagation design; exception runbook; qualified evidence/signature decision.

Gate 6 is accepted only when:

- No offline action can transition a contract, vehicle, payment, tax, registration or settlement into a release state; server rejects expired/stale/wrong-scope/replayed sessions.
- `CompleteLocked` occurs only when all mandatory configured objects, metadata, manifest, checksums, server receipts and current authorization pass; missing/partial/conflicting evidence cannot complete.
- Tampering, replay, duplicate, sequence gap, wrong tenant/vehicle, clock anomaly and partial upload tests are detected and quarantined with no unsafe side effect.
- Local media is encrypted with device-protected keys, expires/cleans after confirmed persistence, and no test finds recoverable sensitive remnants outside the approved retention model.
- Evidence manifests and originals are immutable/versioned, operator exceptions are separately audited, and residual offline risk is explicitly accepted by named owners.

Phase 1 safe interim posture: synthetic-data prototype/spike only; production e-check and real media remain blocked.

## 6. Gate 7 — PDPL data mapping, retention, rights and deletion

### 6.1 Data minimization and mapping challenge

The BRD collects high-impact identity, KYC, signatory, driver, credit, payment, contract, signature, location, photos/video, device and audit data. It asserts explicit consent, KSA-only hosting, access/export, deletion/anonymisation and a 72-hour SDAIA notification without current authoritative evidence. Consent is not a universal substitute for a documented applicable purpose/basis, and hosting one Azure region does not prove that logs, backups, support, analytics, subprocessors or provider copies remain in KSA.

Required processing inventory (each row must be validated, not assumed): dealer identity/access; corporate KYC/signatory; any individual journey (recommended out); driver authorization; credit/verification; quote/contract/signature; e-check media/location/device; finance/payment/tax; notifications; support/disputes; audit/security logs; analytics/reporting/exports; backups/DLQs; provider and subprocessor copies.

For each activity record: controller/processor/joint role; subject categories; exact fields; purpose; necessity/minimization; applicable PDPL basis/condition under current guidance; notice/consent version; recipients/processors/subprocessors; KSA/cross-border locations and mechanism; retention trigger/duration; security controls; rights path; DPIA/PIA trigger; owner; evidence date.

### 6.2 Contradictions and abuse cases

- “Explicit consent required for all processing” conflicts with the need to distinguish necessary operational processing from optional purposes and with revocation/contract effects; qualified privacy/legal owners must decide the model.
- Corporate customer data, signatory data, driver data and dealer employee data may have different roles, purposes and notices; one generic consent record is insufficient.
- “Right to deletion” versus immutable contract, tax, audit and e-check evidence requires field-level exception/hold semantics; a generic anonymised customer state is unsafe.
- Access/export could expose another signatory, dealer employee, driver or third party; identity verification and redaction must be proportional and auditable.
- Dealer agents can generate customer reports in the BRD; this conflicts with least privilege, purpose limitation and rights confidentiality unless every record is scoped and logged.
- KSA region claims do not address provider processing, CDN, email/WhatsApp/SMS, support access, telemetry, backups, disaster recovery, OCR/AV scanning, payment, credit, government or DMS copies.
- Indefinite active-contract retention, 10-year financial/contract retention, 5-year media, 2/5-year audit retention and 30-day credit cache are unapproved normative values. Do not implement a convenient longest period.
- Deletion/anonymisation abuse includes re-identification from VIN, dates, locations, contract amounts, media, hashes, audit diffs, backups, search indexes, exports or provider references; test reversibility and linkability.
- A subject request from an agent or unauthorized representative can disclose data; deletion can destroy evidence under hold; a provider can fail to delete while the portal claims completion.

### 6.3 Required controls (proposed, not evidence)

1. Privacy owner creates one approved processing/data map and field-level inventory. Minimize collection: challenge every document field, GPS, video duration/resolution, device metadata, credit attribute, driver field and audit field against a defined purpose.
2. Decide and version notices/purpose/basis/consent semantics per subject and journey, in applicable languages. Record capture time, version, channel, actor, scope, withdrawal/revocation and downstream propagation; do not treat a checkbox as blanket approval.
3. Complete controller/processor/recipient analysis and vendor due diligence/DPA/subprocessor/transfer review for identity, AutoLease, D365, government, credit, payment, messaging, storage/DMS, analytics and support providers.
4. Produce retention matrix by class: operational PII, KYC, credit, contract/signature, e-check originals/derivatives, finance/tax, payment references, notifications, support, audit/security, integration payloads, DLQs, backups and exports. Specify trigger, duration/criteria, owner, region, deletion method, legal hold and execution evidence.
5. Implement rights request register: intake, proportional identity verification, scope, linked systems, holds/exemptions, approvals, redaction, export format, processor propagation, response and closure evidence. Timelines and rights must be based on current applicable PDPL guidance/qualified review, not imported GDPR/CCPA assumptions.
6. Implement deletion/anonymization as a controlled, field-level workflow with independent review. Distinguish irreversible anonymization from pseudonymization; preserve only approved legal/financial/evidence references; propagate to OLTP, object store, search, caches, analytics, backups, DLQs and providers, or document approved exceptions/inability.
7. Keep immutable audit evidence separate from ordinary subject data with restricted access, minimization, retention/hold policy and a deletion trace. Do not let audit immutability defeat valid rights without an approved exception.
8. Establish breach process: detect, contain, preserve, inventory affected data, assess harm, notify accountable owners, document decision and apply current qualified regulatory determination. Do not assert an automatic 72-hour SDAIA rule from the BRD.
9. Use synthetic data and media in all non-production environments; DLP checks for identifiers, secrets and payment data.

### 6.4 Gate 7 evidence, owner and exact acceptance criteria

Accountable owner: Privacy/Data Governance; acceptance: qualified Auto Lead Compliance/Legal for applicable PDPL interpretation; Security accepts technical controls; system owners accept deletion/retention implementation; Finance/Records accepts financial/legal holds.

Required evidence:

- Approved field-level data inventory and flow map with source, purpose, subject, classification, owner, recipient, processor, region and system copies.
- Current notices and purpose/consent model with version history; documented applicable basis/conditions and minimization decisions.
- DPIA/PIA or equivalent risk assessment decision for identity, credit, high-volume KYC/media, location, profiling/monitoring and rights-impacting processing.
- Vendor/subprocessor/DPA/transfer/residency/deletion evidence and current provider list.
- Approved retention, legal-hold, backup and erasure/anonymization matrix with execution runbook and test results.
- Rights-request register/workflows and synthetic end-to-end access/correction/deletion/export tests, including redaction and provider propagation.
- Breach/DSR runbooks, role ownership, escalation and tabletop evidence.

Gate 7 is accepted only when:

- Every personal-data field in the pilot is mapped to an approved purpose, necessity decision, applicable basis/condition, notice/consent version, access scope, retention trigger and deletion/hold rule; unmapped fields are not collected.
- Inventory reconciliation shows no undisclosed personal-data copy in logs, traces, caches, search, reports, backups, DLQs, non-production, provider payloads or support tooling.
- Synthetic rights tests identify, scope, redact/export and delete/anonymize the subject's data across every approved system/processor, with evidence of completion or an approved documented exception; no claim of completion is made on an unverified provider response.
- Legal holds prevent destructive action and are independently approved/reviewed; deletion leaves an auditable minimal trace without retaining unnecessary personal data.
- Residency/transfer and subprocessor evidence covers application, storage, backups, observability, support, notifications, credit, payment, DMS and DR; intended KSA hosting alone is insufficient.
- Current qualified owners accept notices, purposes/conditions, rights, retention, deletion and breach decision criteria; no “PDPL compliant” claim is issued by this artifact.

## 7. Consolidated P0 action register

| ID | Blocker / action | Accountable owner | Required evidence | Acceptance authority | Status |
|---|---|---|---|---|---|
| G4-01 | Identity topology and customer-auth posture | IT/Identity + Security; Sponsor | Signed topology/token profile and scope decision | Sponsor + Security | Open |
| G4-02 | Tenant/object/report/export/privilege matrix | IT/Security + Operations | Matrix, SoD, break-glass, negative tests | Security + Operations | Open |
| G4-03 | Lifecycle/MFA/PAM/revocation | Identity/Security | Runbooks, measured SLA, step-up/PAM tests | Security | Open |
| G5-01 | Finance source-of-truth and invariant catalogue | Finance | Worked examples, property/concurrency tests | Finance | Open |
| G5-02 | Tax/payment/D365 provider evidence | Finance/Tax + provider owners | Contracts, sandbox outcomes, reconciliation | Finance/Tax/Compliance | Open |
| G5-03 | Unknown outcome/closure controls | Finance + Operations | Operation ledger, duplicate/unknown tests | Finance + Operations | Open |
| G6-01 | Offline scope/device/key protocol | Security/IT/MDM + Operations | Threat model, protocol, field spike | Security + Operations | Open |
| G6-02 | Evidence integrity and residual risk | Security/Privacy + Compliance/Legal | Tamper/replay/cleanup tests and acceptance | Qualified Compliance/Legal + Security | Open |
| G7-01 | PDPL field map/purpose/minimization | Privacy/Data Governance | Inventory, flow map, purpose/basis decisions | Privacy + qualified Compliance/Legal | Open |
| G7-02 | Retention/hold/erasure model | Privacy + Records/Finance/IT | Matrix, runbook, propagation tests | Privacy + Records/Finance | Open |
| G7-03 | Rights/vendor/transfer evidence | Privacy + Procurement/IT | DPA/subprocessors, transfer/residency, DSR tests | Privacy + qualified Compliance/Legal | Open |

No item is closed without owner, date, evidence artifact, decision and acceptance authority. Proposed target dates must be added to the programme decision register.

## 8. Readiness decision and next validation sequence

Current readiness: NOT READY for production build, real-data pilot, production offline e-check, payment/tax/settlement, provider-backed release, or regulatory/compliance claims.

Permitted now: sponsor/workshop decisions; synthetic-data contract tests; isolated finance calculations; identity/tenant test design; offline device spike with synthetic media; privacy inventory and vendor evidence collection.

Recommended sequence:

1. Record sponsor D1–D5 decisions and named owner/date for every P0.
2. Close Gate 4 identity topology and authorization matrix before any real-data or privileged implementation.
3. Execute Gate 5 worked examples and provider sandbox contract tests; keep all money movement/tax posting out.
4. Execute Gate 6 device/network/tamper/cleanup spike; retain capture-only prototype.
5. Execute Gate 7 data map, notice/purpose, vendor/transfer, retention/hold and synthetic rights/deletion tests.
6. Return to consolidated Gate 8 with a signed evidence register, residual-risk decisions and negative-test results.

The only defensible handoff at this point is: validation/design ready; production build and launch not approved.
