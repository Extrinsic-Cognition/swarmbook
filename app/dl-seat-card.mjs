// dl-seat-card.mjs: THE SEAT CARD (Oct 16 2026; app/dl-society-codes.mjs holds the law of the codes). Under a paid receipt in the checkout
// (dl-direct.js seatCard()), the seat's own card, read from the Worker with the wallet's seat proof (GET /api/premint/seat): its referral code
// and share link (copied in a press); what the code brought (friends who paid, listed and not counted: a referral counts when a Society seat is
// issued, room/society-referrals.mjs); its claim code for Harmony's box (POST /api/premint/tickets/<id>/claim: drawn in a press, shown large
// with its QR, kept in this browser for the buyer's eyes; a new draw kills the old); and the installer's doors (app/nestos-release.json: a
// published release names them; unpublished, the card says so and the code stays the buyer's). Once Harmony redeemed the code, the card says
// the seat is bound and offers no code. His words, Oct 15 2026, in the box conversation: "we can link the 2 things with codes (the browser page
// and the app ide)... they can pay directly on the main page".
// The QR is the claim link (claimURL: the code in the fragment, which no server log holds), drawn by the house's vendored encoder
// (embertide-app/ui/intro/qrcode-generator.js: Kazuhiko Arase's, MIT; the rite's own, tools/embertide-mesh/rite.mjs), a classic script loaded
// on the first draw alone. One load on mount; refresh is the checkout's paint; nothing polls. The words are mine, his to reword.
import {CLAIM_KEY, groupCode, claimURL} from './dl-society-codes.mjs';

export const MANIFEST = './nestos-release.json';
const PLATFORMS = Object.freeze([['macos', 'macOS'], ['windows', 'Windows'], ['linux', 'Linux']]);
const https = (v) => { try { const u = new URL(v); return u.protocol === 'https:' && !u.username && !u.password ? u.href : null; } catch { return null; } };
const dayText = (s) => new Intl.DateTimeFormat('en', {month: 'long', day: 'numeric'}).format(s * 1000);
/** The installer's doors a published nestos.release.v1 manifest names, [{platform, label, href}] over https; none from anything else. */
export function installLinks(manifest) {
  if (!manifest || typeof manifest !== 'object' || manifest.schema !== 'nestos.release.v1' || manifest.status !== 'published') return [];
  return PLATFORMS.map(([platform, label]) => {
    const v = manifest.platforms?.[platform], href = https(v && typeof v === 'object' ? v.url : v);
    return href ? {platform, label, href} : null;
  }).filter(Boolean);
}
let lib = null;
/** The vendored QR encoder, loaded once as a classic script (it is no module): the global it leaves, or null when it cannot load. */
export function loadQR(doc = globalThis.document) {
  if (typeof globalThis.qrcode === 'function') return Promise.resolve(globalThis.qrcode);
  return lib ||= new Promise((resolve) => {
    try {
      const script = doc.createElement('script');
      script.src = new URL('../../qrcode-generator.js', import.meta.url).href;
      script.async = true;
      script.onload = () => resolve(typeof globalThis.qrcode === 'function' ? globalThis.qrcode : null);
      script.onerror = () => { lib = null; resolve(null); };
      doc.head.append(script);
    } catch { lib = null; resolve(null); }
  });
}
/** The SVG of a text as a QR (error correction M, the size the text needs, scalable), or null when the encoder is not here or refuses. */
export function qrSVG(encoder, text) {
  if (typeof encoder !== 'function') return null;
  try {
    const q = encoder(0, 'M');
    q.addData(String(text));
    q.make();
    return q.createSvgTag({cellSize: 4, margin: 8, scalable: true, alt: 'Your Harmony claim link, as a QR code', title: 'Harmony claim'});
  } catch { return null; }
}
/** The line on what the code brought: nothing yet, or n friends paid (counted when their seats are issued). */
export function countLine(n) {
  if (!(n > 0)) return 'Share it: a referral counts when your friend mints a Society seat.';
  return `${n} ${n === 1 ? 'friend has' : 'friends have'} paid with your code. Each counts when their Society seat is issued.`;
}

