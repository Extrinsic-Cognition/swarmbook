#!/usr/bin/env node
// harleyquintiti-mod.mjs · HARLEYQUINTITI, MODDED FROM SAORI'S OWN BODY (Oct 24 2026 21:xx WEST, lane/harleyquintiti-mod). His words, WEST: 21:0x, over
// her pixel sheet and Saori's four views: "look how she look like a nun, bro u gotta edit the model to make her mod like it is her descendant nefertiti the
// nestal nymph"; Oct 22 17:29 "nefertiti is the harley quinn there and she is a nestal nymph descendant of athena"; 17:07 "think like athena platinum". Her
// lineage: ec-workspace docs/harleyquintiti-nefertiti-athena-hypertrace-2026-10-24.md; her look: girl-sprite.mjs and the mint's her-card, his pixel sheet.
// WHAT IT DOES. Athena's figure is built from the disc's own chunks as hades-glb.mjs builds lab/athena.hades.glb (athena() gives those bytes, the test checks
// it), then modded, deterministic, nothing drawn by hand:
//   the stance   the sprite's (HQ_STANCE, measured by seat db3c3e4b): her right hand up before her shoulder with the apple, her left on her hip, chin up
//   the face     face 4 (wide eyes) on her map, faces 2 (laughing) and 5 (closed) beside it; blue eyes, the diamond under her left eye, a grin
//   the hair     platinum with lavender roots; the back hair gathered (its chains' lower joints drawn in, HAIR_GATHER); two pigtails on the head, tipped
//                pink on her right and ice blue on her left, ice clips at their roots; the long locks tinted the same by side (their own UV islands,
//                since her UVs mirror left and right)
//   the circlet  platinum round her brow, an ice crystal at its front
//   the chiton   the gown drawn up above her knee (HEM_Y) and its flare tucked (HEM_TUCK), frost on it, an ice trim at the hem; legs and gold
//                sandal straps under it (the disc's figure has none: the gown met the floor)
//   the apple    golden, honeycombed, in her right hand
// The map grows to 1024 x 512: the disc's 512 x 512 on the left (its UVs halved), the mod's islands on the right (ISLANDS). Every added part is skinned
// to one joint (head, right hand, lower body), so any page that skins her carries it.
//   node tools/harleyquintiti-mod.mjs [--disc assets/native-source] [--out lab/harleyquintiti.hades.glb] [--sheet <png: front, side, back, three quarters>]
// COST: one build from the disc (about 0.3 s), three 1024 x 512 maps painted (about 1 s), about 3,000 vertices added; nothing at rest, nothing on a glass.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { lzss, fjf, readGmi, firstKeys, tim, palette, paint, png, build, glb } from './hades-glb.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url)), SITE = path.resolve(HERE, '..');
export const DISC = path.join(SITE, 'assets', 'native-source'), OUT = path.join(SITE, 'lab', 'harleyquintiti.hades.glb');
export const ATHENA_STANCE = path.join(SITE, 'lab', 'athena.hades.stance.json');
export const HQ_STANCE = Object.freeze({ h_jnt_ruarm: [0, 62, -25], h_jnt_rlarm: [0, 0, -115], h_jnt_luarm: [0, -50, 0], h_jnt_llarm: [0, -60, 0], h_jnt_head: [0, 8, -4] });
export const FACE = 4, FACES = Object.freeze([2, 5]);       // her map's face (wide eyes); the faces beside it (laughing, closed)
export const HAIR_GATHER = 0.8;                               // a choice: the share of their length the back hair's lower links keep (to mid back)
export const HEM_Y = 0.6, HEM_TUCK = 0.25, HEM_FLARE = 0.24;  // a choice: the chiton's hem height (metres, as she stands), the share of its flare it loses
                                                              // there, and the widest it falls (its train and bell eased under it, never cut)
export const HAIR_BACK = Object.freeze([[15, 16, 17], [18, 19, 20], [21, 22, 23], [24, 25, 26], [27, 28, 29], [30, 31, 32], [33, 34, 35]]);
export const TONE = Object.freeze({ root: [214, 196, 250], hair: [255, 255, 255], pink: [255, 128, 196], ice: [110, 196, 255], frost: [120, 186, 248],
  frostDeep: [70, 120, 215], gold: [242, 190, 40], goldDeep: [214, 156, 26], goldLight: [255, 228, 124], metal: [226, 230, 240], crystal: [206, 240, 255],
  blue: [52, 104, 255] });
const unwrap = (b) => b.toString('latin1', 0, 4) === 'CMPS' ? lzss(b) : b;

/** disc(dir): her chunks read as hades-glb.mjs reads them -> { body, hair, motion, pic, faces, pal } */
export function disc(dir = DISC) {
  const rd = (n) => unwrap(fs.readFileSync(path.join(dir, n)));
  const [pic] = tim(fjf(rd('tex-e00.tpl'))[0]), faces = fjf(rd('tex-e00_face.tpl')).map((e) => tim(e)[0]);
  return { body: readGmi(rd('e00.gmi')), hair: readGmi(rd('e00h.gmi')), motion: firstKeys(unwrap(fjf(rd('me00.mpl'))[0])), pic, faces, pal: palette(pic.clut) };
}

/** athena(d): lab/athena.hades.glb as hades-glb.mjs makes it (its stance file, face 3, faces 0 and 5): the base this mod starts from, byte for byte. */
export function athena(d = disc()) {
  const fig = build({ body: d.body, hair: d.hair, motion: d.motion, stance: JSON.parse(fs.readFileSync(ATHENA_STANCE, 'utf8')), height: 1.6 });
  const extras = Object.fromEntries([0, 5].map((k) => [`face${k}`, png(d.pic.w, d.pic.h, paint(d.pic, d.pal, d.faces[k]))]));
  return glb(fig, png(d.pic.w, d.pic.h, paint(d.pic, d.pal, d.faces[3])), { name: 'athena', extras });
}

