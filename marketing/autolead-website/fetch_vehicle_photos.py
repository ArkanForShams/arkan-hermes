#!/usr/bin/env python3
"""Fetch real vehicle photos (by brand+model) from Wikimedia Commons into assets/vehicles/."""
import json, os, sys, urllib.parse, urllib.request

BASE = os.path.expanduser("~/hermes-workspace/marketing/autolead-website/assets/vehicles")
os.makedirs(BASE, exist_ok=True)
UA = {"User-Agent": "AutoLeadSiteBuilder/1.0 (contact: hello@autolead.sa)"}

# search fallbacks per vehicle id
SEARCH = {
 "i10":    ["Hyundai i10 2020 hatchback", "Hyundai Grand i10", "Hyundai i10 IA"],
 "pegas":  ["Kia Pegas", "Kia Pegas sedan"],
 "accent": ["Hyundai Accent 2020", "Hyundai Accent RB sedan", "Hyundai Accent"],
 "yaris":  ["Toyota Yaris sedan 2020", "Toyota Yaris XP150 sedan", "Toyota Yaris sedan"],
 "corolla":["Toyota Corolla E210", "Toyota Corolla 2019 sedan", "Toyota Corolla sedan 2020"],
 "camry":  ["Toyota Camry XV70", "Toyota Camry 2021 sedan", "Toyota Camry 2019"],
 "tucson": ["Hyundai Tucson NX4", "Hyundai Tucson 2021 SUV", "Hyundai Tucson 2022"],
 "prado":  ["Toyota Land Cruiser Prado J150", "Toyota Land Cruiser Prado 2018", "Toyota Land Cruiser Prado"],
 "es":     ["Lexus ES 2019", "Lexus ES XZ10", "Lexus ES 350 2019"],
}

def api(params):
    url = "https://commons.wikimedia.org/w/api.php?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=25) as r:
        return json.load(r)

def search_files(term, limit=6):
    d = api({"action":"query","generator":"search","gsrsearch":term,
             "gsrnamespace":"6","gsrlimit":str(limit),
             "prop":"imageinfo","iiprop":"url|size|extmetadata","iiurlwidth":"1200","format":"json"})
    out = []
    for p in (d.get("query",{}).get("pages",{}) or {}).values():
        ii = (p.get("imageinfo") or [None])[0]
        if not ii: continue
        title = p.get("title","")
        if not title.lower().endswith((".jpg",".jpeg")): continue
        pick = ii.get("thumburl") or ii.get("url")
        out.append(dict(title=title, url=pick,
                        w=ii.get("width",0), h=ii.get("height",0),
                        license=(ii.get("extmetadata",{}).get("LicenseShortName",{}) or {}).get("value",""),
                        artist=re.sub(r'<[^>]+>','',(ii.get("extmetadata",{}).get("Artist",{}) or {}).get("value",""))[:60]))
    return out

import re
results, credits = {}, {}
for vid, terms in SEARCH.items():
    got = None
    for t in terms:
        try:
            cands = [c for c in search_files(t) if c["w"] >= 800 and c["h"] >= 500]
        except Exception as e:
            print(f"  ! search error for {vid} '{t}': {e}"); cands = []
        # prefer landscape, bigger width first
        cands.sort(key=lambda c: -c["w"])
        for c in cands:
            try:
                req = urllib.request.Request(c["url"], headers=UA)
                data = urllib.request.urlopen(req, timeout=30).read()
                if len(data) < 20000: continue  # too small to be a real photo
                with open(f"{BASE}/{vid}.jpg","wb") as f: f.write(data)
                got = c; break
            except Exception as e:
                print(f"  ! download fail {vid}: {e}")
        if got: break
    if got and data:
        results[vid] = dict(title=got["title"], w=got["w"], h=got["h"], kb=len(data)//1024)
        credits[vid] = dict(file=got["title"], license=got["license"], author=got["artist"])
        print(f"OK {vid}: {got['title'][:60]} ({got['w']}x{got['h']}, {len(data)//1024}KB, {got['license']})")
    else:
        print(f"MISS {vid}: no suitable Commons photo")

with open(f"{BASE}/credits.json","w") as f:
    json.dump(credits, f, indent=1, ensure_ascii=False)
print("\nMISSING:", [k for k in SEARCH if k not in results] or "none")