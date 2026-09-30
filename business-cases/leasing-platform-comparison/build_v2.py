#!/usr/bin/env python3
"""Build v2 — professionally themed leasing platform deck (KSA)."""
import sys
sys.path.insert(0, "/home/shams/.hermes/profiles/basir/cache/scratch/pptx-venv/lib/python3.11/site-packages")

from pptx import Presentation
from pptx.util import Inches, Pt, Emu
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE
from pptx.chart.data import CategoryChartData
from pptx.enum.chart import XL_CHART_TYPE, XL_LEGEND_POSITION

# ---------- design system ----------
NAVY   = RGBColor(0x0F, 0x2A, 0x43)
TEAL   = RGBColor(0x0E, 0x7C, 0x7B)
GOLD   = RGBColor(0xD9, 0xA4, 0x41)
INK    = RGBColor(0x1F, 0x29, 0x37)
SUB    = RGBColor(0x5A, 0x6B, 0x7B)
RED    = RGBColor(0xC0, 0x39, 0x2B)
GREEN  = RGBColor(0x1E, 0x7A, 0x46)
BG     = RGBColor(0xF7, 0xF9, 0xFB)
PANEL  = RGBColor(0xEC, 0xF1, 0xF6)
PANEL2 = RGBColor(0xEA, 0xF0, 0xF6)
WHITE  = RGBColor(0xFF, 0xFF, 0xFF)
LIGHT  = RGBColor(0xB9, 0xC9, 0xD6)
AMBER_BG  = RGBColor(0xFD, 0xF3, 0xE3)
AMBER_TX  = RGBColor(0x7A, 0x4F, 0x0B)
FONT   = "Segoe UI"

prs = Presentation()
prs.slide_width, prs.slide_height = Inches(13.333), Inches(7.5)
BLANK = prs.slide_layouts[6]
SW, SH = 13.333, 7.5

def slide_new(bg=BG):
    s = prs.slides.add_slide(BLANK)
    s.background.fill.solid()
    s.background.fill.fore_color.rgb = bg
    return s

def rect(s, x, y, w, h, fill, shape=MSO_SHAPE.ROUNDED_RECTANGLE):
    sp = s.shapes.add_shape(shape, Inches(x), Inches(y), Inches(w), Inches(h))
    sp.fill.solid(); sp.fill.fore_color.rgb = fill
    sp.line.fill.background()
    sp.shadow.inherit = False
    if shape == MSO_SHAPE.ROUNDED_RECTANGLE:
        try: sp.adjustments[0] = 0.08
        except Exception: pass
    return sp

def textbox(s, x, y, w, h, lines):
    tb = s.shapes.add_textbox(Inches(x), Inches(y), Inches(w), Inches(h))
    tf = tb.text_frame; tf.word_wrap = True
    for i, ln in enumerate(lines):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.alignment = ln.get("align", PP_ALIGN.LEFT)
        if ln.get("space_after") is not None: p.space_after = Pt(ln["space_after"])
        if ln.get("indent"): p.level = ln["indent"]
        txt = ("•  " + ln["text"]) if ln.get("bullet") else ln["text"]
        r = p.add_run(); r.text = txt
        f = r.font; f.name = FONT; f.size = Pt(ln.get("size", 15))
        f.color.rgb = ln.get("color", INK); f.bold = ln.get("bold", False); f.italic = ln.get("italic", False)
    return tb

PAGE = [0]
def header(s, title, kicker=None):
    PAGE[0] += 1
    rect(s, 0, 0, 0.16, SH, NAVY, shape=MSO_SHAPE.RECTANGLE)
    if kicker:
        textbox(s, 0.45, 0.16, 11, 0.3, [dict(text=kicker, size=10, color=TEAL, bold=True)])
        ty = 0.44
    else:
        ty = 0.30
    textbox(s, 0.45, ty, 12.3, 0.9, [dict(text=title, size=24, color=NAVY, bold=True)])
    rect(s, 0.47, ty + 0.78, 12.4, 0.035, GOLD, shape=MSO_SHAPE.RECTANGLE)

def footer(s, note="ARKAN Research — Confidential"):
    textbox(s, 0.45, 7.08, 10.5, 0.3,
            [dict(text=f"{note}  |  Leasing Platform Decision — KSA  |  30 Sep 2026", size=8.5, color=SUB)])
    textbox(s, 12.6, 7.08, 0.5, 0.3, [dict(text=str(PAGE[0]), size=9, color=SUB, align=PP_ALIGN.RIGHT)])

