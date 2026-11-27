// Confirmed pre-mint reservations supply the portraits orbiting the film.
// This is the configured sale (currently devnet), not the Harmony NFT mint.
// The twelve Saint Seiya faces stay intact. No illustrated buyers enter this feed.
import {createHolderProfileReader} from './dl-holder-profiles.js?v=1';

const WEB3 = new URL('./vendor/solana-web3-1.95.8.iife.min.js', import.meta.url).href;   // the site's own copy, the same bytes the CDN gave (THE PAGES RUN ONLY THEIR OWN SCRIPTS, Nov 20 2026)
const NACL = new URL('./vendor/tweetnacl-1.0.3.fast.min.js', import.meta.url).href;
const BID_SIZE = 109;
const B58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
const say = (selector, text) => { const el = document.querySelector(selector); if (el) el.textContent = text; };
function b58(bytes) {
  let n = 0n, s = '';
  for (const b of bytes) n = n * 256n + BigInt(b);
  while (n > 0n) { s = B58[Number(n % 58n)] + s; n /= 58n; }
  for (const b of bytes) { if (b) break; s = '1' + s; }
  return s;
}
function script(src, globalName) {
  if (window[globalName]) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const el = document.createElement('script'); el.src = src; el.async = true;
    el.onload = () => window[globalName] ? resolve() : reject(new Error(`${globalName} unavailable`));
    el.onerror = () => reject(new Error(`${globalName} could not load`)); document.head.append(el);
  });
}
function sphereReady() {
  if (window.genesisSphere) return Promise.resolve(window.genesisSphere);
  return new Promise(resolve => addEventListener('genesis-sphere', e => resolve(e.detail), {once: true}));
}
async function main() {
  const sphere = await sphereReady();
  sphere.setSnapshot({capacity: 0, seats: []});
  const response = await fetch('./whitelist.json', {cache: 'no-store', signal: AbortSignal.timeout(8000)});
  if (!response.ok) throw new Error('Sale configuration unavailable');
  const cfg = await response.json();
  await Promise.all([script(WEB3, 'solanaWeb3'), script(NACL, 'nacl')]);
  const {create} = await import('../js/poleis-client.js');
  const web3 = window.solanaWeb3, P = create({web3, nacl: window.nacl});
  if (P.PROGRAM_ID.toBase58() !== cfg.program) throw new Error('Sale program mismatch');
  const root = BigInt(cfg.root), saleId = BigInt(cfg.sale ?? 0);
  const conn = new web3.Connection(cfg.rpc, 'confirmed'), sale = P.salePda(root, saleId);
  const filters = [{dataSize: BID_SIZE}, {memcmp: {offset: 2, bytes: b58(P.cat(P.u64le(root), P.u64le(saleId)))}}];
  const profiles = createHolderProfileReader({conn, P, web3, root, sale: saleId, onProfiles: holders => sphere.setHolders(holders)});
  const u64 = (data, at) => new DataView(data.buffer, data.byteOffset, data.byteLength).getBigUint64(at, true);
  let boundary = 0, pending = 0, reading = false, rerun = false, disposed = false;
  async function read() {
    if (disposed) return;
    if (reading) { rerun = true; return; }
    reading = true;
    try {
      const [account, list, slot] = await Promise.all([
        conn.getAccountInfo(sale), conn.getProgramAccounts(P.PROGRAM_ID, {filters}), conn.getSlot('confirmed'),
      ]);
      if (disposed) return;
      clearTimeout(boundary);
      if (!account) {
        profiles.update([]); document.documentElement.dataset.whitelist = 'unopened';
        say('#visual-status', '0 CONFIRMED RESERVATIONS');
        document.getElementById('sphere-stage').dataset.reservations = '0';
        say('#wl-live', 'The whitelist opens on Solana soon.'); return;
      }
      if (!account.owner.equals(P.PROGRAM_ID)) throw new Error('Sale owner mismatch');
      const head = P.Sale.parse(account.data);
      if (!head) throw new Error('Sale account unavailable');
      const now = BigInt(slot), commitEnd = BigInt(head.commitEnd), revealEnd = BigInt(head.revealEnd);
      const phase = now < commitEnd ? 0 : now < revealEnd ? 1 : head.settled ? 3 : 2;
      const bids = list.filter(({account: {data}}) => data[0] === P.DISC.SEAT_BID && data[1] === P.LAYOUT_VERSION && !data[107])
        .map(({pubkey, account: {data}}) => {
          const bidder = new web3.PublicKey(data.slice(18, 50)).toBase58(), nonce = u64(data, 50);
          return {id: `${bidder}:${nonce}`, bidder, nonce, bidAccount: pubkey.toBase58(), deposit: u64(data, 90), revealed: data[106] !== 0};
        }).filter(bid => bid.deposit >= BigInt(head.reserve) && bid.deposit > 0n);
      const members = (phase < 2 ? bids : phase === 2 ? bids.filter(b => b.revealed)
        : head.board.map(e => ({id: `${e.bidder.toBase58()}:${e.nonce}`, bidder: e.bidder.toBase58(), nonce: e.nonce})))
        .sort((a, b) => a.id.localeCompare(b.id)).slice(0, head.seatCount);
      // Updates reconcile against this authoritative list. An event never supplies a buyer.
      profiles.update(members);
      say('#visual-status', `${members.length} CONFIRMED RESERVATIONS · ${cfg.cluster.toUpperCase()}`);
      say('#wl-live', phase === 0 ? `${head.seatCount - members.length} slots open` : phase === 3 ? `${members.length} on the whitelist` : 'Reservations closed');
      document.documentElement.dataset.whitelist = phase === 0 ? 'open' : 'closed';
      document.documentElement.dataset.whitelistCluster = cfg.cluster;
      document.getElementById('sphere-stage').dataset.reservations = String(members.length);
      // One wake at the sale boundary; updates otherwise arrive through chain subscriptions.
      const opened = Date.parse(cfg.openedAt), openedSlot = Number(cfg.openedSlot);
      const slotMs = opened && slot > openedSlot + 1000 ? Math.min(600, Math.max(150, (Date.now() - opened) / (slot - openedSlot))) : 400;
      const next = phase === 0 ? commitEnd : phase === 1 ? revealEnd : null;
      if (next !== null) boundary = setTimeout(() => read().catch(fail), Math.min(2 ** 31 - 1, Number(next - now) * slotMs + 2000));
    } finally {
      reading = false;
      if (rerun && !disposed) { rerun = false; later(); }
    }
  }
  function later() { clearTimeout(pending); pending = setTimeout(() => read().catch(fail), 300); }
  // Subscribe first, so an arrival during the initial read cannot be missed.
  const saleWatch = conn.onAccountChange(sale, later, 'confirmed');
  const bidWatch = conn.onProgramAccountChange(P.PROGRAM_ID, later, 'confirmed', filters);
  const foreground = () => { if (!document.hidden) later(); };
  addEventListener('dl-reservation-confirmed', later);
  document.addEventListener('visibilitychange', foreground);
  addEventListener('pagehide', event => {
    if (event.persisted) return;
    disposed = true; clearTimeout(boundary); clearTimeout(pending); profiles.dispose();
    conn.removeAccountChangeListener(saleWatch).catch(() => {});
    conn.removeProgramAccountChangeListener(bidWatch).catch(() => {});
    removeEventListener('dl-reservation-confirmed', later); document.removeEventListener('visibilitychange', foreground);
  });
  await read();
}
function fail(error) {
  console.warn('whitelist:', error);
  say('#wl-live', 'The whitelist could not be read from Solana just now.');
}
main().catch(fail);
