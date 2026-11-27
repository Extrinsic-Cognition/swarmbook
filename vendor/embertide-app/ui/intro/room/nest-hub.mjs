// nest-hub.mjs: ONE connection to the Nest per window, shared by every same-origin frame (Oct 12 2026 02:3x WEST; his 02:2x over the design: "simplify,
// elegantify. zero-copy distributed typa optimization dude minimize hops").
//
// THE PROBLEM (measured 01:50-02:10): every page and frame of Harmony opened its own EventSource on 127.0.0.1:8904/nest/stream, and a glass holds six
// connections per host AND port (WebKit, proved in this lane: with six held on 127.0.0.1:8904 a seventh read there fails after 3 s while 127.0.0.1:<other
// port> answers in 2 ms; localhost:8904 is another pool). His Embertide.app (two windows, one WebKit network process: one pool) held six without THE ROOM:
// the shell's canvas stream, the editor's golems, the hands, Blobby. The Room's Board then got no connection, every keyframe read waited 8 s, the stage
// stayed blank, he asked four times. 8aceb7f and fd725c7 (a second loopback name) bought a second six; this is the cure: the distributed singleton
// (one object, one state, every glass a window on it) applied to the wire.
//
// THE DESIGN: the fewest hops, no copy.
// - One wire per Nest origin per WINDOW: nest-wire.mjs join (the cursors, gap hops and reconnects its tests pin), held by the TOPMOST same-origin window's
//   own realm (a removed frame's timers never fire again: measured, a 50 ms timer in a removed iframe is lost). The shell imports this module once, so its
//   realm owns the hub; every same-origin frame (THE ROOM, its Board, the editor, Blobby's page) reaches it by a direct call up the window chain: no worker,
//   no postMessage, no BroadcastChannel (each adds a hop and a structured-clone copy per subscriber per line). A page that is its own top holds its own.
// - The Nest filters ONCE by the UNION of the subscribers' types and ref prefixes (a prefix under another one is not asked: the same lines, COVERED NAMES); the
//   wire parses each line once; the same entry object and the same raw text go to every subscriber whose own filter matches (type, ref-name prefix): zero-copy.
// - A cursor per subscriber: the seq it was handed in order; a reopen from the lowest cursor among them replays nothing twice (seq <= cursor is skipped).
//   A subscriber that wants "from now" (no after, as a bare EventSource did) takes the Nest's head from the stream's hello line, never a read of its own.
// - (Re)opened once per tick for every join of that tick, from the lowest cursor, with the union. Only two things reopen: a newcomer whose types the
//   connection does not carry, or whose cursor is below what it has served. A deliberate reopen is silent for the others (no error, no open). The last
//   subscriber leaving closes the socket (nothing at rest costs anything); a union that shrank is narrowed a second later.
// - NestSource: an EventSource look-alike over the hub (url -> types, refs, after; onopen, onmessage, onerror, 'gap' and 'beat' events, readyState,
//   close): an opener migrates by swapping its EventSource for this class. ev.data is the line's own text (shared), ev.entry the parsed entry (shared).
// - LIVE LINES (wind.body, harmony.canvas.live, game.state: {live: true}, no seq) go to every subscriber that asked their type as they come, outside the order.
// - SEATS (Oct 12 2026 04:0x; measured 03:38: of the 61 KB/s of wind.body each window took, 40 were the two raw eyes' bodies, parsed and dropped by pages that draw
//   only the fused one): a subscriber may name, per LIVE type, the seats whose lines it takes (seats=wind.body:wind). The Nest is asked a type by seat only while
//   EVERY subscriber of that type names its seats, with the union of theirs; each subscriber is still filtered by its own, so a Nest older than the word (it sends
//   every seat) and a newer one hand a page the same lines. A logged line is never filtered by seat. One Map read per live line per subscriber that named seats.
// - The syntax floor is the importing pages' own (optional chaining, no more): no logical assignment, no class fields, no EventTarget subclass, so a glass that
//   runs one.mjs or board.mjs runs this.
// - THE CURSOR IS THE VECTOR OF ORIGINS (Oct 23 2026, THE NEST IS HOLY, mesh/THE-NEST-IS-HOLY.md piece 4): a subscriber that joins with a VECTOR (after
//   'place:count,...', a Map or {place: count}; a NestSource's after=<vector>) is handed each origin's lines once, whichever Nest serves them (nest-wire.mjs's
//   rule, per subscriber), and a cut reaches it only when the cut leaves a hole in ITS vector. While one such subscriber is on it the connection is asked by a
//   vector (the meet of theirs and of where the connection stands, `hv`, for the seq subscribers that ride with it), so a door that fails over serves it the same
//   lines with no gap; a seq subscriber on that road is told the chain changed (its seqs were another Nest's: a gap, its picture taken again) when the door names
//   another Nest (`event: peer`). With none, the connection is the seq road as before, byte for byte. lastEventId stays the line's seq. The small parse is the wire's
//   own (vectorOf, vectorText, lineOrigin, there since Oct 23; copied here until Nov 2 2026): the two are pulled one after the other, so neither needs the other's new line.
// COST: one socket per window instead of one per opener; per line one parse and N calls instead of N parses on N sockets; per join at most one short GET.
import { join as wireJoin, gate, parseTypes, parseRefs, wantsOf, REFS_MAX, vectorOf as vecOf, vectorText as vecText, lineOrigin as originOfLine } from './nest-wire.mjs';
import { houseDoor } from './house-door.mjs';

