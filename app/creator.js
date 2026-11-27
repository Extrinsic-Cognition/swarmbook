// creator.js: BECOME A CREATOR, the page's half (creator.html; the doors: worker/creators.mjs, worker/connect.mjs). His Oct 23 2026 WEST: "it has to be
// for more creators to come and do the same as well"; his road: "cards for the first tracenet only, every other creator paid in SOL directly; keep
// Connect in the tree as an optional switch a creator can turn on". One wallet does everything: it signs THE SEAT PROOF once (dl-direct-protocol.mjs,
// the same Sign In With Solana the checkout uses; kept in this browser under SEAT_KEY), claims a handle, publishes a drop, and may turn the card road on.
// THE DROP IS SIGNED BY ITS CREATOR (Oct 25 2026, app/tracenet-drop-line.mjs): a drop's line (its words, the bytes' sha256, its instant and the hash of
// the creator's last signed line) is signed by the same wallet at Publish, once per drop, and the door keeps the signature beside the line.
import { SEAT_KEY, encode58, seatSignIn, sealSeatProof, verifySeatProof } from './dl-direct-protocol.mjs';
import { HANDLE } from './tracenet-register.mjs';
import { dropId, dropLineText, headOf } from './tracenet-drop-line.mjs';
const CREATORS = '/api/premint/creators';   // worker/creators.mjs PATH
const CONNECT = { onboard: '/api/premint/connect/onboard', price: '/api/premint/connect/price', status: '/api/premint/connect/status' };   // worker/connect.mjs PATHS

const $ = (id) => document.getElementById(id);
const say = (id, text, bad = false) => { const n = $(id); n.textContent = text; n.className = bad ? 'note bad' : 'note'; };
const S = { wallet: null, proof: null, handle: null, register: null, provider: null };
const hex = (b) => Array.from(new Uint8Array(b), (x) => x.toString(16).padStart(2, '0')).join('');

/** The wallet's seat proof: kept from an earlier sign-in in this browser, or signed now (one message, once). */
async function proofOf(provider, address) {
  const key = `${SEAT_KEY}:${address}`;
  try { const kept = localStorage.getItem(key); if (kept && (await verifySeatProof(kept, { host: location.host, origin: location.origin, now: Date.now() }))?.buyer === address) return kept; } catch { /* no storage */ }   // the check is async (an Ed25519 verify): unawaited, a kept proof was never taken and every visit signed again
  const text = seatSignIn({ host: location.host, origin: location.origin, address });   // the sign-in's text, as the checkout signs it
  const { signature } = await provider.signMessage(new TextEncoder().encode(text), 'utf8');
  const proof = sealSeatProof(text, new Uint8Array(signature));
  try { localStorage.setItem(key, proof); } catch { /* kept as long as the page */ }
  return proof;
}
const api = async (path, { method = 'GET', body, headers = {} } = {}) => {
  const r = await fetch(path, { method, headers: { ...(S.proof ? { 'x-seat': S.proof } : {}), ...(body && !(body instanceof Uint8Array) ? { 'content-type': 'application/json' } : {}), ...headers }, body: body instanceof Uint8Array ? body : body ? JSON.stringify(body) : undefined, cache: 'no-store' });
  const answer = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(answer.error ?? `${r.status}`);
  return answer;
};
/** The creator this wallet holds, if any: the Worker has no door by wallet, so the page remembers the handle it claimed here, or reads ?of=<handle>
 *  (the first tracenet was never claimed in a browser); either way the register's own wallet must be the one signed in. */
