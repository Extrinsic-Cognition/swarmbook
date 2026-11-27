// site-files.test.mjs: WHAT optimism.fit CARRIES (site-files.mjs; lane/the-site-carries-only-what-pages-load). Read on Oct 29 2026 at 09:3x UTC, the site served
// 16 of app/'s 17 .md files (ROOM.md, his room's words, and every receipt with his quoted words), the tests, the proofs, the local road's release and
// the film's depth layers, which no page loads and the GitHub copy strips. The rule, one file at a time, then over this tree: every page and
// every module its walk reaches ships; no receipt, note, test, proof or file no page names does.
// node --test site-files.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { shipsAs, outputProblems, namer, planSite, AGENT_PAGES, inlineScripts } from './site-files.mjs';
import { pageFiles, ROOT } from './page-files.mjs';

test('one file at a time: the kinds a page loads ship (gen/\'s module among them: found.html imports it); receipts, notes, tests, proofs, the local road and the unnamed stay home', () => {
  const named = namer(["fetch('./warm-genesis.json')"]);
  for (const r of ['app/warm.html', 'app/dl-space-router.js', 'app/warm-entry.mjs', 'app/warm.css', 'app/assets/athena.png', 'app/saint-seiya.mp4', 'app/saint-seiya.m4a',
    'app/fonts/dm-sans-400.ttf', 'app/wasm/embertide-mint.wasm', 'app/gen/poleis-client-v7.js', 'submission/index.html', 'js/poleis-client.js', 'app/agent.md', 'skills/poleis-join/SKILL.md',
    'app/warm-genesis.json', 'app/warm-media/world-lossless-2/manifest.json', 'app/fonts/OFL-DM-Sans.txt', 'app/vendor/tweetnacl-1.0.3.LICENSE.txt']) {
    assert.equal(shipsAs(r, { named }), null, `${r} ships`);
  }
  const home = {
    'app/ROOM.md': 'a receipt or a note', 'app/THE-CHOICE-AT-THE-FREEZE-LANDING.md': 'a receipt or a note', 'app/LANDING.md': 'a receipt or a note',
    'app/fonts/README.md': 'a receipt or a note', 'skills/poleis-join/NOTES.md': 'a receipt or a note', 'app/dl-twelve.test.mjs': 'a test or a proof',
    'app/dl-twelve.proof.mjs': 'a test or a proof', 'app/holder-orbits.browser.mjs': 'a test or a proof',
    'app/nestos-release.local.json': "the local road's own", 'app/assets/her-card.json': 'data no page names', 'app/notes.txt': 'data no page names',
    'app/saint-seiya.layers.bin': 'not a kind a page loads', 'app/tool.py': 'not a kind a page loads', 'app/.DS_Store': 'a dotfile',
    'app/warm.js.bak': 'a backup', 'vault/someone/an-id/a-drop.md': 'not a drop a register names',
  };
  for (const [r, why] of Object.entries(home)) assert.equal(shipsAs(r, { named }), why, `${r} stays home: ${why}`);
  const vouched = new Set(['vault/someone/an-id/a-drop.md', 'app/tracenet/someone.json']);
  assert.equal(shipsAs('vault/someone/an-id/a-drop.md', { vouched }), null, 'a drop its register names ships, for the Worker to serve by its law');
  assert.equal(shipsAs('app/tracenet/someone.json', { vouched }), null, 'a register the build checked ships');
  assert.deepEqual(AGENT_PAGES, ['app/agent.md'], 'the one page for agents: /agent.md and /llms.txt send to it');
});

