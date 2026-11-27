// ranges.test.mjs · THE FILMS FROM R2 (worker/ranges.mjs, tools/media-to-r2.mjs): a film's range is asked of R2, which cuts it (no byte through
// JS: a JS cut was cut short live, Oct 28 14:0x); 206, 416, 200 whole, HEAD; what the bucket does not hold is the assets' answer, untouched; the
// films and songs reach the Worker first. THE FILM BY ITS BYTES: a film is asked of R2 by the bytes the build names, so a re-cut film never plays
// its old copy; the tool puts each film at media/<sha256>.<ext> with its type and cache, only the build's bytes, once. THE FILMS KEEP THE SITE'S
// HEADERS: R2's answer carries the headers the site gives the film (its cache, noindex, nosniff), only its bytes' own are R2's. node --test ranges.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { parseRange, mediaFromR2, mediaKey, MEDIA, MEDIA_BYTES, MEDIA_CACHE, MEDIA_PREFIX } from './ranges.mjs';
import { createHandler } from './premint.mjs';
import { bucketOf, mediaFiles, mediaNames, plan, putArgs, installerNames } from '../tools/media-to-r2.mjs';

const bytes = (n, seed = 0) => Uint8Array.from({ length: n }, (_, i) => (i + seed) % 251);
const sha = (b) => createHash('sha256').update(b).digest('hex');
const FILM = '/app/saint-seiya.mp4';
// what the build names for a film (MEDIA_BYTES), and where the bucket holds those bytes
const named = (film, path = FILM) => ({ [path]: { sha256: sha(film), size: film.byteLength } });
const keyOf = (film, path = FILM) => mediaKey(sha(film), path);
// what the site gives a film (the assets' own answer to a HEAD), as the door hands it over: its type, its cache and its _headers lines, beside
// headers its bytes decide, which are never taken
const SITE = [['content-type', 'video/mp4'], ['cache-control', MEDIA_CACHE], ['x-content-type-options', 'nosniff'], ['referrer-policy', 'strict-origin-when-cross-origin'], ['etag', '"the-assets-etag"'], ['content-length', '7']];
const site = (given = SITE) => async () => given;
const read = async (response) => new Uint8Array(await response.arrayBuffer());
const ask = (range, { method = 'GET', path = '/app/saint-seiya.mp4' } = {}) => new Request(`https://optimism.fit${path}?v=e2321f14`, { method, headers: range ? { range } : {} });
// R2's shape as the Worker uses it: head(key) and get(key, {range: {offset, length}}), each null when the key is absent; it records every call
function bucket(objects, { throws = false } = {}) {
  const calls = [];
  const meta = (key) => ({ size: objects[key].byteLength, httpEtag: `"e-${key.length}"`, writeHttpMetadata: (h) => { h.set('content-type', 'video/mp4'); h.set('cache-control', MEDIA_CACHE); } });
  return { calls,
    head: async (key) => { calls.push(['head', key]); if (throws) throw new Error('R2 down'); return objects[key] ? meta(key) : null; },
    get: async (key, opts) => { calls.push(['get', key, opts?.range ?? null]); const all = objects[key]; if (!all) return null; const r = opts?.range;
      return { ...meta(key), body: new Response(r ? all.subarray(r.offset, r.offset + r.length) : all).body }; } };
}

test('the range a header asks: one span, an open end, a suffix; past the end unsatisfiable; several, not bytes or malformed: the whole', () => {
  assert.deepEqual(parseRange('bytes=0-1023', 20451031), { start: 0, end: 1023 });
  assert.deepEqual(parseRange('bytes=0-', 10), { start: 0, end: 9 }, "a browser's first ask of a film");
  assert.deepEqual(parseRange('bytes=16000000-', 20451031), { start: 16000000, end: 20451030 }, 'a seek near the drawn arrow');
  assert.deepEqual(parseRange('bytes=-4', 10), { start: 6, end: 9 }); assert.deepEqual(parseRange('bytes=-40', 10), { start: 0, end: 9 });
  assert.deepEqual(parseRange('bytes=5-999', 10), { start: 5, end: 9 }, 'an end past the last byte is the last byte');
  assert.equal(parseRange('bytes=10-', 10), 'unsatisfiable'); assert.equal(parseRange('bytes=-0', 10), 'unsatisfiable');
  for (const h of [null, '', 'bytes=0-1,4-5', 'items=0-1', 'bytes=-', 'bytes=7-3', 'bytes=a-b']) assert.equal(parseRange(h, 10), null, String(h));
});

