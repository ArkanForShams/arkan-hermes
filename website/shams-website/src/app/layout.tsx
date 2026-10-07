import type { Metadata, Viewport } from "next";
import { Fraunces, Manrope, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["opsz"],
});
const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://shamstabrez.dev"),
  title: "Shams Tabrez — IT Application Manager & AI Department Builder",
  description:
    "IT Application Manager at AlMajdouie Group, Riyadh. Engineer by training, IT leader by practice, building an AI-staffed department on the path to CTO / CAIO.",
  openGraph: {
    title: "Shams Tabrez — IT Application Manager & AI Department Builder",
    description:
      "Engineer by training. IT leader by practice. On a deliberate three-year path to CTO / CAIO.",
    type: "profile",
    locale: "en_US",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#F7F2E9",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={fraunces.variable + " " + manrope.variable + " " + plexMono.variable + " light"} suppressHydrationWarning>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}