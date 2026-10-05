"use client";
// Agent 007 — sidebar navigation (flips in RTL via dir; icon rail on tablet; bottom sheet on phone)
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";
import { setLocaleAction, signOutAction } from "@/app/actions/auth";
import type { SessionUser } from "@/lib/auth";

function LangToggle({ current, label }: { current: string; label: string }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  return (
    <button
      disabled={pending}
      onClick={() =>
        start(async () => {
          await setLocaleAction(current === "en" ? "ar" : "en");
          router.refresh();
        })
      }
      className="focus-ring w-full rounded-lg px-3 py-2 text-start text-sm text-white/80 hover:bg-white/10 disabled:opacity-60"
    >
      🌐 {label}
    </button>
  );
}

export interface NavItem {
  href: string;
  key: string; // label dict key
  emoji: string;
  adminOnly?: boolean;
}

export default function Sidebar({
  labels,
  user,
  brandName,
  tagline,
  org,
}: {
  labels: Record<string, string>;
  user: SessionUser;
  brandName: string;
  tagline: string;
  org: string;
}) {
  const pathname = usePathname();
  const items: NavItem[] = [
    { href: "/projects", key: "nav.projects", emoji: "🗂" },
    { href: "/triage", key: "nav.triage", emoji: "📥" },
    { href: "/followups", key: "nav.followups", emoji: "🔔" },
    { href: "/meetings", key: "nav.meetings", emoji: "🗓" },
    { href: "/dashboards", key: "nav.dashboards", emoji: "📊" },
    { href: "/settings", key: "nav.settings", emoji: "⚙️", adminOnly: true },
  ].filter((i) => !i.adminOnly || user.role === "ADMIN");

  const active = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      {/* Desktop / tablet sidebar */}
      <aside className="fixed inset-y-0 start-0 z-30 hidden w-60 flex-col bg-[var(--petrol-deep)] text-white md:flex">
        <div className="flex items-center gap-3 px-5 pb-4 pt-6">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 text-base font-semibold">
            A7
          </div>
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold">{brandName}</div>
            <div className="truncate text-xs text-white/60">{tagline}</div>
          </div>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-2">
          {items.map((it) => (
            <Link
              key={it.href}
              href={it.href}
              className={`focus-ring flex items-center gap-3 rounded-lg px-3 py-2 text-sm ${
                active(it.href)
                  ? "bg-white/15 font-medium text-white"
                  : "text-white/75 hover:bg-white/8 hover:text-white"
              }`}
            >
              <span aria-hidden>{it.emoji}</span>
              <span className="truncate">{labels[it.key]}</span>
            </Link>
          ))}
        </nav>
        <div className="space-y-2 border-t border-white/10 px-3 py-3">
          <LangToggle current={user.locale} label={labels["nav.language"]} />
          <div className="flex items-center justify-between gap-2 px-1">
            <div className="min-w-0">
              <div className="truncate text-sm font-medium">{user.displayName}</div>
              <div className="truncate text-xs text-white/55">
                {labels[`role.${user.role}`]} · {org}
              </div>
            </div>
            <form action={signOutAction}>
              <button
                title={labels["nav.signout"]}
                className="focus-ring rounded-lg px-2 py-2 text-sm text-white/70 hover:bg-white/10"
              >
                ⏻
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-30 flex bg-[var(--petrol-deep)] text-white md:hidden">
        {items.slice(0, 5).map((it) => (
          <Link
            key={it.href}
            href={it.href}
            className={`flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] ${
              active(it.href) ? "bg-white/15 font-medium" : "text-white/75"
            }`}
          >
            <span aria-hidden className="text-base">{it.emoji}</span>
            {labels[it.key]}
          </Link>
        ))}
      </nav>
    </>
  );
}