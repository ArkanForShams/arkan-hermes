# Quicklead Vehicle Quick Service Customer Platform — Project Brief

**Date:** October 8, 2026  
**Status:** Discovery kickoff; not yet approved for build  
**Sponsor:** Shams Tabrez / Quicklead stakeholders to confirm  
**Chief of Staff:** ARKAN

## 1. Executive outcome

Create a secure, bilingual, scalable customer and fleet platform that lets people and corporate fleet teams book quick service, track work, approve additional repairs, pay invoices, and access service records without relying on calls or manual branch follow-up.

The existing Quicklead operational application remains the system of record for repair orders, workshop execution, pricing, invoicing, and service status. The new platform must integrate through governed APIs and events rather than direct mobile/web database access.

## 2. Users and actors

| Actor | Primary needs | Trust boundary |
|---|---|---|
| Individual customer | Manage vehicles, book service, track status, approve work, pay, download invoices, use rewards | Own vehicles and authorized repair interactions only |
| Fleet manager | See fleet health, workshop vehicles, approvals, spend, downtime, invoices, reports | Company/fleet/cost-center scope |
| Corporate approver | Review estimates, attachments, comments, SLA and approval matrix | Delegated amount/service/vehicle authority |
| Branch/service advisor | Execute workshop work and respond to customer-facing events | Operational system roles; not assumed to be in the customer platform |
| Finance user | Invoices, credit notes, statements, VAT records and payment reconciliation | Finance and company scope |
| Platform administrator | Configuration, users, roles, branches, feature flags, audit and support | Privileged, strongly controlled |
| External systems | Operations, CRM, vehicle master, payment, messaging, loyalty, analytics | Contracted integration identities only |
| AI agents | Read/search/summarize/assist within explicitly scoped data and tools | Read-first; write and money actions require human mandate |

## 3. MVP boundary

### Phase 1 — recommended MVP

- Mobile OTP authentication and consent.
- Arabic and English language support with RTL/LTR.
- Customer profile and notification preferences.
- My Garage: add and manage vehicles by plate/VIN, mileage and ownership evidence as applicable.
- Service/branch selection and capacity-aware booking.
- Booking confirmation, reschedule and cancellation rules.
- Service history for closed repair orders.
- Customer-facing live service tracker mapped to operational statuses.
- Invoice view/download and notification delivery.
- Core push/SMS/email notifications.
- Central audit and observability.
- B2B foundation: corporate identity, fleet/vehicle read view, and approval queue read model if required for pilot.

### Deferred unless discovery proves essential

- Online payment completion.
- Digital additional-work approval.
- Loyalty, coupons and referral.
- Pickup/delivery.
- Full B2B approval matrix and commercial controls.
- Enterprise customer APIs.
- AI-driven recommendations.

The source documents place payments, approvals, loyalty and B2B intelligence across later phases; this brief preserves that separation while recommending early technical contracts for them.

## 4. Non-functional targets to approve

These are proposed starting budgets, not final commitments:

| Area | Proposed target | Verification |
|---|---:|---|
| Availability | 99.9% monthly for booking/status APIs in production | Synthetic checks and monthly SLO report |
| API latency | p95 ≤ 500 ms for read APIs; p95 ≤ 1,000 ms for booking/approval commands excluding external dependency | Load tests and dependency timing |
| Status freshness | 95% of operational status events visible within 60 seconds | Event-lag metric |
| Booking idempotency | No duplicate confirmed booking for a repeated command key | Contract and chaos tests |
| Audit completeness | 100% of approval, payment, invoice-access and admin actions recorded | Audit reconciliation |
| Recovery | RPO ≤ 15 minutes; RTO ≤ 60 minutes for critical platform data | Restore/failover drill |
| Scale | Design for millions of customer identities and thousands of daily service transactions; capacity model required before production sizing | Load model and capacity test |
| Accessibility | WCAG 2.2 AA target for portal; mobile equivalent accessibility review | Automated + manual assessment |
| Localization | Arabic/English content parity and RTL/LTR visual acceptance | Bilingual UX test pack |

## 5. Architecture principles

1. Existing operations system remains authoritative for workshop execution and financial truth unless an ADR explicitly assigns ownership elsewhere.
2. No direct client access to the operational database.
3. API-first, contract-first, versioned interfaces.
4. Commands are idempotent; events are replayable and correlated.
5. Separate B2C and B2B authorization scopes and data projections.
6. Privacy and security are designed into identity, consent, data retention, audit and deletion.
7. Same canonical data source feeds human UI and agent surfaces.
8. Start with a modular platform; do not create microservices without independent scaling, ownership or failure-boundary justification.
9. Arabic is a first-class product experience, not a translation phase.
10. Every critical workflow has an observable state machine and explicit failure handling.

## 6. Success measures

- Digital booking conversion and share of total appointments.
- Reduction in status-related calls and messages.
- Approval turnaround time.
- Repeat visit and loyalty engagement.
- Accepted recommended work and average invoice value.
- Fleet self-service adoption for invoices and statements.
- Booking failure rate and duplicate-command rate.
- Status-event freshness and notification delivery rate.
- Customer satisfaction after booking, service completion and support interaction.

## 7. Decisions required from sponsor

1. Confirm product/legal brand: Quicklead, Auto Lead, or a multi-brand model.
2. Confirm target operating countries and launch country/branches.
3. Confirm current operational-system vendor, API capability, database ownership and integration constraints.
4. Confirm B2C payment scope for MVP and the approved payment provider shortlist.
5. Confirm whether B2B portal is MVP pilot scope or Phase 2.
6. Confirm customer identity matching rules and acceptable vehicle ownership evidence.
7. Confirm data residency, hosting and cross-border integration constraints.
8. Confirm business owners for Operations, Finance, CRM/Loyalty, Security, Legal/Privacy and Customer Support.
9. Approve proposed NFR budgets or provide replacements.
10. Approve a discovery sprint before implementation.
