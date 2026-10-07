import type { ReactNode, ElementType } from "react";

/**
 * Scroll-reveal wrapper — pure CSS scroll-driven animation (.rv in globals.css).
 * Server component: no hydration needed. Stagger via `delay` (transition-delay-style
 * offset is handled by CSS animation-range; `delay` maps to a small margin tweak).
 * Progressive enhancement: browsers without animation-timeline / JS-off visitors
 * see fully visible content immediately.
 */
export function Reveal({
  children,
  delay = 0,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article";
}) {
  // delay now acts as a subtle animation-range offset (kept for API compatibility)
  const rangeOffset = Math.min(Math.round(delay / 10), 12); // 0..12 (%)
  return (
    <Tag
      className={"rv" + (className ? " " + className : "")}
      style={
        rangeOffset
          ? ({ animationRange: `entry ${rangeOffset}% entry ${55 + rangeOffset}%` } as React.CSSProperties)
          : undefined
      }
    >
      {children}
    </Tag>
  );
}