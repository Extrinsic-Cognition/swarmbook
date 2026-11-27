// her-door.mjs · STAKE IN HER, SEND YOUR LIGHT (Nov 22 2026, his tap "Yes, build them" on "Build the page doors next, on the Pantheon session's page?"; the
// design his "should be B" and "Yes, draw it" chose: one stake, in her, the meta-swarm; its light to a wish or to the futarchy; poleis/door/src/lib.rs has
// his words). The doors' glue: every byte a wallet signs and every word of a refusal is the door's law in Rust (poleis/door, ./wasm/poleis-door.wasm, no
// imports); this file reads the chain, hands the wallet what the module wrote, sends it and says what came of it. Her pool is born at the launch, his
// sitting: until a chain names it no door shows (a practice chain names it: ?rpc=http://127.0.0.1:<port>&pool=<address>).
const q = new URLSearchParams(location.search), RPC = q.get('rpc') || '', POOL = /^http:\/\/(127\.0\.0\.1|localhost):\d+\/?$/.test(RPC) ? q.get('pool') : null;
const $ = (s, root = document) => root.querySelector(s), enc = new TextEncoder(), dec = new TextDecoder()
const SEEN = {commitment: 'confirmed'};   // what the chain has confirmed: a pool just born is not finalized yet
let W = null, sdk = null;
const call = async (method, ...params) => { const r = await (await fetch(RPC, {method: 'POST', headers: {'content-type': 'application/json'}, body: JSON.stringify({jsonrpc: '2.0', id: 1, method, params})})).json(); if (r.error) throw new Error(r.error.message); return r.result; };
const bytes = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0)), base64 = (u) => btoa(Array.from(u, (b) => String.fromCharCode(b)).join(''));
const put = (slot, u) => new Uint8Array(W.memory.buffer, W.door_in() + W.door_at(slot), u.length).set(u);
const take = (n) => { const b = new Uint8Array(W.memory.buffer, W.door_out(), Math.abs(n)).slice(); if (n < 0) throw new Error(dec.decode(b)); return b; }, words = (n) => dec.decode(take(n));
// the library that turns the module's bytes into what a wallet signs, pinned to its published bytes (as dl-direct.js pins it); a page that holds it already lends it
const web3 = () => window.solanaWeb3 ? Promise.resolve(window.solanaWeb3) : sdk ||= new Promise((ok, no) => document.head.append(Object.assign(document.createElement('script'), {src: new URL('./vendor/solana-web3-1.95.8.iife.min.js', import.meta.url).href, integrity: 'sha384-ujeTtvHxhu2g5lnu14Roii2ajvVKJ74KQ6eo6GGfAi0IrKZ1YkF8N68Iw5VmIJO0', crossOrigin: 'anonymous', onload: () => ok(window.solanaWeb3), onerror: () => no(new Error('The wallet’s library did not load.'))})));
async function wallet(quiet = false) {   // quiet: the wallet this browser already trusts, or none, never a prompt
  const w = window.phantom?.solana || window.solflare || window.backpack?.solana || window.solana;
  if (!w?.connect || !w?.signTransaction) { if (quiet) return null; throw new Error('Open this page in your Solana wallet’s browser, or install Phantom, Solflare or Backpack.'); }
  try { await w.connect(quiet ? {onlyIfTrusted: true} : undefined); } catch (e) { if (quiet) return null; throw e; }
  return w.publicKey ? w : null;
}
/** feed(w, text): her pool, its owner, the staker, a blockhash, the epoch rewards sysvar, a text, the pool's bytes and its validator list's (LIST_AT) into the module -> {n, t, epoch, l} */
async function feed(w, text = '') {
  W ||= (await WebAssembly.instantiateStreaming(fetch(new URL('./wasm/poleis-door.wasm', import.meta.url)), {})).instance.exports;
  const [pool, rewards, epoch, hash] = await Promise.all([call('getAccountInfo', POOL, {encoding: 'base64', ...SEEN}), call('getAccountInfo', 'SysvarEpochRewards1111111111111111111111111', {encoding: 'base64', ...SEEN}), call('getEpochInfo', SEEN), call('getLatestBlockhash', SEEN)]);
  if (!pool.value) throw new Error('Her pool is not on this chain.');
  const d = bytes(pool.value.data[0]).slice(0, 1600), t = enc.encode(text);
  new Uint8Array(W.memory.buffer, W.door_in(), W.door_at(6) + 1600).fill(0);
  [POOL, pool.value.owner, w.publicKey.toBase58(), hash.value.blockhash].forEach((s, slot) => put(slot, enc.encode(s)));
  if (rewards.value) put(4, bytes(rewards.value.data[0]).slice(0, 96));
  put(5, t); put(6, d); const list = await call('getAccountInfo', words(W.door_list(d.length)), {encoding: 'base64', ...SEEN}), l = list.value ? bytes(list.value.data[0]).slice(0, 8192) : new Uint8Array(0); put(7, l);
  return {n: d.length, t: t.length, epoch: BigInt(epoch.epoch), l: l.length};
}
/** held(w): what of hers this wallet holds -> {f, receipts} (no receipts account: none) */
async function held(w, text = '') {
  const f = await feed(w, text), r = await call('getTokenAccountBalance', words(W.door_receipts(f.n)), SEEN).catch(() => null);
  return {f, receipts: BigInt(r?.value?.amount || 0)};
}
async function send(w, wire) {   // the wallet signs what the module wrote; the chain is asked to confirm it
  const signed = await w.signTransaction((await web3()).Transaction.from(wire));
  const sig = await call('sendTransaction', base64(signed.serialize()), {encoding: 'base64', preflightCommitment: 'confirmed'});
  for (let i = 0; i < 90; i++) { const s = (await call('getSignatureStatuses', [sig])).value[0]; if (s?.err) throw new Error(`The chain refused it: ${JSON.stringify(s.err)}`); if (/confirmed|finalized/.test(s?.confirmationStatus || '')) return sig; await new Promise((r) => setTimeout(r, 400)); }
  throw new Error(`Sent, not confirmed yet: ${sig}`);
}
const working = (el, say) => (job) => async (e) => { e?.preventDefault?.(); if (el.hasAttribute('aria-busy')) return; el.setAttribute('aria-busy', 'true'); try { await job(); } catch (x) { say(x.message); } finally { el.removeAttribute('aria-busy'); } };
// THE PANTHEON: one door under her words; the stake, then the one choice for its light; the way out for a wallet that holds receipts
function pantheon(door = $('[data-her-door]'), dlg = $('#her-door')) {
  if (!door || !dlg) return;
  const say = (s) => { $('[data-her-note]', dlg).textContent = s; }, work = working(dlg, say), out = $('[data-her-out]', dlg);
  door.hidden = false;
  door.onclick = (e) => { e.preventDefault(); dlg.showModal(); work(async () => { const w = await wallet(true); if (!w) return; const {f, receipts} = await held(w); out.hidden = !receipts; out.dataset.sol = words(W.door_worth(f.n, receipts)); out.textContent = `Take your ${out.dataset.sol} SOL back ↗`; })(); };
  $('[data-her-stake]', dlg).onsubmit = work(async () => {
    const w = await wallet(), f = await feed(w, $('#her-sol', dlg).value), sol = words(W.door_sol(f.t));
    await send(w, take(W.door_stake(f.n, f.t, f.epoch, f.l)));
    [$('[data-her-eyebrow]', dlg).textContent, $('#her-title', dlg).textContent] = [`Your ${sol} SOL is in her`, 'Where does its light go?'];
    $('[data-her-stake]', dlg).hidden = $('[data-her-line]', dlg).hidden = out.hidden = true; $('[data-her-choice]', dlg).hidden = false; say('Change it any epoch.');
  });
  $('[data-her-futarchy]', dlg).onclick = work(async () => { const w = await wallet(), {receipts} = await held(w); await send(w, take(W.door_light(1, 0, receipts))); say('Its light goes where the futarchy places it. Change it any epoch.'); });
  out.onclick = work(async () => { const w = await wallet(), {f, receipts} = await held(w); await send(w, take(W.door_unstake(f.n, receipts, f.epoch, f.l))); out.hidden = true; say(`Your ${out.dataset.sol} SOL is back in your wallet.`); });
}
// A WISH: its page's one door, the light of the visitor's stake in her poured here; its unit is the page's civ
function wish(box = $('[data-her-light]'), unit = q.get('civ')) {
  if (!box || !/^[1-9]\d*$/.test(unit || '')) return;
  const go = $('[data-her-send]', box), say = (s) => { $('[data-her-note]', box).textContent = s; }, work = working(box, say);
  const poured = (sol) => { go.textContent = 'Your light pours here ↗'; go.classList.add('held'); say(`Your ${sol} SOL stays in her. Change it any epoch.`); };
  box.hidden = false;
  work(async () => {   // the newest light this wallet signed, as the chain lists its signatures
    const w = await wallet(true); if (!w) return;
    const {f, receipts} = await held(w), sol = receipts ? words(W.door_worth(f.n, receipts)) : '', listed = await call('getSignaturesForAddress', w.publicKey.toBase58(), {limit: 25, ...SEEN});
    for (const s of listed.filter((s) => !s.err && s.memo)) { const t = await call('getTransaction', s.signature, {encoding: 'base64', maxSupportedTransactionVersion: 0, ...SEEN}), tx = t && !t.meta?.err ? bytes(t.transaction[0]).slice(0, 1600) : new Uint8Array(0); put(6, new Uint8Array(1600)); put(6, tx); const chosen = words(W.door_chosen(tx.length)); if (chosen) { if (chosen === `wish ${unit}` && receipts) poured(sol); break; } }   // a choice is the staker's own signed memo (door_chosen)
  })();
  go.onclick = work(async () => { const w = await wallet(), {f, receipts} = await held(w, unit); await send(w, take(W.door_light(0, f.t, receipts))); poured(words(W.door_worth(f.n, receipts))); });
}
if (POOL) { pantheon(); wish(); }
