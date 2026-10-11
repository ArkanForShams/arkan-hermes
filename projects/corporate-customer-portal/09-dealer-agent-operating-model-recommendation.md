# Corporate Customer Portal — Dealer Agent Operating Model Recommendation

Date: 2026-10-11
Prepared for: Shams Tabrez
Status: Recommended architecture/product direction; not production approval

## Executive recommendation

Reframe the product from a narrow quote-to-draft-contract pilot into a **Dealer Agent Operating Portal**.

Dealer agents should receive a complete operational workspace to originate and manage Auto Lead vehicle leases without depending on a dealer's DMS. The portal should be the dealer's primary system of engagement and workflow for Auto Lead transactions. Dealer DMS integration should be optional, deferred, and adapter-based—not a prerequisite for the product.

The portal must provide broad operational access to each authorised agent within the agent's assigned dealer company, showroom, fleet pool and transactions. "Full access" must not mean unrestricted system-wide access, master-data control, cross-dealer visibility, financial override authority, or the ability to bypass approval and evidence gates.

## Recommended product boundary

### Dealer Agent Portal owns the dealer workflow

The portal should support the complete dealer-assisted operating journey:

1. Agent sign-in and secure onboarding
2. Customer and company onboarding
3. KYC/document capture and verification status
4. Vehicle catalogue, availability and comparison
5. Quotation and pricing configuration from approved Auto Lead rates
6. Customer communication and quotation sharing
7. Contract drafting and approval workflow
8. Signature/document evidence capture
9. Vehicle reservation and handover readiness
10. Checkout e-check with photos, video and damage map
11. Contract activity, amendments and driver changes
12. Service requests, maintenance and roadside assistance
13. Fines, incidents and damage cases
14. Check-in e-check and return processing
15. Settlement preparation and dispute initiation
16. Agent, showroom and dealer performance dashboards
17. Notifications, tasks, exceptions and audit history

The first release may keep provider-backed actions in pending/controlled states until evidence and integration contracts are accepted. The user experience should still expose the whole journey so agents do not need to work across disconnected tools.

## What Auto Lead owns

Auto Lead remains the authority for:

- Vehicle master data and fleet ownership
- Vehicle eligibility, allocation policy and availability authority
- Approved rates, products, discounts and pricing rules
- Contract and compliance policy
- Financial calculation rules, invoicing and settlement authority
- Government/provider integrations
- Dealer onboarding, scope, roles and approval limits
- Audit, security, privacy and retention policy

The portal consumes and operationalises these rules. Dealer agents do not edit Auto Lead master data or bypass mandatory controls.

## Dealer DMS position

### Decision: no minimum DMS integration

A dealer must be able to operate the Auto Lead portal with:

- A browser or managed tablet
- Internet access, with controlled offline capture only where approved
- A provisioned dealer identity
- Access to the assigned Auto Lead vehicle pool
- The required customer and vehicle documents

The dealer's DMS is an optional productivity integration, not a system dependency.

### Why this is the best approach

- It removes the largest onboarding barrier for small and mid-sized dealers.
- It avoids coupling Auto Lead delivery to many dealer-specific systems.
- It gives Auto Lead consistent workflow, evidence and audit control.
- It allows a fast pilot with synthetic data and a small dealer cohort.
- It preserves future integration value through a canonical API/event model.
- It prevents dealer DMS data quality and availability from blocking a lease transaction.

### Future DMS integration model

When a dealer requests integration, use an adapter boundary:

- Portal canonical customer, vehicle, quote, contract and service schemas
- Optional inbound connector for dealer customer/opportunity data
- Optional outbound connector for contract, delivery and status updates
- Explicit field mapping and consent/purpose review per dealer
- Idempotent sync with conflict queues and reconciliation
- No direct database access to any dealer DMS
- No assumption that all dealers use the same DMS

Initial options, in order of preference:

1. No integration; portal-only operation
2. CSV/template import and export for low-complexity dealers
3. REST/webhook connector for capable dealer systems
4. Partner-specific adapters only where commercial value justifies the cost

## Dealer-agent access model

### Full operational access within scope

Dealer agents should be able to see and act on:

- Their own customers, quotes, contracts, inspections and cases
- Shared showroom transactions when explicitly enabled
- Their showroom's assigned vehicle pool
- Approved rates and products applicable to their scope
- All workflow tasks required to serve a customer
- Status, history, documents and exception reasons for their transactions
- Service, fine, damage and check-in records for their contracts
- Their own performance and points information

Showroom managers should additionally see and manage showroom-level work, subject to approval and segregation-of-duties rules. Dealer company administrators should see their company data across assigned showrooms.

### Actions that remain restricted

Dealer agents must not:

- Change Auto Lead vehicle master data or rate tables
- Allocate vehicles outside the assigned fleet pool
- Approve their own exceptions or discounts
- Change financial totals, VAT/tax inputs or settlement outcomes directly
- Issue refunds, credit notes or write-offs without approved authority
- Access another dealer company's data
- Export unrestricted customer/KYC/credit data
- Override Tajeer/TAMM/payment/tax/provider outcomes
- Mark an inspection complete when mandatory evidence is missing
- Use AI output as a final credit, compliance, financial or legal decision

This gives agents a genuinely complete working environment while preserving Auto Lead control and tenant isolation.

## Recommended AI capability model

