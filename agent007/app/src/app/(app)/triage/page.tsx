// Agent 007 — Inbox Triage (FR-4): unclassified emails → AI suggestions → convert
import { getSession } from "@/lib/auth";
import { getLocale, labelsFor } from "@/lib/labels";
import { prisma } from "@/lib/prisma";
import TriageClient from "./TriageClient";

export default async function TriagePage() {
  const session = await getSession();
  if (!session) return null;
  const locale = await getLocale();
  const L = await labelsFor(
    [
      "triage.title", "triage.queue", "triage.empty", "triage.emptyHint", "triage.analyze",
      "triage.verdictIssue", "triage.verdictNoise", "triage.suggestions", "triage.acceptAll",
      "triage.convert", "triage.markNoise", "triage.suggestedApp", "triage.suggestedVendor",
      "triage.suggestedPriority", "triage.preview", "issue.new", "issue.project",
      "issue.stage.NEW", "prio.LOW", "prio.MEDIUM", "prio.HIGH", "prio.CRITICAL",
      "common.loading", "err.generic", "err.forbidden",
    ],
    locale
  );

  const emails = await prisma.emailMessage.findMany({
    where: { issueId: null, direction: "inbound" },
    orderBy: { receivedAt: "desc" },
    take: 50,
  });
  const projects = await prisma.project.findMany({ where: { archived: false }, select: { id: true, key: true, nameEn: true } });
  const applications = await prisma.application.findMany({
    include: { vendor: { select: { name: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <TriageClient
      locale={locale}
      labels={L}
      emails={emails.map((e) => ({
        id: e.id,
        fromAddr: e.fromAddr,
        subject: e.subject,
        bodyPreview: e.bodyPreview,
        receivedAt: e.receivedAt.toISOString(),
        classified: e.classified,
        aiVerdict: e.aiVerdict,
        suggestedAppId: e.suggestedAppId,
        suggestedPriority: e.suggestedPriority,
      }))}
      projects={projects}
      applications={applications.map((a) => ({ id: a.id, name: a.name, vendorName: a.vendor.name }))}
    />
  );
}