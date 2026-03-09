import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// ============================================================
// DATA — Cosmere Planets & Perpendicularity Routes
// ============================================================
const planets = [
   {
      name: "Scadrial", series: "Mistborn", system: "Scadrian",
      hasPerp: true,
      perpNote: "Pits of Hathsin (Ruin's); moved by Harmony after Catacendre. Well-established worldhopper gateway.",
      pos: [-45, 25, 10], color: [0.6, 0.6, 0.68], radius: 2.5
   },
   {
      name: "Roshar", series: "Stormlight Archive", system: "Rosharan",
      hasPerp: true,
      perpNote: "Honor's Perpendicularity (mobile, tied to the Stormfather) and Cultivation's (Horneater Peaks). Major Shadesmar hub.",
      pos: [0, 0, 0], color: [0.15, 0.45, 1.0], radius: 3.0
   },
   {
      name: "Nalthis", series: "Warbreaker", system: "Nalthian",
      hasPerp: true,
      perpNote: "Endowment's Perpendicularity. Location not fully revealed; worldhoppers like Vasher and Vivenna use it regularly.",
      pos: [-20, 50, -5], color: [0.1, 0.8, 0.35], radius: 2.2
   },
   {
      name: "Sel", series: "Elantris", system: "Selish",
      hasPerp: true,
      perpNote: "Devotion & Dominion's Perpendicularities. DANGEROUS: the Dor (Splintered Investiture) makes Shadesmar near Sel extremely hazardous \u2014 a plasma-like storm in the Cognitive Realm.",
      pos: [25, -20, 5], color: [1.0, 0.8, 0.15], radius: 2.3
   },
   {
      name: "Taldain", series: "White Sand", system: "Taldain",
      hasPerp: true,
      perpNote: "Autonomy's Perpendicularity. Autonomy is isolationist and actively restricts access; the perpendicularity may be difficult or impossible to use without her permission.",
      pos: [40, 35, -15], color: [0.95, 0.85, 0.5], radius: 2.0
   },
   {
      name: "Threnody", series: "Shadows for Silence", system: "Threnodite",
      hasPerp: true,
      perpNote: "Ambition was Splintered here by Odium. Remnant perpendicularities exist but are unstable and surrounded by the Shades (cognitive shadows). Extremely dangerous to use.",
      pos: [-55, -25, -30], color: [0.2, 0.32, 0.18], radius: 1.8
   },
   {
      name: "First of the Sun", series: "Sixth of the Dusk", system: "Drominad",
      hasPerp: true,
      perpNote: "Patji's Eye \u2014 a pool of concentrated Investiture on the island of Patji. Confirmed perpendicularity (WOB). The locals are unaware of its cosmere significance.",
      pos: [50, -15, 25], color: [0.0, 0.65, 0.8], radius: 1.8
   },
   {
      name: "Yolen", series: "Dragonsteel", system: "Yolen",
      hasPerp: true,
      perpNote: "Origin world where Adonalsium was Shattered. Perpendicularities likely exist from the original Shattering event. Details remain largely unknown (Dragonsteel unpublished).",
      pos: [-35, -45, 40], color: [0.75, 0.65, 0.95], radius: 2.2
   },
   {
      name: "Braize", series: "Stormlight Archive", system: "Rosharan",
      hasPerp: true,
      perpNote: "Odium's Perpendicularity. Braize served as Odium's prison world; the Fused and Heralds traveled between Braize and Roshar through the Cognitive Realm during Desolations.",
      pos: [4, 4, 3], color: [0.95, 0.15, 0.08], radius: 1.8
   },
   {
      name: "Ashyn", series: "Stormlight Archive", system: "Rosharan",
      hasPerp: false,
      perpNote: "No confirmed perpendicularity. Humans originally lived here before migrating to Roshar. The world was devastated and only floating cities remain. Travel likely requires spaceship.",
      pos: [-4, -3, -3], color: [0.8, 0.72, 0.25], radius: 1.5
   },
   {
      name: "Canticle", series: "The Sunlit Man", system: "Canticle",
      hasPerp: false,
      perpNote: "No confirmed perpendicularity. A distant world with a scorching sun that makes the surface lethal during the day. Nomad (Sigzil) skipped here while fleeing the Night Brigade. The Scadrian research ship 'Silence of Fallen Suns' is embedded in the planet's surface from a previous expedition.",
      pos: [85, -70, -50], color: [0.9, 0.5, 0.15], radius: 2.0
   }
];

