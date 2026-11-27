// assembly-dive.test.mjs: THE DIVING ONE STANDS IN THE HERO, ONE FLIGHT ALL THE WAY DOWN, THE BALL IS SOLANA'S STATE. The ball is hers for as long as the chamber
// shows it: its lattice by the mints' count, its members' cells the held hexagons, each wearing its face; her worlds are where the page's are, a dive in flight
// included, on her own law for a world and for its trail; at the hand-over only her worlds go, and only the chairs no society takes go home; on an invented
// engine that records what it is asked.
// node --test app/assembly-dive.test.mjs
import test from 'node:test'; import assert from 'node:assert/strict'; import { readFileSync } from 'node:fs';
import { mountDive, paceAt, homeAt, shownAt, seatOf, floorRows, tileOf, areaOf, PACE, HOME, HOME_K, SWAP, FAST, LOOP_RADIUS, TRAIL_MS, TILE, RC, RIN } from './assembly-dive.mjs';
import { buildAssemblySkin } from './assembly-geometry.js';
import { foldFloor, reviewSeats } from './dl-mint-ledger.js';
import { FRONT } from './swarmbook-floor.mjs';
import { cellOf, cellsOf, frequencyFor, loopPoint, loopUnitAt, phaseAtDistance, diveAt, aimK, slerp } from '../vendor/embertide-app/ui/intro/room/assembly-gpu.mjs';
import { floorOf as floorSaid, EMPTY } from '../vendor/embertide-app/ui/intro/room/assembly-floor.mjs';
const read = (f) => readFileSync(new URL(f, import.meta.url), 'utf8'), unit = (v) => { const l = Math.hypot(...v); return v.map((x) => x / l); };
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const near = (a, b, eps, what) => assert.ok(Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]) < eps, `${what}: ${a.map((v) => v.toFixed(5))} vs ${b.map((v) => v.toFixed(5))}`);
const shellOf = (w) => LOOP_RADIUS * (1.94 + (w % 4) * .035) / 1.94;   // the engine's own (assembly-gpu.mjs shellOf)
const floorOf = (n) => ({ ...foldFloor(reviewSeats(n), FRONT), count: n, review: true });

test('the order of the hand-over: her pace eases to the page\'s over PACE, the free chairs go home over HOME, her worlds are handed over in SWAP, all before the page docks at .94', () => {
  assert.ok(PACE[0] === 1 && PACE[1] === SWAP[1] && 1 > HOME[0] && HOME[0] > HOME[1] && HOME[1] > SWAP[1] && SWAP[1] > SWAP[0] && SWAP[0] > .94); assert.equal(paceAt(1), FAST); assert.equal(paceAt(PACE[1]), 1); assert.equal(paceAt(.5), 1); assert.equal(homeAt(1), 0); assert.equal(homeAt(HOME[0]), 0); assert.equal(homeAt(HOME[1]), HOME_K); assert.equal(homeAt(.5), HOME_K); assert.equal(shownAt(1), 1); assert.equal(shownAt(SWAP[1]), 1); assert.equal(shownAt(SWAP[0]), 0); assert.equal(shownAt(.5), 0);
  for (let p = 1; p >= .9; p -= .0005) assert.ok(homeAt(p) >= homeAt(p + .0005) && shownAt(p) <= shownAt(p + .0005) && paceAt(p) <= paceAt(p + .0005), `monotonic at ${p.toFixed(4)}`);
  for (let p = 1; p > PACE[1]; p -= .0005) assert.ok(paceAt(p) - paceAt(p - .0005) < .1, `the pace eases, never steps (${p.toFixed(4)})`);
});

