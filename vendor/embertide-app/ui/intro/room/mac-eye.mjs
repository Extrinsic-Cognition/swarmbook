// mac-eye.mjs - YOUR HEAD MOVES THE WINDOW: this Mac's own camera as the eye of the well on its screen (Oct 14 2026 10:xx WEST, lane unboxing-in-3d).
// His words over the unboxing, 10:0x: "right now on lysa there is a depth effect. Depth box. I fucking said that I needed the camera permission because
// there were going to be depth fucking things"; THE BOX's, 08:2x: "WHEN THEY DECIDE TO OPEN THE BOX WE ASK THE FUCKING DEPTH SENSING".
// The well (well.mjs) draws the inside of a glass by the off-axis frustum from an eye (well-law.mjs windowOf). On lysa the eye is the phone that placed the
// glass, else a head 55 cm before a laptop nobody measured (EYE_FRONT); on the Mac's card it was always that guess. This Mac has a camera above its screen,
// and the Eye (embertide-eye) posts his body from it to the Nest at capture (wind.body: the 17 joints in mm in the camera's own frame, x the picture's
// right, y up, z away from the camera: scene-program.mjs eyesOf; frame 'eye:<seat>'). So the card's eye is his head, measured: his centerHead put in the
// card's own axes through where the camera stands against the card on the screen, in shares of the card's height (every length of the well is a share of
// its glass's height, so the picture is true at the well's own 0.173 m whatever size the card has on this screen).
// THE GEOMETRY, its priors said as priors: the card's rectangle on the screen from the page (getBoundingClientRect, the window's screenX and screenY and its
// title bar, outerHeight - innerHeight), MM_PER_PX of a Retina MacBook at its default scale (302.4 mm over 1512 px on the 14-inch, 344.9 over 1728 on the
// 16-inch), the camera at the screen's top centre CAMERA_PX below its top edge (in the notch's band). A window on another display is not under this camera.
// NOISE: a head that moved less than NOISE_M since the last word handed is no new word (the house's measured eye noise, lysa's mirror Oct 10: 12 mm), so a
// still head rests the well; while he stays the same word is handed again every KEEP_MS (it stays fresh and wakes nothing); nobody seen, nothing comes (the
// Eye posts nothing then) and the word goes stale after FRESH_MS (onHead(null): the eye glides back).
// Pure, but follow(): one NestSource on the window's one connection (nest-hub.mjs), wind.body of this Mac's eye alone (seats=wind.body:<seat>), opened when
// a page starts following (his press on the box, Depth Sensing on) and closed by stop(): nothing before the press, nothing after the page lets go.
// THE ANCHOR IS HIS BODY, NOT HIS HEAD (his Oct 10 2026 21:0x word over the portals: "NOT ANCHORED TO MY FACE/HEAD but rather anchored to the direction of my
// body"; the TV portal's law, lib/portal-glass.js THE WINDOW'S ANCHOR): the eye is taken from his shoulders' centre lifted LIFT_M to his eyes' height, so a turn
// or a nod of his head moves nothing and his body leaning moves the window; his head (centerHead, else topHead lowered) only when his shoulders are not in the body.
// The portal carries its eye 0.8 m on along his facing, for a TV across the room; at arm's length the window's eye is where his eyes are: no carry here.
export const MM_PER_PX = 0.2, CAMERA_PX = 15, NOISE_M = 0.012, KEEP_MS = 1000, FRESH_MS = 2000, HEAD_DROP_M = 0.09, LIFT_M = 0.12, SHOULDERS_MIN_M = 0.15;
const fin = (v) => typeof v === 'number' && Number.isFinite(v);

/** headOf(payload): where his eyes are taken from, in the camera's own frame, metres [x, y, z], from a wind.body payload: his shoulders' centre (joints 3 and 4,
 *  at least SHOULDERS_MIN_M apart, else joint 2 centerShoulder) lifted LIFT_M; else his centerHead (joint 1); else his topHead (joint 0) lowered HEAD_DROP_M;
 *  null when none was seen. */
export function headOf(p) {
  const j = p && Array.isArray(p.j) ? p.j : null; if (!j || j.length < 6) return null;
  const at = (i) => { const v = [j[3 * i], j[3 * i + 1], j[3 * i + 2]]; return v.every(fin) ? v.map((x) => x / 1000) : null; };
  const L = at(3), R = at(4), C = at(2), lift = (v) => [v[0], v[1] + LIFT_M, v[2]];
  if (L && R && Math.hypot(L[0] - R[0], L[1] - R[1], L[2] - R[2]) >= SHOULDERS_MIN_M) return lift([(L[0] + R[0]) / 2, (L[1] + R[1]) / 2, (L[2] + R[2]) / 2]);
  if (C) return lift(C);
  const c = at(1); if (c) return c;
  const t = at(0); return t ? [t[0], t[1] - HEAD_DROP_M, t[2]] : null;
}
/** cardOf({rect, screenW, screenX, screenY, chromeY, mmPerPx, cameraPx}): where this Mac's camera stands against a card of its screen, in the card's own
 *  axes (metres from the card's centre: x right, y up, z out toward him), and the card's height in metres; null for a card with no size. */
