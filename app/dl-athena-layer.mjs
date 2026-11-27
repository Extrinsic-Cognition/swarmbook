// dl-athena-layer.mjs · ATHENA'S LAYER, the one mechanism (the law is dl-athena.mjs; the mint's page half dl-athena.js; the Harmony window's half
// life-menu/nefertiti-bubble.mjs). His Oct 21 2026 21:3x WEST: "i want an overlay as a z index above everything else on the page... this has to follow
// the mouse around and stop at topics with like "got questions" or idk... we can use floating athena on the original lyssajudron"; his Oct 22 19:56
// over the Harmony window: "you see you have done a great job at the webpage because there is a z-indexed separate floating overlay". So the layer is
// one module, mounted by both pages with their own topics, their own doors and their own moment for her to come.
//
// THE LAYER is the page's top (LAYER_Z: over everything but a modal dialog's top layer) and takes no pointer: the page under her is the page, but for
// her bubble (and, on a screen without hover, her figure).
// SHE WAITS UNSEEN until the page says come() (the mint: the film's end; the window: his press on her ball), and goes back to waiting at hide().
// SHE FOLLOWS THE MOUSE: a critically damped spring (followStep) toward a place beside the pointer (besidePointer), inside the viewport.
// THE LYSSAJUDRON LIVES (his Oct 21 2026 22:0x WEST, over it standing still while she rested: "why is the lyssajudron not dynamic?? go read the one we
// had before"): as it lived in Harmony's corner, on the engine's own ticker, whoever moves: the view turns, her twelve ride their wires, 30 a second,
// nothing while the page is hidden, while she waits, or while a modal dialog holds the top. And THE LOOP OF MESSAGES, the corner's (harmony.html LYSA
// fly / land / settle): a question asked ("Got questions?") is an organ leaving its lane for its chair on the radix (the engine's agent ballot, an
// abstain vote); its answer landing (LOOP.land_ms on) seals the radix RATUM and the gold wave radiates, Athena hops as the girl hopped, and the release
// sends every organ back to its lane once the motion is done (LOOP.settle_ms at most).
// SHE STOPS AT TOPICS (the page's own: `topics`, the narrowest first): the pointer on a topic docks her beside it (dockOf) with her bubble: the ask,
// the topic's line, its doors. She stays while the pointer is on the topic or on her bubble, rides the topic as the page scrolls, and follows again
// GRACE_MS after the pointer has left both. A topic marked `corner` docks her at the page's corner (DOCK.corner, or the pair the page gives). A modal
// dialog parks her. A screen without hover has no pointer to follow: she waits where the corner docks her, and a tap on her opens the topic most in view.
// THE WORDS: every line is the page's own text, read as the bubble opens (topic.say(doc)); the questions that join them are the page half's.
// HER COLOURS ARE HER OWN: the figure stands in [data-own-colours] (the Harmony window's palace, harmony-ice.js, leaves content alone: her golds stay
// gold); the bubble is chrome, in the page's register through CSS variables (--ab-*: the mint's ivory and gold by default; the window's half sets the
// Spool Board's glass).
// THE FUEL IN HER TANK (his Oct 22 2026 20:39 WEST, "you need to put the fucking minirouter fuel in her tank dude please"): a page that hands the layer a
// purse ({nest}: the window) gets the MiniRouter purse painted in her unit0 once her engine stands, by the one page's own painter and law
// (dl-athena-purse.mjs: the ale, the balance, what is in flight, every call expended rising as the MMO number, the piranhas' bite), read from the Nest's
// ref house/purse and followed on the window's one connection to it. The road is a dynamic import, so a page that hands no purse (the mint, whose tank is
// its own story) pays nothing for it.
// THE DEPTH (Oct 27 2026, his "make it parallax depth like i want this 2D thing to become 3D-ish"; the law dl-athena.mjs DEPTH): her body turns
// toward his pointer (the engine's camera: lookYaw, lookPitch) and Athena's sprite slides over it, nearest; look(at) takes the pointer (the page's
// own here, the shell's through one-corner.mjs on a Mac), and the look springs on the engine's own picture (onSceneFrame): at the display's rate
// while it moves, nothing written once settled.
// COST: at rest nothing runs (no timer, no frame; the engine's ticker only while she is shown, at the display's rate: 0.24 ms a picture at 300 x 300);
// one frame loop while she travels, stopped when she settles; the engine's two files (143 KB) fetched once, at idle on the mint, at her first coming
// in the window (`engine: 'come'`), never on a page that never calls her.
import {LAYER_Z, FIGURE, ATHENA_WH, FOLLOW, LOOP, DOCK, BUBBLE, GRACE_MS, DWELL_MS, SWITCH_MS, SCROLL_MS, ATHENA, DEPTH, clamp, followStep, besidePointer,
  dockOf, bubbleAt, topicOf as topicIn, figureOptions, engineOf, discIn, lookOf, depthOf, lookStep} from './dl-athena.mjs';

