// pool-crank.mjs · SOL INFLATION PAYS FOR INFERENCE (Oct 29 2026, lane/sol-inflation-pays-for-inference). His words, UTC, to claude-61e371e5:
//   17:57 "$POOL is what can be bought; $WARM is the rebate one"
//   18:01 "i think we should make it a staking thing so we get staking yield an use that as inference credits, so basically SOL inflation pays for inference"
//   18:04 "The staker's Swarmy" (asked whose inference the yield pays)
//   18:08 "this is where you introduce a simple toggle... the toggle is: * accumulate credits * or allocate to ClawRiders in Project SnowTrace"
//   18:1x "your tracenet is either sponsored or if not sponsored it is bought by agents subscribing to it"
// THE CRANK: once an epoch, each linked stake's reward for that epoch (getInflationReward: read-only on the chain) becomes one refill row on Space Router's
// tanks (../lib/space-tanks.mjs), in dollars at a price the caller states. The staker's toggle says which tank: their own Swarmy's (accumulate, the default by
// his 18:04) or the ClawRiders' tank in Project SnowTrace (allocate). A refill is his hand (space-tanks.mjs: "a refill row, his hand"), so the crank says
// the epoch's rows and writes them only when asked to. One row a stake an epoch: the row's why opens with its key, pool:<epoch>:<stake>, and a key the ledger
// already holds is never written twice.
// THE TOGGLE is one ref on the Nest, `pool/toggles`: { schema, toggles: { <tank>: { choice, at, by } } }. The Tracenet tab writes it on his press
// (embertide-app/ui/intro/life-menu/pool-toggle.mjs holds the page's copy of this law; the test holds the two equal). A tank the ref does not name accumulates.
// THE STAKES are the links of stake accounts to tanks: <dir>/stakes.json { schema, stakes: [{ stake, tank }] }, <dir> = ~/.embertide/pool (POOL_DIR for a
// test). A link here is his hand on this Mac.
// THE EDGE'S LINKS (Oct 30 2026, lane/a-stake-pays-its-tank): a staker's own link, signed with the stake's withdraw authority and checked on chain when it is
// made (embertide-app/ui/intro/dyson-society/worker/space-router-link.mjs, D1 sr_links), feeds the staker's own tank at the site's edge (D1 sr_tanks), where
// their agents spend it through Space Router's public door. runEdgeEpoch is the same epoch, the same rows and the same keys over that store, read through a d1
// of four calls (crank.mjs gives the site's D1 through wrangler; a test, a scratch one): links(cluster), written() (the whys of the refills it holds),
// tanks() (the names that stand) and refill(rows) (all of them in one go). It writes nothing unless asked: a refill is his hand.
// COST: an epoch is one getInflationReward call (the RPC takes the stakes in one batch), one ref read and one fold of the ledger. Nothing runs at rest.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { NAME_RX, openTanks } from '../lib/space-tanks.mjs';

export const TOGGLES_REF = 'pool/toggles';
export const CHOICES = Object.freeze(['accumulate', 'allocate']);
export const DEFAULT_CHOICE = 'accumulate';                        // his 18:04: "The staker's Swarmy"
export const RIDERS_TANK = 'snowtrace-riders';                     // the ClawRiders' tank in Project SnowTrace, made by his hand (space-tanks.mjs add)
export const LAMPORTS_PER_SOL = 1e9;
const KEY_RX = /^pool:(\d+):([1-9A-HJ-NP-Za-km-z]{32,44})$/;

export const poolDir = (env = process.env) => env.POOL_DIR || path.join(env.HOME || os.homedir(), '.embertide', 'pool');

// A Solana address: base58 that decodes to 32 bytes. Pure.
const B58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
export function base58Bytes(s) {
  if (typeof s !== 'string' || !s) return null;
  let n = 0n;
  for (const ch of s) { const d = B58.indexOf(ch); if (d < 0) return null; n = n * 58n + BigInt(d); }
  const out = [];
  while (n > 0n) { out.unshift(Number(n & 255n)); n >>= 8n; }
  for (const ch of s) { if (ch !== '1') break; out.unshift(0); }
  return Uint8Array.from(out);
}
export const isAddress = s => base58Bytes(s)?.length === 32;

