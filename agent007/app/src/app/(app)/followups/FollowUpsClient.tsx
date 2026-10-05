"use client";
// Agent 007 — follow-ups client: today's chase queue with prepared drafts
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { runTickAction, generateFollowUpDraftAction, markSentAction, handoffAction } from "@/app/actions/ingest";

export default function FollowUpsClient({
  locale, labels, due, rows, drafts,
}: {
  locale: string;
  labels: Record<string, string>;
  due: { issueId: string; issueCode: string; title: string; vendorName: string; daysWaiting: number; pendingFollowUpId?: string }[];
  rows: { followUpId: string; issueId: string; code: string; title: string; state: string }[];
  drafts: Record<string, { id: string; subject: string; body: string } | null>;
}) {
  const L = (k: string) => labels[k] ?? k;
  const router = useRouter();
  const [busy, start] = useTransition();
  const [openDraft, setOpenDraft] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-ink">{L("fu.title")}</h1>
        <button
          disabled={busy}
          onClick={() =>
            start(async () => {
              const r = await runTickAction();
              if (r.ok) router.refresh();
              else setErr(L(r.error ?? "err.generic"));
            })
          }
          className="btn-primary focus-ring px-3 py-1.5 text-sm font-medium disabled:opacity-60"
        >
          {busy ? L("common.loading") : "↻ " + L("fu.prepare")}
        </button>
      </header>
      {err && <p className="text-sm text-[var(--crimson)]">{err}</p>}

      {due.length === 0 && rows.length === 0 ? (
        <div className="card p-10 text-center">
          <p className="font-medium text-ink">{L("fu.empty")}</p>
          <p className="mt-1 text-sm text-ink-soft">{L("fu.emptyHint")}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {due.map((d) => {
            const row = rows.find((r) => r.issueId === d.issueId);
            const draft = drafts[d.issueId];
            const isOpen = openDraft === d.issueId;
            return (
              <div key={d.issueId} className="card p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="min-w-0">
                    <span className="font-mono text-xs text-ink-soft">{d.issueCode}</span>
                    <p className="truncate text-sm font-medium text-ink">{d.title}</p>
                    <p className="text-xs text-ink-soft">
                      {d.vendorName} · {L("fu.waitingSince").replace("{days}", String(d.daysWaiting))}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {row?.state === "PREPARED" && (
                      <button
                        disabled={busy}
                        onClick={() =>
                          start(async () => {
                            const r = await markSentAction(row.followUpId);
                            if (r.ok) router.refresh();
                          })
                        }
                        className="btn-ghost focus-ring px-3 py-1.5 text-xs"
                      >
                        ✓ {L("fu.markSent")}
                      </button>
                    )}
                    {draft && (
                      <button onClick={() => setOpenDraft(isOpen ? null : d.issueId)} className="btn-primary focus-ring px-3 py-1.5 text-xs font-medium">
                        {isOpen ? "▾" : "▸"} {L("fu.prepared")}
                      </button>
                    )}
                  </div>
                </div>

                {isOpen && draft && (
                  <div className="ai-panel mt-3 rounded-lg p-4">
                    <p className="mb-2 text-xs font-medium text-[var(--copper)]">✦ {L("draft.aiLabel")}</p>
                    <p className="text-sm font-medium text-ink">{draft.subject}</p>
                    <p className="mt-2 whitespace-pre-wrap text-sm text-ink">{draft.body}</p>
                    <button
                      onClick={() =>
                        start(async () => {
                          const r = await handoffAction(draft.id);
                          if (r.ok && r.data) {
                            const { mailto } = r.data as { mailto: string };
                            window.location.href = mailto;
                          }
                        })
                      }
                      className="btn-primary focus-ring mt-3 px-3 py-1.5 text-sm font-medium"
                    >
                      {L("draft.openOutlook")}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
          {/* Rows already PREPARED/SENT today whose issue dropped out of due (stage moved on) */}
          {rows
            .filter((r) => !due.some((d) => d.issueId === r.issueId))
            .map((r) => (
              <div key={r.followUpId} className="card p-4 opacity-70">
                <span className="font-mono text-xs text-ink-soft">{r.code}</span>
                <p className="truncate text-sm font-medium text-ink">{r.title}</p>
                <p className="text-xs text-ink-soft">{L(`fu.${r.state.toLowerCase()}`) ?? r.state}</p>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}