# Agent 007 — Data Model (Prisma)

**As-of:** 2026-10-05 | **Derives from:** spec.md §2/§3 | **Lineage:** Taiga's project/status pattern + Wekan's board shape (structure only)

## 1. Entity Relationship Overview

```
User ─┬─< Issue(assignee)          Project ─┬─< Issue
      ├─< AuditEvent                        ├─< Meeting
      └─< ProjectMember                     └─< BoardPref(per user)
Vendor ──< Application ─< Issue          Issue ─┬─< Activity
(1 vendor → n applications)                     ├─< EmailMessage(ingested)
Meeting ──< MeetingItem ─< Issue(idle link)     ├─< FollowUp(>0)
                                                └─< DraftVersion(>0)
```

## 2. Prisma Schema (source of truth)

```prisma
generator client { provider = "prisma-client-js" }
datasource db { provider = "sqlite"; url = env("DATABASE_URL") }

enum Role        { ADMIN TEAM VIEWER }
enum IssueStage  { NEW ANALYZING WITH_VENDOR FOLLOW_UP RESOLVED CLOSED }
enum Priority    { LOW MEDIUM HIGH CRITICAL }
enum MeetingType { STANDUP VENDOR ADHOC }
enum DraftStatus { PENDING EDITED HANDED_OFF DISCARDED }
enum FollowUpState { PREPARED SENT_BY_USER REPLIED CLOSED }

model User {
  id            String   @id @default(cuid())
  username      String   @unique
  displayName   String
  email         String?  // optional; Microsoft SSO swap keys on this later
  passwordHash  String
  role          Role     @default(TEAM)
  locale        String   @default("en")   // "en" | "ar"
  active        Boolean  @default(true)
  createdAt     DateTime @default(now())
  issues        Issue[]  @relation("assignee")
  activities    Activity[]
  auditEvents   AuditEvent[]
}

model Project {
  id        String  @id @default(cuid())
  key       String  @unique            // "OPS" → issue codes OPS-0142
  nameEn    String
  nameAr    String
  descEn    String?
  descAr    String?
  colorTag  String  @default("#1F6FEB")
  archived  Boolean @default(false)
  issues    Issue[]
  meetings  Meeting[]
  members   ProjectMember[]
  createdAt DateTime @default(now())
}

model ProjectMember {
  id        String  @id @default(cuid())
  projectId String
  userId    String
  role      Role    @default(TEAM)
  project   Project @relation(fields: [projectId], references: [id])
  user      User    @relation(fields: [userId], references: [id])
  @@unique([projectId, userId])
}

model Vendor {
  id          String  @id @default(cuid())
  name        String  @unique          // canonical vendor name
  supportEmail String?                 // primary support mailbox
  escalationEmail String?
  notesEn     String?
  notesAr     String?
  active      Boolean @default(true)
  applications Application[]
}

model Application {
  id          String @id @default(cuid())
  name        String @unique            // "SAP MM", "Oracle EBS", internal app name
  vendorId    String
  vendor      Vendor @relation(fields: [vendorId], references: [id])
  contextEn   String?                   // technical context fed to AI drafting
  contextAr   String?
  issues      Issue[]
}

model Issue {
  id          String   @id @default(cuid())
  number      Int                       // per-project human counter
  code        String   @unique          // "OPS-0142"
  projectId   String
  project     Project  @relation(fields: [projectId], references: [id])
  titleEn     String
  titleAr     String?
  descEn      String?
  descAr      String?
  stage       IssueStage @default(NEW)
  priority    Priority  @default(MEDIUM)
  assigneeId  String?
  assignee    User?     @relation("assignee", fields: [assigneeId], references: [id])
  applicationId String?
  application Application? @relation(fields: [applicationId], references: [id])
  // denormalized vendorId for fast vendor grouping (kept in sync via service)
  dueDate     DateTime?
  source      String   @default("manual")  // manual | outlook
  enteredVendorAt DateTime?             // follow-up clock start
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  activities  Activity[]
  emails      EmailMessage[]
  followUps   FollowUp[]
  drafts      DraftVersion[]
  @@index([projectId, stage])
  @@index([stage, enteredVendorAt])
}

model Activity {
  id        String   @id @default(cuid())
  issueId   String
  issue     Issue    @relation(fields: [issueId], references: [id])
  userId    String?
  user      User?    @relation(fields: [userId], references: [id])
  type      String   // created|stage_change|comment|draft_handed_off|reply_matched|…
  payload   String   // JSON blob (oldStage, newStage, note text, …)
  createdAt DateTime @default(now())
  @@index([issueId, createdAt])
}

model EmailMessage {
  id             String @id             // Graph internetMessageId (dedupe key)
  issueId        String?
  issue          Issue?  @relation(fields: [issueId], references: [id])
  direction      String  // inbound | outbound_prepared
  fromAddr       String
  subject        String
  bodyPreview    String   // first ~2000 chars retained only (Constitution IV)
  receivedAt     DateTime
  classified     Boolean  @default(false)
  suggestedAppId String?
  suggestedVendorId String?
  suggestedPriority String?
  aiVerdict      String?  // issue | noise
  createdAt      DateTime @default(now())
  @@index([issueId, receivedAt])
}

model DraftVersion {
  id         String  @id @default(cuid())
  issueId    String
  issue      Issue   @relation(fields: [issueId], references: [id])
  kind       String  // vendor_email | followup
  subject    String
  body       String
  status     DraftStatus @default(PENDING)
  generatedBy String  @default("ai")     // ai | human
  handedOffAt DateTime?
  createdAt  DateTime @default(now())
  @@index([issueId, createdAt])
}

model FollowUp {
  id          String  @id @default(cuid())
  issueId     String
  issue       Issue   @relation(fields: [issueId], references: [id])
  state       FollowUpState @default(PREPARED)
  draftId     String?                       // → DraftVersion
  dueOn       DateTime                      // the day it became due
  note        String?
  createdAt   DateTime @default(now())
  @@unique([issueId, dueOn])
}

model Meeting {
  id        String  @id @default(cuid())
  projectId String?
  project   Project? @relation(fields: [projectId], references: [id])
  title     String
  type      MeetingType @default(STANDUP)
  heldOn    DateTime
  rawNotes  String?                       // pasted transcript/notes
  summaryEn String?
  summaryAr String?
  decisions String?                       // JSON array
  actions   String?                       // JSON array [{text, assigneeId, issueId?}]
  openQuestions String?
  createdBy String
  createdAt DateTime @default(now())
}

model AuditEvent {
  id        String   @id @default(cuid())
  userId    String?
  user      User?    @relation(fields: [userId], references: [id])
  action    String   // login|issue.stage|draft.handoff|settings.change|…
  entity    String   // "issue:CUID", "user:3", …
  detail    String?
  ip        String?
  createdAt DateTime @default(now())
  @@index([createdAt])
}

model BoardPref {
  id        String @id @default(cuid())
  userId    String
  projectId String
  view      String @default("board")     // board | list
  @@unique([userId, projectId])
}
```

