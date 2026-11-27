// dl-glass.js: THE MINT PAGE IS A GLASS OF THE ROOM, the page half (dl-glass.mjs holds the law and his words). ONE LINE in warm.html mounts it,
// the room's way (ON-EVERY-GLASS.md: one line a page): <script type="module" src="./dl-glass.js?mount&v=glass-1">. On a seat of the house (?seat=<glass>,
// or the dev server's /dev/lan {nest, glass}: tools/mint-dev.mjs --glass) it holds the one module by its hash, stands on the station's count through the
// rite's own count door host (imported BY PATH from the rite that serves it, <rite>/lib/count-door.mjs: the bytes the rite stamps by, no copy), reads
// the twin off the Nest's one stream (room/nest-hub.mjs: one connection a window) and mounts the room's field glass (room/field-glass.mjs: field/1 on
// this glass from the same causes, and the music field's wave painted on this glass's own pixels by WebGPU, each pixel at its measured place; gated by
// the house's measurements, said in the receipt). With no seat (the public mint, a visitor's page) it fetches nothing and mounts nothing: every import
// of the room folder stands behind the seat, so the site ships none of it.
// THE RECEIPT: window.dlGlass.state() (words and numbers), window.dlGlass.count() (the count now: one trip of the rite's clock when the basis is older
// than the door's age, on ask, never a timer). On the dev road (?harmony=local, ?handoff=) the receipt stands as one line at the foot of the page,
// redrawn on cause (a ref moved on the Nest, the mount's trips, an ask), never on a timer: at rest nothing runs (S.timers says 0).
// THIS GLASS DOES NOT SPEAK YET: the field's words (field.join, field.word, field.snapshot) are counted (state().unsaid), not posted: no write to the
// live Nest from a test page until his word; `post` is the injectable that will carry them when he says so.
import {WASM_FILE, PIN_FILE, pinOf, TRIPS, TRIP_MS, ENTITY, seatOf, nestOf, riteOf, glassWord, gatesOf, receiptOf} from './dl-glass.mjs';

