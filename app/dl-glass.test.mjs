// dl-glass.test.mjs: THE MINT PAGE IS A GLASS OF THE ROOM, held to its law (dl-glass.mjs) and run whole under node with no browser (dl-glass.js: every
// dependency injected; the one module's real bytes from the tree, the room's real pin off the eye door in the tree, the rite's real count door host from
// the tree, a fake station's clock, a fake Nest).
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {WASM_FILE, PIN_FILE, pinOf, TRIPS, seatOf, nestOf, riteOf, glassWord, gatesOf, receiptOf, NEST_DEFAULT} from './dl-glass.mjs';
import {mountGlass, REFS, lanOf} from './dl-glass.js';

const here = (p) => new URL(p, import.meta.url);
const sha256 = (b) => createHash('sha256').update(b).digest('hex');
const TREE_MODULE = here('../../../../../tools/embertide-mesh/radio/nexus.wasm'), ROOM_MODULE = here(`../../room/${WASM_FILE}`);
const COUNT_DOOR = here('../../../../../tools/embertide-mesh/lib/count-door.mjs');
const EYE_DOOR = here(`../../room/${PIN_FILE}`), BUILD = here('../../../../../embertide-radio/nexus/build.sh');
const PIN = pinOf(readFileSync(EYE_DOOR, 'utf8'));   // the room's pin, as the glass reads it on a seat
const ACTIVE = {schema: 'embertide.scene/v1', id: 'station:scan-20260929-174848', frame: 'scan:scan-20260929-174848'};
// the live house's shapes, read Oct 22 2026 21:xx WEST (the Nest at 127.0.0.1:8904): newmac placed by hand in the Sept 13 scan's frame; tv3 measured
const NEWMAC = {schema: 'embertide.scene-entity/v1', kind: 'screen', frame: 'scan:scan-20260913-115416', registration: 'placed by hand', transform: {position: [-0.9049, -0.2795, -2.5881], yaw: -0.055587}, size_m: [0.3447, 0.2228]};
const TV3 = {schema: 'embertide.scene-entity/v1', kind: 'screen', frame: 'scan:scan-20260929-174848', registration: 'measured: by the phone, lidar from 8192 points', transform: {position: [0.4525, 1.1728, -2.5063], yaw: -0.124759}, size_m: [1.756, 0.988]};
const ROOM_EMPTY = {schema: 'embertide.room-primitives/v0', frame: 'station', empty: true};
const MODULES_SCORE = {schema: 'embertide.program-modules/1', modules: {'embertide-score': {hash: 'sha256:a7db', url: 'wasm/x.wasm', bytes: 1}}};
const MODULES_ALL = {schema: 'embertide.program-modules/1', modules: {'embertide-score': {}, 'embertide-field': {}, 'music-field-kernel': {}}};

test('the law: the seat, the Nest and the rite as the page names them', () => {
  assert.equal(seatOf('?seat=newmac&harmony=local'), 'newmac');
  assert.equal(seatOf('?harmony=local', {nest: 'http://192.168.8.188:8904', glass: 'newmac'}), 'newmac');   // the dev server's house (/dev/lan)
  assert.equal(seatOf('?seat=../x'), null); assert.equal(seatOf(''), null); assert.equal(seatOf('', {glass: 'a b'}), null);
  assert.equal(nestOf(''), NEST_DEFAULT); assert.equal(nestOf('?nest=192.168.8.188:8904'), 'http://192.168.8.188:8904'); assert.equal(nestOf('', {nest: 'http://h:8904/'}), 'http://h:8904');
  assert.equal(riteOf('', 'http://192.168.8.188:8904'), 'http://192.168.8.188:8903'); assert.equal(riteOf('?rite=h:1', 'http://x'), 'http://h:1');
});