export const NEST = houseDoor('http://127.0.0.1:8904');   // on the house's secure front (his iPad's window) the page's own origin, whose /nest/* the front reads for it (house-door.mjs)
export const NARROW_MS = 1000;   // a union that shrank is narrowed after this: a tab's close and open do not cost two reopens
export const REFS_UNSAID = 32;   // the ref names a Nest that says no bound takes (THE MACS HOLD THEIR AGENTS, Oct 29 2026, to THE NEST SAYS ITS BOUND, Nov 2): the ask's bound until a hello says one
const REG = '__nestHubs', OPEN = '__nestHubOpen';

const covers = (set, x) => set.has(x) || [...set].some((p) => p.endsWith('.') && x.startsWith(p));
const under = (set, x) => [...set].some((p) => x.startsWith(p));
const refName = (e) => (e.payload && typeof e.payload.name === 'string' ? e.payload.name : '');
const PAIR = /^[a-z0-9_.-]{1,64}:[\w.-]{1,32}$/i;   // <type>:<seat>, the wire's own rule (nest-wire.mjs parseSeats) written here too: these two files are saved and pulled one after the other, and neither may need the other's new line to load
/** A seats word ('wind.body:wind,...', or its pairs) as a Map type -> Set of seats; null when it names none. At most 16 pairs, a malformed one dropped, as the Nest reads it. */
const seatsOf = (seats) => { let m = null; for (const p of String(seats == null ? '' : seats).split(',').map((x) => x.trim()).filter((x) => PAIR.test(x)).slice(0, 16)) { const i = p.indexOf(':'), t = p.slice(0, i); if (!m) m = new Map(); if (!m.has(t)) m.set(t, new Set()); m.get(t).add(p.slice(i + 1)); } return m; };
const POSED = 'posed';   // THE SLICES THAT MATTER ARE THE POSED ONES (nest.mjs, Oct 16 2026): a seat name of a live type that passes the lines carrying a lens pose, whatever seat's
// THE HUB LETS THE SWORD THROUGH (Oct 29 2026): the Nest's other word, `sword` (THE BLADE ASKS ONLY THE SWORD, nest.mjs), passes the slices a phone streams as
// its sword (payload.by "sword"), whatever phone's. Without it here, a Nest that answers the word sent the Board every sword slice and this filter dropped them all
// (read live 08:39 to 08:52 UTC: 558 slices posted, 0 handed to the renderer); a Nest older than the word sent every seat and they passed. The hub knows every
// word the Nest knows, or a page that names one hears nothing.
const SWORD = 'sword';
const seated = (m, e) => { const named = m.get(e.type); return !named || named.has(e.seat) || (named.has(POSED) && !!e.payload && Array.isArray(e.payload.pose)) || (named.has(SWORD) && !!e.payload && e.payload.by === SWORD); };   // a live line passes a seats map: its type is not named there, its seat is, it is posed and the word asks for those, or it is a sword slice and the word asks for those
const PLACE_COUNT = /^([A-Za-z0-9_.-]{1,32}):(\d{1,16})$/;
/** The meet of position vectors: every place any names, at the least count among those that name it (a vector that does not name a place asks nothing of its past). */
const meetOf = (vs) => { const out = new Map(); for (const v of vs) for (const [p, n] of v) out.set(p, out.has(p) ? Math.min(out.get(p), n) : n); return out; };