def style_table(tbl, body_pt=10.5, header_pt=11, col0_bold=True):
    for ri, row in enumerate(tbl.rows):
        for ci, cell in enumerate(row.cells):
            cell.margin_left = Inches(0.06); cell.margin_right = Inches(0.06)
            cell.margin_top = Inches(0.02);  cell.margin_bottom = Inches(0.02)
            cell.vertical_anchor = MSO_ANCHOR.MIDDLE
            cell.fill.solid()
            cell.fill.fore_color.rgb = NAVY if ri == 0 else (WHITE if ri % 2 == 1 else PANEL2)
            for p in cell.text_frame.paragraphs:
                for run in p.runs:
                    f = run.font; f.name = FONT
                    f.size = Pt(header_pt if ri == 0 else body_pt)
                    f.color.rgb = WHITE if ri == 0 else INK
                    f.bold = (ri == 0) or (ci == 0 and col0_bold)

def add_chart(s, kind, x, y, w, h, cats, series, chart_title=None, legend=True):
    cd = CategoryChartData(); cd.categories = cats
    for name, vals in series: cd.add_series(name, vals)
    gf = s.shapes.add_chart(kind, Inches(x), Inches(y), Inches(w), Inches(h), cd)
    ch = gf.chart
    ch.has_legend = legend and len(series) > 1
    if ch.has_legend:
        ch.legend.position = XL_LEGEND_POSITION.BOTTOM
        ch.legend.include_in_layout = False
    if chart_title:
        ch.chart_title.text_frame.text = chart_title
    ch.font.size = Pt(11); ch.font.name = FONT
    pal = [NAVY, TEAL, GOLD, RGBColor(0x64, 0x74, 0x8B), GREEN]
    try:
        for srs, c in zip(ch.plots[0].series, pal):
            srs.format.fill.solid(); srs.format.fill.fore_color.rgb = c
            srs.format.line.fill.background()
    except Exception:
        pass
    return ch

# ================= SLIDE 1 — TITLE =================
s = slide_new(NAVY)
rect(s, 0.9, 2.02, 1.6, 0.05, GOLD, shape=MSO_SHAPE.RECTANGLE)
textbox(s, 0.9, 1.35, 11, 0.4, [dict(text="ARKAN RESEARCH  ·  DECISION BRIEF", size=12, color=GOLD, bold=True)])
textbox(s, 0.9, 2.25, 11.6, 1.6, [dict(text="Leasing Platform Decision — Saudi Arabia", size=40, color=WHITE, bold=True)])
textbox(s, 0.9, 3.55, 11.6, 1.0, [dict(text="SaaS vs ERP platform vs custom build — graphical & tabular comparison, weighted scorecard, and reasoned recommendations", size=16, color=LIGHT)])
rect(s, 0.9, 6.35, 11.5, 0.02, RGBColor(0x2A, 0x4A, 0x6B), shape=MSO_SHAPE.RECTANGLE)
textbox(s, 0.9, 6.5, 11.5, 0.6, [dict(text="30 September 2026  ·  Prepared by Basir, ARKAN Research  ·  Verified against cited public sources", size=11.5, color=RGBColor(0x8F, 0xA6, 0xBA))])
prs.core_properties.title = "Leasing Platform Decision — Saudi Arabia"
prs.core_properties.author = "Basir — ARKAN Research"

# ================= SLIDE 2 — EXECUTIVE SUMMARY =================
s = slide_new()
header(s, "The right answer depends on which leasing business you run", "EXECUTIVE SUMMARY")
cards = [
    ("Local Saudi-native SaaS / build", "SHORT-TERM RENTAL", "Tajeer + ZATCA native; Absher e-sign; live in weeks", TEAL),
    ("Annata A365 / CarPro LeaseProXL", "CORPORATE + FINANCE LEASING", "ERP-grade lifecycle & SAMA audit fit; decide via 6-week RFP", NAVY),
    ("Custom build (gated)", "LEASING AS DIFFERENTIATOR", "Highest weighted score (3.85/5) — only with a funded 3-year team", GOLD),
]
for i, (t, sub, why, col) in enumerate(cards):
    x = 0.45 + i * 4.18
    rect(s, x, 1.62, 3.95, 2.05, WHITE)
    rect(s, x, 1.62, 3.95, 0.16, col, shape=MSO_SHAPE.RECTANGLE)
    textbox(s, x + 0.14, 1.9, 3.7, 0.75, [dict(text=t, size=14.5, color=NAVY, bold=True)])
    textbox(s, x + 0.14, 2.62, 3.7, 0.35, [dict(text=sub, size=10, color=col, bold=True)])
    textbox(s, x + 0.14, 3.0, 3.68, 0.62, [dict(text=why, size=10.5, color=INK)])
