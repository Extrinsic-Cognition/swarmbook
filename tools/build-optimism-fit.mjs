#!/usr/bin/env node
// OPTIMISM.FIT IS THE DYSON SOCIETY'S MINT PAGE (his Oct 12 2026 19:2x WEST: "the dyson society mint page that is right now at poleis.us
// must become what gets shown onto optimism.fit... you understand?"; 08:49 "it's optimism.fit now. not poleis.us").
//
// Builds the static site the optimism-fit worker serves (wrangler.optimism-fit.jsonc): this folder's app/, js/ and skills/ as they stand,
// minus backups and dotfiles, and a front door that opens on the mint page (app/warm.html) instead of the Poleis landing poleis.us opens on.
// Output: dist/optimism-fit (ignored by git), or --out <dir> (a folder that is empty, absent, or an earlier build of this tool: anything else
// is never emptied). Deploy: node tools/media-to-r2.mjs && npx --yes wrangler@4.157.0 deploy --config wrangler.optimism-fit.jsonc (the films and songs into the
// bucket first: the Worker answers their ranges from R2, worker/ranges.mjs; what the bucket does not hold is served whole from the assets). The
// build names the bytes of every film and song it ships (MEDIA_BYTES, media-bytes.json in the site: THE FILM BY ITS BYTES): the Worker asks
// the bucket only for those bytes, so a film re-cut under its old name is the assets' new cut until its put, never the bucket's old one.
//
// ONE PAGE (lane/one-page; his Oct 15 2026 01:3x WEST: "ON MY PAGE RIGHT NOW THERE IS FUCKING NOTHING ABOUT THE SHIT I SPENT SO MUCH FUCKING
// TIME ON DUDE"): app/warm.html mounts its hero itself (lab/hero-mount.js), so the lab's modules it imports, their assets (the theater's light,
// the sacrifice's matte, the box's list and its two GLBs, the record) and three.js (its import map: ../../room/procedural/, /room/procedural/
// on the site) are the page's: each ships in its place, found by tools/page-files.mjs walking the page as a browser does. Never the lab as a
// whole: its pages, proofs, tests and pictures stay home. The build refuses to run when the page asks for a file this tree does not hold.
//
// THE HACKATHON SUBMISSION'S VIDEOS (his Oct 13 2026 04:4x WEST: "use some link at optimism.fit/submission_video or something"): the Colosseum
// form's two video fields point at /demo_video and /pitch_video (and /submission_video opens both), all three submission/index.html. Its two
// mp4s are web cuts of ~/Movies/Project Snowtrace and are not in git (.gitignore): demo.mp4 is project-snowtrace-demo-no-token.mp4 through x264
// two-pass at 2388k (38 MiB would not pass the 25 MiB limit), pitch.mp4 is dysonlight-pitch-under-2min.mp4 remuxed with faststart. A checkout
// without them stops before the old build is removed: a deploy without them takes the judges' links down.
//
// THE FILMS ARE HELD FOR A YEAR (Oct 14 2026, the sound-first lane): measured Oct 14 03:3x from Lisbon, every film answered cf-cache-status
// MISS with cache-control max-age=0, must-revalidate, so no browser or edge ever held one and a visit pulled about 75 MB of films again.
// _headers now marks /app/*.mp4, /app/*.m4a and /app/warm-media/* public, max-age=31536000, immutable; so a new cut MUST be a new URL:
// app/dl-twelve.js names the Saint Seiya pair as saint-seiya.{m4a,mp4}?v=<first 8 hex of the file's sha256>, and this build refuses to
// run when either revision is not the file's (it prints the right ones). LANDING.md files beside the sources are receipts, not pages.
//
// THE SITE CARRIES ONLY WHAT PAGES LOAD (lane/the-site-carries-only-what-pages-load, Oct 29 2026; the warden's order, his click "Yes, first in line" at
// 09:40:31 UTC). Until then the folders above were copied whole but for a file named exactly LANDING.md, and read at 09:3x UTC the site served 16 of
// app/'s 17 .md files (ROOM.md, his room's words, and every *-LANDING.md receipt with his quoted words), the tests and proofs, the local road's release
// and the film's depth layers. Now each file of them ships only by tools/site-files.mjs (the kinds a page loads, data a page names, the tracenets'
// registers and drops checked below, the pages for agents), and the build reads its own output back and removes it, refusing, when anything the rule
// keeps home is in it.
import { createHash } from 'node:crypto';
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SCHEMA, HANDLE, ITEM_ID, FILE, SANITIZED_REF, validItem } from '../app/tracenet-register.mjs';
import { pageFiles } from './page-files.mjs';
import { MEDIA_BYTES } from '../worker/ranges.mjs';
import { mediaNames, installerNames } from './media-to-r2.mjs';   // THE FILM BY ITS BYTES: the bytes of each film the Worker may ask the bucket for; A STRANGER DOWNLOADS HARMONY: and of the installers a published release names
import { planSite, outputProblems, inlineScripts } from './site-files.mjs';   // THE SITE CARRIES ONLY WHAT PAGES LOAD