/** The union of the subscribers' filters, within the Nest's own limits (32 types, max ref names: the bound the Nest said, REFS_MAX at most; 16 seat pairs; past them the coarser ask, and each subscriber still filters).
 *  refs: the names asked, a name under another left out (COVERED NAMES), and past max the family with the most names folded first into its root ('room/sea' -> 'room/'), by
 *  the same rule (THE ROOT CARRIES ITS FAMILY); null (every ref) when a subscriber wants every ref or the roots are still too many. names: the distinct ref names the subscribers
 *  ask; covered: how many of them ride under another and are not sent. seats: the sorted pairs '<type>:<seat>' the Nest is asked, or null (a type by seat only when EVERY subscriber wanting it names its seats). */
// COVERED NAMES (Oct 14 2026): the Nest read 16 names a stream and past them the hub asked it for every ref (28 ref lines a minute that night, the sidebar's harmony/workflows
// at ~105 KB a write among them), counting 'scene/entities/' and 'scene/entities/golem-lyssajudron-light' as two. The Nest keeps a ref line when its name starts with a name
// asked (nest.mjs emit; its replay matches '"name":"<name>' in the raw line, the same rule), so a name that starts with another adds no line: it is not sent, and the window gets
// the same lines. one.html as the glasses frame it (hub-names.proof.mjs): 13 names on the Mac's overlay and 12 on tv1 asked before, 8 and 7 now; with two eyes 14 and 14, still 8 and 7.
const rootOf = (x) => { const i = x.indexOf('/'); return i > 0 && i < x.length - 1 ? x.slice(0, i + 1) : x; }, foldTo = (R, max) => { while (R.length > max) { const n = new Map(); for (const x of R) if (rootOf(x) !== x) n.set(rootOf(x), (n.get(rootOf(x)) || 0) + 1); const [root] = [...n].reduce((a, b) => (b[1] > a[1] ? b : a), [null, 1]); if (!root) return null; R = [...new Set(R.map((x) => (rootOf(x) === root ? root : x)))]; } return R; };   // THE ROOT CARRIES ITS FAMILY (Nov 2 2026, its LANDING.md): one of one saves no slot
export function unionOf(subs, max = REFS_MAX) {
  const types = new Set(), refs = new Set(), named = new Set(); let allRefs = false;
  for (const s of subs) { for (const t of s.want) types.add(t); if (s.refs) for (const r of s.refs) refs.add(r); else if (s.wants('ref')) allRefs = true; if (s.seats) for (const t of s.seats.keys()) named.add(t); }
  let T = [...types]; if (T.length > 32) T = [...new Set(T.map((t) => t.split('.')[0] + '.'))].slice(0, 32);
  const pairs = [];
  for (const t of named) {
    const seats = new Set(); let every = true;
    for (const s of subs) { if (!s.wants(t)) continue; const mine = s.seats && s.seats.get(t); if (!mine) { every = false; break; } for (const x of mine) seats.add(x); }
    if (every) for (const x of seats) pairs.push(t + ':' + x);
  }
  const all = [...refs], R = all.filter((x) => !all.some((p) => p !== x && x.startsWith(p)));   // in the order they were first asked
  return { types: T, refs: allRefs ? null : foldTo(R, max), seats: pairs.length && pairs.length <= 16 ? pairs.sort() : null, names: all.length, covered: all.length - R.length };
}
const carried = (conn, s) => {
  if (!conn) return false;
  for (const t of s.want) if (!covers(conn.typeSet, t)) return false;
  if (s.wants('ref') && conn.refs !== null) { if (!s.refs) return false; for (const r of s.refs) if (!under(conn.refSet, r)) return false; }
  if (conn.seatMap) for (const [t, asked] of conn.seatMap) { if (!s.wants(t)) continue; const mine = s.seats && s.seats.get(t); if (!mine) return false; for (const x of mine) if (!asked.has(x)) return false; }   // a type the connection asks by seat: one who wants every seat of it, or another seat, is not carried
  return true;
};