test('the pin: the room\'s own, read off the eye door\'s line that build.sh writes, equal to the bytes in the tree and in the room', async () => {
  const eye = await import('../vendor/embertide-app/ui/intro/room/eye-door.mjs');   // under node the eye door loads nothing at import
  assert.equal(PIN, eye.NEXUS_WASM_SHA256);
  assert.equal(sha256(readFileSync(TREE_MODULE)), PIN);
  assert.equal(sha256(readFileSync(ROOM_MODULE)), PIN);
  // build.sh writes and checks that very line in the eye door on every rebuild, so the glass follows each rebuild with no line of its own to move
  const build = readFileSync(BUILD, 'utf8');
  assert.ok(build.includes(`s/^export const NEXUS_WASM_SHA256 = '[0-9a-f]{64}';/export const NEXUS_WASM_SHA256 = '$sum';/" "$room/eye-door.mjs"`), 'build.sh writes the eye door\'s line');
  assert.ok(build.includes(`grep -q "^export const NEXUS_WASM_SHA256 = '$sum';" "$room/eye-door.mjs"`), 'build.sh checks the eye door\'s line');
  assert.equal(pinOf(`// x\nexport const NEXUS_WASM_SHA256 = '${'0'.repeat(64)}';   // build.sh writes this line`), '0'.repeat(64));
  assert.equal(pinOf(`export const NEXUS_WASM_SHA256 = '${'0'.repeat(63)}';`), null); assert.equal(pinOf(`const NEXUS_WASM_SHA256 = '${'0'.repeat(64)}';`), null);
  assert.equal(pinOf(null), null); assert.equal(pinOf(''), null);
});

test('the glass\'s word and the field\'s gates, on tonight\'s house and on a measured one', () => {
  const tonight = glassWord(NEWMAC, ACTIVE);
  assert.equal(tonight.held, true); assert.equal(tonight.in_frame, false); assert.equal(tonight.measured, false);
  assert.match(tonight.why, /stands in scan:scan-20260913-115416, the active scene in scan:scan-20260929-174848/);
  const byHand = glassWord({...NEWMAC, frame: ACTIVE.frame}, ACTIVE); assert.match(byHand.why, /placed by hand: not placed by a measurement/);
  assert.equal(glassWord(TV3, ACTIVE).why, null); assert.deepEqual(glassWord(TV3, ACTIVE).size_m, [1.756, 0.988]);
  assert.match(glassWord(null, ACTIVE).why, /no record/); assert.match(glassWord(TV3, null).why, /no active scene/);
  const gates = gatesOf({glass: tonight, room: ROOM_EMPTY, birth: null, modules: MODULES_SCORE});
  assert.equal(gates.length, 4); assert.match(gates[0], /room is not measured/); assert.match(gates[1], /glass is not measured: this glass stands in/); assert.match(gates[2], /no field is born/); assert.match(gates[3], /not published/);
  assert.deepEqual(gatesOf({glass: glassWord(TV3, ACTIVE), room: {closed: true, floor: -0.68, ceiling: 2.1, loop: [[0, 0], [1, 0], [1, 1]]}, birth: {field: 'G1'}, modules: MODULES_ALL}), []);
  const r = receiptOf({seat: 'tv3', gates, causes: 2}); assert.equal(r.seat, 'tv3'); assert.equal(r.gates.length, 4); assert.equal(r.mounted, false); assert.equal(r.causes, 2);
});

