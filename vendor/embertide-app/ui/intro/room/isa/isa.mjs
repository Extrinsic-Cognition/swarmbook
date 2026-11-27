// isa.mjs · THE ROOM'S ISA: THE LAW OF A GLASS HOST (Oct 14 2026). His frame, 03:4x WEST: "maximize cross-device compatibility... everyone is
// always building DOOM ON X DEVICE... what if you had a shit ton of devices in the same room and they all spoke WASM time-minimized with
// neural-content-delivery-network". The canon already says it: the song is the program (C-3), stream the program never the state (C-5), every
// device is his actuator (C-1). WASM is the instruction set of the room for the glass role: any device joins by opening one URL; the laws it runs
// are modules named by their hash, delivered ahead of the beat that needs them, cached for good, verified before they run. This file is the law of
// that host, pure and testable (isa.test.mjs); host.mjs is the page that runs it; publish.mjs makes the manifest and the hash-named copies.
//
// THE MANIFEST is one Nest ref, program/modules: { schema, modules: { <name>: { hash, url, bytes, needed_by_ms? } }, by, at }. hash is
// 'sha256:<64 hex>'; url is relative to the room folder (embertide-app/ui/intro/room, the folder every door serves: the rite at /rite/dome/board/,
// aiolos at /intro/room/) and its file name CARRIES the hash: a URL that does not is refused (an immutable name is the whole point: a second open
// costs zero bytes, a wrong byte never runs). needed_by_ms is the Nest-time deadline the module must be ready by (the next bar's downbeat), carried
// and reported; nothing schedules on it yet.
// THE CONTRACT of a module (embertide-score/src/ffi.rs, the shape every law of the house exports): memory, io_in, io_in_len, io_out, io_out_len,
// and its doors, each a plain f64 function; numbers cross as doubles in the two flat buffers, no bindgen, no allocator.
// COST: a manifest parse is a walk of a few keys; a verify is one SHA-256 of the module's bytes (47 KB: about 0.2 ms with the browser's own
// digest, about 2 ms in the JS below where a page on plain http has none: crypto.subtle is a secure context's); a store read is one IndexedDB get
// or one Cache match. Nothing here reads a clock or a timer: the host hands every time in.
export const SCHEMA = 'embertide.program-modules/1';
export const STALE_MS = 10000;   // beat-clock.mjs PULSE_STALE_MS: a beat grid older than this at the Nest's now is no song; the glass rests
export const DOORS = Object.freeze(['memory', 'io_in', 'io_in_len', 'io_out', 'io_out_len']);   // what every module of the room exports

const num = (v) => typeof v === 'number' && Number.isFinite(v);
const HEX64 = /^[0-9a-f]{64}$/;
/** hashOf('sha256:<hex>' | '<hex>') -> the 64 lowercase hex digits, or null */
export const hashOf = (h) => { const s = String(h == null ? '' : h).trim().toLowerCase().replace(/^sha256:/, ''); return HEX64.test(s) ? s : null; };
/** fileNameOf(name, hash): the one naming of a module's file, <name>-<hash>.wasm */
export const fileNameOf = (name, hash) => `${name}-${hash}.wasm`;
const PATH = /^[a-z0-9][a-z0-9_./-]*$/i;   // the rite's rule for a file of the room (rite.mjs, THE TABLE ON A TV)
const pathOk = (u) => typeof u === 'string' && u.length <= 200 && PATH.test(u) && !u.split('/').some((s) => s === '' || s === '..' || s.startsWith('.'));

/** manifestOf(value): program/modules's value -> { schema, modules: { name: { hash, url, bytes, needed_by_ms } }, by, at, refused: [{ name, why }] },
 *  or null when it is not a manifest at all. A row is refused (and named) when its hash is not a sha256, its url is not a file of the room, or
 *  its file name does not carry its hash. */
