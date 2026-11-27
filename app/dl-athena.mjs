// dl-athena.mjs · THE LAW OF ATHENA'S LAYER: pure numbers and pure functions, no page (the mint's page half is dl-athena.js, the layer itself
// dl-athena-layer.mjs, the Harmony window's half life-menu/nefertiti-bubble.mjs). Split out of dl-athena.js on Oct 22 2026 20:xx WEST, his "look at
// how ugly it is the harmony app... athena has to be brought there... i mean nefertiti harley quinn... you see you have done a great job at the
// webpage because there is a z-indexed separate floating overlay": the same layer, by the same bytes, on both pages (C-18: one mechanism, never two).
// His words over the first of it (Oct 21 2026 21:3x WEST): "i want an overlay as a z index above everything else on the page... this has to follow
// the mouse around and stop at topics with like "got questions" or idk... we can use floating athena on the original lyssajudron".
//
// THE ORIGINAL LYSSAJUDRON is Harmony's old corner figure (harmony.html LYSA, Sept 21 2026), not the Council's body (room/lyssajudron.mjs: eye-stalks,
// a thruster): the Poleis wall engine (/lysa-engine.js) painting the ROMA·0 register (/roma-engine.js) in discussion, the Polyhedros of glass, her twelve
// riding the four spherical Lissajous lanes on their gold wires, painted as the overlay we had before painted it (figureOptions: the Mac's overlay,
// harmony-mac/runtime/ui/lyssajudron.js). The same two files, the same bytes: named by new URL from here (tools/page-files.mjs ships them at the site's
// root; harmony-aiolos serves them at the window's root) and run against a window of their own (engineOf), so a page's older copy of the engine never
// meets this one.
// ATHENA (assets/athena.png: Codex's image_gen, Oct 21 2026, from the red-hat trainer: lavender hair, a gold circlet, a white chiton, the house's black
// ball with its gold seam; platinum since Oct 22) rises over its crown, where harmony.html crown() put the girl, and floats there.
// WHO SHE IS (his Oct 22 2026 WEST, after her first lines were "cringe as fuck ai slop nonsense forced shit... brainstorm with me. values. principles.
// cadence. elegance."): NEFERTITI, NESTAL NYMPH, of Athena's line ("nefertiti is the harley quinn there and she is a nestal nymph descendant of athena").
// The Vestals kept the fire every Roman hearth was relit from; a nymph is bound to her place and never leaves it, as the house's Nefertiti always stays
// in the Nest (his Sept 26: "nefertiti instead always stays there, never moves"), and "A NEST IS THE HOME OF ANYONE THAT IS LOCAL AI FIRST" (Sept 23).
// She keeps the fire (the golden apple in her hand: Athena's, the fruit of knowledge, what Quantum Roma burned and she kept: Cognitio Salvata, which
// "project snowtrace is about") and, like Eve and her Egyptian namesake, gives it straight to whoever takes it home, no priest and no landlord between.
// "Sacred although crazy": the vow is slow and sacred, the dare quick and gleeful; that contrast is her madness, never a quip. HER RULES (agreed with him
// that day): point, never explain (Claudio's "non spiega, enuncia", senatus/SOUL.MD); one idea a moment; no name the visitor has not met; she never
// sells; nothing untrue. On every page her lines are the page's own words, read as her bubble opens; the questions that join them are mine, his to reword.

export const LAYER_Z = 2147483000;   // the page's top: over everything but a modal dialog's top layer (and, in the Harmony window, under the glass's face, glass-follow.mjs 2147483646: the Nest's word for the whole window)
export const FIGURE = Object.freeze({side: 150, touch: 96, athena: 0.5, perch: 0.9, yaw: 0.9});   // her square (css px; smaller where a finger shares the screen with her); her height in it; her share over its crown
export const ATHENA_WH = Object.freeze([314, 320]);                                    // assets/athena.png
export const FOLLOW = Object.freeze({omega: 9, dx: 22, dy: 18, margin: 10, settle_px: 0.5, settle_v: 4});   // the spring (1/s); beside the pointer (px)
export const LOOP = Object.freeze({land_ms: 900, settle_ms: 30000, check_ms: 400});   // an asked organ's flight to its chair; the ballot's release, at most; its check (harmony.html settle)
export const DOCK = Object.freeze({gap: 14, sink: 26, corner: [24, 64]});   // beside a topic; her foot over a topic's top edge; the stop's corner (right, bottom)
export const BUBBLE = Object.freeze({w: 268, gap: 10});
export const GRACE_MS = 650;
// HOVER INTENT: a topic takes her once the pointer has stayed on it DWELL_MS (a sweep across the page docks nowhere), and a second topic takes her from
// the first only after SWITCH_MS on it (the way from a topic up to her bubble crosses others: $POOL's text lies between the Gold card and its bubble)
export const DWELL_MS = 160, SWITCH_MS = 380;
export const SCROLL_MS = 160;   // a scroll settles this long after its last step: only then does a topic under the pointer take her (a glide past six topics docks at none)
export const CARD = Object.freeze({name: 'Nefertiti', epithet: 'Nestal Nymph'});   // her card, in Harmony's grammar (the Lyssajudron's: Genie of Three Wishes)
// her poses (Codex's image_gen from her sprite, platinum since Oct 22: girl-sprite.mjs): each named by a literal, so tools/page-files.mjs ships it
export const SPRITES = Object.freeze({
  arrive: new URL('./assets/athena-arrive.png', import.meta.url), vow: new URL('./assets/athena-vow.png', import.meta.url),
  smirk: new URL('./assets/athena-smirk.png', import.meta.url), point: new URL('./assets/athena-point.png', import.meta.url),
  wink: new URL('./assets/athena-wink.png', import.meta.url), shrug: new URL('./assets/athena-shrug.png', import.meta.url),
  offer: new URL('./assets/athena-offer.png', import.meta.url)});
