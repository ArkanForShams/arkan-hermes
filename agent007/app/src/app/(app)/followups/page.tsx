// Agent 007 — Follow-ups Today (FR-5)
import { getSession } from "@/lib/auth";
import { getLocale, labelsFor } from "@/lib/labels";
import { listFollowUpsToday } from "@/lib/services/followups";
import { prisma } from "@/lib/prisma";
import FollowUpsClient from "./FollowUpsClient";

export default async function FollowUpsPage() {
  const session = await getSession();
  if (!session) return null;
  const locale = await getLocale();
  const L = await labelsFor(
    ["fu.title", "fu.empty", "fu.emptyHint", "fu.waitingSince", "fu.prepare", "fu.prepared",
     "fu.markSent", "fu.reminderLog", "fu.noReplyYet", "common.loading", "err.generic", "draft.followup"],
    locale
  );

  const due = await listFollowUpsToday();
  const todays = await prisma.followUp.findMany({
    where: { dueOn: { gte: todayStart() } },
    include: { issue: { select: { code: true, titleEn: true, titleAr: true } } },
  });
  const draftsByIssue: Record<string, { id: string; subject: string; body: string } | null> = {};
  for (const fu of todays) {
    if (!fu.draftId) { draftsByIssue[fu.issueId] = null; continue; }
    const d = await prisma.draftVersion.findUnique({ where: { id: fu.draftId } });
    draftsByIssue[fu.issueId] = d && d.status !== "DISCARDED" ? { id: d.id, subject: d.subject, body: d.body } : null;
  }

  return (
    <FollowUpsClient
      locale={locale}
      labels={L}
      due={due}
      rows={todays.map((fu) => ({
        followUpId: fu.id,
        issueId: fu.issueId,
        code: fu.issue.code,
        title: locale === "ar" && fu.issue.titleAr ? fu.issue.titleAr : fu.issue.titleEn,
        state: fu.state as string,
      }))}
      drafts={draftsByIssue}
    />
  );
}

function todayStart(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}