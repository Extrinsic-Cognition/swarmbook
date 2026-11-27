// dl-glass.mjs: THE MINT PAGE IS A GLASS OF THE ROOM (Oct 22 2026), the law dl-glass.js (the page half) stands on. His words, 21:3x WEST: "the webpage
// you have there has to be webGPU'd up into our room-wide distributed runtime"; minutes before, "you gotta focus on the iroh holy monolith of distributed
// runtime". The house's law it obeys: CLAUDE.md THE MUSIC FIELD ("no pixel on any glass has a state, a clock or a rule of its own"; its law 3, "before
// the scan there is no field"); ANNEALED.md rule 3 "Rendering is WebGPU, on cause. No idle animation, no timer that draws"; foundation 9 with the Oct 14
// 05:5x correction ("WGSL on a glass is for the field, not for a splat": the 3D world is never rendered on a room's glass); the oneness lane 4, "every
// page holds the module, takes views, applies the causes it streams" (ec-workspace docs/the-room-is-one-block-oneness-wasm-nexus-zero-copy-hypertrace).
// WHAT THE PAGE BECOMES on a seat of the house (the Mac's screen placed in the twin, scene/entities/<seat>): it holds the one module by its hash (the
// room's eye-door.mjs: the same bytes as tools/embertide-mesh/radio/nexus.wasm), stands on the station's count (the stamp door, nexus_beacon, fed the
// rite's beacon: one trip is one reading of GET /rite/radio/clock between two instants of this page's own clock), reads the twin off the Nest's one
// stream (nest-hub.mjs) and mounts the room's field glass (room/field-glass.mjs: field/1 on this glass from the same causes, its word the judge; the music
// field's wave painted on this glass's own pixels by WebGPU, each pixel at its measured place in the Station). Nothing of the mint's own is drawn
// through it: the stop stays the stop. THE GATES are the house's, said in the receipt and never skipped: the glass measured in the active scene's frame
// (a phone's sighting of its code), the room's shell closed by the scan (room/primitives), the field born (field/birth: his hand), the field's module in
// program/modules (isa/publish.mjs --write: his hand).
// Pure: no DOM, no fetch, no clock.

export const SEAT_RE = /^[\w.-]{1,32}$/;
// THE PROGRAM BY ITS HASH, THE ROOM'S OWN PIN (Oct 28 2026): the sha256 of tools/embertide-mesh/radio/nexus.wasm, the bytes the room folder serves as
// wasm/embertide-nexus.wasm, as the room's eye door holds it (room/eye-door.mjs NEXUS_WASM_SHA256: the line embertide-radio/nexus/build.sh writes and
// greps on every rebuild), read off that line on a seat before the bytes run; any other bytes are refused before they run. Read, not imported: in a
// browser the eye door loads the module itself at import, a second instance on this page. Until Oct 28 this file held a copy of the pin that build.sh
// never wrote: from Oct 23 13:24 (364a04ebc, the first rebuild after this glass landed) every rebuild left it behind, and the glass refused the house's
// module on every seat (its 2abd671b against seven pins in turn, fa34516c to 19ac95ce). A copy build.sh wrote would put every landing that rebuilds the
// module (12 from Oct 20 to Oct 28) under rule 8 for a line the page never needed: the bytes are the room folder's, so the room's pin is the one they
// answer to.
export const PIN_FILE = 'eye-door.mjs';   // under the room folder, beside WASM_FILE
export const PIN_LINE = /^export const NEXUS_WASM_SHA256 = '([0-9a-f]{64})';/m;   // build.sh's line in the eye door (its sed and its grep)
export const WASM_FILE = 'wasm/embertide-nexus.wasm';   // under the room folder (embertide-app/ui/intro/room/)
export const NEST_DEFAULT = 'http://127.0.0.1:8904';   // the house's Nest as the room's pages name it (nest-hub.mjs NEST)
export const RITE_PORT = 8903;   // the rite beside the Nest: GET /rite/radio/clock is the station's beacon on the LAN (nexus doors/count.rs)
export const TRIPS = 4;   // clock readings at the mount: the stamp door keeps the trips and places the axis by the least round trip (clock.rs)
export const TRIP_MS = 250;   // between two readings at the mount; nothing after them (a reading is a cause the page asks for, not a timer that draws)
export const ENTITY = 'scene/entities/';

const fin = Number.isFinite;
const str = (v) => (typeof v === 'string' ? v : '');
const trimSlash = (u) => String(u).replace(/\/+$/, '');

/** seatOf(search, lan): the glass this page is, from the page's own ?seat= (the house's word on every glass page) or the dev server's house (/dev/lan
 *  {nest, glass}: the handoff lane's shape, tools/mint-dev.mjs --glass); null when neither names one (this page is then no glass and mounts nothing). */