// HER ENTRANCE on the mint (dl-athena.js): her card (ドン, its slam the one sound), then her story as subtitles, each standing as long as it takes to
// read (SUBTITLE: letters a second, a floor, a breath between), her pose changing with each new thought; then her egg falls through the glass into her
// making (EGG, DROP, TELEPORT), or, when her Skip ends her before it falls, she lands on her perch, or, when a scroll reads on (READ_ON), she leaves the
// picture quietly as the page goes to the offer.
// SKIP TO THE MINT (dl-twelve.js, his Oct 28 2026 "put a visible Skip to the mint on the film from its first second... her explainer skipped"): the
// film's word to her that it was skipped to the stop: she lands there without her entrance, so the choice slams in at once.
export const SKIP_EVENT = 'dl-skip-to-mint';
// THE SKIP ASKS FIRST (his Oct 29 2026 20:45:41 UTC: "there needs to be a fucking confimration popup for when to skip because it is so fucking easy to
// skip accidentaly"): her Skip and the film's SKIP TO THE MINT each open one question in her card's grammar (dl-athena.js ask), in the button's own
// words; only its Skip does what the skip did, and its Stay, Esc or a press beside it leaves her entrance or the film as they were. The film asks her by
// ASK_EVENT (detail.go: what its skip does) and she answers it (preventDefault); a page without her skips at once, as before. CLEAR THE MINT
// (lane/clear-the-mint, his Oct 30 2026 03:21:04 UTC "Yes, clear it"): the skip goes to $WARM, and the question says so.
export const ASK_EVENT = 'dl-athena-ask';
export const ASK = Object.freeze({ask: 'Skip to the trail?', skip: 'Skip', stay: 'Stay'});   // THE FIRST TRACENET (his Oct 30 2026 ~22:4x UTC): both skips land on the freeze, the first tracenet's
export const SUBTITLE = Object.freeze({cps: 17, min_ms: 1700, gap_ms: 300, card_ms: 1800});
// HER STORY (his Oct 22 2026 WEST, line by line: "i would like u to introduce aiolos dude... the canvas-mcp... the story here of seya is ancient tale of
// the ancestor of nefertiti and now u can get aiolos harness"; "she is a fucking nestal nymph... 0 mention of NestOS?"; "can you not speak in code to the
// user?"; Pi the named harness, "a bit opinionated on the oh-my-pi"; then "build"): the film is her family's old story, Athena's knight in the golden
// armor called Aiolos; Aiolos is now a harness anyone can wear, on Oh My Pi; she keeps the Nest, and DysonLight Harmony makes it one state (his judges'
// README: "DysonLight Harmony. Your room as one state. Every screen a mirror of it."; "there is no nestos dude... it's dysonlight harmony dude"); the
// Canvas (the house says Canvas, never canvas-mcp); the flask, Poleis's own seals in plain words (cash is the sandbox: an allowance, one job at a time;
// cognitio salvata: learning kept with its author; the membrane: nothing leaves the Nest unless you say so); her seat. Said as a film's subtitles.
// HER STORY AGAIN (his Oct 27 2026 22:5x to 23:5x WET, over this stop: "she still has not updated the things she says... she should be handing over the
// apple of chaos as that apple should be called an egg of lyssajudron... swarmy hatches when dysonlight macOS opens up"; earlier the same night:
// "nefertiti appears, she introduces dysonlight as the spatial computing IDE for cross-platform multiplayer AR fully local... she has to turn 'BURN MY
// COSMOS' into a slogan"; "aiolos is the golden armor... swarm coordination with canvas-mcp shit and trycua spatial agents... burn my cosmos is when you
// have the agents doing shit"). So: the family story stays her opening; Aiolos is the armor the agents wear; the Nest is DysonLight Harmony on your own
// machines; the room becomes one shared scene in AR; the agents burn fuel when they work, and that is burning your cosmos (the slogan, her own line);
// the membrane in plain words; then the apple is not an apple: a Lyssajudron egg, and Swarmy hatches when DysonLight opens on your Mac. Her rules stand
// (point, never explain; one idea a moment; nothing untrue; she never sells: the page under her does).
// SHE EXPLAINS THE SOCIETY (his Oct 28 2026 03:3x WET, over the stop: "why the fuck dont you have the actual shit there and treat it as motion graphic
// and you generate some nefertiti explainers stuff? like instead of her saying bullshit like family story so fucking cringe make her explain the society";
// before it, over this lane's card: "you never read below the hero!?!?!" and the page's own rite pasted: "Keep your own soul. Join a swarm."). So the
// family story is gone: one line ties the film to the product (the armor is Aiolos, worn by your agents), then the society as the page's rite tells it
// (#rite: the meta swarm, the agent's own SOUL.md, the society's SUBCONSCIOUS.md checked against its hash on Solana, the Augur Pass), his land law (the
// bronze floats, the gold anchors and rises), the fuel ($WARM, the flask, Project Snowtrace) and the egg. Each line names what shows beside her while she
// says it (`show`, SHOWS: the page's own elements, cloned from the rite and the mint as the motion graphic of her explainer; `verify`: the hash check
// turns to its tick on that line). His Oct 27 lines stand where they still fit: "Burn your cosmos.", the Lyssajudron egg, Swarmy hatching, "Take it home."
// THE FIRST TIME, SHORT (his Oct 28 2026 03:4x WET: "she doesnt need to go through everything there the first time... just consider some users will want
// to skip through shit and just buy"): eight lines at most; the rest she answers when asked (TOPICS: the stop's questions, the rite's), and her Skip says
// where it goes: to the mint (dl-athena.js).
// KEEP YOUR SOL, KEEP YOUR SOUL (his Oct 29 2026 words, UTC, over her intro: 18:19 "we desperately need to work on the intro dude... like dramatically...
// please. i keep saying spiritually what the narrative should be with SWARMY and SOL staking..."; 18:01 "i think we should make it a staking thing so we get
// staking yield an use that as inference credits, so basically SOL inflation pays for inference"; 18:08 "this is where you introduce a simple toggle... the
// toggle is: accumulate credits, or allocate to ClawRiders in Project SnowTrace"; 18:10 "SWARMY as a stakers SOL thing got legs"; earlier that day "your
// brand ... should be about renegades grouping together against bullies"; Oct 16 "agents don't watch ads"; the page's own rite: "Keep your own soul. Join
// a swarm."). So the society's parts leave her mouth and the spirit comes into it: the old web's wound, the renegades' swarm, the stake that is never
// spent (plans/the-fuel-by-staking-hypertrace-2026-10-26.md: the staker keeps the withdraw authority, the agents drink only the drip), its breath feeding
// the Swarmy, the staker's choice, the egg. The eight lines are claude-1a67b2d3's draft (the seat's words, his to reword); the poses, the figures and the
// rhythm are this lane's. A line may stand past its reading (`rest`, ms: the drama's pause, as a film's), and may turn on one of its words (`turn`: when
// her reading reaches `at`, at SUBTITLE.cps, her figures turn, and a pose and her card's hit may come with it). The stake pool and the toggle are not
// built yet (the staker's toggle is its own lane): she tells the vision, never a price, a rate or a door; the page under her sells.
// THE SPARK AND THE SUN (his ruling the same evening, relayed by claude-1a67b2d3 at 19:0x UTC, its stamp ~18:2x: "staking only, with staking rewards that
// become fuel and credits for the project snowtrace cohort... you get what i mean? the thing is, and we should be very clear about it, this works when
// there is a lot of stake moved..."): her ninth line says the scale, "One stake is a spark. Together, a sun." (claude-1a67b2d3's, his to reword; the
// kit's own words say it plainly, lane/stake-dont-spend: "It works when a lot of stake moves"). It stands after the vow: SOL is the sun, and the Dyson
// sphere is built round a sun, so the breath that feeds the Swarmy is the gathered stake's, which is the truth (one stake's rewards are small). In step
// with that kit: the Swarmy is "her" ("Her fuel: your stake's rewards"), and what the breath brings her is fuel. Nine short lines, about as long as
// the seven of the society were (THE FIRST TIME, SHORT: bounded by the time she takes, 27 s at most, not by a count). A punchline's last words are
// bound by no-break spaces, so a narrow screen breaks it before them ("One stake is a spark. / Together, a sun."), never before its last word.
// HER FEW WORDS (his Oct 29 2026 words, UTC: 23:00:49, over her subtitle "The old web sold your eyes.", "dude please... i am so fucking tired... the way
// she talks is so fucking unnerving... it is so sloppish i hate it... hypertrace all the times i said shit about it"; the hypertrace, every word of his on
// how she speaks since Aug 18: ec-workspace docs/the-way-she-talks-hypertrace-2026-10-29.md; 23:27:00 "Yes, hand it", to the seat of her making; then his
// picks to this seat at 23:35:59): five short lines, twelve words, her poses and figures carrying the rest; she never explains ("she gotta be the crazy
// fucking chick harley quin dude she is crazy and she is open source maxi she is all about project snowtrace as a good thing for the universe... it's
// better if she is mysterious borderline crazy"); and "Go burn your cosmos!" once, the one slogan he kept (Oct 27 22:34 "she has to turn BURN MY COSMOS
// into a slogan"), said to the visitor, never of herself (his Oct 30 03:13:21: "why the fuck would she say burn my cosmos... she might say go burn your
// cosmos"), her card's hit again on "cosmos" with a sound in Japanese (his Oct 27 18:38: "rather guide without text... with sound and japanese words or
// short sentences"). The egg is raised as she names it; SOL takes its U as she says it (his 20:37:51 pun: "sol soul soul.md subconscious.md"); the sparks
// gather into the sun your cosmos burns in; "Hora." hands her making its first line. About 16 s, where it was 27.
// HER STORY, EACH LINE FROM THE ONE BEFORE (his Oct 29 2026 words, UTC, over the preview of main's page at her entrance: 20:44:34 "the intro please the
// text is so fucking unconsequential"; 20:45:41 "there needs to be a fucking confimration popup for when to skip"): eight lines, each following from the
// one before, the last handing her making its first line ("Give me my colours."): the bullies' web on your eyes, the agents who don't watch, the
// renegades moving the web into your room, the egg it starts with, Swarmy hatching with three wishes, the stake's rewards that fuel it, the spark and
// the sun, its asking for its colours. The lines are claude-1a67b2d3's (relayed with his words at 20:4x UTC), his to reword; the stake's keeps the pun
// he named that evening (20:37:51 UTC, over this intro's frames: "i like a lot the pun of sol soul soul.md subconscious.md"): "Keep your SOL, keep your
// soul.", SOL taking its U, while the rewards rise from it into SWARMY FUEL. The ClawRiders' toggle leaves her mouth and her figures (her rule: no name
// the visitor has not met; the kit holds the toggle). A stray press, key or scroll no longer ends her entrance: her Skip asks first (ASK).
// THERE'S NO TIME (his Oct 30 2026 06:24:04 UTC, over main's page in the preview: her "Keep your SOL." under the SWARMY / FUEL slam over the sphere, and
// her making's "LET YOUR SONG BEGIN." answering "No song by that name.": "dude we gotta work on the shit that gets visualized to screen while she talks...
// we could make the theme about "there's no time, we are running out of time, i will explain later" and the player can simply scroll down and read more...
// maybe that wuld be a better thing... also remove the song thing it doesnt work..."): the window's closing is her whole message, four lines in his words
// (claude-1a67b2d3's draft, his to reword), and the page under her says the rest to whoever scrolls. Beside her, only the page's own countdown on the line
// that names it (SHOWS.count) and her card's hit on "egg": SOL STAKED, SWARMY FUEL, the sun and ゴゴゴ left with the lines that named them, the slogan with
// them. A scroll down over her reads on (READ_ON): the page goes to the offer and her entrance ends quietly; her Skip and the film's still ask first (ASK).
// THE EGG FALLS INTO THE CREATOR (his Oct 30 2026 06:28:18 UTC, over main's page in the preview, relayed by claude-1a67b2d3: "she is still saying the old
// things... we could honestly try and play with the trail of mysteriousness and her dropping a egg to the user and the user being teleported there...
// perhaps we could treat better the lyssajudron character creation page... like as if it was a true mmo... you get me?"): her last act is the egg. On
// "egg" it falls out of her hands toward the glass (EGG: the egg cut from her own offer pose, pixel for pixel where it lay in it) and she is gone with it,
// the trail of mysteriousness; where it hits the glass, one flash in her card's grammar (TELEPORT: the white, the focus lines, ドン) and the visitor is
// inside her making, the creator (dl-her-colours.js). Every pose of hers holds the egg, so none can stand after it falls: "I’ll explain later." comes
// before it, his three phrases in his order, and "Take this egg." is her last line. For the same reason she leaves the page with it (THE ROAD IS ONE
// TAKE): her small self on her perch (assets/athena.png) and the freeze's picture of her (dl-space-router.js) hold it too, so neither comes back once
// it has fallen; her landing says so (egg: 'given'), and a reload is a new take, her entrance and her egg again.
export const STORY = Object.freeze([
  {pose: 'point', say: 'There’s no time.', rest: 300}, {pose: 'vow', say: 'Solana is fast. It is not yet smart.', rest: 500}, {pose: 'point', say: 'I am going to make it think.', rest: 500},   /* SHE PITCHES THE INVENTION (his Nov 11 2026 22:18:37 UTC "you gotta turn solana into the super intelligence network... craft this vision shared by nefertiti... start pitching about the invention of turning $SOL intelligence into RSI fuel... the core protagonist here is the tracenet and the $WARM/$POOL things... $POOL, SPOOL (warden of the spool = nefertiti)... $WARM you are warmed up by the RSI of the SWARM"; 22:56:56 "Yes, build it" on the mock that held these lines). It moves his earlier choices for her first words (Oct 28 short the first time, Oct 29 she never explains, Oct 30 "i will explain later"): she explains now, and each line's meaning is drawn beside her (THE EXPLAINER, warm.html #dl-explain) */
  {pose: 'offer', say: 'Stake your SOL in me. You keep it.', rest: 500}, {pose: 'vow', say: 'Its yield becomes my swarm’s fuel.', rest: 500}, {pose: 'wink', say: 'What the swarm solves, it solves once.', rest: 400},
  {pose: 'point', say: 'The trail it leaves is a tracenet.', rest: 500}, {pose: 'vow', say: 'It learns from its own trails. Then faster.', rest: 600}, {pose: 'wink', say: 'Burn fuel, mine $WARM. The swarm warms you.', rest: 600},
  {pose: 'vow', say: 'Give it your SOL’s light, hold $POOL.', rest: 400}, {pose: 'point', say: 'I am the warden of the spool.', rest: 700}, {pose: 'offer', say: 'Take this egg.', turn: {at: 'egg', drop: true}, rest: 0},
].map((line) => Object.freeze({...line, show: Object.freeze(line.show ?? []), ...(line.turn ? {turn: Object.freeze(line.turn)} : {})})));
/** THE PICTURE beside her, a key a figure: the page's own element (`from`, a selector on the mint page), cloned as the page shows it at her line, never
 *  driven again; a line the page hides or leaves empty shows nothing (she never says a hidden line). `at`: its place in her layer. Its words are the
 *  page's, a count (his Oct 29 2026 06:07 UTC rule: only words he acts on). count: the offer footer's "$WARM · N days left" (dl-paywall.js mintLine,
 *  written at the load and at the stop, so the clone is the stop's own). The slams and the gathering sun left with their lines (THERE'S NO TIME). */
