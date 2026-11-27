// dl-athena-film.js · ATHENA BRINGS THE GOVERNANCE FILM (lane/athena-brings-the-governance-film, Oct 29 2026). His words, UTC, over the demo video's flow
// (the renegades' film, Athena arrives, "Give me my colours."): 16:40 "i would add a step after 2, the step where athena brings the attention to the other
// mint video about governance... you get what i mean?"; 16:41 "you will bring up the new video and let the user independent, you dont want to walk hand in
// hand...". Before them, 16:28: "there are 2 videos in this fucking thing".
//
// THE STEP: when she lands (dl-athena.js 'landed' on SEEN_EVENT: after the film, after a skip to the mint, or at a holder's film end), the page's second
// film (#purpose, warm-galaxy-player.js: Claudio's twelve pentagons round the human hexagon, the humans voting in both chambers, the swarms founding swarms)
// flies out of her corner as a card on her own stage, over the held hero: its first frame and its name. Nothing is asked and nothing waits on it. A press
// opens it on a stage with its sound; there it pauses, or closes back to the card; the card's × lets it go for good; ignored, it stands in the corner.
// Words only where the visitor acts (his Oct 29 2026 06:07 UTC rule): the card's name, the stage's buttons and its count.
// THE ROAD IS ONE TAKE (his Oct 30 2026 08:09:46 UTC "i think it could be smoother", over the card pinned on the creator's corner): her making is the whole
// screen now (dl-her-colours.js, the creator), so while it holds her landing ('waiting') the card waits for her to be made ('made'), as the rebate does,
// and nothing sits on the creator.
// THE SOUND (CLAUDE.md, The rule, item 8): the picture is the #purpose player's own muted cut (warm-media/film-mothership-1: the same bytes, the same cache
// entries); the sound is its Fantasia soundtrack by the same law (warm-journey-soundtrack.js: put at the picture's second, only inside its seekable ranges,
// never the other way). A tap on Sound mutes or unmutes the soundtrack alone: nothing here ever writes the picture's time. At the picture's end the sound
// leaves with it over FADE_S instead of being cut (dl-twelve.js FREEZE_FADE's grammar); a press on Replay starts the picture again from its first frame.
// STACKING: FILM_Z is the rebate's height (dl-space-router.js ROUTER_Z), over her making and her own layer (2147483000); the rebate, appended when it slams
// in, stands over this layer, and while it stands (html[data-space-router]) the card is unseen and a stage that was open has closed.
// COST: nothing until she lands (one listener); then a card (its poster: 48 KB, 41 KB on a phone) and no timer. The film's bytes (24 MB, 19 MB on a phone)
// and its soundtrack's (5.6 MB) are asked for on the first press only. Playing: the decoder's own work, the count and the sound's alignment on the film's
// timeupdate, and the fade's frames over its last seconds alone. At rest, and once let go, nothing.
import {createJourneySoundtrack} from './warm-journey-soundtrack.js?v=audio-carry-1';   // the #purpose player's own sound law, the same module
import {FIGURE} from './dl-athena.mjs';   // her square: the card leaves from its middle

