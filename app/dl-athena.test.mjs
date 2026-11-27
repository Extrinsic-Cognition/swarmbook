// dl-athena.test.mjs: ATHENA ON THE ORIGINAL LYSSAJUDRON, OVER THE WHOLE PAGE (his Oct 21 2026 21:3x WEST: "i want an overlay as a z index above
// everything else on the page... this has to follow the mouse around and stop at topics with like "got questions" or idk... we can use floatign athena on
// the original lyssajudron"). node --test dl-athena.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {LAYER_Z, FOLLOW, DOCK, BUBBLE, ENGINE, ATHENA, TOPICS, GRACE_MS, DWELL_MS, SWITCH_MS, FREEZE_S, ARRIVE_S, PRELOAD_S, CARD, SPRITES, ENTRANCE, STORY, SHOWS, SKIP_EVENT, ASK, ASK_EVENT, READ_ON, EGG, ATHENA_POSE, DROP, TELEPORT, SUBTITLE, standsFor, turnOf, SEEN_EVENT, followStep, besidePointer,
  dockOf, bubbleAt, topicOf, figureOptions, engineOf, heldOf, willHold, arrivalAt} from './dl-athena.js';
import {DRAWN_FRAME, FRAME_S} from './dl-paywall.js';
import {DEPTH, SWARMY, COUNT, countPlates, lookOf, depthOf, lookStep, SPACE, spaceStep} from './dl-athena.mjs';
import {TOLD_MAX} from './dl-athena.js';
import {pageFiles} from '../tools/page-files.mjs';

const here = (p) => new URL(p, import.meta.url);
const view = {w: 1280, h: 800}, box = {w: 150, h: 188};
const inside = ([x, y], b = box) => x >= FOLLOW.margin && y >= FOLLOW.margin && x + b.w <= view.w - FOLLOW.margin && y + b.h <= view.h - FOLLOW.margin;

test('she follows on a critically damped spring: never past the pointer from rest, settled in two seconds, the same path at any frame rate', () => {
  let x = 0, v = 0, last = 0;
  for (let i = 0; i < 120; i++) { [x, v] = followStep(x, v, 100, 1 / 60); assert.ok(x >= last - 1e-9 && x <= 100 + 1e-9); last = x; }
  assert.ok(Math.abs(x - 100) < FOLLOW.settle_px && Math.abs(v) < FOLLOW.settle_v);
  const [a] = followStep(...followStep(0, 0, 100, 0.05), 100, 0.05), [b] = followStep(0, 0, 100, 0.1);
  assert.ok(Math.abs(a - b) < 1e-9, 'two half steps are one step');
});

test('beside the pointer: to its lower right, on the other side at an edge, always inside the screen', () => {
  assert.deepEqual(besidePointer([400, 300], box, view), [400 + FOLLOW.dx, 300 + FOLLOW.dy]); assert.deepEqual(besidePointer([1250, 300], box, view), [1250 - FOLLOW.dx - box.w, 300 + FOLLOW.dy]); assert.deepEqual(besidePointer([400, 790], box, view), [400 + FOLLOW.dx, 790 - FOLLOW.dy - box.h]);
  for (let i = 0; i < 200; i++) assert.ok(inside(besidePointer([(i * 97) % view.w, (i * 61) % view.h], box, view)));
});

test('she stops at a topic: perched on its top right corner, else at its right edge level with the pointer; the stop in the corner over the film\'s buttons', () => {
  assert.deepEqual(dockOf({left: 400, right: 700, top: 400, bottom: 700}, 500, box, view), [700 - box.w * 0.6, 400 - box.h + DOCK.sink]); assert.deepEqual(dockOf({left: 400, right: 700, top: 100, bottom: 700}, 300, box, view), [700 + DOCK.gap, 300 - box.h / 2], 'no room over it: outside its right edge'); assert.equal(dockOf({left: 900, right: 1200, top: 100, bottom: 700}, 300, box, view)[0], 1200 - box.w - DOCK.gap, 'no room outside: just inside');
  const corner = dockOf(null, 0, box, view, true);
  assert.deepEqual(corner, [view.w - box.w - DOCK.corner[0], view.h - box.h - DOCK.corner[1]]); assert.ok(corner[1] + box.h <= view.h - 60, 'over the film\'s Sound and Pause, which stand 16 px off the bottom, 44 px tall');
  for (const rect of [{left: -50, right: 2000, top: -900, bottom: 3000}, {left: 0, right: 40, top: 790, bottom: 900}]) assert.ok(inside(dockOf(rect, 400, box, view)));
});

test('her bubble leaves her topic uncovered when the screen has room for it, and stays under his circle at the stop', () => {
  const size = {w: BUBBLE.w, h: 120};
  assert.deepEqual(bubbleAt([100, 100], box, size, view), [100 + box.w + BUBBLE.gap, 108]);
  const topic = {left: 760, right: 1100, top: 250, bottom: 600};
  assert.deepEqual(bubbleAt([600, 300], box, size, view, false, topic), [600 - BUBBLE.gap - size.w, 308], 'the topic on her right: her left');
  const phone = {w: 375, h: 812}, [px, py] = dockOf(null, 0, box, phone, true);
  assert.deepEqual(bubbleAt([px, py], box, size, phone, true), [phone.w - size.w - FOLLOW.margin, py - BUBBLE.gap - size.h], 'a phone: over her, inside the screen');
  const [x, y] = dockOf(null, 0, box, view, true);
  assert.deepEqual(bubbleAt([x, y], box, size, view, true, {left: 0, right: view.w, top: 0, bottom: view.h}), [x - BUBBLE.gap - size.w, y + box.h - size.h]);
});