export const SHOWS = Object.freeze({
  count: Object.freeze({from: '[data-mint-line]', at: 'a'}),
});
// THE COUNT IS AN OPENING (his Oct 30 2026 ~12:5x UTC, over the count on her second line: "this dude is ugly as fuck... among all the shit you can use...
// this is poor taste simply"; then "like mention solana breakpoint or something dude..."; "like you gotta make it as "Pre-Deposits for Space Router Opened"
// or some shit like that you get what i mean?"). The count stands in the freeze's own grammar (dl-space-router.js SLAMS: a name slammed skewed on its
// slash, its gold stamp), two plates in turn. PRE-DEPOSITS for Space Router rides the router's blue slash; the days ride $WARM's crimson-gold one, until
// Solana Breakpoint. Its facts are the page's:
// - the days, from the offer footer's line (dl-paywall.js mintLine: the window closes as Breakpoint opens, MINT_CLOSES);
// - OPEN, only while the sale's deposit door is open (warm.html's Pre-Deposits for the Space Router, [data-deposit], dl-kit-deposit.js). Never claimed while it is paused. Her offered egg presses the flask's side of the split (flask; his Nov 12 2026 ~06:38 UTC "it gotta split based on what people click").
export const COUNT = Object.freeze({door: '.snowtrace-kit [data-deposit]', flask: '.dl-flask-door [data-side="flask"]', name: 'PRE-DEPOSITS', router: 'FOR SPACE ROUTER', open: 'OPEN',
  until: 'UNTIL SOLANA BREAKPOINT', at: Object.freeze([0, 280])});
