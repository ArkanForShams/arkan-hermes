#!/usr/bin/env python3
"""Contact-sheet a deck's rendered slide PNGs into one grid image for one-shot vision QA.

Usage:
    python3 make_contact_sheet.py <render_dir> <out.jpg> [--cols 4] [--max 14] [--width 480]

Sorts slides numerically regardless of naming (Slide1.PNG, slide01.png, slide_2.png...).
Prints the output path, slide count, and sheet dimensions.
"""
import argparse
import os
import re

from PIL import Image


def slide_key(name):
    m = re.search(r"(\d+)", name)
    return int(m.group(1)) if m else 10**9


def main():
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("render_dir", help="directory of rendered slide PNGs")
    ap.add_argument("out", help="output contact-sheet path (.jpg)")
    ap.add_argument("--cols", type=int, default=4)
    ap.add_argument("--max", type=int, default=14, help="max slides on the sheet")
    ap.add_argument("--width", type=int, default=480, help="per-cell width in px")
    a = ap.parse_args()

    files = sorted(
        (f for f in os.listdir(a.render_dir) if f.lower().endswith((".png", ".jpg"))),
        key=slide_key,
    )[: a.max]
    if not files:
        raise SystemExit(f"no slide images found in {a.render_dir}")

    imgs = [Image.open(os.path.join(a.render_dir, f)) for f in files]
    w = a.width
    h = int(w * imgs[0].height / imgs[0].width)
    cols = min(a.cols, len(imgs))
    rows = (len(imgs) + cols - 1) // cols
    pad = 8
    sheet = Image.new("RGB", (cols * w + (cols + 1) * pad, rows * h + (rows + 1) * pad), "#333333")
    for i, im in enumerate(imgs):
        r, c = divmod(i, cols)
        sheet.paste(im.resize((w, h)), (pad + c * (w + pad), pad + r * (h + pad)))
    sheet.save(a.out, quality=88)
    print(f"{a.out}: {len(imgs)} slides, {sheet.width}x{sheet.height}")


if __name__ == "__main__":
    main()