/** createHub(nest, {fetch, setTimeout, clearTimeout}) -> { origin, join(), counts() }. hubOf() finds or makes the window's; this makes one outright (tests).
 *  counts(): types, refs and seats are what the connection asks; names and covered are the subscribers' ref names now (unionOf's): past bound, roots, then every ref. */
export function createHub(nest = NEST, { fetch: fetchImpl, setTimeout: later = (fn, ms) => globalThis.setTimeout(fn, ms), clearTimeout: clear = (id) => globalThis.clearTimeout(id), queueMicrotask: micro = (fn) => { Promise.resolve().then(fn); } } = {}) {
  const origin = gate(nest, { live: true });
  const subs = new Set();
  let wire = null, conn = null, timer = null, timerMs = 0, nextId = 1, opens = 0, isOpen = false, status = 'closed', bound = REFS_UNSAID;   // bound: the ref names the Nest said its stream takes (THE NEST SAYS ITS BOUND, Nov 2 2026), REFS_UNSAID until a hello says one
  const hv = new Map(); let helloPlace = null;   // THE VECTOR (above): where the connection stands, each origin's count of the lines it handed on (and a beat's places, from now); the place its hello named
  const call = (s, fn, ...a) => { if (typeof fn !== 'function') return; try { fn(...a); } catch (e) { if (fn !== s.onStatus) call(s, s.onStatus, 'error: a handler threw: ' + String(e && e.message || e).slice(0, 200)); } };
  const minCursor = () => { let m = null; for (const s of subs) if (s.cursor != null && (m == null || s.cursor < m)) m = s.cursor; return m; };   // null: nobody has a place yet, from the head
  const served = () => (conn ? Math.max(conn.low, wire.cursor()) : -1);   // up to here the connection has handed lines on (Infinity: opened from the head, its hello not yet read)
  const behindV = (s) => { if (!s.vec || !conn || !conn.vector) return !!s.vec; for (const [p, n] of s.vec) if (!hv.has(p) || n < hv.get(p)) return true; return false; };   // a vector subscriber the connection has not carried to where it stands

  function onHello(h) {
    if (!conn || !Number.isSafeInteger(h.seq)) return;
    const said = Math.min(REFS_MAX, h.refs > 0 ? h.refs : REFS_UNSAID); if (said !== bound) { bound = said; schedule(0); }   // THE NEST SAYS ITS BOUND: never more names than this Nest takes (one that says none, REFS_UNSAID); a new bound asks again at once
    helloPlace = h.place || helloPlace;
    conn.hello = h.seq; if (conn.low === Infinity) conn.low = h.seq;   // the first hello of a head-opened connection: served from there (a later hello is the wire's own reconnect, which resumes from this one)
    for (const s of subs) if (s.cursor == null && !s.vec) s.cursor = h.seq;   // "from now" is from the Nest's head at this open
  }
  function onEntry(e, raw) {
    const live = e.live === true || e.hour === true;   // the present (wind.body, harmony.canvas.live, game.state; a line of the hour, his head at rest: no seq of its own): outside the order, to every subscriber that asked its type, no cursor moved
    const o = live ? null : originOfLine(e, helloPlace); if (o && o[1] > (hv.get(o[0]) || 0)) hv.set(o[0], o[1]);
    for (const s of subs) {
      if (s.win && s.win.closed) continue;   // a frame that went without closing: never called again, dropped at the next beat
      if (!live && s.vec) {   // a vector subscriber: each origin's lines once, whichever chain serves them (THE NEST IS HOLY)
        if (o) { if (o[1] <= (s.vec.get(o[0]) || 0)) continue; s.vec.set(o[0], o[1]); }
        if (Number.isSafeInteger(e.seq)) s.last = e.seq;
      } else if (!live) {
        if (s.cursor == null) s.cursor = e.seq - 1;   // a Nest without the hello line: from this line on
        if (e.seq <= s.cursor) continue;
        s.cursor = e.seq;   // every line of the union counts: the union carries this subscriber's whole filter
      }
      if (live && s.seats && !seated(s.seats, e)) continue;   // a live line of a seat this subscriber did not name for its type (a Nest that filters never sent it; an older one sends every seat)
      if (s.wants(e.type) && (e.type !== 'ref' || !s.refs || under(s.refs, refName(e)))) call(s, s.onEntry, e, raw);
    }
  }
  function reap() { let gone = false; for (const s of subs) if (s.win && s.win.closed) { subs.delete(s); gone = true; } if (gone) schedule(subs.size ? NARROW_MS : 0); }   // a subscriber whose window is gone (a frame removed with its stream open)
  function onBeat(b, raw) {
    reap();
    if (b && b.origins && typeof b.origins === 'object') for (const [p, n] of Object.entries(b.origins)) if (PLACE_COUNT.test(`${p}:${n}`)) { if (!hv.has(p)) hv.set(p, Number(n)); for (const s of subs) if (s.vec && !s.vec.has(p)) s.vec.set(p, Number(n)); }   // a place not met yet: from now (every line of it below the beat went out before it)
    for (const s of subs) call(s, s.onBeat, b, raw);
  }   // every 2 s on a typed stream
  function onGap(g, raw) {
    if (g && typeof g.upto === 'string') {   // the vector's cut (THE NEST IS HOLY): a subscriber hears it only when it leaves a hole in its own vector; a seq subscriber rides where the connection stands and loses nothing to a page
      const up = vecOf(g.upto); if (!up) return; for (const [p, n] of up) if (n > (hv.get(p) || 0)) hv.set(p, n);
      for (const s of subs) { if (!s.vec) continue; let hole = false; for (const [p, n] of up) if ((s.vec.get(p) || 0) < n) { hole = true; s.vec.set(p, n); } if (hole) call(s, s.onGap, g, raw); }
      return;
    }
    if (g && g.vector === false && conn) { conn.vector = false; for (const s of subs) call(s, s.onGap, g, raw); return; }   // the wire went on by the seq (what answers speaks no vectors): every subscriber takes its picture again
    if (!Number.isSafeInteger(g && g.upto)) return;
    for (const s of subs) { if (s.vec) continue; if (s.cursor != null && s.cursor >= g.upto) continue; call(s, s.onGap, g, raw); s.cursor = Math.max(s.cursor ?? 0, g.upto); }   // below upto its picture has a hole until the hop lands; at or past it, none
  }
  // THE DOOR NAMES ITS NEST (`event: peer`, embertide-iroh bridge --peers): on the vector road a change of Nests costs a vector subscriber nothing, but a seq
  // subscriber's cursor counted the other chain: it is told (a gap, switched) and counts this one from its next line. On the seq road the door says its own gap.
  function onPeer(x, raw) {
    const name = x && typeof x.peer === 'string' ? x.peer : null; if (!conn || !name) return; const was = conn.peer; conn.peer = name;
    if (!conn.vector || !was || was === name) return;
    for (const s of subs) { if (s.vec || s.cursor == null) continue; const g = { after: s.cursor, upto: s.cursor, head: s.cursor, switched: true, peer: name }; call(s, s.onGap, g, JSON.stringify(g)); s.cursor = null; }
  }
  function onStatus(s) {
    status = s;
    if (s === 'closed') return;   // our own close (a reopen, the last subscriber gone): not the subscribers' business
    if (s === 'open') isOpen = true; else if (s === 'connecting' || s === 'reconnecting' || s.startsWith('error:')) isOpen = false;
    for (const sub of subs) call(sub, sub.onStatus, s);
  }
  function open(prev = null) {   // prev: the connection this one replaces, {s0: where it had served to, peer: the Nest it named}
    const u = unionOf(subs, bound), vsubs = [...subs].filter((s) => s.vec);
    if (vsubs.length) {   // THE VECTOR ROAD (above): asked from the meet of the vector subscribers' and of where the connection stands (its seq subscribers ride there)
      const riders = [...subs].filter((s) => !s.vec && s.cursor != null);
      for (const s of riders) if (!prev || s.cursor < prev.s0) { const g = { after: s.cursor, upto: s.cursor, head: s.cursor, vector: true }; call(s, s.onGap, g, JSON.stringify(g)); s.cursor = null; }   // a seq place the vector cannot say (no connection before, or behind it): its picture is taken again, its count from the next line
      const meet = meetOf([...vsubs.map((s) => s.vec), ...(riders.some((s) => s.cursor != null) ? [hv] : [])]);
      conn = { vector: true, peer: prev ? prev.peer : null, after: vecText(meet), low: -1, hello: 0, types: u.types, typeSet: new Set(u.types), refs: u.refs, refSet: new Set(u.refs || []), seats: u.seats, seatMap: u.seats ? seatsOf(u.seats) : null };
      for (const [p, n] of meet) if (!hv.has(p)) hv.set(p, n);
      opens++;
      wire = wireJoin({ nest: origin, after: meet, types: u.types.join(','), refs: u.refs ? u.refs.join(',') : '', seats: u.seats ? u.seats.join(',') : '', live: true, fetch: fetchImpl, reconnectPolicy: 'immediate-backoff', onHello, onEntry, onBeat, onGap, onPeer, onStatus });
      return;
    }
    const after = minCursor();
    conn = { vector: false, peer: prev ? prev.peer : null, after: after ?? 0, low: after != null ? after : Infinity, hello: 0, types: u.types, typeSet: new Set(u.types), refs: u.refs, refSet: new Set(u.refs || []), seats: u.seats, seatMap: u.seats ? seatsOf(u.seats) : null };
    opens++;
    wire = wireJoin({ nest: origin, after, types: u.types.join(','), refs: u.refs ? u.refs.join(',') : '', seats: u.seats ? u.seats.join(',') : '', live: true, fetch: fetchImpl, reconnectPolicy: 'immediate-backoff', onHello, onEntry, onBeat, onGap, onPeer, onStatus });
  }
  function shut() { if (!wire) return; const w = wire; wire = null; conn = null; isOpen = false; w.close(); }
  function tick() {
    timer = null;
    if (!subs.size) { shut(); return; }
    const u = unionOf(subs, bound), vector = [...subs].some((s) => s.vec);
    const same = conn && conn.types.join() === u.types.join() && String(conn.refs) === String(u.refs) && String(conn.seats) === String(u.seats) && conn.vector === vector;
    let behind = false; if (conn) { const s0 = served(); for (const s of subs) if (s.vec ? behindV(s) : s.cursor != null && s.cursor < s0) { behind = true; break; } }
    if (!conn || !same || behind) { const prev = conn ? { s0: served(), peer: conn.peer } : null; shut(); open(prev); }
  }
  const schedule = (ms) => { if (timer != null) { if (ms >= timerMs) return; clear(timer); } timerMs = ms; timer = later(tick, ms); };

  /** join({types, refs, seats, after, onEntry, onBeat, onGap, onStatus, win}) -> { close(), cursor(), vector(), paging() }: the wire's contract, per subscriber.
   *  after > 0: from that seq (a replay for this subscriber only, when the connection is past it); else from now (the Nest's head). win: the subscriber's window.
   *  after a VECTOR ('place:count,...', a Map, {place: count}): each origin's lines after its count, once, whichever Nest serves them (THE NEST IS HOLY, above).
   *  seats: '<type>:<seat>,...': of that LIVE type only those seats' lines (a type it names no seat for: every seat's; a logged line: always). */
  function join({ types = '', refs = '', seats = '', after = 0, onEntry: e, onBeat: b, onGap: g, onStatus: st, win = null } = {}) {
    const want = parseTypes(types); if (!want.length) throw new Error('refused: a subscriber names the types it wants (the untyped stream is every line and no beat)');
    const vec = vecOf(after), a = vec ? 0 : Number(after), floor = conn ? Math.max(conn.hello, wire.cursor()) : 0;
    const r = parseRefs(refs);
    const s = { id: nextId++, want, wants: wantsOf(want), refs: r.length ? r : null, seats: seatsOf(seats), vec, last: 0, cursor: vec ? null : Number.isSafeInteger(a) && a > 0 ? a : floor > 0 ? floor : null, onEntry: e, onBeat: b, onGap: g, onStatus: st, win };
    subs.add(s);
    if (!carried(conn, s) || (vec ? behindV(s) : s.cursor != null && s.cursor < served())) schedule(0);
    else if (isOpen) micro(() => { if (subs.has(s)) call(s, s.onStatus, 'open'); });
    return {
      close() { if (!subs.delete(s)) return; call(s, s.onStatus, 'closed'); schedule(subs.size ? NARROW_MS : 0); },
      cursor: () => (s.vec ? s.last : s.cursor ?? 0),
      vector: () => (s.vec ? vecText(s.vec) : null),
      paging: () => !!wire && wire.paging(),
    };
  }
  return { origin, join, counts: () => { const u = unionOf(subs, bound); return { subscribers: subs.size, opens, open: isOpen, status, types: conn ? conn.types : [], refs: conn ? conn.refs : null, bound, names: u.names, covered: u.covered, seats: conn ? conn.seats : null, cursor: wire ? wire.cursor() : 0, hello: conn ? conn.hello : 0, vector: conn ? (conn.vector ? vecText(hv) : null) : null, peer: conn ? conn.peer : null }; } };
}

