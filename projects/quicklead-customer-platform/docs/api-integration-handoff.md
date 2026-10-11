# Quicklead API integration handoff

## How to connect the existing system

1. Obtain the approved Quicklead Operations API base URL and versioned contract.
2. Create a production environment value:

```bash
NEXT_PUBLIC_QUICKLEAD_API_BASE_URL=https://<approved-api-host>
```

3. Keep the portal's UI and domain types unchanged where possible.
4. Map the existing API responses in `src/lib/api/http.ts` or add a dedicated upstream mapper if the source payload differs from the canonical portal types.
5. Confirm authentication, customer identity matching, scopes, CORS, rate limits, retry rules and webhook/event delivery before enabling production mutations.
6. Run contract tests against a sandbox before switching the build from the mock adapter.

## Required upstream contracts

| Capability | Required interface | Portal use |
|---|---|---|
| Customer identity | `GET /v1/customer/me` or equivalent | Profile, consent, organization scope |
| Customer dashboard | `GET /v1/customer/dashboard` | Active service, garage, invoices and rewards |
| Vehicles | `GET /v1/customer/vehicles` | My Garage |
| Service catalogue | `GET /v1/service-catalogue` | Booking options |
| Branch availability | `GET /v1/branches/{id}/availability` | Available slots |
| Booking | `POST /v1/customer/bookings` | Appointment creation |
| Booking changes | `PATCH /v1/customer/bookings/{id}` | Reschedule/cancel |
| Repair-order status | `GET /v1/customer/services/{id}` | Customer tracker |
| Estimates | `GET /v1/customer/services/{id}/estimate` | Transparent pricing and approval |
| Approval | `POST /v1/customer/services/{id}/approval` | Additional-work decision |
| Invoices | `GET /v1/customer/invoices` | Invoice list and download |
| Payments | Provider-specific hosted flow or tokenized API | Payment completion |
| Notifications | `GET /v1/customer/notifications` | In-app inbox |

## Required cross-cutting behavior

- OAuth/OIDC or another approved customer authentication mechanism.
- Server-side authorization by customer, organization, fleet and vehicle scope.
- `X-Correlation-Id` propagation.
- `Idempotency-Key` for booking, approval and payment commands.
- Stable machine-readable error codes.
- Explicit API versioning and deprecation policy.
- Pagination, filtering and field-level redaction for list endpoints.
- Audit event emission for login, consent, booking, approval, invoice access and payment actions.
- Webhooks or event stream for repair-order status and payment state changes.

## Safety status

The current implementation uses synthetic data unless `NEXT_PUBLIC_QUICKLEAD_API_BASE_URL` is provided at build time. No real API credentials, payment details or production mutations are present in this repository.
