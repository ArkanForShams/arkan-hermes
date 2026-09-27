#!/usr/bin/env python3
"""KINETIQ deck post-processor v2: brand typography, dark tables, volt chart,
outline cleanup. Slide map: 1 cover, 2 story, 3 problem, 4 products, 5 tech,
6 model, 7 traction, 8 unit-econ, 9 roster, 10 campaign, 11 map, 12 sustain,
13 team+ask, 14 close."""
import json, sys
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.chart import XL_LEGEND_POSITION, XL_TICK_MARK, XL_CHART_TYPE, XL_LABEL_POSITION
from pptx.chart.data import CategoryChartData
from pptx.oxml.ns import qn
from pptx.oxml import parse_xml

VOID="050505"; INK="0A0A0B"; PANEL="16181D"; PANEL2="101114"; BAND="1A1C20"; GRAY="3A3D45"
VOLT="D6FF3F"; BONE="F2F0E9"; WHITE="FFFFFF"; MUTE="9B9E96"; MUTE2="6E7169"; DARK="0A0A0B"
DISP="Arial Black"; MONO="Consolas"; BODYF="Arial"
NS = 'xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:c="http://schemas.openxmlformats.org/drawingml/2006/chart"'

def C(h): return RGBColor.from_string(h)

def tx(slide, l, t, w, h, runs, align=PP_ALIGN.LEFT, anchor=MSO_ANCHOR.TOP,
       line_spacing=None, wrap=True):
    box = slide.shapes.add_textbox(Inches(l), Inches(t), Inches(w), Inches(h))
    tf = box.text_frame
    tf.word_wrap = wrap
    tf.vertical_anchor = anchor
    tf.margin_left = tf.margin_right = tf.margin_top = tf.margin_bottom = 0
    first = True
    for para in runs:
        p = tf.paragraphs[0] if first else tf.add_paragraph()
        first = False
        p.alignment = para.get("align", align)
        if line_spacing: p.line_spacing = line_spacing
        if para.get("space_before"): p.space_before = Pt(para["space_before"])
        if para.get("space_after") is not None: p.space_after = Pt(para["space_after"])
        for r in para["runs"]:
            run = p.add_run()
            run.text = r["t"]
            f = run.font
            f.name = r.get("font", DISP)
            f.size = Pt(r.get("size", 18))
            f.bold = r.get("bold", False)
            f.italic = r.get("italic", False)
            f.color.rgb = C(r.get("color", BONE))
            if r.get("spacing"):
                run.font._rPr.set('spc', str(int(r["spacing"]*100)))
    return box

def mono_tag(slide, l, t, w, text, color=MUTE2, size=10.5, align=PP_ALIGN.LEFT):
    return tx(slide, l, t, w, 0.32, [{"runs":[{"t":text,"font":MONO,"size":size,
        "color":color,"bold":False,"spacing":1.5}]}], align=align)

def slide_title(slide, num, kicker, title_lines, color=BONE, accent_rule=True):
    mono_tag(slide, 0.75, 0.52, 9.0, num + "  —  " + kicker, color=VOLT, size=11)
    runs = [{"runs":[{"t":line,"font":DISP,"size":36,"color":color,
                      "bold":False,"spacing":0.5}]} for line in title_lines]
    tx(slide, 0.75, 0.92, 11.9, 1.5, runs, line_spacing=0.98)
    if accent_rule:
        ln = slide.shapes.add_shape(1, Inches(0.75), Inches(2.14), Inches(0.55), Inches(0.05))
        ln.fill.solid(); ln.fill.fore_color.rgb = C(VOLT); ln.line.fill.background()

def set_cell_border(cell, color="26282D", width_pt=0.75):
    tcPr = cell._tc.get_or_add_tcPr()
    for tag in ("a:lnL","a:lnR","a:lnT","a:lnB"):
        e = tcPr.find(qn(tag))
        if e is not None: tcPr.remove(e)
    xml = ""
    for tag in ("a:lnL","a:lnR","a:lnT","a:lnB"):
        xml += (f'<{tag} w="{int(width_pt*12700)}" cap="flat" cmpd="sng" algn="ctr" {NS}>'
                f'<a:solidFill><a:srgbClr val="{color}"/></a:solidFill>'
                f'<a:prstDash val="solid"/></{tag}>')
    frag = parse_xml(f'<a:root {NS}>{xml}</a:root>')
    for tag in ("a:lnL","a:lnR","a:lnT","a:lnB"):
        tcPr.append(frag.find(qn(tag)))