export function manifestOf(value) {
  if (!value || typeof value !== 'object' || value.schema !== SCHEMA || !value.modules || typeof value.modules !== 'object' || Array.isArray(value.modules)) return null;
  const modules = {}, refused = [];
  for (const [name, m] of Object.entries(value.modules)) {
    if (!/^[a-z0-9][a-z0-9_-]{0,63}$/i.test(name)) { refused.push({ name, why: 'not a module name' }); continue; }
    if (!m || typeof m !== 'object') { refused.push({ name, why: 'not a row' }); continue; }
    const hash = hashOf(m.hash);
    if (!hash) { refused.push({ name, why: 'no sha256' }); continue; }
    if (!pathOk(m.url) || !/\.wasm$/i.test(m.url)) { refused.push({ name, why: 'not a .wasm of the room' }); continue; }
    if (!m.url.toLowerCase().includes(hash)) { refused.push({ name, why: 'the file name does not carry the hash' }); continue; }
    modules[name] = { hash, url: m.url, bytes: Number.isSafeInteger(m.bytes) && m.bytes > 0 ? m.bytes : null, needed_by_ms: num(m.needed_by_ms) ? m.needed_by_ms : null };
  }
  return { schema: value.schema, modules, by: typeof value.by === 'string' ? value.by : null, at: typeof value.at === 'string' ? value.at : null, refused };
}

// ---- SHA-256 (FIPS 180-4), for a page that has no crypto.subtle (plain http on the LAN): about 2 ms for 47 KB on a laptop chip ----
const K = new Uint32Array([0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
  0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da, 0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
  0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85, 0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2]);
const rotr = (x, n) => (x >>> n) | (x << (32 - n));
/** sha256Hex(bytes: Uint8Array) -> 64 hex digits, in JavaScript alone */
export function sha256Hex(bytes) {
  const H = new Uint32Array([0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19]);
  const len = bytes.length, padLen = ((len + 9 + 63) >> 6) << 6, msg = new Uint8Array(padLen);
  msg.set(bytes); msg[len] = 0x80;
  const dv = new DataView(msg.buffer), bits = len * 8;
  dv.setUint32(padLen - 8, Math.floor(bits / 0x100000000)); dv.setUint32(padLen - 4, bits >>> 0);
  const W = new Uint32Array(64);
  for (let off = 0; off < padLen; off += 64) {
    for (let i = 0; i < 16; i++) W[i] = dv.getUint32(off + i * 4);
    for (let i = 16; i < 64; i++) { const a = W[i - 15], b = W[i - 2]; W[i] = (W[i - 16] + (rotr(a, 7) ^ rotr(a, 18) ^ (a >>> 3)) + W[i - 7] + (rotr(b, 17) ^ rotr(b, 19) ^ (b >>> 10))) >>> 0; }
    let a = H[0], b = H[1], c = H[2], d = H[3], e = H[4], f = H[5], g = H[6], h = H[7];
    for (let i = 0; i < 64; i++) {
      const t1 = (h + (rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25)) + ((e & f) ^ (~e & g)) + K[i] + W[i]) >>> 0;
      const t2 = ((rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22)) + ((a & b) ^ (a & c) ^ (b & c))) >>> 0;
      h = g; g = f; f = e; e = (d + t1) >>> 0; d = c; c = b; b = a; a = (t1 + t2) >>> 0;
    }
    H[0] = (H[0] + a) >>> 0; H[1] = (H[1] + b) >>> 0; H[2] = (H[2] + c) >>> 0; H[3] = (H[3] + d) >>> 0; H[4] = (H[4] + e) >>> 0; H[5] = (H[5] + f) >>> 0; H[6] = (H[6] + g) >>> 0; H[7] = (H[7] + h) >>> 0;
  }
  let s = ''; for (let i = 0; i < 8; i++) s += H[i].toString(16).padStart(8, '0'); return s;
}
/** digestHex(bytes, subtle): the browser's own digest where the page has one (a secure context), the JavaScript above elsewhere */
export async function digestHex(bytes, subtle = null) {
  if (subtle && typeof subtle.digest === 'function') { const d = new Uint8Array(await subtle.digest('SHA-256', bytes)); let s = ''; for (const b of d) s += b.toString(16).padStart(2, '0'); return s; }
  return sha256Hex(bytes);
}

