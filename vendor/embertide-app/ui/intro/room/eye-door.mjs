// eye-door.mjs · THE EYE DOOR ON A GLASS (Oct 19 2026): the glue, no rule. The off-axis frustum of a placed glass from his eye, its projection and view,
// and the anamorphic gate's verdict are THE NEXUS's (embertide-radio/nexus/src/doors/eye.rs), the one module every glass and phone runs, here by its
// sha256 before it runs (NEXUS_WASM_SHA256: build.sh writes it, the same pin as radio/nexus-glass.js and lib/projector-nexus.mjs), instantiated with no
// import, its door called with 24 doubles in and 40 out over the module's own memory. His words: Oct 18 2026 16:02 WEST "the anamorphic ovelray must be
// coordinated by the WASM NEXUS"; Oct 19 23:1x "is there anything we can make native to the WASM Nexus?". Until this file every glass lib carried its
// own copy of the law (EYE-LANDING.md, the census); the libs now call frustum() and matrices() here, one-law.mjs's shapes, the door's numbers.
//
// THE BYTES: ./wasm/embertide-nexus.wasm beside this file (build.sh copies the module there; the room folder is served wherever its pages are, as
// ./wasm/embertide-scene.wasm is). In a page the module is fetched, hashed (crypto.subtle on a secure page, isa.mjs's JavaScript sha256 on a LAN http
// one) and compiled BEFORE ANY MODULE THAT IMPORTS THIS ONE RUNS (a top-level await): a glass's first picture already has the door, and no picture of
// the law stands behind it. Under node the same file is read, hashed and compiled from the tree at the first ask (tests, tools; a server that imports
// a lib for another of its laws pays nothing). A module that does not load,
// or is not the pinned one, is no door: frustum() answers null and why() says so; nothing throws, no page dies of it. HER CAST IS THE MODULE'S
// (one.mjs) is the same rule.
//
//   frustum(plane, eye, {near, far, rect, gate})  one-law.mjs frustum's shape { l, r, b, t, near, far, d, eye, x, y, z } plus projection and view (16
//                                                 each, column major) and verdict; null when the door refuses (why()) or is not in hand. near
//                                                 null: the glass is the near plane (well-law's window). gate: gateWord(anamorphic-gate.mjs gateOf).
//   matrices(fr)                                  one-law.mjs matrices' { projection, world } and the view
//   gateWord(gate)                                anamorphic-gate.mjs gateOf's answer as the door's bits (the ask and the three it read)
//   state()                                       the module's hash, its bytes, how it was loaded, the calls, the last refusal
import * as E from './eye-law.mjs';
import { digestHex, sha256Hex } from './isa/isa.mjs';
// THE EYE IS ONE VECTOR (Nov 2 2026): the module's choice door and phone doors are no longer bound here: the overlay reads the one eye the fold writes on
// the scene (overlay-eye.mjs); tv3's page still binds them through lib/projector-nexus.mjs (eye-choice.mjs), said as owed in THE-EYE-IS-ONE-VECTOR-LANDING.md

export const WASM_FILE = './wasm/embertide-nexus.wasm';
export const NEXUS_WASM_SHA256 = '1a88db44621783a8e9a588c06ae312ec991e177d95f757fa96c2c6fef1a07a39';   // build.sh writes this line (THE PROGRAM BY ITS HASH)
export const { NEAR_M, FAR_M, IN_N, OUT_N, ASK, SHELL, PLACED, EYES, WHY } = E;
const LOAD_MS = 8000, fin = Number.isFinite;   // a fetch that has not answered in this long is no door (the page lives; why() says it)

const S = { x: null, inp: null, out: null, sha256: null, bytes: 0, from: null, load_ms: null, calls: 0, refused: 0, why: 'the eye door is not loaded' };
function views() { S.inp = new Float64Array(S.x.memory.buffer, S.x.nexus_eye_in(), IN_N); S.out = new Float64Array(S.x.memory.buffer, S.x.nexus_eye_out(), OUT_N); }
function take(instance, sha256, bytes, from, t0) {
  const x = instance.exports;
  for (const d of ['nexus_eye', 'nexus_eye_in', 'nexus_eye_out', 'nexus_eye_in_len', 'nexus_eye_out_len']) if (typeof x[d] !== 'function') throw new Error(`the module has no ${d} (a nexus older than the eye door)`);
  if (x.nexus_eye_in_len() !== IN_N || x.nexus_eye_out_len() !== OUT_N) throw new Error(`the eye door's layout is ${x.nexus_eye_in_len()} in, ${x.nexus_eye_out_len()} out; this glue writes ${IN_N} and reads ${OUT_N}`);
  S.x = x; views(); S.sha256 = sha256; S.bytes = bytes; S.from = from; S.why = null;
  S.load_ms = Math.round((performance.now() - t0) * 1000) / 1000;
  return true;
}
const refuseModule = (why) => { S.x = null; S.why = why; return false; };
function noImports(mod) { const im = WebAssembly.Module.imports(mod); if (im.length) throw new Error(`the module imports ${im.map((i) => i.module + '.' + i.name).join(' ')}: the nexus imports nothing`); return mod; }

