// orbit-kick.test.mjs: the sphere's worlds are thrown by each burst and come back to their loop, and only they move; and they hear the film
// (orbit-kick.js, satellites-score.js).
// node --test orbit-kick.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import {kickAt, kickNear, createOrbitKick, KICK, hearAt, saidAt, throbAt, hears, LOOP, TURNS, FELT} from './orbit-kick.js';
import {SCORE} from './satellites-score.js';
import {SPHERE_X} from '../app/sphere-centre.mjs';

const BURSTS = [{t: 11.044, power: 1}, {t: 37.10, power: 1}];

test('a kick starts just after its burst, throws the worlds out first, and is spent within its seconds', () => {
  assert.deepEqual(kickAt(11.0, BURSTS), [0, 0]);
  assert.deepEqual(kickAt(11.044 + 0.12, BURSTS), [0, 0]);
  const outs = [], turns = [];
  for (let s = 11.2; s < 11.044 + 0.12 + KICK; s += 0.01) { const [o, t] = kickAt(s, BURSTS); outs.push(o); turns.push(t); }
  assert.ok(Math.abs(Math.max(...outs) - 0.62) < 0.005, `the farthest out is 0.62 of the loop, not ${Math.max(...outs)}`);
  assert.ok(Math.abs(Math.max(...turns) - 0.3) < 0.005, `the farthest round is 0.3 rad, not ${Math.max(...turns)}`);
  assert.ok(Math.min(...outs) < -0.05, 'they swing back in past the loop');
  assert.ok(Math.abs(kickAt(11.044 + 0.12 + KICK - 0.01, BURSTS)[0]) < 0.002, 'the swing is spent before the kick ends');
  assert.deepEqual(kickAt(20, BURSTS), [0, 0]);
});

test('the context answers from just before a burst until its wake has left the 15.5 s trails, and not between', () => {
  assert.equal(kickNear(10.0, BURSTS), false);
  assert.equal(kickNear(10.6, BURSTS), true);
  assert.equal(kickNear(11.044 + 0.12 + KICK + 15.4, BURSTS), true);
  assert.equal(kickNear(11.044 + 0.12 + KICK + 15.6, BURSTS), false);
  assert.equal(kickNear(36.7, BURSTS), true);
  assert.equal(kickNear(80, BURSTS), false);
});

// a 2D context as the page's sphere has one: styles on the prototype, the calls it is given kept
class Ctx {
  constructor() { this.calls = []; this.stroke = '#000000'; this.fill = '#000000'; this.width = 1; this.saved = []; }
  get strokeStyle() { return this.stroke; } set strokeStyle(v) { this.stroke = v; }
  get fillStyle() { return this.fill; } set fillStyle(v) { this.fill = v; }
  get lineWidth() { return this.width; } set lineWidth(v) { if (v > 0 && v < Infinity) this.width = v; }
  save() { this.saved.push([this.stroke, this.fill, this.width]); }
  restore() { [this.stroke, this.fill, this.width] = this.saved.pop(); }
  moveTo(x, y) { this.calls.push(['moveTo', x, y]); }
  lineTo(x, y) { this.calls.push(['lineTo', x, y]); }
  arc(x, y, r) { this.calls.push(['arc', x, y, r]); }
}
// (the kick's own tests run with the worlds deaf to the film: hear false)
const page = (hear = false) => {
  const ctx = new Ctx(), film = {currentTime: 11.7}, doc = {timeline: {currentTime: 1}, defaultView: {ResizeObserver: class { observe() {} disconnect() {} }}};
  const canvas = {getContext: () => ctx, getBoundingClientRect: () => ({width: 1000, height: 800}), ownerDocument: doc};
  return {ctx, film, doc, kick: createOrbitKick({canvas, film, bursts: BURSTS, hear})};
};
const C = [1000 * SPHERE_X, 400];   // the sphere's centre (app/sphere-centre.mjs), halfway down
const kicked = ([x, y], s) => {
  const [out, turn] = kickAt(s, BURSTS), dx = x - C[0], dy = y - C[1];
  return [C[0] + (dx * Math.cos(turn) - dy * Math.sin(turn)) * (1 + out), C[1] + (dx * Math.sin(turn) + dy * Math.cos(turn)) * (1 + out)];
};
const near = (a, b) => a.every((v, i) => Math.abs(v - b[i]) < 1e-9);

