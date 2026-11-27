// dl-handoff.test.mjs: NEFERTITI STEPS OUT OF THE MAC (his Oct 22 2026 18:0x WEST: "the goal is to magically move nefertiti from floating there
// straight into the phone in AR"), and THE HANDOFF JOINS THE ONENESS (his 20:2x WEST order). The card the page shows and the phone looks for, the code
// that carries the house, the card's frame in the twin and the one-code join (held to the vectors the Swift port is held to), her words at the station's
// count, the page's instant, the dev server's naming of the house, and what the Swift says.
// node --test dl-handoff.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {PIX, MOODS, createPixels, drawBody} from './dl-lyssajudron-body.mjs';
import {CARD, CLIP_URL, APP_URL, WORDS, WORD_TYPE, LEAD_MS, PLACE_MILLE, KEEP_KEY, clipLink, cardPlace, placeText, placeOf, glassAxes, cardFrame, cardJoin, toStation, joinOf, wordOf, offsetOf, instantOf, keptOf} from './dl-handoff.mjs';
import {cardScale, HANDOFF_Z} from './dl-handoff.js';
import {isVisitId} from './harmony-link.mjs';
import {LAYER_Z} from './dl-athena.js';
import {houseOf} from '../tools/mint-dev.mjs';

const asset = (name) => new URL(`./assets/${name}`, import.meta.url);
const clip = (name) => new URL(`../../../../../harmony-clip/${name}`, import.meta.url);
const pngSize = (bytes) => [bytes.readUInt32BE(16), bytes.readUInt32BE(20)];   // IHDR's width and height
const VISIT = 'KQS8GSRTBEB8D7PY5ABZSQDE9V';
const NEWMAC = {transform: {position: [-0.9049, -0.2795, -2.5881], yaw: -0.055587}, size_m: [0.3447, 0.2228]};   // scene/entities/newmac as the Nest held it on Oct 22 2026
const PLACE = {x: 312, y: 120, w: 375, h: 760};
const near = (a, b, tol = 1e-6) => a.every((v, i) => Math.abs(v - b[i]) <= tol * Math.max(1, Math.abs(b[i])));
const VECTORS = JSON.parse(readFileSync(clip('Checks/cardframe/vectors.json'), 'utf8'));

test('her card: the page\'s pictures and the clip\'s law are one card', () => {
  assert.deepEqual(JSON.parse(readFileSync(asset('her-card.json'), 'utf8')), JSON.parse(JSON.stringify(CARD)), 'her-card.json is CARD (tools/her-card.mjs writes it)'); assert.deepEqual(pngSize(readFileSync(asset('her-card.png'))), [CARD.width, CARD.height]); assert.deepEqual(pngSize(readFileSync(asset('her-perch.png'))), [CARD.width, CARD.height]); assert.deepEqual(pngSize(readFileSync(asset('her-sprite.png'))), [CARD.her.w, CARD.her.h]); assert.deepEqual(pngSize(readFileSync(asset('athena.png'))), [CARD.her.w, CARD.her.h], 'her sprite is athena.png at 1:1');
  const {her, width, height} = CARD;
  assert.ok(her.x >= 0 && her.y >= 0 && her.x + her.w <= width && her.y + her.h <= height, 'she sits inside the card'); assert.ok(CARD.physical_m > 0.03 && CARD.physical_m < 0.5, 'the phone\'s first guess is a card on a screen');
  for (const key of ['width', 'height', 'her', 'physical_m']) assert.ok(key in CARD, `the phone reads ${key} (harmony-clip/Shared/Card.swift)`);
  // THE POSTERS: the posters' 2:3, and her Lyssajudron's last pixel above the poster's painted call
  const {motto, body} = CARD;
  assert.equal(width * 3, height * 2, 'the card is as tall as the posters are');
  const px = createPixels(PIX); drawBody(px, body.t, MOODS.awake); let last = -1;
  for (let y = 0; y < PIX; y++) for (let x = 0; x < PIX; x++) if (px.bytes[(y * PIX + x) * 4 + 3]) last = y;
  assert.ok(body.y + (last + 1) * body.scale <= motto.y && motto.y < height, `her Lyssajudron ends (${body.y + (last + 1) * body.scale}) above the poster's call (${motto.y})`);
});