export const CSS = `
.dl-athena-layer{position:fixed;inset:0;z-index:${LAYER_Z};pointer-events:none;overflow:hidden}
.dl-athena-layer[data-parked],.dl-athena-layer[data-waiting]:not([data-coming]){visibility:hidden}
.dl-athena{position:absolute;left:0;top:0;will-change:transform}
.dl-athena canvas{position:absolute;left:0;display:block}
.dl-athena-perch{position:absolute;will-change:translate}
.dl-athena-perch.dl-athena-hop{animation:dl-athena-hop .55s cubic-bezier(.22,1,.36,1)}
.dl-athena img{display:block;width:100%;height:100%;image-rendering:pixelated;filter:drop-shadow(0 7px 9px rgb(37 41 33 / .2));
  -webkit-mask-image:linear-gradient(#000 76%,transparent);mask-image:linear-gradient(#000 76%,transparent);animation:dl-athena-float 3.4s ease-in-out infinite alternate}
@keyframes dl-athena-float{to{translate:0 -5px}}
.dl-athena-smooth img{image-rendering:auto;-webkit-mask-image:none;mask-image:none;
  filter:drop-shadow(0 0 1px rgb(12 10 8 / .6)) drop-shadow(0 6px 12px rgb(12 10 8 / .42)) drop-shadow(0 0 26px rgb(12 10 8 / .3))}   /* THE SWARMY CASTS A SHADOW (his Oct 30 2026 ~13:3x UTC "i think the best is just putting a shadow behind it... for contrast"): her outline, her fall and a wide halo, so her pale shell reads on the light page and the dark */
@keyframes dl-athena-hop{35%{transform:translateY(-9px)}100%{transform:none}}
.dl-athena-tap{pointer-events:auto;cursor:pointer}
.dl-athena-bubble{--ab-bg:radial-gradient(130% 160% at 28% 0%,#fffefb 0%,rgb(255 254 251 / .96) 46%,rgb(241 233 212 / .95) 100%);--ab-line:rgb(168 134 67 / .42);
  --ab-ink:#252921;--ab-dim:#55594f;--ab-font:400 13.5px/1.45 'DM Sans',system-ui,sans-serif;--ab-ask:italic 22px/1.15 'Bodoni 72','Didot','Times New Roman',serif;
  --ab-ask-ink:#a58343;--ab-ask-hover:#7d6230;--ab-rule:rgb(168 134 67 / .25);--ab-door-line:rgb(168 134 67 / .55);--ab-door-bg:#fffefb;--ab-door-ink:#252921;
  --ab-door-font:500 12.5px/1 'DM Sans',system-ui,sans-serif;--ab-door-hover-line:#a88643;--ab-door-hover-bg:#fbf4e2;--ab-main-bg:#1d211b;--ab-main-line:#1d211b;
  --ab-main-ink:#fffefb;--ab-main-hover:#2c3229;--ab-shadow:0 18px 42px rgb(37 41 33 / .18);--ab-radius:16px;--ab-focus:#b4944d;--ab-blur:none;
  position:absolute;left:0;top:0;width:${BUBBLE.w}px;box-sizing:border-box;pointer-events:auto;padding:12px 15px 13px;border:1px solid var(--ab-line);
  border-radius:var(--ab-radius);background:var(--ab-bg);box-shadow:var(--ab-shadow);color:var(--ab-ink);font:var(--ab-font);
  -webkit-backdrop-filter:var(--ab-blur);backdrop-filter:var(--ab-blur)}
.dl-athena-bubble[hidden]{display:none}
.dl-athena-bubble .dl-athena-ask{display:block;margin:0 0 5px;padding:0;border:0;background:none;color:var(--ab-ask-ink);font:var(--ab-ask);text-align:left;cursor:pointer}
.dl-athena-bubble .dl-athena-ask:disabled{cursor:default;color:var(--ab-ask-ink)}
.dl-athena-bubble .dl-athena-ask:not(:disabled):hover,.dl-athena-bubble .dl-athena-ask[aria-expanded=true]{color:var(--ab-ask-hover)}
.dl-athena-line{margin:0 0 10px}
.dl-athena-faq{margin:0 0 11px;padding:9px 0 0;border-top:1px solid var(--ab-rule)}
.dl-athena-faq[hidden]{display:none}
.dl-athena-faq dt{margin:0 0 2px;font-weight:600}
.dl-athena-faq dd{margin:0 0 8px;color:var(--ab-dim)}
.dl-athena-doors{display:flex;flex-wrap:wrap;gap:7px}
.dl-athena-bubble .dl-athena-door{display:inline-flex;align-items:center;min-height:32px;padding:0 13px;border:1px solid var(--ab-door-line);border-radius:999px;
  background:var(--ab-door-bg);color:var(--ab-door-ink);font:var(--ab-door-font);text-decoration:none;cursor:pointer}
.dl-athena-bubble .dl-athena-door:hover{border-color:var(--ab-door-hover-line);background:var(--ab-door-hover-bg)}
.dl-athena-bubble .dl-athena-main{border-color:var(--ab-main-line);background:var(--ab-main-bg);color:var(--ab-main-ink)}
.dl-athena-bubble .dl-athena-main:hover{border-color:var(--ab-main-hover);background:var(--ab-main-hover)}
.dl-athena-bubble .dl-athena-ask:focus-visible,.dl-athena-bubble .dl-athena-door:focus-visible,.dl-athena-tap:focus-visible{outline:2px solid var(--ab-focus);outline-offset:3px}
.dl-athena[data-entering] .dl-athena-perch{visibility:hidden}
@media (prefers-reduced-motion: reduce){.dl-athena img,.dl-athena-perch.dl-athena-hop{animation:none}}
`;