/** a fake house: the module's bytes from the tree, a station whose clock runs on this host's Date.now, a Nest of fixtures, the dev server's /dev/lan */
function house({refs = {}, lan = null, bytes = readFileSync(TREE_MODULE), station = true, pin = true} = {}) {
  const T0 = Date.now() - 60_000, calls = [], joins = [], fields = [];
  const json = (status, body) => ({ok: status < 400, status, json: async () => body, arrayBuffer: async () => bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength)});
  const fetch = async (url) => {
    const u = String(url); calls.push(u);
    if (u.endsWith(`/${PIN_FILE}`)) return pin ? {ok: true, status: 200, text: async () => readFileSync(EYE_DOOR, 'utf8')} : json(404, {});
    if (u.endsWith(WASM_FILE)) return json(200, null);
    if (u.endsWith('/rite/radio/clock')) return station ? json(200, {server_ms: Date.now(), source: 'tap', timeline: {epoch: 'station-test-3-48000-2048', rate_hz: 48000, sample_position: (Date.now() - T0) * 48, beacon: {n: 2048, seq: Math.floor((Date.now() - T0) * 48 / 2048), ts_ms: Date.now()}}}) : json(503, {});
    if (u.endsWith('/dev/lan')) return lan ? json(200, lan) : json(404, {});
    const m = u.match(/\/nest\/ref\/(.+)$/); if (m) return json(200, {name: m[1], ref: m[1] in refs && refs[m[1]] != null ? {value: refs[m[1]]} : null});
    return json(404, {});
  };
  const join = (opts) => { const j = {opts, closed: false, close() { j.closed = true; }}; joins.push(j); return j; };
  const fieldOf = async () => (opts) => { const fl = {opts, stopped: false, state: () => ({mode: 'fake', seat: opts.seat}), stop() { fl.stopped = true; }}; fields.push(fl); return fl; };
  return {calls, joins, fields, fetch, join, fieldOf};
}
const deps = (h, extra = {}) => ({doc: null, win: null, fetch: h.fetch, join: h.join, fieldOf: h.fieldOf, countDoorOf: () => import(COUNT_DOOR), digest: async (b) => sha256(b), later: (fn) => setTimeout(fn, 0), ...extra});
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

test('mounted on a seat: the module by its hash, the count on the station\'s beacon, the twin\'s gates, the field on this glass, its words unsaid', async () => {
  const h = house({refs: {'scene/active': ACTIVE, 'scene/entities/newmac': NEWMAC, 'room/primitives': ROOM_EMPTY, 'program/modules': MODULES_SCORE}});
  const g = await mountGlass(deps(h, {search: '?seat=newmac&nest=http://nest.test:8904&harmony=local'}));
  const s = g.state();
  assert.equal(s.why, null); assert.equal(s.mounted, true); assert.equal(s.seat, 'newmac'); assert.equal(s.nest, 'http://nest.test:8904'); assert.equal(s.rite, 'http://nest.test:8903');
  assert.equal(s.module.sha256, PIN); assert.ok(s.module.bytes > 600_000); assert.ok(s.module.load_ms >= 0); assert.match(s.module.pin, /\/intro\/room\/eye-door\.mjs$/);
  assert.equal(h.calls.filter((u) => u.endsWith(`/${PIN_FILE}`)).length, 1, 'the room\'s pin is read once, at the mount');
  assert.equal(s.count.trips, TRIPS); assert.equal(s.count.taken, TRIPS, `the station's trips were refused: ${s.count.why}`); assert.equal(s.count.basis, true);
  assert.ok(Number.isFinite(s.count.at) && s.count.at > 0, 'the count stands'); assert.ok(s.count.unc_ms >= 0); assert.ok(s.count.beat_ms > 0);
  await sleep(25); const later = g.state().count.at; assert.ok(later > s.count.at + 24 * 48 - 48 * 5 && later < s.count.at + 25 * 48 + 48 * 20, `the count runs at the station's rate (${later - s.count.at} samples over ~25 ms)`);
  assert.equal(s.timers, 0, 'nothing is armed at rest');
  assert.equal(h.calls.filter((u) => u.endsWith('/rite/radio/clock')).length, TRIPS); assert.equal(h.calls.filter((u) => u.endsWith('/dev/lan')).length, 0, 'a page with its own seat asks no dev server');
  assert.equal(h.joins.length, 1); assert.equal(h.joins[0].opts.types, 'ref'); assert.equal(h.joins[0].opts.refs, REFS('newmac').join(',')); assert.equal(h.joins[0].opts.nest, 'http://nest.test:8904');
  assert.equal(s.gates.length, 4); assert.match(s.gates[1], /scan:scan-20260913-115416/);
  assert.equal(h.fields.length, 1); assert.equal(h.fields[0].opts.seat, 'newmac'); assert.equal(h.fields[0].opts.nest, 'http://nest.test:8904'); assert.deepEqual(s.field, {mode: 'fake', seat: 'newmac'});
  await h.fields[0].opts.post({type: 'field.word'}); assert.equal(h.calls.filter((u) => u.includes('/nest/append')).length, 0, 'no write to the Nest');
  const before = g.state().causes;
  h.joins[0].opts.onEntry({type: 'ref', payload: {name: 'field/birth', value: {schema: 'embertide.field-birth/1', field: 'G1', scan: 'scan-20260929-174848', frame: ACTIVE.frame}}});
  assert.equal(g.state().causes, before + 1); assert.equal(g.state().gates.length, 3, 'a field born is one gate fewer'); assert.ok(!g.state().gates.some((w) => /no field is born/.test(w)));
  h.joins[0].opts.onEntry({type: 'wind.body', payload: {}}); assert.equal(g.state().causes, before + 1, 'another type on the stream is not this glass\'s cause');
  const c = await g.count(); assert.ok(Number.isFinite(c.at));
  g.stop(); assert.equal(h.joins[0].closed, true); assert.equal(h.fields[0].stopped, true);
});

