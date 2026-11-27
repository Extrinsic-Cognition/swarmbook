// one-page.test.mjs: ONE PAGE (lab/hero-mount.js; his words in its header, "I WANT TO ALWAYS DO QA ON A SINGLE COMULATED VERSION DUDE"):
// app/warm.html mounts the hero itself, once; lab/hero-ab.html mounts nothing and reaches the page's own mount through its frame. Without a
// browser; lab/one-page.proof.mjs proves it on the served page (the canvases in #sphere-stage on both, the mounts, nothing at rest).
//   node --test embertide-app/ui/intro/dyson-society/lab/one-page.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const here = (f) => new URL(f, import.meta.url);
const read = (f) => fs.readFileSync(here(f), 'utf8');
const warm = read('../app/warm.html'), entry = read('../app/warm-entry.mjs'), mount = read('./hero-mount.js'), lab = read('./hero-ab.html');
const code = (src) => src.replace(/^\s*\/\/.*$/gm, '').replace(/\/\*\*[\s\S]*?\*\//g, '');   // the lines that run, without their comments
const scripts = (html) => [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[0]).join('\n');

test('app/warm.html mounts the hero through its entry module, once, three.js mapped in its head', () => {
  const s = scripts(warm);
  assert.equal(entry.split('mountHero(').length - 1, 1, 'one call');
  assert.equal([...entry.matchAll(/hero-mount\.js/g)].length, 1, 'one import');
  assert.match(warm, /<script type="module" src="\.\/warm-entry\.mjs\?v=[\w-]+"><\/script>\n<!--[^\n]*-->\n<script type="module" src="\.\/dl-glass\.js\?mount&v=[\w-]+"><\/script>\n<\/body>/,
    'the page\'s last script but the glass\'s own half (THE PAGE IS A GLASS OF THE ROOM, f27c256580) chooses the introduction or explicit app entry');
  assert.match(entry, /import\('\.\.\/lab\/hero-mount\.js\?v=[\w-]+'\)\.then\(\(\{mountHero\}\) => mountHero\(\{doc, win\}\)\)/);
  const map = warm.indexOf('<script type="importmap">');
  assert.ok(map > 0 && map < warm.indexOf('</head>') && map < warm.indexOf('<script type="module"'), 'the import map in the head, before any module');
  assert.match(warm, /<script type="importmap">\{"imports": \{"three": "\.\.\/\.\.\/room\/procedural\/three\.module\.js"\}\}<\/script>/);
  assert.ok(fs.existsSync(here('../../room/procedural/three.module.js')), 'three.js where the map says');
  // THE BRIDGE is gone (main e990677d sent his door to the lab until this lane): the page is his page on every door
  assert.doesNotMatch(s, /location\.replace\([^)]*hero-ab/);
});

test('hero-mount.js lays what the lab\'s film view laid, in its order, once each, and nothing of the lab\'s panel', () => {
  const src = code(mount);
  const order = ['createOrbitKick({', 'createTheater({', 'mountKoEdge({', 'mountAntiSatellites({', 'mountHeartbeat({', 'mountSacrifice({', 'mountIrradiance({',
    "import('./unboxing.js", 'createUnboxing({'];   // the box's import carries its chain's ?v= (main 80af5fbf), so its name alone
  const at = order.map((s) => src.indexOf(s));
  assert.ok(at.every((i) => i > 0), JSON.stringify(Object.fromEntries(order.map((s, i) => [s, at[i]]))));
  assert.deepEqual([...at].sort((a, b) => a - b), at, 'in the film view\'s order');
  for (const s of order) assert.equal(src.split(s).length - 1, 1, `${s} once`);
  // the canvases after the sphere (the theater's, the box's, the front's), the dark right after the sphere, the card quiet, the invitation
  assert.match(src, /found\.sphere\.after\(canvas\);[\s\S]*canvas\.after\(box3d\); box3d\.after\(front\);[\s\S]*found\.sphere\.after\(dark\);/);
  assert.match(src, /#face-note\{display:none!important\}/);
  assert.match(src, /invite\(found\.stage\);/);
  // His later correction: anime until the freeze, then native 3D. No second
  // native body can appear under the moving film. No lab controls on the page.
  assert.match(src, /her: false, freezeSpace/);
  assert.match(src, /const freezeSpace = q\.get\('freeze'\) !== 'off'/);
  assert.doesNotMatch(src, /getElementById\('(ab|ab-toggle|m|moments|cloths|seiyas|num|box-num|athena-num|to-hit)'\)/);
  // his tags, read once from the Nest, softly
  assert.deepEqual([...src.matchAll(/(?<!function )readTags\(\)/g)].length, 1, 'one read');
  assert.match(src, /const tagsRead = readTags\(\);/);
  assert.match(src, /catch \(error\) \{ console\.warn\(`hero-mount: his tags were not read from \$\{NEST\}`, error\); tags = AT_REV_1; rev = null; \}/);   assert.match(src, /if \(!q\.get\('nest'\) && !asksNest\(win\.location\.hostname\)\) \{ tags = AT_REV_1; rev = null; \} else try \{/, 'THE PUBLIC PAGE ASKS NO HOUSE PORT (Nov 12 2026): optimism.fit never asks :8904, rev 1 at once');
});

test('the mount never sets the picture\'s time; the only time it sets is a paused song\'s, to the picture\'s second (THE SOUND COMES IN WHERE THE PICTURE IS)', () => {
  const sets = [...code(mount).matchAll(/([\w.?]+)\.currentTime\s*=(?!=)\s*([^;\n]*)/g)].map((m) => [m[1], m[2].trim()]);
  assert.deepEqual(sets, [['song', 'found.film.currentTime']]);
  assert.match(mount, /const meet = \(\) => \{ if \(song\?\.paused && found\.film\.readyState >= 1 && !win\.dlTwelve\?\.state\?\.\(\)\.cinematic\?\.active\) song\.currentTime = found\.film\.currentTime; \};/);
  assert.match(mount, /for \(const type of \['pointerup', 'click'\]\) found\.stage\.addEventListener\(type, meet, true\);/, 'before dl-twelve.js\'s own');
  // the lab's panel seeks the page's film only to his moments (seek(t)), as it did
  assert.deepEqual([...lab.matchAll(/film\.currentTime\s*=(?!=)\s*([^;\n]*)/g)].map((m) => m[1].trim()), ['t']);
});

test('nothing at rest in the mount\'s own code: no frame loop, no interval; one timer, at the load, for the box in the idle time', () => {
  const src = code(mount);
  assert.doesNotMatch(src, /requestAnimationFrame\s*\(/);
  assert.doesNotMatch(src, /setInterval\s*\(/);
  assert.equal(src.split('setTimeout(').length - 1, 2, 'later() and the idle time\'s fallback');
  assert.match(src, /later\(LOAD_AFTER_MS\)\.then\(idle\)\.then\(startBox\);/);
  assert.match(src, /const show = \(m, t\) => \{ if \(ears\.size\) tell\('show', m, t\); \};/, 'the panel\'s ears cost nothing when none listens');
});

test('the switches are the lab\'s: read off a lab page of the same site that frames the page; none on the page as everyone meets it', async () => {
  const {switchesOf} = await import('./hero-mount.js');
  const alone = {location: {pathname: '/intro/dyson-society/app/warm.html', search: '?v=c&inversion=off&her=on'}}; alone.parent = alone;
  assert.equal(switchesOf(alone).toString(), '', 'the page itself: none, whatever its own address says');
  const labTop = {location: {pathname: '/intro/dyson-society/lab/hero-ab.html', search: '?v=c&inversion=off'}};
  assert.equal(switchesOf({parent: labTop}).get('v'), 'c');
  assert.equal(switchesOf({parent: labTop}).get('inversion'), 'off');
  assert.equal(switchesOf({parent: {location: {pathname: '/somewhere/else.html', search: '?v=c'}}}).toString(), '', 'framed outside the lab: none');
  assert.equal(switchesOf({parent: {get location() { throw new Error('another site'); }}}).toString(), '', 'framed by another site: none');
  assert.equal(switchesOf(null).toString(), '');
});

test('mountHero: one mount a document, its handle frozen and on the page\'s window, his tags read once, nothing laid before the page\'s load', async () => {
  const {mountHero} = await import('./hero-mount.js');
  const listeners = {}, observed = [];
  const win = {location: {protocol: 'http:', hostname: '127.0.0.1', pathname: '/intro/dyson-society/app/warm.html', search: ''},
    addEventListener: (type, fn) => { (listeners[type] ||= []).push(fn); }, setTimeout,
    MutationObserver: class { observe(...a) { observed.push(a); } disconnect() {} }};
  win.parent = win;
  const doc = {readyState: 'loading', defaultView: win, getElementById: () => null, documentElement: {}};
  const asked = [], was = globalThis.fetch, warn = console.warn;
  globalThis.fetch = async (url) => { asked.push(String(url)); throw new Error('no Nest here'); };
  console.warn = () => {};
  try {
    const hero = mountHero({doc, win});
    assert.equal(mountHero({doc, win}), hero, 'a second call: the same handle, nothing more');
    assert.ok(Object.isFrozen(hero));
    assert.equal(win.hero, hero, 'on the page\'s window');
    assert.equal(hero.mounts, 0, 'nothing laid before the load');
    assert.equal(listeners.load?.length, 1, 'one wait for the page\'s load');
    for (let i = 0; i < 4; i++) await new Promise((r) => setTimeout(r, 0));
    // his tags, once, and the glass's look, once (glass-look.mjs: his house's doors, never under automation), each from the Nest
    assert.deepEqual(asked, ['http://127.0.0.1:8904/nest/ref/mint/seiya-tags', 'http://127.0.0.1:8904/nest/ref/mint/glass'], 'his tags and the glass\'s look, once each, from the Nest');
    assert.deepEqual(hero.glass, {pass: 'none', from: 'default'}, 'the Nest not there: the glass transparent');
    assert.equal(hero.used.conversion.t, 61.767, 'the Nest not there: his conversion tag as at rev 1');
    assert.equal(hero.rev, null);
    assert.equal(hero.hold, null, 'the film');
    assert.equal(hero.inverted, true, 'the golden inversion on');
    assert.equal(hero.moments().rise, 61.767);
    // at the load, no stage yet: it waits for the sphere and the film, and lays nothing
    listeners.load[0]();
    assert.equal(hero.mounts, 0);
    assert.equal(observed.length, 1, 'one observer, until the sphere and the film are there');
    // the panel's ears: told nothing it did not ask for, and let go
    const heard = [], off = hero.listen((...a) => heard.push(a));
    off();
    assert.deepEqual(heard, []);
  } finally { globalThis.fetch = was; console.warn = warn; }
});

test('lab/hero-ab.html mounts nothing: no module of the hero, no layer made, no three.js of its own; the page\'s own mount through its frame', () => {
  const script = lab.slice(lab.indexOf('<script type="module">'), lab.lastIndexOf('</script>'));
  assert.doesNotMatch(script, /^\s*import\b|\bimport\(/m, 'no import');
  assert.doesNotMatch(script, /\b(createTheater|createOrbitKick|createUnboxing|mountKoEdge|mountAntiSatellites|mountHeartbeat|mountSacrifice|mountIrradiance|mountHero)\s*\(/);
  assert.doesNotMatch(script, /createElement\('canvas'\)|sphere-stage|genesis-sphere/, 'nothing laid on the page\'s stage: it touches only the page\'s film and song');
  assert.doesNotMatch(lab, /type="importmap"/);
  assert.match(script, /const found = frame\.contentWindow\?\.hero \?\? null;/);
  assert.match(script, /page\.view\(m\)/, 'its views are the page\'s mount\'s');
  assert.match(lab, /<iframe id="page" src="\.\.\/app\/warm\.html" title="The mint page"><\/iframe>/);
});

test('the build ships what the page asks for outside app/: the lab\'s modules and assets the hero mounts, three.js where the map puts it; never the lab whole', async () => {
  const {pageFiles} = await import('../tools/page-files.mjs');
  // app/warm-media/ (386 MB of films, git-ignored until his word) is in the house's own checkout only: in a clean worktree or the GitHub copy
  // the walk lists what this tree does not hold instead of throwing, and each must be one of those films; where the films are, none is absent
  const missing = [], files = pageFiles({missing}), to = files.map((f) => f.to);
  for (const as of missing) assert.ok(as.startsWith('/intro/dyson-society/app/warm-media/'), `${as}: not in this tree, and not the git-ignored films`);
  if (fs.existsSync(here('../app/warm-media'))) assert.deepEqual(missing, [], 'the films are here, so every file the page asks for is');
  const lab = ['lab/hero-mount.js', 'lab/theater.js', 'lab/theater-light.json', 'lab/orbit-kick.js', 'lab/satellites-score.js', 'lab/anti-satellites.js',
    'lab/dolbar-charge.js', 'lab/dolbar-field.js', 'lab/heartbeat.js', 'lab/ko-edge.js', 'lab/ko-spasms.js', 'lab/sacrifice.js', 'lab/sacrifice-masks.png',
    'lab/irradiance.js', 'lab/golden-field.js', 'lab/unboxing.js', 'lab/unboxing-plan.mjs', 'lab/unboxing-assets.json', 'lab/cloth-trellis.sagittarius.glb',
    'lab/seiya-trellis.sagittarius.glb', 'lab/cubism.mjs', 'lab/athena-shot.mjs', 'lab/braindance.mjs', 'lab/braindance.json',
    // the box's Athena layers (unboxing.js's static imports and its matte) and Dolbar's beats (anti-satellites.js): main, Oct 15 02:22 to 11:24 WEST
    'lab/athena-continuation.mjs', 'lab/athena-layers.mjs', 'lab/athena-layer-mattes.png', 'lab/fields.js', 'lab/fields-plan.mjs', 'lab/fields-film.mjs',
    'lab/cubism-window.js', 'lab/dolbar-beats.js',
    // THE GLASS IS TRANSPARENT (his Oct 17 2026 20:4x WEST): the theater's look, read once at the load (glass-look.mjs)
    'lab/glass-look.mjs',
    // THE TWELVE, DCT-aligned (his Oct 17 2026 20:3x WEST): the film's and the song's measure the flight reads (twelve-dct.js)
    'lab/twelve-dct.js',
    // the anime's gold on the Cloth, in the box and in the freeze (Oct 16 2026)
    'lab/anime-gold.mjs'];
  // the native study: unboxing.js's import('./film-guided-athena.js') behind createUnboxing's nativeStudy, which the page never turns on. The
  // walk follows every literal import(), so it ships with the two GLBs it names; the page asks for one of them itself, her figure's
  // (athena.hades.glb, braindance.json's athena asset), while hero-mount.js's `her` is on.
  const study = ['lab/film-guided-athena.js', 'lab/film-guided-shot.mjs', 'lab/athena.hades.glb', 'lab/seiya.hades.glb'];
  // The public cinematic uses source matte textures and the existing golden Cloth.
  // The rejected native game studies stay out of its dependency closure.
  const freeze = ['lab/mint-freeze-scene.mjs', 'lab/golden-sagittarius.mjs', 'lab/mint-cinematic-score.mjs', 'lab/mint-freeze-layout.mjs',
    'lab/mint-hold-plate.jpg', 'lab/mint-hold-masks.png'];
  const three = ['room/procedural/three.module.js', 'room/procedural/three.core.js', 'room/procedural/GLTFLoader.js', 'room/procedural/BufferGeometryUtils.js',
    'room/procedural/SkeletonUtils.js'];
  // the house's JavaScript SHA-256: app/warm-ceremony.js's import('../vendor/embertide-app/ui/intro/room/isa/isa.mjs'), asked only by a page with no crypto.subtle (a TV on the
  // rite's plain http, Oct 17 2026); optimism.fit is a secure context and never asks for it, but the walk follows every literal import(), so it ships
  const isa = ['room/isa/isa.mjs'];
  for (const f of [...lab, ...study, ...freeze, ...three, ...isa]) assert.ok(to.includes(f), `${f} ships`);
  // the lab's files the page's modules name and only those: never its pages, proofs, tests or pictures
  assert.deepEqual(to.filter((t) => t.startsWith('lab/')).sort(), [...lab, ...study, ...freeze].sort());
  assert.deepEqual(to.filter((t) => t.startsWith('room/')).sort(), [...three, ...isa].sort());
  // each from this tree; three.js from intro/room/procedural (the map's ../../room/procedural/ from app/), at /room/procedural/ on the site
  for (const f of files) assert.ok(fs.existsSync(f.from), f.from);
  assert.equal(files.find((f) => f.to === 'room/procedural/three.module.js').as, '/intro/room/procedural/three.module.js');
  // the build copies them after the folders it copies whole, and refuses a page without its hero; it walks this page and a tracenet's (the
  // next test), and neither walk passes a list, so a file the tree does not hold, the films included, stops it
  const build = read('../tools/build-optimism-fit.mjs');
  assert.match(build, /^import \{ pageFiles \} from '\.\/page-files\.mjs';$/m);
  assert.deepEqual([...build.matchAll(/\bpageFiles\(([^)]*)\)/g)].map((m) => m[1]), ['', "{ page: 'app/tracenet.html' }"],
    'two walks, this page\'s and a tracenet\'s, neither with a list');
  assert.match(build, /for \(const f of page\) \{ mkdirSync\(dirname\(join\(out, f\.to\)\), \{ recursive: true \}\); cpSync\(f\.from, join\(out, f\.to\)\); \}/);
  assert.match(build, /if \(!page\.some\(f => f\.to === 'lab\/hero-mount\.js'\)\) throw new Error/);
});

test('a tracenet ships its saved Lyssajudron room modules and three.js, never a lab file; the two walks agree on every place', async () => {
  const {pageFiles} = await import('../tools/page-files.mjs');
  // app/tracenet.html is a builder's tracenet (optimism.fit/<handle>, the build's _redirects). Since ad4285d8 and a8708118 (Oct 15 2026 16:46 to
  // 17:02 WEST, his "make the tracenet a computer in the dark seen from above it with keyboard", then "a real 3D laptop": app/tracenet/
  // COMPUTER-LANDING.md) its laptop imports three.js. The later saved appearance uses tracenet-lyssajudron.mjs and the canonical
  // room/lyssajudron.mjs tree, with optional WASM disabled, so the build walks those modules as well.
  const build = read('../tools/build-optimism-fit.mjs');
  const said = /^const WHOLE = (\[[^\]]*\]);$/m.exec(build);
  assert.ok(said, 'the build names the folders it copies whole');
  const whole = JSON.parse(said[1].replaceAll("'", '"'));
  const own = pageFiles({page: 'app/tracenet.html'}).filter((f) => !whole.some((dir) => f.to.startsWith(`${dir}/`)));
  const lyssajudron = ['poleis/orb.js', 'room/beat-clock.mjs', 'room/flight-law.mjs', 'room/her-breath.mjs', 'room/her-face.js',
    'room/lyssajudron-band.mjs', 'room/lyssajudron-council.mjs', 'room/lyssajudron-ferro.mjs', 'room/lyssajudron-score.mjs',
    'room/lyssajudron.mjs', 'room/reveal-plan.mjs', 'room/score-wasm.mjs', 'room/terrain-layer.mjs'];
  const three = ['room/procedural/three.module.js', 'room/procedural/three.core.js'];
  // what it adds to the site outside the folders copied whole, and only that: no lab file, none of the lab's pages, proofs, tests or pictures
  assert.deepEqual(own.map((f) => f.to).sort(), [...lyssajudron, ...three].sort());
  for (const f of own) assert.ok(fs.existsSync(f.from), f.from);
  // the build keeps one file a place over its two walks (a Map by place, the later walk's winning): where both pages ask for a place, one file
  const missing = [], film = new Map(pageFiles({missing}).map((f) => [f.to, f.from]));
  const shared = own.filter((f) => film.has(f.to));
  assert.deepEqual(shared.map((f) => f.to).sort(), [...three].sort(), 'three.js, which the film\'s page ships too');
  for (const f of shared) assert.equal(f.from, film.get(f.to), `/${f.to}: the same file from both pages`);
});

test('the walk reads a module as a browser does: multi-line imports, re-exports, two statements on a line, import() and new URL(..., import.meta.url); never a comment or a base', async () => {
  const {specifiers} = await import('../tools/page-files.mjs');
  const src = `import {a,\n  b} from './a.js';\nimport './side.js';\nexport * from "./re.js";\n// import {x} from './commented.js';\n * import {y} from './doc.js';\n` +
    `const m = await import('./late.js');\nconst j = new URL('./light.json', import.meta.url), base = new URL('./', import.meta.url);\nconst s = 'from' + "x";\nimport {c} from './one.js'; import {d} from './two.js';   import './three.js';\n`;
  assert.deepEqual(specifiers(src), [{spec: './a.js', url: false}, {spec: './re.js', url: false}, {spec: './one.js', url: false}, {spec: './two.js', url: false}, {spec: './side.js', url: false}, {spec: './three.js', url: false}, {spec: './late.js', url: false},
    {spec: './light.json', url: true}, {spec: './', url: true}]);
});
