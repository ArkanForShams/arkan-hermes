import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Reveal } from "@/components/reveal";
import { CursorLamp } from "@/components/cursor-lamp";
import { DEPARTMENT, PRINCIPLES } from "@/lib/content";
import { ArrowRight, Linkedin, Mail } from "lucide-react";

export default function Home() {
  return (
    <div id="top">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-brass focus:px-4 focus:py-2 focus:text-ink"
      >
        Skip to main content
      </a>
      <SiteHeader />
      {/* Light-line spine — scrolls with the visitor (see CREATIVE-DIRECTION.md) */}
      <div aria-hidden className="lightline" />
      <main id="main">
        <Hero />
        <About />
        <Research />
        <Department />
        <Principles />
        <Quote />
        <Contact />
      </main>
      <SiteFooter />
    </div>
  );
}

function Hero() {
  return (
    <section aria-label="Introduction" className="grain relative flex min-h-[92vh] items-end overflow-hidden bg-ink">
      {/* Night atmosphere + colonnade — decorative layer */}
      <div aria-hidden className="absolute inset-0">
        {/* Lamp glow behind the colonnade */}
        <div className="lamp h-[64%] w-[46%] bottom-0 right-[-4%]" />
        {/* Colonnade: anchored at 58%, bleeds off the right edge */}
        <div className="absolute bottom-0 flex h-[64%] items-end gap-[4vw]" style={{ left: "58%" }}>
          {[62, 84, 100, 88, 72, 54].map((h, i) => (
            <div
              key={i}
              className={`w-[7vw] max-w-[92px] shrink-0 rounded-t-[3px] bg-gradient-to-b ${
                i === 2 ? "from-brass-bright via-brass/80 to-ink" : "from-ink-3 via-ink-2 to-ink"
              }`}
              style={{ height: `${h}%`, opacity: i === 2 ? 0.85 : 0.42 + i * 0.04 }}
            />
          ))}
        </div>
        <CursorLamp />
        {/* Text veil: opaque over text zone (0–44%), released over pillars (78%+) */}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,var(--color-ink)_0%,var(--color-ink)_44%,color-mix(in_srgb,var(--color-ink)_85%,transparent)_58%,transparent_78%)]" />
        {/* Brass hairline at the hall's floor line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brass/60 to-transparent" />
      </div>

      {/* Content — z-10, above the veil */}
      <div className="relative z-10 mx-auto w-full max-w-5xl px-6 pb-20 pt-36">
        <p className="keyline font-mono text-xs uppercase tracking-[0.18em] text-brass">
          IT Application Manager · AlMajdouie Group · Riyadh
        </p>
        <h1 className="mt-4 font-display text-[clamp(3rem,8vw,5rem)] font-medium leading-[1.05] tracking-tight text-creamtext">
          Shams Tabrez
        </h1>
        <p className="mt-4 max-w-[34rem] font-display text-[clamp(1.25rem,2.6vw,1.7rem)] leading-snug text-brass-bright">
          I build the systems — and now the AI team — that turn technology into business value.
        </p>
        <p className="mt-4 max-w-[30rem] text-[17px] text-creamtext/85">
          Engineer by training. IT leader by practice. On a deliberate three-year path to CTO / CAIO.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <a
            href="#department"
            className="group inline-flex items-center gap-2 rounded-full bg-brass px-7 py-3.5 font-semibold text-onyx transition-all hover:-translate-y-0.5 hover:bg-brass-bright hover:shadow-[0_6px_24px_rgba(195,154,69,0.35)]"
          >
            See the department
            <ArrowRight size={17} className="transition-transform group-hover:translate-x-0.5" aria-hidden />
          </a>
          {/* TODO(shams): replace href with LinkedIn profile URL before launch */}
          <a
            href="#contact"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 px-7 py-3.5 font-medium text-creamtext transition-all hover:-translate-y-0.5 hover:border-brass hover:text-brass-bright"
          >
            <Linkedin size={17} aria-hidden />
            Connect on LinkedIn
          </a>
        </div>
        <p className="scrollhint mt-16 font-mono text-[10px] uppercase tracking-[0.22em] text-creamtext/50">
          Scroll · ↓
        </p>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" aria-label="About" className="grain relative bg-paper-2 py-20 md:py-24">
      <div className="mx-auto max-w-5xl px-6">
        <Reveal>
          <p className="keyline font-mono text-xs uppercase tracking-[0.18em] text-brass-deep">02 / Passage · About</p>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="mt-4 max-w-2xl font-display text-[clamp(1.9rem,4vw,2.6rem)] font-medium text-inktext">
            Steady hands for complex systems.
          </h2>
        </Reveal>
        <Reveal delay={160}>
          <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-muted-light">
            I lead IT applications for the automotive business at the{" "}
            <strong className="font-semibold text-inktext">AlMajdouie group in Riyadh</strong> — the platforms, the
            integrations, and the roadmap that keeps a large operation moving. I came to IT from{" "}
            <strong className="font-semibold text-inktext">electronics and communications engineering</strong>, and
            I&apos;ve kept the engineer&apos;s habit ever since: understand the system fully, then improve it.
          </p>
        </Reveal>
        <Reveal delay={240}>
          <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-muted-light">
            What I&apos;m known for is{" "}
            <strong className="font-semibold text-inktext">turning technology into business value</strong> — clear
            requirements, solutions people actually use, and the kind of calm judgment that resolves conflicts without
            damaging relationships.
          </p>
        </Reveal>
        <Reveal delay={320}>
          <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-muted-light">
            Now I&apos;m applying that patience to the defining shift of this era:{" "}
            <strong className="font-semibold text-inktext">building an IT department staffed by AI</strong> — and, with
            it, the path to technology leadership.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ============================================================
   RESEARCH — "The Foundation". Published work + education.
   Paper data verified against ijcrt.org record (2026-09-28).
   ============================================================ */
