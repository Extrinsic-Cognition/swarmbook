// anti-satellites.test.mjs: DOLBAR'S ATTACK, his three acts on the film's own beats (his Oct 15 2026 02:2x WEST: "he charges a lot and then does
// hyper quicck attac from a distancr and then the other gguy blocks it"): the beats measured off the film (dolbar-beats.js, tools/dolbar-beats.mjs,
// measured again when the film and ffmpeg are here) and the code's beats on them within one frame; THE CHARGE (the swarm massing at his border,
// tightening, trembling and glowing with the build, nothing crossing), THE STRIKE (all at once from where they stand, landing by 254, one blow
// pressing on the shield on the beats), THE BLOCK (the last blow on 319, its peak on his tag, the shatter on the cut); THE DEFENCE (shieldFor,
// shieldAt, its cost a draw), THE RESISTANCE (the twelve's fire at the mass: resistanceAt), the data (dolbar-charge.js, the morpho-field) and the
// clock (mountAntiSatellites on a stand-in film and stage), without a browser.
// node --test embertide-app/ui/intro/dyson-society/lab/anti-satellites.test.mjs
import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {ANTI, FPS, frameTime, ORB, RISE, RELEASE, LANDED, PULSES, BLOCK, PEAK, WIND, GONE, LEVEL, GATHER, BUILD, SIGNALS, buildAt, blowAt, shareAt, chargeAt,
  flowAt, raidFor, swarmAt, formation, shieldFor, shieldAt, resistanceAt, mountAntiSatellites} from './anti-satellites.js';
import {BEATS} from './dolbar-beats.js';
import {SACRIFICE} from './sacrifice.js';
import {FIELD} from './dolbar-field.js';
import {measure as measureField, FRAMES as FIELD_FRAMES, moduleText as fieldText} from '../tools/morpho-field.mjs';
import {measure as measureBeats, beats as beatsOf, moduleText as beatsText} from '../tools/dolbar-beats.mjs';
import {CHARGE} from './dolbar-charge.js';
import {measure, isHalo} from '../tools/dolbar-charge.mjs';
import {koAt, KO} from './ko-edge.js'; import {filmStandIn} from '../worker/stand-ins.mjs';

const here = (f) => new URL(f, import.meta.url);
const src = fs.readFileSync(here('./anti-satellites.js'), 'utf8');
const page = fs.readFileSync(here('./hero-mount.js'), 'utf8');   // the hero's mount (app/warm.html mounts it itself since lane/one-page)
const FILM = fileURLToPath(here('../app/saint-seiya.mp4'));
const ffmpeg = spawnSync('ffmpeg', ['-version'], {stdio: 'ignore'}).status === 0;
const noFilm = (!fs.existsSync(FILM) && 'the film is not in this clone (GitHub strips it)') || (!ffmpeg && 'no ffmpeg here');
const {impact} = ANTI;
const on = (n) => chargeAt(frameTime(n)).on;
const bursts = [...page.match(/const BURSTS = \[(.*?)\];/)[1].matchAll(/t: ([\d.]+)/g)].map((m) => Number(m[1]));

// a stage 1600 x 900 with the sphere's centre 55 % across, as warm-sphere.js puts it, and twelve worlds round it
const worldsAt = (k = 0) => Array.from({length: 12}, (_, i) => [600 + 250 * Math.cos(i * 0.52 + k), 450 + 210 * Math.sin(i * 0.52 + k)]);
const G = {centre: [880, 450], radius: 180, width: 1600, height: 900, worlds: worldsAt().map(([x, y]) => [x + 280, y])};
const ring = G.radius * 1.5 * ANTI.end;
const PHONE = {centre: [0.55 * 390, 422], radius: 0.2 * 390, width: 390, height: 844};
const far = (w, g = G) => Math.hypot(w.x - g.centre[0], w.y - g.centre[1]);
const angle = (w, g = G) => Math.atan2(w.y - g.centre[1], w.x - g.centre[0]);
const frameOf = (t) => Math.floor(t * FPS + 0.5);   // the frame whose half-frame span holds second t

test('THE BEATS are the film\'s: measured again off app/saint-seiya.mp4 by tools/dolbar-beats.mjs, the same table', {skip: noFilm}, async () => {
  const m = await measureBeats(FILM);
  assert.deepEqual(m.red, [...CHARGE.share], 'its red is lab/dolbar-charge.js\'s');
  const b = beatsOf(m, {tag: SACRIFICE.tag});
  assert.deepEqual({...b, streaks: [...b.streaks]}, {...BEATS, streaks: [...BEATS.streaks]});
  assert.equal(beatsText(m, b, FILM), fs.readFileSync(here('./dolbar-beats.js'), 'utf8'));
});

test('THE BEATS, the film\'s frames read by eye (Oct 15 2026, every frame 96 to 351): orb 115, flood 134, release 251, streaks, hand 267, flash 286, sweep 290, hit 331', () => {
  assert.deepEqual({...BEATS, streaks: [...BEATS.streaks]}, {orb: 115, flood: 134, peak: 245, release: 251, streaks: [256, 259, 261, 264, 266], hand: 267, flash: 286, sweep: 290, hit: 331});
  // the release is no cut back to him: 192 (6.406 s) is, and he still charges there (no light); 251 is his hand thrust out in light
  assert.ok(shareAt(BEATS.peak) >= shareAt(192) && shareAt(BEATS.release) < shareAt(BEATS.release - 1) - 0.2, 'the red at its height before the release, and giving way on it');
  // the one who takes it, and his tag, are THE SACRIFICE's (lab/sacrifice.js): 319 and 325; his tag at 10.835 s is frame 325
  assert.deepEqual([SACRIFICE.first, SACRIFICE.tag, frameOf(10.835)], [319, 325, 325]);
});

test('the code\'s beats are the film\'s, within one frame: the strike on the release, landing by 254; the blows on the beats; the last on 319, its peak on 325; the cut on 331', () => {
  assert.equal(ORB, BEATS.orb);
  assert.equal(RISE, BEATS.flood);
  assert.equal(RELEASE, BEATS.release);
  assert.ok(LANDED - RELEASE <= 3, 'the strike crosses to the shield in at most 4 frames (0.13 s)');
  assert.deepEqual([...PULSES], [...BEATS.streaks, BEATS.hand, BEATS.flash, BEATS.sweep]);
  assert.deepEqual([BLOCK, PEAK], [SACRIFICE.first, SACRIFICE.tag]);
  assert.equal(impact, BEATS.hit);
  assert.equal(Math.round(bursts[0] * FPS), impact, 'the impact is the hero\'s first burst');
  // the swarm moves on them: the strike's state on the release's frame and not one before, on the ring on LANDED
  const states = (n) => new Set(swarmAt(n, G).map((w) => w.state));
  assert.deepEqual([...states(RELEASE - 1)], [1]);
  assert.deepEqual([...states(RELEASE)], [2]);
  assert.deepEqual([...states(LANDED - 1)], [2]);
  assert.deepEqual([...states(LANDED)], [3]);
  // each blow drives them in on its own frame: the blow's pulse at its height on the landing, every beat and the block, within one frame
  const blows = [LANDED, ...PULSES, BLOCK], pulse = (n) => blowAt(n).pulse;
  for (const b of blows) assert.ok(pulse(b) > pulse(b - 1) && (pulse(b) >= pulse(b + 1) || blows.includes(b + 1)), `a blow on ${b} (${frameTime(b).toFixed(3)} s): ${pulse(b - 1)}, ${pulse(b)}, ${pulse(b + 1)}`);
  for (let n = LANDED; n < impact; n++) if (pulse(n) > pulse(n - 1) + 1e-9 && pulse(n) > 0.4) assert.ok(blows.includes(n), `a blow on ${n}, no beat of the film`);
  // the last blow's peak is his tag: the shield's white-gold at its height there and only there
  let best = RISE;
  for (let n = ORB; n < impact; n++) if (blowAt(n).flare > blowAt(best).flare) best = n;
  assert.equal(best, PEAK);
});

