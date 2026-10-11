# Portal verification record

## Build verification — October 8, 2026

- `pnpm install` — passed.
- Next.js upgraded to `16.4.0` after the initial package install reported a security warning for the earlier version.
- `pnpm typecheck` — passed.
- `pnpm build` — passed.
- Static route generated: `/`.
- Default data source: synthetic mock adapter.
- No external API credentials or payment details included.

## Browser verification status

The local portal server was started on `127.0.0.1:3100`. Automated browser verification could not run because the local Camofox browser service was unavailable in this session. The production compiler verified the page and TypeScript successfully; visual browser QA remains a required follow-up before stakeholder sign-off.

## Acceptance checklist

- [x] Customer dashboard renders from mock adapter.
- [x] Active service tracker is visible.
- [x] Booking modal is wired as a safe simulated interaction.
- [x] Garage and invoice data are rendered from typed models.
- [x] API base URL is configurable.
- [x] HTTP adapter includes correlation and idempotency headers.
- [x] OpenAPI draft exists for the initial portal boundary.
- [x] Static production build succeeds.
- [x] Booking history page with All/Confirmed/Completed/Cancelled filters.
- [x] Booking detail pages with modify and cancel demo workflows.
- [x] Booking activity log and customer/advisor comments.
- [x] Offers and recommended add-on services before slot confirmation.
- [x] Booking route and detail route return HTTP 200 locally and through the current public tunnel.
- [ ] Validate real booking mutation, reschedule and cancellation APIs.
- [ ] Validate real comments/support API and audit persistence.
- [ ] Validate real offer eligibility and service pricing rules.
- [ ] Validate with real Quicklead sandbox contract.
- [ ] Validate Arabic translations and RTL visual layout.
- [ ] Validate 375px, 768px and 1280px screenshots.
- [ ] Complete security, privacy and payment-provider review.
