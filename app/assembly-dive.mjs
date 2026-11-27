// assembly-dive.mjs: THE DIVING ONE STANDS IN THE HERO (Nov 19 2026, his "can you replace the lyssajudron at the hero to the diving one that changes color? keep in
// mind we still want it to interpolate to here", over the front page's ball and its wall), ONE FLIGHT ALL THE WAY DOWN (his "do you understand that at some point
// there is a disconnect between the starting colored ones and the after ones? the lyssajudron trajectoreis i mean..."), and THE BALL IS SOLANA'S STATE (his 16:51
// UTC "i had shared the polyehdron where each hexagon was a face of the colored lyssajudron", 16:57 "you over there got a fucking static unit0... you forgot that the
// hexagon count and the hexagon IDs are supposed to live on solana dude", then "Yes, rebuild it").
// The welcome's engine (../../room/assembly-gpu.mjs) draws the ball for as long as the chamber shows it: the meta swarm's sphere, its floor the mints Solana holds
// (swarmbook-floor.mjs: the dodecahedron with no mint, one hexagon a Lyssajudron minted, a rung more when the places fill), each held hexagon wearing its holder's
// face (the mint sphere's own faces, dl-her-portrait.js, laid in an atlas her skin samples). Round it her twelve fly and dive, each dive in a colour of its own, a
// press on her skin sending the nearest free world there. The page (assembly.js) hands her its pose every frame (centre, lens, radius, orbit time, turn) and she
// hands back where each world is, a dive in flight included (seat), and the colour its trail wears (tint), so the two are one picture of one flight:
// - at the top she dives; once the journey starts no new dive begins, the orbits ease to the page's pace (PACE), and a dive in flight flies on;
// - THE CHAIRS NO SOCIETY TAKES go home into her (HOME), the nearest the eye first (the engine's own law, become), each splash a ring of one colour;
// - THE HAND-OVER (SWAP): her worlds go into their points while the wall's worlds come up where they are, on the same lines. The ball, its faces, its rings and
//   the trails stay hers: nothing of the ball is ever handed over. A dive still in flight goes on in the page, by the same law, until it is done;
// - then the page's journey to the wall, her ball standing in it until the chamber lets it go. Climbing back, the same in reverse.
// THE HEX IS A PAGE (his "the swarmbook is made by many pages... that hex is a page"): she says which held hexagon is under a point (at: her own lookup, O(1)), so
// the page can open its holder's page at a press; the visitor's own hexagon (the floor's `mine`) wears the mint's gold rim (her cells' row 1, w 2).
// Cost: one WebGL2 canvas while the ball shows; nothing at the wall; nothing under reduced motion or without WebGL2 (the page draws the same floor itself).
import { createAssemblyGPU, nextDiveGap, loopPoint, diveAt, aimK, slerp } from '../vendor/embertide-app/ui/intro/room/assembly-gpu.mjs';   // by the welcome's own path: one engine a page
import { floorOn, floorRows as rowsOf } from '../vendor/embertide-app/ui/intro/room/assembly-floor.mjs';
import { buildAssemblySkin } from './assembly-geometry.js?v=journey-8';   // the land law's skin, from this page's own place
export { TILE, RC, RIN, tileOf } from '../vendor/embertide-app/ui/intro/room/assembly-floor.mjs';   // the floor on her skin, the same module the welcome's ball draws it through
export const floorRows = (floor) => rowsOf(floor, buildAssemblySkin);

const clamp = (n, a = 0, b = 1) => Math.max(a, Math.min(b, n));
const smooth = (n) => { n = clamp(n); return n * n * n * (n * (n * 6 - 15) + 10); };
const unit = (v) => { const l = Math.hypot(v[0], v[1], v[2]) || 1; return [v[0] / l, v[1] / l, v[2] / l]; };
/** FAST: her pace at the top (the orbits six times the page's); LOOP_RADIUS and TRAIL_MS: the engine's loops (in her radii) and trails (orbit ms), as assembly.js's */
export const FAST = 6, LOOP_RADIUS = 1.9, TRAIL_MS = 12000;
/** The hand-over, by the journey's progress p (1 the chamber whole, 0 the wall): her pace easing to the page's over PACE, the chairs no society takes going home over
 *  HOME (its K from 0 to HOME_K), her worlds handed to the page's over SWAP. The page's own journey starts below .94 (assembly.js: dock), after all of it. */