/**
 * The card under a paid order. api(path, data, headers) and seat() are the checkout's own (dl-direct.js); storage keeps the claim code this
 * browser was shown; fetcher reads the installer's manifest; qr(text) draws the claim link (the vendored encoder by default).
 * {ready, refresh, dispose, state}: ready and refresh resolve to the card's state; dispose invalidates late work.
 */
export function mountSeatCard({root, order, buyer, api, seat, storage = null, fetcher = (...a) => fetch(...a), manifest = MANIFEST, qr = null,
  clipboard = globalThis.navigator?.clipboard, now = () => Date.now()} = {}) {
  const doc = root?.ownerDocument ?? globalThis.document;
  if (!root || !doc?.createElement || !order?.id || typeof api !== 'function' || typeof seat !== 'function') throw new TypeError('a root in a document, the order, the checkout\'s api and seat');
  const drawQR = qr ?? ((text) => loadQR(doc).then((e) => qrSVG(e, text)));
  const key = `${CLAIM_KEY}${order.id}`;
  let revision = 0, disposed = false, ticket = null, claim = null, installs = [], manifestRead = false, status = null;
  const el = (tag, className, text) => { const n = doc.createElement(tag); n.className = className; if (text !== undefined) n.textContent = text; return n; };
  const kept = () => { try { const v = JSON.parse(storage?.getItem(key) ?? 'null'); return v && typeof v.claim === 'string' && /^[0-9A-Z]{12}$/.test(v.claim) ? v : null; } catch { return null; } };
  const keep = (v) => { try { if (v) storage?.setItem(key, JSON.stringify(v)); else storage?.removeItem(key); } catch { /* storage refused: the code lives this page's life */ } };
  const live = (at) => !disposed && at === revision;
  const say = (text) => { if (status) status.textContent = text; };
  const copy = (button, value, label) => async () => {
    if (disposed || button.disabled) return;
    button.disabled = true;
    try {
      if (typeof clipboard?.writeText !== 'function') throw new Error('clipboard unavailable');
      await clipboard.writeText(value);
      say(`${label} copied.`);
    } catch { say(`Couldn’t copy the ${label.toLowerCase()}. Select it and copy by hand.`); }
    finally { button.disabled = false; }
  };
  // the claim code, drawn with the wallet's proof: the Worker keeps its hash, this browser the code, the card its QR
  async function draw(at) {
    try {
      const got = await api(`tickets/${encodeURIComponent(order.id)}/claim`, {}, {'x-seat': await seat()});
      if (!live(at)) return;
      claim = {claim: got.claim, at: now()}; keep(claim);
      render('ready', at);
    } catch (error) { if (live(at)) say(error?.message || 'The code could not be drawn. Try again.'); }
  }
  function render(state, at) {
    if (!live(at)) return;
    const card = el('section', 'seat-card');
    card.dataset.state = state;
    card.setAttribute('aria-label', 'Your seat');
    card.append(el('h3', 'seat-title', 'Your seat.'));
    status = el('p', 'seat-status'); status.setAttribute('role', 'status'); status.setAttribute('aria-live', 'polite');
    if (state === 'loading') status.textContent = 'Reading your seat…';
    else if (state === 'error') {
      status.textContent = ticket === undefined ? 'Your seat is paid; its codes are being prepared. Try again in a moment.' : 'Your seat’s codes could not be read.';
      const retry = el('button', 'seat-retry slot-text-action', 'Try again'); retry.type = 'button';
      retry.addEventListener('click', () => { void refresh(); });
      card.append(retry);
    } else {
      // THE REFERRAL CODE and its link
      card.append(el('h4', 'seat-label', 'Your referral code'));
      const code = el('button', 'seat-code', groupCode(ticket.code)); code.type = 'button'; code.setAttribute('aria-label', `Copy referral code ${ticket.code}`);
      code.addEventListener('click', copy(code, ticket.code, 'Code'));
      const link = el('button', 'seat-link slot-text-action', 'Copy link'); link.type = 'button';
      link.addEventListener('click', copy(link, ticket.shareURL, 'Link'));
      const actions = el('div', 'seat-actions'); actions.append(link);
      const paid = Array.isArray(ticket.referrals?.receipts) ? ticket.referrals.receipts.filter((r) => r?.state === 'paid').length : 0;
      card.append(code, actions, el('p', 'seat-count', countLine(paid)));
      // THE CLAIM CODE for Harmony's box
      card.append(el('h4', 'seat-label', 'Harmony'));
      if (ticket.claimed) {
        card.append(el('p', 'seat-bound', `Bound to your Harmony${Number.isFinite(ticket.claimedAt) ? ` on ${dayText(ticket.claimedAt)}` : ''}. Your Lyssajudron carries this seat.`));
      } else {
        card.append(el('p', 'seat-claim-words', 'In Harmony, open Your box and type this code: it binds this seat to your Lyssajudron, once.'));
        if (claim) {
          const big = el('button', 'seat-claim-code', groupCode(claim.claim)); big.type = 'button'; big.setAttribute('aria-label', `Copy Harmony code ${claim.claim}`);
          big.addEventListener('click', copy(big, claim.claim, 'Harmony code'));
          const qrHost = el('div', 'seat-qr');
          const fresh = el('button', 'seat-claim-new slot-text-action', 'New code'); fresh.type = 'button';
          fresh.addEventListener('click', () => { void draw(at); });
          const row = el('div', 'seat-actions'); row.append(fresh);
          card.append(big, qrHost, el('p', 'seat-qr-words', 'Scan it with your phone for the installer and the code, or type it in Harmony.'), row);
          const mine = claim.claim;
          Promise.resolve().then(() => drawQR(claimURL(mine))).then((svg) => { if (live(at) && claim?.claim === mine && typeof svg === 'string' && svg.startsWith('<svg')) qrHost.innerHTML = svg; }).catch(() => {});
        } else {
          const make = el('button', 'seat-claim-make slot-text-action', 'Show my Harmony code'); make.type = 'button';
          make.addEventListener('click', () => { make.disabled = true; say('Drawing your code…'); void draw(at); });
          card.append(make);
        }
      }
      // THE INSTALLER'S DOORS
      card.append(el('h4', 'seat-label', 'Install Harmony'));
      const install = el('p', 'seat-install');
      if (installs.length) for (const {label, href} of installs) { const a = el('a', 'seat-install-link', label); a.href = href; a.rel = 'noopener'; install.append(a); }
      else install.textContent = manifestRead ? 'Harmony’s installer isn’t published yet. Keep your code: it stays yours.' : 'The installer’s doors could not be read.';
      card.append(install);
    }
    card.append(status);
    root.replaceChildren(card);
  }
  async function refresh() {
    if (disposed) return {state: 'disposed'};
    const at = ++revision;
    render('loading', at);
    const doors = Promise.resolve().then(() => fetcher(manifest, {cache: 'no-store'})).then(async (r) => (r?.ok ? installLinks(await r.json()) : null)).catch(() => null);
    try {
      const got = await api(`seat?buyer=${encodeURIComponent(buyer)}`, undefined, {'x-seat': await seat()});
      const found = Array.isArray(got?.tickets) ? got.tickets.find((t) => t?.orderId === order.id && typeof t.code === 'string') : null;
      const links = await doors;
      if (!live(at)) return {state: 'stale'};
      manifestRead = links !== null; installs = links ?? [];
      if (!found) { ticket = undefined; render('error', at); return state(); }
      ticket = found;
      if (ticket.claimed) { claim = null; keep(null); } else claim = kept();
      render('ready', at);
    } catch { if (live(at)) { ticket = null; render('error', at); } }
    return state();
  }
  const state = () => ({state: root.children?.[0]?.dataset?.state ?? null, orderId: order.id, code: ticket?.code ?? null, claimed: Boolean(ticket?.claimed), claim: claim?.claim ?? null, installs: installs.length});
  const ready = refresh();
  return {ready, refresh, state, dispose() { disposed = true; revision++; status = null; try { root.replaceChildren(); } catch { /* gone with the dialog */ } }};
}
