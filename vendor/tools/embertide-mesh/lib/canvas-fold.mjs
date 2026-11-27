// canvas-fold.mjs — THE CANVAS IS ONE LOG (Oct 31 2026; his word on the figure of every glass: "the more spaghetti code we got the more shit looks awful",
// then "please proceed and be ruthless in the backend"). The Canvas's state is the ops, never a document: a stroke, a note, a pin, a move, an erase or a clear
// is ONE chained entry of the Nest, type canvas.op, stamped by the one clock, pushed to every glass on the stream at once, and folded where it is drawn by
// THIS module, the same bytes in the Nest (nest.mjs imports it) and on every glass (the rite serves it as /lib/canvas-fold.mjs; /nest/head says its sha256,
// and a glass folds with nothing else). No compare-and-swap, no snapshot blob, no copy per device: the fold is a pure function of the ops, the same on every
// peer whatever order the lines arrive in (THE NEST IS HOLY, piece 3: a fact takes the newest stamp across origins, a tie by place, one origin's own lines in
// its chain's order), so two Nests of the mesh hold the same Canvas and a late glass takes GET /nest/canvas/<id> (the fold) then rides the stream from its seq.
// The live tail of a stroke while the pen is down stays harmony.canvas.live (nest.mjs checkCanvasLive: the present, never the log); the committed stroke lands
// here once, at the lift, carrying the live line's `item` as its id.
//
// AN OP (the payload of a canvas.op entry; the seat is the author: a glass's seat, a seat's session id, an agent's task):
//   { schema: 'embertide.canvas-op/v1', canvas: <1..80 of [\w.:-]>, page: <1..64 of [\w.:-]>, id: <1..80 of [\w.:-]>, kind, ...fields }
//   ink   { pts: [[x, y, p], ...] 1..4096 integers (board units x 100; p pressure 0..1000), color?: <= 32 chars, width?: 1..100 px }   a committed stroke
//   text  { pos: [x, y], text: <= 4000 chars, w?: 40..4000 board px, color?, role?: title|text|sticky|code|panel, lang?: <= 24 }    a note, a title, a code block
//   pin   { pos: [x, y], text?: <= 280 chars, color? }                                                                               a marker
//   shape { pos: [x, y], w: 1..4000000, h: 1..4000000 (board units x 100: up to 40,000 px), shape: <= 24 chars (rect, ellipse, ...), text?: <= 280, color? }                 a figure
//         + { blob: sha256 hex, mime: text/html, size: 1..2000000 bytes }, all three or none: a WIDGET, the page its box runs, a blob the Nest holds (Oct 30 2026)
//   arrow { pos: [x, y], d: [dx, dy], text?: <= 280, color?, width? }                                                                from pos to pos + d; from?, to?: the ids of the two things it joins (THE CANVAS NESTS, below)
//   image { pos: [x, y], w, h, blob: sha256 hex }                                                                                    a picture the Nest holds by hash
//   table { pos: [x, y], rows: [[cell, ...], ...] <= 64 x 16, cell <= 400 chars, w? }
//   chart { pos: [x, y], w?, h?, spec: an object <= 20000 chars }
//   move  { pos: [x, y] }        the item `id` moves (ink: its origin shifts to pos; the rest: their pos); in?: the frame pos is measured from (THE CANVAS NESTS, below)
//   erase {}                     the item `id` is gone
//   clear {}                     every item of `page` created before this op's stamp is gone; one created after it stays
// A content op (ink, text, pin, shape, arrow, image, table, chart, frame) for an id that stands is an edit: the newer stamp's content replaces the older.
// THE FOLD: items by id. Content (ink, text, pin) and each fact (pos, gone) and a page's clear each keep the stamp of the line that set them and take a line
// only when it is newer; a move or an erase that arrives before its item (a peer's line) is held as the fact and shows when the content comes. An id is the
// author's own (`<seat>:<n>`, the live line's `item`), so two authors never contend; the same op twice (a retry, a relay) is the same stamp and changes nothing. THE CANVAS NESTS (Nov 6 2026; the law and the tree it makes: the crate embertide-canvas): a place may say `in`, the id of the frame its pos is measured from (absent: the page); a frame { pos, w, h, name?, color?, closed? } holds things; an arrow may name the two things it joins. This fold keeps the three, so a keyframe carries them; a thing keeps its frame until a move says otherwise (setPlace). The door takes a frame and `in` as embertide-canvas src/door.rs check_nest says, in its words (THE DOOR TAKES THE FRAME, Nov 7 2026: an editor that lays an item again without `in` keeps its frame); an arrow's `from` and `to` it does not take yet, since no editor keeps them.
export const CANVAS_OP = 'canvas.op', CANVAS_OP_SCHEMA = 'embertide.canvas-op/v1', CANVAS_DOC_SCHEMA = 'embertide.canvas-doc/v1';
export const CANVAS_OP_KINDS = Object.freeze(['ink', 'text', 'pin', 'shape', 'arrow', 'image', 'table', 'chart', 'frame', 'move', 'erase', 'clear']);
export const CONTENT_KINDS = Object.freeze(['ink', 'text', 'pin', 'shape', 'arrow', 'image', 'table', 'chart', 'frame']);
export const TEXT_ROLES = Object.freeze(['title', 'text', 'sticky', 'code', 'panel']);
export const WIDGET_MIMES = Object.freeze(['text/html']), OP_MAX_WIDGET_BYTES = 2_000_000;   // a widget's page: lib/canvas-widget.mjs WIDGET_TYPE and WIDGET_MAX_BYTES (its test holds them equal)
export const OP_MAX_POINTS = 4096, OP_MAX_TEXT = 4000, OP_MAX_PIN_TEXT = 280, OP_MAX_BYTES = 200_000, OP_MAX_SPAN = 4_000_000, OP_MAX_ROWS = 64, OP_MAX_COLS = 16, OP_MAX_CELL = 400, OP_MAX_SPEC = 20000;
const NAME = /^[\w.:-]{1,80}$/, PAGE = /^[\w.:-]{1,64}$/;
const int = (v) => Number.isSafeInteger(v);
const pos2 = (v) => Array.isArray(v) && v.length === 2 && int(v[0]) && int(v[1]);
const fail = (msg) => { const err = new Error(msg); err.status = 400; throw err; };
/** safeName(s): a name the fold may key an object by. The fold's maps are plain objects (the Nest serves them as JSON, every glass folds into the JSON it
 *  read), so a canvas, page or item named after one of Object.prototype's own names would write onto every object of the Nest and of every glass
 *  (__proto__) or onto the built-ins (constructor, toString): refused at the door, skipped by the fold. Found by the bridge's builder, Nov 1 2026. */