test('ONE FLIGHT: a world of the page is where hers is, on its loop or on its dive, by her own law for a world (frame) and for its trail (LINE_VS)', () => {
  // the engine's world, transcribed from assembly-gpu.mjs frame(): here = at - lag * speed * 1000; lp = loopPoint(w, here); aim = slerp(unit(lp), dir, aimK(tD));
  // up = aim * R0 * D.r, else lp * R0 * LOOP_RADIUS * D.r / shell (here in her radii: R0 = 1)
  const world = (w, at, now, speed, f) => { const tD = (now - f.t0) / 1000, D = diveAt(tD, f.shell), lp = loopPoint(w, at - D.lag * speed * 1000);
    return f.dir ? slerp(unit(lp), f.dir, aimK(tD, f.shell)).map((v) => v * D.r) : lp.map((v) => v * LOOP_RADIUS * D.r / f.shell); };
  // the engine's trail point, transcribed from LINE_VS: r4.w the phase (at / 84000 + w / 12), r6.x the trail in turns, r6.y the dive's age, r6.z the trail in real s,
  // ka and kz turns and azimuth a second; la = tiltAz(lis(arcU(r4.w - a r6.x - lag ka)), tilt, r4.y - a r4.z - lag kz) * (r / shell), then * S (= shell R0)
  const trail = (w, at, now, speed, f, a) => {
    const r6x = TRAIL_MS / 84000, r6y = f ? (now - f.t0) / 1000 : -1, r6z = TRAIL_MS / 1000 / Math.max(speed, .05), r4w = at / 84000 + w / 12, r4y = (w % 4) * Math.PI * .43 + at * .000004, r4z = TRAIL_MS * .000004;
    const shell = shellOf(w), d = r6y < 0 ? { r: shell, lag: 0 } : diveAt(r6y - a * r6z, shell), ka = r6x / r6z, kz = r4z / r6z, u = phaseAtDistance(r4w - a * r6x - d.lag * ka);
    const lane = unit(loopUnitAt(w, u, 0)), az0 = (w % 4) * Math.PI * .43, az = r4y - a * r4z - d.lag * kz;   // loopUnitAt at azimuth az: its tilted lissajous turned by az
    const turnBy = (v, x) => [v[0] * Math.cos(x) + v[2] * Math.sin(x), v[1], -v[0] * Math.sin(x) + v[2] * Math.cos(x)];
    let la = turnBy(lane, az - az0);
    if (f && f.dir && r6y >= 0) la = slerp(la, f.dir, aimK(r6y - a * r6z, shell));
    return la.map((v) => v * d.r);
  };
  for (const w of [0, 3, 5, 8]) for (const at of [0, 23387.8, 61000]) {
    const clock = { now: 50000, at, speed: 1 };
    near(seatOf(w, 0, clock), loopPoint(w, at).map((v) => v * LOOP_RADIUS), 1e-12, 'no dive: the page\'s own loop');
    for (const a of [0, .3, 1]) near(seatOf(w, a, clock), trail(w, at, clock.now, 1, null, a), 1e-6, `no dive: her trail at age ${a}`);
    for (const speed of [FAST, 3.2, 1]) for (const dir of [null, unit([.3, -.8, .5])]) for (const tD of [.4, 1.3, 2.2, 3.9, 6, 9]) {
      const f = { t0: clock.now - tD * 1000, shell: shellOf(w), dir }, c = { ...clock, speed };
      near(seatOf(w, 0, c, f), world(w, at, c.now, speed, f), 1e-9, `w ${w} dive ${tD} s at ${speed}x${dir ? ' aimed' : ''}: her world`);
      for (const a of [.05, .3, .7]) near(seatOf(w, a, c, f), trail(w, at, c.now, speed, f, a), 1e-6, `w ${w} dive ${tD} s at ${speed}x: her trail at age ${a}`);
    }
  }
  const f = { t0: 0, shell: shellOf(2), dir: null }, done = diveAt(0, f.shell).end;
  near(seatOf(2, 0, { now: (done + .01) * 1000, at: 777, speed: 1 }, f), loopPoint(2, 777).map((v) => v * LOOP_RADIUS), 1e-9, 'a dive done: on its loop again');
  assert.ok(Math.hypot(...seatOf(2, 0, { now: 2500, at: 777, speed: 1 }, f)) < 1, 'mid dive: under her skin');
});

test('THE FLOOR ON HER SKIN: her lattice by the count, a held hexagon a member\'s cell and never a chair, its face\'s tile lying upright on the cell\'s own hexagon', () => {
  const zero = floorRows(floorOf(0)); assert.equal(zero.m, 1); assert.equal(zero.n, 12); assert.equal(zero.ids.size, 0); assert.ok(zero.rows.every((v) => v === 0), 'no mint: the dodecahedron, no member\'s cell'); const sealed = floorRows({ ...floorOf(0), sealed: [2] }); assert.deepEqual([...sealed.rows].map((v, i) => (v ? i : -1)).filter((i) => i >= 0), [(sealed.n + 7) * 4 + 3], 'A SEALED HOUSE: Gemini (chair 2) is her chair cell 7, row 1\'s w 3, and nothing else');
  for (const count of [1, 12, 30, 31, 100, 240]) {
    const floor = floorOf(count), { m, n, rows, ids } = floorRows(floor), skin = buildAssemblySkin(floor.capacity);
    assert.equal(m, frequencyFor(count)); assert.equal(n, cellsOf(m)); assert.equal(n - 12, floor.capacity, 'her hexagons are the rung\'s places'); assert.equal(rows.length, n * 8); assert.equal(ids.size, count, 'a cell a mint'); assert.ok([...ids.keys()].every((id) => id >= 12 && id < n), 'never a chair');
    let members = 0; for (let id = 0; id < n; id++) { const held = rows[(n + id) * 4 + 3], tile = rows[id * 4 + 3]; members += held; assert.equal(held, ids.has(id) ? 1 : 0); assert.equal(tile > 0, ids.has(id)); }
    assert.equal(members, count); assert.deepEqual([...ids.values()].map((h) => rows[cellOf(unit(skin.hexes[h.face].center), m).id * 4 + 3]).sort((a, b) => a - b), Array.from({ length: count }, (_, i) => i + 1), 'a tile a mint, in the floor\'s order');
    for (const [id, h] of ids) {                                     // the shader's arithmetic (SPHERE_FS): uv = (.5 + tt . row0.xyz, .5 - tt . row1.xyz), tt the gnomonic point on the cell's plane
      const face = skin.hexes[h.face], cc = unit(face.center), E1 = [...rows.slice(id * 4, id * 4 + 3)], E2 = [...rows.slice((n + id) * 4, (n + id) * 4 + 3)];
      const uv = face.verts.map((v) => { const u = unit(v), d = dot(u, cc), tt = [u[0] / d - cc[0], u[1] / d - cc[1], u[2] / d - cc[2]]; return [.5 + dot(tt, E1), .5 - dot(tt, E2)]; });
      const top = uv.reduce((best, q) => (q[1] < best[1] ? q : best));
      assert.ok(Math.abs(top[0] - .5) < .05 && Math.abs(top[1] - (.5 - RC / TILE)) < 1e-6, 'its upper corner is the tile\'s upper point (the rows are single floats; a cell is a hexagon to a few hundredths)');
      for (const q of uv) { assert.ok(q[0] > -.02 && q[0] < 1.02 && q[1] > -.02 && q[1] < 1.02, 'every corner in its own tile (the shader holds the last hundredth in)'); assert.ok(Math.abs(Math.hypot(q[0] - .5, q[1] - .5) - RC / TILE) < .12 * RC / TILE, 'on the tile\'s hexagon, to an eighth'); }
      if (Math.abs(cc[1]) < .999) assert.ok(E2[1] > 0, 'upright: its up leans to the skin\'s north');
    }
  }
  const t = tileOf(5, 4); assert.deepEqual(t.mid, [1.5 * TILE, 1.5 * TILE]); assert.equal(t.points.length, 6); near([...t.points[0], 0], [t.mid[0], t.mid[1] - RC, 0], 1e-9, 'point up');
  assert.ok(Math.abs((t.points[1][0] + t.points[2][0]) / 2 - t.mid[0] - RIN) < 1e-9, 'its right flat RIN from its middle'); assert.ok(RC < TILE / 2, 'a gutter round every tile');
});