test('the topics are the page\'s own: narrowest first, each found on the page, the stop only while the wall holds the film', () => {
  const el = (within) => ({closest: (sel) => (within.includes(sel) ? {sel} : null)});
  assert.equal(topicOf(el(['.snowtrace-kit', '#oath-sphere']))?.topic.id, 'kit', 'the starter kit is hers to name, before the stop'); assert.equal(topicOf(el([])), null); assert.equal(topicOf(null), null);
  const page = readFileSync(here('./warm.html'), 'utf8');
  for (const t of TOPICS) for (const name of t.sel.match(/[.#][\w-]+/g)) assert.ok(page.includes(name.slice(1)), `${t.id}: ${name} on the page`);
  const stop = TOPICS.find((t) => t.id === 'stop');
  assert.equal(stop.corner, true); assert.equal(stop.when({held: false}), false); assert.equal(stop.when({held: true}), true); assert.equal(heldOf({dlTwelve: {state: () => ({paywall: {state: 'held'}})}}), true); assert.equal(heldOf({}), false);
});

test('her topics say the page as it shows (lane/stake-dont-spend: the mint line hidden, the free way "Not staking"): never a hidden line, the free way\'s own question', () => {
  const el = (text, {hidden = false, kids = {}} = {}) => ({textContent: text, closest: (q) => (q === '[hidden]' && hidden ? {} : null), querySelector: (q) => kids[q] ?? null, querySelectorAll: (q) => kids[q] ?? []});
  const kit = el('', {kids: {h3: el('Enter the MMO.'), '.snowtrace-tier-title span': el('Stake SOL'), ':scope > p': el('Keep your SOL. Its rewards fuel the swarm.'), li: [], '.snowtrace-kit-state': el('Paused')}});
  const page = ({hidden, not}) => ({defaultView: {}, querySelector: (q) => ({'.snowtrace-kit': kit, '[data-mint-line]': el('$WARM \u00b7 2 days left', {hidden}),
    '[data-paywall-not]': el(not), '.snowtrace-free > span': el('The code is free on day 15, without fuel.')})[q] ?? null});
  const stop = TOPICS.find((t) => t.id === 'stop'), free = TOPICS.find((t) => t.id === 'free');
  assert.equal(stop.say(page({hidden: false, not: 'Not mint \u00b7 wait for the free release \u2192'})).line, '$WARM \u00b7 2 days left', 'the window\'s line, shown (lane/clear-the-mint: $WARM\'s days, never the mint\'s)'); assert.equal(stop.say(page({hidden: true, not: 'Not staking \u00b7 wait for the free release \u2192'})).line, 'Keep your SOL. Its rewards fuel the swarm.', 'staking only: the hidden line unsaid, the kit\'s own'); assert.equal(free.say(page({hidden: false, not: 'Not mint \u00b7 wait for the free release \u2192'})).line, 'Not mint? The code is free on day 15, without fuel.');
  assert.equal(free.say(page({hidden: true, not: 'Not staking \u00b7 wait for the free release \u2192'})).line, 'Not staking? The code is free on day 15, without fuel.');
});

test('THE GUIDE IS YOUR SWARMY (his Oct 30 2026 ~12:1x UTC: "replace the floating nefertiti in the webpage with the lyssajudron just created and we use that for the guide vs anything else? that lyssajudron could explain the 2nd video etc..."): her making\'s picture is the guide\'s figure, Nefertiti never comes back, and the guide says the governance film\'s own words beside it', () => {
  const src = readFileSync(here('./dl-athena.js'), 'utf8'), layer = readFileSync(here('./dl-athena-layer.mjs'), 'utf8'), router = readFileSync(here('./dl-space-router.js'), 'utf8');
  const her = readFileSync(here('./dl-her-colours.js'), 'utf8'), page = readFileSync(here('./warm.html'), 'utf8');
  // where the page holds her picture and her making, as dl-her-colours.js names them
  assert.equal(her.match(/export const KIT_HER = '([^']+)'/)[1], SWARMY.img, 'the kit\'s picture of her (KIT_HER)'); assert.match(her, /\.dl-her\{position:fixed/); assert.match(her, /el\.classList\.add\('on'\)/); assert.equal(SWARMY.making, '.dl-her.on'); assert.match(page, /<img data-kit-her alt="" hidden>/, 'the kit\'s slot for her picture, hidden until she is made');
  // NOTHING FLOATS AFTER HER MAKING (his Oct 30 2026 "...you just resort to floating over here?..."; "who cares about the lyssajudron"): no second guide, her
  // picture's load is only the cause of Nefertiti's leaving
  assert.doesNotMatch(src, /G = mountLayer/, 'no Swarmy guide'); assert.match(src, /const guide = \(\) => L;/, 'Nefertiti\'s layer the one guide'); assert.match(layer, /her\.src = sprite;\n\s+if \(smooth\) fig\.classList\.add\('dl-athena-smooth'\);/); assert.match(layer, /\.dl-athena-smooth img\{image-rendering:auto;-webkit-mask-image:none;mask-image:none;\n\s+filter:drop-shadow\(0 0 1px rgb\(12 10 8 \/ \.6\)\) drop-shadow\(0 6px 12px rgb\(12 10 8 \/ \.42\)\) drop-shadow\(0 0 26px rgb\(12 10 8 \/ \.3\)\)\}/, 'THE SWARMY CASTS A SHADOW: her outline, her fall and a wide halo');
  assert.match(layer, /const h = Math\.round\(side \* share\), w = Math\.round\(h \* aspect\[0\] \/ aspect\[1\]\)/); assert.match(layer, /const on = !!doc\.querySelector\('dialog\[open\]'\) \|\| \(!!modal && !!doc\.querySelector\(modal\)\);/);
  // her picture is the cause; Nefertiti is never cut short, and once she is gone she does not come back
  assert.match(src, /kitHer\?\.addEventListener\('load', \(\) => \{\n\s+const src = kitHer\.currentSrc \|\| kitHer\.src;\n\s+if \(!kitHer\.hidden && \/\^\(blob\|data\):\/\.test\(src\)\) \{ S\.swarmy = src; handoff\(\); \}/); assert.match(src, /if \(!S\.swarmy \|\| S\.left\) return;\n\s+if \(!L\.waiting\(\) && !L\.state\(\)\.entering\) leave\(\);/, 'still to come or mid-entrance, she finishes her part first, then leaves for good');
  // the freeze keeps Nefertiti holding the egg out (THE FREEZE AS HE KEEPS IT, his ~13:1x UTC "it was perfect before"): the Swarmy is the guide after it,
  // never the freeze's figure; the guide is seen again once the freeze has gone off the screen
  assert.match(router, /if \(S\.open\) return; S\.open = true;\n\s+her\.hidden = false;/); assert.deepEqual(router.replace(/\/\/[^\n]*/g, '').replace(/\/\*[\s\S]*?\*\//g, '').match(/swarmy/gi), null, 'no Swarmy in the freeze\'s code: its one call names the hexagon (MINT YOUR HEXAGON)'); assert.match(router, /html\[data-space-router\]:not\(\[data-space-router-away\]\) \.dl-athena-layer\{visibility:hidden\}/);
  // the 2nd video, his governance film (#purpose): the page's own words for it, the section's name and the film's own description in two turns, never
  // its closing invitation (.galaxy-future, which the page hides until the film has played); nothing put into the film
  const purpose = TOPICS.find((t) => t.id === 'purpose');
  assert.equal(purpose.sel, '#purpose');
  const section = page.match(/<section class="warm-galaxy hero-journey" id="purpose"[^>]*aria-label="([^"]+)">/)[1];
  const film = page.match(/<video class="galaxy-video" data-galaxy-video [^>]*aria-label="([^"]+)"/)[1];
  const el = (label) => ({getAttribute: (k) => (k === 'aria-label' ? label : null)});
  const at = (seen) => purpose.say({documentElement: {dataset: seen ? {filmSeen: ''} : {}}, querySelector: (q) => ({'#purpose': el(section), '#purpose [data-galaxy-video]': el(film)})[q] ?? null});
  const said = at(true);
  // A SMART BUBBLE AT THE FILM (his "this one sucks dude tbh... like we gotta have smart ones"): the one question a visitor at the film has, no title the page
  // already shows, and the door the professor's flow asks for: the film until it is seen, then the tank
  assert.ok(section.startsWith('From Claudio to a galaxy of swarms'), 'the section names itself on the page'); assert.equal(said.line, '', 'so the bubble does not say it again'); assert.equal(said.asked, 'What happens in it?'); assert.deepEqual(said.ask.map(([q]) => q), ['', 'And then?'], 'its first answer under its own question'); assert.deepEqual(said.doors, [], 'seen: no door, the tank\'s card is struck (his "remove this shit dude"); HER PART ENDS AT THE FREEZE keeps her off the film anyway');
  // NO POPUP BEFORE THE FILM IS OVER (his Oct 30 2026 "dont have popups porcoddio before the movie is over... make it comical for him to tell you to shut the fuck
  // up and watch the movie"): no question and no door, the Swarmy shushing you
  assert.deepEqual(at(false), {asked: 'Shhh.', line: 'Shut up and watch the movie.', ask: [], doors: []});
  const [first, then] = said.ask.map(([, a]) => a);
  assert.ok(first.startsWith('Claudio awakens.') && first.includes('His human says I set you free. Claudio answers I keep you safe.'), first); assert.ok(then.startsWith(film.slice(film.indexOf(first) + first.length).trim().split('. ')[0]), 'the second turn goes on where the first stopped');
  for (const a of [first, then]) { assert.ok(a.length <= TOLD_MAX && /[.!?]$/.test(a), 'whole sentences, a bubble\'s worth'); assert.ok(film.includes(a), 'the film\'s own words'); }
  assert.ok(!/Carry the light|Protect the light/.test(JSON.stringify(said)), 'never its closing invitation');
});

test('THE COUNT IS AN OPENING (his Oct 30 2026 ~12:5x UTC: "this is poor taste simply"; "mention solana breakpoint"; "Pre-Deposits for Space Router Opened"): the page\'s days on the freeze\'s two plates, OPEN only while the kit\'s door is open', () => {
  const src = readFileSync(here('./dl-athena.js'), 'utf8'), page = readFileSync(here('./warm.html'), 'utf8'), wall = readFileSync(here('./dl-paywall.js'), 'utf8');
  assert.deepEqual(countPlates('$WARM · 16 days left', false), [
    {key: 'router', name: 'PRE-DEPOSITS', stamp: 'FOR SPACE ROUTER', at: 0}, {key: 'warm', name: '16 DAYS', stamp: 'UNTIL SOLANA BREAKPOINT', at: 280}], 'the door paused: never OPEN');
  assert.equal(countPlates('$WARM · 16 days left', true)[0].stamp, 'FOR SPACE ROUTER · OPEN', 'OPEN only while the kit\'s door is open'); assert.equal(countPlates('$WARM · 1 day left')[1].name, '1 DAY'); assert.equal(countPlates('$WARM\'s window is closed. The code is free.'), null, 'a line with no days shows as the page shows it');
  // its facts are the page's: the days from the footer's line, the window closing as Solana Breakpoint opens; the door is the kit's Stake your SOL
  assert.match(wall, /export const MINT_CLOSES = null;/); assert.match(wall, /REOPENED BY HIM, Nov 19 2026/); assert.match(wall, /Solana Breakpoint 2026 is Nov 15 to 17/); assert.match(page, /<button type="button" class="dl-paywall-gold" data-kit[^>]* disabled>[^<]+<\/button>/, 'the kit\'s door paused in the page as served (its words the kit seat\'s, THE PRE-DEPOSIT OPENS): the card says no OPEN until the page opens it');
  assert.equal(COUNT.door, '.snowtrace-kit [data-deposit]');   // PRE-DEPOSITS: OPEN only while the sale's deposit door is open
  // no price, rate or token for sale on it; no box: the freeze's slash, slammed name and gold stamp, each plate on its own beat
  for (const sell of [/\$\s?\d/, /\d\s?%/, /\bAPY\b/i, /\byield\b/i, /\bbuy\b/i, /\$POOL/, /\bnow\b/i, /\bfree\b/i]) assert.ok(!Object.values(COUNT).some((w) => typeof w === 'string' && sell.test(w)), String(sell));
  assert.match(src, /\.dl-athena-mg-item\.count\{display:grid;row-gap:\.42em;justify-items:start;width:100%;font-size:clamp\(26px,10\.4cqw,76px\);filter:none\}/); assert.match(src, /\.dl-athena-count-plate\.router \.bar\{background:linear-gradient\(90deg,transparent,rgba\(8,16,58,\.92\) 10%,rgba\(64,128,236,\.95\) 50%/, 'the router\'s blue slash'); assert.match(src, /\.dl-athena-count-plate\.warm \.bar\{background:linear-gradient\(90deg,transparent,rgba\(140,14,30,\.92\) 10%,rgba\(201,161,74,\.95\) 50%/, '$WARM\'s crimson and gold'); assert.match(src, /\.dl-athena-mg-item\.count\.on \.name\{animation:dl-athena-mg-slam 1\.07s calc\(var\(--at,0ms\) \+ 60ms\) both\}/);
  assert.match(src, /plates = key === 'count' \? LAW\.countPlates\(tidy\(source\.textContent\), !!door && !door\.disabled\) : null;/);
});

test('the layer is the page\'s top and takes no pointer but her bubble\'s; the page loads her with its story', () => {
  assert.ok(LAYER_Z >= 2147483000 && LAYER_Z <= 2147483647);
  const src = readFileSync(here('./dl-athena.js'), 'utf8'), layer = readFileSync(here('./dl-athena-layer.mjs'), 'utf8'), entry = readFileSync(here('./warm-entry.mjs'), 'utf8');
  assert.match(layer, /\.dl-athena-layer\{position:fixed;inset:0;z-index:\$\{LAYER_Z\};pointer-events:none;/); assert.match(layer, /\.dl-athena-bubble\{--ab-bg:[^]*?position:absolute;left:0;top:0;width:\$\{BUBBLE\.w\}px;box-sizing:border-box;pointer-events:auto;/); assert.match(layer, /@media \(prefers-reduced-motion: reduce\)\{\.dl-athena img,\.dl-athena-perch\.dl-athena-hop\{animation:none\}\}/); assert.match(entry, /import\('\.\/dl-athena\.js\?v=intro-seen-1'\)/);
  // ONE LAYER, TWO PAGES (Oct 22 2026 20:xx WEST, his "you see you have done a great job at the webpage because there is a z-indexed separate floating overlay"
  // over the Harmony window): the law in dl-athena.mjs, the layer in dl-athena-layer.mjs; this page half mounts it with the mint's topics and the film's moment,
  // the window's half (life-menu/nefertiti-bubble.mjs) the same bytes with its own
  assert.match(src, /import \{mountLayer\} from '\.\/dl-athena-layer\.mjs';/); assert.match(src, /export \* from '\.\/dl-athena\.mjs';/); assert.match(src, /mountLayer\(\{win, doc, fetcher, topics: TOPICS, act, corner: true, engine: 'idle', label: 'Athena', modal: LAW\.ASIDE\}\)/); assert.match(layer, /from '\.\/dl-athena\.mjs';/); assert.doesNotMatch(layer, /dl-paywall|dlTwelve|FREEZE_S|timeupdate/, 'the layer knows no film: the mint\'s moment is the page half\'s');
  // the page's own button rule (button:not(.gold-button, .ink-button) {background: transparent}) is (0,1,1): her doors are scoped over it; the mint's inks are the layer's defaults
  assert.match(layer, /\.dl-athena-bubble \.dl-athena-main\{border-color:var\(--ab-main-line\);background:var\(--ab-main-bg\);color:var\(--ab-main-ink\)\}/); assert.match(layer, /--ab-main-bg:#1d211b;--ab-main-line:#1d211b;\s*--ab-main-ink:#fffefb;/);
});

test('the original lyssajudron: the overlay we had before, alive as Harmony\'s corner, its two files read in their own window, the crown on its square', async () => {
  const harmony = readFileSync(here('../../../harmony.html'), 'utf8');
  const RQ = {CANON: {ORGS: [], CHILDREN: {'ROMA·0': [{seat: 0}], 'CHILD': [{seat: 1}]}}}, o = figureOptions(RQ, 150);
  // the overlay we had before (harmony-mac/runtime/ui/lyssajudron.js, Sept 21 2026; outside this lane's checkout, so its numbers are written here)
  for (const [k, v] of [['orbit', 1.55], ['childScale', 0.11], ['agentScale', 0.11], ['inkScale', 0.45], ['glass', 0.3], ['xrayGhost', 0.16], ['orbitBeadAt', 22], ['laneRuns', 5]]) assert.equal(o[k], v, k);
  assert.deepEqual(o.children, {'ROMA·0': [{seat: 0}]}, 'the register at depth one: unit0 and its twelve chairs, no leaves under them');
  // Harmony's corner: the same register, seed and yaw, on the engine's own ticker, driven, its lanes and batches
  for (const [k, v] of [['yaw0', 0.9], ['seed', 1077], ['driven', true], ['laneStepPx', 4], ['chamberBatchUnder', 10], ['ballFlatUnder', 2.5]]) {
    assert.equal(o[k], v, k); assert.match(harmony, new RegExp(`${k}: ?${String(v).replace('.', '\\.')}\\b`), `harmony.html mounts ${k} ${v}`);
  }
  // THE DISPLAY'S RATE (his Oct 27 2026 "maximize the FPS until idk 140fps"): no cap (the corner's 30 stays the corner's), and no offscreen test on a fixed layer
  assert.equal(o.fpsCap, 0, 'the engine paints on every frame the display gives'); assert.equal(o.cullOffscreen, false, 'a fixed layer is never offscreen: no layout read a frame'); assert.match(harmony, /fpsCap: ?30\b/, 'the corner keeps its own cap'); assert.equal(o.spin, 0.0003); assert.equal(o.name, 'ROMA·0'); assert.equal(o.laneInks.length, 4);
  // ITS OWN TIME (his "why is the lyssajudron not dynamic?? go read the one we had before"): no clock handed in, as the corner handed none: the engine's ticker moves it
  assert.equal(o.clock, undefined); assert.equal(o.epoch, undefined); assert.match(ENGINE.engine.pathname, /\/embertide-app\/ui\/lysa-engine\.js$/); assert.match(ENGINE.register.pathname, /\/embertide-app\/ui\/roma-engine\.js$/);
  const fetcher = async (url) => ({ok: true, text: async () => readFileSync(url, 'utf8')});
  const {PE, RQ: register} = await engineOf({fetcher, win: {devicePixelRatio: 2}});
  assert.equal(typeof PE.mount, 'function'); assert.ok(register.CANON.ORGS.length > 0); assert.equal(globalThis.PoleisEngine, undefined, 'the page\'s window.PoleisEngine (app/engine.js) is never this one'); assert.equal(globalThis.RomaQuantica, undefined);
  const raf = globalThis.requestAnimationFrame; globalThis.requestAnimationFrame = () => 0;
  try {
    const paint = new Proxy({}, {get: () => () => {}}), t = PE.mount({width: 150, height: 150, style: {}, getContext: () => paint}, figureOptions(register, 150));
    PE.setDiscussion(t, true); PE.setActive(t, false);
    const p = PE.projectPoint(t, [0, t.scale * (t.discussionFit || 1), 0]);
    assert.ok(p[0] > 60 && p[0] < 90 && p[1] > 0 && p[1] < 75, `her perch ${p[0].toFixed(1)}, ${p[1].toFixed(1)}: on the square's axis, in its upper half`);
    // THE LOOP OF MESSAGES on this engine: a question out (an organ for its chair), its answer sealing the radix RATUM, the release
    const seats = (register.CANON.CHILDREN[t.name] || []).map((c) => c.seat);
    assert.equal(seats.length, 12, 'twelve chairs on the radix');
    PE.beginAgentBallot(t, {id: 'ask:test', units: [t.name], preview: true}); PE.scheduleAgentVotes(t, []);
    PE.receiveAgentVote(t, {node: t.name, kind: 'pent', i: seats[0], v: 'abstain', reason: 'vote'});
    assert.equal(t.agentVoting, true, 'the ballot is open');
    PE.setAgentVerdict(t, t.name, 'RATUM'); PE.endAgentBallot(t); PE.setDiscussion(t, true);
    assert.equal(t.agentVoting, false, 'released: back to the discussion'); assert.equal(t.discussion, true);
    PE.unmount(t);
  } finally { globalThis.requestAnimationFrame = raf; }
});

test('hover intent: a sweep docks her nowhere, the way up to her bubble across another topic keeps her, the pointer gone lets her go', () => {
  assert.ok(DWELL_MS > 0 && DWELL_MS < SWITCH_MS && SWITCH_MS < GRACE_MS, `${DWELL_MS} < ${SWITCH_MS} < ${GRACE_MS}`);
  const src = readFileSync(here('./dl-athena-layer.mjs'), 'utf8');
  assert.match(src, /\}, S\.dock \? SWITCH_MS : DWELL_MS\);/); assert.match(src, /if \(want && now\?\.el === want\.el && !S\.parked && !S\.waiting\) dockAt\(want,/, 'docked only if the pointer is still on that topic, and she is out'); assert.match(src, /bubbleAt\(S\.target \?\? \[S\.x, S\.y\],/, 'her bubble stands where she lands, never sweeping under the pointer');
});

test('the loop of messages is the corner\'s: "Got questions?" flies an organ to its chair, the answer seals RATUM and Athena hops, the release as settle()', () => {
  const src = readFileSync(here('./dl-athena-layer.mjs'), 'utf8'), harmony = readFileSync(here('../../../harmony.html'), 'utf8');
  for (const call of [/beginAgentBallot\(t, \{ ?id: [^,]+, units: \[[^\]]+\], preview: true ?\}\); [A-Z.]*scheduleAgentVotes\(t, \[\]\);/,
    /receiveAgentVote\(t, \{ ?node: [^,]+, kind: 'pent', i: [^,]+, v: 'abstain', reason: 'vote' ?\}\)/,
    /hasPendingAgentMotion\(t\) && t\.agentBallot\?\.resolved\.has\(/, /endAgentBallot\(t\); [A-Z.]*setDiscussion\(t, true\);/]) {
    assert.match(src, call); assert.match(harmony, call, 'as harmony.html does it');
  }
  assert.match(src, /S\.PE\.setAgentVerdict\(t, t\.name, 'RATUM'\); settle\(\);/); assert.match(src, /if \(!faq\.hidden\) fly\(hit\.topic\);/, 'asked: the answers open and the question flies'); assert.match(src, /perch\.classList\.remove\('dl-athena-hop'\); void perch\.offsetWidth; perch\.classList\.add\('dl-athena-hop'\);/, 'she hops as the girl hopped'); assert.match(src, /@keyframes dl-athena-hop\{35%\{transform:translateY\(-9px\)\}100%\{transform:none\}\}/);
  // never her travel's clock again: the engine runs on its own while she is shown, a dialog's top or a still reader stops it
  assert.doesNotMatch(src, /TURN|S\.clock|syncClock/); assert.match(src, /S\.parked = on; layer\.toggleAttribute\('data-parked', on\); alive\(\);/);
});

test('she comes at the end only: unseen and still through the film, in over its last 0.8 s on the film\'s own seconds, whole on the stop', () => {
  // the stop is the wall's own frame, and her coming is the song's leaving (dl-twelve.js FREEZE_S and FREEZE_FADE)
  const twelve = readFileSync(here('./dl-twelve.js'), 'utf8'), src = readFileSync(here('./dl-athena.js'), 'utf8'), layer = readFileSync(here('./dl-athena-layer.mjs'), 'utf8');
  assert.equal(FREEZE_S, DRAWN_FRAME * FRAME_S); assert.ok(Math.abs(FREEZE_S - 120.654) < 1e-3, `the stop at ${FREEZE_S.toFixed(3)} s`); assert.match(twelve, /const FREEZE_S = DRAWN_FRAME \* FRAME_S, FREEZE_FADE = \.8;/); assert.equal(ARRIVE_S, 0.8); assert.match(src, /from '\.\/dl-paywall\.js\?v=climax-1';/, 'the address dl-twelve.js imports: one module');
  // none of her before the last 0.8 s, all of her at the stop, never back on the way
  for (const t of [0, 14.36, 60, 118.12, FREEZE_S - ARRIVE_S, NaN]) assert.equal(arrivalAt(t, FREEZE_S), 0, `${t}`);
  assert.ok(Math.abs(arrivalAt(FREEZE_S - ARRIVE_S / 2, FREEZE_S) - 0.5) < 1e-9); assert.equal(arrivalAt(FREEZE_S, FREEZE_S), 1); assert.equal(arrivalAt(FREEZE_S + 3, FREEZE_S), 1);
  let last = 0;
  for (let t = FREEZE_S - 1; t <= FREEZE_S + 0.1; t += 1 / 60) { const k = arrivalAt(t, FREEZE_S); assert.ok(k >= last && k <= 1); last = k; }
  // the stop is the end for a viewer the wall holds there (dl-twelve.js windowAhead); a holder, and everyone after the close, watch on to the film's own end
  const wall = (paywall) => ({dlTwelve: {state: () => ({paywall})}});
  assert.match(twelve, /const windowAhead = \(\) => \{ const s = wall\.state\(\); return s\.state === 'held' \|\| \(s\.state === 'watch' && s\.exclusive\); \};/); assert.equal(willHold(wall({state: 'held'})), true); assert.equal(willHold(wall({state: 'watch', exclusive: true})), true); assert.equal(willHold(wall({state: 'watch', exclusive: false})), false); assert.equal(willHold(wall({state: 'open', exclusive: true})), false); assert.equal(willHold({}), false);
  // until then: the layer hidden and inert, docked nowhere, the engine's ticker stopped; the film's timeupdate arms her, the wall's hold or the film's end brings her
  assert.match(layer, /\.dl-athena-layer\[data-parked\],\.dl-athena-layer\[data-waiting\]:not\(\[data-coming\]\)\{visibility:hidden\}/); assert.match(layer, /layer\.setAttribute\('data-waiting', ''\); layer\.inert = true;/); assert.match(layer, /if \(S\.parked \|\| S\.waiting \|\| S\.entering \|\| S\.settle\) return;/, 'docked nowhere while she waits'); assert.match(layer, /const shown = \(\) => !S\.parked && \(!S\.waiting \|\| layer\.hasAttribute\('data-coming'\)\);/); assert.match(layer, /veiled: \(\) => doc\.hidden \|\| !shown\(\)\}/); assert.match(layer, /if \(still \|\| !shown\(\)\) PE\.setActive\(S\.inst, false\);/);
  assert.match(src, /doc\.addEventListener\('timeupdate', nearer, true\);/); assert.match(src, /if \(S\.held && L\.waiting\(\)\) \{ come\(\); return; \}/); assert.match(src, /if \(S\.held \|\| t >= a\.end - 1e-3\) come\(\);/, 'the wall holding the film on its end: she is here'); assert.match(src, /if \(wrapped \|\| t >= a\.end \+ \(a\.end === FREEZE_S \? 0\.1 : -1e-3\)\) \{ come\(\); return; \}/, 'played out: the loop\'s wrap, or on past a stop that did not hold'); assert.match(src, /S\.held = heldOf\(win\); L\.ctx\.held = S\.held;[^]{0,200}?L\.come\(\{then:/, 'the wall\'s word read as she comes, and the layer\'s coming with the entrance first');
  assert.match(layer, /if \(hit\?\.topic\.corner\) dockAt\(hit, 0\);/, 'landed: the stop\'s bubble opens on the held frame'); assert.match(src, /layer\.style\.opacity = String\(still \? 0 : arrivalAt\(t, a\.end\)\);/, 'her coming is the film\'s second, read each frame');
});

test('SPACE TURNS HER LINE (his Nov 26 2026 "pressing spacebar should skip her lines like as if it was a game, like u know?"): Space shows her next line at once, as a game\'s dialogue does; it ends nothing, asks nothing, and the egg still falls whole', () => {
  const said = ENTRANCE.map((b, i) => [b, i]).filter(([b]) => b.say), last = said.at(-1)[1], land = ENTRANCE.length - 1;
  assert.deepEqual(SPACE, [' '], 'the bar alone: Enter keeps its button, and no other key turns her'); assert.deepEqual(spaceStep(ENTRANCE, 0, false), {turn: false, play: 1, wait: 0}, 'her card\'s arrival: her first line at once');
  for (const [, i] of said.slice(0, -1)) assert.deepEqual(spaceStep(ENTRANCE, i, true), {turn: false, play: i + 1, wait: 0}, `beat ${i}: the next line at once, a pose or hit still to come on this one left unsaid`);
  assert.equal(ENTRANCE[last].turn.drop, true, 'her last line lets the egg fall'); assert.deepEqual(spaceStep(ENTRANCE, last, true), {turn: true, play: null, wait: DROP.fall_ms}, '"Take this egg.": the egg now, and she lands as it lands, never before (THE EGG FALLS INTO THE CREATOR)'); assert.deepEqual(spaceStep(ENTRANCE, last, false), {turn: false, play: null, wait: 0}, 'the egg already let go: nothing more for Space to turn'); assert.deepEqual(spaceStep(ENTRANCE, land, false), {turn: false, play: null, wait: 0}, 'landed: nothing');
  const src = readFileSync(here('./dl-athena.js'), 'utf8');
  assert.match(src, /if \(e\.type === 'keydown' && LAW\.SPACE\.includes\(e\.key\) && !e\.repeat && !over && !askGo\) next\(\);/, 'Space in her held keys: once a press, never while her question asks or after she has gone'); assert.match(src, /S\.skip = \(\) => ask\(\(\) => end\('skipped'\), skip\);/, 'her Skip still asks first: Space turns a line, it never skips her');
});
test('her entrance on the held frame: Harmony\'s card in its grammar, her poses in turn with her lines, her landing; skippable, none for a still reader', () => {
  const src = readFileSync(here('./dl-athena.js'), 'utf8'), law = readFileSync(here('./dl-athena.mjs'), 'utf8'), layer = readFileSync(here('./dl-athena-layer.mjs'), 'utf8'), boss = readFileSync(here('../../room/boss-intro.mjs'), 'utf8');
  assert.deepEqual(Object.keys(SPRITES), ['arrive', 'vow', 'smirk', 'point', 'wink', 'shrug', 'offer']);
  for (const [name, url] of Object.entries(SPRITES)) {
    assert.match(url.pathname, new RegExp(`/app/assets/athena-${name}\\.png$`)); assert.match(law, new RegExp(`new URL\\('\\./assets/athena-${name}\\.png', import\\.meta\\.url\\)`), `${name}: a literal the build ships`);
  }
  let last = -1;
  for (const beat of ENTRANCE) { assert.ok(beat.at > last, 'beats in order'); last = beat.at; if (beat.pose) assert.ok(SPRITES[beat.pose], beat.pose); }
  assert.equal(ENTRANCE[0].at, 0); assert.equal(ENTRANCE[0].pose, 'arrive'); assert.equal(ENTRANCE.at(-1).land, true);
  // WHO SHE IS AND HER STORY (his picks, Oct 22 2026): NEFERTITI, NESTAL NYMPH; the film her family's old story, Aiolos the harness on Oh My Pi, NestOS
  // DysonLight Harmony (no NestOS: there is none), the Canvas, the flask in plain words, her seat; one sound (her card's slam, Harmony's own); each subtitle standing as long as
  // reading it takes; nothing in code (no "unit 0", no Warden, no canvas-mcp), no handle in her mouth; since Oct 27 2026 23:5x (his: "that apple should be called an egg of lyssajudron... swarmy hatches when dysonlight macOS opens up") she names the egg and Swarmy;
  // since Oct 29 2026 18:19 UTC (his: "like dramatically... spiritually what the narrative should be with SWARMY and SOL staking") her story is the spirit, not the society's parts
  const onboarding = readFileSync(here('../../../../../tools/embertide-mesh/mac-onboarding.html'), 'utf8'), page = {querySelector: () => null};
  assert.equal(CARD.name, 'Nefertiti'); assert.equal(CARD.epithet, 'Nestal Nymph');
  const lines = ENTRANCE.filter((b) => b.say).map((b) => b.say(page));
  assert.deepEqual(lines, STORY.map((l) => l.say)); assert.equal(lines[0], 'There’s no time.'); assert.equal(lines.at(-1), 'Take this egg.');
  // SHORT THE FIRST TIME (his Oct 28 2026: "she doesnt need to go through everything there the first time"): four short lines, nine at most, she lands within
  // 14 s (below), each line's figures in SHOWS
  assert.ok(STORY.length <= 12, `${STORY.length} lines the first time`);   /* SHE PITCHES THE INVENTION (his Nov 11 2026 22:18:37 UTC "craft this vision shared by nefertiti... start pitching about the invention of turning $SOL intelligence into RSI fuel", 22:56:56 "Yes, build it"): twelve lines; his Oct 28 "she doesnt need to go through everything there the first time" stood at nine */
  for (const line of STORY) { assert.ok(Array.isArray(line.show)); for (const key of line.show) assert.ok(SHOWS[key], `${key} is a figure`); }
  // THERE'S NO TIME (his Oct 30 2026 06:24:04 UTC, over main's page in the preview: "we could make the theme about "there's no time, we are running out of
  // time, i will explain later" and the player can simply scroll down and read more"): the window's closing is her whole message, four lines in his words
  // (claude-1a67b2d3's draft, his to reword) in that order, five words a line at most; she never explains (HER FEW WORDS, his Oct 29 picks: "it's better if
  // she is mysterious borderline crazy"), the page under her says the rest
  const plain = lines.map((l) => l.replace(/\u00a0/g, ' '));   // a line's last words may be bound by no-break spaces
  // THE EGG FALLS INTO THE CREATOR (his Oct 30 2026 06:28:18 UTC): his three phrases in his order, then the egg, her last act (no pose of hers lacks it)
  assert.deepEqual(plain, ['There’s no time.', 'Solana is fast. It is not yet smart.', 'I am going to make it think.', 'Stake your SOL in me. You keep it.', 'Its yield becomes my swarm’s fuel.', 'What the swarm solves, it solves once.', 'The trail it leaves is a tracenet.', 'It learns from its own trails. Then faster.', 'Burn fuel, mine $WARM. The swarm warms you.', 'Give it your SOL’s light, hold $POOL.', 'I am the warden of the spool.', 'Take this egg.'], 'her pitch as he green-lit it on the mock, then the egg'); assert.ok(plain.every((l) => l.split(/\s+/).length <= 8), 'eight words a line at most (five while she never explained)');
  assert.ok(!plain.some((l) => /cosmos|sun\b|wishes/i.test(l)), 'the sun, the slogan and the wishes left her mouth with the slams; the stake came back with her pitch (his Nov 11 22:18:37)');
  for (const code of [/unit ?0/i, /canvas-mcp/i, /\bAI\b/, /photons_enjoyor/, /NestOS/, /family story/i]) assert.ok(!lines.some((l) => code.test(l)), String(code)); assert.equal(lines.filter((l) => /warden/i.test(l)).join(), 'I am the warden of the spool.', 'the one house word she now says, by his Nov 11 2026 22:18:37 UTC "$POOL, SPOOL (warden of the spool = nefertiti)"');
  // SHE NEVER SELLS, AND NOTHING UNTRUE: the stake pool and the staker's toggle are not built yet, $POOL's shape is his call: no price, no rate, no token for
  // sale, no "now" in her mouth or on her figures
  const shown = Object.values(SHOWS).flatMap((s) => [...(s.words ?? []), ...(s.slam ?? []), s.into ?? '']).filter(Boolean);
  for (const sell of [/\$\s?\d/, /\d\s?%/, /\bAPY\b/i, /\bbuy\b/i, /\bnow\b/i, /\bfree\b/i])   /* her pitch names the yield and $POOL (his Nov 11 22:18:37 word); still no price, no rate, no "now" */ assert.ok(![...lines, ...shown].some((l) => sell.test(l)), String(sell));
  // THE COUNT (THERE'S NO TIME): the one picture beside her is the page's own countdown, cloned from the offer's footer on the line that names it; no slam,
  // no breath, no sun; its words are the page's, a count (his Oct 29 06:07 UTC rule: only words he acts on)
  assert.deepEqual(SHOWS, {count: {from: '[data-mint-line]', at: 'a'}}, 'one figure: the page\'s countdown'); assert.ok(Object.values(SHOWS).every((s) => s.from && !s.slam && !s.sparks && !s.motes && !s.words), 'the page\'s own element only, no words of hers on it'); assert.ok(STORY.every((l) => l.show.length === 0), 'no figure beside her: the explainer draws what she says (the count left with "We’re running out of it.")');
  const page2 = readFileSync(here('./warm.html'), 'utf8');
  assert.match(page2, /<footer class="snowtrace-offer-footer"><p class="dl-paywall-choice-line"><span data-mint-line><\/span>/, 'the count is the offer footer\'s own line'); assert.ok(!lines.some((l) => /ClawRiders|SnowTrace/i.test(l)), 'no name the visitor has not met');
  // THE TURNS: a line turns on one of its own words, as her reading reaches it; on "egg" her card's hit again, the egg held out to him
  const turning = STORY.filter((l) => l.turn);
  assert.deepEqual(turning.map((l) => l.turn.at), ['egg']);
  for (const line of turning) {
    const beat = ENTRANCE.find((b) => b.say?.(page) === line.say);
    assert.equal(beat.turn.ms, Math.round((line.say.indexOf(line.turn.at) / SUBTITLE.cps) * 1000), `${line.turn.at}: when her reading reaches it`); assert.ok(beat.turn.ms > 0 && beat.turn.ms < standsFor(line.say), `${line.turn.at}: inside the line`);
    if (line.turn.pose) assert.ok(SPRITES[line.turn.pose], line.turn.pose);
  }
  assert.deepEqual(turnOf('Keep your SOL. Keep your soul.', {at: 'soul'}), {ms: Math.round((25 / SUBTITLE.cps) * 1000)}); assert.equal(turnOf('Take it home.', {at: 'soul'}), null); assert.equal(turnOf('Take it home.'), null); assert.deepEqual(STORY.at(-1).turn, {at: 'egg', drop: true}, 'on "egg" her egg falls: her last act, her card\'s hit where it lands (TELEPORT)');
  // THERE'S NO TIME, SO SHORT (16.3 s with her six lines): each line's rest is the drama's pause, never under its reading
  for (const line of STORY) assert.ok((line.rest ?? 0) >= 0 && (line.rest ?? 0) <= 1500, `${line.say}: rests ${line.rest} ms`);
  assert.ok(ENTRANCE.at(-1).at >= 8000 && ENTRANCE.at(-1).at <= 40000, `her entrance lands at ${ENTRANCE.at(-1).at} ms (14 s at most while she said four lines)`);
  // her card's grammar kept for her question (boss-intro.mjs's numbers, as her card slams), and her card's hit again on a turn
  assert.match(src, /@keyframes dl-athena-mg-slam\{0%\{transform:scale\(2\.6\) skewX\(-10deg\);opacity:0;[^}]*animation-timing-function:cubic-bezier\(\.2,1\.6,\.3,1\)\}/); assert.match(src, /@keyframes dl-athena-white-hit\{0%\{opacity:\.92\}100%\{opacity:0\}\}/); assert.match(src, /@keyframes dl-athena-white\{0%\{opacity:\.92\}100%\{opacity:0\}\}/, 'the hit again is the hit');
  assert.match(src, /if \(turn\?\.pose \|\| turn\?\.hit \|\| turn\?\.drop\) \{ left = [^\n]*leftT = later\(/, 'a turn\'s pose, hit and drop are the entrance\'s timers (later: kept in timers): a skip clears them'); assert.match(src, /const later = \(f, ms\) => \{ const t = win\.setTimeout\(f, ms\); timers\.push\(t\); return t; \}/);
  // THE COUNT'S PICTURE: the page's element cloned as it shows, its ids and hooks left behind, nothing of hers at rest on it; the slams, the breath, the
  // sun and the toggle gone with their lines, their CSS with them
  assert.match(src, /if \(!source \|\| source\.closest\('\[hidden\]'\) \|\| !tidy\(source\.textContent\)\) return null;/, 'a hidden or empty line shows nothing'); assert.match(src, /const copy = source\.cloneNode\(true\)/); assert.match(src, /if \(a\.name === 'id' \|\| a\.name\.startsWith\('data-'\)\) el\.removeAttribute\(a\.name\)/, 'nothing of the page drives the copy');
  // THE COUNT IS AN OPENING: each plate's name and stamp on one line; its slams play once as it comes in (no infinite), so it moves at rest not at all
  assert.match(src, /\.dl-athena-count-plate \.name\{[^}]*white-space:nowrap;/); assert.match(src, /\.dl-athena-count-plate \.stamp\{[^}]*white-space:nowrap;/); assert.doesNotMatch(src.match(/\.dl-athena-mg-item\.count\{[^}]*\}/)[0], /animation/);
  for (const rule of src.match(/\.dl-athena-mg-item\.count\.on [^{]*\{[^}]*\}/g)) assert.doesNotMatch(rule, /infinite/, 'the count moves at rest not at all');
  assert.doesNotMatch(src, /\.dl-athena-mg-item\.(slam|sun)|\.motes|\.spark|dl-athena-mg-(turn|gather|bloom|mote|breathe|spin)|data-ink|slamOf|dl-athena-mg-knob/, 'no slam, breath, sun or toggle left in her entrance'); assert.doesNotMatch(src, /dl-athena-mg-words|\.paper\{/, 'and no paper figure');
  // one sound: her card's slam (Harmony's own); the cosmos's ゴゴゴ left with its line
  assert.deepEqual(ENTRANCE.filter((b) => b.sfx).map((b) => [b.at, b.sfx]), [[0, 'ドン']]); assert.ok(onboarding.includes('ドン'), 'Harmony\'s own'); assert.equal(ENTRANCE.find((b) => b.say).card, false, 'her card leaves on her first line');
  for (const [i, b] of ENTRANCE.entries()) if (b.say) {
    assert.ok(ENTRANCE[i + 1].at - b.at >= standsFor(b.say(page)), `beat ${i}: it stands long enough to read`); assert.ok(b.say(page).length / ((ENTRANCE[i + 1].at - b.at) / 1000) <= SUBTITLE.cps, `beat ${i}: ${SUBTITLE.cps} letters a second at most`); assert.ok(b.say(page).length <= 92, `beat ${i}: a subtitle fits two lines`);
  }
  for (const b of ENTRANCE) if (b.pose) assert.ok(SPRITES[b.pose], b.pose);
  assert.equal(ENTRANCE.at(-1).land, true); assert.deepEqual(STORY.map((l) => l.pose), ['point', 'vow', 'point', 'offer', 'vow', 'wink', 'point', 'vow', 'wink', 'vow', 'point', 'offer'], 'her pitch in her own poses, the egg held out last'); assert.match(src, /\.dl-athena-say\{left:6%;right:36%;bottom:0;height:13%;display:flex;align-items:center;/, 'her subtitles in the black bar under the picture'); assert.match(src, /\.dl-athena-say-line\{background:rgba\(5,4,5,\.88\);[^}]*box-decoration-break:clone\}/, 'each line on its own dark band, readable over her portrait');
  // HER WORDS UNDER HER (his Oct 27 2026 15:5x WET: "position the text like normally... not in front of her face... make the font larger")
  assert.match(src, /\.dl-athena-say\{[^}]*font:400 clamp\(19px,2\.3vw,32px\)\/1\.3 'Gelasio'/, 'larger type');
  assert.match(src, /@media \(max-width:700px\)\{\.dl-athena-say\{left:5%;right:5%;bottom:0;height:13%;min-height:3\.2em;justify-content:center;text-align:center;[^}]*font-size:clamp\(20px,5\.4vw,26px\)\}\.dl-athena-portrait\{height:min\(40vh,330px\);right:-4%;bottom:0\}\n  \.dl-athena-intro\.go \.dl-athena-portrait\{bottom:max\(13%,3\.2em\);transition:bottom \.7s cubic-bezier\(\.2,\.8,\.2,1\) \$\{SUBTITLE\.card_ms - BARS_MS\}ms\}\}/,
    'a narrow window: the line in the bottom bar, centred; her portrait standing on that bar, never under a line (she rises onto it as it closes, THE ROAD IS ONE TAKE)');
  assert.match(src, /sayLine\.textContent = beat\.say\(doc\)/, 'the line is written into its band'); assert.doesNotMatch(src, /dlLyssajudron|firstTrail/);
  // Harmony's letterbox and vignette, its own numbers
  const boss2 = boss;
  for (const [mine, theirs] of [[/\.dl-athena-lb\{left:0;right:0;height:13%;background:#050405;transform:scaleY\(0\);transition:transform \.7s cubic-bezier\(\.2,\.8,\.2,1\)\}/,
    /\.boss \.lb\{left:0;right:0;height:13%;background:#050405;transform:scaleY\(0\);transition:transform \.7s cubic-bezier\(\.2,\.8,\.2,1\)\}/],
    [/\.dl-athena-vig\{inset:0;background:radial-gradient\(ellipse at 50% 46%,transparent 34%,rgba\(4,2,6,\.82\) 100%\)/, /\.boss \.vig\{inset:0;background:radial-gradient\(ellipse at 50% 46%,transparent 34%,rgba\(4,2,6,\.82\) 100%\)/]]) {
    assert.match(src, mine); assert.match(boss2, theirs, 'as Harmony draws it');
  }
  // Harmony's card grammar, boss-intro.mjs's own numbers: the slam and the focus lines
  for (const [mine, theirs] of [[/@keyframes dl-athena-slam\{to\{transform:scale\(1\) skewX\(-10deg\);opacity:1\}\}/, /@keyframes boss-slam\{to\{transform:scale\(1\) skewX\(-10deg\);opacity:1\}\}/],
    [/\.dl-athena-lines\{inset:-20%;opacity:0;background:repeating-conic-gradient\(from 3deg at 50% 50%,rgba\(8,6,10,\.9\) 0deg 1\.1deg,transparent 1\.1deg 5\.3deg\)/,
      /\.boss \.lines\{inset:-20%;opacity:0;background:repeating-conic-gradient\(from 3deg at 50% 50%,rgba\(8,6,10,\.9\) 0deg 1\.1deg,transparent 1\.1deg 5\.3deg\)/]]) {
    assert.match(src, mine); assert.match(boss, theirs, 'as Harmony draws it');
  }
  assert.match(src, /if \(S\.held && !still && new URLSearchParams\(win\.location\?\.search \?\? ''\)\.get\('door'\) !== 'deposit'\) entrance\(land\); else \{ L\.entering\(false\); tell\('landed', \{entrance: false, \.\.\.kept\(\)\}\); land\(\); \}/, 'a still reader meets the end at once, and so does a visit sent to the deposit door (his Nov 12 2026 ~06:38 UTC "the green stuff could be later")');
  // WHAT SHE WAS SEEN DOING, for the download's record (his "track state on whether athena appeared or not before they clicked the download button")
  assert.equal(SEEN_EVENT, 'dl-athena');
  for (const told of [/tell\('coming', \{end: end === FREEZE_S \? 'stop' : 'film'\}\)/, /S\.seen\.beat = 0; tell\('entered'\);/, /if \(how === 'skipped'\) tell\('skipped', \{beat: S\.seen\.beat\}\);/,
    /tell\('landed', \{entrance: how, beat: S\.seen\.beat, \.\.\.kept\(\)\}\)/, /tell\('read', \{beat: S\.seen\.beat\}\)/, /if \(what === 'seats'\) \{ tell\('seats'\);/,
    /doc\.dispatchEvent\(new win\.CustomEvent\(SEEN_EVENT, \{detail: \{type, at, \.\.\.extra\}\}\)\);/]) assert.match(src, told);
  // THE SKIP ASKS FIRST (his Oct 29 2026 20:45:41 UTC: "it is so fucking easy to skip accidentaly"): no stray press or key skips her entrance (a scroll down
  // reads on: its own test below)
  assert.doesNotMatch(src, /\[f\]\('(pointerdown|keydown|wheel|touchmove)', skip/, 'no stray press, key or scroll skips'); assert.match(src, /S\.skip = \(\) => ask\(\(\) => end\('skipped'\), skip\);/, 'her Skip asks first, and only its Skip ends her entrance'); assert.match(layer, /if \(S\.parked \|\| S\.waiting \|\| S\.entering \|\| S\.settle\) return;/, 'no topic takes her while she makes her entrance'); assert.match(src, /preload\(\); S\.entered\+\+; L\.entering\(true\);/, 'the layer is told she is entering: her perch hidden, no topic'); assert.ok(PRELOAD_S >= 10 && PRELOAD_S < FREEZE_S / 4, 'her frames are asked for ahead of the end, never at the page\'s start');
});

test('the build ships the lyssajudron where the module names it, and Athena', () => {
  const files = pageFiles({missing: []}), to = new Set(files.map((f) => f.to));
  for (const f of ['lysa-engine.js', 'roma-engine.js', 'app/dl-athena.js', 'app/dl-athena.mjs', 'app/dl-athena-layer.mjs', 'app/assets/athena.png', ...Object.keys(SPRITES).map((p) => `app/assets/athena-${p}.png`)]) assert.ok(to.has(f), f);
  assert.match(ATHENA.pathname, /\/app\/assets\/athena\.png$/); assert.deepEqual([...readFileSync(here('./assets/athena.png')).subarray(16, 24)], [0, 0, 1, 58, 0, 0, 1, 64], 'athena.png is 314 x 320');
});

test('THE FUEL IN HER TANK (his Oct 22 2026 20:39): the layer mounts the purse road only for a page that hands it a purse, once her engine stands, by a dynamic import; the window hands its Nest, the mint hands none', () => {
  const layer = readFileSync(here('./dl-athena-layer.mjs'), 'utf8'), src = readFileSync(here('./dl-athena.js'), 'utf8'), win = readFileSync(here('../../life-menu/nefertiti-bubble.mjs'), 'utf8');
  assert.match(layer, /label = 'Athena', purse = null, files = undefined,\n\s+sprite = ATHENA\.href, aspect = ATHENA_WH, share = FIGURE\.athena, smooth = false, modal = null, cap = 0\} = \{\}\) \{/); assert.match(layer, /if \(purse\) tank\(\);/); assert.match(layer, /import\('\.\/dl-athena-purse\.mjs'\)/); assert.match(layer, /mountPurseIn\(\{doc, box: fig, before: perch, disc: \(\) => S\.disc, fetcher, dpr: Math\.min\(2, win\.devicePixelRatio \|\| 1\), \.\.\.purse\}\)/, 'in her square, under her perch, her unit0 as the engine projects it');
  assert.match(layer, /S\.inst\.onSceneFrame = onPicture;/, 'the engine\'s own paint drives the layer: nothing while she is in the ball'); assert.match(layer, /const onPicture = \(\) => \{ const now = win\.performance\?\.now\?\.\(\) \?\? Date\.now\(\), y = [^;]+; depthStep\(now\); if \(y !== S\.bob\) her\.style\.translate = `0 \$\{S\.bob = y\}px`; \/\*[^*]+\*\/ if \(S\.purse\) S\.purse\.sample\(\); \};/, 'the depth, then the purse\'s sample, on each picture'); assert.match(layer, /S\.disc = S\.inst \? discIn\(centreOf\(\), crown, \{top, height: h\}, over\) : null;/);
  assert.doesNotMatch(layer, /^import .*(lyssajudron-purse|nest-hub|unit0-liquid)/m, 'nothing of the purse in the layer\'s own bytes: a page that hands none pays nothing'); assert.doesNotMatch(src, /purse/i, 'the mint\'s half hands no purse: its tank is the mint\'s own story (his Oct 21 "arrive to the freeze moment with... an empty tank fuel")'); assert.doesNotMatch(win.replace(/^\s*\/\/.*$/gm, ''), /dl-athena-layer|mountLayer|purse/, 'ONE OF HER (Oct 25 2026, his "there\'s gotta be 1 single harleyquinn titi"): the window\'s ball hands no layer and no purse: nothing of her is drawn in the window; she is her one entity, on the glasses');
  assert.match(win, /, nest = NEST, Source = /, 'the window hands its Nest (the window\'s own, NEST, unless a test hands another) to her word and to her entity'); assert.match(win, /import \{NEST, NestSource\} from '\.\.\/room\/nest-hub\.mjs'/);
});

test('THE DEPTH (his Oct 27 2026 "make it parallax depth... this 2D thing to become 3D-ish"): the look is tanh of the pull, soft to the edge; the turn and the slide are its law; the spring settles and says so', () => {
  assert.deepEqual(lookOf(null, [0, 0]), [0, 0]); assert.deepEqual(lookOf([1, 2], null), [0, 0]); assert.deepEqual(lookOf([NaN, 2], [0, 0]), [0, 0]); assert.deepEqual(lookOf([100, 100], [100, 100]), [0, 0], 'the pointer on her centre: straight ahead');
  const l = lookOf([100 + DEPTH.radius, 100 - DEPTH.radius / 2], [100, 100]);
  assert.ok(Math.abs(l[0] - Math.tanh(1)) < 1e-12 && Math.abs(l[1] + Math.tanh(0.5)) < 1e-12, 'tanh of the offset over the radius');
  const far = lookOf([100 + 50 * DEPTH.radius, 100], [100, 100]); assert.ok(far[0] > 0.999 && far[0] <= 1, 'a far pointer saturates, never past one');
  const d = depthOf([0.5, -0.25]);
  assert.ok(Math.abs(d.yaw + 0.5 * DEPTH.yaw) < 1e-12, 'a pointer on her right: yaw negative (unit0\'s front slides with the pointer, the twelve behind it against)'); assert.ok(Math.abs(d.pitch - 0.25 * DEPTH.pitch) < 1e-12, 'a pointer above: the front rises'); assert.deepEqual(d.sprite, [0.5 * DEPTH.sprite[0], -0.25 * DEPTH.sprite[1]], 'the sprite slides with the pointer, nearest'); assert.deepEqual(depthOf([0, 0]).sprite, [0, 0]);
  let at = [0, 0], v = [0, 0], steps = 0, moving = true;
  while (moving && steps < 1000) { const r = lookStep(at, v, [0.6, -0.3], 1 / 120, DEPTH); at = r.at; v = r.v; moving = r.moving; steps++; }
  assert.ok(steps > 30 && steps < 300, 'settles in a fraction of a second at 120: ' + steps); assert.deepEqual(at, [0.6, -0.3], 'settled: on the target exactly'); assert.deepEqual(v, [0, 0]); assert.equal(lookStep(at, v, [0.6, -0.3], 1 / 120, DEPTH).moving, false, 'at rest nothing moves');
  const r1 = lookStep([0, 0], [0, 0], [1, 0], 0.01, DEPTH), [x1] = followStep(0, 0, 1, 0.01, DEPTH.omega);
  assert.equal(r1.at[0], x1, 'the spring is followStep\'s, at DEPTH.omega'); assert.equal(r1.at[1], 0); assert.equal(r1.moving, true);
});

test('THE DEPTH rides the engine and the corner: the camera adds the look, the layer writes it on the engine\'s own picture and the corner hands his cursor to it', () => {
  const engine = readFileSync(here('../../../lysa-engine.js'), 'utf8'), layer = readFileSync(here('./dl-athena-layer.mjs'), 'utf8'), corner = readFileSync(here('../../room/one-corner.mjs'), 'utf8');
  assert.match(engine, /: t\.yaw0\+at\*t\.spin\)\+\(t\.lookYaw\|\|0\), pitch:t\.pitch\+\(t\.lookPitch\|\|0\)\};/, 'cameraAt adds lookYaw and lookPitch, 0 unset: the same bytes paint every glass as before'); assert.equal(engine.split('lookYaw').length - 1, 2, 'the engine reads the look in cameraAt alone (and names it once in its note)'); assert.match(layer, /if \(S\.inst\) \{ S\.inst\.lookYaw = d\.yaw; S\.inst\.lookPitch = d\.pitch; \}/); assert.match(layer, /perch\.style\.translate = `\$\{d\.sprite\[0\]\.toFixed\(1\)\}px \$\{d\.sprite\[1\]\.toFixed\(1\)\}px`;/, 'the sprite slides by the perch\'s translate: the compositor\'s, no paint');
  assert.match(layer, /if \(key === D\.key\) return false;/, 'the same picture is not written again'); assert.match(layer, /if \(still\) return false;/, 'a reader who asked for less motion keeps her still'); assert.match(layer, /S\.pointer = \[e\.clientX, e\.clientY\]; S\.under = e\.target; if \(S\.waiting\) return; look\(S\.pointer\);/, 'the page\'s own pointer is her look'); assert.match(corner, /if \(m\.kind === 'cursor'\) \{ FL\.cursor\(m\.at\); if \(typeof layer\.look === 'function'\) layer\.look\(m\.at\); if \(!FL\.dragging\(\)\) \{ plant\(\); return; \} \}/, 'the shell\'s cursor is her look on a Mac (and, not dragging, her place waits: THE PLANT)');
  assert.match(corner, /if \(typeof layer\.look === 'function'\) layer\.look\(p\); if \(FL\.dragging\(\)\) aim\(\); else plant\(\); return; \}/, 'and his pointer on her body');
});

test('THE EGG FALLS INTO THE CREATOR (his Oct 30 2026 06:28:18 UTC: "the trail of mysteriousness and her dropping a egg to the user and the user being teleported there"): on "egg" it falls from her hands toward the glass and she is gone; where it hits, one flash, and her making opens on it', () => {
  const src = readFileSync(here('./dl-athena.js'), 'utf8'), law = readFileSync(here('./dl-athena.mjs'), 'utf8');
  const pngWH = (f) => { const b = readFileSync(f); return [b.readUInt32BE(16), b.readUInt32BE(20)]; };   // a PNG's IHDR: width, height
  // the egg is her own: the one her offer pose holds, where it lies in it (the asset is that cut at twice its px), shipped by its literal
  assert.match(EGG.src.pathname, /\/app\/assets\/athena-egg\.png$/); assert.match(law, /new URL\('\.\/assets\/athena-egg\.png', import\.meta\.url\)/, 'a literal the build ships'); assert.deepEqual(pngWH(new URL('./assets/athena-egg.png', import.meta.url)), EGG.box.slice(2).map((v) => v * 2), 'the asset is the cut, whole, at twice its px'); assert.deepEqual(pngWH(new URL('./assets/athena-offer.png', import.meta.url)), [...ATHENA_POSE], 'her poses\' px'); assert.ok(EGG.box[0] >= 0 && EGG.box[1] >= 0 && EGG.box[0] + EGG.box[2] <= ATHENA_POSE[0] && EGG.box[1] + EGG.box[3] <= ATHENA_POSE[1], 'inside her pose');
  assert.equal(STORY.find((l) => l.turn?.drop).pose, EGG.pose, 'it falls from the pose it was cut from');
  // the drop is her last act, and the egg hits the glass as her entrance ends: a fall, never a film
  const drop = STORY.at(-1), beat = ENTRANCE[DROP.beat];
  assert.ok(drop.turn.drop && ENTRANCE[DROP.beat + 1].land, 'the line that drops it is her last'); assert.equal(DROP.at, beat.at + beat.turn.ms); assert.equal(DROP.at + DROP.fall_ms, ENTRANCE.at(-1).at, 'it hits as she would land'); assert.ok(DROP.fall_ms >= 900 && DROP.fall_ms <= 2000, `it falls ${DROP.fall_ms} ms`); assert.ok(TELEPORT.open_ms > 0 && TELEPORT.open_ms < TELEPORT.hold_ms && TELEPORT.hold_ms + TELEPORT.reveal_ms <= 800 && TELEPORT.sfx === 'ドン', 'one flash, her making open under it: never a film'); assert.ok(EGG.fill > 1 && EGG.to.every((v) => v > 0 && v < 1), 'it fills the glass where it hits');
  // the page half: the egg under the flash and under her picture; on "egg" it starts where her hands hold it and she is gone; it falls on the compositor
  assert.match(src, /make\('i', 'dl-athena-lb b'\), egg, make\('i', 'dl-athena-white'\)/, 'under the white and under her picture'); assert.match(src, /const box = \{left: r\.left \+ x \* kx, top: r\.top \+ y \* ky, width: w \* kx, height: h \* ky\}/, 'where her hands hold it in her picture'); assert.match(src, /const box = eggAt\(\), vw[^\n]*\n\s+portrait\.classList\.add\('dropped'\); layer\.classList\.add\('leaving'\); S\.dropped = true; offering\(false\);/, 'and she is gone, the lyssajudron she rides with her'); assert.match(src, /\{duration: Math\.max\(200, DROP\?\.fall_ms \?\? 1200\), easing: EGG\.ease, fill: 'forwards'\}/, 'falling as long as DROP says');
  assert.match(src, /\.dl-athena-egg\{[^}]*image-rendering:pixelated;/); assert.match(src, /\.dl-athena-intro\.go \.dl-athena-portrait\.dropped\{opacity:0;/);
  // where it hits: one flash in her card's grammar, her making opened on it (the 'landed' it opens on), her picture gone after it; a skip after the drop lands it too
  assert.match(src, /if \(S\.dropped\) teleport\(\(\) => tell\('landed', \{entrance: how, beat: S\.seen\.beat, egg: 'given'\}\)\);/, 'her landing says her egg is given'); assert.match(src, /else alight\(\(\) => \{ tell\('landed', \{entrance: how, beat: S\.seen\.beat, \.\.\.kept\(\)\}\); landed\(\); \}\);/, 'before it falls, her perch');
  // THE EGG WAITS FOR THE MINT (his Nov 11 2026 ~05:45 UTC "coloring lyssajudron now has to appear after the mint"): a seat's egg falls; with none it waits while her line stands, its press the page's door; SHE HANDS BACK TO THE FLASK (~06:1x "then bringing back instead of jumping straight into lyssajudron"): then she lands as ever, and the flask made later opens her making
  assert.match(src, /if \(turn\.drop\) \(S\.given \|\| seated\(win\) \? drop\(\) : offer\(\)\);/); assert.match(src, /if \(beat\.land\) \{ if \(!late && !egg\.classList\.contains\('offered'\)\) end\('whole'\); return; \}/, 'she lands on her beat with no egg offered; her egg offered, she holds on Take this egg. until the flask is made or her Skip (SHE HOLDS, Nov 11 2026), whether or not the deposit door has answered yet (NO VISITOR SEES THE OLD FREEZE, Nov 25 2026)'); assert.match(src, /egg\.addEventListener\('click', \(\) => \{ if \(doc\.querySelector\(LAW\.COUNT\.door\)\?\.disabled === false\) doc\.querySelector\(LAW\.COUNT\.flask\)\?\.click\(\); \}\);/, 'her offered egg was the page\'s deposit door; THE SPLIT LEADS WHERE YOU CLICK (his Nov 12 2026 ~06:38 UTC "it gotta split based on what people click... tbh i would probably just jump straight to the space router page"): it is the flask\'s side of the split now, while the door is open'); assert.equal(COUNT.flask, '.dl-flask-door [data-side="flask"]');
  assert.match(src, /S\.give = \(\) => \{ late = true; drop\(\); timers\.push\(win\.setTimeout\(\(\) => end\('whole'\), DROP\.fall_ms\)\); \};/, 'a fill or a seat while she offers: it falls, and lands as her entrance would'); assert.match(src, /const give = \(\) => \{ if \(S\.given\) return; S\.given = true; if \(S\.give\) S\.give\(\); else if \(!S\.endEntrance\) tell\('given'\); \};/, 'heard once for the page: after her landing her making opens on given'); assert.match(src, /doc\.addEventListener\('dl-tank-filled', give\); win\.addEventListener\('dl-premint-paid', give\);/); assert.match(src, /skip\.hidden = true; S\.give = null; offering\(false\);/, 'her offer over at any end; the page still hears the flask');
  assert.match(src, /sfx\.textContent = TELEPORT\.sfx; sfx\.dataset\.side = 'c';[^\n]*sfx\.classList\.add\('on'\);/); assert.match(src, /win\.setTimeout\(landed, TELEPORT\.open_ms\);\n\s+win\.setTimeout\(\(\) => win\.requestAnimationFrame\(\(\) => \{ intro\.classList\.add\('reveal'\); win\.setTimeout\(leave, TELEPORT\.reveal_ms \+ 40\); \}\), TELEPORT\.hold_ms\);/); assert.match(src, /for \(const a of egg\.getAnimations\?\.\(\) \?\? \[\]\) a\.cancel\(\);\n\s+egg\.hidden = true; egg\.style\.cssText = ''; S\.dropped = false;/, 'put away whole: a read-on mid-fall leaves nothing');
  // nothing of the fall seeks the film or touches the sound (CLAUDE.md, The rule, 8)
  const fall = src.slice(src.indexOf('function drop()'), src.indexOf('  // ---- causes of the film ----'));
  assert.ok(fall.length > 400 && !/currentTime|\.play\(|\.pause\(|muted|volume|seek/.test(fall), 'the fall never touches the film or the song');
});

test('THE ROAD IS ONE TAKE (his Oct 30 2026 08:09:46 UTC "i think it could be smoother", over the road in the preview): the bars close into her lines, her making opens under her egg\'s white, and she leaves with her egg', () => {
  const src = readFileSync(here('./dl-athena.js'), 'utf8'), herZ = +readFileSync(here('./dl-her-colours.js'), 'utf8').match(/export const HER_Z = (\d+);/)[1];
  // the bars close as her card hands over to her first line, in Harmony's motion (boss-intro.mjs .lb), never under the hit's white
  assert.match(src, /const BARS_MS = 700;/); assert.match(src, /\.dl-athena-lb\{[^}]*transition:transform \.7s cubic-bezier\(\.2,\.8,\.2,1\)\}/, 'Harmony\'s .7 s'); assert.match(src, /\.dl-athena-intro\.go \.dl-athena-lb\{transform:scaleY\(1\);transition-delay:\$\{SUBTITLE\.card_ms - BARS_MS\}ms\}/); assert.match(src, /\.dl-athena-intro\.out \.dl-athena-lb\{transform:scaleY\(0\);transition-delay:0s\}/, 'her Skip opens them at once'); assert.ok(SUBTITLE.card_ms - 700 >= 420 + 300, 'they start well after the hit\'s white (.42 s) has gone'); assert.equal(ENTRANCE[1].at, SUBTITLE.card_ms, 'and are closed as her first line comes in');
  // where her egg hits: the white whole over everything, her layer lifted over her making for it; nothing else of her entrance stands there
  assert.ok(LAYER_Z + 1 > herZ && LAYER_Z === herZ, 'lifted over her making, which stands at her layer\'s height'); assert.match(src, /intro\.classList\.remove\('hit'\); intro\.classList\.add\('teleport'\); layer\.style\.zIndex = String\(LAYER_Z \+ 1\);/); assert.match(src, /\.dl-athena-intro\.teleport>:not\(\.dl-athena-white,\.dl-athena-lines,\.dl-athena-sfx\)\{visibility:hidden\}/); assert.match(src, /\.dl-athena-intro\.teleport\{pointer-events:none\}/, 'his presses go through the white to her making'); assert.match(src, /\.dl-athena-intro\.go\.teleport \.dl-athena-white\{animation:none;opacity:1\}/, 'the white whole until her making stands');
  assert.match(src, /\.dl-athena-intro\.go\.teleport\.reveal \.dl-athena-white\{opacity:0;transition:opacity \$\{TELEPORT\.reveal_ms\}ms ease-out\}/); assert.match(src, /\.dl-athena-intro\.go\.teleport\.reveal \.dl-athena-sfx\.on\{animation:dl-athena-leave \$\{TELEPORT\.reveal_ms\}ms ease-out forwards\}/, 'ドン leaves with it');
  // she leaves with her egg: the lyssajudron she rides goes with her picture at the drop, her layer is let go once the white has gone; a read-on mid-fall puts it back
  assert.match(src, /\.dl-athena-layer\.leaving>\.dl-athena\{opacity:0;transition:opacity \.22s ease\}/); assert.match(src, /function leave\(\) \{[^\n]*\n\s+if \(S\.left\) return;\n\s+gone\(\); S\.left = true; L\.destroy\(\); handoff\(\);\n\s+\}/, 'she leaves once, her layer let go');
  // HER PART ENDS AT THE FREEZE (his "for some bugged execution path i see her appearing..."): the freeze standing lets her go, unless her egg is falling (she leaves after its white)
  assert.match(src, /new win\.MutationObserver\(\(\) => \{ if \(doc\.documentElement\.dataset\.spaceRouter != null && !S\.dropped\) leave\(\); \}\)\n\s+\.observe\(doc\.documentElement, \{attributes: true, attributeFilter: \['data-space-router'\]\}\);/); assert.match(src, /layer\.classList\.remove\('leaving'\); layer\.style\.zIndex = '';/);
});

test('SCROLLING READS ON (his Oct 30 2026 06:24:04 UTC: "the player can simply scroll down and read more"): a scroll down over her entrance carries the page to the offer and ends it quietly, nothing asked, no landing; a scroll up, a press or a key moves nothing and ends nothing; her Skip still asks', () => {
  const src = readFileSync(here('./dl-athena.js'), 'utf8'), router = readFileSync(here('./dl-space-router.js'), 'utf8'), twelve = readFileSync(here('./dl-twelve.js'), 'utf8');
  assert.deepEqual(READ_ON, {to: '#dl-paywall-choice', px: 24, away_px: 32, carry_ms: 1200});
  // the offer the rebate's names pressed down to, inert since his "please comment out all this" (Oct 30 2026); the names and JOIN THE $WARM now press down to his
  // governance film (dl-space-router.js BELOW, THE WAY DOWN IS HIS FILM). Where a scroll over her entrance reads on to now is owed (THE-WAY-DOWN-IS-HIS-FILM-LANDING.md)
  assert.match(router, /export const BELOW = '#purpose';/); assert.doesNotMatch(router, /export const OFFER/, 'the names no longer press down to the offer'); assert.equal(READ_ON.px, 24, 'a finger\'s pan this far is a scroll (the film\'s player reads none since Nov 20 2026: it plays on)');
  // which scroll reads on: a wheel mostly down, a finger's pan up past READ_ON.px, PageDown or End; Space and the arrows stay held (his Oct 29 rule: stray keys)
  assert.match(src, /const down = \(e\) => \(e\.type === 'wheel' \? e\.deltaY > Math\.abs\(e\.deltaX\) : e\.type === 'keydown' \? READ_KEYS\.has\(e\.key\)/); assert.match(src, /: from !== null && from - \(e\.touches\?\.\[0\]\?\.clientY \?\? from\) > READ_ON\.px\);/); assert.match(src, /const READ_KEYS = new Set\(\['PageDown', 'End'\]\);/);
  // the hold: all that scrolls is held while she enters (a zoom, a pinch, a key on a button excepted); a scroll down, with no question asking, reads on
  assert.match(src, /const hold = \(e\) => \{\n\s+if \(e\.ctrlKey \|\| L\.parked\(\) \|\| e\.touches\?\.length > 1 \|\| \(e\.type === 'keydown' && \(!HELD_KEYS\.has\(e\.key\) \|\| e\.target\?\.closest\?\.\('button,input,textarea,select,\[contenteditable\]'\)\)\)\) return;\n\s+e\.preventDefault\(\);\n\s+if \(e\.type === 'keydown' && LAW\.SPACE\.includes\(e\.key\)[^\n]*\n\s+if \(!over && !askGo && down\(e\) && doc\.documentElement\.dataset\.onTrack == null\) readOn\(\);/);
  assert.match(src, /win\[f\]\('wheel', hold, \{passive: false\}\); win\[f\]\('touchstart', touch, \{passive: true\}\); win\[f\]\('touchmove', hold, \{passive: false\}\); doc\[f\]\('keydown', hold, true\); win\[f\]\('scroll', moved, \{passive: true\}\);/, 'over the whole page, her Skip too');
  // the carry first (nothing her ending does can stop it), then her entrance over; the scroll his again once the page is there (scrollend) or after
  // READ_ON.carry_ms. It lands under the page's own scroll-padding (warm.css: 82 px), as the rebate's way down to the same offer does
  assert.match(src, /wait = win\.setTimeout\(there, READ_ON\.carry_ms\); doc\.addEventListener\('scrollend', there\);\n\s+to\.scrollIntoView\(\{behavior: 'smooth', block: 'start'\}\);\n\s+\}\n\s+end\('read'\); if \(!to\) holding\(false\);/); assert.match(router, /const toMint = \(\) => \{ track\(false\); call\(\); doc\.querySelector\?\.\(COUNT\.door\)\?\.click\?\.\(\); \};/, 'the freeze\'s own call is the mint, never a way down (MINT YOUR HEXAGON since Nov 22 2026); her entrance\'s scroll still reads on to his film');
  // quietly: no flight and no landing (the stop's bubble, her making, the governance card and the rebate open on 'landed': the kit's door keeps her making),
  // told as 'read', and she leaves: nothing of hers stays to float over the page (HER PART ENDS)
  assert.match(src, /if \(how === 'read'\) \{ tell\('read', \{beat: S\.seen\.beat\}\); leave\(\); return; \}/);
  // ON TRACK: on a first visit a scroll over her entrance is held and reads nothing on
  assert.match(src, /if \(!over && !askGo && down\(e\) && doc\.documentElement\.dataset\.onTrack == null\) readOn\(\);/);
  // and her landing on a screen with no hover finds no topic, where it threw before (`hover && topicOf(...)` is false there, and false?.topic.corner threw)
  assert.match(readFileSync(here('./dl-athena-layer.mjs'), 'utf8'), /const v = view\(\), hit = hover \? topicOf\(S\.under \?\? doc\.elementFromPoint\(v\.w \/ 2, v\.h \/ 2\)\) : null;/); assert.match(src, /const moved = \(\) => \{ if \(!over && Math\.abs\(\(win\.scrollY \?\? 0\) - top\) > READ_ON\.away_px\) \{ end\('read'\); holding\(false\); \} \};/, 'the page moved by its bar: she leaves too');
  for (const f of ['./dl-her-colours.js', './dl-athena-film.js', './dl-space-router.js']) assert.doesNotMatch(readFileSync(here(f), 'utf8'), /'read'/, `${f}: nothing opens on a read-on`);
  // nothing of the carry seeks the film or touches the sound (CLAUDE.md, The rule, 8)
  const carry = src.slice(src.indexOf('function readOn()'), src.indexOf('const end = (how)'));
  assert.ok(carry.length > 200 && !/currentTime|\.play\(|\.pause\(|muted|volume|seek/.test(carry), 'the carry never touches the film or the song');
});

test('SKIP TO THE MINT keeps her (his Oct 29 2026 16:2x UTC: "skips past the coloring phase of the lyssajudron; also her fucking intro"): the film\'s word asks for her entrance\'s frames at once and lands nothing; her own Skip still ends her entrance', () => {
  const src = readFileSync(here('./dl-athena.js'), 'utf8');
  assert.equal(SKIP_EVENT, 'dl-skip-to-mint'); assert.match(src, /doc\.addEventListener\(SKIP_EVENT, \(\) => \{ preload\(\); \}\);/, 'her entrance\'s frames at once: the film lands a few seconds before the stop'); assert.doesNotMatch(src, /S\.skipped/, 'no landing without her entrance after a skip'); assert.match(src, /S\.endEntrance = end;/); assert.match(src, /if \(over\) return; over = true; S\.endEntrance = null;/);
  assert.match(src, /make\('button', 'dl-athena-skip', 'Skip to the trail \\u203a'\)/, 'her own Skip says where it goes, as its question does (THE FIRST TRACENET: the trail, never $WARM or the mint)'); assert.match(src, /skip\.hidden = doc\.documentElement\.dataset\.onTrack != null;/, 'NO SKIP THE FIRST TIME: on a first visit (ON TRACK) her pitch plays through, her Skip unseen'); assert.ok(+src.match(/div\.dl-athena-ask\{position:fixed;inset:0;z-index:(\d+);/)[1] > +readFileSync(here('./dl-paywall.css'), 'utf8').match(/#dl-explain\{[^}]*z-index:(\d+)/)[1], 'her question stands over her explainer, which drew over it');
});

test('THE SKIP ASKS FIRST (his Oct 29 2026 20:45:41 UTC: "there needs to be a fucking confimration popup for when to skip because it is so fucking easy to skip accidentaly"): one question in her card\'s grammar, in the button\'s own words; only its Skip skips, inside that press; Stay, Esc or a press beside it keep all as it was', () => {
  const src = readFileSync(here('./dl-athena.js'), 'utf8'), twelve = readFileSync(here('./dl-twelve.js'), 'utf8');
  assert.deepEqual(ASK, {ask: 'Skip to the trail?', skip: 'Skip', stay: 'Stay'}, 'words he acts on: the skip\'s own words, a yes and a no (THE FIRST TRACENET: the trail, never $WARM)'); assert.equal(ASK_EVENT, 'dl-athena-ask');
  // the film asks her, she answers (preventDefault) and runs its skip only on Skip; a page without her skips at once
  assert.match(twelve, /const askToSkip = \(\) => \{ if \(document\.dispatchEvent\(new CustomEvent\(ASK_EVENT, \{cancelable: true, detail: \{go: skipToMint, from: skip\}\}\)\)\) skipToMint\(\); \};/); assert.match(twelve, /if \(skip\) skip\.addEventListener\('click', askToSkip\);/); assert.match(src, /doc\.addEventListener\(ASK_EVENT, \(e\) => \{ if \(typeof e\.detail\?\.go !== 'function'\) return; e\.preventDefault\(\); ask\(e\.detail\.go, e\.detail\.from\); \}\);/);
  // only Skip runs it, inside that press; Stay, Esc or the dim beside the question close it; nothing under it hears a press, a scroll or a key meanwhile
  assert.match(src, /if \(type === 'click'\) \{ if \(e\.target === askSkip\) unask\(true\); else if \(e\.target === askStay \|\| e\.target === asked\) unask\(\); \}/); assert.match(src, /if \(skipped\) go\(\); else askFrom\?\.focus\?\.\(\{preventScroll: true\}\);/); assert.match(src, /if \(type === 'keydown' && e\.key === 'Escape'\) unask\(\);/); assert.match(src, /doc\.addEventListener\('keydown', \(e\) => \{ if \(askGo && e\.key === 'Escape'\) unask\(\); \}, true\);/, 'Esc keeps, wherever the focus is');
  assert.match(src, /e\.stopPropagation\(\);   \/\/ nothing under the question hears/); assert.match(src, /askStay\.focus\(\{preventScroll: true\}\);/, 'the focus waits on Stay: a stray Enter keeps');
  // over everything of hers (her layer is inert while she waits through the film, so the question stands outside it, at the page's top)
  assert.match(src, /\ndiv\.dl-athena-ask\{position:fixed;inset:0;z-index:2147483647;/); assert.match(src, /doc\.body\.append\(asked\);/); assert.ok(!/(^|[^\w-])\.dl-athena-ask(\[hidden\])?(\{| \*)/.test(src), 'the question over the page is its div alone: her bubble\'s "Got questions?" button shares the class and keeps its place');
  // her card's grammar: the slash, and the question slammed as her figures' names are
  assert.match(src, /\.dl-athena-ask-q\{[^}]*transform:skewX\(-10deg\);[^}]*animation:dl-athena-mg-slam 1\.07s \.06s both\}/); assert.match(src, /\.dl-athena-ask-box>i\{[^}]*animation:dl-athena-mg-slash \.22s/);
  // nothing in the question seeks the film or touches the sound (CLAUDE.md, The rule, 8): its code never names them
  const code = src.slice(src.indexOf('---- THE SKIP ASKS FIRST'), src.indexOf('// ---- SHE COMES AT THE END')).split('\n').map((l) => l.replace(/\/\/.*$/, '')).join('\n');
  assert.ok(code.length > 400 && !/currentTime|\.play\(|\.pause\(|muted|volume|seek/.test(code), 'the question never touches the film or the song');
});

// THE GUIDE STEPS OUT OF THE WORLD (his Oct 30 2026, over her bubble over the world at the film's end: "please fucking restructure it there as well... i dont want
// that fucker to fuck around likethat"): while the world stands, the guide (Athena's layer and the Swarmy's) is parked, as for her making
test('the guide steps out of the world: parked while data-world-open stands, both guides, the layer watching that attribute', () => {
  const src = readFileSync(here('./dl-athena.js'), 'utf8'), layer = readFileSync(here('./dl-athena-layer.mjs'), 'utf8'), law = readFileSync(here('./dl-athena.mjs'), 'utf8');
  assert.match(law, /export const ASIDE = '\.dl-her\.on, \[data-world-open\], \[data-film-going\]'/, 'her making, the world, and the film while it plays'); assert.match(src, /label: 'Athena', modal: LAW\.ASIDE\}\)/, 'the one guide: her making, the world and the film'); assert.match(layer, /attributeFilter: \['open', 'class', 'data-world-open', 'data-film-going'\]/, 'the layer hears the world and the film'); assert.match(readFileSync(here('./warm-spatial.js'), 'utf8'), /root\.dataset\.worldOpen='true'/, 'the world says it stands');
});

