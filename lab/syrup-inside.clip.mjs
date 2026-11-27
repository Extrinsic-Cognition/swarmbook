#!/usr/bin/env node
// syrup-inside.clip.mjs: the inside view's Show as a vertical clip, drawn frame by frame in a muted headless Chrome over CDP, off every screen.
//   node syrup-inside.clip.mjs --out <dir> [--size 1080x1920] [--fps 30] [--seconds 18] [--looks 1.5,4,7.5,12,16.5] [--chrome <path>] [--ffmpeg <path>]
// The road is syrup-glass.bench.mjs's withPage: a loopback door of its own over this tree, Fetch interception letting through nothing but that
// door and the star's picture, the Chrome ended by its pid and its profile folder removed. Frame k is window.__lab.showFrame(k / fps) on
// syrup-inside.html?clip=1 (four samples a pixel, the same picture for the same t), captured as PNG and piped into ffmpeg: H.264, yuv420p,
// CRF 18, BT.709, +faststart, two threads, at nice 19. Then the checks, each a frame drawn again and compared byte for byte with the run's:
// t = 9 s and t = 0 replayed from the start, the last frame reached forward again, t = 9 s drawn in one band instead of eight.
// Writes <out>/syrup-inside.mp4, for each --looks instant <out>/look-<t>.png (the frame as captured) and <out>/look-<t>.mp4.png (the same
// frame read back from the mp4), and <out>/syrup-inside.clip.json (every frame's cost, the checks, the encode, the Chrome and the GPU).
// COST: one Chrome (~400 MB) and one ffmpeg for a minute or two; by distro-play's 17 to 18 ms for the four-sample still at 1024 x 640 on the
// M4 Max, about 55 ms of GPU a frame at 1080 x 1920. A heavy job: never on the serving Mac at load 20 or more (the new Mac has Chrome for
// Testing and ffmpeg); bound it with tools/dead-tasks/bounded.mjs.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawn, spawnSync } from 'node:child_process';
import { withPage, stat } from './syrup-glass.bench.mjs';

const args = process.argv.slice(2), opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const OUT = path.resolve(opt('--out', path.join(os.tmpdir(), 'syrup-inside-clip')));
const [W, H] = opt('--size', '1080x1920').split('x').map(Number);
const FPS = Number(opt('--fps', 30)), N = Math.round(FPS * Number(opt('--seconds', 18)));
const LOOKS = opt('--looks', '1.5,4,7.5,12,16.5').split(',').map(Number).filter(t => Math.round(t * FPS) < N);
const FFMPEG = opt('--ffmpeg', ['/opt/homebrew/bin/ffmpeg', '/usr/local/bin/ffmpeg'].find(f => fs.existsSync(f)));
const PAGE = '/embertide-app/ui/intro/dyson-society/lab/syrup-inside.html?clip=1';
const READY = 'window.__lab && window.__lab.ready ? Promise.race([window.__lab.ready, new Promise((_, no) => setTimeout(() => no(new Error("the pictures did not arrive in 60 s")), 60000))])'
  + ' : Promise.reject(new Error(String(window.__lab && window.__lab.error || "no __lab.ready on the page")))';
const sha = b => crypto.createHash('sha256').update(b).digest('hex').slice(0, 16);
const since = (a, b) => Math.round((b - a) * 10) / 10;
const timeOf = s => { const m = /([\d.]+) real\s+([\d.]+) user\s+([\d.]+) sys/.exec(s), r = /(\d+)\s+maximum resident set size/.exec(s);   // /usr/bin/time -l
  return m ? { real_s: +m[1], user_s: +m[2], sys_s: +m[3], max_rss_mb: r ? Math.round(+r[1] / 1048576) : null } : null; };