const perpRoutesDef = [
   { a: 1, b: 3, weeks: 3 },   // Roshar <-> Sel
   { a: 0, b: 1, weeks: 4 },   // Scadrial <-> Roshar
   { a: 1, b: 2, weeks: 5 },   // Roshar <-> Nalthis
   { a: 0, b: 2, weeks: 6 },   // Scadrial <-> Nalthis
   { a: 2, b: 3, weeks: 7 },   // Nalthis <-> Sel
   { a: 0, b: 3, weeks: 8 },   // Scadrial <-> Sel
   { a: 1, b: 8, weeks: 1 },   // Roshar <-> Braize
   { a: 1, b: 4, weeks: 10 },  // Roshar <-> Taldain
   { a: 0, b: 4, weeks: 12 },  // Scadrial <-> Taldain
   { a: 2, b: 4, weeks: 11 },  // Nalthis <-> Taldain
   { a: 0, b: 5, weeks: 14 },  // Scadrial <-> Threnody
   { a: 1, b: 5, weeks: 12 },  // Roshar <-> Threnody
   { a: 7, b: 5, weeks: 10 },  // Yolen <-> Threnody
   { a: 1, b: 6, weeks: 9 },   // Roshar <-> First/Sun
   { a: 3, b: 6, weeks: 10 },  // Sel <-> First/Sun
   { a: 0, b: 7, weeks: 12 },  // Scadrial <-> Yolen
   { a: 1, b: 7, weeks: 8 },   // Roshar <-> Yolen
   { a: 2, b: 7, weeks: 10 },  // Nalthis <-> Yolen
];

// ============================================================
// STATE
// ============================================================
let edges = [];
let shipSpeed = 10;
let shadesmarScale = 1;
let perpEnabled = true;
let animSpeed = 5;
let traceSpeed = 2;
let startPlanet = 0;
let endPlanet = 3;

// Dijkstra state
let dijkstraSteps = [];
let finalPath = [];
let animating = false;
let pathFound = false;
let pathTracing = false;
let animStep = 0;
let animTimer = 0;
let pulseTimer = 0;
let pathTraceSegment = 0;
let pathTraceTimer = 0;
let currentDist = [];
let currentPrev = [];
let currentVisited = [];
let currentNode = -1;
let relaxedEdges = [];

// ============================================================
// THREE.JS SETUP
// ============================================================
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a12);

// Add subtle starfield
const starGeo = new THREE.BufferGeometry();
const starPositions = [];
for (let i = 0; i < 2000; i++) {
   starPositions.push((Math.random() - 0.5) * 600);
   starPositions.push((Math.random() - 0.5) * 600);
   starPositions.push((Math.random() - 0.5) * 600);
}
starGeo.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3));
const starMat = new THREE.PointsMaterial({ color: 0x444466, size: 0.5, sizeAttenuation: true });
scene.add(new THREE.Points(starGeo, starMat));

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 80, 120);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.getElementById('canvas-container').appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.target.set(0, 0, 0);

// Lighting
scene.add(new THREE.AmbientLight(0x404060, 0.8));
const dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
dirLight.position.set(50, 80, 60);
scene.add(dirLight);
const dirLight2 = new THREE.DirectionalLight(0x6644aa, 0.3);
dirLight2.position.set(-30, -40, -20);
scene.add(dirLight2);

// ============================================================
// PLANET SPHERES
// ============================================================
const planetMeshes = [];
const planetGlows = [];
const sphereGeo = new THREE.SphereGeometry(1, 32, 24);

for (const p of planets) {
   const mat = new THREE.MeshPhongMaterial({
      color: new THREE.Color(p.color[0], p.color[1], p.color[2]),
      emissive: new THREE.Color(p.color[0] * 0.3, p.color[1] * 0.3, p.color[2] * 0.3),
      shininess: 60
   });
   const mesh = new THREE.Mesh(sphereGeo, mat);
   mesh.position.set(p.pos[0], p.pos[1], p.pos[2]);
   mesh.scale.setScalar(p.radius);
   scene.add(mesh);
   planetMeshes.push(mesh);

   // Glow sprite
   const spriteMat = new THREE.SpriteMaterial({
      color: new THREE.Color(p.color[0], p.color[1], p.color[2]),
      transparent: true,
      opacity: 0.15,
      depthWrite: false
   });
   const sprite = new THREE.Sprite(spriteMat);
   sprite.position.copy(mesh.position);
   sprite.scale.setScalar(p.radius * 4);
   scene.add(sprite);
   planetGlows.push(sprite);
}

// ============================================================
// EDGE LINES
// ============================================================
let edgeLineObj = null;   // main graph edges
let pathLineObj = null;   // final path highlight

function buildEdges() {
   edges = [];
   const n = planets.length;

   // Spaceship: fully connected
   for (let a = 0; a < n; a++) {
      for (let b = a + 1; b < n; b++) {
         const dx = planets[a].pos[0] - planets[b].pos[0];
         const dy = planets[a].pos[1] - planets[b].pos[1];
         const dz = planets[a].pos[2] - planets[b].pos[2];
         const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
         edges.push({ from: a, to: b, weight: dist / shipSpeed, isPerp: false, enabled: true });
      }
   }

   // Perpendicularity routes
   for (const pr of perpRoutesDef) {
      const timeYears = (pr.weeks / 52) * shadesmarScale;
      edges.push({ from: pr.a, to: pr.b, weight: timeYears, isPerp: true, enabled: true });
   }
}

