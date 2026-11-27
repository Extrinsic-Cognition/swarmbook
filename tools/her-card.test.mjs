// her-card.test.mjs: ANY FACE (tools/her-card.mjs makeCard): the card made for any picked PNG, her art the default. Her art makes the product's card pixel for
// pixel (assets/her-card.png, the bytes the clip carries); the same face makes the same bytes (read by their sha256 on the Nest); another face makes its own
// card at the law's size, its pixels standing in her box on its floor. The cards are made with magick, as the tool makes them.
//   node --test tools/her-card.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path'; import zlib from 'node:zlib'; import { execFileSync } from 'node:child_process'; import { createHash } from 'node:crypto';
import { makeCard, fitOf, ASSETS, FILES, TEAMS, TEAM } from './her-card.mjs';
import { CARD } from '../app/dl-handoff.mjs';
import { PIX, MOODS, createPixels, drawBody } from '../app/dl-lyssajudron-body.mjs';

const MAGICK = (() => { try { execFileSync('magick', ['-version'], { stdio: 'ignore' }); return true; } catch { return false; } })();
const pixelsOf = (file) => execFileSync('magick', [file, '-depth', '8', 'rgba:-'], { maxBuffer: 1 << 26 });
const scratch = (t) => { const d = fs.mkdtempSync(path.join(os.tmpdir(), 'her-card-test-')); t.after(() => fs.rmSync(d, { recursive: true, force: true })); return d; };
/** a PNG of w x h, one colour: an invented face, never hers */
function png(w, h, rgba) {
  const crc = (buf) => { let c = ~0; for (const x of buf) { c ^= x; for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1)); } return ~c >>> 0; };
  const chunk = (type, data) => { const len = Buffer.alloc(4); len.writeUInt32BE(data.length); const td = Buffer.concat([Buffer.from(type, 'latin1'), data]); const c = Buffer.alloc(4); c.writeUInt32BE(crc(td)); return Buffer.concat([len, td, c]); };
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = 6;
  const row = Buffer.concat([Buffer.from([0]), Buffer.concat(Array.from({ length: w }, () => Buffer.from(rgba)))]);
  return Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), chunk('IHDR', ihdr), chunk('IDAT', zlib.deflateSync(Buffer.concat(Array.from({ length: h }, () => row)))), chunk('IEND', Buffer.alloc(0))]);
}

test('fitOf: a face in her box at a whole number of its own pixels when that fits, else shrunk to fit', () => {
  assert.deepEqual(fitOf({ w: CARD.her.w, h: CARD.her.h }), { w: CARD.her.w, h: CARD.her.h }, 'her art fills it as it is');
  assert.deepEqual(fitOf({ w: 40, h: 50 }), { w: 240, h: 300 }, 'six times its own pixels: every pixel stays whole');
  assert.deepEqual(fitOf({ w: 628, h: 320 }), { w: 314, h: 160 }, 'a wide face shrunk to the box');
  assert.deepEqual(fitOf({ w: 1000, h: 1000 }), { w: 314, h: 314 });
});

test('ANY FACE: her art makes the product\'s card pixel for pixel, the same face the same bytes, another face its own card in her box', { skip: MAGICK ? false : 'no magick here: the card is made with ImageMagick 7' }, (t) => {
  const a = scratch(t), b = scratch(t), c = scratch(t);
  makeCard({ out: a }); makeCard({ out: b });
  for (const k of ['sprite', 'perch', 'card']) {
    assert.deepEqual(pixelsOf(path.join(a, FILES[k])), pixelsOf(path.join(ASSETS, FILES[k])), `${k}: her art makes the product's, pixel for pixel`);
    assert.deepEqual(fs.readFileSync(path.join(a, FILES[k])), fs.readFileSync(path.join(b, FILES[k])), `${k}: the same face, the same bytes`);
  }
  assert.equal(fs.readFileSync(path.join(a, FILES.json), 'utf8'), fs.readFileSync(path.join(ASSETS, FILES.json), 'utf8'), 'the law beside it, as the clip reads it');
  const face = path.join(c, 'face.png'); fs.writeFileSync(face, png(40, 50, [201, 164, 90, 255]));
  const made = makeCard({ face, out: path.join(c, 'card') });
  const sprite = pixelsOf(made.sprite), at = (x, y) => [...sprite.subarray((y * CARD.her.w + x) * 4, (y * CARD.her.w + x) * 4 + 4)];
  assert.equal(sprite.length, CARD.her.w * CARD.her.h * 4, 'her box, whatever the face');
  assert.deepEqual(at(157, 100), [201, 164, 90, 255], 'the face, six times its pixels, in her box');
  assert.equal(at(157, 10)[3], 0, 'above it nothing: it stands on the box\'s floor'); assert.equal(at(10, 200)[3], 0, 'beside it nothing');
  assert.equal(pixelsOf(made.card).length, CARD.width * CARD.height * 4, 'the card at its law\'s size');
  assert.notDeepEqual(pixelsOf(made.card), pixelsOf(path.join(ASSETS, FILES.card)), 'another face, another card');
});

test('THE POSTERS (Nov 2 2026): the card is the team\'s poster wherever she and her Lyssajudron do not stand, and her pixels are hers on every poster', { skip: MAGICK ? false : 'no magick here: the card is made with ImageMagick 7' }, (t) => {
  assert.deepEqual(Object.keys(TEAMS), ['riders', 'swarm', 'light']); assert.equal(TEAM, 'riders', 'the recruiting call, until a starter is picked');
  assert.deepEqual(Object.values(TEAMS).map((x) => x.motto), ['JOIN THE RIDERS', 'RIDE WITH THE SWARM', 'CARRY THE LIGHT HOME'], 'his posters\' three calls');
  const { width: W, height: H, her, body } = CARD, px = createPixels(PIX); drawBody(px, body.t, MOODS.awake);
  const lyssa = (x, y) => { const i = Math.floor((x - body.x) / body.scale), j = Math.floor((y - body.y) / body.scale); return i >= 0 && j >= 0 && i < PIX && j < PIX && px.bytes[(j * PIX + i) * 4 + 3] > 0; };
  const cards = new Set();
  for (const team of Object.keys(TEAMS)) {
    const made = makeCard({ out: scratch(t), team }), plate = pixelsOf(TEAMS[team].plate), card = pixelsOf(made.card), face = pixelsOf(made.sprite);
    assert.equal(plate.length, W * H * 4, `${team}: the poster at the card's size`);
    let hers = 0, poster = 0;
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const i = (y * W + x) * 4, f = ((y - her.y) * her.w + (x - her.x)) * 4, a = x >= her.x && y >= her.y && x < her.x + her.w && y < her.y + her.h ? face[f + 3] : 0;
      const same = (p, j) => card[i] === p[j] && card[i + 1] === p[j + 1] && card[i + 2] === p[j + 2];
      if (a === 255) { if (!same(face, f)) assert.fail(`${team}: ${x},${y} is not her pixel`); hers++; }
      else if (!a && !lyssa(x, y)) { if (!same(plate, i)) assert.fail(`${team}: ${x},${y} is not the poster's pixel`); poster++; }
    }
    assert.ok(hers > 40000 && poster > 200000, `${team}: ${hers} of her pixels, ${poster} of the poster's`);
    cards.add(createHash('sha256').update(card).digest('hex'));
  }
  assert.equal(cards.size, 3, 'three posters, three cards');
  assert.throws(() => makeCard({ out: scratch(t), team: 'gold' }), /no team gold/);
});
