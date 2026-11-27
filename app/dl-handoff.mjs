// dl-handoff.mjs: NEFERTITI STEPS OUT OF THE MAC (Oct 22 2026), the law the page and the phone (harmony-clip/) share. His words, 18:0x WEST: "see
// this webpage where she is has a particular combination of distances of polyehdrons angles unit1s etc? it almost look like a qr code if you are able
// to encode some planarity to it... so that the phone would recognize the plane on which the nefertiti is and at which distance it is... the goal is to
// magically move nefertiti from floating there straight into the phone in AR... like as if she disappears from the mac and appears into the AR of the
// iOS like syncrhonously"; "looks to me the app clip is what we need?".
// HER CARD: she sits on her Lyssajudron (dl-lyssajudron-body.mjs, still at CARD.body.t) on her team's Claw Riders poster (THE POSTERS, below), painted
// over the whole of it so a camera can hold its plane, its distance and its size (ARKit image tracking). The page shows the card (her perch, and her own
// sprite laid over it at CARD.her) and the phone carries the same pixels (assets/her-card.png, made by tools/her-card.mjs). The phone lays her over
// herself on the Mac, the page dissolves her there, and she walks out of the screen.
// THE HANDOFF JOINS THE ONENESS (his Oct 22 2026 20:2x WEST order: "align the app he has been working on to make it aligned with the synced motioncapped
// music monolith of computational truth"; CLAUDE.md THE MUSIC FIELD, C-2, C-3). Until this file the crossing was a side channel (the dev server's Wi-Fi
// door, the phone's own ARKit world, the page acting on a message's arrival): nothing of it on the Nest, in the Station or on the one clock. Now:
//   THE CARD IS A MARKER IN THE TWIN. The Mac's glass is a placed screen of the scene (scene/entities/<glass>: position, yaw, size_m); the card sits on
//   it at a place the page measures (cardPlace: its rect as a share of the viewport, carried in the code as c=), so the card's centre, axes and real
//   width in the Station follow (cardFrame). The phone's hold of the card (ARKit's image anchor: the card's plane and distance, its width the one the
//   law gives) is a sighting of a placed glass, and the phone's world joins the Station by it (cardJoin: the house's one-code law, HordeJoin.from in
//   the Viewer: both worlds gravity-aligned, one yaw from the headings of the normal and the right, one translation; toStation).
//   HER CROSSING IS ON THE NEST. The phone says her two words as signed entries of kind WORD_TYPE on the house's Nest, each stamped with the station's
//   count (the module's count door, the same nexus bytes the Viewer runs: NexusLaw.swift, shared by path) and its reading in house ms; `landed` carries
//   where she stands in the Station (place, metres), the phone's world and its join, and where the phone's eye stood (eye: p, f in the Station). The
//   page hears the words on the Nest's own stream and acts at the stamp, never on the message's arrival: the phone names the instant LEAD_MS ahead of
//   its stamp and both glasses take it from the same count (instantOf: the page's local time by its offset to the house clock, offsetOf; the phone's by
//   the module's nexus_host_at). No dev-server door, no second clock, no rule of the page's own.
//   WITHOUT A HOUSE (the App Clip's public address, no n= in the code) there is no field: she steps out on the phone alone and no word is said.
//   HER CARD IS THE PICK'S (Nov 2 2026, after THE WARDEN IS PICKED; his Nov 1 23:10 UTC "assume that everything was built for a general png or whatever,
//   then replace those general values with neferittis' ones"): in the house the card is the one the account's pick made (character/warden's card: its sprite,
//   perch and card by sha256, made at the pick by tools/her-card.mjs makeCard and laid beside the page), and the code names the two pictures the phone needs
//   (k=, the card ARKit holds; h=, the sprite she walks out as), which it reads through the house's road and checks by their hash. No pick, or a picture the
//   page could not read: the product's card (assets/her-card.png, her art's), on both glasses.
// Pure: no page, no fetch.
// THE POSTERS (Nov 2 2026, his "wtf dude? that is not the clawriders posters wtf are you doing?" at 00:45 UTC over THE PLATE, a black card with CLAW RIDERS
// in small Bodoni, after "consider also the claw riders stuff please" and "the posters propagand claw riders" at 00:08; then "this one is best" at 01:13 UTC
// over the mock of her on each poster): her card is her team's Claw Riders poster, his Sept 14 painting without its hero (tools/her-card.mjs TEAMS, 2:3 as
// the posters are), her Lyssajudron and her face standing where the hero stood, her Lyssajudron's last pixel above the poster's painted call (motto).
export const CARD = Object.freeze({
  width: 480, height: 720,   // the card's own pixels (assets/her-card.png), the posters' 2:3; shown on the page at a whole multiple, image-rendering: pixelated
  her: Object.freeze({x: 83, y: 82, w: 314, h: 320, fade: 0.76}),   // her sprite (assets/her-sprite.png: athena.png, her file's old name, at 1:1), perched as the page perches
  // her: 0.9 of her over her Lyssajudron's crown, and from `fade` of her height down she thins away as the page's mask fades her (dithered: hard pixels)
  body: Object.freeze({x: 15, y: 241, scale: 3, t: 1.3}),   // her Lyssajudron's 150 px drawing at three times its size, still at t seconds (eye open, no blink)
  motto: Object.freeze({y: 604}),   // THE POSTERS: where the poster's painted call begins on the three plates (JOIN THE RIDERS the highest)
  physical_m: 0.1,   // the phone's first guess of the card's width on a screen in meters, for a code that names no glass; the law's width wins when it does
});
export const CLIP_URL = 'https://optimism.fit/clip';   // the App Clip's address (a Local Experience on his iPhone while it is built)
export const APP_URL = 'dysonlight://clip';   // DysonLight's own scheme: the phone's camera opens the full app from the code
export const WORDS = Object.freeze(['caught', 'landed']);
export const WORD_TYPE = 'her.handoff';   // the Nest entry kind her crossing is said in (the phone writes it signed; the page reads it on /nest/stream?types=)
export const LEAD_MS = 400;   // the phone names the instant this far ahead of its stamp: the Nest's stream and the page's ear fit inside it, and both act at the instant
export const PLACE_MILLE = 1000;   // the card's place on the glass in parts per mille of the viewport
export const KEEP_KEY = 'dyson-handoff-v1', ROUND_MAX = 9999;   // the page's keeping of her round (localStorage)