/* ---- 4 x 4, rows (m[4 * row + col]), as hades-glb.mjs keeps them ---- */
const mm = (a, b) => { const o = new Array(16).fill(0); for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) for (let k = 0; k < 4; k++) o[4 * r + c] += a[4 * r + k] * b[4 * k + c]; return o; };
const ap = (m, [x, y, z], w = 1) => [0, 1, 2].map((r) => m[4 * r] * x + m[4 * r + 1] * y + m[4 * r + 2] * z + m[4 * r + 3] * w);
const inv = (m) => {   // a general 4 x 4 inverse (the skin matrices carry the root's scale)
  const a = m.slice(), o = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
  for (let c = 0; c < 4; c++) {
    let p = c; for (let r = c + 1; r < 4; r++) if (Math.abs(a[4 * r + c]) > Math.abs(a[4 * p + c])) p = r;
    for (let k = 0; k < 4; k++) { [a[4 * c + k], a[4 * p + k]] = [a[4 * p + k], a[4 * c + k]]; [o[4 * c + k], o[4 * p + k]] = [o[4 * p + k], o[4 * c + k]]; }
    const d = a[4 * c + c]; for (let k = 0; k < 4; k++) { a[4 * c + k] /= d; o[4 * c + k] /= d; }
    for (let r = 0; r < 4; r++) if (r !== c) { const f = a[4 * r + c]; for (let k = 0; k < 4; k++) { a[4 * r + k] -= f * a[4 * c + k]; o[4 * r + k] -= f * o[4 * c + k]; } }
  }
  return o;
};
const nodeMatrix = ({ translation: t, rotation: [x, y, z, w], scale }) => {
  const s = scale ? scale[0] : 1;
  return [(1 - 2 * (y * y + z * z)) * s, 2 * (x * y - z * w) * s, 2 * (x * z + y * w) * s, t[0], 2 * (x * y + z * w) * s, (1 - 2 * (x * x + z * z)) * s, 2 * (y * z - x * w) * s, t[1],
    2 * (x * z - y * w) * s, 2 * (y * z + x * w) * s, (1 - 2 * (x * x + y * y)) * s, t[2], 0, 0, 0, 1];
};
/** skins(fig): each joint's skin matrix (its world in the nodes as stored, times its inverse bind): bind -> as she stands */
export function skins(fig) {
  const world = [];
  fig.nodes.forEach((n, k) => { world[k] = n.parent < 0 ? nodeMatrix(n) : mm(world[n.parent], nodeMatrix(n)); });
  return world.map((w, k) => mm(w, fig.inverseBinds[k]));
}
/** stand(fig, S): every vertex as she stands (linear blend of its joints' skin matrices) */
export function stand(fig, S = skins(fig)) {
  const out = new Float64Array(fig.count * 3);
  for (let i = 0; i < fig.count; i++) for (let k = 0; k < 4; k++) {
    const w = fig.weights4[4 * i + k]; if (!w) continue;
    const p = ap(S[fig.joints4[4 * i + k]], [fig.positions[3 * i], fig.positions[3 * i + 1], fig.positions[3 * i + 2]]);
    for (let d = 0; d < 3; d++) out[3 * i + d] += w * p[d];
  }
  return out;
}

/* ---- the map ---- */
export const MAP_W = 1024, MAP_H = 512;
export const ISLANDS = Object.freeze({ hair: [512, 0, 512, 48], pigtailPink: [512, 160, 128, 256], pigtailIce: [640, 160, 128, 256], metal: [768, 160, 64, 64],
  crystal: [832, 160, 64, 64], gold: [896, 160, 128, 128], skin: [768, 288, 128, 128], sandal: [896, 288, 128, 32],
  cloth: [300, 300, 160, 180] });   // [x, y, w, h] pixels; cloth lies in the disc's own gown (left half), frosted with it
const HAIR_ROWS = 48;   // the disc's hair strip: rows 0 to 47 of its map, root at the top, tip at the bottom (hair v falls as the strand goes down)
const clamp = (v, a = 0, b = 255) => Math.max(a, Math.min(b, v));
const mix = (a, b, t) => a.map((v, i) => v + (b[i] - v) * clamp(t, 0, 1));
const rnd = (seed) => () => { seed = (Math.imul(seed ^ (seed >>> 15), 2246822519) + 0x9e3779b9) | 0; return ((seed >>> 0) % 100000) / 100000; };
const put = (m, x, y, c, a = 1) => { if (x < 0 || y < 0 || x >= MAP_W || y >= MAP_H) return; const q = 4 * (y * MAP_W + x); for (let i = 0; i < 3; i++) m[q + i] = Math.round(m[q + i] + (c[i] - m[q + i]) * a); m[q + 3] = 255; };
const get = (m, x, y) => { const q = 4 * (y * MAP_W + x); return [m[q], m[q + 1], m[q + 2]]; };
/** strand(t, tip): a hair's tone at t (0 root, 1 tip): lavender at the root, platinum, then the tip's colour */
const strand = (t, tip) => {   // white as his sheet has her: lavender only at the crown, the tip's colour from the middle of the strand down
  const w = t < 0.26 ? mix(TONE.root, TONE.hair, (t - 0.04) / 0.22) : TONE.hair;
  return tip && t > 0.42 ? mix(w, tip, Math.pow((t - 0.42) / 0.53, 0.8)) : w;
};

