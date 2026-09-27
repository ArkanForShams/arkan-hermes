/* AUTOLEAD 3D SHOWROOM — procedural car models, orbit controls, studio lighting
   Requires three.min.js r128 (CDN). Falls back gracefully if unavailable. */
(function(){
  if (typeof THREE === "undefined") { window.AL3D = null; return; }

  // ---------- materials ----------
  function paint(hex){ return new THREE.MeshStandardMaterial({color:hex, metalness:.65, roughness:.32}); }
  var GLASS = new THREE.MeshStandardMaterial({color:0x0d1117, metalness:.9, roughness:.12});
  var TIRE  = new THREE.MeshStandardMaterial({color:0x141416, roughness:.92});
  var RIM   = new THREE.MeshStandardMaterial({color:0xb9bcc4, metalness:.9, roughness:.25});
  var DARK  = new THREE.MeshStandardMaterial({color:0x1a1b1e, roughness:.7});
  var HEAD  = new THREE.MeshStandardMaterial({color:0xfff6dc, emissive:0xfff3c4, emissiveIntensity:.85});
  var TAIL  = new THREE.MeshStandardMaterial({color:0xe63946, emissive:0xc1272d, emissiveIntensity:.7});

  // ---------- side profiles (x = length m, y = height m) ----------
  var PROFILES = {
    hatch: { pts: [[-1.85,.32],[-1.85,.68],[-.95,.74],[-.55,1.32],[.55,1.36],[1.05,1.05],[1.82,.92],[1.82,.32]],
             W:1.66, wheelR:.30, axF:-1.18, axR:1.22, glass:[[ -0.62,.80 ],[ -0.42,1.24 ],[ .42,1.26 ],[ .78,1.02 ]] },
    sedan: { pts: [[-2.28,.34],[-2.28,.72],[-.60,.78],[-.32,1.28],[.82,1.32],[1.52,1.00],[2.26,.90],[2.26,.34]],
             W:1.78, wheelR:.32, axF:-1.48, axR:1.55, glass:[[-.48,.82],[-.26,1.24],[.74,1.26],[1.22,.98]] },
    suv:   { pts: [[-2.15,.46],[-2.15,.86],[-.50,.92],[-.28,1.62],[1.30,1.64],[1.95,1.10],[2.10,.96],[2.10,.46]],
             W:1.84, wheelR:.38, axF:-1.34, axR:1.42, glass:[[-.40,.94],[-.22,1.56],[1.18,1.58],[1.62,1.10]] },
    luxury:{ pts: [[-2.50,.32],[-2.50,.70],[-.68,.76],[-.36,1.30],[.95,1.34],[1.75,1.02],[2.48,.90],[2.48,.32]],
             W:1.86, wheelR:.33, axF:-1.62, axR:1.66, glass:[[-.55,.84],[-.30,1.26],[.86,1.28],[1.42,1.00]] }
  };

  function extrude(profile, width, mat, bevel){
    var sh = new THREE.Shape();
    var p = profile.pts;
    sh.moveTo(p[0][0], p[0][1]);
    for (var i=1;i<p.length;i++) sh.lineTo(p[i][0], p[i][1]);
    sh.closePath();
    var g = new THREE.ExtrudeGeometry(sh, {depth: width - 2*bevel, bevelEnabled:true, bevelThickness:bevel, bevelSize:bevel, bevelSegments:2, steps:1});
    g.translate(0, 0, -(width)/2 + bevel); // center across z
    var m = new THREE.Mesh(g, mat);
    m.castShadow = true;
    return m;
  }

  function glassFrom(g4, w){
    var sh = new THREE.Shape();
    sh.moveTo(g4[0][0], g4[0][1]);
    for (var i=1;i<4;i++) sh.lineTo(g4[i][0], g4[i][1]);
    sh.closePath();
    var g = new THREE.ExtrudeGeometry(sh, {depth: w, bevelEnabled:false, steps:1});
    g.translate(0,0,-w/2);
    var m = new THREE.Mesh(g, GLASS);
    m.castShadow = true;
    return m;
  }

  function wheel(r, x, z){
    var g = new THREE.Group();
    var tire = new THREE.Mesh(new THREE.CylinderGeometry(r, r, .235, 28), TIRE);
    tire.rotation.x = Math.PI/2; tire.castShadow = true;
    var rim = new THREE.Mesh(new THREE.CylinderGeometry(r*.56, r*.56, .25, 20), RIM);
    rim.rotation.x = Math.PI/2;
    var hub = new THREE.Mesh(new THREE.CylinderGeometry(r*.16, r*.16, .27, 12), DARK);
    hub.rotation.x = Math.PI/2;
    g.add(tire, rim, hub);
    g.position.set(x, r, z);
    return g;
  }

  function buildCar(type, paintHex){
    var P = PROFILES[type] || PROFILES.sedan;
    var car = new THREE.Group();
    var body = extrude(P, P.W, paint(paintHex), .05);
    // glass sits slightly proud of the body
    var gw = P.W + .02;
    var glass = glassFrom(P.glass, gw);
    glass.position.z = 0;
    car.add(body, glass);
    car.add(wheel(P.wheelR, P.axF,  P.W/2 - .02));
    car.add(wheel(P.wheelR, P.axF, -(P.W/2 - .02)));
    car.add(wheel(P.wheelR, P.axR,  P.W/2 - .02));
    car.add(wheel(P.wheelR, P.axR, -(P.W/2 - .02)));
    // lights
    var nose = P.pts[0][0], tailX = P.pts[7][0];
    var hY = P.pts[1][1] - .08;
    var hl1 = new THREE.Mesh(new THREE.BoxGeometry(.06,.11,.34), HEAD); hl1.position.set(nose+.02, hY,  P.W/2-.28);
    var hl2 = hl1.clone(); hl2.position.z = -(P.W/2-.28);
    var tl1 = new THREE.Mesh(new THREE.BoxGeometry(.06,.10,.30), TAIL); tl1.position.set(tailX-.02, hY,  P.W/2-.30);
    var tl2 = tl1.clone(); tl2.position.z = -(P.W/2-.30);
    car.add(hl1, hl2, tl1, tl2);
    // grille
    var gr = new THREE.Mesh(new THREE.BoxGeometry(.05,.16,.62), DARK);
    gr.position.set(nose+.03, hY-.14, 0);
    car.add(gr);
    return car;
  }

  // ---------- showroom ----------
  var PLATFORM_R = 4.1;
  function makeShowroom(container){
    var W = container.clientWidth || 640, H = container.clientHeight || 420;
    var scene = new THREE.Scene();
    var cam = new THREE.PerspectiveCamera(38, W/H, .1, 100);
    cam.position.set(6.2, 2.6, 6.2);

    var ren = new THREE.WebGLRenderer({antialias:true, alpha:true});
    ren.setPixelRatio(Math.min(window.devicePixelRatio||1, 2));
    ren.setSize(W, H);
    ren.shadowMap.enabled = true;
    ren.shadowMap.type = THREE.PCFSoftShadowMap;
    ren.outputEncoding = THREE.sRGBEncoding;
    ren.toneMapping = THREE.ACESFilmicToneMapping;
    ren.toneMappingExposure = 1.05;
    container.appendChild(ren.domElement);

    // lights
    var key = new THREE.DirectionalLight(0xffffff, 1.05);
    key.position.set(5, 8, 4);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    key.shadow.camera.left=-7; key.shadow.camera.right=7;
    key.shadow.camera.top=7; key.shadow.camera.bottom=-7;
    var fill = new THREE.DirectionalLight(0xdfe8ff, .30); fill.position.set(-6, 4, -3);
    var rim  = new THREE.DirectionalLight(0xffffff, .22); rim.position.set(-2, 5, -8);
    var amb  = new THREE.AmbientLight(0xffffff, .42);
    scene.add(key, fill, rim, amb);

    // platform: dark disc + red ring + soft shadow-catcher
    var plat = new THREE.Mesh(
      new THREE.CylinderGeometry(PLATFORM_R, PLATFORM_R, .12, 64),
      new THREE.MeshStandardMaterial({color:0x1a1a1c, metalness:.35, roughness:.6}));
    plat.position.y = -.06;
    plat.receiveShadow = true;
    var ring = new THREE.Mesh(
      new THREE.TorusGeometry(PLATFORM_R-.02, .025, 12, 90),
      new THREE.MeshStandardMaterial({color:0xe63946, emissive:0xc1272d, emissiveIntensity:.55, metalness:.6, roughness:.3}));
    ring.rotation.x = Math.PI/2; ring.position.y = .002;
    var floor = new THREE.Mesh(
      new THREE.CircleGeometry(30, 40),
      new THREE.ShadowMaterial({opacity:.34}));
    floor.rotation.x = -Math.PI/2;
    floor.receiveShadow = true;
    scene.add(plat, ring, floor);

    var car = new THREE.Group();
    scene.add(car);
    function setCar(type, hex){
      while (car.children.length) car.remove(car.children[0]);
      car.add(buildCar(type, hex));
    }

    // hand-rolled orbit (mouse + touch + wheel)
    var st = {theta: .72, phi: 1.12, r: 8.2, tgt: new THREE.Vector3(0,.75,0)};
    var drag = false, px=0, py=0, idle = 0;
    function applyCam(){
      cam.position.set(
        st.tgt.x + st.r*Math.sin(st.phi)*Math.sin(st.theta),
        st.tgt.y + st.r*Math.cos(st.phi),
        st.tgt.z + st.r*Math.sin(st.phi)*Math.cos(st.theta));
      cam.lookAt(st.tgt);
    }
    function down(x,y){ drag=true; px=x; py=y; idle=0; }
    function move(x,y){ if(!drag) return; st.theta -= (x-px)*.006; st.phi = Math.min(1.42, Math.max(.30, st.phi - (y-py)*.005)); px=x; py=y; idle=0; }
    function up(){ drag=false; }
    var el = ren.domElement;
    el.style.touchAction = "none"; el.style.cursor = "grab";
    el.addEventListener("mousedown", function(e){ down(e.clientX, e.clientY); });
    window.addEventListener("mousemove", function(e){ move(e.clientX, e.clientY); });
    window.addEventListener("mouseup", up);
    el.addEventListener("touchstart", function(e){ down(e.touches[0].clientX, e.touches[0].clientY); }, {passive:true});
    el.addEventListener("touchmove", function(e){ move(e.touches[0].clientX, e.touches[0].clientY); }, {passive:true});
    el.addEventListener("touchend", up);
    el.addEventListener("wheel", function(e){ e.preventDefault(); st.r = Math.min(13, Math.max(4.6, st.r + e.deltaY*.004)); idle=0; }, {passive:false});

    var alive = true;
    (function loop(){
      requestAnimationFrame(loop);
      if (!drag){ idle++; if (idle > 160) st.theta += .0026; } // slow turntable when idle
      plat.rotation.y += 0; // static platform; car rotates via orbit
      applyCam();
      ren.render(scene, cam);
    })();

    new ResizeObserver(function(){
      var w2 = container.clientWidth, h2 = container.clientHeight;
      if (!w2 || !h2) return;
      cam.aspect = w2/h2; cam.updateProjectionMatrix();
      ren.setSize(w2, h2);
    }).observe(container);

    setCar("sedan", 0xe63946);
    return { setCar: setCar, camera: cam };
  }

  window.AL3D = { makeShowroom: makeShowroom };
})();