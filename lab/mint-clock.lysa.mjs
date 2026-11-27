#!/usr/bin/env node
// mint-clock.lysa.mjs: the Canvas 2D measurement of mint-clock.html on lysa (the TV's 2019 laptop chip; CLAUDE.md: "test there"),
// one headless Chrome there over ONE ssh and nothing copied: the ssh carries a tunnel to Chrome's debugging port (a port the OS
// here says is free, the same number there) and a reverse tunnel from a random high port there to this tree's door here, through
// which lysa's Chrome reads the page. mint-clock.bench.mjs drives it in its --cdp mode and takes nothing from a browser that does
// not prove it is this run's (its command line must carry the profile folder named here). One probe at a time: a mint-clock
// probe already on lysa refuses this one; lysa's load is read before and after; the Chrome line is under `timeout`, the same
// line removes the profile, and a pgrep at the end must find nothing of this run. Pictures off (no network from lysa, no need).
//   node mint-clock.lysa.mjs [--host lysa] [--out <dir>] [--until <cells>] [--size 1280x720] [--chrome /opt/google/chrome/chrome]
// COST: lysa's load +5 to +10 for about two minutes (one Chrome drawing canvases on the CPU); nothing on the serving Mac but the door.
import fs from 'node:fs';
import path from 'node:path';
import { spawn, execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { freePort } from './mint-clock.bench.mjs';
import { gate } from '../vendor/tools/embertide-mesh/lysa-memory/gate.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2), opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const HOST = opt('--host', 'lysa'), OUT = path.resolve(opt('--out', path.join(HERE, 'mint-clock-pictures')));
const UNTIL = opt('--until', '10230'), SIZE = opt('--size', '1280x720'), CHROME = opt('--chrome', '/opt/google/chrome/chrome');
// --gpu off: --disable-gpu, Skia on the CPU and the software compositor, which is what a Canvas 2D draw costs lysa's chip (the default);
// --gpu swiftshader: the WebGL probes' flags, where the frame is SwiftShader's composite of the whole canvas (300 ms a frame at any count, Oct 14)
const GPU = opt('--gpu', 'off'), GPU_FLAGS = GPU === 'swiftshader' ? '--use-gl=angle --use-angle=swiftshader' : '--disable-gpu';
const ID = Math.random().toString(36).slice(2, 10), PROFILE = `/tmp/mint-clock-${ID}`;
const sleep = ms => new Promise(r => setTimeout(r, ms));
const ssh = (line, ms = 20000) => execFileSync('ssh', ['-o', 'BatchMode=yes', '-o', 'ConnectTimeout=8', HOST, line], { encoding: 'utf8', timeout: ms }).trim();

async function main() {
  console.log(gate(HOST).why);   // the bench gate (tools/embertide-mesh/lysa-memory): a loaded lysa refuses the run
  const before = ssh(`cat /proc/loadavg; pgrep -fa "[m]int-clock-" || true`).split('\n');
  console.log(`lysa load before: ${before[0]}`);
  if (before.length > 1) throw new Error(`a mint-clock probe already runs on ${HOST}: ${before.slice(1).join(' | ')}; one at a time`);
  if (Number(before[0].split(' ')[0]) > 20) throw new Error(`lysa's load is ${before[0].split(' ')[0]}: not now`);
  const P = await freePort(), D = await freePort(), R = 20000 + Math.floor(Math.random() * 20000);
  const [W, H] = SIZE.split('x');
  const line = `d="${PROFILE}"; timeout 600 ${CHROME} --headless=new --mute-audio --enable-automation --remote-allow-origins=* --remote-debugging-port=${P} --user-data-dir=$d`
    + ` --window-size=${W},${H} ${GPU_FLAGS} --no-first-run --no-default-browser-check --disable-background-networking --disable-component-update`
    + ` --disable-sync --disable-extensions --disable-background-timer-throttling --disable-renderer-backgrounding --disable-backgrounding-occluded-windows about:blank >/dev/null 2>&1; rm -rf "$d"; cat /proc/loadavg`;
  console.log(`one ssh: tunnel ${P} -> ${HOST}:${P} (Chrome's door), ${HOST}:${R} -> here:${D} (this tree's door); profile ${PROFILE}`);
  const tunnel = spawn('ssh', ['-o', 'BatchMode=yes', '-o', 'ExitOnForwardFailure=yes', '-o', 'ConnectTimeout=8', '-L', `${P}:127.0.0.1:${P}`, '-R', `${R}:127.0.0.1:${D}`, HOST, line], { stdio: ['ignore', 'pipe', 'inherit'] });
  let tail = ''; tunnel.stdout.on('data', d => { tail += d; });
  const gone = new Promise(r => tunnel.on('exit', code => r(code)));
  let up = false;
  for (let i = 0; i < 120 && !up; i++) { await sleep(500); if (tunnel.exitCode !== null) throw new Error(`the ssh ended early (exit ${tunnel.exitCode}): a forward refused, or Chrome`); try { const v = await fetch(`http://127.0.0.1:${P}/json/version`).then(r => r.json()); up = Boolean(v.webSocketDebuggerUrl); } catch {} }
  if (!up) { tunnel.kill('SIGTERM'); throw new Error("lysa's Chrome did not answer through the tunnel in 60 s"); }
  console.log(`lysa's Chrome answers through the tunnel; the bench takes it`);
  const bench = spawn(process.execPath, [path.join(HERE, 'mint-clock.bench.mjs'), '--cdp', String(P), '--door-port', String(D), '--door', `http://127.0.0.1:${R}`, '--profile', PROFILE, '--no-pictures', '--until', UNTIL, '--size', SIZE, '--out', OUT, '--name', `${HOST}-gpu-${GPU}`], { stdio: 'inherit' });
  const code = await new Promise(r => bench.on('exit', r));
  console.log(`the bench ended (exit ${code}); waiting for lysa's Chrome to close and the ssh to end`);
  const ended = await Promise.race([gone, sleep(30000).then(() => 'late')]);
  if (ended === 'late') { console.log('the ssh did not end in 30 s: ending it here (the remote timeout ends Chrome at 600 s)'); tunnel.kill('SIGTERM'); await gone; }
  const after = ssh(`pgrep -fa "[m]int-clock-${ID}" || echo clean; cat /proc/loadavg`).split('\n');
  console.log(`lysa after: ${after[0] === 'clean' ? 'nothing of this run left' : 'LEFT: ' + after.slice(0, -1).join(' | ')}; load ${after.at(-1)}; load at Chrome's end ${tail.trim().split('\n').at(-1) || '(not read)'}`);
  fs.appendFileSync(path.join(OUT, `mint-clock.lysa.${ID}.log`), JSON.stringify({ id: ID, host: HOST, before: before[0], after: after.at(-1), atEnd: tail.trim(), ports: { P, R, D }, bench: code }) + '\n');
  if (code !== 0) process.exit(code);
}
main().catch(e => { console.error('lysa run failed: ' + (e.stack || e)); process.exit(1); });