export function cardOf({ rect, screenW, screenX = 0, screenY = 0, chromeY = 0, mmPerPx = MM_PER_PX, cameraPx = CAMERA_PX } = {}) {
  if (!rect || !(rect.height > 0) || !(rect.width > 0) || !(screenW > 0) || !fin(rect.left) || !fin(rect.top)) return null;
  const m = mmPerPx / 1000, cx = screenX + rect.left + rect.width / 2, cy = screenY + chromeY + rect.top + rect.height / 2;
  return { cam: [(screenW / 2 - cx) * m, (cy - cameraPx) * m, 0], h_m: rect.height * m };
}
/** eyeOf(head, card): his head in the card's own axes, in shares of the card's height ([x, y, z], z > 0 before the glass), or null. The camera's frame: x its
 *  picture's right (his left as he faces it), y up, z away from it; the card's: x right, y up, z out toward him. */
export function eyeOf(head, card) {
  if (!Array.isArray(head) || head.length !== 3 || !head.every(fin) || !card || !(card.h_m > 0)) return null;
  const e = [card.cam[0] - head[0], card.cam[1] + head[1], card.cam[2] + head[2]];
  return e[2] > 0 ? e.map((v) => v / card.h_m) : null;
}
/** moved(prev, next, h_m, noise): whether next is a new word against prev (shares of a card h_m tall): none before, none now, or past the noise in metres. */
export function moved(prev, next, h_m, noise = NOISE_M) {
  if (!prev || !next) return prev !== next;
  return Math.hypot((next[0] - prev[0]) * h_m, (next[1] - prev[1]) * h_m, (next[2] - prev[2]) * h_m) > noise;
}

/** follow({Source, nest, seat, card, onHead, win, now}): his head off the window's one connection while it stands. onHead({u, from, tick}) on a new word
 *  (past the noise) and again with the same u every KEEP_MS while he is seen; onHead(null) FRESH_MS after the last body. -> {state(), stop()}, or null. */
export function follow({ Source, nest, seat, card, onHead, win = globalThis, now = () => win.performance.now() } = {}) {
  if (typeof Source !== 'function' || !/^[\w.-]{1,32}$/.test(String(seat || '')) || typeof card !== 'function' || typeof onHead !== 'function') return null;
  const S = { lines: 0, heads: 0, handed: 0, kept: 0, last: null, lastAt: -Infinity, why: 'nobody seen yet', stale: 0, src: null };
  const from = `your body, by this Mac's camera (the Eye, ${seat}): your shoulders lifted to your eyes, your head when they are not seen`;
  function stale() { S.stale = 0; if (!S.last) return; S.last = null; S.why = `nobody seen for ${FRESH_MS} ms`; onHead(null); }
  S.src = new Source(`${String(nest || '').replace(/\/$/, '')}/nest/stream?types=wind.body&seats=wind.body:${encodeURIComponent(seat)}`);
  S.src.onmessage = (m) => {
    let e = null; try { e = m && (m.entry || JSON.parse(m.data)); } catch { return; }
    if (!e || e.type !== 'wind.body' || e.seat !== seat) return; S.lines++;
    const head = headOf(e.payload), c = card(), u = head && c ? eyeOf(head, c) : null;
    if (!u) { S.why = !head ? 'no head in the body' : !c ? 'the card has no size' : 'the head is not before the glass'; return; }
    S.heads++; if (S.stale) win.clearTimeout(S.stale); S.stale = win.setTimeout(stale, FRESH_MS);
    const t = now(), tick = e.payload && fin(e.payload.tick) ? e.payload.tick : null;
    if (!moved(S.last, u, c.h_m)) { if (t - S.lastAt >= KEEP_MS) { S.lastAt = t; S.kept++; onHead({ u: S.last, from, tick }); } return; }   // still: the same word, kept fresh
    S.last = u; S.lastAt = t; S.handed++; S.why = null; onHead({ u, from, tick });
  };
  return {
    state: () => ({ seat, lines: S.lines, heads: S.heads, handed: S.handed, kept: S.kept, u: S.last ? S.last.map((v) => Math.round(v * 1000) / 1000) : null, why: S.why }),
    stop() { try { S.src?.close(); } catch { /* gone */ } if (S.stale) win.clearTimeout(S.stale); S.stale = 0; S.src = null; },
  };
}
