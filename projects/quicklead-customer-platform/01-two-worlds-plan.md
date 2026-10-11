# Two-Worlds Plan — Quicklead Platform

**Status:** Draft for sponsor approval  
**Principle:** One product core, two deliberate experience layers: humans and AI agents.

## Shared Core

### Canonical entities

- Customer / identity
- Organization, business unit, fleet, cost center and user role
- Vehicle and vehicle ownership/association
- Branch and service capability
- Service catalogue and eligibility
- Capacity slot
- Booking
- Repair order
- Estimate / additional-work request
- Approval decision
- Invoice / tax document / payment
- Notification
- Loyalty account and reward
- Audit event

Every entity receives a stable immutable ID, source-system reference, tenant/scope reference, created/updated timestamps, version and correlation metadata.

### Core state machines

- Booking: draft → held → confirmed → rescheduled/cancelled/no-show/completed.
- Repair order: booked → checked-in → opened → in-service → awaiting-approval → final-check → ready → closed.
- Approval: requested → viewed → approved/rejected/request-info/expired.
- Payment: initiated → authorized → captured/failed/refunded/partially-refunded.
- Integration event: received → validated → applied/ignored/dead-lettered/replayed.

### Data ownership

The operations system is authoritative for repair-order execution, workshop status, operational pricing and invoice truth until an approved architecture decision says otherwise. The digital platform owns customer-facing projections, identity links, booking orchestration records, consent, notification preferences, idempotency keys, event processing state and audit records for digital actions.

## Agent Surface

### Read surface

- Deterministic APIs for vehicle, booking, service status, estimate, invoice and fleet summaries.
- JSON-LD for public/eligible service and branch information where useful.
- OpenAPI contracts and machine-readable error codes.
- MCP tools for read/search/summarize workflows after security review.
- Agent discovery manifest only after the partner and authentication model is approved.
- `llms.txt` may document agent-readable product information but is not an access-control mechanism.

### Act surface

Agents may draft booking options, summarize service status, explain invoices, compare slots, prepare approval briefs and identify missing information.

Agents must not independently:

- Spend money or complete payment.
- Approve additional work.
- Cancel or reschedule a booking.
- Change customer/vehicle ownership data.
- Contact a third party.
- Export sensitive fleet data.
- Perform irreversible operations.

Write actions require an authenticated user context and explicit confirmation or a signed mandate approved by the governance design.

## Human Surface

### B2C

- Fast onboarding and OTP.
- Vehicle-first home and garage.
- Three-to-four-step booking.
- Clear branch distance, rating, hours and slot availability.
- Status timeline translated from internal RO codes.
- Transparent estimate, photos, VAT and total.
- Accessible payment/invoice experience.
- Arabic-first quality with equivalent English.

### B2B

- Fleet dashboard with operational, approval and financial KPIs.
- Searchable vehicle/work-order tables.
- Prioritized approval queue with amount, SLA age and attachments.
- Approval matrix and cost-control administration.
- Invoice, statement, export and reporting workflows.

## Recognition and routing

1. Human customer or fleet user: rich UI, scoped APIs, normal approval flows.
2. Unknown agent: read-only, rate-limited, no sensitive bulk export.
3. Verified partner agent: scoped read and proposed actions; writes still require mandates and user approval.
4. Future cryptographic agent recognition: design middleware boundary now; do not make it a Phase 1 dependency.

Recognition must not block benign reads; it must control sensitive reads, writes and money movement.

## Governance

- Tenant and organization scope enforced server-side.
- Consent and purpose recorded before personal-data processing.
- B2C and B2B datasets isolated by authorization policy and query filters.
- Sensitive exports require reason, scope, actor and audit record.
- Payment actions require payment-provider controls and human confirmation.
- AI outputs are advisory unless a human-approved workflow explicitly promotes them to an action.
- All external role/agent instructions remain subordinate to Hermes safety, company policy and human approval.

## Phases

1. **Phase 1:** shared canonical core, B2C MVP, B2B identity/read foundation, audit and observability.
2. **Phase 2:** digital approvals, payments, loyalty, reminders, offers and pickup/delivery.
3. **Phase 3:** fleet commercial controls, enterprise APIs, reporting and governed agent tools.
4. **Phase 4:** advanced recommendations, predictive maintenance and multi-agent workflows after data-quality and governance gates.