/** mountLayer(opts) -> the layer's api. `topics`: [{id, sel, corner?, when?(ctx), say(doc) -> {line, ask: [[q, a]...], doors: [{label, act | href, main?}]}}];
 *  `act(what, api)`: the page's own doors; `corner`: true for DOCK.corner, or [right, bottom] px; `engine`: 'idle' (fetched when the page has a moment),
 *  'come' (at her first coming), 'never' (her sprite alone); `own`: her figure keeps its own colours; `skin`: {'--ab-*': value} on the bubble; `ask`, `label`;
 *  `purse`: {nest, refs?, Source?, now?} for THE FUEL IN HER TANK (dl-athena-purse.mjs), none for a page whose tank is its own. `sprite`, `aspect`,
 *  `share`, `smooth`: the figure's picture, its [w, h], its height in her square, and a drawn picture's smooth scaling (THE GUIDE IS YOUR SWARMY,
 *  dl-athena.mjs SWARMY: the visitor's own Lyssajudron in place of Athena's pixels); `wear(src)` dresses the figure again. `host`, `size`, `seen` (THE FLASK AT WORK, Nov 10 2026, the Spool's centre): she STANDS in the page's own box `host` (her layer its child, her square `size` px, never beside the pointer; her look still turns to it), and `seen(api)` is called on her engine's every picture. */
