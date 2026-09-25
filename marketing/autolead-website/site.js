/* AUTOLEAD.SA shared header/footer/logo JS — loaded by every page */
(function(){
  // SVG logo: "A" monogram with road/route motif in gold — MNC mark, no external file needed
  var LOGO = '<svg class="mark" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">'
    + '<rect width="34" height="34" rx="9" fill="url(#alg)"/>'
    + '<defs><linearGradient id="alg" x1="0" y1="0" x2="34" y2="34">'
    + '<stop stop-color="#e0b457"/><stop offset="1" stop-color="#c6953c"/></linearGradient></defs>'
    + '<path d="M10 24L17 9L24 24" stroke="#141414" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" fill="none"/>'
    + '<path d="M13.4 18.6H20.6" stroke="#141414" stroke-width="2.4" stroke-linecap="round"/>'
    + '<circle cx="17" cy="27.6" r="1.7" fill="#141414"/>'
    + '</svg>';

  var NAV = [
    {href:"index.html",       en:"Home",        id:"home"},
    {href:"b2c-plans.html",   en:"Individual",  id:"b2c"},
    {href:"b2b-plans.html",   en:"Corporate",   id:"b2b"},
    {href:"fleet-models.html",en:"Models & Prices", id:"models"},
    {href:"dynamic-pricing.html", en:"Dynamic Pricing", id:"pricing"},
    {href:"contracts-billing.html", en:"Contracts & Billing", id:"contracts"},
    {href:"faq.html",         en:"FAQ",         id:"faq"}
  ];

  function nav(cur){
    var out = "";
    for (var i=0;i<NAV.length;i++){
      var n = NAV[i];
      out += '<a href="'+n.href+'"'+(n.id===cur?' class="on"':'')+'>'+n.en+'</a>';
    }
    return out;
  }

  function render(cur){
    document.querySelectorAll("[data-al-header]").forEach(function(el){
      el.innerHTML =
        '<div class="wrap nav">'
        + '<a class="logo" href="index.html">'+LOGO+'<span>Auto<em>Lead</em>.sa</span></a>'
        + '<nav class="links">'+nav(cur)+'</nav>'
        + '<a class="btn btn-gold btn-sm" href="quote.html">Get a quote</a>'
        + '</div>';
    });
    document.querySelectorAll("[data-al-footer]").forEach(function(el){
      el.innerHTML =
        '<div class="wrap">'
        + '<span>© 2026 AutoLead.sa — Vehicle leasing for individuals &amp; fleets. Prices are draft tariffs pending approval.</span>'
        + '<nav class="f-links">'
        + '<a href="index.html">Home</a><a href="b2c-plans.html">Individual</a><a href="b2b-plans.html">Corporate</a>'
        + '<a href="fleet-models.html">Models</a><a href="dynamic-pricing.html">Dynamic pricing</a><a href="quote.html">Quote</a>'
        + '</nav></div>';
    });
  }

  // expose page id setter: <body data-al-page="b2c">
  var page = document.body.getAttribute("data-al-page") || "home";
  if (document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", function(){ render(page); });
  } else { render(page); }
})();