test('a film from R2: one range is 206 and R2 is asked for exactly it; an open end and a suffix too; no range is 200 whole', async () => {
  const film = bytes(1000), names = named(film), b = bucket({ [keyOf(film)]: film });
  const part = await mediaFromR2(ask('bytes=100-199'), b, FILM, names, site());
  assert.equal(part.status, 206);
  assert.equal(part.headers.get('content-range'), 'bytes 100-199/1000'); assert.equal(part.headers.get('content-length'), '100');
  assert.equal(part.headers.get('accept-ranges'), 'bytes'); assert.equal(part.headers.get('content-type'), 'video/mp4', "the site's type");
  assert.equal(part.headers.get('cache-control'), MEDIA_CACHE); assert.equal(part.headers.get('etag'), `"e-${keyOf(film).length}"`, "the bytes' ETag: R2's");
  assert.deepEqual(await read(part), film.subarray(100, 200));
  assert.deepEqual(b.calls.at(-1), ['get', keyOf(film), { offset: 100, length: 100 }], 'R2 cuts the range: the Worker never reads past it');
  const tail = await mediaFromR2(ask('bytes=900-'), b, FILM, names, site());
  assert.equal(tail.headers.get('content-range'), 'bytes 900-999/1000'); assert.equal((await read(tail)).byteLength, 100);
  const last = await mediaFromR2(ask('bytes=-10'), b, FILM, names, site());
  assert.equal(last.headers.get('content-range'), 'bytes 990-999/1000'); assert.deepEqual(await read(last), film.subarray(990));
  const whole = await mediaFromR2(ask(null), b, FILM, names, site());
  assert.equal(whole.status, 200); assert.equal(whole.headers.get('content-length'), '1000'); assert.equal(whole.headers.get('accept-ranges'), 'bytes');
  assert.deepEqual(await read(whole), film); assert.deepEqual(b.calls.at(-1), ['get', keyOf(film), null]);
  const several = await mediaFromR2(ask('bytes=0-1,4-5'), b, FILM, names, site());
  assert.equal(several.status, 200, 'several ranges: the whole film');
});

