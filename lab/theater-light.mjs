// theater-light.mjs [film] [out.json]: the film's light, decoded once (Oct 14 2026). His words at 12:10 WEST over theater.html: "HERE I
// WOULD WANT TO DECODE THE HIGHLIGHTS OF THE FRAMES AND HAVE THE DODECAHEDRON DO SHIT AROUND LIKE IT DOES IN GOLDEN LIGHT LIKE FUICKING
// BOCCINO D'ORO IN HARRY POTTER". The film is fixed and known, so its light is read here once and every glass reads the track; no page
// runs vision on a frame.
//
// The file is 960 x 540 with the 1986 picture inside it at 796 x 532 from (82, 4) (ffmpeg cropdetect, limit 24, at 5, 40, 70, 101 and
// 120 s: the same each time); the light is read inside that picture and its places are the picture's. Every frame, cut to the picture and
// shrunk to 192 x 128 by ffmpeg, is scored per cell as light: how near white-hot it is (its brightest channel from 0.72 to 0.98) times its
// colour, gold whole (saturated, a hue of 20 to 82 degrees, the beams' yellow-green included) and white at 0.8, except in the band of the
// burned-in subtitles, whose white words are not light. So a star or an aura outweighs a gold cloth in daylight. The peak of the score
// blurred 3 x 3 gives the light's place: the centroid of the squared score within 8 cells of that peak. Written per frame, in thousandths
// of the picture: x and y (from the top), s the peak's strength, g the gold share of the frame's score.
// Cost: one ffmpeg decode of the 154 s film at 192 x 128 and one pass over 4.6 k frames of 24,576 cells: 9.9 s of wall clock, 13.3 s of
// CPU, niced, on the serving Mac at load 9 (Oct 14 12:2x).
import {spawn} from 'node:child_process';
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';

const here = (p) => fileURLToPath(new URL(p, import.meta.url));
const [film = here('../app/saint-seiya.mp4'), out = here('./theater-light.json')] = process.argv.slice(2);
export const CROP = [82, 4, 796, 532];
const W = 192, H = 128, CELLS = W * H, FRAME = CELLS * 3, SUBTITLES = 0.76, BLUR = 1, NEAR = 8;
const ss = (a, b, x) => { const k = Math.min(1, Math.max(0, (x - a) / (b - a))); return k * k * (3 - 2 * k); };
const band = (h, a, b, c, d) => ss(a, b, h) * (1 - ss(c, d, h));

export function measure(px) {
  const score = new Float64Array(CELLS);
  let goldSum = 0, sum = 0;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const i = y * W + x, r = px[i * 3] / 255, g = px[i * 3 + 1] / 255, b = px[i * 3 + 2] / 255;
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b), sat = mx > 0 ? (mx - mn) / mx : 0;
    let hue = 0;
    if (mx > mn) hue = mx === r ? 60 * (((g - b) / (mx - mn) + 6) % 6) : mx === g ? 60 * ((b - r) / (mx - mn) + 2) : 60 * ((r - g) / (mx - mn) + 4);
    const hot = ss(0.72, 0.98, mx), gold = hot * ss(0.1, 0.4, sat) * band(hue, 20, 32, 66, 82);
    const white = y / H > SUBTITLES ? 0 : hot * 0.8 * (1 - ss(0.1, 0.35, sat));
    score[i] = Math.max(gold, white); goldSum += gold; sum += score[i];
  }
  let peak = -1, at = 0;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    let v = 0, n = 0;
    for (let dy = -BLUR; dy <= BLUR; dy++) for (let dx = -BLUR; dx <= BLUR; dx++) {
      const yy = y + dy, xx = x + dx;
      if (yy >= 0 && yy < H && xx >= 0 && xx < W) { v += score[yy * W + xx]; n++; }
    }
    v /= n; if (v > peak) { peak = v; at = y * W + x; }
  }
  const px0 = at % W, py0 = Math.floor(at / W);
  let wx = 0, wy = 0, ww = 0;
  for (let y = Math.max(0, py0 - NEAR); y <= Math.min(H - 1, py0 + NEAR); y++) for (let x = Math.max(0, px0 - NEAR); x <= Math.min(W - 1, px0 + NEAR); x++) {
    const w = score[y * W + x] ** 2; wx += w * (x + 0.5); wy += w * (y + 0.5); ww += w;
  }
  const cx = ww > 0 ? wx / ww / W : (px0 + 0.5) / W, cy = ww > 0 ? wy / ww / H : (py0 + 0.5) / H;
  return [Math.round(cx * 1000), Math.round(cy * 1000), Math.round(Math.min(1, peak) * 1000), Math.round(sum > 0 ? goldSum / sum * 1000 : 0)];
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const rows = [];
  const pending = Buffer.alloc(FRAME); let fill = 0;
  const ff = spawn('ffmpeg', ['-v', 'error', '-i', film, '-vf', `crop=${CROP[2]}:${CROP[3]}:${CROP[0]}:${CROP[1]},scale=${W}:${H}:flags=area,format=rgb24`, '-f', 'rawvideo', '-'], {stdio: ['ignore', 'pipe', 'inherit']});
  ff.stdout.on('data', (chunk) => {
    let at = 0;
    while (at < chunk.length) {
      const n = Math.min(FRAME - fill, chunk.length - at);
      chunk.copy(pending, fill, at, at + n); fill += n; at += n;
      if (fill === FRAME) { rows.push(measure(pending)); fill = 0; }
    }
  });
  ff.on('close', (code) => {
    if (code !== 0) { console.error(`ffmpeg ended ${code}`); process.exit(1); }
    const track = {schema: 'theater-light/2', film: 'app/saint-seiya.mp4?v=53561d47', size: [960, 540], crop: CROP, fps: 30000 / 1001, w: W, h: H,
      frames: rows.length, note: 'per frame, in thousandths of the picture (crop: x, y, w, h of the file): x, y (from the top) of its light, s the peak strength, g the gold share',
      x: rows.map(r => r[0]), y: rows.map(r => r[1]), s: rows.map(r => r[2]), g: rows.map(r => r[3])};
    fs.writeFileSync(out, JSON.stringify(track) + '\n');
    console.log(`${rows.length} frames -> ${out} (${fs.statSync(out).size} bytes)`);
  });
}