const roundOf = (r) => (Number.isInteger(r) && r >= 1 && r <= ROUND_MAX ? r : 1);
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const v3 = (a) => (Array.isArray(a) && a.length === 3 && a.every(fin) ? a.slice() : null);
const add = (a, b, k = 1) => [a[0] + b[0] * k, a[1] + b[1] * k, a[2] + b[2] * k];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const unit = (a) => { const n = Math.hypot(a[0], a[1], a[2]); return n > 1e-9 ? [a[0] / n, a[1] / n, a[2] / n] : null; };
const angleDeg = (a, b) => Math.acos(Math.max(-1, Math.min(1, dot(a, b) / (Math.hypot(...a) * Math.hypot(...b))))) * 180 / Math.PI;
const WORLD_RE = /^[A-Za-z0-9_-]{1,64}$/, HEX64 = /^[0-9a-f]{64}$/;

// ---- the code ----
/** clipLink(visit, house, base, round): the address the page's code carries (base: the clip's, or DysonLight's scheme): the visit, her round and, in the
 *  house, the Nest (n=host:port, where the phone writes her words), the glass the card is on (g=seat) and the card's place on it (c=x,y,w,h, cardPlace); and
 *  when the page shows the account's own card (HER CARD IS THE PICK'S: house.picked = {card, sprite}), its picture and her sprite by sha256 (k=, h=). */