test('in a lane colour a world moves by the kick of now and flares; a trail point by the kick of its own second', () => {
  const {ctx, kick} = page();
  kick.at(11.7);
  assert.equal(kick.on, true);
  ctx.save(); ctx.fillStyle = '#A98242';
  ctx.arc(700, 300, 1.8, 0, 7);
  const [, x, y, r] = ctx.calls.at(-1);
  assert.ok(near([x, y], kicked([700, 300], 11.7)));
  assert.ok(Math.abs(r - 1.8 * (1 + 1.2 * kickAt(11.7, BURSTS)[0])) < 1e-9);
  // a segment 0.25 of the way down the trail: width .35 + .9 * .75; its start one step older
  ctx.strokeStyle = '#438C82'; ctx.lineWidth = 0.35 + 0.9 * 0.75;
  ctx.moveTo(800, 500); ctx.lineTo(810, 505);
  assert.ok(near(ctx.calls.at(-2).slice(1), kicked([800, 500], 11.7 - (0.25 + 1 / 64) * 15.5)));
  assert.ok(near(ctx.calls.at(-1).slice(1), kicked([810, 505], 11.7 - 0.25 * 15.5)));
  ctx.restore();
});

test('nothing in another colour moves, a restore gives back what the save held, and outside the windows the context is its own', () => {
  const {ctx, film, kick} = page();
  kick.at(11.7);
  ctx.strokeStyle = 'rgba(132,111,63,.21)'; ctx.moveTo(1, 2); ctx.lineTo(3, 4);
  ctx.save(); ctx.strokeStyle = '#B49A68'; ctx.restore();
  ctx.lineTo(5, 6);
  assert.deepEqual(ctx.calls, [['moveTo', 1, 2], ['lineTo', 3, 4], ['lineTo', 5, 6]]);
  film.currentTime = 40;
  kick.at(80);
  assert.equal(kick.on, false);
  assert.equal(Object.getPrototypeOf(ctx), Ctx.prototype);
  ctx.strokeStyle = '#B49A68'; ctx.lineTo(7, 8);
  assert.deepEqual(ctx.calls.at(-1), ['lineTo', 7, 8]);
});