test('nothing outside the window: on from the orb to the impact, a cut at both ends, a hair either side of a frame\'s time on its side', () => {
  for (let n = 0; n < 4625; n++) assert.equal(on(n), n >= ORB && n < impact, `frame ${n}`);
  for (const n of [ORB, impact]) for (const e of [-2e-6, 2e-6]) assert.equal(chargeAt(frameTime(n) + e).on, on(n));
  assert.deepEqual(formation(chargeAt(frameTime(impact)), {centre: [600, 450], radius: 180}), {antis: [], dashes: [], streaks: [], speed: [], speedAlpha: 0, glow: null});
  assert.equal(chargeAt(NaN).on, false);
  assert.equal(chargeAt(-1).on, false);
});

test('the charge: its brightness the red held, its build the red summed from the orb (1 at the release), the more red the faster', () => {
  assert.equal(LEVEL.length, impact - ORB);
  for (let i = 0; i < LEVEL.length; i++) {
    assert.ok(LEVEL[i] >= shareAt(ORB + i) - 1e-12 && LEVEL[i] <= 1, `level at ${ORB + i}`);
    if (i) assert.ok(GATHER[i] >= GATHER[i - 1] && BUILD[i] >= BUILD[i - 1], `gather or build falls at ${ORB + i}`);
  }
  assert.deepEqual([GATHER.at(-1), buildAt(RELEASE - 1), buildAt(RELEASE), buildAt(ORB - 1)], [1, 1, 1, 0]);
  // the more red the faster: the build over the 30 frames back in Dolbar's red (6.406 s) outruns the 30 of the cut to Seiya's pink light
  const over = (a) => buildAt(a + 30) - buildAt(a);
  assert.ok(over(192) > over(162) * 1.2, `${over(192)} against ${over(162)}`);
  assert.ok(buildAt(RISE) < 0.02, 'the orb\'s red is little: the charge builds from the flood');
});

test('the signals: the halo\'s first frame, each rise of the red over what it held, a twelfth of the charge between them; none from the release (his 23:09)', () => {
  assert.equal(SIGNALS[0].frame, RISE);
  assert.equal(SIGNALS[0].power, 1);
  for (let i = 1; i < SIGNALS.length; i++) assert.ok(SIGNALS[i].frame - SIGNALS[i - 1].frame >= Math.round(0.15 * FPS));
  assert.ok(SIGNALS.filter((s) => s.why === 'rise').some((s) => s.frame === 192), 'the cut back into Dolbar\'s red');
  assert.ok(SIGNALS.length >= 6 && SIGNALS.length <= 24, `${SIGNALS.length}`);
  assert.equal(ANTI.sent, RELEASE);
  assert.ok(SIGNALS.every((s) => s.frame < RELEASE), `${SIGNALS.map((s) => s.frame)}`);
  for (let n = RELEASE; n < impact; n++) assert.equal(chargeAt(frameTime(n)).signals.filter((s) => s.age === 0).length, 0, `no wave leaves at frame ${n}`);
  for (let n = RELEASE; n < impact; n++) assert.equal(formation(chargeAt(frameTime(n)), G).dashes.length, 0, `no dash runs at frame ${n}`);
  assert.equal(chargeAt(frameTime(RISE) - 1e-4).signals[0].age, 0, 'the signal leaves on its own frame, even at a time written a hair short of it');
});

test('ACT 1, HE CHARGES A LOT: the swarm comes in from past his border and masses there; nothing crosses to the sphere', () => {
  const N = ANTI.count, {mass} = raidFor(G), at = (n) => swarmAt(n, G);
  assert.equal(N, 36);
  // at the orb they wait past his edge (the left), level with the sphere, and set off within 0.8 s of it
  for (const w of at(ORB - 1)) assert.ok(w.state === 0 && w.x < 0, `${w.x}`);
  const starts = Array.from({length: N}, (_, i) => { for (let n = ORB; n < RELEASE; n++) if (at(n)[i].state) return n; return null; });
  assert.ok(Math.min(...starts) >= ORB && Math.max(...starts) <= ORB + Math.round(ANTI.mass.setOff * FPS), `${Math.min(...starts)} to ${Math.max(...starts)}`);
  assert.ok(mass[0] <= 0.1 * G.width + 1e-9 && Math.abs(mass[1] - G.centre[1]) < 1e-9, `the mass at ${mass}`);
  // nothing crosses: every one at his border, far outside the shield, until the release
  const edge = 0.1 * G.width + (ANTI.mass.wide[0] + ANTI.mass.tremble + ANTI.mass.sway) * G.width;
  for (let n = ORB; n < RELEASE; n++) for (const w of at(n)) if (w.state) assert.ok(w.x < edge && far(w) > 1.3 * ring && w.state === 1, `frame ${n}: ${w.x.toFixed(1)}, ${far(w).toFixed(1)}`);
});

test('ACT 1: the swarm charges with him: tighter, trembling and glowing more as the build and the red rise', () => {
  const at = (n) => swarmAt(n, G), spread = (n) => { const ys = at(n).filter((w) => w.state).map((w) => w.y); return Math.max(...ys) - Math.min(...ys); };
  assert.ok(spread(RELEASE - 1) < 0.85 * spread(RISE + 30), `the mass ${spread(RISE + 30).toFixed(0)} px tall at 5.5 s, ${spread(RELEASE - 1).toFixed(0)} at the release`);
  // the tremble: how far each moves from frame to frame grows with the build
  const shake = (a, b) => { let s = 0, k = 0; for (let n = a; n < b; n++) { const p = at(n), q = at(n + 1); for (let i = 0; i < p.length; i++) { s += Math.hypot(q[i].x - p[i].x, q[i].y - p[i].y); k++; } } return s / k; };
  assert.ok(shake(RELEASE - 20, RELEASE - 1) > 2 * shake(RISE + 25, RISE + 44), `${shake(RELEASE - 20, RELEASE - 1).toFixed(2)} px a frame at the height, ${shake(RISE + 25, RISE + 44).toFixed(2)} early`);
  // the glow: the sprites brighter and larger, the mass's own glow too
  const f = (n) => formation(chargeAt(frameTime(n)), G), a = f(RISE + 10), b = f(BEATS.peak);
  assert.ok(b.antis[0].alpha > a.antis[0].alpha && b.antis[0].size > a.antis[0].size && b.glow.alpha > 1.5 * a.glow.alpha, JSON.stringify([a.glow, b.glow]));
});