function Research() {
  return (
    <section id="research" aria-label="Research and education" className="grain relative bg-paper py-20 md:py-24">
      <div className="mx-auto max-w-5xl px-6">
        <Reveal>
          <p className="keyline font-mono text-xs uppercase tracking-[0.18em] text-brass-deep">
            03 / The Foundation · Research &amp; Education
          </p>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="mt-4 max-w-2xl font-display text-[clamp(1.9rem,4vw,2.6rem)] font-medium text-inktext">
            Built on the lab bench.
          </h2>
        </Reveal>
        <Reveal delay={160}>
          <p className="mt-3 max-w-xl text-[17px] text-muted-light">
            Before the IT leadership came the engineering: electronics, signal, image — and published research.
          </p>
        </Reveal>

        <div className="mt-12">
          <Reveal className="group">
            <article className="h-full rounded-xl border border-[rgba(23,38,59,0.12)] bg-[#FFFDF8] p-7 shadow-[0_2px_8px_rgba(11,21,36,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(11,21,36,0.10)]">
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-brass-deep">Published research</span>
                <span className="rounded-full border border-[rgba(23,38,59,0.14)] px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-light">
                  UGC CARE Approved · Peer Reviewed · Open Access · CC BY 4.0
                </span>
              </div>
              <h3 className="mt-4 max-w-3xl font-display text-[clamp(1.3rem,2.6vw,1.7rem)] font-medium leading-snug text-inktext">
                &ldquo;Enhanced Resolution Techniques for Medical Image Processing&rdquo;
              </h3>
              <p className="mt-2 text-[15px] text-muted-light">
                Shams Tabrez · Dr. Vijay Prakash Singh
              </p>
              <p className="mt-2 font-mono text-[12px] uppercase tracking-[0.12em] text-muted-light">
                IJCRT — Int. Journal of Creative Research Thoughts · ISSN 2320-2882 · Vol. 9 · Issue 12 · pp. f377–f384 · December 2021
              </p>
              <p className="mt-3 max-w-3xl text-[14.5px] leading-relaxed text-muted-light">
                A novel grey-based interpolation algorithm for reconstructing three-dimensional medical images —
                combining classical and shape-based methods to raise resolution where diagnosis depends on it.
              </p>
              <a
                href="https://ijcrt.org/viewpaperforall.php?paper=IJCRT2112580"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Read the published paper on IJCRT (opens in a new tab)"
                className="drawline mt-4 inline-block font-mono text-[12px] uppercase tracking-[0.18em] text-brass-deep"
              >
                Read the paper ↗
              </a>
            </article>
          </Reveal>
        </div>

        <ul className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <Reveal as="li" key="be" className="group h-full" delay={90}>
            <article className="h-full rounded-xl border border-[rgba(23,38,59,0.12)] bg-[#FFFDF8] p-6 shadow-[0_2px_8px_rgba(11,21,36,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(11,21,36,0.10)]">
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-brass-deep">Undergraduate</span>
              <h3 className="drawline mt-2 inline-block text-[17px] font-semibold text-inktext">
                B.E. — Electronics &amp; Communication Engineering
              </h3>
              <p className="mt-2 text-[14.5px] leading-relaxed text-muted-light">
                The foundation under everything: circuits, signals, and the habit of understanding a system fully
                before improving it.
              </p>
            </article>
          </Reveal>

          <Reveal as="li" className="group h-full" delay={180}>
            <article className="h-full rounded-xl border border-[rgba(23,38,59,0.12)] bg-[#FFFDF8] p-6 shadow-[0_2px_8px_rgba(11,21,36,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(11,21,36,0.10)]">
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-brass-deep">Continuing · Applied daily</span>
              <h3 className="drawline mt-2 inline-block text-[17px] font-semibold text-inktext">
                AI &amp; Agent Systems
              </h3>
              <p className="mt-2 text-[14.5px] leading-relaxed text-muted-light">
                Self-directed and in production: agent design, orchestration, and governance — studied by building
                the AI-staffed department itself.
              </p>
            </article>
          </Reveal>

          <Reveal as="li" className="group h-full" delay={270}>
            <article className="h-full rounded-xl border border-[rgba(23,38,59,0.12)] bg-[#FFFDF8] p-6 shadow-[0_2px_8px_rgba(11,21,36,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(11,21,36,0.10)]">
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-brass-deep">Doctoral track</span>
              <h3 className="drawline mt-2 inline-block text-[17px] font-semibold text-inktext">
                Toward the doctorate
              </h3>
              <p className="mt-2 text-[14.5px] leading-relaxed text-muted-light">
                Published first, aiming higher — the research habit continues on the path beyond the master&apos;s
                and toward a PhD.
              </p>
            </article>
          </Reveal>
        </ul>
      </div>
    </section>
  );
}

