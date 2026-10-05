# Agent 007 — Tasks (Build Breakdown)

**As-of:** 2026-10-05 | **Derives from:** spec.md + plan.md §4 | Convention: [P]=parallelizable.

## Phase A — Foundation
- [ ] A1. Scaffold Next.js 15 TS app (`agent007`), Tailwind v4, ESLint, absolute imports
- [ ] A2. Design tokens (desert-formal palette) + IBM Plex Sans/Arabic/Mono self-hosted
- [ ] A3. i18n module: dictionaries en/ar (100% coverage test), `t()`, dir helper
- [ ] A4. Prisma schema (data-model.md) + migrations + SQLite WAL + seed script (users, 2 projects, vendor mapping sample)
- [ ] A5. Service layer skeleton + audit-event writer + zod validation helpers

## Phase B — Access
- [ ] B1. Auth.js credentials sign-in, argon2, httpOnly session, login page (bilingual)
- [ ] B2. Role enforcement helpers (requireAdmin/requireTeam/requireViewer) + middleware
- [ ] B3. User management screens (admin: create/deactivate users)

## Phase C — Core Work Management
- [ ] C1. Projects CRUD + project list home (counts per stage)
- [ ] C2. Issues CRUD + quick-add drawer + issue drawer panel
- [ ] C3. Kanban board (drag, optimistic, tap-move mobile fallback)
- [ ] C4. List view (sort, sticky header) + per-user per-project view preference
- [ ] C5. Activity log rendering on issue panel

## Phase D — Mail & AI War Room
- [ ] D1. `MailConnector` interface + `DemoMailConnector` (seeded fake inbox) [P]
- [ ] D2. `GraphMailConnector`: MSAL device-flow, Mail.Read, poll, dedupe, preview-only storage [P]
- [ ] D3. `AILinear` interface + OpenAI-compatible adapter + deterministic fallback adapter (no-key mode)
- [ ] D4. Ingestion + AI classification + triage inbox (split view, suggestion chips, convert→issue)
- [ ] D5. Vendor email drafting: issue→narrative→email draft, review editor, "Open in Outlook" handoff (mailto w/ recipient+subject+body)
- [ ] D6. Follow-up engine: daily scheduler, 24h flagging, prepared follow-up drafts, reply matching (messageId/thread), auto stage move + completeness flags

## Phase E — Meetings
- [ ] E1. Meetings CRUD + pasted-notes input
- [ ] E2. AI summary (decisions/actions/questions/next steps, bilingual) + action items → issues conversion

## Phase F — Visibility
- [ ] F1. Team dashboard (by stage, overdue, follow-ups due)
- [ ] F2. Leadership dashboard (portfolio, vendors, departments, trends)
- [ ] F3. Stand-up view (today board glance)
- [ ] F4. Settings: vendor mapping (CSV import + manual), ingestion rules, users

## Phase G — Quality Gates
- [ ] G1. Unit tests: follow-up due logic, dedupe, matching, mapping resolution, i18n completeness
- [ ] G2. E2E Playwright: full flow per plan.md §6
- [ ] G3. RTL + mobile (390px) visual QA
- [ ] G4. Lighthouse ≥ 90 all categories
- [ ] G5. Backup script + README (runbook, restore, env matrix, swap paths)
- [ ] G6. Git init + push + share link

**Skipped deliberately (spec'd out):** none — all A–G items are in-scope per constitution. Deferred to later phases per spec.md §6: Graph send scope, Drafts-folder writes, Teams/Calendar, SSO, transcription.