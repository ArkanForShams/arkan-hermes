#!/usr/bin/env python3
"""Build vehicle-studio.html: real brand/model photos + transparent pricing."""
import os, json
BASE = os.path.expanduser("~/hermes-workspace/marketing/autolead-website")

VEHICLES = [
 dict(id="i10", name="Hyundai i10", cls="Essential · City Hatch", seg="Compact",
      ar="هيونداي آي 10", img="assets/vehicles/i10.jpg", base=1349,
      specs=dict(engine="1.0L · 67 hp", trans="Automatic", seats="4 adults", bags="2 large + 1 small",
                 fuel="Petrol · ~5.4 L/100km", tech="Bluetooth · USB-C · Rear sensors",
                 safety="2 airbags · ABS · ESC", boot="252 L")),
 dict(id="pegas", name="Kia Pegas", cls="Essential · Compact Sedan", seg="Compact",
      ar="كيا بيغاس", img="assets/vehicles/pegas.jpg", base=1349,
      specs=dict(engine="1.4L · 95 hp", trans="Automatic", seats="5 adults", bags="2 large + 2 small",
                 fuel="Petrol · ~5.8 L/100km", tech="Touchscreen 8\" · CarPlay · Rear camera",
                 safety="2 airbags · ABS · ESC", boot="460 L")),
 dict(id="accent", name="Hyundai Accent", cls="Essential · Compact Sedan", seg="Compact",
      ar="هيونداي أكسنت", img="assets/vehicles/accent.jpg", base=1449,
      specs=dict(engine="1.6L · 123 hp", trans="Automatic", seats="5 adults", bags="2 large + 2 small",
                 fuel="Petrol · ~6.2 L/100km", tech="Touchscreen 8\" · CarPlay · Cruise control",
                 safety="4 airbags · ABS · ESC", boot="458 L")),
 dict(id="yaris", name="Toyota Yaris", cls="Essential · Compact Sedan", seg="Compact",
      ar="تويوتا يارِس", img="assets/vehicles/yaris.jpg", base=1499,
      specs=dict(engine="1.5L · 105 hp", trans="Automatic", seats="5 adults", bags="2 large + 1 small",
                 fuel="Petrol · ~5.9 L/100km", tech="Touchscreen 7\" · CarPlay · Keyless entry",
                 safety="4 airbags · ABS · ESC · Lane alert", boot="452 L")),
 dict(id="corolla", name="Toyota Corolla", cls="Plus · Mid-size Sedan", seg="Mid-size",
      ar="تويوتا كورولا", img="assets/vehicles/corolla.jpg", base=2390,
      specs=dict(engine="1.8L · 139 hp", trans="Automatic CVT", seats="5 adults", bags="3 large",
                 fuel="Petrol · ~6.4 L/100km", tech="9\" display · CarPlay · Adaptive cruise",
                 safety="6 airbags · ESC · Lane keep · Pre-collision", boot="471 L")),
 dict(id="camry", name="Toyota Camry", cls="Plus · Full-size Sedan", seg="Full-size",
      ar="تويوتا كامري", img="assets/vehicles/camry.jpg", base=2790,
      specs=dict(engine="2.5L · 204 hp", trans="Automatic 8-speed", seats="5 adults", bags="3 large",
                 fuel="Petrol · ~7.1 L/100km", tech="9\" display · CarPlay · Wireless charge",
                 safety="8 airbags · ESC · Blind-spot · Pre-collision", boot="524 L")),
 dict(id="tucson", name="Hyundai Tucson", cls="Plus · Compact SUV", seg="SUV",
      ar="هيونداي توسان", img="assets/vehicles/tucson.jpg", base=2890,
      specs=dict(engine="2.0L · 156 hp", trans="Automatic 6-speed", seats="5 adults", bags="3 large",
                 fuel="Petrol · ~8.0 L/100km", tech="10.25\" display · CarPlay · Power tailgate",
                 safety="6 airbags · ESC · Blind-spot · Rear cross alert", boot="616 L")),
 dict(id="prado", name="Toyota Land Cruiser Prado", cls="Premium · Large SUV 4x4", seg="SUV 4x4",
      ar="تويوتا لاند كروزر برادو", img="assets/vehicles/prado.jpg", base=5290,
      specs=dict(engine="4.0L V6 · 275 hp", trans="Automatic 6-speed", seats="7 seats", bags="3 large + roof",
                 fuel="Petrol · ~11.5 L/100km", tech="Crawl control · Multi-terrain · 360° camera",
                 safety="8 airbags · ESC · Pre-collision · Radar cruise", boot="620 L (5-seat mode)")),
 dict(id="es", name="Lexus ES", cls="Premium · Executive Sedan", seg="Luxury",
      ar="لكسس ES", img="assets/vehicles/es.jpg", base=5490,
      specs=dict(engine="3.5L V6 · 300 hp", trans="Automatic 8-speed", seats="5 adults", bags="3 large",
                 fuel="Petrol · ~8.5 L/100km", tech="12.3\" display · Mark Levinson audio · HUD",
                 safety="10 airbags · ESC · Full Lexus Safety System+", boot="454 L")),
]

