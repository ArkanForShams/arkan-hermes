#!/usr/bin/env python3
"""Build all AutoLead.sa v3 pages with shared header/footer."""
import os
BASE = os.path.expanduser("~/hermes-workspace/marketing/autolead-website")

CHECK = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8.5L6.5 12L13 4.5" stroke="#e63946" stroke-width="2" stroke-linecap="round"/></svg>'

HEAD = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{title}</title>
<meta name="description" content="{desc}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="styles.css">
</head>
<body data-al-page="{page}">
<header data-al-header></header>
"""

FOOT = """
<section style="padding-top:0"><div class="wrap"><div class="band">
  <div><h3>Talk to the leasing desk</h3><p>Individual quotes in minutes. Corporate proposals within 48 hours.</p></div>
  <div class="actions"><a class="btn btn-accent" href="quote.html">Get my quote</a>
  <a class="btn btn-ghost" href="mailto:hello@autolead.sa">hello@autolead.sa</a></div>
</div></div></section>
<footer data-al-footer></footer>
<script src="site.js"></script>
</body>
</html>"""

def page(fname, pid, title, desc, body, script=""):
    html = HEAD.format(title=title, desc=desc, page=pid) + body + FOOT
    if script:
        html = html.replace("<script src=\"site.js\"></script>",
                            "<script src=\"site.js\"></script>\n<script>"+script+"</script>")
    with open(os.path.join(BASE, fname), "w") as f:
        f.write(html)
    print("built", fname, len(html), "bytes")

# ============ 1. HOME ============
home = """
<section class="hero"><div class="wrap">
  <span class="eyebrow">Vehicle leasing · Saudi Arabia</span>
  <h1>One monthly payment.<br><em>Everything</em> included.</h1>
  <p class="lead">AutoLead bundles insurance, maintenance, registration and 24/7 roadside
  assistance into one fixed monthly subscription — for individuals and corporate fleets
  across the Kingdom.</p>
  <div class="cta"><a class="btn btn-accent" href="b2c-plans.html">Individual plans</a>
  <a class="btn btn-ghost" href="b2b-plans.html">Corporate fleet solutions</a></div>
  <div class="trust">
    <span class="t"><span class="dot"></span><span><b>Zero</b> down payment</span></span>
    <span class="t"><span class="dot"></span><span><b>Fixed</b> monthly cost</span></span>
    <span class="t"><span class="dot"></span><span><b>Free</b> vehicle swap</span></span>
  </div>
</div></section>

<section class="values"><div class="wrap"><div class="grid4">
  <div class="card"><b>Fixed monthly cost</b><span>One predictable payment — no depreciation, no resale risk.</span></div>
  <div class="card"><b>Fully covered</b><span>Insurance, maintenance, registration — included.</span></div>
  <div class="card"><b>Drive a new car</b><span>Fresh vehicle at the end of every term.</span></div>
  <div class="card"><b>Swap &amp; upgrade</b><span>Move class after your eligible period.</span></div>
</div></div></section>

<section><div class="wrap">
  <div class="sec-head"><div class="kicker">Two ways to lease</div>
  <h2>Individual comfort. Corporate scale.</h2></div>
  <div class="grid2">
    <div class="card" style="padding:34px 32px">
      <div class="kicker">For individuals</div>
      <b style="font-size:22px">Monthly car subscriptions</b>
      <span style="font-size:15px;display:block;margin:10px 0 20px">Three classes, transparent pricing, doorstep delivery.
      From <b style="color:var(--accent);font-size:18px">SAR 1,349</b>/month.</span>
      <a class="btn btn-accent btn-sm" href="b2c-plans.html">Explore individual plans</a>
    </div>
    <div class="card" style="padding:34px 32px">
      <div class="kicker">For business</div>
      <b style="font-size:22px">Full fleet outsourcing</b>
      <span style="font-size:15px;display:block;margin:10px 0 18px">5 to 500+ vehicles, consolidated VAT billing,
      48-hour replacement, dedicated account management.</span>
      <a class="btn btn-ghost btn-sm" href="b2b-plans.html">Explore corporate tiers</a>
    </div>
  </div>
</div></section>