textbox(s, 0.45, 4.05, 12.4, 2.0, [
    dict(text="Weighted scorecard (corporate-leasing weights): Custom 3.85 · Annata A365 3.42 · Local SaaS 3.35 · CarPro 2.65 · Rentey 1.45 — yet the recommendation is NOT 'build first': custom owes its lead to long-horizon criteria that only pay off if a product team is funded for 3+ years.", size=13.5, space_after=8),
    dict(text="Regulatory gates (ZATCA Phase 2, Tajeer, SAMA) are the decisive filter — no international option clears all of them natively.", size=13.5, bullet=True, space_after=6),
    dict(text="RED FLAG — CarPro is mid-merger (Emotion, Mar 2025): written Rentway-vs-CarPro roadmap required. Rentey: thinnest evidence base — excluded pending references.", size=13, color=RED, bullet=True),
])
footer(s)

# ================= SLIDE 3 — MARKET =================
s = slide_new()
header(s, "Saudi rental-leasing demand compounds at ~7–9% under Vision 2030", "MARKET CONTEXT")
add_chart(s, XL_CHART_TYPE.LINE_MARKERS, 0.45, 1.55, 7.9, 4.6,
          ["2025","2026","2027","2028","2029","2030","2031"],
          [("Market size (USD bn)", [2.87, 3.07, 3.29, 3.52, 3.77, 4.04, 4.33])],
          "KSA car rental + leasing market (USD bn) — 7.09% CAGR (Research&Markets 2026–2031)")
rect(s, 8.6, 1.6, 4.25, 4.55, PANEL)
textbox(s, 8.85, 1.8, 3.8, 4.2, [
    dict(text="WHAT'S DRIVING IT", size=11, color=TEAL, bold=True, space_after=10),
    dict(text="SAR 7.5bn (FY23) → 11.7bn (FY28E), 9.2% CAGR — Aljazira Capital", size=12, bullet=True, space_after=8),
    dict(text="Long-term leasing growing faster than short-term; corporate + government fleet outsourcing", size=12, bullet=True, space_after=8),
    dict(text="Fragmented: top-3 players hold only ~25% share", size=12, bullet=True, space_after=8),
    dict(text="Regional-HQ mandate (2024) → new corporate lease demand", size=12, bullet=True),
])
footer(s)

# ================= SLIDE 4 — REGULATORY =================
s = slide_new()
header(s, "Three regulatory gates decide the winner: ZATCA, Tajeer, SAMA", "REGULATORY STACK")
items = [
    ("ZATCA — Fatoora Phase 2", "API clearance + 24-hour reporting, cryptographic stamp & QR. Wave threshold now SAR 1M turnover; Wave 24 (SAR 375K) cited for 2026 — verify with ZATCA."),
    ("Tajeer — Transport General Authority", "Mandatory unified e-contract for car rental: 1.77M contracts issued in Q4 2025 alone. API setup SAR 15,000 + ~SAR 2.25/tx; renter e-signs via Absher OTP."),
    ("SAMA — Finance Leasing", "Finance lease is a licensed activity (Finance Companies Control Law + Finance Lease Law M/48): capital, governance, cloud outsourcing non-objection."),
    ("PDPL + sector residency", "GDPR-style law, but SAMA/CST/NCA rules keep regulated financial workloads effectively in-Kingdom — confirm hosting explicitly with any SaaS."),
    ("Language & identity", "Arabic-first contracts and branch UI; Absher/NAFATH flow is the Tajeer completion path."),
]
y = 1.55
for i, (t, d) in enumerate(items):
    shade = WHITE if i % 2 == 0 else PANEL
    rect(s, 0.45, y, 12.4, 0.86, shade)
    rect(s, 0.45, y, 0.12, 0.86, TEAL if i % 2 == 0 else NAVY, shape=MSO_SHAPE.RECTANGLE)
    textbox(s, 0.75, y + 0.08, 3.6, 0.7, [dict(text=t, size=12.5, color=NAVY, bold=True)])
    textbox(s, 4.5, y + 0.06, 8.2, 0.78, [dict(text=d, size=11.5)])
    y += 0.98
textbox(s, 0.45, 6.5, 12.4, 0.5, [dict(text="Consequence: international platforms clear these gates only with middleware — local SaaS and custom builds clear them natively.", size=13, color=NAVY, bold=True)])
footer(s)

# ================= SLIDE 5 — SECTION =================
s = slide_new(NAVY)
PAGE[0] += 1
rect(s, 0.9, 3.3, 1.6, 0.05, GOLD, shape=MSO_SHAPE.RECTANGLE)
textbox(s, 0.9, 3.55, 11.5, 0.8, [dict(text="PART II — The Four Options", size=30, color=WHITE, bold=True)])
textbox(s, 0.9, 4.35, 11.5, 0.5, [dict(text="Who they are, what they prove, what to verify — evidence standard: 2+ independent sources per claim", size=13.5, color=LIGHT)])
footer(s)

