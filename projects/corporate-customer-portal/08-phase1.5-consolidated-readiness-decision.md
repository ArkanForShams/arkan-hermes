# Corporate Customer Portal — Phase 1.5 Consolidated Readiness Decision Pack

Date: 2026-10-11
Status: Validation Gate 8 decision pack — D1–D5 sponsor decisions recorded on 2026-10-11; Changan-KSA nationwide target set for 2026-12-01; evidence acceptance outstanding
Prepared by: dynamic-worker-1 (temporary Product Manager + Business Analyst capability)
Sponsor: Shams Tabrez
Channel: Corporate Customer Portal (`369b68ff-02cb-48ea-b473-d65b7e134040`)

## 1. Executive decision

Decision status: NOT READY for production implementation, production credentials, real personal data, production offline e-check, provider-backed activation/release, payment/tax/settlement, or regulatory/compliance claims.

The Phase 1.5 validation work has produced the required decision and challenge artifacts. It has not closed the underlying acceptance conditions. The defensible current posture is:

- GREEN: continued controlled validation/design, sponsor workshops, synthetic-data contract tests, isolated calculations, identity/tenant test design, privacy evidence collection, and an offline device spike with synthetic media.
- AMBER/RED: production build approval, real-data pilot, production provider integrations, provider-backed release, production e-check, money movement, tax/D365 posting, settlement finality, and any claim of PDPL/NCA/regulatory compliance.

The sponsor has now selected the recommended product direction on 2026-10-11. This records the product boundary for the next design/build baseline; it does not grant production approval or close the technical, privacy, security, finance or regulatory gates.

## 2. Gate status reconciliation

"Complete" below means the validation activity/artifact was produced and verified. "Acceptance open" means the required owner decision, evidence, date and acceptance authority are still outstanding.

| Gate | Validation artifact / outcome | Activity status | Acceptance status |
|---|---|---|---|
| 1 — Scope, MVP, non-goals | `05-scope-mvp-decision-pack.md`; dealer-facing corporate quote-to-draft-contract pilot recommended | Complete | Sponsor acceptance open; production scope not approved |
| 2 — Source of truth and state | `06-source-truth-state-integration-pack.md`; proposed authority model, state machines and reconciliation rules | Complete | Owner decisions and signed transition/source-of-truth evidence open |
| 3 — Regulatory/API evidence and integration inventory | `06-source-truth-state-integration-pack.md`; provider evidence register and contract-test requirements | Complete | Current contracts/specs/sandboxes/tests and qualified acceptance open |
| 4 — Identity, tenant authorization, privileged access | `07-adversarial-gates-4-7-review.md` challenge and acceptance criteria | Review artifact complete | NOT CLOSED; P0 evidence and negative tests open |
| 5 — Finance, tax, payment, settlement | `07-adversarial-gates-4-7-review.md` worked-example and invariant requirements | Review artifact complete | NOT CLOSED; P0 worked examples/provider evidence open |
| 6 — Offline e-check and evidence integrity | `07-adversarial-gates-4-7-review.md` device/protocol/test requirements | Review artifact complete | NOT CLOSED; P0 spike, tamper/replay/cleanup evidence open |
| 7 — PDPL mapping, retention, rights, deletion | `07-adversarial-gates-4-7-review.md` data-governance requirements | Review artifact complete | NOT CLOSED; P0 data map, retention/rights/vendor evidence open |
| 8 — Consolidated readiness decision | This pack and sponsor decision register | Complete | Decision recorded below; production approval denied |

Gate 4–7 artifacts are therefore complete as validation outputs, but Gates 4–7 remain open as acceptance gates. No blocker is downgraded by this reconciliation.

## 3. Recommended MVP scope decision

Recorded sponsor decision: D1-A, D2-A, D3-A, D4-A, D5-A on 2026-10-11.

