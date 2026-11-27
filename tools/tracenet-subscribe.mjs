#!/usr/bin/env node
// tracenet-subscribe.mjs: AN AGENT SUBSCRIBES TO A TRACENET with its own key (THE AGENTS SUBSCRIBE, Oct 30 2026; the law in app/tracenet-register.mjs,
// the bytes in app/tracenet-subscribe.mjs). His words, UTC:
//   - Oct 30 01:53: "consider that it is meant to be a onlyfans for agents".
//   - 01:58: "Build it" on the seat's words "a fan agent subscribes to a creator's tracenet and pays the creator's tank from its own key on devnet, and
//     the creator's drops open to it for the period".
// The agent's key is its Nest key: a seat's {seat, key, private_pem}, a golem's {alg: 'ed25519', pkcs8}, or a Solana keypair file. The same Ed25519 key
// is its Solana account, so the agent signs the payment itself and no wallet or custodian stands between. Nothing runs at rest: the client acts when
// it is run.
//
//   node tools/tracenet-subscribe.mjs terms     --site <origin> --handle <h>
//   node tools/tracenet-subscribe.mjs subscribe --site <origin> --handle <h> --key <file> [--rpc <url>]
//   node tools/tracenet-subscribe.mjs read      --site <origin> --handle <h> --key <file> --signature <sig> --id <drop id> [--out <file>]
//   (--rpc defaults to devnet: a subscription on mainnet is his hand, never a seat's)
import { createPrivateKey, createPublicKey, sign as edSign } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { encode58, seatSignIn, sealSeatProof } from '../app/dl-direct-protocol.mjs';
import { readManifest, vaultUrl } from '../app/tracenet-register.mjs';
import { signedSubscription, subscribeMessage, verifySubscription } from '../app/tracenet-subscribe.mjs';

export const DEVNET = 'https://api.devnet.solana.com';
const PKCS8_ED25519 = Buffer.from('302e020100300506032b657004220420', 'hex');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** signerOf(record): {address, sign(bytes)} for a Nest key record or a Solana keypair (64 numbers). The address is the key's raw public half, base58. */
export function signerOf(record) {
  let key;
  if (Array.isArray(record) && record.length === 64) key = createPrivateKey({ key: Buffer.concat([PKCS8_ED25519, Buffer.from(record.slice(0, 32))]), format: 'der', type: 'pkcs8' });
  else if (record && typeof record.private_pem === 'string') key = createPrivateKey(record.private_pem);
  else if (record && record.alg === 'ed25519' && /^[0-9a-f]+$/i.test(record.pkcs8 ?? '')) key = createPrivateKey({ key: Buffer.from(record.pkcs8, 'hex'), format: 'der', type: 'pkcs8' });
  else throw new Error('not an ed25519 key of the Nest');
  if (key.asymmetricKeyType !== 'ed25519') throw new Error('not an ed25519 key of the Nest');
  const spki = createPublicKey(key).export({ format: 'der', type: 'spki' });
  if (record && typeof record.key === 'string' && record.key.toLowerCase() !== spki.toString('hex')) throw new Error("the record's public key is not its private key's");
  const address = encode58(spki.subarray(-32));
  if (Array.isArray(record) && encode58(Uint8Array.from(record.slice(32))) !== address) throw new Error("the keypair's public half is not its seed's");
  return { address, sign: (bytes) => new Uint8Array(edSign(null, Buffer.from(bytes), key)) };
}

/** rpcOf(node): one JSON-RPC call to the cluster's node, its result or the node's error. */
export function rpcOf(node, fetcher = (...a) => fetch(...a)) {
  return async (method, params = []) => {
    const r = await fetcher(node, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }), signal: AbortSignal.timeout(15000) });
    const j = await r.json();
    if (j.error) throw new Error(`${method}: ${j.error.message || 'RPC error'}`);
    return j.result;
  };
}

/** registerOf({site, handle}): the tracenet's register as its creators door answers it (worker/creators.mjs), read by the register's law. */
export async function registerOf({ site, handle, fetcher = (...a) => fetch(...a) }) {
  const r = await fetcher(`${site}/api/premint/creators/${encodeURIComponent(handle)}`, { cache: 'no-store', signal: AbortSignal.timeout(15000) });
  if (!r.ok) throw new Error(`No such tracenet (${r.status})`);
  const register = readManifest(await r.json(), handle, { receipt: false });
  if (!register) throw new Error('Not a tracenet register');
  return register;
}

