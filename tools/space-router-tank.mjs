#!/usr/bin/env node
// tools/space-router-tank.mjs · THE PUBLIC DOOR'S TANKS, by his hand (Oct 30 2026, lane/space-routers-public-door; the door: worker/space-router.mjs, its
// tables: migration 0011_space_router.sql, the law: app/space-router-law.mjs). A tank at the site's edge is what the purse door's is on the Mac
// (tools/embertide-mesh/space-tanks.mjs): a name, its key's sha256 and its markup. A key is made here, printed once to whoever runs this, and never kept: D1
// holds only its hash. A refill pours dollars of fuel and mines nothing.
//   node tools/space-router-tank.mjs add <name> [--markup-bps 500]    a new tank and its key
//   node tools/space-router-tank.mjs refill <name> <usd> [why...]      fuel poured into a tank
//   node tools/space-router-tank.mjs show [<name>]                     the tanks' sums
// Each prints the SQL it would run. --run runs it on the site's D1 (npx wrangler d1 execute optimism-fit-premint --remote), --local on wrangler dev's.
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { NAME_RX, MARKUP_BPS } from '../app/space-router-law.mjs';

const SITE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const quote = (s) => `'${String(s).replace(/'/g, "''")}'`;
const named = (name) => { if (!NAME_RX.test(String(name))) throw new Error(`a tank's name is lowercase letters, digits and dashes, 32 at most, not ${name}`); return name; };

/** a new tank's key: sr_ and 32 random bytes, base64url */
export const newKey = () => `sr_${crypto.randomBytes(32).toString('base64url')}`;
export const keyHash = (key) => crypto.createHash('sha256').update(String(key)).digest('hex');

export function addSql(name, keySha, { markupBps = MARKUP_BPS, nowMs = Date.now() } = {}) {
  if (!/^[0-9a-f]{64}$/.test(keySha)) throw new Error('the key\'s sha256 is 64 hex digits');
  if (!(Number.isInteger(markupBps) && markupBps >= 0 && markupBps <= 10000)) throw new Error(`a markup is 0 to 10000 basis points, not ${markupBps}`);
  return `INSERT INTO sr_tanks(name, key_sha256, markup_bps, made_at) VALUES (${quote(named(name))}, ${quote(keySha)}, ${markupBps}, ${Math.floor(nowMs)});`;
}

export function refillSql(name, usd, why = '', { nowMs = Date.now() } = {}) {
  if (!(Number.isFinite(usd) && usd > 0 && usd <= 100000)) throw new Error(`a refill is a positive number of dollars, 100000 at most, not ${usd}`);
  const n = quote(named(name)), d = +usd.toFixed(9);
  return `INSERT INTO sr_ledger(at, kind, tank, usd, why) SELECT ${Math.floor(nowMs)}, 'refill', ${n}, ${d}, ${quote(String(why).slice(0, 500))} WHERE EXISTS (SELECT 1 FROM sr_tanks WHERE name = ${n});
UPDATE sr_tanks SET poured_usd = poured_usd + ${d} WHERE name = ${n};`;
}

export function showSql(name = null) {
  return `SELECT name, markup_bps, ROUND(poured_usd - drunk_usd, 6) AS fuel_usd, ROUND(poured_usd, 6) AS poured_usd, ROUND(drunk_usd, 6) AS burned_usd, calls, ROUND(warm, 9) AS warm_mined FROM sr_tanks${name ? ` WHERE name = ${quote(named(name))}` : ''} ORDER BY name;`;
}

function main(argv) {
  let run = false, local = false, markupBps = MARKUP_BPS; const args = [];
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--run') run = true; else if (argv[i] === '--local') local = true; else if (argv[i] === '--markup-bps') markupBps = Number(argv[++i]); else args.push(argv[i]);
  }
  const [verb, name, ...rest] = args;
  let sql, key = null;
  if (verb === 'add') { key = newKey(); sql = addSql(name, keyHash(key), { markupBps }); }
  else if (verb === 'refill') sql = refillSql(name, Number(rest[0]), rest.slice(1).join(' '));
  else if (verb === 'show') sql = showSql(name || null);
  else { console.log('usage: space-router-tank.mjs add <name> [--markup-bps n] | refill <name> <usd> [why] | show [<name>]   (--run: the site\'s D1; --local: wrangler dev\'s)'); return 2; }
  console.log(sql);
  if (run || local) {
    const r = spawnSync('npx', ['--yes', 'wrangler@4.157.0', 'd1', 'execute', 'optimism-fit-premint', local ? '--local' : '--remote', '--config', 'wrangler.optimism-fit.jsonc', '--command', sql], { cwd: SITE, stdio: 'inherit' });
    if (r.status !== 0) return r.status || 1;
  }
  if (key) console.log(`\nThe tank's key, shown once and kept nowhere: ${key}\nIts holder points an agent at https://optimism.fit/space-router/v1 with this key as the API key.`);
  return 0;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) process.exitCode = main(process.argv.slice(2));