const here = join(dirname(fileURLToPath(import.meta.url)), '..');
const outAt = process.argv.indexOf('--out');
const out = outAt > 0 && process.argv[outAt + 1] ? resolve(process.argv[outAt + 1]) : join(here, 'dist', 'optimism-fit');
// a folder this build may empty: absent, empty, or an earlier build of it (its front door and its page); never another folder
if (existsSync(out) && readdirSync(out).length && !(existsSync(join(out, '_redirects')) && existsSync(join(out, 'app', 'warm.html')))) {
  throw new Error(`${out} holds files and is not a build of this tool: nothing was removed, nothing was built.`);
}
const LIMIT = 25 * 1024 * 1024;   // Workers static assets: 25 MiB a file

// The Saint Seiya pair's ?v= revisions in app/dl-twelve.js must be the files' own (first 8 hex of sha256), or the year-long cache below serves an old cut.
const twelve = readFileSync(join(here, 'app', 'dl-twelve.js'), 'utf8');
const named = /const REV = \{song: '([0-9a-f]{8})', film: '([0-9a-f]{8})'\};/.exec(twelve);
if (!named) throw new Error("app/dl-twelve.js has no `const REV = {song: '<8 hex>', film: '<8 hex>'};` line: the films' URLs carry no revision. Nothing was built.");
const revision = file => createHash('sha256').update(readFileSync(join(here, 'app', file))).digest('hex').slice(0, 8);
const stale = [['song', 'saint-seiya.m4a', named[1]], ['film', 'saint-seiya.mp4', named[2]]]
  .map(([key, file, said]) => [key, file, said, revision(file)]).filter(([, , said, is]) => said !== is);
if (stale.length) throw new Error(`app/dl-twelve.js names a revision that is not the file's: ${stale.map(([key, file, said, is]) => `${key} (${file}) says ${said}, the file is ${is}`).join('; ')}. Fix REV and build again. Nothing was built.`);

for (const name of ['index.html', 'demo.mp4', 'pitch.mp4']) {
  if (!existsSync(join(here, 'submission', name))) throw new Error(`no submission/${name} here: the judges' links (optimism.fit/demo_video, /pitch_video) need it. Nothing was built.`);
}