test('the engine\'s sphere stands on the page\'s: the same centre, the same lens, the same radius, at any size', () => {
  for (const pose of [{ x: 491, y: 309, lens: 947.7, radius: 1.3424 }, { x: 195, y: 420, lens: 1080, radius: .595 }, { x: 960, y: 400, lens: 1066, radius: 1.6 }]) for (const dpr of [1, 2]) {
    const h = 1404, { area, zoom, r0 } = areaOf(pose, dpr, h), lens = area.h * 1.35 * zoom;   // the engine's own arithmetic (frame(): cx, cy, lens; R0 = r0 when given)
    assert.ok(Math.abs(area.x + area.w / 2 - pose.x * dpr) < 1e-9 && Math.abs(area.y + area.h * .48 - pose.y * dpr) < 1e-9, 'the centre'); assert.ok(Math.abs(lens - pose.lens * dpr) < 1e-9, 'the lens'); assert.equal(r0, pose.radius, 'the radius, whatever its size');
  }
  assert.match(read('../../room/assembly-gpu.mjs'), /const R0 = r0 > 0 \? r0 : Math\.min\(1\.5, 2 \* area\.w \/ Math\.max\(1, area\.h\)\) \* \.82/, 'the engine takes the page\'s radius');
});

function house({ reduced = false, gl = true } = {}) {
  const E = { members: null, floor: null, faces: null, become: [], frames: [], dives: 0, inFlight: [], drawn: [] }, vars = {};
  const make = () => { if (!gl) throw new Error('no WebGL2'); return { setMembers: (n) => { E.members = n; }, setFloor: (rows, n) => { E.floor = { rows, n }; }, setFaces: (...a) => { E.faces = a; },
    become: (own, k, only) => E.become.push([own && own.hue, k, only]), pick: (x, y) => { E.picked = [x, y]; return E.pick ?? null; }, info: () => ({ dives: E.inFlight }), traverse: () => { E.dives++; return { id: E.dives, w: 0 }; },
    frame: (now, o) => { E.frames.push({ ...o, veil: [...o.veil] }); return { crossings: [], cx: 0, cy: 0, R0px: 1 }; } }; };
  const g2d = { save() {}, restore() {}, beginPath() {}, rect() {}, clip() {} };
  const canvas = () => ({ width: 0, height: 0, style: {}, setAttribute() {}, getContext: () => g2d, remove() { E.removed = true; }, getBoundingClientRect: () => ({ left: 0, top: -240, width: 982, height: 942 }) });   // her canvas: a quarter screen above the band (assembly.css)
  const flat = { after() { E.mounted = true; }, getBoundingClientRect: () => ({ left: 0, top: 0, width: 982, height: 702 }) }, bar = { getBoundingClientRect: () => ({ bottom: -100 }) };
  const root = { style: { setProperty: (k, v) => { vars[k] = v; } }, ownerDocument: { createElement: canvas, querySelector: (s) => (s === 'main > header' ? bar : null) }, querySelector: (s) => (s === '#assembly-canvas' ? flat : null) };
  let t = 5000; const win = { devicePixelRatio: 2, performance: { now: () => t }, addEventListener() {}, matchMedia: () => ({ matches: reduced }) };
  return { E, vars, root, win, make, g2d, tick: (ms) => { t += ms; }, now: () => t };
}
const POSE = { x: 491, y: 309, lens: 947.7, radius: 1.3424, at: 1234, yaw: .9, pitch: -.12 };