COLORS = [
 ("linear-gradient(135deg,#e63946,#c1272d)","Signature Red", "none"),
 ("#23252b","Obsidian Black", "grayscale(1) brightness(1.6)"),
 ("#b9bcc4","Titanium Silver", "saturate(.15) brightness(1.15)"),
 ("#eef0f2","Pearl White", "saturate(.25) brightness(1.75) contrast(.85)"),
 ("#2d4a5e","Steel Blue", "sepia(.45) hue-rotate(165deg) saturate(2.2)"),
]

HEAD = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Vehicle Studio — Real Models & Exact Pricing — AutoLead.sa</title>
<meta name="description" content="See every vehicle by brand and model with real photos, full specs, and the exact line-by-line lease calculation.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="styles.css">
<style>
.vstudio{display:grid;grid-template-columns:1.15fr .85fr;gap:26px;align-items:stretch}
.pstage{position:relative;border:1px solid var(--line);border-radius:20px;background:radial-gradient(560px 260px at 50% 112%,rgba(230,57,70,.10),transparent 60%),linear-gradient(180deg,#202227,#17181b);min-height:440px;overflow:hidden;box-shadow:var(--shadow)}
.pstage .carimg{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;padding:34px 20px 46px;transition:filter .35s;z-index:2}
.pstage .floorline{position:absolute;left:8%;right:8%;bottom:38px;height:1px;background:rgba(255,255,255,.14);z-index:1}
.pstage .glow{position:absolute;left:50%;bottom:20px;transform:translateX(-50%);width:72%;height:34px;background:radial-gradient(50% 100% at 50% 100%,rgba(230,57,70,.28),transparent 70%);z-index:1}
.pstage .topbar{position:absolute;top:16px;left:18px;right:18px;display:flex;justify-content:space-between;align-items:flex-start;gap:12px;z-index:4}
.pstage .vname{font-weight:800;font-size:19px;color:#fff;letter-spacing:-.01em}
.pstage .vcls{font-size:12px;color:rgba(255,255,255,.55)}
.pstage .arname{font-size:13px;color:rgba(255,255,255,.4);margin-top:2px}
.pstage .badgeimg{position:absolute;bottom:12px;right:14px;font-size:11px;color:rgba(255,255,255,.35);z-index:4;max-width:46%;text-align:end}
.swatches{position:absolute;top:76px;left:18px;display:flex;flex-direction:column;gap:9px;z-index:4}
.swatch{width:26px;height:26px;border-radius:50%;border:2px solid rgba(255,255,255,.3);cursor:pointer;padding:0}
.swatch.on{border-color:#fff;box-shadow:0 0 0 3px rgba(230,57,70,.55)}
.panel{border:1px solid var(--line);border-radius:20px;background:var(--surface);padding:26px 24px;display:flex;flex-direction:column;gap:18px;box-shadow:var(--shadow)}
.panel .pricebig{font-size:42px;font-weight:800;color:var(--accent-deep);letter-spacing:-.03em;line-height:1}
.panel .pricebig small{font-size:14px;color:var(--muted);font-weight:400}
.specgrid{display:grid;grid-template-columns:1fr 1fr;gap:10px 18px}
.specgrid .sp{font-size:13.5px;color:var(--muted)}
.specgrid .sp b{display:block;color:var(--ink);font-weight:700;font-size:13.5px;margin-top:1px}
.calcrows{border-top:1px solid var(--line);padding-top:14px;display:grid;gap:9px;font-size:14px}
.calcrows .r{display:flex;justify-content:space-between;gap:10px}
.calcrows .r span{color:var(--muted)}
.calcrows .r b{font-weight:700}
.calcrows .r.tot{border-top:1px solid var(--line);padding-top:10px;margin-top:4px}
.calcrows .r.tot b{color:var(--accent-deep);font-size:17px}
.pick{display:flex;gap:8px;flex-wrap:wrap}
.pick button{background:var(--surface);border:1px solid var(--line);color:var(--ink);border-radius:999px;padding:8px 15px;font-family:inherit;font-size:13px;font-weight:700;cursor:pointer}
.pick .on{border-color:var(--accent);color:var(--accent-deep);background:var(--accent-soft)}
@media (max-width:980px){.vstudio{grid-template-columns:1fr}.pstage{min-height:340px}}
</style>
</head>
<body data-al-page="studio">
<header data-al-header></header>
"""

BODY = """
<section class="hero" style="padding:60px 0 48px"><div class="wrap">
  <span class="eyebrow">Vehicle Studio</span>
  <h1>Every brand. Every model.<br><em>Exact math.</em></h1>
  <p class="lead">Browse each vehicle with a real photo, full specification, and the transparent
  calculation behind its monthly price — nothing hidden, nothing rounded away.</p>
</div></section>

<section style="padding-top:10px"><div class="wrap">
  <div class="pick" id="vPick" style="margin-bottom:22px"></div>
  <div class="vstudio">
    <div class="pstage">
      <div class="glow"></div><div class="floorline"></div>
      <div class="topbar"><div><div class="vname" id="sName">—</div><div class="vcls" id="sCls">—</div><div class="arname" id="sAr"></div></div>
      <a class="btn btn-accent btn-sm" href="quote.html">Lease this car</a></div>
      <div class="swatches" id="swatches"></div>
      <img class="carimg" id="carImg" src="" alt="">
      <div class="badgeimg" id="imgCredit"></div>
    </div>
    <div class="panel">
      <div>
        <div style="font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:var(--muted);font-weight:800;margin-bottom:8px">All-inclusive monthly — 15 mo term</div>
        <div class="pricebig"><span id="pMain">—</span> <small>SAR / mo</small></div>
        <div style="font-size:12px;color:var(--muted);margin-top:6px"><span class="draft">DRAFT TARIFF</span> · final price confirmed at reservation</div>
      </div>
      <div class="specgrid" id="specs"></div>
      <div class="calcrows" id="calc"></div>
      <div class="calcrows" id="totals" style="border-top:none;padding-top:0"></div>
    </div>
  </div>
  <p class="note">Vehicle photographs show representative examples of each model — colors, trims and wheels may vary by availability. Paint preview is an approximation.</p>
</div></section>

<section style="border-top:1px solid var(--line)"><div class="wrap">
  <div class="sec-head"><div class="kicker">Full price list</div><h2>Every model, detailed</h2></div>
  <div class="tbl"><table>
  <thead><tr><th>Vehicle</th><th>Segment</th><th>Engine / seats</th><th class="hl">12 mo</th><th>15 mo</th><th>24 mo</th></tr></thead>
  <tbody id="allRows"></tbody></table></div>
  <p class="note">How prices derive: market base × term factor (12: ×1.00 · 15: ×0.96 · 24: ×0.92) · all-inclusive (insurance, maintenance, registration, roadside) · VAT 15% at invoice · <span class="draft">DRAFT TARIFFS</span></p>
</div></section>
"""

SCRIPT_BODY = r"""
(function(){
  var VEHICLES = ALDATA.VEHICLES, COLORS = ALDATA.COLORS;
  var $ = function(id){return document.getElementById(id);};
  var fmt = function(n){return n.toLocaleString("en-US");};
  var cur = 0;

  function price(v, term){
    var f = term==12?1.00:(term==15?0.96:0.92);
    return Math.round(v.base*f/10)*10;
  }
  function calc(v){
    var m15 = price(v,15);
    var ins = Math.round(v.base*0.16), mnt = Math.round(v.base*0.11),
        reg = 90, rsa = 45, net = m15-ins-mnt-reg-rsa;
    var dep = m15>4000?3500:(m15>2000?2000:1500);
    var vat = Math.round(m15*0.15);
    $("pMain").textContent = fmt(m15);
    $("calc").innerHTML =
      '<div class="r"><span>Vehicle net lease (what the car itself costs)</span><b>SAR '+fmt(net)+'</b></div>'
     +'<div class="r"><span>+ Comprehensive insurance</span><b>SAR '+fmt(ins)+'</b></div>'
     +'<div class="r"><span>+ Maintenance &amp; service plan</span><b>SAR '+fmt(mnt)+'</b></div>'
     +'<div class="r"><span>+ Registration &amp; renewal</span><b>SAR '+fmt(reg)+'</b></div>'
     +'<div class="r"><span>+ 24/7 roadside assistance</span><b>SAR '+fmt(rsa)+'</b></div>';
    $("totals").innerHTML =
      '<div class="r tot"><span>Monthly total (before VAT)</span><b>SAR '+fmt(m15)+'</b></div>'
     +'<div class="r"><span>VAT 15% (added at invoice)</span><b>SAR '+fmt(vat)+'</b></div>'
     +'<div class="r"><span>Refundable deposit (one-off)</span><b>SAR '+fmt(dep)+'</b></div>'
     +'<div class="r"><span>Included mileage</span><b>3,500 km/mo</b></div>';
  }
  function specs(v){
    var s = v.specs;
    $("specs").innerHTML =
      '<div class="sp">Engine<b>'+s.engine+'</b></div><div class="sp">Transmission<b>'+s.trans+'</b></div>'
     +'<div class="sp">Seats<b>'+s.seats+'</b></div><div class="sp">Luggage<b>'+s.bags+'</b></div>'
     +'<div class="sp">Fuel<b>'+s.fuel+'</b></div><div class="sp">Boot space<b>'+s.boot+'</b></div>'
     +'<div class="sp" style="grid-column:1/-1">Technology<b>'+s.tech+'</b></div>'
     +'<div class="sp" style="grid-column:1/-1">Safety<b>'+s.safety+'</b></div>';
  }
  function pick(i){
    cur = i;
    var v = VEHICLES[i];
    $("sName").textContent = v.name;
    $("sCls").textContent = v.cls;
    $("sAr").textContent = v.ar;
    $("carImg").src = v.img;
    $("carImg").alt = v.name;
    $("carImg").style.filter = "none";
    calc(v); specs(v);
    document.querySelectorAll("#vPick button").forEach(function(b,j){
      b.classList.toggle("on", j===i);
    });
    document.querySelectorAll(".swatch").forEach(function(s){s.classList.remove("on");});
    document.querySelector(".swatch").classList.add("on");
    var cr = ALDATA.CREDITS[v.id];
    if (cr) $("imgCredit").textContent = "Photo: " + cr.author + " · " + cr.license + " · Wikimedia";
  }
  VEHICLES.forEach(function(v,i){
    var b = document.createElement("button");
    b.textContent = v.name;
    b.onclick = function(){ pick(i); };
    $("vPick").appendChild(b);
  });
  COLORS.forEach(function(c,i){
    var s = document.createElement("button");
    s.className = "swatch"+(i===0?" on":"");
    s.style.background = c[0];
    s.title = c[1];
    s.onclick = function(){
      document.querySelectorAll(".swatch").forEach(function(x){x.classList.remove("on");});
      s.classList.add("on");
      $("carImg").style.filter = c[2];
    };
    $("swatches").appendChild(s);
  });
  $("allRows").innerHTML = VEHICLES.map(function(v){
    var p12=price(v,12), p15=price(v,15), p24=price(v,24);
    var eng = v.specs.engine+'<span class="seg">'+v.specs.seats+'</span>';
    var pr = function(x){return '<span class="pr">SAR '+fmt(x)+'</span>';};
    var thumb = '<img src="'+v.img+'" alt="'+v.name+'" style="width:64px;height:40px;object-fit:cover;border-radius:6px;vertical-align:middle;margin-inline-end:10px">';
    return '<tr><td><div style="display:flex;align-items:center">'+thumb+'<div><b>'+v.name+'</b><span class="seg">'+v.ar+'</span></div></div></td>'
          +'<td>'+v.cls+'</td><td>'+eng+'</td>'
          +'<td>'+pr(p12)+'</td><td>'+pr(p15)+'</td><td>'+pr(p24)+'</td></tr>';
  }).join("");
  pick(0);
})();
"""

credits = json.load(open(os.path.join(BASE, "assets/vehicles/credits.json")))

html = (HEAD + BODY
  + '<script src="site.js"></script>\n'
  + '<script>var ALDATA={VEHICLES:' + json.dumps(VEHICLES, ensure_ascii=False)
  + ',COLORS:' + json.dumps(COLORS, ensure_ascii=False)
  + ',CREDITS:' + json.dumps(credits, ensure_ascii=False)
  + '};\n' + SCRIPT_BODY + "</script>\n</body>\n</html>")

with open(os.path.join(BASE, "vehicle-studio.html"), "w") as f:
    f.write(html)
print("built vehicle-studio.html (real photos):", len(html), "bytes")