// THE HUSH: a 2D context with what the page's frame uses, every call kept with the canvas it went to
class Ctx2 {
  constructor(name, log) { this.name = name; this.log = log; this.s = {stroke: '#000000', fill: '#000000', join: 'miter', alpha: 1, width: 1}; this.saved = []; this.m = [1, 0, 0, 1, 0, 0]; }
  get strokeStyle() { return this.s.stroke; } set strokeStyle(v) { this.s.stroke = v; }
  get fillStyle() { return this.s.fill; } set fillStyle(v) { this.s.fill = v; }
  get lineJoin() { return this.s.join; } set lineJoin(v) { this.s.join = v; }
  get globalAlpha() { return this.s.alpha; } set globalAlpha(v) { this.s.alpha = v; }
  get lineWidth() { return this.s.width; } set lineWidth(v) { this.s.width = v; }
  save() { this.saved.push({...this.s}); }
  restore() { this.s = this.saved.pop() ?? this.s; }
  getTransform() { return [...this.m]; }
  setTransform(...m) { this.m = m.length === 1 ? [...m[0]] : m; }
  clearRect() { this.log.push([this.name, 'clearRect']); }
  beginPath() {}
  moveTo(x, y) { this.log.push([this.name, 'moveTo', x, y]); }
  lineTo(x, y) { this.log.push([this.name, 'lineTo', x, y]); }
  arc(x, y, r) { this.log.push([this.name, 'arc', x, y, r]); }
  fill() { this.log.push([this.name, 'fill', this.s.fill]); }
  stroke() { this.log.push([this.name, 'stroke', this.s.stroke]); }
  drawImage() { this.log.push([this.name, 'drawImage']); }
  fillText(text) { this.log.push([this.name, 'fillText', text]); }
  strokeText(text) { this.log.push([this.name, 'strokeText', text]); }
}
const hushedPage = (t = 80, hear = false) => {
  const log = [], ctx = new Ctx2('page', log), lead = new Ctx2('front', log), film = {currentTime: t};
  const doc = {timeline: {currentTime: 1}, defaultView: {ResizeObserver: class { observe() {} disconnect() {} }}};
  const canvas = {width: 400, height: 200, getContext: () => ctx, getBoundingClientRect: () => ({width: 200, height: 100}), ownerDocument: doc};
  const front = {width: 400, height: 200, getContext: () => lead};
  return {log, ctx, lead, film, doc, kick: createOrbitKick({canvas, film, bursts: BURSTS, front, hear})};
};
// one of the page's frames as warm-sphere.js draw() makes it: behind the sphere, a miniature in the satellites' own save, the skin, in front
const pageFrame = (ctx) => {
  ctx.clearRect(0, 0, 200, 100);
  ctx.fillStyle = 'glow'; ctx.fill();
  ctx.save(); ctx.strokeStyle = 'far ring'; ctx.stroke(); ctx.restore();
  ctx.save(); ctx.save(); ctx.lineJoin = 'round'; ctx.fillStyle = 'miniature'; ctx.fill(); ctx.strokeStyle = 'miniature edge'; ctx.stroke(); ctx.restore(); ctx.restore();
  ctx.save(); ctx.lineJoin = 'round';
  ctx.fillStyle = 'face'; ctx.fill(); ctx.strokeStyle = 'edge'; ctx.stroke(); ctx.drawImage(); ctx.fillText('01'); ctx.strokeText('01');
  ctx.save(); ctx.fillStyle = 'star'; ctx.fill(); ctx.restore();
  ctx.restore();
  ctx.save(); ctx.strokeStyle = 'near ring'; ctx.stroke(); ctx.restore();
  ctx.save(); ctx.fillStyle = 'bearing'; ctx.fillText('I · II'); ctx.restore();
};
const drawn = (log, name) => log.filter(([at, what]) => at === name && what !== 'clearRect').map(([, ...rest]) => rest);

test('hushed (2): the skin draws nothing, what is behind it stays on the page, what is in front goes over the box', () => {
  const {log, ctx, kick} = hushedPage();
  let asked = 0;
  kick.hush(() => { asked++; return 2; });
  assert.equal(kick.on, true);
  ctx.setTransform(2, 0, 0, 2, 0, 0);
  pageFrame(ctx);
  assert.equal(asked, 1, 'asked once a frame, as the skin begins');
  assert.equal(kick.hushed, true);
  assert.deepEqual(drawn(log, 'page'), [['fill', 'glow'], ['stroke', 'far ring'], ['fill', 'miniature'], ['stroke', 'miniature edge']]);
  assert.deepEqual(drawn(log, 'front'), [['stroke', 'near ring'], ['fillText', 'I · II']]);
});

test('the front canvas takes the page\'s transform and styles at the hand-over, and is cleared as each frame begins', () => {
  const {log, ctx, lead, kick} = hushedPage();
  kick.hush(() => 2);
  ctx.setTransform(2, 0, 0, 2, 0, 0); ctx.globalAlpha = 0.5; ctx.lineWidth = 0.7;
  pageFrame(ctx);
  assert.deepEqual(lead.m, [2, 0, 0, 2, 0, 0]);
  assert.equal(lead.s.alpha, 0.5);
  assert.equal(lead.s.width, 0.7);
  log.length = 0;
  pageFrame(ctx);
  assert.deepEqual(log[0], ['front', 'clearRect'], 'the front is cleared before the page clears its own');
  assert.deepEqual(log[1], ['page', 'clearRect']);
});

