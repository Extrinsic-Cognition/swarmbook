#!/usr/bin/env node
// gold-close.mjs: HIS CLOSE OF A GOLD MONTH (the law: app/dl-gold-bid.mjs; the doors: worker/gold.mjs). Reads the month's pot from the site (or the
// mint's dev server), opens every bid with the recipient wallet's secret key (a file of his, never in git: Phantom's export, the 64-byte key as base58
// or as a JSON array), ranks them under the reserve at the SOL price he names, makes the signed total with the winners' openings, and posts it, or
// writes it to a file for his hand. The total is also checked here as the page checks it, before anything is posted.
//   node tools/gold-close.mjs --month 2026-11 --key ~/secret/recipient.key --sol-usd 150 [--site https://optimism.fit] [--post | --out total.json]
// Nothing is kept here: the opened bids are printed once (the ranking, lamports per commitment) and not written anywhere.
import { readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { webcrypto } from 'node:crypto';
import { GOLD, monthOf, isMonth, phaseOf, openBid, makeTotal, checkTotal, verifyWith, bytesHex, solText, hexBytes } from '../app/dl-gold-bid.mjs';
import { RECIPIENT, decode58, quoteLamports } from '../app/dl-direct-protocol.mjs';
import { PATHS } from '../worker/gold.mjs';

const nacl = createRequire(import.meta.url)('../app/vendor/tweetnacl-1.0.3.fast.min.js');

/** keyOf(text): the recipient wallet's 64-byte secret key from Phantom's base58 export or a JSON array (solana-keygen's file). */
export function keyOf(text) {
  const t = text.trim();
  const bytes = t.startsWith('[') ? Uint8Array.from(JSON.parse(t)) : decode58(t, 64);
  if (bytes.length !== 64) throw new Error('The key is not 64 bytes');
  return bytes;
}
/**
 * closeMonth({pot, bids, secretKey, solUsd, now, slots, reserveUsd}): the opened bids in the log's order (each {commitment, lamports, blinder}),
 * the ranking, and the signed total. pot: the Worker's pot (commitments in order); bids: the full records (the Worker's log rows: commitment, bidder,
 * box, signature, month). A bid that does not open or lies is set aside and named, never counted: the total covers the bids that open, and the
 * count must still be the log's, so a bid that does not open stops the close (its author must be heard by him first).
 */
export function closeMonth({ pot, bids, secretKey, solUsd, now = Date.now(), slots = GOLD.slots, reserveUsd = GOLD.reserveUsd, recipient = RECIPIENT }) {
  if (!isMonth(pot.month)) throw new Error('Invalid month');
  const phase = phaseOf(pot.month, now); if (phase === 'before' || phase === 'open') throw new Error(`${pot.month} is not closed yet (${phase})`);
  const byCommitment = new Map(bids.map((b) => [b.commitment, b]));
  if (pot.commitments.some((c) => !byCommitment.has(c)) || pot.commitments.length !== bids.length) throw new Error('The bids are not the pot\'s log');
  const opened = [], refused = [];
  for (const c of pot.commitments) {
    try { const o = openBid(nacl, byCommitment.get(c), secretKey, recipient); opened.push({ commitment: c, lamports: Number(o.lamports), blinder: bytesHex(o.blinder), payer: o.payer }); }
    catch (e) { refused.push({ commitment: c, why: e.message }); }
  }
  if (refused.length) throw Object.assign(new Error(`${refused.length} bid(s) do not open: ${refused.map((r) => `${r.commitment.slice(0, 8)} (${r.why})`).join(', ')}`), { refused });
  const reserveLamports = Number(quoteLamports(reserveUsd, String(solUsd)));
  const total = makeTotal({ nacl, month: pot.month, opened: opened.map(({ commitment, lamports, blinder }) => ({ commitment, lamports, blinder })), reserveLamports, slots, secretKey });
  return { opened, reserveLamports, total };
}

async function main() {
  const args = process.argv.slice(2), opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
  const month = opt('--month', monthOf()), site = opt('--site', 'https://optimism.fit').replace(/\/$/, ''), keyFile = opt('--key'), solUsd = opt('--sol-usd'), out = opt('--out');
  if (!keyFile || !solUsd) { console.error('usage: gold-close.mjs --month YYYY-MM --key <file> --sol-usd <price> [--site <origin>] [--post | --out <file>]'); process.exit(2); }
  const secretKey = keyOf(readFileSync(keyFile, 'utf8'));
  const potR = await fetch(`${site}${PATHS.pot}?month=${month}`); if (!potR.ok) throw new Error(`the pot answered ${potR.status}`);
  const pot = await potR.json();
  if (pot.total) { console.log(`${month} is closed already: ${solText(pot.total.lamports)} SOL, ${pot.total.winners.length} winners.`); return; }
  // the full records: the pot carries commitments only; the log's rows come from the Worker's export door for the recipient, or a file (--bids)
  const bidsFile = opt('--bids'); if (!bidsFile) throw new Error('--bids <file>: the month\'s gold_bids rows as JSON (wrangler d1 execute ... --json), until the Worker has an export door for the recipient');
  const bids = JSON.parse(readFileSync(bidsFile, 'utf8'));
  const { opened, reserveLamports, total } = closeMonth({ pot, bids, secretKey, solUsd });
  const checked = await checkTotal(total, pot.commitments, verifyWith(webcrypto.subtle)); if (!checked.ok) throw new Error(`the total does not check: ${checked.why}`);
  console.log(`${month}: ${opened.length} bids, ${solText(total.lamports)} SOL in the pot, reserve ${solText(reserveLamports)} SOL at $${solUsd}; ${total.winners.length} of ${GOLD.slots} seats:`);
  for (const w of total.winners) console.log(`  ${w.commitment.slice(0, 12)}…  ${solText(w.lamports)} SOL  ${opened.find((o) => o.commitment === w.commitment)?.payer ?? '(pays from any wallet)'}`);
  if (args.includes('--post')) {
    const r = await fetch(`${site}${PATHS.totals}`, { method: 'POST', headers: { 'content-type': 'application/json', origin: site }, body: JSON.stringify({ total }) });
    console.log(`posted: ${r.status} ${await r.text()}`);
  } else { const file = out ?? `gold-total-${month}.json`; writeFileSync(file, `${JSON.stringify(total, null, 1)}\n`); console.log(`written: ${file} (post it with --post, or POST {total} to ${PATHS.totals})`); }
}
if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) main().catch((e) => { console.error(e.message); process.exit(1); });