test('ACT 2, HYPER-QUICK ATTACK FROM A DISTANCE: on the release every one strikes at once from where it stood, a straight line each, on the shield by 254', () => {
  const at = (n) => swarmAt(n, G), plan = raidFor(G), stood = at(RELEASE - 1);
  for (let n = RELEASE; n < LANDED; n++) {
    for (const [i, w] of at(n).entries()) {
      const fx = plan.from[i * 2], fy = plan.from[i * 2 + 1], tx = plan.to[i * 2], ty = plan.to[i * 2 + 1];
      assert.deepEqual([fx, fy], [stood[i].x, stood[i].y], 'from where it stood');
      const cross = (w.x - fx) * (ty - fy) - (w.y - fy) * (tx - fx);
      assert.ok(Math.abs(cross) < 1e-3 * Math.hypot(tx - fx, ty - fy) ** 2, `frame ${n}: on its line`);
      assert.ok(far(w) > ring, `frame ${n}: not on the shield yet`);
    }
  }
  // it crosses the stage: from his border, at least 1.4 rings out, to the ring in three frames; its first frame already a third of the way
  for (const [i, w] of at(LANDED).entries()) {
    assert.ok(far(stood[i]) > 1.4 * ring, `swarmie ${i} struck from ${(far(stood[i]) / ring).toFixed(2)} rings`);
    assert.ok(far(w) <= ring + 1e-3 && far(w) > (1 - 2 * ANTI.raid.press - ANTI.raid.kick) * ring, `swarmie ${i} on the shield: ${(far(w) / ring).toFixed(3)}`);
    assert.ok(Math.hypot(at(RELEASE)[i].x - stood[i].x, at(RELEASE)[i].y - stood[i].y) > 0.3 * Math.hypot(plan.to[i * 2] - stood[i].x, plan.to[i * 2 + 1] - stood[i].y));
  }
  // one front: all along the blow's one way, as wide as the mass
  const ways = at(RELEASE).map((w) => w.heading);
  assert.ok(Math.max(...ways) - Math.min(...ways) < 1e-3, 'one way');
  // as streaks and speed lines, never a drift
  for (let n = RELEASE; n <= LANDED; n++) assert.equal(formation(chargeAt(frameTime(n)), G).streaks.length, ANTI.count, `frame ${n}`);
  for (let n = RELEASE; n < LANDED; n++) assert.ok(formation(chargeAt(frameTime(n)), G).speed.length >= 10, `frame ${n}`);
  assert.equal(formation(chargeAt(frameTime(RELEASE - 1)), G).streaks.length, 0);
});

test('ACT 2, ONE BLOW: from the landing each stays where it landed, pressing on the shield and driven in on each beat; no second approach, no wandering', () => {
  const at = (n) => swarmAt(n, G), landed = at(LANDED).map((w) => angle(w)), {press, kick, wind} = ANTI.raid;
  for (let n = LANDED; n < impact; n++) {
    for (const [i, w] of at(n).entries()) {
      assert.ok(Math.abs(Math.atan2(Math.sin(angle(w) - landed[i]), Math.cos(angle(w) - landed[i]))) < 1e-4, `frame ${n}, swarmie ${i}: off where it landed`);
      const e = far(w) / ring, back = n >= BLOCK - WIND && n < BLOCK;
      assert.ok(e >= 1 - press - kick - 1e-4 && e <= (back ? 1 + wind + 1e-4 : 1 + 1e-4), `frame ${n}: ${e.toFixed(4)} of the ring`);
      assert.ok(w.state >= 3);
    }
  }
  // driven deepest on each blow, out again between them
  const depth = (n) => far(at(n)[0]);
  for (const b of [LANDED, ...PULSES]) assert.ok((depth(b) < depth(b + 1) - 0.5 || PULSES.includes(b + 1)) && depth(b) < depth(b - 1) + 1e-6, `the beat on ${b}`);
});

test('ACT 3, THE OTHER GUY BLOCKS IT: the blow gathers itself, the last lands on 319 as he stands in it, peaks on his tag; none after it; the shield holds to the cut', () => {
  const at = (n) => swarmAt(n, G), e = (n) => far(at(n)[0]) / ring;
  // the blow gathering itself: pressing on to the frames before the block, drawn back over the last three, never back to his border
  for (let n = BEATS.sweep; n < BLOCK - WIND; n++) assert.ok(e(n) <= 1 + 1e-4, `frame ${n}`);
  for (let n = BLOCK - WIND; n < BLOCK; n++) assert.ok(e(n) > e(n - 1) && e(n) <= 1 + ANTI.raid.wind + 1e-4, `frame ${n}: ${e(n)}`);
  // the last blow lands on 319: back on the shield at once, pressed in harder, the shield flaring
  assert.ok(e(BLOCK) < 1 && e(BLOCK - 1) - e(BLOCK) > 0.05, `${e(BLOCK - 1)} then ${e(BLOCK)}`);
  assert.ok(blowAt(BLOCK).press - blowAt(BLOCK - 1).press > 0.3 && blowAt(BLOCK).flare > 0.65);
  // its peak on his tag; held over half to the cut; pressed deepest at the last frame before it
  for (let n = BLOCK + 1; n <= PEAK; n++) assert.ok(blowAt(n).flare > blowAt(n - 1).flare && blowAt(n).press >= blowAt(n - 1).press, `frame ${n}`);
  assert.equal(blowAt(PEAK).flare, 1);
  for (let n = PEAK + 1; n < impact; n++) assert.ok(blowAt(n).flare < blowAt(n - 1).flare && blowAt(n).flare > 0.55, `frame ${n}`);
  assert.equal(blowAt(impact - 1).press, 1);
  // no blow after the last: the pulse only falls from the block to the cut
  for (let n = BLOCK + 1; n < impact; n++) assert.ok(blowAt(n).pulse <= blowAt(n - 1).pulse, `frame ${n}`);
  // the cracks run from the peak, from under every one; the shield holds, every cell standing, to the last frame before the burst
  const sh = (n) => shieldAt(n, G);
  assert.equal(sh(PEAK).crackCount, 0);
  for (let n = PEAK + 1; n < impact; n++) assert.ok(sh(n).crack > sh(n - 1).crack, `frame ${n}`);
  assert.deepEqual([sh(impact - 1).crack, sh(impact - 1).crackCount, sh(impact - 1).age, sh(impact - 1).fade], [1, ANTI.count * 3 * 5, -1, 1]);
  assert.ok(sh(impact - 1).level.every((v) => v > 0.99));
  // the swarm is gone on the cut
  assert.equal(formation(chargeAt(frameTime(impact)), G).antis.length, 0);
});

