// sagittarius-flight.test.mjs: THE TWELVE's law (sagittarius-flight.mjs), without a browser. His words, Oct 17 2026 WEST: 02:2x "add some dmc4 typa shit
// boss fight idk where the dodecahedron encounters a singularity and out of it the golden sgittarius arises"; 04:3x "make it so that the 2nd time the
// dodecahedron explodes, this one is for good... can you use mani faces independently soinf the same thing?" and "ALL THE FUCKING TIMES YOUR ANIMATION
// IS ABSOLUTELY FUCKING OFFCENTERED"; 20:3x "what the fuck is this schizophrenic scene dude? dont you realize that moment is a manifestation of holy
// divine power? only the pure of heart can weikld such powwr... the dodecaheron faces must begin to be aligned with the DCTs of the anime dude the
// spirit of the music"; 22:2x "the dodecahedron faces when the scene changes and points to the sky must not be initially in there... they must rapidly
// but lyssajudrean erratically arrive like a boomerang back to the sky light egg, check the anime dude". Pinned: at the cut to the sky no face is in the
// picture; with the anime's rising beam they fly in from beyond its edge in the beam's direction, each on its own erratic path, home round the star as
// it bursts, never faster than the law; they gather as the fan's drawings move; they stand on its light (each seat where the gold is, turned along its ray from the source the rays converge on), flash where
// the drawing moved, and the hole is an eclipse of that light; a ring of light runs out at each of the light's throbs; the score's swell begins the
// finisher, which closes the twelve into one glass at the middle a beat before the cut; the flash opens out of the middle, the glass comes home there;
// with the anchor 'centre' the hole stands at the middle; a sample costs microseconds.
// node --test embertide-app/ui/intro/dyson-society/lab/sagittarius-flight.test.mjs
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {SKY_FLIGHT_START, SKY_FLASH, SKY_HOLD, HOLD_GRACE, GATHERED, FINISH, FIN_HIT, SING_OPEN, THROBS, CENTER, GLORY, RING, SMALL, HOME_R, FACE_MIN,
  BOOM_START, BOOM_END, ENTRY, RING_IN,
  MASK_BACKGROUND, FACES, SOURCE, TIERS, skyFlight, canvasOf, lightAt, seatsAt, gatheredAt, qrot} from './sagittarius-flight.mjs';
import {TWELVE_DCT} from './twelve-dct.js';
import {pictureViewport} from './mint-freeze-layout.mjs';

const W = 1194, H = 834;   // an iPad held across, as he paints on it
const FPS = 30000 / 1001;
// the glass as the second burst leaves it: right of the centre, about where his screenshot shows it, turned, its plates apart, seen from four radii
const origin = {c: [.12, -.03], r: .27, q: [.18, -.32, .09, .925], sep: .55, persp: .25};
const at = (t, anchor) => skyFlight(t, W, H, origin, anchor ? {anchor} : undefined);
const picture = pictureViewport(W, H), ph = picture.height * 534 / 540 / H, C = canvasOf(picture, W, H, CENTER);
const times = (from, to, hz) => Array.from({length: Math.floor((to - from) * hz) + 1}, (_, i) => from + i / hz);
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
const turn = (a, b, c) => { const u = [b[0] - a[0], b[1] - a[1]], v = [c[0] - b[0], c[1] - b[1]];
  return Math.acos(Math.max(-1, Math.min(1, (u[0] * v[0] + u[1] * v[1]) / ((Math.hypot(...u) * Math.hypot(...v)) || 1)))); };