export function seatOf(search, lan = null) {
  const q = new URLSearchParams(search).get('seat') ?? lan?.glass ?? null;
  return typeof q === 'string' && SEAT_RE.test(q) ? q : null;
}
/** nestOf(search, lan): the Nest this glass reads: ?nest=, else the dev server's, else the house's default. */
export function nestOf(search, lan = null) {
  const q = new URLSearchParams(search).get('nest') ?? lan?.nest ?? null;
  if (typeof q !== 'string' || !q) return NEST_DEFAULT;
  return trimSlash(/^https?:\/\//.test(q) ? q : `http://${q}`);
}
/** riteOf(search, nest): the rite whose clock door the count comes from: ?rite=, else the Nest's host on RITE_PORT. */
export function riteOf(search, nest) {
  const q = new URLSearchParams(search).get('rite');
  if (typeof q === 'string' && q) return trimSlash(/^https?:\/\//.test(q) ? q : `http://${q}`);
  try { const u = new URL(nest); return `${u.protocol}//${u.hostname}:${RITE_PORT}`; } catch { return `http://127.0.0.1:${RITE_PORT}`; }
}

/** pinOf(text): the module's sha256 off the eye door's source (PIN_LINE), or null when the line is not there. */
export function pinOf(text) { return PIN_LINE.exec(str(text))?.[1] ?? null; }

// THE COUNT is not this file's law: the trip of the rite's clock into the stamp door is tools/embertide-mesh/lib/count-door.mjs (createCountDoor), which
// the page imports BY PATH from the rite that serves it (<rite>/lib/count-door.mjs), the same bytes the rite stamps by; no copy here.

/** glassWord(entity, active): what the twin says of this glass: its frame against the active scene's, whether a measurement placed it (the field's
 *  measuredPlane and the eye door's gate both ask for one), its size. */
export function glassWord(entity, active) {
  const frame = str(active?.frame) || null, e = entity && typeof entity === 'object' ? entity : null;
  if (!e) return { held: false, frame, in_frame: false, measured: false, size_m: null, registration: null, why: 'the Nest holds no record of this glass' };
  const registration = str(e.registration), measured = /^measured\b/i.test(registration), in_frame = !!frame && e.frame === frame;
  const size_m = Array.isArray(e.size_m) && e.size_m.length >= 2 && e.size_m.slice(0, 2).every((v) => fin(v) && v > 0) ? e.size_m.slice(0, 2) : null;
  const why = !frame ? 'no active scene' : !in_frame ? `this glass stands in ${str(e.frame) || 'no frame'}, the active scene in ${frame}` : !measured ? `this glass is ${registration || 'unplaced'}: not placed by a measurement` : null;
  return { held: true, frame, in_frame, measured, size_m, registration: registration || null, why };
}

/** gatesOf({glass, room, birth, modules}): what the field on this glass waits for, in the order the house's road checks them (field-wave.mjs reset), as
 *  words; [] when nothing: the field paints. room: room/primitives; birth: field/birth; modules: program/modules. */
export function gatesOf({ glass, room = null, birth = null, modules = null } = {}) {
  const out = [];
  if (!room || room.closed !== true) out.push('the room is not measured: room/primitives is not a closed shell (the scan)');
  if (!glass?.held || glass.why) out.push(glass?.why ? `the glass is not measured: ${glass.why}` : 'the glass is not measured');
  if (!birth || typeof birth !== 'object' || !birth.field) out.push('no field is born: field/birth is null (his hand)');
  if (!modules?.modules || !modules.modules['music-field-kernel'] || !modules.modules['embertide-field']) out.push('the field\'s modules are not published: program/modules holds no embertide-field or music-field-kernel row (isa/publish.mjs --write, his hand)');
  return out;
}

/** receiptOf(S): the glass's receipt, the page's state as words and numbers (window.dlGlass.state()). */
export function receiptOf(S) {
  return {
    seat: S.seat ?? null, nest: S.nest ?? null, rite: S.rite ?? null, mounted: S.mounted === true,
    module: S.module ?? null,   // { sha256, bytes, from, pin, load_ms }: the one module by its hash, and where the room's pin was read
    count: S.count ?? null,   // { at: the count now (samples), unc_ms, beat_ms, trips, refused } from the stamp door, or null before a trip
    glass: S.glass ?? null, gates: Array.isArray(S.gates) ? S.gates.slice() : [], field: S.field ?? null,
    causes: S.causes ?? 0, draws: S.draws ?? 0, timers: S.timers ?? 0, why: S.why ?? null,
  };
}