const UNSAFE_NAMES = new Set(Object.getOwnPropertyNames(Object.prototype));
export const safeName = (s) => typeof s === 'string' && !UNSAFE_NAMES.has(s);

/** checkCanvasOp(seat, p): the op as a writer posts it, or a thrown Error (status 400) naming what no glass could fold. Returns the kind. */
export function checkCanvasOp(seat, p) {
  if (!seat || typeof seat !== 'string') fail('canvas.op needs a seat: the author');
  if (!p || typeof p !== 'object' || Array.isArray(p)) fail('canvas.op needs a payload');
  if (p.schema !== CANVAS_OP_SCHEMA) fail(`canvas.op payload schema must be ${CANVAS_OP_SCHEMA}`);
  for (const k of ['canvas', 'page', 'id']) if (typeof p[k] === 'string' && !safeName(p[k])) fail(`canvas.op ${k} is a name a glass can key by: none of Object's own (__proto__, constructor, toString, ...)`);
  if (!(typeof p.canvas === 'string' && NAME.test(p.canvas))) fail('canvas.op canvas is the board\'s id (1 to 80 chars of [\\w.:-])');
  if (!(typeof p.page === 'string' && PAGE.test(p.page))) fail('canvas.op page is the page\'s name (1 to 64 chars of [\\w.:-])');
  if (!(typeof p.id === 'string' && NAME.test(p.id))) fail('canvas.op id is the item\'s id, the author\'s own (1 to 80 chars of [\\w.:-])');
  if (!CANVAS_OP_KINDS.includes(p.kind)) fail(`canvas.op kind is one of ${CANVAS_OP_KINDS.join(', ')}`);
  if (p.in !== undefined) { if (!CONTENT_KINDS.includes(p.kind) && p.kind !== 'move') fail('canvas.op in rides a place: a content op or a move says it, an erase or a clear never'); if (!(typeof p.in === 'string' && NAME.test(p.in) && safeName(p.in) && p.in !== p.id)) fail('canvas.op in is the frame the place is measured from: an item\'s id (1 to 80 chars of [\\w.:-]), never the op\'s own; leave it out for the page'); }   // door.rs check_nest
  if (p.kind === 'arrow') for (const end of ['from', 'to']) if (p[end] !== undefined && !(typeof p[end] === 'string' && NAME.test(p[end]) && safeName(p[end]) && p[end] !== p.id)) fail(`canvas.op arrow ${end} is the id of the thing that end joins (1 to 80 chars of [\\w.:-]), never the arrow's own`); if (p.kind === 'shape' && p.act !== undefined && !(typeof p.act === 'string' && p.act.length >= 1 && p.act.length <= 40 && !/[\u0000-\u001f\u007f-\u009f]/.test(p.act) && p.act.trim() === p.act)) fail('canvas.op shape act is what pressing it does: a short name, 1 to 40 chars on one line');   // AN ARROW KEEPS ITS ENDS (Nov 25 2026): the door takes an arrow's from and to as embertide-canvas door.rs check_nest does, in its words, now the editors keep them; A BUTTON IS A THING OF THE RECORD (Nov 25 2026): door.rs check_nest's words
  if (p.color !== undefined && !(typeof p.color === 'string' && p.color.length <= 32)) fail('canvas.op color is a short string');
  const span = (v) => int(v) && v >= 1 && v <= OP_MAX_SPAN;
  const short = (v, n) => typeof v === 'string' && v.length <= n;
  if (!['ink', 'arrow', 'erase', 'clear'].includes(p.kind) && !pos2(p.pos)) fail(`canvas.op ${p.kind} pos is [x, y] in board units x 100, integers`);   // an arrow's pos is where it starts (its own words, below)
  if (['shape', 'image', 'frame'].includes(p.kind) && !(span(p.w) && span(p.h))) fail(`canvas.op ${p.kind} w and h are board units x 100, 1 to ${OP_MAX_SPAN}`);
  if (p.kind === 'ink') {
    const pts = p.pts;
    if (!Array.isArray(pts) || pts.length < 1 || pts.length > OP_MAX_POINTS || !pts.every(r => Array.isArray(r) && r.length === 3 && int(r[0]) && int(r[1]) && int(r[2]) && r[2] >= 0 && r[2] <= 1000))
      fail(`canvas.op ink pts is 1 to ${OP_MAX_POINTS} points [x, y, pressure], integers (board units x 100; pressure 0 to 1000)`);
    if (p.width !== undefined && !(int(p.width) && p.width >= 1 && p.width <= 100)) fail('canvas.op width is px, 1 to 100');
    if (p.hand !== undefined && !(typeof p.hand === 'string' && /^[a-z]{1,16}$/.test(p.hand))) fail('canvas.op ink hand is the hand a person drew it with on a glass (pencil, finger, mouse): 1 to 16 lowercase letters');   // a tool\'s or an agent\'s ink carries none (pencil-chat reads only ink drawn by a hand)
  } else if (p.kind === 'text') {
    if (!(typeof p.text === 'string' && p.text.length >= 1 && p.text.length <= OP_MAX_TEXT)) fail(`canvas.op text is the words, 1 to ${OP_MAX_TEXT} chars`);
    if (p.w !== undefined && !(int(p.w) && p.w >= 40 && p.w <= 4000)) fail('canvas.op text w is the note width, board px 40 to 4000');
    if (p.role !== undefined && !TEXT_ROLES.includes(p.role)) fail(`canvas.op text role is one of ${TEXT_ROLES.join(', ')}`);
    if (p.lang !== undefined && !short(p.lang, 24)) fail('canvas.op text lang is up to 24 chars');
  } else if (p.kind === 'pin') {
    if (p.text !== undefined && !short(p.text, OP_MAX_PIN_TEXT)) fail(`canvas.op pin text is up to ${OP_MAX_PIN_TEXT} chars`);
  } else if (p.kind === 'shape') {
    if (!(typeof p.shape === 'string' && /^[a-z][a-z0-9-]{0,23}$/.test(p.shape))) fail('canvas.op shape names its figure (rect, ellipse, ...: up to 24 chars)');
    if (p.text !== undefined && !short(p.text, OP_MAX_PIN_TEXT)) fail(`canvas.op shape text is up to ${OP_MAX_PIN_TEXT} chars`);
    if (p.blob !== undefined || p.mime !== undefined || p.size !== undefined) {   // THE WIDGET ON THE CANVAS (his Oct 30 2026 ~06:3x UTC ask): the box runs a page the Nest holds
      if (!(typeof p.blob === 'string' && /^[0-9a-f]{64}$/.test(p.blob))) fail('canvas.op shape blob is the sha256 of the page its box runs (a widget: blob, mime and size together)');
      if (!WIDGET_MIMES.includes(p.mime)) fail(`canvas.op shape mime is the widget page's type, one of ${WIDGET_MIMES.join(', ')}`);
      if (!(int(p.size) && p.size >= 1 && p.size <= OP_MAX_WIDGET_BYTES)) fail(`canvas.op shape size is the widget page's bytes, 1 to ${OP_MAX_WIDGET_BYTES}`);
    }
  } else if (p.kind === 'arrow') {
    if (!pos2(p.pos)) fail('canvas.op arrow pos is where it starts, [x, y] in board units x 100, integers');
    if (!pos2(p.d)) fail('canvas.op arrow d is [dx, dy] to where it points, integers');
    if (p.text !== undefined && !short(p.text, OP_MAX_PIN_TEXT)) fail(`canvas.op arrow text is up to ${OP_MAX_PIN_TEXT} chars`);
    if (p.width !== undefined && !(int(p.width) && p.width >= 1 && p.width <= 100)) fail('canvas.op width is px, 1 to 100');
  } else if (p.kind === 'frame') {   // THE CANVAS NESTS: a frame holds things; closed, it shows as one box
    if (p.name !== undefined && !short(p.name, 80)) fail('canvas.op frame name is its title, up to 80 chars');
    if (p.closed !== undefined && typeof p.closed !== 'boolean') fail('canvas.op frame closed is true or false: a closed frame shows as one box and hides what it holds');
  } else if (p.kind === 'image') {
    if (!(typeof p.blob === 'string' && /^[0-9a-f]{64}$/.test(p.blob))) fail('canvas.op image blob is the sha256 of bytes the Nest holds');
  } else if (p.kind === 'table') {
    if (!Array.isArray(p.rows) || p.rows.length < 1 || p.rows.length > OP_MAX_ROWS || !p.rows.every(r => Array.isArray(r) && r.length >= 1 && r.length <= OP_MAX_COLS && r.every(c => short(c, OP_MAX_CELL))))
      fail(`canvas.op table rows is up to ${OP_MAX_ROWS} rows of up to ${OP_MAX_COLS} cells, each up to ${OP_MAX_CELL} chars`);
    if (p.w !== undefined && !span(p.w)) fail('canvas.op table w is board units x 100');
  } else if (p.kind === 'chart') {
    if (p.w !== undefined && !span(p.w)) fail('canvas.op chart w is board units x 100'); if (p.h !== undefined && !span(p.h)) fail('canvas.op chart h is board units x 100');
    if (!p.spec || typeof p.spec !== 'object' || Array.isArray(p.spec) || JSON.stringify(p.spec).length > OP_MAX_SPEC) fail(`canvas.op chart spec is an object up to ${OP_MAX_SPEC} chars`);
  }
  if (JSON.stringify(p).length > OP_MAX_BYTES) fail(`canvas.op payload over ${OP_MAX_BYTES} bytes`);
  return p.kind;
}

