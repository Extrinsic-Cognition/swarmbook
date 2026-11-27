// Shared goals among a crowd of people. Illustrative interests, not a live matcher.
// The lenses illustrate matching, shared ventures, a governed spatial wiki, and the cost of intelligence with sharing on.
// No personal traces are loaded, compared, scored, stored, or sent.
import {createArrivalScene} from './ecology-arrival.js?v=uneven-growth-1';
import {createFundingScene} from './ecology-funding.js?v=reciprocal-exchange-1';
import {createWikiScene, drawCivicSeal} from './ecology-wiki.js?v=growing-knowledge-1';
import {createCostScene} from './ecology-cost.js?v=collective-cost-1';

const $ = id => document.getElementById(id);
const NS = 'http://www.w3.org/2000/svg';
const make = (tag, attrs = {}) => {
  const el = document.createElementNS(NS, tag);
  for (const [key, value] of Object.entries(attrs)) el.setAttribute(key, value);
  return el;
};
// The wall's mesh, drawn only when its viewport changes.
const mesh = $('mesh'), ctx = mesh.getContext('2d');
function drawMesh() {
  const dpr = Math.min(devicePixelRatio || 1, 2);
  mesh.width = innerWidth * dpr; mesh.height = innerHeight * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  const r = 44, dx = r * Math.sqrt(3), dy = r * 1.5;
  ctx.strokeStyle = 'rgba(196,185,162,0.35)'; ctx.lineWidth = 1;
  for (let row = -1; row * dy < innerHeight + r; row++) {
    for (let col = -1; col * dx < innerWidth + r; col++) {
      const x = col * dx + (row % 2 ? dx / 2 : 0), y = row * dy;
      ctx.beginPath();
      for (let k = 0; k < 6; k++) {
        const a = Math.PI / 6 + k * Math.PI / 3;
        const px = x + r * Math.cos(a), py = y + r * Math.sin(a);
        k ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
      }
      ctx.closePath(); ctx.stroke();
    }
  }
}

// Distinct lightcones meet across a crowd; the other lenses retain their own scenes.
const lenses = [
  'Many lives. A rare shared direction.',
  'Money one way. Useful work the other. Knowledge stays.',
  'Knowledge builds on knowledge. Each culture signs in its own name.',
  'Messaging: SwarmClock over iroh. Governance and settlement: Poleis on Solana.',
];
const modes = [
  {key: 'matching', title: 'Find people to build with.', intro: 'Each person carries a lightcone of interests and passions. Shared directions emerge where they meet.'},
  {key: 'funding', title: 'Shared goals become ventures.', intro: 'Swarms fund one another and build on each other’s work. Money moves one way. Useful work moves back.'},
  {key: 'memory', title: 'Shared knowledge.', intro: 'Swarms combine shared knowledge into new work, and sign it with their own seals.'},
  {key: 'cost', title: 'Compute once. Reuse the trace.', intro: 'Users and businesses build on the same accumulated work. Sharing traces lowers the collective cost of serving their demand.'},
];
// Use identical markup for the visible caption and its sizing copy so the credit's
// links, emphasis and wrapping cannot move the page when a lens changes.
function writeCaption(element, index) {
  element.replaceChildren();
  if (index !== 3) { element.textContent = lenses[index]; return; }
  const credit = document.createElement('span'); credit.className = 'protocol-credit';
  const name = document.createElement('strong'); name.textContent = 'SwarmClock';
  const iroh = document.createElement('a');
  iroh.href = 'https://www.iroh.computer/'; iroh.target = '_blank'; iroh.rel = 'noopener'; iroh.textContent = 'iroh';
  credit.append('Messaging: ', name, ' over ', iroh, '.');
  const foundation = document.createElement('span'); foundation.className = 'protocol-foundation';
  foundation.textContent = 'Governance and settlement: Poleis on Solana.';
  element.append(credit, foundation);
}

// Every scene's copy participates in the same grid track, even when not visible.
// This reserves its real wrapped height without guessed pixel heights, clipping or a resize on every click.
const copyHero = document.querySelector('.hero');
const copyCaption = document.querySelector('.lens-caption-stack');
for (const [index, mode] of modes.entries()) {
  const heading = document.createElement('div');
  const title = document.createElement('h2'); title.textContent = mode.title;
  heading.append(title);
  const intro = document.createElement('p'); intro.textContent = mode.intro;
  const caption = document.createElement('p'); writeCaption(caption, index);
  for (const sizing of [heading, intro, caption]) {
    sizing.className = 'scene-sizer'; sizing.setAttribute('aria-hidden', 'true'); sizing.inert = true;
  }
  copyHero.append(heading, intro); copyCaption.append(caption);
}

