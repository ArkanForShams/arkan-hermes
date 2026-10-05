"use client";
// Agent 007 — workbench: board ⇄ list toggle, issue drawer, AI draft panel (FR-2, FR-3)
import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  quickAddIssueAction,
  moveStageAction,
  updateIssueAction,
  addCommentAction,
} from "@/app/actions/work";
import {
  generateDraftAction,
  generateFollowUpDraftAction,
  handoffAction,
  editDraftAction,
} from "@/app/actions/ingest";

export interface WIssue {
  id: string; code: string; titleEn: string; titleAr: string | null;
  descEn: string | null;
  stage: string; priority: string; assigneeName: string | null; assigneeId: string | null;
  applicationId: string | null; applicationName: string | null; vendorName: string | null;
  dueDate: string | null; enteredVendorAt: string | null; createdAt: string;
  updatedAt: string; source: string;
}

const STAGES = ["NEW", "ANALYZING", "WITH_VENDOR", "FOLLOW_UP", "RESOLVED", "CLOSED"] as const;
const STAGE_VAR: Record<string, string> = {
  NEW: "var(--stage-new)",
  ANALYZING: "var(--stage-analyzing)",
  WITH_VENDOR: "var(--stage-vendor)",
  FOLLOW_UP: "var(--stage-follow-up)",
  RESOLVED: "var(--stage-resolved)",
  CLOSED: "var(--stage-closed)",
};