const CONTENT_FIELDS = { ink: ['pts', 'color', 'width', 'hand'], text: ['text', 'w', 'color', 'role', 'lang'], pin: ['text', 'color'], shape: ['w', 'h', 'shape', 'text', 'color', 'blob', 'mime', 'size', 'act'], arrow: ['d', 'text', 'color', 'width', 'from', 'to'], image: ['w', 'h', 'blob'], table: ['rows', 'w'], chart: ['w', 'h', 'spec'], frame: ['w', 'h', 'name', 'color', 'closed'] };
const setIn = (it, p) => { if (typeof p.in === 'string' && NAME.test(p.in) && safeName(p.in) && p.in !== p.id) it.in = p.in; else delete it.in; };   // the frame a place is measured from; anything else is the page, and is not said
/** setPlace: rule 1 (embertide-canvas fold.rs set_place). The place takes its stamp; the frame takes its own (inAt) when the line says it: a move always (none: the page), a content op only when it carries `in` (one that carries none keeps the frame, its pos measured from it). The fold is the ops applied in the order of their stamps, whatever order they come in. */
const setPlace = (it, p, pos, s) => { let changed = false; if (newerStamp(it.posAt, s.ts, s.place)) { it.pos = pos; it.posAt = { ...s }; changed = true; } if ((p.kind === 'move' || p.in !== undefined) && newerStamp(it.inAt, s.ts, s.place)) { setIn(it, p); it.inAt = { ...s }; changed = true; } return changed; };

