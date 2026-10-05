// Agent 007 — Dashboards (FR-8): team + leadership + stand-up
import { getSession } from "@/lib/auth";
import { getLocale, labelsFor } from "@/lib/labels";
import { prisma } from "@/lib/prisma";
import DashboardsClient from "./DashboardsClient";

export default async function DashboardsPage() {
  const session = await getSession();
  if (!session) return null;
  const locale = await getLocale();
  const L = await labelsFor(
    ["dash.title", "dash.team", "dash.leadership", "dash.standup", "dash.openByStage", "dash.dueToday",
     "dash.overdue", "dash.byVendor", "dash.byDept", "dash.volume", "dash.avgResponse", "dash.topVendors",
     "dash.readonly", "stage.NEW", "stage.ANALYZING", "stage.WITH_VENDOR", "stage.FOLLOW_UP",
     "stage.RESOLVED", "stage.CLOSED", "common.today"],
    locale
  );

  // Team: open issues by stage
  const byStage = await prisma.issue.groupBy({
    by: ["stage"],
    where: { stage: { in: ["NEW", "ANALYZING", "WITH_VENDOR", "FOLLOW_UP"] } },
    _count: { _all: true },
  });

  // Overdue: dueDate past & not resolved
  const now = new Date();
  const overdue = await prisma.issue.count({
    where: { dueDate: { lt: now }, stage: { notIn: ["RESOLVED", "CLOSED"] } },
  });

  // Follow-ups due today
  const d = new Date(); d.setHours(0, 0, 0, 0);
  const dueToday = await prisma.followUp.count({ where: { dueOn: { gte: d }, state: "PREPARED" } });

  // Volume last 30 days (by day)
  const since = new Date(Date.now() - 30 * 86_400_000);
  const recent = await prisma.issue.findMany({
    where: { createdAt: { gte: since } },
    select: { createdAt: true },
  });
  const dayCounts = new Map<string, number>();
  for (const r of recent) {
    const k = r.createdAt.toISOString().slice(0, 10);
    dayCounts.set(k, (dayCounts.get(k) ?? 0) + 1);
  }
  const volume: { day: string; count: number }[] = [];
  for (let i = 29; i >= 0; i--) {
    const day = new Date(Date.now() - i * 86_400_000).toISOString().slice(0, 10);
    volume.push({ day, count: dayCounts.get(day) ?? 0 });
  }

  // By vendor (open issues)
  const vendorRows = await prisma.vendor.findMany({
    include: { applications: { include: { _count: { select: { issues: { where: { stage: { in: ["NEW", "ANALYZING", "WITH_VENDOR", "FOLLOW_UP"] } } } } } } } },
  });
  const byVendor = vendorRows
    .map((v) => ({
      name: v.name,
      open: v.applications.reduce((acc, a) => acc + (a._count.issues ?? 0), 0),
    }))
    .filter((v) => v.open > 0)
    .sort((a, b) => b.open - a.open)
    .slice(0, 8);

  // By department (reporter side proxy: issues with source=outlook, from addr domain part)
  const depts = await prisma.issue.groupBy({
    by: ["source"],
    _count: { _all: true },
  });

  return (
    <DashboardsClient
      locale={locale}
      labels={L}
      byStage={byStage.map((g) => ({ stage: g.stage as string, count: g._count._all }))}
      overdue={overdue}
      dueToday={dueToday}
      volume={volume}
      byVendor={byVendor}
      sourceCounts={depts.map((g) => ({ source: g.source as string, count: g._count._all }))}
    />
  );
}