export const SEEN_EVENT = 'dl-athena';   // dl-athena.js's word (her 'landed', and her making's 'made'): named here, not imported, as importing her module would mount her
export const FILM_Z = 2147483001;   // the rebate's height (dl-space-router.js ROUTER_Z): over her making (dl-her-colours.js HER_Z) and her layer; the rebate comes after it
export const NAME = 'Governance';   // his word for the film, the card's one word
export const WORDS = Object.freeze({play: 'Play', pause: 'Pause', replay: 'Replay', again: 'Try again', on: 'Sound on', off: 'Sound off', close: '×'});
export const JOURNEY_S = 51;   // the cut's length (warm-galaxy-player.js JOURNEY_SECONDS)
export const VOLUME = 0.65;    // warm-galaxy-player.js FILM_VOLUME
export const FADE_S = 1.5;     // the sound leaves with the picture over its last 1.5 s
export const NARROW = '(max-width:700px)';   // the player's own: a phone's width takes the mobile cut
/** The #purpose player's own cut and poster for each width (warm-galaxy-player.js: data-galaxy-media, revision film-mothership-1), each a literal. */
export const FILMS = Object.freeze({
  desktop: Object.freeze({film: new URL('./warm-media/film-mothership-1/galaxy-desktop.mp4?v=film-mothership-1', import.meta.url),
    poster: new URL('./warm-media/film-mothership-1/galaxy-desktop-poster.jpg?v=film-mothership-1', import.meta.url)}),
  mobile: Object.freeze({film: new URL('./warm-media/film-mothership-1/galaxy-mobile.mp4?v=film-mothership-1', import.meta.url),
    poster: new URL('./warm-media/film-mothership-1/galaxy-mobile-poster.jpg?v=film-mothership-1', import.meta.url)}),
});
export const SOUNDTRACK = new URL('./warm-media/fantasia-1/fantasia-soundtrack.m4a?v=audio-carry-1', import.meta.url);   // its soundtrack, as the player names it

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
/** variantOf(win): the cut for this screen, by the player's own rule. */
export const variantOf = (win) => (win?.matchMedia?.(NARROW)?.matches ? 'mobile' : 'desktop');
/** countOf(t): the stage's count, as the player writes its own ("07 / 51"). Pure. */
export const countOf = (t) => `${String(Math.floor(clamp(Number(t) || 0, 0, JOURNEY_S))).padStart(2, '0')} / ${JOURNEY_S}`;
/** fadeOf(t, end, s): the sound's share at the picture's second t: whole until s before the end, none at it. Pure. */
export const fadeOf = (t, end = JOURNEY_S, s = FADE_S) => (Number.isFinite(t) ? clamp((end - t) / s, 0, 1) : 1);
/** playWord({playing, ended, failed}): the stage's first button, a state. Pure. */
export const playWord = ({playing, ended, failed}) => (failed ? WORDS.again : playing ? WORDS.pause : ended ? WORDS.replay : WORDS.play);
const reach = (m) => (m?.seekable?.length ? m.seekable.end(m.seekable.length - 1) : null);   // the last second the media can be sought to