function rebuildEdgeGeometry() {
   if (edgeLineObj) { scene.remove(edgeLineObj); edgeLineObj.geometry.dispose(); }

   const positions = [];
   const colors = [];
   const showingPath = pathFound || pathTracing;

   for (const e of edges) {
      if (!e.enabled) continue;
      if (e.isPerp && !perpEnabled) continue;
      if (showingPath) continue; // hide all edges when path is shown

      const pa = planets[e.from].pos;
      const pb = planets[e.to].pos;

      let offX = 0, offY = 0, offZ = 0;
      if (e.isPerp) {
         // Offset perp lines slightly
         const dx = pb[0] - pa[0], dy = pb[1] - pa[1], dz = pb[2] - pa[2];
         const len = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1;
         const nx = dx / len, ny = dy / len, nz = dz / len;
         // cross with up
         let cx = ny * 1 - nz * 0, cy = nz * 0 - nx * 1, cz = nx * 0 - ny * 0;
         const cl = Math.sqrt(cx * cx + cy * cy + cz * cz) || 1;
         offX = (cx / cl) * 1.5; offY = (cy / cl) * 1.5; offZ = (cz / cl) * 1.5;
      }

      positions.push(pa[0] + offX, pa[1] + offY, pa[2] + offZ);
      positions.push(pb[0] + offX, pb[1] + offY, pb[2] + offZ);

      let r, g, b;
      // Check if relaxed in current step
      const isRelaxed = relaxedEdges.some(([a, b2]) =>
         (a === e.from && b2 === e.to) || (a === e.to && b2 === e.from));

      if (isRelaxed) {
         r = 1.0; g = 0.6; b = 0.0; // orange — relaxing
      } else if (animating && currentVisited[e.from] && currentVisited[e.to]) {
         r = 0.1; g = 0.7; b = 0.2; // green — explored
      } else if (e.isPerp) {
         r = 0.35; g = 0.2; b = 0.6; // purple — shadesmar
      } else {
         r = 0.25; g = 0.25; b = 0.3; // gray — default
      }

      colors.push(r, g, b, r, g, b);
   }

   const geo = new THREE.BufferGeometry();
   geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
   geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
   const mat = new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.6 });
   edgeLineObj = new THREE.LineSegments(geo, mat);
   scene.add(edgeLineObj);
}

function rebuildPathGeometry() {
   if (pathLineObj) { scene.remove(pathLineObj); pathLineObj.geometry.dispose(); pathLineObj = null; }
   if (finalPath.length < 2) return;
   if (!pathFound && !pathTracing) return;

   const segsToDraw = pathFound ? finalPath.length - 1 : pathTraceSegment;
   if (segsToDraw <= 0) return;

   const positions = [];
   const colors = [];

   for (let i = 0; i < segsToDraw; i++) {
      const a = finalPath[i], b = finalPath[i + 1];
      const pa = [...planets[a].pos];
      const pb = [...planets[b].pos];

      // Detect if perp was used
      const segTime = currentDist[b] - currentDist[a];
      let usedPerp = false;
      if (perpEnabled) {
         for (const e of edges) {
            if (!e.isPerp) continue;
            if ((e.from === a && e.to === b) || (e.from === b && e.to === a)) {
               if (Math.abs(e.weight - segTime) < 0.01) { usedPerp = true; break; }
            }
         }
      }

      // Offset perp path lines
      if (usedPerp) {
         const dx = pb[0] - pa[0], dy = pb[1] - pa[1], dz = pb[2] - pa[2];
         const len = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1;
         const nx = dx / len, ny = dy / len, nz = dz / len;
         let cx = ny * 1 - nz * 0, cy = nz * 0 - nx * 1, cz = nx * 0 - ny * 0;
         const cl = Math.sqrt(cx * cx + cy * cy + cz * cz) || 1;
         const off = 1.5;
         pa[0] += (cx / cl) * off; pa[1] += (cy / cl) * off; pa[2] += (cz / cl) * off;
         pb[0] += (cx / cl) * off; pb[1] += (cy / cl) * off; pb[2] += (cz / cl) * off;
      }

      positions.push(pa[0], pa[1], pa[2], pb[0], pb[1], pb[2]);

      let r, g, bl;
      if (usedPerp) {
         r = 0.4; g = 0.75; bl = 1.0; // light blue — shadesmar path
      } else {
         r = 0.6; g = 0.0; bl = 0.8;  // dark purple — spaceflight path
      }
      colors.push(r, g, bl, r, g, bl);
   }

   const geo = new THREE.BufferGeometry();
   geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
   geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
   const mat = new THREE.LineBasicMaterial({ vertexColors: true, linewidth: 2, transparent: true, opacity: 1.0 });
   pathLineObj = new THREE.LineSegments(geo, mat);
   scene.add(pathLineObj);
}

