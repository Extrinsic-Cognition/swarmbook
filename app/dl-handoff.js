// dl-handoff.js: HER CARD ON THE MAC, the page's half of her step out of the screen (dl-handoff.mjs holds the law; harmony-clip/ is the phone's
// half). Mounted on ?handoff=<road>: lan, the house's road (the dev server names the house's Nest and this glass, /dev/lan) and a code that opens
// DysonLight by its scheme; clip, the same and a code with the App Clip's address (a paid team's, dl-handoff.mjs THE CODE). When she has landed
// (dl-athena.js's landed), her card comes up over the page: her perch (assets/her-perch.png) with her own sprite laid over it at CARD.her, every
// pixel whole at a whole number of the screen's pixels, held still for the phone's camera; beside it the code that opens the phone's half with this
// visit, the house's Nest, this glass and the card's place on it (THE CARD IS A MARKER IN THE TWIN: the phone joins the room by it).
// THE HANDOFF JOINS THE ONENESS: her words come back on the house's own stream (<nest>/nest/stream?types=her.handoff, the phone's signed entries),
// and the page acts at each word's instant on the house clock (at_ms, the station's count read by the phone; instantOf by this page's offset to the
// Nest's head), never on the message's arrival: caught (her pixels go off the card, dithered as she fades on the page, at the same instant the phone
// lays her over herself) and landed (she stands in the room). Her small self in the corner stays hidden while the card is up. SHE STAYS GONE
// (dl-handoff.mjs HER ROUND): the page keeps that she left in this round, so a reload shows her perch without her; calling her back starts a new
// round, her pixels return to the card and the code carries the new round. The lines are placeholders, his to write. window.dlHandoff = {open, close,
// callBack, state}. Nothing at rest: one head read at open, one stream while the card is up, a timer only for a word already heard.
// HER CARD IS THE PICK'S (Nov 2 2026; dl-handoff.mjs holds the law): in the house the card is the account's own, as its pick made it (character/warden's card:
// its perch and her sprite by sha256), each read from the Nest's blob door (it answers its own Mac) or the module laid beside this page (left-bodies/<sha256>.mjs,
// tools/embertide-mesh/onboarding-pick.mjs) and kept only when it hashes right; the code then names it for the phone (k=, h=). No pick, or a picture neither
// road gives: the product's card, as before. One read of the warden at open and its two pictures, nothing more.
import {CARD, CLIP_URL, APP_URL, KEEP_KEY, WORD_TYPE, clipLink, keptOf, wordOf, cardPlace, instantOf, offsetOf} from './dl-handoff.mjs?v=handoff-3';
import {isVisitId} from './harmony-link.mjs';
import {SEEN_EVENT} from './dl-visit.mjs?v=visit-1';
import {loadQR, qrSVG} from './dl-seat-card.mjs';

export const HANDOFF_Z = 2147483001;   // over her own layer (dl-athena.js LAYER_Z)
export const LEAVE_MS = 520;   // her pixels going off the card, as long as her fade in over herself on the phone (StepOut.reveal) and a little more
const SPRITE = new URL('./assets/her-sprite.png', import.meta.url), PERCH = new URL('./assets/her-perch.png', import.meta.url);
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];

/** cardScale(view, dpr): the card's size in css px at the largest whole number of screen pixels per card pixel that fits beside its code. Pure. */
export function cardScale({w, h}, dpr = 1) {
  const fit = Math.min((h * 0.78) / CARD.height, (w * 0.5) / CARD.width) * dpr;
  return Math.max(1, Math.floor(fit)) / dpr;
}