const S = (t) => canvasOf(picture, W, H, lightAt(t).source);
const row = (n) => TWELVE_DCT.rows[n - TWELVE_DCT.from];
const clockOf = (p, o) => ((Math.atan2(p[0] - o[0], p[1] - o[1]) % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);   // clockwise from twelve, y up

test('kept: twelve faces at every frame from the burst\'s last frame to the hold and through its overrun, none before or after; a pure function', () => {
  assert.equal(at(SKY_FLIGHT_START - 1e-3), null);
  assert.equal(at(SKY_HOLD + HOLD_GRACE + .01), null);
  for (const t of [SKY_HOLD + .03, SKY_HOLD + .09, SKY_HOLD + .3]) assert.deepEqual(at(t), at(SKY_HOLD), `the glass left the hold at ${t.toFixed(3)} s`);
  for (const anchor of ['light', 'centre']) for (const t of times(SKY_FLIGHT_START, SKY_HOLD + .04, 60)) {
    const f = at(t, anchor);
    assert.ok(f && f.faces.length === 12 && f.faces.every(x => x.c.every(Number.isFinite) && x.s > 0 && Number.isFinite(x.glow)), `no twelve at ${t.toFixed(3)} s`);
    assert.equal(new Set(f.faces.map(x => x.seat)).size, 12, 'one seat a face');
    assert.deepEqual(at(t, anchor), f, 'a pure function of the film\'s second');
  }
  assert.deepEqual(at(43.5), at(43.5, 'light'), 'the anime\'s light is the default anchor');
});

const outOfCanvas = (x, w = W, h = H) => Math.abs(x.c[0]) > w / h / 2 + 1.7 * x.s || Math.abs(x.c[1]) > .5 + 1.7 * x.s;   // its pentagon and its dark halo off the canvas

test('the cut to the sky (his 22:2x): no face is in the picture, and none comes in before the anime\'s beam rises', () => {
  // at every shape: the iPad across, his preview pane (portrait: the beam leaves by the left edge, Oct 17 22:4x), a phone held up, a wide screen
  for (const [w, h] of [[W, H], [839, 1053], [390, 844], [1920, 1080]]) for (const anchor of ['light', 'centre']) for (const t of times(SKY_FLIGHT_START, BOOM_START, 120)) {
    const f = skyFlight(t, w, h, origin, {anchor});
    assert.equal(f.phase, 'boomerang');
    for (const x of f.faces) assert.ok(outOfCanvas(x, w, h), `a face on the canvas at ${t.toFixed(3)} s (${anchor}, ${w} x ${h})`);
  }
  // the formation's own place and size hand over from the burst's glass (the theater's pose does not jump at the cut)
  const f = at(SKY_FLIGHT_START);
  assert.deepEqual(f.c, origin.c); assert.equal(f.r, origin.r);
});

test('never out of sight once home: every face at least FACE_MIN across at every frame, whole on the canvas from its arrival round the star', () => {
  for (const anchor of ['light', 'centre']) for (const t of times(SKY_FLIGHT_START, SKY_HOLD, 120)) {
    for (const x of at(t, anchor).faces) {
      assert.ok(2 * x.s >= FACE_MIN * ph, `a face ${(2 * x.s / ph).toFixed(3)} picture heights across at ${t.toFixed(3)} s`);
      if (t >= BOOM_END) assert.ok(Math.abs(x.c[0]) <= W / H / 2 - x.s + 1e-9 && Math.abs(x.c[1]) <= .5 - x.s + 1e-9, `a face off the canvas at ${t.toFixed(3)} s (${anchor})`);
    }
  }
});

test('never a jump but at the anime\'s cut: at 120 frames a second no face moves faster than 8 picture heights a second, but across the cut to the burst', () => {
  for (const anchor of ['light', 'centre']) {
    let was = at(SKY_FLIGHT_START, anchor), fastest = 0, when = 0, prev = SKY_FLIGHT_START;
    for (const t of times(SKY_FLIGHT_START + 1 / 120, SKY_HOLD, 120)) {
      const f = at(t, anchor);
      // the cut (1362) moves the anime's light from the star to the burst at the middle, and the glass with it: the one step allowed to jump
      if (!(prev < SKY_FLASH && t >= SKY_FLASH)) f.faces.forEach((x, i) => { const v = dist(x.c, was.faces[i].c) * 120 / ph; if (v > fastest) { fastest = v; when = t; } });
      was = f; prev = t;
    }
    assert.ok(fastest < 8, `${anchor}: a face moved ${fastest.toFixed(2)} picture heights a second at ${when.toFixed(3)} s`);
    console.log(`# ${anchor}: the fastest face ${fastest.toFixed(2)} picture heights a second, at ${when.toFixed(3)} s`);
  }
});

test('the measure: the source the anime\'s light converges on is the star in the sky, and the golden burst at the middle after the cut', () => {
  // the star of the starburst (frames 1323 to 1361: 0.45, 0.12 of the picture), the beam's head reaching it, the burst after the cut (0.5, 0.52)
  for (const n of [1325, 1334, 1342, 1350, 1357, 1361]) { const s = SOURCE[n - TWELVE_DCT.from]; assert.ok(Math.abs(s[0] - .453) < .02 && Math.abs(s[1] - .115) < .02, `frame ${n}: ${s}`); }
  for (const n of [1364, 1370, 1380]) { const s = SOURCE[n - TWELVE_DCT.from]; assert.ok(Math.abs(s[0] - .505) < .02 && Math.abs(s[1] - .525) < .02, `frame ${n}: ${s}`); }
  // where the light is too faint to say (the star barely there, 1286 to 1290; the fan drawn back, 1317 to 1321) the source holds the star's place
  for (const n of [1287, 1289, 1318, 1320]) { const s = SOURCE[n - TWELVE_DCT.from]; assert.ok(s[1] < .26 && s[0] > .3 && s[0] < .5, `frame ${n}: ${s}`); }
  assert.ok(Math.abs(BOOM_START - 1290.5 / FPS) < 1e-9, `the beam's first drawing is frame 1291, not ${(BOOM_START * FPS + .5).toFixed(1)}`);
  assert.ok(Math.abs(BOOM_END - 1302 / FPS) < 1e-9 && SING_OPEN === BOOM_END, `the star bursts at frame 1302, not ${(BOOM_END * FPS).toFixed(1)}`);
  assert.ok(ENTRY > 6 / 12 * 2 * Math.PI && ENTRY < 10 / 12 * 2 * Math.PI, `the beam rises from the lower left (between six and ten o'clock), not ${(ENTRY / Math.PI * 6).toFixed(2)} o'clock`);
  assert.ok(Math.abs(GATHERED - 1312 / FPS) < 1e-9, `the twelve are home as the fan's drawings land (1312), not ${(GATHERED * FPS).toFixed(1)}`);
  assert.ok(Math.abs(FINISH - 1348 / FPS) < 1e-9, `the score's swell begins at frame 1348, not ${(FINISH * FPS).toFixed(1)}`);
  assert.deepEqual(THROBS.map(t => Math.round(t * FPS)), [1327, 1330, 1334, 1342, 1350, 1357], 'the light\'s throbs');
});

test('the boomerang: in with the beam from its direction, rapid and erratic (an arc, a 3:2 swirl, a spin), home round the star as it bursts', () => {
  const S0 = S(BOOM_START), dir = [Math.sin(ENTRY), Math.cos(ENTRY)];
  // they come from the beam's side of the star: just after the beam rises, every face is out along the beam's direction from the star
  for (const x of at(BOOM_START + .02).faces) { const v = [x.c[0] - S0[0], x.c[1] - S0[1]]; assert.ok((v[0] * dir[0] + v[1] * dir[1]) / Math.hypot(...v) > .7, `a face not on the beam's side`); }
  // home round the star at its burst, each RING_IN from it, its corner out along its ray
  const home = at(BOOM_END - 1e-4), s = S(BOOM_END - 1e-4);
  for (const x of home.faces) assert.ok(Math.abs(dist(x.c, s) / ph - RING_IN) < .03, `a face ${(dist(x.c, s) / ph).toFixed(3)} picture heights from the star at its burst`);
  assert.ok(home.faces.every((x) => !outOfCanvas(x)), 'home in the picture');
  // erratic: every path turns more than a half turn on the way (an arc and a swirl, never a straight dart), and no two paths alike
  const paths = Array.from({length: 12}, (_, i) => times(BOOM_START, BOOM_END - 1e-4, 240).map((t) => at(t).faces[i].c));
  for (const path of paths) { let turning = 0; for (let k = 2; k < path.length; k++) turning += turn(path[k - 2], path[k - 1], path[k]); assert.ok(turning > Math.PI / 2, `a path turned only ${turning.toFixed(2)} radians`); }
  for (let a = 0; a < 12; a++) for (let b = a + 1; b < 12; b++) assert.ok(paths[a].some((p, k) => dist(p, paths[b][k]) > .02 * ph), `faces ${a} and ${b} fly the same path`);
  // rapid: the whole flight is the beam's rise, about 0.38 s
  assert.ok(BOOM_END - BOOM_START < .45);
  // the hole opens on the star as they arrive
  assert.equal(at(BOOM_END - .01).sing, null); assert.ok(at(BOOM_END + .3).sing.rh > 0);
});

test('the gathering opens as the fan\'s drawings move: still across a held drawing, the big steps on its new drawings, home at the fan', () => {
  let was = 0;
  for (const t of times(BOOM_END, GATHERED, 240)) { const g = gatheredAt(t); assert.ok(g >= was - 1e-12, `the gathering went back at ${t.toFixed(3)} s`); was = g; }
  assert.equal(gatheredAt(BOOM_END), 0); assert.equal(gatheredAt(GATHERED), 1);
  for (const n of [1303, 1308, 1309]) {
    assert.ok(row(n)[3] <= 1, `frame ${n} is not a held drawing (${row(n)[3]})`);
    const a = gatheredAt((n - 1) / FPS + 1e-4), b = gatheredAt(n / FPS - 1e-4);
    assert.ok(b - a < .01, `frame ${n} holds its drawing but the gathering went on by ${(b - a).toFixed(4)}`);
  }
  const step = (n) => gatheredAt(n / FPS) - gatheredAt((n - 1) / FPS);
  assert.ok(step(1306) > 10 * step(1304) && step(1310) > 10 * step(1309) && step(1310) <= .2 + 1e-9, `the steps: 1304 ${step(1304).toFixed(4)}, 1306 ${step(1306).toFixed(4)}, 1309 ${step(1309).toFixed(4)}, 1310 ${step(1310).toFixed(4)}`);
  assert.equal(at(BOOM_END + .01).phase, 'gather');
  assert.equal(at(GATHERED + .01).phase, 'glory');
  const mean = (f) => f.faces.reduce((m, x) => [m[0] + x.c[0] / 12, m[1] + x.c[1] / 12], [0, 0]);
  assert.ok(dist(mean(at(GATHERED + .01)), mean(at(GATHERED - .001))) < .03 * ph, 'no jump from the gathering into the glory');
  assert.ok(dist(mean(at(BOOM_END + .001)), mean(at(BOOM_END - .001))) < .03 * ph, 'no jump from the boomerang into the gathering');
});

test('the glory stands on the anime\'s light: about its source, each face where the gold is, turned along its ray, the hole an eclipse of the star', () => {
  for (const t of times(GATHERED + .02, FINISH - .02, 30)) {
    const f = at(t), s = S(t), L = lightAt(t);
    assert.equal(f.phase, 'glory');
    assert.ok(f.sing && dist(f.sing.c, s) < 1e-9, `the hole is not on the light at ${t.toFixed(3)} s`);
    assert.ok(f.sing.rh > 0 && f.sing.rh < .045 * ph, 'an eclipse of the star\'s core, not a pit in the sky');
    // each face on its seat about the source, on the glory's inner or outer tier (its rays short and long in turn)
    const seats = seatsAt(t, 'light'), seated = [...f.faces].sort((a, b) => a.seat - b.seat);
    seated.forEach((x, j) => {
      const d = dist(x.c, s) / ph, tier = TIERS[j % 2] * GLORY;
      if (Math.abs(x.c[1]) < .5 - x.s - 1e-6 && Math.abs(x.c[0]) < W / H / 2 - x.s - 1e-6) assert.ok(d > .78 * tier && d < 1.24 * tier, `seat ${j} ${d.toFixed(3)} picture heights from the light at ${t.toFixed(3)} s`);
      const a = clockOf(x.c, s), want = seats[j], off = Math.atan2(Math.sin(a - want), Math.cos(a - want));
      if (Math.abs(x.c[1]) < .5 - x.s - 1e-6 && Math.abs(x.c[0]) < W / H / 2 - x.s - 1e-6) assert.ok(Math.abs(off) < 1e-6, `seat ${j} off its angle by ${off.toFixed(4)} at ${t.toFixed(3)} s`);
      // its corner along its ray, pointing out from the light
      const ray = [x.c[0] - s[0], x.c[1] - s[1]], c = (x.ay[0] * ray[0] + x.ay[1] * ray[1]) / (Math.hypot(...x.ay) * Math.hypot(...ray));
      assert.ok(c > .8, `seat ${j} not along its ray (cos ${c.toFixed(3)}) at ${t.toFixed(3)} s`);
    });
  }
});

test('seatsAt: two thirds of the weight where the light is, a third spread over the directions that stay in the picture; clockwise, in order', () => {
  const t = 1342 / FPS, L = lightAt(t), seats = seatsAt(t, 'light');
  assert.equal(seats.length, 12);
  for (let j = 1; j < 12; j++) assert.ok(seats[j] >= seats[j - 1], 'clockwise, in order');
  // from the star near the top of the picture no seat points up out of it (the sectors from ten to two o'clock leave the picture at that radius)
  for (const a of seats) { const u = L.source[0] * TWELVE_DCT.aspect + GLORY * Math.sin(a), v = L.source[1] - GLORY * Math.cos(a); assert.ok(v > 0 && u > 0 && u < TWELVE_DCT.aspect, `a seat out of the picture at ${a.toFixed(2)}`); }
  // the light of frame 1342 is fullest below the star (sectors four to seven o'clock): more seats there than an even spread would put
  const below = seats.filter(a => a >= 4 * Math.PI / 6 && a < 8 * Math.PI / 6).length;
  assert.ok(below >= 5, `${below} seats of 12 below the star where its rays are`);
  for (let j = 1; j < 12; j++) assert.ok(seats[j] - seats[j - 1] > .1, `seats ${j - 1} and ${j} heaped: ${(seats[j] - seats[j - 1]).toFixed(3)} radians apart`);
});

test('the faces flash where the drawing moves: a face\'s glow jumps on a new drawing in its direction and falls between drawings', () => {
  // frame 1342 lands the starburst's brightest drawing (the change 617); just after its second, the faces in its moving sectors flash
  const f0 = at(1342 / FPS - .002), f1 = at(1342 / FPS + .002), f2 = at(1344 / FPS - .002);
  const up = f1.faces.filter((x, i) => x.glow > f0.faces[i].glow + .2).length;
  assert.ok(up >= 4, `only ${up} faces flashed on the drawing of frame 1342`);
  assert.ok(f2.faces.every((x, i) => x.glow <= f1.faces[i].glow + 1e-9), 'the flash falls until the next drawing');
  // a throb of the light: a ring runs out of the star
  for (const ts of THROBS) {
    const f = at(ts + .05);
    assert.ok(f.shocks.some(k => dist(k.c, S(ts)) < 1e-9 && k.r > 0), `no ring out of the light at its throb ${ts.toFixed(3)} s`);
    assert.deepEqual(f.shake, [0, 0], 'a throb of light does not shake the world');
    assert.deepEqual(f.sparks, [], 'no fight: no sparks');
  }
  for (const t of [44, FINISH - .01, FIN_HIT - .01]) assert.equal(at(t).hits, THROBS.filter(ts => ts <= t).length, `the throbs counted by ${t}`);
});

test('the score: its swell begins the finisher; the twelve close into one glass on the star a beat before the cut, never leaving the light (his 22:3x)', () => {
  assert.ok(FINISH < FIN_HIT && FIN_HIT < SKY_FLASH && Math.abs(SKY_FLASH - FIN_HIT - .1) < 1e-9);
  const lift = (t) => at(t).faces.reduce((m, x) => m + x.glow, 0) / 12;
  assert.ok(lift(FIN_HIT - .02) > lift(FINISH - .02), 'the faces are brighter in the climax than before it');
  assert.equal(at(FINISH + .01).phase, 'finisher');
  // the hole and the twelve stay on the anime's light while it is the star: no frame before the cut puts them at the middle
  for (const t of times(SING_OPEN + .01, SKY_FLASH - .002, 120)) {
    const f = at(t), s = S(t), mean = f.faces.reduce((m, x) => [m[0] + x.c[0] / 12, m[1] + x.c[1] / 12], [0, 0]);
    assert.ok(!f.sing || dist(f.sing.c, s) < 1e-9, `the hole left the star at ${t.toFixed(3)} s`);
    assert.ok(dist(mean, s) < (t < FIN_HIT ? .4 : .05) * ph, `the twelve left the star at ${t.toFixed(3)} s: ${(dist(mean, s) / ph).toFixed(3)} picture heights`);
  }
  const g = at(FIN_HIT + .01), sg = S(FIN_HIT + .01);
  assert.ok(g.q, 'one glass with its turn');
  g.faces.forEach((x, i) => {
    const n = qrot(g.q, FACES[i]);
    assert.ok(dist(x.c, [sg[0] + SMALL * ph * .7947 * n[0], sg[1] + SMALL * ph * .7947 * n[1]]) < 1e-9, `face ${i} not in its place in the glass on the star`);
  });
  // at the cut the anime's light is the burst at the middle, and the glass is there with it
  const after = at(SKY_FLASH + .001);
  assert.ok(dist(after.c, C) < 1e-9 && after.faces.every((x) => dist(x.c, C) < SMALL * ph * 1.1), 'the glass is not with the burst at the cut');
  assert.equal(g.hits, THROBS.length + 1);
  const late = at(SKY_FLASH - .005);
  assert.ok(late.core.a > .9 && (!late.sing || late.sing.rh < .02 * ph), 'the hole did not close into the glass');
  assert.ok(at(FIN_HIT + .09).sing.pinch > 0, 'the world is not pinched in after it');
});

test('the rise and the return: the gold opens out of the middle; the glass grows there to the hold, its turn slowing to a stand, the core in it', () => {
  const r0 = at(SKY_FLASH + .01).reveal, r1 = at(SKY_FLASH + .1).reveal;
  assert.ok(r0 && r1 && r1.r > r0.r && dist(r0.s, C) < 1e-12, 'no circle of light running out of the middle');
  const hold = at(SKY_HOLD);
  assert.equal(hold.phase, 'return');
  assert.ok(dist(hold.c, C) < 1e-12 && Math.abs(hold.r - HOME_R * ph) < 1e-9 && hold.core.a === 1, 'the glass is not home with its core');
  assert.ok(Math.abs(hold.aligned - 1) < 1e-9 && Math.abs(hold.outside - MASK_BACKGROUND) < 1e-9, 'not the window the entry takes');
  const spinRate = (t) => (at(t + .005).spin - at(t - .005).spin) / .01;
  assert.ok(Math.abs(spinRate(SKY_HOLD - .006)) < .1 * Math.abs(spinRate(SKY_FLASH + .05)), 'the glass does not come to a stand at the hold');
});

test('the anchor centre (his 04:3x, shown beside the light on the Canvas): the hole at the middle, the twelve about it where the light is, along the rays', () => {
  for (const t of times(GATHERED + .02, FINISH - .02, 30)) {
    const f = at(t, 'centre'), s = S(t);
    assert.ok(f.sing && dist(f.sing.c, C) < 1e-12, `the hole off the middle at ${t.toFixed(3)} s`);
    for (const x of f.faces) {
      const d = dist(x.c, C) / ph;
      if (Math.abs(x.c[1]) < .5 - x.s - 1e-6) assert.ok(d > .6 * RING && d < 1.7 * RING, `a face ${d.toFixed(3)} picture heights from the middle`);
      const ray = [x.c[0] - s[0], x.c[1] - s[1]], c = (x.ay[0] * ray[0] + x.ay[1] * ray[1]) / (Math.hypot(...x.ay) * Math.hypot(...ray));
      assert.ok(c > .8, `a face not along the ray from the light (cos ${c.toFixed(3)}) at ${t.toFixed(3)} s`);
    }
  }
  assert.ok(dist(at(SKY_HOLD, 'centre').c, C) < 1e-12, 'home at the middle');
});

test('cost: a sample in microseconds (the theater asks one a frame while the twelve fly, none at rest)', () => {
  const n = 4000, cpu0 = process.threadCpuUsage();
  let sink = 0;
  for (let i = 0; i < n; i++) sink += at(SKY_FLIGHT_START + (i % 600) / 600 * (SKY_HOLD - SKY_FLIGHT_START)).faces[i % 12].c[0];
  const cpu = process.threadCpuUsage(cpu0), us = (cpu.user + cpu.system) / n;
  assert.ok(Number.isFinite(sink));
  assert.ok(us < 200, `${us.toFixed(2)} us of CPU a sample`);
  console.log(`# a sample (the twelve and their velocities): ${us.toFixed(2)} us of CPU, one a frame`);
});

test('THE TWELVE end at the cut to the burst: the road hands the theater no flight from frame 1362, so no glass and no hole on the burst (his Oct 18 2026 00:5x WEST)', async () => {
  const {readFileSync} = await import('node:fs');
  const road = readFileSync(new URL('./hero-mount.js', import.meta.url), 'utf8');
  assert.match(road, /const skyFlight = t => freezeSpace && hold === null && t >= SKY_FLIGHT_START && t < SKY_FLASH;/);
  assert.doesNotMatch(road, /SKY_HOLD \+ HOLD_GRACE/, 'nothing of the twelve outlives the cut');
  assert.equal(Math.round(SKY_FLASH * 30000 / 1001), 1362);
});
