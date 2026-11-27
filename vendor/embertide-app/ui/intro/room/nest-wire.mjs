// wire.mjs: the Nest wire for the JS antimirrors of the concilium (node 22+ and every browser, fetch only, no node: import).
// Spec: ec-workspace docs/golems-2026-09-24/concilium/BRICK-1.md section 5.1 and the contract of section 4 (builder B2).
// HIS (Sept 26 01:5x WEST): "cross-platform compatibility is granted in fortnite by the multiplayer server being the nest and every
// gamer having Nintendo Switch, Ps4, xbox, PC whatever". The Nest is the server; the three.js page, the Godot scene, the feeder and
// every later console are antimirrors of it. This file is the JS console's cable to the server: it reads the one stream, it sends
// causes, nothing else. It holds no concilium state: the fold (lib/concilium.js) does, from what this wire delivers.
//
// The wire, as the existing antimirrors already speak it (DOC):
// - head: GET <nest>/nest/head (mesh/nest.mjs:528, `/nest/head` answers {place, build, role, seq, head, ...}).
// - join: GET <nest>/nest/stream?after=<cursor>&types=concilium. read as a fetch body stream, blocks `id:`/`event:`/`data:` split on a
//   blank line (mesh/nest.mjs:509-527; the iPad Mesh.swift:301-339, the TV mesh_view.html:1266-1269, godot/nest_stream.gd:73-100).
//   `event: beat` {seq, head, ts} every 2 s for typed readers (mesh/nest.mjs, the heartbeat interval). `event: gap` {after, upto, head}
//   when the backlog was cut: the Nest serves the 2000 raw lines after `after`, byte-filtered by type (mesh/nest.mjs:563-568, no
//   JSON.parse, no stringify), writes the gap when upto is below its emitted edge, then pushes live above the edge. This wire HOPS on
//   it (P2, Sept 26 16:3x): it closes the stream and re-asks the same typed stream from upto at once, so every hop is one short GET
//   carrying only the matching lines of (upto, upto + 2000], and the hop with no gap is the live stream and stays open (C-5: one SSE
//   held open, no poll). Never /nest/log: the untyped log is 1.7 MB of every type per page (39 MB per console start on 8904 from
//   LIVE_FLOOR_SEQ), and a typed /nest/log for an unindexed type walks the whole WAL on 8904 and holds the Nest (mesh/nest.mjs:132
//   comment; BRICK-1 D11). By default a drop reconnects after 2000 ms with the `last-event-id` header (mesh/nest.mjs:514: the reconnect's own
//   Last-Event-ID wins over ?after). Every seq is delivered once, in increasing order (Mesh.swift:279-283).
// - append: POST <nest>/nest/append {seat, type, payload, cause?, t?} (mesh/nest.mjs:559) -> the entry; any 4xx/5xx throws.
// - The live-port gate, the same in every console (godot/tse_seat.gd:15,160-162): a nest on 8985, 8986, 8903, 8904 or 18911 is refused
//   unless the caller passes live, with the message 'refused: <port> is a live port (pass --live when Guido says so)'.
//
// DERIVED choices, open to his word:
// - The cursor is the highest seq this wire has handed on in order: a matching entry, or a gap's upto (every raw line at or below it
//   was served, the matching ones taken). It never moves on a beat: the beat's id is the Nest's commit head, which can run ahead of
//   the push (mesh/nest.mjs write(): the push may wait for the disk), so a cursor taken from a beat could skip an entry still on its way.
// - 'caught-up' is said from the stream's own order, never from the beat: when a hop's raw window (cursor + the gap's span) reaches
//   the head the gap named, or when an entry at or past that head is taken.
// - In a browser talking to another origin the `last-event-id` header is not sent: it is not a CORS-safelisted header and 8904's
//   preflight allows only content-type and x-sha256 (mesh/nest.mjs:508). The same cursor rides in ?after=, which the Nest reads when no
//   header is present (mesh/nest.mjs:514). Node and same-origin pages (the door serves the page) send the header.
// Room-local delta: reconnectPolicy 'immediate-backoff' retries the first drop at once, then backs off to 2 s.
// Only delivered progress or a valid heartbeat resets that outage, not an HTTP 200 that immediately closes. See NEST-WIRE.md.
// Hub delta (Oct 12 2026, nest-hub.mjs: one connection per window): `refs` rides the URL (the Nest's prefix filter on ref names, mesh/nest.mjs:909);
// every handler gets the raw data text as its second argument (one parse per line, shared by every subscriber: zero-copy); onHello({role, place, seq})
// is the stream's first comment line (`: nest <role> <place> seq <n>`, mesh/nest.mjs:904): the Nest's head at open, so a reader that wants "from now"
// knows its floor without a read of its own. after: null asks the stream from the Nest's head (no after= until a line is taken): after=0 is not that, the
// Nest replays its log from the floor on it (a gap and 2000-line hops up to the head; measured Oct 12 02:5x: 80 hops for nothing).
// `seats` rides the URL as `refs` does (Oct 12 2026 04:0x): pairs <type>:<seat>, the Nest's filter on its LIVE lines (mesh/nest.mjs emit: of that type, only
// those seats' lines; a logged line never). The wire only carries the word: a Nest older than it sends every seat, and the hub filters each subscriber by its own.
// THE CURSOR IS THE VECTOR OF ORIGINS (Oct 23 2026, THE NEST IS HOLY, mesh/THE-NEST-IS-HOLY.md piece 4; his "dude make it holy please"): a wire started with a
// VECTOR (`after` as 'place:count,...', a Map or {place: count}; empty: from now) keeps what it has seen as that vector, never one Nest's seq. A line is taken once
// per ORIGIN (its id `<place>-<n>`, or place and seq for the lines before ids: lineOrigin, a copy of mesh/nest.mjs Nest.originOf, never an import of the Nest into
// a page); a gap names its cut in the vector's words and the wire hops per place (each place's larger count); a beat's `origins` bring in the places it has not met
// yet, from now (the Nest names them at its emitted edge, after every line below it went out); every reconnect asks after=<the vector>, never with Last-Event-ID.
// Another Nest serves the same vector exactly, so a door that fails over needs neither its `event: gap` nor its `event: peer` on this road (the peer is handed to
// onPeer on both roads: until Oct 23 this file dropped it, `if (ev && ev !== 'message') return`). A Nest whose beat names no origins speaks no vectors (an older
// one): the wire says a gap (its reader takes its keyframe) and goes on by that Nest's seq. A wire started with a seq keeps the seq contract, unchanged: on a door's
// failover it still hears nothing for (its cursor minus the new chain's head) lines when its cursor is above that head (THE-NEST-IS-A-MESH-LANDING.md 5.7).