test('the phone carries the page\'s own files and the Viewer\'s own bytes, by their paths in this tree', () => {
  const spec = readFileSync(clip('project.yml'), 'utf8');
  for (const name of ['her-card.png', 'her-card.json', 'her-sprite.png']) {
    assert.equal(spec.split(`../embertide-app/ui/intro/dyson-society/app/assets/${name}`).length - 1, 2, `${name} in the clip and in its app`);
  }
  for (const name of ['NestDeviceKey.swift', 'NexusLaw.swift', 'Fold.swift', 'RecordWire.swift']) {   // THE ONENESS: the key, the seat and the one clock are the Viewer's, shared, never copied
    assert.equal(spec.split(`../embertide-viewer-ios/EmbertideViewer/${name}`).length - 1, name === 'NestDeviceKey.swift' ? 3 : 2, `${name} in the clip and in its app${name === 'NestDeviceKey.swift' ? ', and the key in its share part too (THE SHARE SHEET THROWS INTO THE BALL)' : ''}`);
  }
  // since the Mac's code (build 5) by the AR's roads, one each for both targets: the nexus in Laws/ (laws.sh: harmony-ipad-zero/nexus-law.sh, the same
  // pinned bytes as the Viewer's nexus-law.sh) and the fold as the iPad links it (EmbertideFold.xcframework, harmony-ipad-zero/fold-ios/build.sh)
  for (const name of ['nexus-law.wasm', 'nexus-law.json']) assert.equal(spec.split(`- path: Laws/${name}`).length - 1, 2, `${name} in the clip and in its app`);
  assert.equal(spec.split('- framework: ../harmony-ipad-zero/EmbertideFold.xcframework').length - 1, 2, 'the fold in the clip and in its app'); assert.doesNotMatch(spec, /embertide-fold\/(lib|include)|EmbertideViewer\/nexus-law/, 'one road each: no second module map of the fold, no second nexus');
  const swift = readFileSync(clip('Shared/Handoff.swift'), 'utf8'), house = readFileSync(clip('Shared/House.swift'), 'utf8'), law = readFileSync(clip('Shared/HandoffLaw.swift'), 'utf8');
  assert.match(law, new RegExp(`static let type = "${WORD_TYPE}", leadMs = ${LEAD_MS}\\.0`), 'the Swift names the same kind and lead');
  for (const word of WORDS) assert.match(law, new RegExp(`"event": "${word}"`), `the phone says ${word}`);
  assert.match(swift, /HandoffWord\.caught\(/); assert.match(swift, /HandoffWord\.landed\(/); assert.match(house, /appendPath = "\/nest\/append"/, 'her words go on the Nest'); assert.match(house, /clockPath = "\/rite\/radio\/clock"/, 'the clock is the station\'s beacon through the module'); assert.doesNotMatch(swift + house, /\/dev\/handoff/, 'no door of the dev server\'s is knocked on'); assert.match(readFileSync(clip('Shared/ARHandoffView.swift'), 'utf8'), /stamped = at; instantMs = at\.atMs/, 'she comes through at the count\'s own house instant, her packet\'s (THE VIEWER JOINS AT THE INSTANT, dc484c3ad0)');
});

test('the code: the visit, her round and, in the house, the Nest, the glass and the card\'s place', () => {
  const house = {nest: 'http://192.168.8.164:8904', glass: 'newmac', card: PLACE};
  const link = new URL(clipLink(VISIT, house));
  assert.equal(`${link.origin}${link.pathname}`, CLIP_URL); assert.equal(link.searchParams.get('s'), VISIT); assert.equal(link.searchParams.get('r'), '1', 'her first round'); assert.equal(link.searchParams.get('n'), '192.168.8.164:8904', 'the Nest, host and port'); assert.equal(link.searchParams.get('g'), 'newmac'); assert.equal(link.searchParams.get('c'), '312,120,375,760'); assert.equal(new URL(clipLink(VISIT, house, CLIP_URL, 3)).searchParams.get('r'), '3', 'a call back carries its round'); assert.equal(new URL(clipLink(VISIT, null, CLIP_URL, 'x')).searchParams.get('r'), '1');
  const bare = new URL(clipLink(VISIT));
  for (const k of ['n', 'g', 'c']) assert.equal(bare.searchParams.has(k), false, `no house, no ${k}`);
  const app = new URL(clipLink(VISIT, house, APP_URL));
  assert.equal(app.protocol, 'dysonlight:', 'the local road\'s code opens DysonLight by its scheme'); assert.equal(app.searchParams.get('s'), VISIT); assert.equal(app.searchParams.get('n'), '192.168.8.164:8904'); assert.match(readFileSync(clip('project.yml'), 'utf8'), new RegExp(`CFBundleURLSchemes: \\[${APP_URL.split(':')[0]}\\]`), 'DysonLight answers that scheme'); assert.equal(new URL(clipLink(VISIT, {nest: 'http://192.168.8.164:8904/', glass: 'mac'})).searchParams.get('n'), '192.168.8.164:8904', 'a trailing slash is not carried');
});

test('HER CARD IS THE PICK\'S (Nov 2 2026): in the house the code names the account\'s card and her sprite by sha256; no pick or a broken one names none', () => {
  const picked = {card: 'c'.repeat(64), sprite: 'b'.repeat(64)}, house = {nest: 'http://10.0.0.2:8904', glass: 'glass-a', card: PLACE};
  const link = new URL(clipLink(VISIT, {...house, picked}, APP_URL));
  assert.deepEqual([link.searchParams.get('k'), link.searchParams.get('h')], [picked.card, picked.sprite], 'the card ARKit holds, the sprite she walks out as'); assert.equal(link.searchParams.get('c'), '312,120,375,760', 'beside the card\'s place, never instead of it');
  for (const bad of [null, {card: 'x', sprite: picked.sprite}, {card: picked.card}]) {
    const l = new URL(clipLink(VISIT, {...house, picked: bad}));
    assert.equal(l.searchParams.has('k') || l.searchParams.has('h'), false, 'no pick, or a broken one: the product\'s card, named by nothing');
  }
  const swift = readFileSync(clip('Shared/Handoff.swift'), 'utf8');
  assert.match(swift, /\$0\.name == "k"/, 'the phone reads k'); assert.match(swift, /\$0\.name == "h"/, 'and h');
});

test('the card on the glass: its place as a share of the viewport, and its frame in the twin', () => {
  assert.deepEqual(cardPlace({x: 471.5, y: 117.8, width: 567, height: 745.6}, {w: 1512, h: 982}), {x: 312, y: 120, w: 375, h: 759}); assert.deepEqual(cardPlace({left: 0, top: 0, width: 1512, height: 982}, {w: 1512, h: 982}), {x: 0, y: 0, w: 1000, h: 1000}, 'the whole glass'); assert.equal(cardPlace({x: 1, y: 1, width: 1, height: 1}, {w: 0, h: 100}), null, 'no viewport, no place'); assert.equal(placeText(PLACE), '312,120,375,760'); assert.deepEqual(placeOf('312,120,375,760'), PLACE);
  for (const bad of ['312,120,375', '1,2,0,4', 'a,b,c,d', '1,2,3,1001', '', null]) assert.equal(placeOf(bad), null, JSON.stringify(bad));
  const axes = glassAxes(NEWMAC);
  assert.ok(near(axes.right, [Math.cos(-0.055587), 0, -Math.sin(-0.055587)]), 'right from the yaw, the house\'s own turn (room/twin.mjs axesOf)'); assert.ok(near(axes.normal, [Math.sin(-0.055587), 0, Math.cos(-0.055587)]), 'the normal toward the room'); assert.deepEqual(axes.up, [0, 1, 0]);
  const whole = cardFrame(NEWMAC, {x: 0, y: 0, w: 1000, h: 1000});
  assert.ok(near(whole.centre, NEWMAC.transform.position), 'the whole glass is the glass'); assert.equal(whole.side_m, 0.3447); assert.deepEqual(whole.size_m, [0.3447, 0.2228]);
  const f = cardFrame(NEWMAC, PLACE);
  assert.ok(Math.abs(f.side_m - 0.375 * 0.3447) < 1e-9, 'the card\'s real width: its share of the glass'); assert.ok(near(f.centre, [-0.9049 + axes.right[0] * ((312 + 187.5) / 1000 - 0.5) * 0.3447, -0.2795, -2.5881 + axes.right[2] * ((312 + 187.5) / 1000 - 0.5) * 0.3447]), 'its centre along the glass\'s right');
  const sighted = cardFrame({transform: {position: [0, 0, 0]}, representation: {size_m: [1, 1]}, sighting: {right: [0, 0, -1], up: [0, 1, 0]}}, {x: 0, y: 0, w: 1000, h: 1000});
  assert.ok(near(sighted.normal, [1, 0, 0]), 'a sighting\'s right and up win over the yaw (right x up, the house\'s turn: right [0, 0, -1] is yaw pi/2, the normal [1, 0, 0])'); assert.equal(cardFrame({transform: {position: [0, 0, 0]}}, PLACE), null, 'no size, no frame'); assert.equal(cardFrame(NEWMAC, null), null); assert.equal(PLACE_MILLE, 1000);
});

test('the join: the Station from the phone\'s world by the card, the house\'s one-code law', () => {
  const f = cardFrame(NEWMAC, PLACE);
  const ry = (a) => (v) => [Math.cos(a) * v[0] + Math.sin(a) * v[2], v[1], -Math.sin(a) * v[0] + Math.cos(a) * v[2]];
  for (const yaw of [0, 0.4, -1.3, 2.9]) {
    const T = ry(-yaw), origin = [0.5, -0.3, 1.2], w = (p) => T([p[0] - origin[0], p[1] - origin[1], p[2] - origin[2]]);
    const j = cardJoin({centre: w(f.centre), right: T(f.right), normal: T(f.normal)}, f);
    assert.ok(Math.abs(Math.atan2(Math.sin(j.yaw - yaw), Math.cos(j.yaw - yaw))) < 1e-9, `the turn recovered (${yaw})`); assert.ok(j.residual_deg < 1e-6, 'the axes agree after the turn'); assert.ok(near(toStation(j, w(f.centre)), f.centre), 'the card\'s centre comes back to the Station'); assert.ok(near(toStation(j, w([0.1, 0.2, 0.3])), [0.1, 0.2, 0.3]), 'any point comes back');
  }
  assert.equal(cardJoin({centre: [0, 0, 0], right: [1, 0, 0], normal: [0, 1, 0]}, f), null, 'a card lying flat: no heading, no join'); assert.equal(cardJoin({centre: [0, 0, 0], right: ry(Math.PI / 2)(f.right), normal: ry(-Math.PI / 2)(f.normal)}, f), null, 'the axes disagree on the turn'); assert.equal(cardJoin(null, f), null); assert.equal(toStation(null, [0, 0, 0]), null); assert.deepEqual(joinOf({R: [1, 0, 0, 0, 1, 0, 0, 0, 1], t: [1, 2, 3], yaw: 0, residual_deg: 0.5, extra: 1}), {R: [1, 0, 0, 0, 1, 0, 0, 0, 1], t: [1, 2, 3], yaw: 0, residual_deg: 0.5}); assert.equal(joinOf({R: [1, 2], t: [1, 2, 3]}), null);
  // ONE LAW, TWO LANGUAGES: the vectors the Swift port is held to (Checks/cardframe) are this law's own, byte for byte
  assert.equal(VECTORS.lead_ms, LEAD_MS);
  const wire = (x) => JSON.parse(JSON.stringify(x));   // as the file holds them (a -0 is a 0 on the wire)
  for (const v of VECTORS.frames) assert.deepEqual(wire(cardFrame(v.entity, v.place)), v.frame, `frame on ${v.glass} at ${placeText(v.place)}`);
  for (const v of VECTORS.joins) {
    const f2 = VECTORS.frames.find((x) => x.glass === v.glass && placeText(x.place) === placeText(v.place)).frame;
    assert.deepEqual(wire(cardJoin(v.world, f2)), v.join, `join on ${v.glass} turned ${v.yaw}`); assert.deepEqual(wire(toStation(v.join, v.world.centre)), v.back);
  }
  assert.equal(VECTORS.flat, null); assert.equal(VECTORS.disagree, null);
});

test('her words: caught and landed, for a visit, at the station\'s count, and nothing else', () => {
  assert.deepEqual(WORDS, ['caught', 'landed']); assert.equal(WORD_TYPE, 'her.handoff');
  const at = {count: 11699061094.172, at_ms: 1792696354092.2};
  assert.deepEqual(wordOf({visit: VISIT, event: 'caught', ...at, extra: 1}, isVisitId), {visit: VISIT, event: 'caught', round: 1, ...at}, 'a word naming no round is the first');
  const landed = wordOf({visit: VISIT, event: 'landed', round: 2, ...at, place: [-0.5, -0.1, -1.9], world: 'E2BC5DF0-4EB2-81CF-1D43-A20FB14D7E30', join: {R: [1, 0, 0, 0, 1, 0, 0, 0, 1], t: [0, 0, 0]}, eye: {p: [0, 0, 0], f: [0, 0, -1]}}, isVisitId);
  assert.deepEqual(landed, {visit: VISIT, event: 'landed', round: 2, ...at, place: [-0.5, -0.1, -1.9], world: 'E2BC5DF0-4EB2-81CF-1D43-A20FB14D7E30', join: {R: [1, 0, 0, 0, 1, 0, 0, 0, 1], t: [0, 0, 0]}, eye: {p: [0, 0, 0], f: [0, 0, -1]}}); assert.equal(wordOf({visit: VISIT, event: 'landed', round: 0, ...at, place: [0, 0, 0], world: 'w'}, isVisitId).round, 1); assert.equal('join' in wordOf({visit: VISIT, event: 'landed', ...at, place: [0, 0, 0], world: 'w', join: {R: [1], t: [0, 0, 0]}}, isVisitId), false, 'a join that is not one is dropped, the word kept');
  for (const body of [null, 'caught', {visit: VISIT, event: 'gone', ...at}, {visit: 'x', event: 'caught', ...at}, {visit: VISIT.toLowerCase(), event: 'caught', ...at}, {event: 'caught', ...at},
    {visit: VISIT, event: 'caught'}, {visit: VISIT, event: 'caught', count: -1, at_ms: 1}, {visit: VISIT, event: 'caught', count: 1, at_ms: 0}, {visit: VISIT, event: 'caught', count: '5', at_ms: 1},
    {visit: VISIT, event: 'landed', ...at}, {visit: VISIT, event: 'landed', ...at, place: [0, 0], world: 'w'}, {visit: VISIT, event: 'landed', ...at, place: [0, 0, 0], world: 'a b'}]) {
    assert.equal(wordOf(body, isVisitId), null, JSON.stringify(body));
  }
  assert.equal(offsetOf(1792696354092, 1792696354000, 1792696354020), 82, 'the house clock less this page\'s, at the trip\'s middle'); assert.equal(offsetOf(1, 2, 1), null); assert.equal(offsetOf(NaN, 1, 2), null); assert.equal(instantOf({at_ms: 1792696354492}, 82), 1792696354410, 'the page acts at the word\'s instant on its own clock'); assert.equal(instantOf({at_ms: 1}, null), null); assert.equal(instantOf(null, 0), null); assert.equal(LEAD_MS, 400);
});

test('the card at a whole number of screen pixels per card pixel, over her own layer', () => {
  assert.equal(cardScale({w: 1512, h: 982}, 2), 1, 'a 14-inch MacBook: two screen pixels per card pixel'); assert.equal(cardScale({w: 835, h: 875}, 2), 0.5, 'a narrow window: one'); assert.equal(cardScale({w: 300, h: 300}, 1), 1, 'never under one');
  for (const [w, h, dpr] of [[1440, 900, 1], [2560, 1440, 1], [1728, 1117, 2], [1280, 800, 1.5]]) {
    const k = cardScale({w, h}, dpr) * dpr;
    assert.equal(k, Math.round(k), `${w}x${h}@${dpr}: whole screen pixels`);
  }
  assert.ok(HANDOFF_Z > LAYER_Z);
});

test('the dev server names the house: the Nest her words go on (the primary, or a replica\'s upstream) and this glass', () => {
  assert.equal(houseOf({role: 'primary', seq: 1}, 'http://127.0.0.1:8904'), 'http://127.0.0.1:8904', 'the serving Mac'); assert.equal(houseOf({role: 'replica', upstream: 'http://192.168.8.164:8904/'}, 'http://127.0.0.1:8904'), 'http://192.168.8.164:8904', 'the new Mac\'s replica names the house'); assert.equal(houseOf({role: 'replica', upstream: null}, 'http://127.0.0.1:8904'), null); assert.equal(houseOf(null, 'http://127.0.0.1:8904'), null);
  const page = readFileSync(new URL('./dl-handoff.js', import.meta.url), 'utf8');
  assert.match(page, /\/nest\/stream\?types=\$\{WORD_TYPE\}/, 'the page hears her words on the Nest\'s own stream'); assert.match(page, /\/nest\/head/, 'and takes its offset to the house clock from the Nest\'s head'); assert.doesNotMatch(page, /\/dev\/handoff/, 'no door of the dev server\'s'); assert.doesNotMatch(readFileSync(new URL('../tools/mint-dev.mjs', import.meta.url), 'utf8'), /handoffHub|\/dev\/handoff/, 'the dev server has no door for her words');
});

test('she stays gone: the page keeps her round per visit, and the phone keeps her landing per visit and round', () => {
  assert.equal(KEEP_KEY, 'dyson-handoff-v1'); assert.deepEqual(keptOf(null, VISIT), {round: 1, left: false}, 'nothing kept: her first round, on the card'); assert.deepEqual(keptOf(JSON.stringify({visit: VISIT, round: 2, left: true}), VISIT), {round: 2, left: true}, 'a reload: she has left in round 2'); assert.deepEqual(keptOf(JSON.stringify({visit: 'ABCDEFGHJKLMNPQRSTUVWXYZ23', round: 4, left: true}), VISIT), {round: 1, left: false}, 'another visit\'s keeping is not this one\'s'); assert.deepEqual(keptOf('{', VISIT), {round: 1, left: false});
  const swift = readFileSync(clip('Shared/Handoff.swift'), 'utf8');
  assert.match(swift, /\$0\.name == "r"/, 'the phone reads the round from the code'); assert.match(swift, /nefertiti\.height\.\\\(key\)/, 'her landing kept per visit and round');
  const stage = readFileSync(clip('Shared/ARHandoffView.swift'), 'utf8');
  assert.match(stage, /initialWorldMap = kept\.map/, 'the kept room loaded'); assert.match(stage, /ARAnchor\(name: Self\.anchorName/, 'her place an anchor of the room');
});
