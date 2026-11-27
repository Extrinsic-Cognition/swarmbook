// gate.mjs: the bench gate for node proofs that open a headless Chrome on lysa (board-rest, well-at-rest, isa, mint-clock, the glass bench).
// gate(host) returns { ok, why } or throws with gate.sh's line. Nothing is asked for a local host, and LYSA_GATE=0 passes (gate.sh says so).
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const GATE = fileURLToPath(new URL('./gate.sh', import.meta.url));
export const isLocal = (host) => /^(localhost|127\.0\.0\.1|::1)$/.test(String(host).replace(/^[^@]*@/, ''));
export function gate(host) {
  if (isLocal(host)) return { ok: true, why: 'local' };
  try { return { ok: true, why: execFileSync('sh', [GATE, host], { encoding: 'utf8', timeout: 50000, stdio: ['ignore', 'pipe', 'pipe'] }).trim() }; }
  catch (e) {
    const why = (String(e.stdout || '').trim() || String(e.stderr || '').trim() || e.message).split('\n')[0];
    throw new Error(`${why} · not now (LYSA_GATE=0 passes; tools/embertide-mesh/lysa-memory/LANDING.md)`);
  }
}