/** The topmost window of this page's same-origin region: where this window's one hub lives. */
function topOf(w) { try { while (w.parent && w.parent !== w && w.parent.location.origin === w.location.origin) w = w.parent; } catch { /* a cross-origin parent: this window tops our region */ } return w; }
const here = typeof window === 'object' && window ? window : null;
const hubIn = (o, origin) => { const reg = o[REG] || (o[REG] = {}); return reg[origin] || (reg[origin] = createHub(origin)); };   // one hub per Nest origin on that object, made in THIS realm
/** hubOf(nest) -> this window's hub for that Nest: the top's (made in the top's realm by its own copy of this module), else this page's own. */
export function hubOf(nest = NEST) {
  const origin = gate(nest, { live: true });
  if (!here) return hubIn(globalThis, origin);
  const T = topOf(here);
  const found = T[REG] && T[REG][origin]; if (found) return found;
  if (T !== here && typeof T[OPEN] === 'function') return T[OPEN](origin);
  return hubIn(here, origin);   // no copy of this module in the top, or a frame that subscribed before the top's copy ran: this page holds its own (the per-page fallback)
}
if (here) here[OPEN] = (origin) => hubIn(here, origin);

const MINE = new Set();   // this realm's open subscriptions (sources and joins): closed when its page goes for good, so the top's hub forgets a dropped frame at once
if (here) here.addEventListener('pagehide', (ev) => { if (ev && ev.persisted) return; for (const s of [...MINE]) s.close(); });   // persisted: the page may come back whole, its streams with it

