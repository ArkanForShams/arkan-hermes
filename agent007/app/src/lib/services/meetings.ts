// Agent 007 — meetings service (FR-7): paste → AI summary → outputs
import "server-only";
import { prisma } from "@/lib/prisma";
import { getAI } from "@/lib/ai";
import { audit } from "@/lib/audit";
import type { SessionUser } from "@/lib/auth";

export async function createMeeting(
  user: SessionUser,
  data: { projectId?: string | null; title: string; type: "STANDUP" | "VENDOR" | "ADHOC"; heldOn: Date; rawNotes?: string }
) {
  const m = await prisma.meeting.create({
    data: {
      projectId: data.projectId ?? null,
      title: data.title,
      type: data.type,
      heldOn: data.heldOn,
      rawNotes: data.rawNotes ?? null,
      createdBy: user.id,
    },
  });
  await audit(user, "meeting.create", `meeting:${m.id}`, data.title);
  return m;
}

export async function summarizeMeeting(user: SessionUser, meetingId: string) {
  const meeting = await prisma.meeting.findUnique({ where: { id: meetingId } });
  if (!meeting) throw new Error("MEETING_NOT_FOUND");
  if (!meeting.rawNotes?.trim()) throw new Error("NO_NOTES");

  const ai = getAI();
  const s = await ai.summarizeMeeting(meeting.rawNotes);

  const updated = await prisma.meeting.update({
    where: { id: meetingId },
    data: {
      summaryEn: s.summaryEn,
      summaryAr: s.summaryAr,
      decisions: JSON.stringify(s.decisions),
      actions: JSON.stringify(s.actions),
      openQuestions: JSON.stringify(s.openQuestions),
    },
  });
  await audit(user, "meeting.summarize", `meeting:${meetingId}`, `engine:${ai.name}`);
  return updated;
}

export async function actionToIssue(
  user: SessionUser,
  meetingId: string,
  actionText: string,
  projectId: string
) {
  const meeting = await prisma.meeting.findUnique({ where: { id: meetingId } });
  if (!meeting) throw new Error("MEETING_NOT_FOUND");
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) throw new Error("PROJECT_NOT_FOUND");

  const issue = await prisma.$transaction(async (tx) => {
    const max = await tx.issue.aggregate({ where: { projectId: project.id }, _max: { number: true } });
    const number = (max._max.number ?? 0) + 1;
    return tx.issue.create({
      data: {
        projectId: project.id,
        number,
        code: `${project.key}-${String(number).padStart(4, "0")}`,
        titleEn: actionText.slice(0, 120),
        descEn: `Action item from meeting "${meeting.title}" (${meeting.heldOn.toISOString().slice(0, 10)})`,
        source: "manual",
      },
    });
  });
  await prisma.activity.create({
    data: { issueId: issue.id, userId: user.id, type: "created", payload: JSON.stringify({ fromMeeting: meetingId }) },
  });
  return issue;
}

export async function listMeetings() {
  return prisma.meeting.findMany({
    include: { project: { select: { key: true, nameEn: true, nameAr: true } } },
    orderBy: { heldOn: "desc" },
  });
}

export function parseJsonArray(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const v = JSON.parse(raw);
    return Array.isArray(v) ? v.map(String) : [];
  } catch {
    return [];
  }
}

export function parseActions(raw: string | null): { text: string; suggestedAssignee?: string }[] {
  if (!raw) return [];
  try {
    const v = JSON.parse(raw);
    return Array.isArray(v)
      ? v.map((x: { text?: string; suggestedAssignee?: string }) => ({
          text: String(x.text ?? ""),
          suggestedAssignee: x.suggestedAssignee ?? undefined,
        }))
      : [];
  } catch {
    return [];
  }
}