/** map(d, face): her 1024 x 512 map with that face: the disc's map on the left, recoloured, the islands on the right */
export function map(d, face) {
  const src = paint(d.pic, d.pal, face == null ? null : d.faces[face]), m = new Uint8Array(MAP_W * MAP_H * 4);
  for (let y = 0; y < 512; y++) m.set(src.subarray(4 * 512 * y, 4 * 512 * (y + 1)), 4 * MAP_W * y);
  // the hair's three islands (white, pink-tipped, ice-tipped): the disc's strip, its streaks kept as light, its colour the strand's
  let lo = 255, hi = 0;
  for (let y = 0; y < HAIR_ROWS; y++) for (let x = 48; x < 256; x++) { const c = get(m, x, y), l = 0.3 * c[0] + 0.59 * c[1] + 0.11 * c[2]; lo = Math.min(lo, l); hi = Math.max(hi, l); }
  [null, TONE.pink, TONE.ice].forEach((tip, k) => {
    for (let y = 0; y < HAIR_ROWS; y++) for (let x = 0; x < 512; x++) {
      const c = get(m, x, y), l = (0.3 * c[0] + 0.59 * c[1] + 0.11 * c[2] - lo) / (hi - lo || 1), shade = 0.92 + 0.08 * clamp(l, 0, 1);
      put(m, 512 + x, k * HAIR_ROWS + y, strand(y / (HAIR_ROWS - 1), tip).map((v) => v * shade));
    }
  });
  // the disc's strip itself, platinum too (a triangle that straddles the hairline still samples it)
  for (let y = 0; y < HAIR_ROWS; y++) for (let x = 48; x < 256; x++) put(m, x, y, get(m, 512 + x, y));
  // the pigtails' strips: across the strand u, along it v; streaks that waver, the tone the strand's
  for (const [key, tip] of [['pigtailPink', TONE.pink], ['pigtailIce', TONE.ice]]) {
    const [x0, y0, w, h] = ISLANDS[key];
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const streak = 0.94 + 0.04 * Math.sin(x * 0.42 + 2.2 * Math.sin(y * 0.045)) + 0.02 * Math.sin(x * 1.7 + y * 0.09);
      put(m, x0 + x, y0 + y, strand(y / (h - 1), tip).map((v) => v * streak));
    }
  }
  // platinum, the ice crystal, the gold of the apple (honeycomb), skin for the legs (the arm's own tone), the sandal's gold
  const fill = (key, f) => { const [x0, y0, w, h] = ISLANDS[key]; for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) put(m, x0 + x, y0 + y, f(x / (w - 1), y / (h - 1), x, y)); };
  fill('metal', (u, v) => mix(TONE.metal, [255, 255, 255], Math.max(0, 1 - Math.abs(v - 0.4) * 4)).map((c) => c * (0.86 + 0.14 * u)));
  fill('crystal', (u, v) => mix(TONE.crystal, [255, 255, 255], Math.max(0, 1 - Math.hypot(u - 0.35, v - 0.3) * 3)));
  fill('gold', (u, v, x, y) => {   // a hexagon's distance from its centre (pointy-top cells of 9 px)
    const s = 9, qx = (x + (Math.floor(y / (s * 1.5)) % 2) * s * 0.866) / (s * 1.732), qy = y / (s * 1.5);
    const fx = qx - Math.floor(qx) - 0.5, fy = qy - Math.floor(qy) - 0.5, edge = Math.max(Math.abs(fx) * 1.1, Math.abs(fy) * 0.9 + Math.abs(fx) * 0.45);
    return mix(mix(TONE.gold, TONE.goldLight, Math.max(0, 0.5 - edge) * 1.8), TONE.goldDeep, edge > 0.46 ? 0.7 : 0);
  });
  const skin = get(m, 300, 214);
  fill('skin', (u, v) => skin.map((c) => c * (0.9 + 0.1 * Math.sin(u * Math.PI))));
  fill('sandal', (u, v) => mix(TONE.gold, [255, 230, 150], Math.max(0, 1 - Math.abs(v - 0.35) * 3)));
  // the eyes blue: the irises' teal turned (the eye band of the face, rows 60 to 112)
  for (let y = 60; y < 112; y++) for (let x = 16; x < 244; x++) {
    const [r, g, b] = get(m, x, y), max = Math.max(r, g, b), min = Math.min(r, g, b);
    if (max - min < 22 || b < r + 12) continue;
    const l = (0.3 * r + 0.59 * g + 0.11 * b) / 255;
    put(m, x, y, mix([18, 40, 120], TONE.blue, l * 1.6).map((c, i) => i === 2 ? clamp(c + 60 * l) : c));
  }
  // the diamond under her left eye (the face's right as the map holds it), ice with a deeper rim
  for (let dy = -4; dy <= 4; dy++) for (let dx = -3; dx <= 3; dx++) {
    const e = Math.abs(dx) / 3 + Math.abs(dy) / 4; if (e > 1) continue;
    put(m, 186 + dx, 120 + dy, e > 0.7 ? TONE.frostDeep : TONE.frost);
  }
  // the grin: the closed lips skinned over, a wide cheeky smile drawn, the teeth's white under the upper lip, the corners lifted
  const cheek = get(m, 128, 172);
  for (let y = 142; y < 166; y++) for (let x = 102; x < 154; x++) { const c = get(m, x, y), rose = c[0] - c[1] > 26 && c[2] > c[1] - 4; if (rose) put(m, x, y, cheek, 0.92); }
  for (let x = 105; x <= 151; x++) {
    const dx = x - 128, up = 150.5 - 0.0075 * dx * dx, down = 158.5 - 0.0185 * dx * dx;
    for (let y = Math.floor(up); y <= Math.ceil(Math.max(up, down)); y++) {
      if (y < up - 0.5) continue;
      const inside = y > up + 0.5 && y < down - 0.5;
      put(m, x, y, inside ? (y < up + 3.2 ? [255, 255, 255] : [160, 56, 78]) : [120, 40, 58], inside ? 1 : 0.92);
    }
  }
  for (const s of [-1, 1]) for (let k = 0; k < 5; k++) put(m, 128 + s * (23 + k), Math.round(148.5 - k * 1.1), [120, 40, 58], 0.85);   // the corners' lift
  // frost on the chiton: on the cloth's white only (bodice, gown, the white band), snowflakes and diamonds on a jittered grid, an ice trim at the hem
  const cloth = (x, y) => { const c = get(m, x, y); return Math.min(...c) > 186 && Math.max(...c) - Math.min(...c) < 34; };
  const flake = (cx, cy, r) => {
    for (let k = 0; k < 6; k++) {
      const a = k * Math.PI / 3, ax = Math.cos(a), ay = Math.sin(a);
      for (let t = 0; t <= r; t++) { const x = Math.round(cx + ax * t), y = Math.round(cy + ay * t); if (cloth(x, y) || t === 0) put(m, x, y, TONE.frost, 0.85); }
      for (const b of [-1, 1]) { const bx = Math.round(cx + ax * r * 0.6 + Math.cos(a + b * 0.8) * 2), by = Math.round(cy + ay * r * 0.6 + Math.sin(a + b * 0.8) * 2); if (cloth(bx, by)) put(m, bx, by, TONE.frost, 0.8); }
    }
  };
  const diamond = (cx, cy) => { for (let dy = -2; dy <= 2; dy++) for (let dx = -1; dx <= 1; dx++) if (Math.abs(dx) + Math.abs(dy) * 0.6 <= 1.3 && cloth(cx + dx, cy + dy)) put(m, cx + dx, cy + dy, TONE.frost, 0.9); };
  const R = rnd(1077);
  for (const [x0, y0, x1, y1] of [[256, 0, 512, 172], [244, 256, 512, 512], [80, 414, 242, 512]]) {
    for (let gy = y0 + 8; gy < y1; gy += 26) for (let gx = x0 + 8; gx < x1; gx += 26) {
      const x = Math.round(gx + (R() - 0.5) * 10), y = Math.round(gy + (R() - 0.5) * 10);
      if (!cloth(x, y)) continue;
      if (R() < 0.55) flake(x, y, 4 + Math.round(R() * 2)); else diamond(x, y);
    }
  }
  for (let x = 246; x < 512; x++) for (let y = 494; y < 508; y++) if (cloth(x, y) || y >= 500) put(m, x, y, y < 499 ? TONE.frost : y < 503 ? TONE.frostDeep : TONE.frost, y < 499 ? 0.35 : 0.9);
  return m;
}

