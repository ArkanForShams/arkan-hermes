"use client";

import { useEffect, useRef } from "react";

/**
 * Cursor lamp — a soft brass radial that follows the pointer (hero only).
 * "Your presence lights the hall." Pointer-fine devices only; the element
 * itself is display:none on coarse pointers / reduced-motion via CSS.
 */
export function CursorLamp() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;

    const onMove = (e: PointerEvent) => {
      cx = e.clientX;
      cy = e.clientY;
      if (!raf) {
        raf = window.requestAnimationFrame(() => {
          raf = 0;
          el.style.left = `${cx}px`;
          el.style.top = `${cy}px`;
        });
      }
    };

    const section = el.closest("section");
    section?.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      section?.removeEventListener("pointermove", onMove);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  return <div ref={ref} aria-hidden className="cursor-lamp" />;
}