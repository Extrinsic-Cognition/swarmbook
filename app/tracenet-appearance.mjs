import { createAppearanceState } from '../vendor/embertide-app/ui/intro/room/her-appearance.mjs';
import { join as joinNest } from '../vendor/embertide-app/ui/intro/room/nest-hub.mjs';

const FACE = globalThis.HER_FACE;
const LOOPBACK = new Set(['localhost', '127.0.0.1', '[::1]', '::1']);
const LABELS = { base: 'Base', coat: 'Coat', gold: 'Gold', eyes: 'Eyes', thruster: 'Thruster' };
const DEFAULT_NEST = 'http://127.0.0.1:8904';

// These attributes describe a saved appearance; they do not issue an NFT or
// attest to a wallet, rarity, immutable mint or public creator ownership.
export function appearanceAttributes({ parts, light, gaze }) {
  return [...FACE.PAINT_PARTS.map(part => ({ trait_type: LABELS[part], value: parts[part] })),
    { trait_type: 'Light', value: light }, { trait_type: 'Gaze', value: gaze ?? 'Unopened' }];
}

function valueOf(envelope, name, schema) {
  const ref = envelope?.ref, value = ref?.value;
  return envelope?.name === name && Number.isSafeInteger(ref?.rev) && ref.rev > 0 &&
    value?.schema === schema && value.golem === 'lyssajudron' ? value : null;
}

// Read only the current value. `before`, author, room data and session payloads
// never become profile traits. An unfinished birth still has its saved colours.
export function readAppearance({ paint = null, light = null } = {}) {
  const state = createAppearanceState();
  if (valueOf(paint, FACE.PAINT_REF, FACE.PAINT_SCHEMA)) state.take(FACE.PAINT_REF, paint.ref);
  if (valueOf(light, FACE.LIGHT_REF, FACE.LIGHT_SCHEMA)) state.take(FACE.LIGHT_REF, light.ref);
  return appearanceOf(state.snapshot());
}

function appearanceOf(snapshot) {
  const appearance = { parts: { ...snapshot.parts }, light: snapshot.light, gaze: snapshot.gaze,
    revisions: snapshot.revisions, seq: snapshot.seq,
    source: snapshot.saved.paint || snapshot.saved.light ? 'local' : 'born', mintStatus: 'unverified' };
  return { ...appearance, attributes: appearanceAttributes(appearance) };
}

function localOrigin(base) {
  try {
    const url = new URL(base);
    return url.protocol === 'http:' && LOOPBACK.has(url.hostname) && !url.username && !url.password &&
      url.pathname === '/' && !url.search && !url.hash ? url.origin : null;
  } catch { return null; }
}

// This owner-local preview is explicitly requested for this profile. A public
// visitor never reads their own Nest into somebody else's profile. Two reads,
// once; caller owns cancellation. No timer, poll, signing or publication.
export async function loadAppearance({ handle, hostname, fetcher = globalThis.fetch, signal, nestBase = DEFAULT_NEST } = {}) {
  const fallback = () => readAppearance();
  if (handle !== 'photons_enjoyor' || !LOOPBACK.has(hostname) || signal?.aborted || typeof fetcher !== 'function') return fallback();
  const origin = localOrigin(nestBase);
  if (!origin) return fallback();
  async function read(name) {
    try {
      const url = `${origin}/nest/ref/${name}`;
      const response = await fetcher(url, { cache: 'no-store', credentials: 'omit', redirect: 'error', signal,
        headers: { accept: 'application/json' } });
      if (!response.ok || response.redirected || (response.url && response.url !== url)) {
        await response.body?.cancel?.(); return null;
      }
      const envelope = await response.json();
      return signal?.aborted ? null : envelope;
    } catch { return null; }
  }
  const [paint, light] = await Promise.all([read(FACE.PAINT_REF), read(FACE.LIGHT_REF)]);
  return signal?.aborted ? fallback() : readAppearance({ paint, light });
}

// The owner view follows the same Nest entries as the room. No polling and no
// new connection: joinNest multiplexes on the existing top-window hub. Public
// readers never connect to their own Nest while viewing another person's page.
export function watchAppearance({ handle, hostname, fetcher = globalThis.fetch, nestBase = DEFAULT_NEST, localOwner = false,
  signal, join = joinNest, onChange = () => {}, readTimeoutMs = 8000 } = {}) {
  const state = createAppearanceState();
  let last = null, stopped = false, pending = null, again = false;
  const controller = new AbortController();
  const publish = () => {
    const next = state.snapshot();
    if (!stopped && next !== last) { last = next; onChange(appearanceOf(next)); }
  };
  if (signal?.aborted) return { stop() {}, ready: Promise.resolve() };
  publish();
  const origin = localOrigin(nestBase);
  if ((!localOwner && handle !== 'photons_enjoyor') || !LOOPBACK.has(hostname) || !origin || typeof fetcher !== 'function')
    return { stop() { stopped = true; }, ready: Promise.resolve() };
  const names = [FACE.PAINT_REF, FACE.LIGHT_REF];
  async function read(name, readSignal) {
    try {
      const url = `${origin}/nest/ref/${name}`;
      const response = await fetcher(url, { cache: 'no-store', credentials: 'omit', redirect: 'error', signal: readSignal,
        headers: { accept: 'application/json' } });
      if (!response.ok || response.redirected || (response.url && response.url !== url)) { await response.body?.cancel?.(); return null; }
      const envelope = await response.json();
      return envelope?.name === name ? envelope.ref : null;
    } catch { return null; }
  }
  function refresh() {
    if (stopped) return Promise.resolve();
    if (pending) { again = true; return pending; }
    const cycle = new AbortController(), abortCycle = () => cycle.abort();
    const timer = setTimeout(abortCycle, Number.isFinite(readTimeoutMs) && readTimeoutMs > 0 ? readTimeoutMs : 8000);
    controller.signal.addEventListener('abort', abortCycle, { once: true });
    pending = Promise.all(names.map(name => read(name, cycle.signal))).then(refs => {
      if (stopped) return;
      refs.forEach((ref, i) => state.take(names[i], ref));
      publish();
    }).finally(() => {
      clearTimeout(timer); controller.signal.removeEventListener('abort', abortCycle);
      pending = null;
      if (again && !stopped) { again = false; void refresh(); }
    });
    return pending;
  }
  const sub = join({ nest: origin, types: 'ref', refs: names.join(','),
    onEntry(entry) {
      const p = entry?.payload;
      if (entry?.type === 'ref' && names.includes(p?.name) && state.take(p.name, { rev: p.rev, seq: entry.seq, value: p.value })) publish();
    },
    onStatus(status) { if (status === 'open') void refresh(); },
    onGap() { void refresh(); },
  });
  const stop = () => {
    if (stopped) return;
    stopped = true; controller.abort(); sub.close(); signal?.removeEventListener('abort', stop);
  };
  signal?.addEventListener('abort', stop, { once: true });
  return { stop, refresh };
}