// ---- THE STORE: a module's verified bytes under its hash, for good. The Cache API where the page has it (a secure context: https, or the Mac's
// own loopback), IndexedDB where it has not (a phone or lysa on the rite's plain http), nothing where neither is there (every open fetches). ----
const STORE = 'isa-modules';
export function storeOf({ caches = null, indexedDB = null } = {}) {
  if (caches && typeof caches.open === 'function') {
    const key = (hash) => '/isa/module/' + hash;
    return {
      kind: 'cache',
      async get(hash) { const c = await caches.open(STORE), r = await c.match(key(hash)); return r ? new Uint8Array(await r.arrayBuffer()) : null; },
      async put(hash, bytes) { const c = await caches.open(STORE); await c.put(key(hash), new Response(bytes, { headers: { 'content-type': 'application/wasm', 'content-length': String(bytes.byteLength) } })); },
    };
  }
  if (indexedDB && typeof indexedDB.open === 'function') {
    const open = () => new Promise((res, rej) => { const r = indexedDB.open(STORE, 1); r.onupgradeneeded = () => { r.result.createObjectStore('modules'); }; r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error || new Error('indexedDB refused')); r.onblocked = () => rej(new Error('indexedDB blocked')); });
    const tx = (db, mode, fn) => new Promise((res, rej) => { const t = db.transaction('modules', mode), q = fn(t.objectStore('modules')); t.oncomplete = () => res(q.result); t.onerror = () => rej(t.error || new Error('transaction failed')); t.onabort = () => rej(t.error || new Error('transaction aborted')); });
    return {
      kind: 'idb',
      async get(hash) { const db = await open(); try { const v = await tx(db, 'readonly', (s) => s.get(hash)); return v ? new Uint8Array(v) : null; } finally { db.close(); } },
      async put(hash, bytes) { const db = await open(); try { await tx(db, 'readwrite', (s) => s.put(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength), hash)); } finally { db.close(); } },
    };
  }
  return { kind: 'none', async get() { return null; }, async put() {} };
}

/** loadModule({ name, row, base, store, fetch, subtle, now }): the module's bytes, from the store under its hash or else fetched by its hash-named
 *  URL (row.url against base, the room folder) and then kept; VERIFIED against row.hash before anything may instantiate them (a mismatch throws
 *  and nothing is kept). -> { name, hash, url, bytes: Uint8Array, from: 'store' | 'network', ms: { got, verified } }. now(): the caller's ms. */
export async function loadModule({ name, row, base, store, fetch: f = globalThis.fetch, subtle = null, now = () => 0 }) {
  const url = new URL(row.url, base).href, t0 = now();
  let bytes = null, from = 'store';
  try { bytes = await store.get(row.hash); } catch { bytes = null; }
  if (!bytes) {
    from = 'network';
    const r = await f(url);
    if (!r.ok) throw new Error(`${name}: ${url} answered ${r.status}`);
    bytes = new Uint8Array(await r.arrayBuffer());
  }
  const t1 = now(), hash = await digestHex(bytes, subtle), t2 = now();
  if (hash !== row.hash) throw new Error(`${name}: the bytes hash ${hash.slice(0, 12)}…, the manifest says ${row.hash.slice(0, 12)}…: not run`);
  if (from === 'network') { try { await store.put(row.hash, bytes); } catch { /* a store that refuses leaves the host whole: the next open fetches again */ } }
  return { name, hash, url, bytes, from, ms: { got: t1 - t0, verified: t2 - t1 } };
}

/** doorsOf(exports): the names of the contract's doors the module lacks (empty: it is a module of the room) */
export const doorsMissing = (exports) => DOORS.filter((d) => !(d in exports));