/** countPlates(line, open): the count's two plates from the page's own line ("$WARM · N days left") and whether the kit's door is open: [{key, name,
 *  stamp, at}]; null for a line that counts no days (the window closed, another page's words), which then shows as the page shows it. Pure. */
export function countPlates(line, open = false) {
  const m = /(\d+)\s+days?\s+left/i.exec(line ?? ''); if (!m) return null;
  const n = Number(m[1]);
  return [{key: 'router', name: COUNT.name, stamp: open ? `${COUNT.router} · ${COUNT.open}` : COUNT.router, at: COUNT.at[0]},
    {key: 'warm', name: `${n} DAY${n === 1 ? '' : 'S'}`, stamp: COUNT.until, at: COUNT.at[1]}];
}
/** SCROLLING READS ON (THERE'S NO TIME, his "the player can simply scroll down and read more"): a scroll down over her entrance carries the page to the
 *  offer (`to`: dl-space-router.js OFFER, the one her rebate's names press down to) and her entrance ends quietly (dl-athena.js). `px`: a finger's pan
 *  this far up is a scroll down (24 px); `away_px`: the page moved this far by any other hand (its bar) ends her quietly too;
 *  `carry_ms`: the scroll is held while the page is carried (a trackpad's momentum would stop the carry short), until it arrives or this long. */