/* ---- geometry: parts built where she stands (posed), stored in bind space through their joint's skin ---- */
/** tube(path, radii, sides, island, {closed, flat}): a tube along a path of points, u round it, v along it -> {p, n, uv, tri} */
function tube(pts, radii, sides, [ix, iy, iw, ih], { closed = false, flat = 1, caps = true } = {}) {
  const p = [], n = [], uv = [], tri = [], N = pts.length;
  const sub = (a, b) => a.map((v, i) => v - b[i]), nrm = (a) => { const l = Math.hypot(...a) || 1; return a.map((v) => v / l); };
  const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  let ref = [0, 0, 1];
  for (let i = 0; i < N; i++) {
    const tng = nrm(sub(pts[closed ? (i + 1) % N : Math.min(N - 1, i + 1)], pts[closed ? (i - 1 + N) % N : Math.max(0, i - 1)]));
    if (Math.abs(tng[0] * ref[0] + tng[1] * ref[1] + tng[2] * ref[2]) > 0.95) ref = [1, 0, 0];
    const a = nrm(cross(tng, ref)), b = nrm(cross(tng, a));
    for (let s = 0; s <= sides; s++) {
      const th = 2 * Math.PI * s / sides, ca = Math.cos(th), sb = Math.sin(th) * flat, d = nrm([a[0] * ca + b[0] * sb, a[1] * ca + b[1] * sb, a[2] * ca + b[2] * sb]);
      p.push(pts[i].map((v, k) => v + radii[i] * (a[k] * Math.cos(th) + b[k] * Math.sin(th) * flat))); n.push(d);
      uv.push([(ix + 0.5 + (iw - 1) * s / sides) / MAP_W, (iy + 0.5 + (ih - 1) * i / (N - 1)) / MAP_H]);
    }
  }
  const row = sides + 1;
  for (let i = 0; i < (closed ? N : N - 1); i++) for (let s = 0; s < sides; s++) {
    const a = i * row + s, b = ((i + 1) % N) * row + s; tri.push([a, a + 1, b], [a + 1, b + 1, b]);   // counter-clockwise seen from outside, where the normals point (a renderer that flips back faces lights her right)
  }
  if (caps && !closed) for (const [i, dir] of [[0, -1], [N - 1, 1]]) {   // a fan to close each end
    const c = p.length; p.push(pts[i]); n.push(nrm(sub(pts[i], pts[i - dir] ?? pts[i]).map((v) => v * 1))); uv.push(uv[i * row]);
    for (let s = 0; s < sides; s++) tri.push(dir < 0 ? [c, i * row + s + 1, i * row + s] : [c, i * row + s, i * row + s + 1]);
  }
  return { p, n, uv, tri };
}
/** gem(centre, size, island): an octahedron, a crystal */
function gem(c, [sx, sy, sz], island) {
  const v = [[sx, 0, 0], [-sx, 0, 0], [0, sy, 0], [0, -sy, 0], [0, 0, sz], [0, 0, -sz]].map((d) => d.map((x, i) => x + c[i]));
  const f = [[0, 2, 4], [2, 1, 4], [1, 3, 4], [3, 0, 4], [2, 0, 5], [1, 2, 5], [3, 1, 5], [0, 3, 5]];
  const p = [], n = [], uv = [], tri = [];
  const [ix, iy, iw, ih] = island;
  for (const [a, b, d] of f) {
    const e1 = v[b].map((x, i) => x - v[a][i]), e2 = v[d].map((x, i) => x - v[a][i]), nn = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]], l = Math.hypot(...nn) || 1;
    const base = p.length; for (const [k, q] of [[a, [0.2, 0.8]], [b, [0.8, 0.8]], [d, [0.5, 0.15]]]) { p.push(v[k]); n.push(nn.map((x) => x / l)); uv.push([(ix + q[0] * iw) / MAP_W, (iy + q[1] * ih) / MAP_H]); }
    tri.push([base, base + 1, base + 2]);
  }
  return { p, n, uv, tri };
}
/** lathe(base, axis profile [[r, h]...], sides, island): a body of revolution standing on base along +y */
const lathe = (base, prof, sides, island) => tube(prof.map(([, h]) => [base[0], base[1] + h, base[2]]), prof.map(([r]) => r), sides, island);