/** loadBytes(bytes, {sha256, from}) -> whether the door is in hand: the bytes hashed (sync: isa.mjs's sha256), compiled and instantiated at once. Node's
 *  road (and a test's with bytes in hand); a page uses load(). sha256 null takes any bytes (a proof of a fresh build before its pin; never a page). */
export function loadBytes(bytes, { sha256 = NEXUS_WASM_SHA256, from = 'bytes in hand' } = {}) {
  const t0 = performance.now();
  try {
    const u8 = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes), got = nodeDigest(u8) || sha256Hex(u8);
    if (sha256 && got !== sha256) return refuseModule(`the module is not the pinned one: sha256 ${got}, the pin ${sha256}`);
    return take(new WebAssembly.Instance(noImports(new WebAssembly.Module(u8)), {}), got, u8.length, from, t0);
  } catch (e) { return refuseModule(`the eye door did not load: ${String(e?.message || e).slice(0, 200)}`); }
}
/** load({bytes, url, sha256}) -> whether the door is in hand: fetched (WASM_FILE beside this file unless said), hashed, compiled, instantiated. */
export async function load({ bytes = null, url = null, sha256 = NEXUS_WASM_SHA256 } = {}) {
  const t0 = performance.now();
  try {
    let u8 = bytes ? (bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes)) : null, from = bytes ? 'bytes in hand' : null;
    if (!u8) {
      const at = url || new URL(WASM_FILE, import.meta.url);
      const signal = typeof AbortSignal !== 'undefined' && AbortSignal.timeout ? AbortSignal.timeout(LOAD_MS) : undefined;
      const r = await fetch(at, { cache: 'default', signal }); if (!r.ok) return refuseModule(`the eye door's module answered http ${r.status} at ${String(at).slice(0, 160)}`);
      u8 = new Uint8Array(await r.arrayBuffer()); from = String(at);
    }
    const got = await digestHex(u8, globalThis.crypto && globalThis.crypto.subtle);
    if (sha256 && got !== sha256) return refuseModule(`the module is not the pinned one: sha256 ${got}, the pin ${sha256}`);
    const mod = noImports(await WebAssembly.compile(u8));
    return take(await WebAssembly.instantiate(mod, {}), got, u8.length, from, t0);
  } catch (e) { return refuseModule(`the eye door did not load: ${String(e?.message || e).slice(0, 200)}`); }
}
function nodeDigest(u8) { const c = nodeMod('node:crypto'); return c ? c.createHash('sha256').update(u8).digest('hex') : null; }
function nodeMod(name) { try { return typeof process !== 'undefined' && typeof process.getBuiltinModule === 'function' ? process.getBuiltinModule(name) : null; } catch { return null; } }

/** gateWord(g): anamorphic-gate.mjs gateOf's answer ({shell: {anchored}, place: {placed}, eyes: {all}}) as the door's gate: the ask and its three bits. */
export function gateWord(g) {
  if (!g || typeof g !== 'object') return ASK;   // asked with nothing read: the door refuses (no scan)
  return ASK | (g.shell && g.shell.anchored ? SHELL : 0) | (g.place && g.place.placed ? PLACED : 0) | (g.eyes && g.eyes.all ? EYES : 0);
}

/** frustum(plane, eye, {near, far, rect, gate}): THE DOOR on one glass (the head of this file). plane: one-law.mjs planeOf's {c, r, u, n, w, h}. The 24
 *  doubles are written into the module's IN by index (eye-law.mjs inOf's layout), the 40 read from its OUT; the projection and the view are copied
 *  out (a frustum keeps its own matrices: the next call overwrites the module's OUT). */