export const PACE = Object.freeze([1, .951]), HOME = Object.freeze([.995, .952]), HOME_K = 1.3, SWAP = Object.freeze([.941, .951]);
export const paceAt = (p) => 1 + (FAST - 1) * smooth((p - PACE[1]) / (PACE[0] - PACE[1]));
export const homeAt = (p) => HOME_K * clamp((HOME[0] - p) / (HOME[0] - HOME[1]));
export const shownAt = (p) => smooth((p - SWAP[0]) / (SWAP[1] - SWAP[0]));
/** seatOf(chair, age, clock, flight): where a world is, in her radii and the skin's frame, `age` of its trail ago (0 now, 1 its tail TRAIL_MS of orbit time back):
 *  on its loop, or, while a dive of hers {t0, shell, dir} is in its trail, on that dive: the engine's own law for its world (frame) and for its trail (LINE_VS),
 *  the dive's time a trail's length in real s at the pace of now, its lag in orbit ms at that pace, an aimed dive turning to its point. clock {now, at, speed}. Pure. */
export function seatOf(chair, age, clock, flight = null) {
  const T = clock.at - age * TRAIL_MS, lp = loopPoint(chair, T);
  if (!flight) return [lp[0] * LOOP_RADIUS, lp[1] * LOOP_RADIUS, lp[2] * LOOP_RADIUS];
  const speed = Math.max(clock.speed, .05), t = (clock.now - flight.t0) / 1000 - age * TRAIL_MS / 1000 / speed, D = diveAt(t, flight.shell);
  const on = unit(loopPoint(chair, T - D.lag * speed * 1000)), dir = flight.dir ? slerp(on, flight.dir, aimK(t, flight.shell)) : on;
  return [dir[0] * D.r, dir[1] * D.r, dir[2] * D.r];
}
/** a dive is done once its trail has climbed out too (the engine's own rule, frame: dives[w] = null) */
const doneAt = (flight, speed) => diveAt(0, flight.shell).end + TRAIL_MS / 1000 / Math.max(speed, .05);

/** areaOf(pose, dpr, h): the engine's box, zoom and radius that put its sphere on the page's: the same centre, the same lens, the same radius (r0), so every cell,
 *  every world and every trail of hers lands on the page's pixel. pose {x, y, lens (CSS px), radius (world)}. Pure. */
export function areaOf(pose, dpr, h) {
  return { area: { x: pose.x * dpr - h / 2, y: pose.y * dpr - h * .48, w: h, h }, zoom: pose.lens * dpr / (h * 1.35), r0: pose.radius };
}
const spectrum = (h) => [0, 4, 2].map((o) => Math.min(1, Math.max(0, Math.abs((((h * 6 + o) % 6) + 6) % 6 - 3) - 1)));
const HOME_ONLY = Object.freeze({ hue: -1, col: null, seed: 0, was: null });   // become() with no world of its own: only her worlds going home into her

/** mountDive(root): her canvas over the band of `root` (#assembly). -> null where she cannot stand, else what assembly.js asks of her: floor, faces, chairs, on,
 *  at, pace, shown, draw, seat, tint, veils. */
