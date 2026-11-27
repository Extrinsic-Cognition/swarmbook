// scratch-canvas-nest.mjs · a throwaway Nest for the Canvas writers' tests (THE CANVAS IS ONE LOG, the writers' lane, Nov 1 2026): this tree's nest.mjs on a
// temp folder, a loopback port the OS hands out, a place name of its own and keys of its own, no modality, no authority, no signature asked (the env of
// tests/nest-canvas-op.test.mjs). The Nest is asked its place before the writer under test is handed its address, and the helper's own writes ask it again,
// so a port that turned out to answer as another Nest is never written to (layout/tests/scratch-nest.mjs's rule). Never the house's Nest, rite or aiolos.
//   const n = await startScratchNest(); ... n.url ... await n.stop();
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import net from 'node:net';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const NEST_MJS = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'nest.mjs');
const freePort = () => new Promise((ok, no) => { const s = net.createServer(); s.once('error', no); s.listen(0, '127.0.0.1', () => { const p = s.address().port; s.close(() => ok(p)); }); });

/** startScratchNest() -> {url, place, get(p), post(p, body), ref(name), setRef(name, value, seat), canvas(id), entries(types), docRefs(), stop()} */
export async function startScratchNest() {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'canvas-writers-nest-')), place = `canvas-writers-${process.pid}-${Date.now().toString(36)}`;
  const port = await freePort(), url = `http://127.0.0.1:${port}`;
  const env = { ...process.env, NEST_DIR: path.join(tmp, 'nest'), NEST_PORT: String(port), NEST_BIND: '127.0.0.1', NEST_PLACE: place, NEST_KEYS: path.join(tmp, 'keys'),
    NEST_MODALITIES: '0', NEST_AUTHORITY: '0', NEST_REQUIRE_SIG: '0', NEST_UPSTREAM: '' };
  for (const k of ['NEST_PEERS', 'NEST_POLICY', 'NEST_PIN_KEYS', 'NEST_CEILING', 'NEST_DISK_WORKER', 'NEST_FAR_SIGNED', 'NEST_HOUR', 'NEST_CLOCK']) delete env[k];
  const child = spawn(process.execPath, [NEST_MJS], { env, stdio: ['ignore', 'pipe', 'pipe'] });
  let out = ''; child.stdout.on('data', (d) => { out += d; }); child.stderr.on('data', (d) => { out += d; });
  const stop = () => new Promise((done) => {
    const end = () => { try { fs.rmSync(tmp, { recursive: true, force: true }); } catch { /* gone */ } done(); };
    if (child.exitCode != null) return end();
    const t = setTimeout(() => { try { child.kill('SIGKILL'); } catch { /* gone */ } }, 3000);
    child.once('exit', () => { clearTimeout(t); end(); }); child.kill('SIGTERM');
  });
  const raw = async (p, init = {}) => { const r = await fetch(url + p, { cache: 'no-store', ...init }); const text = await r.text(); let body = null; try { body = text ? JSON.parse(text) : null; } catch { body = text; } return { status: r.status, ok: r.ok, body }; };
  const ours = async () => { const h = await raw('/nest/head'); if (!h.ok || h.body.place !== place) throw new Error(`port ${port} answers as ${h.body && h.body.place}, not the scratch Nest: nothing written`); return h.body; };
  for (let i = 0; ; i++) {
    try { await ours(); break; }
    catch (e) { if (/not the scratch Nest/.test(e.message) || i > 150 || child.exitCode != null) { await stop(); throw new Error(`the scratch Nest did not come up: ${e.message}\n${out.slice(-800)}`); } await new Promise((r) => setTimeout(r, 100)); }
  }
  const get = async (p) => (await raw(p)).body;
  const post = async (p, body) => { await ours(); return raw(p, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) }); };
  const ref = async (name) => (await get(`/nest/ref/${name}`))?.ref ?? null;
  const setRef = async (name, value, seat = 'scratch-test') => { const cur = await ref(name); const r = await post(`/nest/ref/${name}`, { seat, value, expect: cur ? cur.rev : 0 }); if (!r.ok) throw new Error(`the scratch ref ${name}: ${r.status} ${JSON.stringify(r.body).slice(0, 200)}`); return r.body.ref; };
  const canvas = async (id) => get(`/nest/canvas/${encodeURIComponent(id)}`);
  const entries = async (types) => { const out = []; let after = 0; for (;;) { const d = await get(`/nest/log?after=${after}&limit=2000&types=${encodeURIComponent(types)}`); const page = (d && d.entries) || []; out.push(...page); if (page.length < 2000) break; after = page[page.length - 1].seq; } return out; };
  const docRefs = async () => Object.keys((await get('/nest/refs?prefix=' + encodeURIComponent('harmony/canvas-doc/')))?.refs || {});
  return { url, place, port, get, post, ref, setRef, canvas, entries, docRefs, stop, log: () => out };
}