test('under (1): the skin draws, and what is in front of it still goes over the box; 0: the page draws all of its frame', () => {
  const one = hushedPage();
  one.kick.hush(() => 1);
  pageFrame(one.ctx);
  assert.equal(one.kick.hushed, false);
  assert.deepEqual(drawn(one.log, 'page').map(c => c[1] ?? c[0]), ['glow', 'far ring', 'miniature', 'miniature edge', 'face', 'edge', 'drawImage', '01', '01', 'star']);
  assert.deepEqual(drawn(one.log, 'front'), [['stroke', 'near ring'], ['fillText', 'I · II']]);
  const zero = hushedPage();
  zero.kick.hush(() => 0);
  pageFrame(zero.ctx);
  assert.deepEqual(drawn(zero.log, 'front'), []);
  assert.equal(drawn(zero.log, 'page').length, 12);
});

test('hush(null) far from a burst gives the page its own context back and empties the front', () => {
  const {log, ctx, kick} = hushedPage();
  kick.hush(() => 2);
  pageFrame(ctx);
  kick.at(80);
  assert.equal(kick.on, true, 'the hush holds the context even with no kick near');
  kick.hush(null);
  assert.equal(kick.on, false);
  assert.equal(Object.getPrototypeOf(ctx), Ctx2.prototype);
  assert.deepEqual(log.at(-1), ['front', 'clearRect']);
  log.length = 0;
  pageFrame(ctx);
  assert.equal(drawn(log, 'page').length, 12);
  assert.deepEqual(drawn(log, 'front'), []);
});

test('in a kick window the near worlds go over the box and are still thrown', () => {
  const {log, ctx, film, kick} = hushedPage(37.6);
  kick.at(37.6); kick.hush(() => 2);
  ctx.clearRect(0, 0, 200, 100);
  ctx.save(); ctx.lineJoin = 'round'; ctx.fill(); ctx.restore();
  ctx.save(); ctx.fillStyle = '#A98242'; ctx.arc(150, 30, 1.8, 0, 7); ctx.restore();
  const [, , x, y, r] = log.findLast(([at, what]) => at === 'front' && what === 'arc');
  const cx = 200 * SPHERE_X, [out, turn] = kickAt(film.currentTime, BURSTS), dx = 150 - cx, dy = 30 - 50;   // the stand-in's stage is 200 wide: its centre the sphere's (app/sphere-centre.mjs)
  assert.ok(Math.abs(x - (cx + (dx * Math.cos(turn) - dy * Math.sin(turn)) * (1 + out))) < 1e-9);
  assert.ok(Math.abs(y - (50 + (dx * Math.sin(turn) + dy * Math.cos(turn)) * (1 + out))) < 1e-9);
  assert.ok(Math.abs(r - 1.8 * (1 + 1.2 * out)) < 1e-9);
  assert.equal(drawn(log, 'page').length, 0, 'the hushed skin drew nothing and the world went over the box');
});

test('the worlds as faces: each world\'s dot is read where it lands, and hidden with its ring while its trail stays', () => {
  const {log, ctx, kick} = hushedPage(55);
  kick.hush(() => 2);
  const worldsFrame = () => {
    ctx.clearRect(0, 0, 200, 100);
    ctx.save();
    ctx.strokeStyle = '#A98242'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(10, 10); ctx.lineTo(12, 11); ctx.stroke();   // a trail
    ctx.fillStyle = '#A98242'; ctx.beginPath(); ctx.arc(120, 40, 1.8 * 1.1, 0, 7); ctx.fill();                                // the dot
    ctx.beginPath(); ctx.arc(120, 40, 5 * 1.1, 0, 7); ctx.strokeStyle = '#A98242'; ctx.stroke();                             // the ring
    ctx.fillStyle = '#438C82'; ctx.beginPath(); ctx.arc(60, 70, 1.8 * 0.9, 0, 7); ctx.fill();
    ctx.restore();
  };
  worldsFrame();
  assert.deepEqual(kick.worlds.map(w => [w.x, w.y, +w.r.toFixed(2)]), [[120, 40, 1.98], [60, 70, 1.62]]);
  assert.equal(drawn(log, 'page').filter(([what]) => what === 'arc').length, 3, 'dots and ring drawn');
  log.length = 0;
  kick.hideWorlds(true);
  worldsFrame();
  assert.equal(kick.worlds.length, 2, 'still read while hidden');
  assert.equal(log.filter(([, what]) => what === 'arc').length, 0, 'no dot, no ring');
  assert.deepEqual(log.filter(([, what]) => what === 'moveTo' || what === 'lineTo').map(([, what, x, y]) => [what, x, y]), [['moveTo', 10, 10], ['lineTo', 12, 11]], 'the trail stays');
});

