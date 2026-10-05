// Agent 007 — ingestion service: watch inbox read-only, classify, dedupe (FR-4)
import "server-only";
import { prisma } from "@/lib/prisma";
import { getMailConnector } from "@/lib/mail";
import { getAI } from "@/lib/ai";
import { clipPreview } from "@/lib/mail";

const LOOKBACK_HOURS = 24;

/**
 * Poll the connected mailbox (read-only), dedupe by message id, and let the AI
 * pre-classify each new message. Never marks mail read, never deletes.
 */
export async function pollInbox(): Promise<{ ingested: number; classified: number }> {
  const connector = getMailConnector();
  const since = new Date(Date.now() - LOOKBACK_HOURS * 3600_000);
  const messages = await connector.fetchRecent(since, 25);

  let ingested = 0;
  let classified = 0;

  for (const m of messages) {
    const exists = await prisma.emailMessage.findUnique({ where: { id: m.id } });
    if (exists) continue;
    await prisma.emailMessage.create({
      data: {
        id: m.id,
        fromAddr: m.fromAddr,
        subject: m.subject,
        bodyPreview: clipPreview(m.bodyPreview),
        receivedAt: m.receivedAt,
        direction: "inbound",
      },
    });
    ingested++;
  }

  // Classify unclassified rows (idempotent)
  const pending = await prisma.emailMessage.findMany({
    where: { classified: false },
    orderBy: { receivedAt: "desc" },
    take: 10,
  });
  const apps = await prisma.application.findMany({ select: { id: true, name: true } });
  const appNames = apps.map((a) => a.name);

  for (const row of pending) {
    try {
      const ai = getAI();
      const c = await ai.classifyEmail(row.subject, row.bodyPreview, appNames);
      let suggestedAppId: string | null = null;
      if (c.suggestedApplication) {
        const wanted = c.suggestedApplication.toLowerCase();
        const app = apps.find((a) => a.name.toLowerCase() === wanted);
        suggestedAppId = app?.id ?? null;
      }
      await prisma.emailMessage.update({
        where: { id: row.id },
        data: {
          classified: true,
          aiVerdict: c.verdict,
          suggestedAppId,
          suggestedPriority: c.suggestedPriority ?? null,
        },
      });
      classified++;
    } catch {
      // classification failure leaves row unclassified for retry — never blocks ingestion
    }
  }

  return { ingested, classified };
}

/** Convert a triaged email into an issue. */
export async function convertToIssue(
  userId: string,
  emailId: string,
  opts: { projectId: string; titleEn: string; titleAr?: string; priority?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"; applicationId?: string | null }
) {
  const email = await prisma.emailMessage.findUnique({ where: { id: emailId } });
  if (!email) throw new Error("EMAIL_NOT_FOUND");

  // Human-readable number for the target project
  const project = await prisma.project.findUnique({ where: { id: opts.projectId } });
  if (!project) throw new Error("PROJECT_NOT_FOUND");

  const issue = await prisma.$transaction(async (tx) => {
    const max = await tx.issue.aggregate({ where: { projectId: project.id }, _max: { number: true } });
    const number = (max._max.number ?? 0) + 1;
    return tx.issue.create({
      data: {
        projectId: project.id,
        number,
        code: `${project.key}-${String(number).padStart(4, "0")}`,
        titleEn: opts.titleEn,
        titleAr: opts.titleAr ?? null,
        descEn: email.bodyPreview,
        priority: opts.priority ?? "MEDIUM",
        applicationId: opts.applicationId ?? null,
        source: "outlook",
      },
    });
  });

  await prisma.emailMessage.update({
    where: { id: emailId },
    data: { issueId: issue.id },
  });
  await prisma.activity.create({
    data: { issueId: issue.id, userId, type: "created", payload: JSON.stringify({ fromEmail: email.id }) },
  });
  return issue;
}

export async function markNotIssue(userId: string, emailId: string) {
  await prisma.emailMessage.update({
    where: { id: emailId },
    data: { aiVerdict: "noise", classified: true },
  });
  return { ok: true };
}