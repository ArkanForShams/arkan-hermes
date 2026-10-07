# ATTRIBUTIONS.md — Component & Code Provenance

License law per DESIGN.md: MIT/Apache-2.0 only in shipped code. GPL repos (cruip/open-react-template) used as study-only reference — zero code copied.

| Component / File | Origin repo | License | Adaptation |
|---|---|---|---|
| `src/components/ui/button.tsx` | shadcn-ui/ui (`new-york-v4/ui/button`) | MIT (MIT license in repo LICENSE) | Variants rewritten with Ink & Brass tokens; cva pattern retained |
| Component conventions (`cn`, cva patterns, folder layout) | shadcn-ui/ui | MIT | Tailwind-merge + clsx utility per shadcn standard |
| Landing-page structural patterns (navbar with anchor links, section rhythm, theme toggle placement) | leoMirandaa/shadcn-landing-page | MIT | Studied, re-authored for Next.js App Router + Ink & Brass |
| Reveal/scroll-animation approach (IntersectionObserver) | self-authored | — | Standard technique; Magic UI patterns reviewed for motion discipline |
| All content, brand tokens, page copy | ARKAN (from shams-tabrez-brand-bible.md) | — | Original |

Study-only repos consulted for craft (NOT copied): launch-ui (MIT but not used directly), cruip/open-react-template (GPL — study only), precedent, hyperui, flowbite, daisyui, magicui, heroui.

All remaining code: original work by the ARKAN website crew for Shams Tabrez.