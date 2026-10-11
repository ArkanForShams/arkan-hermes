# Corporate Customer Portal — Phase 1 Security and PDPL Assurance Review

Status: Adversarial review; Phase 1 architecture/security gate input, not build approval
Date: 2026-10-11
Reviewer capability: Security Architect + Data Privacy Officer

## 1. Executive decision

Readiness: NOT READY for production build approval or regulatory/compliance claims.

The discovery and architecture baselines correctly identify the major unknowns, recommend a modular monolith with explicit integration boundaries, and preserve several important security/privacy principles. They do not yet provide evidence that the proposed controls are implementable, enforceable, or acceptable for the stated KSA use case. The BRD is a requirements source, not proof of compliance, residency, provider behavior, lawful processing, or security effectiveness.

Phase 1 may continue as controlled discovery and security design only if the P0 blockers in section 15 are owned, dated, and closed before production implementation. A narrow, non-production spike may proceed with synthetic data and no real customer documents, identity data, payment data, or production credentials.

This review is assurance-oriented and adversarial. It is not a legal opinion, a PDPL/SDAIA determination, an NCA certification, or a substitute for qualified Saudi privacy/regulatory counsel and the relevant system/provider owners.

## 2. Evidence discipline

### Reviewed evidence

- `PROJECT-CHARTER.md`: project gates, worker assignment, Buzz channel, safety constraints.
- `01-discovery-product.md`: source/assumption/unknown discipline, journeys, requirements, contradictions, D-01–D-15 backlog, and “not ready for architecture/build approval” conclusion.
- `02-architecture-baseline.md`: proposed modular-monolith/worker design, context map, source-of-truth matrix, state models, integration failure patterns, ADR backlog, and exit gates.
- Source BRD: `/home/shams/.hermes/cache/documents/doc_f7ebe51516b6_CCP BRD v1.0.md`, version 1.0 dated 2026-10-11.

### Evidence versus assumption

Evidence in this report means an explicit statement in one of the reviewed artifacts. “Proposed,” “recommended,” “validation needed,” “assumption,” and “unknown” are not implemented controls. The source set contains no code, IaC, identity configuration, API specifications, provider contracts, data-processing agreements, DPIA/PIA, records of processing, retention approval, test results, penetration-test report, operational runbooks, or qualified legal approval.

The BRD asserts, among other things, Azure Saudi Arabia hosting, Azure AD B2B, MFA, RBAC, database row security, TLS 1.2+, AES-256, SIEM integration, quarterly vulnerability assessment, annual penetration testing, immutable logs, and PDPL controls. Those are requirements or design intentions only until configuration and test evidence exists.

## 3. Material scope and risk challenges

1. Product scope is unresolved: the charter says “Corporate Customer Portal,” while the BRD describes a dealer portal serving corporate and individual customers. Individual journeys and direct customer authentication are excluded by the architecture baseline pending D-01. This changes identity, consent, rights, tenant, and threat assumptions.
2. Identity topology is unresolved: the BRD uses Azure AD B2B; other material refers to B2C. Customer, dealer-federation, administrator, and service identities cannot safely share an undefined trust model.
3. The BRD claims “full compliance” while authoritative current requirements, API contracts, retention decisions, and legal interpretations are absent. Replace compliance claims with control objectives and evidence status.
4. Retention statements conflict: audit logs appear as two and five years in different BRD sections; contracts/financial records and inspection media also have differing periods. Retention cannot be implemented safely until legal/business owners approve a matrix.
5. Availability and session-timeout targets conflict (99.5% versus 99.9%; 15 versus 30 minutes). Security controls and operational exceptions depend on the final values.
6. Offline e-check and 10TB+ media create a high-value, high-volume evidence boundary. The source set does not establish device management, encryption, local deletion, anti-tamper properties, or an admissible evidence standard.
7. The source-of-truth for vehicle reservation, contracts, rates, invoices, tax, payment, and registration remains unresolved. Ambiguous provider results can cause duplicate allocation, duplicate charges, or unlawful release.

## 4. Trust-boundary model

The following boundaries must be treated as security boundaries, not merely technical interfaces:

| Boundary | Assets/flows crossing it | Adversary/failure | Required control objective | Evidence status |
|---|---|---|---|---|
| Internet/browser/PWA → edge/API gateway | Credentials/tokens, customer data, quote/contract commands, media upload | Credential theft, CSRF, request tampering, DoS, malicious client | TLS, hardened headers, strict origin/CORS, token validation, request limits, schema validation, WAF/rate limits, replay/idempotency controls | Requirements/proposal only |
| Dealer/company/showroom user → tenant authorization | Customer, vehicle, contract, performance and media data | Horizontal IDOR/BOLA or role escalation | Server-side organisation/scope checks on every use case; deny-by-default; DB defense-in-depth; negative tests | Proposed in BRD/architecture; unproven |
| Federated IdP → portal | Identity assertions, group/membership, MFA context | Token substitution, issuer/audience confusion, stale offboarding, federation compromise | Explicit issuer/audience/algorithm/key validation, secure federation, short-lived tokens, revocation/offboarding SLA, step-up MFA for high-risk actions | Topology unresolved |
| API/application → relational DB/cache | PII, financial records, state transitions, tenant keys | Injection, over-privileged DB account, cache key collision, data leakage | Parameterized queries, module-owned tables, tenant predicates/row security, separate service identities, cache namespace + no sensitive long-lived cache | Proposed; no implementation evidence |
| Application → object/document store | KYC, IDs, contracts, signatures, photos/video | Public exposure, malicious upload, path traversal, overwrite, retention bypass | Private storage, short-lived scoped URLs, malware/content inspection, magic-byte validation, immutable/versioned objects, checksums, lifecycle/hold enforcement | Proposed; DMS/residency unknown |
| API/workers → message broker/outbox/DLQ | Commands, events, provider payloads, PII references | Replay, message injection, poison messages, DLQ disclosure | Authenticated producers/consumers, schema validation, dedupe, bounded retries, encrypted broker, DLQ access controls and redaction, replay authorization | Proposed pattern |
| Integration workers → government/enterprise providers | Identity/credit, registration, tax, payment, fleet, notification data | SSRF, credential theft, forged callbacks, replay, provider outage, cross-border transfer | Egress allowlist, mTLS/OAuth/signatures as contract requires, callback verification, provider-specific idempotency, data minimization, transfer/residency review | APIs/contracts absent |
| Offline device → sync endpoint | Local inspection data/media, signatures, timestamps/location | Lost/rooted device, malicious client, duplicate/replay, altered evidence, stale authorization | Managed-device policy, encrypted storage, key protection, bounded offline permissions, signed session/manifests, monotonic sequence, conflict queue, secure wipe, sync authorization | Unknown; P0 design gate |
| Admin/privileged plane → all tenants/configuration | Rates, roles, approvals, audit, retention, keys | Insider abuse, compromised admin, maker-checker bypass | PAM/JIT, phishing-resistant MFA, separate admin plane, dual control, reason codes, session recording where approved, immutable admin audit, break-glass review | Requirement only |
| Observability/backup/DR → operators | Logs, traces, backups, exports, media | Secondary exfiltration, excessive retention, residency breach | PII minimization/redaction, access segregation, encryption/key custody, retention/erasure propagation, restore isolation, export controls | Unknown |
| Buzz handoff → collaboration audience | High-level status only | Accidental disclosure of PII/secrets or premature assurance | No secrets, personal data, credentials, or unverified compliance claims; concise blocker summary | This handoff will be sanitized |

The architecture baseline’s “zero trust” label is not a control. Each boundary needs an owner, protocol, data classification, failure mode, test, and evidence artifact.

## 5. STRIDE-style threat model

Risk ratings are qualitative: Critical means a release-blocking path to major compromise or unlawful/unsafe business action; High means material confidentiality, integrity, financial, or regulatory impact; Medium means meaningful but bounded impact. Exploitability and blast radius must be validated with tests.