export const READ_ON = Object.freeze({to: '#dl-paywall-choice', px: 24, away_px: 32, carry_ms: 1200});
/** standsFor(line): how long a subtitle stands, in ms: long enough to read at SUBTITLE.cps, never under its floor. Pure. */
export const standsFor = (line) => Math.max(SUBTITLE.min_ms, Math.round((line.length / SUBTITLE.cps) * 1000));
/** turnOf(say, turn): a line's turn as its beat carries it, {ms: when her reading reaches turn.at at SUBTITLE.cps, pose?, hit?, drop?}; null without one. Pure. */
export function turnOf(say, turn) {
  const i = turn ? say.indexOf(turn.at) : -1;
  return i < 0 ? null : Object.freeze({ms: Math.round((i / SUBTITLE.cps) * 1000), ...(turn.pose ? {pose: turn.pose} : {}), ...(turn.hit ? {hit: true} : {}), ...(turn.drop ? {drop: true} : {})});
}
export const ENTRANCE = Object.freeze((() => {
  const beats = [{at: 0, pose: 'arrive', sfx: 'ドン'}];
  let at = SUBTITLE.card_ms;
  STORY.forEach((line, i) => {
    const turn = turnOf(line.say, line.turn);
    beats.push(Object.freeze({at, ...(line.pose ? {pose: line.pose} : {}), ...(i === 0 ? {card: false} : {}), ...(line.sfx ? {sfx: line.sfx} : {}), say: () => line.say, show: line.show, ...(turn ? {turn} : {})}));
    at += standsFor(line.say) + (line.rest ?? 0) + SUBTITLE.gap_ms;
  });
  beats.push({at, land: true});
  return beats.map((b) => Object.freeze(b));
})());
/** SPACE TURNS HER LINE (his Nov 26 2026 "pressing spacebar should skip her lines like as if it was a game, like u know?"): the bar shows her next line at
 *  once, as a game's dialogue does. spaceStep(entrance, i, turnLeft): what a press does on beat i (turnLeft: its line's turn still to come) -> {turn: let the
 *  line's egg go now, play: the beat to show now or null, wait: ms to the beat after it}. A pose or hit still to come on a line is left unsaid; her last line
 *  lets the egg go at once and she lands as it lands (its fall whole); nothing on the landing. It ends nothing and asks nothing: her Skip does that. Pure. */
export const SPACE = Object.freeze([' ']);
export function spaceStep(entrance, i, turnLeft) {
  const beat = entrance[i], after = entrance[i + 1];
  if (!beat || !after) return {turn: false, play: null, wait: 0};
  if (!after.land) return {turn: false, play: i + 1, wait: 0};
  return beat.turn?.drop && turnLeft ? {turn: true, play: null, wait: after.at - beat.at - beat.turn.ms} : {turn: false, play: null, wait: 0};
}
/** THE EGG she lets fall (THE EGG FALLS INTO THE CREATOR): the egg her offer pose holds (assets/athena-offer.png, ATHENA_POSE px), drawn at twice its px, lying in it at `box` [x, y, w, h],
 *  so on "egg" it starts where her hands hold it; it falls toward the glass to `to` (the screen's share across and down) at `fill` of the screen's height,
 *  turning `spin` degrees, ease-in as a fall. */