<section style="border-top:1px solid var(--line)"><div class="wrap">
  <div class="sec-head"><div class="kicker">The complete cycle</div>
  <h2>From first quote to final invoice — one flow</h2></div>
  <div class="cycle">
    <div class="c"><span class="n">1</span><b>Quote</b><span>Configure online or with the desk — instant indicative pricing.</span></div>
    <div class="c"><span class="n">2</span><b>Pricing</b><span>Competitive tariff validated against live market data.</span></div>
    <div class="c"><span class="n">3</span><b>Contract</b><span>Digital signature, bilingual EN/AR, same-day activation.</span></div>
    <div class="c"><span class="n">4</span><b>Billing</b><span>Consolidated monthly invoice, VAT-compliant, auto-receipts.</span></div>
  </div>
</div></section>
"""
page("index.html", "home", "AutoLead.sa — Vehicle Leasing for Individuals & Fleets in KSA",
     "Fixed monthly vehicle leasing for individuals and corporate fleets across Saudi Arabia.",
     home)

# ============ 2. B2C PLANS ============
def plan(tier, cls, ex, amt, term, feats, hot=False, btn="Start lease"):
    lis = "".join(f"<li>{CHECK}{f}</li>" for f in feats)
    badge = '<span class="badge">Most popular</span>' if hot else ""
    btnclass = "btn-accent" if hot else "btn-ghost"
    return f"""<article class="plan{' hot' if hot else ''}">{badge}
    <div class="tier">{tier}</div><div class="cls">{cls}</div><div class="example">{ex}</div>
    <div class="price-row"><span class="sar">SAR</span><span class="amt">{amt}</span><span class="per">/mo</span></div>
    <div class="term">{term}</div><ul>{lis}</ul>
    <a class="btn {btnclass}" href="quote.html">{btn}</a></article>"""

b2c = """
<section class="hero" style="padding:64px 0 56px"><div class="wrap">
  <span class="eyebrow">For individuals</span>
  <h1>Monthly subscriptions,<br>built around <em>your drive</em></h1>
  <p class="lead">Every plan includes comprehensive insurance, periodic maintenance, registration
  renewal and 24/7 roadside assistance. The monthly price is all-inclusive — VAT stated separately.</p>
</div></section>

<section><div class="wrap">
  <div class="grid3">
  """ + plan("Essential", "Compact Class", "e.g. Hyundai i10 / Kia Pegas", "1,349",
             "12-month term · 2,500 km/mo included",
             ["Comprehensive insurance","Periodic maintenance & service","Registration & renewal handled",
              "24/7 roadside assistance"]) + \
           plan("Plus", "Mid-size & SUV Class", "e.g. Toyota Camry / Hyundai Tucson", "2,790",
             "15-month term · 3,500 km/mo included",
             ["Everything in Essential","Higher mileage allowance","Free vehicle swap after 9 months",
              "Second driver included","Doorstep delivery & collection"], hot=True, btn="Reserve your car") + \
           plan("Premium", "Luxury Class", "e.g. Lexus ES / BMW 3-series", "5,290",
             "24-month term · 5,000 km/mo included",
             ["Everything in Plus","Luxury & performance models","Concierge maintenance pickup",
              "Guaranteed replacement vehicle","Priority 24/7 support line"]) + """
  </div>
  <p class="note">All prices are <span class="draft">DRAFT TARIFF</span> — final offers confirmed at reservation. Excess mileage SAR 0.55/km. Deposit from SAR 1,500 (refundable).</p>
</div></section>

