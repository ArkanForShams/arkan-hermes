// Agent 007 — Settings (FR-6 + FR-9): vendor mapping CRUD+CSV, users, ingestion rules (admin only)
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getLocale, labelsFor } from "@/lib/labels";
import { listMapping, listUsers } from "@/lib/services/vendors";
import SettingsClient from "./SettingsClient";

export default async function SettingsPage() {
  const session = await getSession();
  if (!session) return null;
  if (session.role !== "ADMIN") redirect("/projects"); // server-side enforcement
  const locale = await getLocale();
  const L = await labelsFor(
    ["set.title", "set.users", "set.mapping", "set.ingestion", "set.import", "set.importHint",
     "set.newUser", "set.role", "set.tempPassword", "set.deactivate", "set.activate",
     "set.vendor.name", "set.vendor.support", "set.vendor.escalation", "set.vendor.notes",
     "set.vendor.new", "set.app.new", "set.saved", "role.ADMIN", "role.TEAM", "role.VIEWER",
     "common.save", "common.create", "common.loading", "err.generic", "err.required", "set.pollMinutes"],
    locale
  );

  const vendors = await listMapping();
  const users = await listUsers();

  return (
    <SettingsClient
      locale={locale}
      labels={L}
      vendors={vendors.map((v) => ({
        id: v.id,
        name: v.name,
        supportEmail: v.supportEmail,
        escalationEmail: v.escalationEmail,
        notesEn: v.notesEn,
        applications: v.applications.map((a) => ({ id: a.id, name: a.name, contextEn: a.contextEn })),
      }))}
      users={users}
    />
  );
}