async function main() {
  if (!FFMPEG) throw new Error('no ffmpeg on this machine');
  fs.mkdirSync(OUT, { recursive: true });
  const mp4 = path.join(OUT, 'syrup-inside.mp4'), T0 = performance.now();
  const receipt = { at: new Date().toISOString(), host: os.hostname(), cpu: os.cpus()[0]?.model, load_before: os.loadavg(), size: [W, H], fps: FPS, frames: N, ffmpeg: FFMPEG };
  // the encoder reads PNGs on its stdin as they are drawn; /usr/bin/time says its own CPU and memory when it ends. The colour tags ride on
  // the frames (setparams): ffmpeg 9 left the encoder's own -color_primaries and -color_trc out of the stream (unknown in ffprobe, Oct 14)
  const ff = spawn('/usr/bin/time', ['-l', 'nice', '-n', '19', FFMPEG, '-hide_banner', '-loglevel', 'error', '-y', '-filter_threads', '2',
    '-threads', '2', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'png', '-i', 'pipe:0',
    '-vf', 'scale=out_color_matrix=bt709:out_range=tv,format=yuv420p,setparams=range=tv:color_primaries=bt709:color_trc=bt709:colorspace=bt709',
    '-c:v', 'libx264', '-crf', '18', '-pix_fmt', 'yuv420p', '-threads', '2', '-movflags', '+faststart', '-an', mp4],
  { stdio: ['pipe', 'ignore', 'pipe'] });
  let ffLog = '', pipeError = null; ff.stderr.on('data', d => { ffLog += d; }); ff.stdin.on('error', e => { pipeError = e; });
  const ffEnd = new Promise(r => ff.on('exit', (code, signal) => r({ code, signal })));
  const write = buf => new Promise((resolve, reject) => pipeError ? reject(pipeError) : ff.stdin.write(buf, e => e ? reject(e) : resolve()));
  let page;
  try {
    page = await withPage({ W, H, out: OUT, page: PAGE, ready: READY, fn: async ({ ev, send, s, errors, refused, star }) => {
      if (!star.face || !star.film) throw new Error(`the pictures are not all in (face ${star.face}, film ${star.film}): the clip would not be the Show`);
      const gpu = await ev('window.__lab.renderer', false);
      await ev('window.__lab.setScale(1)', false);
      const draw = (k, bands = 8) => ev(`window.__lab.showFrame(${k} / ${FPS}, {fps: ${FPS}, bands: ${bands}})`);
      const capture = async () => Buffer.from((await send('Page.captureScreenshot', { format: 'png', optimizeForSpeed: true }, s)).data, 'base64');
      const frames = []; let pending = Promise.resolve();
      for (let k = 0; k < N; k++) {
        const a = performance.now(), f = await draw(k), b = performance.now();
        if (f.size[0] !== W || f.size[1] !== H) throw new Error(`the canvas is ${f.size.join(' x ')}, not ${W} x ${H}`);
        const png = await capture(), c = performance.now();
        if (png.readUInt32BE(16) !== W || png.readUInt32BE(20) !== H) throw new Error(`the picture is ${png.readUInt32BE(16)} x ${png.readUInt32BE(20)}, not ${W} x ${H}`);
        await pending; const d = performance.now(); pending = write(png);   // one frame in the pipe while the next is drawn
        frames.push({ k, step_ms: f.stepMs, render_ms: f.renderMs, draw_ms: since(a, b), capture_ms: since(b, c), pipe_wait_ms: since(c, d), png_bytes: png.length, sha: sha(png) });
        const look = LOOKS.find(t => Math.round(t * FPS) === k); if (look !== undefined) fs.writeFileSync(path.join(OUT, `look-${look}.png`), png);
        if (k % 60 === 0 || k === N - 1) console.log(`frame ${k + 1}/${N} (t ${(k / FPS).toFixed(2)} s): render ${f.renderMs.toFixed(1)} ms, capture ${since(b, c)} ms, ${(png.length / 1048576).toFixed(2)} MB; ${((performance.now() - T0) / 1000).toFixed(1)} s in`);
      }
      await pending; ff.stdin.end();
      // the same t, the same picture: frames drawn again out of order and compared byte for byte with the run's
      const again = async (k, bands = 8) => { const f = await draw(k, bands), png = await capture(); return { k, bands, step_ms: f.stepMs, render_ms: f.renderMs, same: sha(png) === frames[k].sha }; };
      const k9 = Math.min(N - 1, Math.round(9 * FPS)), checks = [await again(k9), await again(0), await again(N - 1), await again(k9, 1)];
      const bands = { 1: [], 8: [] }; for (const n of [1, 8, 1, 8, 1, 8]) bands[n].push((await draw(k9, n)).renderMs);   // no steps: the state stays at k9
      return { gpu, frames, checks, bands, errors: errors.splice(0), refused: refused.splice(0) };
    } });
  } finally { if (!ff.stdin.writableEnded) ff.stdin.end(); }
  const enc = await ffEnd, T1 = performance.now();
  if (enc.code !== 0) throw new Error(`ffmpeg ended with ${enc.code ?? enc.signal}: ${ffLog.slice(-800)}`);
  const probe = JSON.parse(spawnSync(path.join(path.dirname(FFMPEG), 'ffprobe'), ['-v', 'error', '-select_streams', 'v:0', '-count_frames', '-show_entries',
    'stream=codec_name,profile,level,pix_fmt,width,height,r_frame_rate,nb_read_frames,color_space,color_primaries,color_transfer,color_range:format=duration,size,bit_rate',
    '-of', 'json', mp4], { encoding: 'utf8' }).stdout);
  // the looks read back from the mp4 itself, and how far each lies from the frame as it was captured
  const looks = LOOKS.map(t => {
    const k = Math.round(t * FPS), shot = path.join(OUT, `look-${t}.png`), back = path.join(OUT, `look-${t}.mp4.png`);
    spawnSync(FFMPEG, ['-hide_banner', '-loglevel', 'error', '-nostdin', '-y', '-i', mp4, '-vf', `select=eq(n\\,${k})`, '-frames:v', '1', back]);
    const psnr = /average:(\S+)/.exec(spawnSync(FFMPEG, ['-hide_banner', '-nostdin', '-i', shot, '-i', back, '-lavfi', 'psnr', '-f', 'null', '-'], { encoding: 'utf8' }).stderr || '');
    return { t, k, shot, back, psnr_db: psnr ? Number(psnr[1]) : null };
  });
  const { browser, star, result } = page, F = result.frames, rest = F.slice(1);
  Object.assign(receipt, {
    load_after: os.loadavg(), chrome: browser, gpu: result.gpu, pictures: star,
    cost: {
      wall_s: Math.round(T1 - T0) / 1000,
      first_frame: F[0],   // its step holds the 255 faces drawn into the atlas and its render the cookie
      render_ms: stat(rest.map(f => f.render_ms)),   // the frame on the GPU, waited for by a one-pixel read: four samples a pixel, eight bands
      render_total_s: Math.round(F.reduce((a, f) => a + f.render_ms, 0)) / 1000,
      step_ms: stat(rest.map(f => f.step_ms)), draw_ms: stat(F.map(f => f.draw_ms)), capture_ms: stat(F.map(f => f.capture_ms)),
      pipe_wait_ms: stat(F.map(f => f.pipe_wait_ms)), png_mb: stat(F.map(f => f.png_bytes / 1048576)), encode: timeOf(ffLog),
    },
    bands: { one_ms: stat(result.bands[1]), eight_ms: stat(result.bands[8]) },
    checks: result.checks, same_as_previous: F.filter((f, i) => i && f.sha === F[i - 1].sha).length,
    mp4: { path: mp4, bytes: fs.statSync(mp4).size, probe }, looks, errors: result.errors, refused: result.refused, frames: F,
  });
  fs.writeFileSync(path.join(OUT, 'syrup-inside.clip.json'), JSON.stringify(receipt, null, 1));
  const v = probe.streams?.[0] || {}, c = receipt.cost;
  console.log(`\n${mp4}: ${receipt.mp4.bytes} B, ${probe.format?.duration} s, ${v.nb_read_frames} frames, ${v.codec_name} ${v.profile} ${v.pix_fmt} ${v.width}x${v.height} ${v.r_frame_rate}, matrix ${v.color_space} primaries ${v.color_primaries} transfer ${v.color_transfer} range ${v.color_range}`);
  console.log(`GPU ${result.gpu}; ${browser}; load ${receipt.load_before.map(x => x.toFixed(1)).join(' ')} -> ${receipt.load_after.map(x => x.toFixed(1)).join(' ')}`);
  console.log(`render a frame (read back) median ${c.render_ms.median.toFixed(1)} ms, p95 ${c.render_ms.p95.toFixed(1)}, max ${c.render_ms.max.toFixed(1)}; first frame ${F[0].render_ms.toFixed(1)} ms (step ${F[0].step_ms.toFixed(1)}); all ${c.render_total_s} s`);
  console.log(`capture median ${c.capture_ms.median} ms; step median ${c.step_ms.median.toFixed(2)} ms; png median ${c.png_mb.median.toFixed(2)} MB; wall ${c.wall_s} s; encode ${JSON.stringify(c.encode)}`);
  console.log(`bands: one ${receipt.bands.one_ms.median.toFixed(1)} ms, eight ${receipt.bands.eight_ms.median.toFixed(1)} ms (median of 3)`);
  console.log(`checks: ${result.checks.map(x => `t ${(x.k / FPS).toFixed(2)} s in ${x.bands} band${x.bands > 1 ? 's' : ''} ${x.same ? 'same' : 'DIFFERENT'}`).join('; ')}; frames equal to the one before: ${receipt.same_as_previous}`);
  console.log(`looks: ${looks.map(l => `${l.t} s ${l.psnr_db} dB`).join('; ')}; page errors ${result.errors.length}, refused ${result.refused.length}`);
  if (result.checks.some(x => !x.same)) process.exitCode = 2;
}
main().catch(e => { console.error('clip failed: ' + (e.stack || e)); process.exit(1); });
