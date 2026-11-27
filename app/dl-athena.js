// dl-athena.js · ATHENA ON THE ORIGINAL LYSSAJUDRON, OVER THE WHOLE PAGE: the mint's page half (the law is dl-athena.mjs, the layer dl-athena-layer.mjs: one mechanism, mounted here with the mint's topics and the film's moment, and in the Harmony window with its own, life-menu/nefertiti-bubble.mjs). His Oct 21 2026 21:3x WEST: "i want an overlay as a z index above everything else on the page... this has to follow the mouse around and stop at topics with like "got questions" or idk... you get me? we can use floatign athena on the original lyssajudron (what we have been calling lyssajudron recently is different than what u saw there)"; before it, over the stop with no way down: "there is no CTA here... it's better if we bring them below once the pegasus gets there... so that they go and see". SHE COMES AT THE END (his Oct 22 2026 13:0x WEST, over her floating beside the film from its first seconds: "she must appear at the end only. before she is distracting"): until the film has had its say she waits unseen (the layer hidden and inert, her lyssajudron still, docked nowhere). Its end is the stop for a viewer the wall holds there (dl-twelve.js windowAhead: held, or watching while the mint is open), else the film's own end (a holder; everyone after the close). She comes in over its last ARRIVE_S on the film's own seconds, as the song leaves the stop (FREEZE_FADE) and the sphere comes to rest on it: whole on the frame the wall holds, her stop's bubble open at once if the pointer rests on the film. Then she stays for the rest of the visit. HER ENTRANCE (his Oct 22 2026 14:0x WEST, over her bubble on the held frame: "is there no animation or like... cant you create a rich sequence of sprites to introduce athena all of them in the overlay? ... the video is epic until this point"; his pick, Codex's frames and the DMC4 card both): over the last ARRIVE_S her lyssajudron comes in alone; on the frame the wall holds, the hit of Harmony's boss card (intro/room/boss-intro.mjs: the white, the focus lines, the slash, her NAME slammed skewed over its epithet), her portrait large on the frozen picture, her poses in turn (SPRITES: Codex's image_gen from athena.png) with her lines under them (ENTRANCE), and then she shrinks onto her lyssajudron in the corner and her bubble opens. Her Skip goes to that end once its question is answered (ASK: only its Skip; a stray press or key never does); a scroll down reads on (READ_ON, his Oct 30 2026 06:24:04 UTC "the player can simply scroll down and read more"): the page goes to the offer and she leaves the picture quietly, nothing asked, her making left to the kit's door; a reader who asked for less motion meets the end at once. Her frames are asked for PRELOAD_S before the end, never while the song is still being primed. SHE STOPS AT TOPICS (TOPICS: the page's own sections and seats; the stop only while the wall holds the film). The wall's hold docks her at the stop where the pointer rests, with no move asked (the film's pause is the cause). A modal dialog (the checkout) parks her. THE WORDS: every answer is the page's own text, read as the bubble opens (the cards, the tokens, the law's days as dl-paywall.js painted them); the questions and the lines that join them are mine, his to reword.
import {DRAWN_FRAME, FRAME_S} from './dl-paywall.js?v=climax-1';   // the address dl-twelve.js imports: one module, the wall's own frame
import * as LAW from './dl-athena.mjs';
import {mountLayer} from './dl-athena-layer.mjs';
export * from './dl-athena.mjs';

const {CARD, SPRITES, ENTRANCE, SHOWS, SKIP_EVENT, ASK, ASK_EVENT, READ_ON, EGG, ATHENA_POSE, DROP, TELEPORT, SUBTITLE, LAYER_Z, SWARMY, said, tidy} = LAW;
export const FREEZE_S = DRAWN_FRAME * FRAME_S;   // the stop: the film's second the wall holds a viewer on (dl-twelve.js FREEZE_S, frame 3616)
export const ARRIVE_S = 0.8;   // she comes in over the film's last 0.8 s before its end: the song's own fade into the stop (dl-twelve.js FREEZE_FADE)
const HELD_KEYS = new Set([' ', 'PageDown', 'PageUp', 'ArrowDown', 'ArrowUp', 'Home', 'End']);   // the keys that scroll a page: held while she enters
// of them, the two that mean only "the page, down" read on (READ_ON); Space and the arrows, which a viewer presses at a film, stay held (his Oct 29 rule)
const READ_KEYS = new Set(['PageDown', 'End']);
const BARS_MS = 700;   // the letterbox's own motion (.dl-athena-lb's transition, Harmony's boss-intro.mjs .lb): it closes this long before her first line
const LEAD_S = 0.3;   // a timeupdate's step (250 ms at most): her coming is armed that much ahead, and the film's second opens her from nothing
export const PRELOAD_S = 15;   // her entrance's frames are asked for this long before the film's end
// WHAT SHE WAS SEEN DOING (his Oct 22 2026 14:3x WEST: "you gotta track state on whether athena appeared or not before they clicked the download button"): each moment of hers, once, with its wall-clock time in state().seen, and as this event on the document for the visit's own record (detail: {type: coming | entered | skipped | read | landed | seats | harmony, at, ...}): her lyssajudron coming in, her entrance's hit, a skip (the beat it reached), a scroll that read on (the beat it reached: her entrance over with no landing, READ_ON), her landing (skipped or whole, or no entrance at all), a press on the stop's way down (the seats, or Harmony while the gate holds).
export const SEEN_EVENT = 'dl-athena';
/** arrivalAt(t, end): how much of her the film's second t shows as it nears its end: none until ARRIVE_S before it, all of her at it (smoothstep). Pure. */
export const arrivalAt = (t, end, s = ARRIVE_S) => LAW.arrivalAt(t, end, s);
/** topicOf(el, topics): the first topic (TOPICS' order, the narrowest first) whose element holds `el` -> {topic, el} or null. */
export const topicOf = (el, topics = TOPICS) => LAW.topicOf(el, topics);

// ---- the topics: the page's own words ---- YOUR PRESENCE IN THE MMO (lane/your-presence-in-the-mmo, Oct 29 2026): one starter kit stands where the two seats stood, its door paused until the USDC road is safe, so she says what the kit is and opens nothing; the act keeps its name, 'seats' being the
// visit's own word (dl-visit.mjs).
const kitOf = (doc) => {
  const c = doc.querySelector('.snowtrace-kit');
  return {name: said(c, 'h3'), price: said(c, '.snowtrace-tier-title span'), who: said(c, ':scope > p'),
    gets: [...(c?.querySelectorAll('li') ?? [])].map((li) => tidy(li.textContent)), state: said(c, '.snowtrace-kit-state')};
};
const SEATS = Object.freeze({label: 'See the starter kit', act: 'seats'});
// THE PAGE AS IT SHOWS (lane/stake-dont-spend, the kit for staking only: the mint line hidden, the free way "Not staking · wait for the free release"): she says a line the page shows, never one it hides, and asks the free way's question in its own word ("Not mint", "Not staking")
const shownSaid = (doc, sel) => { const el = doc.querySelector(sel); return el && !el.closest('[hidden]') ? tidy(el.textContent) : ''; };
const notOf = (doc) => said(doc, '[data-paywall-not]').split(' \u00b7 ')[0].replace(/\s*\u2192$/, '') || 'Not now';
// a section's own name for itself; a film's own description (its label, the page's words for a reader who cannot see it), its kind before the colon left out ("Illustrated future: "), told in turns: whole sentences from the `from`th, up to `max` characters -> {text, next}
const named = (doc, sel) => { const s = tidy(doc.querySelector(sel)?.getAttribute('aria-label')); return s ? `${s.replace(/[.!?]$/, '')}.` : ''; };
export const TOLD_MAX = 300;
const told = (doc, sel, from = 0, max = TOLD_MAX) => {
  const all = tidy(doc.querySelector(sel)?.getAttribute('aria-label')).replace(/^[^:.]{1,40}:\s*/, '').match(/[^.!?]+[.!?]+/g) ?? [], out = [];
  let n = 0;
  for (const s of all.slice(from)) { const t = s.trim(); if (out.length && n + t.length > max) break; out.push(t); n += t.length + 1; }
  return {text: out.join(' '), next: from + out.length};
};
/** heldOf(win): whether the wall holds the film on the stop (dl-twelve.js's state: read at the film's pause and play only, never a frame's). */
export const heldOf = (win) => win.dlTwelve?.state?.()?.paywall?.state === 'held';
export const seated = (win) => win.dlTwelve?.state?.()?.paywall?.state === 'open';   // THE EGG WAITS FOR THE MINT's one word for a seat: the wall open (a holder, the window closed, ?paywall=off in review); a filled tank's own read is the deposit lane's to add here
/** gated(doc): whether the page's gate holds this visit (dl-harmony-doors.mjs: armed by a published installer, she not yet saved in Harmony). */
export const gated = (doc) => { const g = doc?.defaultView?.dlDoors?.state?.().gate; return Boolean(g?.armed && !g.saved); };
const HARMONY = Object.freeze({label: 'Get DysonLight Harmony', act: 'harmony'});   // the gate holding: her way down is Harmony's doors
/** willHold(win): whether the wall will hold this viewer on the stop: held there, or watching while the mint is open (dl-twelve.js windowAhead); a
 *  holder plays on, and so does everyone after the close. Asked once, as the film nears the stop. */
