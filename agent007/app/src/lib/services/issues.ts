// Agent 007 — issues service (business rules live here, not in UI)
import "server-only";
import { prisma } from "@/lib/prisma";
import { audit } from "@/lib/audit";
import type { SessionUser } from "@/lib/auth";
import type { IssueStage, Priority } from "@prisma/client";

export const STAGE_ORDER: IssueStage[] = [
  "NEW", "ANALYZING", "WITH_VENDOR", "FOLLOW_UP", "RESOLVED", "CLOSED",
];

export interface CreateIssueInput {
  projectId: string;
  titleEn: string;
  titleAr?: string;
  descEn?: string;
  descAr?: string;
  priority?: Priority;
  assigneeId?: string | null;
  applicationId?: string | null;
  dueDate?: Date | null;
  source?: string;
}

export async function createIssue(user: SessionUser, input: CreateIssueInput) {
  const project = await prisma.project.findUnique({ where: { id: input.projectId } });
  if (!project) throw new Error("PROJECT_NOT_FOUND");

  const issue = await prisma.$transaction(async (tx) => {
    const max = await tx.issue.aggregate({
      where: { projectId: project.id },
      _max: { number: true },
    });
    const number = (max._max.number ?? 0) + 1;
    return tx.issue.create({
      data: {
        projectId: project.id,
        number,
        code: `${project.key}-${String(number).padStart(4, "0")}`,
        titleEn: input.titleEn,
        titleAr: input.titleAr || null,
        descEn: input.descEn || null,
        descAr: input.descAr || null,
        priority: input.priority ?? "MEDIUM",
        assigneeId: input.assigneeId ?? null,
        applicationId: input.applicationId ?? null,
        dueDate: input.dueDate ?? null,
        source: input.source ?? "manual",
      },
    });
  });

  await prisma.activity.create({
    data: { issueId: issue.id, userId: user.id, type: "created", payload: "{}" },
  });
  await audit(user, "issue.create", `issue:${issue.id}`, issue.code);
  return issue;
}

export async function changeStage(
  user: SessionUser,
  issueId: string,
  next: IssueStage
) {
  const issue = await prisma.issue.findUnique({
    where: { id: issueId },
    include: { project: true },
  });
  if (!issue) throw new Error("ISSUE_NOT_FOUND");

  const updated = await prisma.$transaction(async (tx) => {
    const u = await tx.issue.update({
      where: { id: issueId },
      data: {
        stage: next,
        enteredVendorAt:
          next === "WITH_VENDOR" && !issue.enteredVendorAt ? new Date() : issue.enteredVendorAt,
      },
    });
    await tx.activity.create({
      data: {
        issueId,
        userId: user.id,
        type: "stage_change",
        payload: JSON.stringify({ from: issue.stage, to: next }),
      },
    });
    return u;
  });

  await audit(user, "issue.stage", `issue:${issueId}`, `${issue.stage}→${next}`);
  return updated;
}

export async function updateIssueFields(
  user: SessionUser,
  issueId: string,
  data: {
    titleEn?: string; titleAr?: string | null; descEn?: string | null; descAr?: string | null;
    priority?: Priority; assigneeId?: string | null; applicationId?: string | null;
    dueDate?: Date | null;
  }
) {
  const updated = await prisma.issue.update({ where: { id: issueId }, data });
  await prisma.activity.create({
    data: { issueId, userId: user.id, type: "fields_updated", payload: JSON.stringify(data) },
  });
  await audit(user, "issue.update", `issue:${issueId}`);
  return updated;
}

export async function addComment(user: SessionUser, issueId: string, text: string) {
  const a = await prisma.activity.create({
    data: { issueId, userId: user.id, type: "comment", payload: JSON.stringify({ text }) },
  });
  return a;
}

export async function getProjectBoard(projectKey: string) {
  const project = await prisma.project.findUnique({
    where: { key: projectKey },
    include: {
      issues: {
        include: {
          assignee: { select: { displayName: true } },
          application: { include: { vendor: { select: { name: true } } } },
          _count: { select: { followUps: true } },
        },
        orderBy: { updatedAt: "desc" },
      },
    },
  });
  return project;
}

export async function listProjects() {
  return prisma.project.findMany({
    where: { archived: false },
    include: { _count: { select: { issues: true } } },
    orderBy: { createdAt: "asc" },
  });
}

export async function projectStageCounts(projectKey: string) {
  const grouped = await prisma.issue.groupBy({
    by: ["stage"],
    where: { project: { key: projectKey } },
    _count: { _all: true },
  });
  return Object.fromEntries(grouped.map((g) => [g.stage, g._count._all])) as Record<IssueStage, number>;
}

export async function homeCounts() {
  const grouped = await prisma.issue.groupBy({
    by: ["stage", "projectId"],
    _count: { _all: true },
  });
  return grouped;
}