const CSS = `
.dl-handoff{position:fixed;inset:0;z-index:${HANDOFF_Z};display:flex;align-items:center;justify-content:center;gap:clamp(20px,4vw,56px);
  background:rgba(5,4,5,.82);opacity:0;transition:opacity .45s ease}
.dl-handoff.on{opacity:1}
.dl-handoff-card{position:relative;flex:none;image-rendering:pixelated;box-shadow:0 0 0 1px rgba(201,164,90,.25),0 24px 80px rgba(0,0,0,.6)}
.dl-handoff-card img,.dl-handoff-card canvas{position:absolute;display:block;image-rendering:pixelated}
.dl-handoff-side{display:flex;flex-direction:column;align-items:center;gap:14px;color:#fbf4e2;font:400 clamp(14px,1.3vw,18px)/1.35 'Gelasio',Georgia,serif;
  max-width:240px;text-align:center}
.dl-handoff-code{width:clamp(150px,15vw,220px);aspect-ratio:1;background:#fbf4e2;padding:6px;border-radius:4px}
.dl-handoff-code svg{display:block;width:100%;height:100%}
.dl-handoff-close{position:absolute;top:18px;right:22px;background:none;border:0;color:#fbf4e2;font:300 28px/1 system-ui;opacity:.6;cursor:pointer}
.dl-handoff-close:hover{opacity:1}
.dl-handoff-back{background:none;border:1px solid rgba(251,244,226,.4);border-radius:999px;color:#fbf4e2;font:inherit;font-size:.85em;padding:.35em .9em;cursor:pointer}
.dl-handoff-back[hidden]{display:none}
html[data-handoff] .dl-athena-layer{visibility:hidden}
@media (max-width:760px){.dl-handoff{flex-direction:column}}
@media (prefers-reduced-motion: reduce){.dl-handoff{transition:none}}
`;