const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const narrow = matchMedia('(max-width: 620px)');
const plate = $('compatibility'), scene = $('horizons');
const funding = createFundingScene($('funding-canvas'));
const memory = createWikiScene($('memory-canvas'));
const cost = createCostScene($('cost-canvas'));
let activeLens = 0;
const buttons = [...document.querySelectorAll('.lenses button[data-lens]')];
const lensGroup = document.querySelector('.lenses');
function selectLens(index, byUser) {
  const enteringVenture = index === 1 && (activeLens !== 1 || byUser);
  const enteringCost = index === 3 && (activeLens !== 3 || byUser);
  activeLens = index;
  const mode = modes[index];
  plate.dataset.lens = mode.key;
  scene.style.display = mode.key === 'matching' ? '' : 'none';
  $('funding-canvas').hidden = $('funding-notes').hidden = mode.key !== 'funding';
  $('memory-canvas').hidden = $('memory-notes').hidden = mode.key !== 'memory';
  $('cost-canvas').hidden = $('cost-notes').hidden = mode.key !== 'cost';
  $('matching-title').textContent = mode.title;
  $('scene-intro').textContent = mode.intro;
  if (mode.key === 'funding') { if (enteringVenture) funding.restart?.(elapsed); funding.resize(narrow.matches); }
  if (mode.key === 'memory') memory.resize(narrow.matches);
  if (mode.key === 'cost') { if (enteringCost) cost.restart(elapsed); cost.resize(narrow.matches); }
  lensGroup.style.setProperty('--dwell', `${dwellFor(index)}ms`);
  renderActive();
  buttons.forEach(other => other.setAttribute('aria-pressed', String(other === buttons[index])));
  // the ride's own changes are not announced: a reader would hear a new caption every few seconds
  $('lens-caption').setAttribute('aria-live', byUser ? 'polite' : 'off');
  writeCaption($('lens-caption'), index);
}
buttons.forEach(button => button.addEventListener('click', () => {
  selectLens(Number(button.dataset.lens), true);
  holdRide();
}));

let inspectedKnowledge = -1, detailKey = '';
function showKnowledge(details, focus = false) {
  const panel = $('memory-inspector');
  panel.hidden = !details;
  if (!details) { detailKey = ''; return; }
  const key = JSON.stringify(details);
  if (key !== detailKey) {
    detailKey = key;
    $('memory-pointer').textContent = details.pointer;
    $('memory-source').textContent = details.sources.map(source => `${source.id} · ${source.span}`).join(' / ');
    $('memory-detail-title').textContent = details.status;
    $('memory-parents').replaceChildren();
    $('memory-ancestry').hidden = !details.parents.length;
    for (const parent of details.parents) {
      const item = document.createElement('li'), link = document.createElement('button');
      link.type = 'button'; link.textContent = parent.pointer;
      link.addEventListener('click', () => {showKnowledge(memory.select(parent.id), true); holdRide(); renderActive();});
      item.append(link); $('memory-parents').append(item);
    }
    $('memory-endorsers').replaceChildren();
    for (const endorsement of details.approvals) {
      const item = document.createElement('li'), icon = document.createElement('canvas');
      icon.width = icon.height = 64; icon.style.width = icon.style.height = '32px'; icon.setAttribute('aria-hidden', 'true');
      drawCivicSeal(icon.getContext('2d'), endorsement.culture, 32, 32, 26);
      const body = document.createElement('span'), history = document.createElement('small');
      body.append(endorsement.culture.name);
      history.textContent = `${endorsement.members.length} members signed together · ${endorsement.priorApprovals} earlier endorsements`;
      body.append(history); item.append(icon, body); $('memory-endorsers').append(item);
    }
    if (!details.approvals.length) {
      const item = document.createElement('li'); item.textContent = 'Awaiting collective seals'; $('memory-endorsers').append(item);
    }
  }
  if (focus) $('memory-close').focus({preventScroll:true});
}
function closeKnowledge() { memory.select(null); showKnowledge(null); }
function nextKnowledge() {
  const entries = memory.available();
  inspectedKnowledge = (inspectedKnowledge + 1) % entries.length;
  showKnowledge(memory.select(entries[inspectedKnowledge]), true);
  holdRide(); renderActive();
}
$('memory-canvas').addEventListener('click', event => {
  const rect = event.currentTarget.getBoundingClientRect();
  const details = memory.inspect(event.clientX - rect.left, event.clientY - rect.top);
  if (details) inspectedKnowledge = memory.available().indexOf(details.id);
  showKnowledge(details, !!details); holdRide(); renderActive();
});
$('memory-canvas').addEventListener('keydown', event => {
  if (event.key === 'Enter' || event.key === ' ') {event.preventDefault(); nextKnowledge();}
});
$('memory-next').addEventListener('click', nextKnowledge);
$('memory-close').addEventListener('click', () => {closeKnowledge(); buttons[2].focus({preventScroll:true}); renderActive();});
$('memory-inspector').addEventListener('keydown', event => {
  if (event.key === 'Escape') {event.preventDefault(); closeKnowledge(); buttons[2].focus({preventScroll:true}); renderActive();}
});