// ============================================================
// DIJKSTRA
// ============================================================
function resetDijkstra() {
   animating = false;
   pathFound = false;
   pathTracing = false;
   pathTraceSegment = 0;
   pathTraceTimer = 0;
   animStep = 0;
   animTimer = 0;
   pulseTimer = 0;
   dijkstraSteps = [];
   finalPath = [];
   relaxedEdges = [];
   const n = planets.length;
   currentDist = new Array(n).fill(Infinity);
   currentPrev = new Array(n).fill(-1);
   currentVisited = new Array(n).fill(false);
   currentNode = -1;
   updateStatusUI();
   rebuildEdgeGeometry();
   rebuildPathGeometry();
   updatePlanetVisuals();
}

function runDijkstra() {
   resetDijkstra();
   const n = planets.length;
   const dist = new Array(n).fill(Infinity);
   const prev = new Array(n).fill(-1);
   const visited = new Array(n).fill(false);
   dist[startPlanet] = 0;

   for (let step = 0; step < n; step++) {
      let u = -1, minD = Infinity;
      for (let i = 0; i < n; i++)
         if (!visited[i] && dist[i] < minD) { minD = dist[i]; u = i; }
      if (u === -1) break;
      visited[u] = true;

      if (u === endPlanet) {
         dijkstraSteps.push({
            currentNode: u, dist: [...dist], prev: [...prev], visited: [...visited], relaxedEdges: []
         });
         break;
      }

      const relaxed = [];
      for (const e of edges) {
         if (!e.enabled) continue;
         if (e.isPerp && !perpEnabled) continue;
         let nb = -1;
         if (e.from === u) nb = e.to;
         else if (e.to === u) nb = e.from;
         else continue;
         if (visited[nb]) continue;
         relaxed.push([u, nb]);
         const nd = dist[u] + e.weight;
         if (nd < dist[nb]) { dist[nb] = nd; prev[nb] = u; }
      }

      dijkstraSteps.push({
         currentNode: u, dist: [...dist], prev: [...prev], visited: [...visited], relaxedEdges: relaxed
      });
   }

   // Build final path
   if (dist[endPlanet] < Infinity) {
      let cur = endPlanet;
      while (cur !== -1) { finalPath.push(cur); cur = prev[cur]; }
      finalPath.reverse();
   }

   animating = true;
   animStep = 0;
   animTimer = 0;
   document.getElementById('btn-find').style.display = 'none';
   document.getElementById('btn-skip').style.display = '';
}

// ============================================================
// ANIMATION
// ============================================================
function stepAnimation(dt) {
   pulseTimer += dt;

   if (animating && dijkstraSteps.length > 0) {
      animTimer += dt;
      const stepInterval = 1 / animSpeed;
      if (animTimer >= stepInterval && animStep < dijkstraSteps.length) {
         animTimer -= stepInterval;
         const s = dijkstraSteps[animStep];
         currentDist = s.dist;
         currentPrev = s.prev;
         currentVisited = s.visited;
         currentNode = s.currentNode;
         relaxedEdges = s.relaxedEdges;
         rebuildEdgeGeometry();
         updatePlanetVisuals();
         animStep++;
      }

      if (animStep >= dijkstraSteps.length) {
         animating = false;
         relaxedEdges = [];
         rebuildEdgeGeometry();

         if (finalPath.length > 0) {
            pathTracing = true;
            pathTraceSegment = 0;
            pathTraceTimer = 0;
         } else {
            pathFound = true;
         }
      }
   }

   if (pathTracing && finalPath.length > 0) {
      pathTraceTimer += dt;
      const segInterval = 1 / traceSpeed;
      while (pathTraceTimer >= segInterval && pathTraceSegment < finalPath.length - 1) {
         pathTraceTimer -= segInterval;
         pathTraceSegment++;
      }
      rebuildEdgeGeometry();
      rebuildPathGeometry();

      if (pathTraceSegment >= finalPath.length - 1) {
         pathTracing = false;
         pathFound = true;
      }
   }

   updateStatusUI();
}

function updatePlanetVisuals() {
   for (let i = 0; i < planets.length; i++) {
      const p = planets[i];
      const mesh = planetMeshes[i];
      const glow = planetGlows[i];
      let scale = p.radius;
      let emR = p.color[0] * 0.3, emG = p.color[1] * 0.3, emB = p.color[2] * 0.3;

      // Pulse current node
      if (i === currentNode && animating) {
         const pulse = 1.0 + 0.3 * Math.sin(pulseTimer * 8);
         scale *= pulse;
         emR = 1.0; emG = 1.0; emB = 1.0;
      }

      // Start = green, End = red
      if (i === startPlanet && (animating || pathTracing || pathFound)) {
         emR = 0; emG = 0.8; emB = 0;
      }
      if (i === endPlanet && (animating || pathTracing || pathFound)) {
         emR = 0.8; emG = 0; emB = 0;
      }

      // Visited nodes dimmer during animation
      if (animating && currentVisited[i] && i !== currentNode) {
         emR = p.color[0] * 0.15; emG = p.color[1] * 0.15; emB = p.color[2] * 0.15;
      }

      // Path highlight — golden glow on path nodes
      if ((pathFound || pathTracing) && finalPath.includes(i)) {
         emR = 0.8; emG = 0.6; emB = 1.0;
         scale = p.radius * 1.3;
      }

      mesh.scale.setScalar(scale);
      mesh.material.emissive.setRGB(emR, emG, emB);
      glow.scale.setScalar(scale * 3);
   }
}

