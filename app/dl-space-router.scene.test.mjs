// dl-space-router.scene.test.mjs: SPACE ROUTER AT THE FREEZE (dl-space-router.js; his Oct 29 2026 09:10 UTC over BRONZE and GOLD on the page: "i need you to
// completely restructure this... no longer being about bronze or gold, but rather, YOU MUST INTRODUCE SPACE ROUTER AND HOW IT HAS A: 1 $ SPENT = 1$WARM u get
// what i mean? it is rebate"). The rebate slams in where the choice did, in THE CHOICE AT THE FREEZE's grammar (his Oct 28: "treat this as a glorious crazy
// dmc4 structrue... i dont want to break the role playing with explanations"): SPACE ROUTER stamped $1 SPENT, then 1 $WARM stamped REBATE with ドン, the
// flask between them, framed and never covered (beside it where the screen is wide, above it where it is tall), each name the call's own
// press; then his call to arms, JOIN THE $WARM, over three chevrons under the flask, down to the Canvas once his film is seen (THE CANVAS BELOW, his Oct 30
// 2026 "we were supposed to drive people below"), and the scene riding away with the hero. The rate is the
// Space-Router's own (tools/embertide-mesh/lib/space-tanks.mjs), and no Bronze, no Gold, no price and no sentence is in sight.
// node --test dl-space-router.scene.test.mjs
import test from 'node:test'; import { COUNT } from './dl-athena.mjs';
import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import { ROUTER_Z, WARM_PER_USD, SLAMS, BELOW, CRY, FLASK_OF_SPHERE, STACK_EMS, TOP_CLEAR, CRY_OF_WARM, FIRST_CRY, FILM, FILM_DONE, FILM_SEEN_KEY, FILM_SKIP, FILM_S, FILM_SKIP_BEFORE_S, TRACENET, mountRouter } from './dl-space-router.js';
import { WARM_PER_USD as ROUTER_RATE, warmOwed } from '../vendor/tools/embertide-mesh/lib/space-tanks.mjs';
import { HANDOFF_Z } from './dl-handoff.js';
import { SEEN_EVENT } from './dl-athena.js';
import { MINT_WINDOW } from './warm-sphere.js';

test('the rebate is the Space-Router\'s own rate; the scene stands where the handoff stood', () => {
  assert.equal(WARM_PER_USD, ROUTER_RATE, 'one rate: the tanks owe what the page says');
  assert.equal(warmOwed(1), WARM_PER_USD, '$1 spent, 1 $WARM back');
  assert.equal(ROUTER_Z, HANDOFF_Z);
});

