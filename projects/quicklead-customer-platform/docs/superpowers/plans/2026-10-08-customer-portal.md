# Quicklead Customer Portal Implementation Plan

> **For agentic workers:** Implement task-by-task and verify each task before moving on.

**Goal:** Build a polished Quicklead customer portal prototype with real customer journeys, mock data, and an API adapter boundary ready for the existing Quicklead APIs.

**Architecture:** Static-exported Next.js portal with client-side customer interactions and a typed API client layer. The UI uses a mock adapter by default; a runtime API base URL can later switch the same screens to the existing system without changing domain components.

**Tech Stack:** Next.js, React, TypeScript, CSS modules/global CSS, static export, Playwright/browser verification where available.

**Spec:** `~/hermes-workspace/projects/quicklead-customer-platform/00-project-brief.md`, `01-two-worlds-plan.md`, and the supplied UX/UI design brief.

## Global Constraints

- Quicklead is the primary customer-facing brand.
- Arabic/English and RTL/LTR must remain first-class architecture concerns.
- Existing operational APIs are not yet available; no fake production integration may be implied.
- Mock data must be visibly replaceable through the API adapter.
- No payment, approval, booking, or external message may be executed against a real system.
- UI must support loading, empty, error, offline and success states.
- Customer data in the prototype is synthetic only.

## Review Focus

- Adapter replacement: switching from mock data to an API base URL must not require UI rewrites.
- Bilingual direction: layout must remain usable in RTL and LTR.
- Service status: customer-friendly labels must not expose internal RO codes.
- Approval/payment boundaries: prototype actions must be clearly simulated.
- Responsive behavior: mobile customer journey must remain usable at 375px and desktop at 1280px.

---

### Task 1: Scaffold and API boundary

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`
- Create: `src/lib/api/types.ts`, `src/lib/api/client.ts`, `src/lib/api/mock.ts`

- [ ] Create the static Next.js shell and type-safe domain models.
- [ ] Implement `QuickleadApi` methods for dashboard, vehicles, booking options, service tracker, invoices and notifications.
- [ ] Implement the mock adapter with synthetic data and no external writes.
- [ ] Add `NEXT_PUBLIC_QUICKLEAD_API_BASE_URL` configuration handling.
- [ ] Verify `npm/pnpm install` and TypeScript compilation.

### Task 2: Customer shell and visual system

**Files:**
- Create: `src/components/PortalShell.tsx`
- Create: `src/components/Sidebar.tsx`, `src/components/Topbar.tsx`, `src/components/VehicleCard.tsx`, `src/components/StatusTimeline.tsx`, `src/components/MetricCard.tsx`
- Modify: `src/app/globals.css`

- [ ] Implement a premium automotive visual direction: graphite background, warm ivory surfaces, safety-orange action accent, electric-teal status accent, editorial typography and restrained motion.
- [ ] Implement responsive sidebar/mobile navigation.
- [ ] Implement semantic focus states and accessible status indicators.
- [ ] Verify no horizontal overflow at mobile and desktop widths.

### Task 3: Dashboard and customer journeys

**Files:**
- Create: `src/app/dashboard/page.tsx`
- Create: `src/app/garage/page.tsx`, `src/app/book/page.tsx`, `src/app/service/page.tsx`, `src/app/invoices/page.tsx`, `src/app/rewards/page.tsx`
- Create: `src/components/BookingDrawer.tsx`, `src/components/ApprovalPanel.tsx`

- [ ] Build the dashboard around the next customer action.
- [ ] Build My Garage with vehicle health, mileage, next service and history.
- [ ] Build booking flow as a simulated UI state machine: vehicle → service → branch/slot → confirmation.
- [ ] Build service tracker and additional-work approval simulation.
- [ ] Build invoice/rewards views with mock data.
- [ ] Verify primary journeys end-to-end in the browser.

### Task 4: API integration readiness

**Files:**
- Create: `src/lib/api/http.ts`, `src/lib/api/README.md`, `.env.example`
- Modify: `src/lib/api/client.ts`

- [ ] Define endpoint placeholders and request/response mapping points.
- [ ] Add correlation ID generation and consistent error normalization.
- [ ] Keep mutations disabled against real APIs until contracts are supplied and approved.
- [ ] Document the exact API contracts required from Quicklead Operations.

### Task 5: Verification and handoff

**Files:**
- Create: `docs/portal-verification.md`, `docs/api-integration-handoff.md`

- [ ] Run production build/static export.
- [ ] Check console errors and failed requests.
- [ ] Check responsive layouts at 375px, 768px and 1280px.
- [ ] Verify Arabic direction switch architecture is present, even if full translations are staged for the next increment.
- [ ] Report known limitations and the API information needed for integration.