// ============================================================
// TIME FORMATTING
// ============================================================
function formatTime(years) {
   if (years < 1 / 52) return (years * 365.25).toFixed(0) + 'd';
   if (years < 1 / 12) return (years * 52).toFixed(1) + 'wk';
   if (years < 1) return (years * 12).toFixed(1) + 'mo';
   return years.toFixed(1) + 'yr';
}

// ============================================================
// UI
// ============================================================
function populateSelects() {
   const startSel = document.getElementById('start-planet');
   const endSel = document.getElementById('end-planet');
   startSel.innerHTML = '';
   endSel.innerHTML = '';
   planets.forEach((p, i) => {
      const opt1 = document.createElement('option');
      opt1.value = i;
      opt1.textContent = p.name + ' (' + p.system + ')' + (p.hasPerp ? ' *' : '');
      startSel.appendChild(opt1);

      const opt2 = opt1.cloneNode(true);
      endSel.appendChild(opt2);
   });
   startSel.value = startPlanet;
   endSel.value = endPlanet;
}

function buildPlanetLegend() {
   const container = document.getElementById('planets-content');
   container.innerHTML = '';
   planets.forEach((p, i) => {
      const row = document.createElement('div');
      row.className = 'planet-legend';
      const dot = document.createElement('div');
      dot.className = 'planet-dot';
      dot.style.background = `rgb(${p.color[0] * 255}, ${p.color[1] * 255}, ${p.color[2] * 255})`;
      row.appendChild(dot);

      let text = p.name;
      if (p.hasPerp) text += ' *';
      text += ` (${p.system})`;
      if (currentDist[i] < Infinity) text += ` [${formatTime(currentDist[i])}]`;
      if (i === startPlanet) text += ' [START]';
      if (i === endPlanet) text += ' [END]';

      const nameSpan = document.createElement('span');
      nameSpan.className = 'planet-name';
      nameSpan.textContent = text;
      row.appendChild(nameSpan);

      // Hover/tap tooltip
      const showTooltip = (ev) => {
         const tt = document.getElementById('tooltip');
         tt.innerHTML = `<h4>${p.name}</h4><span class="series-tag">${p.series} \u2014 ${p.system} system</span><div class="perp-note" style="margin-top:6px">${p.hasPerp ? '\u2728 ' : ''}${p.perpNote}</div>`;
         tt.classList.add('visible');
         const x = ev.clientX || (ev.touches && ev.touches[0] ? ev.touches[0].clientX : 100);
         const y = ev.clientY || (ev.touches && ev.touches[0] ? ev.touches[0].clientY : 100);
         // Position tooltip: prefer left of cursor, but keep on screen
         const ttLeft = Math.max(4, Math.min(x - 290, window.innerWidth - 290));
         tt.style.left = ttLeft + 'px';
         tt.style.top = Math.max(4, y - 20) + 'px';
      };
      const hideTooltip = () => {
         document.getElementById('tooltip').classList.remove('visible');
      };
      row.addEventListener('mouseenter', showTooltip);
      row.addEventListener('mouseleave', hideTooltip);
      row.addEventListener('click', (ev) => {
         const tt = document.getElementById('tooltip');
         if (tt.classList.contains('visible')) { hideTooltip(); }
         else { showTooltip(ev); }
      });

      container.appendChild(row);
   });
   const note = document.createElement('div');
   note.style.cssText = 'font-size:11px; color:#666; margin-top:4px;';
   note.textContent = '* has perpendicularity (hover for lore notes)';
   container.appendChild(note);
}

function buildEdgeToggles() {
   const container = document.getElementById('edge-toggles');
   container.innerHTML = '';

   // Group edges by pair
   const pairs = new Map();
   edges.forEach((e, idx) => {
      const key = Math.min(e.from, e.to) + '-' + Math.max(e.from, e.to);
      if (!pairs.has(key)) pairs.set(key, []);
      pairs.get(key).push({ edge: e, idx });
   });

   for (const [key, group] of pairs) {
      const row = document.createElement('div');
      row.style.cssText = 'display:flex; gap:4px; align-items:center; font-size:11px; margin-bottom:2px;';
      const a = group[0].edge.from, b = group[0].edge.to;
      const label = document.createElement('span');
      label.style.cssText = 'flex:0 0 120px; color:#888; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;';
      label.textContent = planets[a].name.substring(0, 6) + ' \u2194 ' + planets[b].name.substring(0, 6);
      row.appendChild(label);

      for (const { edge, idx } of group) {
         const cb = document.createElement('input');
         cb.type = 'checkbox';
         cb.checked = edge.enabled;
         cb.style.cssText = 'width:auto; margin:0; accent-color:' + (edge.isPerp ? '#7733cc' : '#4488aa');
         cb.title = (edge.isPerp ? 'Shadesmar' : 'Ship') + ': ' + formatTime(edge.weight);
         cb.addEventListener('change', () => {
            edge.enabled = cb.checked;
            resetDijkstra();
         });
         const tag = document.createElement('span');
         tag.textContent = edge.isPerp ? 'P' : 'S';
         tag.style.color = edge.isPerp ? '#9966dd' : '#6688aa';
         row.appendChild(cb);
         row.appendChild(tag);
      }
      container.appendChild(row);
   }
}