export function clipLink(visit, house = null, base = CLIP_URL, round = 1) {
  const url = new URL(base);
  url.searchParams.set('s', String(visit));
  url.searchParams.set('r', String(roundOf(round)));
  if (house?.nest) url.searchParams.set('n', String(house.nest).replace(/^https?:\/\//, '').replace(/\/+$/, ''));
  if (house?.glass) url.searchParams.set('g', String(house.glass));
  if (house?.card) url.searchParams.set('c', placeText(house.card));
  const picked = house?.picked;
  if (picked && HEX64.test(picked.card) && HEX64.test(picked.sprite)) { url.searchParams.set('k', picked.card); url.searchParams.set('h', picked.sprite); }
  return url.href;
}

// ---- the card on the glass ----
/** cardPlace(rect, view): the card's place on the glass as a share of the viewport in parts per mille ({x, y, w, h}, origin top-left), from its css
 *  rect and the viewport's css size: the page is the glass's whole picture (a glass page runs full screen). Pure. */
export function cardPlace(rect, view) {
  if (!rect || !view || !(view.w > 0) || !(view.h > 0)) return null;
  const m = (v, d) => Math.max(0, Math.min(PLACE_MILLE, Math.round((v / d) * PLACE_MILLE)));
  return {x: m(rect.x ?? rect.left, view.w), y: m(rect.y ?? rect.top, view.h), w: m(rect.width ?? rect.w, view.w), h: m(rect.height ?? rect.h, view.h)};
}
/** placeText(place): the code's c= (x,y,w,h per mille). */
export function placeText(p) { return [p.x, p.y, p.w, p.h].map((v) => Math.round(v)).join(','); }
/** placeOf(text): a place from the code's c=, or null when it is not one. */
export function placeOf(text) {
  const n = String(text ?? '').split(',').map(Number);
  if (n.length !== 4 || !n.every((v) => Number.isInteger(v) && v >= 0 && v <= PLACE_MILLE) || !(n[2] > 0) || !(n[3] > 0)) return null;
  return {x: n[0], y: n[1], w: n[2], h: n[3]};
}
/** glassAxes(entity): a placed screen's centre, axes and size from its scene entity: its sighting's right and up when it carries them, else its yaw
 *  (the house's own: room/twin.mjs axesOf, lib/projector-room.mjs screenQuad: right [cos yaw, 0, -sin yaw], up [0, 1, 0], the normal toward the
 *  room [sin yaw, 0, cos yaw]); null for an entity with no position or size. */
export function glassAxes(entity) {
  const c = v3(entity?.transform?.position), size = Array.isArray(entity?.size_m) ? entity.size_m : entity?.representation?.size_m;
  if (!c || !Array.isArray(size) || !(size[0] > 0) || !(size[1] > 0)) return null;
  let right = v3(entity.sighting?.right) && unit(entity.sighting.right), up = v3(entity.sighting?.up) && unit(entity.sighting.up);
  if (!right || !up) { const y = fin(entity.transform?.yaw) ? entity.transform.yaw : 0; right = [Math.cos(y), 0, -Math.sin(y)]; up = [0, 1, 0]; }
  const normal = unit([right[1] * up[2] - right[2] * up[1], right[2] * up[0] - right[0] * up[2], right[0] * up[1] - right[1] * up[0]]);
  if (!normal) return null;
  return {c, right, up, normal, size: [size[0], size[1]]};
}
/** cardFrame(entity, place): the card's frame in the Station: its centre, right, up and normal (toward the room), its real width (side_m) and size,
 *  from the glass's entity and the card's place on it (per mille of the glass's picture); null when either is not one. */
export function cardFrame(entity, place) {
  const g = glassAxes(entity);
  if (!g || !place || !(place.w > 0) || !(place.h > 0)) return null;
  const [W, H] = g.size, k = PLACE_MILLE;
  const dx = ((place.x + place.w / 2) / k - 0.5) * W, dy = (0.5 - (place.y + place.h / 2) / k) * H;
  return {centre: add(add(g.c, g.right, dx), g.up, dy), right: g.right, up: g.up, normal: g.normal, side_m: (place.w / k) * W, size_m: [(place.w / k) * W, (place.h / k) * H]};
}

// ---- the join ----
/** cardJoin(world, station): the Station from the phone's world by the card seen here (world: {centre, right, normal} in the phone's world) and
 *  placed there (station: cardFrame): the house's one-code law (the Viewer's HordeJoin.from): both worlds are gravity-aligned, so one yaw (the
 *  circular mean of the normal's and the right's turn, the short way round) and one translation (the card's centre); R row-major (9), t (3),
 *  the residual the larger of the two axes' misfit after the turn, degrees. null when the axes disagree on the turn (a card seen edge-on). */
export function cardJoin(world, station) {
  const wc = v3(world?.centre), wr = v3(world?.right) && unit(world.right), wn = v3(world?.normal) && unit(world.normal);
  const sc = v3(station?.centre), sr = v3(station?.right) && unit(station.right), sn = v3(station?.normal) && unit(station.normal);
  if (!wc || !wr || !wn || !sc || !sr || !sn) return null;
  for (const v of [wn, wr, sn, sr]) if (Math.hypot(v[0], v[2]) < 1e-3) return null;   // an axis with no heading (a card lying flat, or seen on edge): no turn to read
  const heading = (v) => Math.atan2(v[0], v[2]);
  let sx = 0, sy = 0;
  for (const [st, w] of [[sn, wn], [sr, wr]]) { const d = heading(st) - heading(w), a = Math.atan2(Math.sin(d), Math.cos(d)); sx += Math.cos(a); sy += Math.sin(a); }
  if (Math.hypot(sx, sy) <= 1e-6) return null;
  const yaw = Math.atan2(sy, sx), c = Math.cos(yaw), s = Math.sin(yaw);
  const R = [c, 0, s, 0, 1, 0, 0 - s, 0, c];   // R_y(yaw): a world vector turned by yaw about +y (heading atan2(x, z) grows by yaw); 0 - s: never a -0 on the wire
  const turn = (v) => [R[0] * v[0] + R[1] * v[1] + R[2] * v[2], R[3] * v[0] + R[4] * v[1] + R[5] * v[2], R[6] * v[0] + R[7] * v[1] + R[8] * v[2]];
  const t = add(sc, turn(wc), -1);
  if (!t.every(fin)) return null;
  return {R, t, yaw, residual_deg: Math.max(angleDeg(turn(wr), sr), angleDeg(turn(wn), sn))};
}
/** toStation(join, p): a point of the phone's world in the Station (R p + t); null for no join. */
export function toStation(join, p) {
  const R = join?.R, t = v3(join?.t), q = v3(p);
  if (!Array.isArray(R) || R.length !== 9 || !R.every(fin) || !t || !q) return null;
  return [R[0] * q[0] + R[1] * q[1] + R[2] * q[2] + t[0], R[3] * q[0] + R[4] * q[1] + R[5] * q[2] + t[1], R[6] * q[0] + R[7] * q[1] + R[8] * q[2] + t[2]];
}
/** joinOf(x): a join as a word carries it ({R, t, yaw?, residual_deg?}), or null when it is not one. */
export function joinOf(x) {
  const R = Array.isArray(x?.R) && x.R.length === 9 && x.R.every(fin) ? x.R.slice() : null, t = v3(x?.t);
  if (!R || !t) return null;
  const j = {R, t};
  if (fin(x.yaw)) j.yaw = x.yaw;
  if (fin(x.residual_deg)) j.residual_deg = x.residual_deg;
  return j;
}

// ---- the words ----
/** wordOf(body, isVisit): the phone's word as the Nest carries it ({visit, event, round, count, at_ms; landed: place, world, join?, eye?}) when it is
 *  one, else null: no count or no house instant, no word (the one clock). isVisit: the visit id's law (harmony-link.mjs isVisitId). */
export function wordOf(body, isVisit) {
  if (!body || typeof body !== 'object' || !WORDS.includes(body.event) || !isVisit(body.visit)) return null;
  if (!fin(body.count) || body.count < 0 || !fin(body.at_ms) || !(body.at_ms > 0)) return null;
  const w = {visit: body.visit, event: body.event, round: roundOf(body.round), count: body.count, at_ms: body.at_ms};
  if (body.event === 'landed') {
    const place = v3(body.place);
    if (!place || typeof body.world !== 'string' || !WORLD_RE.test(body.world)) return null;
    w.place = place; w.world = body.world;
    const join = joinOf(body.join); if (join) w.join = join;
    const eye = body.eye && v3(body.eye.p) && v3(body.eye.f) ? {p: v3(body.eye.p), f: v3(body.eye.f)} : null; if (eye) w.eye = eye;
  }
  return w;
}
/** offsetOf(server_ms, t0, t1): the house clock less this page's, from one read of the Nest's head that left at t0 and came back at t1 (local ms):
 *  the Mac's ms stands at the trip's middle. */
export function offsetOf(server_ms, t0, t1) { return fin(server_ms) && fin(t0) && fin(t1) && t1 >= t0 ? server_ms - (t0 + t1) / 2 : null; }
/** instantOf(word, offset_ms): the local ms at which the page acts on a word: its house instant less the offset; null without an offset. */
export function instantOf(word, offset_ms) { return fin(word?.at_ms) && fin(offset_ms) ? word.at_ms - offset_ms : null; }
/** keptOf(raw, visit): her round on this visit's page and whether she has left in it ({round, left}), from KEEP_KEY's stored string. Pure. */
export function keptOf(raw, visit) {
  try {
    const k = JSON.parse(raw);
    if (k && k.visit === visit) return {round: roundOf(k.round), left: k.left === true};
  } catch { /* none kept, or not ours */ }
  return {round: 1, left: false};
}
