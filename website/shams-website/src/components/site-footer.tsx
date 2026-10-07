/* v8 "Soft Light": light-first default. Footer is a fixed navy band in BOTH
   themes (non-flipping inline styles), cream text, brass accents — a dignified
   close to the page. Contrast verified: #C9A44C on #17263B = 6.2:1 ✓ */
export function SiteFooter() {
  return (
    <footer
      className="py-10"
      style={{
        borderTop: "1px solid rgba(201,164,76,0.25)",
        backgroundColor: "#17263B",
        color: "#F7F2E9",
      }}
    >
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-6">
        <a
          href="#top"
          aria-label="Back to top"
          className="rounded-md px-2 py-0.5 font-display text-sm transition-colors hover:brightness-110"
          style={{ border: "1px solid rgba(201,164,76,0.55)", color: "#C9A44C" }}
        >
          ST
        </a>
        <p className="text-sm" style={{ color: "rgba(247,242,233,0.80)" }}>
          © {new Date().getFullYear()} Shams Tabrez. All rights reserved.
        </p>
        <p className="font-mono text-[11px] tracking-widest" style={{ color: "#C9A44C" }}>
          DESIGNED &amp; BUILT WITH THE ARKAN WEBSITE CREW
        </p>
      </div>
    </footer>
  );
}