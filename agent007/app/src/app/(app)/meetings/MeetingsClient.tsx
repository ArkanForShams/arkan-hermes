"use client";
// Agent 007 — meetings client
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useActionState } from "react";
import { createMeetingAction, summarizeMeetingAction, actionToIssueAction } from "@/app/actions/settings";

interface MMeeting {
  id: string; title: string; type: string; heldOn: string; projectKey: string | null;
  hasNotes: boolean; summaryEn: string | null; summaryAr: string | null;
  decisions: string[]; actions: { text: string; suggestedAssignee?: string }[]; openQuestions: string[];
}

export default function MeetingsClient({
  locale, labels, role, projects, meetings: initial,
}: {
  locale: string;
  labels: Record<string, string>;
  role: string;
  projects: { id: string; key: string; nameEn: string }[];
  meetings: MMeeting[];
}) {
  const L = (k: string) => labels[k] ?? k;
  const router = useRouter();
  const canWork = role === "ADMIN" || role === "TEAM";
  const [meetings, setMeetings] = useState(initial);
  const [openId, setOpenId] = useState<string | null>(initial[0]?.id ?? null);
  const [newOpen, setNewOpen] = useState(false);
  const [busy, start] = useTransition();
  const [err, setErr] = useState<string | null>(null);
  const [state, createAction, creating] = useActionState(
    createMeetingAction as (p: object | undefined, fd: FormData) => Promise<{ ok?: boolean; error?: string }>,
    undefined
  );
  const [notes, setNotes] = useState("");

  async function summarize(id: string) {
    setErr(null);
    start(async () => {
      const r = await summarizeMeetingAction(id);
      if (r.ok) router.refresh();
      else setErr(L(r.error ?? "err.generic"));
    });
  }

  async function toIssue(meetingId: string, text: string) {
    if (!projects[0]) return;
    start(async () => {
      const r = await actionToIssueAction(meetingId, text, projects[0].id);
      if (r.ok) setErr(null);
      else setErr(L(r.error ?? "err.generic"));
    });
  }

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-ink">{L("meet.title")}</h1>
        {canWork && (
          <button onClick={() => setNewOpen(!newOpen)} className="btn-primary focus-ring px-3 py-1.5 text-sm font-medium">
            + {L("meet.new")}
          </button>
        )}
      </header>
      {err && <p className="text-sm text-[var(--crimson)]">{err}</p>}

      {newOpen && canWork && (
        <div className="card p-5">
          <form action={createAction} className="grid gap-3 md:grid-cols-2">
            <input name="title" required placeholder={L("meet.new")} className="focus-ring rounded-lg border border-line px-3 py-2 text-sm" />
            <select name="type" className="focus-ring rounded-lg border border-line bg-white px-3 py-2 text-sm">
              <option value="STANDUP">{L("meet.type.standup")}</option>
              <option value="VENDOR">{L("meet.type.vendor")}</option>
              <option value="ADHOC">{L("meet.type.adhoc")}</option>
            </select>
            <select name="projectId" className="focus-ring rounded-lg border border-line bg-white px-3 py-2 text-sm">
              {projects.map((p) => <option key={p.id} value={p.id}>{p.key} — {p.nameEn}</option>)}
            </select>
            <textarea name="rawNotes" rows={5} placeholder={L("meet.pastePlaceholder")} className="focus-ring rounded-lg border border-line px-3 py-2 text-sm md:col-span-2" />
            {state?.error && <p className="text-sm text-[var(--crimson)] md:col-span-2">{L(state.error) ?? L("err.generic")}</p>}
            <button type="submit" disabled={creating} className="btn-primary focus-ring px-4 py-2 text-sm font-medium disabled:opacity-60 md:col-span-2">
              {creating ? L("common.loading") : L("common.create")}
            </button>
          </form>
        </div>
      )}

      {meetings.length === 0 ? (
        <div className="card p-10 text-center">
          <p className="font-medium text-ink">{L("meet.empty")}</p>
          <p className="mt-1 text-sm text-ink-soft">{L("meet.emptyHint")}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {meetings.map((m) => {
            const open = openId === m.id;
            return (
              <div key={m.id} className="card p-4">
                <button className="focus-ring flex w-full items-center justify-between gap-2 text-start" onClick={() => setOpenId(open ? null : m.id)}>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-ink">{m.title}</p>
                    <p className="text-xs text-ink-soft">
                      {L(`meet.type.${m.type.toLowerCase()}`) ?? m.type} · {new Date(m.heldOn).toLocaleDateString(locale === "ar" ? "ar-SA" : "en-GB")}
                      {m.projectKey ? ` · ${m.projectKey}` : ""}
                    </p>
                  </div>
                  {m.summaryEn || m.summaryAr ? (
                    <span className="chip bg-[var(--sage)]/12 text-[var(--sage)]">✓</span>
                  ) : m.hasNotes ? (
                    <span className="chip bg-[var(--gold)]/15 text-[#8a6114]">{L("meet.summarize")}?</span>
                  ) : (
                    <span className="text-xs text-ink-soft">—</span>
                  )}
                </button>

                {open && (
                  <div className="mt-3 space-y-3 border-t border-line pt-3">
                    {canWork && (
                      <button onClick={() => summarize(m.id)} disabled={busy} className="btn-primary focus-ring px-3 py-1.5 text-sm font-medium disabled:opacity-60">
                        {busy ? L("common.loading") : (m.summaryEn || m.summaryAr) ? L("meet.reRun") : L("meet.summarize")}
                      </button>
                    )}
                    {(m.summaryEn || m.summaryAr) && (
                      <div className="ai-panel rounded-lg p-4">
                        <p className="mb-2 text-xs font-medium text-[var(--copper)]">✦ {L("draft.aiLabel")}</p>
                        <h4 className="text-xs font-semibold uppercase text-ink-soft">{L("meet.summary")}</h4>
                        <p className="mt-1 text-sm text-ink">{locale === "ar" ? m.summaryAr : m.summaryEn}</p>
                        {m.decisions.length > 0 && (
                          <>
                            <h4 className="mt-3 text-xs font-semibold uppercase text-ink-soft">{L("meet.decisions")}</h4>
                            <ul className="mt-1 list-inside list-disc text-sm text-ink">
                              {m.decisions.map((d, i) => <li key={i}>{d}</li>)}
                            </ul>
                          </>
                        )}
                        {m.actions.length > 0 && (
                          <>
                            <h4 className="mt-3 text-xs font-semibold uppercase text-ink-soft">{L("meet.actions")}</h4>
                            <ul className="mt-1 space-y-1 text-sm text-ink">
                              {m.actions.map((a, i) => (
                                <li key={i} className="flex items-center justify-between gap-2">
                                  <span>{a.text}</span>
                                  {canWork && projects.length > 0 && (
                                    <button onClick={() => toIssue(m.id, a.text)} className="btn-ghost focus-ring shrink-0 px-2 py-1 text-xs">
                                      → {L("meet.toIssue")}
                                    </button>
                                  )}
                                </li>
                              ))}
                            </ul>
                          </>
                        )}
                        {m.openQuestions.length > 0 && (
                          <>
                            <h4 className="mt-3 text-xs font-semibold uppercase text-ink-soft">{L("meet.questions")}</h4>
                            <ul className="mt-1 list-inside list-disc text-sm text-ink">
                              {m.openQuestions.map((q, i) => <li key={i}>{q}</li>)}
                            </ul>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}