// THE WORLDS HEAR THE FILM
const angle = (a) => Math.atan2(Math.sin(a), Math.cos(a));

test('the score: a byte of each value the worlds read for each of the film\'s frames, its lines in order', () => {
  for (const name of ['bass', 'beat', 'energy']) assert.equal(SCORE.values[name].length, SCORE.frames);
  assert.ok(Math.abs(LOOP - 152.4) < 0.1, `the film is 152.4 s since THE CUT (dl-twelve.js), not ${LOOP}`);
  for (let i = 1; i < SCORE.lines.length; i++) assert.ok(SCORE.lines[i][0] > SCORE.lines[i - 1][0]);
  assert.ok(SCORE.lines.every(([t0, t1, w]) => t0 >= 0 && t1 > t0 && w > 0));
});

test('hearing is a pure function of the film\'s second; a second before 0 is the film\'s end (it loops), and its turn comes back whole', () => {
  assert.deepEqual(hearAt(100.37), hearAt(100.37));
  assert.deepEqual(hearAt(-2), hearAt(LOOP - 2));
  assert.deepEqual(throbAt(-0.5), throbAt(LOOP - 0.5));
  assert.deepEqual(hearAt(NaN), [0, 0]);
  assert.deepEqual(saidAt(NaN), [0, 0]);
  assert.deepEqual(throbAt(undefined), [0, 0, 1]);
  assert.equal(hearAt(0)[1], 0);
  assert.ok(TURNS >= 1);
  assert.ok(Math.abs(angle(hearAt(LOOP - 1e-6)[1] - hearAt(0)[1])) < 0.01, 'the swarm is where it began when the film loops');
  assert.equal(hears(NaN), false); assert.equal(hears(-1), false); assert.equal(hears(0), true); assert.equal(hears(150), true);
});

test('the growing energy: at the meteors the loop is wider and the swarm turns many times faster than in the calm before', () => {
  const mean = (a, b, fn) => { let sum = 0, n = 0; for (let t = a; t < b; t += 0.1) { sum += fn(t); n++; } return sum / n; };
  const speed = (t) => (hearAt(t + 0.05)[1] - hearAt(t - 0.05)[1]) / 0.1;
  assert.ok(mean(108.6, 111, (t) => hearAt(t)[0]) > mean(29.2, 30.4, (t) => hearAt(t)[0]) + 0.08);
  assert.ok(mean(108.6, 111, speed) > 3 * mean(29.2, 30.4, speed), `${mean(108.6, 111, speed)} against ${mean(29.2, 30.4, speed)} rad/s`);
  assert.ok(Math.max(...Array.from({length: 1530}, (_, i) => speed(i / 10 + 0.05))) < 0.2, 'never faster than about 0.12 rad/s');
});

test('along a trail the energy bends it smoothly: no corner from one of its points to the next', () => {
  // a trail's points are 0.24 s and about 15 px apart on a loop of about 450 px: a change of out by 1 % (4.5 px) from one point to the next
  // turns a segment by under 17 degrees, and a change of that change is what draws a corner (the largest, 0.0044 or 2 px, is the energy's
  // climb to the burn at 101.7 s; a line's kick drawn along the trails made 0.07)
  const d = 15.5 / 64;
  let step = 0, bend = 0;
  for (let t = 0; t < LOOP; t += 0.05) {
    const [o0, r0] = hearAt(t), [o1, r1] = hearAt(t - d), [o2, r2] = hearAt(t - 2 * d);
    step = Math.max(step, Math.abs(o1 - o0));
    bend = Math.max(bend, Math.abs(o0 - 2 * o1 + o2), Math.abs(angle(r0 - r1) - angle(r1 - r2)));   // a turn read round the circle (the loop's seam)
  }
  assert.ok(step < 0.01, `the largest step out ${step.toFixed(4)}`);
  assert.ok(bend < 0.006, `the largest bend ${bend.toFixed(5)}`);
});