<section style="border-top:1px solid var(--line)"><div class="wrap">
  <div class="sec-head"><div class="kicker">Contract conditions · B2C</div>
  <h2>Every condition, in plain language</h2></div>
  <div class="tbl"><table>
  <thead><tr><th>Condition</th><th>Essential</th><th class="hl">Plus</th><th>Premium</th></tr></thead>
  <tbody>
    <tr><td>Term options</td><td>12 / 24 mo</td><td>12 / 15 / 24 mo</td><td>24 / 36 mo</td></tr>
    <tr><td>Included mileage / month</td><td>2,500 km</td><td>3,500 km</td><td>5,000 km</td></tr>
    <tr><td>Excess mileage</td><td>SAR 0.60/km</td><td>SAR 0.55/km</td><td>SAR 0.50/km</td></tr>
    <tr><td>Refundable deposit</td><td>SAR 1,500</td><td>SAR 2,000</td><td>SAR 3,500</td></tr>
    <tr><td>Free vehicle swap</td><td>After 12 mo</td><td>After 9 mo</td><td>After 9 mo</td></tr>
    <tr><td>Additional driver</td><td>Not included</td><td>1 included</td><td>2 included</td></tr>
    <tr><td>Doorstep delivery</td><td>Riyadh only</td><td>Riyadh, Jeddah, Dammam</td><td>Nationwide</td></tr>
    <tr><td>Replacement vehicle (repairs &gt; 24h)</td><td>On request</td><td>Included</td><td>Guaranteed</td></tr>
    <tr><td>Early termination</td><td>60-day notice · 10% of remaining term fee</td><td>60-day notice · 7.5% fee</td><td>60-day notice · 5% fee</td></tr>
    <tr><td>Buyout at term end</td><td colspan="3">Optional — market-value buyout quote at month 10, per Shariah-compliant Ijarah structure</td></tr>
    <tr><td>Eligibility</td><td colspan="3">Age 21+, valid KSA license, salary certificate (min SAR 4,000/mo) or 3 months' bank statements</td></tr>
  </tbody></table></div>
  <p class="note">All conditions are draft terms pending legal &amp; Shariah-compliance review.</p>
</div></section>
"""
page("b2c-plans.html", "b2c", "Individual Car Subscription — AutoLead.sa",
     "Monthly all-inclusive car subscription plans for individuals in Saudi Arabia.",
     b2c)

# ============ 3. B2B PLANS ============
b2b = """
<section class="hero" style="padding:64px 0 56px"><div class="wrap">
  <span class="eyebrow">For business</span>
  <h1>Fleet leasing that<br><em>runs itself</em></h1>
  <p class="lead">Outsource company vehicles end-to-end. One contract, one consolidated invoice,
  a fleet that refreshes on schedule — B2B tiers scale from 5 to 500+ vehicles.</p>
</div></section>

<section><div class="wrap">
  <div class="tbl"><table>
  <thead><tr><th>Tier</th><th>Fleet size</th><th class="hl">Per vehicle / mo <span class="draft">DRAFT</span></th><th>Included</th></tr></thead>
  <tbody>
    <tr><td><b>Fleet Starter</b><span class="seg">Essentials for small teams</span></td>
        <td>5–19</td><td><span class="pr">SAR 1,490</span></td>
        <td>Insurance · maintenance · registration · roadside assistance · monthly consolidated invoice</td></tr>
    <tr><td><b>Fleet Pro</b><span class="seg">Managed fleet for growing companies</span></td>
        <td>20–99</td><td><span class="pr">SAR 1,290</span></td>
        <td>+ dedicated account manager · telematics-ready · quarterly utilization reports · fuel-card integration</td></tr>
    <tr><td><b>Enterprise</b><span class="seg">Full outsourcing for large operations</span></td>
        <td>100–500+</td><td><span class="pr">Custom</span></td>
        <td>+ custom SLA · HR-system integration · multi-city coverage · driver management option · dedicated fleet desk</td></tr>
  </tbody></table></div>
</div></section>

<section style="border-top:1px solid var(--line)"><div class="wrap">
  <div class="sec-head"><div class="kicker">Contract conditions · B2B</div>
  <h2>Corporate contract terms, tier by tier</h2></div>
  <div class="tbl"><table>
  <thead><tr><th>Condition</th><th>Fleet Starter</th><th class="hl">Fleet Pro</th><th>Enterprise</th></tr></thead>
  <tbody>
    <tr><td>Contract term</td><td>12 / 24 mo</td><td>24 / 36 mo</td><td>36 / 48 / 60 mo</td></tr>
    <tr><td>Mileage / vehicle / month</td><td>3,000 km</td><td>4,000 km</td><td>Pooled — fleet-level cap</td></tr>
    <tr><td>Billing</td><td>Monthly consolidated invoice</td><td>Monthly consolidated + cost-center split</td><td>Per-department billing, ERP feed</td></tr>
    <tr><td>Payment terms</td><td>Net 15</td><td>Net 30</td><td>Net 30/45 negotiable</td></tr>
    <tr><td>Account management</td><td>Shared desk</td><td>Named account manager</td><td>Dedicated team + quarterly business review</td></tr>
    <tr><td>SLA response</td><td>Best effort</td><td>4 business hours</td><td>1 hour · 24/7</td></tr>
    <tr><td>Replacement vehicle</td><td>72 hours</td><td>48 hours</td><td>24–48 hours nationwide</td></tr>
    <tr><td>Telematics</td><td>Optional add-on</td><td>Included, ready</td><td>Included + custom reports/API</td></tr>
    <tr><td>Fleet refresh cycle</td><td>Per term</td><td>Scheduled rolling</td><td>Programmed multi-wave</td></tr>
    <tr><td>Fleet scaling</td><td>+/- 2 vehicles / quarter</td><td>+/- 10% / quarter</td><td>Flexible bands per contract</td></tr>
    <tr><td>Driver eligibility</td><td colspan="3">Employees with valid KSA license on company authorization; driver-change requests within 48h</td></tr>
    <tr><td>Insurance</td><td colspan="3">Comprehensive fleet policy, zero-excess option available</td></tr>
    <tr><td>Corporate documents</td><td colspan="3">CR, VAT certificate, authorized signatory ID, board resolution (Enterprise)</td></tr>
  </tbody></table></div>
  <p class="note">All conditions are draft terms pending legal review and group procurement alignment.</p>
