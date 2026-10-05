// Agent 007 — authenticated app shell
import { redirect } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { getSession } from "@/lib/auth";
import { getLocale, labelsFor } from "@/lib/labels";
import { brand } from "@/lib/brand";

const NAV_KEYS = [
  "nav.projects",
  "nav.triage",
  "nav.followups",
  "nav.meetings",
  "nav.dashboards",
  "nav.settings",
  "nav.language",
  "nav.signout",
] as const;

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/login");
  const locale = await getLocale();
  const labels = await labelsFor(NAV_KEYS, locale);

  return (
    <div className="min-h-screen md:ms-60">
      <Sidebar
        labels={labels}
        user={session}
        brandName={brand.name}
        tagline={locale === "ar" ? brand.taglineAr : brand.taglineEn}
        org={locale === "ar" ? brand.orgAr : brand.orgEn}
      />
      <main className="mx-auto w-full max-w-[1440px] px-4 pb-24 pt-6 md:px-6 md:pb-10">
        {children}
      </main>
    </div>
  );
}