| STRIDE | Target / scenario | Impact | Required mitigations and verification |
|---|---|---|---|
| Spoofing | Federated token with wrong issuer/audience/algorithm, stale dealer membership, or compromised browser session accesses portal | Critical: tenant or privileged compromise | OIDC/OAuth profile decision; signature/issuer/audience/expiry/nonce validation; secure key rotation; short sessions; offboarding SLA; phishing-resistant MFA/step-up for approvals, exports, refunds, rate changes; auth negative tests |
| Spoofing | Customer/authorised signatory identity is represented by an agent without sufficient proof, or signature scan is treated as equivalent to a controlled signature | High: invalid contract, identity misuse | Define actor and signature assurance levels; separate agent attestation from customer signature; approved e-sign provider and evidence; counsel/compliance approval of signature and identity rules |
| Tampering | Client changes tenant ID, price, discount, approval result, rate version, vehicle ID, status, or settlement amount | Critical/High: cross-tenant disclosure or financial loss | Never trust client fields; server-side policy and authoritative snapshots; signed/versioned state transitions; integer minor units; concurrency controls; property/negative tests and financial worked examples |
| Tampering | E-check media, timestamp, GPS, odometer, damage classification, or manifest altered offline or during sync | High: disputed liability/evidence integrity | Per-object hash, signed manifest/session, sequence and server receipt, trusted time strategy, immutable lock, original/derived distinction, operator exception workflow; field and adversarial sync tests |
| Tampering | Provider callback/webhook or message replay creates duplicate registration, invoice, payment, refund, or closure | Critical/High | Verify provider signatures/mTLS; nonce/timestamp/replay window; provider operation ledger; inbox dedupe; idempotency key; ambiguous state; reconciliation and manual approval; chaos tests |
| Repudiation | Agent/admin denies pricing override, approval, export, deletion, media lock, refund, or privileged read | High | Audit actor, authenticated principal, tenant/scope, action, target, before/after/diff, reason, correlation/causation, source IP/device where justified, result, time; append-only/tamper-evident store; access review and export test |
| Repudiation | Audit log is mutable by the same administrator it records, or deletion/anonymisation removes required evidence without a trace | High | Separate write/read/admin roles, WORM/immutability controls, hash chaining or equivalent, legal hold, deletion exception workflow, independent monitoring, restore/evidence test |
| Information disclosure | BOLA/IDOR in customer, contract, media, report, export, or audit endpoints | Critical: dealer-to-dealer or system-wide disclosure | Object-level authorization at service and data layers; tenant-scoped identifiers; no predictable references; response minimization; automated cross-tenant matrix and fuzz tests |
| Information disclosure | Over-broad signed URLs, public blobs, CDN/cache leakage, filename/metadata leakage, document previews, error traces | High | Private buckets/containers; short-lived single-object URLs; content disposition; no secrets in URLs/logs; malware scan; cache controls; generic errors; storage inventory scans |
| Information disclosure | Logs, traces, backups, DLQs, analytics, non-production copies, or provider payloads contain IDs, credit data, KYC, signatures, payment data, or location | High | Data classification and field-level log policy; redaction/tokenisation; synthetic test data; encrypted backups; least privilege; retention/erasure propagation; DLP checks |
| Denial of service | Large media/video, image decompression, report queries, search, expensive pricing, queue flood, login abuse | High: operations unavailable and queue backlog | Per-tenant/user quotas; upload size/duration/pixel limits; async processing/sandbox; query budgets; rate limits; circuit breakers/backpressure; queue monitoring; load/abuse tests |
| Denial of service | Provider outage or stale cache permits unsafe action or blocks all operations | High | Explicit synchronous gate/pending/advisory classification; stale-data TTL; fail-closed for regulatory release; bounded manual fallback with authority; reconciliation and recovery drills |
| Elevation of privilege | Dealer admin reaches Auto Lead scope; showroom manager approves beyond threshold; compliance/export user edits data; support/break-glass bypasses normal workflow | Critical | RBAC plus ABAC/ReBAC scope and effective dates; separate admin roles; maker-checker; no role claims from client; JIT/PAM; authorization decision logs; exhaustive BFLA and SoD tests |
| Elevation of privilege | Mass assignment accepts hidden fields (`role`, `tenant`, `approved`, `amount`, `status`) or an event consumer trusts unverified commands | Critical/High | Strict schemas/allowlists; immutable server fields; signed internal events; module interfaces; schema fuzzing and consumer contract tests |

Additional abuse paths not captured by pure STRIDE: account sharing, agent collusion, quote/discount manipulation, vehicle reservation races, double redemption/refund, dispute/chargeback gaming, deliberately poor e-check evidence, repeated failed provider operations, malicious filenames/content, and use of a valid dealer account to harvest customer records.

## 6. Tenant isolation and authorization

The stated “zero leakage between dealer companies” objective is a hard security property, not a dashboard filter. The design should use an explicit authorization model:

- Tenant hierarchy: Auto Lead global scope → dealer company → showroom → agent, with explicit fleet pools and contract/customer relationships. Define whether a corporate customer may be shared across dealers and what “duplicate linking” permits.
- Every tenant-scoped aggregate, command, query, export, event, cache key, object path, search index, report, and provider operation must carry an authoritative scope. Do not accept tenant IDs from the client as authority.
- Separate global/system roles from tenant roles. A role name alone is insufficient; use effective membership, purpose, scope, and action policy. Record scope changes with effective dates and reason.
- Enforce at API/use-case level and database defense-in-depth. If row-level security is used, prove it applies to every connection path, reporting user, migration, background worker, admin tool, and restore; a privileged DB owner can bypass it and must be controlled.
- Do not put sensitive tenant data in shared Redis keys, browser storage, analytics, error pages, search indexes, CDN caches, or shared exports. Namespace and authorization-test cache reads.
- Bulk operations and reports require explicit scope calculation, maximum result limits, asynchronous approval where appropriate, and per-record authorization—not only authorization of the parent request.
- Cross-tenant access for central operations must be narrowly defined, logged, monitored, and reviewable. “System-wide” must not mean unrestricted by default.

Required evidence before build approval: an approved role/permission/data-scope matrix (D-10), representative negative tests for every role and endpoint, tenant isolation design, DB policy tests, cache/object/report tests, admin break-glass procedure, and an independent review of cross-tenant access.

## 7. Identity, authentication, and privileged access

The BRD’s Azure AD B2B, MFA, 15-minute idle/8-hour absolute session, one concurrent session, optional IP whitelisting and optional device registration are requirements with unresolved topology and exceptions. Decide:

- Which identity provider and tenant topology apply to Auto Lead users, federated dealer users, and any customer users. Do not implement a blended B2B/B2C model by inference.
- Who provisions, approves, suspends, and periodically recertifies users, groups, service principals, and dealer memberships; define deprovisioning latency and orphan-account handling.
- Require MFA for all interactive users, with phishing-resistant methods for privileged/high-risk actions if supported by approved policy. Define recovery, lost-device, support impersonation, and emergency access without weakening assurance.
- Validate tokens using an allowlisted issuer, algorithm, key set, audience, expiry, not-before, nonce/state where applicable, and tenant/federation claims. Do not use group names alone as authorization.
- Use step-up authentication for rate changes, approvals, contract release, bulk export, deletion/anonymisation, refunds/credit notes, role changes, and break-glass. Sign-out and revocation behavior must be tested.
- Service-to-service identities require separate managed identities, least-privilege scopes, secret/key rotation, outbound restrictions, and no credential material in source, logs, client bundles, or unprotected environment variables.
- Privileged access should be JIT/PAM-controlled, time-bound, separately administered, maker-checker protected, and audited. Auto Lead Super Admin must not unilaterally approve their own rate, role, retention, or financial changes.

Qualified Saudi counsel/compliance approval is required for identity evidence and signature/authorisation sufficiency where it affects enforceability, Tajeer/TAMM operations, or regulated financial workflows.

## 8. API and integration security

The architecture’s outbox/inbox, provider operation ledger, idempotency, DLQ, correlation IDs, and explicit pending/unknown states are good design directions. They are not sufficient until provider contracts and tests exist.

Required controls:

- Publish an API inventory with owner, data fields, classification, direction, trust boundary, endpoint version, authentication, scopes, rate limits, timeout, retryability, residency, and deletion/export behavior.
- Use OAuth 2.0/OIDC or provider-approved mTLS/signature profiles. Validate audience/scope and bind credentials to the specific integration. Avoid one shared integration credential across providers or domains.
- Implement request schema allowlists, strict content types, size limits, canonicalisation, parameterized queries, output minimisation, generic errors, security headers, CORS allowlists, CSRF protection where cookies are used, and rate limiting by principal/tenant/IP/operation.
- Every state-changing business command must have an idempotency key tied to the actor, tenant, operation, and semantic payload; reject key reuse with different payloads. Provider idempotency semantics must be documented, not assumed.
- Treat provider timeouts as unknown/pending where side effects may have occurred. Never blind-retry payment capture, tax submission, registration, refund, or closure. Reconcile by provider reference and operator-reviewed exception queue.
- Verify webhooks cryptographically, enforce freshness and replay protection, deduplicate, and quarantine malformed payloads. Do not let callbacks transition a contract without validating expected state, provider reference, and tenant context.
- Restrict egress to approved hosts/IPs; prevent SSRF through URL fetch, document/image processing, webhook callbacks, PDF generation, or preview features. Use isolated workers for untrusted content.
- Protect API documentation, admin endpoints, health details, metrics, traces, and debug routes. No production interactive docs or verbose provider errors without explicit control.
- Require contract tests against provider sandboxes and negative tests for expired credentials, malformed responses, duplicate callbacks, schema drift, throttling, partial outage, and cross-provider data mismatch.

Specific unresolved integrations include AutoLease, D365, Tajeer, TAMM, SIMAH, identity/credit services, ZATCA, payment, notification, fines, insurance, and assessment providers. No production claim should be made until data processing, residency, security, SLA, and deletion obligations are contractually and technically evidenced for each applicable processor/recipient.

## 9. Document and media security

The portal handles KYC documents, IDs, contracts, signatures, delivery records, damage reports, photos/video, location and inspection metadata. These are restricted/high-impact assets even where the final legal classification requires counsel.

Build requirements:

- Maintain a data/media inventory: object type, purpose, subject, tenant, source, format, size, sensitivity, retention, legal hold, processor, region, access roles, export/erasure behavior, and hash/version relationship.
- Store bytes in private, KSA-approved storage only after residency and provider contractual evidence. Separate tenant and object namespaces; use short-lived scoped URLs or server-mediated download; never expose container listing.
- Validate extension, MIME, magic bytes, dimensions, duration, archive nesting, decompression ratio, filename/path, and quota. Malware-scan in isolation; reject executable/script content; strip unnecessary active content and metadata where it does not destroy required evidence.
- Treat PDFs, office files, images, video, and generated documents as untrusted. Sandbox rendering, preview, OCR, transcoding, and PDF generation. Prevent SSRF, parser exploits, zip bombs, macro execution, and resource exhaustion.
- Make evidence manifests append-only and versioned, with object hash, size, capture/session reference, creator/device/app version, server receipt time, and lock state. Preserve original bytes separately from derived thumbnails/transcodes. Never silently overwrite.
- Make access purpose-bound and audited. Support masked previews, watermarking where appropriate, download limits, bulk export approval, and immediate revocation of links.
- Define how deletion/anonymisation affects original evidence, derived copies, thumbnails, indexes, backups, provider copies, legal holds, and contracts. “Anonymised” must not be a generic button that leaves recoverable PII in secondary stores.
- Use synthetic documents/media in development and test; prohibit production copies in lower environments.

