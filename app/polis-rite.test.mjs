// polis-rite.test.mjs: THE SWARM PLAYS ITS VOTE (his Nov 23 2026 12:24 UTC "the voting resolution radial waves that proceed from the outermost leaf of the tree and then gets
// resolved down to unit0 and then the resolution color backpropagates to the rest then resets in white bursts cycling... why the fuck you dont have that?"). The society page a
// well opens plays its record from the chain by tree.js playNext, then rests (nothing at rest costs anything); five phases named from the engine; a ballot's plate in unowns,
// its words only to a verified holder. node --test app/polis-rite.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { RITE, riteOf } from './polis-state.js';
const read = (f) => readFileSync(new URL(f, import.meta.url), 'utf8'), js = read('./polis.js'), html = read('./polis.html');

test('the five phases are read from the engine\'s own state, the verdict by its name', () => {
  assert.deepEqual([...RITE], ['OTIUM', 'DISCUSSIO', 'SUFFRAGIUM', 'VERDICTUM', 'EXSECUTUM']); assert.deepEqual([riteOf({ mode: 'idle' }), riteOf({ mode: 'discussion' }), riteOf({ mode: 'voting' })].map((r) => r.name), ['OTIUM', 'DISCUSSIO', 'SUFFRAGIUM']); assert.deepEqual(riteOf({ mode: 'voting', harmonizing: true }), { at: 2, name: 'SUFFRAGIUM' }, 'no verdict before the root has one');
  assert.deepEqual(riteOf({ mode: 'voting', harmonizing: true, outcome: 'REIECTUM' }), { at: 3, name: 'REIECTUM' }, 'the wave carries the verdict\'s name'); assert.deepEqual(riteOf({ mode: 'voting', releasing: true, outcome: 'RATUM', executed: false }), { at: 3, name: 'RATUM' }, 'a decision the chain did not execute stays at its verdict'); assert.deepEqual(riteOf({ mode: 'voting', releasing: true, outcome: 'RATUM', executed: true }), { at: 4, name: 'EXSECUTUM' }, 'the white bursts of an executed decision');
});

test('the page plays its record from the chain, then rests: no orbit spins at rest', () => {
  assert.match(js, /syncActivity\(tree,'voting'\)/, 'the record plays by tree.js playNext, leaves first, as poleis.us did'); assert.match(js, /replay=null;syncActivity\(tree,'live'\)/, 'after the record, the live view: a vote that lands plays as it lands');
  assert.match(js, /\(tree\.mode==='voting'\|\|tree\.mode==='discussion'&&!reduced\|\|homing\)/, 'only a vote, a discussion or the 0.9 s of coming home moves the engine; at rest it is paused'); assert.match(js, /tree\.inst\.veil=false;/, 'the FULGOR on the night: its white core and the verdict\'s ring, no flat grey veil (engine.js veil, poleis.us keeps it)');
  assert.match(js, /if\(!tree\.scene\.reduced\?\.matches\)playRecord\(\)/, 'it plays on open, never under reduced motion; the button plays it on a press'); assert.match(html, /<ol class="rite" id="rite" aria-label="The rite"><\/ol><p id="world-caption">/, 'the five phases stand under the ball');
});