/** emptyCanvas(id): the fold before any op. */
export const emptyCanvas = (canvas) => ({ schema: CANVAS_DOC_SCHEMA, canvas, items: {}, pages: {}, ops: 0, ts: 0, seq: 0 });

/** newerStamp(cur, ts, place): the Nest's own rule (nest.mjs newer): a line takes a fact when it is newer by the stamp; a tie goes to the greater place;
 *  a line of the fact's own place takes it when it is not older (one origin's lines come in its chain's order). cur is {ts, place} or null. */
export function newerStamp(cur, ts, place) {
  if (!cur) return true;
  if (cur.place === place) return ts >= cur.ts;   // one origin's lines in its chain's order (a tie: the later line); a glass folding its own line older than its fact changes nothing
  return ts > cur.ts || (ts === cur.ts && place > cur.place);
}

/** foldCanvasOp(doc, e, place): one chained entry {seat, ts, place?, seq?, payload} folded into the doc in place. Returns true when something changed. */
export function foldCanvasOp(doc, e, place = '') {
  const p = e.payload, ep = String(e.place ?? place), ts = Number(e.ts) || 0, seat = String(e.seat || '');
  if (!p || p.canvas !== doc.canvas || !safeName(p.canvas) || !safeName(p.page) || !safeName(p.id) || !CANVAS_OP_KINDS.includes(p.kind)) return false;   // a name of Object's own is never folded (safeName); nor a kind this fold does not know (a peer's line passes no door)
  doc.ops++; if (ts > doc.ts) doc.ts = ts; if (e.seq && e.seq > doc.seq) doc.seq = e.seq;
  const page = (doc.pages[p.page] ||= { cleared: null, n: 0 });
  if (p.kind === 'clear') { if (!newerStamp(page.cleared, ts, ep)) return false; page.cleared = { ts, place: ep, seq: e.seq || 0, by: seat }; return true; }
  const it = (doc.items[p.id] ||= { id: p.id, page: p.page, kind: null, by: null, created: null, pos: null, posAt: null, gone: null, content: null });
  if (p.kind === 'erase') { if (!newerStamp(it.gone, ts, ep)) return false; it.gone = { ts, place: ep, seq: e.seq || 0, by: seat }; return true; }
  const s = { ts, place: ep, seq: e.seq || 0 }, placed = setPlace(it, p, p.kind === 'ink' ? [0, 0] : [p.pos[0], p.pos[1]], s);
  if (p.kind === 'move' || !newerStamp(it.created, ts, ep)) return placed;   // content: its place and frame are facts of their own, from any content line (an older one's place loses; the frame it says stands until a newer line says one); the content takes the creation's stamp
  it.kind = p.kind; it.by = seat; it.page = p.page; it.created = { ...s };
  const keep = (...fields) => Object.fromEntries(fields.filter(f => p[f] !== undefined).map(f => [f, p[f]]));
  it.content = keep(...CONTENT_FIELDS[p.kind]);
  if (!page.n) page.n = 0; page.n++;
  return true;
}

