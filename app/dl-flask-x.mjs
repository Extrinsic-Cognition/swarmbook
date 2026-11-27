// app/dl-flask-x.mjs · X HOLDS THE FLASK, the page's half (Nov 19 2026, lane/x-is-the-flasks-name; his words and the law: space-router-x.mjs). In the deposit door's
// box, above the address, in the box's own parts (a stamp and a chip; no style added): "First, your X" and "Connect X". The press goes to X's own consent page
// (PKCE: the verifier stays in this tab, the code comes back through the Worker to this door); back here, the flask's key signs that this X account holds it and
// the Worker trades the code itself. Then the chip says the handle, and the X account sees these credits in Harmony. X comes before the money (ONE NAME FOR HER, Nov 22
// 2026: no price stands before it, and the house's word on who holds this flask, `x`, is taken before this browser's own). Loaded only when the door's box is open.
import { X_PATH, X_BACK, X_AUTHORIZE, X_CLIENT_ID, X_SCOPES, xBackOf } from './space-router-x.mjs';
import { grantSignIn, sealGrantProof } from './space-router-grant.mjs';

export const xWords = { stamp: 'First, your X', chip: 'Connect X', held: 'Your X', no: 'X did not let you in. Try again.' };
const b64u = (b) => btoa(String.fromCharCode(...b)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''), digest = async (s) => new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s)));

/** xRow({ box, flask, store, x, loc, hist, f, ss }): the X row in the deposit box; resolves the handle once this X account holds the flask, else null. x: the handle the house says holds it, null for none (unsaid: this browser's own word) */
export async function xRow({ box, flask, store, x, loc = location, hist = history, f = fetch, ss = sessionStorage }) {
  const stamp = document.createElement('p'), chip = document.createElement('button'), say = box.querySelector('[role=status]');   // the box's own line (the door's box, the address box, the plate after her making)
  stamp.className = 'dl-flask-stamp'; chip.className = 'dl-flask-addr'; chip.type = 'button'; box.prepend(stamp, chip);
  const held = (h) => { stamp.textContent = xWords.held; chip.textContent = h; chip.disabled = true; return h; };
  const kept = x === undefined ? await store('readonly', (s) => s.get('x')).catch(() => null) : x; if (kept) { if (x) await store('readwrite', (s) => s.put(x, 'x')).catch(() => 0); return held(kept); }
  stamp.textContent = xWords.stamp; chip.textContent = xWords.chip;
  chip.addEventListener('click', async () => {
    const verifier = b64u(crypto.getRandomValues(new Uint8Array(32))), state = b64u(crypto.getRandomValues(new Uint8Array(16))), u = new URL(X_AUTHORIZE);
    ss.setItem('dl-x', JSON.stringify({ state, verifier }));
    for (const [k, v] of Object.entries({ response_type: 'code', client_id: X_CLIENT_ID, redirect_uri: loc.origin + X_BACK, scope: X_SCOPES, state, code_challenge: b64u(await digest(verifier)), code_challenge_method: 'S256' })) u.searchParams.set(k, v);
    loc.assign(u.href);
  });
  const back = xBackOf(loc.hash); if (!back) return null;
  hist.replaceState(null, '', loc.pathname + loc.search); const asked = JSON.parse(ss.getItem('dl-x') || 'null'); ss.removeItem('dl-x');
  if (back === 'no' || asked?.state !== back.state) { say.textContent = xWords.no; return null; }
  const text = grantSignIn({ host: loc.host, origin: loc.origin, address: flask.address, x: true, key: [...await digest(asked.verifier)].map((b) => b.toString(16).padStart(2, '0')).join('') });
  const proof = sealGrantProof(text, new Uint8Array(await crypto.subtle.sign('Ed25519', flask.pair.privateKey, new TextEncoder().encode(text))));
  const r = await f(X_PATH, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ code: back.code, verifier: asked.verifier, proof }), cache: 'no-store' }).catch(() => null), j = await r?.json().catch(() => null);
  if (r?.ok && typeof j?.handle === 'string') { await store('readwrite', (s) => s.put(j.handle, 'x')).catch(() => 0); return held(j.handle); }
  say.textContent = typeof j?.error?.message === 'string' ? j.error.message : xWords.no; return null;
}
