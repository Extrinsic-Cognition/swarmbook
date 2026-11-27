// THE BID BEHIND "TAKE A SLOT" (his Oct 12 2026 08:5x WEST: "i want people to bid here 10$ for each slot at being able to
// participate to the sale later... DL Harmony begins under trusted access to specific devs based on github link"; 09:0x he founded
// the sale himself, and over my words of state "the fuck is this shit?": so this dialog says almost nothing).
//
// A bid is one transaction the bidder's own wallet signs: a memo carrying their GitHub link and optional X profile (public, on chain) and
// the program's commit_seat_bid at the sale's floor, which is also its escrow deposit. The bid is
// sealed: its secret (the salt) stays in this browser and is written BEFORE the wallet signs, so a sent bid can always be revealed.
// My reservations recovers each deposit through reveal, settlement, claim/refund and rent recovery. The page signs nothing
// itself and holds no key; it sends wallet-signed bytes to the configured, genesis-verified cluster.
const WEB3 = new URL('./vendor/solana-web3-1.95.8.iife.min.js', import.meta.url).href;   // the site's own copy, the same bytes the CDN gave (THE PAGES RUN ONLY THEIR OWN SCRIPTS, Nov 20 2026)
const NACL = new URL('./vendor/tweetnacl-1.0.3.fast.min.js', import.meta.url).href;
const MEMO = 'MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr';
import { slotProfileMemo } from './dl-holder-profiles.js';
import { bindSlotProfile, createSlotProfileResolver, SlotProfileError } from './dl-slot-profile.js';
import { mintTier, createTierLoader, assertDistinctSales, assertSaleEvidence, bidStoreKey, savedBids,
  solAmount, MAX_BID_NONCES, ReservationError, readReservationBid, reservationAction } from './dl-sale-tiers.js?v=reservation-recovery-1';

const $ = selector => document.querySelector(selector);
const hex = bytes => Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
const unhex = s => Uint8Array.from(s.match(/../g), h => parseInt(h, 16));

function script(src, globalName) {
  if (window[globalName]) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const el = document.createElement('script');
    el.src = src; el.async = true;
    el.onload = () => window[globalName] ? resolve() : reject(new Error(`${globalName} is unavailable`));
    el.onerror = () => reject(new Error(`could not load ${globalName}`));
    document.head.append(el);
  });
}
// the injected Solana wallets, in the order people have them
function wallet() {
  const w = window;
  if (w.phantom?.solana?.isPhantom) return w.phantom.solana;
  if (w.solflare?.isSolflare) return w.solflare;
  if (w.backpack?.isBackpack) return w.backpack;
  return w.solana || null;
}
// "github.com/name", "https://github.com/name/", "@name" or "name" -> name, or null
function githubName(text) {
  const m = String(text || '').trim().match(/^(?:https?:\/\/)?(?:www\.)?(?:github\.com\/)?@?([A-Za-z0-9](?:[A-Za-z0-9-]{0,37}[A-Za-z0-9])?)\/?$/);
  return m ? m[1] : null;
}

const configuration = createTierLoader(), apis = new Map();
async function chain(id) {
  const cfg = await configuration(id);
  if (!cfg) throw new ReservationError(`${mintTier(id).name} reservations are not open yet.`);
  if (id === 'gold') assertDistinctSales(await configuration('bronze'), cfg);
  if (apis.has(id)) return apis.get(id);
  await Promise.all([script(WEB3, 'solanaWeb3'), script(NACL, 'nacl')]);
  const { create } = await import('../js/poleis-client.js');
  const web3 = window.solanaWeb3, P = create({ web3, nacl: window.nacl });
  if (P.PROGRAM_ID.toBase58() !== cfg.program) throw new Error('whitelist.json names another program');
  const root = BigInt(cfg.root), saleId = BigInt(cfg.sale);
  const api = { web3, P, root, saleId, cfg, conn: new web3.Connection(cfg.rpc, 'confirmed'), sale: P.salePda(root, saleId) };
  apis.set(id, api);
  return api;
}
async function inspect(api) {
  const { conn, sale, P, cfg } = api;
  const [account, registryAccount, slot, genesisHash] = await Promise.all([
    conn.getAccountInfo(sale), conn.getAccountInfo(P.registryPda(api.root)), conn.getSlot('confirmed'), conn.getGenesisHash(),
  ]);
  if (!account) throw new ReservationError(`${mintTier(cfg.tier).name} reservations are not open yet.`);
  const head = P.Sale.parse(account.data);
  const phase = assertSaleEvidence({ cfg, program: P.PROGRAM_ID.toBase58(), saleAddress: sale.toBase58(),
    owner: account.owner.toBase58(), executable: account.executable, head, genesisHash, slot });
  const registry = registryAccount && P.Registry.parse(registryAccount.data);
  if (!registry || registryAccount.owner.toBase58() !== cfg.program || registryAccount.executable ||
      registry.unit !== api.root || registry.root !== api.root) throw new ReservationError('The society registry could not be verified.');
  return { head, phase, registry };
}

