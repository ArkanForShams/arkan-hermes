#!/usr/bin/env python3
"""Build multi-page site from the single-page landing (light elegant theme)."""
import pathlib

ROOT = pathlib.Path('/home/shams/hermes-workspace/marketing/shams-tabrez-landing')
SRC = ROOT / 'index.html'
lines = SRC.read_text().split('\n')

LINKEDIN = "https://www.linkedin.com/in/shams2tabrez"
EMAIL_HREF = "mailto:Shams090484@gmail.com"
GITHUB = "https://github.com/Shams090484"

SCRIPT = """<script>
const nav = document.getElementById('nav');
addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 40), { passive: true });
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));
</script>"""


def nav(active=""):
    items = [("index.html", "Home", "home"), ("about.html", "About", "about"),
             ("journey.html", "Journey", "journey"), ("department.html", "Department", "department"),
             ("principles.html", "Principles", "principles"), ("contact.html", "Contact", "contact")]
    lis = []
    for page, label, key in items:
        cls = ' class="active"' if key == active else ''
        lis.append('      <li><a href="%s"%s>%s</a></li>' % (page, cls, label))
    lis = '\n'.join(lis)
    return ('<nav id="nav" aria-label="Main navigation">\n  <div class="nav-inner">\n'
            '    <a href="index.html" class="monogram" aria-label="Shams Tabrez — home">ST</a>\n'
            '    <ul class="nav-links">\n' + lis + '\n    </ul>\n'
            '    <span class="nav-chip">RIYADH · UTC+3</span>\n  </div>\n</nav>')


def footer():
    return ('<footer>\n  <div class="container footer-inner">\n'
            '    <a href="index.html" class="monogram" aria-label="Back to home">ST</a>\n'
            '    <div class="footer-social">\n'
            '      <a href="%s" target="_blank" rel="noopener">LinkedIn</a>\n'
            '      <a href="%s">Email</a>\n'
            '      <a href="%s" target="_blank" rel="noopener">GitHub</a>\n'
            '    </div>\n'
            '    <p>© 2026 Shams Tabrez. All rights reserved.</p>\n'
            '    <span class="mono-note">Designed &amp; built by ARKAN — first hire of the AI department</span>\n'
            '  </div>\n</footer>' % (LINKEDIN, EMAIL_HREF, GITHUB))


def head(title, desc):
    return ('<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="UTF-8">\n'
            '<meta name="viewport" content="width=device-width, initial-scale=1.0">\n'
            '<title>' + title + '</title>\n<meta name="description" content="' + desc + '">\n'
            '<link rel="preconnect" href="https://fonts.googleapis.com">\n'
            '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n'
            '<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Manrope:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">\n'
            '<link rel="stylesheet" href="site.css">\n</head>')


def subhero(label, h1text, lede, dark=False):
    d = ' on-dark' if dark else ''
    return ('<header class="subhero' + d + '" id="top"' + (' style="background:var(--accent-band)"' if dark else '') + '>\n'
            '  <div class="container">\n'
            '    <span class="label-mono' + d + ' reveal">' + label + '</span>\n'
            '    <h1 class="reveal d1"' + (' style="color:var(--paper)"' if dark else '') + '>' + h1text + '</h1>\n'
            '    <p class="hero-lede reveal d2"' + (' style="color:var(--brass-bright)"' if dark else '') + '>' + lede + '</p>\n'
            '  </div>\n</header>')


# ---- section sources (verbatim from index) ----
journey_section = '\n'.join(lines[208:236])
dept_section = '\n'.join(lines[238:281])
principles_section = '\n'.join(lines[283:322])

js_strip = (journey_section
            .replace('<section class="journey" id="journey" aria-label="Journey">',
                     '<section class="journey" aria-label="Journey timeline">')
            .replace('<span class="label-mono reveal">Journey</span>', '')
            .replace('<h2 class="reveal d1">The road so far.</h2>', ''))

dp_clean = (dept_section
            .replace('<section class="dept on-dark" id="department" aria-label="The AI department vision">',
                     '<section class="dept on-dark" aria-label="The six pillars">')
            .replace('<span class="label-mono on-dark reveal">The department I&#39;m building</span>', '')
            .replace("<span class=\"label-mono on-dark reveal\">The department I'm building</span>", '')
            .replace('<h2 class="reveal d1">Not a tool. A team.</h2>', ''))