</div></section>
"""
page("b2b-plans.html", "b2b", "Corporate Fleet Leasing (B2B) — AutoLead.sa",
     "Fleet leasing tiers and corporate contract conditions for Saudi businesses.",
     b2b)

# ============ 4. FLEET MODELS & PRICES ============
def mrow(m, cat, tier, p12, p15, p24, hot=False):
    pr = lambda v: f'<span class="pr">{v}</span>'
    hotmark = ' <span class="draft">POPULAR</span>' if hot else ""
    return (f"<tr><td><b>{m}</b>{hotmark}<span class='seg'>{cat}</span></td>"
            f"<td>{pr(p12)}</td><td>{pr(p15)}</td><td>{pr(p24)}</td></tr>")

rows = "".join([
 mrow("Hyundai i10", "Economy hatchback", "Essential", "SAR 1,349", "SAR 1,279", "SAR 1,199", True),
 mrow("Kia Pegas", "Economy sedan", "Essential", "SAR 1,349", "SAR 1,279", "SAR 1,199", True),
 mrow("Nissan Sunny", "Compact sedan", "Essential", "SAR 1,449", "SAR 1,379", "SAR 1,299"),
 mrow("Hyundai Accent", "Compact sedan", "Essential", "SAR 1,449", "SAR 1,379", "SAR 1,299"),
 mrow("Toyota Yaris", "Compact sedan", "Essential", "SAR 1,499", "SAR 1,419", "SAR 1,339"),
 mrow("Suzuki Baleno", "Spacious hatchback", "Essential", "SAR 1,549", "SAR 1,469", "SAR 1,389"),
 mrow("Toyota Corolla", "Mid-size sedan", "Plus", "SAR 2,390", "SAR 2,270", "SAR 2,149", True),
 mrow("Hyundai Elantra", "Mid-size sedan", "Plus", "SAR 2,390", "SAR 2,270", "SAR 2,149"),
 mrow("Toyota Camry", "Full-size sedan", "Plus", "SAR 2,790", "SAR 2,650", "SAR 2,510", True),
 mrow("Hyundai Sonata", "Full-size sedan", "Plus", "SAR 2,790", "SAR 2,650", "SAR 2,510"),
 mrow("Hyundai Tucson", "Compact SUV", "Plus", "SAR 2,890", "SAR 2,740", "SAR 2,599", True),
 mrow("Toyota RAV4", "Compact SUV", "Plus", "SAR 3,090", "SAR 2,930", "SAR 2,779"),
 mrow("Nissan X-Trail", "Mid-size SUV", "Plus", "SAR 3,290", "SAR 3,120", "SAR 2,959"),
 mrow("Toyota Land Cruiser Prado", "Large SUV / 4x4", "Premium", "SAR 5,290", "SAR 5,020", "SAR 4,749"),
 mrow("Lexus ES", "Executive luxury", "Premium", "SAR 5,490", "SAR 5,210", "SAR 4,929", True),
 mrow("BMW 3 Series", "Performance luxury", "Premium", "SAR 5,690", "SAR 5,399", "SAR 5,119"),
 mrow("Mercedes-Benz C-Class", "Executive luxury", "Premium", "SAR 5,890", "SAR 5,590", "SAR 5,299"),
])

b2c_models = """
<section class="hero" style="padding:64px 0 56px"><div class="wrap">
  <span class="eyebrow">Models &amp; pricing</span>
  <h1>Every model. Every price.<br>No <em>fine print</em>.</h1>
  <p class="lead">Market-anchored tariffs for individual subscriptions. 12 / 15 / 24-month terms,
  all-inclusive: insurance, maintenance, registration, roadside assistance. VAT added at invoice.</p>
