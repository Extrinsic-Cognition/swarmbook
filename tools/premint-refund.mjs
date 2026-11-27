#!/usr/bin/env node
// premint-refund.mjs · A REFUND HE SIGNS (Oct 28 2026). His words, WET: 14:23 "wtf? if someone foudn it it could mint now? u kidding me? are we
// prepared for that?"; 14:28 "dude... we need a way to make this safe come on... we cant be out there like this unprepared rushing... what is needed?".
// S4 of plans/the-marketing-plan-2026-10-28.md ("The mint waits until it is safe"): a refund is prepared from the order as a Solana Pay transfer
// request that he scans and signs in the wallet that received the payment. No seat holds a key, signs, or moves money here: this reads an order,
// checks its payment on chain, and writes the request (a link, a QR, a page) for his hand.
//   node tools/premint-refund.mjs <order-id>            the order from the Worker's D1 (wrangler d1 execute --remote, read only), checked, the request
//   node tools/premint-refund.mjs <order-id> --check    was it refunded? (the request's reference, on chain)
//     [--orders <file.json>] an order list instead of D1 (rows, or wrangler's --json output) · [--rpc <url>] · [--out <dir>]
// The request: solana:<buyer>?amount=<the SOL he paid>&reference=<this order's>&label=optimism.fit&message=Refund of order <id>&memo=optimism.fit:refund:v1:<id>.
// The reference is sha256("optimism.fit:refund:v1:" + id) as an account key: the same order always makes the same request, and its refund is found by
// it (getSignaturesForAddress). A second request for an order already refunded is refused. The amount is what the buyer sent, to the lamport; the
// network fee is the sender's. Out: ~/.embertide/premint-refunds/refund-<id>.{svg,html} and log.jsonl (never in git).
// WHERE: the Mac whose wrangler login holds the optimism.fit account, the old Mac (Oct 28: this Mac's answers D1 with 7403, not authorized); --orders
// works anywhere. Oct 28 14:3x the book held 2 orders, both open (quotes never paid), 0 paid.
// COST: one D1 read, two or three RPC calls, a QR drawn in microseconds; nothing at rest.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
export const MEMO_PREFIX = 'optimism.fit:refund:v1:';
export const ID_RX = /^[A-Za-z0-9_.:-]{1,80}$/;   // inlined into one read-only SELECT, so nothing else ever is
const B58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

export function b58encode(bytes) {
  let n = 0n; for (const b of bytes) n = n * 256n + BigInt(b);
  let s = ''; while (n > 0n) { s = B58[Number(n % 58n)] + s; n /= 58n; }
  for (const b of bytes) { if (b !== 0) break; s = '1' + s; }
  return s;
}
/** solOf(lamports): the SOL amount as Solana Pay writes it, a plain decimal, never an exponent: 59000000 -> "0.059". */
export function solOf(lamports) {
  const l = BigInt(lamports); if (l <= 0n) throw new Error(`a refund is a positive number of lamports, not ${lamports}`);
  const whole = l / 1000000000n, frac = (l % 1000000000n).toString().padStart(9, '0').replace(/0+$/, '');
  return frac ? `${whole}.${frac}` : `${whole}`;
}
export const referenceOf = (id) => b58encode(crypto.createHash('sha256').update(MEMO_PREFIX + id).digest());

/** refundRequest(order): the Solana Pay transfer request that sends the buyer back what the order paid. Refuses anything but a paid order. */
export function refundRequest(order) {
  if (!order || !ID_RX.test(String(order.id || ''))) throw new Error('no order, or an order id this tool will not read');
  if (order.status !== 'paid') throw new Error(`order ${order.id} is ${order.status}, not paid: nothing to refund`);
  if (!order.signature) throw new Error(`order ${order.id} has no payment signature`);
  const amount = solOf(order.lamports), reference = referenceOf(order.id), memo = MEMO_PREFIX + order.id;
  const q = new URLSearchParams({ amount, reference, label: 'optimism.fit', message: `Refund of order ${order.id}`, memo });
  return { url: `solana:${order.buyer}?${q.toString().replace(/\+/g, '%20')}`, amount, reference, memo, to: order.buyer, from: order.recipient, lamports: String(order.lamports) };
}

/** paidOnChain(order, tx): the finalized payment moved exactly the order's lamports from its buyer to its recipient, and did not fail. */
export function paidOnChain(order, tx) {
  if (!tx || tx.meta?.err) return false;
  const ix = [...(tx.transaction?.message?.instructions || []), ...((tx.meta?.innerInstructions || []).flatMap((i) => i.instructions || []))];
  return ix.some((i) => i?.program === 'system' && i.parsed?.type === 'transfer' && i.parsed.info?.source === order.buyer
    && i.parsed.info?.destination === order.recipient && String(i.parsed.info?.lamports) === String(order.lamports));
}
/** refundedOnChain(order, sigs, txOf): a finalized transfer of the order's lamports from its recipient back to its buyer under its reference. */
export async function refundedOnChain(order, sigs, txOf) {
  for (const s of sigs || []) {
    if (s.err) continue;
    const tx = await txOf(s.signature);
    if (paidOnChain({ buyer: order.recipient, recipient: order.buyer, lamports: order.lamports }, tx)) return s.signature;
  }
  return null;
}

/** ordersFrom(json): the rows, from a plain list or wrangler d1 execute --json ([{ results: [...] }]). */
export function ordersFrom(json) {
  if (Array.isArray(json) && json.length && Array.isArray(json[0]?.results)) return json.flatMap((r) => r.results);
  return Array.isArray(json) ? json : [];
}