function buildRoutesTable() {
   const table = document.getElementById('routes-table');
   const n = planets.length;
   let html = '<tr><th>From \\ To</th>';
   for (let j = 0; j < n; j++) html += `<th>${planets[j].name.substring(0, 5)}</th>`;
   html += '</tr>';

   for (let src = 0; src < n; src++) {
      // Run Dijkstra from src
      const dist = new Array(n).fill(Infinity);
      const vis = new Array(n).fill(false);
      dist[src] = 0;
      for (let step = 0; step < n; step++) {
         let u = -1, mn = Infinity;
         for (let i = 0; i < n; i++)
            if (!vis[i] && dist[i] < mn) { mn = dist[i]; u = i; }
         if (u === -1) break;
         vis[u] = true;
         for (const e of edges) {
            if (!e.enabled) continue;
            if (e.isPerp && !perpEnabled) continue;
            let nb = -1;
            if (e.from === u) nb = e.to;
            else if (e.to === u) nb = e.from;
            else continue;
            if (vis[nb]) continue;
            const nd = dist[u] + e.weight;
            if (nd < dist[nb]) dist[nb] = nd;
         }
      }

      html += `<tr><th>${planets[src].name.substring(0, 5)}</th>`;
      for (let dst = 0; dst < n; dst++) {
         if (src === dst) html += '<td class="self">--</td>';
         else if (dist[dst] < Infinity) html += `<td>${formatTime(dist[dst])}</td>`;
         else html += '<td class="na">N/A</td>';
      }
      html += '</tr>';
   }
   table.innerHTML = html;
}

function updateStatusUI() {
   const status = document.getElementById('anim-status');
   const result = document.getElementById('route-result');
   const btnFind = document.getElementById('btn-find');
   const btnSkip = document.getElementById('btn-skip');

   if (animating) {
      btnFind.style.display = 'none';
      btnSkip.style.display = '';
      const pct = dijkstraSteps.length ? (animStep / dijkstraSteps.length * 100) : 0;
      let nodeText = currentNode >= 0 ? planets[currentNode].name : '...';
      status.innerHTML = `<div class="status exploring">
         <strong>PHASE 1: Dijkstra Exploration</strong><br>
         Step ${animStep} / ${dijkstraSteps.length} \u2014 Visiting: ${nodeText}
         ${relaxedEdges.length ? `<br><span style="color:#ffaa00">Relaxing ${relaxedEdges.length} edges...</span>` : ''}
         <progress value="${pct}" max="100"></progress>
      </div>`;
      result.innerHTML = '';
   } else if (pathTracing) {
      btnFind.style.display = 'none';
      btnSkip.style.display = '';
      const pct = finalPath.length <= 1 ? 100 : (pathTraceSegment / (finalPath.length - 1) * 100);
      status.innerHTML = `<div class="status tracing">
         <strong>PHASE 2: Tracing Optimal Path</strong><br>
         Segment ${pathTraceSegment} / ${finalPath.length - 1}
         <progress value="${pct}" max="100"></progress>
      </div>`;
   } else if (pathFound && finalPath.length > 0) {
      btnFind.style.display = '';
      btnSkip.style.display = 'none';
      status.innerHTML = '';

      // Build route description
      let html = '<div class="route-result"><strong style="color:#44ee44">Route Found!</strong><br>';
      for (let i = 0; i < finalPath.length; i++) {
         if (i > 0) {
            const a = finalPath[i - 1], b = finalPath[i];
            const segTime = currentDist[b] - currentDist[a];
            let usedPerp = false;
            if (perpEnabled) {
               for (const e of edges) {
                  if (!e.isPerp) continue;
                  if ((e.from === a && e.to === b) || (e.from === b && e.to === a))
                     if (Math.abs(e.weight - segTime) < 0.01) { usedPerp = true; break; }
               }
            }
            const cls = usedPerp ? 'shadesmar' : 'ship';
            const lbl = usedPerp ? 'Shadesmar' : 'Ship';
            html += `<span class="hop ${cls}"> \u2192 [${lbl}: ${formatTime(segTime)}] \u2192 </span><br>`;
         }
         html += `<strong>${planets[finalPath[i]].name}</strong>`;
      }
      html += `<div class="total">Total: ${formatTime(currentDist[endPlanet])}</div></div>`;
      result.innerHTML = html;
   } else if (!animating && dijkstraSteps.length > 0 && finalPath.length === 0) {
      btnFind.style.display = '';
      btnSkip.style.display = 'none';
      status.innerHTML = '';
      result.innerHTML = '<div class="status notfound"><strong style="color:#ff4444">No route found!</strong> Try enabling more edges.</div>';
   } else {
      btnFind.style.display = '';
      btnSkip.style.display = 'none';
      status.innerHTML = '';
      result.innerHTML = '';
   }

   buildPlanetLegend();
}