export default function Workbench({
  locale, labels, role, initialView, project, issues: initialIssues, users, applications,
}: {
  locale: string;
  labels: Record<string, string>;
  role: string;
  initialView: "board" | "list";
  project: { id: string; key: string; nameEn: string; nameAr: string | null; colorTag: string };
  issues: WIssue[];
  users: { id: string; displayName: string }[];
  applications: { id: string; name: string; vendorName: string }[];
}) {
  const canWork = role === "ADMIN" || role === "TEAM";
  const router = useRouter();
  const [view, setView] = useState<"board" | "list">(initialView);
  const [issues, setIssues] = useState<WIssue[]>(initialIssues);
  const [quickOpen, setQuickOpen] = useState(false);
  const [selected, setSelected] = useState<WIssue | null>(null);
  const [, startTransition] = useTransition();

  useEffect(() => setIssues(initialIssues), [initialIssues]);

  const L = (k: string) => labels[k] ?? k;
  const title = (i: WIssue) => (locale === "ar" && i.titleAr ? i.titleAr : i.titleEn);

  async function move(issueId: string, stage: string) {
    setIssues((prev) => prev.map((i) => (i.id === issueId ? { ...i, stage } : i))); // optimistic
    const r = await moveStageAction(issueId, stage);
    if (!r.ok) router.refresh();
  }

  const byStage = useMemo(() => {
    const m: Record<string, WIssue[]> = {};
    for (const s of STAGES) m[s] = issues.filter((i) => i.stage === s);
    return m;
  }, [issues]);

  return (
    <div className="space-y-4">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span aria-hidden className="h-3.5 w-3.5 rounded-full" style={{ background: project.colorTag }} />
          <h1 className="text-xl font-semibold text-ink">
            {locale === "ar" && project.nameAr ? project.nameAr : project.nameEn}
          </h1>
          <span className="rounded bg-[var(--paper)] px-2 py-0.5 font-mono text-xs text-ink-soft">{project.key}</span>
        </div>
        <div className="flex items-center gap-2">
          {canWork && (
            <button onClick={() => setQuickOpen(true)} className="btn-primary focus-ring px-3 py-1.5 text-sm font-medium">
              + {L("issue.quickAdd")}
            </button>
          )}
          <div className="flex overflow-hidden rounded-lg border border-line" role="tablist">
            {(["board", "list"] as const).map((v) => (
              <button
                key={v}
                role="tab"
                aria-selected={view === v}
                onClick={() => setView(v)}
                className={`px-3 py-1.5 text-sm ${view === v ? "bg-[var(--petrol)] text-white" : "bg-white text-ink-soft hover:bg-[var(--paper)]"}`}
              >
                {L(v === "board" ? "view.board" : "view.list")}
              </button>
            ))}
          </div>
        </div>
      </header>

      {issues.length === 0 ? (
        <div className="card p-10 text-center">
          <p className="font-medium text-ink">{L("issue.empty")}</p>
          <p className="mt-1 text-sm text-ink-soft">{L("issue.emptyHint")}</p>
        </div>
      ) : view === "board" ? (
        <div className="flex gap-3 overflow-x-auto pb-4">
          {STAGES.map((s) => (
            <div key={s} className="w-[280px] shrink-0">
              <div className="mb-2 flex items-center gap-2 px-1">
                <span aria-hidden className="h-2.5 w-2.5 rounded-full" style={{ background: STAGE_VAR[s] }} />
                <span className="text-sm font-medium text-ink">{L(`stage.${s}`)}</span>
                <span className="text-xs text-ink-soft">{byStage[s].length}</span>
              </div>
              <div className="space-y-2">
                {byStage[s].map((i) => (
                  <IssueCard key={i.id} i={i} L={L} locale={locale} title={title(i)} onOpen={() => setSelected(i)} canWork={canWork} onMove={move} />
                ))}
                {byStage[s].length === 0 && <div className="rounded-lg border border-dashed border-line p-4 text-center text-xs text-ink-soft">—</div>}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line bg-[var(--paper)] text-start text-xs uppercase tracking-wide text-ink-soft">
                <th className="px-4 py-2.5 text-start font-medium">Code</th>
                <th className="px-4 py-2.5 text-start font-medium">{L("issue.title")}</th>
                <th className="hidden px-4 py-2.5 text-start font-medium md:table-cell">{L("issue.priority")}</th>
                <th className="hidden px-4 py-2.5 text-start font-medium md:table-cell">{L("issue.assignee")}</th>
                <th className="hidden px-4 py-2.5 text-start font-medium lg:table-cell">{L("issue.stage")}</th>
              </tr>
            </thead>
            <tbody>
              {issues.map((i) => (
                <tr key={i.id} className="cursor-pointer border-b border-line/60 hover:bg-[var(--paper)]" onClick={() => setSelected(i)}>
                  <td className="px-4 py-2.5 font-mono text-xs text-ink-soft">{i.code}</td>
                  <td className="max-w-[340px] truncate px-4 py-2.5 font-medium text-ink">{title(i)}</td>
                  <td className="hidden px-4 py-2.5 md:table-cell"><PrioChip p={i.priority} L={L} /></td>
                  <td className="hidden px-4 py-2.5 text-ink-soft md:table-cell">{i.assigneeName ?? L("common.unassigned")}</td>
                  <td className="hidden px-4 py-2.5 lg:table-cell">
                    <StageChip s={i.stage} L={L} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {quickOpen && (
        <QuickAdd
          labels={labels}
          projectId={project.id}
          onClose={() => setQuickOpen(false)}
        />
      )}
      {selected && (
        <IssueDrawer
          issue={issues.find((i) => i.id === selected.id) ?? selected}
          labels={labels}
          locale={locale}
          users={users}
          applications={applications}
          canWork={canWork}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}

function PrioChip({ p, L }: { p: string; L: (k: string) => string }) {
  const color =
    p === "CRITICAL" ? "var(--crimson)" : p === "HIGH" ? "var(--copper)" : p === "MEDIUM" ? "var(--gold)" : "var(--slate)";
  return (
    <span className="chip" style={{ background: `color-mix(in srgb, ${color} 14%, white)`, color }}>
      {L(`prio.${p}`)}
    </span>
  );
}

function StageChip({ s, L }: { s: string; L: (k: string) => string }) {
  return (
    <span className="chip" style={{ background: `color-mix(in srgb, ${STAGE_VAR[s] ?? "var(--slate)"} 12%, white)`, color: STAGE_VAR[s] ?? "var(--slate)" }}>
      {L(`stage.${s}`)}
    </span>
  );
}

function IssueCard({ i, L, locale, title, onOpen, canWork, onMove }: {
  i: WIssue; L: (k: string) => string; locale: string; title: string;
  onOpen: () => void; canWork: boolean; onMove: (id: string, stage: string) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const overdue = i.dueDate && new Date(i.dueDate) < new Date() && i.stage !== "CLOSED" && i.stage !== "RESOLVED";
  const fuDue = i.stage === "WITH_VENDOR" && i.enteredVendorAt &&
    Date.now() - new Date(i.enteredVendorAt).getTime() > 24 * 3600_000;

  return (
    <div
      className="card focus-ring cursor-pointer p-3 hover:shadow-md"
      onClick={onOpen}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onOpen()}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="font-mono text-[11px] text-ink-soft">{i.code}</span>
        <SourceMark source={i.source} L={L} />
      </div>
      <p className="mt-1 line-clamp-2 text-sm font-medium text-ink">{title}</p>
      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        <PrioChip p={i.priority} L={L} />
        {i.assigneeName && <span className="chip bg-[var(--paper)] text-ink-soft">{i.assigneeName}</span>}
        {overdue && <span className="chip bg-[var(--crimson)]/10 text-[var(--crimson)]">⚠ {L("common.overdue")}</span>}
        {fuDue && <span className="chip bg-[var(--copper)]/12 text-[var(--copper)]">🔔 {L("fu.waitingSince").replace("{days}", String(Math.max(1, Math.floor((Date.now() - new Date(i.enteredVendorAt!).getTime()) / 86_400_000))))}</span>}
      </div>
      {canWork && (
        <button
          className="mt-2 text-xs text-[var(--petrol)] hover:underline"
          onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
        >
          {L("issue.move")} ▾
        </button>
      )}
      {menuOpen && (
        <div className="mt-1 flex flex-wrap gap-1" onClick={(e) => e.stopPropagation()}>
          {STAGES.filter((s) => s !== i.stage).map((s) => (
            <button
              key={s}
              className="chip border border-line bg-white text-ink-soft hover:bg-[var(--paper)]"
              onClick={() => { setMenuOpen(false); onMove(i.id, s); }}
            >
              {L(`stage.${s}`)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function SourceMark({ source, L }: { source: string; L: (k: string) => string }) {
  if (source !== "outlook") return null;
  return <span className="chip bg-[var(--petrol)]/10 text-[var(--petrol)]">✉ {L("issue.sourceOutlook")}</span>;
}

function QuickAdd({ labels, projectId, onClose }: { labels: Record<string, string>; projectId: string; onClose: () => void }) {
  const L = (k: string) => labels[k] ?? k;
  const [title, setTitle] = useState("");
  const [prio, setPrio] = useState("MEDIUM");
  const [pending, startTransition] = useTransition();

  return (
    <div className="fixed inset-0 z-40 grid place-items-center bg-black/30 p-4" onClick={onClose}>
      <div className="card w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
        <h2 className="mb-4 text-lg font-semibold text-ink">{L("issue.quickAdd")}</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData();
            fd.set("projectId", projectId);
            fd.set("titleEn", title);
            fd.set("priority", prio);
            startTransition(async () => {
              await quickAddIssueAction(undefined, fd);
              onClose();
            });
          }}
          className="space-y-3"
        >
          <input autoFocus value={title} onChange={(e) => setTitle(e.target.value)} placeholder={L("issue.titleEn")} className="focus-ring w-full rounded-lg border border-line px-3 py-2 text-sm" />
          <select value={prio} onChange={(e) => setPrio(e.target.value)} className="focus-ring w-full rounded-lg border border-line bg-white px-3 py-2 text-sm">
            {["LOW", "MEDIUM", "HIGH", "CRITICAL"].map((p) => <option key={p} value={p}>{L(`prio.${p}`)}</option>)}
          </select>
          <div className="flex gap-2 pt-1">
            <button type="submit" disabled={pending || title.length < 3} className="btn-primary focus-ring flex-1 py-2 text-sm font-medium disabled:opacity-60">{L("common.create")}</button>
            <button type="button" onClick={onClose} className="btn-ghost focus-ring px-4 py-2 text-sm">{L("common.cancel")}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function IssueDrawer({ issue, labels, locale, users, applications, canWork, onClose }: {
  issue: WIssue; labels: Record<string, string>; locale: string;
  users: { id: string; displayName: string }[];
  applications: { id: string; name: string; vendorName: string }[];
  canWork: boolean; onClose: () => void;
}) {
  const L = (k: string) => labels[k] ?? k;
  const router = useRouter();
  const [draft, setDraft] = useState<{ id?: string; subject: string; body: string; status?: string; handedOffAt?: string | null } | null>(null);
  const [aiBusy, setAiBusy] = useState(false);
  const [note, setNote] = useState("");
  const [commentBusy, startComment] = useTransition();
  const [, startTransition] = useTransition();
  const [err, setErr] = useState<string | null>(null);
  const [desc, setDesc] = useState(issue.descEn ?? "");

  async function generate() {
    setAiBusy(true); setErr(null);
    const r = await generateDraftAction(issue.id);
    setAiBusy(false);
    if (r.ok && r.data) setDraft(r.data as { id: string; subject: string; body: string });
    else setErr(L(r.error ?? "err.generic"));
  }
  async function prepFollowUp() {
    setAiBusy(true); setErr(null);
    const r = await generateFollowUpDraftAction(issue.id);
    setAiBusy(false);
    if (r.ok && r.data) setDraft(r.data as { id: string; subject: string; body: string });
    else setErr(L(r.error ?? "err.generic"));
  }
  async function openOutlook() {
    if (!draft?.id) return;
    const r = await handoffAction(draft.id);
    if (r.ok && r.data) {
      const { mailto } = r.data as { mailto: string; subject: string; body: string };
      window.location.href = mailto;
    } else setErr(L(r.error ?? "err.generic"));
  }
  async function copyAll() {
    if (!draft) return;
    await navigator.clipboard.writeText(`Subject: ${draft.subject}\n\n${draft.body}`);
  }
  async function saveEdit() {
    if (!draft?.id) return;
    await editDraftAction(draft.id, draft.subject, draft.body);
  }

  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-black/30" onClick={onClose}>
      <div
        className="h-full w-full max-w-[560px] overflow-y-auto bg-white shadow-2xl"
        style={{ borderInlineStart: "1px solid var(--line)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-white px-5 py-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-ink-soft">{issue.code}</span>
            <StageChip s={issue.stage} L={L} />
          </div>
          <button onClick={onClose} className="focus-ring rounded-lg px-2 py-1 text-ink-soft hover:bg-[var(--paper)]">✕</button>
        </div>

        <div className="space-y-5 p-5">
          <div>
            <h2 className="text-lg font-semibold text-ink">{locale === "ar" && issue.titleAr ? issue.titleAr : issue.titleEn}</h2>
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              <PrioChip p={issue.priority} L={L} />
              {issue.applicationName && <span className="chip bg-[var(--paper)] text-ink-soft">{issue.applicationName}</span>}
              {issue.vendorName && <span className="chip bg-[var(--paper)] text-ink-soft">{issue.vendorName}</span>}
              <SourceMark source={issue.source} L={L} />
            </div>
          </div>

          {canWork && (
            <div className="grid grid-cols-2 gap-2">
              <label className="text-xs font-medium text-ink-soft">
                {L("common.assignee")}
                <select
                  defaultValue={issue.assigneeId ?? ""}
                  className="focus-ring mt-1 w-full rounded-lg border border-line bg-white px-2 py-1.5 text-sm"
                  onChange={(e) =>
                    startTransition(async () => {
                      await updateIssueAction(issue.id, { assigneeId: e.target.value || null });
                      router.refresh();
                    })
                  }
                >
                  <option value="">{L("common.unassigned")}</option>
                  {users.map((u) => <option key={u.id} value={u.id}>{u.displayName}</option>)}
                </select>
              </label>
              <label className="text-xs font-medium text-ink-soft">
                {L("common.due")}
                <input
                  type="date"
                  defaultValue={issue.dueDate?.slice(0, 10) ?? ""}
                  className="focus-ring mt-1 w-full rounded-lg border border-line px-2 py-1.5 text-sm"
                  onChange={(e) =>
                    startTransition(async () => {
                      await updateIssueAction(issue.id, { dueDate: e.target.value || null });
                      router.refresh();
                    })
                  }
                />
              </label>
              <label className="col-span-2 text-xs font-medium text-ink-soft">
                {L("issue.application")}
                <select
                  defaultValue={issue.applicationId ?? ""}
                  className="focus-ring mt-1 w-full rounded-lg border border-line bg-white px-2 py-1.5 text-sm"
                  onChange={(e) =>
                    startTransition(async () => {
                      await updateIssueAction(issue.id, { applicationId: e.target.value || null });
                      router.refresh();
                    })
                  }
                >
                  <option value="">—</option>
                  {applications.map((a) => <option key={a.id} value={a.id}>{a.name} → {a.vendorName}</option>)}
                </select>
              </label>
            </div>
          )}

          {issue.descEn !== null && (
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-soft">{L("issue.desc")}</h3>
              {canWork ? (
                <textarea
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  onBlur={() =>
                    desc !== issue.descEn &&
                    startTransition(async () => {
                      await updateIssueAction(issue.id, { descEn: desc });
                      router.refresh();
                    })
                  }
                  rows={4}
                  dir="auto"
                  className="focus-ring mt-1 w-full rounded-lg border border-line bg-[var(--paper)] p-3 text-sm text-ink"
                />
              ) : (
                <p className="mt-1 whitespace-pre-wrap rounded-lg bg-[var(--paper)] p-3 text-sm text-ink">{issue.descEn}</p>
              )}
            </div>
          )}

          {/* AI vendor-email engine (suggest mode; human sends) */}
          {canWork && (
            <div className="space-y-3 border-t border-line pt-4">
              <div className="flex flex-wrap gap-2">
                <button onClick={generate} disabled={aiBusy} className="btn-primary focus-ring px-3 py-1.5 text-sm font-medium disabled:opacity-60">
                  {aiBusy ? L("common.loading") : draft ? L("draft.regenerate") : L("draft.generate")}
                </button>
                <button onClick={prepFollowUp} disabled={aiBusy} className="btn-ghost focus-ring px-3 py-1.5 text-sm">
                  {L("draft.followup")}
                </button>
              </div>
              {err && <p className="text-sm text-[var(--crimson)]">{err}</p>}
              {draft && (
                <div className="ai-panel rounded-lg p-4">
                  <p className="mb-2 text-xs font-medium text-[var(--copper)]">✦ {L("draft.aiLabel")}</p>
                  <label className="block text-xs font-medium text-ink-soft">{L("draft.subject")}
                    <input value={draft.subject} onChange={(e) => setDraft({ ...draft, subject: e.target.value })} className="focus-ring mt-1 w-full rounded-lg border border-line px-2 py-1.5 text-sm" />
                  </label>
                  <label className="mt-2 block text-xs font-medium text-ink-soft">{L("draft.body")}
                    <textarea value={draft.body} onChange={(e) => setDraft({ ...draft, body: e.target.value })} rows={10} className="focus-ring mt-1 w-full rounded-lg border border-line px-2 py-1.5 text-sm" />
                  </label>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button onClick={openOutlook} className="btn-primary focus-ring px-3 py-1.5 text-sm font-medium">{L("draft.openOutlook")}</button>
                    <button onClick={copyAll} className="btn-ghost focus-ring px-3 py-1.5 text-sm">{L("draft.copyAll")}</button>
                    <button onClick={saveEdit} className="btn-ghost focus-ring px-3 py-1.5 text-sm">{L("common.save")}</button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Comment / activity */}
          {canWork && (
            <div className="border-t border-line pt-4">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-soft">{L("issue.activity")}</h3>
              <div className="mt-2 flex gap-2">
                <input value={note} onChange={(e) => setNote(e.target.value)} placeholder={L("issue.desc")} className="focus-ring flex-1 rounded-lg border border-line px-2 py-1.5 text-sm" />
                <button
                  disabled={commentBusy || !note.trim()}
                  onClick={() =>
                    startComment(async () => {
                      await addCommentAction(issue.id, note);
                      setNote("");
                      router.refresh();
                    })
                  }
                  className="btn-primary focus-ring px-3 py-1.5 text-sm disabled:opacity-60"
                >
                  {L("common.save")}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}