test('the build reads its own output back: a receipt, a test, the local road, a home folder or a workers.dev account in it is named; the build\'s own files and a clean output pass', () => {
  const own = ['_redirects', '_headers', 'media-bytes.json'], said = readFileSync(new URL('./build-optimism-fit.mjs', import.meta.url), 'utf8'), lines = [...said.matchAll(/(['"])  ([A-Za-z-]+): ((?:(?!\1).)*)\1/g)].map((m) => `${m[2]}: ${m[3]}`); assert.ok(lines.includes('Strict-Transport-Security: max-age=31536000') && lines.includes('X-Content-Type-Options: nosniff') && said.includes("'  Strict-Transport-Security: max-age=31536000', POLICY,") && said.includes("POLICY = `  Content-Security-Policy: base-uri 'self'; object-src 'none'; form-action 'self'; script-src 'self' 'unsafe-eval' 'wasm-unsafe-eval' ${SCRIPTS.join(' ')}`"), 'THE SITE PINS HTTPS (Nov 20 2026): every file the site serves says https for a year, and its pages shut the three doors none of them uses; THE PAGES RUN ONLY THEIR OWN SCRIPTS: and they run this site\'s scripts and the ones written inside its pages, each by its hash'); assert.ok(lines.length >= 8 && !lines.some((l) => /X-Frame-Options|frame-ancestors|upgrade-insecure-requests/i.test(l)) && !/POLICY = `[^`]*(frame-ancestors|upgrade-insecure-requests|unsafe-inline|https?:)/.test(said), 'and no header line says who may frame a page (his glasses frame a page of the web by its public name: THE-JOURNEY-GATE.md 5d) or turns the pages\' asks of the Nest on 127.0.0.1 into https; the policy lets in no script written by another hand and names no other host'); assert.ok(said.includes("'/app/dl-her-portrait-frame.html', '  ! Content-Security-Policy', '/app/vendor/reactor*',"), 'the painter\'s frame, which has no origin, keeps no policy'); assert.deepEqual(inlineScripts(['<script>alert(1)</script><script src="./a.js"></script><script type="application/json">{"a":1}</script><script type="module">import "./b.js";</script>', '<script>alert(1)</script><script type="importmap">{"imports":{}}</script><script> </script>']), ["'sha256-1g60LIr+P4otwy1HDKIjjJQvvzoku5whxT19irIjMX0='", "'sha256-URrTy+Il/Nz0lHojVUx275hWqAWhkSF0VsHbUM4/6Hw='", "'sha256-bhHHL3z2vDgxUt0W3dWQOrprscmda2Y5pLsLg4GF+pI='"], 'each script written in a page is named once by the hash of its text; a script with a src, a block of data and an empty one are not'); const mint = new URL('../app/', import.meta.url); assert.deepEqual(readdirSync(mint).filter((n) => n.endsWith('.html') && /<script\b[^>]*\bsrc\s*=\s*["']?(https?:)?\/\//i.test(readFileSync(new URL(n, mint), 'utf8'))), [], 'no page of the mint takes a script from another host'); for (const n of ['dl-slot.js', 'dl-whitelist.js']) assert.ok(!/cdn\.jsdelivr\.net/.test(readFileSync(new URL(n, mint), 'utf8')), `${n} loads the site's own copies`);
  assert.deepEqual(outputProblems(['_redirects', '_headers', 'media-bytes.json', 'app/warm.html', 'app/agent.md', 'lab/hero-mount.js', 'room/procedural/three.module.js'], { own }), []);
  assert.deepEqual(outputProblems(['app/ROOM.md', 'lab/one-page.test.mjs', 'app/gen/poleis-client-v7.js', 'app/nestos-release.local.json', 'app/assets/her-card.json', 'room/wire.mjs', 'room/link.mjs', 'app/agent.md'], { own, read: (p) => ({ 'room/wire.mjs': '// Spec: /Users/someone/code/x.md', 'room/link.mjs': 'fetch("https://x.com/home/a/")', 'app/agent.md': '<https://web.someone-1a2.workers.dev/app/>' })[p] ?? '' }),
    ['app/ROOM.md: a receipt or a note', 'lab/one-page.test.mjs: a test or a proof', "app/nestos-release.local.json: the local road's own", 'room/wire.mjs: names a home folder or a workers.dev account', 'app/agent.md: names a home folder or a workers.dev account']);
});

// this tree: the registers the build checks, and what the rule makes of every file of the copied folders
const vouched = new Set();
for (const name of readdirSync(join(ROOT, 'app', 'tracenet')).filter((n) => n.endsWith('.json'))) {
  const handle = name.slice(0, -5), register = JSON.parse(readFileSync(join(ROOT, 'app', 'tracenet', name), 'utf8'));
  vouched.add(`app/tracenet/${name}`);
  for (const item of register.items ?? []) vouched.add(`vault/${handle}/${item.id}/${item.file}`);
}
const PAGES = readdirSync(join(ROOT, 'app')).filter((n) => n.endsWith('.html')).map((n) => `app/${n}`);

test('this tree: every page ships, and every module each page\'s walk reaches in the copied folders ships with it', () => {
  const { ship } = planSite(ROOT, { vouched });
  const shipped = new Set(ship);
  for (const page of [...PAGES, 'submission/index.html']) assert.ok(shipped.has(page), `${page} ships`);
  for (const page of PAGES) {
    let walked;
    try { walked = pageFiles({ page, missing: [] }); } catch { continue; }   // a page whose import map the walk does not know: its scripts ship by kind
    for (const f of walked) if (/^(app|js|skills|submission|vault)\//.test(f.to)) assert.ok(shipped.has(f.to), `${page} loads ${f.to}: it ships`);
  }
  for (const r of ['app/warm-genesis.json', 'app/whitelist.json', 'app/whitelist-gold.json', 'app/stations.json', 'app/nestos-release.json']) assert.ok(shipped.has(r), `${r}: a page names it`);
  for (const r of vouched) assert.ok(shipped.has(r), `${r}: the build checked it`);
});

test('this tree: no receipt, note, test, proof, local release or unnamed file ships; ROOM.md and the film\'s layers stay home', () => {
  const { ship, home } = planSite(ROOT, { vouched });
  const md = ship.filter((r) => r.endsWith('.md'));
  assert.deepEqual(md.filter((r) => !r.startsWith('vault/')).sort(), ['app/agent.md', 'skills/poleis-found/SKILL.md', 'skills/poleis-join/SKILL.md'], 'of .md, only the pages for agents (and the drops)');
  assert.ok(md.filter((r) => r.startsWith('vault/')).every((r) => vouched.has(r)));
  assert.deepEqual(ship.filter((r) => /\.(test|proof|browser|spec)\.[^.]+$/.test(r) || /\.local\./.test(r)), []);
  const why = new Map(home.map((h) => [h.rel, h.why]));
  assert.equal(why.get('app/ROOM.md'), 'a receipt or a note');
  assert.equal(why.get('app/saint-seiya.layers.bin'), 'not a kind a page loads', 'no page loads the film\'s depth layers, and the GitHub copy strips them');
  assert.equal(why.get('app/nestos-release.local.json'), "the local road's own");
  assert.ok([...why.keys()].filter((r) => /LANDING\.md$/.test(r)).length >= 15, 'every receipt stays home');
  assert.deepEqual(outputProblems(ship, { vouched }), [], 'and what ships passes the build\'s own reading back');
});