test('past the end is 416 with the size, a HEAD is the headers, and neither asks R2 for a byte; unnamed, absent, a POST or no bucket: null', async () => {
  const film = bytes(1000), names = named(film), b = bucket({ [keyOf(film)]: film });
  const past = await mediaFromR2(ask('bytes=1000-'), b, FILM, names, site());
  assert.equal(past.status, 416); assert.equal(past.headers.get('content-range'), 'bytes */1000');
  const head = await mediaFromR2(ask(null, { method: 'HEAD' }), b, FILM, names, site());
  assert.equal(head.status, 200); assert.equal(head.headers.get('content-length'), '1000'); assert.equal(head.headers.get('accept-ranges'), 'bytes'); assert.equal(head.body, null);
  assert.equal(b.calls.filter(([k]) => k === 'get').length, 0, 'no byte read for a 416 or a HEAD');
  const calls = b.calls.length;
  assert.equal(await mediaFromR2(ask('bytes=0-9', { path: '/app/other.mp4' }), b, '/app/other.mp4', names, site()), null, 'a film the build does not name');
  assert.equal(await mediaFromR2(ask('bytes=0-9'), b, FILM, undefined, site()), null, 'a build that names no film');
  assert.equal(await mediaFromR2(ask('bytes=0-9'), b, FILM, { [FILM]: { sha256: '../vault/x', size: 1000 } }, site()), null, 'a name that is not a sha256');
  assert.equal(b.calls.length, calls, 'R2 is not asked for a film the build does not name by its bytes');
  assert.equal(await mediaFromR2(ask('bytes=0-9'), b, FILM, { [FILM]: { sha256: sha(film), size: 999 } }, site()), null, 'the bucket holds other bytes than the build named');
  assert.equal(await mediaFromR2(ask(null, { method: 'POST' }), b, FILM, names, site()), null);
  assert.equal(await mediaFromR2(ask(null), undefined, FILM, names, site()), null);
  const spaced = bytes(10), sb = bucket({ [mediaKey(sha(spaced), '/app/a b.mp4')]: spaced });
  assert.equal((await mediaFromR2(ask('bytes=0-1', { path: '/app/a%20b.mp4' }), sb, '/app/a%20b.mp4', named(spaced, '/app/a b.mp4'), site())).status, 206, "a film's name as the build wrote it");
  assert.equal(mediaKey('a'.repeat(64), '/app/warm-media/film-mothership-1/galaxy-desktop.MP4'), `media/${'a'.repeat(64)}.mp4`);
  assert.ok(MEDIA_PREFIX === 'media/' && !mediaKey('a'.repeat(64), '/x.mp4').startsWith('vault/'), "beside the creators' vault/, never in it"); const dmg = bytes(300, 7), dpath = '/app/DysonLight-Harmony.dmg', db = bucket({ [mediaKey(sha(dmg), dpath)]: dmg }), got = await mediaFromR2(ask(null, { path: dpath }), db, dpath, { [dpath]: { sha256: sha(dmg), size: 300, download: true } }, site(null)); assert.deepEqual([MEDIA.test(dpath), got.status, got.headers.get('content-type'), got.headers.get('content-disposition'), (await read(got)).byteLength], [true, 200, 'application/x-apple-diskimage', 'attachment; filename="DysonLight-Harmony.dmg"', 300], 'A STRANGER DOWNLOADS HARMONY: an installer is no page\'s asset, its own headers'); assert.equal(await mediaFromR2(ask(null, { path: dpath }), db, dpath, { [dpath]: { sha256: sha(dmg), size: 300 } }, site(null)), null, 'no installer named, no site headers: the assets answer'); const rel = (status) => ({ status, platforms: { macos: { url: `https://swarmbook.com${dpath}`, sha256: sha(dmg), bytes: 300 }, windows: null } }); assert.deepEqual([installerNames(rel('unpublished')), installerNames(rel('published'))], [{}, { [dpath]: { sha256: sha(dmg), size: 300, download: true } }], 'the Worker serves an installer once its release is published, by its bytes alone');
});

test("the films keep the site's headers: the submission's noindex and short cache, every film's nosniff; only the bytes' own headers are R2's", async () => {
  const film = bytes(1000), path = '/submission/demo.mp4', names = named(film, path), b = bucket({ [keyOf(film, path)]: film });
  // the object in the bucket says a year (its put); the site says what _headers says for the submission, beside headers of the assets' own bytes
  const given = [['content-type', 'video/mp4'], ['cache-control', 'public, max-age=0, must-revalidate'], ['x-robots-tag', 'noindex'], ['x-content-type-options', 'nosniff'],
    ['referrer-policy', 'strict-origin-when-cross-origin'], ['etag', '"asset"'], ['content-length', '12'], ['content-encoding', 'gzip'], ['last-modified', 'Mon, 26 Oct 2026 10:00:00 GMT']];
  for (const [range, method, status, length] of [['bytes=100-', 'GET', 206, '900'], [null, 'GET', 200, '1000'], ['bytes=1000-', 'GET', 416, null], [null, 'HEAD', 200, '1000']]) {
    const r = await mediaFromR2(ask(range, { path, method }), b, path, names, site(given));
    assert.equal(r.status, status, `${method} ${range}`);
    assert.equal(r.headers.get('x-robots-tag'), 'noindex', 'the submission stays out of the index');
    assert.equal(r.headers.get('cache-control'), 'public, max-age=0, must-revalidate', "the site's cache, never the object's year");
    assert.equal(r.headers.get('x-content-type-options'), 'nosniff'); assert.equal(r.headers.get('referrer-policy'), 'strict-origin-when-cross-origin');
    assert.equal(r.headers.get('content-type'), 'video/mp4');
    assert.equal(r.headers.get('etag'), `"e-${keyOf(film, path).length}"`, "the bytes' ETag is R2's");
    assert.equal(r.headers.get('content-length'), length, "the length is the bytes', never the site's");
    assert.equal(r.headers.get('content-encoding'), null, 'R2 sends the bytes as they are'); assert.equal(r.headers.get('last-modified'), null);
    assert.equal(r.headers.get('accept-ranges'), 'bytes');
  }
  assert.equal(await mediaFromR2(ask('bytes=0-9', { path }), b, path, names, site(null)), null, "the site's headers unread: the assets answer");
  let read = 0; const counting = async () => { read++; return given; };
  assert.equal(await mediaFromR2(ask('bytes=0-9', { path: '/app/other.mp4' }), b, '/app/other.mp4', names, counting), null);
  assert.equal(await mediaFromR2(ask('bytes=0-9', { path }), b, path, { [path]: { sha256: sha(film), size: 999 } }, counting), null);
  assert.equal(read, 0, 'the site is asked only for a film R2 holds by the named bytes');
});