test('a ballot\'s plate: its hash in unowns, its words only to a holder the chain and the body verified', () => {
  assert.match(js, /privateOpen\(\)&&body\.texts\.has\(k\)\?esc\(body\.texts\.get\(k\)\.text\):glyphs\(k/, 'never words the page invented'); assert.match(js, /title="the talk between ballots has no store yet"/, 'DISCUSSIO says it has no store yet');
});

test('the scene controls nobody called are out (the JavaScript only shrinks)', () => {
  assert.doesNotMatch(read('./scenes.js'), /installSceneControls|throwSwitches|installPoetryReader/); assert.doesNotMatch(read('./poetry.js'), /installPoetryReader|poemMarkup/);
});

// THE SWARM RESTS ON ITS CHAIRS (Nov 23 2026, his "Yes, build both" over the grammar's figures; his Sept 25 "anchored to the normals to the pentagon faces", Oct 21 "the unit1s
// should orbit geostationarily to the pentagons", Nov 2 "u lost the link between the unit1s and his 12 pentagons"): at rest every satellite eases from its loop onto its chair's
// normal, tethered; a vote de-anchors it the same way. And a swarm's progression level (its chairs held, its levels) stands in its facts.
import vm from 'node:vm';
import { levelOf } from './polis-state.js';
test('at rest a satellite snaps from its loop onto its pentagon\'s normal, and a vote lets it go', () => {
  const window = {}; vm.runInNewContext(read('./engine.js'), { window, performance, requestAnimationFrame() {}, Math, console }); const E = window.PoleisEngine;
  const org = (n) => ({ n, d: '', v: 'PENDET', py: 0, pn: 0, pa: 0, hy: 0, hn: 0 }), ctx = new Proxy({}, { get: () => () => ({ addColorStop() {} }), set: () => true });
  const t = E.mount({ getContext: () => ctx, width: 440 }, { name: 'u0', orgs: [org('u0'), org('u1')], children: { u0: [{ seat: 3, to: 'u1' }] }, chairs: {}, size: 440, driven: true }); E.setActive(t, false);
  E.setDiscussion(t, true); t.animT = 5000;
  const far = () => { const L = E.layoutAt(t), n = E.buildSkin().pents[3].normal; return Math.hypot(...L.u1.off.map((v, i) => v - L.u0.off[i] - n[i] * t.orbit * L.u0.scale)); };   // how far u1 stands from the normal of its own pentagon, at the orbit's radius, from its parent
  assert.ok(far() > 0.05, 'in orbit it rides its loop, off its chair');
  assert.equal(E.snapK(t), 0); E.snap(t, true); t.animT += E.snapDuration / 2;
  const mid = far(); assert.ok(mid > 0.001 && E.snapK(t) > 0 && E.snapK(t) < 1, 'it eases there: a motion, never a cut');
  t.animT += E.snapDuration; assert.equal(E.snapK(t), 1); assert.ok(far() < 1e-9, 'snapped: on the normal of its own pentagon, at the orbit\'s radius');
  E.snap(t, false); t.animT += E.snapDuration; assert.equal(E.snapK(t), 0); assert.ok(far() > 0.05, 'de-anchored for the vote');
  E.snap(t, true, true); assert.equal(E.snapK(t), 1, 'under reduced motion it is there at once');
  const deep = E.mount({ getContext: () => ctx, width: 440 }, { name: 'u0', orgs: [org('u0'), org('u1'), org('u2')], children: { u0: [{ seat: 3, to: 'u1' }], u1: [{ seat: 5, to: 'u2' }] }, chairs: {}, size: 440, driven: true }); E.setActive(deep, false); E.setDiscussion(deep, true); E.snap(deep, true, true);
  const L = E.layoutAt(deep), seen = (n) => { const [x, y, z] = E.projectPoint(deep, L[n].off); return (Math.hypot(x - 220, y - 220) + L[n].scale * 1.34 * deep.F / (z + deep.CAM)) / (0.4 * 440); }, reach = Math.max(...['u0', 'u1', 'u2'].map(seen));
  assert.ok(deep.snap.zoom > 1 && reach > 0.8 && reach < 1, `home, a tree the orbit kept small comes forward until what the eye sees of it nears the stage's edge, never past it (zoom ${deep.snap.zoom}, reach ${reach})`);
  assert.match(read('./engine.js'), /if\(!inOrbit\(t\)\|\|RQ\.snapK\(t\)>\.85\|\|/, 'its tether is drawn once it is home'); assert.match(js, /const rest=tree\.mode==='idle'&&!replay;if\(rest!==\(tree\.inst\.snap\?\.to===1\)\)window\.PoleisEngine\.snap\(tree\.inst,rest,reduced\);/, 'the page snaps at rest and lets go when anything moves');
});

test('a swarm\'s progression level: its chairs held of twelve and the levels under it', () => {
  const r = (level, kinds) => ({ level, pentagons: kinds.split('').map((k) => ({ kind: Number(k) })) }), reg = new Map([['0', r(0, '112110011120')], ['7', r(1, '111000000000')], ['9', r(2, '100000000000')]]);
  assert.deepEqual(levelOf(reg, ['0', '7', '9']), { held: 9, levels: 3 }, 'a chair is held by a key or by a whole swarm; the levels count the root'); assert.deepEqual(levelOf(reg, ['7']), { held: 3, levels: 1 }); assert.deepEqual(levelOf(new Map(), ['0']), { held: 0, levels: 0 }); assert.match(js, /<span>Chairs held<\/span>/); assert.match(js, /<span>\$\{lv\.levels===1\?'Level':'Levels'\}<\/span>/);
});

// THE PANTHEON (Nov 23 2026, his "these please" over the Nov 7 Pantheon and Inside the Neghiverse, then "why the fuck u dont understand this is great? fucking grab
// the source of it"): the meta swarm's page wears the Nov 7 widget whole, every number the Fund's, read as the program's race seats a throne (ix/fund.rs).
import { pantheonOf, GODS } from './polis-state.js';
test('the Pantheon reads the Fund as the program races for its thrones: the season, the thrones, the ladder, the gate, the road its stakers priced', () => {
  const none = 2n ** 64n - 1n, h = new Uint8Array(32).fill(7), k = (x) => x.join('.'), fund = { cycleSeq: 1n, cycleStart: 494190058n, cycleSlots: 1800n, rangeLo: 2000, rangeHi: 8000, chairQuorum: 1, current: h, chairs: Array.from({ length: 12 }, (_, i) => ({ root: i === 4 ? 9n : none, fees: i === 4 ? 900000n : 0n, backing: i === 4 ? h : new Uint8Array(32) })) };
  const tallies = [{ root: 4207486889447797999n, cycle: 1n, fees: 25000n, lifetime: 25000n }, { root: 9n, cycle: 1n, fees: 900000n, lifetime: 900000n }, { root: 0n, cycle: 1n, fees: 250000n, lifetime: 275000n }, { root: 5n, cycle: 0n, fees: 99000000n, lifetime: 99000000n }];
  const stakes = [{ hash: h, weight: 2n, valueBps: 3000 }, { hash: h, weight: 1n, valueBps: 5000 }, { hash: new Uint8Array(32), weight: 9n, valueBps: 8000 }], opts = new Map([[k(h), { vetted: true }]]), run = pantheonOf(fund, tallies, opts, stakes, 494190158, none, k);
  assert.deepEqual([run.season, run.seated, run.chairs[4], run.chairs[0]], [1, 1, { root: '9', fees: 900000, backs: true }, null], 'a throne is a seated chair, its fees, and whether it backs the road'); assert.deepEqual(run.ladder.map((t) => [t.root, t.fees]), [['9', 900000], ['0', 250000], ['4207486889447797999', 25000], ['5', 0]], 'the ladder by this season\'s fees; a stale tally counts none');
  assert.deepEqual([run.challenger.root, run.target], ['0', 0], 'in a season that runs, the first unseated with fees races for the first empty throne');
  assert.deepEqual([Math.round(run.road.value), run.road.backed, run.road.quorum, run.road.marks.length], [3667, 1, 1, 2], 'the road: the thrones that back it, its stakers\' values weighted by stake, its own stakes only');
  const ran = pantheonOf(fund, tallies, opts, stakes, 525491281, none, k);
  assert.deepEqual([ran.left < 0, ran.challenger, ran.target], [true, null, 0], 'a season that ran out rolls at the next write: no one takes a throne with its fees, the next season\'s first fee takes chair 0');
  fund.current = new Uint8Array(32); assert.equal(pantheonOf(fund, [], new Map(), [], null, none, k).road, null, 'no current road, none drawn'); assert.equal(pantheonOf(null), null);
  assert.deepEqual([GODS.length, GODS[0][0], GODS[6][0]], [12, 'IVPPITER', 'MERCVRIVS'], 'the source\'s twelve gods');
  assert.doesNotMatch(js + html, /renderHall|id="hall"/, 'THE HALL IS THE STAKE (his Nov 26 2026 "pantheon should go into the stake tab... pantheon is for the stakers"): the Root\'s page no longer holds the hall'); assert.match(read('./after-the-mint.html'), /<section class="hall" id="hall" aria-label="The Pantheon"><div class="hall-arena">.*<g id="hall-floor"><\/g><image href="\.\/assets\/nefertiti-oculus\.webp"/, 'it stands on the stake, her at the oculus, over the floor'); assert.match(read('./after-the-mint-book.mjs'), /hall: P && \{g: fg, p: P, subtree, uid\}/, 'drawn from the blue page\'s own read of the Fund');
  assert.ok(read('./assets/pantheon-hall.svg').includes('<circle cx="450" cy="420" r="392"'), 'the source\'s rotunda, in stone');
});
test('EVERY DOOR GOES WHERE IT SAYS (his Nov 26 2026 "can we please audit what clicking on these leads to and whether that makes sense or not? (spoiler, some cases it makes 0 sense)"): the Pantheon\'s door lands on the Pantheon, and its thrones wear their signs alone (zero mock names)', () => {
  const hall = read('./pantheon.mjs'); assert.match(read('./after-the-mint-book.mjs'), /door: '\.\/after-the-mint\.html\?side=pool#hall',/, 'the Pantheon\'s door lands on the hall, on the stake'); assert.doesNotMatch(hall, /\bGODS\b|governance|custody|WebGPU|Space Router/, 'no Latin or mock department names on dynamical thrones (his Nov 23 & Nov 26 2026 rulings)'); assert.match(hall, /SIGNS\.map\(\(sign, k\)/, 'each throne wears its zodiac sign'); assert.match(hall, /class="throne is-empty"/, 'unassigned thrones are non-interactive'); assert.match(hall, /poly\(6, x, y, 11\.5, Math\.PI \/ 6\)/, 'hex floor matches assets/pantheon-hall.svg lattice');
});