/** mod(d): her figure, modded -> { fig, maps: { main, faces }, report } */
export function mod(d = disc()) {
  const fig = build({ body: d.body, hair: d.hair, motion: d.motion, stance: HQ_STANCE, height: 1.6 });
  const name = fig.nodes.map((nd) => nd.name), at = (n) => name.indexOf(n);
  // the back hair gathered, the gown drawn up: their chains' second and third links shortened in the nodes as stored (the bind stays the disc's)
  for (const chain of HAIR_BACK) for (const k of chain.slice(1)) { const t = fig.nodes[at(`h_jnt_hair${k}`)].translation; for (let i = 0; i < 3; i++) t[i] *= HAIR_GATHER; }
  const S = skins(fig), base = fig.count, posed = stand(fig, S);
  // the gown drawn up into a chiton: each skirt vertex (its weight on the skirt's joints) moved as she stands, down from the waist pressed to HEM_Y and
  // its flare tucked toward her axis, then carried back to bind space through its own blend of skin matrices
  const blendOf = (i) => { const m = new Array(16).fill(0); for (let k = 0; k < 4; k++) { const w = fig.weights4[4 * i + k]; if (w) for (let e = 0; e < 16; e++) m[e] += w * S[fig.joints4[4 * i + k]][e]; } return m; };
  const onSkirt = (i) => { let w = 0; for (let k = 0; k < 4; k++) if (/opt/.test(name[fig.joints4[4 * i + k]])) w += fig.weights4[4 * i + k]; return w; };   // its weight there
  const skirt = []; for (let i = 0; i < base; i++) if (onSkirt(i) > 0.001) skirt.push(i);
  const lbody = at('h_jnt_lbody'), hipAt = ap(S[lbody], ap(inv(fig.inverseBinds[lbody]), [0, 0, 0]));   // her axis: the lower body's joint (the gown's train would pull a mean back)
  const waistY = Math.max(...skirt.map((i) => posed[3 * i + 1])), axisZ = hipAt[2];   // the skirt's top: where any of its weight begins
  for (const i of skirt) {   // moved by its share of skirt weight (a vertex half on the waist moves half way: the cloth never tears at the hips)
    const [x, y, z] = [posed[3 * i], posed[3 * i + 1], posed[3 * i + 2]], t = clamp((waistY - y) / waistY, 0, 1), tuck = 1 - HEM_TUCK * t;
    let q = [x * tuck, waistY - (waistY - y) * (waistY - HEM_Y) / waistY, axisZ + (z - axisZ) * tuck];
    const r = Math.hypot(q[0], q[2] - axisZ), rmax = 0.16 + (HEM_FLARE - 0.16) * t, eased = rmax * Math.tanh(r / rmax);   // eased, never cut: no crease
    if (r > 1e-6) q = [q[0] * eased / r, q[1], axisZ + (q[2] - axisZ) * eased / r];
    const w = Math.min(1, onSkirt(i)), p = [0, 1, 2].map((k) => posed[3 * i + k] + w * (q[k] - posed[3 * i + k])), b = ap(inv(blendOf(i)), p);
    for (let d = 0; d < 3; d++) { fig.positions[3 * i + d] = b[d]; posed[3 * i + d] = p[d]; }
  }
  const hemAt = { waistY, axisZ };
  // the hair's islands by side: a triangle all of whose corners sample the disc's hair strip (the scalp's and the locks' alike) takes the island of its
  // centre's side as she stands, its corners copied where islands meet
  const isHair = (i) => fig.uvs[2 * i + 1] < HAIR_ROWS / 512 && fig.uvs[2 * i] >= 48 / 512;
  // her long hair waved as his sheet has it: below her chin each strand swings sideways in a slow wave, its phase its place (bind space, before copies)
  for (let i = 0; i < base; i++) if (isHair(i) && posed[3 * i + 1] < 1.32) {
    const along = 1.32 - posed[3 * i + 1], phase = along * 2 * Math.PI / 0.12 + posed[3 * i] * 9, fade = Math.min(1, along / 0.08);
    fig.positions[3 * i] += 0.011 * fade * Math.sin(phase); fig.positions[3 * i + 2] += 0.006 * fade * Math.cos(phase);
  }
  const island = new Map(), uvs = fig.uvs.map((v, i) => i % 2 === 0 ? v / 2 : v);   // the disc's map is the left half now
  const added = { p: [], n: [], uv: [], j: [], w: [] };
  const copyOf = (i, k) => {
    const key = `${i}:${k}`; if (island.has(key)) return island.get(key);
    const j = island.has(`${i}:first`) ? base + added.p.length / 3 : i;
    if (j !== i) {
      added.p.push(fig.positions[3 * i], fig.positions[3 * i + 1], fig.positions[3 * i + 2]); added.n.push(fig.normals[3 * i], fig.normals[3 * i + 1], fig.normals[3 * i + 2]);
      added.uv.push(0, 0); added.j.push(...fig.joints4.slice(4 * i, 4 * i + 4)); added.w.push(...fig.weights4.slice(4 * i, 4 * i + 4));
    } else island.set(`${i}:first`, k);
    const u = 0.5 + fig.uvs[2 * i] / 2, v = fig.uvs[2 * i + 1] + k * HAIR_ROWS / MAP_H;
    if (j === i) { uvs[2 * i] = u; uvs[2 * i + 1] = v; } else { added.uv[2 * (j - base)] = u; added.uv[2 * (j - base) + 1] = v; }
    island.set(key, j); return j;
  };
  const headJ = at('h_jnt_head'), chinY = ap(S[headJ], ap(inv(fig.inverseBinds[headJ]), [0, 0, 0]))[1];   // her head joint as she stands: the chin's line
  const tris = fig.indices.slice();
  for (let t = 0; t < tris.length; t += 3) {
    const c = [tris[t], tris[t + 1], tris[t + 2]]; if (!c.every(isHair)) continue;
    const x = (posed[3 * c[0]] + posed[3 * c[1]] + posed[3 * c[2]]) / 3, y = (posed[3 * c[0] + 1] + posed[3 * c[1] + 1] + posed[3 * c[2] + 1]) / 3;
    const k = y > chinY ? 0 : x < -0.03 ? 1 : x > 0.03 ? 2 : 0;   // her bangs and crown white; below her chin her right (-x) pink, her left ice
    for (let q = 0; q < 3; q++) tris[t + q] = copyOf(c[q], k);
  }
  // the parts: built where she stands, in metres, then carried to bind space through one joint's skin
  const parts = [], partOf = (geo, joint, label) => parts.push({ geo, joint: at(joint), label });
  const head = at('h_jnt_head'), Sh = S[head];
  const hp = []; for (let i = 0; i < base; i++) if (fig.joints4[4 * i] === head || isHair(i)) hp.push([posed[3 * i], posed[3 * i + 1], posed[3 * i + 2]]);
  const jointAt = (k) => ap(S[k], ap(inv(fig.inverseBinds[k]), [0, 0, 0]));   // a joint as she stands: its bind place carried by its own skin
  const top = Math.max(...hp.map((p) => p[1])), hx = jointAt(head);
  // the head's frame as she stands: up from the joint to the crown, right her left (+x carried), forward +z carried
  const sub = (a, b) => a.map((v, i) => v - b[i]), nz = (a) => { const l = Math.hypot(...a) || 1; return a.map((v) => v / l); };
  const R3 = (v) => nz(ap(Sh, v, 0));
  const UP = R3([0, 1, 0]), LEFT = R3([1, 0, 0]), FWD = R3([0, 0, 1]);
  const H = (c, [l, u, f]) => c.map((v, i) => v + LEFT[i] * l + UP[i] * u + FWD[i] * f);
  const crown = H(hx, [0, (top - hx[1]) / (UP[1] || 1), 0]);   // up the head's own axis to her top
  // the pigtails: tied high at her crown's sides, slim at the tie, falling in S-curls to her chest, a second lock twisting round each; pink on her right
  // (-x), ice on her left; a rosette of ice at each tie (his sheet's snowflake clips)
  for (const side of [-1, 1]) {
    const root = H(crown, [side * 0.062, -0.048, -0.028]), island = side < 0 ? ISLANDS.pigtailPink : ISLANDS.pigtailIce;
    const lfu = [[0, 0, 0], [0.026, -0.008, -0.01], [0.05, -0.03, -0.016], [0.066, -0.065, -0.018], [0.072, -0.11, -0.016], [0.06, -0.155, -0.012], [0.075, -0.2, -0.008],
      [0.095, -0.245, -0.004], [0.085, -0.29, 0], [0.066, -0.335, 0.004], [0.08, -0.38, 0.008], [0.098, -0.42, 0.01], [0.088, -0.455, 0.012], [0.074, -0.48, 0.012]];
    const radii = [0.012, 0.02, 0.027, 0.031, 0.033, 0.033, 0.032, 0.031, 0.029, 0.026, 0.022, 0.017, 0.011, 0.004];
    partOf(tube(lfu.map(([l, u, f]) => H(root, [side * l, u, f])), radii, 12, island, { flat: 0.86 }), 'h_jnt_head', side < 0 ? 'pigtail, her right (pink)' : 'pigtail, her left (ice)');
    const lock = lfu.slice(2).map(([l, u, f], k) => H(root, [side * (l + 0.024 * Math.cos(k * 0.95)), u - 0.012, f + 0.024 * Math.sin(k * 0.95)]));
    partOf(tube(lock, radii.slice(2).map((r) => r * 0.55), 8, island), 'h_jnt_head', 'its curl');
    for (let k = 0; k < 5; k++) { const a = 2 * Math.PI * k / 5; partOf(gem(H(root, [side * 0.006, 0.016 * Math.cos(a), 0.016 * Math.sin(a)]), [0.007, 0.009, 0.007], ISLANDS.crystal), 'h_jnt_head', 'ice clip'); }
  }
  // the circlet: a tiara across her brow, not a halo: an arc from temple to temple on her bangs at the height of her brow (her eyes' own vertices give
  // it), its ends in her hair; the ice diamond at its front, two small ones beside it
  const eyes = []; for (let i = 0; i < base; i++) { const u = fig.uvs[2 * i] * 512, v = fig.uvs[2 * i + 1] * 512; if (u > 16 && u < 244 && v > 60 && v < 112 && fig.joints4[4 * i] === head) eyes.push([posed[3 * i], posed[3 * i + 1], posed[3 * i + 2]]); }
  const eyeAt = [0, 1, 2].map((k) => eyes.reduce((s, p) => s + p[k], 0) / (eyes.length || 1));
  const brow = H([hx[0], eyeAt[1], hx[2]], [0, 0.046, 0]), ring = [], radii = [];
  for (let k = 0; k <= 16; k++) {
    const a = (k / 16 - 0.5) * 2 * 1.3, dir = LEFT.map((v, i) => v * Math.sin(a) + FWD[i] * Math.cos(a));
    let r = 0.07;
    for (const p of hp) { const q = sub(p, brow), up = q[0] * UP[0] + q[1] * UP[1] + q[2] * UP[2]; if (Math.abs(up) > 0.015) continue; const along = q[0] * dir[0] + q[1] * dir[1] + q[2] * dir[2], off = Math.hypot(...q.map((v, i) => v - dir[i] * along - UP[i] * up)); if (along > 0 && off < 0.022) r = Math.max(r, along); }
    ring.push(brow.map((v, i) => v + dir[i] * (r + 0.003) + UP[i] * 0.006 * Math.cos(a))); radii.push(0.0042);
  }
  partOf(tube(ring, radii, 6, ISLANDS.metal, { flat: 0.5 }), 'h_jnt_head', 'circlet');
  const front = ring[8];
  partOf(gem(front.map((v, i) => v + FWD[i] * 0.008), [0.011, 0.017, 0.007], ISLANDS.crystal), 'h_jnt_head', 'the circlet\'s ice diamond');
  for (const k of [6, 10]) partOf(gem(ring[k].map((v, i) => v + FWD[i] * 0.005), [0.005, 0.008, 0.004], ISLANDS.crystal), 'h_jnt_head', 'a small ice diamond');
  // the underskirt: the chiton lined in its own frosted cloth from the hips to the hem (the disc's gown opens at the front; legs now stand behind it)
  const lining = Array.from({ length: 7 }, (_, k) => [0, hemAt.waistY - 0.16 - (hemAt.waistY - 0.16 - HEM_Y - 0.015) * k / 6, hemAt.axisZ]);
  partOf(tube(lining, lining.map((_, k) => 0.135 + 0.035 * k / 6), 18, ISLANDS.cloth, { caps: false }), 'h_jnt_lbody', 'the chiton\'s lining');
  // the apple: in her right hand as she stands (the hand's own vertices give the palm), honeycombed gold, a stem and a leaf
  const rh = at('h_jnt_rhand'), handPts = []; for (let i = 0; i < base; i++) if (fig.joints4[4 * i] === rh && fig.weights4[4 * i] > 0.6) handPts.push([posed[3 * i], posed[3 * i + 1], posed[3 * i + 2]]);
  const palm = [0, 1, 2].map((k) => handPts.reduce((s, p) => s + p[k], 0) / (handPts.length || 1));
  const apple = [palm[0], palm[1] + 0.045, palm[2] + 0.03];
  const prof = [[0.003, -0.042], [0.022, -0.039], [0.036, -0.026], [0.043, -0.008], [0.044, 0.008], [0.04, 0.022], [0.03, 0.032], [0.016, 0.036], [0.008, 0.03], [0.002, 0.028]];
  partOf(lathe(apple, prof, 20, ISLANDS.gold), 'h_jnt_rhand', 'the golden apple');
  partOf(tube([apple.map((v, i) => v + [0, 0.026, 0][i]), apple.map((v, i) => v + [0.005, 0.054, 0][i])], [0.004, 0.0028], 5, ISLANDS.sandal), 'h_jnt_rhand', 'its stem');
  partOf(gem(apple.map((v, i) => v + [0.019, 0.05, 0.002][i]), [0.018, 0.004, 0.009], ISLANDS.gold), 'h_jnt_rhand', 'its leaf');
  // the brooch at her left shoulder (his sheet's): a platinum ring and an ice centre on the chiton's strap, where her left shoulder's cloth is highest
  const ub = at('h_jnt_ubody'); let strap = null;
  for (let i = 0; i < base; i++) if (fig.joints4[4 * i] === ub && fig.weights4[4 * i] > 0.6 && posed[3 * i] > 0.05 && posed[3 * i] < 0.12 && posed[3 * i + 2] > 0 && (!strap || posed[3 * i + 1] > strap[1])) strap = [posed[3 * i], posed[3 * i + 1], posed[3 * i + 2]];
  if (strap) {
    const c = [strap[0] - 0.004, strap[1] - 0.022, strap[2] + 0.012];
    partOf(tube(Array.from({ length: 14 }, (_, k) => { const a = 2 * Math.PI * k / 14; return [c[0] + 0.015 * Math.cos(a), c[1] + 0.015 * Math.sin(a), c[2]]; }), new Array(14).fill(0.004), 5, ISLANDS.metal, { closed: true }), 'h_jnt_ubody', 'the brooch');
    partOf(gem([c[0], c[1], c[2] + 0.004], [0.008, 0.008, 0.005], ISLANDS.crystal), 'h_jnt_ubody', 'its ice');
  }
  // the legs: from under the skirt to the floor, a knee, a calf, an ankle, a foot forward; gold straps at the ankle and over the foot
  for (const side of [-1, 1]) {
    const x = side * 0.072;
    const legPath = [[x, 0.9, -0.02], [x * 1.02, 0.68, -0.012], [x * 0.98, 0.48, 0.006], [x * 0.95, 0.3, -0.006], [x * 0.9, 0.12, -0.012], [x * 0.9, 0.07, -0.01]];
    partOf(tube(legPath, [0.072, 0.06, 0.045, 0.048, 0.03, 0.028], 12, ISLANDS.skin), 'h_jnt_lbody', side < 0 ? 'leg, her right' : 'leg, her left');
    partOf(tube([[x * 0.9, 0.05, -0.04], [x * 0.9, 0.045, 0.01], [x * 0.92, 0.03, 0.07], [x * 0.92, 0.022, 0.1]], [0.03, 0.034, 0.03, 0.02], 10, ISLANDS.skin, { flat: 0.6 }), 'h_jnt_lbody', 'foot');
    for (const y of [0.075, 0.105]) partOf(tube(Array.from({ length: 14 }, (_, k) => { const a = 2 * Math.PI * k / 14; return [x * 0.9 + Math.cos(a) * 0.032, y, -0.01 + Math.sin(a) * 0.032]; }), new Array(14).fill(0.0035), 4, ISLANDS.sandal, { closed: true }), 'h_jnt_lbody', 'sandal strap');
    partOf(tube(Array.from({ length: 12 }, (_, k) => { const a = Math.PI * k / 11; return [x * 0.92 + Math.cos(a) * 0.035, 0.022 + Math.sin(a) * 0.03, 0.06]; }), new Array(12).fill(0.004), 4, ISLANDS.sandal), 'h_jnt_lbody', 'sandal strap');
  }
  // every part into bind space through its joint's skin, appended to the figure
  let count = base + added.p.length / 3;
  const P = [...fig.positions, ...added.p], Nn = [...fig.normals, ...added.n], U = [...uvs, ...added.uv], Jt = [...fig.joints4, ...added.j], Wt = [...fig.weights4, ...added.w], I = [...tris];
  const report = { parts: [] };
  for (const { geo, joint, label } of parts) {
    const Bi = inv(S[joint]), first = count;
    for (let k = 0; k < geo.p.length; k++) {
      const b = ap(Bi, geo.p[k]), nb = ap(Bi, geo.n[k], 0), l = Math.hypot(...nb) || 1;
      P.push(...b); Nn.push(...nb.map((v) => v / l)); U.push(...geo.uv[k]); Jt.push(joint, 0, 0, 0); Wt.push(1, 0, 0, 0); count++;
    }
    for (const t of geo.tri) I.push(first + t[0], first + t[1], first + t[2]);
    report.parts.push({ label, joint: name[joint], vertices: geo.p.length, triangles: geo.tri.length });
  }
  Object.assign(fig, { positions: P, normals: Nn, uvs: U, joints4: Jt, weights4: Wt, indices: I, count });
  report.base = { vertices: base, triangles: fig.indices.length / 3 };
  report.hairCopies = added.p.length / 3; report.vertices = count; report.triangles = I.length / 3;
  const maps = { main: map(d, FACE), faces: Object.fromEntries(FACES.map((k) => [`face${k}`, map(d, k)])) };
  return { fig, maps, report, posedHeight: fig.posedHeight };
}