test('THE BALL IS SOLANA\'S STATE on an invented engine: her lattice and her members\' cells are the floor\'s, a new floor is taken at once, and each face is laid on its own tile', () => {
  const H = house(), d = mountDive(H.root, { win: H.win, make: H.make }); assert.ok(d && H.E.mounted); assert.equal(d.on(), false, 'no floor yet: she does not show');
  d.draw(POSE, 1, { ball: 1, trails: 1 }); assert.equal(H.E.frames.length, 0); assert.equal(H.vars['--assembly-ball'], '0.0000');
  d.floor(floorOf(0)); assert.ok(d.on()); assert.equal(H.E.members, 0); assert.equal(H.E.floor.n, 12); assert.ok(H.E.floor.rows.every((v) => v === 0), 'no mint: the dodecahedron');
  assert.equal(H.E.faces, null, 'and nothing of a face');
  const twelve = floorOf(12); d.floor(twelve); assert.equal(H.E.members, 12); assert.equal(H.E.floor.n, 42); assert.equal(H.E.floor.rows.length, 42 * 8);
  const seen = []; d.faces((g, seat) => { assert.equal(g, H.g2d); seen.push(seat); });
  assert.deepEqual(seen.map((s) => s.id), twelve.held.map((h) => h.signature), 'the hook is asked for every held hexagon, in the floor\'s order');
  seen.forEach((s, i) => { assert.deepEqual({ mid: s.mid, points: s.points }, tileOf(i, 4)); assert.equal(s.show, 1); });
  assert.equal(H.E.faces.length, 4); assert.deepEqual(H.E.faces.slice(1), [4, 3, 2 * RIN], 'her atlas: four tiles by three, a tile\'s hexagon flat to flat');
  seen.length = 0; d.floor(floorOf(31)); assert.equal(H.E.members, 31); assert.equal(H.E.floor.n, 92); assert.equal(seen.length, 31, 'a mint more: the cells and the tiles again'); assert.deepEqual(H.E.faces.slice(1), [6, 6, 2 * RIN]);
});