test('what is said: each line leans the whole swarm out and round as it comes, and holds it a little wider while it stands', () => {
  let leaned = -Infinity;
  const heaviest = Math.max(...SCORE.lines.map((l) => l[2]));
  for (const [t0, t1, w] of SCORE.lines) {
    const k = w / heaviest, len = t1 - t0, alone = t0 - leaned >= 1.5;
    if (t0 - leaned < 0.6) continue;   // a flicker of the subtitle reads: no lean of its own
    leaned = t0;
    const [out0, turn0] = saidAt(t0 - 0.02), [out1, turn1] = saidAt(t0 + 0.3);
    assert.ok(out1 - out0 > 0.03 * k, `the line at ${t0} s leans them out (${(out1 - out0).toFixed(3)})`);
    if (alone) assert.ok(turn1 - turn0 > 0.02 * k, `and round (${(turn1 - turn0).toFixed(3)})`);   // in a quick run the last one's turn swings back meanwhile
    const later = SCORE.lines.some(([s0]) => s0 > t0 && s0 < t1 + 4);
    if (len > 1.6 && !later) assert.ok(saidAt(t0 + Math.min(len - 0.3, 2.5))[0] - saidAt(t1 + 0.7)[0] > 0.02 * k, `held while the line at ${t0} s stands`);
  }
  assert.deepEqual(saidAt(60), [0, 0], 'no line, no lean');
});

test('the beats flare the worlds and are spent within half a second; the bass and the beats breathe the whole swarm at once', () => {
  const beat = SCORE.values.beat, fps = SCORE.fps;
  let strong = 0, quiet = 0;
  for (let i = 15; i < SCORE.frames; i++) {
    const flare = throbAt(i / fps)[2] - 1 - 0.35 * FELT[i];
    if (beat[i] >= 0.9 * 255) { strong++; assert.ok(flare > 0.6 * 0.85, `a strong beat at ${(i / fps).toFixed(2)} s flares them (${flare.toFixed(3)})`); }
    if (Math.max(...beat.subarray(i - 15, i + 1)) < 0.3 * 255) { quiet++; assert.ok(flare < 0.031, `no onset for half a second at ${(i / fps).toFixed(2)} s, no flare (${flare.toFixed(3)})`); }
  }
  assert.ok(strong >= 10 && quiet >= 100, `${strong} strong beats, ${quiet} quiet frames`);
  const throbs = Array.from({length: 1540}, (_, i) => throbAt(i / 10)[0] - saidAt(i / 10)[0]);
  assert.ok(Math.min(...throbs) >= 0 && Math.max(...throbs) <= 0.06 + 1e-9, 'the bass and the beats: 0 to 6 % of the loop');
  assert.ok(throbs.filter((v) => v > 0.02).length > 50, 'the swarm breathes');
});

const C2 = [1000 * SPHERE_X, 400];
const heard = ([x, y], s, t) => {
  const [out, turn] = kickAt(s, BURSTS), [hOut, hTurn] = hearAt(s), [throb, lean] = throbAt(t), dx = x - C2[0], dy = y - C2[1];
  const k = (1 + out + hOut) * (1 + throb), a = turn + hTurn + lean;
  return [C2[0] + (dx * Math.cos(a) - dy * Math.sin(a)) * k, C2[1] + (dx * Math.sin(a) + dy * Math.cos(a)) * k];
};