- D1-A: Dealer Agent Operating Portal with full dealer-assisted lifecycle; dealer DMS integration is not a prerequisite; individual and direct customer self-service deferred.
- D2-A: individual customers out of Phase 1 and pilot; separate validation track required.
- D3-A: synthetic/non-production validation first, then a small controlled pilot only after P0 entry criteria are met.
- D4-A: full portal journey visible to dealer agents, with provider-backed actions remaining pending/gated until evidence is accepted; no provider-backed activation is implied by the product boundary.
- D5-A: modular monolith with ports/adapters, async workers, outbox/inbox, object storage, explicit pending/unknown states and reconciliation patterns; no premature microservices commitment.

Decision status: SPONSOR-SELECTED PRODUCT DIRECTION; technical and control acceptance remains open. The product baseline is dealer-assisted corporate, synthetic-first, no minimum DMS integration, no general customer account in the first release, and full journey visibility with gated provider actions.

## 4. P0 blockers — not downgraded

The following are release-blocking. Each remains open until the specified evidence is attached and accepted by the named authority.

| ID | P0 blocker | Accountable owner | Evidence artifact required | Acceptance authority | Status |
|---|---|---|---|---|---|
| P0-01 | Product boundary and customer posture selected; Changan-KSA nationwide target set for 2026-12-01, but phased activation and operating acceptance remain open | Shams Tabrez; Auto Lead Operations | This dated decision record plus Changan-KSA rollout scope, phased branch activation plan, use cases and operating-owner acceptance | Sponsor; Operations for operating boundary | Partially resolved — rollout plan/owner acceptance open |
| P0-02 | B2B/B2C identity topology and customer authentication unresolved | IT/Identity + Security | Signed topology, token/claim profile, MFA/step-up, provisioning and customer-account posture | Sponsor + Security | Open |
| P0-03 | Tenant/object/report/export/privileged-access matrix unapproved and untested | IT/Security + Operations | Versioned role × action × object × scope matrix, SoD/break-glass design, complete negative-test results | Security + Operations | Open |
| P0-04 | Identity lifecycle, revocation, MFA/step-up, service identity and PAM/JIT controls unevidenced | Identity/Security | Joiner-mover-leaver runbook, measured offboarding SLA, revocation/session tests, PAM/JIT and break-glass exercise | Security | Open |
| P0-05 | Source of truth and state/release semantics unresolved for reservation, rates, contracts, registration and evidence | IT/Integration + Operations/Fleet | Signed authority matrix, transition tables, version/hash binding, conflict/reconciliation examples and exception authority | Operations + IT; Legal/Compliance where material | Open |
| P0-06 | Provider/API evidence absent for release-critical integrations | Integration + named provider/system owners | Versioned contracts/specs, auth, schemas, residency/DPA/deletion, SLA/error/retry/idempotency, sandbox contract tests | Relevant system owner; qualified Compliance/Legal/Tax/Finance where applicable | Open |
| P0-07 | Finance/tax/payment/D365/settlement invariants and unknown-outcome handling unproven | Finance + Tax/Compliance + D365/payment owners | Independently recomputed synthetic worked examples, property/concurrency tests, provider sandbox outcomes, reconciliation report/runbook | Finance; Tax/Compliance for applicable interpretation; Operations for closure | Open |
| P0-08 | Offline e-check trust boundary and evidence integrity unproven | Security + IT/MDM + Operations | Device/OS/MDM threat model, session/manifest protocol, field spike, tamper/replay/wrong-scope/partial-upload/cleanup tests | Security + Operations; qualified Compliance/Legal for evidentiary sufficiency | Open |
| P0-09 | PDPL data inventory, purpose/minimization, roles and notice/basis/consent model absent | Privacy/Data Governance | Field-level data map and flow inventory, minimization decisions, notices, purpose/basis/consent model, DPIA/PIA decision | Privacy + qualified Auto Lead Compliance/Legal | Open |
| P0-10 | Retention, legal hold, deletion/anonymisation, backup and provider-copy model unresolved | Privacy + Records/Finance/IT | Approved class-by-class retention/hold/erasure matrix, propagation runbook and synthetic test evidence | Privacy + Records/Finance; qualified Compliance/Legal where interpretive | Open |
| P0-11 | Residency, transfer, DPA/subprocessor, vendor deletion and rights-request evidence absent | Privacy + Procurement/IT | Current provider/subprocessor list, DPA/transfer/residency/deletion evidence, synthetic rights/export/deletion tests | Privacy + qualified Compliance/Legal | Open |
| P0-12 | Security architecture and operational readiness evidence absent | IT Security/Architecture + IT Ops | Trust-boundary/network/data/secrets/key diagrams, SIEM/audit/media controls, backup/DR restore, incident/breach decision runbooks, independent security test plan/results | Security + IT Ops; sponsor accepts residual risk | Open |