// THE TRACENETS (app/tracenet/<handle>.json, each builder's public register; the bytes under vault/<handle>/<id>/<file>, served by the Worker
// alone, by the tiered law, to a paid receipt before everyone: app/tracenet-register.mjs, worker/tracenet-vault.mjs): every drop a register names must be on disk
// with the register's size and sha256, or the page would sell what is not there. The handle's address is optimism.fit/<handle> (_redirects below).
const tracenets = existsSync(join(here, 'app', 'tracenet')) ? readdirSync(join(here, 'app', 'tracenet')).filter(name => name.endsWith('.json')).map(name => name.slice(0, -5)).sort() : [];
const vouched = new Set();   // the registers and the drops checked here: what tools/site-files.mjs ships of app/tracenet/ and vault/
for (const handle of tracenets) {
  vouched.add(`app/tracenet/${handle}.json`);
  if (!HANDLE.test(handle)) throw new Error(`app/tracenet/${handle}.json: a handle is 1 to 32 letters, digits or _. Nothing was built.`);
  const register = JSON.parse(readFileSync(join(here, 'app', 'tracenet', `${handle}.json`), 'utf8'));
  if (register.schema !== SCHEMA || register.handle !== handle || !Array.isArray(register.items)) throw new Error(`app/tracenet/${handle}.json is not an ${SCHEMA} register of ${handle}. Nothing was built.`);
  for (const item of register.items) {
    if (!validItem(item)) throw new Error(`app/tracenet/${handle}.json: a drop is not whole (${JSON.stringify(item).slice(0, 120)}). Publish it with tools/tracenet-publish.mjs. Nothing was built.`);
    const file = join(here, 'vault', handle, item.id, item.file);
    if (!ITEM_ID.test(item.id) || !FILE.test(item.file) || !existsSync(file)) throw new Error(`app/tracenet/${handle}.json names ${item.id}/${item.file}, which is not under vault/${handle}/. Nothing was built.`);
    const bytes = readFileSync(file), sha = createHash('sha256').update(bytes).digest('hex');
    if (item.bytes !== bytes.length || item.sha256 !== sha) throw new Error(`vault/${handle}/${item.id}/${item.file}: the register says ${item.bytes} B ${item.sha256}, the file is ${bytes.length} B ${sha}. Publish it again. Nothing was built.`);
    // THE GATE (his Oct 14 23:2x WEST): the Nest must still hold the drop's sanitization receipt, the same rev, seat and ts the publisher wrote
    let answer;
    try { answer = await fetch(`http://127.0.0.1:8904/nest/ref/${SANITIZED_REF(sha)}`, { signal: AbortSignal.timeout(5000) }); }
    catch (e) { throw new Error(`the Nest did not answer for ${item.id}'s sanitization receipt (${e.message}); a drop ships only against the Nest's word. Nothing was built.`); }
    const held = answer.ok ? (await answer.json())?.ref : null;
    if (!held || held.rev !== item.sanitized.rev || held.seat !== item.sanitized.seat || held.ts !== item.sanitized.ts) throw new Error(`${item.id}: the Nest holds ${held ? 'another' : 'no'} ${SANITIZED_REF(sha)}; the register's receipt is not the Nest's. Nothing was built.`);
    vouched.add(`vault/${handle}/${item.id}/${item.file}`);
  }
}

// THE PAGE'S OWN HERO (ONE PAGE, above): every file app/warm.html asks for outside the folders copied whole, in its place on the site
const WHOLE = ['app', 'js', 'skills', 'submission', 'vault'];
// AFTER THE MINT (lane/after-the-mint, Nov 2 2026): app/after-the-mint.html, the page / opens on once the $WARM window has closed (worker/premint.mjs),
// carries what it asks for outside app/ by its own graph, not by the mint page's: the welcome's diving Lyssajudron (assembly-home.mjs on
// room/assembly-gpu.mjs) and the ice law it is drawn through (harmony-ice.js), at the site's root as ../../ from /app/ resolves.
// THE WALL'S OWN GRAPH (A TRACENET HAS A DOOR, Nov 23 2026): app/index.html's ball asks room/assembly-gpu.mjs and room/assembly-floor.mjs, which shipped only through the retired swarmbook.html's graph.
const page = [...new Map([...pageFiles(), ...pageFiles({ page: 'app/tracenet.html' }), ...pageFiles({ page: 'app/after-the-mint.html' }), ...pageFiles({ page: 'app/index.html' })].map(f => [f.to, f])).values()]
  .filter(f => !WHOLE.some(dir => f.to.startsWith(`${dir}/`)));
// The collection's prologue is a public illustration already used by Harmony.
page.push({ from: join(here, '..', 'assets', 'lyssajudron-prologue.jpg'), to: 'assets/lyssajudron-prologue.jpg' });
// THE ONE WORDMARK (his Oct 16 2026 10:34 WEST "I WANT YOU TO USE THE ssame fucking designed stuff"): app/warm.html and app/tracenet.html link
// ../../brand/dl-wordmark.css, the sheet Harmony's pages link too; on the site a ".." above the root stays there, so it ships at /brand/.
page.push({ from: join(here, '..', 'brand', 'dl-wordmark.css'), to: 'brand/dl-wordmark.css' });
// THE TRAIL'S END (lane/the-trails-end, Oct 31 2026): the tracenet page wears Harmony's night and the snow day from their one source and the mint's faces
// from theirs, so the site carries the sheets where the page asks for them (../../ from /app/ is the site's root): harmony-accent.css at the root, fonts.css
// with its faces and their licences under fonts/, and the DM Sans files at the place fonts.css names them from there (../dyson-society/app/fonts/).
page.push({ from: join(here, '..', 'harmony-accent.css'), to: 'harmony-accent.css' });
page.push({ from: join(here, '..', 'phone', 'icons', 'icon-192.png'), to: 'favicon.png' });   // A TRACENET HAS A DOOR (Nov 23 2026): the tab wears the phone's icon, her ball, where every page asked /favicon.ico and found nothing
for (const f of readdirSync(join(here, '..', 'fonts'))) if (/\.(css|ttf|txt)$/.test(f)) page.push({ from: join(here, '..', 'fonts', f), to: `fonts/${f}` });
for (const f of ['dm-sans-400.ttf', 'dm-sans-500.ttf', 'dm-sans-600.ttf']) page.push({ from: join(here, 'app', 'fonts', f), to: `dyson-society/app/fonts/${f}` });
if (!page.some(f => f.to === 'lab/hero-mount.js')) throw new Error('app/warm.html imports no lab/hero-mount.js: the page would ship without its hero. Nothing was built.');