const dialog = $('#slot-dialog'), form = $('#slot-form'), input = $('#slot-github'), go = $('#slot-go'), status = $('#slot-status');
const twitter = $('#slot-twitter');
const fields = $('#slot-fields'), title = $('#slot-title'), price = $('#slot-price'), quote = $('#slot-quote');
const close = dialog.querySelector('.dialog-close');
const manage = $('#slot-manage'), reservations = $('#slot-reservations'), rows = $('#slot-reservation-rows'), back = $('#slot-new');
const settle = $('#slot-settle');
let review = null;
let selectedTier = 'bronze', revision = 0, available = false, busy = false;
const profileInput = bindSlotProfile({ input: twitter, portrait: $('#slot-portrait'), note: $('#slot-profile-note'), resolve: createSlotProfileResolver() });
const say = text => { status.textContent = text; status.hidden = !text; };
const showNetwork = (cfg, phase) => {
  const devnet = cfg.cluster === 'devnet';
  profileInput.setNetworkNotice(devnet ? 'This reservation is on Solana devnet and uses test SOL.' : '');
  go.textContent = phase !== 'commit' ? 'View my reservations' : devnet ? 'Deposit test SOL' : 'Deposit for pre-mint access';
  quote.textContent = `Fixed deposit: ${solAmount(cfg.depositLamports)} ${devnet ? 'test SOL' : 'SOL'} · ${cfg.cluster}. ` +
    'The USD price is the launch target. Your deposit stays in escrow until settlement and claim; it is not an allocated seat. Wallet fees and account rent are additional.';
};

export async function send(api, provider, me, instructions) {
  const { web3, conn } = api;
  const tx = new web3.Transaction().add(...instructions);
  const { blockhash, lastValidBlockHeight } = await conn.getLatestBlockhash('confirmed');
  tx.feePayer = me; tx.recentBlockhash = blockhash;
  if (provider.publicKey && provider.publicKey.toString() !== me.toBase58()) throw new ReservationError('Your wallet changed. Review this action again.');
  const signed = await provider.signTransaction(tx);
  const signature = await conn.sendRawTransaction(signed.serialize());
  const confirmation = await conn.confirmTransaction({ signature, blockhash, lastValidBlockHeight }, 'confirmed');
  if (confirmation?.value?.err !== null) throw new Error('Reservation was not confirmed');
  // This is a refresh hint only; readers recheck chain evidence themselves.
  dispatchEvent(new CustomEvent('dl-reservation-confirmed', { detail: { signature } }));
  return signature;
}

async function connect() {
  const provider = wallet();
  if (!provider) throw new ReservationError('No Solana wallet in this browser.');
  await provider.connect();
  return provider;
}

// Five bounded RPC reads per refresh; at most 16 bid records/hashes. No background polling.
async function walletReservations(api, me) {
  const evidence = await inspect(api), { P, conn, cfg, root, saleId } = api;
  const pdas = Array.from({ length: MAX_BID_NONCES }, (_, n) => P.seatBidPda(root, saleId, me, BigInt(n)));
  const accounts = await conn.getMultipleAccountsInfo(pdas);
  const secrets = new Map(savedBids(localStorage, cfg, me.toBase58()).map(b => [b.nonce.toString(), b]));
  const entries = await Promise.all(accounts.map(async (account, n) => {
    const bid = readReservationBid({ account, cfg, bidderBytes: me.toBytes(), nonce: n });
    if (!bid) return null;
    const secret = secrets.get(String(n));
    const secretMatches = !!secret && hex(await P.seatCommitment(secret.price, bid.nonce, unhex(secret.salt), me)) === hex(bid.commitment);
    const winner = evidence.head.board.some(entry => entry.bidder.equals(me) && entry.nonce === bid.nonce);
    const state = reservationAction({ ...evidence, bid, winner, frozen: evidence.registry.frozen, secretMatches });
    return { ...bid, ...state, secret: secretMatches ? secret : null };
  }));
  return { ...evidence, entries: entries.filter(Boolean) };
}

