// Agent 007 — follow-up engine (FR-5): daily discipline, reply matching, completeness flags
import "server-only";
import { prisma } from "@/lib/prisma";
import { getAI } from "@/lib/ai";
import { generateFollowUpDraft } from "./drafts";

export const FOLLOWUP_THRESHOLD_HOURS = 24;

export interface DueFollowUp {
  issueId: string;
  issueCode: string;
  title: string;
  vendorName: string;
  daysWaiting: number;
  pendingFollowUpId?: string;
}

/** Issues waiting on a vendor >24h in WITH_VENDOR without a recent reply. */
export async function computeDueFollowUps(): Promise<DueFollowUp[]> {
  const cutoff = new Date(Date.now() - FOLLOWUP_THRESHOLD_HOURS * 3600_000);
  const issues = await prisma.issue.findMany({
    where: { stage: "WITH_VENDOR", enteredVendorAt: { lte: cutoff } },
    include: {
      application: { include: { vendor: { select: { name: true } } } },
    },
    orderBy: { enteredVendorAt: "asc" },
  });

  const today = startOfToday();
  const out: DueFollowUp[] = [];
  for (const issue of issues) {
    // A pending FollowUp row for today acts as the idempotent marker
    const pending = await prisma.followUp.findUnique({
      where: { issueId_dueOn: { issueId: issue.id, dueOn: today } },
    });
    const daysWaiting = issue.enteredVendorAt
      ? Math.max(1, Math.floor((Date.now() - issue.enteredVendorAt.getTime()) / 86_400_000))
      : 1;
    out.push({
      issueId: issue.id,
      issueCode: issue.code,
      title: issue.titleEn,
      vendorName: issue.application?.vendor.name ?? "—",
      daysWaiting,
      pendingFollowUpId: pending?.id,
    });
  }
  return out;
}

function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * The daily tick (called by scheduler + manually from Follow-ups screen).
 * 1. Ensure a FollowUp row (PREPARED) exists for every due issue (idempotent per day).
 * 2. Generate the ready-to-send follow-up draft text via AI (suggest mode).
 * 3. Match inbound vendor replies: WITH_VENDOR + reply arrived → move to FOLLOW_UP stage.
 */
export async function runDailyTick(userId: string | null, locale: "en" | "ar" = "en"): Promise<{
  prepared: number;
  repliesMatched: number;
}> {
  let prepared = 0;
  let repliesMatched = 0;

  // 1+2. ensure rows + drafts for due issues
  const due = await computeDueFollowUps();
  const today = startOfToday();
  for (const d of due) {
    const existing = d.pendingFollowUpId
      ? await prisma.followUp.findUnique({ where: { id: d.pendingFollowUpId } })
      : null;

    let fu = existing;
    if (!fu) {
      fu = await prisma.followUp.create({
        data: { issueId: d.issueId, dueOn: today, state: "PREPARED" },
      });
    }
    // one prepared draft per follow-up row
    const hasDraft = fu.draftId
      ? !!(await prisma.draftVersion.findFirst({ where: { id: fu.draftId!, status: { not: "DISCARDED" } } }))
      : false;
    if (!hasDraft) {
      const draft = await generateFollowUpDraftForTick(d, locale, userId);
      await prisma.followUp.update({ where: { id: fu.id }, data: { draftId: draft.id } });
      prepared++;
    }
  }

  // 3. reply matching — conservative: exact participant + subject-token match
  repliesMatched = await matchVendorReplies();
  return { prepared, repliesMatched };
}

async function generateFollowUpDraftForTick(
  d: DueFollowUp,
  locale: "en" | "ar",
  userId: string | null
) {
  const ai = getAI();
  const { subject, body } = await ai.draftFollowUp({
    issueCode: d.issueCode,
    issueTitle: d.title,
    vendorName: d.vendorName,
    daysWaiting: d.daysWaiting,
    lastFollowUpSubject: null,
    locale,
  });
  const draft = await prisma.draftVersion.create({
    data: { issueId: d.issueId, kind: "followup", subject, body },
  });
  if (userId) {
    await prisma.activity.create({
      data: { issueId: d.issueId, userId, type: "followup_prepared", payload: JSON.stringify({ draftId: draft.id, by: "engine" }) },
    });
  } else {
    await prisma.activity.create({
      data: { issueId: d.issueId, type: "followup_prepared", payload: JSON.stringify({ draftId: draft.id, by: "scheduler" }) },
    });
  }
  return draft;
}

/**
 * Match inbound emails to issues waiting on vendors.
 * Conservative rules: from-address matches vendor support/escalation email,
 * subject shares a token with the issue code or title. On match:
 * WITH_VENDOR → FOLLOW_UP + REPLIED marker + completeness check.
 */
export async function matchVendorReplies(): Promise<number> {
  const waiting = await prisma.issue.findMany({
    where: { stage: "WITH_VENDOR" },
    include: { application: { include: { vendor: true } }, emails: true },
  });
  const unlinked = await prisma.emailMessage.findMany({
    where: { issueId: null, classified: true, aiVerdict: "issue" },
    take: 50,
  });

  let matched = 0;
  for (const email of unlinked) {
    const from = email.fromAddr.toLowerCase();
    const subj = email.subject.toLowerCase();

    const candidate = waiting.find((issue) => {
      const vendor = issue.application?.vendor;
      if (!vendor) return false;
      const vendorAddrs = [vendor.supportEmail, vendor.escalationEmail]
        .filter(Boolean)
        .map((a) => a!.toLowerCase());
      const addrMatch = vendorAddrs.some((a) => from === a || from.endsWith("@" + a.split("@")[1]));
      if (!addrMatch) return false;
      const codeToken = issue.code.toLowerCase();
      const titleTokens = issue.titleEn.toLowerCase().split(/\s+/).filter((w) => w.length > 4);
      return subj.includes(codeToken) || titleTokens.some((t) => subj.includes(t));
    });

    if (candidate) {
      await prisma.$transaction([
        prisma.emailMessage.update({
          where: { id: email.id },
          data: { issueId: candidate.id },
        }),
        prisma.issue.update({
          where: { id: candidate.id },
          data: { stage: "FOLLOW_UP" },
        }),
        prisma.activity.create({
          data: {
            issueId: candidate.id,
            type: "reply_matched",
            payload: JSON.stringify({ emailId: email.id, subject: email.subject }),
          },
        }),
      ]);
      matched++;
    }
  }
  return matched;
}

/** Reply completeness check (AI compares vendor answers vs our questions). */
export async function checkReply(issueId: string, replyText: string) {
  const issue = await prisma.issue.findUnique({
    where: { id: issueId },
    include: { activities: { where: { type: { in: ["draft_handed_off"] } } } },
  });
  if (!issue) throw new Error("ISSUE_NOT_FOUND");
  const ai = getAI();
  // Questions we asked = from the latest handed-off draft body's numbered requests
  const lastHandoff = await prisma.draftVersion.findFirst({
    where: { issueId, kind: "vendor_email", status: "HANDED_OFF" },
    orderBy: { createdAt: "desc" },
  });
  const questions = (lastHandoff?.body ?? "").match(/^\s*\d[\).]\s+(.+)$/gm) ?? [];
  return ai.checkReplyCompleteness(questions, replyText);
}

export async function listFollowUpsToday() {
  return computeDueFollowUps();
}