// THE SITE CARRIES ONLY WHAT PAGES LOAD: of the folders above, each file by tools/site-files.mjs; its data judged against what ships, the page's own included
const plan = planSite(here, { copied: WHOLE, vouched, texts: page.filter(f => /\.(html|m?js|css)$/i.test(f.to)).map(f => readFileSync(f.from, 'utf8')) });

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
for (const rel of plan.ship) { mkdirSync(dirname(join(out, rel)), { recursive: true }); cpSync(join(here, rel), join(out, rel)); }
for (const f of page) { mkdirSync(dirname(join(out, f.to)), { recursive: true }); cpSync(f.from, join(out, f.to)); }

writeFileSync(join(out, '_redirects'), [
  '/ /app/warm.html 302',
  '/app/ /app/warm.html 302',
  '/agent.md /app/agent.md 302',
  '/llms.txt /app/agent.md 302',
  '/submission_video /submission/index.html 302',
  '/demo_video /submission/index.html#demo 302',
  '/pitch_video /submission/index.html#pitch 302',
  '/favicon.ico /favicon.png 302',
  // each tracenet at its handle (his Oct 12 19:29: "my visitable page is an address there")
  ...tracenets.map(handle => `/${handle} /app/tracenet.html?of=${handle} 302`),
  '',
].join('\n'));
const SCRIPTS = inlineScripts((function pages(dir) { return readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? pages(join(dir, e.name)) : e.name.endsWith('.html') ? [readFileSync(join(dir, e.name), 'utf8')] : [])); })(out)), POLICY = `  Content-Security-Policy: base-uri 'self'; object-src 'none'; form-action 'self'; script-src 'self' 'unsafe-eval' 'wasm-unsafe-eval' ${SCRIPTS.join(' ')}`; if (POLICY.length > 1900) throw new Error(`the content policy is ${POLICY.length} characters and a _headers line holds 2,000: ${SCRIPTS.length} scripts are written inside pages. Nothing was built.`); writeFileSync(join(out, '_headers'), [
  '/*',
  '  X-Content-Type-Options: nosniff', '  Strict-Transport-Security: max-age=31536000', POLICY,   /* THE SITE PINS HTTPS (Nov 20 2026, his "Yes, cut it" at 17:57:10 UTC to "Cut the public site's missing security headers next?", from the Nest's audit of that day: the pages sent no HSTS and no content policy, and both names still answer over plain http). Every file the site serves says it is https for a year, and its pages shut three doors none of them uses: a base tag that points elsewhere, an object or an embed, a form that posts to another site. Left out on purpose: who may frame a page (X-Frame-Options, frame-ancestors), because his glasses frame a page of the web by its public name (THE-JOURNEY-GATE.md 5d, his Oct 17 2026 "put on lysa for now the live updated page of the mint of the dyson society optimism.fit please") and a house's rite stands on a LAN address no policy here can name; and upgrade-insecure-requests, because the pages ask the visitor's own Nest on http://127.0.0.1. THE PAGES RUN ONLY THEIR OWN SCRIPTS (Nov 20 2026, his "Yes, cut it" at 18:34:43 UTC to "Cut the script policy for the public pages next?"): a page runs the scripts this site serves and the ones written inside its own pages, each named here by the hash of its text as the build finds it (SCRIPTS: site-files.mjs inlineScripts over every page that ships), and no other: a script written into a page by anyone else, or taken from another host, does not run. 'unsafe-eval' stays because her making builds the original Lyssajudron from its own source text (app/dl-athena.mjs) and the worlds are WebAssembly; the two libraries three pages took from a CDN are the site's own copies now (app/vendor/) */
  '  Referrer-Policy: strict-origin-when-cross-origin',
  '/submission/*',
  '  X-Robots-Tag: noindex',
  // the films: immutable for a year (a new cut is a new URL; the Saint Seiya pair's revisions are checked above)
  '/app/*.mp4',
  '  Cache-Control: public, max-age=31536000, immutable',
  '/app/*.m4a',
  '  Cache-Control: public, max-age=31536000, immutable',
  '/app/warm-media/*',
  '  Cache-Control: public, max-age=31536000, immutable',
  // her portrait's painter (app/dl-her-portrait-frame.html) is a frame with no origin: Reactor's kit and its wasm answer it only with this
  '/app/dl-her-portrait-frame.html', '  ! Content-Security-Policy', '/app/vendor/reactor*',   /* the painter's frame keeps no policy: it has no origin, no storage and no wallet, and Reactor's kit must run in it as it does today in every browser */
  '  Access-Control-Allow-Origin: *',
  // the vault: never held by an edge or a browser (the Worker gates each request)
  '/vault/*',
  '  Cache-Control: private, no-store',
  '',
].join('\n'));