# ================= SLIDE 6 — CARPRO =================
s = slide_new()
header(s, "CarPro (now Emotion) — deepest lease pedigree, now mid-merger", "OPTION A · NICHE LEASING SAAS")
textbox(s, 0.45, 1.6, 7.6, 4.4, [
    dict(text="Founded 1992 · HQ Amsterdam · rental + leasing + subscription modules", size=13.5, bullet=True, space_after=10),
    dict(text="Clients incl. Hertz, Europcar, LeasePlan, VW Financial Services (vendor claim); scale claim: 85+ countries, 1M+ vehicles, 500+ partners", size=13.5, bullet=True, space_after=10),
    dict(text="LeaseProXL: lease quotations, flexible invoicing (corporate/combined), AR + aging + collections, cashiers, multi-currency, fleet status", size=13.5, bullet=True, space_after=10),
    dict(text="RED FLAG — ownership churn: sold to Ibérica (Jul 2020) → merged with Jimpisoft/Rentway into Emotion Mobility (Mar 2025); consolidation underway", size=13, color=RED, bold=True, bullet=True, space_after=10),
    dict(text="RED FLAG — no native ZATCA/Tajeer/Absher layer; requires middleware or a local integrator", size=13, color=RED, bold=True, bullet=True),
])
rect(s, 8.35, 1.62, 4.5, 4.4, PANEL)
textbox(s, 8.6, 1.82, 4.05, 4.1, [
    dict(text="RFP DISQUALIFIERS TO TEST", size=11, color=TEAL, bold=True, space_after=10),
    dict(text="Written product roadmap: Rentway vs CarPro — which line survives?", size=12, bullet=True, space_after=8),
    dict(text="Two reference customers of similar fleet size", size=12, bullet=True, space_after=8),
    dict(text="ZATCA middleware plan + cost, in writing", size=12, bullet=True, space_after=8),
    dict(text="Data-egress clause and hosting location", size=12, bullet=True),
])
footer(s)

# ================= SLIDE 7 — RENTEY =================
s = slide_new()
header(s, "Rentey (Qoad) — promising SaaS, but the thinnest evidence base", "OPTION B · NICHE RENTAL SAAS")
textbox(s, 0.45, 1.6, 7.6, 4.4, [
    dict(text="All-in-one rental platform: reservations + payments, built-in CRM, fleet optimization, analytics, mobile access", size=13.5, bullet=True, space_after=10),
    dict(text="Part of Qoad product family (QFleets for corporate car sharing) — vertical SaaS vendor", size=13.5, bullet=True, space_after=10),
    dict(text="RED FLAG — public footprint limited to a single vendor page: no verifiable references, funding, or headcount found", size=13, color=RED, bold=True, bullet=True, space_after=10),
    dict(text="RED FLAG — no public evidence of ZATCA, Tajeer, or SAMA awareness; Arabic status unknown", size=13, color=RED, bold=True, bullet=True, space_after=10),
    dict(text="Comparably-positioned tools exist (Rently, Renthub) — Rentey must earn its slot", size=13, bullet=True),
])
rect(s, 8.35, 1.62, 4.5, 4.4, PANEL)
textbox(s, 8.6, 1.82, 4.05, 4.1, [
    dict(text="RE-INSTATEMENT BAR", size=11, color=TEAL, bold=True, space_after=10),
    dict(text="2+ same-size operator references, in KSA/GCC", size=12, bullet=True, space_after=8),
    dict(text="Live sandbox on our data", size=12, bullet=True, space_after=8),
    dict(text="ZATCA/Tajeer statement in writing", size=12, bullet=True, space_after=8),
    dict(text="Financial viability evidence (funding/size)", size=12, bullet=True),
])
footer(s)