export function mountLayer({win = window, doc = document, fetcher = (...a) => fetch(...a), topics = [], act = () => {}, corner = true, engine = 'idle', host = null, size = 0, seen = null,
  lyssajudron = true, own = true, skin = null, ask = 'Got questions?', label = 'Athena', purse = null, files = undefined,
  sprite = ATHENA.href, aspect = ATHENA_WH, share = FIGURE.athena, smooth = false, modal = null, cap = 0} = {}) {   /* cap: the least ms between her engine's pictures on this page (0: every frame the display gives, the mint's); HER SIXTY IN HARMONY, Nov 11 2026 */
  const media = (q) => win.matchMedia?.(q)?.matches ?? false;
  const still = media('(prefers-reduced-motion: reduce)'), hover = media('(hover: hover) and (pointer: fine)'), side = size || (hover ? FIGURE.side : FIGURE.touch);
  const S = {x: 0, y: 0, vx: 0, vy: 0, target: null, pointer: null, under: null, dock: null, raf: 0, last: null, PE: null, RQ: null, inst: null, loading: null,
    leave: 0, sensed: false, scrolled: false, settle: 0, parked: false, box: {w: side, h: side}, bubbleH: 0, frames: 0, opened: 0,
    flights: 0, asked: 0, release: 0, wants: null, wantT: 0, waiting: true, entering: false, came: 0, disc: null, fuel: null, purse: null};
  const D = {pointer: null, at: [0, 0], v: [0, 0], last: 0, key: '', looks: 0, writes: 0, steps: 0};   // THE DEPTH: his pointer, the look as it stands and its speed, what was last written
  const ctx = {};   // the page half's own facts for a topic's `when` (the mint: held)
  const listeners = [], on = (target, type, fn, options) => { target.addEventListener(type, fn, options); listeners.push(() => target.removeEventListener(type, fn, options)); };
  const make = (tag, cls, text) => { const el = doc.createElement(tag); if (cls) el.className = cls; if (text != null) el.textContent = text; return el; };
  const view = () => ({w: doc.documentElement.clientWidth || win.innerWidth, h: win.innerHeight});
  const style = make('style'); style.textContent = CSS; doc.head.append(style);
  const layer = make('div', 'dl-athena-layer'), fig = make('div', 'dl-athena'), canvas = lyssajudron && engine !== 'never' ? make('canvas') : null, perch = make('span', 'dl-athena-perch'), her = make('img');
  const bubble = make('aside', 'dl-athena-bubble'); bubble.hidden = true; bubble.setAttribute('aria-label', label);
  if (skin) for (const [k, v] of Object.entries(skin)) bubble.style.setProperty(k, v);
  fig.setAttribute('aria-hidden', 'true'); if (own) fig.setAttribute('data-own-colours', ''); her.alt = ''; her.decoding = 'async'; her.src = sprite;
  if (smooth) fig.classList.add('dl-athena-smooth');
  if (canvas) { canvas.width = canvas.height = side; canvas.style.width = canvas.style.height = `${side}px`; }
  layer.setAttribute('data-waiting', ''); layer.inert = true;   // unseen and out of reach until the page says come()
  perch.append(her); if (canvas) fig.append(canvas); fig.append(perch); layer.append(fig, bubble); (host || doc.body).append(layer);

  function seat(crown) {   // Athena over the crown ([x, y] in the engine's square), and the box that holds the square and her
    const h = Math.round(side * share), w = Math.round(h * aspect[0] / aspect[1]), top = crown[1] - h * FIGURE.perch, over = Math.max(0, Math.ceil(-top));
    perch.style.cssText = `left:${(crown[0] - w / 2).toFixed(1)}px;top:${(top + over).toFixed(1)}px;width:${w}px;height:${h}px`;
    if (canvas) canvas.style.top = `${over}px`;
    S.box = {w: canvas ? side : w, h: canvas ? side + over : h};
    if (!canvas) perch.style.left = '0px';
    fig.style.width = `${S.box.w}px`; fig.style.height = `${S.box.h}px`;
    S.disc = S.inst ? discIn(centreOf(), crown, {top, height: h}, over) : null;   // THE FUEL IN HER TANK: her unit0 in her box's px, for the purse painter
  }
  const centreOf = () => { try { const c = S.PE.projectPoint(S.inst, [0, 0, 0]); return [c[0], c[1]]; } catch { return null; } };   // unit0's centre as the engine projects it
  function place() {
    fig.style.transform = `translate3d(${S.x.toFixed(1)}px, ${S.y.toFixed(1)}px, 0)`;
    if (bubble.hidden) return;   // the bubble stands where she lands (her target), never sweeping the page under the pointer while she flies there
    const [bx, by] = bubbleAt(S.target ?? [S.x, S.y], S.box, {w: BUBBLE.w, h: S.bubbleH}, view(), !!S.dock?.topic.corner, S.dock?.el?.getBoundingClientRect?.() ?? null);
    bubble.style.transform = `translate3d(${bx.toFixed(1)}px, ${by.toFixed(1)}px, 0)`;
  }
  const cornerAt = () => (host ? [0, side - S.box.h] : dockOf(null, 0, S.box, view(), corner || true));   // in a host: her square on the host's own, her head over it
  const rest = () => (hover && S.pointer && !S.waiting && !host ? besidePointer(S.pointer, S.box, view()) : cornerAt());   // undocked: beside the pointer; waiting, the corner
  // the engine's own ticker runs while she is shown; a reader who asked for less motion keeps its first picture
  const shown = () => !S.parked && (!S.waiting || layer.hasAttribute('data-coming'));
  const alive = (on = shown()) => { if (S.inst && !!S.inst.paused === on) S.PE.setActive(S.inst, on && !still); };

  // ---- THE DEPTH: the body turns toward his pointer, the sprite slides over it; stepped on the engine's own picture ----
  const centre = () => [S.x + S.box.w / 2, S.y + S.box.h / 2];
  /** look(at): his pointer ([x, y] viewport px; null: straight ahead): her look's target. Nothing moves here; the engine's next picture steps the spring. */
  function look(at) { if (still) return; const o = host && at ? host.getBoundingClientRect() : null; D.pointer = at && Number.isFinite(at[0]) && Number.isFinite(at[1]) ? [at[0] - (o ? o.left : 0), at[1] - (o ? o.top : 0)] : null; D.looks++; }   // in a host her box is in the host's px: the pointer too
  function depthStep(now) {   // on the engine's paint, before its next: the look's spring, then the camera's turn and the sprite's slide, written when they changed
    if (still) return false;
    const dt = D.last ? Math.min(0.05, Math.max(0, (now - D.last) / 1000)) : 1 / 60; D.last = now; D.steps++;
    const want = D.pointer ? lookOf(D.pointer, centre()) : [0, 0], r = lookStep(D.at, D.v, want, dt);
    D.at = r.at; D.v = r.v;
    if (!r.moving) return false;
    const d = depthOf(D.at), key = `${d.yaw.toFixed(3)},${d.pitch.toFixed(3)},${d.sprite[0].toFixed(1)},${d.sprite[1].toFixed(1)}`;   // a thousandth of a radian on unit0 is under a tenth of a px: the same picture, not written again
    if (key === D.key) return false;
    D.key = key; D.writes++;
    if (S.inst) { S.inst.lookYaw = d.yaw; S.inst.lookPitch = d.pitch; }
    perch.style.translate = `${d.sprite[0].toFixed(1)}px ${d.sprite[1].toFixed(1)}px`;
    return true;
  }
  const onPicture = () => { const now = win.performance?.now?.() ?? Date.now(), y = Math.round(-5 * (1 - Math.cos(now * Math.PI / 3400))) / 2; depthStep(now); if (y !== S.bob) her.style.translate = `0 ${S.bob = y}px`; /* HER FLOAT RIDES HER PICTURE (Nov 11 2026): the same 5 px over 3.4 s, a sample of the instant written at her own paint in half px, so nothing floats while her engine sleeps and the system's compositor runs no endless animation of hers */ if (S.purse) S.purse.sample(); };   // the engine's own paint: the depth, then the purse's sample (THE FUEL IN HER TANK)

  // ---- THE LOOP OF MESSAGES (harmony.html LYSA fly / land / settle, the engine's agent ballot) ----
  function fly(topic) {   // a question out: an organ leaves its lane for its chair on the radix (a topic's own chair, by its place in the list)
    const t = S.inst, seats = t ? (S.RQ.CANON.CHILDREN[t.name] || []).map((c) => c.seat) : [];
    if (!seats.length || still || S.parked) return;
    const chair = seats[Math.max(0, topics.indexOf(topic)) % seats.length];
    try {
      if (!t.agentVoting) { S.PE.beginAgentBallot(t, {id: `ask:${Date.now().toString(36)}`, units: [t.name], preview: true}); S.PE.scheduleAgentVotes(t, []); }
      S.PE.receiveAgentVote(t, {node: t.name, kind: 'pent', i: chair, v: 'abstain', reason: 'vote'});
      S.flights++; S.asked++;
    } catch (error) { console.warn('athena: fly', error); return; }
    win.setTimeout(land, LOOP.land_ms);
  }
  function land() {   // its answer lands: Athena hops; the last one down seals the radix and the gold wave radiates, then the release
    if (S.destroyed) return;
    hop();
    const t = S.inst; S.flights = Math.max(0, S.flights - 1);
    if (!t || !t.agentVoting || S.flights) return;
    try { S.PE.setAgentVerdict(t, t.name, 'RATUM'); settle(); } catch (error) { console.warn('athena: land', error); }
  }
  function hop() { perch.classList.remove('dl-athena-hop'); void perch.offsetWidth; perch.classList.add('dl-athena-hop'); }
  function settle() {   // the ballot ends on the engine's clock: its motion done and the radix resolved, or LOOP.settle_ms
    win.clearInterval(S.release); const t = S.inst, from = Date.now();
    S.release = win.setInterval(() => {
      if (!t.agentVoting) { win.clearInterval(S.release); return; }
      const done = !S.PE.hasPendingAgentMotion(t) && t.agentBallot?.resolved.has(t.name);
      if (done || Date.now() - from > LOOP.settle_ms) { win.clearInterval(S.release); try { S.PE.endAgentBallot(t); S.PE.setDiscussion(t, true); } catch { /* closed already */ } }
    }, LOOP.check_ms);
  }
  const live = () => topics.filter((t) => !t.when || t.when(ctx));
  const topicOf = (el) => topicIn(el, live());

  // ---- the bubble ----
  function door(d) {
    if (d.href) { const a = make('a', 'dl-athena-door', d.label); a.href = d.href; a.target = '_blank'; a.rel = 'noopener'; return a; }
    const b = make('button', `dl-athena-door${d.main ? ' dl-athena-main' : ''}`, d.label); b.type = 'button';
    b.addEventListener('click', () => act(d.act, api));
    return b;
  }
  function open(hit) {
    const s = hit.topic.say(doc, hit.el), askB = make('button', 'dl-athena-ask', s.asked || ask), faq = make('dl', 'dl-athena-faq'), doors = make('div', 'dl-athena-doors');
    for (const [q, a] of s.ask ?? []) if (a && (q || s.asked)) { if (q) faq.append(make('dt', '', q)); faq.append(make('dd', '', a)); }   // a topic's own question (`asked`) heads its first answer
    askB.type = 'button'; askB.disabled = !faq.childElementCount; askB.setAttribute('aria-expanded', 'false'); faq.hidden = true;
    askB.addEventListener('click', () => {   // asked: its answers open, and the question flies to its chair (THE LOOP OF MESSAGES)
      faq.hidden = !faq.hidden; askB.setAttribute('aria-expanded', String(!faq.hidden)); S.bubbleH = bubble.offsetHeight; place();
      if (!faq.hidden) fly(hit.topic);
    });
    for (const d of s.doors ?? []) if (d.label && (d.act || d.href)) doors.append(door(d));
    const line = make('p', 'dl-athena-line', s.line); line.setAttribute('aria-live', 'polite'); line.hidden = !s.line;
    bubble.replaceChildren(askB, line, faq, doors); bubble.dataset.topic = hit.topic.id; bubble.hidden = false; S.bubbleH = bubble.offsetHeight; S.opened++; place();
  }
  const close = () => { bubble.hidden = true; bubble.replaceChildren(); delete bubble.dataset.topic; };

  // ---- docks: a topic holds her where she stopped, riding it as the page scrolls ----
  function dockAt(hit, py) {
    const r = hit.el.getBoundingClientRect(), [x, y] = dockOf(r, py, S.box, view(), hit.topic.corner ? (corner || true) : false);
    S.dock = {...hit, dx: x - r.left, dy: y - r.top}; S.target = [x, y]; open(hit); go();
  }
  function dockPlace() {
    if (S.dock.topic.corner) return cornerAt();
    const r = S.dock.el.getBoundingClientRect(), v = view();
    return [clamp(r.left + S.dock.dx, FOLLOW.margin, v.w - S.box.w - FOLLOW.margin), clamp(r.top + S.dock.dy, FOLLOW.margin, v.h - S.box.h - FOLLOW.margin)];
  }
  function undock() {
    win.clearTimeout(S.leave); S.leave = 0; S.dock = null; close();
    S.target = rest(); go();
  }
  // what the pointer is on (with none yet: the middle of the screen, so a corner topic there is found)
  function sense() {
    if (S.parked || S.waiting || S.entering || S.settle) return;
    if (!hover) {   // no pointer to follow: a corner topic's bubble while it is in view (opened by itself: `auto`), the rest on a tap
      const v = view(), stop = topicIn(doc.elementFromPoint(v.w / 2, v.h / 2), live().filter((t) => t.corner));
      if (stop && !S.dock) { dockAt(stop, 0); S.dock.auto = true; } else if (!stop && S.dock?.auto) undock();
      return;
    }
    const under = S.under ?? (S.pointer ? null : doc.elementFromPoint(view().w / 2, view().h / 2));
    const onBubble = !bubble.hidden && bubble.contains(under), hit = onBubble ? null : topicOf(under);
    if (hit && S.dock?.el === hit.el) { win.clearTimeout(S.leave); S.leave = 0; intent(null); }
    else if (hit) { win.clearTimeout(S.leave); S.leave = 0; intent(hit); if (!S.dock && S.pointer) { S.target = rest(); go(); } }
    else if (S.dock) { intent(null); if (onBubble) { win.clearTimeout(S.leave); S.leave = 0; } else if (!S.leave) S.leave = win.setTimeout(() => { S.leave = 0; undock(); }, GRACE_MS); }
    else { intent(null); if (S.pointer) { S.target = rest(); go(); } }
  }
  function intent(hit) {   // HOVER INTENT: the topic under the pointer takes her once it has held the pointer DWELL_MS (SWITCH_MS from another topic)
    if (hit && S.wants?.el === hit.el) return;
    win.clearTimeout(S.wantT); S.wants = hit; S.wantT = 0;
    if (!hit) return;
    S.wantT = win.setTimeout(() => {
      S.wantT = 0; const want = S.wants; S.wants = null;
      const now = topicOf(S.under ?? doc.elementFromPoint(view().w / 2, view().h / 2));
      if (want && now?.el === want.el && !S.parked && !S.waiting) dockAt(want, S.pointer?.[1] ?? view().h / 2);
    }, S.dock ? SWITCH_MS : DWELL_MS);
  }

  // ---- the one loop: it runs while she travels, and stops when she settles ----
  function frame(now) {
    S.raf = 0; S.frames++;
    if (S.scrolled) { S.scrolled = false; if (S.dock) S.target = dockPlace(); if (S.pointer) S.under = doc.elementFromPoint(...S.pointer); }
    if (S.sensed) { S.sensed = false; sense(); }
    if (!S.target) return;
    const dt = S.last == null ? 1 / 60 : Math.min(0.05, (now - S.last) / 1000), [tx, ty] = S.target;
    S.last = now;
    if (still) { S.x = tx; S.y = ty; S.vx = S.vy = 0; }
    else { [S.x, S.vx] = followStep(S.x, S.vx, tx, dt); [S.y, S.vy] = followStep(S.y, S.vy, ty, dt); }
    const speed = Math.hypot(S.vx, S.vy);
    place();
    if (Math.abs(S.x - tx) < FOLLOW.settle_px && Math.abs(S.y - ty) < FOLLOW.settle_px && speed < FOLLOW.settle_v) {
      S.x = tx; S.y = ty; S.vx = S.vy = 0; S.last = null; place(); return;
    }
    S.raf = win.requestAnimationFrame(frame);
  }
  function go() { if (!S.destroyed && !S.raf) S.raf = win.requestAnimationFrame(frame); }

  // ---- her coming and her going ----
  function landed() {   // where she goes once she is here: a corner topic under the pointer docks her at once, else beside the pointer (or the corner)
    if (S.pointer) S.under = doc.elementFromPoint(...S.pointer);
    const v = view(), hit = hover ? topicOf(S.under ?? doc.elementFromPoint(v.w / 2, v.h / 2)) : null;   // a screen with no hover has no topic under a pointer (and `false?.topic` threw here)
    if (hit?.topic.corner) dockAt(hit, 0); else { S.target = rest(); S.sensed = true; go(); }
  }
  /** come({from, then}): she is here. `from` [x, y] (viewport px): her figure starts centred there and springs to her place (the window's ball);
   *  `then(land)`: the page's own entrance first (the mint's), which calls `land` when done. */
  function come({from = null, then = null} = {}) {
    if (S.destroyed || !S.waiting) return;
    S.waiting = false; S.came++;
    layer.removeAttribute('data-waiting'); layer.removeAttribute('data-coming'); layer.style.opacity = ''; layer.inert = false;
    if (engine === 'come') figure();
    if (from) { S.x = from[0] - S.box.w / 2; S.y = from[1] - S.box.h / 2; S.vx = S.vy = 0; place(); }
    alive();
    if (then) then(landed); else landed();
  }
  /** hide(): back to waiting, unseen and out of reach; nothing runs. */
  function hide() {
    win.clearTimeout(S.leave); S.leave = 0; win.clearTimeout(S.wantT); S.wantT = 0; S.wants = null; S.dock = null; close();
    if (S.raf) { win.cancelAnimationFrame(S.raf); S.raf = 0; } S.last = null; S.target = null; S.vx = S.vy = 0;
    S.waiting = true; layer.setAttribute('data-waiting', ''); layer.removeAttribute('data-coming'); layer.inert = true; alive(false);
  }

  // ---- causes ----
  on(win, 'pointermove', (e) => {
    if (!hover || e.pointerType === 'touch') return;
    S.pointer = [e.clientX, e.clientY]; S.under = e.target; if (S.waiting) return; look(S.pointer); S.sensed = true; go();
  }, {passive: true});
  on(win, 'scroll', () => {   // she rides her topic while the page moves; what the pointer is on is read once it has settled
    if (S.waiting) return;
    S.scrolled = true; win.clearTimeout(S.settle);
    S.settle = win.setTimeout(() => { S.settle = 0; S.sensed = true; go(); }, SCROLL_MS); go();
  }, {passive: true});
  on(win, 'resize', () => { if (S.waiting) return; S.target = S.dock ? dockPlace() : rest(); S.sensed = true; go(); }, {passive: true});
  on(doc, 'keydown', (e) => { if (e.key === 'Escape' && S.dock) undock(); });
  on(doc, 'focusin', (e) => {   // a keyboard on a topic docks her there as a pointer would
    if (!hover || S.waiting || bubble.contains(e.target)) return;
    const hit = topicOf(e.target); if (hit && S.dock?.el !== hit.el) { const r = hit.el.getBoundingClientRect(); dockAt(hit, r.top + Math.min(r.height, view().h) / 2); }
  });
  const park = () => {   // a modal dialog (the checkout, the chamber, the window's settings) is the page's top while it is open; so is the page's own `modal`
    const on = !!doc.querySelector('dialog[open]') || (!!modal && !!doc.querySelector(modal));
    if (on === S.parked) return;
    S.parked = on; layer.toggleAttribute('data-parked', on); alive();
    if (on && S.dock) { S.dock = null; close(); } else if (!on && !S.waiting) { S.sensed = true; go(); }
  };
  const observer = new win.MutationObserver(park);   // a page `modal` (her making, for the Swarmy) is a class and a node, not a dialog's open
  observer.observe(doc.body, modal ? {subtree: true, childList: true, attributes: true, attributeFilter: ['open', 'class', 'data-world-open', 'data-film-going']} : {subtree: true, attributes: true, attributeFilter: ['open']});   // data-world-open: the world at the film's end (warm-spatial.js)
  if (modal) park();
  if (!hover) {   // a tap on her: the topic most in view (its share of the screen's height); again: closed
    fig.classList.add('dl-athena-tap'); fig.removeAttribute('aria-hidden'); fig.setAttribute('role', 'button'); fig.setAttribute('aria-label', `${ask} Ask ${label}`); fig.tabIndex = 0;
    const tap = () => {
      if (S.dock) { undock(); return; }
      const v = view(); let best = null, most = 0;
      for (const topic of live()) for (const el of doc.querySelectorAll(topic.sel)) {
        const r = el.getBoundingClientRect(), seen = Math.max(0, Math.min(r.bottom, v.h) - Math.max(r.top, 0));
        if (seen > most) { most = seen; best = {topic, el}; }
      }
      if (best) { S.dock = {...best, dx: 0, dy: 0, topic: {...best.topic, corner: true}}; S.target = cornerAt(); open(best); go(); }
    };
    fig.addEventListener('click', tap);
    fig.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); tap(); } });
  }

  // ---- her figure: Athena at once, the original lyssajudron when the page has a moment (or at her coming) ----
  seat([side / 2, side * 0.2]);   // where the crown stands at this size; read from the engine once it paints
  [S.x, S.y] = cornerAt(); S.target = [S.x, S.y]; place();
  function figure() {
    if (S.destroyed || !canvas || S.loading) return S.loading;
    S.loading = engineOf({fetcher, win, files}).then(({PE, RQ}) => {
      if (S.destroyed) return;
      S.PE = PE; S.RQ = RQ; S.inst = PE.mount(canvas, {...figureOptions(RQ, side), ...(cap > 0 ? {fpsCap: cap} : {}), veiled: () => doc.hidden || !shown()});
      S.inst.W = side; her.style.animation = 'none'; /* her float is her picture's from here (onPicture); the sheet's float stays for her alone, while no engine paints */ PE.setDiscussion(S.inst, true); S.inst.discussionViewYaw = FIGURE.yaw; S.inst.onSceneFrame = onPicture; if (seen) S.inst.onSceneFrame = () => { onPicture(); seen(api); };   // THE DEPTH rides the engine's own paint; then the page's own reading of her (`seen`)
      PE.drawOnce(S.inst); if (still || !shown()) PE.setActive(S.inst, false);   // its first picture; then the engine's own ticker, as in Harmony's corner, while she is shown
      const p = PE.projectPoint(S.inst, [0, S.inst.scale * (S.inst.discussionFit || 1), 0]);   // her perch: the top of the radix (harmony.html crown())
      if (Number.isFinite(p?.[0]) && Number.isFinite(p?.[1])) { seat(p); if (!S.waiting) S.target = S.dock ? dockPlace() : rest(); }
      if (purse) tank();
      S.sensed = true; go();
    }).catch((error) => {   // a failed load is not her last word: the next try after a pause (5 s, then doubling to a minute), while the layer stands
      console.warn('athena: the original lyssajudron did not load; she floats alone until the next try', error);
      S.loading = null; S.tries = (S.tries || 0) + 1;
      if (!S.destroyed) win.setTimeout(figure, Math.min(60000, 5000 * 2 ** (S.tries - 1)));
    });
    return S.loading;
  }
  function tank() {   // THE FUEL IN HER TANK (dl-athena-purse.mjs): the one page's purse painter in her square under her perch, fed by the Nest, once her engine stands
    if (S.fuel || !S.inst || !canvas || !purse) return S.fuel;
    S.fuel = import('./dl-athena-purse.mjs')
      .then((m) => m.mountPurseIn({doc, box: fig, before: perch, disc: () => S.disc, fetcher, dpr: Math.min(2, win.devicePixelRatio || 1), ...purse}))
      .then((F) => { if (S.destroyed) { F.close(); return F; } S.purse = F; return F; })   // the engine's own paint (onPicture): the purse samples once per picture while she is shown
      .catch((error) => { console.warn('athena: the purse did not mount; her tank stands as her engine drew it', error); S.fuel = null; return null; });
    return S.fuel;
  }
  if (engine === 'idle' && canvas) { const idle = win.requestIdleCallback ? (f) => win.requestIdleCallback(f, {timeout: 2500}) : (f) => win.setTimeout(f, 1200); idle(figure); }

  const api = {
    come, hide, alive, undock, dockAt, place, go, hop, figure, live, topicOf, view, ctx, els: {layer, fig, canvas, perch, her, bubble}, look, depthStep,
    wear(src) { if (!S.destroyed && typeof src === 'string' && src) her.src = src; },
    destroy() {
      if (S.destroyed) return;
      hide(); S.destroyed = true; win.clearTimeout(S.settle); win.clearInterval(S.release);
      observer.disconnect(); for (const off of listeners.splice(0)) off();
      if (S.inst) S.inst.onSceneFrame = null;
      S.purse?.close(); layer.remove(); style.remove();
    },
    hover, still, side, corner: cornerAt, rest, box: () => S.box, waiting: () => S.waiting, parked: () => S.parked, purse: () => S.purse, disc: () => S.disc,
    /** twelve(away): THE TWELVE ARE THE UNIT1S (Nov 8 2026, room/one-agents-glass.mjs): her satellites by chair (the child on seat c), then unit0, [x, y, r, depth] in the page's px as her engine stands them now (null: not shown); her engine leaves out the chairs whose unit1 is away (bit c of `away`) until said again */
    twelve(away = 0, crowns = null) { const t = S.inst, PE = S.PE; if (t) { t.bareMask = away | 0; if (crowns) t.crowns = crowns; } if (!t || !canvas || !shown() || t.paused) return null; const L = PE.layoutAt(t), b = canvas.getBoundingClientRect(), k = b.width / side, out = new Array(13).fill(null), at = (o) => { const p = PE.projectPoint(t, o.off); return [b.left + p[0] * k, b.top + p[1] * k, o.scale * p[3] * k, p[2]]; };
      for (const c of (t.children || S.RQ.CANON.CHILDREN)[t.name] || []) if (L[c.to] && c.seat < 12) out[c.seat] = at(L[c.to]); out[12] = at(L[t.name]); return out; }, burn(on, tree = null) { /* BURN MY COSMOS (his Nov 19 2026, THE-BURN-MY-COSMOS-LANDING.md): her figure burns (the sheet, data-burnt); at 0.3 s the voting lyssajudron stands on the scene module's tree, her goals growing out of her pentagons to their orbits in 1.3 s; back, they fold in 0.7 s and she returns */ if (S.destroyed || !S.PE || !canvas) return false; const PE = S.PE, now = () => win.performance.now(); win.clearTimeout(S.burnT); win.clearTimeout(S.burnT2); if (on) { if (!tree) return false; fig.removeAttribute('data-unburn'); fig.setAttribute('data-burnt', ''); S.burnT = win.setTimeout(() => { if (S.destroyed) return; if (S.inst) PE.unmount(S.inst); S.loading = null; const t = S.inst = PE.mount(canvas, {...figureOptions(S.RQ, side), ...tree, childScale: 0.42, orbitBeadAt: 3, glass: 0, xray: false, ...(cap > 0 ? {fpsCap: cap} : {}), veiled: () => doc.hidden || !shown()}); t.W = side; PE.setDiscussion(t, true); t.discussionViewYaw = FIGURE.yaw; fig.toggleAttribute('data-burn', true); const O = t.orbit, C = t.childScale, t0 = now(); t.orbit = 1; t.childScale = 1e-3; t.onSceneFrame = () => { const k = Math.min(1, (now() - t0) / 1300), e = 1 - (1 - k) ** 3; if (t.childScale !== C) { t.orbit = 1 + (O - 1) * e; t.childScale = k < 1 ? Math.max(1e-3, C * e) : C; } if (seen) seen(api); }; }, 300); return true; } const t = S.inst, back = () => { if (S.destroyed) return; if (S.inst) PE.unmount(S.inst); S.inst = null; S.loading = null; fig.toggleAttribute('data-burn', false); fig.removeAttribute('data-burnt'); fig.setAttribute('data-unburn', ''); S.burnT2 = win.setTimeout(() => fig.removeAttribute('data-unburn'), 950); return figure(); }; if (t && fig.hasAttribute('data-burn')) { const O = t.orbit, C = t.childScale, t0 = now(); t.onSceneFrame = () => { const k = Math.min(1, (now() - t0) / 700), e = k * k * k; t.orbit = O - (O - 1) * e; t.childScale = Math.max(1e-3, C * (1 - e)); if (seen) seen(api); }; S.burnT = win.setTimeout(back, 720); } else back(); return true; },
    entering(on) { S.entering = !!on; fig.toggleAttribute('data-entering', !!on); },
    state: () => ({hover, still, at: [Math.round(S.x), Math.round(S.y)], target: S.target && S.target.map(Math.round), docked: S.dock?.topic.id ?? null,
      bubble: bubble.hidden ? null : bubble.dataset.topic, parked: S.parked, engine: !!S.inst, live: !!S.inst && !S.inst.paused, animT: Math.round(S.inst?.animT ?? 0),
      ballot: !!S.inst?.agentVoting, asked: S.asked, frames: S.frames, opened: S.opened, waiting: S.waiting, came: S.came, entering: S.entering,
      purse: S.purse ? S.purse.state() : null, disc: S.disc,
      depth: {look: D.at.map((v) => Math.round(v * 1000) / 1000), pointer: D.pointer, looks: D.looks, steps: D.steps, writes: D.writes, yaw: S.inst?.lookYaw ?? 0, pitch: S.inst?.lookPitch ?? 0, sprite: perch.style.translate || ''}}),
  };
  return api;
}
