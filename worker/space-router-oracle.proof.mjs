// space-router-oracle.proof.mjs · THE ROUTER IS THE ORACLE on a real wire (lane/the-router-is-the-oracle): the Worker's own handler served over HTTP on this
// Mac's loopback, a stand-in MiniRouter beside it (no network, no money), a tank made by the tank tool's SQL, and curl as the stranger's agent. Every receipt
// is verified as a stranger would, with nothing but the key /oracle names: its signature, its ask against the words sent, its answer against the words that came
// back; then the hour is sealed (the door's clock moved past it), each receipt's proof is checked against the root, the anchor's transaction is built with no
// network, and the oracle's own cost is measured. Every server ends with the proof; it exits 1 on the first line that does not hold.
//   nice -n 19 node worker/space-router-oracle.proof.mjs [--calls 1000]                 (ports of its own: never 9061, 9062 or 8978)
//   ... --devnet-payer <a funded devnet keypair.json>   also sends the sealed root's anchor on devnet and reads it back (the receipt's one real anchor; the gate
//                                                       runs it without, offline)
import http from 'node:http';
import { d1, migrated } from './d1-on-sqlite.mjs';   // D1's surface on node:sqlite, a database built by every migration
import { readFileSync } from 'node:fs';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { createPrivateKey, createPublicKey, randomBytes } from 'node:crypto';
import { createHandler } from './premint.mjs';
import { CHAT_PATH, ORACLE_PATH, ROOT_PATH, PROOF_PATH } from './space-router.mjs';
import * as O from '../app/space-router-oracle.mjs';
import { addSql, refillSql, keyHash, newKey } from '../tools/space-router-tank.mjs';
import { anchorDraft, anchorSend } from '../tools/space-router-oracle.mjs';
import { signerOf } from '../vendor/tools/warm-launch/rpc.mjs';

const flag = (k) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : null; };
const CALLS = Number(flag('--calls') || 1000), PAYER = flag('--devnet-payer'), LIMIT_MS = PAYER ? 240_000 : 120_000;
setTimeout(() => { console.log('proof: out of time'); process.exit(3); }, LIMIT_MS).unref();
let failed = 0;
const holds = (ok, line) => { console.log(`${ok ? 'ok  ' : 'FAIL'} ${line}`); if (!ok) failed++; };

const db = migrated();
const key = newKey(); db.exec(addSql('proof-rider', keyHash(key))); db.exec(refillSql('proof-rider', 50, 'the proof\'s pour'));
const stranger = newKey(); db.exec(addSql('proof-stranger', keyHash(stranger))); db.exec(refillSql('proof-stranger', 1, 'another tank'));
const oracle = await O.newOracleKey();

// the stand-in router: MiniRouter's shape, its cost in its header, the words it was given said back
const router = http.createServer((req, res) => {
  let body = ''; req.on('data', (c) => { body += c; }).on('end', () => {
    const j = JSON.parse(body || '{}');
    res.writeHead(200, { 'content-type': 'application/json', 'x-minirouter-cost-usd': '0.0979' });
    res.end(JSON.stringify({ id: 'chatcmpl-proof', object: 'chat.completion', created: 1, model: j.model, choices: [{ index: 0, message: { role: 'assistant', content: `heard: ${j.messages.at(-1).content}` }, finish_reason: 'stop' }],
      usage: { prompt_tokens: 9, completion_tokens: 4, total_tokens: 13, prompt_tokens_details: { cached_tokens: 6 } } }));
  });
});
await new Promise((ok) => router.listen(0, '127.0.0.1', ok));
const env = { DB: d1(db), ASSETS: { fetch: () => new Response('asset') }, SPACE_ROUTER_KEY: 'stand-in-house-key', SPACE_ROUTER_OPENED_AT: new Date().toISOString(),
  SPACE_ROUTER_UPSTREAM: `http://127.0.0.1:${router.address().port}/v1`, SPACE_ROUTER_ORACLE_KEY: oracle.secret };
