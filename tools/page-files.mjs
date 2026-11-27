// page-files.mjs: WHAT THE MINT PAGE ASKS FOR OUTSIDE app/, for the build (tools/build-optimism-fit.mjs). Since lane/one-page (his Oct 15 2026
// 01:3x WEST: "ON MY PAGE RIGHT NOW THERE IS FUCKING NOTHING ABOUT THE SHIT I SPENT SO MUCH FUCKING TIME ON DUDE") app/warm.html mounts its hero
// itself (lab/hero-mount.js): the lab's modules, their assets and three.js are the page's now, and optimism.fit must serve each where the page
// asks for it. Never the lab as a whole: its pages, proofs, tests and pictures (some of them frames of the film, never sent) stay home.
//
// pageFiles() walks the page's modules as a browser does: each <script type="module"> of the page (src=, or an inline module's imports), then
// every import, export ... from, import('...') with a literal and new URL('<literal>', import.meta.url) of each module it reaches, a bare
// name through the page's own import map ("three"), plus the assets a module asks for by a name it computes (COMPUTED below). Each file is
// resolved twice, once as the house's door serves this tree (embertide-app/ui at /, the page at /intro/dyson-society/app/warm.html: the file
// in this tree) and once as optimism.fit serves the build (the page at /app/warm.html: its place in the build). A ".." above the site's
// root stays at the root, as a browser resolves it, so ../../room/procedural/three.module.js from /app/ is /room/procedural/three.module.js.
import {existsSync, readFileSync, statSync} from 'node:fs';
import {dirname, join, relative, posix} from 'node:path';
import {fileURLToPath} from 'node:url';

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');   // dyson-society/
const UI = join(ROOT, '..', '..');                                             // embertide-app/ui: the house's door serves it at /
const DOOR = 'http://door/intro/dyson-society/', SITE = 'http://site/';

// THE ASSETS A MODULE ASKS FOR BY A NAME IT COMPUTES (no literal for the walk to read), relative to the module, keyed by its path from dyson-society/;
// a .json list's .glb names come with it (unboxing.js readAssets: {cloth, seiya} or a plain list). Her figure's GLB is not here: film-guided-athena.js
// names it by a literal, so it ships all the same (lab/one-page.test.mjs lists it). The eye door's module is named by a constant (eye-door.mjs WASM_FILE).
export const COMPUTED = Object.freeze({
  '../room/eye-door.mjs': ['wasm/embertide-nexus.wasm'],   // new URL(WASM_FILE, import.meta.url): without it the keyboard's glass (app/tracenet.html) frames from inside its keys
  'lab/sacrifice.js': ['sacrifice-masks.png'],     // SACRIFICE.masks, the matte
  'lab/unboxing.js': ['unboxing-assets.json'],     // readAssets: the box's models, its first list
  'lab/mint-freeze-scene.mjs': ['mint-hold-plate.jpg', 'mint-hold-masks.png'], // projected film layers, named through url(name)
});

/** What a module's source names: {spec, url}: its static imports and re-exports and import('...') with a literal (module specifiers: a bare
 *  name goes through the import map), and new URL('...', import.meta.url) (an address relative to the module: url true). */