// PROMPT-TO-MINE (his Oct 29 2026 20:55:59 UTC: "make fucking enourmous attention strategically to how memetic can "Prompt-to-Mine" can be... imagine like
// mining the supply with rebates dude..."; 20:56:41 "it's like proof of work distribution dude"): the rebate is mining, stamped so
// THE FIRST TRACENET (his Oct 30 2026 ~22:4x UTC: "make it about the first tracenet", "not make it about me"; "instead of throwing $WARM out there so prematurely")
test('the slams: THE FIRST TRACENET stamped PROJECT SNOWTRACE, then NOW LIVE stamped OPEN SOURCE, TRACED with ドン; no $WARM, no person, no seat, no price, no rank', () => {
  assert.deepEqual(SLAMS.map((s) => [s.key, s.name, s.stamp]), [['router', 'THE FIRST TRACENET', 'PROJECT SNOWTRACE'], ['warm', 'NOW LIVE', 'OPEN SOURCE, TRACED']]);
  assert.doesNotMatch(JSON.stringify(SLAMS), /\$WARM|photons|extrocco|guido/i, 'no $WARM on the freeze and no name of a person');
  assert.ok(SLAMS[0].at < SLAMS[1].at, 'in turn: the rebate the second hit'); assert.equal(SLAMS[1].sfx, 'ドン'); assert.equal(SLAMS[0].sfx, undefined);
  for (const s of SLAMS) assert.equal(s.rank, undefined, `${s.name}: no style-meter rank, it named the seats`);
  assert.doesNotMatch(JSON.stringify(SLAMS), /bronze|gold|\$10\b|\$1,000/i, 'no Bronze, no Gold, no seat\'s price');
  // the names' widths in ems as the page renders them (Gelasio 700 with its skew and stroke, measured in the page: THE FIRST TRACENET 12.51, NOW LIVE 5.97), and the plate's padding
  assert.ok(SLAMS[0].ems >= 12.51 + .6 && SLAMS[1].ems >= 5.97 + .6);
  assert.ok(SLAMS[0].px[0] * SLAMS[0].ems <= 360 - 24, 'the long name fits a 360 px phone at its least size');
  assert.equal(BELOW, FILM, 'THE WAY DOWN IS HIS FILM: the press carries the page down to his governance film, nothing before it');
  const router = readFileSync(new URL('./dl-space-router.js', import.meta.url), 'utf8');
  assert.match(router, /const press = \(\) => \{ S\.skipped = false; return S\.film === 'seen' \? toTrail\(\) : toMint\(\); \};/, 'one press: the mint first (MINT YOUR HEXAGON), then the first tracenet');
  assert.match(router, /const toTrail = \(\) => \{ call\(\); win\.open\?\.\(TRACENET, '_blank', 'noopener'\); \};/, 'the first tracenet in its own tab, the freeze behind it');
  assert.equal(TRACENET, './tracenet.html?of=photons_enjoyor', 'the first tracenet as the tracenet page addresses it (tracenet.js handleOf)');
  assert.doesNotMatch(router, /import\(|dl-campaign/, 'nothing plays over the freeze (his "why the fuck u added a video there dude?")');
  assert.deepEqual(CRY, ['FOLLOW THE', 'TRAIL'], 'his call to arms\'s grammar, the first tracenet\'s');
  assert.equal(FLASK_OF_SPHERE, MINT_WINDOW.star, 'the way down stands under the flask the sphere draws');
});

// A bare document: enough of the DOM for the scene (elements with children, classes, datasets, styles, listeners), and the stage's canvas with its box.
function bareDocument() {
  const listeners = new Map(), canvas = { rect: { left: 0, top: 91, width: 1440, height: 900 }, getBoundingClientRect() { return { ...this.rect }; } };
  const kit = { scrolled: [], height: 620, scrollIntoView(o) { this.scrolled.push(o); }, getBoundingClientRect() { return { top: 1900, height: this.height }; } };   // the starter kit
  const below = { scrolled: [], scrollIntoView(o) { this.scrolled.push(o); } };   // his governance film, below (THE WAY DOWN IS HIS FILM)
  const node = (tag) => {
    const el = { tagName: tag.toUpperCase(), children: [], dataset: {}, style: {}, className: '', textContent: '', hidden: false, attrs: {}, listeners: new Map(),
      append(...kids) { for (const k of kids) { if (typeof k === 'string') el.textContent += k; else { k.parent = el; el.children.push(k); } } },
      remove() { if (el.parent) el.parent.children = el.parent.children.filter((c) => c !== el); },
      setAttribute(k, v) { el.attrs[k] = v; }, addEventListener(t, f) { el.listeners.set(t, f); },
      getBoundingClientRect: () => ({ left: 0, top: 0, width: 0, height: 0, right: 0, bottom: 0 }),
      get classList() { const has = () => el.className.split(' ').filter(Boolean); return { add: (c) => { if (!has().includes(c)) el.className = [...has(), c].join(' '); }, remove: (c) => { el.className = has().filter((x) => x !== c).join(' '); },
        toggle: (c, on) => { el.className = [...has().filter((x) => x !== c), ...(on ? [c] : [])].join(' '); } }; } };
    el.style.setProperty = (k, v) => { el.style[k] = v; };
    return el;
  };
  const head = node('head'), body = node('body'), html = node('html'); html.dataset = {};
  const doc = { head, body, documentElement: html, createElement: node,
    querySelector: (q) => (q === '#sphere-stage canvas' ? canvas : q === '#refuel' ? kit : q === BELOW ? below : null),
    addEventListener: (t, f) => listeners.set(t, f), dispatch: (t, detail) => listeners.get(t)?.({ detail }) };
  return { doc, canvas, kit, below };
}
const text = (el) => [el.textContent, ...el.children.filter((c) => !c.hidden).map(text)].join(' ');

test('the scene on a bare document: nothing before she lands; then the hit, the rebate framing the flask and no sentence in sight; each name and the way down one press, down to his film; it rides with the hero; her making holds it; the handoff\'s road left alone; no read at all', () => {
  const { doc, canvas, kit, below } = bareDocument(), resize = new Set(), scroll = new Set(), opened = [];
  const win = { location: { search: '' }, innerWidth: 1440, innerHeight: 900, genesisSphere: { getViewState: () => ({ radius: .32 }) },
    localStorage: { getItem: (k) => (k === FILM_SEEN_KEY ? '1' : null), setItem() {} },   // the second state: the film seen (THE PROFESSOR SENDS YOU TO THE FILM FIRST), her empty tank already shown
    fetch: () => { throw new Error('the scene reads nothing'); }, open: (...a) => opened.push(a),
    addEventListener: (t, f) => { ({ resize, scroll })[t]?.add(f); }, removeEventListener: (t, f) => { ({ resize, scroll })[t]?.delete(f); },
    requestAnimationFrame: (f) => f() };
  const scene = mountRouter({ win, doc });
  assert.equal(doc.body.children.length, 0, 'nothing on the page before she lands');
  assert.equal(doc.documentElement.dataset.onTrack, undefined, 'a visitor who has seen the film is never held (ON TRACK)');
  doc.dispatch(SEEN_EVENT, { type: 'entering' }); assert.equal(scene.state().open, false);
  doc.dispatch(SEEN_EVENT, { type: 'landed' }); doc.dispatch(SEEN_EVENT, { type: 'made' }); assert.equal(scene.state().open, false, 'NO VISITOR SEES THE OLD FREEZE (his Nov 25 2026 "if a user sees this shit?!!?"): her landing and her making open nothing'); scene.open();
  assert.equal(scene.state().open, true); assert.equal(doc.documentElement.dataset.spaceRouter, 'open');
  const layer = doc.body.children[0];
  assert.ok(layer.className.split(' ').includes('on'), 'the hit: the white, the lines, the slashes');
  assert.deepEqual(layer.children.map((c) => c.className), ['dl-router-vig', 'dl-router-white', 'dl-router-lines', 'dl-router-plate router', 'dl-router-plate warm', 'dl-router-down', 'dl-router-her', 'dl-router-close'],
    'the hit, the two names, the way down, her, the close: no card, no month, no subscriber');
  const [, , , router, warm, down, her] = layer.children;
  assert.match(her.src, /\/assets\/athena-offer\.png$/, 'she holds the egg out');
  assert.deepEqual([router, warm].map((p) => [p.tagName, p.dataset.slam, p.attrs['aria-label']]), [['BUTTON', 'router', 'THE FIRST TRACENET, PROJECT SNOWTRACE'], ['BUTTON', 'warm', 'NOW LIVE, OPEN SOURCE, TRACED']], 'each name is the press');
  assert.deepEqual(text(layer).split(/\s+/).filter(Boolean), ['THE', 'FIRST', 'TRACENET', 'PROJECT', 'SNOWTRACE', 'NOW', 'LIVE', 'OPEN', 'SOURCE,', 'TRACED', 'ドン', 'FOLLOW', 'THE', 'TRAIL', '×'],
    'in sight: the mining, ドン, his call to arms and the close; not one word that explains, no seat and no price');
  assert.deepEqual(down.children.map((c) => [c.className, c.children.length]), [['cry', 2], ['chevrons', 3]], 'the call to arms over three chevrons');
  // the frame: the light on the sphere, the names in the dark around it, never over it
  assert.deepEqual(['--fx', '--fy', '--fr'].map((k) => layer.style[k]), ['720px', '541px', '288px'], 'the light at the sphere\'s centre and radius (sphere-centre.mjs, its view state)');
  const side = 720 - 288 * 1.08, shoulder = `${Math.round(541 - 288 * .45)}px`;
  assert.deepEqual([router.style.left, router.style.width, warm.style.left, warm.style.width], ['0px', `${Math.round(side)}px`, `${Math.round(1440 - side)}px`, `${Math.round(side)}px`], 'a wide screen: the flask between the dollar and the rebate');
  assert.deepEqual([router.style.top, warm.style.top], [shoulder, shoulder], 'at its shoulders');
  assert.deepEqual([router.dataset.toward, warm.dataset.toward], ['right', 'left'], 'each slash from its own edge, toward the flask');
  // THE BANDS RUN UNDER THEIR NAMES: the skew about the band's middle (no transform-origin on an edge), the wipe from its edge a clip
  const css = readFileSync(new URL('./dl-space-router.js', import.meta.url), 'utf8');
  assert.match(css, /\.dl-router-plate \.slash\{[^}]*transform:translateY\(-50%\) skewY\(-4deg\);clip-path:var\(--wipe,inset\(0 100% 0 0\)\)/);
  assert.match(css, /\.dl-router-plate\[data-toward="left"\] \.slash\{--wipe:inset\(0 0 0 100%\)\}/);
  assert.doesNotMatch(css, /\.slash\{[^}]*transform-origin/, 'a band skewed on its edge crosses its name tan 4° x w/2 too high');
  assert.ok(parseFloat(warm.style['--ns']) > parseFloat(router.style['--ns']), 'the rebate the louder');
  SLAMS.forEach((s, i) => assert.ok(parseFloat([router, warm][i].style['--ns']) * s.ems <= side, `${s.name} fits its side of the flask`));
  assert.equal(down.style.left, '720px', 'the way down under the flask'); assert.equal(down.style.bottom, 'auto');
  assert.ok(!down.className.split(' ').includes('stack'), 'under the flask the call stands in one line');
  // THE FREEZE READS AS ONE PICTURE (his Oct 30 2026 06:39:47 UTC, "can you please focus on the aesthetics of this?"): the page's own header and buttons step out of it
  assert.match(doc.head.children[0].textContent, /html\[data-space-router\] \.hero-copy,html\[data-space-router\] \.dl-twelve-skip,html\[data-space-router\] \.ds-invite\{visibility:hidden\}/,
    'no word of the page under the freeze: the header, the skip and the invite step out while it stands');
  assert.ok(parseFloat(down.style.top) >= 541 + 288 * FLASK_OF_SPHERE, 'never over the flask: the liquor rises from its bottom');
  assert.ok(parseFloat(down.style.top) + parseFloat(down.style['--cs']) * 3.7 <= 900 - 44, 'and above the film\'s own row');
  // the hero scrolled: the scene rides up with it and fades, gone after four tenths of a screen, back with the hero
  assert.equal(scroll.size, 1);
  const rideTo = (y) => { win.scrollY = y; for (const f of scroll) f(); return [layer.style.transform, layer.style.opacity, layer.className.split(' ').includes('away')]; };
  assert.deepEqual(rideTo(180), ['translateY(-180px)', '0.5', false]); assert.deepEqual(rideTo(400), ['translateY(-400px)', '0', true]); assert.deepEqual(rideTo(0), ['', '', false]);
  // the presses (THE FIRST TRACENET): once his film is seen, each name and the call are one press, the first tracenet in its own tab; the scene stays, to ride away with the hero
  router.listeners.get('click')(); warm.listeners.get('click')(); down.listeners.get('click')();
  assert.deepEqual(opened, Array(3).fill([TRACENET, '_blank', 'noopener']), 'each name and the call open the first tracenet'); assert.equal(below.scrolled.length, 0, 'the page stays at the freeze');
  assert.equal(kit.scrolled.length, 0, 'never the struck tank');
  assert.equal(scene.state().open, true);
  // a tall screen: one over the other, above the flask, the rebate the nearer, each fitting the screen
  Object.assign(win, { innerWidth: 375, innerHeight: 812 }); Object.assign(canvas.rect, { top: 90, width: 375, height: 812 });
  assert.equal(resize.size, 1, 'it follows the screen while it is open'); for (const f of resize) f();
  const fy = 90 + 812 / 2, fr = 375 * .32;
  assert.deepEqual([router.style.left, router.style.width, warm.style.left, warm.style.width], ['0px', '375px', '0px', '375px'], 'a tall screen: one over the other');
  assert.ok(parseFloat(router.style.top) < parseFloat(warm.style.top) && parseFloat(warm.style.top) < fy - fr * 1.25, 'above the flask, the rebate the nearer');
  SLAMS.forEach((s, i) => assert.ok(parseFloat([router, warm][i].style['--ns']) * s.ems <= 375, `${s.name} and its stamp fit the screen`));
  // THE FREEZE READS AS ONE PICTURE: one over the other they are one title, the rebate under the router at one gap, clear of the close
  const ns = [router, warm].map((p) => parseFloat(p.style['--ns'])), tall = ns.map((n) => n * 1.17 + Math.max(15, n * .25) * 1.2 + n * .28);
  const gapSeen = (parseFloat(warm.style.top) - tall[1] / 2) - (parseFloat(router.style.top) + tall[0] / 2);
  assert.ok(Math.abs(gapSeen - Math.max(14, ns[1] * .3)) <= 1, `the rebate under the router at one gap (${gapSeen.toFixed(1)} px)`);
  assert.ok(parseFloat(router.style.top) - tall[0] / 2 >= TOP_CLEAR - 1, 'the title clear of the close');
  her.getBoundingClientRect = () => ({ left: 139, top: 572, width: 236, height: 240, right: 375, bottom: 812 }); for (const f of resize) f();
  assert.deepEqual([down.style.left, down.style['--room'], down.style.top, down.style.bottom], ['70px', '123px', '', ''], 'where she stands under the flask: the floor left of her, at the bottom');
  assert.ok(down.className.split(' ').includes('stack'), 'in the floor left of her the call stands in two tiers, FOLLOW THE over TRAIL');
  assert.equal(down.style['--cs'], `${Math.round(Math.max(17, Math.min(46, 123 / STACK_EMS, ns[1] * CRY_OF_WARM)))}px`, 'as large as the floor left of her holds, never louder than the rebate');
  // his preview pane (673 x 873): the dark above the flask is too low for both at their size; each a little smaller, never over the flask nor over each other
  Object.assign(win, { innerWidth: 673, innerHeight: 873 }); Object.assign(canvas.rect, { top: 90, width: 673, height: 873 }); for (const f of resize) f();
  const room = Math.max(180, (90 + 873 / 2) - 673 * .32 * 1.25), ns2 = [router, warm].map((p) => parseFloat(p.style['--ns'])), tall2 = ns2.map((n) => n * 1.17 + Math.max(15, n * .25) * 1.2 + n * .28);
  assert.ok(parseFloat(router.style.top) + tall2[0] / 2 <= parseFloat(warm.style.top) - tall2[1] / 2, 'the router\'s stamp clear of the rebate\'s slash');
  assert.ok(parseFloat(warm.style.top) + tall2[1] / 2 <= room + 4, `the pair never over the flask (${(parseFloat(warm.style.top) + tall2[1] / 2).toFixed(1)} of ${room.toFixed(1)} px)`);
  assert.ok(ns2[1] > ns2[0], 'the rebate still the louder');
  assert.ok(parseFloat(down.style['--cs']) <= ns2[1] * CRY_OF_WARM + .5, 'the call never louder than the rebate');
  // the close: gone, and it stops following the screen; she lands again: the rebate again
  layer.children.at(-1).listeners.get('click')();
  assert.equal(scene.state().open, false); assert.equal(doc.body.children.length, 0); assert.deepEqual([resize.size, scroll.size], [0, 0]); assert.equal(doc.documentElement.dataset.spaceRouter, undefined);
  doc.dispatch(SEEN_EVENT, { type: 'landed' }); assert.equal(scene.state().open, false, 'she lands again: nothing opens'); scene.close();
  // HER COLOURS ON THE MINT: while her making holds the landing, the rebate waits for her to be made; THE EGG WAITS FOR THE MINT: a landing with no egg makes none
  doc.documentElement.dataset.herMaking = 'waiting'; doc.dispatch(SEEN_EVENT, { type: 'landed' }); assert.equal(scene.state().open, false, 'no egg given: still nothing'); scene.close();
  doc.dispatch(SEEN_EVENT, { type: 'landed', egg: 'seated' }); assert.equal(scene.state().open, false, 'her making holds the landing');
  doc.dispatch(SEEN_EVENT, { type: 'made' }); assert.equal(scene.state().open, false, 'made: nothing slams in'); scene.open();
  assert.equal(doc.body.children[0].children.find((c) => c.className === 'dl-router-her').hidden, false, 'she never let her egg fall: she holds it out'); scene.close(); scene.open(); doc.dispatch(SEEN_EVENT, { type: 'given' }); assert.deepEqual([scene.state().open, scene.state().given], [false, true], 'the flask made while it stands: the freeze gives way'); doc.dispatch(SEEN_EVENT, { type: 'made' }); assert.equal(scene.state().open, false); scene.close();   // SHE HANDS BACK TO THE FLASK: the flask made while the freeze stands: it gives way to her making, and is back when she is made
  // THE FREEZE AS HE KEEPS IT (his Oct 30 2026 ~13:1x UTC, over his phone's freeze of 08:52: "why the fuck have you changed it? it was perfect before"): her egg
  // given (THE ROAD IS ONE TAKE) or not, the freeze stands as in that picture, Nefertiti at its corner holding the egg out, nothing in her place
  doc.dispatch(SEEN_EVENT, { type: 'landed', egg: 'given' }); assert.equal(scene.state().open, false, 'her making holds it');
  doc.dispatch(SEEN_EVENT, { type: 'made' }); assert.equal(scene.state().open, false); scene.open();
  const kept = doc.body.children[0].children.find((c) => c.className === 'dl-router-her');
  assert.equal(kept.hidden, false, 'she holds the egg out, as in his picture'); assert.match(kept.src, /athena-offer\.png$/, 'Nefertiti\'s own offer pose, never another picture'); scene.close();
  assert.equal(mountRouter({ win: { ...win, location: { search: '?handoff=lan' } }, doc }), null, 'the rite\'s road keeps its place');
});

// THE PROFESSOR SENDS YOU TO THE FILM FIRST (his Oct 30 2026 15:29:23 UTC "...kinda like pokemon with grass and the first town professor forces you to do shit
// first... guided down to the video of the governance and then coming back up to join by topping up"; 15:23 "...the 2nd video is introduced but also this one
// skippable like the first one"): the first visit's call goes to his film; its end brings the page back up to FOLLOW THE TRAIL (THE FIRST TRACENET); coming back up yourself is the skip
test('MINT YOUR HEXAGON: a first visit\'s one call is the mint, its press the deposit door; a filled flask brings FOLLOW THE TRAIL, out to the first tracenet, kept for the next visit', () => {
  const run = () => {
    const { doc, kit, below } = bareDocument(), scroll = new Set(), store = new Map(), film = { dataset: {}, scrolled: [], scrollIntoView(o) { this.scrolled.push(o); } }, ups = [], tops = [], opens = [], door = { clicks: 0, click() { this.clicks++; } };
    const q = doc.querySelector; doc.querySelector = (s) => (s === FILM ? film : s === COUNT.door ? door : q(s));
    const listeners = new Map(), add = doc.addEventListener; doc.addEventListener = (t, f) => { add(t, f); listeners.set(t, f); };
    const win = { location: { search: '' }, innerWidth: 1440, innerHeight: 900, scrollY: 0, genesisSphere: { getViewState: () => ({ radius: .32 }) },
      localStorage: { getItem: (k) => store.get(k) ?? null, setItem: (k, v) => store.set(k, v) }, scrollTo: (o, y) => (typeof o === 'object' ? ups.push(o) : tops.push([o, y])),
      addEventListener: (t, f) => { if (t === 'scroll') scroll.add(f); }, removeEventListener: (t, f) => { scroll.delete(f); }, requestAnimationFrame: (f) => f(), open: (...a) => opens.push(a) };
    const scene = mountRouter({ win, doc }); scene.open();
    const down = doc.body.children[0].children.find((c) => c.className.includes('dl-router-down'));
    const close = doc.body.children[0].children.find((c) => c.className === 'dl-router-close');
    return { doc, kit, below, film, door, ups, tops, opens, close, win, scroll, store, scene, down, listeners, cry: () => text(down).split(/\s+/).filter(Boolean) };
  };
  const MINT = ['MINT', 'YOUR', 'HEXAGON'];
  assert.deepEqual(FIRST_CRY, ['MINT YOUR', 'HEXAGON']); assert.equal(FILM, '#purpose'); assert.equal(FILM_DONE, 'galaxy-completed'); assert.equal(FILM_SEEN_KEY, 'dl.egg.minted', 'the second state is the minted visitor\'s, never a film once watched');
  let r = run();
  assert.deepEqual(r.cry(), MINT, 'a first visit: the one call is the mint'); assert.equal(r.down.dataset.film, 'first');
  // ON TRACK (his Oct 30 2026 "...i dont want people able to get out of track"): held at the top, no ×, until the call is pressed
  assert.equal(r.doc.documentElement.dataset.onTrack, '', 'the page does not scroll'); assert.deepEqual(r.tops, [[0, 0]], 'put back to the top');
  assert.equal(r.win.history?.scrollRestoration ?? 'manual', 'manual'); assert.equal(r.close.hidden, true, 'no way out of the freeze but the call');
  r.down.listeners.get('click')(); assert.equal(r.door.clicks, 1, 'its press is the page\'s deposit door'); assert.equal(r.film.scrolled.length + r.kit.scrolled.length + r.below.scrolled.length, 0, 'never down to his film, nor below');
  assert.equal(r.doc.documentElement.dataset.onTrack, undefined, 'the call lets the page go'); assert.equal(r.close.hidden, false); assert.deepEqual(r.cry(), MINT, 'pressed, it stays the mint until the flask is filled');
  r.listeners.get(FILM_DONE)(); assert.deepEqual(r.cry(), MINT, 'his film seen changes nothing of the call'); assert.deepEqual(r.ups, [{ top: 0, behavior: 'smooth' }], 'its end brings the page back up to the freeze'); assert.equal(r.store.get(FILM_SEEN_KEY), undefined);
  r.listeners.get('dl-tank-filled')();
  assert.deepEqual(r.cry(), ['FOLLOW', 'THE', 'TRAIL'], 'the flask filled: the call to the first tracenet'); assert.ok(r.down.className.includes('again'), 'slammed in again'); assert.equal(r.store.get(FILM_SEEN_KEY), '1', 'kept for the next visit');
  r.down.listeners.get('click')(); assert.deepEqual(r.opens, [[TRACENET, '_blank', 'noopener']], 'FOLLOW THE TRAIL opens the first tracenet in its own tab'); assert.equal(r.door.clicks, 1, 'never the door again');
  assert.equal(r.kit.scrolled.length, 0, 'never the struck tank');
  // before the mint the names are the call's press too
  r = run(); r.doc.body.children[0].children.find((c) => c.className === 'dl-router-plate router').listeners.get('click')();
  assert.equal(r.door.clicks, 1, 'THE FIRST TRACENET, before the mint: the mint'); assert.equal(r.film.scrolled.length + r.below.scrolled.length, 0, 'nowhere below');
  // a scroll down and back never changes the call
  r = run(); r.down.listeners.get('click')(); r.win.scrollY = 900; r.scroll.forEach((f) => f()); r.win.scrollY = 0; r.scroll.forEach((f) => f());
  assert.deepEqual(r.cry(), MINT, 'only a filled flask changes the call');
});

// THE SECOND SKIP (his Oct 30 2026 "add a second skip to the second video as well"; then "of course the 2nd video's skip must be different... it must be
// pointing to the end of the second video"): the first film's pill on his governance film, asked first; its Skip lands the film FILM_SKIP_BEFORE_S before its
// end and plays into it, and the film's own end brings the page up
test('the second skip: the first film\'s pill over his film, asked first; her Skip puts the film near its end, and its end brings FOLLOW THE TRAIL', () => {
  assert.equal(FILM_SKIP, 'Skip to the trail \u203a', 'where its end lands: the first tracenet\'s call (THE FIRST TRACENET)');
  assert.equal(FILM_S, Number(readFileSync(new URL('./warm-galaxy-player.js', import.meta.url), 'utf8').match(/JOURNEY_SECONDS = (\d+)/)[1]), 'the film\'s own length');
  assert.equal(FILM_SKIP_BEFORE_S, 3, 'as the first skip lands before its stop (dl-twelve.js SKIP_BEFORE_S)');
  const run = (answered, video, seenBefore = false) => {
    const { doc } = bareDocument(), asked = [], ups = [], tops = [], theater = { children: [], append(...k) { this.children.push(...k); } }, listeners = new Map();
    const q = doc.querySelector; doc.querySelector = (s) => (s === `${FILM} .galaxy-theater` ? theater : s === `${FILM} [data-galaxy-video]` ? video : q(s));
    const add = doc.addEventListener; doc.addEventListener = (ty, f) => { add(ty, f); listeners.set(ty, f); };
    doc.dispatchEvent = (e) => { asked.push(e); return !answered; };   // her question answers it (preventDefault) or no one does
    const win = { location: { search: '' }, innerWidth: 1440, innerHeight: 900, scrollY: 0, genesisSphere: { getViewState: () => ({ radius: .32 }) },
      localStorage: { getItem: (k) => (seenBefore && k === FILM_SEEN_KEY ? '1' : null), setItem() {} }, scrollTo: (o, y) => (typeof o === 'object' ? ups.push(o) : tops.push([o, y])),
      CustomEvent: class { constructor(type, init) { Object.assign(this, { type }, init); } }, addEventListener() {}, removeEventListener() {}, requestAnimationFrame: (f) => f() };
    mountRouter({ win, doc }).open();
    const skip = theater.children[0], down = doc.body.children[0].children.find((c) => c.className.includes('dl-router-down'));
    return { skip, down, asked, ups, listeners };
  };
  const film = () => ({ readyState: 1, duration: 50.9, currentTime: 12, paused: false, seekable: { length: 1, start: () => 0, end: () => 50.9 } });
  let v = film(), r = run(true, v);
  assert.equal(r.skip.className, 'dl-film-skip'); assert.equal(r.skip.textContent, FILM_SKIP); assert.equal(r.skip.hidden, false, 'over his film');
  r.skip.listeners.get('click')();
  assert.equal(r.asked[0].type, 'dl-athena-ask', 'asked first'); assert.equal(v.currentTime, 12, 'nothing moves before her Skip');
  r.asked[0].detail.go();
  assert.equal(v.currentTime, 50.9 - FILM_SKIP_BEFORE_S, 'to the film\'s end, played into'); assert.equal(r.skip.hidden, true, 'gone once pressed');
  assert.equal(r.ups.length, 0, 'the page stays at the film while its end plays');
  r.listeners.get(FILM_DONE)(); assert.ok(text(r.down).includes('HEXAGON'), 'its end changes nothing of the call'); assert.deepEqual(r.ups, [{ top: 0, behavior: 'smooth' }], 'back up to the freeze');
  v = film(); v.currentTime = 49.5; r = run(false, v); r.skip.listeners.get('click')(); assert.equal(v.currentTime, 49.5, 'a page without her skips at once; never back from where the film already is');
  // THE SECOND SKIP IS THERE EVERY TIME (his Oct 30 2026, over his film with no pill on it: "u removed the skip for the 2nd video diocane?"): seen before or not, the
  // skip stands over his film; once pressed it is gone until the press takes the page down again; its end brings FOLLOW THE TRAIL back up
  v = film(); r = run(true, v, true); assert.equal(r.skip.hidden, false, 'seen before: the skip still over his film');
  r.skip.listeners.get('click')(); r.asked[0].detail.go(); assert.equal(r.skip.hidden, true, 'pressed: gone');
  r.listeners.get(FILM_DONE)(); assert.deepEqual(r.ups, [{ top: 0, behavior: 'smooth' }], 'seen before too: its end brings FOLLOW THE TRAIL back up');
  r.down.listeners.get('click')(); assert.equal(r.skip.hidden, false, 'down again: the skip is back');
});

