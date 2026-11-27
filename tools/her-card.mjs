#!/usr/bin/env node
// her-card.mjs: HER CARD, made (app/dl-handoff.mjs CARD holds its law). Nefertiti on her Lyssajudron on her team's Claw Riders poster (THE POSTERS, below),
// her pixels hard (no smoothing: pixel art over the poster's paint, and a whole picture a camera can hold). Writes four files to app/assets:
//   her-sprite.png her, thinning away at the bottom as the page's mask fades her (a 4x4 ordered dither, so every pixel stays whole): the page lays it
//                  over her perch, and the clip walks it out of the screen
//   her-perch.png  the card without her: what stays on the Mac when she has gone (the page's background for her)
//   her-card.png   the card with her: the picture the App Clip looks for (harmony-clip/ carries these bytes, ARKit's reference image)
//   her-card.json  CARD for the clip (Swift reads JSON; the page imports dl-handoff.mjs)
// Needs ImageMagick 7 (magick) on the PATH.
// ANY FACE (Nov 2 2026, after THE WARDEN IS PICKED; his Nov 1 23:10 UTC "assume that everything was built for a general png or whatever, then replace those
// general values with neferittis' ones"): the card is made for any picked PNG (--face): its pixels fitted into CARD.her's box (a whole number of times its
// own pixels when that fits, else shrunk; on the box's floor, as she stands on her Lyssajudron), thinned at the bottom as hers are. Her art (athena.png) is
// the default, so the product's card is the card made for her; the onboarding's pick makes the account's (tools/embertide-mesh/onboarding-pick.mjs). The
// PNGs carry no date or time: the same face makes the same bytes, read by their sha256.
// THE POSTERS (Nov 2 2026, his "wtf dude? that is not the clawriders posters wtf are you doing?" at 00:45 UTC over THE PLATE, a black card with CLAW RIDERS
// in small Bodoni; then "this one is best" at 01:13 UTC over the mock of her on each poster): the card is his poster. His three recruitment posters of Sept 14
// (claw-riders-20260914-0{1,2,3}.png: CARRY THE LIGHT HOME, RIDE WITH THE SWARM, JOIN THE RIDERS) were each painted once without their hero
// (bfl/flux-kontext-pro through MiniRouter; the prompts in HER-CARD-IS-THE-PICKS-LANDING.md) and laid here at the card's size, claw-riders/<team>.png:
// CLAW RIDERS, the world, the sigil, the call and EMBERTIDE-0 are the poster's own paint. The card is that plate with her Lyssajudron and the face standing
// where the hero stood (--team, TEAMS: the starter a rider picks; riders, the recruiting call, until one is picked). Nothing leaves the house to make it.
//   node tools/her-card.mjs [--face <png>] [--out <dir>] [--team riders|swarm|light]
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { CARD } from '../app/dl-handoff.mjs';
import { PIX, MOODS, createPixels, drawBody } from '../app/dl-lyssajudron-body.mjs';

export const ASSETS = new URL('../app/assets/', import.meta.url).pathname, ATHENA = path.join(ASSETS, 'athena.png');
export const FILES = Object.freeze({ sprite: 'her-sprite.png', perch: 'her-perch.png', card: 'her-card.png', json: 'her-card.json' });
const PNG_OUT = ['-define', 'png:color-type=6', '-define', 'png:exclude-chunks=date,time'];   // RGBA, and no date or time: the same pixels, the same bytes
/** THE POSTERS: the three teams a rider picks as a starter, each his poster's call and a bird's colour (docs/claw-riders-gamified-hypertrace-2026-10-18.md),
 *  its plate the poster without its hero at the card's size */
const PLATES = new URL('./claw-riders/', import.meta.url).pathname;
export const TEAMS = Object.freeze({
  riders: Object.freeze({ motto: 'JOIN THE RIDERS', plate: path.join(PLATES, 'riders.png') }),   // blue, poster 03: the recruiting call, a rider with no starter yet
  swarm: Object.freeze({ motto: 'RIDE WITH THE SWARM', plate: path.join(PLATES, 'swarm.png') }),   // red, poster 02
  light: Object.freeze({ motto: 'CARRY THE LIGHT HOME', plate: path.join(PLATES, 'light.png') }),   // yellow, poster 01
});
export const TEAM = 'riders';