</div></section>

<section><div class="wrap">
  <div class="tbl"><table>
  <thead><tr><th>Model</th><th>Class</th><th class="hl">12 mo <span class="draft">DRAFT</span></th><th>15 mo</th><th>24 mo</th></tr></thead>
  <tbody>""" + rows + """</tbody></table></div>
  <p class="note">Benchmarked against live KSA market (SelfDrive KSA, major rental operators, Sep 2026):
  economy floor SAR 1,299–1,449 · mid-size SAR 2,270–2,890 · SUV SAR 2,599–3,290 · luxury SAR 4,749–5,890.
  AutoLead targets the <b>value quartile</b> of each band while including more services than daily-rental competitors.</p>
</div></section>
"""
page("fleet-models.html", "models", "All Models & Pricing — AutoLead.sa",
     "Every lease model and price for individuals and fleets in Saudi Arabia.",
     b2c_models)

# ============ 5. DYNAMIC PRICING ============
def calc_page():
    # model data embedded for the engine
    models = [
        ["Hyundai i10", "compact", 1349], ["Kia Pegas", "compact", 1349],
        ["Nissan Sunny", "compact", 1449], ["Toyota Corolla", "midsize", 2390],
        ["Toyota Camry", "midsize", 2790], ["Hyundai Tucson", "suv", 2890],
        ["Toyota RAV4", "suv", 3090], ["Lexus ES", "luxury", 5490], ["BMW 3 Series", "luxury", 5690],
    ]
    opts = "".join(f'<option value="{m[2]}">{m[0]} — SAR {m[2]:,}</option>' for m in models)
    body = """
<section class="hero" style="padding:64px 0 56px"><div class="wrap">
  <span class="eyebrow">Dynamic pricing engine</span>
  <h1>Market-linked pricing,<br><em>live</em></h1>
  <p class="lead">This calculator prices your configuration using AutoLead's dynamic tariff model —
  anchored to a live KSA market study and adjusted for term, demand season, and volume. The same
  engine backs the quotes our desk issues.</p>
</div></section>

<section><div class="wrap">
  <div class="calc">
    <div class="row">
      <div><label>Vehicle model</label><select id="cModel">""" + opts + """</select></div>
      <div><label>Contract term</label><select id="cTerm">
        <option value="12">12 months</option>
        <option value="15" selected>15 months</option>
        <option value="24">24 months</option>
      </select></div>
    </div>
    <div class="row">
      <div><label>Mileage per month (km)</label><input type="number" id="cKm" value="3000" min="1000" max="8000" step="250"></div>
      <div><label>Season</label><select id="cSeason">
        <option value="1.00">Normal</option>
        <option value="1.12">High demand (Ramadan / Hajj window)</option>
        <option value="0.95">Off-peak promotion</option>
      </select></div>
    </div>
    <div class="row">
      <div><label>Fleet volume (B2B only)</label><select id="cVol">
        <option value="1.00">Individual (1 car)</option>
        <option value="0.96">Corporate 5–19 (−4%)</option>
        <option value="0.92">Corporate 20–99 (−8%)</option>
        <option value="0.88">Enterprise 100+ (−12%)</option>
      </select></div>
      <div><label>Delivery city</label><select id="cCity">
        <option value="0">Riyadh (free)</option>
        <option value="0">Jeddah (free)</option>
        <option value="0">Dammam (free)</option>
        <option value="250">Other city (SAR 250 one-off)</option>
      </select></div>
    </div>
    <div class="calc-result">
      <div>
        <div style="font-size:12.5px;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);font-weight:700;margin-bottom:8px">Your indicative monthly lease</div>
        <div class="big"><span id="cOut">—</span> <small>SAR / month + VAT</small></div>
        <div class="breakdown" id="cBreak"></div>
      </div>
      <a class="btn btn-accent" href="quote.html">Lock this price — request contract</a>
    </div>
  </div>
  <p class="note">Engine logic: base market tariff × term discount (12mo −0% · 15mo −4% · 24mo −8%)
  × mileage factor (3,000 km included; +8% per extra 1,000 km) × demand season × volume. Positioning:
  value quartile vs SelfDrive KSA and major operators (Sep 2026 study). <span class="draft">DRAFT ENGINE</span></p>
