// Agent 007 — Meetings (FR-7): list + paste-notes → AI summary → outputs → issues
import { getSession } from "@/lib/auth";
import { getLocale, labelsFor } from "@/lib/labels";
import { listMeetings, parseJsonArray, parseActions } from "@/lib/services/meetings";
import { prisma } from "@/lib/prisma";
import MeetingsClient from "./MeetingsClient";

export default async function MeetingsPage() {
  const session = await getSession();
  if (!session) return null;
  const locale = await getLocale();
  const L = await labelsFor(
    ["meet.title", "meet.new", "meet.type", "meet.type.standup", "meet.type.vendor", "meet.type.adhoc",
     "meet.heldOn", "meet.linked", "meet.pasteTitle", "meet.pastePlaceholder", "meet.summarize",
     "meet.summary", "meet.decisions", "meet.actions", "meet.questions", "meet.toIssue", "meet.empty",
     "meet.emptyHint", "meet.saveSummary", "meet.reRun", "common.loading", "common.save", "common.create",
     "err.generic", "err.forbidden", "draft.aiLabel", "issue.new"],
    locale
  );

  const meetings = await listMeetings();
  const projects = await prisma.project.findMany({ where: { archived: false }, select: { id: true, key: true, nameEn: true } });

  return (
    <MeetingsClient
      locale={locale}
      labels={L}
      role={session.role}
      projects={projects}
      meetings={meetings.map((m) => ({
        id: m.id,
        title: m.title,
        type: m.type as string,
        heldOn: m.heldOn.toISOString(),
        projectKey: m.project?.key ?? null,
        hasNotes: !!m.rawNotes?.trim(),
        summaryEn: m.summaryEn,
        summaryAr: m.summaryAr,
        decisions: parseJsonArray(m.decisions),
        actions: parseActions(m.actions),
        openQuestions: parseJsonArray(m.openQuestions),
      }))}
    />
  );
}