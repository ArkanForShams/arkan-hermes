#!/usr/bin/env python3
"""Post-process deck-meridian.pptx: textboxes ('texts' key), vertical anchors,
picture z-order lift, outline stripping, table styling."""
import json
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE_TYPE

SPEC = json.load(open("deck-spec.json", encoding="utf-8"))
DECK = "/home/shams/hermes-workspace/missions/mission-03-beverage/deck-meridian.pptx"

prs = Presentation(DECK)
assert len(prs.slides) == len(SPEC["slides"]), (len(prs.slides), len(SPEC["slides"]))

def add_text(slide, t):
    box = slide.shapes.add_textbox(Inches(t["left"]), Inches(t["top"]),
                                   Inches(t["width"]), Inches(t["height"]))
    tf = box.text_frame
    tf.word_wrap = True
    if t.get("anchor") == "middle":
        tf.vertical_anchor = MSO_ANCHOR.MIDDLE
    lines = t["text"].split("\n")
    for i, line in enumerate(lines):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.alignment = PP_ALIGN.CENTER if t.get("align") == "center" else PP_ALIGN.LEFT
        run = p.add_run()
        run.text = line
        f = run.font
        f.name = t.get("font", "Jost")
        f.size = Pt(t.get("size", 14))
        f.color.rgb = RGBColor.from_string(t.get("color", "123234"))
        f.bold = t.get("bold", False)
        if t.get("italic"):
            f.italic = True
        if i == 0 and t.get("spacing"):
            p.space_after = Pt(t["spacing"])
    return box

def style_table(tbl_shape):
    tbl = tbl_shape.table
    for r, row in enumerate(tbl.rows):
        row.height = Inches(0.42)
        for c, cell in enumerate(row.cells):
            for p in cell.text_frame.paragraphs:
                for run in p.runs:
                    run.font.name = "Jost"
                    run.font.size = Pt(11.5)
                    if r == 0:
                        run.font.bold = True
                        run.font.color.rgb = RGBColor.from_string("FFFFFF")
                    else:
                        run.font.color.rgb = RGBColor.from_string("41605F")
            cell.margin_left = Inches(0.1)
            cell.margin_right = Inches(0.1)
            cell.margin_top = Inches(0.02)
            cell.margin_bottom = Inches(0.02)
            cell.vertical_anchor = None
            cell.fill.solid()
            if r == 0:
                cell.fill.fore_color.rgb = RGBColor.from_string("0E4F52")
            elif r % 2 == 1:
                cell.fill.fore_color.rgb = RGBColor.from_string("FFFFFF")
            else:
                cell.fill.fore_color.rgb = RGBColor.from_string("E7F2F1")

n_txt = n_pic = 0
CHART_SERIES_COLORS = ["0E4F52", "F5A623", "7FA982", "2E8C96"]

def style_charts(slide):
    from pptx.chart.data import CategoryChartData
    n = 0
    for shape in slide.shapes:
        if not shape.has_chart:
            continue
        chart = shape.chart
        for i, plot_series in enumerate(chart.plots[0].series):
            pt = plot_series.format
            pt.fill.solid()
            pt.fill.fore_color.rgb = RGBColor.from_string(CHART_SERIES_COLORS[i % len(CHART_SERIES_COLORS)])
            pt.line.color.rgb = RGBColor.from_string(CHART_SERIES_COLORS[i % len(CHART_SERIES_COLORS)])
            pt.line.width = Pt(2.75)
            n += 1
    return n

for slide, sspec in zip(prs.slides, SPEC["slides"]):
    # 1) strip outlines on autoshapes
    for shape in slide.shapes:
        if shape.shape_type == MSO_SHAPE_TYPE.AUTO_SHAPE:
            shape.line.fill.background()
            shape.shadow.inherit = False
    # 2) lift pictures above full-slide background rects (z-order)
    pics = [sp for sp in slide.shapes if sp.shape_type == MSO_SHAPE_TYPE.PICTURE]
    if pics and len(slide.shapes) > len(pics):
        # move each picture element to the end of spTree
        spTree = slide.shapes._spTree
        for pic in pics:
            spTree.remove(pic._element)
            spTree.append(pic._element)
            n_pic += 1
    # 3) add spec textboxes on top
    for t in sspec.get("texts", []):
        add_text(slide, t)
        n_txt += 1
    # 4) style tables + charts
    n_charts = style_charts(slide)
    for shape in slide.shapes:
        if shape.has_table:
            style_table(shape)

prs.save(DECK)
print(f"ok: {n_txt} textboxes, {n_pic} pictures lifted, {n_charts} chart series styled")