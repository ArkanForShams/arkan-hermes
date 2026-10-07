"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme-provider";

const LINKS = [
  { href: "#about", label: "About" },
  { href: "#research", label: "Research" },
  { href: "#department", label: "Department" },
  { href: "#principles", label: "Principles" },
  { href: "#contact", label: "Contact" },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        scrolled
          ? "border-b border-white/15 bg-[color:var(--bg)]/90 backdrop-blur-md"
          : "border-b border-transparent",
      )}
    >
      <nav aria-label="Main" className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-3">
        <a
          href="#top"
          aria-label="Shams Tabrez — back to top"
          className="rounded-md border border-brass/50 px-2.5 py-1 font-display text-lg text-brass transition-colors hover:border-brass-bright hover:text-brass-bright"
        >
          ST
        </a>
        <ul className="hidden items-center gap-7 md:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="text-sm font-medium text-creamtext opacity-85 transition-colors hover:text-brass-bright hover:opacity-100"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-3">
          <span className="hidden rounded-full border border-white/15 px-3 py-1.5 font-mono text-[11px] tracking-widest text-creamtext/60 sm:inline-block">
            RIYADH · UTC+3
          </span>
          <ThemeToggle />
        </div>
      </nav>
      {/* Mobile anchor row */}
      <ul className="flex items-center justify-center gap-5 border-t border-white/10 py-2 md:hidden">
        {LINKS.map((l) => (
          <li key={l.href}>
            <a href={l.href} className="text-xs font-medium text-creamtext/80 hover:text-brass-bright">
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </header>
  );
}

function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      className="rounded-full border border-white/15 p-2 text-creamtext/80 transition-colors hover:border-brass hover:text-brass"
    >
      {theme === "dark" ? <Sun size={16} aria-hidden /> : <Moon size={16} aria-hidden />}
    </button>
  );
}