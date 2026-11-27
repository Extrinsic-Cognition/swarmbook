#!/usr/bin/env node
// prepare/verify/publish never load a key. `open` is a HUMAN-operated financial action.
// Agents may prepare and verify; the owner must run deployment and approve/sign `open`.
import { readFile, writeFile, rename } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { homedir } from 'node:os';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PROGRAM, AUTHORITY, GENESIS, SOURCE, BINARY, ROOT, TERMS, ACCOUNT_BYTES,
  sha256, sealPlan, checkPlan, checkArtifact, solForTenDollars, checkProgram, checkSale } from './bronze-mainnet-core.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2), mode = args.shift();
const allowed = new Set(['artifact', 'out', 'plan', 'rpc', 'dependencies', 'payer-keypair', 'approve-plan']);
const options = {};
for (let i = 0; i < args.length; i += 2) {
  const key = args[i].replace(/^--/, '');
  if (!args[i].startsWith('--') || !allowed.has(key) || options[key] || !args[i + 1] || args[i + 1].startsWith('--')) throw new Error('Invalid or duplicate argument');
  options[key] = args[i + 1];
}
const required = key => options[key] || (() => { throw new Error(`Missing --${key}`); })();
const json = value => JSON.stringify(value, (_, v) => typeof v === 'bigint' ? v.toString() : v, 2) + '\n';
async function request(url, body) {
  const response = await fetch(url, { signal: AbortSignal.timeout(15000), ...(body ? {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
  } : {}) });
  if (!response.ok) throw new Error(`Request failed (${response.status})`);
  const reader = response.body.getReader(), chunks = []; let size = 0;
  for (;;) {
    const { done, value } = await reader.read(); if (done) break;
    size += value.byteLength;
    if (size > 2 * 1024 * 1024) { await reader.cancel(); throw new Error('Response too large'); }
    chunks.push(Buffer.from(value));
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}
async function run() {
  if (!['prepare', 'verify', 'publish', 'open'].includes(mode)) {
    console.log('Read-only: bronze-mainnet.mjs prepare --artifact FILE --out PLAN [--rpc URL] [--dependencies PACKAGE_JSON]\n' +
      'Read-only: bronze-mainnet.mjs verify --artifact FILE --plan PLAN\n' +
      'After chain verification: bronze-mainnet.mjs publish --artifact FILE --plan PLAN --out CONFIG\n' +
      'OWNER ONLY (spends real SOL): bronze-mainnet.mjs open --artifact FILE --plan PLAN --payer-keypair FILE --approve-plan SHA256\n' +
      'prepare/verify/publish never read a private key. No program deployment is performed by this tool.');
    return;
  }
  if (mode !== 'open' && (options['payer-keypair'] || options['approve-plan'])) throw new Error('Signing arguments are forbidden in read-only modes');
  const artifact = await readFile(required('artifact')); checkArtifact(artifact);
  const need = createRequire(resolve(options.dependencies || join(homedir(), 'code-ec/poleis-protocol/js/package.json')));
  const web3 = need('@solana/web3.js'), nacl = need('tweetnacl');
  const { create } = await import('../js/poleis-client.js');
  const P = create({ web3, nacl }), owner = new web3.PublicKey(AUTHORITY), root = BigInt(ROOT);
  let plan = mode === 'prepare' ? null : checkPlan(JSON.parse(await readFile(required('plan'), 'utf8')), { fresh: mode === 'open' });
  const rpc = plan?.rpc || options.rpc || 'https://api.mainnet-beta.solana.com';
  const endpoint = new URL(rpc);
  if (endpoint.protocol !== 'https:' || endpoint.username || endpoint.password || endpoint.hash || endpoint.search) throw new Error('Use a public HTTPS RPC endpoint without credentials');
  const call = async (method, params = []) => {
    const r = await request(rpc, { jsonrpc: '2.0', id: 1, method, params });
    if (r.error || !Object.hasOwn(r, 'result')) throw new Error(`RPC ${method} failed`); return r.result;
  };
  if (await call('getGenesisHash') !== GENESIS) throw new Error('RPC is not Solana mainnet');
  const addresses = { config: P.configPda(root), treasury: P.treasuryPda(root), registry: P.registryPda(root), sale: P.salePda(root, 0n) };
  const publicAddresses = Object.fromEntries(Object.entries(addresses).map(([k, v]) => [k, v.toBase58()]));
  const account = v => v && { ...v, data: Buffer.from(v.data[0], 'base64') };
  async function readAccounts(keys) {
    const r = await call('getMultipleAccounts', [keys.map(k => k.toBase58()), { encoding: 'base64', commitment: 'finalized' }]);
    if (!r?.context || !Array.isArray(r.value) || r.value.length !== keys.length) throw new Error('Invalid account response');
    return { slot: r.context.slot, values: r.value.map(account) };
  }
  async function deployed() {
    const r = await readAccounts([P.PROGRAM_ID, P.programdataPda()]);
    checkProgram({ program: r.values[0], programData: r.values[1], expectedProgramData: Buffer.from(P.programdataPda().toBytes()),
      authorityBytes: Buffer.from(owner.toBytes()), artifact }); return r.slot;
  }
  const conn = new web3.Connection(rpc, 'confirmed');
  function transaction() {
    const g = { charter: Buffer.from(sha256(TERMS.name), 'hex'), planCap: BigInt(TERMS.planCap), planPeriod: BigInt(TERMS.planPeriod),
      window: BigInt(TERMS.window), rung: TERMS.rung, reserve: BigInt(plan.depositLamports), deposit: BigInt(plan.depositLamports),
      commitEnd: BigInt(plan.commitEndSlot), revealEnd: BigInt(plan.revealEndSlot), founders: [], name: TERMS.name, desc: TERMS.description };
    return new web3.Transaction().add(P.initConfig(owner, null, root), P.openGenesis(owner, g, root));
  }
  if (mode === 'prepare') {
    const quoteSource = 'https://api.coinbase.com/v2/prices/SOL-USD/spot';
    const [quoteResult, slot, funds, existing, program] = await Promise.all([
      request(quoteSource), call('getSlot', [{ commitment: 'finalized' }]), call('getBalance', [AUTHORITY, { commitment: 'finalized' }]),
      readAccounts(Object.values(addresses)), readAccounts([P.PROGRAM_ID, P.programdataPda()]),
    ]);
    const quote = quoteResult.data;
    if (!quote || quote.base !== 'SOL' || quote.currency !== 'USD') throw new Error('Invalid SOL/USD source');
    const depositLamports = solForTenDollars(quote.amount), createdAt = Date.now();
    const rents = Object.fromEntries(await Promise.all(Object.entries({ ...ACCOUNT_BYTES, program: 36, programData: BINARY.bytes + 45, buffer: BINARY.bytes + 37 })
      .map(async ([name, bytes]) => [name, String(await call('getMinimumBalanceForRentExemption', [bytes]))])));
    let deployment = 'missing';
    if (program.values.some(Boolean)) { await deployed(); deployment = 'verified'; }
    plan = sealPlan({ schema: 'dyson.bronze-mainnet-plan.v1', network: 'mainnet-beta', genesis: GENESIS, rpc, source: SOURCE,
      program: PROGRAM, authority: AUTHORITY, binary: BINARY, terms: TERMS, addresses: publicAddresses,
      createdAt, expiresAt: createdAt + 600000, quote: { source: quoteSource, currency: 'USD', amount: quote.amount }, depositLamports,
      openedSlot: String(slot), commitEndSlot: String(BigInt(slot) + BigInt(TERMS.commitSlots)),
      revealEndSlot: String(BigInt(slot) + BigInt(TERMS.commitSlots) + BigInt(TERMS.revealSlots)),
      observed: { slot: existing.slot, deployment, authorityLamports: String(funds.value), existingSaleAccounts: existing.values.map(Boolean), rentLamports: rents },
    });
    checkPlan(plan);
    await writeFile(required('out'), json(plan), { flag: 'wx' });
    console.log(json({ status: 'prepared_not_signed', plan: resolve(options.out), digest: plan.digest, authority: AUTHORITY,
      depositLamports, quotedSolUsd: quote.amount, deployment, authorityLamports: String(funds.value), rentLamports: rents,
      note: 'The fixed SOL amount is the $10 launch quote, not a live USD peg. Review 150 places and 1080000/216000-slot windows. Prepare again after deployment; plans expire after ten minutes.' }));
    return;
  }
  if (JSON.stringify(plan.addresses) !== JSON.stringify(publicAddresses)) throw new Error('Derived sale addresses changed');
  await deployed();
  if (mode === 'open') {
    // This path is deliberately explicit and is only for the human owner to execute.
    if (required('approve-plan') !== plan.digest) throw new Error('Approval must name the exact reviewed plan digest');
    const current = await readAccounts(Object.values(addresses));
    if (current.values.some(Boolean)) throw new Error('A sale account already exists; verify it rather than submitting again');
    if (BigInt(current.slot) >= BigInt(plan.commitEndSlot)) throw new Error('Commit window has ended');
    const tx = transaction(), latest = await conn.getLatestBlockhash('confirmed');
    tx.feePayer = owner; tx.recentBlockhash = latest.blockhash;
    const fees = await conn.getFeeForMessage(tx.compileMessage(), 'confirmed');
    if (!Number.isSafeInteger(fees.value)) throw new Error('Network fee unavailable');
    const rents = await Promise.all(Object.values(ACCOUNT_BYTES).map(bytes => conn.getMinimumBalanceForRentExemption(bytes)));
    const requiredLamports = rents.reduce((a, b) => a + BigInt(b), BigInt(fees.value));
    if (BigInt(await conn.getBalance(owner, 'confirmed')) < requiredLamports) throw new Error(`Fund the authority for sale initialization: at least ${requiredLamports} lamports plus deployment, if needed`);
    const simulation = await conn.simulateTransaction(new web3.VersionedTransaction(tx.compileMessage()));
    if (simulation.value.err) throw new Error(`Sale simulation failed: ${JSON.stringify(simulation.value.err)}`);
    checkPlan(plan); // Do not read a signer until the network, code, exact terms, funds and simulation pass.
    const secret = JSON.parse(await readFile(required('payer-keypair'), 'utf8'));
    if (!Array.isArray(secret) || secret.length !== 64 || secret.some(x => !Number.isInteger(x) || x < 0 || x > 255)) throw new Error('Invalid signer file');
    const payer = web3.Keypair.fromSecretKey(Uint8Array.from(secret)); secret.fill(0);
    if (!payer.publicKey.equals(owner)) throw new Error('Signer is not the reviewed authority');
    tx.sign(payer);
    const signature = await conn.sendRawTransaction(tx.serialize(), { skipPreflight: false, maxRetries: 0 });
    console.log(json({ signature, note: 'Submission is not confirmation. Do not resubmit after a timeout; use verify.' }));
    const confirmation = await conn.confirmTransaction({ ...latest, signature }, 'finalized');
    if (confirmation.value.err) throw new Error(`Sale failed: ${JSON.stringify(confirmation.value.err)}`);
  }
  const snapshot = await readAccounts(Object.values(addresses));
  for (const a of snapshot.values) if (!a || a.owner !== PROGRAM || a.executable) throw new Error('Sale accounts are missing or belong to another program');
  const [config, treasury, registry, sale] = snapshot.values.map((a, i) => [P.Config, P.Treasury, P.Registry, P.Sale][i].parse(a.data));
  const normalized = JSON.parse(json({ config, treasury, registry, sale }));
  if (registry) normalized.registry.charter = Buffer.from(registry.charter).toString('hex');
  checkSale({ plan, ...normalized });
  if (mode === 'publish') {
    if (BigInt(snapshot.slot) >= BigInt(plan.commitEndSlot)) throw new Error('The commit window has ended; do not activate a new sale');
    const output = resolve(required('out'));
    const result = { schema: 'dl-harmony.whitelist.v1', tier: 'bronze', status: 'published', cluster: 'mainnet-beta', rpc, program: PROGRAM,
      layout: 8, root: ROOT, sale: '0', slots: TERMS.slots, rung: TERMS.rung, usdPerSlot: 10, solUsdAtOpen: plan.quote.amount,
      reserveLamports: plan.depositLamports, depositLamports: plan.depositLamports, openedSlot: plan.openedSlot,
      commitEndSlot: plan.commitEndSlot, revealEndSlot: plan.revealEndSlot, config: publicAddresses.config,
      treasury: publicAddresses.treasury, registry: publicAddresses.registry, saleAccount: publicAddresses.sale,
      programSha256: BINARY.sha256, verifiedAtSlot: String(snapshot.slot), launchPlanDigest: plan.digest };
    const temporary = `${output}.mainnet-${process.pid}.tmp`;
    await writeFile(temporary, json(result), { flag: 'wx' }); await rename(temporary, output);
    console.log(json({ status: 'mainnet_sale_verified_config_written', output, slot: snapshot.slot }));
  } else console.log(json({ status: 'mainnet_program_and_sale_verified', slot: snapshot.slot, addresses: publicAddresses }));
}
run().catch(error => { console.error(error.message); process.exitCode = 1; });