/** CLOCK: where score_clock_of leaves each number in OUT (embertide-score/src/ffi.rs) */
export const CLOCK = Object.freeze({ now_ms: 0, beat_ms: 1, bar_ms: 2, beats_per_bar: 3, beat_phase: 4, bar_phase: 5, beat: 6, bar: 7, epoch_ms: 8, downbeat_ms: 9, bpm: 10 });
/** scoreOf(exports): embertide-score's doors over its flat IN/OUT (embertide-score/src/ffi.rs), the few the host draws by. The two doors that
 *  write numbers return VIEWS of the module's OUT (read them before the next door, which writes the same doubles); nothing allocates after this. */
export function scoreOf(exports) {
  const W = exports;
  let OUT = new Float64Array(W.memory.buffer, W.io_out(), W.io_out_len());
  const out = () => (OUT.buffer === W.memory.buffer ? OUT : (OUT = new Float64Array(W.memory.buffer, W.io_out(), W.io_out_len())));
  const api = {
    /** clock(grid, now_ms): the song's clock at now (score::clock_of) as a view of 11 doubles, CLOCK names them */
    clock(grid, now_ms) { W.score_clock_of(grid.beat_ms, grid.beats_per_bar, grid.epoch_ms, now_ms, grid.bpm); return out().subarray(0, 11); },
    /** satellites(bar, bar_phase): her twelve in Station metres (y up), seat s at [3s..3s+3), a view of 36 doubles */
    satellites(bar, bar_phase) { W.score_satellites_at(bar, bar_phase); return out().subarray(0, 36); },
    /** flashAt(bar_phase, bpb): 1 on the downbeat, fading to 0 over the bar's first beat */
    flashAt: (bar_phase, bpb) => W.score_flash_at(bar_phase, bpb),
    /** clockOf(grid, now_ms): the clock as an object (a proof's shape; the host reads the view) */
    clockOf(grid, now_ms) { const O = api.clock(grid, now_ms); return { now_ms: O[0], beat_ms: O[1], bar_ms: O[2], beats_per_bar: O[3], beat_phase: O[4], bar_phase: O[5], beat: O[6], bar: O[7], epoch_ms: O[8], downbeat_ms: O[9], bpm: O[10] }; },
    /** satellitesAt(bar, bar_phase, out36): the twelve copied into the caller's doubles (a proof's shape) */
    satellitesAt(bar, bar_phase, o) { o.set(api.satellites(bar, bar_phase)); return o; },
  };
  return api;
}

// ---- THE STATE BUFFER: one flat Float32Array the module's laws are stepped into once per cause, and every drawer reads. On WebGPU it is ONE
// writeBuffer per cause (the GPU's own shape: f32, vec4 rows, a fixed layout), no per-frame copy through JavaScript objects; the 2D drawer reads
// the same floats. The module writes doubles into its own OUT; the step moves them here (36 numbers a beat). The step after this one is the
// module writing the frame as f32 in its own memory, as embertide-scene's scene_eval32 already does (then the view IS the buffer). ----
export const TRAIL = 48;                                            // the beats kept behind her
export const HEAD_F = 16, SATS_AT = HEAD_F, SATS_F = 12 * 4, TRAIL_AT = HEAD_F + SATS_F, TRAIL_F = TRAIL * SATS_F, STATE_F = TRAIL_AT + TRAIL_F;   // 2368 floats, 9,472 B
/** AT: the head's 16 floats by name (dots.wgsl and ring.wgsl read them as four vec4f), then the twelve (vec4f: x, y, z metres, seat) and the trail ring (TRAIL frames of twelve) */
export const AT = Object.freeze({ bar_phase: 0, beat_phase: 1, flash: 2, beat_in_bar: 3, bar_mod: 4, beats_per_bar: 5, bpm: 6, live: 7, reach: 8, w: 9, h: 10, dpr: 11, trail_head: 12, trail_n: 13, trail_len: 14, steps: 15 });
export function createState() { const s = new Float32Array(STATE_F); s[AT.reach] = REACH_M; s[AT.trail_len] = TRAIL; return s; }
/** step(score, grid, at_ms, state, live): her laws at at_ms (the Nest's clock) stepped into state: the head, the twelve, the frame before into the
 *  trail's next slot. Nothing allocated. -> state */
