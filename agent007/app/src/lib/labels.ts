// Agent 007 — server helpers shared by app pages
import { cookies } from "next/headers";
import { isLocale, getDictionary, type Locale } from "@/lib/i18n";

export async function getLocale(): Promise<Locale> {
  const store = await cookies();
  const cl = store.get("locale")?.value;
  return isLocale(cl) ? cl : "en";
}

export async function labelsFor(
  keys: readonly string[],
  locale?: Locale
): Promise<Record<string, string>> {
  const loc = locale ?? (await getLocale());
  const dict = getDictionary(loc);
  const out: Record<string, string> = {};
  for (const k of keys) {
    const v = (dict as Record<string, string>)[k];
    if (v !== undefined) out[k] = v;
  }
  return out;
}