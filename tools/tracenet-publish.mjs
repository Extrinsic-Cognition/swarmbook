#!/usr/bin/env node
// tracenet-publish.mjs: PUBLISH A DROP to a tracenet (his Sept 20 19:14: "i auction out early access to my traces... i am sharing traces of
// me working on OSS code"; Oct 14 19:13: "7 day exclusivity: BASICALLY I AM LAUNCHING MY OWN FUCKIG TTRACENET"). One file becomes one drop:
// its bytes go under vault/<handle>/<id>/<file>, its line (title, kind, size, sha256, publish time) into app/tracenet/<handle>.json, newest
// first; the Worker then serves it by the register's law from that time (app/tracenet-register.mjs: a Gold Mint receipt at once, a Bronze Mint
// receipt BRONZE_DAYS after, everyone OPEN_DAYS after). Nothing is deployed by this: commit the register and the vault folder, then his deploy
// line (tools/build-optimism-fit.mjs, wrangler).
// THE GATE (his Oct 14 23:2x WEST: "everything shared outside must be thoroughly sanitized in the nest itself"): a file is published only when the
// Nest holds tracenet/sanitized/<its sha256>; the receipt (rev, seat, ts) is written into the drop and the build checks it against the Nest again.
//
//   node tools/tracenet-publish.mjs <handle> <file> --title "<title>" [--kind trace] [--name "<name>"] [--line "<one line>"] [--x <url>] [--avatar <url>]
//   (--name is needed the first time a handle publishes; --root <dyson-society dir> and --now <iso> are for tests)
import { createHash } from 'node:crypto';
import { copyFileSync, existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { SCHEMA, HANDLE, ITEM_ID, FILE, KIND, SANITIZED_REF, opensAt, opensFor, readManifest, validReceipt } from '../app/tracenet-register.mjs';

const here = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const NEST = 'http://127.0.0.1:8904';

/** The Nest's sanitization receipt for these bytes (tracenet/sanitized/<sha256>): {ref, rev, seat, ts}, or null when the Nest holds none. Throws when the Nest does not answer. */
export async function receiptFromNest(sha256, { nest = NEST, fetcher = (...a) => fetch(...a) } = {}) {
  const name = SANITIZED_REF(sha256);
  const response = await fetcher(`${nest}/nest/ref/${name}`, { signal: AbortSignal.timeout(5000) });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`the Nest answered ${response.status} for ${name}`);
  const body = await response.json();
  if (!body?.ref) return null;
  const v = body.ref.value;   // THE REF FITS THE DOOR: the name carries 48 hex of the hash, the value the whole one; a receipt for other bytes is no receipt
  if (v && typeof v === 'object' && typeof v.sha256 === 'string' && v.sha256 !== sha256) return null;
  return { ref: name, rev: body.ref.rev, seat: body.ref.seat, ts: body.ref.ts };
}

export function slugOf(title) {
  return title.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60).replace(/-+$/, '') || 'drop';
}
/** Publishes one file as one drop; returns the item written. Throws, writing nothing, on anything that is not whole. */
export async function publish({ root = here, handle, file, title, kind = 'trace', name, line, x, avatar, now = Date.now(), receipt = receiptFromNest } = {}) {
  if (!HANDLE.test(handle ?? '')) throw new Error('a handle is 1 to 32 letters, digits or _ (an X handle without the @)');
  if (typeof title !== 'string' || !title.trim() || title.length > 140) throw new Error('--title is one line of up to 140 characters');
  if (!KIND.test(kind)) throw new Error('--kind is a short lowercase word (trace, patch, bench, ...)');
  if (!Number.isFinite(now)) throw new Error('--now is not a date');
  if (!file || !existsSync(file) || !statSync(file).isFile()) throw new Error(`no file at ${file}`);
  const fileName = basename(file);
  if (!FILE.test(fileName) || fileName.endsWith('.')) throw new Error(`the file's name must be letters, digits, dots, dashes or underscores: ${fileName}`);
  const registerPath = join(root, 'app', 'tracenet', `${handle}.json`);
  let register;
  if (existsSync(registerPath)) {
    register = JSON.parse(readFileSync(registerPath, 'utf8'));
    if (!readManifest(register, handle)) throw new Error(`${registerPath} is not an ${SCHEMA} register of ${handle}`);
  } else {
    if (typeof name !== 'string' || !name.trim()) throw new Error(`${handle} has no register yet: --name "<who>" starts one`);
    register = { schema: SCHEMA, handle, name: name.trim(), items: [] };
  }
  for (const [key, value] of [['name', name], ['line', line], ['x', x], ['avatar', avatar]]) if (typeof value === 'string' && value.trim()) register[key] = value.trim();
  const id = `${new Date(now).toISOString().slice(0, 10)}-${slugOf(title.trim())}`;
  if (!ITEM_ID.test(id)) throw new Error(`the drop's id is not whole: ${id}`);
  if (register.items.some((i) => i && i.id === id)) throw new Error(`${handle} already has a drop ${id}: another title, or another day`);
  const dir = join(root, 'vault', handle, id), dest = join(dir, fileName);
  if (existsSync(dir)) throw new Error(`vault/${handle}/${id}/ exists already`);
  const bytes = readFileSync(file), sha256 = createHash('sha256').update(bytes).digest('hex');
  // THE GATE: nothing is published that the Nest has not sanitized (his Oct 14 23:2x WEST). The receipt is read here and written into the drop.
  const sanitized = await receipt(sha256);
  if (!sanitized) throw new Error(`not sanitized in the Nest: it holds no ${SANITIZED_REF(sha256)} for ${fileName}. Run the Nest's sanitization pass over the file first; nothing was published.`);
  const item = { id, title: title.trim(), kind, file: fileName, bytes: bytes.length, sha256, published: new Date(now).toISOString(), sanitized };
  if (!validReceipt(item)) throw new Error(`the Nest's receipt for ${fileName} is not whole (${JSON.stringify(sanitized)}); nothing was published.`);
  mkdirSync(dir, { recursive: true });
  copyFileSync(file, dest);
  register.items = [item, ...register.items];
  mkdirSync(dirname(registerPath), { recursive: true });
  writeFileSync(registerPath, JSON.stringify(register, null, 2) + '\n');
  return item;
}
async function main(argv) {
  const positional = [], opts = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith('--')) { opts[argv[i].slice(2)] = argv[i + 1]; i++; } else positional.push(argv[i]);
  }
  const [handle, file] = positional;
  if (!handle || !file || !opts.title) {
    console.error('usage: node tools/tracenet-publish.mjs <handle> <file> --title "<title>" [--kind trace] [--name "<who>"] [--line "<one line>"] [--x <url>] [--avatar <url>]');
    process.exit(2);
  }
  const item = await publish({ root: opts.root ? resolve(opts.root) : here, handle, file: resolve(file), title: opts.title, kind: opts.kind ?? 'trace', name: opts.name, line: opts.line, x: opts.x, avatar: opts.avatar, now: opts.now ? Date.parse(opts.now) : Date.now() });
  const at = (ms) => new Date(ms).toISOString();
  console.log(`published ${item.id}: ${item.bytes} B, sha256 ${item.sha256}; Gold Mint's from ${at(opensFor(item, 'gold'))}, Bronze Mint's from ${at(opensFor(item, 'bronze'))}, everyone's, free, from ${at(opensAt(item))}.`);
  console.log(`https://optimism.fit/${handle} · commit app/tracenet/${handle}.json and vault/${handle}/${item.id}/, then the deploy line.`);
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) main(process.argv.slice(2)).catch((e) => { console.error(e.message); process.exit(1); });
