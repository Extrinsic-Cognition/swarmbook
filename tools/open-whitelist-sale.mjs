#!/usr/bin/env node
// THE DYSONLIGHT HARMONY WHITELIST, FOUNDED ON DEVNET (his Oct 12 2026 08:5x WEST: "i want to make this about dysonlight harmony
// which basically is whitelist pre-mint access... i want people to bid here 10$ for each slot at being able to participate to the
// sale later... DL Harmony begins under trusted access to specific devs based on github link"; then, on "Open it?", "dude we got
// a lot of sol devnet in the wallet there dude").
//
// One transaction on the Poleis program (layout 8, the page's own client): init_config for a new root, then open_genesis, whose
// first hexagon sale IS the whitelist: rung 5 of the ladder (GP(4,0), 150 hexagons, the program's most per sale), every slot's
// floor and deposit the same $10 in SOL, so a bid is the price of a slot. Sealed like every seat sale: a bid commits now and
// reveals after the commit window. No founders in the chairs: the twelve pentagons stay empty for his word.
//
// Devnet only, paid by the devnet deployer key kept outside the repo. Idempotent: when the root is founded already it prints the
// sale and writes nothing. Writes ../app/whitelist.json, the one place the page reads the root from.
//
//   node tools/open-whitelist-sale.mjs            simulate, then send
//   node tools/open-whitelist-sale.mjs --dry      simulate only
import { readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { createHash } from 'node:crypto';
import { homedir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const POLEIS_JS = process.env.POLEIS_JS || join(homedir(), 'code-ec/poleis-protocol/js');
const need = createRequire(join(POLEIS_JS, 'package.json'));
const web3 = need('@solana/web3.js');
const nacl = need('tweetnacl');
const { create } = await import(join(here, '../js/poleis-client.js'));
const P = create({ web3, nacl });

const RPC = process.env.RPC || 'https://api.devnet.solana.com';
const DEPLOYER = process.env.POLEIS_DEVNET_DEPLOYER || join(homedir(), '.config/solana/poleis-devnet-deployer.json');
const NAME = 'DYSONLIGHT HARMONY';
const DESC = 'Whitelist pre-mint access: $10 a slot, trusted devs by GitHub.';
const RUNG = 5;                      // GP(4,0): 150 hexagons
const USD_PER_SLOT = 10;
const SOL_USD = Number(process.env.SOL_USD || 112.70);   // CoinGecko 112.63, Binance 112.76 at 08:5x WEST
const COMMIT_SLOTS = 1_080_000n;     // about five days at 400 ms a slot
const REVEAL_SLOTS = 216_000n;       // about one day
const WINDOW = 216_000n;             // the codex window, one day
const dry = process.argv.includes('--dry');

// the root id is the name's: the first eight bytes of sha256, little-endian, so the page and this script agree without a lookup
const ROOT = createHash('sha256').update('DYSONLIGHT HARMONY · whitelist · 1').digest().readBigUInt64LE(0);
const lamports = BigInt(Math.round((USD_PER_SLOT / SOL_USD) * 1e9 / 1e4) * 1e4);

const conn = new web3.Connection(RPC, 'confirmed');
const payer = web3.Keypair.fromSecretKey(Uint8Array.from(JSON.parse(readFileSync(DEPLOYER, 'utf8'))));
const config = P.configPda(ROOT), sale = P.salePda(ROOT, 0n);
console.log(`root ${ROOT} · config ${config.toBase58()} · sale ${sale.toBase58()}`);
console.log(`payer ${payer.publicKey.toBase58()} · ${(await conn.getBalance(payer.publicKey)) / 1e9} SOL`);

if (await conn.getAccountInfo(sale)) {
  console.log('founded already: the sale is on chain; nothing sent, nothing written');
  process.exit(0);
}

const slot = BigInt(await conn.getSlot('confirmed'));
const genesis = {
  charter: await P.sha256(new TextEncoder().encode(NAME)), planCap: 10n * 1_000_000_000n, planPeriod: 1_000_000n, window: WINDOW,
  rung: RUNG, reserve: lamports, deposit: lamports, commitEnd: slot + COMMIT_SLOTS, revealEnd: slot + COMMIT_SLOTS + REVEAL_SLOTS,
  founders: [], name: NAME, desc: DESC,
};
const tx = new web3.Transaction().add(P.initConfig(payer.publicKey, null, ROOT), P.openGenesis(payer.publicKey, genesis, ROOT));
tx.feePayer = payer.publicKey;
tx.recentBlockhash = (await conn.getLatestBlockhash('confirmed')).blockhash;
tx.sign(payer);
const sim = await conn.simulateTransaction(tx);
console.log(`simulated: ${sim.value.err ? 'ERROR ' + JSON.stringify(sim.value.err) : 'ok'} · ${sim.value.unitsConsumed} CU`);
for (const line of (sim.value.logs || []).slice(-6)) console.log('  ' + line);
if (sim.value.err || dry) process.exit(sim.value.err ? 1 : 0);

const signature = await web3.sendAndConfirmTransaction(conn, tx, [payer], { commitment: 'confirmed' });
const info = await conn.getAccountInfo(sale);
const out = {
  schema: 'dl-harmony.whitelist.v1', cluster: 'devnet', rpc: RPC, program: P.PROGRAM_ID.toBase58(), layout: P.LAYOUT_VERSION,
  root: ROOT.toString(), sale: '0', slots: 150, rung: RUNG, usdPerSlot: USD_PER_SLOT, solUsdAtOpen: SOL_USD,
  reserveLamports: lamports.toString(), depositLamports: lamports.toString(),
  openedSlot: slot.toString(), commitEndSlot: genesis.commitEnd.toString(), revealEndSlot: genesis.revealEnd.toString(),
  config: config.toBase58(), saleAccount: sale.toBase58(), registry: P.registryPda(ROOT).toBase58(),
  openedAt: new Date().toISOString(), signature, saleBytes: info ? info.data.length : 0,
};
writeFileSync(join(here, '../app/whitelist.json'), JSON.stringify(out, null, 2) + '\n');
console.log(`founded: ${signature}`);
console.log(`https://explorer.solana.com/tx/${signature}?cluster=devnet`);