/** mountHandoff({win, doc, road}): her card, shown once she has landed (or at open()), and the clip's words heard. */
export function mountHandoff({win = window, doc = document, road = new URLSearchParams(win.location.search).get('handoff')} = {}) {
  const storage = (() => { try { return win.localStorage; } catch { return null; } })();
  const S = {road, open: false, house: null, offset: null, word: null, link: null, visit: null, round: 1, left: false, picked: null};   // house: {nest, glass} from /dev/lan; offset: the house clock less this page's (ms)
  const make = (tag, cls, text) => { const el = doc.createElement(tag); if (cls) el.className = cls; if (text != null) el.textContent = text; return el; };
  const style = make('style'); style.textContent = CSS; doc.head.append(style);
  const layer = make('div', 'dl-handoff'), card = make('div', 'dl-handoff-card'), perch = make('img'), her = make('canvas');
  const ASK = 'Open your iPhone’s camera on this code.', WITH_YOU = 'She is with you now.', NO_HOUSE = 'This page is not in the house: the dev server names no Nest or glass (--nest, --glass).';
  const side = make('div', 'dl-handoff-side'), code = make('div', 'dl-handoff-code'), line = make('p', null, ASK), back = make('button', 'dl-handoff-back', 'Call her back');
  const close = make('button', 'dl-handoff-close', '×');
  close.type = 'button'; close.setAttribute('aria-label', 'Close');
  perch.alt = ''; perch.src = PERCH.href; her.width = CARD.her.w; her.height = CARD.her.h; her.setAttribute('aria-label', 'Nefertiti');
  back.type = 'button'; back.hidden = true;
  card.append(perch, her); side.append(code, line, back); layer.append(card, side, close);
  let pixels = null, stream = null;
  const paint = (src) => {   // her sprite on the card's canvas, its pixels kept for her leaving
    const sprite = new win.Image();
    sprite.src = src;
    return sprite.decode().then(() => { const g = her.getContext('2d'); g.clearRect(0, 0, her.width, her.height); g.drawImage(sprite, 0, 0); pixels = g.getImageData(0, 0, her.width, her.height); }).catch(() => {});
  };
  let drawn = paint(SPRITE.href);

  const fit = () => {   // a whole number of screen pixels per card pixel, so the camera sees the clip's own picture
    const k = cardScale({w: win.innerWidth, h: win.innerHeight}, win.devicePixelRatio || 1);
    card.style.cssText = `width:${CARD.width * k}px;height:${CARD.height * k}px`;
    perch.style.cssText = `left:0;top:0;width:${CARD.width * k}px;height:${CARD.height * k}px`;
    her.style.cssText = `left:${CARD.her.x * k}px;top:${CARD.her.y * k}px;width:${CARD.her.w * k}px;height:${CARD.her.h * k}px`;
  };
  const keep = () => { try { storage?.setItem(KEEP_KEY, JSON.stringify({visit: S.visit, round: S.round, left: S.left})); } catch { /* storage refused: she is kept as long as the page */ } };
  const dither = (leaving, ms) => {   // her pixels going off the card (or coming back to it), in the order her fade on the page thins her (a 4x4 ordered dither)
    if (!pixels) return;
    const g = her.getContext('2d'), t0 = win.performance.now(), out = new win.ImageData(new Uint8ClampedArray(pixels.data), pixels.width, pixels.height);
    const step = (now) => {
      const t = ms > 0 ? Math.min(1, (now - t0) / ms) : 1;
      for (let i = 0, y = 0; y < out.height; y++) for (let x = 0; x < out.width; x++, i += 4) {
        const gone = (BAYER[(y % 4) * 4 + (x % 4)] + 0.5) / 16 <= (leaving ? t : 1 - t);
        out.data[i + 3] = gone ? 0 : pixels.data[i + 3];
      }
      g.putImageData(out, 0, 0);
      if (t < 1) win.requestAnimationFrame(step);
    };
    if (ms > 0) win.requestAnimationFrame(step); else step(t0);
  };
  const gone = () => { line.textContent = WITH_YOU; back.hidden = false; };
  const heard = (word) => {
    if ((word.round ?? 1) !== S.round) return;   // a word of another round: not this card's
    S.word = word.event;
    if (!S.left) { S.left = true; keep(); dither(true, LEAVE_MS); }   // caught, or a landing whose catch was not heard: she has left the card
    if (word.event === 'landed') gone();
  };
  const draw = async () => {   // the code for this visit and round: the house's Nest, this glass and the card's place on it ride it
    const house = S.house?.nest && S.house?.glass ? {nest: S.house.nest, glass: S.house.glass, card: cardPlace(card.getBoundingClientRect(), {w: win.innerWidth, h: win.innerHeight}), picked: S.picked} : null;
    S.link = S.visit ? clipLink(S.visit, house, S.road === 'clip' ? CLIP_URL : APP_URL, S.round) : null;
    const svg = S.link ? qrSVG(await loadQR(doc), S.link) : null;
    if (svg) code.innerHTML = svg; else line.textContent = 'No code: this page has no visit.';
  };
  /** callBack(): she comes back to the Mac: a new round, her pixels return to the card, and the code carries the new round. */
  async function callBack() {
    S.round += 1; S.left = false; S.word = null; keep();
    line.textContent = S.house?.nest && S.house?.glass ? ASK : NO_HOUSE; back.hidden = true;
    dither(false, LEAVE_MS);
    await draw();
  }
  const timers = new Set();
  const at = (word) => {   // THE INSTANT: the word's house instant on this page's clock; a word whose instant has passed is acted on now
    const when = instantOf(word, S.offset), delay = when == null ? 0 : Math.max(0, when - Date.now());
    const t = win.setTimeout(() => { timers.delete(t); heard(word); }, delay); timers.add(t);
  };
  const listen = (visit) => {   // her words on the house's own stream: the phone's signed entries of WORD_TYPE for this visit
    if (stream || !visit || !S.house?.nest || typeof win.EventSource !== 'function') return;
    stream = new win.EventSource(`${S.house.nest}/nest/stream?types=${WORD_TYPE}`);
    stream.onmessage = (e) => {
      let entry; try { entry = JSON.parse(e.data); } catch { return; }
      if (!entry || entry.type !== WORD_TYPE) return;
      const word = wordOf(entry.payload, isVisitId);
      if (word && word.visit === visit) at(word);
    };
  };
  const clock = async (nest) => {   // this page's offset to the house clock: one read of the Nest's head, the Mac's ms at the trip's middle
    const t0 = Date.now();
    const j = await win.fetch(`${nest}/nest/head`, {cache: 'no-store'}).then((r) => (r.ok ? r.json() : null)).catch(() => null);
    return j ? offsetOf(j.server_ms, t0, Date.now()) : null;
  };

  /** wardenCard(nest): HER CARD IS THE PICK'S: the account's card as its pick made it, {perch, sprite} as addresses of their checked bytes and {card,
   *  spriteSha} by sha256; null: the product's card. The character's law is read only here, on the house's road (the public mint names no Nest). */
  const wardenCard = async (nest) => {
    try {
      const {characterOf, WARDEN_ID, WARDEN_REF} = await import('../vendor/embertide-app/ui/intro/room/character-fact.mjs');
      const j = await win.fetch(`${nest}/nest/ref/${WARDEN_REF}`, {cache: 'no-store'}).then((r) => (r.ok ? r.json() : null));
      const own = characterOf(j?.ref?.value, WARDEN_ID)?.card;
      if (!own) return null;
      const [perchAt, spriteAt] = await Promise.all([picture(nest, own.perch), picture(nest, own.sprite)]);
      return perchAt && spriteAt ? {perch: perchAt, sprite: spriteAt, card: own.card, spriteSha: own.sprite} : null;
    } catch { return null; }
  };
  /** picture(nest, sha): a picture by its sha256, from the Nest's blob door (it answers its own Mac only) or the module laid beside this page, kept only when
   *  its bytes hash right, as an address of this page's; null when neither road gives it. */
  const picture = async (nest, sha) => {
    const hex = async (b) => [...new Uint8Array(await win.crypto.subtle.digest('SHA-256', b))].map((x) => x.toString(16).padStart(2, '0')).join('');
    const roads = [
      () => win.fetch(`${nest}/nest/blob/${sha}`, {cache: 'no-store'}).then((r) => (r.ok ? r.arrayBuffer() : Promise.reject(new Error(String(r.status))))),
      () => import(new URL(`../../room/left-bodies/${sha}.mjs`, import.meta.url).href).then((m) => Uint8Array.from(win.atob(m.glb), (c) => c.charCodeAt(0)).buffer),
    ];
    for (const road of roads) {
      try { const b = await road(); if (await hex(b) === sha) return win.URL.createObjectURL(new win.Blob([b], {type: 'image/png'})); } catch { /* the next road */ }
    }
    return null;
  };

  async function open() {
    if (S.open) return;
    S.open = true;
    fit(); doc.body.append(layer); doc.documentElement.dataset.handoff = '';
    win.requestAnimationFrame(() => layer.classList.add('on'));
    S.visit = win.dlVisit?.state?.().id ?? null;
    const kept = keptOf((() => { try { return storage?.getItem(KEEP_KEY) ?? null; } catch { return null; } })(), S.visit);
    S.round = kept.round; S.left = kept.left;
    if (S.road === 'lan' || S.road === 'clip') S.house = await win.fetch('/dev/lan', {cache: 'no-store'}).then((r) => (r.ok ? r.json() : null)).then((j) => (j?.nest ? {nest: String(j.nest).replace(/\/+$/, ''), glass: j.glass ?? null} : null)).catch(() => null);
    if (S.house?.nest) S.offset = await clock(S.house.nest);
    const own = S.house?.nest ? await wardenCard(S.house.nest) : null;   // HER CARD IS THE PICK'S: the account's card, else the product's
    if (own) { perch.src = own.perch; drawn = paint(own.sprite); S.picked = {card: own.card, sprite: own.spriteSha}; }
    if (!S.house?.nest || !S.house?.glass) line.textContent = NO_HOUSE;
    await draw();
    await drawn;
    if (S.left) { dither(true, 0); gone(); }   // she left in this round: her perch without her
    listen(S.visit);
  }
  function close_() {
    if (!S.open) return;
    S.open = false;
    layer.classList.remove('on'); delete doc.documentElement.dataset.handoff;
    win.setTimeout(() => layer.remove(), 450);
    stream?.close(); stream = null;
    for (const t of timers) win.clearTimeout(t);
    timers.clear();
  }
  close.addEventListener('click', close_);
  back.addEventListener('click', () => void callBack());
  win.addEventListener('resize', () => { if (S.open) { fit(); void draw(); } });   // the card's place on the glass moved: the code carries the new one
  doc.addEventListener(SEEN_EVENT, (e) => { if (e.detail?.type === 'landed') void open(); });
  const api = {open, close: close_, callBack, state: () => ({...S})};
  win.dlHandoff = api;
  return api;
}

if (typeof window !== 'undefined' && typeof document !== 'undefined' && new URLSearchParams(window.location.search).has('handoff')) mountHandoff();