# ================= SLIDE 8 — ANNATA =================
s = slide_new()
header(s, "Annata A365 — ERP-grade leasing on Dynamics 365", "OPTION C · ERP PLATFORM")
textbox(s, 0.45, 1.6, 7.6, 4.4, [
    dict(text="Founded 2001 · HQ Kópavogur, Iceland · 15 offices, 4 continents · Microsoft Inner Circle ISV (top 1% of Dynamics partners)", size=13.5, bullet=True, space_after=10),
    dict(text="A365 = ERP + CRM + DMS on Dynamics 365 F&O; Rental & Subscription modules cover cradle-to-grave vehicle lifecycle", size=13.5, bullet=True, space_after=10),
    dict(text="Enterprise integration: GL, fixed assets, audit trails, Copilot/Azure; MEA delivery via partners (SHEA, Confiz — Sep 2025)", size=13.5, bullet=True, space_after=10),
    dict(text="D365 ships a Saudi ZATCA localization (CSID onboarding) — integration work sits with the implementer", size=13.5, bullet=True, space_after=10),
    dict(text="CAUTION — no Riyadh office; delivery quality depends on the local partner chosen", size=13, color=RED, bold=True, bullet=True),
])
rect(s, 8.35, 1.62, 4.5, 4.4, PANEL)
textbox(s, 8.6, 1.82, 4.05, 4.1, [
    dict(text="VERIFY IN RFP", size=11, color=TEAL, bold=True, space_after=10),
    dict(text="KSA D365 e-invoicing reference implementations", size=12, bullet=True, space_after=8),
    dict(text="In-Kingdom hosting posture (Azure region)", size=12, bullet=True, space_after=8),
    dict(text="Named Saudi delivery team, not fly-in model", size=12, bullet=True, space_after=8),
    dict(text="Ijara-compatible contract configuration depth", size=12, bullet=True),
])
footer(s)

# ================= SLIDE 9 — CUSTOM OVERVIEW =================
s = slide_new()
header(s, "Custom build — total control and Saudi-native compliance, at a price", "OPTION D · GROUND-UP BUILD")
textbox(s, 0.45, 1.6, 12.4, 4.6, [
    dict(text="Control: own schema, own roadmap, ijara-compatible contract modelling, no per-seat licence tax, exit on your terms", size=14, bullet=True, space_after=11),
    dict(text="Compliance-native from day one: ZATCA Phase 2 APIs, Tajeer + Absher/NAFATH, Arabic-first UI, PDPL in-Kingdom hosting", size=14, bullet=True, space_after=11),
    dict(text="TCO logic: front-loaded build, flattening curve ONLY if maintained (15–20%/yr of build) by a durable team — else it decays into legacy", size=14, bullet=True, space_after=11),
    dict(text="Reality: a leasing core (contracts, SAMA reporting, fleet lifecycle, billing) is a multi-million-SAR, 6–12+ month programme — generic ERP build figures do not transfer", size=14, color=RED, bold=True, bullet=True, space_after=11),
    dict(text="Risk swap: vendor-dependence disappears; team/key-person (bus factor) risk appears — keep 2+ owners on every core module", size=14, bullet=True),
])
footer(s)

# ================= SLIDE 10 — BENEFITS OF CUSTOM (NEW) =================
s = slide_new()
header(s, "Why a custom build earns its slot — six benefits, priced honestly", "CUSTOM BUILD · BENEFITS & PRICE OF OWNERSHIP")
bens = [
    ("1 · Compliance-native", "ZATCA Phase 2 + Tajeer + Absher/NAFATH built in — no middleware, no third-party integration tax. Faster, safer go-live."),
    ("2 · Shariah by design", "Ijara ownership-transfer schedules, penalty-free late terms, per-contract structuring — not configurable at any packaged vendor."),
    ("3 · No licence tax", "40 active users ≈ SAR 1.1M+ licence spend avoided over 5 yrs (est.); costs scale with compute, not headcount."),
    ("4 · Data sovereignty", "Own schema + in-Kingdom hosting choice → PDPL/SAMA posture you control; clean full-fidelity export, forever."),
    ("5 · Roadmap sovereignty", "Features land when YOU need them — eliminates vendor roadmap, renewal (9–12%/yr) and merger risk (see CarPro→Emotion)."),
    ("6 · AI & data moat", "Pricing / utilization / risk models trained on your fleet data — proprietary advantage no packaged system can match."),
]
for i, (t, d) in enumerate(bens):
    col = i % 3; row = i // 3
    x = 0.45 + col * 4.23; yy = 1.55 + row * 2.28
    rect(s, x, yy, 3.98, 2.08, WHITE)
    rect(s, x, yy, 0.1, 2.08, TEAL if i % 2 == 0 else NAVY, shape=MSO_SHAPE.RECTANGLE)
    textbox(s, x + 0.2, yy + 0.12, 3.65, 0.5, [dict(text=t, size=12.5, color=NAVY, bold=True)])
    textbox(s, x + 0.2, yy + 0.6, 3.68, 1.4, [dict(text=d, size=10.8)])
rect(s, 0.45, 6.15, 12.4, 0.78, AMBER_BG)
textbox(s, 0.7, 6.24, 12.0, 0.66, [dict(text="THE PRICE OF OWNERSHIP — SAR 2.5–3.5M build + 15–20%/yr upkeep · 6–12+ months to live · a funded 3-year product team · phased MVP behind a capability gate. Custom wins the long game only under these conditions.", size=11.5, color=AMBER_TX, bold=True)])
footer(s)

