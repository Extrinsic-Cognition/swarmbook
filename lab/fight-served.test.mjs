// node --test lab/fight-served.test.mjs: THE FALL IS INSIDE THE DOOR (Oct 24 2026, FIGHT-FOR-HARLEYQUINTITI.md). The rite's intro door
// (tools/embertide-mesh/lib/rite-intro-door.mjs) serves a file only when its real path is inside the intro folder: a link out of it is a 404. The fight
// page imported its fall's ragdoll and rig through two links into games/sims4-nest/program-drive, so through the rite (the door every glass and the
// DysonLight app's Fight key load it by) its module graph failed and window.FIGHT never came: it had only ever run on aiolos, which follows links.
// Here every module the page imports, followed through every static import, and every file it fetches by a plain name, is a real file whose real path
// lies inside embertide-app/ui/intro. Nothing is served and nothing runs: the page and its modules are read as text.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const LAB = path.dirname(fileURLToPath(import.meta.url)), UI = path.resolve(LAB, '..', '..', '..'), INTRO = path.join(UI, 'intro');
const PAGE = path.join(LAB, 'fight-lyssa-seiya.html');
const IMPORT = /(?:^|[\s;}])(?:import|export)\s*(?:[\w*{}\s,$]+?\s+from\s*)?['"]([^'"]+)['"]|\bimport\(\s*['"]([^'"]+)['"]\s*\)/g;
// comments dropped first: a doc comment's example (GLTFLoader.js's "@three_import import { GLTFLoader } from 'three/addons/...'") is no import
const code = (text) => text.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:\\])\/\/.*$/gm, '$1');
const specifiers = (text) => [...code(text).matchAll(IMPORT)].map((m) => m[1] || m[2]);
/** a specifier from <file> as the browser resolves it on the rite: relative to the file, /intro/... from the ui folder, a bare name by the page's map */
function resolve(spec, from, map) {
  if (/^[a-z]+:/i.test(spec)) return null;   // a URL of another origin: none in this page
  if (map[spec]) spec = map[spec];
  if (spec.startsWith('/')) return path.join(UI, spec);
  if (spec.startsWith('.')) return path.resolve(path.dirname(from), spec);
  throw new Error(`${path.relative(UI, from)}: a bare specifier the map does not name: ${spec}`);
}
const inside = (f) => { const real = fs.realpathSync(f); return real === INTRO || real.startsWith(INTRO + path.sep); };

test('every module of the fight page, through every static import, is a real file inside the rite\'s intro folder', () => {
  const html = fs.readFileSync(PAGE, 'utf8');
  const map = JSON.parse((/<script type="importmap">([\s\S]*?)<\/script>/.exec(html) || [, '{"imports":{}}'])[1]).imports || {};
  const inline = [...html.matchAll(/<script type="module">([\s\S]*?)<\/script>/g)].map((m) => m[1]).join('\n');
  const seen = new Set(), out = [], todo = specifiers(inline).map((s) => resolve(s, PAGE, map)).filter(Boolean);
  while (todo.length) {
    const f = todo.pop(); if (seen.has(f)) continue; seen.add(f);
    assert.ok(fs.existsSync(f), `the page imports ${path.relative(UI, f)}, which is not in the tree`);
    if (!inside(f)) out.push(`${path.relative(UI, f)} -> ${fs.realpathSync(f)}`);
    if (/\.(m?js)$/.test(f)) for (const s of specifiers(fs.readFileSync(f, 'utf8'))) { const r = resolve(s, f, map); if (r) todo.push(r); }
  }
  assert.ok(seen.size >= 10, `the walk read ${seen.size} modules`);
  assert.ok([...seen].some((f) => f.endsWith(`${path.sep}ragdoll.mjs`)) && [...seen].some((f) => f.endsWith(`${path.sep}rig.mjs`)), 'the fall\'s ragdoll and rig are among them');
  assert.deepEqual(out, [], 'a module whose real path is outside the intro folder is a 404 on the rite, and the page never runs there');
});

test('every file the page fetches by a plain name beside it is a real file inside the intro folder (the bodies may be stripped off a GitHub clone)', () => {
  const html = fs.readFileSync(PAGE, 'utf8'), names = [...new Set([...html.matchAll(/\bfetch\(\s*'([\w.-]+)'\s*\)/g)].map((m) => m[1]))];
  // Seiya's body, and hers: Athena's from the disc until Oct 24 2026 21:47 WEST (489e87d3b), her own lab/harleyquintiti.hades.glb since; the gate's merged tree has the latter
  assert.ok(names.includes('seiya.hades.glb') && names.some((n) => /^(athena|harleyquintiti)\.hades\.glb$/.test(n)), names.join(', '));
  for (const n of names) {
    const f = path.join(LAB, n); if (!fs.existsSync(f)) continue;   // *.hades.* are stripped before GitHub (tools/house-mirror/strip-families.txt)
    assert.ok(inside(f), `${n} -> ${fs.realpathSync(f)}`);
  }
});