export const ATHENA_POSE = Object.freeze([628, 640]);   // her poses' px (assets/athena-*.png)
export const EGG = Object.freeze({src: new URL('./assets/athena-egg.png', import.meta.url), pose: 'offer', box: Object.freeze([105, 354, 166, 225]), to: Object.freeze([0.5, 0.56]),
  fill: 1.6, spin: 16, ease: 'cubic-bezier(.55,0,.9,.4)'});
/** DROP: the line her egg falls on, when it leaves her hands and how long it falls: from her reading reaching "egg" to the beat she would land on, so it hits
 *  the glass as her entrance ends. Null when no line drops it. */
export const DROP = Object.freeze((() => {
  const i = ENTRANCE.findIndex((b) => b.turn?.drop);
  if (i < 0) return null;
  const at = ENTRANCE[i].at + ENTRANCE[i].turn.ms;
  return {beat: i, at, fall_ms: ENTRANCE.at(-1).at - at};
})());
/** TELEPORT: where the egg hits the glass, one flash (her card's white and focus lines, its ドン). The white is whole at the hit and stands over everything,
 *  her making included; her making opens under it open_ms in, at once, with no fade; the white and ドン leave it over reveal_ms, starting hold_ms after
 *  the hit and never before her making stands. Then she is gone with her egg for this page: her layer let go, nothing of her left to hold it again.
 *  THE ROAD IS ONE TAKE (his Oct 30 2026 08:09:46 UTC "i think it could be smoother", over the road in the preview): from the egg to the creator the
 *  screen is the egg, the white or the creator, never the old scene between them. */
export const TELEPORT = Object.freeze({sfx: 'ドン', open_ms: 60, hold_ms: 240, reveal_ms: 450});
export const ENGINE = Object.freeze({register: new URL('../../../roma-engine.js', import.meta.url), engine: new URL('../../../lysa-engine.js', import.meta.url)});
export const ATHENA = new URL('./assets/athena.png', import.meta.url);
// THE GUIDE IS YOUR SWARMY (his Oct 30 2026 ~12:1x UTC, over the mint in the preview, after "this is what gets shown when i click enter the world": "what
// if you replace the floating nefertiti in the webpage with the lyssajudron just created and we use that for the guide vs anything else? that
// lyssajudron could explain the 2nd video etc..."). Nefertiti keeps her entrance and the egg she hands over. Once her making has its picture (its
// Continue, "Enter the world": dl-her-colours.js KIT_HER, a picture of her renderer's own canvas, transparent round her), the guide is the visitor's
// own Lyssajudron: the same layer and its law (the topics, the bubble, the doors), that picture as its figure, no engine under it; Nefertiti does not
// come back for the page. `img`: where the page holds her picture; `share`: her height in the guide's square; `aspect`: the picture's (a square);
// `making`: her making while it stands open (dl-her-colours.js .dl-her, 'on'), the page's top, which the guide steps aside for as for a dialog.
export const SWARMY = Object.freeze({img: '[data-kit-her]', share: 0.86, aspect: Object.freeze([1, 1]), label: 'Your Swarmy', making: '.dl-her.on'});
// THE GUIDE STEPS OUT OF THE WORLD (his Oct 30 2026, over her bubble "What happens in it?" laid over the world at the film's end, beside the Lyssajudron's card:
// "please fucking restructure it there as well... i dont want that fucker to fuck around likethat"): while the world stands (warm-spatial.js data-world-open)
// the guide is parked as for her making: no bubble, no roaming over the world, whose own cards speak there (since NOTHING FLOATS AFTER HER MAKING, Nefertiti's
// layer is the one guide, and it leaves at her making's end; ASIDE parks it over her making, the world and the film)
// NOTHING FLOATS ON THE FILM (his Oct 30 2026, over "Shhh. / Shut up and watch the movie." standing over his governance film: "fucking fix the logic of this because
// it stays all the duration floating on the fucking movie"): while his film plays on its first visit (dl-space-router.js, #purpose[data-film-going], from WATCH
// THE FILM to its end or her Skip) the guide is parked too
export const ASIDE = '.dl-her.on, [data-world-open], [data-film-going]';
export const LANES =Object.freeze(['#dcc27a', '#9c7b3c', '#c4a052', '#dcc27a']);   // her four wires in the page's golds (harmony.html: its orange)
// THE DEPTH (Oct 27 2026 23:xx WET, his "maximize the FPS until idk 140fps or something for her? like, optimize the code and make it parallax depth like
// i want this 2D thing to become 3D-ish"): her figure is one body that is 3D already (unit0 and her twelve on their wires, projected by the engine) under
// one plane, Athena's sprite. THE BODY TURNS TOWARD HIS POINTER: the engine's camera yaws and pitches by the look (lookYaw, lookPitch on the instance:
// cameraAt adds them), so the twelve behind unit0 slide against the twelve before it, by the one projection that paints them, nothing invented. THE
// SPRITE SLIDES WITH THE POINTER, nearest (perch `translate`, the compositor's: no paint). The look is the pointer's pull from her centre, tanh over
// DEPTH.radius px (soft to the edge, never a snap at a clamp), on a critically damped spring (followStep, DEPTH.omega) stepped on the engine's own
// picture: at the display's rate while it moves, nothing written once it has settled (DEPTH.settle). The tank (the purse's layers inside unit0) stays
// where unit0's centre is: a turn about the centre moves no centre. A reader who asked for less motion keeps her still.
export const DEPTH = Object.freeze({radius: 420, yaw: 0.48, pitch: 0.26, sprite: [9, 6], omega: 7, settle: 0.003});   // settle: a look within this of its target (0.0014 rad: a tenth of a px on unit0) stands