pr_clean = (principles_section
            .replace('<section class="principles" id="principles" aria-label="Principles">',
                     '<section class="principles" aria-label="The six pillars">')
            .replace('<span class="label-mono reveal">Principles</span>', '')
            .replace('<h2 class="reveal d1">What I stand on.</h2>', '')
            .replace('<p class="sub reveal d2">Six pillars hold up any career worth having. These are mine.</p>', ''))

QUOTE = ('<section class="quote" aria-label="Words I live by">\n  <div class="container">\n'
         '    <span class="label-mono reveal">Words I live by</span>\n'
         '    <blockquote class="reveal d1">"Steady, consistent hard work and discipline make your success. '
         '<em>Don&#39;t be afraid of anything, I am there.</em>"</blockquote>\n'
         '    <cite class="reveal d2">— My father</cite>\n  </div>\n</section>')

pages = {}

# ---------- ABOUT ----------
pages['about.html'] = head(
    "About — Shams Tabrez",
    "About Shams Tabrez — IT Application Manager at AlMajdouie Group, Riyadh. Engineer's discipline, calm judgment, and the patience to build systems and trust.") + '''
<body>
''' + nav("about") + '''
''' + subhero("About", "Steady hands for complex systems.",
              "The engineer's habit: understand the system fully, then improve it.") + '''
<section class="about" aria-label="About Shams">
  <div class="container">
    <p class="reveal">I lead IT applications for the automotive business at the <strong>AlMajdouie group in Riyadh</strong> — the platforms, the integrations, and the roadmap that keeps a large operation moving. I came to IT from <strong>electronics and communications engineering</strong>, and I've kept the engineer's habit ever since: understand the system fully, then improve it.</p>
    <p class="reveal d1">What I'm known for is <strong>turning technology into business value</strong> — clear requirements, solutions people actually use, and the kind of calm judgment that resolves conflicts without damaging relationships. Colleagues describe my work as disciplined and dependable. I'd add one word: <strong>patient</strong>. Systems and trust are built the same way.</p>
    <p class="reveal d2">Now I'm applying that patience to the defining shift of this era: <strong>building an IT department staffed by AI</strong> — and, with it, the path to technology leadership.</p>
  </div>
</section>
<section class="quote" aria-label="Where next">
  <div class="container">
    <p class="reveal d1" style="font-family:var(--font-display);font-size:clamp(1.3rem,2.6vw,1.8rem);color:var(--text-dark)">
      Continue: <a href="journey.html" style="border-bottom:2px solid var(--brass)">the journey</a>
      &nbsp;·&nbsp; <a href="department.html" style="border-bottom:2px solid var(--brass)">the department I'm building</a>
    </p>
  </div>
</section>
''' + footer() + '\n' + SCRIPT + '''
</body>
</html>'''

# ---------- JOURNEY ----------
pages['journey.html'] = head(
    "Journey — Shams Tabrez",
    "From Bodhan to Riyadh — the road from electronics engineering to IT leadership and the CTO / CAIO horizon.") + '''
<body>
''' + nav("journey") + '''
''' + subhero("Journey", "The road so far.", "Four stations, one direction.") + '''
''' + js_strip + '\n' + QUOTE + '''
<section class="contact" aria-label="Continue">
  <div class="container">
    <p class="reveal">See what I'm building → <a class="btn btn-primary" href="department.html">The Department</a></p>
  </div>
</section>
''' + footer() + '\n' + SCRIPT + '''
</body>
</html>'''

# ---------- DEPARTMENT ----------
pages['department.html'] = head(
    "The AI Department — Shams Tabrez",
    "Six AI-staffed functions, one standard. The IT department Shams Tabrez is building — agents briefed, supervised, and reviewed like any team.") + '''
<body>
''' + nav("department") + '''
''' + subhero("The department I'm building", "Not a tool. A team.",
              "My measure of success: an IT department staffed by AI agents that work like real employees.", dark=True) + '''
''' + dp_clean + '''
<section class="contact" aria-label="Continue">
  <div class="container">
    <p class="reveal">The thinking behind it → <a class="btn btn-ghost btn-dark-link" href="principles.html">Principles</a>
      &nbsp;·&nbsp; Want to talk AI departments? <a class="btn btn-primary" href="contact.html">Get in touch</a></p>
  </div>
</section>
''' + footer() + '\n' + SCRIPT + '''
</body>
</html>'''