async function mine() {
  let handle = null; try { handle = localStorage.getItem(`tracenet.creator:${S.wallet}`); } catch { handle = null; }
  handle = handle || new URLSearchParams(location.search).get('of');
  if (!handle) return null;
  try { const register = await api(`${CREATORS}/${handle}`); return register.wallet === S.wallet ? register : null; } catch { return null; }
}
function paint() {   // one step at a time (his "this shit is ugly as fuck"): the wallet, then the handle, then yours
  $('connect').hidden = Boolean(S.wallet); $('address').hidden = !S.wallet;
  $('claim').hidden = !S.wallet || Boolean(S.register);
  // the first tracenet publishes through the house (its drops keep the Nest's sanitization receipt), so its page has no dropzone here
  $('mine').hidden = !S.register; $('publish').hidden = !S.register || S.register.source === 'asset'; $('card').hidden = !S.register; $('subs').hidden = !S.register;
  if (S.register) {
    const page = `${location.origin}/${S.register.handle}`; $('page').href = page; $('page').textContent = page.replace(/^https?:\/\//, '');
    const n = S.register.items.length; $('mine-note').textContent = `${n} drop${n === 1 ? '' : 's'} · paid to ${S.register.wallet.slice(0, 4)}…${S.register.wallet.slice(-4)}`;
    const t = S.register.tank; say('sub-note', t ? `$${t.usd} · ${t.days} days` : 'No price'); if (t) $('sub-usd').value = String(t.usd);
  }
}
// the drop: a file dropped (or picked) asks only for its title; Publish sends it
const chosen = (file) => {
  if (!file) return;
  const dt = new DataTransfer(); dt.items.add(file); $('file').files = dt.files;
  $('drop-what').textContent = file.name; $('title-field').hidden = false; $('drop-row').hidden = false;
  if (!$('title').value) $('title').value = file.name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ');
  $('title').focus(); say('drop-note', '');
};
$('file').addEventListener('change', () => chosen($('file').files?.[0]));
for (const [ev, on] of [['dragenter', true], ['dragover', true], ['dragleave', false], ['drop', false]]) $('dropzone').addEventListener(ev, (e) => { e.preventDefault(); $('dropzone').classList.toggle('over', on); if (ev === 'drop') chosen(e.dataTransfer?.files?.[0]); });
$('card-switch').addEventListener('click', (e) => { e.preventDefault(); const on = !$('card-switch').classList.contains('on'); $('card-switch').classList.toggle('on', on); $('card-row').hidden = !on; if (on) void cardStatus(); });
$('connect').addEventListener('click', async () => {
  const provider = window.solana ?? window.phantom?.solana;
  if (!provider?.connect) { say('wallet-note', 'No Solana wallet in this browser.', true); return; }
  try {
    const { publicKey } = await provider.connect();
    S.provider = provider; S.wallet = publicKey.toBase58(); $('address').textContent = `${S.wallet.slice(0, 6)}…${S.wallet.slice(-4)}`;
    S.proof = await proofOf(provider, S.wallet);
    S.register = await mine(); paint();
    if (S.register) void cardStatus();
  } catch (e) { say('wallet-note', e.message, true); }
});
$('create').addEventListener('click', async () => {
  const handle = $('handle').value.trim().replace(/^@/, '');
  if (!HANDLE.test(handle)) { say('claim-note', 'An X handle: letters, digits, underscore.', true); return; }
  $('create').disabled = true;
  try {
    await api(CREATORS, { method: 'POST', body: { handle, name: $('name').value, line: $('line').value, avatar: $('avatar').value || undefined } });
    try { localStorage.setItem(`tracenet.creator:${S.wallet}`, handle); } catch { /* the page keeps it */ }
    S.register = await api(`${CREATORS}/${handle}`); paint(); say('claim-note', '');
  } catch (e) { say('claim-note', e.message, true); }
  $('create').disabled = false;
});
$('drop').addEventListener('click', async () => {
  const file = $('file').files?.[0], title = $('title').value.trim().slice(0, 120).trim(), kind = $('kind').value.trim() || 'trace';   // the door's own cut of the title, so the line signed is the line kept
  if (!file || !title) { say('drop-note', 'A file and a title.', true); return; }
  $('drop').disabled = true; say('drop-note', 'Sign the drop in your wallet…');
  try {
    const bytes = new Uint8Array(await file.arrayBuffer()), sha256 = hex(await crypto.subtle.digest('SHA-256', bytes));
    const published = new Date().toISOString(), prev = await headOf(S.register);   // the hash of this tracenet's last signed line, read from its own register
    const text = dropLineText({ handle: S.register.handle, wallet: S.register.wallet, id: dropId(published, title), title, kind, file: file.name, bytes: bytes.length, sha256, published, prev });
    const { signature } = await S.provider.signMessage(new TextEncoder().encode(text), 'utf8');
    say('drop-note', 'Publishing…');
    const made = await api(`${CREATORS}/${S.register.handle}/drops`, { method: 'POST', body: bytes, headers: { 'x-title': title, 'x-kind': kind, 'x-file': file.name, 'x-published': published, 'x-prev': prev,
      'x-sig': encode58(new Uint8Array(signature)), 'content-type': file.type || 'application/octet-stream', 'content-length': String(bytes.length) } });
    S.register = await api(`${CREATORS}/${S.register.handle}`); paint();
    say('drop-note', `Published and signed · ${made.sha256.slice(0, 8)}`); $('title').value = ''; $('file').value = '';
    $('drop-what').textContent = 'Drop a trace'; $('title-field').hidden = true; $('drop-row').hidden = true;
  } catch (e) { say('drop-note', e.message, true); }
  $('drop').disabled = false;
});
async function cardStatus() {
  try { const s = await api(`${CONNECT.status}?handle=${S.register.handle}`); say('card-note', s.card ? `$${s.usd} a month by card · 30 % to the tank` : s.account ? (s.onboarded ? 'Set a price.' : 'Finish Stripe.') : 'Stripe pays you out · 30 % to the tank'); if (s.usd) $('usd').value = String(s.usd); if (s.card) $('card-switch').classList.add('on'); }
  catch (e) { say('card-note', /not set up/.test(e.message) ? 'Cards are not on for this site yet.' : e.message, true); }
}
$('price').addEventListener('click', async () => {
  const usd = Number($('usd').value);
  try { const p = await api(CONNECT.price, { method: 'POST', body: { handle: S.register.handle, usd } }); say('card-note', `Price set: $${p.usd} a month.`); void cardStatus(); } catch (e) { say('card-note', e.message, true); }
});
// THE FAN PAYS FROM THE TANK (worker/tracenet-tank.mjs): the price a subscriber's Space Router tank pays for 30 days, named by this wallet
$('sub-price').addEventListener('click', async () => {
  const usd = Number($('sub-usd').value);
  try { const p = await api(`${CREATORS}/${S.register.handle}/price`, { method: 'POST', body: { usd } }); S.register.tank = { ...(S.register.tank ?? {}), usd: p.usd, days: p.days }; say('sub-note', `$${p.usd} · ${p.days} days`); }
  catch (e) { say('sub-note', e.message, true); }
});
$('onboard').addEventListener('click', async () => {
  try { const { url } = await api(CONNECT.onboard, { method: 'POST', body: { handle: S.register.handle, back: location.href.split('?')[0] } }); location.assign(url); } catch (e) { say('card-note', e.message, true); }
});
if (new URLSearchParams(location.search).get('connect') === 'return') say('card-note', 'Back from Stripe: connect your wallet to read the state.');
