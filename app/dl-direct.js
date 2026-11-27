import { PAYEE, TIERS, TERMS, SEAT_KEY, base64, unsignedPayment, solAmount, validateSignedPayment, seatSignIn, sealSeatProof, seatFields, verifySeatProof } from './dl-direct-protocol.mjs';
import { bindSlotProfile, createSlotProfileResolver } from './dl-slot-profile.js';
import { isPhone, walletBrowseLinks, herAddressOf, mintHash, notHers } from './dl-direct-wallets.js';
import { keptReferral, forgetReferral } from './dl-society-codes.mjs';
import { FIRST_TRACENET } from './tracenet-register.mjs';   // THE PAYEE PER CREATOR (Oct 23 2026): a seat is one creator's, paid to its wallet
const el = id => document.getElementById(id), dialog = el('slot-dialog'), go = el('slot-go'), fields = el('slot-fields'), quote = el('slot-quote'), status = el('slot-status');
const profile = bindSlotProfile({ input: el('slot-twitter'), portrait: el('slot-portrait'), note: el('slot-profile-note'), resolve: createSlotProfileResolver() });
let tier = 'bronze', order = null, wallet = null, buyer = null, busy = false, enabled = false, generation = 0;
let creator = FIRST_TRACENET, recipient = PAYEE;   // whose seat, and the wallet it pays (the Worker's availability names it; the first tracenet's is pinned)
// HER OWN WALLET (Oct 14 2026): a link from Harmony names her, #mint:for=<her address> (dl-direct-wallets.js); her wallet alone buys and holds the seat
let her = herAddressOf(location.hash);
if (her) document.getElementById('mint')?.scrollIntoView({ block: 'start' });   // her fragment names no element: the mint is where it leads
const title = () => TIERS[tier].name;
// THE REFERRAL (Oct 16 2026, dl-society-codes.mjs): the friend's code this browser keeps is said in the fields and sent with the order the checkout
// makes (the Worker freezes it on the order); Remove forgets it. Nothing here counts anything: the Worker's seat does.
const referralLine = () => { const kept = keptReferral(localStorage); el('slot-referral').hidden = !kept || Boolean(order); el('slot-referral-code').textContent = kept ? kept.code : ''; return kept; };
el('slot-referral-clear').addEventListener('click', () => { forgetReferral(localStorage); referralLine(); });
// THE SEAT CARD (Oct 16 2026, dl-seat-card.mjs): under a paid receipt, the seat's referral code and link, its claim code for Harmony's box with
// its QR, and the installer's doors; read from the Worker with the wallet's own proof (seat()), one card per order, refreshed on each paint
let seatView = null;
function seatCard() {
  const host = el('slot-seat');
  if (!order || order.status !== 'paid' || !buyer) { host.hidden = true; return; }
  host.hidden = false;
  if (seatView?.orderId === order.id) { seatView.view?.refresh(); return; }
  seatView?.view?.dispose(); const mine = { orderId: order.id, view: null }; seatView = mine;
  import('./dl-seat-card.mjs?v=society-1').then(m => { if (seatView !== mine) return; mine.view = m.mountSeatCard({ root: host, order, buyer, api, seat, storage: localStorage }); })
    .catch(() => { if (seatView === mine) host.textContent = 'Your seat\'s codes could not be shown. Open My purchases to try again.'; });
}
const notice = text => { status.textContent = text; status.hidden = !text; };
// On a phone the sentence alone is a dead end: one tap reopens the mint inside the wallet, which injects there.
function offer(links = []) {
  if (!links.length) return;
  const row = document.createElement('span'); row.className = 'slot-wallets';
  row.append(...links.map(({ name, href }) => Object.assign(document.createElement('a'), { href, textContent: `Open in ${name}` })));
  status.append(row); row.scrollIntoView({ block: 'nearest' });
}
async function api(path, data, headers = {}) {
  const response = await fetch(`/api/premint/${path}`, { method: data === undefined ? 'GET' : 'POST', headers: data === undefined ? headers : { 'content-type': 'application/json', ...headers }, body: data === undefined ? undefined : JSON.stringify(data), cache: 'no-store', signal: AbortSignal.timeout(25000) });
  const result = await response.json(); if (!response.ok) throw Object.assign(new Error(result.error || 'Please try again.'), { status: response.status }); return result;
}
const storageKey = () => `dyson-mainnet-order-v1:${buyer}:${tier}${creator === FIRST_TRACENET ? '' : `:${creator}`}`;
function save(o) { localStorage.setItem(storageKey(), o.id); order = o; }
// THE SEAT PROOF (dl-direct-protocol.mjs): the wallet signs once, and that signature, never an order id, reads its receipts and opens the
// film's wall and the vault. A proof this browser keeps for the wallet serves while it has a day left; else the wallet signs a fresh one.
async function seat() {
  const kept = localStorage.getItem(`${SEAT_KEY}${buyer}`), f = seatFields(kept);
  if (f?.address === buyer && f.domain === location.host && f.expires - Date.now() > 86400000) return kept;
  if (typeof wallet.signMessage !== 'function') throw new Error('This wallet cannot sign in here. Use Phantom, Solflare or Backpack.');
  const message = seatSignIn({ host: location.host, origin: location.origin, address: buyer });
  const signed = await wallet.signMessage(new TextEncoder().encode(message));   // Phantom answers {signature}, Solflare and Backpack the bytes
  const proof = sealSeatProof(message, Uint8Array.from(signed?.signature ?? signed ?? []));
  if (!await verifySeatProof(proof, { host: location.host, origin: location.origin, now: Date.now() })) throw new Error('The wallet did not sign in as this address. Try again.');
  localStorage.setItem(`${SEAT_KEY}${buyer}`, proof);
  return proof;
}
async function receipts() {
  try { return await api(`receipts?buyer=${encodeURIComponent(buyer)}`, undefined, { 'x-seat': await seat() }); }
  catch (error) { if (error.status === 401) localStorage.removeItem(`${SEAT_KEY}${buyer}`); throw error; }   // a proof refused is not kept: the next connect signs afresh
}
function inspect(o) {
  if (o.recipient !== recipient || o.buyer !== buyer || o.tier !== tier || o.termsVersion !== TERMS || (o.creator ?? FIRST_TRACENET) !== creator) throw new Error('Order details do not match this checkout.');
  return o;
}
function paint() {
  fields.hidden = Boolean(order);
  referralLine(); seatCard();
  el('slot-manage').hidden = !buyer;
  go.disabled = busy || (!enabled && Boolean(buyer) && order?.status !== 'submitted') || order?.status === 'paid';
  if (!order) {
    quote.textContent = her
      ? `Her wallet buys and holds this seat: ${her}. Connect her wallet (her words in Phantom, Solflare or Backpack, or on the Seeker) and pay in real SOL on Solana mainnet. Her pre-mint access is recorded after payment. The NFT is minted later inside Harmony; NFT minting is not live yet. Network fees are additional.`
      : 'Pay in real SOL on Solana mainnet. Your pre-mint access is recorded after payment. The NFT is minted later inside Harmony after completing your Lyssajudron; NFT minting is not live yet. Network fees are additional.';
    go.textContent = buyer ? 'Review SOL payment' : her ? 'Connect her wallet' : 'Connect wallet'; return;
  }
  quote.replaceChildren();
  const summary = document.createElement('p'); summary.textContent = `${solAmount(order.lamports)} SOL · ${title()} · $${TIERS[tier].usd.toLocaleString()} equivalent at quote time. Network fees are additional.`;
  const payee = document.createElement('p'); payee.className = 'slot-recipient'; payee.textContent = `Paid directly to ${recipient}`;
  quote.append(summary, payee);
  if (order.status === 'paid') {
    go.textContent = 'Access reserved'; notice('Payment finalized. Your pre-mint receipt is saved to this wallet. Return to My purchases at any time.');
    const link = document.createElement('a'); link.href = `https://explorer.solana.com/tx/${order.signature}`; link.target = '_blank'; link.rel = 'noopener'; link.textContent = 'View payment receipt ↗'; quote.append(link);
    window.dispatchEvent(new Event('dl-premint-paid'));
  } else if (order.status === 'submitted') { go.textContent = 'Check payment status'; notice('Payment submitted. We are checking finalization. Keep this order and use Check payment status; do not pay again while it is unresolved.'); }
  else if (['expired','failed'].includes(order.status) || Date.now() / 1000 > order.expiresAt) { go.textContent = 'Get a fresh quote'; notice(order.status === 'failed' ? 'The transaction failed. No purchase was recorded; network fees may apply.' : 'This quote has expired. Review a fresh amount before signing.'); }
  else { go.textContent = `Pay ${solAmount(order.lamports)} SOL`; notice('Review the amount above, then approve in your wallet. This purchases pre-mint access.'); }
}
// the wallet this browser carries, connected: her wallet alone when a link names her
async function reach() {
  wallet = window.phantom?.solana || window.solflare || window.backpack?.solana || window.solana;
  if (!wallet?.connect || !wallet?.signTransaction) {
    const mint = new URL(location.href); mint.hash = mintHash(her);   // her name rides into the wallet's own browser
    throw Object.assign(new Error('Open optimism.fit in your Solana wallet’s browser, or install Phantom, Solflare or Backpack.'), { wallets: isPhone(navigator) ? walletBrowseLinks(mint) : [] });
  }
  await wallet.connect(); buyer = wallet.publicKey?.toBase58(); if (!buyer) throw new Error('Wallet did not connect.');
  const refused = notHers(buyer, her);   // her wallet alone: another wallet reads nothing and pays nothing here
  if (refused) { buyer = null; wallet = null; throw new Error(refused); }
}
async function connect() {
  await reach();
  // Access to storage, and the wallet's sign-in (its receipts), must succeed before any signed payment can leave the page: a step that fails
  // leaves the wallet unconnected here, so the next press connects and asks again.
  try {
    const saved = localStorage.getItem(storageKey());
    if (saved) order = inspect((await api(`orders/${saved}`)).order);
    const history = await receipts();
    const pending = history.orders.find(o => o.tier === tier && o.status === 'submitted');
    const paid = history.orders.find(o => o.tier === tier && o.status === 'paid');
    if (pending || paid) save(inspect(pending || paid));
    // the wallet holds a seat, of whichever tier: the wall and the vault open by its proof now, whatever the dialog goes on to show
    if (history.orders.some(o => o.status === 'paid')) window.dispatchEvent(new Event('dl-premint-paid'));
  } catch (error) { buyer = null; order = null; throw error; }
}
// the wallet's purchases, each a way back into its own order (My purchases, and the holder's road below)
function list(orders) {
  const rows = el('slot-reservation-rows'); rows.replaceChildren();
  for (const o of orders) { const li = document.createElement('li'), button = document.createElement('button'); button.className = 'slot-text-action'; button.textContent = `${TIERS[o.tier].name} · ${o.status} · ${solAmount(o.lamports)} SOL`; button.onclick = () => { tier = o.tier; dialog.dataset.tier = tier; el('slot-title').textContent = `${title()}.`; el('slot-price').textContent = `$${TIERS[tier].usd.toLocaleString()} · Pre-mint access.`; save(inspect(o)); el('slot-form').hidden = false; el('slot-reservations').hidden = true; paint(); }; li.append(button); rows.append(li); }
  if (!orders.length) rows.textContent = 'No submitted purchases for this wallet.';
}
// THE HOLDER'S ROAD (Oct 15 2026): a holder on a new browser, or whose kept proof has run out, shows the seat without choosing a tier or meeting
// a price. One press of a [data-mint-holder] control (the film's wall in warm.html, a tracenet's page) opens this dialog on the wallet's
// purchases and starts at once: the wallet connects and signs in once (seat()), and its receipts are read with that proof. A paid one says so
// (dl-premint-paid): the wall and the vault open by the proof this browser now keeps. Nothing else is asked of the Worker: no availability, no
// quote, no order. A step that fails leaves the wallet unconnected, as connect() does. The dialog's words here are mine, his to reword.
async function holder() {
  if (busy) return;
  order = null; buyer = null; wallet = null; enabled = false; her = herAddressOf(location.hash); ++generation;
  delete dialog.dataset.tier; el('slot-title').textContent = 'Your seat.'; el('slot-price').textContent = 'Connect the wallet that holds it and sign in once. No fee, no transaction.';
  el('slot-form').hidden = true; el('slot-reservations').hidden = false; el('slot-new').hidden = true; el('slot-reservation-rows').replaceChildren(); notice('');
  if (!dialog.open) dialog.showModal();
  await work(async () => {
    await reach();
    try {
      const { orders } = await receipts(), held = orders.some(o => o.status === 'paid');
      if (held) window.dispatchEvent(new Event('dl-premint-paid'));   // a seat of any tier: the wall and the vault open by its proof, whatever is listed
      list(orders);
      if (held) notice('Your seat is open in this browser.');
    } catch (error) { buyer = null; throw error; }
  });
}
let sdk;
// The library that builds what the wallet signs is pinned to its published bytes: the browser refuses any other file at this
// address. A new version needs a new hash: curl -s <src> | openssl dgst -sha384 -binary | openssl base64 -A
function web3() {
  if (window.solanaWeb3) return Promise.resolve(window.solanaWeb3);
  return sdk ||= new Promise((resolve, reject) => { const script = document.createElement('script'); script.src = './vendor/solana-web3-1.95.8.iife.min.js'; script.integrity = 'sha384-ujeTtvHxhu2g5lnu14Roii2ajvVKJ74KQ6eo6GGfAi0IrKZ1YkF8N68Iw5VmIJO0'; script.crossOrigin = 'anonymous'; script.onload = () => resolve(window.solanaWeb3); script.onerror = () => { sdk = null; reject(new Error('Wallet library could not load. Try again.')); }; document.head.append(script); });
}
async function work(action) { if (busy) return; busy = true; paint(); try { await action(); } catch (error) { paint(); notice(error.code === 4001 ? 'Wallet approval cancelled. Nothing was sent by this checkout.' : error.message); offer(error.wallets); } finally { busy = false; go.disabled = (!enabled && Boolean(buyer) && order?.status !== 'submitted') || order?.status === 'paid'; } }
async function open(next = 'bronze', bid = null, who = FIRST_TRACENET) {   // who: the creator whose seat (app/tracenet.js names it on its seats)   // bid: a Gold winner's {commitment, lamports} (the Gold month, app/dl-gold-bid.mjs; no page opens this road since Oct 29): the order names it and pays it
  if (busy) return;
  // THE GATE (dl-harmony-doors.mjs; his Oct 22 2026 WEST: "ensure people cannot progress unless they installed the harmony app and did the
  // lyssajudron dmc4 tutorial", armed with the installer): armed, a seat waits for this visit's DysonLight Harmony, where she is saved; the press
  // leads to Harmony's doors instead (the Worker refuses the order all the same)
  const gate = window.dlDoors?.state?.().gate;
  if (gate?.armed && !gate.saved) { window.dlDoors.lead(); return; }
  creator = /^[A-Za-z0-9_]{1,32}$/.test(who ?? '') ? who : FIRST_TRACENET; recipient = creator === FIRST_TRACENET ? PAYEE : null;
  tier =Object.hasOwn(TIERS, next) ? next : 'bronze'; order = null; buyer = null; wallet = null; enabled = false; her = herAddressOf(location.hash);
  const turn = ++generation;
  dialog.dataset.tier = tier; dialog.dataset.goldBid = tier === 'gold' && bid?.commitment ? bid.commitment : ''; el('slot-title').textContent = `${title()}.`;
  el('slot-price').textContent = dialog.dataset.goldBid ? `${(bid.lamports / 1e9).toFixed(4)} SOL · your winning bid, priority access for a month.` : `$${TIERS[tier].usd.toLocaleString()} · Pre-mint access.`;
  el('slot-form').hidden = false; el('slot-reservations').hidden = true; notice(''); paint();
  if (!dialog.open) dialog.showModal();
  try { const config = await api(`availability?creator=${encodeURIComponent(creator)}`); if (turn !== generation) return;
    if (creator !== FIRST_TRACENET) recipient = config.recipient;   // the creator's wallet, as its register names it (the first tracenet's stays pinned)
    enabled = config.enabled && config.recipient === recipient && config.creator === creator && config.cluster === 'mainnet-beta' && config.termsVersion === TERMS;
    if (tier === 'bronze' && !dialog.dataset.goldBid && config.bronzeUsd) el('slot-price').textContent = `$${Number(config.bronzeUsd).toLocaleString()} · ${creator === FIRST_TRACENET ? 'Pre-mint access.' : `@${creator}'s traces, Bronze.`}`;
    paint(); if (!enabled) notice('Purchases are being prepared. Please return shortly.'); }
  catch (error) { if (turn === generation) notice('Checkout is unavailable right now. Please try again later.'); }
}
window.takeSlot = (who) => open('bronze', null, who);
window.takeGoldBid = (bid) => open('gold', bid);   // the Gold scene's winner: pays its bid
document.querySelectorAll('[data-mint-tier]').forEach(link => link.addEventListener('click', e => { e.preventDefault(); void open(link.dataset.mintTier, null, link.dataset.mintCreator); }));
document.querySelectorAll('[data-mint-holder]').forEach(link => link.addEventListener('click', e => { e.preventDefault(); void holder(); }));
dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
el('slot-form').addEventListener('submit', e => { e.preventDefault(); void work(async () => {
  if (!buyer) { await connect(); paint(); return; }
  if (wallet.publicKey?.toBase58() !== buyer) throw new Error('Wallet changed. Close and reopen checkout.');
  if (order?.status === 'submitted') { save(inspect((await api(`orders/${order.id}/verify`, {})).order)); paint(); return; }
  if (order?.status === 'paid') return;
  if (!enabled) throw new Error('New purchases are paused. My purchases and payment recovery remain available.');
  if (order && (['expired','failed'].includes(order.status) || Date.now() / 1000 > order.expiresAt)) { order = null; localStorage.removeItem(storageKey()); }
  if (!order) { const publicProfile = await profile.prepare(); const result = await api('orders', { id: crypto.randomUUID(), tier, buyer, creator: creator === FIRST_TRACENET ? undefined : creator, gold_bid: dialog.dataset.goldBid || undefined, github: el('slot-github').value, email: el('slot-email').value, profile: publicProfile, referral: keptReferral(localStorage)?.code ?? '', visit: window.dlVisit?.state?.().id }); save(inspect(result.order)); paint(); return; }
  // Re-read before signing; another tab may already have submitted this order.
  save(inspect((await api(`orders/${order.id}`)).order));
  if (order.status !== 'open') { paint(); return; }
  const { Transaction } = await web3();
  const signed = await wallet.signTransaction(Transaction.from(unsignedPayment(order)));
  const encoded = base64(signed.serialize()); await validateSignedPayment(order, encoded);
  const id = order.id;
  // Immediately enter recovery mode, even if the HTTP response is lost.
  order = { ...order, status: 'submitted' }; paint();
  try { save(inspect((await api(`orders/${id}/submit`, { signedTransaction: encoded })).order)); }
  catch (error) { notice('Payment status needs checking. Use Check payment status before doing anything else.'); throw error; }
  paint();
  for (let attempt = 0; attempt < 5 && dialog.open && order.status === 'submitted'; attempt++) {
    await new Promise(resolve => setTimeout(resolve, 4000));
    if (!dialog.open) break;
    save(inspect((await api(`orders/${id}/verify`, {})).order)); paint();
  }
}); });
el('slot-manage').addEventListener('click', () => void work(async () => {
  if (!buyer) await connect();
  const { orders } = await receipts();
  el('slot-form').hidden = true; el('slot-reservations').hidden = false; el('slot-new').hidden = false;
  list(orders);
}));
el('slot-new').addEventListener('click', () => { el('slot-form').hidden = false; el('slot-reservations').hidden = true; paint(); });