# ---------- PRINCIPLES ----------
pages['principles.html'] = head(
    "Principles — Shams Tabrez",
    "Six pillars: faith first, family oneness, honesty, discipline, peace, service. What Shams Tabrez stands on.") + '''
<body>
''' + nav("principles") + '''
''' + subhero("Principles", "What I stand on.", "Six pillars hold up any career worth having.") + '''
''' + pr_clean + '\n' + QUOTE + '''
<section class="contact" aria-label="Continue">
  <div class="container">
    <p class="reveal">Let's connect → <a class="btn btn-primary" href="contact.html">Contact</a></p>
  </div>
</section>
''' + footer() + '\n' + SCRIPT + '''
</body>
</html>'''

# ---------- CONTACT ----------
CONTACT_CSS = '''
<style>
.contact-hero { background: var(--page-bg); min-height: 46vh; display: flex; align-items: center; padding: 160px 0 60px; }
.contact-hero h1 { font-size: clamp(2.6rem, 6vw, 4rem); color: var(--ink); margin: 16px 0 14px; }
.contact-hero .hero-lede { color: var(--brass-deep); font-family: var(--font-display); font-size: clamp(1.1rem, 2.2vw, 1.4rem); max-width: 680px; }
.social-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-top: 40px; }
.social-card { background: var(--ink); color: var(--text-light); border-radius: 16px; padding: 28px 26px; display: block; transition: transform .2s ease, box-shadow .2s ease; border: 1px solid rgba(195,154,69,.35); }
.social-card:hover { transform: translateY(-4px); box-shadow: var(--glow-brass); }
.social-card .s-label { font-family: var(--font-mono); font-size: 11px; letter-spacing: .18em; text-transform: uppercase; color: var(--brass); display: block; margin-bottom: 10px; }
.social-card .s-value { font-family: var(--font-display); font-size: 19px; color: var(--paper); }
.social-card .s-hint { display: block; margin-top: 8px; font-size: 13.5px; color: var(--text-muted-dark); }
</style>'''

pages['contact.html'] = head(
    "Contact — Shams Tabrez",
    "Connect with Shams Tabrez — LinkedIn, email, GitHub. Technology leadership, AI transformation, or a problem that needs a calm head.") + '''
<body>
''' + CONTACT_CSS + nav("contact") + '''
<header class="contact-hero" id="top">
  <div class="container">
    <span class="label-mono reveal">Contact</span>
    <h1 class="reveal d1">Let's connect.</h1>
    <p class="hero-lede reveal d2">Whether it's technology leadership, AI transformation, or a problem that needs a calm head — my inbox is open.</p>
  </div>
</header>
<section class="contact" aria-label="Ways to reach me">
  <div class="container">
    <span class="label-mono reveal">Direct lines</span>
    <h2 class="reveal d1" style="font-size:clamp(1.6rem,3vw,2.2rem)">Reach me anywhere.</h2>
    <div class="social-grid">
      <a class="social-card reveal" href="''' + LINKEDIN + '''" target="_blank" rel="noopener">
        <span class="s-label">LinkedIn</span>
        <span class="s-value">shams2tabrez</span>
        <span class="s-hint">Professional network — connect anytime</span>
      </a>
      <a class="social-card reveal d1" href="''' + EMAIL_HREF + '''">
        <span class="s-label">Email</span>
        <span class="s-value">Shams090484&#64;gmail.com</span>
        <span class="s-hint">For anything that needs a considered reply</span>
      </a>
      <a class="social-card reveal d2" href="''' + GITHUB + '''" target="_blank" rel="noopener">
        <span class="s-label">GitHub</span>
        <span class="s-value">Shams090484</span>
        <span class="s-hint">Code, experiments, and open work</span>
      </a>
    </div>
    <p class="contact-loc reveal d3" style="margin-top:44px">Riyadh, Saudi Arabia · UTC+3</p>
  </div>
</section>
''' + footer() + '\n' + SCRIPT + '''
</body>
</html>'''

for name, html in pages.items():
    (ROOT / name).write_text(html)
    print("wrote %s: %d chars" % (name, len(html)))
print("DONE")