test('the hand-over on an invented engine: dives only at the top, only the chairs no society takes sent home, her worlds gone into their points, the ball hers still, her dive carried on past her canvas', () => {
  const H = house(), d = mountDive(H.root, { win: H.win, make: H.make }); d.floor(floorOf(0)); d.chairs(9);
  for (let i = 0; i < 40; i++) { H.tick(100); d.draw(POSE, 1, { ball: 1, trails: 1 }); }
  assert.ok(H.E.dives > 0, 'she dives at the top'); assert.equal(H.vars['--assembly-dive'], '1.0000'); assert.equal(H.vars['--assembly-ball'], '1.0000');
  const top = H.E.frames.at(-1); assert.equal(top.at, POSE.at); assert.deepEqual(top.turn, [POSE.yaw, POSE.pitch]); assert.equal(top.speed, FAST); assert.equal(top.r0, POSE.radius, 'her radius is the page\'s');
  assert.deepEqual(top.veil, Array(12).fill(1), 'THE SWARMS WEAR THEIR OWN FACES (his Nov 26 2026 "these orbiting shits need to have the fucking signature pents and hexs"): her twelve never drawn, their trails drawn'); assert.equal(top.trails, 1); assert.ok(Math.abs(top.area.y + top.area.h * .48 - (POSE.y + 240) * 2) < 1e-9, 'her ball\'s centre is the page\'s, a quarter screen down her taller canvas');
  d.veils[4] = .6; H.tick(16); d.draw(POSE, 1, { ball: 1, trails: 1 }); d.veils[4] = 0;
  // a dive of hers on chair 2 (a society's) and one on chair 10 (no society's): the page follows the first, by her law, and wears its colour; the second goes home with her
  H.E.inFlight = [{ w: 2, t0: H.now() - 300, shell: shellOf(2), dir: null, col: [.9, .2, .1] }, { w: 10, t0: H.now() - 300, shell: shellOf(10), dir: null, col: [.1, .2, .9] }];
  const dives = H.E.dives; let p = .999, pose = { ...POSE }, last = null, jump = 0;
  for (; p > .9; p -= .001) {
    H.tick(16); pose = { ...pose, at: pose.at + 16 * d.pace(p) }; d.draw(pose, p, { ball: 1, trails: .8 });
    const s = d.seat(2); if (last) jump = Math.max(jump, Math.hypot(s[0] - last[0], s[1] - last[1], s[2] - last[2])); last = s;
    assert.deepEqual(d.tint(2), [.9, .2, .1, 1], 'its dive\'s colour, whole'); assert.equal(d.tint(10), null, 'a chair no society takes is not the page\'s');
    const v = H.E.frames.at(-1).veil; assert.ok(v.every((x) => x === 1), 'her worlds never drawn at any depth: the wall\'s fly her flight (THE SWARMS WEAR THEIR OWN FACES)');
  }
  // its own fastest is its fall at her skin (DIVE: 3.2 radii a second, .05 a frame); her dive against the page's loop stood half a radius and more apart
  assert.ok(jump < .12, `chair 2 flies on without a jump, through the easing of the pace and the hand-over (largest step ${jump.toFixed(4)} radii)`); assert.equal(H.E.dives, dives, 'no dive begins once the journey has started');
  const home = H.E.become.filter(([hue]) => hue === -1); assert.equal(home.length, 1, 'empty chairs sent home once when chairs(9) runs, never brought back out as ghost trails'); assert.deepEqual(home[0], [-1, 1, [9, 10, 11]], 'home: the three chairs no society takes, with no world of their own');
  assert.equal(H.vars['--assembly-dive'], '0.0000'); assert.equal(H.vars['--assembly-ball'], '1.0000', 'the ball is hers still');
  const after = H.E.frames.at(-1); assert.deepEqual(after.veil, Array(12).fill(1), 'no world of hers past the hand-over'); assert.equal(after.trails, .8, 'the trails hers, as strong as the page says'); assert.equal(after.speed, 1, 'the page\'s pace');
  // the chamber lets the ball go (the page says how much of it shows): no frame of hers, and her dive goes on by the clock
  const drawn = H.E.frames.length, done = diveAt(0, shellOf(2)).end + TRAIL_MS / 1000, weights = [];
  H.tick(16); pose = { ...pose, at: pose.at + 16 }; d.draw(pose, p, { ball: .5, trails: .2 }); assert.equal(H.vars['--assembly-ball'], '0.5000'); assert.equal(H.E.frames.length, drawn + 1);
  near(d.seat(2), seatOf(2, 0, { now: H.now(), at: pose.at, speed: 1 }, H.E.inFlight[0]), 1e-12, 'the page carries her dive, by its clock');
  for (; p > .2; p -= .004) { H.tick(120); pose = { ...pose, at: pose.at + 120 }; d.draw(pose, p, { ball: 0, trails: 0 }); const k = d.tint(2)?.[3]; if (k !== undefined) weights.push([(H.now() - H.E.inFlight[0].t0) / 1000, k]); }   // 21 s: past its dive and its trail
  assert.equal(H.vars['--assembly-ball'], '0.0000'); assert.equal(H.E.frames.length, drawn + 1, 'no frame of hers once the chamber has let the ball go'); assert.ok(weights.filter(([t]) => t < done - 2).every(([, k]) => k === 1) && weights.filter(([t]) => t > done - 1.5).every(([, k]) => k < 1), 'its colour eases to its lane\'s over the last two seconds');
  for (let i = 1; i < weights.length; i++) assert.ok(weights[i - 1][1] - weights[i][1] < .25, 'never at once');
  near(d.seat(2), loopPoint(2, pose.at).map((v) => v * LOOP_RADIUS), 1e-12, 'its dive done, the page\'s world is on its loop'); assert.equal(d.tint(2), null, 'and its trail in its lane\'s colour');
  H.E.inFlight = []; for (; p <= 1; p += .001) { H.tick(100); d.draw(POSE, Math.min(1, p), { ball: 1, trails: 1 }); }
  assert.equal(H.vars['--assembly-dive'], '1.0000'); assert.deepEqual(H.E.become.at(-1), [-1, 1, [9, 10, 11]], 'climbing back: the three empty chairs stay home so no trail flies without a satellite'); assert.deepEqual(H.E.frames.at(-1).veil, Array(12).fill(1)); assert.equal(d.pace(1), FAST); assert.equal(d.shown(1), 1); assert.equal(d.shown(.9), 0);
});
test('THE HEX IS A PAGE on her skin: the visitor\'s own cell wears the mark, and she says which held hexagon is under a point', () => {
  const floor = floorOf(12); floor.mine = floor.held[4]; const { n, rows, ids } = floorRows(floor), marks = [...ids].map(([id, h]) => [h, rows[(n + id) * 4 + 3]]);
  assert.deepEqual(marks.filter(([, w]) => w === 2).map(([h]) => h), [floor.mine], 'one cell is the visitor\'s own'); assert.ok(marks.every(([h, w]) => w === (h === floor.mine ? 2 : 1))); assert.ok([...floorRows(floorOf(12)).rows].every((v, i) => i % 4 !== 3 || i < 42 * 4 || v <= 1), 'a floor with no one of this browser\'s marks none');
  const g = read('../../room/assembly-gpu.mjs');
  assert.match(g, /if \(fb\.w > 1\.5 && !INSIDE\) \{ seamCol = vec3\(0\.941, 0\.812, 0\.455\); seamW = clamp\(cellPx \* 0\.07 \/ uDpr, 2\.2, 7\.0\); \}/, 'its rim in the mint\'s gold (dl-her-portrait.js RIM, #f0cf74)');
  // OPEN LAND (his "Yes, open them"): a place no one holds is an opening, its edge alone drawn; through it the far wall from within, at its depth; a held hexagon never open
  assert.match(g, /if \(given && !chair\) \{ OPEN = 1\.0; col = vec3\(0\.0\);/, 'open land: given, no member, no chair'); assert.match(g, /OPEN \*= 1\.0 - sc;/, 'its edge stands'); assert.match(g, /vec3 far = ro \+ rd \* \(-b \+ sqrt\(max\(h, 0\.0\)\)\)/, 'the far wall\'s hit'); assert.match(g, /float ab = \(1\.0 - OPEN\) \* 0\.3;\n    col \+= \(amb \* liq \* 0\.7 \+ back \* 0\.3 \* \(1\.0 - liq\)\) \* \(1\.0 - a\); if \(a < 0\.5 && liq < 0\.5\) z = uDepth\.x \+ 1\.0 \/ uDepth\.y;/, 'the far wall faint, the depth left open behind an opening, so a world inside or behind shows'); assert.match(g, /if \(a < 0\.004\) discard;/, 'through both walls, what stands behind');
  assert.match(g, /if \(fa\.w > 0\.5 && !INSIDE\) \{/, 'a face is outside: from within, its paper back'); assert.match(g, /\} else if \(panel\) \{/, 'a held hexagon is a panel, never an opening'); assert.match(read('./dl-her-portrait.js'), /RIM = '#f0cf74'/); assert.deepEqual([0.941, 0.812, 0.455].map((v) => Math.round(v * 255)), [0xf0, 0xcf, 0x74]);
  const H = house(), d = mountDive(H.root, { win: H.win, make: H.make }), [id, held] = [...ids][3];
  assert.equal(d.at(100, 50), null, 'no floor: nothing under a point'); d.floor(floor); H.E.pick = { id, m: 2 }; assert.equal(d.at(100, 50), null, 'the ball not shown yet: nothing'); d.draw(POSE, 1, { ball: 1, trails: 1 }); assert.equal(d.at(100, 50), held, 'the held hexagon of the cell her lookup names'); assert.deepEqual(H.E.picked, [200, 580], 'asked in her canvas\'s own px (it stands a quarter screen above the band)');
  H.E.pick = { id: 3, m: 2 }; assert.equal(d.at(100, 50), null, 'a chair is no one\'s page'); H.E.pick = { id: [...Array(42).keys()].find((i) => i >= 12 && !ids.has(i)), m: 2 }; assert.equal(d.at(100, 50), null, 'open land is no one\'s');
  H.E.pick = { id, m: 3 }; assert.equal(d.at(100, 50), null, 'her lattice still growing to the floor\'s: no cell is named by an older one'); H.E.pick = null; assert.equal(d.at(100, 50), null, 'off her skin');
  H.E.pick = { id, m: 2 }; d.draw(POSE, .4, { ball: .4, trails: 0 }); assert.equal(d.at(100, 50), null, 'the chamber letting the ball go: no press finds a face that is fading');
});
test('THE SAME FLOOR ON THE WELCOME\'S BALL (his "Yes, do both"): one module hands it to both engines; on a glass it is the Nest\'s, the house empty until it holds one', () => {
  for (const n of [0, 1, 12, 31, 100]) { const f = floorSaid({ ...foldFloor(reviewSeats(n), FRONT), count: n }); assert.equal(f.count, n); assert.equal(f.held.length, n, `${n} mints said by a writer: a floor`); }
  for (const v of [null, {}, { count: 1, capacity: 80, held: [] }, { count: 31, capacity: 30, held: [] }, { count: -1, capacity: 0, held: [] }, { count: 2, capacity: 30, held: [{ face: 3 }, { face: 3 }] }, { count: 1, capacity: 30, held: [{ face: 0 }, { face: 1 }] }, { count: 1, capacity: 30, held: 'x' }])
    assert.equal(floorSaid(v), EMPTY, `${JSON.stringify(v)}: not a floor, the house empty`);
  assert.deepEqual(floorSaid({ count: 1, capacity: 30, held: [{ face: 31 }, { face: 2, signature: 's' }] }).held, [{ face: 2, signature: 's' }], 'a place off the rung is dropped'); assert.deepEqual(EMPTY, { count: 0, capacity: 0, held: [] }); assert.equal(floorRows(EMPTY).n, 12, 'empty: the dodecahedron');
  const d = read('./assembly-dive.mjs'), h = read('../../assembly-home.mjs');
  assert.match(d, /import \{ floorOn, floorRows as rowsOf \} from '\.\.\/\.\.\/room\/assembly-floor\.mjs';/); assert.match(d, /const F = floorOn\(A, doc, buildAssemblySkin\);/, 'the land law\'s skin handed from this page\'s own place'); assert.doesNotMatch(read('../../room/assembly-floor.mjs').replace(/^\/\/.*$/gm, ''), /dyson-society/, 'the floor module reaches into no other folder (the site\'s build puts dyson-society/app at /app/: such a path 404ed on the built front, Nov 20 2026)'); assert.match(d, /from '\.\.\/\.\.\/room\/assembly-gpu\.mjs';/, 'the engine by the welcome\'s own path: one instance a page');
  assert.match(h, /import \{ floorOn, floorOf, EMPTY \} from '\.\/room\/assembly-floor\.mjs';/); assert.match(h, /const F = floorOn\(A, document\); let handed = false, sc = null; home = \{ floor: \(f, skinOf\) => \{ handed = true; if \(skinOf\) F\.skin\(skinOf\); F\.floor\(f\); kick\(\); \}, faces: F\.faces, scene: \(s\) => \{ sc = s; kick\(\); \} \};/, 'a page hands it with the skin from its own place, and its floor wins over the Nest\'s'); assert.match(h, /if \(glass \|\| house\) \{ F\.floor\(EMPTY\); fetch\(`\$\{nest\}\/nest\/ref\/mint\/floor`/, 'a glass: empty until the Nest\'s floor is read');
  assert.match(h, /refs=enroll\/devices,mint\/floor&after=/, 'and on cause by the stream it already follows, no clock of its own'); assert.match(h, /if \(m\.payload\.name === 'mint\/floor'\) nestFloor\(m\.payload\.value\);/); assert.match(h, /const nestFloor = \(v\) => \{ if \(!handed\) void law\.then\(\(\) => \{ if \(!handed\) \{ F\.floor\(floorOf\(v\)\); kick\(\); \} \}\); \};/); assert.match(h, /const law = glass \|\| house \? import\('\.\/dyson-society\/app\/assembly-geometry\.js\?v=journey-8'\)/, 'the house\'s glasses load the skin where the house serves it, the site never');
  assert.doesNotMatch(h, /setInterval|indexedDB|localStorage|space-router/, 'the welcome keeps no store or clock of its own and reads no door outside the house');
});
test('where she cannot stand the page draws the floor itself: reduced motion, no WebGL2', () => {
  const A = house({ reduced: true }); assert.equal(mountDive(A.root, { win: A.win, make: A.make }), null); assert.ok(!A.E.mounted);
  const B = house({ gl: false }); assert.equal(mountDive(B.root, { win: B.win, make: B.make }), null); assert.ok(B.E.removed);
  const C = house(), d = mountDive(C.root, { win: C.win, make: C.make }); d.draw(POSE, 1); assert.equal(d.pace(1), 1); assert.equal(d.shown(1), 0);
  near(d.seat(4), loopPoint(4, POSE.at).map((v) => v * LOOP_RADIUS), 1e-12, 'before any floor: the page\'s own loop');
});
test('the page: the ball hers for as long as the chamber shows it, its worlds on her flight, the same floor drawn by the page without her, the wall\'s cells no longer on the ball', () => {
  const a = read('./assembly.js'), css = read('./assembly.css'), g = read('../../room/assembly-gpu.mjs');
  assert.match(a, /dive\.draw\(\{ x: width \/ 2 \* cameraScale \+ cameraX, y: centerY \* cameraScale \+ cameraY, lens: lens \* cameraScale, radius, at, yaw, pitch \}, p, \{ ball: sphereIn, trails: dock \* sphereIn \}\);/); assert.match(a, /const hers = dive && !reduced && dive\.on\(\), handed = hers \? 1 - dive\.shown\(p\) : 1;/); assert.match(a, /const seat = reduced \? anchor : turn\(hers \? mul\(dive\.seat\(i\), radius\) : mul\(loopPoint\(i, at\), radius \* LOOP_RADIUS\)\);/, 'a world where hers is'); assert.match(a, /const free = hers \? dock : 0;/, 'her whole loop, the stage\'s edge only as it docks'); assert.match(a, /orbitTime \+= dt \* \(dive \? dive\.pace\(progress\) : 1\);/);
  assert.match(a, /floor = next; skin = buildAssemblySkin\(floor\.capacity\); held = new Map\(floor\.held\.map\(h => \[h\.face, h\]\)\);\n/, 'the floor is the mints\''); assert.match(a, /\n    dive\?\.floor\(floor\);\n/); assert.match(a, /function setFaces\(hook\) \{ faces = hook; dive\?\.faces\(hook\); queue\(\); \}/); assert.match(a, /dive\?\.chairs\(records\.length\);/); assert.match(a, /if \(!hers\) \{\n        skin\.hexes\.forEach\(\(face, idx\) => \{\n          const mint = held\.get\(idx\)/, 'without her the page draws the same floor');
  assert.match(a, /if \(job\.face\) \{ stood\.push\(\[job\.face, job\.points\]\); if \(faces\) \{ faces\(ctx, \{ id: job\.face\.signature, show: job\.alpha, points: job\.points, mid:/, 'a held hexagon wears its face by the faces\' own hook, and is found again where it stood'); assert.doesNotMatch(a, /flights|halo|projectMemberFace|memberState|faceState|dive\.rise|dive\.home|dive\.targets|grown/, 'no cell of the wall\'s worlds flies to the ball any more'); assert.match(a, /if \(hers && i < 12\) dive\.veils\[i\] = \+veil;/, 'her world leaves the film\'s words as the page\'s does'); assert.match(a, /dive\.veils\[i\] = veilOf\(ghost, /, 'and the ones no society takes');
  assert.match(a, /return \{ setMembers, setFloor, setFaces, destroy\(\) \{/);
  // THE HEX IS A PAGE: a press opens the page the floor names, by her lookup or where the page drew the face; the visitor's own comes round to the eye, in the mint's gold
  assert.match(a, /const h = dive && !motion\.matches && dive\.on\(\) \? dive\.at\(e\.clientX, e\.clientY\) : stood\.find\(f => inside\(f\[1\], x, y\)\)\?\.\[0\];\n    return \(h && floor\.pageOf\(h\)\) \|\| null;/); assert.match(a, /if \(!floor \|\| \(tile \? tile\.style\.zIndex !== '1' : e\.target\?\.closest\?\.\('a,button,\[role=button\],input,textarea,form,label'\)\)\) return null;/, 'a link, a button, a world in front of the ball: its own; a world behind it is under the ball'); assert.match(a, /if \(page\) \{ e\.preventDefault\(\); location\.assign\(page\); \}/, 'never the link of a world behind it too');
  assert.match(a, /if \(r\.el\.style\.visibility !== visibility\) \{ r\.el\.style\.visibility = visibility; r\.el\.style\.pointerEvents = visibility \? 'none' : ''; \}/, 'a world not drawn takes no press (read in Chrome: its voting canvas is visible on its own and opened a polis from the ball)'); assert.match(a, /const onPress = e => \{ const page = down && Math\.hypot\(e\.clientX - down\[0\], e\.clientY - down\[1\]\) > 5 \? null : pageAt\(e\);/, 'a drag opens nothing'); assert.match(a, /const onHover = e => \{ const cursor = pageAt\(e\) \? 'pointer' : ''; if \(stage\.style\.cursor !== cursor\) stage\.style\.cursor = cursor; \};/, 'the hand only over a face that leads somewhere');
  assert.match(a, /if \(floor\.mine && home === null\) \{ const n = skin\.hexes\[floor\.mine\.face\]\.normal; home = aim = Math\.atan2\(n\[0\], -n\[2\]\) - \.85; \}/, 'the ball comes round to the visitor\'s own'); assert.match(a, /\+ \(reduced \? home \?\? 0 : spinAngle\), pitch/, 'and stands so where it does not turn'); assert.match(a, /polygon\(vertices\.map\(project\), mint \? \(inside \? '#5F5C55' : panelFill\('#FBF8F1', face\)\) : null, own \? '#F0CF74' : mint \? '#AE8B43' : '#655F49', sphereIn \* \(inside \? \.3 : 1\), own \? 5 : mint \? \.85 : inside \? \.5 : \.9, mint && !inside \? mint : null\);/, 'the page\'s own drawing marks it too, and opens the land no one holds');
  { const w = read('./wall.js'), html = read('./index.html'); assert.doesNotMatch(w, /assemblyFloorState|assembly-chain|paintFund/, 'the wall no longer reads the devnet floor for counters nobody saw'); assert.doesNotMatch(html, /assembly-worlds|assembly-fund|assembly-current/);
    assert.match(html, /<a class="mint-big" href="\.\/warm\.html#mint">/, 'the mint is open again: the title\'s door is the mint page (swarmbook-floor.mjs heroOf turns it for a holder)'); }
  assert.match(read('./wall.js'), /createAssembly\(\$\('assembly'\), undefined, mountDive\(\$\('assembly'\)\)\)/); assert.match(css, /\.assembly-canvas\.assembly-dive \{ z-index: 2; opacity: calc\(var\(--assembly-arrival\) \* var\(--assembly-ball, 0\)\); pointer-events: none; \}/, 'her canvas shows as much as the chamber shows the ball'); assert.match(css, /#wall > \.tile \{ transform-origin: 0 0; z-index: 1; opacity: calc\(var\(--assembly-arrival\) \* \(1 - var\(--veil, 0\)\)\); \}/, 'the wall\'s worlds drawn on her flight from the top (THE SWARMS WEAR THEIR OWN FACES)');
  assert.match(css, /--assembly-arrival: 1 !important; --assembly-dive: 0 !important; --assembly-ball: 0 !important;/, 'under reduced motion the tiles stand and she does not, whatever she last said'); assert.match(css, /\.assembly-canvas\.assembly-dive \{ top: -25vh; height: calc\(100% \+ 25vh\); \}/, 'her unit1s are not cut at the band\'s top (his Nov 19 2026)'); assert.match(read('./assembly-dive.mjs'), /cv\.style\.clipPath = clip > 0 \? `inset\(\$\{clip\}px 0 0 0\)` : ''/, 'cut only at the bar');
  
  assert.match(g, /at = Number\.isFinite\(held\) \? held : at \+ dt \* speed;/); assert.match(g, /const TURN = turn \? turnRows\(turn\[0\], turn\[1\]\) : turnRows\(\.85 \+ spin, -\.13\);/); assert.match(g, /const law = into && \(!into\.only \|\| into\.only\.has\(w\)\) \?/, 'only the worlds she is told go home'); assert.match(g, /t0: d\.t0, shell: d\.shell,/, 'her dives read with their clock'); assert.match(g, /k = R0 \* WORLD_K \* \(veil \? 1 - Math\.min\(1, Math\.max\(0, veil\[w\] \|\| 0\)\) : 1\)/, 'a world under the words, or handed over, goes into its point, its trail drawn still');
  assert.match(g, /bool chair = id < 12, given = uFloor > 0\.5 && vCell\.z < 0\.5 && m == vCell\.x;/); assert.match(g, /bool panel = !chair && \(given \? fb\.w > 0\.5 : float\(hh >> 8u\) < vCell\.y \* 16777216\.0\);/, 'a member\'s cell is the floor\'s, else the hash\'s as on the welcome'); assert.match(g, /clamp\(vec2\(0\.5 \+ dot\(tt, fa\.xyz\), 0\.5 - dot\(tt, fb\.xyz\)\), 0\.0, 1\.0\)/, 'the face\'s tile by the two rows floorRows writes'); assert.match(g, /\(1 - home\[w\]\) \* trails \* \(1 - seats\[w\]\), TRAIL_MS \/ ORBIT_PERIOD,/); assert.match(g, /return \{ gl, renderer, setMembers, setFloor, setFaces, frame,/);
});