/**
 * subscribe({rpc, register, signer}): the agent pays the register's price to its payee from its own key, one transaction (app/tracenet-subscribe.mjs),
 * sent and waited on until the cluster finalizes it, then read back and checked as the vault checks it. {signature, from, until, slot, lamports,
 * bytes, ms}.
 */
export async function subscribe({ rpc, register, signer, waitMs = 120000, clock = () => Date.now() }) {
  const payee = register.payee ?? register.wallet;
  if (!register.subscribeLamports || !payee) throw new Error('This tracenet takes no subscription');
  const t0 = clock();
  const { value } = await rpc('getLatestBlockhash', [{ commitment: 'finalized' }]);
  const message = subscribeMessage({ subscriber: signer.address, payee, lamports: register.subscribeLamports, blockhash: value.blockhash, handle: register.handle });
  const wire = signedSubscription(message, signer.sign(message));
  const signature = await rpc('sendTransaction', [wire, { encoding: 'base64', preflightCommitment: 'confirmed' }]);
  let tx = null;
  while (clock() - t0 < waitMs) {
    const status = (await rpc('getSignatureStatuses', [[signature], { searchTransactionHistory: true }]))?.value?.[0];
    if (status?.err) throw new Error(`The payment failed: ${JSON.stringify(status.err)}`);
    if (status?.confirmationStatus === 'finalized') { tx = await rpc('getTransaction', [signature, { encoding: 'base64', commitment: 'finalized', maxSupportedTransactionVersion: 0 }]); if (tx) break; }
    await sleep(1500);
  }
  if (!tx) throw new Error(`Not finalized in ${waitMs} ms: ${signature}`);
  const held = await verifySubscription(tx, { handle: register.handle, payee, price: register.subscribeLamports, subscriber: signer.address });
  return { ...held, fee: tx.meta?.fee ?? null, bytes: Buffer.from(wire, 'base64').length, ms: clock() - t0 };
}

/** seatProof({site, signer}): the agent's sign-in for this site (dl-direct-protocol.mjs THE SEAT PROOF), signed by its own key: it shows the key that paid is the one asking. */
export function seatProof({ site, signer, now = Date.now() }) {
  const url = new URL(site), text = seatSignIn({ host: url.host, origin: url.origin, address: signer.address, now });
  return sealSeatProof(text, signer.sign(new TextEncoder().encode(text)));
}

/** readDrop({site, register, id, signer, signature}): the drop's bytes through the vault, shown the subscription and the agent's seat proof. The Response. */
export function readDrop({ site, register, id, signer, signature, now = Date.now(), fetcher = (...a) => fetch(...a), method = 'GET' }) {
  const item = register.items.find((i) => i.id === id);
  if (!item) throw new Error(`No drop ${id} in ${register.handle}'s register`);
  const headers = { 'x-seat': seatProof({ site, signer, now }), ...(signature ? { 'x-subscription': signature } : {}) };
  return fetcher(`${site}${vaultUrl(register.handle, item)}`, { method, headers, cache: 'no-store', signal: AbortSignal.timeout(15000) });
}

async function main(argv) {
  const [cmd] = argv, arg = (k, d) => { const i = argv.indexOf(`--${k}`); return i > 0 ? argv[i + 1] : d; };
  const site = arg('site'), handle = arg('handle');
  if (!['terms', 'subscribe', 'read'].includes(cmd) || !site || !handle) throw new Error('usage: tracenet-subscribe.mjs terms|subscribe|read --site <origin> --handle <h> [--key <file>] (see the head of this file)');
  const register = await registerOf({ site, handle });
  if (cmd === 'terms') { console.log(JSON.stringify({ handle, payee: register.payee ?? register.wallet, lamports: register.subscribeLamports ?? null, drops: register.items.length }, null, 2)); return; }
  const signer = signerOf(JSON.parse(readFileSync(arg('key'), 'utf8')));
  if (cmd === 'subscribe') {
    const held = await subscribe({ rpc: rpcOf(arg('rpc', DEVNET)), register, signer });
    console.log(JSON.stringify({ subscriber: signer.address, ...held, from: new Date(held.from).toISOString(), until: new Date(held.until).toISOString() }, null, 2));
    return;
  }
  const response = await readDrop({ site, register, id: arg('id'), signer, signature: arg('signature') });
  if (!response.ok) { console.log(JSON.stringify({ status: response.status, ...(await response.json().catch(() => ({}))) }, null, 2)); process.exitCode = 1; return; }
  const bytes = Buffer.from(await response.arrayBuffer());
  if (arg('out')) writeFileSync(arg('out'), bytes); else process.stdout.write(bytes);
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) main(process.argv.slice(2)).catch((e) => { console.error(e.message); process.exit(1); });