AI should be embedded as a **Dealer Operations Copilot**, not as an unrestricted autonomous agent.

### High-value AI features

| Capability | Dealer benefit | Initial autonomy |
|---|---|---|
| Customer onboarding assistant | Extracts fields from uploaded documents and identifies missing items | Draft and flag; agent confirms |
| Vehicle recommendation | Matches customer needs to eligible vehicles and rates | Recommend only |
| Quote builder | Prepares quote options using approved rate snapshots | Draft; server calculates final price |
| Document assistant | Summarises KYC/contract documents and detects inconsistency | Flag for human review |
| Conversation assistant | Produces Arabic/English customer messages and explanations | Draft for agent approval |
| Workflow assistant | Shows next steps, missing approvals and expiring items | Read-only guidance |
| E-check assistant | Helps detect missing photos, checklist gaps and possible duplicate/poor evidence | Flag; never finalises liability |
| Damage assistant | Compares baseline and return evidence for review | Triage; human classifies |
| Service/fine assistant | Routes cases, extracts references and suggests categorisation | Draft/route |
| Manager briefing | Summarises pipeline, ageing, blockers and showroom performance | Read-only report |
| Support assistant | Answers portal/process questions from approved knowledge | Grounded response with escalation |

### AI must not autonomously

- Approve credit or reject a customer
- Set or alter pricing outside approved rules
- Approve a contract, discount, refund, write-off or settlement
- Declare legal/regulatory compliance
- Decide customer liability for damage
- Send an irreversible external message without approval
- Change a contract, invoice, payment, tax or provider state
- Release a vehicle

AI actions should use the same server-side authorization and state-transition APIs as the human UI. The model must never write directly to the database.

## Architecture recommendation

### System role

Use the portal as:

- System of engagement for dealer agents
- Workflow system for dealer-originated operations
- Evidence and task workspace
- Projection of Auto Lead fleet/rate/reference data
- Controlled integration hub for downstream systems

Do not make the portal an uncontrolled master of Auto Lead fleet, rates, tax, payments or government registration.

### Technical shape

Retain the existing recommendation:

- Domain-oriented modular monolith first
- Hexagonal ports and adapters
- Relational operational database
- Private object storage for documents and inspection media
- Transactional outbox/inbox
- Provider operation ledger
- Explicit pending/unknown/conflict states
- Async integration workers and reconciliation queues
- Canonical portal API for future DMS adapters
- AI copilot service separated from core transaction authority

Current Microsoft architecture guidance supports using an external identity provider, separating authentication from application authorization, explicitly propagating tenant context, and enforcing resource-level authorization in the application. For partner access, use a controlled external-identity architecture with scoped roles and lifecycle management; do not treat broad partner access as equivalent to internal employee access. See Microsoft Azure Architecture Center guidance on multitenant identity, tenant isolation and partner identity.

For AI, use a managed agent/runtime or equivalent with versioned tools, delegated authorization, explicit tenant context, observability and evaluation. Microsoft guidance for multitenant agentic systems recommends delegated authorization where an agent acts on behalf of a user, least privilege, and deterministic tenant-context enforcement. These are appropriate patterns even if the final model provider differs.

## Revised release strategy

### Release 1 — Dealer-only operating foundation

- Dealer identity and scoped access
- Customer/company onboarding
- Vehicle catalogue and assigned-pool visibility
- Quote builder using approved synthetic rate tables
- Contract draft and approval workflow
- Document management
- AI onboarding, quote and workflow copilot
- Basic dashboards and audit trail
- No DMS integration required
- No real payment, tax posting, government release or production e-check

### Release 2 — Controlled operational pilot

Only after P0 evidence is accepted:

- Approved dealer cohort
- Approved real-data controls
- Vehicle reservation integration
- Signature and e-check pilot
- Service/fine/damage workflows
- Provider status reconciliation
- Operational monitoring and support runbooks

### Release 3 — Full Auto Lead operating flow

- Contract activation and registration integrations
- Finance, invoicing and payment workflows
- Check-in and settlement
- Broader dealer network
- Optional DMS adapters
- Customer self-service only as a separate decision and identity track

## Decisions to update in the project register

Recommended changes:

- Replace the phrase "quote-to-draft-contract MVP" with "Dealer Agent Operating Portal — dealer-assisted full lifecycle, controlled release gates".
- Keep individual customers and direct customer self-service deferred.
- Explicitly record that dealer DMS integration is optional and not a Phase 1 dependency.
- Give dealer agents full operational access within their assigned scope, not system-wide administrative access.
- Add AI copilot as a cross-cutting capability with human approval for all consequential actions.
- Treat Auto Lead fleet/rate/financial/provider authorities as external or central authorities until signed evidence confirms otherwise.

## Final recommendation

Shams, the best approach is **not** to build a portal that waits for every dealer's DMS integration. Build Auto Lead's own dealer operating layer first, make it complete enough for agents to run the leasing journey independently, and add DMS connectors later as optional adapters.

This gives Auto Lead control of the customer experience, data quality, compliance evidence and dealer scalability. It also makes the product commercially easier to sell: a dealer can start using it without a long IT integration project.

The correct promise is:

> **"Any authorised dealer can originate and manage Auto Lead leases from one portal, without requiring a dealer DMS."**

That is the stronger product and the more defensible architecture.