# ================= SLIDE 11 — CAPABILITY MATRIX =================
s = slide_new()
header(s, "Capability matrix — no option clears every Saudi gate natively", "COMPARISON · 11 DIMENSIONS × 5 OPTIONS")
rows = [
    ["Dimension", "CarPro LeaseProXL", "Rentey (Qoad)", "Annata A365", "Local SaaS", "Custom build"],
    ["ZATCA Phase 2", "Middleware", "Unknown", "Via D365 SA module", "Native", "Native (build)"],
    ["Tajeer + Absher", "Not native", "Unknown", "Not native", "Native", "Native (build)"],
    ["Finance-lease depth", "LeaseProXL", "Rental focus", "Full lifecycle", "Rental-grade", "As designed"],
    ["Ijara / Shariah config", "No", "No", "Configurable", "Usually no", "Full control"],
    ["SAMA audit fit", "Partial", "No", "ERP-grade", "Partial", "If designed"],
    ["Arabic/RTL + NAFATH", "Partial", "Unknown", "D365 multi-lang", "Native", "Native (build)"],
    ["Time to go-live", "4–8 wks", "Unknown", "3–6+ months", "2–8 weeks", "6–12+ months"],
    ["5-yr TCO shape", "Rises (seats)", "Rises (seats)", "High but flatter", "Rises (sub)", "Flattens if run"],
    ["Exit / lock-in", "Untested", "Untested", "D365 export", "SaaS terms", "Own schema"],
    ["In-Kingdom hosting", "Ask vendor", "Ask vendor", "Azure — verify", "Confirm", "Your control"],
]
gt = s.shapes.add_table(len(rows), 6, Inches(0.45), Inches(1.5), Inches(12.4), Inches(4.6)).table
for ri, row in enumerate(rows):
    for ci, val in enumerate(row):
        gt.cell(ri, ci).text = val
style_table(gt, body_pt=10.5, header_pt=11.5)
gt.rows[0].height = Inches(0.36)
for rw in list(gt.rows)[1:]: rw.height = Inches(0.47)
textbox(s, 0.45, 6.35, 12.4, 0.5, [dict(text="'Unknown' = could not verify publicly (documented gap). Azure KSA-region availability to be verified with Microsoft at RFP stage.", size=10.5, color=SUB, italic=True)])
footer(s)

# ================= SLIDE 12 — CAPABILITY PROFILE CHART =================
s = slide_new()
header(s, "Capability profiles — strengths differ; verdict depends on scenario", "COMPARISON · UNWEIGHTED PROFILE")
add_chart(s, XL_CHART_TYPE.COLUMN_CLUSTERED, 0.45, 1.5, 12.4, 4.9,
          ["ZATCA readiness","Tajeer/Absher","Lease depth","Shariah flexibility","SAMA audit","Speed to live","Ownership/exit"],
          [("CarPro",[1.0,1.0,4.5,1.0,2.5,4.5,2.5]),
           ("Rentey",[1.0,1.0,1.5,1.0,1.0,3.5,2.0]),
           ("Annata A365",[3.0,1.0,5.0,3.0,4.5,2.0,3.5]),
           ("Local SaaS",[5.0,5.0,2.5,2.0,2.5,5.0,2.5]),
           ("Custom",[5.0,5.0,4.0,5.0,4.5,1.5,5.0])],
          "Capability scoring 0–5 (evidence-anchored assessment, 30 Sep 2026)")
footer(s)

# ================= SLIDE 13 — WEIGHTED SCORECARD (NEW) =================
s = slide_new()
header(s, "Weighted scorecard — Custom leads numerically, execution risk decides otherwise", "DECISION MODEL · CORPORATE-LEASING WEIGHTS")
sc = [["Criterion (weight)", "CarPro", "Rentey", "A365", "Local SaaS", "Custom"],
      ["Regulatory readiness — 25%", "1.00", "1.00", "3.00", "5.00", "5.00"],
      ["Lease lifecycle depth — 20%", "4.50", "1.50", "5.00", "2.50", "4.00"],
      ["Enterprise finance & SAMA — 15%", "2.50", "1.00", "4.50", "2.50", "4.50"],
      ["5-year TCO — 15%", "2.50", "1.00", "2.00", "2.50", "1.50"],
      ["Speed to value — 10%", "4.50", "3.50", "2.00", "5.00", "1.50"],
      ["Ownership & exit — 10%", "2.50", "2.00", "3.50", "2.50", "5.00"],
      ["Shariah flexibility — 5%", "1.00", "1.00", "3.00", "2.00", "5.00"],
      ["WEIGHTED TOTAL /5", "2.65", "1.45", "3.42", "3.35", "3.85"]]
st = s.shapes.add_table(len(sc), 6, Inches(0.45), Inches(1.55), Inches(7.55), Inches(4.4)).table
for ri, row in enumerate(sc):
    for ci, val in enumerate(row):
        st.cell(ri, ci).text = val
