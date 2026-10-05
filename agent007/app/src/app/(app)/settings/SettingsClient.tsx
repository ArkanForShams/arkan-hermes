"use client";
// Agent 007 — settings client: mapping table, CSV import, users admin
import { useActionState, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  saveVendorAction, importCsvAction, saveApplicationAction, createUserAction, setUserActiveAction,
} from "@/app/actions/settings";

type ActionState = { ok?: boolean; error?: string; data?: unknown } | undefined;

export default function SettingsClient({
  locale, labels, vendors, users,
}: {
  locale: string;
  labels: Record<string, string>;
  vendors: {
    id: string; name: string; supportEmail: string | null; escalationEmail: string | null;
    notesEn: string | null; applications: { id: string; name: string; contextEn: string | null }[];
  }[];
  users: { id: string; username: string; displayName: string; role: string; active: boolean }[];
}) {
  const L = (k: string) => labels[k] ?? k;
  const router = useRouter();
  const [vendorState, vendorAction, vPending] = useActionState<ActionState, FormData>(
    saveVendorAction as (p: ActionState, fd: FormData) => Promise<ActionState>, undefined
  );
  const [csvState, csvAction, cPending] = useActionState<ActionState, FormData>(
    importCsvAction as (p: ActionState, fd: FormData) => Promise<ActionState>, undefined
  );
  const [appState, appAction, aPending] = useActionState<ActionState, FormData>(
    saveApplicationAction as (p: ActionState, fd: FormData) => Promise<ActionState>, undefined
  );
  const [userState, userAction, uPending] = useActionState<ActionState, FormData>(
    createUserAction as (p: ActionState, fd: FormData) => Promise<ActionState>, undefined
  );
  const [saved, setSaved] = useState(false);
  const [busy, start] = useTransition();

  const csvResult = csvState?.data as { ok: number; failed: { row: number; reason: string }[] } | undefined;

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-ink">{L("set.title")}</h1>
      {saved && <p className="text-sm text-[var(--sage)]">{L("set.saved")}</p>}

      {/* Vendor ↔ Application mapping */}
      <section className="card p-5">
        <h2 className="text-base font-semibold text-ink">{L("set.mapping")}</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-xs uppercase text-ink-soft">
                <th className="py-2 pe-4 text-start font-medium">{L("set.vendor.name")}</th>
                <th className="py-2 pe-4 text-start font-medium">{L("set.vendor.support")}</th>
                <th className="py-2 pe-4 text-start font-medium">{L("set.vendor.escalation")}</th>
                <th className="py-2 text-start font-medium">Applications</th>
              </tr>
            </thead>
            <tbody>
              {vendors.map((v) => (
                <tr key={v.id} className="border-b border-line/50 align-top">
                  <td className="py-2.5 pe-4 font-medium text-ink">{v.name}</td>
                  <td className="py-2.5 pe-4 text-ink-soft" dir="ltr">{v.supportEmail ?? "—"}</td>
                  <td className="py-2.5 pe-4 text-ink-soft" dir="ltr">{v.escalationEmail ?? "—"}</td>
                  <td className="py-2.5">
                    <div className="flex flex-wrap gap-1">
                      {v.applications.map((a) => (
                        <span key={a.id} className="chip bg-[var(--paper)] text-ink-soft" title={a.contextEn ?? undefined}>{a.name}</span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
              {vendors.length === 0 && (
                <tr><td colSpan={4} className="py-4 text-center text-sm text-ink-soft">—</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <form action={vendorAction} className="space-y-2 rounded-lg border border-line p-4">
            <h3 className="text-sm font-semibold text-ink">{L("set.vendor.new")}</h3>
            <input name="name" required placeholder={L("set.vendor.name")} className="focus-ring w-full rounded-lg border border-line px-2 py-1.5 text-sm" />
            <input name="supportEmail" type="email" placeholder={L("set.vendor.support")} className="focus-ring w-full rounded-lg border border-line px-2 py-1.5 text-sm" />
            <input name="escalationEmail" type="email" placeholder={L("set.vendor.escalation")} className="focus-ring w-full rounded-lg border border-line px-2 py-1.5 text-sm" />
            <input name="notesEn" placeholder={L("set.vendor.notes")} className="focus-ring w-full rounded-lg border border-line px-2 py-1.5 text-sm" />
            {vendorState?.error && <p className="text-xs text-[var(--crimson)]">{L(vendorState.error) ?? L("err.generic")}</p>}
            <button disabled={vPending} className="btn-primary focus-ring w-full py-2 text-sm font-medium disabled:opacity-60">{L("common.save")}</button>
          </form>

          <form action={appAction} className="space-y-2 rounded-lg border border-line p-4">
            <h3 className="text-sm font-semibold text-ink">{L("set.app.new")}</h3>
            <input name="name" required placeholder="Application name" className="focus-ring w-full rounded-lg border border-line px-2 py-1.5 text-sm" />
            <select name="vendorId" required className="focus-ring w-full rounded-lg border border-line bg-white px-2 py-1.5 text-sm">
              {vendors.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
            </select>
            <textarea name="contextEn" rows={3} placeholder="Technical context for AI drafting" className="focus-ring w-full rounded-lg border border-line px-2 py-1.5 text-sm" />
            {appState?.error && <p className="text-xs text-[var(--crimson)]">{L(appState.error) ?? L("err.generic")}</p>}
            <button disabled={aPending || vendors.length === 0} className="btn-primary focus-ring w-full py-2 text-sm font-medium disabled:opacity-60">{L("common.save")}</button>
          </form>
        </div>

        <form action={csvAction} className="mt-4 space-y-2 rounded-lg border border-dashed border-line p-4">
          <h3 className="text-sm font-semibold text-ink">{L("set.import")}</h3>
          <p className="text-xs text-ink-soft" dir="ltr">{L("set.importHint")}</p>
          <textarea name="csv" rows={4} dir="ltr" className="focus-ring w-full rounded-lg border border-line px-2 py-1.5 font-mono text-xs" placeholder={"application,vendor,support_email\nSAP MM,SAP,support@sap.example.com"} />
          {csvResult && (
            <p className="text-xs text-ink-soft">
              ✓ {csvResult.ok} imported{csvResult.failed.length ? ` · ✗ ${csvResult.failed.length} failed` : ""}
            </p>
          )}
          {csvState?.error && <p className="text-xs text-[var(--crimson)]">{L(csvState.error) ?? L("err.generic")}</p>}
          <button disabled={cPending} className="btn-ghost focus-ring px-3 py-1.5 text-sm disabled:opacity-60">{L("set.import")}</button>
        </form>
      </section>

      {/* Users */}
      <section className="card p-5">
        <h2 className="text-base font-semibold text-ink">{L("set.users")}</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-xs uppercase text-ink-soft">
                <th className="py-2 pe-4 text-start font-medium">Username</th>
                <th className="py-2 pe-4 text-start font-medium">{L("set.role")}</th>
                <th className="py-2 pe-4 text-start font-medium">Status</th>
                <th className="py-2" />
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-line/50">
                  <td className="py-2.5 pe-4">
                    <span className="font-medium text-ink">{u.displayName}</span>
                    <span className="ms-2 text-xs text-ink-soft" dir="ltr">@{u.username}</span>
                  </td>
                  <td className="py-2.5 pe-4">{L(`role.${u.role}`)}</td>
                  <td className="py-2.5 pe-4">
                    <span className={`chip ${u.active ? "bg-[var(--sage)]/12 text-[var(--sage)]" : "bg-[var(--slate)]/15 text-ink-soft"}`}>
                      {u.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="py-2.5 text-end">
                    <button
                      disabled={busy}
                      onClick={() =>
                        start(async () => {
                          await setUserActiveAction(u.id, !u.active);
                          router.refresh();
                        })
                      }
                      className="btn-ghost focus-ring px-2 py-1 text-xs"
                    >
                      {u.active ? L("set.deactivate") : L("set.activate")}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <form action={userAction} className="mt-4 grid gap-2 rounded-lg border border-line p-4 md:grid-cols-4">
          <input name="username" required placeholder="username" dir="ltr" className="focus-ring rounded-lg border border-line px-2 py-1.5 text-sm" />
          <input name="displayName" required placeholder="Full name" className="focus-ring rounded-lg border border-line px-2 py-1.5 text-sm" />
          <select name="role" className="focus-ring rounded-lg border border-line bg-white px-2 py-1.5 text-sm">
            <option value="TEAM">{L("role.TEAM")}</option>
            <option value="ADMIN">{L("role.ADMIN")}</option>
            <option value="VIEWER">{L("role.VIEWER")}</option>
          </select>
          <input name="tempPassword" required minLength={10} placeholder={L("set.tempPassword")} dir="ltr" className="focus-ring rounded-lg border border-line px-2 py-1.5 text-sm" />
          {userState?.error && <p className="text-xs text-[var(--crimson)] md:col-span-4">{L(userState.error) ?? L("err.generic")}</p>}
          <button disabled={uPending} className="btn-primary focus-ring py-2 text-sm font-medium disabled:opacity-60 md:col-span-4">{L("set.newUser")}</button>
        </form>
      </section>
    </div>
  );
}