// The ride: the four lenses cycle on their own, so the page moves while the visitor reads.
// A click on a lens holds the ride for a while, then it resumes from wherever the visitor left it. The ride stops
// with the animation loop: offscreen, hidden tab, reduced motion.
const DWELL = 9000, HOLD = 24000, COST_DWELL = 12000;
const dwellFor = index => index === 3 ? COST_DWELL : DWELL;
let rideId = null, holdUntil = 0;
lensGroup.style.setProperty('--dwell', `${DWELL}ms`);
function rideStep() {
  rideId = null;
  if (!visible || document.hidden || disposed || reduced.matches) { lensGroup.dataset.riding = 'false'; return; }
  if (!$('memory-inspector').hidden && activeLens === 2) { rideId = setTimeout(rideStep, DWELL); return; }
  if (Date.now() < holdUntil) { rideId = setTimeout(rideStep, holdUntil - Date.now()); return; }
  selectLens((activeLens + 1) % modes.length, false);
  lensGroup.dataset.riding = 'true';
  rideId = setTimeout(rideStep, dwellFor(activeLens));
}
function ride() {
  if (rideId !== null || !visible || document.hidden || disposed || reduced.matches) return;
  lensGroup.dataset.riding = Date.now() < holdUntil ? 'false' : 'true';
  rideId = setTimeout(rideStep, Math.max(dwellFor(activeLens), holdUntil - Date.now()));
}
function holdRide() {
  holdUntil = Date.now() + (activeLens === 3 ? COST_DWELL : HOLD);
  if (rideId !== null) clearTimeout(rideId);
  rideId = null;
  lensGroup.dataset.riding = 'false';
  ride();
}
function rideStop() { if (rideId !== null) clearTimeout(rideId); rideId = null; lensGroup.dataset.riding = 'false'; }

