// space-router.proof.mjs · SPACE ROUTER'S PUBLIC DOOR on a real wire (lane/space-routers-public-door): the Worker's own handler served over HTTP on this Mac's
// loopback, a stand-in MiniRouter beside it (no network, no money), a tank made by the tank tool's SQL, and curl as the stranger's agent: a whole answer,
// a stream, the tank read back. Then the door's own cost: a call through the handler with the router answering at once. Every server ends with the proof.
//   nice -n 19 node worker/space-router.proof.mjs [--port N] [--calls 2000]   (ports of its own unless given: 8978, its old one, is a house door the gate's guard refuses)
import http from 'node:http';
import { d1, migrated } from './d1-on-sqlite.mjs';   // D1's surface on node:sqlite, a database built by every migration
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { createHandler } from './premint.mjs';
import { CHAT_PATH, TANK_PATH } from './space-router.mjs';
import { addSql, refillSql, keyHash, newKey } from '../tools/space-router-tank.mjs';
import { newOracleKey } from '../app/space-router-oracle.mjs';

const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? Number(process.argv[i + 1]) : d; };
const PORT = arg('--port', 0), CALLS = arg('--calls', 2000), LIMIT_MS = 120_000;
setTimeout(() => { console.log('proof: out of time'); process.exit(3); }, LIMIT_MS).unref();

const db = migrated();
const key = newKey(); db.exec(addSql('proof-rider', keyHash(key))); db.exec(refillSql('proof-rider', 5, 'the proof\'s pour'));

// the stand-in router: MiniRouter's shape, its cost in its header
const router = http.createServer((req, res) => {
  let body = ''; req.on('data', (c) => { body += c; }).on('end', () => {
    const j = JSON.parse(body || '{}');
    res.writeHead(200, { 'content-type': 'application/json', 'x-minirouter-cost-usd': '0.0979', 'x-minirouter-balance-usd': '317.95' });
    res.end(JSON.stringify({ id: 'chatcmpl-proof', object: 'chat.completion', created: 1, model: j.model, choices: [{ index: 0, message: { role: 'assistant', content: `ok (asked stream:${j.stream})` }, finish_reason: 'stop' }],
      usage: { prompt_tokens: 9, completion_tokens: 4, total_tokens: 13 } }));
  });
});
await new Promise((ok) => router.listen(PORT ? PORT + 1 : 0, '127.0.0.1', ok));
const env = { DB: d1(db), ASSETS: { fetch: () => new Response('asset') }, SPACE_ROUTER_KEY: 'stand-in-house-key', SPACE_ROUTER_OPENED_AT: new Date().toISOString(),
  SPACE_ROUTER_UPSTREAM: `http://127.0.0.1:${router.address().port}/v1`, SPACE_ROUTER_ORACLE_KEY: (await newOracleKey()).secret };   // THE ROUTER IS THE ORACLE: no oracle, no router
const handle = createHandler();
const door = http.createServer((req, res) => {
  const chunks = []; req.on('data', (c) => chunks.push(c)).on('end', async () => {
    const r = await handle(new Request(`https://optimism.fit${req.url}`, { method: req.method, headers: req.headers, body: chunks.length ? Buffer.concat(chunks) : undefined }), env, {});
    res.writeHead(r.status, Object.fromEntries(r.headers)); res.end(Buffer.from(await r.arrayBuffer()));
  });
});
await new Promise((ok) => door.listen(PORT, '127.0.0.1', ok));
const base = `http://127.0.0.1:${door.address().port}`;
try {
  const curl = async (...a) => (await promisify(execFile)('curl', ['-sS', '--max-time', '20', ...a], { encoding: 'utf8' })).stdout;   // async: the servers answer from this process
  const said = { model: 'openai/gpt-5.6-sol', messages: [{ role: 'user', content: 'say ok' }] };
  console.log('== a whole answer (curl, the key as the bearer), nothing minted');
  console.log((await curl('-i', `${base}${CHAT_PATH}`, '-H', `authorization: Bearer ${key}`, '-H', 'content-type: application/json', '-d', JSON.stringify(said))).replace(/\r/g, '').split('\n').filter((l) => /^(HTTP|x-space-router|content-type|\{)/.test(l)).join('\n'));
  db.exec("INSERT INTO sr_deposits VALUES ('sig', 'payer', 'proof-rider', '0', 10, 'mint', 'mainnet', 1, 1, 1, 'none'); INSERT INTO sr_drops(signature, tier, usd, at_ms, slot, heard_at) VALUES ('sig', 'bronze', 10, 1, 1, 1)");   // PROMPT-TO-MINE IS FOR WHO MINTED: the call above mined nothing; from here the rider holds a hexagon
  console.log('== a stream (curl -N), the rider\'s egg minted');
  console.log((await curl('-N', `${base}${CHAT_PATH}`, '-H', `authorization: Bearer ${key}`, '-H', 'content-type: application/json', '-d', JSON.stringify({ ...said, stream: true }))).trim());
  console.log('== the tank, read back');
  console.log(await curl(`${base}${TANK_PATH}`, '-H', `authorization: Bearer ${key}`));
  console.log('== a stranger\'s key'); console.log(await curl(`${base}${CHAT_PATH}`, '-H', 'authorization: Bearer sr_nobody', '-H', 'content-type: application/json', '-d', JSON.stringify(said)));
  const rows = db.prepare("SELECT kind, usd, router_usd, warm, model, tokens_in, tokens_out FROM sr_ledger ORDER BY id").all().map((r) => ({ ...r }));
  console.log('== the ledger'); for (const r of rows) console.log(JSON.stringify(r));

  // the door's own cost: the router answers at once, the database is this process's SQLite; D1's round trips at the edge are the edge's (three a call)
  const fast = createHandler({ fetcher: async () => new Response('{"id":"x","choices":[{"index":0,"message":{"role":"assistant","content":"ok"},"finish_reason":"stop"}],"usage":{"prompt_tokens":1,"completion_tokens":1}}', { headers: { 'x-minirouter-cost-usd': '0.0001' } }) });
  db.exec(refillSql('proof-rider', 1000, 'the cost run'));
  const pages = () => db.prepare('PRAGMA page_count').get().page_count * db.prepare('PRAGMA page_size').get().page_size;
  const before = pages(), took = [];
  for (let i = 0; i < CALLS; i++) {
    const t = process.hrtime.bigint();
    const r = await fast(new Request(`https://optimism.fit${CHAT_PATH}`, { method: 'POST', headers: { authorization: `Bearer ${key}`, 'content-type': 'application/json', 'cf-connecting-ip': `198.51.100.${i % 200}` }, body: JSON.stringify(said) }), env, {});
    await r.arrayBuffer(); took.push(Number(process.hrtime.bigint() - t) / 1000);
    if (r.status !== 200) throw new Error(`call ${i}: ${r.status}`);
  }
  took.sort((a, b) => a - b);
  const q = (p) => took[Math.min(took.length - 1, Math.floor(p * took.length))].toFixed(0);
  console.log(`== the door's cost: ${CALLS} calls, p50 ${q(0.5)} µs, p95 ${q(0.95)} µs, max ${took.at(-1).toFixed(0)} µs; the database grew ${((pages() - before) / CALLS).toFixed(0)} bytes a call`);
} finally { door.close(); router.close(); door.closeAllConnections?.(); router.closeAllConnections?.(); }