export const willHold = (win) => { const w = win.dlTwelve?.state?.()?.paywall; return w?.state === 'held' || (w?.state === 'watch' && !!w.exclusive); };

export const TOPICS = Object.freeze([
  {id: 'kit', sel: '.snowtrace-kit', say: (doc) => { const k = kitOf(doc);
    return {line: `${k.name} ${k.price}. ${k.who}`, ask: [['What is in the kit?', k.gets.join(' ')], ['Can I claim it now?', k.state ? `${k.state}.` : '']], doors: []}; }},
  // CLEAR THE MINT (lane/clear-the-mint, his Oct 30 2026 03:21:04 UTC "Yes, clear it"): the holder's road left the page with the seats, and her topic for it
  {id: 'free', sel: '.snowtrace-free', say: (doc) => ({line: `${notOf(doc)}? ${said(doc, '.snowtrace-free > span')}`, ask: [], doors: [SEATS]})},
  {id: 'tokens', sel: '.snowtrace-tokens, .snowtrace-offer-heading', say: (doc) => {
    const dd = [...doc.querySelectorAll('.snowtrace-tokens dd')].map((d) => tidy(d.textContent));
    return {line: said(doc, '.snowtrace-offer-heading p'), ask: [['What is $WARM?', dd[0]], ['What is $POOL?', dd[1]]], doors: [SEATS]}; }},
  {id: 'snowtrace', sel: '.snowtrace-intro, .snowtrace-path', say: (doc) => ({line: said(doc, '.snowtrace-motto'),
    ask: [['What is Project Snowtrace?', said(doc, '.snowtrace-explanation p')],
      ['How does it work?', [...doc.querySelectorAll('.snowtrace-path li')].map((li) => `${said(li, 'h3')}: ${said(li, 'p')}`).join(' ')]],
    doors: [{label: 'Follow the build on TraceNet', href: doc.querySelector('.snowtrace-browse')?.href}, SEATS]})},
  {id: 'swarm', sel: '#rite', say: (doc) => ({line: said(doc, '[data-swx-copy="0"] p'),
    ask: [['What is the Dyson Society?', `${said(doc, '[data-swx-copy="0"] h3')} ${said(doc, '[data-swx-copy="0"] p')}`], ['What does a seat do?', said(doc, '[data-swx-copy="1"] p')]],
    doors: [SEATS]})},
  // THE GUIDE IS YOUR SWARMY (dl-athena.mjs SWARMY; his "that lyssajudron could explain the 2nd video"): the page's second film, his governance film (#purpose; his Oct 29 2026 17:39 UTC "leave my fucking governance film as it was"). The guide says only the page's own words: the section's name for the film, then the film's own description (its video's label), told in two turns. Never its closing invitation, which the page hides until the film has played. Nothing is put into the film. A SMART BUBBLE AT THE FILM (his Oct 30 2026, over "Got questions?" / the film's own name / "See the starter kit": "this one sucks dude tbh... like we gotta have smart ones come on..."): at the film the bubble asks the one question a visitor there has, repeats no title the page already shows, and its door follows THE PROFESSOR SENDS YOU TO THE FILM FIRST (dl-space-router.js): nothing until it is seen (html[data-film-seen]), then no door either: the tank's card it went to is struck (his "remove this shit dude"), and HER PART ENDS AT THE FREEZE keeps her off the film after it.
  {id: 'purpose', sel: '#purpose', say: (doc) => { const film = '#purpose [data-galaxy-video]', first = told(doc, film), then = told(doc, film, first.next);
    const seen = doc.documentElement.dataset.filmSeen != null;
    // NO POPUP BEFORE THE FILM IS OVER (his Oct 30 2026, over "What happens in it?" / "Watch the film" at the film: "dont have popups porcoddio before the movie is over... if anything, make it comical for him to tell you to shut the fuck up and watch the movie"): until the film is seen, no question and no door, only the Swarmy shushing you (the seat's words, his to reword)
    if (!seen) return {asked: 'Shhh.', line: 'Shut up and watch the movie.', ask: [], doors: []};
    return {asked: 'What happens in it?', line: '', ask: [['', first.text], ['And then?', then.text]].filter(([, a]) => a),
      doors: []}; }},
  {id: 'stop', sel: '#oath-sphere', corner: true, when: (ctx) => ctx.held, say: (doc) => { const k = kitOf(doc);
    return {line: shownSaid(doc, '[data-mint-line]') || k.who,
      ask: [['What can I get?', `${k.name} ${k.price}. ${k.who}`], ['What is in the kit?', k.gets.join(' ')],
        ['How does my agent join?', `${said(doc, '[data-swx-copy="2"] h3')} ${said(doc, '[data-swx-copy="2"] p')}`.trim()],
        ['Can I wait?', `Yes. ${said(doc, '.snowtrace-free > span')}`]],
      doors: [{...(gated(doc) ? HARMONY : SEATS), main: true}]}; }},
]);

