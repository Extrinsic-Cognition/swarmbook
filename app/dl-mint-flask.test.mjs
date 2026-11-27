// dl-mint-flask.test.mjs: THE FLASK AND HIS GLOW (his Oct 21 2026 WEST: "it cant stop like this... cant you add some shaders for the glow of him?
// like... we need to start getting droplets of liquor in the flask here"; "can you make the anime behind the liquor?"). node --test dl-mint-flask.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {AURA, FLASK, POUR, SEAT, PRIOR, seatDrops, pourTimes, landOf, priorAt, priorRise, reviewPourOf} from './dl-mint-flask.js';
import {reviewSeats} from './dl-mint-ledger.js';

const here = (p) => new URL(p, import.meta.url);

test('a seat is one drop of its metal, in the chain\'s order, its id its signature', () => {
  assert.deepEqual(seatDrops([]), []); assert.deepEqual(seatDrops(null), []);
  const seats = reviewSeats(6);
  assert.deepEqual(seatDrops(seats).map((d) => d.metal), ['bronze', 'bronze', 'bronze', 'bronze', 'gold', 'bronze']);
  assert.deepEqual(seatDrops(seats).map((d) => d.id), seats.map((s) => s.signature));
  assert.equal(seatDrops(reviewSeats(1000)).length, POUR.most, 'never past the most a flask takes');
});

test('the days so far fall one a beat, all of them inside the replay\'s time; a later seat at once', () => {
  assert.deepEqual(pourTimes(0, 1000), []);
  assert.deepEqual(pourTimes(3, 1000), [1000, 1000 + POUR.replay_ms, 1000 + 2 * POUR.replay_ms]);
  const many = pourTimes(150, 0);
  assert.equal(many.length, 150); assert.ok(many.at(-1) <= POUR.replay_max_ms);
  for (let i = 1; i < many.length; i++) assert.ok(many[i] >= many[i - 1]);
});

test('his review stands the lab\'s own seats in for the chain\'s, only on the house\'s doors', () => {
  const page = (hostname, search) => ({location: {hostname, search}});
  assert.equal(reviewPourOf(page('mint-lane.localhost', '?debug=off&pour=12')), 12);
  for (const host of ['127.0.0.1', 'localhost', '192.168.1.20', 'studio.local']) assert.equal(reviewPourOf(page(host, '?pour=3')), 3, host);
  for (const host of ['optimism.fit', 'poleis.us', 'localhost.evil.com']) assert.equal(reviewPourOf(page(host, '?pour=3')), null, host);
  assert.equal(reviewPourOf(page('localhost', '?pour=-1')), null); assert.equal(reviewPourOf(page('localhost', '?pour=1000')), null);
  assert.equal(reviewPourOf(page('localhost', '')), null);
  assert.equal(reviewPourOf(page('localhost', '?pour=0')), 0, 'the first buyer\'s view: none sold');
});

test('the sphere: his glow through the shader in the circle, the liquor inside the glass and in front of him, the flask opened on the stop', () => {
  const sphere = readFileSync(here('./warm-sphere.js'), 'utf8'), flask = readFileSync(here('./dl-mint-flask.js'), 'utf8');
  const entry = readFileSync(here('./warm-entry.mjs'), 'utf8'), twelve = readFileSync(here('./dl-twelve.js'), 'utf8');
  assert.match(sphere, /import \{createMintFlask, FLASK, SEAT, priorRise\} from '\.\/dl-mint-flask\.js\?v=flask-2';/);
  assert.match(entry, /import\('\.\/dl-mint-pour\.js\?v=flask-11'\)/);
  // the liquor behind the near faces, laid with the star; his circle drawn through the shader with the liquor's surface; a drop in front of him
  assert.match(sphere, /drawStar\(center, radius, alpha, stage\);\n\s*if \(transforming\) drawCosmosCore\(center, radius, alpha\);\n[^\n]*\n\s*if \(mintNowK > 0\) flask\.paint\(ctx, center\[0\], center\[1\], radius \* FLASK\.fill, alpha \* mintNowK, dpr, Date\.now\(\), mintMode === 'ahead' \? priorRise\(mintNowK\) : 1\);/);
  assert.match(sphere, /const lit = film \? flask\.aura\(film\.canvas, film\.key, k, seconds, r \* 2 \* dpr, r \/ flaskR\) : null;/);
  assert.match(sphere, /flask\.paintAbove\(ctx, x, y, flaskR, r, k, dpr\);/);
  // the flask opens on the stop (the wall's hold, or the crossing whole), never before; held, the window keeps the frames at its own pace
  assert.match(sphere, /if \(mintMode === 'ahead' && \(held \|\| mintNowK > \.999\)\) flask\.open\(Date\.now\(\), \{still: reduced\}\);/);
  assert.match(sphere, /heldStep = held && !asked && timestamp - drawnAt < 1000 \/ HELD_FPS;/);
  assert.match(sphere, /if \(\(overlayBusy \|\| \(mintNowK > 0 && !reduced && !paused\)\) && inView && !document\.hidden\) frame = requestAnimationFrame\(tick\);/);
  // held on the stop's own frame, the sphere is handed its second (it stands on the stop itself, so the window lands whole)
  assert.match(twelve, /if \(wall\.at\(presented\?\.mediaTime \?\? film\.currentTime, soundOn && !songBroken && !song\.paused \? song\.currentTime : NaN\)\) \{ moment\(\); return; \}/);
  // the house's own fluid, loaded at the window's first frame; an empty tank on arrival
  assert.match(flask, /import\('\.\.\/\.\.\/room\/fuel-fluid\.mjs'\), import\('\.\.\/\.\.\/room\/fuel-fluid-gl\.mjs'\)/);
  assert.match(flask, /const prior = seatDrops\(F\.chain\);\n\s*F\.fuel = law\.createFuel\(\); F\.fuel\.compose\(0, \{drops: prior\}\);/);
  assert.match(flask, /createFluidPainter\(\{document: doc, sideMax: FLASK\.sideMax\}\)/);
  assert.ok(AURA.side >= 512 && FLASK.sideMax > 288, 'the hero\'s glass is larger than her unit0');
});