def style_table(tbl, col_widths=None, row_h=0.45, center_cols=None):
    table = tbl.table
    center_cols = center_cols or set()
    if col_widths:
        for c, w in enumerate(col_widths):
            table.columns[c].width = Inches(w)
    for r in range(len(table.rows)):
        table.rows[r].height = Inches(row_h)
        for c in range(len(table.columns)):
            cell = table.cell(r, c)
            cell.vertical_anchor = MSO_ANCHOR.MIDDLE
            cell.margin_left = Inches(0.16); cell.margin_right = Inches(0.1)
            cell.margin_top = Inches(0.03); cell.margin_bottom = Inches(0.03)
            cell.fill.solid()
            cell.fill.fore_color.rgb = C(BAND if r == 0 else (PANEL if r % 2 == 1 else PANEL2))
            tf = cell.text_frame
            tf.word_wrap = True
            para = tf.paragraphs[0]
            para.alignment = PP_ALIGN.CENTER if c in center_cols else PP_ALIGN.LEFT
            run = para.runs[0] if para.runs else para.add_run()
            f = run.font
            f.name = MONO
            if r == 0:
                f.size = Pt(10.5); f.bold = True; f.color.rgb = C(VOLT)
            else:
                f.size = Pt(11.5); f.bold = (c == 0)
                f.color.rgb = C(BONE)
            set_cell_border(cell)

def style_chart(chart, series_colors=(VOLT,), num_fmt='0'):
    chart.has_legend = False
    plot = chart.plots[0]
    plot.gap_width = 60
    ser = plot.series[0]
    ser.format.fill.solid(); ser.format.fill.fore_color.rgb = C(series_colors[0])
    ser.format.line.fill.background()
    try:
        plot.has_data_labels = True
        dl = plot.data_labels
        dl.number_format = num_fmt; dl.number_format_is_linked = False
        dl.font.size = Pt(10.5); dl.font.bold = True
        dl.font.color.rgb = C(BONE); dl.font.name = MONO
        dl.position = XL_LABEL_POSITION.OUTSIDE_END
    except Exception:
        pass
    ca = chart.category_axis
    ca.tick_labels.font.size = Pt(11); ca.tick_labels.font.color.rgb = C(MUTE)
    ca.tick_labels.font.name = MONO
    ca.format.line.color.rgb = C(GRAY)
    ca.major_tick_mark = XL_TICK_MARK.NONE
    va = chart.value_axis
    va.tick_labels.font.size = Pt(10); va.tick_labels.font.color.rgb = C(MUTE2)
    va.tick_labels.font.name = MONO
    va.format.line.fill.background()
    va.has_major_gridlines = True
    gl = va.major_gridlines.format.line
    gl.color.rgb = C("1E2024"); gl.width = Pt(0.75)
    va.major_tick_mark = XL_TICK_MARK.NONE

def avatar(slide, x, y, ini, size=0.55, fsize=14):
    av = slide.shapes.add_shape(1, Inches(x), Inches(y), Inches(size), Inches(size))
    av.fill.solid(); av.fill.fore_color.rgb = C(VOLT); av.line.fill.background()
    av.shadow.inherit = False
    tf = av.text_frame
    tf.margin_left = tf.margin_right = tf.margin_top = tf.margin_bottom = 0
    p = tf.paragraphs[0]; p.alignment = PP_ALIGN.CENTER
    r = p.add_run(); r.text = ini
    r.font.name = DISP; r.font.size = Pt(fsize); r.font.bold = True
    r.font.color.rgb = C(DARK)
    return av

def footer(slide, idx, total):
    mono_tag(slide, 0.75, 7.08, 6.0, "KINETIQ — SERIES C — 2026", color=MUTE2, size=9)
    mono_tag(slide, 11.4, 7.08, 1.2, f"{idx:02d} / {total:02d}", color=MUTE2, size=9,
             align=PP_ALIGN.RIGHT)