style_table(st, body_pt=10, header_pt=10.5)
st.rows[0].height = Inches(0.4)
for rw in list(st.rows)[1:]: rw.height = Inches(0.5)
for ci in range(6):
    cell = st.cell(len(sc) - 1, ci)
    cell.fill.solid(); cell.fill.fore_color.rgb = NAVY
    for p in cell.text_frame.paragraphs:
        for run in p.runs:
            run.font.bold = True
            run.font.color.rgb = GOLD if ci > 0 else WHITE
add_chart(s, XL_CHART_TYPE.COLUMN_CLUSTERED, 8.2, 1.55, 4.7, 4.4,
          ["CarPro","Rentey","A365","Local SaaS","Custom"],
          [("Weighted total /5", [2.65, 1.45, 3.42, 3.35, 3.85])], None, legend=False)
textbox(s, 0.45, 6.45, 12.4, 0.6, [dict(text="Custom's lead comes from regulatory, ownership and Shariah criteria — but it carries the two lowest individual scores (speed 1.5, 5-yr TCO 1.5). A365 is the strongest BUY; Custom is the strongest STRATEGY if the 3-year team test passes.", size=11.5, bold=True)])
footer(s)

# ================= SLIDE 14 — TCO =================
s = slide_new()
header(s, "Illustrative 5-year cumulative TCO — SaaS compounds, custom flattens", "TCO MODEL (ILLUSTRATIVE)")
add_chart(s, XL_CHART_TYPE.LINE_MARKERS, 0.45, 1.5, 12.4, 4.35,
          ["Year 1","Year 2","Year 3","Year 4","Year 5"],
          [("Niche SaaS (CarPro/Rentey class)",[280,460,660,880,1120]),
           ("Custom build (incl. 17% maint.)",[900,1330,1750,2170,2590]),
           ("Annata A365 (D365 + impl.)",[1450,2050,2650,3250,3850])],
          "Cumulative TCO, 200-vehicle operator (est., SAR 000s)")
rect(s, 0.45, 6.05, 12.4, 0.72, AMBER_BG)
textbox(s, 0.7, 6.14, 12.0, 0.6, [dict(text="ESTIMATE — order of magnitude only; pricing is quote-based. Excludes migration, integrations, internal staffing. No crossover within 5 yrs at this fleet size; custom crosses SaaS at ~6–8 yrs IF well maintained.", size=11, color=AMBER_TX, bold=True)])
footer(s)

# ================= SLIDE 15 — RECOMMENDATIONS + REASONING =================
s = slide_new()
header(s, "Recommendations — each with its reasoning", "RECOMMENDATIONS")
recs = [
    ("R1", "Short-term rental operations → local Saudi-native SaaS or configured local build",
     "Tajeer + ZATCA Phase 2 + Absher are native here; months of middleware delay avoided; switching later is cheap.", TEAL),
    ("R2", "Corporate operational + finance leasing → 6-week RFP: Annata A365 vs CarPro LeaseProXL + one local compliance integrator",
     "Both are evidence-proven at enterprise scale (A365 weighted 3.42); CarPro only conditional on a written post-merger roadmap.", NAVY),
    ("R3", "Custom build → keep OPEN but GATED: build only if the RFP shows ≥35% must-have gaps AND a funded 3-year product team is committed",
     "Custom scores highest (3.85) on long-horizon criteria yet weakest on speed (1.5) and 5-yr TCO (1.5) — the conditions convert potential into value.", GOLD),
    ("R4", "Rentey → excluded from the shortlist pending verifiable proof",
     "Single-source vendor page; weighted total 1.45/5 with unknown regulatory readiness; re-admit only with 2+ references + sandbox + written ZATCA/Tajeer statement.", RED),
    ("R5", "Any SaaS selection → require in writing: in-Kingdom hosting (PDPL/SAMA), data-egress clauses, renewal caps (≤8%)",
     "These three terms decide the real 5-year cost and exit freedom — and vendors never volunteer them.", NAVY),
    ("R6", "Before any finance-lease module decision → confirm SAMA scope + ijara structuring with counsel and qualified scholars",
     "Ijara mechanics (ownership transfer, late-term handling) differ from packaged markup modules; Shariah verdicts are not a software setting.", TEAL),
]
y = 1.5
for tag, rec, why, col in recs:
    rect(s, 0.45, y, 12.4, 0.80, WHITE)
    rect(s, 0.45, y, 0.55, 0.80, col, shape=MSO_SHAPE.RECTANGLE)
    textbox(s, 0.45, y + 0.16, 0.55, 0.5, [dict(text=tag, size=14, color=WHITE, bold=True, align=PP_ALIGN.CENTER)])
    textbox(s, 1.15, y + 0.04, 11.55, 0.4, [dict(text=rec, size=11.8, color=NAVY, bold=True)])
    textbox(s, 1.15, y + 0.40, 11.55, 0.38, [dict(text=why, size=10.5, color=SUB)])
    y += 0.88