</div></section>
"""
    script = """
(function(){
  var $ = function(id){return document.getElementById(id);};
  function fmt(n){return n.toLocaleString("en-US");}
  function calc(){
    var base = parseFloat($("cModel").value);
    var term = parseFloat($("cTerm").value);
    var km   = parseFloat($("cKm").value) || 3000;
    var sea  = parseFloat($("cSeason").value);
    var vol  = parseFloat($("cVol").value);
    var city = parseFloat($("cCity").value);
    var termD = term==12?1.0:term==15?0.96:0.92;
    var kmF = 1 + Math.max(0,(km-3000)/1000)*0.08;
    var m = base*termD*kmF*sea*vol;
    var mR = Math.round(m/10)*10;
    var setup = city;
    var dep = m>4000?3500:(m>2000?2000:1500);
    $("cOut").textContent = fmt(mR);
    $("cBreak").innerHTML =
      '<div class="b"><span>Market base tariff</span><b>SAR '+fmt(base)+'</b></div>'
      +'<div class="b"><span>Term adjustment ('+term+' mo)</span><b>×'+termD.toFixed(2)+'</b></div>'
      +'<div class="b"><span>Mileage factor ('+fmt(km)+' km)</span><b>×'+kmF.toFixed(2)+'</b></div>'
      +'<div class="b"><span>Demand season</span><b>×'+sea.toFixed(2)+'</b></div>'
      +'<div class="b"><span>Volume tier</span><b>×'+vol.toFixed(2)+'</b></div>'
      +'<div class="b"><span>Refundable deposit (one-off)</span><b>SAR '+fmt(dep)+'</b></div>'
      +(city>0?'<div class="b"><span>Delivery outside metro (one-off)</span><b>SAR '+fmt(city)+'</b></div>':'')
      +'<div class="b"><span>VAT (15%) applies at invoice</span><b>—</b></div>';
  }
  ["cModel","cTerm","cKm","cSeason","cVol","cCity"].forEach(function(id){
    $(id).addEventListener("change", calc); $(id).addEventListener("input", calc);
  });
  calc();
})();"""
    page("dynamic-pricing.html", "pricing", "Dynamic Pricing Engine — AutoLead.sa",
         "Live competitive lease pricing based on KSA market study.",
         body, script)
calc_page()

# ============ 6. CONTRACTS & BILLING ============
cb = """
<section class="hero" style="padding:64px 0 56px"><div class="wrap">
  <span class="eyebrow">The complete cycle</span>
  <h1>Quote → Pricing → Contract →<br><em>Billing</em></h1>
  <p class="lead">Every stage, every document, every payment — transparent and standardized
  for both individuals and corporates.</p>
</div></section>

<section><div class="wrap">
  <div class="sec-head"><div class="kicker">Full cycle</div><h2>Six stages, zero friction</h2></div>
  <div class="cycle">
    <div class="c"><span class="n">1</span><b>Quote request</b><span>Online configurator or leasing desk. Individual: instant indicative price. Corporate: RFP acknowledgment within 4 business hours.</span></div>
    <div class="c"><span class="n">2</span><b>Pricing validation</b><span>Dynamic engine prices against market quartile; corporate rates tiered by volume; approval gates above SAR 3,000/mo.</span></div>
    <div class="c"><span class="n">3</span><b>Documents &amp; KYC</b><span>B2C: ID/Iqama, license, salary cert. B2B: CR, VAT cert, signatory ID. Digital submission, same-day verification.</span></div>
    <div class="c"><span class="n">4</span><b>Contract signing</b><span>Bilingual EN/AR agreement, e-signature via SMS/OTP, Shariah-compliant Ijarah structure with optional buyout.</span></div>
    <div class="c"><span class="n">5</span><b>Activation &amp; delivery</b><span>Deposit captured (refundable), vehicle delivered within 72h — serviced, insured, registered.</span></div>
    <div class="c"><span class="n">6</span><b>Monthly billing</b><span>Invoice on the 1st, auto-charged via mada/card (B2C) or bank transfer with Net-15/30 (B2B). VAT-compliant PDF + e-receipt.</span></div>
  </div>