test('hearing, a world moves by the kick and the energy of now and flares with the beat; a trail point by its own second\'s; all lean and breathe with now', () => {
  const {ctx, kick} = page(true);
  kick.at(11.7);
  ctx.save(); ctx.fillStyle = '#A98242';
  ctx.arc(700, 300, 1.8, 0, 7);
  const [, x, y, r] = ctx.calls.at(-1);
  assert.ok(near([x, y], heard([700, 300], 11.7, 11.7)));
  assert.ok(Math.abs(r - 1.8 * (1 + 1.2 * kickAt(11.7, BURSTS)[0]) * throbAt(11.7)[2]) < 1e-9);
  ctx.strokeStyle = '#438C82'; ctx.lineWidth = 0.35 + 0.9 * 0.75;
  ctx.moveTo(800, 500); ctx.lineTo(810, 505);
  assert.ok(near(ctx.calls.at(-2).slice(1), heard([800, 500], 11.7 - (0.25 + 1 / 64) * 15.5, 11.7)));
  assert.ok(near(ctx.calls.at(-1).slice(1), heard([810, 505], 11.7 - 0.25 * 15.5, 11.7)));
  ctx.restore();
});

test('far from any burst the hearing keeps the context through only the members it needs, and hear(false) gives it back', () => {
  const {ctx, film, kick} = page(true);
  film.currentTime = 80; kick.at(80);
  assert.equal(kick.on, true);
  assert.equal(kick.hearing, true);
  const own = Object.getOwnPropertyNames(Object.getPrototypeOf(ctx)).sort();
  assert.deepEqual(own, ['arc', 'fillStyle', 'lineTo', 'lineWidth', 'moveTo', 'restore', 'save', 'strokeStyle']);
  ctx.strokeStyle = 'rgba(132,111,63,.21)'; ctx.moveTo(1, 2);
  assert.deepEqual(ctx.calls.at(-1), ['moveTo', 1, 2], 'nothing in another colour moves');
  kick.hear(false);
  assert.equal(kick.on, false);
  assert.equal(Object.getPrototypeOf(ctx), Ctx.prototype);
  kick.hear(true);
  assert.equal(kick.on, true);
  kick.at(NaN);
  assert.equal(kick.on, false, 'no second, no hearing');
});

test('the hush over the hearing: the whole prototype while the box decides, the lighter one after, the front emptied once and then left alone', () => {
  const {log, ctx, kick} = hushedPage(80, true);
  kick.at(80);
  const light = Object.getPrototypeOf(ctx);
  assert.notEqual(light, Ctx2.prototype);
  pageFrame(ctx);
  assert.deepEqual(log.filter(([at]) => at === 'front'), [], 'no hush, nothing goes to the front, and it is not cleared');
  assert.equal(drawn(log, 'page').length, 12);
  log.length = 0;
  kick.hush(() => 2); pageFrame(ctx);
  assert.notEqual(Object.getPrototypeOf(ctx), light);
  assert.deepEqual(drawn(log, 'front'), [['stroke', 'near ring'], ['fillText', 'I · II']]);
  kick.hush(null);
  assert.equal(kick.on, true);
  assert.equal(Object.getPrototypeOf(ctx), light);
  assert.deepEqual(log.at(-1), ['front', 'clearRect'], 'the front emptied as the hush ends');
  log.length = 0; pageFrame(ctx);
  assert.equal(drawn(log, 'page').length, 12);
  assert.deepEqual(log.filter(([at]) => at === 'front'), []);
});

test('a trail\'s step comes from the width the page set, and from what a restore gives back', () => {
  const {ctx, kick} = page(true);
  kick.at(11.7);
  ctx.strokeStyle = '#438C82';
  ctx.save(); ctx.lineWidth = 0.35 + 0.9 * 0.75; ctx.lineWidth = -1; ctx.lineTo(810, 505);
  assert.ok(near(ctx.calls.at(-1).slice(1), heard([810, 505], 11.7 - 0.25 * 15.5, 11.7)), 'a width the context refuses changes nothing');
  ctx.restore(); ctx.lineTo(810, 505);
  assert.ok(near(ctx.calls.at(-1).slice(1), heard([810, 505], 11.7 - 18 / 64 * 15.5, 11.7)), 'the restored width, 1: step 18 of 64');
});