test('the morpho-field says where Dolbar is: over the blast the film moves right, from him to Seiya, so his border is the left', () => {
  assert.equal(ANTI.border, 'left');
  let sx = 0, k = 0;
  for (let n = 192; n < 250; n++) for (let r = 0; r < FIELD.grid[1]; r++) for (let c = 0; c < FIELD.grid[0]; c++) {
    const [vx, vy] = flowAt(n, (FIELD.origin[0] + (c + 0.5) * FIELD.cell) / FIELD.decode[0], (FIELD.origin[1] + (r + 0.5) * FIELD.cell) / FIELD.decode[1]);
    if (vx || vy) { sx += vx; k++; }
  }
  assert.ok(k > 1000 && sx / k > 1, `${k} moving cells, mean vx ${(sx / k).toFixed(2)}`);
  for (const n of FIELD.cuts) assert.deepEqual(flowAt(n, 0.5, 0.5).map(Math.abs), [0, 0]);
  for (const n of [FIELD.from - 1, FIELD.to]) assert.deepEqual(flowAt(n, 0.5, 0.5), [0, 0]);
  assert.deepEqual(FIELD.cuts, [162, 192, 256, 267]);
  // the field sways the mass: some move off where the build alone would put them, within its bound
  const plain = raidFor({...G, width: G.width + 0.01});   // the same stage (memoized apart): the field is in both
  assert.equal(plain.pos.length, raidFor(G).pos.length);
});

test('the mass is the background: a phone held upright gets its own (at its edge, off the shield, landing on it); reduced motion is a still', () => {
  assert.doesNotMatch(src, /page\.style\.opacity/);
  const r = PHONE.radius * 1.5 * ANTI.end;
  for (let n = ORB; n < RELEASE; n++) for (const w of swarmAt(n, PHONE)) if (w.state) assert.ok(far(w, PHONE) > 1.05 * r, `frame ${n}`);
  for (const w of swarmAt(LANDED, PHONE)) assert.ok(far(w, PHONE) <= r + 1e-3 && far(w, PHONE) > 0.85 * r);
  // reduced motion: the mass at its height, the same at every frame, no dash, no streak, no speed line
  const a = formation(chargeAt(frameTime(RISE + 3), ANTI, {reduced: true}), G), b = formation(chargeAt(frameTime(impact - 2), ANTI, {reduced: true}), G);
  assert.equal(a.antis.length, 36);
  assert.deepEqual([a.dashes.length, a.streaks.length, a.speed.length], [0, 0, 0]);
  assert.deepEqual(a.antis.map((x) => [x.x, x.y]), b.antis.map((x) => [x.x, x.y]));
  for (const w of a.antis) assert.ok(far(w) > 1.3 * ring);
});

test('the field is the film\'s: measured again off app/saint-seiya.mp4, the same bytes', {skip: noFilm}, async () => {
  assert.deepEqual([FIELD.from, FIELD.to], [FIELD_FRAMES.from, FIELD_FRAMES.to]);
  assert.equal(fieldText(await measureField(FILM), FILM), fs.readFileSync(here('./dolbar-field.js'), 'utf8'));
});

test('the halo\'s colour: red and Dolbar\'s pink light are in, his purple armour, the blue sky, gold and the cave\'s black are out', () => {
  for (const [r, g, b] of [[214, 18, 30], [230, 60, 40], [240, 130, 150], [180, 20, 60]]) assert.ok(isHalo(r, g, b), `${r},${g},${b}`);
  for (const [r, g, b] of [[120, 80, 160], [60, 90, 170], [212, 163, 74], [30, 10, 12], [240, 230, 225], [255, 140, 0]]) assert.ok(!isHalo(r, g, b), `${r},${g},${b}`);
});

test('the data is the film\'s: measured again off app/saint-seiya.mp4, the same numbers', {skip: noFilm}, async () => {
  assert.equal(CHARGE.share.length, CHARGE.to - CHARGE.from);
  assert.deepEqual([...await measure(FILM)], [...CHARGE.share]);
});

test('the rule of one: no burst of the theater and no KO edge inside the window', () => {
  for (let n = ORB; n < impact; n++) assert.equal(koAt(frameTime(n)).on, false);
  assert.ok(impact < KO.frames.hit);
  for (const b of bursts) assert.equal(chargeAt(b).on, false, `${b} s`);
});

test('the hero carries its two lines: the import and the mount after the KO edge', () => {
  assert.match(page, /^import \{mountAntiSatellites\} from '\.\/anti-satellites\.js';$/m);
  const lines = page.split('\n'), ko = lines.findIndex((l) => l.includes('mountKoEdge({stage')), anti = lines.findIndex((l) => l.includes('mountAntiSatellites({stage'));
  assert.ok(ko > 0 && anti === ko + 1, `${ko}, ${anti}`);
  assert.equal(page.split('mountAntiSatellites').length - 1, 2);
});