// The toggles a ref value holds: tank -> { choice, at, by }; an entry that is not one of the two choices, or names no tank, is left out. Pure.
export function readToggles(value) {
  const out = new Map();
  for (const [tank, t] of Object.entries(value?.toggles || {})) {
    if (NAME_RX.test(tank) && t && CHOICES.includes(t.choice)) out.set(tank, { choice: t.choice, at: typeof t.at === 'string' ? t.at : null, by: typeof t.by === 'string' ? t.by : null });
  }
  return out;
}
export const choiceOf = (toggles, tank) => toggles.get(tank)?.choice || DEFAULT_CHOICE;

// The links: [{ stake, tank }], each stake once, each a real address and a tank's name. Pure.
export function readStakes(value) {
  const seen = new Set(), stakes = [], refused = [];
  for (const s of Array.isArray(value?.stakes) ? value.stakes : []) {
    const why = !isAddress(s?.stake) ? 'not a Solana address' : !NAME_RX.test(String(s?.tank)) ? 'not a tank\'s name' : seen.has(s.stake) ? 'linked twice' : null;
    if (why) refused.push({ stake: String(s?.stake ?? ''), tank: String(s?.tank ?? ''), why }); else { seen.add(s.stake); stakes.push({ stake: s.stake, tank: s.tank }); }
  }
  return { stakes, refused };
}

export const keyOf = (epoch, stake) => `pool:${epoch}:${stake}`;
export const usdOf = (lamports, solUsd) => +((lamports / LAMPORTS_PER_SOL) * solUsd).toFixed(9);

// The keys of the crank's rows a ledger already holds (its refill rows whose why opens with a key). Pure.
export function writtenKeys(ledgerText) {
  const keys = new Set();
  for (const line of String(ledgerText || '').split('\n')) {
    if (!line.trim()) continue;
    let row; try { row = JSON.parse(line); } catch { continue; }
    const k = row?.kind === 'refill' && typeof row.why === 'string' ? row.why.split(' ')[0] : '';
    if (KEY_RX.test(k)) keys.add(k);
  }
  return keys;
}

// getInflationReward's request and its answer, read in the stakes' order: lamports a stake earned in that epoch, 0 where the answer is null. Pure.
export const rewardsRequest = (stakes, epoch) => ({ jsonrpc: '2.0', id: 1, method: 'getInflationReward', params: [stakes.map(s => s.stake), { epoch }] });
export function rewardsFrom(answer, stakes) {
  if (!answer || !Array.isArray(answer.result)) throw new Error(`getInflationReward did not answer: ${answer?.error?.message || 'no result'}`);
  const out = new Map();
  stakes.forEach((s, i) => { const r = answer.result[i]; out.set(s.stake, r && Number.isFinite(r.amount) ? r.amount : 0); });
  return out;
}

