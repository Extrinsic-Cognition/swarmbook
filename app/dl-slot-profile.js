import { twitterName, validateAvatarURL } from './dl-holder-profiles.js';

const CONSENT = 'Your public X profile will appear beside your reservation. The handle and photo URL are public and linked to your wallet. Supplied by you; not verified by X.';
const OPTIONAL = 'Optional: publish your X handle and photo beside this wallet’s reservation. Supplied by you; not verified by X.';
const UNAVAILABLE = 'Your X photo could not be loaded. Check the handle, or clear the optional X field to continue.';
export class SlotProfileError extends Error {}

// Called only by the buyer editing this form. Visitors use the signed memo's
// saved URL; they never resolve every holder through a third-party service.
export function createSlotProfileResolver({ fetch: fetcher = globalThis.fetch.bind(globalThis), timeoutMs = 8000 } = {}) {
  const cache = new Map();
  return function resolve(input) {
    const handle = twitterName(input);
    if (!handle) return Promise.reject(new SlotProfileError('Use an X handle, or clear the optional X field to continue.'));
    if (cache.has(handle)) return cache.get(handle);
    const pending = (async () => {
      const controller = new AbortController(); let timer;
      try {
        const read = async () => {
          const response = await fetcher(`https://unavatar.io/x/${handle}?json&fallback=false`, {
            credentials: 'omit', redirect: 'error', mode: 'cors', cache: 'no-store', signal: controller.signal,
            headers: { accept: 'application/json' },
          });
          if (!response.ok) throw new Error('lookup-failed');
          const raw = await response.text();
          if (raw.length > 4096) throw new Error('lookup-too-large');
          const avatarUrl = validateAvatarURL(JSON.parse(raw)?.url);
          if (!avatarUrl) throw new Error('invalid-photo');
          return Object.freeze({ handle, avatarUrl });
        };
        return await Promise.race([read(), new Promise((_, reject) => {
          timer = setTimeout(() => { controller.abort(); reject(new Error('lookup-timeout')); }, timeoutMs);
        })]);
      } catch { throw new SlotProfileError(UNAVAILABLE); }
      finally { clearTimeout(timer); controller.abort(); }
    })();
    // Failed results are cached too: editing/clearing is explicit, and a failed
    // blur must not silently trigger a second network lookup on submission.
    cache.set(handle, pending);
    if (cache.size > 32) cache.delete(cache.keys().next().value);
    return pending;
  };
}

export function bindSlotProfile({ input, portrait, note, resolve }) {
  let revision = 0, current = null, message = OPTIONAL, network = '';
  const render = text => { message = text; note.textContent = [message, network].filter(Boolean).join(' '); };
  const clear = () => { current = null; portrait.hidden = true; portrait.removeAttribute('src'); input.removeAttribute('aria-invalid'); };
  input.setAttribute('aria-describedby', note.id);
  note.setAttribute('role', 'status'); note.setAttribute('aria-live', 'polite');
  portrait.referrerPolicy = 'no-referrer';
  async function prepare() {
    const raw = input.value.trim(), turn = ++revision;
    if (!raw) { clear(); render(OPTIONAL); return null; }
    const handle = twitterName(raw);
    if (current?.handle === handle) return current;
    clear();
    try {
      if (!handle) throw new SlotProfileError('Use an X handle, or clear the optional X field to continue.');
      render('Looking up your public X photo…');
      const profile = await resolve(raw);
      if (turn !== revision || input.value.trim() !== raw) throw new SlotProfileError('Your X profile changed. Check it again before bidding.');
      current = profile; portrait.src = profile.avatarUrl; portrait.alt = `@${profile.handle} on X`; portrait.hidden = false;
      render(CONSENT); return current;
    } catch (error) {
      if (turn === revision) { clear(); input.setAttribute('aria-invalid', 'true'); render(error.message || UNAVAILABLE); }
      throw error;
    }
  }
  input.addEventListener('input', () => { revision++; clear(); render(OPTIONAL); });
  input.addEventListener('change', () => { void prepare().catch(() => {}); });
  render(OPTIONAL);
  return Object.freeze({ prepare, setNetworkNotice(text) { network = text; render(message); } });
}
