// The memory rail drawn as mycelium, illustrative only. Six agents sit on a floor. From each,
// hyphae grow outward, branch, and meet the hyphae of other agents; where two meet, a junction.
// Along each agent's cords sit its satellites, and at the hyphal tips its smallest children.
// One agent computes once; its trace travels the cords to the agents it has met, which light
// without recomputing, and from each of them it ripples out to the children on that agent's
// own cords. A ringed agent keeps its traces local: it receives, nothing leaves it.
// No live network, peer, or trace is shown. The caller owns the clock.
// The floor is grown once per size and cached (floorFor); ecology-cost.js draws it.

const TAU = Math.PI * 2;
const CYCLE = 16, SEND = 3.1, SPEED = 115, FLASH = 1.4, DT = .16, STEP = 13, CELL = 24;
// One seed, so the floor is the same on every visit.
function seeded(seed) {
  return () => {
    seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
const dist = (p, q) => Math.hypot(p.x - q.x, p.y - q.y);
function rootPath(branch, idx) {
  const pts = branch.points.slice(0, idx + 1);
  return branch.parent ? rootPath(branch.parent, branch.parentIdx).concat(pts.slice(1)) : pts;
}
function measure(route) {
  const cum = [0];
  for (let i = 1; i < route.length; i++) cum.push(cum[i - 1] + dist(route[i - 1], route[i]));
  return cum;
}
// A segment is fully inked one growth step after its endpoint first appears.
const routeReady = route => Math.max(...route.map(p => p.t)) + DT;
export function growFloor(width, height, mobile) {
  const rand = seeded(20260907);
  const cx = width / 2, cy = height * .5, rx = mobile ? 255 : 372, ry = mobile ? 300 : 245;
  const inside = (x, y) => ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1;
  const bodies = Array.from({length: 6}, (_, i) => {
    const angle = -Math.PI / 2 + i * TAU / 6 + (rand() - .5) * .16, k = .6 + (i % 2) * .06;
    return {i, angle, x: cx + Math.cos(angle) * rx * k, y: cy + Math.sin(angle) * ry * k, r: mobile ? 18 : 25, rung: i % 2 ? 0 : 1, local: i === 3};
  });
  const branches = [], junctions = [];
  // A flat grid of buckets, integer-indexed: no string keys, nothing allocated on a lookup.
  const cols = Math.ceil(width / CELL) + 3, grid = new Array(cols * (Math.ceil(height / CELL) + 3));
  const put = p => { const k = ((p.x / CELL | 0) + 1) + ((p.y / CELL | 0) + 1) * cols; (grid[k] || (grid[k] = [])).push(p); };
  const meet = (p, body) => {
    const gx = (p.x / CELL | 0) + 1, gy = (p.y / CELL | 0) + 1;
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
      const bucket = grid[gx + dx + (gy + dy) * cols];
      if (!bucket) continue;
      for (const q of bucket) {
        if (q.branch.body === body || q.idx < 3) continue;
        const ex = q.x - p.x, ey = q.y - p.y;
        if (ex * ex + ey * ey < 121) return q;
      }
    }
    return null;
  };
  const met = new Uint8Array(36);
  let tips = [];
  for (const b of bodies) for (let k = 0; k < 7; k++) {
    const heading = b.angle + Math.PI + k * TAU / 7 + (rand() - .5) * .4;
    const start = {x: b.x + Math.cos(heading) * (b.r + 2), y: b.y + Math.sin(heading) * (b.r + 2), t: 0};
    const branch = {body: b.i, gen: 0, parent: null, parentIdx: 0, points: [start], birth: 0, maxSteps: 32};
    branches.push(branch); tips.push({branch, heading, curve: 0, steps: 0});
  }
  // Every tip steps once per round, so meetings are symmetric and time is the round.
  for (let round = 0; round < 72 && tips.length; round++) {
    const next = [];
    for (const tip of tips) {
      const br = tip.branch, last = br.points[br.points.length - 1];
      // A hypha sweeps: its curvature drifts slowly, and the field pulls it gently inward.
      let pull = Math.atan2(cy - last.y, cx - last.x) - tip.heading; pull = Math.atan2(Math.sin(pull), Math.cos(pull));
      tip.curve = Math.max(-.04, Math.min(.04, tip.curve + (rand() - .5) * .022));
      tip.heading += tip.curve + (rand() - .5) * .09 + pull * .014;
      const p = {x: last.x + Math.cos(tip.heading) * STEP, y: last.y + Math.sin(tip.heading) * STEP, t: (round + 1) * DT, branch: br, idx: br.points.length};
      if (!inside(p.x, p.y)) continue;
      br.points.push(p); put(p); tip.steps++;
      const q = tip.steps >= 4 ? meet(p, br.body) : null;
      if (q) {
        const a = br.body, b = q.branch.body;
        if (!met[a * 6 + b]) { met[a * 6 + b] = met[b * 6 + a] = 1; junctions.push({a: {branch: br, idx: p.idx}, b: {branch: q.branch, idx: q.idx}, t: p.t, x: p.x, y: p.y}); continue; }
      }
      if (tip.steps >= br.maxSteps) continue;
      if (br.gen < 3 && tip.steps >= 3 && rand() < .15) {
        // Dichotomous, acute: the child leaves at a narrow angle and runs shorter than its parent.
        const child = {body: br.body, gen: br.gen + 1, parent: br, parentIdx: p.idx, points: [p], birth: p.t, maxSteps: [32, 20, 13, 8][br.gen + 1]};
        branches.push(child); next.push({branch: child, heading: tip.heading + (rand() < .5 ? -1 : 1) * (.32 + rand() * .3), curve: tip.curve, steps: 0});
      }
      next.push(tip);
    }
    tips = next;
  }
  // Satellites sit on the cords, two thirds of the way out; the smallest children at the tips.
  const units = [];
  const clear = (p, r) => bodies.every(b => dist(p, b) > b.r + r + 8) && units.every(u => dist(p, u) > u.r + r + 5) && junctions.every(j => dist(p, j) > r + 6);
  for (const b of bodies) {
    let placed = 0;
    for (const br of branches) {
      if (placed >= 7 || br.body !== b.i || br.gen > 1 || br.points.length < 9) continue;
      const idx = Math.floor(br.points.length * (.5 + rand() * .3)), p = br.points[idx];
      if (!clear(p, 10)) continue;
      units.push({x: p.x, y: p.y, r: mobile ? 7.5 : (br.gen ? 8.5 : 10.5), body: b.i, kind: 'unit', branch: br, idx, t: p.t}); placed++;
    }
  }
  let children = 0;
  const childCap = mobile ? 40 : 64;
  for (const br of branches) {
    if (children >= childCap) break;
    if (br.gen < 1 || br.points.length < 5) continue;
    const idx = br.points.length - 1, p = br.points[idx];
    if (!clear(p, 4.5)) continue;
    units.push({x: p.x, y: p.y, r: 4.5, body: br.body, kind: 'child', branch: br, idx, t: p.t}); children++;
  }
  for (const u of units) { u.route = rootPath(u.branch, u.idx); u.cum = measure(u.route); u.len = u.cum.at(-1); u.ready = routeReady(u.route); }
  for (const j of junctions) {
    const pa = rootPath(j.a.branch, j.a.idx), pb = rootPath(j.b.branch, j.b.idx);
    // Keep both meeting points: the short bridge is drawn at the junction.
    const ab = pa.concat(pb.slice().reverse()), ba = pb.concat(pa.slice().reverse());
    j.bridge = [pa.at(-1), pb.at(-1)];
    j.routes = {[j.a.branch.body]: {to: j.b.branch.body, route: ab, ready: routeReady(ab), cum: measure(ab), at: measure(pa).at(-1)},
      [j.b.branch.body]: {to: j.a.branch.body, route: ba, ready: routeReady(ba), cum: measure(ba), at: measure(pb).at(-1)}};
  }
  // Each sharing agent sends along its shortest cord to up to three agents it has met.
  const cycles = bodies.filter(b => !b.local).map((b, k) => {
    const best = new Map();
    for (const j of junctions) { const r = j.routes[b.i]; if (!r) continue; const len = r.cum.at(-1); if (!best.has(r.to) || best.get(r.to).len > len) best.set(r.to, {j, r, len}); }
    const firstAt = k * 2.75;
    const hops = [...best.values()].sort((u, v) => u.len - v.len).slice(0, 3).map((h, n) => ({
      ...h, ready: h.r.ready,
      start: Math.max(SEND + n * .45, h.r.ready - firstAt), dur: h.len / SPEED,
    }));
    // The boundary is checked at the forwarding step, including received work.
    // A child waits for both its own cord and its parent's receipt to be ready.
    const ripples = [];
    const feed = (body, at, via = null) => {
      if (bodies[body].local) return;
      units.forEach((u, n) => {
        if (u.body !== body) return;
        ripples.push({u, from: body, via, ready: u.ready,
          start: Math.max(at + (n % 5) * .12, u.ready - firstAt), dur: u.len / SPEED});
      });
    };
    feed(b.i, SEND + .1);
    for (const h of hops) feed(h.r.to, h.start + h.dur + .35, h);
    // A later cycle is new illustrative work. Never cut off a flight or receipt
    // when starting it, and never phase-offset into an unfinished first journey.
    const lastArrival = Math.max(...hops.map(h => h.start + h.dur), ...ripples.map(r => r.start + r.dur), SEND);
    return {src: b.i, hops, ripples, firstAt, period: Math.max(CYCLE, lastArrival + FLASH + 1.2)};
  });
  return {cx, cy, rx, ry, bodies, branches, junctions, units, cycles};
}
// Grown once per size, kept for the life of the page.
const floors = new Map();
export function floorFor(mobile) {
  const key = mobile ? 'mobile' : 'desktop';
  if (!floors.has(key)) floors.set(key, mobile ? growFloor(600, 710, true) : growFloor(1000, 650, false));
  return floors.get(key);
}