function Department() {
  return (
    <section id="department" aria-label="The AI department" className="grain relative bg-paper-2 py-20 text-inktext md:py-24">
      <div className="mx-auto max-w-5xl px-6">
        <Reveal>
          <p className="keyline font-mono text-xs uppercase tracking-[0.18em] text-brass">
            04 / The Colonnade · Department
          </p>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="mt-4 font-display text-[clamp(2rem,5vw,3.1rem)] font-medium text-inktext">Not a tool. A team.</h2>
        </Reveal>
        <Reveal delay={160}>
          <p className="mt-4 max-w-2xl text-[17px] text-muted-light">
            My measure of success is an IT department staffed by{" "}
            <strong className="font-semibold text-brass-bright">AI agents that work like real employees</strong> —
            briefed, supervised, and reviewed like any team. Six functions, one standard.
          </p>
        </Reveal>

        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {DEPARTMENT.map((p, i) => (
            <Reveal as="li" key={p.name} delay={(i % 3) * 90} className="group h-full">
              <article className="h-full rounded-xl border border-[rgba(23,38,59,0.12)] bg-[#FFFDF8] p-7 shadow-[0_2px_8px_rgba(11,21,36,0.06)] transition-all duration-300 hover:-translate-y-1.5 hover:border-brass/45 hover:shadow-[0_10px_28px_rgba(11,21,36,0.12)]">
                <span className="glint font-mono text-xs tracking-[0.18em] text-brass">{p.num}</span>
                <h3 className="mt-3 text-lg font-medium text-inktext">{p.name}</h3>
                <p className="mt-2 text-[14.5px] leading-relaxed text-creamtext/60">{p.blurb}</p>
              </article>
            </Reveal>
          ))}
        </ul>

        <Reveal delay={200}>
          <div className="mt-12 flex flex-wrap items-center gap-6 rounded-xl border border-[rgba(154,120,48,0.25)] bg-brass/10 px-7 py-6">
            <span className="font-mono text-xs uppercase tracking-[0.18em] text-brass">My role</span>
            <p className="text-inktext/90">
              <strong className="font-semibold text-brass-bright">Delegate · Design new agents · Review reports.</strong>{" "}
              The department runs. I set the direction, design the agents, and review the work.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Principles() {
  return (
    <section id="principles" aria-label="Principles" className="grain relative bg-paper py-20 md:py-24">
      <div className="mx-auto max-w-5xl px-6">
        <Reveal>
          <p className="keyline font-mono text-xs uppercase tracking-[0.18em] text-brass-deep">05 / Foundations</p>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="mt-4 font-display text-[clamp(1.9rem,4vw,2.6rem)] font-medium text-inktext">
            What I stand on.
          </h2>
        </Reveal>
        <Reveal delay={160}>
          <p className="mt-3 max-w-xl text-[17px] text-muted-light">
            Six pillars hold up any career worth having. These are mine.
          </p>
        </Reveal>
        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PRINCIPLES.map((v, i) => (
            <Reveal as="li" key={v.name} delay={(i % 3) * 90} className="group h-full">
              <article className="h-full rounded-xl border border-[rgba(23,38,59,0.12)] bg-[#FFFDF8] p-6 shadow-[0_2px_8px_rgba(11,21,36,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(11,21,36,0.10)]">
                <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-brass-deep">{v.numeral}</span>
                <h3 className="drawline mt-2 inline-block text-[17px] font-semibold text-inktext">{v.name}</h3>
                <p className="mt-2 text-[14.5px] leading-relaxed text-muted-light">{v.blurb}</p>
              </article>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Quote() {
  return (
    <section aria-label="Words I live by" className="grain relative py-20 text-center md:py-24" style={{ backgroundColor: "var(--color-inktext)" }}>
      <div className="mx-auto max-w-3xl px-6">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-brass">06 / The Inscription</p>
        </Reveal>
        <Reveal delay={100}>
          <blockquote className="mt-6 font-display text-[clamp(1.5rem,3.4vw,2.2rem)] font-normal italic leading-snug text-paper">
            &ldquo;Steady, consistent hard work and discipline make your success.{" "}
            <em className="not-italic text-brass-bright">Don&apos;t be afraid of anything, I am there.</em>&rdquo;
          </blockquote>
        </Reveal>
        <Reveal delay={200}>
          <cite className="typeon mt-5 inline-block font-mono text-[13px] not-italic uppercase tracking-[0.18em] text-paper/70">
            — My Father
          </cite>
        </Reveal>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" aria-label="Contact" className="grain relative bg-paper py-20 md:py-24">
      <div className="mx-auto max-w-5xl px-6">
        <Reveal>
          <p className="keyline font-mono text-xs uppercase tracking-[0.18em] text-brass-deep">07 / The Door</p>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="mt-4 font-display text-[clamp(2rem,5vw,3rem)] font-medium text-inktext">Let&apos;s connect.</h2>
        </Reveal>
        <Reveal delay={160}>
          <p className="mt-4 max-w-xl text-[17px] text-muted-light">
            Whether it&apos;s technology leadership, AI transformation, or a problem that needs a calm head — my inbox
            is open.
          </p>
        </Reveal>
        <Reveal delay={240}>
          <div className="mt-9 flex flex-wrap gap-4">
            {/* TODO(shams): replace # with LinkedIn profile URL before launch */}
            <a
              href="#"
              className="inline-flex items-center gap-2 rounded-full bg-brass px-7 py-3.5 font-semibold text-onyx transition-all hover:-translate-y-0.5 hover:bg-brass-bright hover:shadow-[0_6px_24px_rgba(195,154,69,0.35)]"
            >
              <Linkedin size={17} aria-hidden />
              Connect on LinkedIn
            </a>
            {/* TODO(shams): replace # with mailto:you@example.com before launch */}
            <a
              href="#"
              className="inline-flex items-center gap-2 rounded-full border border-[rgba(23,38,59,0.2)] px-7 py-3.5 font-medium text-inktext transition-all hover:-translate-y-0.5 hover:border-brass-deep hover:text-brass-deep"
            >
              <Mail size={17} aria-hidden />
              Write to me
            </a>
          </div>
        </Reveal>
        <Reveal delay={320}>
          <p className="mt-9 font-mono text-xs uppercase tracking-[0.16em] text-muted-light">
            Riyadh, Saudi Arabia
          </p>
        </Reveal>
      </div>
    </section>
  );
}