export function step(score, grid, at_ms, state, live_ = true) {
  const C = score.clock(grid, at_ms);
  const bar = C[CLOCK.bar], bar_phase = C[CLOCK.bar_phase], beat_phase = C[CLOCK.beat_phase], bpb = C[CLOCK.beats_per_bar], beat = C[CLOCK.beat], bpm = C[CLOCK.bpm];   // read before the next door writes OUT
  state[AT.bar_phase] = bar_phase; state[AT.beat_phase] = beat_phase; state[AT.beat_in_bar] = ((beat % bpb) + bpb) % bpb; state[AT.bar_mod] = ((bar % 4096) + 4096) % 4096;
  state[AT.beats_per_bar] = bpb; state[AT.bpm] = bpm; state[AT.live] = live_ ? 1 : 0;
  state[AT.flash] = score.flashAt(bar_phase, bpb);
  const steps = state[AT.steps];
  if (steps > 0) {   // the frame before goes behind her: the ring's next slot takes the twelve as they stand
    const head = state[AT.trail_head];
    state.copyWithin(TRAIL_AT + head * SATS_F, SATS_AT, SATS_AT + SATS_F);
    state[AT.trail_head] = (head + 1) % TRAIL; state[AT.trail_n] = Math.min(TRAIL, state[AT.trail_n] + 1);
  }
  const P = score.satellites(bar, bar_phase);
  for (let s = 0, i = SATS_AT; s < 12; s++, i += 4) { state[i] = P[3 * s]; state[i + 1] = P[3 * s + 1]; state[i + 2] = P[3 * s + 2]; state[i + 3] = s; }
  state[AT.steps] = steps + 1;
  return state;
}
/** trailSlot(state, k): where the k-th oldest kept frame begins (k in [0, trail_n)); the newest is k = trail_n - 1 */
export function trailSlot(state, k) { const n = state[AT.trail_n], head = state[AT.trail_head]; return TRAIL_AT + ((((head - n + k) % TRAIL) + TRAIL) % TRAIL) * SATS_F; }

/** pathOf({gpu, adapter, webgpuDrawer}): which drawer a glass takes. WebGPU by design (his 03:5x "do you understand what this means gpu wise for
 *  visuals": every device brings its own GPU); the 2D canvas only where the glass has no navigator.gpu (a secure context's) or no adapter, or,
 *  in this lane, because the WebGPU drawer is the next lane. The receipt says which, and why. */
export function pathOf({ gpu = false, adapter = false, webgpuDrawer = false } = {}) {
  if (gpu && adapter && webgpuDrawer) return { path: 'webgpu', why: 'navigator.gpu, an adapter, the drawer' };
  return { path: '2d', why: !gpu ? 'no navigator.gpu (a secure context has it)' : !adapter ? 'no WebGPU adapter answered' : 'the WebGPU drawer is the next lane' };
}

// ---- THE BEAT: the grid the ear publishes (radio/beat), the next edge, whether the song is live ----
/** gridOf(value, ts): radio/beat's value and its entry's stamp (the Nest's clock) -> { epoch_ms, beat_ms, beats_per_bar, bar_ms, bpm, at_ms, source, title, artist } or null */
export function gridOf(value, ts = null) {
  const g = value && typeof value === 'object' ? value.grid : null;
  if (!g || typeof g !== 'object' || !num(g.beat_ms) || g.beat_ms <= 0 || !num(g.epoch_ms)) return null;
  const bpb = Number.isInteger(g.beats_per_bar) && g.beats_per_bar >= 1 ? g.beats_per_bar : 4;
  return { epoch_ms: g.epoch_ms, beat_ms: g.beat_ms, beats_per_bar: bpb, bar_ms: g.beat_ms * bpb, bpm: num(value.bpm) && value.bpm > 0 ? value.bpm : 60000 / g.beat_ms,
    at_ms: num(ts) ? ts : num(value.at_ms) ? value.at_ms : null, source: typeof g.source === 'string' ? g.source : null,
    title: typeof value.title === 'string' ? value.title : null, artist: typeof value.artist === 'string' ? value.artist : null };
}
/** THE GENESIS GRID (beat-clock.mjs GENESIS_MS, GENESIS_BEAT_MS): the house's one time when no station plays, 100 bpm from the Sept 28 landing's epoch.
 *  Never stale. A glass at rest does NOT beat on it (nothing at rest costs anything): it is the bench's grid (host.html?grid=genesis), so the beat
 *  path has a number when the radio is between songs. */