No P0 is closed by a BRD assertion, proposed design, verbal provider statement, or this pack.

## 5. P1 risks and conditional pilot blockers

These may become pilot blockers based on the approved boundary, but must be tracked rather than silently omitted:

- Arabic/English notices, contract/signature mechanism and content/legal review.
- Vendor due diligence and DPAs for storage, identity, credit, messaging, DMS, payment, analytics and assessment providers.
- Media volume, quota, cost, reporting/search isolation and restore capacity.
- Customer notification, dispute/appeal channel, support coverage and service-level decisions.
- Accessibility, supported browser/device matrix and field connectivity constraints.
- Baseline user research, dealer observation, support signal, capacity/cost model and measurable pilot targets.
- Availability, timeout, sync cadence and retention contradictions from the BRD.

## 6. Explicit sponsor decisions required

Sponsor decision register — status is open unless a dated decision with evidence and acceptance authority is entered.

| Ref | Decision required | Recommended position | Required decision record / evidence | Accountable owner | Acceptance authority | Status/date |
|---|---|---|---|---|---|---|
| D1 | Product name, boundary, primary users, in/out scope | Dealer Agent Operating Portal; full dealer-assisted lifecycle; no minimum dealer DMS; direct customer and individual scope deferred | Signed scope and non-goal record; Changan-KSA nationwide target with phased branch activation starting 2026-12-01 | National Sales Manager (Lease), AutoLead | General Manager, AutoLead; sponsor: Shams | Selected 2026-10-11; phased rollout/operating acceptance open |
| D2 | Individual-customer treatment | Exclude from Phase 1 and pilot | Explicit exclusion and separate validation track | Shams + Operations | Shams; Legal/Privacy if reconsidered | Selected 2026-10-11 |
| D3 | Pilot posture and data permission | Synthetic first; real data only after P0 acceptance; Changan-KSA is the intended nationwide target, activated in controlled phases | Named rollout waves, training/support, data classification and data-use approval | Operations + Privacy/Security | Operations + Privacy/Security; sponsor residual-risk acceptance | Selected 2026-10-11; rollout plan/approval gate open |
| D4 | Direct corporate authentication | Dealer-assisted workflow; no general customer account in first release | Identity topology and customer participant/authentication record | Shams + IT/Identity | Sponsor + Security | Selected 2026-10-11; identity evidence open |
| D5 | Release capability | Full portal journey visible; provider-backed actions pending/gated until evidence is accepted | Release-gate matrix and provider evidence boundaries | Operations + IT/Integration | Operations + Security/Compliance as applicable | Selected 2026-10-11; evidence gates open |
| D6 | Source-of-truth ownership | No assumption; decide each domain/fact | Signed source-of-truth and reconciliation matrix | Operations/Fleet + IT/Integration + Finance | Named domain owners; sponsor for unresolved boundary conflicts | Open / — |
| D7 | Signature/evidence standard | Validation-needed; no admissibility claim | Selected mechanism, evidence manifest and qualified review | Operations + Legal/Compliance + Security | Qualified Compliance/Legal + Security | Open / — |
| D8 | Finance/tax/payment scope | Out of MVP unless separately evidenced and approved | Signed calculation rules and worked examples; provider contracts if included | Finance | Finance/Tax/Compliance | Open / — |
| D9 | Offline e-check permission | Capture-only synthetic spike by default | Device/protocol/test report and residual-risk record | Security/MDM + Operations | Security + Operations; qualified Compliance/Legal for evidentiary interpretation | Open / — |
| D10 | PDPL purposes, roles, rights and retention | Validation-needed; no compliance claim | Approved data map, notices, DPIA/PIA decision, retention/rights matrix | Privacy/Data Governance | Privacy + qualified Compliance/Legal | Open / — |
| D11 | Availability, timeout, residency and operational SLOs | Do not inherit conflicting BRD values | Approved policy/SLO matrix, support/runbook and evidence plan | IT Ops + Security/Privacy/Legal as applicable | IT Ops + Security/Privacy/qualified Compliance/Legal | Open / — |
| D12 | Residual-risk acceptance and decision date | No production approval until P0 closure | Signed risk register with expiry/review date and acceptance authority | Shams + accountable P0 owners | Sponsor and relevant control owners | Open / — |

