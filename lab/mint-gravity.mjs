// mint-gravity.mjs: his land grab on the mint's Goldberg, as pure state (no DOM, no clock).
// His words, Oct 14 2026 04:1x WEST: "people can purchase hexs and they have gravity if they are golden one, they can be
// bronze ones and they just float and relocate"; 04:5x: "you must start from the dodecahedron clone of what we got in the
// optimism.fit saint seya". The world starts as the mint's dodecahedron (GP(1,0): the twelve chairs, no hexagon) and climbs
// the class I Goldbergs GP(n,0): 0, 30, 80, 150, 240, 350, 480, 630 seats. The chain's ladder also names the class II rungs
// 20 and 110; a class II rung re-lattices the sphere and its new land is born where the two lattices disagree, not on the
// seams (measured Oct 14: going 470 to 480 bore 10 cells 0.8 cells from a chair; 260 to 350 bore 90 at 1.35 cells, gap 2.9).
// On class I alone new land is born on the seams every rung, half a cell farther out each time (0.94, 1.19, 1.68, 2.24,
// 2.64, 3.14, 3.66 cells from the nearest mass), which is the rule of his eight panels: they are class I sectors.
// Every hexagon is a cell of land with a home mass: a chair (a pentagon) or a gold. At an expansion a gold stays where it
// stands (pinned in angle, it takes the face nearest its own direction first); every other cell, bronze or unheld, rides
// with its home mass and keeps its offset in cells, so in angle it falls toward the mass by the ratio of the cell sizes,
// the nearest settling first; the faces nobody inherited are new land, born where the regions pull apart, homed to the
// nearest mass, a tie within half a cell a coin flip. A gold bought captures every cell nearer to it than to its own mass.
// Cost: one expansion is O(cells x faces) dot products (630 x 630 at the top rung, a few ms); a purchase is O(cells).
// `price(metal, rung)` is what a purchase pays on a rung (the live mint's PRICE on every rung unless a caller says otherwise:
// mint-clock.mjs hands the rise a rung, his open call); the mint itself keeps no clock.
import {buildAssemblySkin} from '../app/assembly-geometry.js';

export const LADDER = [0, 30, 80, 150, 240, 350, 480, 630];
export const PRICE = {bronze: 10, gold: 1000};
export const HUES = ['#d9a441', '#45b7cc', '#d4569f', '#5cb466', '#8d6fe3', '#ef8a3c', '#2f9e8f', '#7fa650', '#7a8bd6', '#c94f8e'];