export function mountDive(root, { win = window, make = createAssemblyGPU } = {}) {
  const doc = root?.ownerDocument, flat = root?.querySelector('#assembly-canvas');
  if (!flat || win.matchMedia('(prefers-reduced-motion: reduce)').matches) return null;
  const cv = Object.assign(doc.createElement('canvas'), { id: 'assembly-dive', className: 'assembly-canvas assembly-dive' }); cv.setAttribute('aria-hidden', 'true'); flat.after(cv);
  const dpr = Math.min(2, win.devicePixelRatio || 1); let A = null;
  try { A = make(cv, { dpr }); } catch { cv.remove(); return null; }
  let floor = null, hook = null, seated = 12, homeless = [], shown = -1, ball = -1, homeK = -1, nextDive = 0, hue = Math.random(), homeHue = hue, clipped = -1;
  const clock = { now: 0, at: 0, speed: 1 }, flights = new Map(), veil = new Array(12).fill(0);   // the frame's clock as the page draws it; her dives in flight, chair -> {t0, shell, dir, col}; her worlds' veils this frame
  const rings = [], ring = (dir, col, a = 1, later = 0) => { rings.push({ dir, born: win.performance.now() + later, col: col.map((v) => v * a) }); while (rings.length > 16) rings.shift(); };
  const size = () => { const r = cv.getBoundingClientRect(), w = Math.max(1, Math.round(r.width * dpr)), h = Math.max(1, Math.round(r.height * dpr)); if (cv.width !== w) cv.width = w; if (cv.height !== h) cv.height = h; };
  const F = floorOn(A, doc, buildAssemblySkin);                       // the floor and everyone's faces on her skin (room/assembly-floor.mjs)
  win.addEventListener('pointerdown', (e) => {                       // his click, as on the welcome: a ring where it fell on her skin, the nearest free world dives there in its colour
    if (shown < 1 || homeK > 0) return; const r = cv.getBoundingClientRect(), p = A.pick((e.clientX - r.left) * dpr, (e.clientY - r.top) * dpr);
    if (p) { const col = spectrum(hue = (hue + .6180339887) % 1); ring(p.dir, col); A.traverse(null, { dir: p.dir, col }); }
  }, { passive: true });
  const api = {
    /** floor(f): the floor as Solana's list stands: her lattice by its count, her members' cells the held hexagons, their faces' tiles laid again */
    floor(f) { floor = f; F.floor(f); },
    /** faces(fn): the faces' hook (dl-her-portrait.js face(ctx, seat), handed on by swarmbook-floor.mjs each time a face arrives): the atlas is laid again */
    faces(fn) { hook = fn; F.faces(fn); },
    /** chairs(n): n of her twelve worlds are the wall's (the page's records); empty chairs stay home so no trail flies without a satellite */
    chairs(n) { seated = Math.max(0, Math.min(12, n)); homeless = Array.from({ length: 12 - seated }, (_, i) => seated + i); A.become(homeless.length ? HOME_ONLY : null, homeless.length ? 1 : 0, homeless); },
    on: () => !!floor,
    /** at(x, y): the held hexagon under a point of the window; null off her skin, on open land or a chair, or while the ball is not hers to show */
    at(x, y) { const cells = F.cells(); if (ball <= .5 || !cells) return null; const r = cv.getBoundingClientRect(), p = A.pick((x - r.left) * dpr, (y - r.top) * dpr); return (p && p.m === cells.m && cells.ids.get(p.id)) || null; }, hit(x, y) { const cells = F.cells(); if (ball <= .5 || !cells) return null; const r = cv.getBoundingClientRect(), p = A.pick((x - r.left) * dpr, (y - r.top) * dpr); return p ? { hex: (p.m === cells.m && cells.ids.get(p.id)) || null, chair: p.id < 12 ? [5, 7, 4, 6, 1, 3, 0, 2, 9, 11, 8, 10][p.id] : null } : null; },
    pace: (p) => (floor ? paceAt(p) : 1),
    shown: (p) => (floor ? shownAt(p) : 0),
    /** veils: twelve numbers the page writes as it poses its worlds, how far each of hers has gone under the film's words (assembly.js veilOf), read at her next frame */
    veils: new Array(12).fill(0),
    /** seat(chair, age): where world `chair` is, in her radii and the skin's frame, `age` of its trail ago, at the clock of the frame draw() was last given */
    seat: (chair, age = 0) => seatOf(chair, age, clock, flights.get(chair) || null),
    /** tint(chair): the colour its trail wears, [r, g, b, k]: its dive's (0 to 1) worn k of the way over its lane's, k easing to 0 over the last two seconds
     *  before the dive is done (the engine lets it go at once); null: its lane's */
    tint: (chair) => { const f = flights.get(chair); return f && f.col ? [...f.col, smooth((doneAt(f, clock.speed) - (clock.now - f.t0) / 1000) / 2)] : null; },
    /** draw(pose, p, {ball, trails}): her frame at the page's pose {x, y, lens, radius, at, yaw, pitch}. ball: how much of the ball the chamber shows (her canvas's
     *  light; 0: no frame, and her dives in flight go on by the clock); trails: how strongly the trails stand */
    draw(pose, p, { ball: light = 1, trails = 1 } = {}) {
      const k = floor ? shownAt(p) : 0, seen = floor ? clamp(light) : 0, now = win.performance.now();
      clock.now = now; clock.at = pose.at; clock.speed = floor ? paceAt(p) : 1;
      if (k !== shown) { shown = k; root.style.setProperty('--assembly-dive', k.toFixed(4)); }
      if (seen !== ball) { ball = seen; root.style.setProperty('--assembly-ball', seen.toFixed(4)); }
      if (seen <= 0) { for (const [w, f] of flights) if ((now - f.t0) / 1000 > doneAt(f, clock.speed)) flights.delete(w); return; }
      const K = homeAt(p); homeK = K;   // empty chairs stay home at every depth (chairs()): never brought back out as satellite-less trails
      // her canvas stands a quarter screen above the band (assembly.css), so a unit1 at the top of its loop is never cut at the band's edge; it is cut only
      // at the bar, as the page is (his Nov 19 2026 "fix that some of the unit1 satellites are getting cut off")
      const top = cv.getBoundingClientRect().top, lift = flat.getBoundingClientRect().top - top, bar = doc.querySelector('main > header')?.getBoundingClientRect().bottom ?? -Infinity, clip = Math.max(0, Math.round(bar - top));
      if (clip !== clipped) { clipped = clip; cv.style.clipPath = clip > 0 ? `inset(${clip}px 0 0 0)` : ''; }
      size();
      if (p >= 1 && now > nextDive) { const col = spectrum(hue = (hue + .6180339887) % 1); nextDive = now + (A.traverse(null, { col }) ? nextDiveGap() : 250); }   // each dive a colour of its own, its rings too
      const alive = rings.filter((r) => now - r.born < 4000 && now >= r.born).slice(-8), { area, zoom, r0 } = areaOf({ ...pose, y: pose.y + lift }, dpr, cv.height);
      for (let i = 0; i < 12; i++) veil[i] = 1;   /* THE SWARMS WEAR THEIR OWN FACES (his Nov 26 2026 "these orbiting shits need to have the fucking signature pents and hexs"): her twelve worlds are never drawn, their trails are; the wall's own swarms fly her flight in their place (assembly.js) */   // under the film's words, or handed over: gone into its point
      const info = A.frame(now, { zoom, area, r0, speed: clock.speed, at: pose.at, turn: [pose.yaw, pose.pitch], veil, trails, play: { ripples: alive.map((r) => ({ dir: r.dir, age: (now - r.born) / 1000, col: r.col })) } });
      for (const c of info.crossings) { const col = K > 0 && c.w >= seated ? spectrum(homeHue) : c.col || spectrum(((c.w + 1) * .6180339887) % 1); if (c.kind === 'in') { ring(c.dir, col, 1); ring(c.dir, col, .5, 240); } else { ring(c.dir, col, .85); ring(c.dir, col, .4, 200); } }
      flights.clear(); for (const d of A.info().dives || []) if (d.w < seated && Number.isFinite(d.t0)) flights.set(d.w, { t0: d.t0, shell: d.shell, dir: d.dir || null, col: d.col || null });
    },
    state: () => ({ on: !!floor, seated, count: floor?.count ?? null, capacity: floor?.capacity ?? null, faces: !!hook, k: shown, ball, K: homeK, rings: rings.length, flights: [...flights.keys()], size: [cv.width, cv.height], ...A.info() }),
  };
  win.__assemblyDive = api;                                          // a proof's reader, as the welcome's window.__assemblyGpu
  return api;
}