let QR = null;
/** qrSvg(text): the request as a QR, by the house's own generator (embertide-app/ui/intro/qrcode-generator.js, Kazuhiko Arase's, MIT). */
export function qrSvg(text) {
  if (!QR) { const box = { module: { exports: {} } }; box.exports = box.module.exports; vm.runInNewContext(fs.readFileSync(path.join(HERE, '..', 'qrcode-generator.js'), 'utf8'), box); QR = box.module.exports; }
  const q = QR(0, 'M'); q.addData(String(text)); q.make();
  return q.createSvgTag({ cellSize: 6, margin: 4, scalable: true, alt: 'The refund, as a Solana Pay QR code', title: 'Refund' });
}

const rpcOf = (url) => async (method, params) => {
  const r = await fetch(url, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }) });
  const j = await r.json(); if (j.error) throw new Error(`${method}: ${j.error.message || JSON.stringify(j.error)}`); return j.result;
};
const txFetcher = (rpc) => (sig) => rpc('getTransaction', [sig, { encoding: 'jsonParsed', commitment: 'finalized', maxSupportedTransactionVersion: 0 }]);

function readOrder(id, ordersFile) {
  if (ordersFile) return ordersFrom(JSON.parse(fs.readFileSync(ordersFile, 'utf8'))).find((o) => o.id === id) || null;
  const sql = `SELECT id, tier, buyer, recipient, lamports, signature, status, paid_at FROM premint_orders WHERE id = '${id}'`;
  const r = spawnSync('npx', ['--yes', 'wrangler@4.157.0', 'd1', 'execute', 'optimism-fit-premint', '--remote', '--json', '--config', path.join(HERE, 'wrangler.optimism-fit.jsonc'), '--command', sql],
    { cwd: HERE, encoding: 'utf8', maxBuffer: 1 << 24 });
  const said = `${r.stderr || ''}${r.stdout || ''}`;
  if (r.status !== 0) throw new Error(/7403/.test(said) ? 'this Mac\'s wrangler login cannot read the optimism.fit account (7403): run this on the old Mac, or pass --orders'
    : `wrangler d1 execute failed: ${said.trim().split('\n').slice(-3).join(' ')}`);
  return ordersFrom(JSON.parse(r.stdout))[0] || null;
}

async function main(argv) {
  const opt = (k, d) => { const i = argv.indexOf(k); return i >= 0 && argv[i + 1] ? argv[i + 1] : d; };
  const id = argv.find((a, i) => !a.startsWith('--') && !['--orders', '--rpc', '--out'].includes(argv[i - 1]));
  if (!id || !ID_RX.test(id)) { console.error('usage: premint-refund.mjs <order-id> [--check] [--orders <file.json>] [--rpc <url>] [--out <dir>]'); return 2; }
  const rpc = rpcOf(opt('--rpc', 'https://solana-rpc.publicnode.com')), txOf = txFetcher(rpc);
  const out = opt('--out', path.join(os.homedir(), '.embertide', 'premint-refunds'));
  const order = readOrder(id, opt('--orders', null));
  if (!order) { console.error(`no order ${id}`); return 1; }
  const done = await refundedOnChain(order, await rpc('getSignaturesForAddress', [referenceOf(id), { commitment: 'finalized' }]), txOf);
  if (done) { console.log(`order ${id} was refunded: ${done} (${solOf(order.lamports)} SOL to ${order.buyer})`); return 0; }
  if (argv.includes('--check')) { console.log(`order ${id} is not refunded yet`); return 1; }
  const req = refundRequest(order);
  if (!paidOnChain(order, await txOf(order.signature))) { console.error(`order ${id}: the chain does not show ${req.amount} SOL from ${order.buyer} to ${order.recipient} in ${order.signature}; nothing written`); return 1; }
  fs.mkdirSync(out, { recursive: true, mode: 0o700 });
  const svg = qrSvg(req.url), esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  fs.writeFileSync(path.join(out, `refund-${id}.svg`), svg);
  fs.writeFileSync(path.join(out, `refund-${id}.html`), `<!doctype html><meta charset="utf-8"><title>Refund ${esc(id)}</title><body style="font:16px system-ui;max-width:520px;margin:40px auto">`
    + `<h1>Refund of order ${esc(id)}</h1><p>${esc(req.amount)} SOL back to <code>${esc(req.to)}</code> (${esc(order.tier)}).</p>`
    + `<p>Scan with the wallet that holds <code>${esc(req.from)}</code>. Nothing is sent until you approve it there.</p>${svg}<p><code style="word-break:break-all">${esc(req.url)}</code></p></body>`);
  fs.appendFileSync(path.join(out, 'log.jsonl'), JSON.stringify({ at: new Date().toISOString(), order: id, tier: order.tier, to: req.to, from: req.from, lamports: req.lamports, reference: req.reference, url: req.url }) + '\n', { mode: 0o600 });
  console.log(`order ${id} (${order.tier}): ${req.amount} SOL back to ${req.to}`);
  console.log(`sign it in the wallet that holds ${req.from}: open ${path.join(out, `refund-${id}.html`)} and scan, or open ${req.url}`);
  console.log(`then: node tools/premint-refund.mjs ${id} --check`);
  return 0;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main(process.argv.slice(2)).then((c) => { process.exitCode = c; }, (e) => { console.error(e.message); process.exitCode = 1; });