const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const unit = a => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
export const angle = (a, b) => Math.acos(Math.max(-1, Math.min(1, dot(a, b))));
/** The centre-to-centre angle of two neighbouring cells on a closed Goldberg of `capacity` hexagons (12 + capacity faces). */
export const cellAngle = capacity => Math.sqrt(8 * Math.PI / (Math.sqrt(3) * (capacity + 12)));
function coin(i, rung) { let h = Math.imul(i + 1, 2654435761) ^ Math.imul(rung + 7, 40503); h ^= h >>> 15; h = Math.imul(h, 0x2c1b3c6d); h ^= h >>> 12; return (h & 1) === 1; }
export function mulberry(seed) { return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

export function createMint({ladder = LADDER, price = metal => PRICE[metal]} = {}) {
  let rung = 0, skin = null, cells = [], masses = new Map(), holders = [], treasury = 0, serial = 0, golds = 0;

  function reset() {
    rung = 0; skin = buildAssemblySkin(ladder[0]); cells = []; holders = []; treasury = 0; serial = 0; golds = 0;
    masses = new Map(skin.pents.map(face => {
      const chair = Number(face.id.split(':')[1]);
      return ['chair:' + chair, {id: 'chair:' + chair, kind: 'chair', chair, dir: face.normal.slice(), hue: null}];
    }));
  }

  function nearestTwo(dir) {
    let m1 = null, d1 = Infinity, m2 = null, d2 = Infinity;
    for (const m of masses.values()) {
      const d = angle(dir, m.dir);
      if (d < d1) { m2 = m1; d2 = d1; m1 = m; d1 = d; } else if (d < d2) { m2 = m; d2 = d; }
    }
    return {m1, d1, m2, d2};
  }

  /** Climb one rung: the golds hold, the rest fall toward their masses, new land opens on the seams. */
  function expand() {
    if (rung + 1 >= ladder.length) return null;
    const before = ladder[rung], after = ladder[rung + 1];
    const next = buildAssemblySkin(after), faces = next.hexes, N = faces.length;
    const ratio = cellAngle(after) / cellAngle(before);
    const taken = new Array(N).fill(null);
    const nearestFree = target => {
      let best = -2, winner = -1;
      for (let i = 0; i < N; i++) { if (taken[i]) continue; const d = dot(faces[i].normal, target); if (d > best) { best = d; winner = i; } }
      return winner;
    };
    let goldTravel = 0, riderTravel = 0;
    for (const cell of cells) if (cell.holder?.metal === 'gold') {
      const i = nearestFree(masses.get(cell.home).dir); taken[i] = cell; goldTravel = Math.max(goldTravel, angle(cell.dir, faces[i].normal));
    }
    const riders = cells.filter(cell => cell.holder?.metal !== 'gold').map(cell => {
      const home = masses.get(cell.home).dir, theta = angle(home, cell.dir), c = dot(cell.dir, home);
      const away = [cell.dir[0] - home[0] * c, cell.dir[1] - home[1] * c, cell.dir[2] - home[2] * c];
      const fall = theta * ratio, t = unit(away);
      const target = theta < 1e-9 ? home : unit([home[0] * Math.cos(fall) + t[0] * Math.sin(fall), home[1] * Math.cos(fall) + t[1] * Math.sin(fall), home[2] * Math.cos(fall) + t[2] * Math.sin(fall)]);
      return {cell, fall, target};
    }).sort((a, b) => a.fall - b.fall || a.cell.serial - b.cell.serial);
    for (const r of riders) { const i = nearestFree(r.target); taken[i] = r.cell; riderTravel += angle(r.cell.dir, faces[i].normal); }
    rung += 1; skin = next;
    const half = cellAngle(after) / 2;
    let born = 0, flips = 0;
    for (let i = 0; i < N; i++) {
      if (taken[i]) continue;
      const {m1, d1, m2, d2} = nearestTwo(faces[i].normal), tie = Boolean(m2) && d2 - d1 < half;
      const id = serial++;
      taken[i] = {serial: id, id: 'land:' + id, home: (tie && coin(i, rung) ? m2 : m1).id, holder: null, born: rung, flip: tie, axis: tie ? [m1.id, m2.id] : null};
      born++; if (tie) flips++;
    }
    cells = taken;
    cells.forEach((cell, i) => { cell.face = i; cell.dir = faces[i].normal; });
    return {rung, capacity: after, born, flips, goldTravelCells: goldTravel / cellAngle(after), riderTravelCells: riders.length ? riderTravel / riders.length / cellAngle(after) : 0};
  }

  /** Buy the land at face `index` in a metal: bronze needs open land; gold takes open land or gives a bronze gravity. */
  function buy(index, metal) {
    if (metal !== 'bronze' && metal !== 'gold') return {why: 'the mint sells bronze and gold'};
    const cell = cells[index];
    if (!cell) return {why: rung ? 'no land there' : 'the dodecahedron is the twelve chairs: expand to open land'};
    if (cell.holder?.metal === 'gold') return {why: 'a gold holds this land'};
    if (metal === 'bronze') {
      if (cell.holder) return {why: 'this bronze is held: a bronze needs open land'};
      const paid = price('bronze', rung), holder = {id: holders.length + 1, metal: 'bronze', since: rung};
      holders.push(holder); cell.holder = holder; treasury += paid;
      return {holder, paid};
    }
    let holder = cell.holder, paid = price('gold', rung);
    if (holder) { holder.metal = 'gold'; paid = price('gold', rung) - price('bronze', rung); }
    else { holder = {id: holders.length + 1, metal: 'gold', since: rung}; holders.push(holder); cell.holder = holder; }
    treasury += paid;
    const mass = {id: 'gold:' + holder.id, kind: 'gold', holder: holder.id, dir: cell.dir.slice(), hue: HUES[golds++ % HUES.length]};
    masses.set(mass.id, mass); cell.home = mass.id; holder.mass = mass.id;
    let captured = 0;
    for (const other of cells) {
      if (other === cell || other.holder?.metal === 'gold') continue;
      if (angle(other.dir, mass.dir) < angle(other.dir, masses.get(other.home).dir)) { other.home = mass.id; captured++; }
    }
    return {holder, paid, captured};
  }

  /** A crowd: `bronze` buyers on open land at random, `gold` buyers on the frontier, where a gold captures the most. */
  function crowd(seed, {bronze = 5, gold = 1} = {}) {
    const rng = mulberry(seed), bought = [];
    for (let k = 0; k < gold; k++) {
      const dots = frontier();
      const cell = dots[Math.floor(rng() * dots.length)];
      if (cell && !cell.holder) bought.push(buy(cell.face, 'gold'));
    }
    for (let k = 0; k < bronze; k++) {
      const open = cells.filter(cell => !cell.holder);
      if (!open.length) break;
      bought.push(buy(open[Math.floor(rng() * open.length)].face, 'bronze'));
    }
    return bought.filter(b => b.holder);
  }

  // the frontier: open land farthest from every mass, up to eight cells, none within two cells of another
  function frontier() {
    const s = cellAngle(ladder[rung]);
    const open = cells.filter(c => !c.holder).map(c => ({c, d: nearestTwo(c.dir).d1})).sort((a, b) => b.d - a.d);
    const D = open.length ? open[0].d : 0, dots = [];
    for (const o of open) {
      if (o.d < .8 * D || o.d < 1.2 * s || dots.length >= 8) break;
      if (dots.some(d => angle(d.dir, o.c.dir) < 2.2 * s)) continue;
      dots.push(o.c);
    }
    return dots;
  }

  /** What the sphere draws: the skin and one slot a hexagon, keyed by the cell's id so a cell glides when the skin grows. */
  function layout() {
    const dots = new Set(frontier()), slots = new Map(), byFace = [];
    cells.forEach((cell, i) => {
      const home = masses.get(cell.home);
      const slot = {id: cell.id, face: skin.hexes[i], faceIndex: i,
        holder: cell.holder ? {id: cell.holder.id, metal: cell.holder.metal} : null,
        home: home.id, well: home.kind === 'gold' ? home.hue : null,
        born: cell.born, flip: cell.flip, axis: cell.axis ? cell.axis.map(id => masses.get(id).dir) : null,
        frontier: dots.has(cell)};
      slots.set(cell.id, slot); byFace[i] = slot;
    });
    return {skin, rung, capacity: ladder[rung], count: holders.length, slots, byFace, cellAngle: cellAngle(ladder[rung])};
  }

  function ledger() {
    const s = cellAngle(ladder[rung]);
    return holders.map(h => {
      const cell = cells.find(c => c.holder === h), home = masses.get(cell.home);
      if (h.metal === 'gold') {
        const orbit = cells.filter(c => c.home === home.id && c !== cell);
        return {id: h.id, metal: 'gold', since: h.since, hue: home.hue, orbit: orbit.length, companions: orbit.filter(c => c.holder).length};
      }
      return {id: h.id, metal: 'bronze', since: h.since, hue: home.hue,
        ridesWith: home.kind === 'chair' ? 'chair ' + String(home.chair + 1).padStart(2, '0') : 'gold #' + home.holder,
        away: Math.round(angle(cell.dir, home.dir) / s)};
    });
  }

  function state() {
    const gold = holders.filter(h => h.metal === 'gold').length;
    return {rung, capacity: ladder[rung], next: ladder[rung + 1] ?? null, treasury, holders: holders.length, gold, bronze: holders.length - gold,
      open: cells.filter(c => !c.holder).length, masses: masses.size};
  }

  reset();
  return {reset, expand, buy, crowd, layout, ledger, state, frontier,
    /** for the tests: every cell, as it stands */ cells: () => cells, masses: () => masses};
}