test('no seat: the public page fetches nothing and mounts nothing; the dev road asks the dev server once', async () => {
  const pub = house(); const g = await mountGlass(deps(pub, {search: '?from=harmony'}));
  assert.match(g.state().why, /no seat/); assert.equal(pub.calls.length, 0); assert.equal(pub.joins.length, 0); assert.equal(pub.fields.length, 0); assert.equal(g.state().count, null);
  const dev = house({lan: {nest: 'http://192.168.8.188:8904', glass: null}}); const d = await mountGlass(deps(dev, {search: '?debug=118.12&harmony=local&handoff=lan'}));
  assert.match(d.state().why, /no seat/); assert.deepEqual(dev.calls, ['/dev/lan']); assert.equal(dev.joins.length, 0);
  const named = house({lan: {nest: '192.168.8.188:8904', glass: 'newmac'}, refs: {'scene/active': ACTIVE}}); const n = await mountGlass(deps(named, {search: '?harmony=local&handoff=lan'}));
  assert.equal(n.state().seat, 'newmac'); assert.equal(n.state().nest, 'http://192.168.8.188:8904'); assert.equal(n.state().rite, 'http://192.168.8.188:8903'); assert.equal(n.state().mounted, true); n.stop();
  assert.equal(await lanOf(async () => ({ok: true, json: async () => ({host: '192.168.8.188:9061'})})), null, 'an older dev server ({host} only, the Wi-Fi door\'s) names no house');
  assert.deepEqual(await lanOf(async () => ({ok: true, json: async () => ({nest: 'http://h:8904', glass: 'newmac'})})), {nest: 'http://h:8904', glass: 'newmac'});
  assert.equal(await lanOf(async () => { throw new Error('no server'); }), null);
});

test('other bytes, or bytes with no room\'s pin to answer to, are refused before they run; a station that does not answer leaves the glass mounted with no basis, said', async () => {
  const wrong = house({refs: {'scene/active': ACTIVE}, bytes: Buffer.concat([readFileSync(TREE_MODULE), Buffer.from([0])])});
  let instantiated = 0; const g = await mountGlass(deps(wrong, {search: '?seat=newmac', instantiate: async () => { instantiated++; return {}; }}));
  assert.match(g.state().why, /not the pinned one/); assert.equal(instantiated, 0); assert.equal(g.state().count, null); assert.equal(wrong.joins.length, 0);
  const blind = house({refs: {'scene/active': ACTIVE}, pin: false}); const b = await mountGlass(deps(blind, {search: '?seat=newmac', instantiate: async () => { instantiated++; return {}; }}));
  assert.match(b.state().why, /the room's pin answered http 404 at .*\/intro\/room\/eye-door\.mjs: nothing runs/); assert.equal(instantiated, 0); assert.equal(b.state().module, null); assert.equal(blind.joins.length, 0);
  const mute = house({refs: {'scene/active': ACTIVE}, station: false}); const m = await mountGlass(deps(mute, {search: '?seat=newmac'}));
  assert.equal(m.state().mounted, true); assert.equal(m.state().count.basis, false); assert.equal(m.state().count.at, null); assert.equal(m.state().count.failed, TRIPS); assert.match(m.state().count.why, /503/); m.stop();
});
