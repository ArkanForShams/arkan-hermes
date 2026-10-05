// Agent 007 — audit writer (Constitution IV: audit trail on every state change)
import "server-only";
import { prisma } from "./prisma";
import type { SessionUser } from "./auth";

export async function audit(
  user: Pick<SessionUser, "id"> | null,
  action: string,
  entity: string,
  detail?: string,
  ip?: string
): Promise<void> {
  await prisma.auditEvent.create({
    data: {
      userId: user?.id ?? null,
      action,
      entity,
      detail: detail ?? null,
      ip: ip ?? null,
    },
  });
}