test('a seat takes a hexagon: its drop lands a fall after the beat that starts it, and its hexagon appears as the spark reaches it', () => {
  const epoch = 1772673332000, beat = 600;
  assert.equal(landOf(epoch, epoch, beat), epoch + SEAT.fall_ms, 'on a beat: it starts there');
  assert.equal(landOf(epoch + 1, epoch, beat), epoch + beat + SEAT.fall_ms, 'just after one: the next');
  assert.equal(landOf(epoch + 599, epoch, beat), epoch + beat + SEAT.fall_ms);
  assert.ok(SEAT.spark_ms > 0 && SEAT.spark_ms < POUR.replay_ms, 'a spark reaches its hexagon before the next drop lands');
  const sphere = readFileSync(here('./warm-sphere.js'), 'utf8');
  assert.match(sphere, /const seat = onFaces && !pentagon \? onFaces\.get\(index\) : undefined;/);
  assert.match(sphere, /const seatShow = !seat \? 0 : seat\.prior \? ease\(\(mintNowK - seat\.k\) \/ \.07\) : flaskNow >= seat\.appear \? ease\(\(flaskNow - seat\.appear\) \/ 450\) : 0;/);
  assert.match(sphere, /\} else if \(seatShow > 0 && seat\.anchored\) \{\n\s*\/\/ a gold of the mint: anchored, set into the glass on its own land as its spark reaches it/);
  // the land is the chain's, by the land law, from the film's own front: not the screen's
  assert.match(sphere, /const world = flask\.world\(MINT_FRONT\);/);
  assert.doesNotMatch(sphere, /rankSeats|seatRanks/);
  assert.match(sphere, /const p = \(now - seat\.land\) \/ SEAT\.spark_ms, to = seatCenters\.get\(seat\.id\);/);
});

// THE MINT'S OWN STATE (his "when that animation is played by the first buyer there are 0 hexs and 0 liquor... but the 10th buyer has to be able
// to see the previous ones while the scene gets there")
test('the seats paid before the viewer came come in as the scene gets there, one after another, after the vessel\'s last rung; their liquor rises with them', () => {
  assert.equal(priorAt(0, 1), PRIOR.from);
  assert.equal(priorAt(0, 9), PRIOR.from); assert.ok(Math.abs(priorAt(8, 9) - PRIOR.to) < 1e-12);
  for (let i = 1; i < 9; i++) assert.ok(priorAt(i, 9) > priorAt(i - 1, 9), 'one after another');
  assert.ok(PRIOR.from > 0.134, 'after the vessel is whole (the last rung ends at the crossing\'s 0.134)');
  assert.ok(PRIOR.to < 1, 'all of them in before the stop');
  assert.equal(priorRise(0), 0); assert.equal(priorRise(PRIOR.from), 0); assert.ok(priorRise(PRIOR.to) > 1 - 1e-12); assert.equal(priorRise(1), 1);
  let last = 0;
  for (let k = 0; k <= 1; k += .01) { const r = priorRise(k); assert.ok(r >= last); last = r; }
  const flask = readFileSync(here('./dl-mint-flask.js'), 'utf8'), sphere = readFileSync(here('./warm-sphere.js'), 'utf8');
  // made on the scene's way with the seats so far at rest in it (the first buyer's: none), and only seats paid on the stop fall
  assert.match(sphere, /if \(mintMode === 'ahead' && mintNowK > 0\) flask\.prepare\(\);/);
  assert.match(flask, /prior\.forEach\(\(d, i\) => \{ F\.poured\.add\(d\.id\); F\.list\.push\(\{id: d\.id, metal: d\.metal, prior: true, k: priorAt\(i, prior\.length\)\}\); \}\);/);
});