// THE FILM BY ITS BYTES (worker/ranges.mjs MEDIA_BYTES): the bytes of every film and song this build ships, the only ones the Worker asks R2 for
writeFileSync(join(out, MEDIA_BYTES.slice(1)), `${JSON.stringify({ ...mediaNames(out), ...(existsSync(join(out, 'app', 'nestos-release.json')) ? installerNames(JSON.parse(readFileSync(join(out, 'app', 'nestos-release.json'), 'utf8'))) : {}) }, null, 1)}\n`);

let files = 0, bytes = 0;
const big = [], listing = [];
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name), st = statSync(path);
    if (st.isDirectory()) { walk(path); continue; }
    files++; bytes += st.size; listing.push(path.slice(out.length + 1).split('\\').join('/'));
    if (st.size > LIMIT) big.push(`${path.slice(out.length + 1)} ${(st.size / 1048576).toFixed(1)} MiB`);
  }
})(out);
if (!existsSync(join(out, 'app', 'warm.html'))) throw new Error('no app/warm.html in the build');
// the output read back: nothing the rule keeps home, whatever put it there; a build that fails this is removed, never left for a deploy
const problems = outputProblems(listing, { vouched, copied: WHOLE, own: ['_redirects', '_headers', MEDIA_BYTES.slice(1)], read: (p) => readFileSync(join(out, p), 'utf8') });
if (problems.length) { rmSync(out, { recursive: true, force: true }); throw new Error(`the build held what no page loads, so it was removed:\n  ${problems.join('\n  ')}`); }
const kinds = {};
for (const p of listing) { const k = (p.match(/\.([^./]+)$/)?.[1] ?? '').toLowerCase() || '(none)'; kinds[k] = (kinds[k] ?? 0) + 1; }
const kept = {};
for (const { why } of plan.home) kept[why] = (kept[why] ?? 0) + 1;
console.log(`optimism.fit: ${files} files, ${(bytes / 1048576).toFixed(1)} MiB in ${out}${tracenets.length ? `; tracenets: ${tracenets.join(', ')}` : ''}`);
console.log(`  by kind: ${Object.entries(kinds).sort((a, b) => b[1] - a[1]).map(([k, n]) => `${n} ${k}`).join(', ')}`);
console.log(`  .md shipped (the pages for agents, the drops): ${listing.filter(p => p.endsWith('.md')).join(', ') || 'none'}; tests and proofs shipped: ${listing.filter(p => /\.(test|proof|browser|spec)\./.test(p)).length}`);
console.log(`  kept home, of ${WHOLE.join('/, ')}/: ${plan.home.length} files (${Object.entries(kept).map(([why, n]) => `${n} ${why}`).join('; ')})`);
console.log(`the page's own, outside ${WHOLE.join('/, ')}/ (tools/page-files.mjs): ${page.length} files\n  ${page.map(f => f.to).join('\n  ')}`);
if (big.length) { console.error(`over the 25 MiB a file limit:\n  ${big.join('\n  ')}`); process.exit(1); }
