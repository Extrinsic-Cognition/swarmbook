import { join as joinNest } from '../vendor/embertide-app/ui/intro/room/nest-hub.mjs';
import { BURNS_MAX, purseBurns, biteEnergy, purseLevel } from '../vendor/embertide-app/ui/intro/room/unit0-liquid.mjs';

export const FUEL_REF = 'house/purse';
const SCHEMA = 'embertide.purse/v1';
const LOOPBACK = new Set(['localhost', '127.0.0.1', '[::1]', '::1']);
const DEFAULT_NEST = 'http://127.0.0.1:8904';

// Only the canonical fraction and the bite's energy reach the renderer. Money,
// burn and ledger details are never profile attributes. Unknown is distinct
// from a known zero. The fraction is the tank's one law (unit0-liquid.mjs
// purseLevel: a thousandth's step, and HIS WORD ON THE TANK, his Oct 16 2026
// 17:17 WEST "make it 50% full", while it stands), as on every glass.
export function readFuel(value) {
  return value?.schema === SCHEMA ? purseLevel(value) : null;
}

// THE PIRANHAS (his Sept 28 2026 21:56: the tank fuel "SLOWLY DEPLETED LIKE FUCKIN PIRANHAS"): each burn the minirouter
// posts is a bite out of the liquid, its energy the one law's (unit0-liquid.mjs biteEnergy). The first read primes the
// seen ids without a bite: what burned before the page opened does not thrash the tank on load.
export function readBite(value, seen) {
  const burns = purseBurns(value);
  if (!seen) return { seen: new Set(burns.map(b => b.id)), energy: 0 };
  let energy = 0;
  for (const b of burns) { if (seen.has(b.id)) continue; seen.add(b.id); energy = Math.max(energy, biteEnergy(b.cost_usd)); }
  if (seen.size > BURNS_MAX * 2) return { seen: new Set(burns.map(b => b.id)), energy };
  return { seen, energy };
}

function localOrigin(base) {
  try {
    const url = new URL(base);
    return url.protocol === 'http:' && LOOPBACK.has(url.hostname) && !url.username && !url.password &&
      url.pathname === '/' && !url.search && !url.hash ? url.origin : null;
  } catch { return null; }
}

// An owner-local view uses the existing multiplexed Nest stream. A public
// visitor never reads their purse into another person's profile. No polling.
// localOwner: the Council's MacBook on his own Mac, as watchAppearance takes it.
export function watchFuel({ handle, hostname, fetcher = globalThis.fetch, nestBase = DEFAULT_NEST, localOwner = false,
  signal, join = joinNest, onChange = () => {}, readTimeoutMs = 8000 } = {}) {
  let revision = 0, level = null, stopped = false, pending = null, again = false, sub = null, seen = null;
  const controller = new AbortController();
  function stop() {
    if (stopped) return;
    stopped = true; controller.abort(); sub?.close(); signal?.removeEventListener('abort', stop);
  }
  const inert = { stop, refresh: () => Promise.resolve() };
  if (signal?.aborted) { stop(); return inert; }
  signal?.addEventListener('abort', stop, { once: true });
  onChange(null, 0);
  const origin = localOrigin(nestBase);
  if (stopped || (!localOwner && handle !== 'photons_enjoyor') || !LOOPBACK.has(hostname) || !origin || typeof fetcher !== 'function') return inert;

  function take(ref) {
    if (stopped || !Number.isSafeInteger(ref?.rev) || ref.rev <= revision || !Object.hasOwn(ref, 'value')) return;
    revision = ref.rev;
    const bite = readBite(ref.value, seen); seen = bite.seen;
    const next = readFuel(ref.value);
    if (next !== level || bite.energy > 0) { level = next; onChange(level, bite.energy); }
  }
  async function read(readSignal) {
    try {
      const url = `${origin}/nest/ref/${FUEL_REF}`;
      const response = await fetcher(url, { cache: 'no-store', credentials: 'omit', redirect: 'error', signal: readSignal,
        headers: { accept: 'application/json' } });
      if (!response.ok || response.redirected || (response.url && response.url !== url)) { await response.body?.cancel?.(); return null; }
      const envelope = await response.json();
      return envelope?.name === FUEL_REF ? envelope.ref : null;
    } catch { return null; }
  }
  function refresh() {
    if (stopped) return Promise.resolve();
    if (pending) { again = true; return pending; }
    const cycle = new AbortController(), abortCycle = () => cycle.abort();
    const timer = setTimeout(abortCycle, Number.isFinite(readTimeoutMs) && readTimeoutMs > 0 ? readTimeoutMs : 8000);
    controller.signal.addEventListener('abort', abortCycle, { once: true });
    pending = read(cycle.signal).then(ref => {
      if (!cycle.signal.aborted) take(ref);
    }).finally(() => {
      clearTimeout(timer); controller.signal.removeEventListener('abort', abortCycle);
      pending = null;
      if (again && !stopped) { again = false; void refresh(); }
    });
    return pending;
  }
  sub = join({ nest: origin, types: 'ref', refs: FUEL_REF,
    onEntry(entry) {
      const p = entry?.payload;
      if (entry?.type === 'ref' && p?.name === FUEL_REF) take(p);
    },
    onStatus(status) { if (status === 'open') void refresh(); },
    onGap() { void refresh(); },
  });
  if (stopped) sub.close();
  return { stop, refresh };
}
