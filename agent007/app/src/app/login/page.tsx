import { cookies } from "next/headers";
import LoginForm from "./LoginForm";
import { getDictionary } from "@/lib/i18n";
import { isLocale, type Locale } from "@/lib/i18n";
import { brand } from "@/lib/brand";

export default async function LoginPage() {
  const store = await cookies();
  const cl = store.get("locale")?.value;
  const locale: Locale = isLocale(cl) ? cl : "en";
  const t = getDictionary(locale);

  const labels: Record<string, string> = {
    "auth.username": t["auth.username"],
    "auth.password": t["auth.password"],
    "auth.submit": t["auth.submit"],
    "auth.error": t["auth.error"],
    "auth.inactive": t["auth.inactive"],
    "common.loading": t["common.loading"],
  };

  return (
    <main className="min-h-screen grid place-items-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-[var(--petrol)] text-white text-xl font-semibold">
            A7
          </div>
          <h1 className="text-2xl font-semibold text-ink">{brand.name}</h1>
          <p className="mt-1 text-sm text-ink-soft">{t["app.tagline"]}</p>
          <p className="mt-0.5 text-xs text-ink-soft">{t["auth.subtitle"]}</p>
        </div>
        <div className="card p-6 shadow-sm">
          <LoginForm labels={labels} />
        </div>
        <p className="mt-6 text-center text-xs text-ink-soft">{t["app.org"]}</p>
      </div>
    </main>
  );
}