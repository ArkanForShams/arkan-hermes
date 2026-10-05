import type { Metadata } from "next";
import { cookies } from "next/headers";
import { isLocale, dirFor, type Locale } from "@/lib/i18n";
import "@fontsource/ibm-plex-sans/400.css";
import "@fontsource/ibm-plex-sans/500.css";
import "@fontsource/ibm-plex-sans/600.css";
import "@fontsource/ibm-plex-sans-arabic/400.css";
import "@fontsource/ibm-plex-sans-arabic/500.css";
import "@fontsource/ibm-plex-sans-arabic/600.css";
import "@fontsource/ibm-plex-mono/400.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Agent 007 — Issue War Room",
  description: "AlMajdouie internal issue tracking & vendor coordination",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const store = await cookies();
  const cookieLocale = store.get("locale")?.value;
  const locale: Locale = isLocale(cookieLocale) ? cookieLocale : "en";
  return (
    <html lang={locale} dir={dirFor(locale)}>
      <body className="min-h-full antialiased">{children}</body>
    </html>
  );
}