/** retag(bytes, fn): a .glb with its JSON changed by fn, the binary as it was */
function retag(b, fn) {
  const n = b.readUInt32LE(12), json = JSON.parse(b.toString('utf8', 20, 20 + n)), bin = b.subarray(20 + n);
  fn(json);
  let j = Buffer.from(JSON.stringify(json), 'utf8'); const pad = (4 - (j.length % 4)) % 4; j = Buffer.concat([j, Buffer.alloc(pad, 0x20)]);
  const head = Buffer.alloc(12); head.write('glTF', 0, 'latin1'); head.writeUInt32LE(2, 4); head.writeUInt32LE(12 + 8 + j.length + bin.length, 8);
  const jh = Buffer.alloc(8); jh.writeUInt32LE(j.length, 0); jh.write('JSON', 4, 'latin1');
  return Buffer.concat([head, jh, j, bin]);
}

/** harleyquintiti(d): the .glb's bytes and what was made */
export function harleyquintiti(d = disc()) {
  const { fig, maps, report } = mod(d);
  const extras = Object.fromEntries(Object.entries(maps.faces).map(([k, m]) => [k, png(MAP_W, MAP_H, m)]));
  const bytes = retag(glb(fig, png(MAP_W, MAP_H, maps.main), { name: 'harleyquintiti', extras }), (json) => {
    json.asset.generator = 'harleyquintiti-mod.mjs over hades-glb.mjs (house, dyson-society/tools)';
    json.asset.copyright = `${json.asset.copyright || 'Saint Seiya: The Hades (PS2, SLES-54162): third-party art'}; modded as Harleyquintiti by the house`;
    json.extras = { ...(json.extras || {}), who: 'Harleyquintiti: Nefertiti as Harley Quinn, a Nestal Nymph descended from Athena', face: FACE, stance: HQ_STANCE, map: [MAP_W, MAP_H] };
  });
  return { bytes, report, sha256: crypto.createHash('sha256').update(bytes).digest('hex') };
}

