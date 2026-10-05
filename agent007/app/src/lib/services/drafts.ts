// Agent 007 — drafts service: AI suggest-mode vendor emails (Constitution III: app never sends)
import "server-only";
import { prisma } from "@/lib/prisma";
import { audit } from "@/lib/audit";
import { getAI } from "@/lib/ai";
import type { SessionUser } from "@/lib/auth";

export async function generateVendorDraft(user: SessionUser, issueId: string, locale: "en" | "ar") {
  const issue = await prisma.issue.findUnique({
    where: { id: issueId },
    include: {
      application: { include: { vendor: true } },
      project: true,
    },
  });
  if (!issue) throw new Error("ISSUE_NOT_FOUND");
  if (!issue.application?.vendor) throw new Error("NO_VENDOR_MAPPING");
  const vendor = issue.application.vendor;

  const ai = getAI();
  const { subject, body } = await ai.draftVendorEmail({
    issueCode: issue.code,
    issueTitle: issue.titleEn,
    issueDescription: issue.descEn ?? "",
    applicationName: issue.application.name,
    applicationContext: issue.application.contextEn,
    vendorName: vendor.name,
    priority: issue.priority,
    locale,
  });

  const draft = await prisma.draftVersion.create({
    data: { issueId, kind: "vendor_email", subject, body, generatedBy: "ai" },
  });
  await prisma.activity.create({
    data: { issueId, userId: user.id, type: "draft_generated", payload: JSON.stringify({ draftId: draft.id, engine: ai.name }) },
  });
  await audit(user, "draft.generate", `issue:${issueId}`, `engine:${ai.name}`);
  return draft;
}

export async function generateFollowUpDraft(user: SessionUser, issueId: string, locale: "en" | "ar") {
  const issue = await prisma.issue.findUnique({
    where: { id: issueId },
    include: { application: { include: { vendor: true } } },
  });
  if (!issue) throw new Error("ISSUE_NOT_FOUND");
  if (!issue.application?.vendor) throw new Error("NO_VENDOR_MAPPING");
  const vendor = issue.application.vendor;

  const last = await prisma.draftVersion.findFirst({
    where: { issueId, kind: { in: ["vendor_email", "followup"] }, status: { not: "DISCARDED" } },
    orderBy: { createdAt: "desc" },
  });

  const daysWaiting = issue.enteredVendorAt
    ? Math.max(1, Math.floor((Date.now() - issue.enteredVendorAt.getTime()) / 86_400_000))
    : 1;

  const ai = getAI();
  const { subject, body } = await ai.draftFollowUp({
    issueCode: issue.code,
    issueTitle: issue.titleEn,
    vendorName: vendor.name,
    daysWaiting,
    lastFollowUpSubject: last?.subject ?? null,
    locale,
  });

  const draft = await prisma.draftVersion.create({
    data: { issueId, kind: "followup", subject, body },
  });
  await prisma.activity.create({
    data: { issueId, userId: user.id, type: "followup_prepared", payload: JSON.stringify({ draftId: draft.id }) },
  });
  await audit(user, "draft.followup", `issue:${issueId}`);
  return draft;
}

export async function handOffToOutlook(
  user: SessionUser,
  draftId: string
): Promise<{ mailto: string; subject: string; body: string }> {
  const draft = await prisma.draftVersion.findUnique({
    where: { id: draftId },
    include: {
      issue: { include: { application: { include: { vendor: true } } } },
    },
  });
  if (!draft) throw new Error("DRAFT_NOT_FOUND");
  const to = draft.issue.application?.vendor.supportEmail ?? "";

  const subject = draft.subject;
  const body = draft.body;
  const mailto = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  await prisma.draftVersion.update({
    where: { id: draftId },
    data: { status: "HANDED_OFF", handedOffAt: new Date() },
  });
  await prisma.activity.create({
    data: { issueId: draft.issueId, userId: user.id, type: "draft_handed_off", payload: JSON.stringify({ draftId, to }) },
  });
  await audit(user, "draft.handoff", `draft:${draftId}`, `to:${to}`);
  return { mailto, subject, body };
}

export async function markManuallySent(user: SessionUser, followUpId: string) {
  const fu = await prisma.followUp.update({
    where: { id: followUpId },
    data: { state: "SENT_BY_USER" },
  });
  await audit(user, "followup.sent", `followup:${followUpId}`);
  return fu;
}

export async function editDraft(user: SessionUser, draftId: string, subject: string, body: string) {
  const d = await prisma.draftVersion.update({
    where: { id: draftId },
    data: { subject, body, status: "EDITED" },
  });
  await audit(user, "draft.edit", `draft:${draftId}`);
  return d;
}

export async function discardDraft(user: SessionUser, draftId: string) {
  const d = await prisma.draftVersion.update({
    where: { id: draftId },
    data: { status: "DISCARDED" },
  });
  await audit(user, "draft.discard", `draft:${draftId}`);
  return d;
}

export async function listDrafts(issueId: string) {
  return prisma.draftVersion.findMany({
    where: { issueId, status: { not: "DISCARDED" } },
    orderBy: { createdAt: "desc" },
  });
}