test('nothing at rest in the source: no frame loop, no interval; the waiting frame callback is let go at the pause', () => {
  assert.doesNotMatch(src, /requestAnimationFrame\s*\(/);
  assert.doesNotMatch(src, /setInterval\s*\(/);
  assert.match(src, /const onPause = \(\) => \{ stop\(\); apply\(film\.currentTime\); \};/);
  assert.match(src, /film\.cancelVideoFrameCallback\?\.\(waiting\)/);
});

// a stand-in for the page: a stage with the sphere's canvas in a document, a 2D context that counts (and, asked to, writes down every call
// of the layer's with its numbers and styles: the picture it draws), and a film whose frames the test presents. now: the page's clock
function standIn({now = () => 0, record = false, size = [1205, 900]} = {}) {
  const idle = [], calls = {clear: 0, drawImage: 0, stroke: 0, contexts: [], log: []};
  const ctx2d = (owner) => {
    const g = {owner, canvas: owner};
    const mine = () => owner.id === 'hero-anti-satellites';   // the layer's own draws (the sprites' paint is counted apart)
    const log = (name, args) => { if (record && mine()) calls.log.push([name, ...args.filter((a) => typeof a === 'number' || typeof a === 'string')]); };
    for (const k of ['setTransform', 'beginPath', 'moveTo', 'lineTo', 'closePath', 'arc', 'fillRect']) g[k] = (...a) => log(k, a);
    g.fill = () => log('fill', [g.globalAlpha, g.fillStyle]);
    g.clearRect = (...a) => { if (mine()) calls.clear++; log('clearRect', a); };
    g.stroke = () => { if (mine()) calls.stroke++; log('stroke', [g.globalAlpha, g.strokeStyle, g.lineWidth]); };
    g.drawImage = (...a) => { if (mine()) calls.drawImage++; log('drawImage', [g.globalAlpha, ...a]); };
    g.createRadialGradient = () => ({addColorStop() {}});
    return g;
  };
  const node = (tag) => {
    const el = {
      tagName: tag.toUpperCase(), style: {}, attrs: {}, children: [], parent: null, width: 300, height: 150, id: '',
      setAttribute(k, v) { this.attrs[k] = v; },
      append(...xs) { for (const x of xs) { x.parent = this; this.children.push(x); } },
      after(x) { const sib = this.parent.children; x.parent = this.parent; sib.splice(sib.indexOf(this) + 1, 0, x); },
      remove() { const sib = this.parent.children; sib.splice(sib.indexOf(this), 1); this.parent = null; },
      getContext() { calls.contexts.push(this.id || this.tagName); this.ctx ??= ctx2d(this); return this.ctx; },
      getBoundingClientRect: () => ({left: 118, top: 75, width: size[0], height: size[1], right: 118 + size[0], bottom: 75 + size[1]}),
      querySelector(sel) { return sel === '#genesis-sphere' ? this.children.find((c) => c.id === 'genesis-sphere') ?? null : null; },
    };
    return el;
  };
  const sphereView = {radius: 0.2, yaw: 0, pitch: 0};
  const view = {
    devicePixelRatio: 2, getComputedStyle: () => ({position: 'relative'}), matchMedia: () => ({matches: false}), performance: {now},
    requestIdleCallback: (f) => idle.push(f), setTimeout: (f) => idle.push(f), genesisSphere: {getViewState: () => sphereView},
  };
  const doc = {defaultView: view, createElement: node};
  const stage = node('div');
  stage.ownerDocument = doc;
  const sphere = node('canvas'); sphere.id = 'genesis-sphere';
  const front = node('canvas'); front.id = 'hero-front';
  stage.append(sphere, front, node('button'));
  const film = filmStandIn();
  return {stage, film, idle, calls, sphere};
}

test('the clock: a frame callback only while the film plays near the window, one draw a presented frame, none at rest, nothing held outside', () => {
  const {stage, film, idle, calls} = standIn();
  const worlds = worldsAt().map(([x, y]) => ({x: x - 118, y: y - 75, r: 1.8}));
  let asked = 0;
  const anti = mountAntiSatellites({stage, film, worlds: () => { asked++; return worlds; }});
  assert.deepEqual(stage.children.map((c) => c.id || c.tagName), ['genesis-sphere', 'hero-front', 'hero-anti-satellites', 'BUTTON']);
  assert.equal(anti.element.style.zIndex, undefined);
  assert.equal(anti.element.style.pointerEvents, 'none');
  assert.equal(anti.element.style.visibility, 'hidden');
  assert.deepEqual(anti.stats.pixels, [0, 0]);
  assert.equal(anti.element.antiSatellites, anti);
  assert.equal(film.waiting, 0);
  assert.equal(idle.length, 1);
  idle.shift()();
  assert.equal(anti.stats.painted, true);
  // playing far from the window: timeupdate answers with a comparison, no frame callback, no draw
  film.paused = false; film.currentTime = 1; film.fire('play');
  for (const t of [1.25, 2, 2.5, 2.7]) { film.currentTime = t; film.fire('timeupdate'); }
  assert.equal(film.waiting, 0);
  assert.equal(anti.stats.draws, 0);
  // a second before the orb a timeupdate arms the frames; they keep asking while the film plays, one draw a presented frame inside
  film.currentTime = 2.9; film.fire('timeupdate');
  assert.equal(film.waiting, 1);
  for (let n = Math.round(2.9 * FPS); n < ORB + 60; n++) { film.currentTime = frameTime(n); film.present(); }
  assert.equal(film.waiting, 1);
  assert.equal(anti.stats.draws, 60);
  assert.equal(anti.element.style.visibility, 'visible');
  assert.deepEqual(anti.stats.pixels, [2410, 1800]);   // the stage at the page's 2x
  assert.equal(calls.clear, 60);
  assert.ok(calls.drawImage >= 12 * 30, `${calls.drawImage}`);
  assert.equal(asked, 60, 'the worlds read once a draw');
  film.fire('timeupdate');
  assert.equal(anti.stats.draws, 60, 'a timeupdate on a frame already drawn draws nothing');
  // the pause lets the waiting callback go; at rest nothing waits and nothing draws
  film.paused = true; film.fire('pause');
  assert.equal(film.waiting, 0);
  const draws = anti.stats.draws;
  film.fire('timeupdate');
  assert.equal(anti.stats.draws, draws);
  assert.equal(film.waiting, 0);
  // a seek while paused draws that second once and asks nothing
  film.currentTime = 7.75; film.fire('seeked');
  assert.equal(anti.stats.draws, draws + 1);
  assert.equal(film.waiting, 0);
  // played through the impact: the swarm gone on its cut, the shield's pieces flying on with the burst until 11.8 s; then hidden, its pixels
  // let go, and the frames stop asking
  film.paused = false; film.currentTime = 10.9; film.fire('play');
  for (let n = Math.round(10.9 * FPS); n < impact + 6; n++) { film.currentTime = frameTime(n); film.present(); }
  assert.equal(anti.element.style.visibility, 'visible');
  assert.equal(anti.stats.last.antis, 0);
  assert.ok(anti.stats.last.shield.cells > 0 && anti.stats.last.shield.age > 0, JSON.stringify(anti.stats.last));
  for (let n = impact + 6; n < GONE + 12; n++) { film.currentTime = frameTime(n); film.present(); }
  assert.equal(anti.element.style.visibility, 'hidden');
  assert.deepEqual(anti.stats.pixels, [0, 0]);
  assert.equal(film.waiting, 0);
  assert.ok(calls.contexts.every((c) => c !== 'genesis-sphere' && c !== 'hero-front'), JSON.stringify(calls.contexts));
  anti.destroy();
  assert.deepEqual(stage.children.map((c) => c.id || c.tagName), ['genesis-sphere', 'hero-front', 'BUTTON']);
  assert.equal(Object.values(film.listeners).flat().length, 0);
});

test('reduced motion: the mass still, drawn once as the orb lights, no frame callback, no signal, gone on the impact', () => {
  const {stage, film} = standIn();
  const anti = mountAntiSatellites({stage, film, reduced: true});
  const s = anti.at(7);
  assert.deepEqual([s.on, s.build, s.gather, s.signals.length], [true, 1, 1, 0]);
  film.paused = false; film.currentTime = 4; film.fire('play');
  assert.equal(film.waiting, 0);
  assert.equal(anti.stats.draws, 1);
  for (const t of [5.25, 6, 8.5, 9, 10.9]) { film.currentTime = t; film.fire('timeupdate'); }
  assert.equal(anti.stats.draws, 1, 'still: one draw for the whole window');
  assert.deepEqual([anti.stats.last.streaks, anti.stats.last.dashes], [0, 0]);
  film.currentTime = 11.2; film.fire('timeupdate');
  assert.equal(anti.element.style.visibility, 'hidden');
  anti.destroy();
});

// THE DEFENCE (his words, Oct 14 2026 22:2x WEST: "they dont have a shield up?"): the shield the sphere's side raises
const STAND = {centre: [1205 * 0.55, 450], radius: 180, width: 1205, height: 900};
const ringWorlds = () => worldsAt().map(([x, y]) => ({x: x + STAND.centre[0] - 600, y, r: 1.8}));
const sideLight = (s, plan, sign) => { let sum = 0, k = 0; for (let c = 0; c < plan.cells; c++) if (sign * Math.cos(c * plan.half) > 0.5) { sum += s.level[c]; k++; } return sum / k; };

test('THE DEFENCE: the shield is the ring they keep outside of until the strike, hexagonal cells round it; before the swarm sets off there is nothing', () => {
  const plan = shieldFor(G);
  assert.equal(plan.ring, ring);
  assert.deepEqual([plan.K, plan.cells], [96, 192]);
  assert.equal(shieldFor(PHONE).K, 84);
  const s = shieldAt(RELEASE - 1, G);
  for (let c = 0; c < plan.cells; c++) {
    const corner = (j) => [s.verts[c * 12 + j * 2], s.verts[c * 12 + j * 2 + 1]], d = ([x, y]) => Math.hypot(x - G.centre[0], y - G.centre[1]);
    for (let j = 0; j < 6; j++) {
      assert.ok(d(corner(j)) <= ring + 0.25 * plan.cell + 1e-3 && d(corner(j)) >= ring - 3.25 * plan.cell - 1e-3, `cell ${c}`);
      const [x0, y0] = corner(j), [x1, y1] = corner((j + 1) % 6), side = Math.hypot(x1 - x0, y1 - y0);
      assert.ok(side > 0.85 * plan.cell && side < 1.15 * plan.cell, `cell ${c}, side ${j}: ${side} against ${plan.cell}`);
    }
  }
  const first = Math.min(...Array.from({length: ANTI.count}, (_, i) => { for (let n = ORB; n < impact; n++) if (swarmAt(n, G)[i].state) return n; return Infinity; }));
  for (let n = ORB - 5; n < first; n++) assert.equal(shieldAt(n, G).on, false, `frame ${n}`);
  for (const n of [0, ORB - 1, GONE, GONE + 30, 4000, NaN]) assert.equal(shieldAt(n, G).on, false, `frame ${n}`);
});

test('THE DEFENCE: the twelve feel it coming: it rises with the charge\'s build, the side facing the mass first, whole before the blast', () => {
  const plan = shieldFor(G);
  for (let n = ORB; n < RELEASE; n++) assert.ok(Math.abs(shieldAt(n, G).strength - (() => { const x = Math.min(1, buildAt(n) / ANTI.shield.rise); return x * x * (3 - 2 * x); })()) < 1e-6, `frame ${n}`);
  let was = -1;
  for (const t of [5.5, 6, 6.5, 7, 7.5]) { const s = shieldAt(frameOf(t), G).strength; assert.ok(s > was, `${t} s`); was = s; }
  // the left, facing the mass, over the right while it rises; whole all round before the release
  for (const t of [5.5, 6.5]) { const s = shieldAt(frameOf(t), G); assert.ok(sideLight(s, plan, -1) > sideLight(s, plan, 1) + 0.15, `${t} s`); }
  const up = shieldAt(RELEASE - 1, G);
  assert.deepEqual([up.strength, up.closure], [1, 1]);
  assert.ok(Math.min(...up.level) >= 0.97, `${Math.min(...up.level)}`);
  let half = null;
  for (let n = ORB; n < RELEASE && half === null; n++) if (sideLight(shieldAt(n, G), plan, -1) >= 0.5) half = n;
  assert.ok(half !== null && half < frameOf(6.6), `the left half up at ${frameTime(half).toFixed(2)} s`);
});

test('THE DEFENCE is held up by the twelve: a tether of light from each world outside the sphere\'s face to its nearest cells; with no worlds it stands alone', () => {
  const {stage, film, idle, calls} = standIn({record: true});
  let worlds = ringWorlds();
  const anti = mountAntiSatellites({stage, film, worlds: () => worlds});
  idle.shift()(); idle.shift()();
  film.currentTime = 9.0; film.fire('seeked');
  const tied = anti.stats.last.shield.tied, light = calls.log.filter(([k]) => k === 'stroke').length;
  assert.ok(tied >= 8 && tied <= 12, `${tied} worlds tie`);
  assert.ok(calls.log.some(([k, x, y]) => k === 'moveTo' && worlds.some((w) => Math.abs(w.x - x) < 1e-9 && Math.abs(w.y - y) < 1e-9)));
  worlds = [];
  calls.log.length = 0; film.currentTime = 9.1; film.fire('seeked');
  assert.equal(anti.stats.last.shield.tied, 0);
  assert.ok(anti.stats.last.shield.cells > 150 && calls.log.filter(([k]) => k === 'stroke').length < light);
  anti.destroy();
});

test('THE DEFENCE takes the blow: the strike lands lighting the cells under every one; each beat and the block flare it; it is dented, never broken, to the cut', () => {
  const plan = shieldFor(G), at = (n) => shieldAt(n, G);
  for (let n = ORB; n < RELEASE; n++) assert.deepEqual([at(n).flare, at(n).press, at(n).crackCount], [0, 0, 0], `frame ${n}`);
  const lit = at(LANDED + 2).glow.filter((v) => v > 0.2).length;
  assert.ok(lit >= 30, `${lit} of ${plan.cells} cells lit by the landing`);
  for (const b of [LANDED, ...PULSES]) assert.ok(at(b).flare > at(b - 1).flare && (at(b).flare > at(b + 1).flare - 1e-9 || PULSES.includes(b + 1)), `the shield flares on ${b}`);
  for (let n = LANDED; n < impact; n++) assert.ok(at(n).press > 0 && at(n).press <= 1 && at(n).age === -1, `frame ${n}`);
  // the lit cells are where the blow is: the side facing his border
  const s = at(BLOCK + 1);
  assert.ok(sideLight({level: s.glow}, plan, -1) > 4 * sideLight({level: s.glow}, plan, 1) + 0.01);
});

test('THE HANDOVER: at the burst (frame 331) the shield shatters outward with the theater\'s blast; its pieces lie outside the ring, and are gone by 11.8 s', () => {
  for (const g of [G, PHONE]) {
    const plan = shieldFor(g), rg = g.radius * 1.5 * ANTI.end, d = (s, c) => Math.hypot(s.centres[c * 2] - g.centre[0], s.centres[c * 2 + 1] - g.centre[1]);
    const before = shieldAt(impact - 1, g), burst = shieldAt(impact, g);
    assert.deepEqual([before.age, burst.age, burst.on], [-1, 0, true]);
    for (let j = 0; j < before.verts.length; j++) assert.ok(Math.abs(burst.verts[j] - before.verts[j]) < 1e-3, 'each piece leaves from where its cell stood');
    for (let n = impact + 3; n < GONE; n++) {
      const s = shieldAt(n, g), prev = shieldAt(n - 1, g);
      for (let c = 0; c < plan.cells; c++) assert.ok(d(s, c) > rg && d(s, c) > d(prev, c), `frame ${n}, piece ${c}`);
      assert.ok(s.fade < prev.fade);
    }
    assert.ok(Math.max(...Array.from({length: 8}, (_, k) => shieldAt(impact + k, g).flare)) > 0.999);
    assert.equal(shieldAt(impact + 4, g).crackCount, 0);
    assert.equal(shieldAt(impact + 6, g).tether, 0);
    assert.ok(shieldAt(GONE - 1, g).fade < 0.01);
    assert.deepEqual([GONE, frameTime(GONE).toFixed(3), shieldAt(frameOf(11.8), g).on], [frameOf(11.8), '11.812', false]);
  }
});

test('THE DEFENCE has no pops: every number of it eased from frame to frame, a blow\'s flash over two frames, from the orb to the last piece', () => {
  for (const g of [G, PHONE]) {
    const plan = shieldFor(g), worst = {};
    let prev = shieldAt(ORB, g);
    for (let n = ORB + 1; n < GONE; n++) {
      const s = shieldAt(n, g), step = (k, v) => { worst[k] = Math.max(worst[k] ?? 0, v); };
      for (const k of ['strength', 'closure', 'flare', 'crackAlpha', 'fade', 'tether', 'press']) step(k, Math.abs(s[k] - prev[k]));
      for (let c = 0; c < plan.cells; c++) { step('level', Math.abs(s.level[c] - prev.level[c])); step('glow', Math.abs(s.glow[c] - prev.glow[c])); }
      prev = s;
    }
    const bound = {strength: 0.06, closure: 0.25, flare: 0.45, crackAlpha: 0.4, fade: 0.07, tether: 0.25, press: 0.4, level: 0.12, glow: 0.35};
    for (const [k, b] of Object.entries(bound)) assert.ok(worst[k] <= b, `${k} moves ${worst[k].toFixed(3)} in a frame (${g.width} px stage)`);
  }
});

test('THE DEFENCE is a pure function of the film\'s frame and the stage: the same frame twice is the same picture, a seek or a play, from memory or afresh', () => {
  const frames = [ORB, RISE, 190, 230, RELEASE, LANDED + 1, 300, BLOCK - 1, PEAK, impact - 1, impact + 5, GONE - 1];
  const once = frames.map((n) => shieldAt(n, G));
  shieldAt(250, {centre: [400, 300], radius: 120, width: 900, height: 700});   // another stage between
  assert.deepEqual(frames.map((n) => shieldAt(n, {...G, worlds: []})), once);
  assert.equal(shieldFor(G), shieldFor({...G}));
  assert.deepEqual({...shieldAt(300, G, ANTI, {reduced: true}), frame: 0}, {...shieldAt(200, G, ANTI, {reduced: true}), frame: 0});
  const {stage, film, idle, calls} = standIn({record: true});
  const worlds = ringWorlds();
  const anti = mountAntiSatellites({stage, film, worlds: () => worlds});
  idle.shift()(); idle.shift()();
  const picture = (t, from) => { film.currentTime = from; film.fire('seeked'); calls.log.length = 0; film.currentTime = t; film.fire('seeked'); return calls.log.slice(); };
  for (const t of [7.75, frameTime(RELEASE + 1), frameTime(PEAK), frameTime(impact + 6)]) {
    const a = picture(t, 5.2), b = picture(t, 10.95);
    assert.ok(a.length > 1000, `${a.length} calls`);
    assert.deepEqual(a, b, `${t} s`);
  }
  anti.destroy();
});

test('THE DEFENCE under prefers-reduced-motion: a faint still ring, no tether, no ripple, no flare, no pieces; drawn once', () => {
  for (const n of [ORB, 250, BLOCK, impact - 1]) {
    const s = shieldAt(n, G, ANTI, {reduced: true});
    assert.ok(s.on && s.level.every((v) => Math.abs(v - ANTI.shield.still) < 1e-6) && s.glow.every((v) => v === 0), `frame ${n}`);
    assert.deepEqual([s.tether, s.flare, s.crackCount, s.age, s.press], [0, 0, 0, -1, 0]);
  }
  const {stage, film} = standIn();
  const anti = mountAntiSatellites({stage, film, reduced: true, worlds: () => worldsAt().map(([x, y]) => ({x, y, r: 1.8}))});
  film.paused = false; film.currentTime = 6; film.fire('play');
  for (const t of [7, 9, 10.9]) { film.currentTime = t; film.fire('timeupdate'); }
  assert.equal(anti.stats.draws, 1);
  assert.deepEqual([anti.stats.last.shield.cells, anti.stats.last.shield.tied, anti.stats.last.shield.flare], [192, 0, 0]);
  film.currentTime = 11.1; film.fire('timeupdate');
  assert.equal(anti.element.style.visibility, 'hidden', 'no pieces fly: it goes on the impact');
  anti.destroy();
});

test('THE COST: the whole layer under 0.5 ms a draw at 36 swarmies and 12 worlds (measured here, in node), its plan worked out in idle time', (t) => {
  const {stage, film, idle} = standIn({now: () => performance.now(), size: [1440, 900]});
  const worlds = ringWorlds().map((w) => ({...w, x: w.x - STAND.centre[0] + 1440 * 0.55}));
  const anti = mountAntiSatellites({stage, film, worlds: () => worlds});
  const timed = (f) => { const t0 = performance.now(); f(); return performance.now() - t0; };
  const raidMs = timed(idle.shift()), shieldMs = timed(idle.shift());
  // each frame's draw timed in each of five passes (a loaded Mac only adds time, so each frame's best is its cost, as heartbeat.test does)
  const best = new Map();
  for (let pass = 0; pass < 5; pass++) {
    film.paused = false; film.currentTime = frameTime(ORB - 30); film.fire('play');
    for (let n = ORB - 30; n < GONE + 12; n++) {
      const was = anti.stats.drawMs, draws = anti.stats.draws;
      film.currentTime = frameTime(n); film.present();
      if (anti.stats.draws > draws) best.set(n, Math.min(best.get(n) ?? Infinity, anti.stats.drawMs - was));
    }
    film.paused = true; film.fire('pause');
  }
  const ms = [...best.values()], mean = ms.reduce((s, v) => s + v, 0) / ms.length, of = (a, b) => { const v = [...best].filter(([n]) => n >= a && n < b).map(([, x]) => x); return v.reduce((s, x) => s + x, 0) / v.length; };
  t.diagnostic(`a draw (formation, the shield, the tethers, the twelve's fire, every canvas call to a no-op context), each frame's best of five passes: ${mean.toFixed(3)} ms on average; the charge ${of(ORB, RELEASE).toFixed(3)}, the strike and the blow ${of(RELEASE, BLOCK).toFixed(3)}, the block ${of(BLOCK, impact).toFixed(3)}, the shatter ${of(impact, GONE).toFixed(3)}; the slowest frame ${Math.max(...ms).toFixed(3)} ms; ${anti.stats.draws / 5} draws a pass; in idle time the raid ${raidMs.toFixed(1)} ms, its shield ${shieldMs.toFixed(1)} ms`);
  assert.deepEqual([best.size, anti.stats.draws], [GONE - ORB, 5 * (GONE - ORB)]);
  assert.ok(mean < 0.5 && Math.max(...ms) < 0.5, `${mean} ms a draw on average, the slowest ${Math.max(...ms)}`);
  const plan = shieldFor({centre: [1440 * 0.55, 450], radius: 180, width: 1440, height: 900});
  // the shield's numbers held for the stage, the orb to the last piece (239 frames): under 110 kB
  assert.ok(plan.level.byteLength + plan.glow.byteLength + plan.glob.byteLength < 110e3, `${plan.level.byteLength + plan.glow.byteLength + plan.glob.byteLength} bytes`);
  anti.destroy();
});

// THE RESISTANCE (his words, Oct 14 2026 23:15 WEST: "how many times i said you gotta make the ones here defending or react in a way to the
// attacking ones diomerda... just some futile resistence dude"): the twelve fire at the mass while he charges
const FLIGHT = 4;
const segmentNear = (x0, y0, x1, y1, [cx, cy]) => { const dx = x1 - x0, dy = y1 - y0, k = Math.min(1, Math.max(0, ((cx - x0) * dx + (cy - y0) * dy) / (dx * dx + dy * dy || 1))); return Math.hypot(x0 + dx * k - cx, y0 + dy * k - cy); };

test('THE RESISTANCE: the twelve fire at the mass from the flood, more as the charge builds, and stop at the release (the blow overtakes their fire)', () => {
  const plan = shieldFor(G), S = plan.shots, fired = [];
  for (let k = 0; k < S.length; k += 4) fired.push(S[k]);
  assert.ok(fired.length >= 30 && fired.length <= 90, `${fired.length} shots`);
  assert.ok(fired[0] > RISE && fired.at(-1) < RELEASE, `${frameTime(fired[0])} to ${frameTime(fired.at(-1))} s`);
  const mid = (fired[0] + RELEASE) / 2;
  assert.ok(fired.filter((n) => n >= mid).length > 1.4 * fired.filter((n) => n < mid).length, 'more as the charge builds');
  let bolts = 0;
  for (let n = ORB; n < impact; n++) {
    const z = resistanceAt(n, G);
    if (n < fired[0] || n >= RELEASE) assert.deepEqual([z.boltCount, z.flashCount, z.ringCount], [0, 0, 0], `frame ${n}`);
    bolts += z.boltCount;
    for (let q = 0; q < z.flashCount; q++) assert.ok(G.worlds.some(([x, y]) => Math.hypot(x - z.flashes[q * 4], y - z.flashes[q * 4 + 1]) < 1e-3), `frame ${n}: a flash off the worlds`);
    for (let b = 0; b < z.boltCount; b++) {
      const [x0, y0, x1, y1] = z.bolts.subarray(b * 5, b * 5 + 4);
      assert.ok(G.worlds.some(([x, y]) => Math.abs((x1 - x0) * (y - y0) - (y1 - y0) * (x - x0)) / Math.hypot(x1 - x0, y1 - y0) < 0.01), `frame ${n}: a bolt off every world's line`);
      assert.ok(segmentNear(x0, y0, x1, y1, G.centre) > G.radius * 1.02, `frame ${n}: a bolt across the sphere`);
    }
  }
  assert.ok(bolts > 60, `${bolts} bolts drawn`);
  // firing turns into holding: the tethers under half while they fire, whole once the blow comes
  const fight = shieldAt(RELEASE - 1, G), hold = shieldAt(LANDED + 2, G);
  assert.ok(Math.abs(fight.tether - 0.45 * fight.strength) < 1e-6 && hold.tether > 0.99, `${fight.tether} then ${hold.tether}`);
});

test('THE RESISTANCE: a world over the sphere\'s face does not fire (no bolt across the film), and with no world in reach nothing fires', () => {
  const inside = {...G, worlds: [[880 + 100, 450 - 60], [880 - 120, 450 + 40], [880, 450]]};
  const out = {...G, worlds: [[1580, 20], [1580, 880]]};
  for (let n = ORB; n < impact; n++) for (const g of [inside, out, {...G, worlds: []}]) {
    const z = resistanceAt(n, g);
    assert.deepEqual([z.shots, z.boltCount, z.flashCount, z.ringCount], [0, 0, 0, 0], `frame ${n}`);
    assert.ok(z.kick.every((v) => v === 0));
  }
  const both = {...G, worlds: [...G.worlds, [880 + 60, 450 + 30]]};
  let from = 0;
  for (let n = ORB; n < RELEASE; n++) { const z = resistanceAt(n, both); for (let q = 0; q < z.flashCount; q++) { assert.ok(Math.hypot(z.flashes[q * 4] - 940, z.flashes[q * 4 + 1] - 480) > 1, `frame ${n}`); from++; } }
  assert.ok(from > 50, `${from}`);
});

test('THE RESISTANCE is futile: a hit flares the swarmie and throws it back along the bolt, then it comes on again; none falls, a few miss', () => {
  const J = ANTI.resist.jolt * G.radius;
  let hits = 0, misses = 0, most = 0, along = 0;
  for (let n = ORB; n < RELEASE; n++) {
    const z = resistanceAt(n, G);
    hits += [...Array(z.ringCount).keys()].filter((q) => z.rings[q * 4 + 2] === 0).length;
    for (let b = 0; b < z.boltCount; b++) if (z.bolts[b * 5 + 4] < 1) misses++;
    for (let i = 0; i < ANTI.count; i++) {
      const dx = z.kick[i * 3], dy = z.kick[i * 3 + 1], k = Math.hypot(dx, dy);
      most = Math.max(most, k);
      // thrown back: away from the sphere, toward his border (the bolts come from the twelve's loop)
      if (k > 0.5 * J) { const w = swarmAt(n, G)[i], ux = w.x - G.centre[0], uy = w.y - G.centre[1]; if ((dx * ux + dy * uy) / (k * Math.hypot(ux, uy)) > 0.3) along++; else along -= 10; }
      assert.ok(z.kick[i * 3 + 2] >= 0 && z.kick[i * 3 + 2] <= 1);
    }
  }
  assert.ok(hits >= 25 && misses >= 3, `${hits} hits, ${misses} frames of missing bolts`);
  assert.ok(most > 0.9 * J && most < 2.5 * J, `the largest throw ${most.toFixed(1)} px against ${J.toFixed(1)}`);
  assert.ok(along > 0, 'thrown back along the bolt');
  // none falls: every one drawn from the set-off to the impact, on its own path (the throw is only drawn)
  for (let n = frameOf(4.8); n < impact; n++) assert.equal(formation(chargeAt(frameTime(n)), G).antis.length, ANTI.count, `frame ${n}`);
  const f = formation(chargeAt(frameTime(230)), G), raid = swarmAt(230, G);
  for (const a of f.antis) assert.deepEqual([a.x, a.y], [raid[a.i].x, raid[a.i].y]);
});

test('THE RESISTANCE has no pops while they fire and is a pure function of the frame and the stage; reduced motion: no bolts', () => {
  const J = ANTI.resist.jolt * G.radius;
  let prev = resistanceAt(ORB, G);
  for (let n = ORB + 1; n < RELEASE; n++) {
    const z = resistanceAt(n, G);
    for (let i = 0; i < ANTI.count; i++) {
      assert.ok(Math.hypot(z.kick[i * 3] - prev.kick[i * 3], z.kick[i * 3 + 1] - prev.kick[i * 3 + 1]) <= 0.65 * J + 1e-9, `frame ${n}, swarmie ${i}: thrown at once`);
      assert.ok(Math.abs(z.kick[i * 3 + 2] - prev.kick[i * 3 + 2]) <= 0.65, `frame ${n}, swarmie ${i}: its flare`);
    }
    prev = z;
  }
  for (const n of [200, 220, 240, RELEASE - 1]) {
    assert.deepEqual(resistanceAt(n, G), resistanceAt(n, {...G, worlds: G.worlds.map((p) => [...p])}));
    const still = resistanceAt(n, G, ANTI, {reduced: true});
    assert.deepEqual([still.shots, still.boltCount, still.flashCount, still.ringCount], [0, 0, 0, 0]);
  }
  const {stage, film} = standIn();
  const anti = mountAntiSatellites({stage, film, reduced: true, worlds: ringWorlds});
  film.paused = false; film.currentTime = 8; film.fire('play');
  assert.deepEqual(anti.stats.last.resist, {shots: 0, bolts: 0, flashes: 0, hits: 0});
  anti.destroy();
});