</div></section>

<section style="border-top:1px solid var(--line)"><div class="wrap">
  <div class="sec-head"><div class="kicker">Contract conditions matrix</div>
  <h2>All possible conditions — B2C and B2B</h2></div>
  <div class="tbl"><table>
  <thead><tr><th>Condition</th><th>B2C Individual</th><th class="hl">B2B Corporate</th></tr></thead>
  <tbody>
    <tr><td>Contract types</td><td>Fixed-term Ijarah (12/15/24/36 mo) · optional buyout</td><td>Master Service Agreement + vehicle schedules · per-term or rolling</td></tr>
    <tr><td>Eligibility</td><td>21+, KSA license, salary ≥ SAR 4,000 or 3-mo bank statements</td><td>Valid CR, VAT registration, authorized signatory</td></tr>
    <tr><td>Deposit</td><td>SAR 1,500–3,500 refundable</td><td> waived for Net-30 approved accounts</td></tr>
    <tr><td>Mileage overage</td><td>SAR 0.50–0.60/km by tier</td><td>Pooled fleet cap + negotiated excess</td></tr>
    <tr><td>Early termination</td><td>60-day notice; 5–10% of remaining term</td><td>Volume-based; waiver at Enterprise tier with 90-day notice</td></tr>
    <tr><td>Vehicle swap</td><td>After 9–12 mo, one free per term</td><td>Rolling refresh scheduled per MSA</td></tr>
    <tr><td>Late payment</td><td>Grace 7 days, then service suspension</td><td>Per MSA late-fee schedule; escalation to account manager</td></tr>
    <tr><td>Accidents &amp; claims</td><td>Comprehensive cover; SAR 500 excess; we handle claim admin</td><td>Fleet policy; zero-excess option; dedicated claims desk</td></tr>
    <tr><td>Exterior/interior wear</td><td>Fair-wear-and-tear standard at return</td><td>Condition report per vehicle per quarter</td></tr>
    <tr><td>Traffic fines (Saher)</td><td>Passed through at cost + SAR 50 admin</td><td>Monthly consolidated, at cost, no admin fee (Fleet Pro+)</td></tr>
    <tr><td>Buyout at term end</td><td>Market value, quoted at month N−2</td><td>Fleet-wide buyout or refresh option</td></tr>
    <tr><td>Billing cycle</td><td>1st of month · mada/card auto-charge</td><td>Consolidated invoice · Net 15/30 · cost-center split · ERP export</td></tr>
    <tr><td>Late vehicle return</td><td>Daily rate × 1.5 after 48h grace</td><td>Per MSA schedule</td></tr>
    <tr><td>Geographic limits</td><td>KSA only; GCC travel with prior written approval</td><td>KSA-wide; GCC riders negotiable (Enterprise)</td></tr>
  </tbody></table></div>
</div></section>

<section style="border-top:1px solid var(--line)"><div class="wrap">
  <div class="sec-head"><div class="kicker">Billing &amp; payments</div>
  <h2>How invoicing works</h2></div>
  <div class="grid3">
    <div class="card"><b>B2C — simple and automatic</b><span>Invoice on the 1st · auto-charge on file mada/card · PDF + SMS receipt · grace 7 days · update card anytime in the portal.</span></div>
    <div class="card"><b>B2B — consolidated and auditable</b><span>One VAT invoice for the fleet · optional cost-center split · Net-15/30 bank transfer · monthly reconciliation statement · ERP-ready export.</span></div>
    <div class="card"><b>All contracts</b><span>Shariah-compliant Ijarah structure · VAT 15% stated separately · no hidden fees — every charge in the signed schedule.</span></div>
  </div>
