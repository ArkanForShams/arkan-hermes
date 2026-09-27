#!/usr/bin/env python3
"""Create and validate user-local Hermes skills (skill-factory helper).

Create one skill (body read from a markdown file, frontmatter generated
and validated):
  make_skill.py --category pmo --name risk-manager \
      --description "Use for RAID logs, project risk, and escalation." \
      --tags "RAID, Risk, Escalation" --related "program-manager, pmo-advisor" \
      --body-file /tmp/risk-manager.md

Sweep-validate one category or the whole library:
  make_skill.py --check pmo
  make_skill.py --check ALL

Validation rules (hard gates): frontmatter starts at byte 0 and parses as
YAML; description <= 60 chars ending with a period; body contains
When to Use / Procedure / Pitfalls / Verification; file <= 100k chars.
"""
import argparse
import os
import sys
import yaml

MAX_DESC = 60
MAX_BODY = 100_000
REQUIRED_SECTIONS = ["## When to Use", "## Procedure", "## Pitfalls", "## Verification"]
SKILLS_ROOT = os.path.expanduser("~/.hermes/skills")


def fail(msg):
    sys.exit(msg)


def validate_file(path):
    """Exit nonzero with a reason on any violation; return frontmatter dict."""
    content = open(path).read()
    if not content.startswith("---"):
        fail(f"{path}: frontmatter must start at byte 0")
    parts = content.split("---")
    if len(parts) < 3:
        fail(f"{path}: frontmatter not closed")
    try:
        fm = yaml.safe_load(parts[1])
    except Exception as e:
        fail(f"{path}: bad frontmatter YAML: {e}")
    desc = str(fm.get("description", ""))
    if len(desc) > MAX_DESC:
        fail(f"{path}: description {len(desc)} chars > {MAX_DESC}")
    if not desc.endswith("."):
        fail(f"{path}: description must end with a period")
    for section in REQUIRED_SECTIONS:
        if section not in content:
            fail(f"{path}: missing section '{section}'")
    if len(content) > MAX_BODY:
        fail(f"{path}: file over {MAX_BODY} chars")
    return fm


def build(args):
    body = open(args.body_file).read().strip()
    if len(body) > MAX_BODY:
        fail(f"body too large: {len(body)} chars")
    if len(args.description) > MAX_DESC:
        fail(f"description {len(args.description)} chars > {MAX_DESC} — shorten it")
    if not args.description.endswith("."):
        fail("description must end with a period")
    for section in REQUIRED_SECTIONS:
        if section not in body:
            fail(f"body missing section '{section}'")
    d = os.path.join(SKILLS_ROOT, args.category, args.name)
    os.makedirs(d, exist_ok=True)
    fm = (
        f"---\n"
        f"name: {args.name}\n"
        f\"description: {args.description}\"\n" if False else f\"description: \"{args.description}\"\n",
    )
    # (kept simple below — see frontmatter_template)
    frontmatter = frontmatter_template(args)
    path = os.path.join(d, "SKILL.md")
    with open(path, "w") as f:
        f.write(frontmatter + body + "\n")
    validate_file(path)
    print(f"created+validated {args.category}/{args.name}")


def frontmatter_template(args):
    tags = args.tags or ""
    related = args.related or ""
    return (
        f"---\n"
        f"name: {args.name}\n"
        f\"description: \"{args.description}\"\n"
        f"version: 0.1.0\n"
        f"author: ARKAN (for Shams Tabrez), Hermes Agent\n"
        f"license: MIT\n"
        f"platforms: [linux, macos, windows]\n"
        f"metadata:\n"
        f"  hermes:\n"
        f"    tags: [{tags}]\n"
        f"    related_skills: [{related}]\n"
        f"---\n\n"
    )


def sweep(args):
    root = SKILLS_ROOT
    category = None if args.check == "ALL" else args.check
    ok = total = 0
    if category:
        cats = [category]
    else:
        cats = sorted(c for c in os.listdir(root) if os.path.isdir(os.path.join(root, c)))
    for cat in cats:
        cdir = os.path.join(root, cat)
        if not os.path.isdir(cdir):
            fail(f"category not found: {cat}")
        for name in sorted(os.listdir(cdir)):
            p = os.path.join(cdir, name, "SKILL.md")
            if not os.path.isfile(p):
                continue
            total += 1
            try:
                validate_file(p)
                ok += 1
                print(f"OK   {cat}/{name}")
            except SystemExit as e:
                print(f"FAIL {cat}/{name}: {e}")
    print(f"\n{ok}/{total} valid" + (f" in {category}" if category else f" under {root}"))
    sys.exit(0 if ok == total else 1)


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--category", help="skill category dir (e.g. pmo, engineering)")
    ap.add_argument("--name", help="skill name (lowercase, hyphens)")
    ap.add_argument("--description", help='one sentence, <=60 chars, ends with a period')
    ap.add_argument("--tags", default="", help="comma-separated tags")
    ap.add_argument("--related", default="", help="comma-separated existing skill names")
    ap.add_argument("--body-file", help="markdown file with the skill body (## sections)")
    ap.add_argument("--check", nargs="?", const="ALL", default=None,
                    help="sweep-validate: a category name or ALL")
    args = ap.parse_args()
    if args.check:
        sweep(args)
    elif args.name and args.body_file and args.description:
        build(args)
    else:
        ap.print_help()
        sys.exit(2)


if __name__ == "__main__":
    main()