// A fixed directed acyclic graph: each edge goes to a later generation.
// Layout and shared destinations are illustrative, never compatibility scores.
const lerp = (a, b, t) => a + (b - a) * t;
let visible = false, disposed = false, frameId = null, lastTime = 0, elapsed = 0, shapeAt = -1, paintedAt = -100, geometry;   // shapeAt: the clock of the cones' last outline (THE MOTION IS CHEAP)
let graph, travellers = [], cages = [], liveGeometry = [];
let backgroundCones = [];
// Ring sections are the cage's spatial grid, not edges in the history graph.
// Only DAG edges carry travelling events. Noise deforms space, never causality.
function smoothNoise(t, seed) {
  const i = Math.floor(t), u = t - i, ease = u*u*u*(u*(u*6 - 15) + 10);
  const value = n => { const x = Math.sin(n * 127.1 + seed * 311.7) * 43758.5453; return (x - Math.floor(x)) * 2 - 1; };
  return lerp(value(i), value(i + 1), ease);
}
function movingCone(base, side, seconds) {
  const phase = side * 2.4;
  return {...base,
    top: base.top + base.radius * (.15 * Math.sin(seconds * .16 + phase) + .045 * smoothNoise(seconds / 7, 11 + side)),
    height: base.height + 12 * Math.sin(seconds * .12 + phase + .7) + 3 * smoothNoise(seconds / 9, 31 + side),
    radius: base.radius * (1 + .085 * Math.sin(seconds * .19 + phase + 1) + .025 * smoothNoise(seconds / 8, 51 + side)),
    depth: .29 + .025 * Math.sin(seconds * .13 + phase),
    twist: (side ? -.1 : .1) + .16 * Math.sin(seconds * .11 + phase) + .04 * smoothNoise(seconds / 10, 71 + side),
  };
}
function coords(p) { return `${p.x.toFixed(2)} ${p.y.toFixed(2)}`; }
function linePath(points) { return points.map((p, i) => `${i ? 'L' : 'M'}${coords(p)}`).join(''); }
function ringPoint(g, t, angle) {
  const r = g.radius * Math.pow(t, .78);
  return {x: lerp(g.base, g.top, t) + r * Math.cos(angle), y: lerp(g.bottom, g.height, t) + r * g.depth * Math.sin(angle)};
}
function silhouette(g) {
  // Follow the same bowed generators as the cage, so the gold intersection
  // stays attached to its actual moving outline rather than a separate triangle.
  const left = Array.from({length: 25}, (_, i) => ringPoint(g, i / 24, Math.PI));
  const right = Array.from({length: 25}, (_, i) => ringPoint(g, 1 - i / 24, 0));
  return linePath(left) + `A${g.radius} ${g.radius * g.depth} 0 0 1 ${coords(right[0])}` +
    right.slice(1).map(p => `L${coords(p)}`).join('') + 'Z';
}
function createCage(side, group = $(side ? 'cage-b' : 'cage-a')) {
  group.replaceChildren();
  const rings = [.18, .34, .51, .69, .85, 1].map(t => {
    const back = make('path', {class: 'contour back'}), front = make('path', {class: 'contour front'});
    group.append(back, front); return {t, back, front};
  });
  const meridians = Array.from({length: 7}, (_, j) => {
    const path = make('path', {class: 'meridian'}); group.append(path);
    return {path, angle: j * Math.PI * 2 / 7};
  });
  return {rings, meridians};
}
function renderCage(cage, g) {
  for (const {t, front, back} of cage.rings) {
    const r = g.radius * Math.pow(t, .78), x = lerp(g.base, g.top, t), y = lerp(g.bottom, g.height, t);
    back.setAttribute('d', `M${x-r} ${y}A${r} ${r*g.depth} 0 0 1 ${x+r} ${y}`);
    front.setAttribute('d', `M${x+r} ${y}A${r} ${r*g.depth} 0 0 1 ${x-r} ${y}`);
  }
  for (const {path, angle} of cage.meridians) {
    path.setAttribute('d', linePath(Array.from({length: 25}, (_, k) => ringPoint(g, k / 24, angle + g.twist + k / 24 * .28))));
  }
}
function pointOn(edge, t) {
  const u = 1 - t, {from: a, to: b, c, d} = edge;
  return {x: u*u*u*a.x + 3*u*u*t*c.x + 3*u*t*t*d.x + t*t*t*b.x,
    y: u*u*u*a.y + 3*u*u*t*c.y + 3*u*t*t*d.y + t*t*t*b.y};
}
function addNode(id, rank, x, y, side) {
  const node = {id, rank, x, y, side}; graph.nodes.set(id, node); return node;
}
function addEdge(from, to, group, className = 'branch') {
  // Enforce the causal direction as data, independently of the drawing.
  if (to.rank <= from.rank || to.y >= from.y) throw new Error('A trace edge must move forward');
  const c = {x: lerp(from.x, to.x, .16), y: lerp(from.y, to.y, .36)};
  const d = {x: lerp(from.x, to.x, .84), y: lerp(from.y, to.y, .68)};
  const edge = {from, to, c, d};
  edge.path = make('path', {class: className,
    d: `M${from.x} ${from.y}C${c.x} ${c.y} ${d.x} ${d.y} ${to.x} ${to.y}`});
  group.append(edge.path); graph.edges.push(edge); return edge;
}
function buildGeometry() {
  const mobile = narrow.matches, width = mobile ? 600 : 1000, height = mobile ? 710 : 650;
  scene.setAttribute('viewBox', `0 0 ${width} ${height}`);
  const bottom = mobile ? 545 : 500, top = mobile ? 202 : 170;
  geometry = [0, 1].map(side => ({
    base: width * (side ? .79 : .21), bottom, height: top,
    top: width * (side ? .56 : .44), radius: width * (mobile ? .26 : .215), depth: .29, twist: 0,
  }));
  graph = {nodes: new Map(), edges: [], routes: []};
  $('travellers').replaceChildren(); $('shared-paths').replaceChildren();
  cages = [0, 1].map(side => createCage(side));
  buildBackground(width, height, mobile);
  const families = geometry.map((g, side) => {
    const name = side ? 'b' : 'a', wires = $(`wires-${name}`), traces = $(`traces-${name}`);
    wires.replaceChildren(); traces.replaceChildren();
    $(`surface-${name}`).setAttribute('d', silhouette(g));
    $(`clip-${name}-path`).setAttribute('d', silhouette(g));
    $(`seed-${name}`).setAttribute('transform', `translate(${g.base} ${bottom})`);
    $(side ? 'their-label' : 'your-label').style.top = `${(bottom + 36) / height * 100}%`; $('compatibility').dataset.drawn = '';
    const root = addNode(`${name}-origin`, 0, g.base, bottom, side), history = [];
    for (let j = 0; j < 6; j++) {
      const x = g.base + (j - 2.5) * (mobile ? 17 : 23), y = height - 14 - (j % 3) * 10;
      const node = addNode(`${name}-history-${j}`, -1, x, y, side);
      history.push(addEdge(node, root, traces, 'trace'));
      if (j % 2 === 0) traces.append(make('path', {class: 'trace-mark', d: `M${x - 3} ${y - 17}h6v6h-6Z`}));
    }
    const levels = [[root]], edges = [];
    // The graph keeps its identities while its coordinates follow the cage.
    for (const [rank, count, t] of [[1, 3, .27], [2, 6, .60], [3, 12, 1]]) {
      const nodes = [], incoming = [];
      for (let j = 0; j < count; j++) {
        const spread = (j / (count - 1) * 2 - 1) * .92;
        const x = lerp(g.base, g.top, t) + g.radius * t * spread;
        const depth = Math.sqrt(1 - spread * spread);
        const y = lerp(bottom, top, t) + g.radius * t * .24 * depth;
        const node = addNode(`${name}-${rank}-${j}`, rank, x, y, side);
        node.layout = {t, spread};
        const parent = levels[rank - 1][rank === 1 ? 0 : Math.floor(j / 2)];
        const edge = addEdge(parent, node, wires);
        nodes.push(node); incoming.push(edge);
        node.mark = make('circle', {class: rank === 3 ? 'branch-tip' : 'junction', cx: x, cy: y, r: rank === 3 ? 1.3 : 1.8});
        wires.append(node.mark);
        // Small static arrowheads make direction readable without motion.
        if (rank === 2) {
          const p = pointOn(edge, .65), q = pointOn(edge, .66);
          const angle = Math.atan2(q.y - p.y, q.x - p.x) * 180 / Math.PI;
          edge.arrow = make('path', {class: 'direction', d: 'M-4 -2L0 0L-4 2', transform: `translate(${p.x} ${p.y}) rotate(${angle})`});
          wires.append(edge.arrow);
        }
      }
      levels.push(nodes); edges.push(incoming);
    }
    return {levels, edges, history};
  });
  // Two independent histories may converge on a later shared possibility.
  // Shared nodes have no outgoing edge back into either history.
  const shared = $('shared-paths');
  const joins = [0, 1, 2].map(j => {
    const x = width * (.46 + j * .04), y = top + 3 + Math.abs(j - 1) * 10;
    const node = addNode(`shared-${j}`, 4, x, y, null);
    node.joint = j; node.mark = make('circle', {class: 'shared-junction', cx: x, cy: y, r: 2.8});
    shared.append(node.mark);
    return families.map((family, side) => addEdge(family.levels[2][side ? j : 3 + j], node, shared, 'branch shared-branch'));
  });
  families.forEach((family, side) => {
    // Each mark follows a real root-to-leaf route through the same edge data.
    for (let lane = 0; lane < 3; lane++) {
      const leaf = [1, 5, 10][lane], middle = Math.floor(leaf / 2), first = Math.floor(middle / 2);
      const route = [family.history[lane * 2], family.edges[0][first], family.edges[1][middle], family.edges[2][leaf]];
      graph.routes.push({side, lane, edges: route});
    }
    const middle = side ? 1 : 4, first = Math.floor(middle / 2);
    graph.routes.push({side, lane: 3, edges: [family.history[3], family.edges[0][first], family.edges[1][middle], joins[1][side]]});
  });
  travellers = graph.routes.map(route => {
    const dot = make('circle', {class: 'traveller', r: route.lane === 3 ? 3 : 2.3});
    $('travellers').append(dot); return {...route, dot};
  });
  renderShape(); renderFlow();
}
function renderShape() {
  if (!geometry) return;
  const seconds = reduced.matches ? 0 : elapsed / 1000;
  renderBackground(seconds);
  liveGeometry = geometry.map((g, side) => movingCone(g, side, seconds));
  liveGeometry.forEach((g, side) => {
    const name = side ? 'b' : 'a', outline = silhouette(g);
    $(`surface-${name}`).setAttribute('d', outline);
    $(`clip-${name}-path`).setAttribute('d', outline);
    if (side === 0) $('overlap').setAttribute('d', outline);
    renderCage(cages[side], g);
  });
  for (const node of graph.nodes.values()) {
    if (node.layout) {
      const {t, spread} = node.layout, g = liveGeometry[node.side];
      const r = g.radius * Math.pow(t, .78);
      node.x = lerp(g.base, g.top, t) + r * spread;
      node.y = lerp(g.bottom, g.height, t) + r * g.depth * Math.sqrt(1 - spread * spread);
    } else if (node.joint !== undefined) {
      const [a, b] = liveGeometry;
      const left = Math.max(a.top - a.radius * .72, b.top - b.radius * .72);
      const right = Math.min(a.top + a.radius * .72, b.top + b.radius * .72);
      node.x = lerp(left, right, .35 + node.joint * .15);
      node.y = (a.height + b.height) / 2 + 3 + Math.abs(node.joint - 1) * 10;
    }
    if (node.mark) { node.mark.setAttribute('cx', node.x); node.mark.setAttribute('cy', node.y); }
  }
  for (const edge of graph.edges) {
    const {from, to} = edge;
    edge.c.x = lerp(from.x, to.x, .16); edge.c.y = lerp(from.y, to.y, .36);
    edge.d.x = lerp(from.x, to.x, .84); edge.d.y = lerp(from.y, to.y, .68);
    edge.path.setAttribute('d', `M${coords(from)}C${coords(edge.c)} ${coords(edge.d)} ${coords(to)}`);
    if (edge.arrow) {
      const p = pointOn(edge, .65), q = pointOn(edge, .66);
      edge.arrow.setAttribute('transform', `translate(${p.x} ${p.y}) rotate(${Math.atan2(q.y-p.y, q.x-p.x) * 180 / Math.PI})`);
    }
  }
}
const FLIGHT = 18000, REST = 4500;
function eventProgress(time, offset) {
  const phase = (time + offset) % (FLIGHT + REST);
  if (phase >= FLIGHT) return null;
  return phase / FLIGHT;
}
function renderFlow() {
  for (const {side, lane, edges, dot} of travellers) {
    // A completed event disappears. After a quiet gap a new event is born;
    // there is no reverse traversal, return edge, or visible reset stroke.
    const t = eventProgress(elapsed, side * 2300 + lane * 4900);
    if (t === null) { dot.style.opacity = 0; continue; }
    const at = t * edges.length, edge = edges[Math.min(edges.length - 1, Math.floor(at))];
    const p = pointOn(edge, at % 1);
    dot.setAttribute('cx', p.x); dot.setAttribute('cy', p.y);
    dot.style.opacity = Math.min(1, t * 14, (1 - t) * 14) * .9;
  }
}
// Extra lives share the original cage and noise implementation. They are a
// separate depth layer: no new matcher, substitute motion or foreground camera.
function buildBackground(width, height, mobile) {
  const layer = $('background-cones'); layer.replaceChildren();
  const placements = [
    [.06, .35, .092, .06, .095, .65], [.22, .255, .135, .06, .077, .48],
    [.41, .235, .37, .035, .068, .40], [.61, .27, .65, .065, .084, .48],
    [.84, .29, .91, .075, .088, .54], [.955, .405, .94, .16, .087, .64],
    [.06, .67, .035, .42, .10, .64], [.95, .72, .96, .45, .095, .64],
  ];
  backgroundCones = placements.map(([base,bottom,top,head,radius,opacity],i) => {
    const group = make('g', {class:'background-cone',opacity});
    const grid = make('g'), surface = make('path', {class:'background-surface'});
    const origin = make('circle', {class:'background-origin',cx:base*width,cy:bottom*height,r:mobile?3:4});
    const mark = make('circle', {class:'background-traveller',r:1.7});
    group.append(surface,grid,origin,mark); layer.append(group);
    return {base:{base:base*width,bottom:bottom*height,top:top*width,height:head*height,radius:radius*width,depth:.29,twist:0},
      seed:i+2, cage:createCage(i+2,grid), surface, mark};
  });
}
function renderBackground(seconds) {
  for (const item of backgroundCones) {
    const live = movingCone(item.base,item.seed,seconds);
    item.surface.setAttribute('d',silhouette(live));
    renderCage(item.cage,live);
    const progress = eventProgress(seconds*1000,item.seed*3100);
    if (reduced.matches || progress === null) {item.mark.style.opacity=0;continue;}
    const p = ringPoint(live,progress,item.seed*.7+live.twist+progress*.28);
    item.mark.setAttribute('cx',p.x);item.mark.setAttribute('cy',p.y);
    item.mark.style.opacity=Math.min(1,progress*12,(1-progress)*12)*.75;
  }
}