## 10. Offline e-check risks and required design

Offline e-check is a P0 trust-boundary decision, not only a UX feature. The architecture proposes encrypted local queue, checksums, resumable upload, and conflict handling, but the source set does not establish whether a browser/PWA can meet required assurance on unmanaged tablets.

Threats include lost/stolen device, rooted/jailbroken device, browser storage extraction, agent account sharing, clock manipulation, GPS spoofing, media replacement, replayed sync, duplicate checkout, stale vehicle/contract status, sync to the wrong tenant, and deliberate offline capture followed by repudiation.

Before production implementation, prove:

1. Device/browser support, MDM posture, OS storage encryption, secure enclave/key protection, screen lock, remote wipe, app version enforcement, and local cache expiry.
2. Exact permitted offline actions. A safe default is capture-only for an already authorised inspection session; do not allow offline approval, vehicle allocation, contract activation, payment, refund, registration, or closure unless counsel/business owners explicitly approve the control model.
3. A server-issued inspection session bound to tenant, contract, vehicle, actor, scope, nonce, expiry, and allowed checklist. Local records need sequence numbers and a signed/hash-linked manifest; server receipt time must be distinct from claimed capture time.
4. Per-object encryption and checksum, resumable upload, duplicate detection, upload quota, orphan cleanup, and no completion state until all mandatory objects and metadata pass validation.
5. A conflict policy for stale status, duplicate session, changed contract/vehicle, missing media, time anomalies, and partial upload. Route to an operator queue; do not auto-choose a financial or legal outcome.
6. Secure local deletion after confirmed server persistence, plus expiry cleanup and failure recovery. Test forensic remnants and backup behavior within approved test boundaries.
7. Evidence admissibility and customer-notification expectations reviewed by qualified Saudi counsel/compliance owners. Security can preserve integrity but cannot decide legal evidentiary sufficiency.

Exit evidence: field connectivity test, device threat model, sync protocol, tamper and replay tests, storage/cleanup test, failure recovery drill, and signed acceptance of residual offline risk.

## 11. Financial and workflow abuse cases

Financial and workflow invariants are security controls. The following must be modeled as abuse cases and tested with concurrency and authorization scenarios:

- Negative, zero, overflow, precision, currency, VAT, discount, proration, mileage, deposit, penalty, credit-note, refund, and rounding manipulation.
- Changing a rate/version after quote acceptance or contract signature; replaying a stale quote; applying a dealer discount outside authority; modifying hidden price fields.
- Race between vehicle availability reads and reservation, duplicate reservation after timeout, release before reservation confirmation, and allocation from another tenant/fleet pool.
- Approval self-dealing, threshold splitting, changing an approval matrix mid-flight, approving one version while releasing another, or changing beneficiary/payment destination after approval.
- Duplicate D365 invoice, tax submission, payment capture, refund, settlement, or points redemption caused by retry/webhook ambiguity. Unknown provider outcome must remain unknown until reconciled.
- Dispute/hold bypass, premature closure, charge generation after hold, duplicate damage/fine lines, or customer notification before an approved decision.
- Points inflation through duplicate activation events, backdated contracts, amendments, reversals, or redemption replay.
- Agent collusion to create fictional customers, reuse documents, manipulate e-check evidence, or harvest records through search/export.
- Bulk upload poisoning for rates/vehicles, maker-checker bypass, effective-date overlap, and malicious CSV/formula content.

Required safeguards: explicit state-transition tables, invariant checks, monotonic versioning, optimistic/pessimistic concurrency where necessary, maker-checker separation, immutable snapshots, idempotency, reconciliation, limits, anomaly alerts, and worked examples signed by Finance/Operations. Production financial/tax logic and payment/settlement release require Finance and qualified legal/compliance approval; this report does not determine accounting or regulatory treatment.

## 12. Audit, retention, erasure, and incident controls

### Audit

Define event taxonomy covering authentication, authorization failures, privileged reads, create/read/update/delete where justified, exports, document/media access, consent, role changes, rate/master-data changes, approvals, signatures, state transitions, integration requests/responses (redacted), payment/financial actions, retention holds, deletion/anonymisation, and break-glass. Each event should include actor/principal, effective role/scope, tenant, target, action, outcome, reason, before/after or safe diff, correlation/causation ID, source/device/IP where proportionate, provider reference, and UTC timestamp.