// ============================================================
// COLLAPSIBLES
// ============================================================
document.querySelectorAll('.collapsible').forEach(el => {
   el.addEventListener('click', () => {
      el.classList.toggle('open');
      const content = el.nextElementSibling;
      content.classList.toggle('open');

      // Lazy build routes table
      if (el.id === 'toggle-routes' && content.classList.contains('open')) {
         buildRoutesTable();
      }
   });
});

// ============================================================
// EVENT HANDLERS
// ============================================================
document.getElementById('start-planet').addEventListener('change', (e) => {
   startPlanet = parseInt(e.target.value);
   resetDijkstra();
});
document.getElementById('end-planet').addEventListener('change', (e) => {
   endPlanet = parseInt(e.target.value);
   resetDijkstra();
});

document.getElementById('ship-speed').addEventListener('input', (e) => {
   shipSpeed = parseFloat(e.target.value);
   document.getElementById('ship-speed-val').textContent = shipSpeed.toFixed(1) + ' ly/yr';
   buildEdges();
   buildEdgeToggles();
   resetDijkstra();
});

document.getElementById('shadesmar-scale').addEventListener('input', (e) => {
   shadesmarScale = parseFloat(e.target.value);
   document.getElementById('shadesmar-scale-val').textContent = shadesmarScale.toFixed(1) + 'x';
   buildEdges();
   buildEdgeToggles();
   resetDijkstra();
});

document.getElementById('perp-enabled').addEventListener('change', (e) => {
   perpEnabled = e.target.checked;
   resetDijkstra();
});

document.getElementById('anim-speed').addEventListener('input', (e) => {
   animSpeed = parseFloat(e.target.value);
   document.getElementById('anim-speed-val').textContent = animSpeed.toFixed(2) + ' st/s';
});

document.getElementById('trace-speed').addEventListener('input', (e) => {
   traceSpeed = parseFloat(e.target.value);
   document.getElementById('trace-speed-val').textContent = traceSpeed.toFixed(2) + ' sg/s';
});

document.getElementById('btn-find').addEventListener('click', () => {
   if (startPlanet !== endPlanet) runDijkstra();
});

document.getElementById('btn-reset').addEventListener('click', resetDijkstra);

document.getElementById('btn-skip').addEventListener('click', () => {
   if (animating || pathTracing) {
      animating = false;
      pathTracing = false;
      pathFound = finalPath.length > 0;
      relaxedEdges = [];
      if (dijkstraSteps.length > 0) {
         const s = dijkstraSteps[dijkstraSteps.length - 1];
         currentDist = s.dist;
         currentPrev = s.prev;
         currentVisited = s.visited;
         currentNode = s.currentNode;
      }
      rebuildEdgeGeometry();
      rebuildPathGeometry();
      updatePlanetVisuals();
      updateStatusUI();
   }
});

// Edge toggle buttons
document.getElementById('btn-all-on').addEventListener('click', () => {
   edges.forEach(e => e.enabled = true);
   buildEdgeToggles();
   resetDijkstra();
});
document.getElementById('btn-all-off').addEventListener('click', () => {
   edges.forEach(e => e.enabled = false);
   buildEdgeToggles();
   resetDijkstra();
});
document.getElementById('btn-ship-only').addEventListener('click', () => {
   edges.forEach(e => e.enabled = !e.isPerp);
   buildEdgeToggles();
   resetDijkstra();
});
document.getElementById('btn-perp-only').addEventListener('click', () => {
   edges.forEach(e => e.enabled = e.isPerp);
   buildEdgeToggles();
   resetDijkstra();
});

// Window resize
window.addEventListener('resize', () => {
   camera.aspect = window.innerWidth / window.innerHeight;
   camera.updateProjectionMatrix();
   renderer.setSize(window.innerWidth, window.innerHeight);
   if (typeof handleResize === 'function') handleResize();
});

// ============================================================
// LABELS — HTML overlay for planet names
// ============================================================
const labelContainer = document.createElement('div');
labelContainer.style.cssText = 'position:absolute; top:0; left:0; width:100%; height:100%; pointer-events:none; overflow:hidden; z-index:5;';
document.getElementById('canvas-container').appendChild(labelContainer);