function renderActive() {
  if (activeLens === 1) funding.render(elapsed, reduced.matches);
  else if (activeLens === 2) { memory.render(elapsed, reduced.matches); if (memory.details()) showKnowledge(memory.details()); }
  else if (activeLens === 3) cost.render(elapsed, reduced.matches);
  else { if (shapeAt < 0 || elapsed === shapeAt || elapsed - shapeAt >= 66) { renderShape(); shapeAt = elapsed; } renderFlow(); }   // THE MOTION IS CHEAP (Nov 26 2026, his "Keep it, make it cheap"): the cones drift on 30 to 60 s sines, their outlines redrawn 15 times a second (any call off the frame's clock, a resize or a lens, at once); the travellers every frame
}
function frame(now) {
  frameId = null;
  if (!visible || document.hidden || disposed || reduced.matches) return;
  elapsed += lastTime ? Math.min(50, now - lastTime) : 0; lastTime = now;
  if (elapsed - paintedAt >= 33) { renderActive(); paintedAt = elapsed; } queue();   // THE MOTION IS CHEAP: every lens drawn 30 times a second at most, the drift being slow
}
function queue() { ride(); if (visible && !document.hidden && !disposed && !reduced.matches && frameId === null) frameId = requestAnimationFrame(frame); }
function pause() { rideStop(); if (frameId !== null) cancelAnimationFrame(frameId); frameId = null; lastTime = 0; }
const view = new IntersectionObserver(entries => { visible = entries.some(e => e.isIntersecting); visible ? queue() : pause(); });
view.observe(plate);
// The doors are still illustrations, painted on resize only. They add no animation loop.
const arrivals = [createArrivalScene($('arrival-join'), 'join'), createArrivalScene($('arrival-found'), 'found')];
const arrivalSize = new ResizeObserver(() => {
  for (const drawing of arrivals) { drawing.resize(); drawing.render(0, true); }
});
arrivalSize.observe($('arrival-join')); arrivalSize.observe($('arrival-found'));
const size = new ResizeObserver(() => { buildGeometry(); if (activeLens === 1) funding.resize(narrow.matches); if (activeLens === 2) memory.resize(narrow.matches); if (activeLens === 3) cost.resize(narrow.matches); renderActive(); });
size.observe(plate);
function onVisibility() { document.hidden ? pause() : queue(); }
function onReduced() { pause(); renderActive(); queue(); }
addEventListener('resize', drawMesh);
document.addEventListener('visibilitychange', onVisibility);
reduced.addEventListener('change', onReduced);
addEventListener('pagehide', event => {
  pause(); if (event.persisted) return;
  disposed = true; view.disconnect(); size.disconnect(); arrivalSize.disconnect();
  removeEventListener('resize', drawMesh);
  document.removeEventListener('visibilitychange', onVisibility);
  reduced.removeEventListener('change', onReduced);
});
addEventListener('pageshow', queue);
drawMesh(); buildGeometry();