function renderReservations(api, provider, me, snapshot) {
  review = { api, provider, me };
  form.hidden = true; manage.hidden = true; reservations.hidden = false;
  back.hidden = snapshot.phase !== 'commit' || snapshot.registry.frozen;
  rows.replaceChildren();
  settle.hidden = snapshot.phase !== 'settle' || !snapshot.entries.some(b => b.revealed && !b.done);
  for (const entry of snapshot.entries) {
    const row = document.createElement('li'), detail = document.createElement('div'), name = document.createElement('strong');
    const note = document.createElement('p');
    name.textContent = `Reservation ${Number(entry.nonce) + 1}`;
    note.textContent = entry.label;
    detail.append(name, note); row.append(detail);
    if (entry.action) {
      const button = document.createElement('button'); button.type = 'button'; button.dataset.reservationAction = entry.action;
      button.textContent = ({ reveal: 'Reveal', claim: 'Claim access', refund: `Refund ${solAmount(entry.deposit)} ${api.cfg.cluster === 'devnet' ? 'test SOL' : 'SOL'}`, close: 'Recover rent' })[entry.action];
      button.addEventListener('click', () => run(() => act(entry.action, entry.nonce)));
      row.append(button);
    }
    rows.append(row);
  }
  if (!snapshot.entries.length) {
    const empty = document.createElement('li'); empty.textContent = 'No reservation deposits for this wallet in this sale.'; rows.append(empty);
  }
  quote.textContent = snapshot.phase === 'settled'
    ? `Settlement price: ${solAmount(snapshot.head.clearing)} ${api.cfg.cluster === 'devnet' ? 'test SOL' : 'SOL'}. Claim uses your existing escrow; it does not charge another deposit. Wallet fees and any new holder account rent are additional.`
    : snapshot.phase === 'reveal' ? 'Reveal each deposit before the window closes. Already revealed deposits are kept. An unrevealed deposit can be refunded after the window, even if its secret is missing.'
    : snapshot.phase === 'settle' ? 'The reveal window has ended. Settle to determine allocations, or refund an unrevealed deposit.'
    : 'Deposits remain in escrow. Return during the reveal window using this browser, where your reveal secret is saved.';
  // The monetary review stays visible in management mode as well.
  reservations.prepend(quote);
}

async function showReservations(id) {
  const api = await chain(id);
  await inspect(api); // Sale and network are checked before opening the wallet.
  const provider = await connect(), me = new api.web3.PublicKey(provider.publicKey.toString());
  const snapshot = await walletReservations(api, me);
  renderReservations(api, provider, me, snapshot);
  dispatchEvent(new CustomEvent('dl-wallet', { detail: me.toBase58() }));
}

async function act(action, nonce) {
  const { api, provider, me } = review;
  if (provider.publicKey?.toString() !== me.toBase58()) throw new ReservationError('Your wallet changed. Reopen My reservations.');
  const snapshot = await walletReservations(api, me);
  const entry = snapshot.entries.find(b => b.nonce === nonce);
  if (action === 'settle') {
    if (snapshot.phase !== 'settle' || !snapshot.entries.some(b => b.revealed && !b.done)) {
      renderReservations(api, provider, me, snapshot); say('The sale state changed. Review your reservations again.'); return;
    }
  } else if (!entry || entry.action !== action) {
    renderReservations(api, provider, me, snapshot); say('This reservation has changed. Review the available action.'); return;
  }
  const { P, root, saleId } = api;
  const instruction = action === 'settle' ? P.settleSeats(me, root, saleId)
    : action === 'reveal' ? P.revealSeatBid(me, root, saleId, nonce, entry.secret.price, unhex(entry.secret.salt))
    : action === 'claim' ? P.claimSeat(me, root, saleId, nonce, snapshot.registry.root)
    : action === 'refund' ? P.reclaimSeatBid(me, root, saleId, nonce)
    : P.closeSeatBid(me, root, saleId, nonce);
  say('Review this action in your wallet…');
  await send(api, provider, me, [instruction]);
  renderReservations(api, provider, me, await walletReservations(api, me));
  say(({ settle: 'Settlement confirmed.', reveal: 'Revealed. Allocation follows settlement.', claim: 'Your pre-mint access is claimed.', refund: 'Your full deposit was refunded.', close: 'Account rent returned to your wallet.' })[action]);
}

