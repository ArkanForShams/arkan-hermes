"use client";
// Agent 007 — dashboards client: team / leadership / stand-up tabs, pure-CSS charts
import { useState } from "react";

export default function DashboardsClient({
  locale, labels, byStage, overdue, dueToday, volume, byVendor, sourceCounts,
}: {
  locale: string;
  labels: Record<string, string>;
  byStage: { stage: string; count: number }[];
  overdue: number;
  dueToday: number;
  volume: { day: string; count: number }[];
  byVendor: { name: string; open: number }[];
  sourceCounts: { source: string; count: number }[];
}) {
  const L = (k: string) => labels[k] ?? k;
  const [tab, setTab] = useState<"team" | "leadership" | "standup">("team");

  const stageMap = Object.fromEntries(byStage.map((s) => [s.stage, s.count]));
  const maxVol = Math.max(1, ...volume.map((v) => v.count));
  const maxVendor = Math.max(1, ...byVendor.map((v) => v.open));
  const totalOpen = byStage.reduce((a, s) => a + s.count, 0);

  return (
    <div className="space-y-4">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold text-ink">{L("dash.title")}</h1>
        <div className="flex overflow-hidden rounded-lg border border-line" role="tablist">
          {(["team", "leadership", "standup"] as const).map((v) => (
            <button
              key={v}
              role="tab"
              aria-selected={tab === v}
              onClick={() => setTab(v)}
              className={`px-3 py-1.5 text-sm ${tab === v ? "bg-[var(--petrol)] text-white" : "bg-white text-ink-soft hover:bg-[var(--paper)]"}`}
            >
              {L(`dash.${v}`)}
            </button>
          ))}
        </div>
      </header>

      {tab === "team" && (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="card p-5">
            <h2 className="text-sm font-semibold text-ink">{L("dash.openByStage")}</h2>
            <div className="mt-3 space-y-2">
              {["NEW", "ANALYZING", "WITH_VENDOR", "FOLLOW_UP", "RESOLVED", "CLOSED"].map((s) => {
                const stageVar: Record<string, string> = {
                  NEW: "var(--stage-new)", ANALYZING: "var(--stage-analyzing)",
                  WITH_VENDOR: "var(--stage-vendor)", FOLLOW_UP: "var(--stage-follow-up)",
                  RESOLVED: "var(--stage-resolved)", CLOSED: "var(--stage-closed)",
                };
                const group = byStage.find((g) => g.stage === s);
                const count = group?.count ?? 0;
                const pct = totalOpen > 0 ? Math.round((count / totalOpen) * 100) : 0;
                return (
                  <div key={s} className="flex items-center gap-2">
                    <span className="w-24 shrink-0 text-xs text-ink-soft">{L(`stage.${s}`)}</span>
                    <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-[var(--paper)]">
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: stageVar[s] }} />
                    </div>
                    <span className="w-8 text-end text-xs font-medium text-ink">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="card p-5">
              <div className="text-3xl font-semibold text-[var(--copper)]">{dueToday}</div>
              <p className="mt-1 text-xs text-ink-soft">{L("dash.dueToday")}</p>
            </div>
            <div className="card p-5">
              <div className="text-3xl font-semibold text-[var(--crimson)]">{overdue}</div>
              <p className="mt-1 text-xs text-ink-soft">{L("dash.overdue")}</p>
            </div>
            <div className="card col-span-2 p-5">
              <h2 className="text-sm font-semibold text-ink">{L("dash.topVendors")}</h2>
              <div className="mt-3 space-y-2">
                {byVendor.length === 0 && <p className="text-xs text-ink-soft">—</p>}
                {byVendor.map((v) => (
                  <div key={v.name} className="flex items-center gap-2">
                    <span className="w-32 shrink-0 truncate text-xs text-ink-soft">{v.name}</span>
                    <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-[var(--paper)]">
                      <div className="h-full rounded-full bg-[var(--petrol)]" style={{ width: `${Math.round((v.open / maxVendor) * 100)}%` }} />
                    </div>
                    <span className="w-8 text-end text-xs font-medium text-ink">{v.open}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === "leadership" && (
        <div className="space-y-4">
          <div className="card p-5">
            <h2 className="text-sm font-semibold text-ink">{L("dash.volume")}</h2>
            <div className="mt-3 flex h-28 items-end gap-[3px]" dir="ltr">
              {volume.map((v) => (
                <div key={v.day} className="flex-1 rounded-t bg-[var(--petrol)]" style={{ height: `${Math.round((v.count / maxVol) * 100)}%`, minHeight: v.count > 0 ? 3 : 1, opacity: v.count > 0 ? 1 : 0.25 }} title={`${v.day}: ${v.count}`} />
              ))}
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="card p-5">
              <h2 className="text-sm font-semibold text-ink">{L("dash.topVendors")}</h2>
              <div className="mt-3 space-y-2">
                {byVendor.map((v) => (
                  <div key={v.name} className="flex items-center gap-2">
                    <span className="w-32 shrink-0 truncate text-xs text-ink-soft">{v.name}</span>
                    <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-[var(--paper)]">
                      <div className="h-full rounded-full bg-[var(--gold)]" style={{ width: `${Math.round((v.open / maxVendor) * 100)}%` }} />
                    </div>
                    <span className="w-8 text-end text-xs font-medium text-ink">{v.open}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="card p-5">
              <h2 className="text-sm font-semibold text-ink">{L("dash.byDept")}</h2>
              <div className="mt-3 space-y-2">
                {sourceCounts.map((s) => (
                  <div key={s.source} className="flex items-center justify-between text-sm">
                    <span className="text-ink-soft">{s.source === "outlook" ? "Outlook inbox" : "Manual entry"}</span>
                    <span className="font-medium text-ink">{s.count}</span>
                  </div>
                ))}
              </div>
              <p className="mt-4 rounded-lg bg-[var(--paper)] p-3 text-xs text-ink-soft">
                {L("dash.readonly")} — departments see aggregates only.
              </p>
            </div>
          </div>
        </div>
      )}

      {tab === "standup" && (
        <div className="card p-5">
          <h2 className="text-sm font-semibold text-ink">{L("dash.standup")} — {L("common.today")}</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg bg-[var(--paper)] p-4">
              <div className="text-2xl font-semibold text-ink">{(stageMap["NEW"] ?? 0) + (stageMap["ANALYZING"] ?? 0)}</div>
              <p className="text-xs text-ink-soft">{L("stage.NEW")} + {L("stage.ANALYZING")}</p>
            </div>
            <div className="rounded-lg bg-[var(--paper)] p-4">
              <div className="text-2xl font-semibold text-[var(--petrol)]">{(stageMap["WITH_VENDOR"] ?? 0) + (stageMap["FOLLOW_UP"] ?? 0)}</div>
              <p className="text-xs text-ink-soft">{L("stage.WITH_VENDOR")} + {L("stage.FOLLOW_UP")}</p>
            </div>
            <div className="rounded-lg bg-[var(--paper)] p-4">
              <div className="text-2xl font-semibold text-[var(--copper)]">{dueToday}</div>
              <p className="text-xs text-ink-soft">{L("dash.dueToday")}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}