def main(spec_path, deck_path, out_path):
    prs = Presentation(deck_path)
    S = prs.slides
    n = len(S)

    # ---------- S1 COVER ----------
    s = S[0]
    mono_tag(s, 0.75, 0.55, 6.0, "SERIES C — CONFIDENTIAL", color=VOLT, size=11)
    tx(s, 0.72, 1.7, 6.3, 3.2, [
        {"runs":[{"t":"KINETIQ","size":66,"color":BONE,"spacing":1}]},
        {"runs":[{"t":"MEASURED IN","size":30,"color":BONE,"space_before":6}]},
        {"runs":[{"t":"MILLISECONDS.","size":30,"color":VOLT}]},
    ], line_spacing=0.98)
    tx(s, 0.75, 4.62, 5.9, 1.15, [{"runs":[
        {"t":"Performance sportswear & equipment, validated on force plates before it touches a starting line. Founded 2019, Portland, Oregon.",
         "font":BODYF,"size":12.5,"color":MUTE}]}])
    for i,(big,lab) in enumerate([("0.01s","REACTION DELTA"),("212g","SHOE WEIGHT"),("34","COUNTRIES")]):
        x = 0.75 + i*1.95
        tx(s, x, 5.95, 1.8, 0.9, [
            {"runs":[{"t":big,"font":MONO,"size":22,"bold":True,"color":VOLT}]},
            {"runs":[{"t":lab,"font":MONO,"size":8.5,"color":MUTE,"spacing":1.5,"space_before":2}]}])
    mono_tag(s, 0.75, 7.02, 6.0, "FY2025 REVENUE $210M  ·  +68% YOY", color=MUTE, size=9.5)

    # ---------- S2 BRAND STORY ----------
    s = S[1]
    mono_tag(s, 0.75, 0.52, 6.0, "01  —  BRAND STORY", color=VOLT, size=11)
    tx(s, 0.75, 0.92, 7.9, 2.4, [
        {"runs":[{"t":"BORN IN A","size":36,"color":BONE}]},
        {"runs":[{"t":"PORTLAND LAB.","size":36,"color":BONE}]},
    ], line_spacing=0.98)
    tx(s, 0.75, 2.28, 7.6, 2.0, [{"runs":[
        {"t":"In 2019, a biomechanics researcher and a sprint coach kept seeing the same failure: ","font":BODYF,"size":14,"color":MUTE},
        {"t":"gear that looked fast but measured slow.","font":BODYF,"size":14,"color":BONE,"bold":True},
        {"t":" Marketing claimed milliseconds; force plates said otherwise. So they built a company where the stopwatch outranks the mood board.","font":BODYF,"size":14,"color":MUTE}]}])
    facts = [("2019","FOUNDED IN PORTLAND"),("68%","YoY GROWTH FY2025"),
             ("$210M","FY25 REVENUE"),("34","COUNTRIES SERVED")]
    for i,(big,lab) in enumerate(facts):
        x = 0.75 + (i%2)*2.75; y = 4.35 + (i//2)*1.05
        tx(s, x, y, 2.6, 0.95, [
            {"runs":[{"t":big,"font":DISP,"size":26,"color":VOLT}]},
            {"runs":[{"t":lab,"font":MONO,"size":8.5,"color":MUTE,"spacing":1.2,"space_before":2}]}])
    tx(s, 0.75, 6.55, 7.6, 0.5, [{"runs":[
        {"t":"“EVERY GRAM, EVERY MILLIMETER, EVERY MILLISECOND — ON THE RECORD.”",
         "font":MONO,"size":10.5,"color":MUTE2,"spacing":1}]}])
    footer(s, 2, n)

    # ---------- S3 PROBLEM ----------
    s = S[2]
    slide_title(s, "02", "THE MARKET PROBLEM", ["THE TRUST GAP", "IN PERFORMANCE GEAR."])
    tx(s, 0.75, 2.42, 11.6, 0.45, [{"runs":[
        {"t":"Brands sell hero narratives. Athletes buy verified numbers — and can't get them.",
         "font":BODYF,"size":14,"color":MUTE}]}])
    for i,(big,lab) in enumerate([("$4.1B","RUN & TRACK FOOTWEAR, US + EU, 2026E"),
           ("62%","OF SERIOUS RUNNERS DISTRUST PERFORMANCE CLAIMS"),
           ("2.1×","GROWTH OF 'SUPER SHOE' CATEGORY SINCE 2019")]):
        x = 0.75 + i*4.04
        tx(s, x+0.3, 3.15, 3.2, 1.6, [
            {"runs":[{"t":big,"font":DISP,"size":30,"color":VOLT}]},
            {"runs":[{"t":lab,"font":MONO,"size":9,"color":MUTE,"spacing":1,"space_before":8}]}])
    tx(s, 1.05, 5.6, 11.0, 0.75, [{"runs":[
        {"t":"THE KINETIQ ANSWER — PUBLISH THE LAB SHEET WITH EVERY PRODUCT: FORCE CURVES, DUROMETERS, GRAMS.",
         "font":MONO,"size":11,"bold":True,"color":DARK,"spacing":0.8}]}], anchor=MSO_ANCHOR.MIDDLE)
    footer(s, 3, n)

    # ---------- S4 PRODUCT LINES ----------
    s = S[3]
    slide_title(s, "03", "PRODUCT ARCHITECTURE", ["THREE PLATFORMS. ONE CLOCK."])
    prods = [
        ("VOLT SPRINT", "TRACK SPIKE", "$240", "212G · CARBONDRIVE R/11 · 6-PIN"),
        ("TRAIL APEX", "TRAIL", "$189", "289G · 4.5MM LUGS · ROCKLOCK SHANK"),
        ("DAILY GRID", "DAILY TRAINER", "$129", "268G · KINETICFOAM™ · 1,200KM RATED"),
    ]
    for i,(name,cat,price,spec) in enumerate(prods):
        x = 1.095 + i*4.27
        tx(s, x, 1.9, 2.6, 0.3, [{"runs":[
            {"t":cat,"font":MONO,"size":10,"bold":True,"color":VOLT,"spacing":2}]}], align=PP_ALIGN.CENTER)
        tx(s, x, 4.98, 2.6, 0.4, [{"runs":[
            {"t":name,"font":DISP,"size":19,"color":BONE,"spacing":0.5}]}], align=PP_ALIGN.CENTER)
        tx(s, x, 5.36, 2.6, 0.3, [{"runs":[
            {"t":spec,"font":MONO,"size":8.5,"color":MUTE,"spacing":0.6}]}], align=PP_ALIGN.CENTER)
        tx(s, x, 5.62, 2.6, 0.45, [{"runs":[
            {"t":price,"font":DISP,"size":22,"color":VOLT}]}], align=PP_ALIGN.CENTER)
    tx(s, 1.0, 6.32, 5.3, 0.5, [{"runs":[
        {"t":"COMPRESSION LINE — $38–85","font":MONO,"size":12,"bold":True,"color":BONE},
        {"t":"   GRADUATED 20–28 MMHG · 34% OF UNITS","font":MONO,"size":9.5,"color":MUTE,"space_before":2}]}])
    tx(s, 7.04, 6.32, 5.3, 0.5, [{"runs":[
        {"t":"ELITE GLOVES — $65","font":MONO,"size":12,"bold":True,"color":BONE},
        {"t":"   SILICONE GRIP MAP · 8% OF UNITS","font":MONO,"size":9.5,"color":MUTE,"space_before":2}]}])
    footer(s, 4, n)

    # ---------- S5 TECHNOLOGY ----------
    s = S[4]
    slide_title(s, "04", "TECHNOLOGY", ["THE LAB", "STACK."])
    tech = [
        ("KINETICFOAM™","NITROGEN-INFUSED SUPERCRITICAL MIDSOLE, TWIN-FOAMED FOR REBOUND WITHOUT COLLAPSE.",
         [("ENERGY RETURN","87.2%"),("DENSITY","0.11 G/CM³"),("CONTACT-TIME Δ","−3.4%"),("HEAT DRIFT @40°C","<2%")]),
        ("CARBONDRIVE PLATE","ONE-PIECE AEROSPACE CARBON ON A VARIABLE-STIFFNESS MAP. TUNED PER EVENT.",
         [("STIFFNESS","9.2 N/MM²"),("RUNNING ECONOMY","+4.2%"),("PLATE MASS","38G"),("GEOMETRY","R/11")]),
        ("AEROKNIT UPPER","ZONAL KNIT MAPPED FROM 27,000+ LAB SCANS. LOCKED WHERE FORCE DEMANDS IT.",
         [("WEIGHT (EU 42)","212G"),("AIRFLOW VS WOVEN","+38%"),("RECYCLED YARN","72%"),("STRETCH RECOVERY","96%")]),
    ]
    for i,(name,desc,rows) in enumerate(tech):
        x = 0.75 + i*2.79
        tx(s, x, 2.32, 2.62, 0.75, [{"runs":[
            {"t":name,"font":DISP,"size":13,"color":VOLT,"spacing":0.5}]}])
        tx(s, x, 3.02, 2.55, 0.95, [{"runs":[
            {"t":desc,"font":BODYF,"size":10.5,"color":MUTE}]}])
        yy = 4.0
        for k, v in rows:
            tx(s, x, yy, 1.5, 0.3, [{"runs":[
                {"t":k,"font":MONO,"size":9,"color":MUTE,"spacing":0.5}]}])
            tx(s, x, yy, 2.55, 0.3, [{"runs":[
                {"t":v,"font":MONO,"size":9,"bold":True,"color":BONE}]}], align=PP_ALIGN.RIGHT)
            yy += 0.4
    tx(s, 0.75, 6.3, 8.0, 0.6, [{"runs":[
        {"t":"VALIDATED ON A 12-CAMERA MOTION-CAPTURE ARRAY AND INSTRUMENTED TREADMILL — 27,412 TESTS LOGGED SINCE 2019.",
         "font":MONO,"size":9.5,"color":MUTE2,"spacing":0.8}]}])
    footer(s, 5, n)

    # ---------- S6 BUSINESS MODEL ----------
    s = S[5]
    slide_title(s, "05", "BUSINESS MODEL", ["DTC-FIRST,", "WHOLESALE FOR REACH."])
    mono_tag(s, 0.75, 2.18, 5.0, "CHANNEL MIX — FY2025", color=VOLT, size=11)
    tx(s, 0.95, 2.42, 6.9, 0.6, [{"runs":[
        {"t":"DTC  61%","font":DISP,"size":25,"color":DARK}]}])
    tx(s, 8.3, 2.42, 4.3, 0.6, [{"runs":[
        {"t":"WHOLESALE  39%","font":DISP,"size":22,"color":BONE}]}])
    tx(s, 0.95, 3.1, 5.0, 0.3, [{"runs":[
        {"t":"$128M GMV · 47% REPEAT RATE · 4.2x LTV/CAC","font":MONO,"size":9.5,"color":MUTE,"spacing":0.8}]}])
    tx(s, 9.0, 3.1, 4.2, 0.3, [{"runs":[
        {"t":"118 DOORS · NO DISCOUNT LEAKAGE","font":MONO,"size":9.5,"color":MUTE,"spacing":0.8}]}])
    mono_tag(s, 0.75, 3.62, 6.0, "UNIT ECONOMICS — FY2025", color=VOLT, size=11)
    footer(s, 6, n)

    # ---------- S7 TRACTION ----------
    s = S[6]
    slide_title(s, "06", "TRACTION", ["COMPOUNDING", "AT 68% A YEAR."])
    mono_tag(s, 9.6, 2.25, 3.0, "KEY SIGNALS", color=VOLT, size=10.5)
    for i,(k,v) in enumerate([("CAGR 2021–26E","64%"),("DTC SHARE","61%"),
                              ("MARKETS LIVE","34"),("AVG ORDER VALUE","$142")]):
        y = 2.7 + i*0.92
        tx(s, 9.6, y, 2.99, 0.35, [{"runs":[
            {"t":k,"font":MONO,"size":10,"color":MUTE,"spacing":1}]}])
        tx(s, 9.6, y+0.22, 2.99, 0.5, [{"runs":[
            {"t":v,"font":DISP,"size":24,"color":VOLT}]}])
    tx(s, 0.75, 6.85, 8.4, 0.4, [{"runs":[
        {"t":"2026E = QUARTERLY RUN-RATE × SEASONALITY INDEX. AUDITED THROUGH FY2025.",
         "font":MONO,"size":9,"color":MUTE2,"spacing":0.8}]}])
    footer(s, 7, n)

    # ---------- S8 UNIT ECONOMICS TABLE ----------
    s = S[7]
    slide_title(s, "07", "UNIT ECONOMICS", ["THE NUMBERS BEHIND", "THE MARGIN."])
    tx(s, 0.95, 6.35, 11.4, 0.4, [{"runs":[
        {"t":"COGS AT 50K-UNIT RUNS · FY2025 BLENDED FULFILLMENT · YIELD & RETURNS FROM Q1–Q2 2026 PRODUCTION",
         "font":MONO,"size":9.5,"color":MUTE,"spacing":0.8}]}])
    footer(s, 8, n)

    # ---------- S9 ATHLETE ROSTER ----------
    s = S[8]
    slide_title(s, "08", "ATHLETE ROSTER", ["WORN BY PEOPLE", "WHO COUNT."])
    ath = [
        ("MO","MARIAM OKONKWO","100M — LAGOS / PORTLAND","10.89","100M PB · 0.148s RT",
         "“The first spike that came with its own force curve. I signed because the data was honest.”"),
        ("DS","DIEGO SALAS","MARATHON — BOGOTÁ / FLAGSTAFF","2:04:51","MARATHON PB · VALENCIA 2026",
         "“My splits at 35k were faster than my 30k splits the year before.”"),
        ("YT","YUKI TANAKA","400M HURDLES — OSAKA","48.20","400MH PB · NATIONAL RECORD",
         "“Ten strides between hurdles instead of eleven. I felt it in the first session.”"),
    ]
    for i,(ini,name,ev,pb,pbl,q) in enumerate(ath):
        x = 0.75 + i*4.04
        avatar(s, x, 2.28, ini)
        tx(s, x+0.7, 2.33, 3.0, 0.3, [{"runs":[
            {"t":name,"font":DISP,"size":15,"color":BONE,"spacing":0.3}]}])
        tx(s, x+0.7, 2.62, 3.0, 0.25, [{"runs":[
            {"t":ev,"font":MONO,"size":8.5,"color":MUTE2,"spacing":0.8}]}])
        tx(s, x, 3.05, 3.74, 0.85, [{"runs":[
            {"t":pb,"font":DISP,"size":40,"color":VOLT}]}])
        tx(s, x, 3.82, 3.74, 0.25, [{"runs":[
            {"t":pbl,"font":MONO,"size":8.5,"color":MUTE,"spacing":1}]}])
        tx(s, x, 4.25, 3.6, 1.6, [{"runs":[
            {"t":q,"font":BODYF,"size":11,"color":MUTE,"italic":True}]}])
    tx(s, 0.95, 6.25, 11.4, 0.4, [{"runs":[
        {"t":"36 SPONSORED ATHLETES · 11 NATIONS · PBs CURRENT AS OF THE 2026 SEASON",
         "font":MONO,"size":9.5,"color":MUTE2,"spacing":1}]}])
    footer(s, 9, n)

    # ---------- S10 CAMPAIGN ----------
    s = S[9]
    mono_tag(s, 6.85, 0.9, 5.5, "09  —  CAMPAIGN STRATEGY", color=VOLT, size=11)
    tx(s, 6.85, 1.28, 6.0, 2.2, [
        {"runs":[{"t":"MEASURED,","size":40,"color":BONE}]},
        {"runs":[{"t":"NOT MARKETED.","size":40,"color":VOLT}]},
    ], line_spacing=0.98)
    tx(s, 6.85, 3.1, 5.75, 1.3, [{"runs":[
        {"t":"A 4-minute film across 14 months of lab sessions, failure tests and starting lines — every on-screen claim backed by telemetry.",
         "font":BODYF,"size":12.5,"color":MUTE}]}])
    yy = 4.35
    for t, d in [("00:45","FORCE-PLATE OPEN — THE CLAIM, TESTED LIVE"),
                 ("02:10","FAILURE REEL — 14 PROTOTYPES THAT DIDN'T SHIP"),
                 ("03:30","RACE DAY — LAGOS · VALENCIA · OSAKA"),
                 ("04:12","CLOSE — 'EVERY NUMBER ON SCREEN IS REAL'")]:
        tx(s, 6.85, yy, 0.75, 0.3, [{"runs":[
            {"t":t,"font":MONO,"size":10.5,"bold":True,"color":VOLT}]}])
        tx(s, 7.7, yy, 4.9, 0.3, [{"runs":[
            {"t":d,"font":MONO,"size":10,"color":MUTE,"spacing":0.6}]}])
        yy += 0.44
    tx(s, 7.05, 6.52, 5.5, 0.4, [{"runs":[
        {"t":"DIR. R. OKAFOR · PORTLAND, LAGOS & OSAKA · $2.1M BUDGET",
         "font":MONO,"size":9,"color":MUTE2,"spacing":0.8}]}])
    footer(s, 10, n)

    # ---------- S11 MARKET MAP ----------
    s = S[10]
    slide_title(s, "10", "MARKET EXPANSION", ["34 COUNTRIES,", "FOUR REGIONS."], accent_rule=False)
    tx(s, 0.75, 6.14, 11.6, 0.6, [{"runs":[
        {"t":"APAC ENTRY SEQUENCE 2027 — JAPAN, KOREA, AUSTRALIA FIRST WAVE; SINGAPORE, TAIWAN, INDIA SECOND WAVE.",
         "font":MONO,"size":10,"color":MUTE,"spacing":0.8}]}])
    footer(s, 11, n)

    # ---------- S12 SUSTAINABILITY ----------
    s = S[11]
    slide_title(s, "11", "SUSTAINABILITY", ["MEASURED HERE TOO."])
    for i,(big,lab) in enumerate([("72%","RECYCLED YARN IN CURRENT AEROKNIT — TARGET 90% BY 2027"),
           ("12,000","PAIRS TAKE-BACK RECYCLED INTO TRACK SURFACES"),
           ("100%","PLASTIC-FREE PACKAGING SINCE 2025"),
           ("9/9","FACTORY PARTNERS AUDITED — RESULTS PUBLISHED")]):
        x = 0.75 + (i%2)*5.99; y = 2.55 + (i//2)*1.7
        tx(s, x, y, 2.4, 0.8, [{"runs":[
            {"t":big,"font":DISP,"size":34,"color":VOLT}]}])
        tx(s, x+2.55, y+0.06, 3.1, 1.2, [{"runs":[
            {"t":lab,"font":MONO,"size":9.5,"color":MUTE,"spacing":0.6}]}])
    tx(s, 0.75, 6.15, 11.6, 0.5, [{"runs":[
        {"t":"“A COMPANY THAT PUBLISHES FORCE CURVES HAS NO EXCUSE TO HIDE ITS FOOTPRINT.” — FOUNDER LETTER, 2025",
         "font":MONO,"size":10,"color":MUTE2,"spacing":0.8}]}])
    footer(s, 12, n)

    # ---------- S13 TEAM & THE ASK ----------
    s = S[12]
    slide_title(s, "12", "TEAM & THE ASK", ["BUILT BY MEASURERS.", "BACKED BY DATA."])
    def person(x, ini, name, role, bio):
        avatar(s, x, 2.18, ini)
        tx(s, x+0.7, 2.23, 4.9, 0.3, [{"runs":[
            {"t":name,"font":DISP,"size":15,"color":BONE,"spacing":0.3}]}])
        tx(s, x+0.7, 2.52, 4.9, 0.25, [{"runs":[
            {"t":role,"font":MONO,"size":8.5,"color":VOLT,"spacing":1}]}])
        tx(s, x, 2.95, 5.5, 1.3, [{"runs":[
            {"t":bio,"font":BODYF,"size":11,"color":MUTE}]}])
    person(0.75, "DO", "DR. DARA OKAFOR", "CO-FOUNDER · CHIEF SCIENCE OFFICER",
           "Biomechanics researcher, 11 years in gait-lab work; led the force-plate program that became KINETIQ's testing standard.")
    person(6.79, "JM", "JONAS MEHTA", "CO-FOUNDER · HEAD OF PERFORMANCE",
           "Sprint coach with two national-record athletes; owns the athlete lab program and every product sign-off.")
    tx(s, 0.95, 4.55, 5.4, 0.3, [{"runs":[
        {"t":"ADVISORS","font":MONO,"size":10,"bold":True,"color":VOLT,"spacing":1.5}]}])
    tx(s, 0.95, 4.9, 5.6, 0.65, [{"runs":[
        {"t":"Dr. Elena Ruiz — Dir. Biomechanics, North Pacific University · M. Webb — 2× Olympian, 1500m · K. Sato — ex-Nike APAC supply",
         "font":BODYF,"size":11,"color":MUTE}]}])
    use = [("60%","APAC MARKET ENTRY — JAPAN, KOREA, AUSTRALIA"),
           ("25%","PORTLAND LAB EXPANSION + 3RD TEST RIG"),
           ("15%","WORKING CAPITAL & INVENTORY BUILD")]
    yy = 4.62
    for k, v in use:
        tx(s, 8.6, yy, 0.8, 0.3, [{"runs":[
            {"t":k,"font":DISP,"size":14,"color":VOLT}]}])
        tx(s, 9.5, yy+0.03, 3.1, 0.45, [{"runs":[
            {"t":v,"font":MONO,"size":8.5,"color":MUTE,"spacing":0.4}]}])
        yy += 0.36
    tx(s, 0.95, 5.74, 4.5, 0.4, [{"runs":[
        {"t":"$40M SERIES C","font":DISP,"size":14,"color":DARK,"spacing":0.5}]}])
    tx(s, 11.2, 5.8, 1.3, 0.4, [{"runs":[
        {"t":"Q3 2026","font":MONO,"size":10,"bold":True,"color":BONE}]}])
    tx(s, 0.95, 6.54, 11.4, 0.4, [{"runs":[
        {"t":"CONTACT — PARTNERS@KINETIQ.EXAMPLE · KINETIQ.EXAMPLE/SERIESC · PORTLAND, OREGON",
         "font":MONO,"size":10,"bold":True,"color":BONE,"spacing":1}]}])
    footer(s, 13, n)

    # ---------- S14 CLOSING ----------
    s = S[13]
    mono_tag(s, 0.75, 2.0, 6.0, "THANK YOU", color=VOLT, size=11)
    tx(s, 0.72, 2.4, 11.9, 2.4, [
        {"runs":[{"t":"MEASURED,","size":54,"color":BONE}]},
        {"runs":[{"t":"NOT MARKETED.","size":54,"color":VOLT}]},
    ], line_spacing=0.98)
    tx(s, 0.75, 4.6, 7.5, 0.8, [{"runs":[
        {"t":"KINETIQ LABS INC. — 2141 NW VAUGHN ST, STE 300, PORTLAND, OR 97210",
         "font":MONO,"size":11,"color":MUTE,"spacing":0.8}]}])
    tx(s, 0.75, 5.0, 7.5, 0.8, [{"runs":[
        {"t":"PARTNERS@KINETIQ.EXAMPLE · KINETIQ.EXAMPLE","font":MONO,"size":11,"bold":True,"color":BONE,"spacing":0.8}]}])
    mono_tag(s, 0.75, 7.02, 6.0, "KINETIQ — SERIES C — 2026", color=MUTE2, size=9)
    mono_tag(s, 11.4, 7.02, 1.2, f"14 / {n}", color=MUTE2, size=9, align=PP_ALIGN.RIGHT)

    # ---------- style tables ----------
    for shp in S[5].shapes:
        if shp.has_table:
            style_table(shp, col_widths=[2.9,1.75,1.75], row_h=0.46, center_cols={1,2})
    for shp in S[7].shapes:
        if shp.has_table:
            style_table(shp, col_widths=[2.7,1.8,1.8,1.8], row_h=0.5, center_cols={1,2,3})
    for shp in S[10].shapes:
        if shp.has_table:
            style_table(shp, col_widths=[2.3,4.0,1.9,1.9], row_h=0.62, center_cols={2,3})

    # ---------- volt chart on traction ----------
    for shp in list(S[6].shapes):
        if shp.has_chart:
            old_left, old_top, old_w, old_h = shp.left, shp.top, shp.width, shp.height
            shp._element.getparent().remove(shp._element)
            cd = CategoryChartData()
            cd.categories = ["2021","2022","2023","2024","2025","2026E"]
            cd.add_series("Revenue ($M)", [18, 31, 52, 84, 125, 210])
            gf = S[6].shapes.add_chart(XL_CHART_TYPE.COLUMN_CLUSTERED,
                                       old_left, old_top, old_w, old_h, cd)
            style_chart(gf.chart, series_colors=(VOLT,), num_fmt='"$"0"M"')
            gf.chart.has_title = False
            ser_el = gf.chart.plots[0].series[0]._element
            dpt = (f'<c:dPt {NS}><c:idx val="5"/><c:invertIfNegative val="0"/><c:bubble3D val="0"/>'
                   f'<c:spPr><a:solidFill><a:srgbClr val="F2F0E9"/></a:solidFill>'
                   f'<a:ln><a:noFill/></a:ln></c:spPr></c:dPt>')
            anchor = ser_el.find(qn('c:invertIfNegative'))
            if anchor is None:
                anchor = ser_el.find(qn('c:spPr'))
            if anchor is not None:
                anchor.addnext(parse_xml(dpt))
            gf.chart.plots[0].series[0].points  # touch to validate

    # ---------- strip default outlines from all autoshapes ----------
    for slide in S:
        for shp in slide.shapes:
            if shp.shape_type is not None and shp.has_text_frame is not None:
                try:
                    if shp.shape_type == 1 or str(shp.shape_type).startswith("AUTO"):
                        shp.line.fill.background()
                        shp.shadow.inherit = False
                except Exception:
                    pass
    # table graphic frames: remove their outer default styling border feel via first-row emphasis is done

    prs.save(out_path)
    print(json.dumps({"ok": True, "out": out_path, "slides": n}))

if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2], sys.argv[3])