// the page's own button rule (warm.css: button:not(.gold-button, .ink-button) {background: transparent}, one class and an element): every button here is scoped over it
const CSS = `
.dl-athena-film{position:fixed;inset:0;z-index:${FILM_Z};pointer-events:none}
html[data-space-router] .dl-athena-film{visibility:hidden}
.dl-athena-film-card{position:absolute;top:max(16px,env(safe-area-inset-top));right:max(16px,env(safe-area-inset-right));width:clamp(128px,14vw,208px);aspect-ratio:16/9;pointer-events:auto}
.dl-athena-film[data-variant="mobile"] .dl-athena-film-card{width:clamp(64px,19vw,88px);aspect-ratio:9/16}
.dl-athena-film[data-open] .dl-athena-film-card{visibility:hidden}
.dl-athena-film .dl-athena-film-go{position:absolute;inset:0;display:block;width:100%;height:100%;margin:0;padding:0;overflow:hidden;border:1px solid rgba(240,207,116,.7);border-radius:6px;
  background:#faf9f5;cursor:pointer;box-shadow:0 14px 36px rgba(0,0,0,.45)}
.dl-athena-film-go img{position:absolute;inset:0;display:block;width:100%;height:100%;object-fit:cover;transform:scale(1.6)}
.dl-athena-film-play{position:absolute;left:50%;top:50%;width:36px;height:36px;margin:-18px 0 0 -18px;border-radius:50%;background:rgba(14,12,10,.72);box-shadow:0 0 0 1px rgba(240,207,116,.8);transition:background .15s}
.dl-athena-film-play::after{content:'';position:absolute;left:14px;top:11px;border-left:11px solid #f0cf74;border-top:7px solid transparent;border-bottom:7px solid transparent}
.dl-athena-film .dl-athena-film-go:hover .dl-athena-film-play{background:rgba(14,12,10,.9)}
.dl-athena-film-name{position:absolute;left:0;right:0;bottom:0;padding:12px 8px 6px;background:linear-gradient(transparent,rgba(14,12,10,.8));color:#f0cf74;text-align:left;
  font:600 10px/1 'DM Sans',system-ui,sans-serif;letter-spacing:.16em;text-transform:uppercase}
.dl-athena-film[data-variant="mobile"] .dl-athena-film-name{padding:10px 5px 5px;font-size:8px;letter-spacing:.06em}
.dl-athena-film .dl-athena-film-shut{position:absolute;top:-9px;right:-9px;width:24px;height:24px;margin:0;padding:0;border:1px solid rgba(240,207,116,.7);border-radius:50%;
  background:rgba(14,12,10,.86);color:#f0cf74;font:400 15px/1 system-ui,sans-serif;cursor:pointer}
.dl-athena-film-stage{position:absolute;inset:0;display:grid;place-items:center;pointer-events:auto}
.dl-athena-film-stage[hidden]{display:none}
.dl-athena-film-veil{position:absolute;inset:0;background:rgba(4,2,6,.78);cursor:pointer}
.dl-athena-film-box{position:relative;display:grid;justify-items:center;gap:12px}
.dl-athena-film-frame{position:relative;width:min(92vw,1180px,calc((100vh - 120px) * 16 / 9));aspect-ratio:16/9;overflow:hidden;border:1px solid rgba(240,207,116,.55);border-radius:6px;
  background:#faf9f5;box-shadow:0 24px 70px rgba(0,0,0,.55)}
.dl-athena-film[data-variant="mobile"] .dl-athena-film-frame{width:min(92vw,calc((100vh - 120px) * 9 / 16));aspect-ratio:9/16}
.dl-athena-film-frame video{position:absolute;inset:0;display:block;width:100%;height:100%;object-fit:contain}
.dl-athena-film .dl-athena-film-close{position:absolute;top:10px;right:10px;width:34px;height:34px;margin:0;padding:0;border:0;border-radius:50%;background:rgba(14,12,10,.7);color:#fff;
  font:300 24px/1 system-ui,sans-serif;cursor:pointer}
.dl-athena-film-bar{display:flex;align-items:center;gap:8px}
.dl-athena-film .dl-athena-film-bar button{min-height:30px;margin:0;padding:5px 13px;border:1px solid rgb(214 191 137 / .5);border-radius:999px;background:rgb(250 249 245 / .9);color:#2b2620;
  font:500 11px/1 'DM Sans',system-ui,sans-serif;letter-spacing:.02em;cursor:pointer}
.dl-athena-film-count{min-width:7ch;color:#f0cf74;font:500 11px/1 ui-monospace,monospace;letter-spacing:.04em}
.dl-athena-film button:focus-visible{outline:2px solid #b4944d;outline-offset:3px}
@media (pointer:coarse){.dl-athena-film .dl-athena-film-bar button{min-height:44px}.dl-athena-film .dl-athena-film-shut{width:32px;height:32px}}
@media (prefers-reduced-motion:reduce){.dl-athena-film-play{transition:none}}
`;

/** mountGovernanceFilm({win, doc, soundtrack}): her turn to the governance film, armed on her landing. `soundtrack` makes the sound (createJourneySoundtrack's
 *  shape: (root, {source, volume, onSoundBlocked}) -> {update(state), destroy(), audio}). -> {open(), close(), dismiss(), state()}, or null on ?handoff. */