// HER ENTRANCE's stage: the white, the focus lines, her card, her portrait, her line (all of it the picture's: the bubble speaks to a reader)
const INTRO_CSS = `
.dl-athena-intro{position:absolute;inset:0;pointer-events:auto;overflow:hidden;cursor:default}
.dl-athena-intro[hidden]{display:none}
.dl-athena-intro>*{position:absolute;pointer-events:none}
.dl-athena-vig{inset:0;background:radial-gradient(ellipse at 50% 46%,transparent 34%,rgba(4,2,6,.82) 100%);opacity:0;transition:opacity 1.2s ease}
.dl-athena-intro.go .dl-athena-vig{opacity:1}
.dl-athena-lb{left:0;right:0;height:13%;background:#050405;transform:scaleY(0);transition:transform .7s cubic-bezier(.2,.8,.2,1)}
.dl-athena-lb.t{top:0;transform-origin:top}.dl-athena-lb.b{bottom:0;transform-origin:bottom}
/* THE BARS CLOSE INTO HER LINES (THE ROAD IS ONE TAKE, his Oct 30 2026 08:09:46 UTC "i think it could be smoother"; the black bars snapped in under the
   hit's white): her card stands on the whole picture, and the letterbox closes as it hands over to her first line, in Harmony's motion (the rule above,
   boss-intro.mjs .lb), done as the line comes in */
.dl-athena-intro.go .dl-athena-lb{transform:scaleY(1);transition-delay:${SUBTITLE.card_ms - BARS_MS}ms}
.dl-athena-intro.out .dl-athena-lb{transform:scaleY(0);transition-delay:0s}
.dl-athena-intro.out .dl-athena-vig{opacity:0;transition-duration:.5s}
.dl-athena-sfx{top:17%;right:36%;color:#161713;font:900 clamp(46px,8.5vw,116px)/1 'Hiragino Sans','Yu Gothic',sans-serif;letter-spacing:-.14em;
  -webkit-text-stroke:7px #f6f0e1;paint-order:stroke fill;transform:rotate(14deg) skewY(-9deg);text-shadow:6px 6px 0 #171816;opacity:0}
.dl-athena-sfx[data-side="l"]{right:auto;left:6%;top:20%;transform:rotate(-11deg) skewY(-6deg)}
.dl-athena-sfx.on{animation:dl-athena-sfx 560ms cubic-bezier(.2,.8,.2,1) both}
@keyframes dl-athena-sfx{from{scale:1.1;opacity:0}to{scale:1;opacity:1}}
.dl-athena-white{inset:0;background:#fff;opacity:0}
.dl-athena-intro.go .dl-athena-white{animation:dl-athena-white .42s ease-out forwards}
@keyframes dl-athena-white{0%{opacity:.92}100%{opacity:0}}
.dl-athena-lines{inset:-20%;opacity:0;background:repeating-conic-gradient(from 3deg at 50% 50%,rgba(8,6,10,.9) 0deg 1.1deg,transparent 1.1deg 5.3deg);
  -webkit-mask:radial-gradient(circle at 50% 50%,transparent 26%,#000 62%);mask:radial-gradient(circle at 50% 50%,transparent 26%,#000 62%)}
.dl-athena-intro.go .dl-athena-lines{animation:dl-athena-lines .5s ease-out forwards}
@keyframes dl-athena-lines{0%{opacity:.95;transform:scale(1.25) rotate(0deg)}100%{opacity:0;transform:scale(1) rotate(2deg)}}
.dl-athena-card{left:0;right:0;top:40%;transform:translateY(-58%);display:grid;justify-items:center;gap:.4em;opacity:0;transition:opacity .28s ease,transform .28s ease}
.dl-athena-intro.go .dl-athena-card{opacity:1}
.dl-athena-intro .dl-athena-card.gone{opacity:0;transform:translateY(-58%) scale(.97)}
.dl-athena-slash{position:absolute;left:-10%;right:-10%;top:50%;height:46%;transform:translateY(-50%) skewY(-4deg) scaleX(0);transform-origin:left;
  background:linear-gradient(90deg,transparent,rgba(140,14,30,.92) 12%,rgba(201,161,74,.95) 50%,rgba(140,14,30,.92) 88%,transparent)}
.dl-athena-intro.go .dl-athena-slash{animation:dl-athena-slash .22s cubic-bezier(.3,1.4,.4,1) forwards}
@keyframes dl-athena-slash{to{transform:translateY(-50%) skewY(-4deg) scaleX(1)}}
.dl-athena-epithet{position:relative;font:400 clamp(13px,1.9vw,28px)/1.2 'Gelasio',Georgia,serif;letter-spacing:.42em;text-transform:uppercase;color:#f0cf74;
  text-shadow:0 1px 0 #000,0 0 6px #000,0 0 18px rgba(0,0,0,.95);opacity:0}
.dl-athena-intro.go .dl-athena-epithet{animation:dl-athena-in .3s .18s ease-out forwards}
.dl-athena-name{position:relative;font:700 clamp(44px,10.5vw,190px)/.9 'Gelasio',Georgia,serif;letter-spacing:.02em;text-transform:uppercase;color:#fbf6ea;
  -webkit-text-stroke:2px #0b0709;paint-order:stroke fill;text-shadow:-4px 0 rgba(255,36,56,.85),4px 0 rgba(80,220,255,.7),0 6px 30px rgba(0,0,0,.8);
  transform:scale(2.6) skewX(-10deg);opacity:0}
.dl-athena-intro.go .dl-athena-name{animation:dl-athena-slam .17s cubic-bezier(.2,1.6,.3,1) forwards,dl-athena-settle .9s .17s ease-out forwards}
@keyframes dl-athena-slam{to{transform:scale(1) skewX(-10deg);opacity:1}}
@keyframes dl-athena-settle{to{text-shadow:-1px 0 rgba(255,36,56,.35),1px 0 rgba(80,220,255,.3),0 6px 30px rgba(0,0,0,.8)}}
@keyframes dl-athena-in{from{opacity:0;transform:translateY(.4em)}to{opacity:1;transform:none}}
.dl-athena-portrait{right:2%;bottom:0;height:min(60vh,540px);width:auto;image-rendering:pixelated;filter:drop-shadow(0 12px 28px rgb(0 0 0 / .45))}
.dl-athena-intro.go .dl-athena-portrait{animation:dl-athena-enter .32s cubic-bezier(.2,1.3,.4,1) both}
@keyframes dl-athena-enter{from{transform:translateX(120%) skewX(-8deg)}to{transform:none}}
.dl-athena-intro.go .dl-athena-portrait.dl-athena-beat{animation:dl-athena-beat .26s ease-out}
@keyframes dl-athena-beat{40%{transform:translateY(-6px) scale(1.012)}100%{transform:none}}
/* HER SUBTITLES in the letterbox's black bar under the picture (.dl-athena-lb.b: the bottom 13%), clear of her portrait on the right; each line on
   its own dark band (his Oct 22 19:4x WEST, over a line running onto her portrait in a narrow window: "USE SOME DARKER BACKGROUND FOR READABILITY") */
/* HER WORDS UNDER HER (his Oct 27 2026 15:5x WET, over a line across her face in a narrow window: "please position the text like normally... not
   in front of her face... make the font larger"): larger type everywhere; in a narrow window the line stands in the black bar at the very bottom,
   centred as a film's subtitle, and her portrait stands on that bar's top edge, so no line ever crosses her */
.dl-athena-say{left:6%;right:36%;bottom:0;height:13%;display:flex;align-items:center;margin:0;font:400 clamp(19px,2.3vw,32px)/1.3 'Gelasio',Georgia,serif;
  color:#fbf4e2;letter-spacing:.01em;opacity:0;transition:opacity .25s ease;z-index:1}
.dl-athena-say.on{opacity:1}
.dl-athena-say-line{background:rgba(5,4,5,.88);padding:.1em .4em;border-radius:2px;-webkit-box-decoration-break:clone;box-decoration-break:clone}
/* THE COUNT BESIDE HER (dl-athena.mjs SHOWS; THERE'S NO TIME, his Oct 30 2026 06:24:04 UTC: "we gotta work on the shit that gets visualized to screen
   while she talks"): in the picture's upper left, clear of her, on "We’re running out of it."; it rises in once and leaves as it stood, and nothing on it
   moves at rest. THE COUNT IS AN OPENING (dl-athena.mjs COUNT, his Oct 30 ~12:5x UTC "this is poor taste simply", "Pre-Deposits for Space Router
   Opened", "mention solana breakpoint"): no box. Two plates in the freeze's grammar (dl-space-router.js: the slash, the name slammed skewed with its
   red and cyan fringe, the gold stamp), PRE-DEPOSITS on the router's blue, the days on $WARM's crimson and gold, each slamming in on its own beat */
.dl-athena-mg{left:5%;top:16%;width:min(54vw,640px);height:46%;z-index:1;container-type:inline-size}
.dl-athena-mg-item{position:absolute;left:0;top:0;opacity:0;transform:translateY(18px) scale(.96);transition:opacity .45s ease,transform .65s cubic-bezier(.2,1.25,.4,1);filter:drop-shadow(0 18px 38px rgb(0 0 0 / .38))}
.dl-athena-mg-item.on{opacity:1;transform:none}
.dl-athena-mg-item.count{display:grid;row-gap:.42em;justify-items:start;width:100%;font-size:clamp(26px,10.4cqw,76px);filter:none}
.dl-athena-mg-item.count>:not(.dl-athena-count-plate){padding:.16em .46em .12em;border:1px solid rgba(240,207,116,.55);border-radius:2px;background:rgba(5,4,5,.84);
  font:700 .77em/1.1 'Gelasio',Georgia,serif;white-space:nowrap;color:#fbf6ea}   /* a line that counts no days (the window closed): as the page shows it */
.dl-athena-count-plate{position:relative;display:grid;justify-items:start;padding:.1em .3em .08em}
.dl-athena-count-plate .bar{position:absolute;left:-.5em;right:-.5em;top:.52em;height:.62em;transform:translateY(-50%) skewY(-4deg);transform-origin:left}
.dl-athena-count-plate.router .bar{background:linear-gradient(90deg,transparent,rgba(8,16,58,.92) 10%,rgba(64,128,236,.95) 50%,rgba(8,16,58,.92) 90%,transparent)}
.dl-athena-count-plate.warm .bar{background:linear-gradient(90deg,transparent,rgba(140,14,30,.92) 10%,rgba(201,161,74,.95) 50%,rgba(140,14,30,.92) 90%,transparent)}
.dl-athena-count-plate .lift{position:relative;display:grid;justify-items:start}
.dl-athena-count-plate .name{font:700 1em/.92 'Gelasio',Georgia,serif;letter-spacing:.02em;white-space:nowrap;color:#fbf6ea;-webkit-text-stroke:2px #0b0709;paint-order:stroke fill;
  transform:skewX(-10deg);text-shadow:-1px 0 rgba(255,36,56,.35),1px 0 rgba(80,220,255,.3),0 6px 30px rgba(0,0,0,.8)}
.dl-athena-count-plate .stamp{margin-top:.32em;padding-left:.12em;font:700 max(11px,.23em)/1.2 'Gelasio',Georgia,serif;letter-spacing:.38em;white-space:nowrap;color:#f0cf74;
  text-shadow:0 1px 0 #000,0 0 8px #000}
.dl-athena-mg-item.count.on .bar{animation:dl-athena-mg-slash .22s var(--at,0ms) cubic-bezier(.3,1.4,.4,1) both}
.dl-athena-mg-item.count.on .name{animation:dl-athena-mg-slam 1.07s calc(var(--at,0ms) + 60ms) both}
.dl-athena-mg-item.count.on .stamp{animation:dl-athena-count-in .3s calc(var(--at,0ms) + 240ms) ease-out both}
@keyframes dl-athena-count-in{from{opacity:0;transform:translateY(.4em)}}
@media (prefers-reduced-motion:reduce){.dl-athena-mg-item.count *{animation:none!important}}
@keyframes dl-athena-mg-slash{from{transform:translateY(-50%) skewY(-4deg) scaleX(0)}}
@keyframes dl-athena-mg-slam{0%{transform:scale(2.6) skewX(-10deg);opacity:0;text-shadow:-4px 0 rgba(255,36,56,.85),4px 0 rgba(80,220,255,.7),0 6px 30px rgba(0,0,0,.8);animation-timing-function:cubic-bezier(.2,1.6,.3,1)}
  16%{transform:skewX(-10deg);opacity:1;text-shadow:-4px 0 rgba(255,36,56,.85),4px 0 rgba(80,220,255,.7),0 6px 30px rgba(0,0,0,.8);animation-timing-function:ease-out}}
@media (max-width:700px){.dl-athena-mg{left:4%;top:15%;width:92%;height:34%}}
/* THE EGG FALLS INTO THE CREATOR (dl-athena.mjs EGG, DROP, TELEPORT; his Oct 30 2026 06:28:18 UTC "the trail of mysteriousness and her dropping a egg to the
   user and the user being teleported there"): on "egg" her picture goes and her egg, cut from it, falls from where her hands held it toward the glass,
   growing, turning, pixel for pixel (the fall itself is Web Animations on the compositor, for its length alone); where it hits, one flash: the white, the
   focus lines and ドン at the screen's centre, and her making opens under it (TELEPORT, below) */
.dl-athena-egg{left:0;top:0;image-rendering:pixelated;transform-origin:50% 50%;filter:drop-shadow(0 0 14px rgba(255,196,64,.55))}.dl-athena-egg.offered{opacity:0;pointer-events:none;z-index:2}
.dl-athena-egg[hidden]{display:none}
.dl-athena-intro.go .dl-athena-portrait.dropped{opacity:0;transition:opacity .22s ease}
.dl-athena-layer.leaving>.dl-athena{opacity:0;transition:opacity .22s ease}   /* the lyssajudron she rides goes with her picture: nothing of her stays at her corner */
.dl-athena-sfx[data-side="c"]{right:auto;left:50%;top:44%;translate:-50% -50%;transform:rotate(-8deg) skewY(-6deg)}
/* HER CARD'S HIT AGAIN at a line's turn, and where her egg hits the glass: the white and the focus lines once more, behind her */
.dl-athena-intro.go.hit .dl-athena-white{animation:dl-athena-white-hit .42s ease-out forwards}
@keyframes dl-athena-white-hit{0%{opacity:.92}100%{opacity:0}}
.dl-athena-intro.go.hit .dl-athena-lines{animation:dl-athena-lines-hit .5s ease-out forwards}
@keyframes dl-athena-lines-hit{0%{opacity:.95;transform:scale(1.25) rotate(0deg)}100%{opacity:0;transform:scale(1) rotate(2deg)}}
/* THE ROAD IS ONE TAKE (TELEPORT): where her egg hits, the white whole over everything, her layer lifted over her making for it, the focus lines and ドン on
   it; her making opens under it at once and the white leaves it, ドン with it: the egg, the white, the creator, never the old scene between them */
.dl-athena-intro.teleport{pointer-events:none}   /* nothing held now: his presses go through the white to her making under it */
.dl-athena-intro.teleport>:not(.dl-athena-white,.dl-athena-lines,.dl-athena-sfx){visibility:hidden}
.dl-athena-intro.go.teleport .dl-athena-white{animation:none;opacity:1}
.dl-athena-intro.go.teleport .dl-athena-lines{animation:dl-athena-lines-tp .5s ease-out forwards}
@keyframes dl-athena-lines-tp{0%{opacity:.95;transform:scale(1.25) rotate(0deg)}100%{opacity:0;transform:scale(1) rotate(2deg)}}
.dl-athena-intro.go.teleport.reveal .dl-athena-white{opacity:0;transition:opacity ${TELEPORT.reveal_ms}ms ease-out}
.dl-athena-intro.go.teleport.reveal .dl-athena-sfx.on{animation:dl-athena-leave ${TELEPORT.reveal_ms}ms ease-out forwards}
@keyframes dl-athena-leave{from{opacity:1}to{opacity:0}}
/* HER SKIP, a button beside her entrance (never in it: the entrance is the picture's, hidden from a reader), and THE SKIP ASKS FIRST (dl-athena.mjs ASK,
   his Oct 29 2026 20:45:41 UTC): one question over the page in her card's grammar, its slash, the question slammed, two of her pills */
.dl-athena-skip{position:absolute;right:16px;top:calc(6.5% - 15px);margin:0;padding:9px 14px;border:1px solid rgba(240,207,116,.7);border-radius:999px;background:rgba(5,4,5,.55);font:600 11px/1 'DM Sans',system-ui,sans-serif;letter-spacing:.16em;text-transform:uppercase;color:#f0cf74;cursor:pointer;pointer-events:auto!important}
.dl-athena-skip[hidden],div.dl-athena-ask[hidden]{display:none}
/* the question over the page is this div alone: her bubble's "Got questions?" (dl-athena-layer.mjs) is a button of the same class, which this rule laid
   fixed over the whole bubble, its words in the middle of her line (THE GUIDE IS YOUR SWARMY, Oct 30 2026: seen at 390 wide on every topic) */
div.dl-athena-ask{position:fixed;inset:0;z-index:2147483647;display:grid;place-items:center;padding:16px;background:rgba(5,4,5,.42);pointer-events:auto}
.dl-athena-ask-box{position:relative;display:grid;justify-items:center;gap:20px;max-width:min(100%,560px);box-sizing:border-box;padding:30px 30px 26px;background:rgba(5,4,5,.9);
  border:1px solid rgba(240,207,116,.5);border-radius:4px;box-shadow:0 24px 60px rgb(0 0 0 / .55);overflow:hidden}
.dl-athena-ask-box>i{position:absolute;left:-10%;right:-10%;top:38%;height:34%;transform:translateY(-50%) skewY(-4deg);transform-origin:left;
  background:linear-gradient(90deg,transparent,rgba(140,14,30,.92) 12%,rgba(201,161,74,.95) 50%,rgba(140,14,30,.92) 88%,transparent);animation:dl-athena-mg-slash .22s cubic-bezier(.3,1.4,.4,1) both}
.dl-athena-ask-q{position:relative;margin:0;padding:0 .2em;font:700 clamp(22px,5.6vw,34px)/1.05 'Gelasio',Georgia,serif;letter-spacing:.02em;text-transform:uppercase;text-align:center;color:#fbf6ea;
  -webkit-text-stroke:1.5px #0b0709;paint-order:stroke fill;transform:skewX(-10deg);text-shadow:-1px 0 rgba(255,36,56,.35),1px 0 rgba(80,220,255,.3),0 6px 30px rgba(0,0,0,.8);
  animation:dl-athena-mg-slam 1.07s .06s both}
.dl-athena-ask-row{position:relative;display:flex;gap:12px}
.dl-athena-ask-row button{min-width:96px;margin:0;padding:11px 18px;border:1px solid rgba(240,207,116,.7);border-radius:999px;background:rgba(5,4,5,.72);
  font:600 13px/1 'DM Sans',system-ui,sans-serif;letter-spacing:.16em;text-transform:uppercase;color:#f0cf74;cursor:pointer}
.dl-athena-ask-row button:hover{background:rgba(240,207,116,.16)}
.dl-athena-ask-row button:focus-visible{outline:2px solid #fbf6ea;outline-offset:2px}
@media (prefers-reduced-motion:reduce){div.dl-athena-ask *{animation:none!important}}
@media (max-width:700px){.dl-athena-say{left:5%;right:5%;bottom:0;height:13%;min-height:3.2em;justify-content:center;text-align:center;padding:0;background:none;font-size:clamp(20px,5.4vw,26px)}.dl-athena-portrait{height:min(40vh,330px);right:-4%;bottom:0}
  .dl-athena-intro.go .dl-athena-portrait{bottom:max(13%,3.2em);transition:bottom .7s cubic-bezier(.2,.8,.2,1) ${SUBTITLE.card_ms - BARS_MS}ms}}   /* on her card she stands on the screen's foot, and rises onto the bar as it closes */
`;