footer(s)

# ================= SLIDE 16 — DECISION ASK =================
s = slide_new()
header(s, "Decision ask — approve scenario-led shortlisting and vendor due diligence", "NEXT STEPS")
asks = [
    ("1", "Approve the scenario framework + weighted scorecard as the basis for platform choice"),
    ("2", "Commission the 6-week RFP: Annata A365 + CarPro LeaseProXL + one local compliance integrator"),
    ("3", "Demand from every vendor: 2+ same-size KSA/GCC references, sandbox PoC on our data, written exit clauses"),
    ("4", "Verify SAMA scope + ijara structuring with counsel/scholars before any finance-lease module decision"),
    ("5", "Confirm ZATCA wave position + Tajeer scope directly with ZATCA and TGA"),
    ("6", "Decide build-vs-buy only after RFP results — apply the funded 3-year-team test to the custom option"),
]
y = 1.55
for n, t in asks:
    rect(s, 0.45, y, 12.4, 0.72, PANEL)
    rect(s, 0.45, y, 0.55, 0.72, NAVY, shape=MSO_SHAPE.RECTANGLE)
    textbox(s, 0.45, y + 0.1, 0.55, 0.5, [dict(text=n, size=15, color=GOLD, bold=True, align=PP_ALIGN.CENTER)])
    textbox(s, 1.2, y + 0.11, 11.4, 0.55, [dict(text=t, size=12.8)])
    y += 0.84
textbox(s, 0.45, 6.6, 12.4, 0.4, [dict(text="Decision request at this gate: management approval to run the RFP — no commitment beyond due-diligence spend.", size=11.5, color=NAVY, bold=True)])
footer(s)

# ================= SLIDE 17 — APPENDIX =================
s = slide_new()
header(s, "Appendix — sources, confidence, known gaps", "APPENDIX · AS OF 30 SEP 2026")
txts = [
    ("VENDORS", "CarPro: carprosystems.com (LeaseProXL) · CFI Group (2020 sale to Ibérica) · Auto Rental News (Emotion merger, Mar 2025) · CB Insights", INK),
    ("VENDORS", "Annata: annata.net (contact, Rental solution) · Craft/LinkedIn · SHEA · Confiz (Sep 2025) · Microsoft Learn (D365 KSA e-invoicing)", INK),
    ("VENDORS", "Rentey: qoad.com supplier page only — single source, low confidence", RED),
    ("REGULATORY", "ZATCA detailed guideline (zatca.gov.sa) · SAMA Rulebook (FCCL; Finance Lease M/48) · SDAIA PDPL guide · TGA/Tajeer (tga.gov.sa, elm.sa, rabet.sa)", INK),
    ("MARKET", "Aljazira Capital Transportation Outlook (SAR 7.5bn FY23 → 11.7bn FY28E) · Research&Markets 2026–2031 (USD 3.07bn, 7.09% CAGR)", INK),
    ("TCO", "ACM 2025 case study (ERP SaaS vs IaaS) · SitePoint custom-vs-OTS · CISIN framework (vendor-adjacent — framing only)", INK),
    ("GAPS", "Rentey references unknown · Tajeer scope for long-term leasing unconfirmed (→ TGA/counsel) · Wave 24 cited Jun 2026 (→ verify with ZATCA) · all pricing quote-based", RED),
    ("CONFIDENCE", "HIGH: vendor identities + regulatory framework · MEDIUM: TCO bands (estimates) · LOW: Rentey capability", TEAL),
]
y = 1.5
for tag, d, col in txts:
    textbox(s, 0.45, y, 1.7, 0.35, [dict(text=tag, size=10.5, color=NAVY, bold=True)])
    textbox(s, 2.2, y, 10.65, 0.5, [dict(text=d, size=10.5, color=col)])
    y += 0.55
textbox(s, 0.45, 6.15, 12.4, 0.5, [dict(text="Shariah structuring verdicts reserved to qualified scholars; regulatory citations to be confirmed against official Arabic texts. Review: Dec 2026 or upon ZATCA wave change.", size=10, color=SUB, italic=True)])
footer(s)

OUT = "/home/shams/hermes-workspace/business-cases/leasing-platform-comparison/leasing-platform-comparison-ksa-THEMED.pptx"
prs.save(OUT)
print("saved:", OUT, "| slides:", len(prs.slides._sldIdLst))