function updateLabels() {
   labelContainer.innerHTML = '';
   const w = window.innerWidth, h = window.innerHeight;
   const mvpMatrix = new THREE.Matrix4();
   mvpMatrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);

   for (let i = 0; i < planets.length; i++) {
      const p = planets[i];
      const pos = new THREE.Vector3(p.pos[0], p.pos[1], p.pos[2] + p.radius + 1.5);
      const projected = pos.clone().applyMatrix4(mvpMatrix);

      if (projected.z < -1 || projected.z > 1) continue; // behind camera or too far

      const sx = (projected.x * 0.5 + 0.5) * w;
      const sy = (1 - (projected.y * 0.5 + 0.5)) * h;

      if (sx < -50 || sx > w + 50 || sy < -50 || sy > h + 50) continue;

      const label = document.createElement('div');
      label.style.cssText = `
         position:absolute;
         left:${sx}px; top:${sy}px;
         transform: translate(-50%, -50%);
         background: rgba(0,0,0,0.7);
         color: white;
         padding: 2px 8px;
         border-radius: 3px;
         font-size: 12px;
         font-family: 'Segoe UI', sans-serif;
         white-space: nowrap;
         display: flex;
         align-items: center;
         gap: 4px;
      `;
      const dot = document.createElement('span');
      dot.style.cssText = `width:8px; height:8px; border-radius:50%; background:rgb(${p.color[0]*255},${p.color[1]*255},${p.color[2]*255}); flex-shrink:0;`;
      label.appendChild(dot);
      const txt = document.createElement('span');
      txt.textContent = p.name + (p.hasPerp ? ' *' : '');
      label.appendChild(txt);
      labelContainer.appendChild(label);
   }

   // ---- Edge time labels at midpoints ----
   const showingPath = pathFound || pathTracing;
   for (const e of edges) {
      if (!e.enabled) continue;
      if (e.isPerp && !perpEnabled) continue;
      if (showingPath) continue; // hide when path is displayed

      const pa = planets[e.from].pos;
      const pb = planets[e.to].pos;
      let mx = (pa[0] + pb[0]) * 0.5;
      let my = (pa[1] + pb[1]) * 0.5;
      let mz = (pa[2] + pb[2]) * 0.5;

      // Offset perp labels so they don't overlap ship labels
      if (e.isPerp) {
         const dx = pb[0] - pa[0], dy = pb[1] - pa[1], dz = pb[2] - pa[2];
         const len = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1;
         const nx = dx / len, ny = dy / len, nz = dz / len;
         let cx = ny * 1 - nz * 0, cy = nz * 0 - nx * 1, cz = nx * 0 - ny * 0;
         const cl = Math.sqrt(cx * cx + cy * cy + cz * cz) || 1;
         mx += (cx / cl) * 2.5; my += (cy / cl) * 2.5; mz += (cz / cl) * 2.5;
      }

      const pos = new THREE.Vector3(mx, my, mz);
      const projected = pos.clone().applyMatrix4(mvpMatrix);
      if (projected.z < -1 || projected.z > 1) continue;

      const sx = (projected.x * 0.5 + 0.5) * w;
      const sy = (1 - (projected.y * 0.5 + 0.5)) * h;
      if (sx < -50 || sx > w + 50 || sy < -50 || sy > h + 50) continue;

      const timeStr = (e.isPerp ? 'P:' : '') + formatTime(e.weight);
      const edgeLabel = document.createElement('div');
      edgeLabel.style.cssText = `
         position:absolute;
         left:${sx}px; top:${sy}px;
         transform: translate(-50%, -50%);
         background: ${e.isPerp ? 'rgba(40,10,80,0.7)' : 'rgba(20,20,20,0.6)'};
         color: ${e.isPerp ? '#b48cff' : '#aaaaaa'};
         padding: 1px 5px;
         border-radius: 2px;
         font-size: 10px;
         font-family: 'Segoe UI', sans-serif;
         white-space: nowrap;
      `;
      edgeLabel.textContent = timeStr;
      labelContainer.appendChild(edgeLabel);
   }
}

// ============================================================
// MOBILE PANEL TOGGLE
// ============================================================
const panel = document.getElementById('panel');
const panelToggle = document.getElementById('panel-toggle');
const panelClose = document.getElementById('panel-close');

panelToggle.addEventListener('click', () => {
   panel.classList.add('open');
   panelToggle.style.display = 'none';
});

panelClose.addEventListener('click', () => {
   panel.classList.remove('open');
   // Re-show toggle after transition
   setTimeout(() => { panelToggle.style.display = ''; }, 300);
});

// On desktop, hide close button; on mobile, panel starts hidden
function handleResize() {
   const isMobile = window.innerWidth <= 768;
   if (!isMobile) {
      panel.classList.remove('open');
      panelToggle.style.display = 'none';
      panelClose.style.display = 'none';
   } else {
      panelClose.style.display = '';
      if (!panel.classList.contains('open')) {
         panelToggle.style.display = '';
      }
   }
}
handleResize();

// ============================================================
// INIT & RENDER LOOP
// ============================================================
buildEdges();
populateSelects();
buildEdgeToggles();
resetDijkstra();

const clock = new THREE.Clock();

function animate() {
   requestAnimationFrame(animate);
   const dt = clock.getDelta();

   if (animating || pathTracing) {
      stepAnimation(dt);
   }

   // Pulse current node continuously
   if (animating) {
      pulseTimer += dt * 0.5; // additional smooth pulse
      updatePlanetVisuals();
   }

   controls.update();
   renderer.render(scene, camera);
   updateLabels();
}

animate();
