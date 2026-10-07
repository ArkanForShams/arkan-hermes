"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Theme = "dark" | "light";

const ThemeContext = createContext<{ theme: Theme; toggle: () => void }>({
  theme: "light",
  toggle: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");

  // Restore saved preference once on mount. SSR ships `light` statically,
  // so a dark-loving visitor gets at most one gentle flip after hydration.
  useEffect(() => {
    try {
      const saved = localStorage.getItem("theme");
      if (saved === "dark") {
        setTheme("dark");
      }
    } catch {
      /* storage unavailable — keep static light */
    }
  }, []);

  // Keep the class in sync for the session (toggle still round-trips)
  useEffect(() => {
    document.documentElement.classList.toggle("light", theme === "light");
  }, [theme]);

  const toggle = () => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      try {
        localStorage.setItem("theme", next);
      } catch {
        /* storage unavailable */
      }
      return next;
    });
  };

  return <ThemeContext.Provider value={{ theme, toggle }}>{children}</ThemeContext.Provider>;
}