// Agent 007 — i18n engine (Constitution V: Arabic–English parity)
import { en, type Dictionary, type TranslationKey } from "./dictionaries/en";
import { ar } from "./dictionaries/ar";

export type Locale = "en" | "ar";

export const locales: Locale[] = ["en", "ar"];

const dictionaries: Record<Locale, Dictionary> = { en, ar };

export function isLocale(v: string | undefined | null): v is Locale {
  return v === "en" || v === "ar";
}

export function dirFor(locale: Locale): "rtl" | "ltr" {
  return locale === "ar" ? "rtl" : "ltr";
}

/** Translate key with optional {placeholder} interpolation. */
export function t(
  locale: Locale,
  key: TranslationKey,
  params?: Record<string, string | number>
): string {
  const dict = dictionaries[locale] ?? en;
  let out = dict[key] ?? en[key] ?? key;
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      out = out.replaceAll(`{${k}}`, String(v));
    }
  }
  return out;
}

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? en;
}

export type { Dictionary, TranslationKey };