export function mountGovernanceFilm({win = window, doc = document, soundtrack = createJourneySoundtrack} = {}) {
  if (new URLSearchParams(win.location?.search ?? '').has('handoff')) return null;   // the rite's road keeps the card's place (dl-space-router.js stands down the same)
  const S = {up: false, open: false, gone: false, sound: true, failed: null, resume: false, frame: 0, opened: 0, taps: 0, after: false};
  let L = null;   // the layer, once she has landed
  const listeners = [], on = (t, type, fn, o) => { t.addEventListener(type, fn, o); listeners.push(() => t.removeEventListener(type, fn, o)); };
  const make = (tag, cls, text) => { const el = doc.createElement(tag); if (cls) el.className = cls; if (text != null) el.textContent = text; return el; };
  const still = () => win.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;

  function bring() {   // she has landed: the card flies out of her corner
    if (S.up || S.gone) return; S.up = true;
    const variant = variantOf(win), F = FILMS[variant];
    const style = make('style'); style.textContent = CSS; doc.head.append(style);
    const layer = make('div', 'dl-athena-film'); layer.dataset.variant = variant;
    const card = make('div', 'dl-athena-film-card'), go = make('button', 'dl-athena-film-go'), poster = make('img'), shut = make('button', 'dl-athena-film-shut', WORDS.close);
    go.type = shut.type = 'button'; go.setAttribute('aria-label', 'Play the governance film'); shut.setAttribute('aria-label', 'Close the governance film');
    poster.alt = ''; poster.decoding = 'async'; poster.src = F.poster.href;
    go.append(poster, make('i', 'dl-athena-film-play'), make('span', 'dl-athena-film-name', NAME)); card.append(go, shut);
    const stage = make('div', 'dl-athena-film-stage'), veil = make('i', 'dl-athena-film-veil'), box = make('div', 'dl-athena-film-box'), frame = make('div', 'dl-athena-film-frame');
    stage.hidden = true; stage.setAttribute('role', 'dialog'); stage.setAttribute('aria-label', 'The governance film');
    const video = make('video'), bar = make('div', 'dl-athena-film-bar'), playB = make('button', null, WORDS.play), soundB = make('button', null, WORDS.on);
    const count = make('span', 'dl-athena-film-count', countOf(0)), close_ = make('button', 'dl-athena-film-close', WORDS.close);
    playB.type = soundB.type = close_.type = 'button'; close_.setAttribute('aria-label', 'Close'); soundB.setAttribute('aria-pressed', 'true');
    video.muted = true; video.defaultMuted = true; video.playsInline = true; video.controls = false; video.preload = 'none'; video.poster = F.poster.href;
    video.setAttribute('muted', ''); video.setAttribute('playsinline', ''); video.setAttribute('aria-label', 'The governance film');
    frame.append(video, close_); bar.append(playB, soundB, count); box.append(frame, bar); stage.append(veil, box); layer.append(card, stage); doc.body.append(layer);
    const sound = soundtrack(stage, {source: SOUNDTRACK.href, volume: VOLUME, onSoundBlocked: () => { S.sound = false; sync(); }});   // its audio element; no byte asked yet
    L = {layer, style, card, go, shut, stage, veil, video, playB, soundB, count, close: close_, sound, F};
    on(go, 'click', open); on(shut, 'click', dismiss); on(close_, 'click', () => close()); on(veil, 'click', () => close());
    on(playB, 'click', () => (playing() ? pause() : play())); on(soundB, 'click', toggleSound);
    for (const type of ['play', 'playing', 'timeupdate', 'seeked', 'ended']) on(video, type, sync);
    on(video, 'pause', () => { unfollow(); sync(); });
    on(video, 'error', () => { S.failed = 'error'; unfollow(); sync(); });
    on(doc, 'keydown', (e) => { if (e.key === 'Escape' && S.open) close(); });
    on(doc, 'visibilitychange', () => {   // a hidden page plays nothing; back, it plays on where it was if it was playing
      if (doc.hidden) { if (S.open && playing()) { S.resume = true; video.pause(); } } else if (S.resume) { S.resume = false; if (S.open) play(); }
      sync();
    });
    fly(card); sync();
  }
  function fly(card) {   // out of her corner: from her square's middle to the card's place, unless the reader asked for less motion
    if (still() || typeof card.animate !== 'function') return;
    const at = win.dlAthena?.state?.()?.at, r = card.getBoundingClientRect(), w = win.innerWidth || 1280, h = win.innerHeight || 800;
    if (!r.width) return;
    const from = Array.isArray(at) ? [at[0] + FIGURE.side / 2, at[1] + FIGURE.side / 2] : [w - FIGURE.side, h - FIGURE.side];
    const dx = from[0] - (r.left + r.width / 2), dy = from[1] - (r.top + r.height / 2);
    card.animate([{transform: `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px) scale(.25)`, opacity: 0}, {transform: 'none', opacity: 1}], {duration: 650, easing: 'cubic-bezier(.2,1.2,.4,1)'});
  }
  const playing = () => !!L && !L.video.paused && !L.video.ended;
  function open() {   // the press: the stage, the film from where it stood (its first frame the first time), with its sound
    if (!L || S.open || S.gone) return;
    S.open = true; S.opened++; L.layer.toggleAttribute('data-open', true); L.stage.hidden = false;
    if (!L.video.getAttribute('src')) { L.video.preload = 'auto'; L.video.src = L.F.film.href; }   // the film's bytes, on the first press only
    play(); L.playB.focus?.({preventScroll: true});
  }
  function close({focus = true} = {}) {   // back to the card: the film and its sound stop where they are
    if (!L || !S.open) return;
    S.open = false; S.resume = false; L.video.pause(); unfollow(); L.layer.toggleAttribute('data-open', false); L.stage.hidden = true; sync();
    if (focus) L.go.focus?.({preventScroll: true});
  }
  function play() {   // the picture's own press (an ended picture starts again from its first frame: the browser's own)
    if (!L) return;
    if (S.failed) { S.failed = null; L.video.load(); }
    const p = L.video.play(); sync();
    Promise.resolve(p).then(sync, (e) => { if (e?.name === 'AbortError') return; if (e?.name !== 'NotAllowedError') S.failed = e?.name || 'error'; sync(); });
  }
  function pause() { if (!L) return; L.video.pause(); sync(); }
  function toggleSound() { S.sound = !S.sound; S.taps++; sync(); }   // the soundtrack alone, muted or heard: the picture is never touched (The rule, item 8)
  function sync() {   // the sound follows the picture; the words say the state
    if (!L) return;
    const v = L.video, t = v.currentTime || 0, on_ = playing(), end = Number.isFinite(v.duration) && v.duration > 0 ? v.duration : JOURNEY_S;
    L.sound.update({time: t, playing: on_ && S.open, visible: true, hidden: !!doc.hidden, sound: S.sound, rate: v.playbackRate || 1, freeRunning: false});
    L.sound.audio.volume = VOLUME * fadeOf(t, end);
    if (on_ && t >= end - FADE_S - 0.5) follow();
    const word = playWord({playing: on_, ended: v.ended, failed: S.failed}), said = S.sound ? WORDS.on : WORDS.off, c = countOf(t);
    if (L.playB.textContent !== word) L.playB.textContent = word;
    if (L.soundB.textContent !== said) { L.soundB.textContent = said; L.soundB.setAttribute('aria-pressed', String(S.sound)); }
    if (L.count.textContent !== c) L.count.textContent = c;
  }
  function follow() {   // the fade on the picture's own frames, over its last seconds only
    const v = L?.video;
    if (!v || S.frame || typeof v.requestVideoFrameCallback !== 'function' || v.paused) return;
    S.frame = v.requestVideoFrameCallback((_, m) => {
      S.frame = 0; if (!L) return;
      L.sound.audio.volume = VOLUME * fadeOf(m.mediaTime, Number.isFinite(v.duration) && v.duration > 0 ? v.duration : JOURNEY_S);
      if (playing()) follow();
    });
  }
  function unfollow() { if (S.frame && L?.video.cancelVideoFrameCallback) L.video.cancelVideoFrameCallback(S.frame); S.frame = 0; }
  function dismiss() {   // the card's ×: the film and its sound let go, the layer gone; she brings it no more this visit
    if (!L || S.gone) return;
    close({focus: false}); S.gone = true;
    L.sound.destroy(); L.video.removeAttribute('src'); L.video.load?.(); L.layer.remove(); L.style.remove();
    for (const off of listeners.splice(0)) off();
    L = null;
  }
  // her landing brings it; her making's 'made' is the rebate slamming in over it: a stage that was open closes (the card waits unseen while the rebate stands)
  doc.addEventListener(SEEN_EVENT, (e) => {   // THE ROAD IS ONE TAKE: while her making holds her landing (the creator, the whole screen) the card waits for her to be made, as the rebate does
    const type = e.detail?.type;
    if (type === 'landed') { if (doc.documentElement?.dataset.herMaking === 'waiting') S.after = true; else bring(); }
    else if (type === 'made') { close({focus: false}); if (S.after) { S.after = false; bring(); } }
  });
  const api = {open, close, dismiss, state: () => ({up: S.up, open: S.open, gone: S.gone, variant: L?.layer.dataset.variant ?? null, sound: S.sound, taps: S.taps, opened: S.opened,
    failed: S.failed, words: L ? [L.playB.textContent, L.soundB.textContent, L.count.textContent] : null,
    film: L ? {t: L.video.currentTime, paused: L.video.paused, ended: L.video.ended, ready: L.video.readyState, src: L.video.getAttribute('src'), seekable: reach(L.video)} : null,
    song: L ? {t: L.sound.audio.currentTime, paused: L.sound.audio.paused, muted: L.sound.audio.muted, volume: L.sound.audio.volume, ready: L.sound.audio.readyState, seekable: reach(L.sound.audio)} : null})};
  win.dlAthenaFilm = api;
  return api;
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') mountGovernanceFilm();