Use separated write and review paths, tamper-evident/immutable storage, restricted access, clock synchronization, alerting on anomalous admin/export behavior, and periodic access review. Logging must not become a second uncontrolled PII database.

### Retention and legal hold

Create one approved retention matrix by data class and purpose, including operational records, contracts, financial/tax records, KYC/identity, credit results, signatures, e-check original/derived media, consent, audit/security logs, integration payloads, notifications, backups, DLQs, and support records. For each class specify retention trigger, duration/criteria, owner, region, processor copies, deletion method, exceptions, legal hold, and evidence of execution.

The conflicting BRD periods are a P0 blocker. Do not implement “10 years,” “5 years,” or “2 years” as a legal fact without qualified Saudi counsel/compliance and records owners. Do not use indefinite retention as a safe default.

### Erasure/anonymisation and requests

The BRD proposes an “Anonymised” customer state while retaining contracts/invoices. This needs a field-level decision: direct identifiers, quasi-identifiers, documents, signatures, driver data, media, audit entries, analytics, backups, provider copies, and legal/financial evidence. Define irreversible anonymisation versus pseudonymisation; test re-identification risk; preserve only what an approved exception permits.

Implement a request register with intake channel, identity verification proportional to risk, request type, scope, deadlines under the applicable Saudi policy, linked systems/processors, holds/exemptions, approvals, actions, response package, and closure evidence. Support access, correction, deletion/erasure, objection/restriction or other applicable rights only as confirmed by current PDPL rules and counsel. The system should not assume GDPR/CCPA timelines or rights are the Saudi legal answer.

Workflow requirements:

1. Intake and acknowledgement without collecting unnecessary extra identity data.
2. Strong but proportionate identity verification; prevent an agent from requesting another person’s data.
3. Discovery across OLTP, object store, search/reporting, cache, audit, backups, DLQ, emails/notifications, and providers.
4. Legal/business hold and exception review before deletion/anonymisation.
5. Controlled fulfillment and redaction, with machine-readable export where approved.
6. Propagation to processors/recipients and evidence of completion or documented inability.
7. Independent review for privileged requests, deletion, bulk access, and records affecting contracts/financial evidence.

### Breach and operational response

The BRD asserts a 72-hour notification to SDAIA. Treat the exact trigger, threshold, recipient, content, and timeline as requiring current qualified Saudi counsel/compliance confirmation; do not carry over GDPR assumptions. Build an internal rapid process: detect, contain, preserve evidence, identify data/subjects/scope, assess harm, notify accountable privacy/security/legal owners, make and document the regulatory decision, and communicate where required. Vendor contracts must require rapid notification, evidence preservation, cooperation, and rights/erasure support.

## 13. PDPL data inventory and governance

Initial inventory requiring validation:

| Processing area | Likely data | Purpose to validate | Key risk/control question |
|---|---|---|---|
| Dealer identity/access | Names, work email, org/group, device/session/security events | Access and operations | Is federation lawful/contracted and is offboarding timely? |
| Corporate customer/KYC | Trade/CR/VAT details, signatory name/ID/role, contact data, documents | Origination/KYC/contract | Which fields are necessary; who is controller/processor; duplicate linking boundary? |
| Individual customer (scope pending) | Identity, licence, contact, credit/verification | Retail lease | Is this in MVP; higher identity/fraud impact and separate notice/basis? |
| Driver/authorisation | Name, ID/licence, expiry, authorisation status | Vehicle release and operation | Authority, purpose, retention, provider transfer, access scope |
| Credit/verification | SIMAH/identity results, timestamps, limits | Risk/eligibility | Consent/notice/basis, retention, adverse decision explanation/appeal, provider terms |
| Contract/signature | Parties, terms, signatures, PDFs, messages | Contract and regulatory record | Signature assurance, legal retention/hold, customer access |
| E-check | Photos/video, damage, odometer, GPS/time, signatures, device/app metadata | Handover/settlement evidence | Minimization, evidence integrity, offline risk, retention |
| Finance/payment | Invoices, tax, payment references, settlements, refunds | Billing/reconciliation | Payment data minimization, PCI/provider scope, tax/records retention |
| Usage/support | Disputes, notifications, call/support records, audit events | Service, fraud, accountability | Log minimization, access, analytics and erasure propagation |

For each processing activity, record controller/processor role, subject categories, data categories, purpose, necessity/minimization, applicable lawful basis/condition under current PDPL guidance, recipients, processors/sub-processors, KSA/cross-border locations, retention, security measures, data-subject notice, rights workflow, DPIA/PIA trigger, owner, and evidence. This is an operating record, not a generic privacy-policy exercise.

Required privacy-by-design artifacts before launch: approved data map and inventory, current privacy notice(s) in Arabic/English as applicable, purpose/consent version model, DPIA/PIA or equivalent risk assessment for high-risk identity/credit/media/monitoring processing, vendor/DPA and transfer review, retention/erasure matrix, DSR runbook, breach runbook, and counsel/compliance sign-off where interpretation is material.