</div></section>
"""
page("contracts-billing.html", "contracts", "Contracts & Billing — Complete Cycle — AutoLead.sa",
     "Full quote, pricing, contract and billing cycle for individuals and corporates.",
     cb)

# ============ 7. QUOTE ============
q = """
<section class="hero" style="padding:64px 0 56px"><div class="wrap">
  <span class="eyebrow">Get started</span>
  <h1>Request your <em>quote</em></h1>
  <p class="lead">Individuals: instant indicative pricing. Corporates: full proposal within 48 hours.
  This form is a prototype — submissions are not yet wired to a backend.</p>
</div></section>
<section><div class="wrap"><div class="calc">
  <div class="row">
    <div><label>I am leasing as</label><select id="qType"><option>Individual (B2C)</option><option>Company (B2B)</option></select></div>
    <div><label>Full name</label><input type="text" placeholder="Your name"></div>
  </div>
  <div class="row">
    <div><label>Mobile</label><input type="tel" placeholder="+966 5X XXX XXXX"></div>
    <div><label>Email</label><input type="email" placeholder="you@example.com"></div>
  </div>
  <div class="row">
    <div><label>Preferred model / class</label><select>
      <option>Compact class</option><option>Mid-size / SUV class</option>
      <option>Luxury class</option><option>Fleet — mixed</option></select></div>
    <div><label>Term</label><select><option>12 months</option><option>15 months</option><option>24 months</option><option>36+ months / custom</option></select></div>
  </div>
  <div class="row" style="grid-template-columns:1fr">
    <div><label>Notes (fleet size, cities, special requirements)</label>
    <input type="text" placeholder="e.g. 25 vehicles for field engineers in Riyadh & Dammam, telematics required"></div>
  </div>
  <div class="calc-result">
    <span style="font-size:13px;color:var(--muted)">By submitting you agree to be contacted about this request. No payment details are collected on this site.</span>
    <button class="btn btn-accent" onclick="alert('Prototype: form backend not yet connected. In production this posts to the leasing CRM.')">Submit request</button>
  </div>
</div></div></section>
"""
page("quote.html", "quote", "Get a Quote — AutoLead.sa", "Request a lease quote.", q)

# ============ 8. FAQ ============
faq = """
<section class="hero" style="padding:64px 0 56px"><div class="wrap">
  <span class="eyebrow">FAQ</span><h1>Questions, <em>answered</em></h1></div></section>
<section><div class="wrap"><div class="faq">
  <details open><summary>What exactly is included in the monthly price?</summary>
  <div class="a">Comprehensive insurance, periodic maintenance at authorized centers, registration and renewal, and 24/7 roadside assistance. Fuel, Salik tolls and traffic fines are separate.</div></details>
  <details><summary>Is this Shariah-compliant?</summary>
  <div class="a">Yes — contracts follow the Ijarah (lease) structure reviewed for compliance, with an optional ownership transfer (buyout) at term end. Final fiqh review is completed with our Shariah board before launch.</div></details>
  <details><summary>What happens if the car breaks down?</summary>
  <div class="a">Call the 24/7 line. B2C Plus/Premium and all B2B tiers include a replacement vehicle (48h; 24–48h nationwide for Enterprise). Essential includes recovery and repair.</div></details>
  <details><summary>Can I end the lease early?</summary>
  <div class="a">Yes — 60-day notice with an early-termination fee of 5–10% of the remaining term depending on tier. Full schedule is in your contract.</div></details>
  <details><summary>How is dynamic pricing calculated?</summary>
  <div class="a">A market-study base tariff (benchmarked monthly against KSA operators) is adjusted by term, mileage allowance, demand season and volume. See the Dynamic Pricing page for the live engine.</div></details>
  <details><summary>How do corporate invoices work?</summary>
  <div class="a">One consolidated VAT invoice per month for the whole fleet, with optional cost-center split and Net-15/30 payment terms. Enterprise adds ERP export and quarterly reconciliation.</div></details>
  <details><summary>Which documents do I need?</summary>
  <div class="a">Individuals: ID/Iqama, valid KSA driving license, salary certificate (or 3 months' bank statements). Corporates: CR, VAT certificate, authorized signatory ID.</div></details>
  <details><summary>Are the prices on this site final?</summary>
  <div class="a">This is a pre-launch prototype — all tariffs are draft values pending management approval and are clearly flagged as such.</div></details>
</div></div></section>
"""
page("faq.html", "faq", "FAQ — AutoLead.sa", "Frequently asked questions about leasing with AutoLead.sa.", faq)

print("\nALL PAGES BUILT")