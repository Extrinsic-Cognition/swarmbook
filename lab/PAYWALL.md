# THE PAYWALL ON THE GOLDEN ARMOR: the mint's film stops at his 37.132 s, the two seats stand there, a holder plays on (Oct 14 2026, 20:15 to 21:1x WEST, lane/paywall)

## THE WALL AT FRAME 1380, ON THE BUILT SITE: a visitor with the sound off plays through it (Oct 17 2026, 04:0x to 05:01 WEST, lane/the-wall-at-1380-proved)

**The finding.** On the site built from main, a visitor who never turns the sound on is not reliably held at frame 1380.
- Four full runs went over it: main b2279db96 (it holds lane/the-seat-feeds-swarmy) three times, and main 0271f95bd (the light-boomerang, the
  debug word and the trace store) once.
- 17 of 50 muted arrivals held, 15 of 42 at the visitor's own speed.
- In the others the film played straight through the wall. The wall stayed at "watch" and the presentation (Opus's liquor glass) never started.
  The film was still playing when the proof stopped waiting: 22 s past the wall in bareid (68.47 s) and 30 s past it in choice (76.40 s).
- With the sound on it held 4 of 4.
- Nothing of the page was changed: that needs his word.

**Why.** Two lines in `app/dl-twelve.js`, both from e6ecbb401 (Oct 16 02:19). They are lines 94 and 140 at b2279db96, and 142 and 188 on main
6a88044d4 (Oct 17 12:15), where the debug start sits above them:
- The first hands each presented frame to `draw`. At the first presented frame of 1380 it calls `sync()` and returns, and it asks for no next
  frame.
- The second makes `sync()` start the presentation only when `reached(film.currentTime)`. That reads the film's own clock, not the presented
  frame's second.
- In Chrome the two differ by a few milliseconds either way in that callback (`race` in `paywall.proof.json`: frame 1380 is shown at 46.046 s,
  and the threshold is 46.0459 s).
  - All 33 arrivals whose clock read short of the presented frame played through. The shortfall was 0.1 to 17.1 ms.
  - All 17 arrivals whose clock read level or ahead held. They were 0.1 to 24.7 ms ahead.
  - The pair's slow approach (a tenth of the speed) held 2 of 8.
- Main 0271f95bd changed `dl-twelve.js` (THE DEBUG START, which needs `?debug` or the Nest's word and is off under automation) but not
  these two lines. It held 5 of 13 muted arrivals.
- After a miss nothing asks again. The page draws no more frames from the film (the sphere's moment stays at 46.01 s), and the film plays on.
- The next cause that calls `sync()` puts the film back on frame 1380 from wherever it has got to. Such a cause is a scroll that takes the hero
  out of view and back, or a press. The checkout's scroll pulled the visitor's page back from 48.10 s to 46.0627 s, two seconds. The wall's own
  law is "never further back than a frame".
- With the sound on, the paywall's `timeupdate` on the song (`app/dl-paywall.js` line 343) holds the film within a quarter of a second. That is
  why the proofs of the new wall never saw this: the liquor proof taps the sound first, and so did the frames captured for his iPad. Rule 8's
  proof never reaches the wall: it reads the 4 s after a tap at 6 s.
- The unit tests cannot reach it. `dl-paywall.test.mjs`'s stand-in film presents exactly the second its clock reads, and `dl-twelve.test.mjs`
  reads `dl-twelve.js` as text.

**A diagnosis, not a change.** On the new Mac, a clone of the built site had three lines of its built `app/dl-twelve.js` changed so that the hold
also takes the presented frame's second: `draw` calls `sync(presented?.mediaTime)`, `sync` takes it as `shown`, and the presentation starts when
`reached(film.currentTime) || reached(shown)`. The clone was never committed, was served only to this proof, and was deleted after. On it,
every muted arrival on the built site held: 11 of 11 (run 7), one of them with the clock 22.6 ms short.
- Every built-site pass passed except the tracenet road. That run had the proof before its "Enter Tracenet" step.
- The visitor held at 46.0627 s on frame 1380: 1,379 frames from 0.07 s, none past the hold, one forward seek onto it (46.0455 to 46.0627 s).
- Once the glass settled (4.7 s), nothing ran in 5 s at rest: 0 animation frames, timers and draws.
- The lab's two passes ran on the tree, which is main's own code, and played through there as they do on main. That is one way to mend the hold. The mend, and whether to publish before it, are his.

**What the proof does now** (`lab/paywall.proof.mjs`):
- Every moment comes from the page's own constants (`HOLD_FRAME`, `HOLD_S`, `CHOICE_FRAMES`, `FRAME_S`, `choiceAt`, `mintLine`), counted in
  frames. No second of the film is written in the proof. On Oct 17 03:4x it still drove the old wall (frame 1111, 37.132 s) and waited 20 s for
  a hold 9 s further on.
- Each pass is judged by named checks against the page's current law, and the run exits 1 when one fails.
- A pass that fails records what each of its pages showed: the state, the frames around the hold with the film's clock, the seeks, a picture.
  The next pass still runs.
- The passes with several parts run each part on its own page: choice, not mint, the gold seat; returning's two visits, the tracenet and the
  phone; window's over and within; lab's review and visitor.
- `--upstream <origin>` takes every byte but the Worker's from a static server: here `tools/serve-range` over the build, which answers 206 for
  a range. The page is `/app/warm.html`, as optimism.fit serves it. The lab pass runs on the tree, because the build ships no lab.
- The stand-in Worker also answers `/api/premint/tank` as `worker/premint.mjs` counts it (`tankOf`). The page's load reads (holders, tank) are
  kept out of the "asked nothing" checks.
- Every page's first arrival at the wall is a row of `race`: held or not, the sound, the rate, and the presented frame 1380 beside the film's
  clock read in the same callback.

**The law each pass holds the page to.** This is main's page with the cinematic on, as everyone meets it:
- The picture holds on frame 1380 for every viewer, holders included ("Presentation holds independently of checkout authorization and has no
  auto-exit").
- For a viewer with no paid receipt the wall holds too, and the choice stands at stage 3.
- For a holder, for a minter's view (`?paywall=off` in the lab) and after the mint's 7 days, the wall opens and the choice goes, while the
  picture is still held.
- The soundtrack runs on through the hold, never paused or sought there.

**Each pass.** Runs 9 and 10 are the proof as committed: 33b8f9484, and its merge with main f83903245. Run 7, the diagnosis copy, had the proof
before the tracenet's "Enter Tracenet" step (2cb4dee7b). The lab pass runs on the tree, so in run 7 it is main's own code.

| pass | main b2279db96 built (run 9) | main 0271f95bd built (run 10) | the diagnosis copy (run 7) |
| --- | --- | --- | --- |
| before | PASS: playing 109.9 rAF and 110.2 GL draws a second; under its own Pause 300 rAF in 5 s (raf tick) | PASS: playing 119.2 rAF and 119.2 GL draws a second; under its own Pause 300 rAF in 5 s (raf tick) | PASS: playing 109.2 rAF and 109.2 GL draws a second; under its own Pause 300 rAF in 5 s (raf tick) |
| visitor | FAIL (ranToItsEnd): never held; film at 48.10 s (frame 1441, playing), wall watch, presentation off | PASS: held at 46.0471 s on frame 1380, 0 frames past, back at most 0 s; at rest 0 rAF, 0 draws | PASS: held at 46.0627 s on frame 1380, 0 frames past, back at most 0 s; at rest 0 rAF, 0 draws |
| checkout | FAIL (fromTheWall, neverBackPastAFrame): before the press: watch at 48.1061 s (frame 1441); the page's seeks of the picture [[48.1082,46.0627]]; opened 51 ms after Connect, receipt; film 46.0627 s | PASS: before the press: held at 46.0471 s (frame 1380); the page's seeks of the picture []; opened 43 ms after Connect, receipt; film 46.0471 s | PASS: before the press: held at 46.0627 s (frame 1380); the page's seeks of the picture []; opened 34 ms after Connect, receipt; film 46.0627 s |
| notmint | PASS: held on frame 1380 at 46.0507 s, 0 seeks; says "The code is free on day 15, with no $WARM." | FAIL (ranToItsEnd): never held; film at 68.43 s (frame 2050, playing), wall watch, presentation off | PASS: held on frame 1380 at 46.0627 s, 0 seeks; says "The code is free on day 15, with no $WARM." |
| choice | FAIL (ranToItsEnd): never held; film at 76.43 s (frame 2290, playing), wall watch, presentation off | FAIL (ranToItsEnd): never held; film at 76.43 s (frame 2290, playing), wall watch, presentation off | PASS: before 0, cut 1, question 1, face 2, seats 2, beam 3; the wall stage 3 |
| choice, not mint | FAIL (ranToItsEnd): never held; film at 76.38 s (frame 2289, playing), wall watch, presentation off | FAIL (ranToItsEnd): never held; film at 76.35 s (frame 2288, playing), wall watch, presentation off | PASS: the wall held; says "The code is free on day 15, with no $WARM." |
| choice, the gold seat | PASS: the checkout opened for gold | PASS: the checkout opened for gold | PASS: the checkout opened for gold |
| song | PASS: tap at 40.5572 s, song in at 40.5814 s; held at 46.0627 s; the song 46.1195 to 50.1361 s over 4 s, 3 seeks of it (the join's) | PASS: tap at 40.5541 s, song in at 40.564 s; held at 46.0561 s; the song 46.0908 to 50.1122 s over 4 s, 3 seeks of it (the join's) | PASS: tap at 40.5609 s, song in at 40.5842 s; held at 46.0627 s; the song 46.0612 to 50.078 s over 4 s, 3 seeks of it (the join's) |
| holder | FAIL (playedToTheFrame, pictureHeldForEveryone): open (receipt), 1 ask; film 69.0226 s (frame 2068, playing) | FAIL (playedToTheFrame, pictureHeldForEveryone): open (receipt), 1 ask; film 69.0472 s (frame 2069, playing) | PASS: open (receipt), 1 ask; film 46.0706 s (frame 1380, paused) |
| bareid | PASS: held, 0 asks; film 46.0493 s (frame 1380) | PASS: held, 0 asks; film 46.0473 s (frame 1380) | PASS: held, 0 asks; film 46.0627 s (frame 1380) |
| returning, a new browser | FAIL (ranToItsEnd): never held; film at 68.45 s (frame 2051, playing), wall watch, presentation off | PASS: opened 54 ms after one press; 2 receipt reads; Golden Aiolos · paid · 9.626492107 SOL | PASS: opened 45 ms after one press; 2 receipt reads; Golden Aiolos · paid · 9.626492107 SOL |
| returning, a proof past its 30 days | PASS: opened 50 ms after one press; 2 receipt reads; Golden Aiolos · paid · 9.626492107 SOL | FAIL (ranToItsEnd): never held; film at 68.42 s (frame 2050, playing), wall watch, presentation off | PASS: opened 37 ms after one press; 2 receipt reads; Golden Aiolos · paid · 9.626492107 SOL |
| returning, a tracenet | PASS: opened 31 ms after one press; 2 receipt reads; Golden Aiolos · paid · 9.626492107 SOL | PASS: opened 63 ms after one press; 2 receipt reads; Golden Aiolos · paid · 9.626492107 SOL | FAIL (ranToItsEnd): waited 20000 ms for document.getElementById("tn-holder")?.hidden === true |
| returning, on a phone | FAIL (a tracenet): the wall: 22 to 223 px, 44 px tall; a tracenet: 67 to 213 px, 32 px tall | FAIL (a tracenet): the wall: 22 to 223 px, 44 px tall; a tracenet: 67 to 213 px, 32 px tall | FAIL (a tracenet): the wall: 22 to 223 px, 44 px tall; a tracenet: 0 to 0 px, 0 px tall |
| window | FAIL (withinTheWall): over: open (window), film 46.0474 s; within: watch, film 69.3716 s, "The mint is open 7 days: 5 days left." | FAIL (withinTheWall): over: open (window), film 46.0461 s; within: watch, film 69.3631 s, "The mint is open 7 days: 5 days left." | PASS: over: open (window), film 46.0506 s; within: held, film 46.0627 s, "The mint is open 7 days: 5 days left." |
| phone | FAIL (ranToItsEnd): never held; film at 68.45 s (frame 2051, playing), wall watch, presentation off | FAIL (ranToItsEnd): never held; film at 68.44 s (frame 2051, playing), wall watch, presentation off | PASS: held on frame 1380; mint-tier=bronze 41 to 349 px, 52 px; mint-tier=gold 41 to 349 px, 52 px; mint-holder 22 to 223 px, 44 px; paywall-not 22 to 240 px, 44 px |
| lab, review | FAIL (pictureHeldForEveryone): open (lab), film 69.0586 s (frame 2069); the panel attached: false | FAIL (pictureHeldForEveryone): open (lab), film 69.0417 s (frame 2069); the panel attached: false | FAIL (pictureHeldForEveryone): open (lab), film 69.0521 s (frame 2069); the panel attached: false |
| lab, visitor | FAIL (ranToItsEnd): never held; film at 48.10 s (frame 1441, playing), wall watch, presentation off | PASS: held at 46.0464 s on frame 1380, back at most 0 s; the panel attached: false | FAIL (ranToItsEnd): never held; film at 48.10 s (frame 1441, playing), wall watch, presentation off |

The race in each run: run 9 held 4 of 13 muted arrivals, run 10 held 5 of 13, and run 7 held 11 of 11 on the built site. Every run held 1 of 1
with the sound on.

**Rule 8 on the same built site** (`app/dl-twelve.proof.mjs --url http://127.0.0.1:<serve-range>/app/warm.html`, after run 7):
- `--tap button`: PASS 7 of 7, the film never below its 6.05 s at the tap;
- `--tap sphere`: PASS 7 of 7, at 6.03 s.
Its law is the tap's, not the wall's: it reads the 4 s after a tap at 6 s.

**The run.** The new Mac, Oct 17 04:15 to 05:01 WEST, at load 6 to 21; Chrome for Testing 156.0.8078.4, headless and muted, off every screen.
- Two scratch worktrees (the lane on b2279db96, and its merge with main 0271f95bd) were each built with `tools/build-optimism-fit.mjs --out`:
  1,545 and 1,547 files, about 346 MiB. The two submission films were empty stand-ins, because they are out of git.
- `tools/serve-range` served each build for its run only.
- The proof ran under `nice -n 19` and `tools/dead-tasks/bounded.mjs`, one Chrome at a time. Another seat's Chrome was up during run 4.
- Run 8 was stopped a minute in, because its proof predated the tracenet step.
- The worktrees, the builds, the clone, the server, the logs and the pictures were removed after. The pictures held only the film's frames on
  the page.

**Seen on the way, not the wall's:**
- Under the page's own Pause, `app/swarm-explainer.js`'s `tick` asks 60 animation frames a second (300 in 5 s), and its `swx-subconscious`
  animation runs. This was the before pass, in every run.
- The lab's panel attaches to the page's hero only on its frame's `load`, and the page mounts its hero after that, by a dynamic import. In
  run 4 the lab's `window.hero.theater` stayed null for 60 s, so the panel's slider and moments would not reach the hero. The proof now waits on
  the frame's own hero and records whether the panel attached: it did not, in every run.
- The tracenet's holder road. Since the profile's rewrite the page opens on its laptop scene, and `tracenet-laptop.css` line 65 hides its
  footer, with "Restore Society access" in it, until "Enter Tracenet". The proof now enters first, and the road then holds: one press, one
  signature, the Gold seat listed. On a phone that control is 32 px tall (the footer's buttons have `min-height: 32px`), under the proof's 44 px
  finger. The phone check fails on it in every run.

**His:** whether to publish before the hold is mended, and the mend (it changes the page).

## THE HOLDER'S ROAD (Oct 15 2026, lane/holder-connect)

Under the two seats on the wall, "I hold a seat: connect my wallet" (mine, his to reword): a holder whose kept seat proof is gone (a new browser,
or after its 30 days) connects the wallet that holds the seat and signs once, with no tier chosen and no price on screen (`app/dl-direct.js`
`holder()`, the checkout's own road); the wall opens by that proof and the film plays on from the hold. The Worker is asked for the wallet's
receipts only. Before it, the only road was a seat's price button and the checkout for that tier. The record, the receipt and the proofs
(`lab/paywall.proof.mjs --passes returning`): `app/tracenet/LANDING.md`, THE HOLDER'S ROAD.

## SNOWTRACE IS PANSPERMIA-BENCH (Oct 15 2026)

His correction, verbatim: “project snowtrace and panspermia-bench are the same thing dude... do you not know what it is? it is to test what AIs would do in situations in game. to test their ethics...”

This supersedes the purpose framing in the two entries below. The page had reduced Snowtrace to sponsoring builders and accessing code. Its introduction now names Snowtrace and Panspermia-Bench as the same project and leads with testing AI behavior and ethics in game situations. It names individual models and hybrid swarms, decisions and consequences, and inspectable traces. Funding and code access remain the participation mechanism and retain their existing terms. The copy says “We’re building” and makes no claim that completed ethical evaluations or benchmark results are already available.

Existing lineage read: `docs/panspermia-6gta-cosmos-snowtrace-stocazzo-hypertrace-2026-10-14.md`, especially Sept 14 12:57 (“models individually and then the hybrid swarm”) and Sept 27 15:16 (“models choices and tendencies”, “much more complex situation than the trolley problem”). His current statement resolves the identity directly; older summaries describing separate products do not override it. The film, Harmony styling, checkout, prices and release-day rules are unchanged. This is static copy, with no new runtime work.

Verification: 35/35 existing paywall/clock tests pass. Both required real-browser `dl-twelve.proof.mjs` runs pass on the served `warm.html`, with `--tap button` and `--tap sphere`; sound does not restart the picture. The rendered page was read and checked in the browser. HTML grows from 49,903 to 50,024 bytes (15,010 to 15,105 gzip); zero added scripts or requests.

## DYSONLIGHT HARMONY CONTINUITY (Oct 15 2026)

His correction: “why the fuck you forgot style of dysonlight harmony?” The preceding change introduced Snowtrace but gave it a separate dark olive pricing-page style. This revision restores the welcome's established appearance, as documented in `../../HARMONY-APPEARANCE.md` and `../../HARMONY-ICE.md`: glacier surfaces, slate/navy ink, cyan accents, the existing display typography and faceted geometry. It retains the explanation before the offer and keeps the choices in document flow.

`app/dl-paywall.css` projects the native welcome's effective palette into this separately shipped public bundle. The source values are `../../harmony-ice.css` (including later root overrides), `../../harmony-accent.css` and `../../harmony-ice.hand.css`. A regression check compares the public palette with those sources. The film, Athena, hair, terrain and fighting-pair composition keep their original colours and rendering; no video or canvas filter was added. No new renderer, animation loop, observer, dependency or network request was introduced.

Verification: 35/35 checks pass in `app/dl-paywall.test.mjs` and `app/dl-twelve.test.mjs`. Required served-page browser proofs both pass: `dl-twelve.proof.mjs --url http://127.0.0.1:8923/intro/dyson-society/app/warm.html --tap button` and `--tap sphere`. Both tapped at 6.02 seconds: the sound started at the film's position and the picture never went back. Browser inspection at 808×1049 and 390×844: the explanation precedes the offer, cards stack at phone width, and the 390-pixel page has no horizontal overflow. The mobile hero sentence also keeps its word spacing when the line break is hidden.

CSS: 6,509 → 9,524 bytes (2,007 → 2,800 gzip); HTML: 49,736 → 49,903 bytes (14,964 → 15,010 gzip). This measures transfer size, not a frame-time improvement. Price, release-day, receipt and payment logic are unchanged; the static checkout limitation documented below remains.

## SNOWTRACE BEFORE THE OFFER (Oct 15 2026, screenshot at 11:31 WEST)

The latest human correction: “there is never a point in which project snowrace is introduced” and “i hate these fucking floating shits”. The name in the existing source lineage is Project Snowtrace. This entry supersedes the floating-choice layout below; its older record is retained.

Sources: `docs/dyson-society-snowtrace-tracenet-swarm-money-hypertrace-2026-10-14.md`, `docs/phase-one-lyssajudron-warm-pool-hypertrace-2026-10-14.md`, `app/tracenet/LANDING.md`, and his 00:34–00:40 words below. C-16 requires an introduction before asking someone to join.

The page now names Snowtrace in the opening and explains it below the film: builders share traces and code; followers fund the next work and can build from what has already been learned. The first tracenet is Guido’s open-source work on Harmony and the Nest. Only then do the Bronze, Gold and free choices appear. They occupy document flow and remain readable without waiting for the film. Prices do not cover Athena. The film keeps its own transport, layer composition, clock and verified-receipt gate.

October 15 correction: removing the floating sound invitation was a regression.
The approved “Play with audio on” bubble remains part of this same page, including
the native Athena reconstruction. It floats in once while muted and disappears
when sound is enabled. Its click uses the existing sound control, so the song
joins the current picture without restarting it. `app/dl-twelve.proof.mjs --tap
invite` checks this actual gesture and dismissal alongside the button and sphere
paths. The invitation adds no request, render loop or repeating animation.

Verification on NewMac, October 15: `app/dl-twelve.test.mjs`,
`app/dl-paywall.test.mjs` and `lab/one-page.test.mjs` passed all 50 tests.
The Range-served page passed `app/dl-twelve.proof.mjs --tap invite`, `--tap
button` and `--tap sphere` at 1280 × 1300, plus the invitation at 390 × 844.
Each run passed all seven checks, including no picture restart and invitation
dismissal. The invitation proof also requires a visible, styled, directly
clickable bubble without transport overlap. Screenshot review caught a narrow
label wrap; after keeping it on one line, the 50 tests and phone proof passed
again. The initial proof caught the second suppression in `dl-paywall.css`;
removing only the JavaScript guard was insufficient. Both are now removed.

Prices, release delays and payment authorization are unchanged. `data-layout="editorial"` bypasses the old orbit transitions only for this page. The free choice remains visible; a verified holder no longer sees the paid offer. With no launch date configured, the text says the mint runs seven days **from launch**, rather than falsely saying it is currently open. A missing checkout API gets a readable unavailable message, not a raw JSON parser error.

Verification: 34/34 pass in `app/dl-paywall.test.mjs` and `app/dl-twelve.test.mjs`. Both required `dl-twelve.proof.mjs --url http://127.0.0.1:8923/intro/dyson-society/app/warm.html --tap button` and `--tap sphere` pass: sound comes in at the picture’s time, no restart, both media seekable through the Range server. Browser checks at the normal viewport and 390×844: both tiers open the correct checkout, free-choice feedback works, cards stack, document width is 390, footer remains readable. No wallet connected or transaction made.

Limits: this static preview does not expose `/api/premint/availability`. The live payment service, exact $WARM allocation/delivery and availability of the first full code release are not certified by these UI checks. The existing checkout explicitly calls this pre-mint access and says NFT minting in Harmony is not live. No finance or privacy gate was weakened.

Cost: no new requests, animation loop, observer or dependency for the Snowtrace section. Across the five changed app assets (`warm.html`, paywall CSS/JS, twelve JS, direct JS), gzip bytes go from 35,058 to 35,003. This is a static layout change, not a measured frame-time improvement. The existing 8923 preview process stopped during review and was restored with the same loopback Range server, a 12-hour lifetime and request logging disabled.


## THE HOLD IS THE PREVIOUS SCREEN, AND THE CHOICE IS THE WALL (Oct 15 2026, 01:1x to 01:4x WEST, lane/first-tracenet, step 1)

His words (WEST, verbatim):
- Oct 15 01:0x, over a picture of the stop as main had it (the box "The rest of the film is for minters." with the Bronze and Gold seats and
  "Holding a seat already?...", on the white page, the sphere back behind it): "there is absolutely no need for this. pause at the previous
  screen dude wtf?"
- 00:33, over the box: "this is the most unglorious parasitic copyright ever... can you have there my video for the hackathon submission
  there? i need to publish it still of course"
- 00:34: "like... my dude... my dear dude my god... THAT THING OVER THERE IS THE FIRST TRACENET: SUBSCRIPTION TO YOU BY AI AGENTS OR BROKERS OR
  WHATEVER"
- 00:36: "BUT HERE IT IS PEOPLE SUBBING TO ME BECAUSE I SHIPPED SOMETHING REALLY FUCKING COOL TBH AND THEY WANT THE CODE SO THEY PAY PREMIIM...
  REMEMBER GOLD MINT MEANS ACCESS NOW!!!!! BRONZE MINT MEANS ACCESS AFTER 15 DAYS; THEN IT IS FREE (but they dont get any $WARM in-game
  currency)"
- 00:40: "do you understand that the mint process here is 7 days? and you gey $WARM liquid because it is in-game currency"
- Before them: Oct 14 19:13 "i want to keep 7 day exclusivity: BASICALLY I AM LAUNCHING MY OWN FUCKIG TTRACENET DUDE OK?"; Oct 12 19:38 "we launch
  $WARM now * for the first 15 days the market is restricted to authorized developers with approved github".

What it does (`app/dl-paywall.js`, `app/warm.html` `#dl-paywall-choice`, `app/dl-paywall.css`, `app/dl-twelve.js`):
- **The hold.** For a viewer with no paid receipt the film pauses on frame 1111 (37.070 to 37.104 s), the last before her wall of light
  (1112 holds his 37.132 s and is never shown to that viewer). It pauses on the frame callback that presents 1111, where it stands: no seek,
  unless the pause landed off that frame (a late callback, or the song ahead of the picture), and then it is put on the frame's middle
  (37.087 s), never further back than a frame. The page holds as it stood at that frame: in his lab, black edge to edge, her window, the
  fold. Nothing at the stop brings the white page or the sphere back: the choice is not put away and no box comes up.
- **The choice is the wall.** It stands at stage 3, every piece docked on its Lissajous lane as before (the docks are unchanged). Its words,
  mine and his to reword: Bronze Mint $10, "the code on day 15, and $WARM, liquid"; Gold Mint $1,000, "the code now, and $WARM, liquid"; Not
  mint, "free on day 15, no $WARM"; the line "The mint is open 7 days." (with his launch day set: "The mint is open 7 days: 5 days left.";
  before it, "..., from October 20."; after it a seat pressed reads closed and opens no checkout). It replaces "The rest of the film is for
  minters.". The two seats are the checkout's own `[data-mint-tier]` buttons.
- **"Not mint" is the free way.** Pressed, the hold stays, the choice stays, and its line says "The code is free on day 15, with no $WARM."
  It no longer puts the choice away.
- **The box (`#dl-paywall`) is gone**: from the page, its sheet and the wall's code. Nothing else used its markup: the checkout binds every
  `[data-mint-tier]` on the page, and the choice carries the two seats.
- **His hackathon film is not at the wall** (it was to stand in the box, which is gone); `submission/` is untouched.
- The day words come from the tiered law since step 2 (`app/tracenet-register.mjs` GOLD_DAYS 0, BRONZE_DAYS 15, OPEN_DAYS 15: `paintLaw` writes
  every `[data-law]` piece of the choice), the mint's 7 days are `MINT_DAYS` (renamed from `EXCLUSIVE_DAYS`, the same 7), and after them a seat
  pressed reads closed with the day the code is free; the Worker gates the code by tier (`app/tracenet/LANDING.md`, THE LAW, TIERED). $WARM stays
  inside `app/terms.html` (VI: no promise of value) and `app/fees.html` (IV): no price, yield or value.

What it costs: at the hold 0 animation frames, 0 video frames, 0 timers, 0 2D and GL draws, 0 ms of script and 0.44 ms of tasks in 5 s (the
same zeros as the box had). `app/dl-paywall.css` 6,275 to 4,545 B (2,037 to 1,670 gzip); `app/dl-paywall.js` 18,322 to 22,928 B (7,338 to
8,721 gzip: the mint's line, the closed seats, the hold's frame; most of it comments); `app/warm.html` 49,770 to 49,741 B. The stamps:
`?v=previous-screen-1` on `dl-paywall.css`, `dl-twelve.js` and its import of `dl-paywall.js`.

The receipt (this Mac, Chrome 155 headless and muted, off every screen, Oct 15 01:3x WEST, load 64 to 194; `lab/paywall.proof.mjs --passes
visitor,checkout,notmint,phone,lab`, every pass's page errors: none; every seek of the picture logged by the page's own media prototype, the
proof's own seeks marked):

| pass | what happened |
| --- | --- |
| visitor (the page from its first frame) | 1,108 frames presented from 0.167 s, the last 37.0704 s (frame 1111), **0 past it**; held at 37.0871 s on frame 1111, paused; no box; the choice at stage 3, all five pieces in place; the page's one seek of the picture 37.0685 to 37.0871 s (forward, onto the frame it showed: the slowed run's clock read just under 1111's start); at rest 5 s: 0 of everything |
| the pair, the page | playing at 37.031 s (frame 1109) beside held (frame 1111): **0.25 %** of the pixels differ (the film's frame on the faces and the worlds' places), **0.02 %** of the choice's own box: `paywall-pictures/7-the-hold-on-the-page-playing-at-37.05s-and-held.jpg` |
| lab as it opens (his page) | held at 37.0711 s on frame 1111, **no seek at all**, 0 frames past; the fold's black at opacity 1 playing and held; the choice standing; at rest 0 of everything |
| the pair, his page | playing at 37.035 s beside held: **0.01 %** of the pixels differ, **0** of the choice: `paywall-pictures/6-the-hold-in-the-lab-playing-at-37.05s-and-held.jpg` |
| checkout | the choice's Bronze seat (a trusted click) opened the checkout ("Bronze Mint.", "Connect wallet") with the film held on frame 1111; Connect: the stand-in Worker's paid receipt, "Access reserved", the wall opened 266 ms after, the film on to 39.30 s (67 frames past the hold), the choice put away |
| not mint | pressed at the hold: 3 s later still held on frame 1111 at the same 37.0871 s, no seek, the choice standing, its line "The code is free on day 15, with no $WARM.", the button pressed: `paywall-pictures/9-not-mint-the-hold-stays.jpg` |
| phone 390 x 844 | held on frame 1111, no box; the choice's pieces from x 19 to 371 (inside the 16 px gutters), page width 390 (no sideways scroll), its three buttons on top; at rest 0: `paywall-pictures/8-the-hold-on-a-phone-390x844.jpg` |
| lab `?paywall=off` (a minter's view) | plays on, 60 frames past |

The sound (`~/AGENTS.md`, rule 8), this tree served by `tools/serve-range/serve -p 8999` for the run only: `nice -n 19 node
app/dl-twelve.proof.mjs --url http://127.0.0.1:8999/intro/dyson-society/lab/hero-ab.html --tap button`: PASS (the film never below its 6.01 s
at the tap); `--tap sphere`: PASS (6.02 s). Tests: the folder's 422, 421 pass, 1 skipped, 0 fail (`dl-paywall.test.mjs` 23, `dl-twelve.test.mjs`
9). The pictures are the Saint Seiya film on the page and the choice; nothing of his room.

## THE CHOICE before the wall (Oct 14 2026, 23:20 to 23:5x WEST, lane/mint-choice)

His words (WEST, verbatim, from the transcript's timestamps):
- 23:20, over THE FOLD (Athena's hair in her window, her figure beside it, the page black): "this is where you need to start slowly introducing
  the choice: MINT OR NOT MINT?? because this is the paywall dude... all that comes after this needs to be gated, only the people with bronze
  mint and gold mint see what is after..."
- 23:2x: "the pop-ups you do here must be aligned to the lyssajudron anime harmony animations eh"
- 23:4x: "stop making mess. I WANT TO ALWAYS DO QA ON A SINGLE COMULATED VERSION DUDE"

What it does (`app/dl-paywall.js` THE CHOICE, `app/warm.html` `#dl-paywall-choice`, `app/dl-paywall.css`):
- **The gate stays where his tag put it**, 37.132 s: what comes after is for Bronze and Gold minters, as above.
- **Before it the choice comes in slowly, on the film's own cuts**, her three shots (`lab/cubism.mjs` SHOTS). At her cut (frame 886,
  29.563 s) comes the question, "Mint or not mint?". At her face (frame 1006, 33.567 s) come the two seats ("Bronze Mint $10", "Gold Mint
  $1,000": the checkout's own `[data-mint-tier]` buttons), then "Not mint", then the line "The rest of the film is for minters.", one after
  another, all in place by 36.37 s. At the beam (frame 1096, 36.570 s) it takes the light, a gold glow, once. At the stop it gives way to the
  wall's offer.
- **Aligned to the orbits' animation** (his 23:2x). Each piece docks as a world of the twelve does: along a stretch of the orbits' own
  spherical Lissajous (ratio 3:2 on the four tilted lanes of `warm-assembly.js`). It starts small and unseen and grows to its place
  (`dock()`, on the compositor, 1.4 to 2.4 s a piece). Each one comes from below its place and never rises above it, so her window stays clear.
  The wall's offer now docks the same way, in 0.9 s, in place of its old slide.
- **"Not mint"** puts the choice away until the wall. The wall stands all the same.
- **Who sees it:** never a holder, and never anyone after the 7 days. **His one page**, the lab as it opens, meets it as a visitor does. The
  film stops at the wall there (his Oct 15 2026 00:11 WEST, over his page playing on through it: "you gotta stop the video dude what the
  hell? do you know the meaning of paywall or not?"). `?paywall=off` is a minter's view, kept for the lanes' proofs that look past the
  stop (cubism, unboxing, fields, storyboard, ko-edge, anti-satellites).

## What it costs

| | before (main: the film plays on through 37.132 s for everyone) | predicted | measured at the wall |
| --- | --- | --- | --- |
| animation frames | 59.9 a second (warm-sphere.js `tick`: the sphere turns while the film plays) | 0 | **0** in 5 s |
| video frame callbacks | 30 a second (dl-twelve.js `follow`) | 0 | **0** |
| 2D draws | 59.9 sphere draws and 431.9 `drawImage` a second | 0 | **0** |
| timers | none | none | **0** timeouts, **0** intervals; dl-paywall.js has no timer of its own |
| main thread | 102 ms of script a second (306 ms in 3 s), 123 ms of tasks | about 0 | **0** ms of script, 0.64 ms of tasks in 5 s; 0 layouts, 0 style recalcs; no animation running |
| the stop | none (it plays on) | the frame that holds 37.132 s | frame **1112** (37.104 to 37.137 s) is the last frame presented, **0** frames past it (two runs from the film's first frame, 1,114 frames presented each); the offer up **22** and **35 ms** after the stop frame was presented |
| long frames at the stop | | none | none in the second run; one of 66 ms with 0 ms blocking in the first (NewMac at load 10.3) |
| requests to the Worker | | a visitor 0; a returning holder 1 | a visitor **0**; a returning holder **1** (`GET /api/premint/orders/<id>`); at the wall after Connect: the checkout's own receipts read, then **1** |
| bytes | | about 15 KB | `app/dl-paywall.js` 11,919 B (4,827 gzip), `app/dl-paywall.css` 2,960 B (1,306 gzip), `app/warm.html` +1,298 B |

Measured on NewMac (Chrome for Testing 156.0.8078.4 headless, ANGLE Metal on the M5 Max, load 6 to 10), `lab/paywall.proof.mjs`, the page's own
counters: every `requestAnimationFrame`, `requestVideoFrameCallback`, timer and canvas draw wrapped before the page's scripts ran, with where each
was asked; CDP `Performance.getMetrics` for script, tasks, layouts and style. The cost while a holder plays past the stop was not measured apart:
it is one call and two comparisons a presented frame. Not measured on lysa or on a phone: headless only.

## His words (WEST, verbatim)

- 11:58, his tag on the film's line of time (the Nest's `mint/seiya-tags`, rev 1, 37.132 s): "FUCKING EPIC MOMENT WHERE AIOLOS STARTS APPEARING!!!
  THIS IS WHERE WE WANT TO STOP THE VIDEO AND PUT THE PAYWALL ON THE GOLDEN ARMOR DUDE". His other two: 10.835 s "THIS MOMENT IS FUCKING CRITICAL
  DUDE! THIS IS THE MOMENT OF SACRIFICE!!!!", 61.767 s "THIS MOMENT IS FUCKING KEY IT IS THE FUCKING CONVERSION MOMENT, THE USER HAS SEEN I…".
- 19:13:29: "listen dude... i need to start gettign money i am ran out of credits i need people to start minting... you understand? have you
  forgotten the thing there with saint seya was supposed to have various stepsa nd then a paywall and all the rest of stuff?? the viral videos
  are aiming to overcome the paywall as the paywall is mainly premium paid on novelty... i want to keep 7 day exclusivity: BASICALLY I AM
  LAUNCHING MY OWN FUCKIG TTRACENET DUDE OK?"
- 19:26:51: "show me where the paywall appears please"

## Where the paywall appears (his 19:26)

**On the page optimism.fit serves.** Its build opens on `app/warm.html` (`tools/build-optimism-fit.mjs`: `/ → /app/warm.html`). In that page's
hero, the Saint Seiya film on the dodecahedron, the film plays for everyone through the sacrifice (10.835 s) and stops at 37.132 s: frame 1112
of `saint-seiya.mp4` (?v=53561d47, 30000/1001 fps), the beam of the wall of light opening by Athena's hair, the golden one cut in at 38.071 s.
The offer stands on the sphere, its upper faces holding that frame's light: `paywall-pictures/1-the-wall-at-37.132s-1440x900.jpg`, on a phone
`2-the-wall-on-a-phone-390x844.jpg` (inside the screen with its 16 px gutter, no sideways scroll).

**In the latest draft.** `lab/hero-ab.html` is that same page in a frame with the lab's layers over its hero, so it carries the paywall from the
page with no line of its own. Since Oct 15 2026 00:1x WEST the lab opens it as a visitor meets it: the wall stops the film
(`paywall-pictures/3-the-wall-in-the-lab-draft-paywall-on.jpg`). `hero-ab.html?paywall=off` is a minter's view, for the lanes' proofs that
seek past 37.1 s.

**Which page I changed:** the page itself (`app/`), not the draft. `hero-ab.html` is untouched: THE FOLD's seat (wf_9362e266-a81-2) has it open
uncommitted as I write. None of the files I changed had a commit in the last hour (dl-twelve.js, warm-sphere.js, warm.js, warm.html: last
f7396871, 11:36 WEST).

**On optimism.fit today: nowhere.** The live site still serves the page from before 07:26 WEST; the wall reaches it only with his deploy.

## What it does

- **The stop, on the page's clock.** `dl-twelve.js` already draws the sphere once for each frame the film presents (`requestVideoFrameCallback`).
  It now hands that frame's time to the wall first, with the song's second while the song is the clock; the first frame that holds 37.132 s is the
  last one drawn. A song left running with no frames (the film stalled) stops by its own `timeupdate`. No timer anywhere.
- **Held, nothing runs.** The film and its song pause on 37.132 s (no sound past the wall: the song's furthest second while playing was 37.071 s,
  the song pass), the sphere stands still (`warm-sphere.js` `setHeld`, which the page's own Pause cannot undo), and the offer comes up once (0.6 s
  on the compositor) and holds. Sought past the stop while held, the film goes back to it; sought before it, it may play up to it again.
- **The offer:** the two seats the Worker already sells, in the words the mint section under the hero carries today: "Bronze Mint. Whitelist
  pre-mint access. $10 a slot" and "Gold Mint. Golden Aiolos · pre-mint access. $1,000 a slot". Each is a `[data-mint-tier]` button, so the
  checkout (`dl-direct.js`) opens for its tier exactly as from the mint section. **Mine, marked in warm.html as his to reword:** the title "The rest
  of the film is for minters." and the line "Holding a seat already? Choose it and connect the wallet that holds it." Nothing says what a seat buys
  beyond the page's own lines.
- **A holder plays on, by the road the page already has.** The checkout keeps the id of each order it opens (`localStorage`
  `dyson-mainnet-order-v1:<wallet>:<tier>`); the Worker answers for it (`GET /api/premint/orders/<id>`: `paid`, the pinned recipient, the current
  terms). A browser with none asks nothing; one with some asks once at load. At the wall, a purchase, or the holder's wallet connected in the
  checkout (which reads its receipts from the Worker and saves the paid one), fires `dl-premint-paid`: the wall asks for that receipt and opens,
  and the film plays on from 37.132 s. Nothing new on the Worker.
- **The 7 days:** `LAUNCH_DAY` in `app/dl-paywall.js`, one constant with his words beside it, `null` today. Unset (or not a date), the paywall is
  on every day. Set, for example `'2026-10-20T00:00:00+01:00'`, the rest of the film is for minters for 7 days from that instant and plays for
  everyone after; while it stands, the offer says the day it opens ("Open to everyone from October 19." in `5-...launch-set.jpg`, where the proof's
  door set it 2 days back). It is read at load, at the stop and when the page is shown again: no timer waits for the eighth day.
- **What it is not: a lock.** The film's file (`saint-seiya.mp4`, 20.7 MB, cached for a year) is served whole to whoever asks for the file itself,
  and the wall's state lives in the visitor's browser. It stops the page, which is what sells novelty to the many; it does not stop someone who
  downloads the file. A wall that holds would serve the film past 37.132 s from the Worker only against a receipt the buyer signs for (the lineage
  ledger's row 23, its second half): a Worker change, his to order.

## The receipt (NewMac, `lab/paywall.proof.mjs`, Oct 14 2026 20:44 and 20:48 WEST)

The door served this tree's `embertide-app/ui` and a stand-in of the Worker's GET answers (its own `publicOrder` shape); it refused everything
else (Google Fonts' DM Sans and the Nest's tags read were refused and listed; no Solana, no unpkg, no Coinbase). The stand-in wallet is 32 random
bytes with no key; the stand-in receipts' signatures are random bytes that were never a transaction. No purchase, nothing posted.

| pass | what happened |
| --- | --- |
| before (main's page) | from 36 to 39 s the film plays through 37.132 s (57 frames past it): 59.9 animation frames, 30 video frames, 431.9 draws a second; under the page's own Pause, 0 of each in 5 s |
| visitor | from the film's first frame: held after 37.16 s of play at 37.132 s, 1,114 frames presented, the last 37.1037 s (frame 1112), 0 past it; the offer up, opacity 1, on top (the topmost element at its centre is its own), 470 x 219 at (545, 419) in 1440 x 900; 5 s at rest: the zeros above |
| checkout, from that wall | the offer's Bronze seat opened the checkout ("Bronze Mint.", "Connect wallet"); Connect: the stand-in Worker listed the wallet's paid receipt, the checkout said "Access reserved" and "Payment finalized...", the wall asked `GET /api/premint/orders/<id>` and opened 49 ms after the press; the film played on to 39.24 s, 63 frames past the stop; the offer gone, the sphere turning |
| song (the song is the clock) | from 33 s with the sound on: the film and the song both paused at 37.132 s, the song's furthest second while playing 37.071 s, the last frame 1112, 0 past |
| holder (a stand-in receipt carried) | one ask at load, opened by the receipt; from 35 s through 39.03 s, 0 holds, 57 frames past the stop; the Worker saw one `GET /api/premint/orders/<id>` |
| window | launch day 8 days back: open for everyone at load, the film on to 38.51 s; 2 days back: held, the offer reads "Open to everyone from October 19." |
| phone 390 x 844 | held; the offer at x 16 to 374 (its 16 px gutter), page width 390 (no sideways scroll), on top; 3 s at rest: 0 frames, 0 draws, 0 timers |
| lab, as it opens | `hero-ab.html?v=film`: opened as the lab's review, the film from 35 s to 39.05 s, 58 frames past the stop |
| lab, `?paywall=on` | held at 37.132 s on frame 1112, 0 past, the offer on top of the lab's layers; 5 s at rest: 0 frames, 0 video frames, 0 timers, 0 2D and 0 GL draws, no animation running; 47 style recalcs and 19.7 ms of tasks in those 5 s are the lab's own (the page alone: 0 and 0.64 ms), not chased |

Page errors in every pass: none. Nothing left running on NewMac (`pgrep` of the scratch folder and the proof's Chrome profile: none); its
scratch folder removed.

## Tests

- `node --test embertide-app/ui/intro/dyson-society/app/dl-paywall.test.mjs`: 14 of 14 (the constant in one place and unset; the 7 days to
  the millisecond; frame 1111 plays and 1112 stops; the receipts the checkout saved; a paid receipt's five conditions; a visitor's stop with
  nothing asked; the song as the clock and a song with no frames; a returning holder; the checkout's paid receipt at the wall; a Worker that
  says no, or none; seeks while held; the lab's review and `?paywall=on`; the page's markup, wiring and the sphere's hold).
- The mint's neighbours, unchanged: the sphere's moments, the holder orbits, the wallets, the sale tiers, the Worker: 46 of 46.
- The proof (NewMac, about 2.5 minutes for all eight passes): `node embertide-app/ui/intro/dyson-society/lab/paywall.proof.mjs --out <dir> --base <main's embertide-app/ui>`
  (`--passes` picks among before, visitor, checkout, song, holder, window, phone, lab).

## His presses (nothing of these was touched)

1. **The deploy**, from `embertide-app/ui/intro/dyson-society`: `node tools/build-optimism-fit.mjs` then `npx wrangler deploy --config
   wrangler.optimism-fit.jsonc`. It ships all of main since the live page (07:26 WEST): the sound first, her wallet's road, f7396871's moments
   (still waiting for his keep or revert) and this wall.
2. **`LAUNCH_DAY`** in `app/dl-paywall.js`: the first instant of the launch day with its offset. Until he sets it the wall stands every day.
3. **The Worker's `PREMINT_ENABLED`** (`wrangler.optimism-fit.jsonc`, `"true"` live): whether the checkout takes new orders. The offer opens the
   checkout either way; paused, the checkout says purchases are being prepared, and a holder's receipt still opens the wall (orders are read while
   paused).
4. **The terms** (`app/terms.html`, still "Draft. Not yet reviewed by counsel"): what a seat buys. The offer tells a visitor the rest of the film
   is for minters; whether the terms say so is his and counsel's.
5. **The words:** the offer's title and the holders' line (mine, marked in warm.html), the two seats' lines (the page's today), and where on the
   sphere the offer stands (its top half on the lower faces; `app/dl-paywall.css`, one transform).

## Not done, and why

- No lock: the file is public (above). Closing it is a Worker change and his.
- Not on lysa or a phone device: headless on NewMac only.
- The draft as THE FOLD's seat has it now (uncommitted in a81-2) was not run with the wall; main's `hero-ab.html` was.
- The lab's 47 style recalcs at rest are the lab's, not the wall's; not chased.
- Nothing deployed, nothing signed, nothing sent; the Worker, its config, its prices and its database untouched.

## The wishes it touches (rule 6; lines for the wishes doc)

- Under **Dyson Society mint page and $WARM mint (new:dyson-society-minting)**: "- Oct 14 2026 21:1x WEST · The paywall on the golden armor,
  Claude Opus 5.5 (lane/paywall; `embertide-app/ui/intro/dyson-society/lab/PAYWALL.md`), on his 11:58 tag ("THIS IS WHERE WE WANT TO STOP THE
  VIDEO AND PUT THE PAYWALL ON THE GOLDEN ARMOR DUDE") and 19:13 ("i want to keep 7 day exclusivity"): on the mint page optimism.fit serves
  (`app/warm.html`) the film stops on the frame that holds 37.132 s for a viewer with no paid receipt and offers the two seats the Worker sells;
  whoever carries the Worker's receipt plays on; `LAUNCH_DAY` in `app/dl-paywall.js` holds the 7 days (unset: the wall stands). Proved headless on
  NewMac: frame 1112 the last shown, 0 past it, 0 frames, draws and timers at rest. Not deployed; his: the deploy, `LAUNCH_DAY`, `PREMINT_ENABLED`,
  the terms. The wish stays "not": no NFT is minted and no $WARM sold."
- The lineage ledger's row 23 (`optimism-fit-lineage-hypertrace-2026-10-14.md`), its first half ("the film stops at his 37.132 s for a wallet with
  no paid receipt, the offer stands there, a holder plays on") is built by this lane; its second half (the Worker serving the rest to a signed
  receipt) is not.

## Files

- `app/dl-paywall.js` (new): the wall, `LAUNCH_DAY`, the stop, the receipts' road, the lab's review.
- `app/dl-paywall.css` (new): the offer.
- `app/dl-paywall.test.mjs` (new): 14 tests.
- `app/dl-twelve.js`: the wall made beside the film; each presented frame handed to it before the sphere draws; `canPlay` asks it; its state in
  `window.dlTwelve.state().paywall`.
- `app/warm-sphere.js`: `setHeld`, a still sphere whatever the page's own pause says.
- `app/warm.html`: the offer in the hero's stage, its stylesheet, the scripts' `?v=golden-armor-1`; `app/warm.js`: the sphere's `?v=`.
- `lab/paywall.proof.mjs` (new), `lab/paywall-pictures/` (five JPEGs, 280 KB: the film's frame on the page, no room imagery), this file.


## The tickets' comment, moved off the public page (Nov 2 2026)

The build ships the page's comments as they stand, and this one quoted his Oct 18 words on $POOL ("where we accrue value") into the source of optimism.fit/app/warm.html. His words stay here, verbatim; the page carries only what it shows.

```
<!-- THE $WARM TICKETS (his Oct 18 2026 16:33 WEST, to BRAND: "1. you can buy $WARM just like GTA-Online cash... 2. you can use $WARM as credits for
AI genie, you just ask and SWARMY PROVIDES 3. $POOL is where we accrue value ... be clear
upfront about $WARM & $POOL as onchain SWARM & SPOOL"; 16:23: "SWARMY doesn't work without $WARM in his tank fuel", "$POOL = SWARMIC FUTARCHY").
A ticket is fuel for your Swarmy; the two tokens stand over the seats. Oct 28 2026 13:50 WET he ruled: "we should give $WARM only when money is spent in the SPACE-ROUTER":
the ticket buys fuel, never $WARM, and $WARM is given only as the fuel burns (tools/embertide-mesh/lib/space-tanks.mjs WARM_PER_USD).
The words are mine, his to reword; the cards' fuel line and what a ticket pours are warm-flask.mjs's.
SPACE ROUTER AT THE FREEZE (his Oct 29 2026 09:10 UTC: "YOU MUST INTRODUCE SPACE ROUTER AND HOW IT HAS A: 1 $ SPENT = 1$WARM ... it is rebate";
09:11 "space router is how we make money"): the rebate's names at the freeze (dl-space-router.js) press down to here, so the offer opens on the
Space Router and its rate, the Space-Router's own (WARM_PER_USD). Her line and her "What is $WARM?" are these words (dl-athena.js 'tokens').
YOUR PRESENCE IN THE MMO (lane/your-presence-in-the-mmo; his Oct 29 2026 UTC words: 10:32 "the internet is breaking under the pressure of agents
who break ads business models"; 10:3x "u have fucking lost the snowtrace vibes dude?"; 10:39 "the idea is to pre-allocate credits... people here buy
into the launch depositing USDCs that are credits to be spent later"; 10:41 "stop using 10/1k range dio merda, just have 1 single one and make it
about your mmo presence"; 10:43 his click "Yes, $30"). His Oct 16 10:36 line in the EC chat: "the internet as we know can't live any longer simply
because agents don't watch ads"; Oct 27 22:42: "it is an MMO and you are buying your starter kit". So the two seats are gone: one starter kit,
$30 of USDC pre-allocated as Space Router credits, and its door stands paused until the USDC road is safe (the mint waits since Oct 28).
YOUR HANDS ARE THE WAVE (lane/your-hands-are-the-wave; his Oct 29 2026 16:16 UTC: "i mean... the core is have you forgotten all the shit we have done
with dualsense broadcast across devices?"): the kit opens on his hands, the pad's one wave landing on every screen at once (embertide-pad's THE WAVE
LANDS ON EVERY REPLICATOR and THE PAD CASTS ON THE AIR, Oct 26) and his secret codes (tools/embertide-mesh/HIS-SECRET-CODES-LANDING.md, Oct 25). -->
```

- **Rule 8**, on the lane's tree served by `tools/serve-range` (206 to a Range request), Nov 3 2026 on the new Mac: `node --test app/dl-twelve.test.mjs` 21 of 21;
  `nice -n 19 node app/dl-twelve.proof.mjs --url {serve}/embertide-app/ui/intro/dyson-society/app/warm.html --tap button`: PASS; the same with `--tap sphere`: PASS.
  (The first hands, Nov 2 19:06 UTC, were refused by the lander for want of this proof.)