export function specifiers(src) {
  const of = (re, url) => [...src.matchAll(re)].map((m) => ({spec: m[1], url}));
  return [
    ...of(/(?:^|(?<=['"]\s*;))[ \t]*(?:import|export)\b[^'"`;]*?\bfrom\s*['"]([^'"]+)['"]/gm, false),   // a statement at a line's start, or after one that ended on its line (two imports on a line: room/him-rows.mjs, Nov 19 2026)
    ...of(/(?:^|(?<=['"]\s*;))[ \t]*import\s*['"]([^'"]+)['"]/gm, false),
    ...of(/\bimport\(\s*['"]([^'"]+)['"]\s*\)/g, false),
    ...of(/\bnew URL\(\s*['"]([^'"]+)['"]\s*,\s*import\.meta\.url\s*\)/g, true),
  ];
}
// the lists among them (their .glb names are the page's too), from the site's root
const LISTS = new Set(Object.entries(COMPUTED).flatMap(([k, names]) => names.filter((n) => /\.json$/i.test(n)).map((n) => posix.join(posix.dirname(k), n))));
const glbsOf = (json) => {
  const name = (e) => typeof e === 'string' ? e : e?.file ?? e?.src ?? e?.name ?? null;
  const all = Array.isArray(json) ? json.map(name) : [...(json?.cloth ?? []), ...(json?.seiya ?? [])].map(name);
  return all.filter((f) => typeof f === 'string' && /\.glb$/i.test(f));
};

/**
 * Every file the page asks for, in the order the walk meets it: {from: the file in this tree, to: its place in the build (from the build's
 * root), as: the path the house's door serves it at}. Throws when the page asks for a file this tree does not hold, a bare name its import map
 * does not map, or two files for one place.
 *
 * With `missing` (an array), a file this tree does not hold is not thrown on: its door path (as) goes into the array, and the walk neither
 * lists that file nor steps into it. lab/one-page.test.mjs alone passes one: app/warm-media/ (386 MB of films, git-ignored until his word)
 * is in the house's own checkout only, never in a clean worktree or the GitHub copy, so the test holds every absent path to that folder.
 * The build passes none: a file the tree does not hold still stops it before anything is removed.
 */
export function pageFiles({page = 'app/warm.html', root = ROOT, ui = UI, missing = null} = {}) {
  const html = readFileSync(join(root, page), 'utf8');
  const mapText = /<script type="importmap">([\s\S]*?)<\/script>/.exec(html)?.[1];
  const map = mapText ? JSON.parse(mapText).imports ?? {} : {};
  const at = {door: new URL(page, DOOR), site: new URL(page, SITE)};
  const seen = new Set(), places = new Map(), files = [];
  // a name met in `who` (whose places are door and site): a module specifier, or an address relative to it (url: an asset, a list's entry)
  const step = ({spec, url}, door, site, who) => {
    if (/^[a-z][\w+.-]*:/i.test(spec)) return;   // another site (a CDN), data: or blob:: not the build's
    if (spec.endsWith('/')) return;                // a base (new URL('./', import.meta.url)), not a file
    if (!url && Object.hasOwn(map, spec)) return visit(new URL(map[spec], at.door), new URL(map[spec], at.site));
    if (!url && !/^\.{0,2}\//.test(spec)) throw new Error(`${who} names "${spec}", which the page's import map does not map`);
    return visit(new URL(spec, door), new URL(spec, site));
  };
  function visit(door, site) {
    const as = decodeURIComponent(door.pathname), to = decodeURIComponent(site.pathname).replace(/^\/+/, '');
    if (seen.has(as)) return;
    seen.add(as);
    const from = join(ui, as);
    if (!existsSync(from)) {
      if (missing) { missing.push(as); return; }   // into the test's list: never among the files, never walked
      throw new Error(`the page asks for ${as} (at /${to} in the build), which is not in this tree`);
    }
    if (statSync(from).isDirectory()) throw new Error(`the page asks for ${as}, a folder: only files ship`);
    if (places.has(to) && places.get(to) !== from) throw new Error(`two files for /${to}: ${places.get(to)} and ${from}`);
    places.set(to, from);
    files.push({from, to, as});
    const own = relative(root, from).split('\\').join('/');
    if (LISTS.has(own)) { for (const glb of glbsOf(JSON.parse(readFileSync(from, 'utf8')))) step({spec: glb, url: true}, door, site, own); return; }
    if (!/\.m?js$/i.test(as)) return;
    const text = readFileSync(from, 'utf8');
    for (const s of [...specifiers(text), ...(COMPUTED[own] ?? []).map((spec) => ({spec, url: true}))]) step(s, door, site, own);
  }
  for (const m of html.matchAll(/<script type="module"(?:\s+src="([^"]+)")?\s*>([\s\S]*?)<\/script>/g)) {
    for (const s of m[1] ? [{spec: m[1], url: false}] : specifiers(m[2])) step(s, at.door, at.site, page);
  }
  return files;
}