## 3. Derived Concepts

- **Issue code:** `{project.key}-{number padded 4}` — generated in service layer within the project create-transaction (per-project counter via `MAX(number)+1` with retry on race).
- **Follow-up clock:** set `enteredVendorAt` when stage becomes `WITH_VENDOR`; engine flags issue when `now - enteredVendorAt ≥ 24h && stage == WITH_VENDOR` and no inbound reply matched; creates/refreshes one `FollowUp(dueOn=today, state=PREPARED)` + AI follow-up draft (idempotent via `@@unique([issueId, dueOn])`).
- **Reply matching:** inbound email `internetMessageId` unique; thread match by from-address ∈ issue email participants AND `subject` prefix match (`RE:` normalized); conservative — no match → triage queue, never auto-attach.

## 4. Retention & Privacy

- Email bodies: only `bodyPreview` (≤2000 chars) persisted; full text lives in Outlook (we can re-fetch read-only if needed).
- Tokens (Graph) live in `.env`-encrypted store outside DB backup scope.
- Audit covers stage changes, handoffs, settings, logins.

## 5. Indexing & Performance

- Board query: `@@index([projectId, stage])`
- Follow-up engine: `@@index([stage, enteredVendorAt])`
- Inbox triage: `@@index([classified, receivedAt])` (via EmailMessage.classified + receivedAt query in service)

## 6. SQLite → PostgreSQL Swap Path

Prisma keeps schema portable: change `datasource provider`, replace `cuid` fine, migrate via `prisma migrate diff`. JSON blobs (`payload`, `actions`) move to `jsonb` columns at swap time. Documented, untested until needed — labeled as such.