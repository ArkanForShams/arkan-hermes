// Agent 007 — vendors & applications service (FR-6: settings + CSV import)
import "server-only";
import { prisma } from "@/lib/prisma";
import { audit } from "@/lib/audit";
import type { SessionUser } from "@/lib/auth";

export async function upsertVendor(
  user: SessionUser,
  data: { name: string; supportEmail?: string; escalationEmail?: string; notesEn?: string }
) {
  const v = await prisma.vendor.upsert({
    where: { name: data.name },
    update: {
      supportEmail: data.supportEmail || null,
      escalationEmail: data.escalationEmail || null,
      notesEn: data.notesEn || null,
    },
    create: {
      name: data.name,
      supportEmail: data.supportEmail || null,
      escalationEmail: data.escalationEmail || null,
      notesEn: data.notesEn || null,
    },
  });
  await audit(user, "vendor.upsert", `vendor:${v.id}`, v.name);
  return v;
}

export async function upsertApplication(
  user: SessionUser,
  data: { name: string; vendorId: string; contextEn?: string }
) {
  const a = await prisma.application.upsert({
    where: { name: data.name },
    update: { vendorId: data.vendorId, contextEn: data.contextEn || null },
    create: { name: data.name, vendorId: data.vendorId, contextEn: data.contextEn || null },
  });
  await audit(user, "application.upsert", `application:${a.id}`, a.name);
  return a;
}

export interface MappingRow {
  vendor: string;
  application: string;
  supportEmail: string;
  escalationEmail: string;
  context: string;
}

/** CSV import: columns application,vendor,support_email[,escalation_email][,context] */
export async function importMappingCsv(
  user: SessionUser,
  csv: string
): Promise<{ ok: number; failed: { row: number; reason: string }[] }> {
  const lines = csv.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  if (lines.length === 0) return { ok: 0, failed: [{ row: 0, reason: "empty" }] };

  // skip header row if it looks like one
  const first = lines[0].toLowerCase();
  const hasHeader = first.startsWith("application") && first.includes("vendor");
  const rows = hasHeader ? lines.slice(1) : lines;

  let ok = 0;
  const failed: { row: number; reason: string }[] = [];

  for (let i = 0; i < rows.length; i++) {
    const cols = rows[i].split(",").map((c) => c.trim());
    const [application, vendor, supportEmail, escalationEmail, context] = cols;
    if (!application || !vendor) {
      failed.push({ row: i + 1, reason: "missing application or vendor" });
      continue;
    }
    try {
      const v = await upsertVendor(user, {
        name: vendor,
        supportEmail,
        escalationEmail,
        notesEn: context,
      });
      await upsertApplication(user, { name: application, vendorId: v.id, contextEn: context });
      ok++;
    } catch (e) {
      failed.push({ row: i + 1, reason: String(e).slice(0, 80) });
    }
  }
  await audit(user, "mapping.import", "settings", `ok:${ok} failed:${failed.length}`);
  return { ok, failed };
}

export async function listMapping() {
  const vendors = await prisma.vendor.findMany({
    where: { active: true },
    include: { applications: true },
    orderBy: { name: "asc" },
  });
  return vendors;
}

export async function listUsers() {
  return prisma.user.findMany({
    select: { id: true, username: true, displayName: true, role: true, active: true, locale: true, email: true },
    orderBy: { username: "asc" },
  });
}

export async function createUser(
  admin: SessionUser,
  data: { username: string; displayName: string; role: "ADMIN" | "TEAM" | "VIEWER"; tempPassword: string; email?: string }
) {
  const bcrypt = (await import("bcryptjs")).default;
  const u = await prisma.user.create({
    data: {
      username: data.username,
      displayName: data.displayName,
      role: data.role,
      email: data.email ?? null,
      passwordHash: await bcrypt.hash(data.tempPassword, 12),
    },
  });
  await audit(admin, "user.create", `user:${u.id}`, data.username);
  return u;
}

export async function setUserActive(admin: SessionUser, userId: string, active: boolean) {
  const u = await prisma.user.update({ where: { id: userId }, data: { active } });
  await audit(admin, active ? "user.activate" : "user.deactivate", `user:${userId}`);
  return u;
}