if (process.argv[1] && import.meta.url === pathToFileURL(fs.realpathSync(process.argv[1])).href) {
  const arg = (k, dflt) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : dflt; };
  const t0 = performance.now(), out = arg('--out', OUT), made = harleyquintiti(disc(arg('--disc', DISC)));
  fs.writeFileSync(out, made.bytes);
  const sheetAt = arg('--sheet', null);
  if (sheetAt) {
    const { parseGlb, pose, draw, texture } = await import('./hades-picture.mjs');
    const face = [-0.21, 1.26, 0.21, 1.72], views = [[0], [90], [180], [-35], [0, face], [-35, face], [180, face]], w = 320, h = 480, out2 = new Uint8Array(w * views.length * h * 4);
    for (const [k, [yaw, box]] of views.entries()) {
      const g = parseGlb(made.bytes), cell = draw(g, pose(g, 'rest'), { w, h, yaw, box, tex: texture(g) });
      for (let y = 0; y < h; y++) out2.set(cell.subarray(4 * w * y, 4 * w * (y + 1)), 4 * (w * views.length * y + w * k));
    }
    fs.writeFileSync(sheetAt, png(w * views.length, h, out2));
  }
  console.log(JSON.stringify({ out, bytes: made.bytes.length, sha256: made.sha256, ...made.report, ms: Math.round(performance.now() - t0) }));
}
