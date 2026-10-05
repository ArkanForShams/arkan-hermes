// Constitution V: Arabic–English key parity is enforced at runtime too.
import { describe, it, expect } from "vitest";
import { en } from "@/lib/i18n/dictionaries/en";
import { ar } from "@/lib/i18n/dictionaries/ar";

describe("i18n parity", () => {
  it("ar covers exactly the same keys as en", () => {
    const enKeys = Object.keys(en).sort();
    const arKeys = Object.keys(ar).sort();
    expect(arKeys).toEqual(enKeys);
  });

  it("has no empty translations", () => {
    for (const [k, v] of Object.entries(ar)) {
      expect(v, `ar.${k} is empty`).toBeTruthy();
    }
    for (const [k, v] of Object.entries(en)) {
      expect(v, `en.${k} is empty`).toBeTruthy();
    }
  });

  it("placeholder names match across locales", () => {
    const placeholder = /\{(\w+)\}/g;
    for (const key of Object.keys(en)) {
      const enP = (en[key as keyof typeof en].match(placeholder) ?? []).sort();
      const arP = (ar[key as keyof typeof ar].match(placeholder) ?? []).sort();
      expect(arP, `placeholder mismatch in ${key}`).toEqual(enP);
    }
  });
});