export function mountAthena({win = window, doc = document, fetcher = (...a) => fetch(...a)} = {}) {
  const S = {held: heldOf(win), arriving: null, arrive: 0, playsOn: false, entered: 0, poses: null, dropped: false, teleports: 0, left: false, swarmy: null, given: false, give: null, hand: null,
    seen: {coming: null, entered: null, skipped: null, read: null, landed: null, seats: null, harmony: null, beat: -1, entrance: null}};
  function act(what) {   // the page's own doors, on whichever guide stands (Athena, or the visitor's Swarmy)
    const g = guide();
    if (what === 'seats') { tell('seats'); doc.querySelector('.dl-paywall-choice-seats')?.scrollIntoView({behavior: g.still ? 'auto' : 'smooth', block: 'center'}); g.undock(); }
    else if (what === 'harmony') { tell('harmony'); win.dlDoors?.lead?.(); g.undock(); }
    else if (what === 'refuel') { tell('seats'); doc.querySelector('#refuel')?.scrollIntoView({behavior: g.still ? 'auto' : 'smooth', block: 'center'}); g.undock(); }   // the one offer (the $WARM seat's card)
  }
  const L = mountLayer({win, doc, fetcher, topics: TOPICS, act, corner: true, engine: 'idle', label: 'Athena', modal: LAW.ASIDE});   // THE GUIDE STEPS OUT OF THE WORLD, AND OFF THE FILM
  const guide = () => L;   // the page's one guide, Nefertiti's layer (NOTHING FLOATS AFTER HER MAKING: no second guide follows her)
  // THE SKIP KEEPS HER (his Oct 29 2026 16:2x UTC: "why the fuck if i click "skip to mint" then i get to a place that skips past the coloring phase of the lyssajudron; also her fucking intro"): SKIP TO THE MINT skips the film alone; her entrance's frames are asked for at once (the film lands a few seconds before the stop, inside PRELOAD_S's lead), and her coming, her entrance and her landing play as for everyone.
  doc.addEventListener(SKIP_EVENT, () => { preload(); });
  const {layer, perch} = L.els, still = L.still;
  L.ctx.held = S.held;
  const make = (tag, cls, text) => { const el = doc.createElement(tag); if (cls) el.className = cls; if (text != null) el.textContent = text; return el; };
  const style = make('style'); style.textContent = INTRO_CSS; doc.head.append(style);
  const intro = make('div', 'dl-athena-intro'), plate = make('div', 'dl-athena-card'), portrait = make('img', 'dl-athena-portrait'), say = make('p', 'dl-athena-say'), sayLine = make('span', 'dl-athena-say-line');
  const sfx = make('span', 'dl-athena-sfx'), egg = make('img', 'dl-athena-egg');   // egg: THE EGG FALLS INTO THE CREATOR
  egg.alt = ''; egg.decoding = 'sync'; egg.hidden = true; egg.addEventListener('click', () => { if (doc.querySelector(LAW.COUNT.door)?.disabled === false) doc.querySelector(LAW.COUNT.flask)?.click(); });   // the offered egg: the flask's side of the split, a link to the Space Router page (THE SPLIT LEADS WHERE YOU CLICK); a paused door presses nothing
  intro.hidden = true; intro.setAttribute('aria-hidden', 'true'); portrait.alt = ''; portrait.decoding = 'sync';   /* HER PICTURE NEVER BLINKS (his Nov 24 2026 "i see white flashes erratically over the page here"): an async swap painted a frame with no picture at each pose change, the bright stage showing where she stood; her poses are decoded ahead (preload), so the swap is the same frame */
  plate.append(make('i', 'dl-athena-slash'), make('div', 'dl-athena-epithet', CARD.epithet), make('div', 'dl-athena-name', CARD.name));
  say.append(make('span')); say.firstChild.append(sayLine);   // the bar's one block, its text inline in it: a band under every line it wraps to
  const mg = make('div', 'dl-athena-mg');
  intro.append(make('i', 'dl-athena-vig'), make('i', 'dl-athena-lb t'), make('i', 'dl-athena-lb b'), egg, make('i', 'dl-athena-white'), make('i', 'dl-athena-lines'), plate, mg, portrait, sfx, say);   // her egg under the flash and under her picture
  const skip = make('button', 'dl-athena-skip', 'Skip to the trail \u203a'); skip.type = 'button'; skip.hidden = true;
  skip.addEventListener('click', () => S.skip?.());   // her Skip, shown while her entrance runs: it asks first (ask, below)
  // ---- THE COUNT BESIDE HER (SHOWS): the page's own element, cloned as the page shows it on the line that names it (its ids and hooks left behind, so
  // nothing of the page drives the copy); a line the page hides or leaves empty shows nothing ----
  const figures = new Map();
  function figure(key) {
    if (figures.has(key)) return figures.get(key);
    const spec = SHOWS[key], source = doc.querySelector(spec.from);
    if (!source || source.closest('[hidden]') || !tidy(source.textContent)) return null;
    const item = make('div', `dl-athena-mg-item ${key}`); item.dataset.mg = key; item.dataset.at = spec.at;
    // THE COUNT IS AN OPENING (dl-athena.mjs COUNT): the page's days and the kit door's state, in the freeze's grammar; words read with spaces between
    const door = doc.querySelector(LAW.COUNT.door), plates = key === 'count' ? LAW.countPlates(tidy(source.textContent), !!door && !door.disabled) : null;
    if (plates) {
      plates.forEach((p, i) => {
        const plate = make('div', `dl-athena-count-plate ${p.key}`), lift = make('span', 'lift'); plate.style.setProperty('--at', `${p.at}ms`);
        lift.append(make('span', 'name', p.name), ' ', make('span', 'stamp', p.stamp)); plate.append(make('i', 'bar'), lift);
        item.append(...(i ? [' ', plate] : [plate]));
      });
    } else {   // a line that counts no days: the page's own element, cloned as the page shows it (its ids and hooks left behind)
      const copy = source.cloneNode(true);
      for (const el of [copy, ...copy.querySelectorAll('*')]) for (const a of [...el.attributes]) if (a.name === 'id' || a.name.startsWith('data-')) el.removeAttribute(a.name);
      item.append(copy);
    }
    mg.append(item); figures.set(key, item); return item;
  }
  function showFigures(keys = []) {   // the line's figures come in, the others leave as they stood
    for (const key of Object.keys(SHOWS)) (keys.includes(key) ? figure(key) : figures.get(key))?.classList.toggle('on', keys.includes(key));
  }
  const hit = () => { intro.classList.remove('hit'); void intro.offsetWidth; intro.classList.add('hit'); };   // her card's hit again: the white, the focus lines
  layer.append(intro, skip);

  // ---- THE SKIP ASKS FIRST (dl-athena.mjs ASK): one question over the page in her card's grammar; only its Skip runs what was asked (`go`), inside that
  // press; its Stay, Esc or a press beside it closes it and nothing else moves. Nothing in it seeks the film or touches the sound (CLAUDE.md, The rule,
  // 8): `go` does, and only on Skip. The film asks by ASK_EVENT (dl-twelve.js, SKIP TO THE MINT); her own Skip asks the same way. ----
  const asked = make('div', 'dl-athena-ask'), askBox = make('div', 'dl-athena-ask-box'), askQ = make('p', 'dl-athena-ask-q', ASK.ask), askRow = make('div', 'dl-athena-ask-row');
  const askStay = make('button', null, ASK.stay), askSkip = make('button', null, ASK.skip);
  askStay.type = askSkip.type = 'button'; askStay.dataset.ask = 'stay'; askSkip.dataset.ask = 'skip'; askQ.id = 'dl-athena-ask-q';
  asked.hidden = true; asked.setAttribute('role', 'alertdialog'); asked.setAttribute('aria-modal', 'true'); asked.setAttribute('aria-labelledby', askQ.id);
  askRow.append(askStay, askSkip); askBox.append(make('i'), askQ, askRow); asked.append(askBox); doc.body.append(asked);
  let askGo = null, askFrom = null;
  function ask(go, from = null) {   // one question at a time: a second ask while one stands keeps the first
    if (askGo) return;
    askGo = go; askFrom = from; asked.hidden = false; askStay.focus({preventScroll: true});
  }
  function unask(skipped = false) {   // the question closes; on Skip what it asked for runs, in the same press
    if (!askGo) return;
    const go = askGo; askGo = null; asked.hidden = true;
    if (skipped) go(); else askFrom?.focus?.({preventScroll: true});
  }
  for (const type of ['pointerdown', 'pointerup', 'click', 'wheel', 'touchstart', 'touchmove', 'keydown']) asked.addEventListener(type, (e) => {
    e.stopPropagation();   // nothing under the question hears a press, a scroll or a key while it asks (the film's stage, the scroll that is its player)
    if (type === 'wheel' || type === 'touchmove') e.preventDefault();
    if (type === 'click') { if (e.target === askSkip) unask(true); else if (e.target === askStay || e.target === asked) unask(); }
    if (type === 'keydown' && e.key === 'Escape') unask();
    if (type === 'keydown' && e.key === 'Tab') { e.preventDefault(); (doc.activeElement === askStay ? askSkip : askStay).focus(); }
  }, {passive: false});
  doc.addEventListener('keydown', (e) => { if (askGo && e.key === 'Escape') unask(); }, true);   // Esc keeps, wherever the focus is
  doc.addEventListener(ASK_EVENT, (e) => { if (typeof e.detail?.go !== 'function') return; e.preventDefault(); ask(e.detail.go, e.detail.from); });

  // ---- SHE COMES AT THE END: the film's own seconds bring her ----
  function nearing(f) {   // the film's timeupdate: its end within reach arms her coming (the wall is asked once, as the film nears the stop)
    if (!L.waiting()) return;
    if (!S.poses && (f.currentTime >= FREEZE_S - PRELOAD_S || f.currentTime >= f.duration - PRELOAD_S)) preload();   // her entrance's frames, ahead
    if (S.arriving || f.paused) return;
    const t = f.currentTime, near = (end) => t >= end - ARRIVE_S - LEAD_S && t < end;
    if (!S.playsOn && near(FREEZE_S)) { if (willHold(win)) { coming(f, FREEZE_S); return; } S.playsOn = true; }   // a holder, or after the close: on to the film's own end
    if (near(f.duration)) coming(f, f.duration);
  }
  function coming(f, end) {   // her lyssajudron comes in alone: on a stop she makes her entrance at the hit
    S.arriving = {film: f, end, t: f.currentTime}; if (end === FREEZE_S && !still) { L.entering(true); preload(); }
    layer.setAttribute('data-coming', ''); L.alive(); tell('coming', {end: end === FREEZE_S ? 'stop' : 'film'}); arriving();
  }
  function arriving() {   // each frame of her coming: her share of the film's last ARRIVE_S, all of her at its end, which keeps her
    S.arrive = 0; const a = S.arriving; if (!a) return;
    const t = a.film.currentTime, wrapped = t + 1 < a.t;   // a loop's wrap: the clock never seeks the film back (dl-twelve-clock.js)
    a.t = t;
    if (a.film.paused) {   // held on its end (the wall: she is here), else stopped short of it (out of view, his pause): unseen until it plays on
      if (S.held || t >= a.end - 1e-3) come(); else { S.arriving = null; layer.removeAttribute('data-coming'); layer.style.opacity = ''; L.alive(); }
      return;
    }
    if (wrapped || t >= a.end + (a.end === FREEZE_S ? 0.1 : -1e-3)) { come(); return; }   // played out: the loop's wrap, or on past a stop that did not hold
    layer.style.opacity = String(still ? 0 : arrivalAt(t, a.end));
    S.arrive = win.requestAnimationFrame(arriving);
  }
  function come() {   // the end: she is here for the rest of the visit; on a held frame her entrance first, then the stop at once if the pointer rests on the film
    win.cancelAnimationFrame(S.arrive); S.arrive = 0; S.arriving = null; doc.removeEventListener('timeupdate', nearer, true);
    S.held = heldOf(win); L.ctx.held = S.held;   // the wall's word now: it is held before its pause event is heard
    L.come({then: (land) => {
      if (S.held && !still && new URLSearchParams(win.location?.search ?? '').get('door') !== 'deposit') entrance(land); else { L.entering(false); tell('landed', {entrance: false, ...kept()}); land(); }   /* a visit sent to the deposit door (warm.html?door=deposit, the Space Router page's Fill your tank: THE GREEN COMES LATER IN THE ROAD, his Nov 12 2026 ~06:38 UTC) lands her as a still reader's: the freeze at once, its door open over it */
    }});
  }
  function tell(type, extra = {}) {   // WHAT SHE WAS SEEN DOING: the moment's first time kept, and the document told each time
    const at = Date.now(); if (S.seen[type] == null) S.seen[type] = at;
    if ('entrance' in extra) S.seen.entrance = extra.entrance;
    doc.dispatchEvent(new win.CustomEvent(SEEN_EVENT, {detail: {type, at, ...extra}}));
    if (type === 'landed' && S.swarmy) win.setTimeout(handoff, 0);   // THE GUIDE IS YOUR SWARMY: a picture made before she landed takes over once she has
  }

  // ---- HER ENTRANCE on the held frame ----
  function preload() {   // her poses, asked for ahead and decoded off the main thread (PRELOAD_S before the end; at once if she comes unwarned)
    S.poses ||= Object.fromEntries([...Object.entries(SPRITES), ['egg', EGG.src]].map(([name, url]) => { const im = new win.Image(); im.decoding = 'async'; im.src = url.href; im.decode?.().catch(() => {}); return [name, im]; }));
    return S.poses;
  }
  function pose(name, beat) {   // a pose, and on a beat the portrait's small jolt
    portrait.src = SPRITES[name].href;
    if (beat) { portrait.classList.remove('dl-athena-beat'); void portrait.offsetWidth; portrait.classList.add('dl-athena-beat'); }
  }
  function cue(beat, i) {   // a beat's sound (her card's alone), its figures, and her subtitle
    if (beat.sfx) { sfx.classList.remove('on'); sfx.textContent = beat.sfx; sfx.dataset.side = i % 2 ? 'r' : 'l'; void sfx.offsetWidth; sfx.classList.add('on'); }
    else sfx.classList.remove('on');
    if (beat.show) showFigures(beat.show);
    if (!beat.say) return;
    say.classList.remove('on'); sayLine.textContent = beat.say(doc); void say.offsetWidth; say.classList.add('on'); doc.documentElement.dataset.herSaid = Array.from({length: LAW.STORY.findIndex((l) => l.say === sayLine.textContent) + 1}, (_, k) => k).join(' ');   /* THE EXPLAINER: every line she has said so far, by its number; the page's diagram shows that much of itself (warm.html #dl-explain, dl-paywall.css) */
  }
  function entrance(landed) {   // the hit, her card, her poses and lines (ENTRANCE), then she alights; her Skip, its question answered Skip, ends it sooner; a scroll down reads on
    preload(); S.entered++; L.entering(true);
    const timers = [], top = win.scrollY ?? 0;
    let over = false, from = null, late = false;   // from: a finger's y as it touched, for its pan; late: her offered egg given before she landed, its fall ends her entrance (SHE HANDS BACK TO THE FLASK)
    // THE SCENE HOLDS UNDER HER, AND A SCROLL DOWN READS ON (READ_ON; his Oct 30 2026 06:24:04 UTC: "the player can simply scroll down and read more"): a wheel down or a finger's pan up carries the page to the offer and her entrance ends quietly, nothing asked (readOn); a scroll up or sideways, a press or a key moves nothing under her and ends nothing (his Oct 29 rule against stray presses and keys), but PageDown and End, which mean only the page going down, read on too. A pinch or a ctrl-wheel still zooms; a key on a focused button is its own; while her question asks, nothing reads on. The page moved by any other hand (its bar) ends her quietly as well (moved): nothing of her stands over a page that has gone.
    const down = (e) => (e.type === 'wheel' ? e.deltaY > Math.abs(e.deltaX) : e.type === 'keydown' ? READ_KEYS.has(e.key)
      : from !== null && from - (e.touches?.[0]?.clientY ?? from) > READ_ON.px);
    const hold = (e) => {
      if (e.ctrlKey || L.parked() || e.touches?.length > 1 || (e.type === 'keydown' && (!HELD_KEYS.has(e.key) || e.target?.closest?.('button,input,textarea,select,[contenteditable]')))) return;
      e.preventDefault();
      if (e.type === 'keydown' && LAW.SPACE.includes(e.key) && !e.repeat && !over && !askGo) next();
      if (!over && !askGo && down(e) && doc.documentElement.dataset.onTrack == null) readOn();   // ON TRACK (dl-space-router.js): on a first visit a scroll is held and reads nothing on: her entrance runs to the freeze and its film
    };
    const touch = (e) => { from = e.touches?.length === 1 ? e.touches[0].clientY : null; };
    const moved = () => { if (!over && Math.abs((win.scrollY ?? 0) - top) > READ_ON.away_px) { end('read'); holding(false); } };
    const holding = (on) => { const f = on ? 'addEventListener' : 'removeEventListener';
      win[f]('wheel', hold, {passive: false}); win[f]('touchstart', touch, {passive: true}); win[f]('touchmove', hold, {passive: false}); doc[f]('keydown', hold, true); win[f]('scroll', moved, {passive: true}); };
    function readOn() {   // the page carried to the offer (it lands under the page's own scroll-padding, as every way down here does), then her entrance over;
      // the scroll held until the page is there (a trackpad's momentum would stop the carry short), then his again
      const to = doc.querySelector(READ_ON.to);
      if (to) {
        let wait = 0; const there = () => { win.clearTimeout(wait); doc.removeEventListener('scrollend', there); holding(false); };
        wait = win.setTimeout(there, READ_ON.carry_ms); doc.addEventListener('scrollend', there);
        to.scrollIntoView({behavior: 'smooth', block: 'start'});
      }
      end('read'); if (!to) holding(false);
    }
    const end = (how) => {   // how: 'whole' (her lines all said), 'skipped' (her Skip, answered Skip), 'read' (the page went on: she leaves the picture at once)
      if (over) return; over = true; S.endEntrance = null; S.skip = null; for (const t of timers) win.clearTimeout(t); unask(); skip.hidden = true; S.give = null; offering(false); S.hand = null;
      // read on: no landing, so no stop's bubble, no making, no rebate pulls him back (they open on 'landed'; the kit's door keeps her making); her small self goes to rest beside his pointer, and a topic he rests on takes her as anywhere on the page
      if (how === 'read') { tell('read', {beat: S.seen.beat}); leave(); return; }   // HER PART ENDS: nothing of hers stays to float over the page
      holding(false);
      if (how === 'handed') { tell('landed', {entrance: 'whole', beat: S.seen.beat, egg: 'free'}); leave(); return; }   // THE HEXAGON PATH (dl-hexagon.js): her egg handed to the visitor, no fall and no flash; her making opens on it, and nothing is made or paid (S.given stands as it was)
      if (how === 'skipped') tell('skipped', {beat: S.seen.beat});
      if (S.dropped) teleport(() => tell('landed', {entrance: how, beat: S.seen.beat, egg: 'given'}));   // her egg fallen: it lands in one flash, her making opens under it, and she leaves with it
      else alight(() => { tell('landed', {entrance: how, beat: S.seen.beat, ...kept()}); landed(); });
    };
    // THE EGG WAITS FOR THE MINT (his Nov 11 2026 UTC, 04:59 "...it could be that we let people get their lyssajudron after the mint..."; ~05:45 "u get that coloring lyssajudron now has to appear after the mint? ... we need to get the hexagon minted there dude") and SHE HANDS BACK TO THE FLASK (~06:1x "i need people to create their damn fucking flask... so i could use nefertiti introducing the urgency and the egg... then bringing back instead of jumping straight into lyssajudron"): with no seat on "egg" it stays in her hands while her line stands, its press the page's door (COUNT.door); then she lands as ever and the freeze has the page back, her at its corner holding it out (dl-space-router.js). A flask made while she offers lets it fall (S.give); one made after opens her making (give, below)
    const offer = () => { eggAt(); offering(true); tell('egg', {offered: true}); S.give = () => { late = true; drop(); timers.push(win.setTimeout(() => end('whole'), DROP.fall_ms)); }; S.hand = () => end('handed'); };
    pose(ENTRANCE[0].pose); sayLine.textContent = ''; say.classList.remove('on'); sfx.classList.remove('on'); plate.classList.remove('gone'); intro.classList.remove('out', 'hit'); showFigures([]);
    S.endEntrance = end;   // SKIP TO THE MINT: the film's skip ends a running entrance as her own Skip would
    S.skip = () => ask(() => end('skipped'), skip);   // her Skip: its question first, and only its Skip ends her entrance; a stray press or key never does
    unask(); intro.hidden = false; skip.hidden = doc.documentElement.dataset.onTrack != null; void intro.offsetWidth; intro.classList.add('go'); holding(true); S.seen.beat = 0; tell('entered'); cue(ENTRANCE[0], 0);   /* NO SKIP THE FIRST TIME (his Nov 20 2026 "No skip first time", over her pitch skipped past its explainer): on a first visit (ON TRACK, dl-space-router.js) her pitch plays through and her Skip never shows; a visit after it skips as before, asked first, the question over every layer of the page (z-index 2147483647: her explainer, #dl-explain, stands at 2147483600 and drew over it) */
    // SPACE TURNS HER LINE (dl-athena.mjs SPACE, spaceStep): each beat calls the next at its own gap, so the bar can show the next one now; at, tick: the beat on show and the call of the one after it; left: its line's turn still to come, and its timer
    let at = 0, tick = 0, left = null, leftT = 0;
    const later = (f, ms) => { const t = win.setTimeout(f, ms); timers.push(t); return t; }, ahead = (i) => { if (i + 1 < ENTRANCE.length) tick = later(() => play(i + 1), ENTRANCE[i + 1].at - ENTRANCE[i].at); };
    function next() { const step = LAW.spaceStep(ENTRANCE, at, !!left); if (step.play === null && !step.turn) return; win.clearTimeout(leftT); const f = step.turn ? left : null; left = null; if (f) f(); if (step.play !== null) { win.clearTimeout(tick); play(step.play); } else if (step.turn) { win.clearTimeout(tick); tick = later(() => play(at + 1), step.wait); } }
    function play(i) { at = i; ahead(i); const beat = ENTRANCE[i]; {
      if (beat.land) { if (!late && !egg.classList.contains('offered')) end('whole'); return; }   /* NO VISITOR SEES THE OLD FREEZE (Nov 25 2026): her egg offered, she holds on it whether or not the deposit door has answered yet; the split comes in when it does (dl-paywall.css) */   /* her egg given while she offered it: its own fall ends her entrance. SHE HOLDS ON "TAKE THIS EGG." (his Nov 11 2026 06:09:20 UTC "i need people to create their damn fucking flask... so i could use nefertiti introducing the urgency and the egg"; 08:22:50 "the CTA must become mint your SWARMY EGG"): while the page's deposit door is open she does not land when her lines are said; she stays, the egg held out and the mint's call beside her line (dl-paywall.css), until the flask is made (S.give: the egg falls) or her Skip is answered. A paused door holds nothing: she lands as ever */
      S.seen.beat = i;
      if (beat.pose) pose(beat.pose, true);
      if (beat.card === false) plate.classList.add('gone');
      cue(beat, i);
      const turn = beat.turn;   // the line's turn: as her reading reaches its word, her pose and her card's hit, or her egg let fall
      left = null; if (turn?.pose || turn?.hit || turn?.drop) { left = () => { if (turn.pose) pose(turn.pose, true); if (turn.hit) hit(); if (turn.drop) (S.given || seated(win) ? drop() : offer()); }; leftT = later(() => { const f = left; left = null; f?.(); }, turn.ms); }
    } }
    ahead(0);
  }
  function gone() {   // her picture over: her perch hers again, her egg put away
    intro.hidden = true; intro.classList.remove('go', 'out', 'hit', 'teleport', 'reveal'); layer.classList.remove('leaving'); layer.style.zIndex = ''; portrait.style.cssText = ''; portrait.classList.remove('dropped'); L.entering(false);
    for (const a of egg.getAnimations?.() ?? []) a.cancel();
    egg.hidden = true; egg.style.cssText = ''; S.dropped = false;
  }
  // ---- THE EGG FALLS INTO THE CREATOR (dl-athena.mjs EGG, DROP, TELEPORT) ----
  function eggAt() {   // her egg laid exactly over the egg in her picture (EGG.box in ATHENA_POSE px) -> its box
    const r = portrait.getBoundingClientRect(), [x, y, w, h] = EGG.box, kx = r.width / ATHENA_POSE[0], ky = r.height / ATHENA_POSE[1];
    const box = {left: r.left + x * kx, top: r.top + y * ky, width: w * kx, height: h * ky};
    egg.src = EGG.src.href; egg.style.cssText = `left:${box.left.toFixed(1)}px;top:${box.top.toFixed(1)}px;width:${box.width.toFixed(1)}px;height:${box.height.toFixed(1)}px`; egg.hidden = false; return box;
  }
  const offering = (on) => { egg.classList.toggle('offered', on); doc.documentElement.toggleAttribute('data-egg-offered', on); if (on) try { doc.cookie = 'am-intro=1; max-age=31536000; path=/; samesite=lax'; } catch { /* a stand-in document */ } };   // THE SOCIETIES ARE THE HOME (Nov 26 2026): her egg offered, the intro is seen; the front door opens on Societies next time (worker/premint.mjs), the cookie the after-the-mint bar writes too
  const kept = () => (S.given || seated(win) ? {egg: 'seated'} : {});   // a seat landing without her egg's fall: her making opens all the same (dl-her-colours.js)
  const give = () => { if (S.given) return; S.given = true; if (S.give) S.give(); else if (!S.endEntrance) tell('given'); };   // THE FLASK IS MADE (a fill, a seat paid), heard once for the page: her offered egg falls; after her landing her making opens on 'given' (dl-her-colours.js); before "egg" in her entrance it falls on its line
  doc.addEventListener('dl-tank-filled', give); win.addEventListener('dl-premint-paid', give);
  function drop() {   // on "egg": her picture goes, and her egg falls from where her hands held it toward the glass, growing, turning; ease-in, as a fall
    const box = eggAt(), vw = win.innerWidth || 1, vh = win.innerHeight || 1;
    portrait.classList.add('dropped'); layer.classList.add('leaving'); S.dropped = true; offering(false);
    const k = (vh * EGG.fill) / Math.max(1, box.height), dx = vw * EGG.to[0] - (box.left + box.width / 2), dy = vh * EGG.to[1] - (box.top + box.height / 2);
    egg.animate?.([{transform: 'translate(0, 0) scale(1) rotate(0deg)'}, {transform: `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px) scale(${k.toFixed(3)}) rotate(${EGG.spin}deg)`}],
      {duration: Math.max(200, DROP?.fall_ms ?? 1200), easing: EGG.ease, fill: 'forwards'});
  }
  function teleport(landed) {   // where the egg hits the glass (TELEPORT): the white whole over everything, her layer lifted over her making for it, the focus
    // lines and ドン on it; her making opens under it at once (her landing, open_ms in), and the white leaves it once it stands; then she leaves with her egg
    plate.classList.add('gone'); say.classList.remove('on'); showFigures([]); for (const a of egg.getAnimations?.() ?? []) a.cancel(); egg.hidden = true;
    sfx.textContent = TELEPORT.sfx; sfx.dataset.side = 'c'; sfx.classList.remove('on'); void sfx.offsetWidth; sfx.classList.add('on');
    intro.classList.remove('hit'); intro.classList.add('teleport'); layer.style.zIndex = String(LAYER_Z + 1);   // over her making (dl-her-colours.js HER_Z, this layer's own height)
    S.teleports++;
    win.setTimeout(landed, TELEPORT.open_ms);
    win.setTimeout(() => win.requestAnimationFrame(() => { intro.classList.add('reveal'); win.setTimeout(leave, TELEPORT.reveal_ms + 40); }), TELEPORT.hold_ms);   // a frame after her making's own
  }
  function leave() {   // her egg given, she is gone with it for this page: her picture over and her layer let go (her small self holds it too: assets/athena.png)
    if (S.left) return;
    gone(); S.left = true; L.destroy(); handoff();
  }
  // ---- NOTHING FLOATS AFTER HER MAKING (his Oct 30 2026, over the guide's bubble floating on the tank's card: "are you fucking kidding me? with all the incredible
  // games being vibecoded out there you just resort to floating over here?... do you see the quality standard or not?"; the same hour: "who cares about the lyssajudron, it is just a dev mock of a technology that is being opensourced"). THE GUIDE IS YOUR SWARMY (Oct 30 12:1x) is undone: once her making's picture lands (dl-her-colours.js inKit, at its Continue), Nefertiti finishes her part, never cut short, and leaves with her egg; no figure and no bubble takes her
  // place over the page after it. The picture's load is still the cause of her leaving. ----
  function handoff() {
    if (!S.swarmy || S.left) return;
    if (!L.waiting() && !L.state().entering) leave();   // mid-entrance she finishes first: her landing calls this again
  }
  // HER PART ENDS AT THE FREEZE (his Oct 30 2026, over her small self on her Lyssajudron asking "What happens in it?" with Fill the tank at his film: "for some bugged execution path i see her appearing..."): once SPACE ROUTER AT THE FREEZE stands (html[data-space-router], dl-space-router.js) she leaves for this page, whichever way her entrance ended (alighted, her making left unmade); with her egg fallen she leaves on her own once the white has gone (teleport). Before it, the router hid her only while it stood, and she came back as the page's guide when it rode away.
  if (win.MutationObserver) new win.MutationObserver(() => { if (doc.documentElement.dataset.spaceRouter != null && !S.dropped) leave(); })
    .observe(doc.documentElement, {attributes: true, attributeFilter: ['data-space-router']});
  const kitHer = doc.querySelector(SWARMY.img);
  kitHer?.addEventListener('load', () => {
    const src = kitHer.currentSrc || kitHer.src;
    if (!kitHer.hidden && /^(blob|data):/.test(src)) { S.swarmy = src; handoff(); }
  });
  function alight(landed) {   // she shrinks onto her lyssajudron: the portrait flies to her perch's box, and her small self takes over there
    const from = portrait.getBoundingClientRect(), to = perch.getBoundingClientRect();
    plate.classList.add('gone'); say.classList.remove('on'); sfx.classList.remove('on'); showFigures([]); intro.classList.add('out');   // the letterbox opens as she flies
    const done = () => { gone(); landed(); };
    if (!from.height || !to.height) { done(); return; }
    const k = to.height / from.height, dx = to.left + to.width / 2 - (from.left + from.width / 2), dy = to.top + to.height / 2 - (from.top + from.height / 2);
    portrait.style.animation = 'none'; void portrait.offsetWidth;   // the class's animation would hold its transform over this flight
    portrait.style.transition = 'transform .5s cubic-bezier(.5,0,.2,1)'; portrait.style.transform = `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px) scale(${k.toFixed(3)})`;
    win.setTimeout(done, 520);
  }

  // ---- causes of the film ----
  // the wall's hold (the film pauses on the stop: the end, if she is still waiting) and its release: media events do not bubble, so the document hears them as they pass down
  for (const type of ['pause', 'play']) doc.addEventListener(type, () => {
    S.held = heldOf(win); L.ctx.held = S.held;
    if (S.held && L.waiting()) { come(); return; } if (!L.waiting()) { L.undock(); }
  }, true);
  // the film's timeupdate (four a second) arms her coming as its end nears; once she has come it is no longer heard
  const nearer = (e) => { if (e.target?.id === 'dl-twelve-film') nearing(e.target); };
  doc.addEventListener('timeupdate', nearer, true);

  const api = {alive: L.alive, hand: () => S.hand?.(), state: () => ({...L.state(), coming: S.arriving ? S.arriving.end : null, entered: S.entered, asking: !!askGo, dropped: S.dropped, teleports: S.teleports, left: S.left, offered: doc.documentElement.hasAttribute('data-egg-offered'),
    pose: L.state().entering ? (portrait.src.match(/athena-(\w+)\.png/)?.[1] ?? null) : null, seen: {...S.seen},
    swarmy: null})};   // NOTHING FLOATS AFTER HER MAKING: no guide of hers
  win.dlAthena = api;
  if (S.held) come();   // loaded on a film the wall already holds: its end is here
  return api;
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') mountAthena();