export function frustum(pl, eye, { near = NEAR_M, far = FAR_M, rect = null, gate = 0 } = {}) {
  if (!S.x && !inHand()) return null;
  if (!pl || !pl.c || !pl.r || !pl.u || !pl.n) { S.refused++; S.why = WHY[E.NO_PLANE]; return null; }
  if (!eye || !(fin(eye[0]) && fin(eye[1]) && fin(eye[2]))) { S.refused++; S.why = WHY[E.NO_EYE]; return null; }   // a null is no coordinate (a Float64Array would read it as 0)
  if (S.inp.length === 0) views();   // the module's memory grew: its old views are detached (length 0) and taken again
  const i = S.inp, c = pl.c, r = pl.r, u = pl.u, n = pl.n;
  i[0] = c[0]; i[1] = c[1]; i[2] = c[2]; i[3] = r[0]; i[4] = r[1]; i[5] = r[2]; i[6] = u[0]; i[7] = u[1]; i[8] = u[2]; i[9] = n[0]; i[10] = n[1]; i[11] = n[2];
  i[12] = pl.w; i[13] = pl.h; i[14] = eye[0]; i[15] = eye[1]; i[16] = eye[2];
  i[17] = near == null ? NaN : near; i[18] = far == null ? NaN : far;
  if (rect) { i[19] = fin(rect.x) ? rect.x : NaN; i[20] = fin(rect.y) ? rect.y : NaN; i[21] = fin(rect.w) ? rect.w : NaN; i[22] = fin(rect.h) ? rect.h : NaN; } else { i[19] = NaN; i[20] = NaN; i[21] = NaN; i[22] = NaN; }   // unsaid: one-law's whole glass
  i[23] = gate;
  const v = S.x.nexus_eye(), o = S.out; S.calls++;
  if (v < 0) { S.refused++; S.why = WHY[v] || `the eye door refused (${v})`; return null; }
  S.why = null;
  // copied into plain arrays: a Float64Array of 16 is 128 bytes, past V8's 64-byte on-heap limit, so each one (a slice too) gets a backing store of its own
  const P = [o[0], o[1], o[2], o[3], o[4], o[5], o[6], o[7], o[8], o[9], o[10], o[11], o[12], o[13], o[14], o[15]];
  const V = [o[16], o[17], o[18], o[19], o[20], o[21], o[22], o[23], o[24], o[25], o[26], o[27], o[28], o[29], o[30], o[31]];
  return { l: o[E.L], r: o[E.RIGHT], b: o[E.B], t: o[E.T], near: o[E.NEAR_OUT], far: o[E.FAR_OUT], d: o[E.D], eye: [eye[0], eye[1], eye[2]], x: r, y: u, z: n,
    projection: P, view: V, verdict: v };
}
/** matrices(fr): one-law.mjs matrices' answer for a frustum of the door's: the projection (the door's), the camera's world basis (the glass's axes and the
 *  eye it was handed: no arithmetic) and the view (the door's), the frustum's own arrays. null for no frustum. */
export function matrices(fr) {
  if (!fr || !fr.projection) return null;
  return { projection: fr.projection, world: [fr.x[0], fr.x[1], fr.x[2], 0, fr.y[0], fr.y[1], fr.y[2], 0, fr.z[0], fr.z[1], fr.z[2], 0, fr.eye[0], fr.eye[1], fr.eye[2], 1], view: fr.view };   // the frustum's own arrays
}
/** why(): the last refusal's words (the module not loaded, the plane, the eye, the gate), null when the last call gave a frustum */
export const why = () => S.why;
export const ready = () => !!S.x || inHand();
/** nexus(): the one instance's exports for another door of the same module on this page (count-door.mjs: the count door), or null while the module is not
 *  in hand. One module a page: its clock is one (count.rs: one clock per module, shared by every door). */
export const nexus = () => (S.x || inHand() ? S.x : null);
export const state = () => ({ ready: ready(), sha256: S.sha256, bytes: S.bytes, from: S.from, load_ms: S.load_ms, calls: S.calls, refused: S.refused, why: S.why });

// THE DOOR IN HAND: a page's fetch BEFORE ANY IMPORTER RUNS (a top-level await: its first picture has the door); under node the tree's file AT THE
// FIRST ASK (a process that imports a lib for another of its laws reads and compiles nothing)
const NODE = import.meta.url.startsWith('file:') && !!nodeMod('node:fs');
let asked = false;
function inHand() {
  if (S.x || asked || !NODE) return !!S.x;
  asked = true;
  try { loadBytes(nodeMod('node:fs').readFileSync(new URL(WASM_FILE, import.meta.url)), { from: 'the tree' }); } catch (e) { refuseModule(`the eye door did not load: ${String(e?.message || e).slice(0, 200)}`); }
  return !!S.x;
}
if (!NODE && typeof fetch === 'function') await load();