const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
/** pngSize(file): a PNG's width and height, read off its IHDR; throws for anything else */
function pngSize(file) {
  const b = fs.readFileSync(file);
  if (b.length < 24 || b.readUInt32BE(0) !== 0x89504e47 || b.readUInt32BE(4) !== 0x0d0a1a0a || b.toString('latin1', 12, 16) !== 'IHDR') throw new Error(`${path.basename(file)}: not a PNG`);
  return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
}
/** fitOf({w, h}): a face's size in CARD.her's box: a whole number of times its own pixels when that fits (every pixel stays whole), else shrunk to fit. Pure. */
export function fitOf({ w, h }) {
  const box = CARD.her, k = Math.min(box.w / w, box.h / h);
  if (k >= 1) return { w: w * Math.floor(k), h: h * Math.floor(k) };
  return { w: Math.max(1, Math.min(box.w, Math.round(w * k))), h: Math.max(1, Math.min(box.h, Math.round(h * k))) };
}
/** sprite(face, file, dir): the face's pixels in CARD.her's box (fitOf, on its floor), each kept or dropped whole below CARD.her.fade (the page's linear
 *  fade, as an ordered dither), written to file. Her art fills the box at once: its pixels are hers as they were. */
function sprite(face, file, dir) {
  const { w, h, fade } = CARD.her, at = fitOf(pngSize(face));
  const rgba = execFileSync('magick', [face, '-alpha', 'set', '-sample', `${at.w}x${at.h}!`, '-background', 'none', '-gravity', 'south', '-extent', `${w}x${h}`, '-depth', '8', 'rgba:-'], { maxBuffer: 1 << 24 });
  if (rgba.length !== w * h * 4) throw new Error(`the face did not come out ${w}x${h}`);
  for (let y = Math.ceil(h * fade); y < h; y++) {
    const keep = 1 - (y - h * fade) / (h * (1 - fade));
    for (let x = 0; x < w; x++) if (keep <= (BAYER[(y % 4) * 4 + (x % 4)] + 0.5) / 16) rgba[(y * w + x) * 4 + 3] = 0;
  }
  const raw = path.join(dir, 'her.rgba');
  fs.writeFileSync(raw, rgba);
  execFileSync('magick', ['-size', `${w}x${h}`, '-depth', '8', `rgba:${raw}`, ...PNG_OUT, `PNG32:${file}`]);
}

/** makeCard({face, out, team}) -> {sprite, perch, card, json}: the card for a face (any PNG; her art by default) on the team's poster, its four files written
 *  to out (the app's assets by default), their paths. */
export function makeCard({ face = ATHENA, out = ASSETS, team = TEAM } = {}) {
  if (!Object.hasOwn(TEAMS, team)) throw new Error(`no team ${team}: ${Object.keys(TEAMS).join(', ')}`);
  const plate = TEAMS[team].plate, size = pngSize(plate);
  if (size.w !== CARD.width || size.h !== CARD.height) throw new Error(`${path.basename(plate)} is ${size.w}x${size.h}, not the card's ${CARD.width}x${CARD.height}`);
  fs.mkdirSync(out, { recursive: true });
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'her-card-')), files = Object.fromEntries(Object.entries(FILES).map(([k, name]) => [k, path.join(out, name)]));
  try {
    const { her, body } = CARD, px = createPixels(PIX), raw = path.join(tmp, 'body.rgba');
    sprite(face, files.sprite, tmp);
    drawBody(px, body.t, MOODS.awake);
    fs.writeFileSync(raw, px.bytes);
    execFileSync('magick', [plate, '(', '-size', `${PIX}x${PIX}`, '-depth', '8', `rgba:${raw}`, '-filter', 'point', '-resize', `${body.scale * 100}%`, ')',
      '-geometry', `+${body.x}+${body.y}`, '-composite', '-alpha', 'off', ...PNG_OUT, `PNG32:${files.perch}`]);
    execFileSync('magick', [files.perch, files.sprite, '-geometry', `+${her.x}+${her.y}`, '-composite', '-alpha', 'off', ...PNG_OUT, `PNG32:${files.card}`]);
    fs.writeFileSync(files.json, `${JSON.stringify(CARD, null, 1)}\n`);
    return files;
  } finally { fs.rmSync(tmp, { recursive: true, force: true }); }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const opt = (k, d) => { const i = process.argv.indexOf(k); return i > 0 && process.argv[i + 1] ? process.argv[i + 1] : d; };
  const team = opt('--team', TEAM), made = makeCard({ face: path.resolve(opt('--face', ATHENA)), out: path.resolve(opt('--out', ASSETS)), team });
  console.log(`her-card: ${CARD.width}x${CARD.height} on the ${team} poster (${TEAMS[team].motto}) -> ${path.relative(process.cwd(), made.card)}, ${FILES.sprite}, ${FILES.perch}, ${FILES.json}`);
}