export const VERSION = 'glass-1';
export const LINE_Z = 2147483002;   // the receipt line: over her layers (dl-athena.js LAYER_Z 2147483000, dl-handoff.js HANDOFF_Z 2147483001): a receipt is read, never covered; it takes no pointer
export const REFS = (seat) => ['scene/active', `${ENTITY}${seat}`, 'room/primitives', 'field/birth', 'program/modules'];
// the room folder beside this page's (mint-dev and the rite both serve embertide-app/ui); built without a literal so tools/page-files.mjs ships none of it
const ROOM = new URL(import.meta.url.replace(/\/intro\/dyson-society\/app\/[^/?#]*(?:[?#].*)?$/, '/intro/room/'));
const onDev = (search) => /(^|[?&])(harmony=local|handoff=)/.test(search);
const sleep = (later, ms) => new Promise((r) => later(r, ms));
const CSS = `.dl-glass-line{position:fixed;right:12px;bottom:10px;z-index:${LINE_Z};margin:0;padding:.25em .55em;font:11px/1.45 ui-monospace,Menlo,monospace;
color:#d9d5cc;background:rgba(5,4,5,.74);border-radius:2px;pointer-events:none;letter-spacing:.01em;max-width:calc(100vw - 24px);white-space:nowrap;
overflow:hidden;text-overflow:ellipsis}`;

/** lanOf(fetch, origin): the dev server's house, /dev/lan {nest, glass} (the handoff lane's shape); null off the dev server or on an older one ({host} only). */
export async function lanOf(f, origin = '') {
  try { const r = await f(`${origin}/dev/lan`, {cache: 'no-store'}); if (!r.ok) return null; const j = await r.json(); return j && typeof j === 'object' && (j.nest || j.glass) ? {nest: j.nest ?? null, glass: j.glass ?? null} : null; } catch { return null; }
}

/** mountGlass(deps) -> { state(), count(), stop() }. Every dependency is injectable (dl-glass.test.mjs runs the glass under node with no browser). */
export async function mountGlass({
  doc = globalThis.document, win = globalThis.window, fetch: f = (...a) => globalThis.fetch(...a), search = win?.location?.search ?? '', lan,
  room = ROOM, join = null, countDoorOf = null, fieldOf = null, digest = null, post = null, say = null, log = () => {},
  instantiate = async (bytes) => (await WebAssembly.instantiate(bytes, {})).instance.exports,
  later = (fn, ms) => globalThis.setTimeout(fn, ms), now = () => Date.now(), monotonic = () => performance.now(),
} = {}) {
  const S = {seat: null, nest: null, rite: null, mounted: false, module: null, count: null, glass: null, gates: [], field: null, causes: 0, draws: 0, timers: 0, unsaid: 0, why: null};
  const refs = {}; let x = null, door = null, field = null, sub = null, line = null, stopped = false;
  const countWord = () => { if (!door) return null; const d = door.state(); return {at: door.stamp(now()), unc_ms: door.uncMs(), beat_ms: door.beatMs(), trips: d.trips, taken: d.taken, refused: d.refused, failed: d.failed, rtt_ms: d.last_rtt_ms, basis: d.basis, fresh: d.fresh, why: d.last_why}; };
  const state = () => receiptOf({...S, count: countWord(), field: field ? field.state() : null});
  const draw = () => {   // the receipt line: on cause only (a ref, a trip, an ask)
    if (!line) return;
    const c = countWord(), at = c && c.at != null ? Math.round(c.at).toLocaleString('en-US') : 'none';
    line.textContent = `a glass of the room · ${S.seat} · count ${at}${c && c.unc_ms >= 0 ? ` ±${c.unc_ms.toFixed(1)} ms` : ''} · ${S.gates[0] ?? 'the field paints'}`;
    S.draws++;
  };
  const reconsider = () => { S.glass = glassWord(refs[`${ENTITY}${S.seat}`], refs['scene/active']); S.gates = gatesOf({glass: S.glass, room: refs['room/primitives'], birth: refs['field/birth'], modules: refs['program/modules']}); };
  const cause = () => { S.causes++; reconsider(); draw(); };
  const api = {
    state,
    async count() { if (!door) return null; await door.ready(); draw(); return countWord(); },
    stop() { stopped = true; sub?.close(); field?.stop?.(); line?.remove(); line = null; },
  };
  if (win) win.dlGlass = api;
  try {
    if (lan === undefined) lan = onDev(search) && !new URLSearchParams(search).get('seat') ? await lanOf(f, win?.location?.origin ?? '') : null;
    S.seat = seatOf(search, lan);
    if (!S.seat) { S.why = 'no seat: this page is not a glass (a seat comes as ?seat=<glass>, or the dev server\'s /dev/lan {nest, glass})'; return api; }
    S.nest = nestOf(search, lan); S.rite = riteOf(search, S.nest);
    if (doc && (say ?? onDev(search))) {
      const style = doc.createElement('style'); style.textContent = CSS; doc.head.append(style);
      line = doc.createElement('p'); line.className = 'dl-glass-line'; line.setAttribute('aria-hidden', 'true'); doc.body.append(line);
    }
    // THE MODULE BY ITS HASH: the room folder's bytes, hashed before they run, refused unless they are the room's pinned ones (the eye door's line,
    // dl-glass.mjs PIN_FILE); one instance on this page
    const t0 = monotonic(), at = new URL(WASM_FILE, room), pinAt = new URL(PIN_FILE, room);
    const [r, p] = await Promise.all([f(at, {cache: 'default'}), f(pinAt, {cache: 'default'})]);
    if (!r.ok) { S.why = `the module answered http ${r.status} at ${String(at).slice(0, 160)}`; return api; }
    const pin = p.ok ? pinOf(await p.text()) : null;
    if (!pin) { S.why = `${p.ok ? 'no pin on the line build.sh writes' : `the room's pin answered http ${p.status}`} at ${String(pinAt).slice(0, 160)}: nothing runs`; return api; }
    const bytes = new Uint8Array(await r.arrayBuffer());
    const sha = digest ? await digest(bytes) : await (await import(String(new URL('isa/isa.mjs', room)))).digestHex(bytes, (globalThis.crypto && globalThis.crypto.subtle) || null);
    if (sha !== pin) { S.why = `the module is not the pinned one: sha256 ${sha.slice(0, 16)}, the room's pin ${pin.slice(0, 16)}: refused before it runs`; return api; }
    x = await instantiate(bytes);
    S.module = {sha256: sha, bytes: bytes.length, from: String(at), pin: String(pinAt), load_ms: Math.round((monotonic() - t0) * 1000) / 1000};
    // THE COUNT: the rite's count door host by path, fed the rite's clock door; TRIPS readings at the mount, then only on ask
    const {createCountDoor} = countDoorOf ? await countDoorOf() : await import(`${S.rite}/lib/count-door.mjs`);
    door = createCountDoor(x, {clockUrl: `${S.rite}/rite/radio/clock`, fetchImpl: f, now, log});
    for (let i = 0; i < TRIPS && !stopped; i++) { await door.tripNow(); if (i + 1 < TRIPS) { S.timers++; await sleep(later, TRIP_MS); S.timers--; } }
    // THE TWIN off the Nest's one stream: the refs this glass's word and the field's gates are read from
    const names = REFS(S.seat), hub = join || (await import(String(new URL('nest-hub.mjs', room)))).join;
    sub = hub({nest: S.nest, types: 'ref', refs: names.join(','), onEntry(e) { if (stopped || e?.type !== 'ref' || !names.includes(e.payload?.name)) return; refs[e.payload.name] = e.payload.value ?? null; cause(); }});
    await Promise.all(names.map(async (name) => { try { const q = await f(`${S.nest}/nest/ref/${name}`, {cache: 'no-store'}); if (q.ok) refs[name] = (await q.json()).ref?.value ?? null; } catch {} }));
    // THE FIELD ON THIS GLASS: the room's own glass of field/1 and the wave's WebGPU painter; its words counted, not posted (the head of this file)
    const mountField = fieldOf ? await fieldOf() : (await import(String(new URL('field-glass.mjs', room)))).mountField;
    field = mountField({seat: S.seat, nest: S.nest, room, fetch: f, post: post || (async () => { S.unsaid++; }), log});
    S.mounted = true; cause();
  } catch (e) { S.why = `the glass did not mount: ${String(e?.message || e).slice(0, 200)}`; draw(); }
  return api;
}

if (typeof document !== 'undefined' && /[?&]mount(&|$)/.test(new URL(import.meta.url).search)) mountGlass();