/** after(a, b): stamp a is at or past stamp b: by ts, then the greater place, then the chain's seq (two lines of one origin in the same ms). */
export const after = (a, b) => a.ts > b.ts || (a.ts === b.ts && (a.place > b.place || (a.place === b.place && (a.seq || 0) >= (b.seq || 0))));

/** shown(doc, item): the item stands on its page: it has content, no erase at or past its creation, and no clear of its page at or past it. */
export function shown(doc, it) {
  if (!it || !it.content || !it.created) return false;
  if (it.gone && after(it.gone, it.created)) return false;
  const c = doc.pages[it.page] && doc.pages[it.page].cleared;
  return !(c && after(c, it.created));
}

/** itemsOf(doc, page?): the items a glass draws, in the order of their stamps (the same on every glass), one page or every page. */
export function itemsOf(doc, page) {
  return Object.values(doc.items).filter(it => (!page || it.page === page) && shown(doc, it))
    .sort((a, b) => a.created.ts - b.created.ts || (a.created.place < b.created.place ? -1 : a.created.place > b.created.place ? 1 : 0) || (a.created.seq || 0) - (b.created.seq || 0) || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));   // the stamp, the place, then the chain's seq (two marks of one drawing in one ms keep their order), then the id
}

/** summaryOf(doc, by?): the counts a reader wants without the whole fold, and the ids of one author's standing items when `by` is given. */
export function summaryOf(doc, by) {
  const shown = itemsOf(doc), authors = {};
  for (const it of shown) authors[it.by] = (authors[it.by] || 0) + 1;
  return { canvas: doc.canvas, items: Object.keys(doc.items).length, shown: shown.length, pages: Object.keys(doc.pages).length, ops: doc.ops, ts: doc.ts, seq: doc.seq, authors, ...(by ? { by, ids: shown.filter(it => it.by === by).map(it => it.id) } : {}) };
}

/** foldCanvas(ops, canvas, place?): the fold of a whole list of entries (a keyframe's replay, a test), from nothing. */
export function foldCanvas(ops, canvas, place = '') { const doc = emptyCanvas(canvas); for (const e of ops) foldCanvasOp(doc, e, place); return doc; }

/** itemId(seat, n): the author's own id for a new item, the live line's `item`. */
export const itemId = (seat, n) => `${seat}:${n}`;
