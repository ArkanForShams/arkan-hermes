"use client";
// Agent 007 — triage client: split view (queue → preview → AI chips → convert)
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { pollInboxAction, convertIssueAction, markNotIssueAction } from "@/app/actions/ingest";

interface TEmail {
  id: string; fromAddr: string; subject: string; bodyPreview: string;
  receivedAt: string; classified: boolean; aiVerdict: string | null;
  suggestedAppId: string | null; suggestedPriority: string | null;
}

export default function TriageClient({
  locale, labels, emails: initial, projects, applications,
}: {
  locale: string;
  labels: Record<string, string>;
  emails: TEmail[];
  projects: { id: string; key: string; nameEn: string }[];
  applications: { id: string; name: string; vendorName: string }[];
}) {
  const L = (k: string) => labels[k] ?? k;
  const router = useRouter();
  const [emails, setEmails] = useState(initial);
  const [selId, setSelId] = useState<string | null>(initial[0]?.id ?? null);
  const [busy, start] = useTransition();
  const [err, setErr] = useState<string | null>(null);

  const sel = emails.find((e) => e.id === selId) ?? null;
  const queue = emails.filter((e) => !e.classified || e.aiVerdict === "issue");

  async function poll() {
    setErr(null);
    start(async () => {
      const r = await pollInboxAction();
      if (!r.ok) setErr(L(r.error ?? "err.generic"));
      else router.refresh();
    });
  }

  async function convert(email: TEmail) {
    if (!projects[0]) return;
    setErr(null);
    const fd = new FormData();
    start(async () => {
      const r = await convertIssueAction(
        email.id,
        projects[0].id,
        email.subject.replace(/^(re|fw|fwd):\s*/i, "").slice(0, 120),
        email.suggestedPriority ?? "MEDIUM",
        email.suggestedAppId
      );
      if (r.ok) {
        setEmails((prev) => prev.filter((e) => e.id !== email.id));
        if (selId === email.id) setSelId(null);
      } else setErr(L(r.error ?? "err.generic"));
    });
  }

  async function markNoise(email: TEmail) {
    setErr(null);
    start(async () => {
      const r = await markNotIssueAction(email.id);
      if (r.ok) setEmails((prev) => prev.filter((e) => e.id !== email.id));
      else setErr(L(r.error ?? "err.generic"));
    });
  }

  const suggestedApp = applications.find((a) => a.id === sel?.suggestedAppId);

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-ink">{L("triage.title")}</h1>
        <button onClick={poll} disabled={busy} className="btn-primary focus-ring px-3 py-1.5 text-sm font-medium disabled:opacity-60">
          {busy ? L("common.loading") : "↻ " + L("triage.analyze")}
        </button>
      </header>
      {err && <p className="text-sm text-[var(--crimson)]">{err}</p>}

      {queue.length === 0 ? (
        <div className="card p-10 text-center">
          <p className="font-medium text-ink">{L("triage.empty")}</p>
          <p className="mt-1 text-sm text-ink-soft">{L("triage.emptyHint")}</p>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-[380px_1fr]">
          {/* Queue */}
          <div className="card divide-y divide-[var(--line)] overflow-hidden">
            {queue.map((e) => (
              <button
                key={e.id}
                onClick={() => setSelId(e.id)}
                className={`focus-ring block w-full px-4 py-3 text-start hover:bg-[var(--paper)] ${selId === e.id ? "bg-[var(--paper)]" : ""}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-xs text-ink-soft">{e.fromAddr}</span>
                  {e.aiVerdict === "issue" && <span className="chip bg-[var(--copper)]/12 text-[var(--copper)]">✦ {L("triage.verdictIssue")}</span>}
                </div>
                <p className="mt-0.5 truncate text-sm font-medium text-ink">{e.subject}</p>
                <p className="text-[11px] text-ink-soft">{new Date(e.receivedAt).toLocaleString(locale === "ar" ? "ar-SA" : "en-GB")}</p>
              </button>
            ))}
          </div>

          {/* Preview + suggestions */}
          {sel && (
            <div className="card p-5">
              <h2 className="text-base font-semibold text-ink">{sel.subject}</h2>
              <p className="mt-0.5 text-xs text-ink-soft">{sel.fromAddr} · {new Date(sel.receivedAt).toLocaleString(locale === "ar" ? "ar-SA" : "en-GB")}</p>
              <p className="mt-3 whitespace-pre-wrap rounded-lg bg-[var(--paper)] p-3 text-sm text-ink">{sel.bodyPreview}</p>

              <h3 className="mt-4 text-xs font-semibold uppercase tracking-wide text-ink-soft">{L("triage.suggestions")}</h3>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {suggestedApp && <span className="chip bg-[var(--petrol)]/10 text-[var(--petrol)]">{L("triage.suggestedApp")}: {suggestedApp.name} → {suggestedApp.vendorName}</span>}
                {sel.suggestedPriority && <span className="chip bg-[var(--gold)]/15 text-[#8a6114]">{L("triage.suggestedPriority")}: {L(`prio.${sel.suggestedPriority}`)}</span>}
                {!suggestedApp && !sel.suggestedPriority && <span className="text-xs text-ink-soft">—</span>}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <button disabled={busy} onClick={() => convert(sel)} className="btn-primary focus-ring px-3 py-1.5 text-sm font-medium disabled:opacity-60">
                  {L("triage.convert")}
                </button>
                <button disabled={busy} onClick={() => markNoise(sel)} className="btn-ghost focus-ring px-3 py-1.5 text-sm">
                  {L("triage.markNoise")}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}