export const GENESIS_GRID = Object.freeze({ epoch_ms: 1772673332000, beat_ms: 600, beats_per_bar: 4, bar_ms: 2400, bpm: 100, at_ms: null, source: 'genesis', title: null, artist: null });
/** live(grid, now_ms): the song still plays as far as the glass knows (its grid is younger than STALE_MS at the Nest's now) */
export const live = (grid, now_ms, stale = STALE_MS) => !!grid && num(now_ms) && (grid.at_ms == null || now_ms - grid.at_ms <= stale);
/** nextBeat(grid, now_ms): the first beat edge strictly after now, on the Nest's clock */
export function nextBeat(grid, now_ms) { return grid.epoch_ms + (Math.floor((now_ms - grid.epoch_ms) / grid.beat_ms) + 1) * grid.beat_ms; }
/** nextEdge(grid, now_ms, last_edge_ms): the edge a glass arms next: the first after now, and never within half a beat of the last one it drew.
 *  The ear re-writes the grid with its epoch moved by a few ms (its latest heard beat), so right after a draw at E the new grid's first edge can
 *  be E + 0.3 ms: without this a re-latched grid drew a beat twice (read on lysa Oct 14 04:4x: two wakes with the same edge, 27 in 10 s at 120 bpm). */
export function nextEdge(grid, now_ms, last_edge_ms = -Infinity) { return nextBeat(grid, Math.max(now_ms, last_edge_ms + grid.beat_ms / 2)); }

// ---- THE PICTURE: Station metres onto a canvas (y up), the lanes reach 0.42 m (lyssajudron-score.mjs) ----
export const REACH_M = 0.5;
/** project(x, y, w, h, out): a point of her figure (metres, y up) onto a w x h canvas, the reach filling the shorter side */
export function project(x, y, w, h, o = [0, 0]) { const s = Math.min(w, h) / 2 / REACH_M; o[0] = w / 2 + x * s; o[1] = h / 2 - y * s; return o; }
export const LANE_HUES = Object.freeze(['#f0910b', '#38b6ff', '#e84393', '#9be15d']);   // one a lane (seat % 4); her light is the first
export const EYE_SEATS = Object.freeze([0, 1, 2]);   // lyssajudron-score.mjs EYE_SEATS: the eye-stalks (him, the work, around), the three that hold their lane phase on the downbeat

/** receiptLine(S): the one line the host draws under her, the numbers he reads where he stands */
export function receiptLine(S) {
  const p = [], m = S.module, c = S.clock, g = S.grid, at = S.at;
  p.push(S.seat || 'glass');
  if (S.path) p.push(`${S.path}${S.gpu ? (S.gpu.adapter ? ', gpu' : S.gpu.navigator_gpu ? ', gpu without adapter' : ', no gpu') : ''}`);
  if (g) p.push(`${g.bpm.toFixed(1)} bpm ${g.live ? 'live' : 'rest'}`); else p.push('no song');
  if (c && num(c.offset_ms)) p.push(`clock ${c.offset_ms >= 0 ? '+' : ''}${Math.round(c.offset_ms)} ms`);
  if (num(at.first_draw)) p.push(`first picture ${at.first_draw} ms`);
  if (m) p.push(`${m.name} ${m.bytes} B ${m.from}${m.store === 'none' ? '' : ' (' + m.store + ')'}`);
  p.push(`wakes ${S.counts.wakes} draws ${S.counts.draws} reads ${S.counts.reads}`);
  if (S.errors.length) p.push(S.errors[S.errors.length - 1]);
  return p.join(' · ');
}