const clock = { ms: Date.now() }, handle = createHandler({ clockMs: () => clock.ms });   // the door's clock, moved past the hour to seal it
const door = http.createServer((req, res) => {
  const chunks = []; req.on('data', (c) => chunks.push(c)).on('end', async () => {
    const r = await handle(new Request(`https://optimism.fit${req.url}`, { method: req.method, headers: req.headers, body: chunks.length ? Buffer.concat(chunks) : undefined }), env, {});
    res.writeHead(r.status, Object.fromEntries(r.headers)); res.end(Buffer.from(await r.arrayBuffer()));
  });
});
await new Promise((ok) => door.listen(0, '127.0.0.1', ok));
const base = `http://127.0.0.1:${door.address().port}`, dec = new TextDecoder();
try {
  const curl = async (...a) => (await promisify(execFile)('curl', ['-sS', '--max-time', '20', ...a], { encoding: 'utf8', maxBuffer: 1 << 26 })).stdout;
  const split = (raw) => { const at = raw.indexOf('\r\n\r\n'); const head = raw.slice(0, at), body = raw.slice(at + 4);
    return { status: Number(head.split(' ')[1]), headers: Object.fromEntries(head.split('\r\n').slice(1).map((l) => [l.slice(0, l.indexOf(':')).toLowerCase(), l.slice(l.indexOf(':') + 1).trim()])), body }; };
  const post = async (asked, k = key) => split(await curl('-i', `${base}${CHAT_PATH}`, '-H', `authorization: Bearer ${k}`, '-H', 'content-type: application/json', '-d', JSON.stringify(asked)));
  const get = async (path, k) => split(await curl('-i', `${base}${path}`, ...(k ? ['-H', `authorization: Bearer ${k}`] : [])));

  console.log('== the oracle, as a stranger reads it');
  const named = JSON.parse((await get(ORACLE_PATH)).body);
  console.log(JSON.stringify(named));
  holds(named.key === oracle.publicHex && named.alg === 'Ed25519', 'the door names the key that signs its receipts');

  console.log('== calls through the door, each receipt verified with nothing but that key');
  const P = O.periodOf(clock.ms), mine = [];
  for (const [i, words] of ['say ok', 'what is cognitio salvata', 'the third'].entries()) {
    const asked = { model: 'openai/gpt-5.6-sol', messages: [{ role: 'user', content: words }], ...(i === 1 ? { stream: true } : {}) };
    const r = await post(asked), signed = JSON.parse(dec.decode(O.fromB64u(r.headers['x-space-router-receipt'])));
    const leaf = O.hexOf(await O.leafOf(signed)); mine.push({ signed, leaf });
    console.log(`${r.status} ${i === 1 ? 'stream' : 'whole '} receipt ${r.headers['x-space-router-receipt'].length} chars, leaf ${leaf.slice(0, 16)}…, ${JSON.stringify({ ...signed, sig: `${signed.sig.slice(0, 12)}…` })}`);
    holds(await O.verifyReceipt(signed, named.key), `the signature holds under the door's key (${words})`);
    holds(signed.ask === await O.askOf(asked), 'its ask is the sha256 of the words this agent sent');
    if (i !== 1) holds(signed.answer === await O.answerOf(JSON.parse(r.body)), 'its answer is the sha256 of the whole answer this agent got');
    holds(signed.tokens_in === 9 && signed.tokens_out === 4 && signed.tokens_cached === 6, 'its tokens are the provider\'s: 9 in, 4 out, 6 of the 9 read from its cache');
    holds(!(await O.verifyReceipt({ ...signed, usd: signed.usd / 2 }, named.key)), 'the same receipt with half its cost does not verify');
  }
  const stray = await post({ model: 'openai/gpt-5.6-sol', messages: [{ role: 'user', content: 'another tank' }] }, stranger);
  const strayLeaf = O.hexOf(await O.leafOf(JSON.parse(dec.decode(O.fromB64u(stray.headers['x-space-router-receipt'])))));
  holds(!/cognitio|heard|say ok/.test(JSON.stringify(db.prepare('SELECT * FROM sr_receipts').all())), 'the door kept four receipts and none of the words');

  console.log('== the hour, sealed once it is five minutes over');
  const early = await get(`${ROOT_PATH}?period=${P}`);
  holds(early.status === 409, `before: ${JSON.parse(early.body).error.message}`);
  clock.ms = O.sealableAt(P);
  const seal = JSON.parse((await get(`${ROOT_PATH}?period=${O.hourOf(P)}`)).body);
  console.log(JSON.stringify(seal));
  holds(seal.n === 4 && seal.by === named.key, 'four receipts under one root, signed by the key the door names');
  for (const m of mine) {
    const p = JSON.parse((await get(`${PROOF_PATH}?receipt=${m.leaf}`, key)).body);
    holds(await O.verifyInclusion(O.bytesOfHex(m.leaf), p.index, p.n, p.proof.map(O.bytesOfHex), O.bytesOfHex(seal.root)), `receipt ${m.leaf.slice(0, 12)}… is leaf ${p.index} of ${p.n} under the root (${p.proof.length} hashes)`);
  }
  holds((await get(`${PROOF_PATH}?receipt=${strayLeaf}`, key)).status === 404, 'another tank\'s receipt is not this tank\'s to prove');
  clock.ms += 7 * 86_400_000;
  holds(JSON.stringify(JSON.parse((await get(`${ROOT_PATH}?period=${P}`)).body)) === JSON.stringify(seal), 'a week later the root is the same');

  console.log('== the anchor: the root in a memo, one transaction');
  const memo = O.memoOf(seal), seed = randomBytes(32);
  const priv = createPrivateKey({ key: Buffer.concat([Buffer.from('302e020100300506032b657004220420', 'hex'), seed]), format: 'der', type: 'pkcs8' });
  const throwaway = signerOf([...seed, ...createPublicKey(priv).export({ format: 'der', type: 'spki' }).subarray(12)]);
  const draft = anchorDraft(memo, throwaway);
  console.log(`${memo}\n${draft.size} bytes signed, built with no network (a dry run)`);
  holds(draft.size <= 1232 && O.memoRead(memo)?.root === seal.root, 'the memo reads back the root, inside one transaction');
  if (PAYER) {
    const payer = signerOf(JSON.parse(readFileSync(PAYER, 'utf8')));
    const a = await anchorSend(memo, payer, { log: (l) => console.log(l) });
    console.log(JSON.stringify({ signature: a.signature, slot: a.slot, fee_lamports: a.fee, bytes: a.size, units: a.units, signer: a.signer, explorer: `https://explorer.solana.com/tx/${a.signature}?cluster=devnet` }));
    holds(a.memo === memo && a.read?.root === seal.root && a.signer === payer.address, 'devnet holds the memo, signed by the anchor\'s key');
  }

  console.log('== the oracle\'s own cost');
  const sizes = [['a short call', 'say ok'], ['a call of 200 KB', 'x'.repeat(200_000)]];
  for (const [what, words] of sizes) {
    const asked = { model: 'openai/gpt-5.6-sol', messages: [{ role: 'system', content: 'you are an agent' }, { role: 'user', content: words }] };
    const answered = { id: 'x', object: 'chat.completion', created: 1, model: 'openai/gpt-5.6-sol', choices: [{ index: 0, message: { role: 'assistant', content: words.slice(0, 4000) }, finish_reason: 'stop' }], usage: { prompt_tokens: 9, completion_tokens: 4 } };
    const signer = await O.oracleKey(oracle.secret), took = [];
    for (let i = 0; i < (words.length > 1000 ? 200 : CALLS); i++) {
      const t = process.hrtime.bigint();
      const s = await O.signReceipt(O.receiptOf({ at: clock.ms, tank: 'proof-rider', asked_model: asked.model, model: answered.model, provider: 'api.minirouter.sh', ask: await O.askOf(asked),
        answer: await O.answerOf(answered), usd: 0.102795, router_usd: 0.0979, tokens_in: 9, tokens_out: 4 }), signer);
      O.canonical(s); await O.leafOf(s);
      took.push(Number(process.hrtime.bigint() - t) / 1000);
    }
    took.sort((x, y) => x - y);
    console.log(`${what}: the two hashes, the receipt, its signature and its leaf: p50 ${took[Math.floor(took.length / 2)].toFixed(0)} µs, p95 ${took[Math.floor(took.length * 0.95)].toFixed(0)} µs (${took.length} receipts)`);
  }
  const fast = createHandler({ fetcher: async () => new Response('{"id":"x","model":"m","choices":[{"index":0,"message":{"role":"assistant","content":"ok"},"finish_reason":"stop"}],"usage":{"prompt_tokens":1,"completion_tokens":1}}', { headers: { 'x-minirouter-cost-usd': '0.0001' } }), clockMs: () => clock.ms });
  db.exec(refillSql('proof-rider', 1000, 'the cost run'));
  const pages = (t) => db.prepare(`SELECT SUM(pgsize) AS b FROM dbstat WHERE name LIKE '${t}%'`).get()?.b ?? null;
  const pageBytes = () => db.prepare('PRAGMA page_count').get().page_count * db.prepare('PRAGMA page_size').get().page_size;
  let statOk = true; try { pages('sr_receipts'); } catch { statOk = false; }
  const before = pageBytes(), beforeR = statOk ? pages('sr_receipts') : null, took = [];
  for (let i = 0; i < CALLS; i++) {
    const t = process.hrtime.bigint();
    const r = await fast(new Request(`https://optimism.fit${CHAT_PATH}`, { method: 'POST', headers: { authorization: `Bearer ${key}`, 'content-type': 'application/json', 'cf-connecting-ip': `198.51.100.${i % 200}` },
      body: JSON.stringify({ model: 'm', messages: [{ role: 'user', content: 'ok' }] }) }), env, {});
    await r.arrayBuffer(); took.push(Number(process.hrtime.bigint() - t) / 1000);
    if (r.status !== 200) throw new Error(`call ${i}: ${r.status}`);
  }
  took.sort((x, y) => x - y);
  console.log(`the door a call, the oracle in it: p50 ${took[Math.floor(took.length / 2)].toFixed(0)} µs, p95 ${took[Math.floor(took.length * 0.95)].toFixed(0)} µs (${CALLS} calls, the router answering at once, this process's SQLite); the database grew ${((pageBytes() - before) / CALLS).toFixed(0)} bytes a call${statOk ? `, the receipts' table and index ${((pages('sr_receipts') - beforeR) / CALLS).toFixed(0)}` : ''}`);
} finally { door.close(); router.close(); door.closeAllConnections?.(); router.closeAllConnections?.(); }
console.log(failed ? `${failed} line(s) do not hold` : 'every line holds');
process.exit(failed ? 1 : 0);