/** join(opts): nest-wire's join signature on the window's hub (opts.nest picks the Nest; live and reconnectPolicy are the hub's). */
export function join(opts = {}) {
  const sub = hubOf(opts.nest || NEST).join({ win: here, ...opts });
  const h = { close() { MINE.delete(h); sub.close(); }, cursor: sub.cursor, vector: sub.vector, paging: sub.paging };
  MINE.add(h); return h;
}

const report = (e) => { try { if (typeof reportError === 'function') reportError(e); else console.error(e); } catch { /* nowhere to say it */ } };
/** An EventSource look-alike over the hub: new NestSource('<nest>/nest/stream?types=..&refs=..&seats=..&after=..'). onopen, onmessage, onerror; 'gap' and 'beat' by
 *  addEventListener; readyState; close(). An event is a plain object {type, target, data, entry, lastEventId}: data is the line's own text and entry its one parsed
 *  object, both shared with every other subscriber (never mutate them). A handler that throws is reported as the DOM would and never read as a dropped connection.
 *  after: a seq > 0 resumes from it; none is from now. An explicit after=0 is the log's floor, which the Nest answered with its first lines and a gap at once: here it
 *  is from now plus that one 'gap' on the first open, so the opener's own recovery runs (a keyframe, a re-page of the typed log, a retry) and nothing replays the log. */