// THE EPOCH'S ROWS: for each stake with a reward, one refill row into the tank its staker's toggle names. Pure.
export function epochRows({ epoch, stakes, rewards, toggles = new Map(), solUsd, written = new Set(), ridersTank = RIDERS_TANK }) {
  if (!(Number.isInteger(epoch) && epoch >= 0)) throw new Error(`an epoch is a whole number, not ${epoch}`);
  if (!(Number.isFinite(solUsd) && solUsd > 0)) throw new Error(`a SOL price is a positive number of dollars, not ${solUsd}`);
  const rows = [], skipped = [];
  for (const { stake, tank } of stakes) {
    const lamports = rewards.get(stake) || 0, key = keyOf(epoch, stake), choice = choiceOf(toggles, tank);
    if (written.has(key)) { skipped.push({ stake, tank, why: 'already written' }); continue; }
    if (!(lamports > 0)) { skipped.push({ stake, tank, why: 'no reward this epoch' }); continue; }
    const to = choice === 'allocate' ? ridersTank : tank;
    rows.push({ key, stake, from: tank, choice, tank: to, lamports, usd: usdOf(lamports, solUsd),
      why: `${key} · ${choice === 'allocate' ? `allocated by ${tank} to the ClawRiders` : `${tank}'s own yield`} · ${lamports} lamports at $${solUsd}/SOL` });
  }
  return { rows, skipped };
}

// THE CRANK'S RUN, on this Mac: the links, the toggles (a ref value the caller read), the rewards (an RPC the caller names), the epoch's rows; written into
// the tanks' ledger only with write, and only when every tank a row names stands (a refused run writes nothing).
export async function runEpoch({ epoch, solUsd, toggles, rpc, write = false, dir = poolDir(), tanks = openTanks(), ridersTank = RIDERS_TANK }) {
  let links = { stakes: [] };
  try { links = JSON.parse(fs.readFileSync(path.join(dir, 'stakes.json'), 'utf8')); } catch (e) { if (e.code !== 'ENOENT') throw e; }
  const { stakes, refused } = readStakes(links);
  const rewards = stakes.length ? rewardsFrom(await rpc(rewardsRequest(stakes, epoch)), stakes) : new Map();
  let ledger = ''; try { ledger = fs.readFileSync(tanks.book, 'utf8'); } catch (e) { if (e.code !== 'ENOENT') throw e; }
  const { rows, skipped } = epochRows({ epoch, stakes, rewards, toggles: readToggles(toggles), solUsd, written: writtenKeys(ledger), ridersTank });
  if (write && rows.length) {
    const known = new Set(tanks.state().map(t => t.name)), missing = [...new Set(rows.map(r => r.tank))].filter(n => !known.has(n));
    if (missing.length) throw new Error(`no tank ${missing.join(', ')} in ${tanks.file}: his hand makes it first (space-tanks.mjs add ${missing[0]}); nothing was written`);
    for (const r of rows) tanks.refill(r.tank, r.usd, r.why);
  }
  return { epoch, solUsd, stakes: stakes.length, refused, rows, skipped, wrote: write ? rows.length : 0 };
}

/** keysOfWhys(whys): the crank's keys among a ledger's refill whys (the edge's ledger hands back its whys alone). Pure. */
export function keysOfWhys(whys) {
  const keys = new Set(); for (const w of whys || []) { const k = typeof w === 'string' ? w.split(' ')[0] : ''; if (KEY_RX.test(k)) keys.add(k); } return keys;
}

/** runEdgeEpoch: the epoch's rows for the stakes linked at the site's edge, into the edge's tanks; written only with write, and only when every tank a row
 *  names stands there (a refused run writes nothing). cluster: the links of that cluster alone (the edge's rehearsal on devnet links devnet stakes). */
export async function runEdgeEpoch({ epoch, solUsd, toggles, rpc, d1, cluster = 'mainnet', write = false, ridersTank = RIDERS_TANK }) {
  const { stakes, refused } = readStakes({ stakes: await d1.links(cluster) });
  const rewards = stakes.length ? rewardsFrom(await rpc(rewardsRequest(stakes, epoch)), stakes) : new Map();
  const { rows, skipped } = epochRows({ epoch, stakes, rewards, toggles: readToggles(toggles), solUsd, written: keysOfWhys(await d1.written()), ridersTank });
  if (write && rows.length) {
    const known = await d1.tanks(), missing = [...new Set(rows.map((r) => r.tank))].filter((n) => !known.has(n));
    if (missing.length) throw new Error(`no tank ${missing.join(', ')} at the site's edge: a staker's link makes their own; the ClawRiders' is his hand; nothing was written`);
    await d1.refill(rows);
  }
  return { epoch, solUsd, cluster, stakes: stakes.length, refused, rows, skipped, wrote: write ? rows.length : 0, edge: true };
}

// A link of his hand: stake -> tank, into <dir>/stakes.json (0600). Refused for a stake already linked or a name that is not a tank's.
export function linkStake(stake, tank, dir = poolDir()) {
  const file = path.join(dir, 'stakes.json');
  let j = { schema: 'pool.stakes/v1', stakes: [] };
  try { j = JSON.parse(fs.readFileSync(file, 'utf8')); } catch (e) { if (e.code !== 'ENOENT') throw e; }
  const next = { ...j, stakes: [...(Array.isArray(j.stakes) ? j.stakes : []), { stake, tank }] };
  const { refused } = readStakes(next);
  if (refused.length) throw new Error(`${stake} -> ${tank} is refused: ${refused[0].why}`);
  fs.mkdirSync(dir, { recursive: true, mode: 0o700 });
  const tmp = `${file}.${process.pid}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(next, null, 1) + '\n', { mode: 0o600 });
  fs.renameSync(tmp, file);
  return next.stakes.length;
}