async function take(id) {
  const api = await chain(id), evidence = await inspect(api);
  showNetwork(api.cfg, evidence.phase);
  if (evidence.phase !== 'commit' || evidence.registry.frozen) { await showReservations(id); return; }
  const { web3, P, root, saleId, conn, head } = { ...api, ...evidence };
  const name = githubName(input.value);
  if (!name) { say('Your GitHub?'); input.focus(); return; }
  const profile = await profileInput.prepare(), memoText = slotProfileMemo(name, profile);
  if (!memoText) throw new SlotProfileError('Check your profile, or clear the optional X field to continue.');
  const provider = await connect(), me = new web3.PublicKey(provider.publicKey.toString());
  const current = await inspect(api);
  if (current.phase !== 'commit' || current.registry.frozen) throw new ReservationError('New deposits have closed. Open My reservations.');
  const pdas = Array.from({ length: MAX_BID_NONCES }, (_, n) => P.seatBidPda(root, saleId, me, BigInt(n)));
  const taken = await conn.getMultipleAccountsInfo(pdas);
  const free = taken.findIndex(a => !a);
  if (free < 0) { say('Open My reservations to review your existing deposits.'); return; }
  // A delayed/unknown transaction must never lose its reveal secret on a retry of the same PDA.
  const previous = savedBids(localStorage, api.cfg, me.toBase58()).find(b => b.nonce === BigInt(free));
  const nonce = BigInt(free), price = BigInt(head.reserve), salt = previous ? unhex(previous.salt) : crypto.getRandomValues(new Uint8Array(32));
  if (previous && previous.price !== price) throw new ReservationError('An earlier deposit has different terms. Open My reservations.');
  localStorage.setItem(bidStoreKey(api.cfg, me.toBase58(), free), JSON.stringify({ salt: hex(salt), price: price.toString(), github: name, at: Date.now() }));
  const memo = new web3.TransactionInstruction({ programId: new web3.PublicKey(MEMO), keys: [{ pubkey: me, isSigner: true, isWritable: false }], data: new TextEncoder().encode(memoText) });
  say('Review your escrow deposit in your wallet…');
  await send(api, provider, me, [memo, P.commitSeatBid(me, root, saleId, nonce, await P.seatCommitment(price, nonce, salt, me))]);
  renderReservations(api, provider, me, await walletReservations(api, me));
  dispatchEvent(new CustomEvent('dl-wallet', { detail: me.toBase58() }));
  say('Deposit confirmed in escrow. Return to reveal it; your seat is not allocated yet.');
}

// A selected tier remains fixed during wallet interaction, including asynchronous profile lookup.
async function run(work) {
  if (!available || busy) return;
  busy = true; go.disabled = true; input.disabled = true; twitter.disabled = true; close.disabled = true;
  manage.disabled = true; back.disabled = true; settle.disabled = true;
  for (const button of rows.querySelectorAll('button')) button.disabled = true;
  try { await work(); }
  catch (error) {
    console.warn('slot:', error);
    say(error instanceof SlotProfileError || error instanceof ReservationError ? error.message : error?.message?.includes('User rejected') ? 'Not signed.' : 'Could not confirm this action. Reopen My reservations to check the chain before trying again.');
  } finally {
    busy = false; go.disabled = !available; input.disabled = false; twitter.disabled = false; close.disabled = false;
    manage.disabled = false; back.disabled = false; settle.disabled = false;
    for (const button of rows.querySelectorAll('button')) button.disabled = false;
  }
}
form.addEventListener('submit', event => { event.preventDefault(); void run(() => take(selectedTier)); });
manage.addEventListener('click', () => { void run(() => showReservations(selectedTier)); });
back.addEventListener('click', () => { if (!busy) window.takeSlot(selectedTier); });
settle.addEventListener('click', () => { void run(() => act('settle')); });
close.addEventListener('click', () => { if (!busy) dialog.close(); });
dialog.addEventListener('cancel', event => { if (busy) event.preventDefault(); });
dialog.addEventListener('close', () => { revision++; });
window.takeSlot = (id = 'bronze') => {
  if (busy) return;
  const tier = mintTier(id), turn = ++revision;
  selectedTier = id; available = false; review = null;
  form.hidden = false; reservations.hidden = true; manage.hidden = true;
  form.insertBefore(quote, go);
  dialog.dataset.tier = id; dialog.setAttribute('aria-label', tier.name);
  title.textContent = `${tier.name}.`;
  price.textContent = `$${tier.usd.toLocaleString('en-US')} · ${tier.description}`;
  quote.textContent = '';
  fields.hidden = true; go.disabled = true; go.textContent = 'Checking availability…'; say('');
  profileInput.setNetworkNotice('');
  if (!dialog.open) dialog.showModal();
  void chain(id).then(async api => {
    const evidence = await inspect(api);
    if (turn !== revision) return;
    available = true; fields.hidden = evidence.phase !== 'commit' || evidence.registry.frozen;
    showNetwork(api.cfg, evidence.phase); go.disabled = false; manage.hidden = evidence.phase !== 'commit';
    if (evidence.registry.frozen) go.textContent = 'View my reservations';
    if (evidence.phase === 'commit' && !evidence.registry.frozen) input.focus(); else go.focus();
  }).catch(error => {
    if (turn !== revision) return;
    go.textContent = 'Not open yet';
    say(error instanceof ReservationError ? error.message : 'Reservation availability could not be checked. Please try again.');
  });
};
for (const id of ['bronze', 'gold']) $('.mint-dock [data-mint-tier="'+id+'"]')?.addEventListener('click', event => {
  event.preventDefault(); window.takeSlot(id);
});