test('a re-cut film never plays its old copy: before its put the bucket is not asked for the old bytes, after it R2 serves the new cut', async () => {
  const old = bytes(1000), cut = bytes(1200, 7);   // the same name, other bytes: a film re-cut under its old name
  const b = bucket({ [keyOf(old)]: old, 'media/app/saint-seiya.mp4': old });   // its old cut by its bytes, and by its path (the bucket as of Oct 28 14:15Z)
  assert.equal(await mediaFromR2(ask('bytes=100-'), b, FILM, named(cut), site()), null, 'the build names the new cut: the assets serve it whole');
  assert.deepEqual(b.calls, [['head', keyOf(cut)]], 'only the new cut is asked for; never its old bytes, never its path');
  b.calls.length = 0; Object.assign(b, bucket({ [keyOf(old)]: old, [keyOf(cut)]: cut }, {}));   // its put
  const seek = await mediaFromR2(ask('bytes=100-'), b, FILM, named(cut), site());
  assert.equal(seek.status, 206); assert.equal(seek.headers.get('content-range'), 'bytes 100-1199/1200'); assert.deepEqual(await read(seek), cut.subarray(100));
  assert.ok(b.calls.every(([, key]) => key === keyOf(cut)), 'the new cut, from its own key');
});

test("the Worker's door: a film the bucket holds by the build's bytes comes from R2 (206), any other is the assets' answer untouched, as is every page", async () => {
  const film = bytes(5000), galaxy = bytes(300, 3), b = bucket({ [keyOf(film)]: film }), asked = [];
  const answers = new Map();
  let headFails = 0;   // the site's headers unreadable this many times
  const assets = (names) => ({ fetch: (req) => { const p = new URL(req.url).pathname; asked.push(req.method === 'HEAD' ? `HEAD ${p}` : p);
    if (req.method === 'HEAD') return headFails-- > 0 ? new Response(null, { status: 500 }) : new Response(null, { headers: { 'content-type': 'video/mp4', 'cache-control': MEDIA_CACHE, 'x-content-type-options': 'nosniff' } });
    const r = p === MEDIA_BYTES ? (names ? Response.json(names) : new Response('Not Found', { status: 404 })) : new Response(`asset ${p}`); answers.set(p, r); return r; } });
  const env = { VAULT: b, ASSETS: assets({ ...named(film), ...named(galaxy, '/app/warm-media/fantasia-1/galaxy-desktop.mp4') }) };
  const handle = createHandler({ fetcher: async () => { throw new Error('no network'); } });
  const seek = await handle(ask('bytes=4000-'), env, {});
  assert.equal(seek.status, 206); assert.equal(seek.headers.get('content-range'), 'bytes 4000-4999/5000'); assert.deepEqual(await read(seek), film.subarray(4000));
  assert.equal(seek.headers.get('x-content-type-options'), 'nosniff', "the site's headers on R2's answer");
  assert.equal((await handle(ask('bytes=0-'), env, {})).status, 206);
  assert.deepEqual(asked, [MEDIA_BYTES, `HEAD ${FILM}`], "the build's names and the film's site headers read once each; the assets never asked for its bytes");
  const other = await handle(ask('bytes=0-9', { path: '/app/warm-media/fantasia-1/galaxy-desktop.mp4' }), env, {});
  assert.equal(other, answers.get('/app/warm-media/fantasia-1/galaxy-desktop.mp4'), "a film the bucket does not hold by its bytes: the assets' own answer, untouched");
  const page = await handle(new Request('https://optimism.fit/app/warm.html'), env, {});
  assert.equal(page, answers.get('/app/warm.html'), 'a page: the assets untouched');
  const down = await handle(ask('bytes=0-9'), { ...env, VAULT: bucket({}, { throws: true }) }, {});
  assert.equal(down, answers.get('/app/saint-seiya.mp4'), 'R2 down: the assets serve the film whole');
  const later = createHandler({ fetcher: async () => { throw new Error('no network'); } }); headFails = 1; asked.length = 0;
  assert.equal(await later(ask('bytes=0-9'), env, {}), answers.get(FILM), "the site's headers unread: the assets serve the film, whole");
  assert.equal((await later(ask('bytes=0-9'), env, {})).status, 206, 'read again by the next film');
  assert.deepEqual(asked.filter((a) => a.startsWith('HEAD')), [`HEAD ${FILM}`, `HEAD ${FILM}`]);
  const before = createHandler({ fetcher: async () => { throw new Error('no network'); } });
  const unnamed = await before(ask('bytes=0-9'), { VAULT: b, ASSETS: assets(null) }, {});
  assert.equal(unnamed, answers.get('/app/saint-seiya.mp4'), 'a build that names no bytes: every film from the assets, whole');
});

