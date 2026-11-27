#!/usr/bin/env node
// media-to-r2.mjs · THE FILMS FROM R2 (Oct 28 2026, lane/the-films-from-r2; worker/ranges.mjs; since Nov 23 2026 Harmony's installer too, by the bytes a published release names). Puts every film and song of the built site
// (dist/optimism-fit, or --out) into the Worker's bucket by its bytes (media/<sha256>.<ext>: THE FILM BY ITS BYTES, lane/the-film-by-its-bytes),
// with its type and the films' year-long cache, so the Worker answers their ranges with R2's own cut. The bytes are the ones the build named
// (MEDIA_BYTES in the built site); a file that is not those bytes is refused. Only what this Mac has not put goes up (the keys, kept in
// ~/.embertide/optimism-fit/r2-media.json); --check says what would go up and puts nothing. The deploy road:
//   node tools/build-optimism-fit.mjs && node tools/media-to-r2.mjs && npx --yes wrangler@4.157.0 deploy --config wrangler.optimism-fit.jsonc (worker/README.md: the whole press)
// A film the bucket does not hold by its bytes, new or re-cut, is served whole from the assets (worker/premint.mjs): a missed put costs a seek,
// never a film, and never an old cut.
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join, relative, sep } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { MEDIA, MEDIA_BYTES, MEDIA_TYPES, MEDIA_CACHE, mediaKey } from '../worker/ranges.mjs';

const here = join(dirname(fileURLToPath(import.meta.url)), '..');
export const CONFIG = 'wrangler.optimism-fit.jsonc';
export const STATE = join(homedir(), '.embertide', 'optimism-fit', 'r2-media.json');

/** bucketOf(configText): the bucket the Worker binds as VAULT in its wrangler config. */
export function bucketOf(configText) {
  const m = /"r2_buckets"\s*:\s*\[\s*\{[^}]*"binding"\s*:\s*"VAULT"[^}]*"bucket_name"\s*:\s*"([^"]+)"/.exec(configText)
    ?? /"r2_buckets"\s*:\s*\[\s*\{[^}]*"bucket_name"\s*:\s*"([^"]+)"[^}]*"binding"\s*:\s*"VAULT"/.exec(configText);
  if (!m) throw new Error(`no VAULT bucket in ${CONFIG}`);
  return m[1];
}
/** mediaFiles(out): every film and song under the built site, {path: '/app/x.mp4', file, size, type}, in path order. */
export function mediaFiles(out) {
  const found = [];
  (function walk(dir) {
    for (const name of readdirSync(dir).sort()) {
      const file = join(dir, name), st = statSync(file);
      if (st.isDirectory()) { walk(file); continue; }
      if (!MEDIA.test(name)) continue;
      const path = `/${relative(out, file).split(sep).join('/')}`;
      found.push({ path, file, size: st.size, type: MEDIA_TYPES[name.split('.').pop().toLowerCase()] });
    }
  })(out);
  return found;
}
const sha256 = (file) => createHash('sha256').update(readFileSync(file)).digest('hex');
/** mediaNames(out, hash): the bytes of every film and song under the built site, {pathname: {sha256, size}}: what the build writes as MEDIA_BYTES. */
export function mediaNames(out, hash = sha256) {
  return Object.fromEntries(mediaFiles(out).map((f) => [f.path, { sha256: hash(f.file), size: f.size }]));
}
/** plan(out, names, state, hash): each film by its bytes, one key for the same bytes under two names (its paths), and whether it goes up (a key
 *  this Mac has not put). A file whose bytes are not the ones the build named throws: a key always holds the bytes it names. */
export function plan(out, names, state = {}, hash = sha256) {
  const steps = new Map();
  for (const path of Object.keys(names).sort()) {
    const named = names[path], file = named?.download ? join(homedir(), '.embertide', 'harmony-release', `${named.sha256}.${path.split('.').pop()}`) : join(out, ...path.split('/').filter(Boolean)), digest = hash(file);   // an installer waits by its bytes outside every tree (embertide-birth dmg)
    if (digest !== named?.sha256) throw new Error(`${path} is not the bytes the build named (${digest.slice(0, 8)}, named ${String(named?.sha256).slice(0, 8)}): build again`);
    const key = mediaKey(digest, path);
    if (!steps.has(key)) steps.set(key, { key, file, size: statSync(file).size, type: MEDIA_TYPES[path.split('.').pop().toLowerCase()], sha256: digest, paths: [], put: state[key] !== digest });
    steps.get(key).paths.push(path);
  }
  return [...steps.values()];
}
export const installerNames = (r) => (r?.status !== 'published' ? {} : Object.fromEntries(Object.values(r.platforms ?? {}).filter((v) => /^[0-9a-f]{64}$/.test(v?.sha256 ?? '') && v.bytes > 0).map((v) => [new URL(v.url).pathname, { sha256: v.sha256, size: v.bytes, download: true }]).filter(([p]) => MEDIA.test(p))));   // installerNames(release): the installers a PUBLISHED release names, by their bytes: unpublished, the Worker serves none
/** putArgs({bucket, key, file, type}): the wrangler command that puts one film into the bucket (remote, its type and cache on the object). */
export const putArgs = ({ bucket, key, file, type }) => ['--yes', 'wrangler@4.157.0', 'r2', 'object', 'put', `${bucket}/${key}`, '--file', file, '--content-type', type, '--cache-control', MEDIA_CACHE, '--remote', '--config', CONFIG];

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2), at = args.indexOf('--out'), check = args.includes('--check');
  const out = at >= 0 && args[at + 1] ? args[at + 1] : join(here, 'dist', 'optimism-fit');
  if (!existsSync(out)) { console.error(`no built site at ${out}: run tools/build-optimism-fit.mjs first`); process.exit(1); }
  let names; try { names = JSON.parse(readFileSync(join(out, MEDIA_BYTES.slice(1)), 'utf8')); } catch { console.error(`no ${MEDIA_BYTES} in ${out}: run tools/build-optimism-fit.mjs first (it names each film's bytes)`); process.exit(1); }
  const bucket = bucketOf(readFileSync(join(here, CONFIG), 'utf8'));
  let state = {}; try { state = JSON.parse(readFileSync(STATE, 'utf8')); } catch { state = {}; }
  let steps; try { steps = plan(out, names, state); } catch (e) { console.error(`media-to-r2: ${e.message}`); process.exit(1); }
  const up = steps.filter((s) => s.put);
  console.log(`media-to-r2: ${Object.keys(names).length} films and songs, ${steps.length} by their bytes, ${up.length} to put into ${bucket}${check ? ' (--check: nothing put)' : ''}`);
  for (const s of steps) console.log(`  ${s.put ? 'put ' : 'kept'} ${s.key} ${(s.size / 1048576).toFixed(1)} MiB ${s.type} ${s.paths.join(' ')}`);
  if (check) process.exit(0);
  for (const s of up) {
    const r = spawnSync('npx', putArgs({ bucket, ...s }), { cwd: here, stdio: ['ignore', 'inherit', 'inherit'] });
    if (r.status !== 0) { console.error(`media-to-r2: the put of ${s.key} failed (exit ${r.status}); nothing after it was put`); process.exit(1); }
    state[s.key] = s.sha256; mkdirSync(dirname(STATE), { recursive: true }); writeFileSync(STATE, `${JSON.stringify(state, null, 1)}\n`);
  }
  console.log(`media-to-r2: ${up.length} put, ${steps.length - up.length} kept`);
}