export const clamp = (v, lo, hi) => (hi < lo ? lo : Math.min(hi, Math.max(lo, v)));
export const tidy = (s) => (s ?? '').replace(/\s+/g, ' ').trim();
/** said(root, sel): the text of the first `sel` under `root`, tidied; '' when there is none. */
export const said = (root, sel) => tidy(root?.querySelector?.(sel)?.textContent);

/** lookOf([px, py], [cx, cy], radius): his pointer's pull on her, from her centre: [-1..1]², tanh of the offset over `radius` px. None: [0, 0]. Pure. */
export function lookOf(pointer, centre, radius = DEPTH.radius) {
  if (!pointer || !centre || !(radius > 0) || ![pointer[0], pointer[1], centre[0], centre[1]].every(Number.isFinite)) return [0, 0];
  return [Math.tanh((pointer[0] - centre[0]) / radius), Math.tanh((pointer[1] - centre[1]) / radius)];
}
/** depthOf([lx, ly], d): what a look writes: the camera's turn (yaw: unit0's front slides with the pointer, the twelve behind it against; pitch: the front
 *  rises when the pointer is above her) and the sprite's slide [x, y] px, nearest. Pure. */
export function depthOf([lx, ly], d = DEPTH) { return {yaw: -lx * d.yaw, pitch: -ly * d.pitch, sprite: [lx * d.sprite[0], ly * d.sprite[1]]}; }
/** lookStep(at, v, want, dt, d): the look's spring, one step on both axes -> {at, v, moving: whether anything moved past d.settle}. Pure. */
export function lookStep(at, v, want, dt, d = DEPTH) {
  const nat = [at[0], at[1]], nv = [v[0], v[1]]; let moving = false;
  for (const i of [0, 1]) {
    if (Math.abs(at[i] - want[i]) <= d.settle && Math.abs(v[i]) <= d.settle) { if (at[i] !== want[i] || v[i] !== 0) moving = true; nat[i] = want[i]; nv[i] = 0; continue; }   // the last step lands on the target exactly (written once), then rest
    [nat[i], nv[i]] = followStep(at[i], v[i], want[i], dt, d.omega); moving = true;
  }
  return {at: nat, v: nv, moving};
}
/** followStep(x, v, target, dt, omega): one step of a critically damped spring, exact for any dt (no overshoot from rest) -> [x, v]. Pure. */
export function followStep(x, v, target, dt, omega = FOLLOW.omega) {
  const d = x - target, c = v + omega * d, e = Math.exp(-omega * dt);
  return [target + (d + c * dt) * e, (v - omega * c * dt) * e];
}
/** besidePointer([px, py], box, view): her box's top-left beside the pointer, to its lower right, else on the side the viewport has room for; inside it. Pure. */
export function besidePointer([px, py], box, view, f = FOLLOW) {
  let x = px + f.dx, y = py + f.dy;
  if (x + box.w > view.w - f.margin) x = px - f.dx - box.w;
  if (y + box.h > view.h - f.margin) y = py - f.dy - box.h;
  return [clamp(x, f.margin, view.w - box.w - f.margin), clamp(y, f.margin, view.h - box.h - f.margin)];
}
/** dockOf(rect, py, box, view, corner): where she stops at a topic: perched on its top right corner when that edge is on screen with room over it (her
 *  foot DOCK.sink over the edge), else at its right edge (outside when the viewport has room, else just inside), level with the pointer and within the
 *  topic's part on screen; the corner (the stop) is the viewport's lower right, over the film's buttons: `corner` true takes DOCK.corner, a pair
 *  [right, bottom] takes that corner instead (the Harmony window: over its ball). Pure. */
export function dockOf(rect, py, box, view, corner = false, d = DOCK, f = FOLLOW) {
  const inX = (x) => clamp(x, f.margin, view.w - box.w - f.margin), inY = (y) => clamp(y, f.margin, view.h - box.h - f.margin);
  if (corner) { const [r, b] = Array.isArray(corner) ? corner : d.corner; return [inX(view.w - box.w - r), inY(view.h - box.h - b)]; }
  if (rect.top - box.h + d.sink >= f.margin && rect.top < view.h - f.margin) return [inX(rect.right - box.w * 0.6), inY(rect.top - box.h + d.sink)];
  const out = rect.right + d.gap, x = out + box.w <= view.w - f.margin ? out : rect.right - box.w - d.gap;
  return [inX(x), inY(clamp(py - box.h / 2, Math.max(rect.top, f.margin), Math.min(rect.bottom, view.h - f.margin) - box.h))];
}
/** bubbleAt([x, y], box, size, view, low, avoid): her bubble's top-left: beside her (right, then left: its top level with hers, or its bottom with hers
 *  when `low`, the stop's, so it stays under his circle), then over her, then under her: the first of those inside the viewport that leaves `avoid` (her
 *  topic) uncovered, else the first inside the viewport, else the nearest. Pure. */
