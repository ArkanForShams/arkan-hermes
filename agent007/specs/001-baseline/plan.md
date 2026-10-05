# Agent 007 — Implementation Plan

**As-of:** 2026-10-05 | **Derives from:** specs/001-baseline/spec.md | **Constitution:** v1.0.0

## 1. Skeleton Study (Clone Wars lineage)

Entries examined (~/website-arsenal/clone-wars/README.md, as-of 2026-10-05):

| Skeleton | Lesson taken | What we reject |
|---|---|---|
| **Taiga** (taigaio, Django+Angular, production) | Production-grade model: Project → Epic/UserStory/Task with Status enum per project, membership roles (owner/member), Milestone timeline | Angled heavy project mgmt (epics/points), Django/Angular stack, its UI skin |
| **Wekan** (Meteor, production) | Board → List → Card shape, simple drag mechanics, self-host deploy mindset | Meteor runtime, its exact board look |
| **Linear clone** (tuan3w, React+Tailwind) | Modern issue-tracker UX: keyboard-first list, sidebar navigation, fast optimistic UI | Its visual identity (Linear's indigo/dark aesthetic — explicitly NOT to be replicated) |

**Adoption:** data-shape patterns (project/status/membership, board-card, follow-up timeline) + UX patterns (toggleable board/list, command bar, optimistic updates). **Rejection:** all branding, layout geometry, colors, names, and heavy-process concepts. Agent 007's identity is original (ui-design.md) and its differentiator — AI war room for email-driven vendor issues — exists in none of the studied skeletons.

## 2. Stack (Constitution VI & VIII)

| Layer | Choice | Rationale |
|---|---|---|
| Framework | Next.js 16.3.8 (App Router) + TypeScript (scaffolded 2026-10-05; plan originally targeted 15, `latest` ships 16 — accepted, same architecture) | One build for web+mobile-responsive (FR interview R1); server actions reduce API boilerplate; battle-tested |
| Styling | Tailwind CSS v4 + CSS custom-property design tokens | Fast consistent styling; tokens make RTL/palette systemic |
| Database | SQLite (dev + Phase 1) behind Prisma ORM | Zero-ops for self-host; Prisma swap path to PostgreSQL documented (data-model.md §6) |
| Auth | Hand-rolled sessions: bcryptjs hashes, `jose`-signed JWT in httpOnly cookie, edge-verifiable middleware. Auth.js v5 kept as documented swap path (AuthProvider boundary) | Own-accounts today (interview R5); no beta-library risk; SSO swap contained |
| AI | `AILinear` interface → first adapter: OpenAI-compatible chat API (env-configured, zero-retention provider to be chosen by Shams); second adapter: deterministic template fallback (works with NO key) | Constitution VIII; demo & tests never depend on external API |
| Mail | `MailConnector` interface → `GraphMailConnector` (delegated refresh-token flow, `Mail.Read` only; one-time provisioning documented in README) + `DemoMailConnector` (simulated inbox for dev/tests) | Constitution III; demoable E2E without company tenant |
| Scheduler | node-cron in Next.js instrumentation hook (server-side singleton) | FR-5 daily follow-up engine, FR-4 polling |
| Tests | Vitest (unit) + Playwright (E2E smoke) | Constitution VI gates |
| i18n | DIY dictionary module (no heavy i18n lib) — `t(locale, key)` + `dir` helper | 2 languages only; simplicity principle |
| Deploy | Self-host on Shams infra: `npm run build && npm start` behind reverse proxy; SQLite backups via script | NFR §5 data residency |

## 3. Architecture

```
Browser (Next.js RSC + client islands)
  │  server actions (zod-validated, role-checked)
  ▼
Service layer (lib/services/*)  ← business rules live here, not in UI
  ├── issues.service    ├── drafts.service (AI suggest-mode)
  ├── ingest.service    ├── followups.service (daily engine)
  ├── meetings.service  ├── vendors.service
  ▼
Prisma (SQLite)            External (read-only): Graph API → MailConnector
                                     LLM API → AILinear
```

- **Server actions** enforce role + validation; UI hides buttons but server decides (Constitution: Roles enforced server-side).
- **Audit trail:** every mutation writes `AuditEvent` in the same transaction.
- **Scheduler** tick: poll inbox → classify → mark follow-ups due → generate follow-up drafts (AI label enforced).

## 4. Build Order (maps to tasks.md)

1. Scaffold + tokens + i18n frames
2. Prisma schema + seed (users, vendor mapping sample)
3. Auth + roles + audit
4. Projects + issues CRUD + board/list
5. Mail connector (Demo first, Graph second) + ingestion + triage
6. AI drafting (issue narrative → vendor email) + review panel + mailto handoff
7. Follow-up engine + reply matching + completeness flags
8. Meetings (paste → AI summary → action items → issues)
9. Dashboards (team/leadership/stand-up)
10. Settings (vendor mapping CSV import, ingestion rules, users)
11. Bilingual sweep + RTL QA
12. E2E tests, Lighthouse, mobile QA, backup script, README

## 5. Risk Register

| Risk | Mitigation |
|---|---|
| Graph tenant approval delayed | DemoMailConnector keeps entire product usable while waiting |
| AI drafts off-tone | Prompt pinned in spec; always "AI-drafted" labeled; human edit gate |
| Reply matching wrong thread | Match on `internetMessageId` + participant set, conservative; mismatches surface for manual link |
| SQLite concurrent writes | Low user count; WAL mode enabled; Postgres swap path ready |
| "007" trademark concern | Internal-only now (constitution); wordmark swappable |

## 6. Verification Plan

- Unit: services (follow-up due logic, classification dedupe, mapping resolution)
- E2E Playwright: login → create project → manual issue → move stages → demo-inbox ingest → triage → draft → "open in outlook" handoff → meeting paste → summary → dashboard numbers consistent
- Lighthouse ≥ 90; RTL visual check both locales; mobile viewport 390px pass