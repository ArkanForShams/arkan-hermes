// Agent 007 — Project workbench page (FR-2: board + list, FR-3 draft panel)
import { notFound } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getLocale, labelsFor } from "@/lib/labels";
import { getProjectBoard } from "@/lib/services/issues";
import { prisma } from "@/lib/prisma";
import Workbench from "./Workbench";

export const STAGE_KEYS = [
  "stage.NEW", "stage.ANALYZING", "stage.WITH_VENDOR",
  "stage.FOLLOW_UP", "stage.RESOLVED", "stage.CLOSED",
] as const;

export const PAGE_LABEL_KEYS = [
  ...STAGE_KEYS,
  "issue.new", "issue.quickAdd", "issue.titleEn", "issue.priority", "issue.stage",
  "issue.assignee", "issue.application", "issue.vendor", "issue.due", "issue.activity",
  "common.assignee", "common.due", "common.overdue",
  "issue.empty", "issue.emptyHint", "issue.detail", "issue.move", "issue.source",
  "issue.sourceManual", "issue.sourceOutlook", "issue.selectStage", "issue.overdue",
  "issue.desc", "view.board", "view.list", "common.save", "common.cancel", "common.close",
  "common.create", "common.unassigned", "common.loading", "common.copy", "common.copied",
  "draft.title", "draft.generate", "draft.regenerate", "draft.subject", "draft.body",
  "draft.openOutlook", "draft.copyAll", "draft.aiLabel", "draft.followup",
  "draft.handedOff", "draft.discard", "draft.noMapping", "err.generic", "err.forbidden",
  "fu.waitingSince", "prio.LOW", "prio.MEDIUM", "prio.HIGH", "prio.CRITICAL",
  "common.comment", "role.ADMIN", "role.TEAM", "role.VIEWER",
] as const;

export default async function ProjectPage({ params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  const session = await getSession();
  if (!session) notFound();
  const locale = await getLocale();
  const labels = await labelsFor(PAGE_LABEL_KEYS, locale);

  const project = await getProjectBoard(key);
  if (!project) notFound();

  const users = await prisma.user.findMany({
    where: { active: true },
    select: { id: true, displayName: true, role: true },
  });
  const applications = await prisma.application.findMany({
    include: { vendor: { select: { name: true } } },
    orderBy: { name: "asc" },
  });

  const pref = await prisma.boardPref.findUnique({
    where: { userId_projectId: { userId: session.id, projectId: project.id } },
  });

  const issues = project.issues.map((i) => ({
    id: i.id,
    code: i.code,
    titleEn: i.titleEn,
    titleAr: i.titleAr,
    descEn: i.descEn,
    stage: i.stage as string,
    priority: i.priority as string,
    assigneeName: i.assignee?.displayName ?? null,
    assigneeId: i.assigneeId,
    applicationId: i.applicationId,
    applicationName: i.application?.name ?? null,
    vendorName: i.application?.vendor?.name ?? null,
    dueDate: i.dueDate?.toISOString() ?? null,
    enteredVendorAt: i.enteredVendorAt?.toISOString() ?? null,
    createdAt: i.createdAt.toISOString(),
    updatedAt: i.updatedAt.toISOString(),
    source: i.source,
  }));

  return (
    <Workbench
      locale={locale}
      labels={labels}
      role={session.role}
      initialView={pref?.view === "list" ? "list" : "board"}
      project={{
        id: project.id,
        key: project.key,
        nameEn: project.nameEn,
        nameAr: project.nameAr,
        colorTag: project.colorTag,
      }}
      issues={issues}
      users={users.map((u) => ({ id: u.id, displayName: u.displayName }))}
      applications={applications.map((a) => ({
        id: a.id,
        name: a.name,
        vendorName: a.vendor.name,
      }))}
    />
  );
}