export const LIVE_PORTS = Object.freeze([8985, 8986, 8903, 8904, 18911]);   // godot/tse_seat.gd:15, tools/live.mjs:7
export const RECONNECT_MS = 2000;
export const STALL_MS = 9000;   // THE SILENCE WATCHDOG (Oct 12 2026): the Nest beats every 2 s on a typed stream; four beats missed and a wait = a socket that stalled without closing

const portOf = (u) => (u.port ? Number(u.port) : (u.protocol === 'https:' ? 443 : 80));
const errText = (e) => String((e && (e.cause && e.cause.code || e.message)) || e || 'failed').slice(0, 200);

function originOf(nestUrl) {
  let u;
  try { u = new URL(String(nestUrl)); } catch { throw new Error(`refused: not a nest url: ${String(nestUrl).slice(0, 80)}`); }
  if (u.protocol !== 'http:' && u.protocol !== 'https:') throw new Error(`refused: not a nest url: ${u.protocol}`);
  return u;
}

/** The live-port gate. Returns the nest's origin (no path, no trailing slash); throws on a live port without live. */
export function gate(nestUrl, { live = false } = {}) {
  const u = originOf(nestUrl), port = portOf(u);
  if (LIVE_PORTS.includes(port) && live !== true) throw new Error(`refused: ${port} is a live port (pass --live when Guido says so)`);
  return u.origin;
}

const fetchOf = (f) => {
  if (typeof f === 'function') return f;
  if (typeof globalThis.fetch !== 'function') throw new Error('no fetch in this runtime');
  return (...a) => globalThis.fetch(...a);
};

/** GET <nest>/nest/head -> { seq, head, place, role, ... } (the Nest's own answer). The one read the brief allows on 8904 is this GET;
 *  pass live (true or false) to put it behind the gate as well, as the feeder does. */