## 14. NCA-aligned control areas (alignment, not certification)

The BRD references NCA Essential Cybersecurity Controls. Applicability, current edition, sector obligations, and scope must be confirmed by Auto Lead compliance/security owners. The following is a control-area mapping for evidence planning only:

| Control area | Minimum evidence expected | Current status |
|---|---|---|
| Governance/risk | System owner, asset/data classification, risk register, exception acceptance, control owners | Not supplied |
| IAM | Approved identity architecture, MFA, lifecycle/provisioning, access reviews, privileged-access controls, JIT access, SoD | Intentions only; topology unresolved |
| Network/segmentation | KSA landing-zone diagram, ingress/egress rules, private endpoints, admin-plane isolation, provider allowlists | Not supplied |
| Application/API security | Secure SDLC, threat model, code review, schema validation, BOLA/BFLA tests, secrets scanning, API contracts | Proposed patterns; no code/test evidence |
| Data protection | Classification, encryption/key management, masking, backup/DR, residency, media/object controls | Requirements only; provider evidence absent |
| Logging/SIEM | Event taxonomy, immutable storage, monitoring, alert rules, time sync, retention/access review | Proposed audit store; no operational evidence |
| Vulnerability management | SAST/SCA/DAST/container/IaC scanning, patch SLAs, SBOM, remediation exceptions | BRD target only |
| Security testing | Independent penetration test, adversarial tenant/offline/API/media tests, restore and failover tests | Not started |
| Incident response | 24x7/on-call ownership, severity model, containment, evidence, notification decision, exercises | Not supplied |
| Third-party/cloud | Due diligence, contracts/DPA, subprocessor list, residency, breach/DSR/deletion support, shared responsibility | Not supplied |
| Business continuity | RTO/RPO approval, isolated backups, restore evidence, provider outage/manual procedures | Targets conflict/untested |
| Training/awareness | Admin/dealer training, phishing/social engineering, privacy and media handling | Not supplied |

Do not state “NCA compliant” or “ECC compliant” from the presence of Azure services or the BRD checklist. A qualified control owner must map the current applicable controls, evidence, exceptions, and approval route.

## 15. Security test strategy

Testing must be threat-driven and release-gated, not a single annual penetration test.

### Design and unit level

- Authorization policy tests for every role/scope/action, including negative cross-tenant, stale membership, disabled user, system-wide role, export, and break-glass paths.
- Property and invariant tests for state transitions, quote/version/hash binding, rate effective dating, reservation, approvals, financial arithmetic, VAT/rounding, holds, settlement and idempotency.
- Input/schema fuzzing for mass assignment, malformed identifiers, Unicode/RTL, oversized fields, CSV/formula injection, and unexpected nested fields.
- Crypto/protocol tests for token validation, signature/checksum, replay windows, key rotation, secure URL expiry, and no `alg=none`/issuer confusion.

### Integration and system tests

- Contract tests for every provider using synthetic data and sandbox failures.
- Duplicate/timeout/late/out-of-order callback tests; ambiguous payment/tax/registration outcomes; DLQ replay and reconciliation.
- API security tests for OWASP API Top 10: BOLA/BFLA, broken auth, property-level authorization, resource exhaustion, SSRF, injection, CORS/CSRF, excessive data exposure, inventory/version drift.
- Media/document tests: malicious files, polyglots, ZIP bombs, parser/resource exhaustion, private storage, signed URL scope, overwrite protection, metadata leakage, orphan cleanup.
- Browser/PWA offline tests across supported OS/device/browser matrix, lost device, storage exhaustion, clock/GPS anomalies, replay, duplicate sync, wrong tenant, partial upload, secure local deletion, and conflict handling.
- Concurrency/race tests for reservation, approval, release, invoice/payment/refund, points, dispute hold, and closure.

### Platform and operational tests

- SAST, SCA/lockfile, secrets, container, IaC and SBOM gates on every change; risk-based dependency patch SLAs.
- DAST/API scanning in non-production with authenticated role coverage; manual code review for authorization and business logic.
- Load/abuse tests at agreed tenant/user/media/queue envelope; per-tenant fairness and backpressure.
- Backup restore, DR/failover, key rotation, log immutability, SIEM alerting, incident response tabletop, provider outage, and operator runbook drills.
- Independent penetration test before production and after material identity, tenant, media, payment, or integration changes. Findings require severity, reproducibility, owner, due date, retest evidence, and risk acceptance authority.

Release gates must block on Critical/High unresolved tenant, auth, privilege, media exposure, injection, payment duplication, or evidence-integrity findings. Test data must be synthetic or explicitly approved; no secrets or real personal data in test artifacts.

## 16. Residual risks if mitigations are implemented