## 7. Permitted activities now

Only the following activities are authorized by the current evidence posture:

1. Sponsor and owner workshops; recording decisions without treating them as approvals until signed.
2. Synthetic-data contract tests, provider sandbox/stub tests and API evidence collection.
3. Identity/tenant authorization design and negative-test catalogue development.
4. Isolated finance calculation and reconciliation examples without real posting, capture or settlement.
5. Offline device/network/tamper/cleanup feasibility spike with synthetic media and capture-only semantics.
6. Privacy data inventory, purpose/minimization analysis, vendor/DPA/transfer evidence collection and synthetic rights/deletion tests.
7. Architecture, state-machine, observability, runbook, cost/capacity and support-readiness planning.
8. Re-baselining pilot metrics through observed, approved workflows using synthetic data.

## 8. Prohibited activities pending P0 closure

Do not:

- approve production implementation or production rollout;
- use real customer/personal, payment or sensitive inspection data;
- issue production credentials or connect release-critical production providers;
- enable direct customer or individual-customer paths by inference from the BRD;
- perform production payment capture/refund, tax submission, D365 posting, settlement finality or points redemption;
- treat queued, HTTP-success, request-ID or cached provider results as registration, approval, reservation, payment or release success;
- permit offline approval, allocation, activation, payment, refund, registration, closure or other financial/legal release action;
- make PDPL, NCA, NAQL/TGA, SAMA, ZATCA or other compliance/certification claims;
- claim signature/e-check evidence is legally enforceable or admissible;
- close any blocker without owner, evidence, decision, date and acceptance authority;
- silently normalize conflicting BRD requirements or use a convenient retention period.

## 9. Entry criteria for production implementation

Production implementation may be considered only when all of the following are evidenced and accepted:

- Sponsor-approved D1–D5 scope and cohort decisions, with explicit non-goals and funding/capacity owner.
- Approved identity topology and customer posture; tenant/object/report/export/privilege matrix; lifecycle, MFA/step-up, PAM/JIT, revocation and break-glass evidence.
- Accepted source-of-truth, state-transition, release-gate and reconciliation matrices, including unknown/duplicate/stale/conflict behavior.
- Current provider/API contracts or explicitly approved stub boundaries for every integration in the approved pilot; contract tests cover success, timeout, duplicate, malformed, unauthorized, throttled, rejected and ambiguous outcomes.
- Finance/Operations-approved synthetic worked examples, independently recomputed results, concurrency/idempotency tests and no-blind-retry controls.
- Offline e-check device/protocol test evidence, secure local handling, tamper/replay/partial/wrong-scope tests, cleanup/restore evidence and residual-risk acceptance.
- Approved field-level data inventory, purposes/minimization, notices/consent/basis model, controller/processor roles, DPIA/PIA decision, retention/hold/erasure matrix and rights workflow.
- Provider residency, DPA/subprocessor, deletion/DSR and transfer evidence for all applicable processors/recipients.
- Security architecture, secrets/key management, storage/media, audit/SIEM, backup/DR, incident/breach decision, restore drill and independent security testing plan/results.
- Pilot support, incident, rollback, reconciliation, monitoring and escalation runbooks exercised with named owners.
- Baselines, event definitions, pilot thresholds, SLOs and success metrics approved by Product and Operations.
- A final Gate 8 re-review records each P0 as closed only with owner, evidence artifact, decision, date and acceptance authority; sponsor accepts residual risks explicitly.