export async function head(nest, { fetch, live } = {}) {
  const origin = typeof live === 'boolean' ? gate(nest, { live }) : originOf(nest).origin;
  const r = await fetchOf(fetch)(origin + '/nest/head', { headers: { accept: 'application/json' } });
  let j = null; try { j = await r.json(); } catch {}
  if (!r.ok || !j || !Number.isSafeInteger(j.seq)) throw new Error(`head ${r.status}: ${(j && j.error) || 'no seq'}`);
  return j;
}

/** POST <nest>/nest/append {seat, type, payload, cause?, t?} -> the entry the Nest wrote. Throws on 4xx/5xx (err.status, err.body). */
export async function append(nest, { seat, type, payload, cause, t } = {}, { live = false, fetch } = {}) {
  const origin = gate(nest, { live });
  const body = { seat, type, payload };
  if (cause != null) body.cause = cause;
  if (t != null) body.t = t;
  const r = await fetchOf(fetch)(origin + '/nest/append', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
  let j = null; try { j = await r.json(); } catch {}
  if (!r.ok || !j || j.ok === false || !j.entry) {
    const e = new Error(`append ${r.status}: ${(j && j.error) || 'no entry'}`); e.status = r.status; e.body = j; throw e;
  }
  return j.entry;
}

/** Fixture files: one JSON entry per non-empty line. */
export function parseJsonl(text) {
  const out = [];
  String(text ?? '').split('\n').forEach((raw, i) => {
    const line = raw.replace(/\r$/, '');
    if (!line.trim()) return;
    try { out.push(JSON.parse(line)); } catch (e) { throw new Error(`jsonl line ${i + 1}: ${errText(e)}`); }
  });
  return out;
}

export const parseTypes = (types) => String(types ?? '').split(',').map((s) => s.trim()).filter((s) => /^[a-z0-9_.-]{1,64}$/i.test(s)).slice(0, 32);   // mesh/nest.mjs:516
/** the ref-name prefixes a stream takes, as the Nest takes them (tools/embertide-mesh/nest.mjs PREFIX_MAX; 16 until Oct 29 2026, THE MACS HOLD THEIR AGENTS, 32 until
 *  Nov 2, THE NEST SAYS ITS BOUND: each stream says its own, `: refs <n>` before its hello, which onHello hands on as refs; one that says none, nest-hub.mjs REFS_UNSAID) */
export const REFS_MAX = 64;
export const parseRefs = (refs) => String(refs ?? '').split(',').map((s) => s.trim()).filter((s) => /^[\w./-]{1,96}$/.test(s)).slice(0, REFS_MAX);
export const parseSeats = (seats) => String(seats ?? '').split(',').map((s) => s.trim()).filter((s) => /^[a-z0-9_.-]{1,64}:[\w.-]{1,32}$/i.test(s)).slice(0, 16);   // mesh/nest.mjs /nest/stream: <type>:<seat> pairs, at most 16; a malformed one is dropped (it can only widen the ask)
export const wantsOf = (want) => (t) => !want.length || want.some((x) => x === t || (x.endsWith('.') && typeof t === 'string' && t.startsWith(x)));   // mesh/nest.mjs:438
const PLACE_COUNT = /^([A-Za-z0-9_.-]{1,32}):(\d{1,16})$/;   // one place of a vector cursor (mesh/nest.mjs CURSOR_PART, the same rule)
/** A vector cursor's text -> Map place -> count, or null when it is not one (mesh/nest.mjs Nest.cursorOf's vector half, copied: a page never imports the Nest). */
export function parseVector(text) {
  const s = String(text ?? '').trim(); if (!s || s.length > 2048) return null; const parts = s.split(','); if (parts.length > 64) return null;
  const v = new Map(); for (const part of parts) { const m = PLACE_COUNT.exec(part), n = m ? Number(m[2]) : NaN; if (!Number.isSafeInteger(n)) return null; v.set(m[1], Math.max(n, v.get(m[1]) ?? 0)); }
  return v;
}
/** A vector as the cursor's text, the places in their order. */
export const vectorText = (v) => [...(v instanceof Map ? v : Object.entries(v || {}))].map(([p, n]) => `${p}:${n}`).join(',');
/** `after` as a vector: a Map (copied), {place: count}, or the cursor's text; null for anything else (a seq, null: the seq contract). */
export function vectorOf(after) {
  if (after instanceof Map) return new Map([...after].filter(([p, n]) => PLACE_COUNT.test(`${p}:${n}`)));
  if (after && typeof after === 'object' && !Array.isArray(after)) return new Map(Object.entries(after).filter(([p, n]) => PLACE_COUNT.test(`${p}:${n}`)));
  return typeof after === 'string' && !/^\d+$/.test(after.trim()) ? parseVector(after) : null;
}
/** A line's origin [place, count]: its id `<place>-<n>`, else its place (or `place`, the Nest the stream came from) and seq for the lines before ids; null when none. */
export function lineOrigin(e, place = null) {
  const m = /^(.+)-(\d+)$/.exec(String((e && e.id) || '')); if (m) { const n = Number(m[2]); return Number.isSafeInteger(n) && n > 0 ? [m[1], n] : null; }
  const p = e && (e.place ?? place); return p != null && Number.isSafeInteger(e.seq) && e.seq > 0 ? [String(p), e.seq] : null;
}

/** Join the Nest's typed stream. -> { close(), cursor(), vector(), paging() }.
 *  after: a seq (the seq contract), null (from the head), or a VECTOR ('place:count,...', a Map, {place: count}; empty: from now): the vector road (above).
 *  cursor(): the seq of the last line handed on (on the vector road: of the chain that served it). vector(): the vector's text on that road, else null.
 *  onEntry(entry, raw): every entry whose type matches, by increasing seq, each once (raw: its data text); a live line ({live: true}, no seq) as it comes, outside the order. onBeat({seq, head, ts}, raw). onGap({after, upto, head}, raw): one per hop.
 *  onPeer({peer}, raw): a door's `event: peer`, the Nest that serves this stream (embertide-iroh bridge --peers): first on every stream through a door.
 *  onHello({role, place, seq}): the stream's first comment, the Nest's head when it opened. refs: ref-name prefixes the Nest filters ref entries by (none: every ref).
 *  seats: '<type>:<seat>,...', the seats the Nest sends a LIVE type's lines from (none for a type: every seat); a Nest that does not know the word sends every seat.
 *  onStatus(s): 'connecting' | 'open' | 'paging' | 'caught-up' | 'reconnecting' | 'error: ...' | 'closed'.
 *  reconnectPolicy: 'fixed' (existing reconnectMs) or 'immediate-backoff' (0, 125, 250, 500, 1000, 2000 ms, capped). */
export function join({ nest, after = 0, types = 'concilium.', refs = '', seats = '', live = false, fetch, onEntry, onBeat, onGap, onHello, onPeer, onStatus, reconnectMs = RECONNECT_MS, reconnectPolicy = 'fixed', stallMs = STALL_MS, clock = null } = {}) {
  const origin = gate(nest, { live });
  if (reconnectPolicy !== 'fixed' && reconnectPolicy !== 'immediate-backoff') throw new Error('unknown reconnectPolicy');
  const f = fetchOf(fetch);
  const want = parseTypes(types), wants = wantsOf(want), refq = parseRefs(refs).join(','), seatq = parseSeats(seats).join(',');
  let vec = vectorOf(after);   // THE CURSOR IS THE VECTOR OF ORIGINS (above): this wire's road when it was started with one; null: the seq contract
  let live0 = after === null; const a0 = vec ? 0 : Number(after);   // live0: from the head, no after= and no last-event-id while nothing was taken
  let cursor = !live0 && Number.isSafeInteger(a0) && a0 >= 0 ? a0 : 0;
  let helloPlace = null, vgHead = null, vgUpto = null, said = 0;   // the place the stream's hello named (the origin of a line with neither id nor place); a vector gap run: the Nest's origins at its edge, the places the cut named; the ref names this connection's Nest said it takes
  let floor = 0;   // a stream opened from the head: the head its FIRST hello named. A drop before any logged line then resumes from there, so the outage loses nothing (a bare EventSource with no id yet resumed from the new head)
  let closed = false, ctrl = null, timer = null, opened = 0, epoch = 0;
  let failures = 0;
  let paging = false, hop = false, gapHead = 0, span = 0;   // a gap run: hop = re-ask the stream now; gapHead the head the gap named; span its raw window
  // THE SILENCE WATCHDOG (Oct 12 2026 14:0x WEST, his "why the fuck seeker is seeing old colors for the lyssajudron?": the Seeker's Board pane drawn in her
  // birth colours an hour after his paint, the same pane on the Mac in his paint). A beat every 2 s proves the socket. An open typed stream that has beaten
  // once and then says nothing for stallMs is a socket that stalled without closing (a Wi-Fi phone asleep: fetch's reader waits for ever, onerror never
  // fires, the browser reopens nothing), so this wire aborts it itself and its own retry reopens from the cursor at once: the Nest replays what the silence
  // hid. Never on a stream that has not beaten yet (an old Nest, an untyped reader). clock (tests): {now, setInterval, clearInterval}.
  const ck = { now: clock && clock.now || (() => performance.now()), every: clock && clock.setInterval || ((fn, ms) => globalThis.setInterval(fn, ms)), stop: clock && clock.clearInterval || ((id) => globalThis.clearInterval(id)) };
  let heardAt = 0, beaten = 0, guard = null, stalled = false;
  const call = (fn, ...a) => { if (typeof fn !== 'function') return; try { fn(...a); } catch (e) { status('error: a handler threw: ' + errText(e)); } };
  const status = (s) => { if (typeof onStatus === 'function') { try { onStatus(s); } catch {} } };
  const loc = typeof globalThis.location === 'object' && globalThis.location ? globalThis.location : null;
  const inBrowser = typeof globalThis.window === 'object' || typeof globalThis.document === 'object';
  const headerOk = !inBrowser || (loc && loc.origin === origin);
  const progress = () => { failures = 0; };
  const retryDelay = () => {
    if (reconnectPolicy === 'fixed') return reconnectMs;
    const prior = failures;
    failures = Math.min(failures + 1, 6);
    return prior === 0 ? 0 : Math.min(125 * 2 ** (prior - 1), RECONNECT_MS);
  };

  const caughtUp = () => { paging = false; status('caught-up'); };
  // the vector road's edge: what is left between this wire's vector and the head the last cut named, over the places that cut named
  const leftV = () => { let left = 0; for (const [p, n] of Object.entries(vgHead || {})) if (vgUpto && vgUpto.has(p)) left += Math.max(0, Number(n) - (vec.get(p) ?? 0)); return left; };
  // A Nest that does not speak vectors (an older one: it read the vector as no cursor and serves from its head; or a door that refuses the word): the wire says a
  // gap, its reader takes its keyframe, and it goes on by that Nest's seq (from `seq` when it is known, from the head when it is not): never a silent skip.
  const downgrade = (seq, why) => {
    const was = vectorText(vec); vec = null; vgHead = vgUpto = null;
    if (Number.isSafeInteger(seq) && seq >= 0) { cursor = Math.max(cursor, seq); } else { live0 = true; cursor = 0; floor = 0; }
    call(onGap, { after: was, upto: cursor, head: cursor, vector: false, why }, '');
  };
  // one step of the order: seqs at or below the cursor were handed on already; a matching one goes to onEntry
  const take = (e, raw) => {
    if (!e || typeof e !== 'object') return;
    // A LIVE LINE (Oct 12 2026): the present (wind.body, harmony.canvas.live, game.state, touch), {live: true} with no seq and no id, and a line of the hour (Nov 4: his head
    // at rest, no id, the chain's edge for its seq; its ref ordered by the rev) are handed on as they come and never touch the order: no cursor, no dedupe.
    if (e.live === true || e.hour === true) { if (typeof e.type === 'string' && /^[a-z0-9_.-]{1,64}$/i.test(e.type)) { progress(); if (wants(e.type)) call(onEntry, e, raw); } return; }
    if (vec) {   // the vector road: once per origin, each origin's lines in its own order whichever Nest serves them; a logged line always has its type
      if (typeof e.type !== 'string') return;
      const o = lineOrigin(e, helloPlace); if (o) { if (o[1] <= (vec.get(o[0]) ?? 0)) return; vec.set(o[0], o[1]); } else if (!Number.isSafeInteger(e.seq)) return;
      if (Number.isSafeInteger(e.seq)) cursor = e.seq;   // the seq of the last line on the chain that served it: the hub's seq subscribers read it; this road never asks by it
      if (/^[a-z0-9_.-]{1,64}$/i.test(e.type)) progress();
      if (wants(e.type)) call(onEntry, e, raw);
      if (paging && vgHead && leftV() === 0) caughtUp();
      return;
    }
    if (!Number.isSafeInteger(e.seq) || e.seq <= cursor) return;
    cursor = e.seq;
    if (typeof e.type === 'string' && /^[a-z0-9_.-]{1,64}$/i.test(e.type)) progress();
    if (wants(e.type)) call(onEntry, e, raw);
    if (paging && cursor >= gapHead) caughtUp();
  };

  function onBlock(block) {
    heardAt = ck.now();   // any block says the socket lives: a hello, a line, a beat, a gap, the Nest's `: beat` comment
    if (block[0] === ':') { const m = /^: nest (\S+) (\S+) seq (\d+)/.exec(block), k = m ? null : /^: refs (\d{1,4})$/.exec(block); if (k) said = Number(k[1]); if (m) { helloPlace = m[2]; if (live0 && floor === 0 && cursor === 0) floor = Number(m[3]); call(onHello, { role: m[1], place: m[2], seq: Number(m[3]), refs: said }); } }   // the Nest's hello: its head at open, and the ref names its stream takes (0: none said)
    let ev = '', data = '', has = false;
    for (const line of block.split('\n')) {
      if (!line || line[0] === ':') continue;
      const i = line.indexOf(':'), k = i < 0 ? line : line.slice(0, i);
      let v = i < 0 ? '' : line.slice(i + 1); if (v[0] === ' ') v = v.slice(1);
      if (k === 'event') ev = v;
      else if (k === 'data') { data = has ? data + '\n' + v : v; has = true; }
    }
    if (!has) return;
    let x; try { x = JSON.parse(data); } catch { return; }
    if (ev === 'beat') {
      beaten++;   // this connection beats: the watchdog may judge its silence from here on
      if (x && Number.isSafeInteger(x.seq) && x.seq >= 0 && Number.isFinite(x.ts)) progress();
      if (vec && x && typeof x === 'object') {   // the vector road: a place the beat names that this vector does not enters it from now (every line of it below the beat went out before it); a beat with no origins is a Nest that speaks none
        if (x.origins && typeof x.origins === 'object') { for (const [p, n] of Object.entries(x.origins)) if (!vec.has(p) && PLACE_COUNT.test(`${p}:${n}`)) vec.set(p, Number(n)); }
        else if (Number.isSafeInteger(x.seq)) downgrade(x.seq, 'a Nest whose beat names no origins');
      }
      return call(onBeat, x, data);   // a beat proves liveness, never cause-cursor progress
    }
    if (ev === 'peer') return call(onPeer, x, data);   // a door names the Nest that serves this stream (both roads hear it; the vector road needs it for nothing)
    if (ev === 'gap' && vec) {   // the vector's cut: every place hops to the larger of its count and the cut's, and the stream is asked again from there at once
      const g = x && typeof x === 'object' ? x : {}, up = typeof g.upto === 'string' ? parseVector(g.upto) : null, from = typeof g.after === 'string' ? parseVector(g.after) : null;
      if (up && from && g.head && typeof g.head === 'object') {
        let moved = false; for (const [p, n] of up) if (n > (vec.get(p) ?? 0)) { vec.set(p, n); moved = true; }
        if (moved) progress();
        vgHead = g.head; vgUpto = up; span = 0; for (const [p, n] of up) span += Math.max(0, n - (from.get(p) ?? 0)); span = Math.max(1, span);
        if (!paging) { paging = true; status('paging'); }
        call(onGap, x, data);
        hop = true;
        if (ctrl) ctrl.abort();
        return;
      }
      vec = null; vgHead = vgUpto = null;   // a gap in a seq's words: what answers does not speak vectors; the seq road takes it from here (below), never a hop that asks the same again
    }
    if (ev === 'gap') {   // the backlog was cut at upto: hop, re-ask the typed stream from there at once (mesh/nest.mjs:563-568), never /nest/log
      const g = x && typeof x === 'object' ? x : {};
      if (Number.isSafeInteger(g.after) && g.after >= 0 && Number.isSafeInteger(g.upto) && g.upto > cursor && g.upto > g.after && Number.isSafeInteger(g.head) && g.head >= g.upto) progress();
      if (Number.isSafeInteger(g.upto)) cursor = Math.max(cursor, g.upto);
      if (Number.isSafeInteger(g.head)) gapHead = g.head;
      if (Number.isSafeInteger(g.upto) && Number.isSafeInteger(g.after)) span = Math.max(1, g.upto - g.after);
      if (!paging) { paging = true; status('paging'); }
      call(onGap, x, data);
      hop = true;
      if (ctrl) ctrl.abort();   // the live lines still on this stream come back as the next hop's backlog: once each, in order
      return;
    }
    if (ev && ev !== 'message') return;
    take(x, data);
  }

  async function connect() {
    timer = null;
    if (closed) return;
    const mine = ++epoch;
    ctrl = new AbortController();
    const headers = { accept: 'text/event-stream' };
    const from = cursor > 0 ? cursor : floor;   // the cursor; with nothing taken yet on a head-opened stream, its first hello's head
    if (!vec && opened > 0 && headerOk && !(live0 && from === 0)) headers['last-event-id'] = String(from);   // on a hop, the gap's upto (the seq road only: the vector rides the query)
    const vt = vec ? vectorText(vec) : '', at = vec ? (vt ? `after=${encodeURIComponent(vt)}&` : '') : (live0 && from === 0 ? '' : `after=${from}&`);   // an empty vector asks from the head, and its places come with the beats
    status(paging ? 'paging' : opened > 0 ? 'reconnecting' : 'connecting');
    try {
      const r = await f(`${origin}/nest/stream?${at}types=${encodeURIComponent(want.join(','))}${refq ? '&refs=' + encodeURIComponent(refq) : ''}${seatq ? '&seats=' + encodeURIComponent(seatq) : ''}`, { headers, signal: ctrl.signal, cache: 'no-store' });   // no-store, as an EventSource asks: without it WebKit's network process keeps the whole body of a stream for its cache and re-reserves that list on every chunk (measured Oct 12 03:28 in his app: 47 % of a core after 13 minutes of wind.body, and growing)
      if (closed || mine !== epoch) return;
      if (vec && vt && r && r.status === 400) downgrade(null, 'a door that takes no vector (400)');   // a door older than the vector refuses the word: the seq road, from the head, the reader told
      if (!r.ok || !r.body) throw new Error('stream ' + r.status);
      opened++; status('open');
      heardAt = ck.now(); beaten = 0; stalled = false; said = 0;
      if (stallMs > 0) {   // the watchdog of this connection: cleared when it ends, whatever ends it
        const g = ck.every(() => { if (closed || mine !== epoch || !beaten) return; const quiet = ck.now() - heardAt; if (quiet > stallMs) { stalled = true; status('error: silent ' + quiet + ' ms on an open stream: reopening'); try { ctrl.abort(); } catch {} } }, Math.min(2000, stallMs));
        if (g && typeof g.unref === 'function') g.unref(); guard = g;
      }
      if (paging && (vec ? vgHead && leftV() <= span : cursor + span >= gapHead)) caughtUp();   // this hop's raw window reaches the head the gap named: no gap follows, this is the live stream
      const reader = r.body.getReader(), dec = new TextDecoder();
      let buf = '';
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        buf += dec.decode(value, { stream: true });
        if (buf.includes('\r')) buf = buf.replace(/\r\n?/g, '\n');
        let i;
        while ((i = buf.indexOf('\n\n')) >= 0) { const block = buf.slice(0, i); buf = buf.slice(i + 2); if (mine === epoch && !closed && !hop) onBlock(block); }
      }
      if (!closed && !hop) status('error: the stream ended');
    } catch (e) {
      if (!closed && !hop && !stalled) status('error: ' + errText(e));   // the watchdog said its own line before the abort
    }
    if (guard !== null) { ck.stop(guard); guard = null; }
    if (closed || mine !== epoch) return;
    epoch++;
    timer = setTimeout(connect, hop ? 0 : retryDelay());   // a gap hop never consumes an outage retry
    hop = false;
  }

  connect();
  return {
    close() { if (closed) return; closed = true; epoch++; if (timer !== null) clearTimeout(timer); timer = null; if (guard !== null) { ck.stop(guard); guard = null; } if (ctrl) { try { ctrl.abort(); } catch {} } status('closed'); },
    cursor() { return cursor; },
    vector() { return vec ? vectorText(vec) : null; },
    paging() { return paging; },
  };
}