test(`the films and songs reach the Worker first ("*" matches deep: the router's ^/.*\\.mp4$), the pages and their code stay asset-first`, () => {
  const config = readFileSync(new URL('../wrangler.optimism-fit.jsonc', import.meta.url), 'utf8');
  const first = JSON.parse(`[${/"run_worker_first":\s*\[([^\]]*)\]/.exec(config)[1]}]`);
  const glob = (p) => new RegExp(`^${p.split('*').map((s) => s.replace(/[-/\\^$+?.()|[\]{}]/g, '\\$&')).join('.*')}$`);   // the router's own rule (generateGlobOnlyRuleRegExp)
  const runs = (path) => first.some((p) => !p.startsWith('!') && glob(p).test(path)) && !first.some((p) => p.startsWith('!') && glob(p.slice(1)).test(path));
  const site = new URL('../', import.meta.url);
  const shipped = ['app', 'submission'].flatMap((top) => { try { return readdirSync(new URL(`${top}/`, site), { recursive: true }).map((f) => `/${top}/${f}`); } catch { return []; } })
    .filter((f) => /\.(mp4|m4a|mp3|webm)$/i.test(f) && !f.includes('/node_modules/'));
  assert.ok(shipped.includes('/app/saint-seiya.mp4') && shipped.includes('/app/saint-seiya.m4a'), 'the film and the song the skip seeks');
  for (const f of shipped) assert.ok(runs(f) && MEDIA.test(f), `${f} reaches the Worker first`);
  for (const page of ['/app/warm.html', '/app/warm-entry.mjs', '/app/dl-space-router.js', '/app/assets/athena-offer.png']) assert.ok(!runs(page), `${page} stays asset-first`);
  assert.ok(runs('/') && runs('/api/premint/orders/x') && runs('/vault/a/b'), 'the doors that ran first still do');
});