Even after the controls above, residual risks require explicit owner acceptance:

- Federated dealer identity compromise or social engineering may defeat application controls; reduce with phishing-resistant MFA, anomaly detection, rapid offboarding, and contractual dealer obligations.
- Offline evidence may remain contestable due to device compromise, clock/location spoofing, or inability to prove capture context; constrain offline actions and obtain legal/evidentiary approval.
- Provider outage/schema change may delay or misstate registration, tax, credit, payment, or vehicle state; retain pending/unknown states and reconciliation queues.
- Central operations have inherently broad blast radius; reduce with JIT/PAM, dual control, monitoring, and independent review.
- Media volume and retention may create cost, backup, and residual-copy risk; minimize capture, tier storage, enforce lifecycle, and test deletion/hold propagation.
- Anonymisation may not eliminate re-identification risk from contracts, dates, vehicles, locations, or media; require documented technique and review.
- Regulatory interpretations and provider requirements can change; maintain a current obligation register and counsel/compliance review cadence.

Residual risk must be accepted by the accountable business/security/privacy owners, not silently inherited by engineering.

## 17. Explicit build blockers

P0 — must close before production implementation or approval:

1. Scope and identity boundary: decide corporate-only versus individual/direct-customer scope; decide B2B/B2C topology, customer authentication, and trust relationships.
2. Approved tenant/authorization matrix: dealer/company/showroom/agent/central roles, object/report/export scopes, SoD, break-glass, and negative-test catalogue.
3. Identity lifecycle and privileged access design: MFA/step-up, provisioning/deprovisioning SLA, service identities, PAM/JIT, session/revocation policy, and signature/authorisation assurance.
4. Data inventory and PDPL operating decision: purposes, minimization, current applicable basis/conditions, notices/consent, controller/processor roles, DPIA/PIA decision, rights workflow, and qualified Saudi counsel/compliance review where required.
5. Approved retention/erasure/legal-hold matrix: resolve conflicting audit, contract, financial, KYC, credit, media, backup, provider, and log periods; define anonymisation and exception semantics.
6. Trust-boundary/API contract pack: provider owners/specs, authentication/signing, data fields, residency, DPA/subprocessors, deletion/DSR, SLA/error semantics, rate limits, and test environments for each integration.
7. Offline e-check gate: permitted offline actions, managed-device/key model, sync/manifest protocol, anti-replay/tamper controls, local deletion, conflict policy, field test, and evidence/legal acceptance.
8. Financial/workflow invariants and source-of-truth decisions: rates, reservation, contract authority, approval, tax, D365, payment, refunds, points, settlement, and duplicate/unknown outcome handling.
9. Security architecture evidence: network/identity/data diagrams, secrets/key management, storage/media controls, audit/SIEM, backup/DR, and NCA applicability/control mapping.
10. Test and operations readiness: automated security gates, independent test plan, on-call/incident runbook, breach decision workflow, restore/DR evidence, and remediation/risk acceptance process.

P1 — may block pilot depending on scope/risk:

- Arabic/English privacy notices and legal contract/signature review.
- Vendor due diligence and DPAs for storage, identity, credit, messaging, payment, DMS, assessment and analytics.
- Media cost/quota model and reporting/search isolation.
- Customer-facing request/notification channels, appeal/dispute SLAs, and accessibility/device matrix.

Until P0 items are closed, “ready,” “secure,” “PDPL compliant,” “NCA compliant,” or “production approved” would be unsupported claims.

## 18. Handoff and required next decisions

Security/privacy should participate in D-01, D-02, D-03, D-06, D-08, D-09, D-10, D-12, and D-13. The next gate should produce: signed scope/identity decision, tenant matrix, data inventory/retention matrix, provider evidence register, offline prototype test report, financial state/invariant catalogue, and a control-evidence tracker with owners and dates.

The architecture baseline is a useful starting hypothesis, especially its explicit pending/unknown states, outbox/inbox, reconciliation, module boundaries, and cautious Phase 1 scope. It must not be treated as proof that tenant isolation, media integrity, residency, retention, or regulatory integration controls work.

## 19. Traceability

- Charter: project gates, assignment, channel, safety constraints.
- Discovery §7–§12: P0 identity/tenant/privacy requirements, NFRs, contradictions, D-01–D-15, and not-ready conclusion.
- Architecture §2–§12: modular-monolith proposal, bounded contexts, source-of-truth gaps, integration controls, offline/media design, ADRs, exit gates, and risks.
- BRD §§2.3–2.5, 3–5, 8–12, 18–21: Tajeer/PDPL/NCA assertions, proposed Azure stack, identity/tenant roles, customer/KYC/consent, contract/e-check/financial journeys, security/NFR/retention targets.

No legal conclusion or certification is made by this document. Items marked for qualified Saudi counsel/compliance approval remain open until that approval is evidenced.