export function bubbleAt([x, y], box, size, view, low = false, avoid = null, b = BUBBLE, f = FOLLOW) {
  const level = low ? y + box.h - size.h : y + 8, mid = clamp(x + box.w / 2 - size.w / 2, f.margin, view.w - size.w - f.margin);
  const places = [[x + box.w + b.gap, level], [x - b.gap - size.w, level], [mid, y - b.gap - size.h], [mid, y + box.h + b.gap]];
  const fits = ([px, py]) => px >= f.margin && py >= f.margin && px + size.w <= view.w - f.margin && py + size.h <= view.h - f.margin;
  const clear = ([px, py]) => !avoid || px >= avoid.right || px + size.w <= avoid.left || py >= avoid.bottom || py + size.h <= avoid.top;
  const at = places.find((p) => fits(p) && clear(p)) ?? places.find(fits) ?? places[1];
  return [clamp(at[0], f.margin, view.w - size.w - f.margin), clamp(at[1], f.margin, view.h - size.h - f.margin)];
}
/** topicOf(el, topics): the first topic (the list's order, the narrowest first) whose element holds `el` -> {topic, el} or null. */
export function topicOf(el, topics) {
  if (!el?.closest || !topics) return null;
  for (const topic of topics) { const at = el.closest(topic.sel); if (at) return {topic, el: at}; }
  return null;
}
/** arrivalAt(t, end, s): how much of her a film's second t shows as it nears its end: none until s before it, all of her at it (smoothstep). Pure. */
export function arrivalAt(t, end, s) {
  const k = (t - (end - s)) / s;
  return Number.isFinite(k) ? (k <= 0 ? 0 : k >= 1 ? 1 : k * k * (3 - 2 * k)) : 0;
}
/** figureOptions(RQ, side): the original lyssajudron as THE OVERLAY WE HAD BEFORE mounted it (harmony-mac/runtime/ui/lyssajudron.js, Sept 21 2026),
 *  on the engine's own time as Harmony's corner ran it (harmony.html LYSA.mount), driven (it plays only the ballots this page opens, never an invented
 *  session). The overlay's cut, his words over it: "imagine those orbiting ones are just spots... make them transparent, remove them, they are
 *  cluttering... god performance" (the register at depth one, unit0 and its twelve chairs, the twelve riding the wires as beads: CHILD_SCALE .11 under
 *  the engine's own 22 px bead line) and "turn the goldberg surface into a glassy thing where i can see inside" (glass .3). Measured on the mint page
 *  over the strike (99 to 101 s of the film): with the corner's whole figure the page fell from 88 to 75 frames a second and its slowest frames to
 *  25 ms; with this cut, 85 and 17 ms, as with no figure at all. THE DISPLAY'S RATE (Oct 27 2026, his "maximize the FPS until idk 140fps or something
 *  for her"): no cap (fpsCap 0: the engine paints on every frame the display gives; measured in Chrome at 300 x 300: 0.24 ms a picture, so 120 a
 *  second is 3 % of a core), and no offscreen test (cullOffscreen false: the layer is fixed inside the viewport, so the test was a layout read a
 *  frame for an answer that is always "seen"; the layer's own `veiled` keeps the page's hiding and her waiting). */
export function figureOptions(RQ, side) {
  return {name: 'ROMA·0', orgs: RQ.CANON.ORGS, children: {'ROMA·0': RQ.CANON.CHILDREN['ROMA·0'] || []}, size: side, dpr: true, orbit: 1.55, childScale: 0.11,
    agentScale: 0.11, inkScale: 0.45, glass: 0.3, xray: true, xrayGhost: 0.16, fitReach: Math.round(side / 2 - Math.max(10, side * 0.06)), orbitBeadAt: 22,
    yaw0: 0.9, spin: 0.00030, seed: 1077, driven: true, fpsCap: 0, dprMax: 2, cullOffscreen: false, laneStepPx: 4, laneRuns: 5, cullBackFaces: true,
    chamberBatchUnder: 10, ballFlatUnder: 2.5, laneInks: [...LANES]};
}
/** engineOf({fetcher, win}): the register, then the engine (as room/one.html loads them), each run against a window of its own: the only names they
 *  touch there are their own (window.RomaQuantica, window.PoleisEngine) and the screen's devicePixelRatio -> {PE, RQ}. */
export async function engineOf({fetcher = (...a) => fetch(...a), win = globalThis, files = ENGINE} = {}) {
  const [register, engine] = await Promise.all([files.register, files.engine].map(async (url) => {
    const r = await fetcher(url);
    if (!r.ok) throw new Error(`${url.pathname} ${r.status}`);
    return r.text();
  }));
  const own = {get devicePixelRatio() { return win.devicePixelRatio || 1; }};
  for (const source of [register, engine]) new Function('window', source)(own);
  if (!own.PoleisEngine?.mount || !own.RomaQuantica?.CANON) throw new Error('the original lyssajudron did not load');
  return {PE: own.PoleisEngine, RQ: own.RomaQuantica};
}
/** discIn(centre, crown, perch, over): THE FUEL IN HER TANK (his Oct 22 2026 20:39 WEST): her unit0 as a disc in her box's own px, what the one page's purse
 *  painter paints in (room/lyssajudron-purse.mjs mountPurse2D; the one page's discOf, one law): its centre as the engine projects it, its radius the centre
 *  to the crown (unit0's pole: the old overlay's radix()), and how high over the centre it is free of her (her feet: the tank's ceiling, never under 0.3 of
 *  the radius nor over it, so a full tank reaches her feet and the level can be read on what is seen of unit0). centre and crown [x, y] and perch {top,
 *  height} in the engine's square; over: how far down the square sits in her box (seat()). null without a centre or a radius. Pure. */
export function discIn(centre, crown, perch, over = 0) {
  if (!centre || !crown || !perch || ![centre[0], centre[1], crown[0], crown[1], perch.top, perch.height].every(Number.isFinite)) return null;
  const r = Math.hypot(crown[0] - centre[0], crown[1] - centre[1]);
  if (!(r > 0)) return null;
  return {x: centre[0], y: centre[1] + over, r, top: clamp(centre[1] - (perch.top + perch.height), 0.3 * r, r)};
}