test("the tool puts each film by its bytes, once for the same bytes under two names, with its type and cache, into the Worker's bucket; only the build's bytes", () => {
  assert.equal(bucketOf(readFileSync(new URL('../wrangler.optimism-fit.jsonc', import.meta.url), 'utf8')), 'optimism-fit-vault');
  const out = mkdtempSync(join(tmpdir(), 'media-to-r2-'));
  try {
    mkdirSync(join(out, 'app', 'warm-media', 'f1'), { recursive: true }); mkdirSync(join(out, 'submission'), { recursive: true });
    writeFileSync(join(out, 'app', 'saint-seiya.mp4'), 'film'); writeFileSync(join(out, 'app', 'saint-seiya.m4a'), 'song');
    writeFileSync(join(out, 'app', 'warm.html'), 'page'); writeFileSync(join(out, 'app', 'warm-media', 'f1', 'galaxy.mp4'), 'galaxy'); writeFileSync(join(out, 'submission', 'demo.mp4'), 'demo');
    mkdirSync(join(out, 'app', 'warm-media', 'f2'), { recursive: true }); writeFileSync(join(out, 'app', 'warm-media', 'f2', 'galaxy.mp4'), 'galaxy');
    const files = mediaFiles(out);
    assert.deepEqual(files.map((f) => [f.path, f.type]), [['/app/saint-seiya.m4a', 'audio/mp4'], ['/app/saint-seiya.mp4', 'video/mp4'], ['/app/warm-media/f1/galaxy.mp4', 'video/mp4'], ['/app/warm-media/f2/galaxy.mp4', 'video/mp4'], ['/submission/demo.mp4', 'video/mp4']]);
    const names = mediaNames(out);
    assert.deepEqual(names['/app/saint-seiya.mp4'], { sha256: sha(Buffer.from('film')), size: 4 }, "what the build writes as MEDIA_BYTES: each film's sha256 and size");
    assert.ok(!(('/app/warm.html') in names), 'a page is not a film');
    const key = (text, ext) => `media/${sha(Buffer.from(text))}.${ext}`, keyFilm = key('film', 'mp4');
    assert.equal(mediaKey(sha(Buffer.from('film')), '/app/saint-seiya.mp4'), keyFilm);
    const steps = plan(out, names, { [keyFilm]: sha(Buffer.from('film')), 'media/app/saint-seiya.m4a': sha(Buffer.from('song')) });
    assert.deepEqual(steps.map((s) => [s.key, s.put, s.paths, s.type]), [
      [key('song', 'm4a'), true, ['/app/saint-seiya.m4a'], 'audio/mp4'],
      [keyFilm, false, ['/app/saint-seiya.mp4'], 'video/mp4'],
      [key('galaxy', 'mp4'), true, ['/app/warm-media/f1/galaxy.mp4', '/app/warm-media/f2/galaxy.mp4'], 'video/mp4'],
      [key('demo', 'mp4'), true, ['/submission/demo.mp4'], 'video/mp4'],
    ], 'a key this Mac put is kept, a path key of the old layout counts for nothing, the same bytes under two names go up once');
    writeFileSync(join(out, 'app', 'saint-seiya.mp4'), 'a re-cut');
    assert.throws(() => plan(out, names), /saint-seiya\.mp4 is not the bytes the build named/, 'a file changed after the build is refused, never put under the old bytes');
    const argv = putArgs({ bucket: 'optimism-fit-vault', key: keyFilm, file: '/x/saint-seiya.mp4', type: 'video/mp4' });
    assert.deepEqual(argv.slice(0, 6), ['--yes', 'wrangler@4.157.0', 'r2', 'object', 'put', `optimism-fit-vault/${keyFilm}`]);
    for (const [flag, value] of [['--file', '/x/saint-seiya.mp4'], ['--content-type', 'video/mp4'], ['--cache-control', MEDIA_CACHE], ['--config', 'wrangler.optimism-fit.jsonc']]) assert.equal(argv[argv.indexOf(flag) + 1], value, flag);
    assert.ok(argv.includes('--remote'), 'into the live bucket, never a local stand-in');
  } finally { rmSync(out, { recursive: true, force: true }); }
  const build = readFileSync(new URL('../tools/build-optimism-fit.mjs', import.meta.url), 'utf8');
  assert.match(build, /writeFileSync\(join\(out, MEDIA_BYTES\.slice\(1\)\), `\$\{JSON\.stringify\(\{ \.\.\.mediaNames\(out\), \.\.\.\(existsSync\(join\(out, 'app', 'nestos-release\.json'\)\) \? installerNames\(/, 'the build names the bytes of every film it ships');
  assert.ok(build.indexOf('MEDIA_BYTES.slice(1)') > build.lastIndexOf('cpSync('), 'after every file is in place');
});
