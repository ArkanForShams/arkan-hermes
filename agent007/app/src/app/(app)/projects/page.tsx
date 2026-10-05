// Agent 007 — Projects home (FR-1)
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { getLocale, labelsFor } from "@/lib/labels";
import { listProjects, homeCounts } from "@/lib/services/issues";
import NewProjectButton from "./NewProjectButton";

export default async function ProjectsPage() {
  const session = await getSession();
  const locale = await getLocale();
  const L = await labelsFor(
    [
      "projects.title", "projects.new", "projects.empty", "projects.emptyHint",
      "projects.archived", "stage.NEW", "stage.ANALYZING", "stage.WITH_VENDOR",
      "stage.FOLLOW_UP", "stage.RESOLVED", "stage.CLOSED", "dash.readonly",
    ],
    locale
  );

  const projects = await listProjects();
  const counts = await homeCounts(); // grouped by stage+projectId

  const countFor = (projectId: string, stage: string) =>
    counts
      .filter((g) => g.projectId === projectId && g.stage === stage)
      .reduce((acc, g) => acc + g._count._all, 0);

  const canEdit = session?.role === "ADMIN" || session?.role === "TEAM";
  const stages = ["NEW", "ANALYZING", "WITH_VENDOR", "FOLLOW_UP", "RESOLVED", "CLOSED"] as const;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-ink">{L["projects.title"]}</h1>
        {canEdit && <NewProjectButton labels={L} />}
      </div>

      {projects.length === 0 ? (
        <div className="card p-10 text-center">
          <p className="text-base font-medium text-ink">{L["projects.empty"]}</p>
          <p className="mt-1 text-sm text-ink-soft">{L["projects.emptyHint"]}</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {projects.map((p) => (
            <Link
              key={p.id}
              href={`/projects/${p.key}`}
              className="card focus-ring block p-5 transition-shadow hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      aria-hidden
                      className="h-3 w-3 rounded-full"
                      style={{ background: p.colorTag }}
                    />
                    <span className="rounded bg-[var(--paper)] px-1.5 py-0.5 font-mono text-xs text-ink-soft">
                      {p.key}
                    </span>
                  </div>
                  <h2 className="mt-2 truncate text-base font-semibold text-ink">
                    {locale === "ar" && p.nameAr ? p.nameAr : p.nameEn}
                  </h2>
                  <p className="mt-0.5 line-clamp-2 text-sm text-ink-soft">
                    {locale === "ar" && p.descAr ? p.descAr : p.descEn}
                  </p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                {stages.slice(0, 3).map((s) => (
                  <div key={s} className="rounded-lg bg-[var(--paper)] px-2 py-1.5">
                    <div className="text-base font-semibold text-ink">{countFor(p.id, s)}</div>
                    <div className="truncate text-[11px] text-ink-soft">{L[`stage.${s}`]}</div>
                  </div>
                ))}
              </div>
              <div className="mt-2 grid grid-cols-3 gap-2 text-center">
                {stages.slice(3).map((s) => (
                  <div key={s} className="rounded-lg bg-[var(--paper)] px-2 py-1.5">
                    <div className="text-base font-semibold text-ink">{countFor(p.id, s)}</div>
                    <div className="truncate text-[11px] text-ink-soft">{L[`stage.${s}`]}</div>
                  </div>
                ))}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}