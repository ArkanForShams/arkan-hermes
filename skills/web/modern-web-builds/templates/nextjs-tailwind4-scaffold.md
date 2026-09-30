# Next.js 15 + Tailwind 4 Scaffold (known-good)

Copy these files as the starting point, then rebrand via references/theme-tokens.md. Versions resolve at install; run `npm install && npx next build` immediately to pin actuals and surface config errors.

## package.json

```json
{
  "name": "shams-site",
  "version": "1.0.0",
  "private": true,
  "scripts": { "dev": "next dev", "build": "next build", "start": "next start" },
  "dependencies": {
    "next": "^15.5.26",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "clsx": "^2.1.1",
    "tailwind-merge": "^3.0.0",
    "class-variance-authority": "^0.7.1",
    "lucide-react": "^0.545.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "@types/node": "^22.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "tailwindcss": "^4.3.3",
    "@tailwindcss/postcss": "^4.3.3"
  }
}
```

## next.config.ts

```ts
import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  output: "export",
};
export default nextConfig;
```

(`import type { Config }` is the wrong name — Next 15 exports `NextConfig`; the wrong import fails the first build.)

## postcss.config.mjs

```js
const config = { plugins: { "@tailwindcss/postcss": {} } };
export default config;
```

## tsconfig.json (standard Next 15, paths @/* → src/*)

Standard Next template with `"moduleResolution": "bundler"` and
`"paths": { "@/*": ["./src/*"] }`. Let `npx next build` autofix anything else.

## src/app/globals.css — skeleton

`@import "tailwindcss";` + `@theme` tokens (references/theme-tokens.md) + body/alias/
focus/selection blocks + the scroll-reveal block below. Keep the file whole — partial
writes here have deleted the token system before.

## src/components/theme-provider.tsx (clean version)

```tsx
"use client";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
type Theme = "dark" | "light";
const ThemeContext = createContext<{ theme: Theme; toggle: () => void }>({ theme: "dark", toggle: () => {} });
export function useTheme() { return useContext(ThemeContext); }
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");
  useEffect(() => {
    try { const s = localStorage.getItem("theme");
      if (s === "light" || s === "dark") setTheme(s);
    } catch { /* storage unavailable */ }
  }, []);
  useEffect(() => {
    document.documentElement.classList.toggle("light", theme === "light");
  }, [theme]);
  const toggle = () => setTheme((prev) => {
    const next = prev === "dark" ? "light" : "dark";
    try { localStorage.setItem("theme", next); } catch { /* noop */ }
    return next;
  });
  return <ThemeContext.Provider value={{ theme, toggle }}>{children}</ThemeContext.Provider>;
}
```

## src/components/reveal.tsx (CSS-driven, no hydration gate)

```tsx
import type { ReactNode, ElementType } from "react";
import { cn } from "@/lib/utils";
export function Reveal({ children, className, as: Tag = "div" }: {
  children: ReactNode; className?: string; as?: "div" | "section" | "li" | "article";
}) {
  return <Tag className={cn("rv", className)}>{children}</Tag>;
}
```

Paired with the `.rv` CSS block in globals.css:

```css
@supports (animation-timeline: view()) {
  @media (prefers-reduced-motion: no-preference) {
    .rv { animation: rv-in linear both; animation-timeline: view();
          animation-range: entry 0% entry 55%; }
  }
}
@keyframes rv-in {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: none; }
}
```

No `useEffect`, no IntersectionObserver, no hidden-until-hydrated state.

## src/app/layout.tsx — fonts pattern

```tsx
import { Fraunces, Manrope, IBM_Plex_Mono } from "next/font/google";
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", display: "swap", axes: ["opsz"] });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });
const plexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-plex-mono", display: "swap" });
```
Set the three `--font-*` variables on `<html>`, import ThemeProvider, and add `src/app/icon.svg` (a small inline SVG kills the favicon 404).