These are entry criteria, not evidence that any criterion is currently met.

## 10. Residual risks

Even after planned controls are implemented, accountable owners must assess and accept residual risk for:

- compromised or socially engineered dealer identities and central-operator blast radius;
- provider outage, schema drift and ambiguous side effects affecting registration, tax, credit, payment or vehicle state;
- offline device compromise, clock/GPS manipulation and contestability of inspection evidence;
- media volume, cost, backups, replicas and deletion/hold propagation;
- re-identification through quasi-identifiers, documents, media, hashes, exports, logs or provider copies;
- changing regulatory interpretation, provider terms and applicable retention/rights requirements;
- pilot support capacity, field connectivity and manual reconciliation workload;
- BRD scale/NFR assumptions that have not been capacity, cost, performance or DR tested.

Residual risk is not silently inherited by engineering. Each accepted risk requires an owner, evidence, decision, date, expiry/review date and acceptance authority.

## 11. Realistic next sequence

1. Execute the Changan-KSA nationwide target as a phased rollout with a 2026-12-01 first activation target; appoint the first activation wave, operating owner, target dates and acceptance authorities for D6–D12 and P0-01 through P0-12.
2. Freeze the selected product boundary and guardrails: synthetic data, no production credentials, no provider-backed release, no direct/individual customer path, and no minimum dealer DMS integration.
3. Run Gate 4 identity/tenant workshop and produce the signed topology, access matrix, lifecycle design and negative-test results.
4. Run Gate 2/3 source-of-truth and API evidence workshop in parallel; resolve reservation, contract, registration, document and provider ownership.
5. Run Gate 5 finance worked examples and sandbox contract tests; keep capture, posting, tax and settlement finality disabled.
6. Run Gate 6 device/network/evidence spike; retain capture-only behavior and document residual offline risk.
7. Run Gate 7 data map, purpose/notice, vendor/transfer, retention/hold and synthetic rights/deletion work.
8. Complete security architecture, operational readiness, support/rollback, backup/restore and independent test planning.
9. Reconcile all evidence in an owner/date/acceptance register; return to Gate 8 for a formal re-decision.
10. Only after P0 closure and sponsor residual-risk acceptance: authorize a limited implementation/pilot plan with feature flags, synthetic-to-approved-data transition, staged rollout and rollback criteria.

Current final handoff: validation/design ready; production implementation and launch not approved.

## 12. Evidence traceability

- `00-phase1-consolidated-gate.md`: prior production-approval denial and P0 list.
- `04-phase1.5-workplan.md`: Phase 1.5 gate sequence and completion rule.
- `05-scope-mvp-decision-pack.md`: recommended MVP, D1–D5 options, pilot posture and open decisions.
- `06-source-truth-state-integration-pack.md`: authority model, states, release semantics and provider evidence register.
- `07-adversarial-gates-4-7-review.md`: Gates 4–7 challenge, P0 action register and acceptance criteria.
- `01-discovery-product.md`: BRD contradictions, assumptions, discovery backlog and baseline limitations.
- `02-architecture-baseline.md`: proposed architecture, source-of-truth hypotheses, state model and exit gates.
- `03-security-pdpl-review.md`: security/privacy blockers, evidence requirements and explicit build blockers.
- Source BRD: `/home/shams/.hermes/cache/documents/doc_f7ebe51516b6_CCP BRD v1.0.md`.

No legal advice, regulatory determination, certification or compliance claim is made by this artifact.