export class NestSource {
  constructor(url, { hub = null } = {}) {
    const u = new URL(String(url), typeof location === 'object' && location ? location.href : undefined);
    this.url = u.href; this.readyState = 0; this.withCredentials = false; this.onopen = null; this.onmessage = null; this.onerror = null; this._on = {};
    const asked = u.searchParams.get('after'); let floorGap = asked !== null && /^\s*\d*\s*$/.test(asked) && !(Number(asked) > 0);   // an explicit after=0 (a cursor its page never got): one gap on the first open; a vector is no floor (THE NEST IS HOLY)
    const run = (f, ev) => { try { f.call(this, ev); } catch (e) { report(e); } };
    const fire = (type, init) => {
      if (this.readyState === 2) return;
      const ev = { type, target: this, data: '', entry: null, lastEventId: '', ...init };
      if (typeof this['on' + type] === 'function') run(this['on' + type], ev);
      const L = this._on[type]; if (L) for (const f of L.slice()) run(f, ev);
    };
    this._sub = (hub || hubOf(u.origin)).join({
      types: u.searchParams.get('types') || '', refs: u.searchParams.get('refs') || '', seats: u.searchParams.get('seats') || '', after: u.searchParams.get('after') || 0, win: here,
      onEntry: (e, raw) => fire('message', { data: raw, entry: e, lastEventId: e.live === true || e.hour === true ? '' : String(e.seq) }),   // a live line and a line of the hour have no id
      onBeat: (b, raw) => fire('beat', { data: raw, entry: b }),
      onGap: (g, raw) => fire('gap', { data: raw, entry: g }),
      onStatus: (s) => {
        if (s === 'open') { if (this.readyState === 0) { this.readyState = 1; fire('open'); if (floorGap) { floorGap = false; const at = this._sub ? this._sub.cursor() : 0; fire('gap', { data: '', entry: { after: 0, upto: at, head: at } }); } } }
        else if (s === 'reconnecting' || s.startsWith('error:')) { if (this.readyState === 1) { this.readyState = 0; fire('error'); } }
      },
    });
    MINE.add(this);
  }
  addEventListener(type, f) { if (typeof f !== 'function') return; const L = this._on[type] || (this._on[type] = []); if (!L.includes(f)) L.push(f); }
  removeEventListener(type, f) { const L = this._on[type], i = L ? L.indexOf(f) : -1; if (i >= 0) L.splice(i, 1); }
  close() { if (this.readyState === 2) return; this.readyState = 2; MINE.delete(this); this._sub.close(); }
}
NestSource.CONNECTING = 0; NestSource.OPEN = 1; NestSource.CLOSED = 2;

/** A page module's default source: NestSource in a window, none in Node (where globalThis.EventSource is undefined too): an opener there is a test's, and it injects
 *  its own. Declared AFTER the class: a class binding is dead until its line runs, and reading it above threw at module load in every browser (67cffd6, 02:59-03:03). */
export const NestEventSource = here ? NestSource : undefined;
