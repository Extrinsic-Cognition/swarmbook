# HER CREATOR STANDS SYMMETRIC (Oct 30 2026, lane/her-creator-stands-symmetric)

The seat: claude-e9853b6a, on the new Mac.

## His word

"its horrible if seen with the shit on the right; fix it please, keep it symmetric". He said it over two screenshots of the creator (`app/warm.html?her`):
- the wide window, with the colour panel as a column at her right;
- the tall window, with the panel under her.

## What changed

- **`app/dl-her-colours.js`, the wide grid.** It was `"say stage pick" ". stage pick" "name bar go"`. It is now
  `"say say say" ". stage ." ". bar ." "name pick go"`:
  - the revolver and its field stand under her wish bar, on her axis;
  - her name stands at its left and Enter the world at its right.
- **The side columns** go from 230 px to 200 px.
- **The tall screen's column** is unchanged.

## Cost

CSS only. Nothing runs at rest.

## Proof

- **Tests:** `node --test embertide-app/ui/intro/dyson-society/app/dl-her*.test.mjs tools/any-room/any-room.test.mjs`, 49 of 49. The layout test pins the new areas.
- **Preview:** seen with `tools/serve-range` at 1620x1000 and at 1280x760.
  - Each fits one screen with no scroll: the creator's scrollHeight is 760 and its clientHeight is 760.

## The revolver centred

His word, over the creator with the field under the drum: "keep the revolver centered".

- **The drum's row centres its items** (`justify-content:center`). When the field goes under the drum, the revolver stands on the panel's axis.
- **The blue slash** now belongs to the drum's box (`.dl-her-drumbox::before`). It used to belong to the panel, so it follows the gun wherever the gun stands.

Proof:
- `dl-her*.test.mjs`: 41 of 41.
- Preview at 900x1000: the drum's centre is at x 450, the same as the panel's centre.

## The bar says its ladder

His words, over the wish bar at 4/12: "you never put intentionality into these..". The bar used four looks:
- a gold pentagon;
- a faded pentagon;
- a dark pentagon;
- dashed circles.

Each state looks distinct now:
- **All twelve slots are her unit1's pentagon.**
  - A pentagon with its wish is lit, on gold.
  - A pentagon whose wish is spent stays hollow. The unit1 is still hers; only the wish is gone.
  - A pentagon not hers yet is a faint outline. It used to be a dashed circle.
- **The next pentagon** stands apart by a gap. A ring round it fills with the wishes spent on this rung (`--p`, set in `bar()`), so the unlock is seen coming.
  - At 4/12 with 3 spent, the ring is three quarters full.

Proof:
- `dl-her*.test.mjs`: 41 of 41.
- Seen in the preview at 1400x900 with 6 wishes spent: 3 hollow, 1 lit, the ring at three quarters, 7 outlines.

## Her name is a plate

His words, over the bare underline: "name is invisible to spot...".

- **The name field is now a plate**, the door's twin:
  - on the router's blue, where the door is on its crimson;
  - with the same gold rules, skewed the other way, so the two stand as a pair round her.
- **The placeholder** goes from 40 % cream to 72 %.
- **The caret** is gold.

Proof:
- `dl-her*.test.mjs`: 41 of 41.
- Preview at 1400x900: the plate stands at the left, the door at the right.
- Preview at 420x860: no horizontal overflow (scrollWidth 420).

## Her name over the revolver, the colour field thinner

His words: "make color bar thinner and add name on top of the revolver".

- **Her name plate now heads the panel**, over the drum (`pick.append(name, drum)`).
- **Enter the world** stands centred under the panel. The wide grid is `"say say say" ". stage ." ". bar ." ". pick ." ". go ."`, everything on her axis.
- **The colour field is thinner:** 96 px tall, centred beside the drum. It was at least 180 px and stretched to the drum's height. It is 84 px on a tall screen, where it was 150 px.

Proof:
- `dl-her*.test.mjs`: 41 of 41.
- Preview at 1400x900 and at 420x860: one screen each, no scroll, no overflow.

## Her name over her

His words: "put name above the lyssajudron instead".

- **The name plate leaves the panel** and stands centred over her, its text centred, at most 360 px wide.
- **The wide grid** is `"say say say" ". name ." ". stage ." ". bar ." ". pick ." ". go ."`.
- **The tall grid** is `"say" "name" "stage" "bar" "pick" "go"`.
- **The panel** holds the drum alone again.

Proof:
- `dl-her*.test.mjs`: 41 of 41.
- Measured in the preview at 1400x900, all centred at x 700, one screen (900 = 900):
  - name y 100 to 147;
  - her stage y 161 to 514;
  - the bar;
  - the panel;
  - the door at y 817 to 864.
- At 420x860: the name at y 60 to 104, over the stage; no overflow.
- The Browser pane was hidden, so the creator's fade did not run. It was measured, not pictured.

## The bands run under their names (app/dl-space-router.js)

His words, over the freeze: "the colored bands there are not like they should be".

**The cause.** Each slash came in by `scaleX` from its own edge (`transform-origin: var(--o)`). Its `skewY(-4deg)` pivoted on that same edge. So across a
plate w wide, the band crossed its name tan 4° × w/2 too high:
- 35 px at 1000 px;
- 56 px on the full-width plates of his 1600 px picture: the blue band over SPACE ROUTER's head, the red one between PROMPT-TO-MINE and 1 $WARM.

**The fix.**
- The band now skews about its own middle, through its name.
- The wipe from its edge is a `clip-path` (`--wipe`, by `data-toward`).
- The `--o` property is gone.
- Colours and timing are unchanged.

**Proof.**
- `dl-space-router.scene.test.mjs` pins the clip and refuses an edge origin. With `dl-her*.test.mjs` and any-room: 52 of 52.
- Measured in the preview at 1000x1100, stacked plates, band centre y against name centre y:
  - before: 70 against 105, and 237 against 272;
  - after: 105 = 105, and 272 = 272.

This file is the $WARM & SpaceRouter seat's (claude-1a67b2d3): a two-rule change, told to it.

## The professor sends you to the film first (app/dl-space-router.js, app/warm-galaxy-player.js)

His words, UTC, from the hypertrace (`guided-path-hypertrace.md`, the seat's scratchpad):
- **15:29:23:** "...have 2 states here, this one the first one right after the lyssajudron, then, kinda like pokemon with grass and the first town professor
  forces you to do shit first... guided down to the video of the governance and then coming back up to join by topping up aka filling up the gas tank".
- **15:23,** to the flask seat: "after the introduction and when swarmy is there, the 2nd video is introduced but also this one skippable like the first one".
- **The governance film** stays as it was (his Oct 29 17:39).

**The two states of the one freeze.**
1. **A first visit.** The call under the flask is **WATCH THE FILM** (`FIRST_CRY`). Its press carries the page down to his governance film (`#purpose`).
2. **The film's end.** The player now says it: `data-galaxy-completed` and a bubbling `galaxy-completed`, its one new line; the film itself is unchanged. The
   end carries the page back up to the freeze, where **JOIN THE $WARM** slams in again and goes to the kit (`.snowtrace-kit`, the $WARM seat's card, its
   selector agreed with it).
   - **The skip:** coming back up from the film by his own hand counts as seen, and nothing moves the page again. A scroll before the press is not the skip.
   - **Kept:** `localStorage dl.film.seen`, so a returning visitor stands on the second state.

**The split.** The $WARM & SpaceRouter seat (claude-1a67b2d3) takes the kit card in `warm.html`; this seat takes the film flow. The player line was named to it
before this commit.

**Cost.**
- One listener, and one storage read at mount and one write when the film is seen.
- Nothing at rest; the ride's existing scroll handler carries the skip.

**Proof.**
- `dl-space-router.scene.test.mjs` has a new test for the professor (the end, the skip, and a scroll that is not the skip). The existing scene test now
  stands on the second state.
- `dl-athena*`, `dl-space-router*`, `dl-her*` and any-room: 92 pass. The 1 failure is "THE DEPTH rides the engine and the corner", which fails the same on
  this lane without these changes (it reads another file's text).
- On the real page in the preview at 1400x900:
  - WATCH THE FILM, `data-film=first`;
  - the press puts `#purpose` at y 98 (scroll 6618);
  - the film's end returns the page to the top (scroll 0.5), with JOIN THE $WARM, `again`, and `dl.film.seen=1`.
- Not yet seen: the real 51-second film playing to its end (the end was its event dispatched).

**His word on the call:** "ok, use watch the film" (Oct 30 2026). FIRST_CRY stands as built.

## A smart bubble at the film (app/dl-athena.js, app/dl-athena-layer.mjs)

His words, over the guide's bubble at the governance film ("Got questions?" / "From Claudio to a galaxy of swarms." / "See the starter kit"): "this one sucks
dude tbh... like we gotta have smart ones come on...". Read against THE WAY SHE TALKS (ec-workspace docs, Oct 29): point, never explain; one idea a moment;
RPG options; grounded in the live state.

**What was wrong.**
- A header that asks nothing.
- The film's own title, which stands in big type right there on the page.
- A door to the kit while the visitor stands at the film, against the professor's flow.

**What it is now.**
- **The header is the one question a visitor at a film has:** "What happens in it?". It opens the film's own description, then "And then?".
  - The layer takes a topic's own `asked` in place of its "Got questions?". Every other topic keeps the layer's word.
- **The line is gone.** An empty line is hidden.
- **The door follows the film's state** (`html[data-film-seen]`, written by dl-space-router.js when the film is seen, or at mount when kept):
  - **Watch the film** while it is not seen. It starts the film from the player's own start, or its hero toggle.
  - **Fill the tank** once it is (the kit's act).

**The split.** dl-athena.js is the intro seat's file (claude-603a6063, started by the $WARM seat). This is the film's topic alone, in the film flow this seat
took.

**Proof.**
- `dl-athena.test.mjs` pins the topic: no line, its question, and its door in both states.
- `dl-athena*`, `dl-space-router*`, `dl-her*` and any-room: 92 pass. The 1 failure is the pre-existing THE DEPTH.
- Not seen live: the guide only stands after her entrance, so the bubble was not opened in the preview.

## The rest of the page commented out (app/warm.html)

His words, Oct 30 2026, the page's whole text below the hero pasted: "please comment out all this".

**What went inert.** Four ranges, each wrapped in `<template data-commented-out>`, plus one line in `warm-entry.mjs` (the ceremony):
- the Harmony doors and all of `#mint`: Project Snowtrace, the offer `#dl-paywall-choice` with the old kit, the tokens' small print, the 01 to 03 steps, and
  TraceNet;
- `#rite`, `#oath-response` and `#quantum-roma`;
- `#iuramentum`;
- the page footer.

**Why a template, not `<!-- -->`.** There are 18 HTML comments inside the ranges, and comments do not nest. A template's content is never rendered and no
script finds it in the document, which is a comment's effect. Unwrapping it brings the content back.

**What stands.**
- The hero (`#genesis`), her making, the freeze and his governance film (`#purpose`).
- The dialogs, which are hidden.

**What changed with it.**
- **The ceremony** (`warm-ceremony.js`) mounts only into `#oath-response` or `#iuramentum`. `warm-entry.mjs` now imports it only where that mount stands.
  Before, it threw on a null form, and its rejection failed the whole story's `Promise.all`.
- **JOIN THE $WARM** (`KIT`) and the film bubble's **Fill the tank** (act `refuel`) now point at `#refuel`.
  - That is the $WARM & SpaceRouter seat's one offer card, "refuel your Space Router tank in dollars". It goes in directly after `#purpose`, on its own
    lane cut from this tip, as agreed with it.
  - Until that card lands, both doors find nothing and do nothing.

**Proof.**
- The whole mint suite (`app/*.test.mjs`) and any-room: 466 pass and 3 fail. The same 3 fail on this lane without the change:
  - THE DEPTH;
  - "the public mint keeps DysonLight Harmony ice and accent tokens";
  - "her cut finds the sphere".
- On the page in the preview:
  - none of "Snowtrace", "Enter the MMO", "Keep your own soul", "Claudio", "Iuramentum" or "The sending" is in the page's text;
  - `warm-ceremony.js` is not fetched, and its error is gone;
  - `#purpose` stands.

## The second skip (app/dl-space-router.js)

His words, Oct 30 2026: "add a second skip to the second video as well".

**What it is.** His governance film carries the first film's skip:
- **the same pill:** "Skip to $WARM ›", the first film's words, with `dl-twelve.css .dl-twelve-skip`'s rules copied to `#purpose .dl-film-skip`;
- **in the same corner:** 16 px and 14 px, over the film's theater;
- **asking first:** THE SKIP ASKS FIRST, `ASK_EVENT`, so her "Skip to $WARM? Stay / Skip".

Her Skip is the film seen: the page goes back up to the freeze and JOIN THE $WARM, and `dl.film.seen` is kept. The pill is gone once the film is seen. A page
without her skips at once, as the first does. Nothing is put into the film.

**Proof.**
- A new scene test covers the second skip: its words, asking first, her Skip, gone once seen, and no question on a page without her.
- `app/*.test.mjs` and any-room: 467 pass, and the same 3 fail as without these lanes.
- On the page in the preview at 1400x900:
  - the pill stands at x 16 over the film;
  - pressing it opens "SKIP TO $WARM? STAY SKIP";
  - Skip returns the page to scroll 0, hides the pill and keeps `dl.film.seen=1`.

## On track (app/dl-space-router.js)

His words, Oct 30 2026: "please make it so that it doesnt scroll down before nefertiti says go watch the movie... like i dont want people able to get out of
track".

**What it does.** On a first visit, `html[data-on-track]` holds the page at the top:
- `overflow:hidden` on html and body, and `overscroll-behavior:none`;
- the browser's restored place is put back to 0 (`scrollRestoration='manual'`).

It holds until the freeze's WATCH THE FILM is pressed, where Nefertiti holds the egg out. The film seen (its end, her Skip, or a kept `dl.film.seen`) never
holds. On a first visit the freeze's × is hidden: there is no way out but the film.

**Proof.**
- The scene tests pin it:
  - held at mount, put to the top, no × until the press;
  - released by the press;
  - a visitor who has seen the film is never held.
- `app/*.test.mjs` and any-room: 467 pass, and the same 3 pre-existing fail.
- On the page in the preview at 1400x900:
  - the wheel (10 ticks), End and Space leave the page at scroll 0;
  - the freeze opened as her making's 'made' opens it: WATCH THE FILM, × hidden, `data-on-track` set;
  - the press lands the page on the film (`#purpose` at y 98) and `data-on-track` is gone.

**The second skip points to the film's end** (his words, Oct 30 2026: "of course the 2nd video's skip must be different... it must be pointing to the end of the
second video").
- **Where it lands.** As the first skip lands `SKIP_BEFORE_S` (3 s) before its stop and plays into it, this one lands `FILM_SKIP_BEFORE_S` (3 s) before the
  film's end. It uses the first skip's own seek (`dl-twelve-clock.js startWhenSeekable`, never outside the film's seekable), and never moves back from where
  the film already is.
- **What happens next.** The film plays into its end. Its own end (`galaxy-completed`) brings the page up to JOIN THE $WARM, and `dl.film.seen` is kept.
- **The pill** stops its press at itself.

Proof:
- The scene test: the seek is to 50.9 - 3; nothing moves before her Skip; the page stays while the end plays; JOIN THE $WARM comes at the end.
- `app/*.test.mjs` and any-room: 467 pass, and the same 3 pre-existing fail.
- On the page:
  - from 2.8 s, her Skip put the film at 48 s;
  - in another run the film played from 49.5 s to its end (`ended`, `data-galaxy-completed`), JOIN THE $WARM came in, and `dl.film.seen=1`.
- The preview server's one-hour limit ran out once mid-proof. It was restarted, and that run was redone.

## Her Snowtrace scene (app/dl-lyssajudron.js, app/warm-spatial.js)

His words, Oct 30 2026, over her station on the world at the end of his governance film (UNIT 0 / The Dyson Society, GENIE OF THREE WISHES / Lyssajudron): "when
i click there in lyssajudron i want another anime cut scene like nefertiti before but with lyssajudron talking about the importance of project snowtrace for
collective self-improvement".

**What it is.** Her entrance, the pixel-art boss cutscene of `dl-lyssajudron.js`, gets a second scene, `SCENES.snowtrace`:
- the same ゴゴゴ, the same hit with her card (GENIE OF THREE WISHES / LYSSAJUDRON), and her rise out of her box;
- then her five lines on Project Snowtrace, each held as long as a subtitle reads it (17 characters a second, 1.7 s at least) plus a breath, the last on her
  charge (カッ);
- then back into her box.

`play({scene})` takes the scene, and her first entrance stands as it was.

**Her lines.** They are a seat's draft, his to reword. They are made of his own words: the leader tracing a path in fresh snow (Oct 22), "every problem is
solved only once" (Oct 17), and "COGNITIO SALVATA: COLLECTIVE SELF-IMPROVEMENT" (Oct 14). They were read against THE WAY SHE TALKS:
1. Fresh snow. Every mind breaks it alone.
2. One traces the path. The rest walk it.
3. Solved once. Kept for all. That is Project Snowtrace.
4. Cognitio salvata. A swarm improving itself.
5. So leave a trace. Make it worth walking.

**What the press does.**
- A press on her station plays the scene out of the station's own card. Her player is imported at the first press; it was not loaded on the page.
- Then her panel stands. Its first door is his Oct 22 one, "Encounter the Lyssajudron in Harmony". Nothing leaves the page on the press itself.

**The split.** `dl-lyssajudron.js` is the intro seat's file (claude-603a6063), and `warm-spatial.js` is the world's. This is one added scene and the station's
press.

**Proof.**
- `dl-lyssajudron.test.mjs` pins the scene: the same hit, the lines in order, each held as read, home at the end, the station's literal import and press,
  and the Harmony door after it.
- `app/*.test.mjs` and any-room: 468 pass, and the same 3 pre-existing fail.
- On the page in the preview, `dlLyssajudron.play({scene:'snowtrace'})` showed the card (Genie of Three Wishes / Lyssajudron) and the five lines in order,
  and ended in 18.5 s.
- Not seen live: the press on her station. The world stands only after the film's end, and the Browser pane was hidden.

## On an empty tank (app/dl-space-router.js, app/dl-lyssajudron.js, app/dl-lyssajudron-body.mjs)

His words, Oct 30 2026: "...the key moment where the user wants to go but lyssajudron is on a empty tank and we say "before going, gas fuel" u get what i
mean?". Then, after the seat's proposal (her tank is the visitor's own, she stops them once, no crowd numbers, few participants expected): "yeah please go".

**What it is.** The first press on JOIN THE $WARM plays her entrance on an empty tank (`SCENES.empty`), out of the call itself:
- her eye near dark and her moons pulled in (`MOODS.empty`);
- her two lines, a seat's draft from his words, his to reword: "Empty tank." and "Fuel me before we go.";
- no charge;
- then the page lands on the tank (`#refuel`).

It is kept in this browser (`dl.tank.asked`), so every press after goes straight to the tank.

**Not done.** Her waking up on the fill needs the $WARM seat's card to say a fill happened. That is its card and its lane.

**Proof.**
- A new scene test covers the empty scene: its mood and lines, no charge, then the tank, kept, and the next press straight to the tank.
- `app/*.test.mjs` and any-room: 469 pass, and the same 3 pre-existing fail.
- On the page, the first JOIN THE $WARM played "Empty tank." then "Fuel me before we go." in the empty mood, about 7.9 s, and kept `dl.tank.asked=1`.
- Her body's frames were not drawn: the Browser pane was hidden, which holds animation frames.
- `#refuel` is not on this lane. It is the $WARM seat's lane/one-offer-fill-your-tank, queued after this one, so here the landing finds nothing.

**She wakes on the fill.**
- **The cause.** The $WARM seat's card says `dl-tank-filled` on the document, detail `{usd, tank}`. It fires once per fill, when the deposit door confirms it
  (dl-kit-deposit.js on its lane/one-offer-fill-your-tank).
- **What plays.** `dl-space-router.js` plays her entrance on her charge (`SCENES.filled`): her eye lit, "Full." then "Now we go." on カッ. The lines are a draft.
- **Proof.**
  - A scene test covers the event's name, the charged lines, カッ, and the play on the event.
  - `app/*.test.mjs` and any-room: 470 pass, and the same 3 pre-existing fail.
  - On the page, a dispatched `dl-tank-filled` played "Full." then "Now we go." in the charge mood, about 7.8 s.

**A scene owns the screen.** His words, over her Snowtrace scene with the hero's light and its Restart / Sound off / Pause above the world: "there is no proper
page break, i cant have the previous hero above it breaking mid way".

What changed:
- **Her scenes** (snowtrace, empty, filled) stand on their own night: `.dl-lyssa-veil`, under everything in her layer by its z-index. Her first entrance over
  Athena's film stays unveiled.
- **Her station** first puts the world (`#warm-world`) flush at the top of the screen, then plays her scene.

Proof:
- `dl-lyssajudron.test.mjs` pins the veil, the scene class and the station's order.
- `app/*.test.mjs` and any-room: 471 pass, and the same 3 pre-existing fail.
- In the preview at 1400x900, with the page scrolled mid-way, her scene's picture is her on the night alone: the veil at opacity 1, nothing of the hero.

## Page breaks (app/warm-layout.css)

His words, Oct 30 2026, over the hero showing above the world: "there is no proper page break, i cant have the previous hero above it breaking mid way", then
"dude please i was clear".

**The page is pages.** The hero (its header and sphere), his governance film with its world, and the tank (`#refuel`) are each one screen, and the scroll stops
only at a page's top: `scroll-snap-type: y mandatory`, `scroll-snap-stop: always`.

**What was in the way.**
- The film was 80 % of a screen, less an 82 px mast the page no longer shows (`--galaxy-height`). It is now 100svh.
- The sphere was a whole screen under the hero's 89 px header, so the hero always showed above the film. It is now `100svh - 89px`.
- An old `scroll-padding-top: 82px` and a 16 px `scroll-margin-top` put every page under its top. Both are now 0.
- A 42 px bottom padding on the hero (warm-fullframe.css). It is now 0.

`#purpose` sits inside `#genesis` in the markup, so the hero's header carries the snap and the hero section keeps its own height. Made one screen, it clipped the
film out.

**Proof.**
- At 1400x900:
  - the hero spans 0 to 900 and the film 900 to 1800, with the page 1800 tall;
  - a stop at 300 or 200 snaps to 0, and a stop at 520, 700, 1000 or 1300 snaps to 900 (901 with rounding).
- At 420x860:
  - the hero's header is 95 px, so the hero is 866 px, the film 866 to 1726;
  - a stop at 300 snaps to 0, and a stop at 520 snaps to 866.
- `app/*.test.mjs` and any-room: 471 pass, and the same 3 pre-existing fail.
- The film's own centring ride is untouched: his Sept 27 "video's shifted towards north", a tenth lower until 20 s, on the film's paper.

## Her scenes wear the visitor's own, and she floats (app/dl-lyssajudron.js, app/warm.html)

His words, Oct 30 2026, over her Snowtrace scene in the default pixel body: "why the fuck are you using that ugly shitty lyssajudron? use the one the user just
fucking customized...". Then: "can you put that in display anamorphic i mean? the lyssajudron... forget about camera depth im just saying can you use tricks
like him floating and moving around the screen zooming biggening and smallening to give idea of floating...".

**Her picture's home.** Her making's picture (dl-her-colours.js KIT_HER, taken at Enter the world) lived in the starter kit's image, which was commented out
an hour before. So the picture went nowhere, and the page's guide (dl-athena.js SWARMY.img) lost it too. It now stands in an unseen holder in the live page
(`.dl-swarmy-holder`), the one `[data-kit-her]` outside the commented ranges.

**Her scenes wear it.** Snowtrace, the empty tank and the fill show that picture (`SWARMY_IMG`) in place of the pixel body and its box, whenever this page
made one. Her moods are light on it: dim and grey on an empty tank, lit gold on her charge. Her first entrance, before any making, keeps her pixel body.

**She floats.** While she is out, her picture drifts across the screen (up to 42vw), growing to 1.28 as she comes near and shrinking to 0.74 as she goes far,
with a little tilt.
- Her charge floats nearer and faster.
- An empty tank sags low and slow.
- It is CSS on the picture's own translate, scale and rotate, and nothing runs after her scene.
- With reduced motion she stays still.

Her night is now fully opaque.

**Proof.**
- `dl-lyssajudron.test.mjs` pins the picture swap, the moods, the holder (one in the live page) and the float (its range, only while out, still with reduced
  motion).
- `app/*.test.mjs` and any-room: same 3 pre-existing fails.
- In the preview at 1400x900, with a stand-in picture in the holder (her making's WebGL does not draw in a hidden pane):
  - her picture rode from x 185 to 745 and from 430 to 811 px wide in 4.8 s;
  - the pixel body was hidden.

**No popup before the film is over.** His words, over the film's bubble ("What happens in it?" / "Watch the film"): "dont have popups porcoddio before the
movie is over... if anything, make it comical for him to tell you to shut the fuck up and watch the movie".
- **Until the film is seen,** the bubble has no question and no door. The Swarmy only shushes you: "Shhh." / "Shut up and watch the movie." These are the
  seat's words, his to reword.
- **After the film,** "What happens in it?" and Fill the tank, as before. The bubble's now unused `film` act is removed.
- **Proof:** `dl-athena.test.mjs` pins both states. `app/*.test.mjs` and any-room: the same 3 pre-existing fail.

**The guide steps out of the world.** His words, over her bubble ("What happens in it?" / Watch the film) laid over the world at the film's end, beside the
Lyssajudron's card: "please fucking restructure it there as well... i dont want that fucker to fuck around likethat".
- While the world stands, the guide is parked as for her making: no bubble and no roaming over the world, whose own cards speak there. The world says it
  stands with `data-world-open` (warm-spatial.js).
- This holds for both guides: Athena's layer (`modal: '[data-world-open]'`) and the Swarmy (`LAW.ASIDE`, her making or the world).
- The layer now hears that attribute.
- His picture shows "Watch the film", a door already gone at 554b5c0e6, so his tab was a cached one.

Proof: `dl-athena.test.mjs` pins both guides, the attribute and the world's word. `app/*.test.mjs` and any-room: 474 pass, and the same 3 pre-existing fail.

**She is alive in her scenes.** His words, over her scene: "why the fuck the satellites are not orbiting but are idle?".

**The cause.** Her picture is one frame, taken at Enter the world, so her twelve stood still in it.

**The fix.** Her scenes now draw her live with her making's own renderer (dl-her-colours.js `stageHer`, the page's own instance of the module):
- painted with her kept colours (`dl.her`), on her kept rung;
- her twelve orbiting on her clock, floating as her picture did;
- her picture under it until her live self draws, and wherever WebGL cannot start or nothing is kept.

**Cost.** One WebGL canvas for the scene's seconds, let go (`stop()`: renderer disposed, context lost) at its end. Nothing at rest.

**Proof.**
- `dl-lyssajudron.test.mjs` pins the module URL (one instance), the kept colours, the stop and the picture under.
- `app/*.test.mjs` and any-room: 475 pass, and the same 3 pre-existing fail.
- In the preview, with kept colours:
  - during her scene her live canvas stood at 1188 px, floating (`dl-lyssa-float`);
  - at the scene's end it was gone (no `.dl-lyssa-live`).
- Its frames were not pictured: the Browser pane was hidden, which holds animation frames.

**She is alive as your guide.** His words, over the guide in the page's corner, her picture still: "his fucking satellites are not moving dude".
- **What it is.** The guide's figure is drawn live by her making's own renderer (dl-her-colours.js `stageHer`, the page's own instance), painted with her kept
  colours and rung, her twelve orbiting.
- **When it runs.** Only while the figure is in sight and not parked: an IntersectionObserver starts it and lets it go, and parking lets it go. Her picture
  stays under it until it draws, and wherever WebGL cannot start. A new making repaints her.
- **Cost.** One small WebGL canvas while she is on the screen, none when she is not.
- **Proof.**
  - `dl-athena.test.mjs` pins the start at her first coming, the module, her kept colours, in sight only, the let-go on parking, and the repaint.
  - `app/*.test.mjs` and any-room: 476 pass, and the same 3 pre-existing fail.
- **Not seen live.** The guide hands over to the Swarmy only after Nefertiti's entrance and landing, which do not run from a cold load in a hidden pane.

**Nothing floats on the film.** His words, over "Shhh. / Shut up and watch the movie." standing over his governance film: "fucking fix the logic of this because
it stays all the duration floating on the fucking movie".
- **The cause.** The bubble opens on the pointer over a topic and stays while the pointer is there, so it sat over the film the whole time.
- **The fix.** From WATCH THE FILM to the film's end or her Skip, `#purpose[data-film-going]` parks the guide: Athena's layer and the Swarmy (`ASIDE`), as
  over the world. The layer hears that attribute.
- **Proof.**
  - The scene test and `dl-athena.test.mjs` pin it. `app/*.test.mjs` and any-room: 476 pass, and the same 3 pre-existing fail.
  - On the page: the press set `data-film-going` and parked the guide (`data-parked`), and the film's end cleared both.

## Her cosmos scene (app/dl-lyssajudron.js, app/warm-spatial.js)

His words, Oct 30 2026, over her station's scene, its lines in their crimson box: "we gotta rework entirely of these the fonts and what he says and all that...
this is a nice moment to use the lyssajudron and "pour liquor" in it... the idea is here you should be explaining the difference between 3 pentagons active and
12 pentagons total like dude... burn my cosmos, you know what it means or not? please hypertrace".

**The hypertrace.** His words, quoted with times, are in the seat's scratchpad (`cosmos-liquor-pentagons-hypertrace.md`). The load-bearing ones were checked in
his own sessions.
- The cosmos is Aiolos's, Sagittarius's: the fuel burned. "BURN MY COSMOS!!!! you see we got the fuel in thething there floating?", Sept 23 04:11.
- She says it in the second person: "go burn your cosmos", Oct 30 03:13.
- The liquor is fuel: "the liquor in there is fuel", Oct 21 18:08. The pour is now the tank's top-up.
- She starts with the 3 of her 12 that carry a wish charge, a wish is one AI call, and spending them unlocks the next (Oct 29 17:29 and 17:31).

**The scene** (`SCENES.cosmos`, played by her station; the Snowtrace lines are gone). Her entrance, then five lines, a seat's draft from those words, his to
reword:

| line | what her live self does |
| --- | --- |
| "Twelve pentagons. Three lit." | her renderer lights the first three (`rung`) |
| "A lit one is a wish: one call, made for you." | |
| "The other nine stay dark. They want fuel." | she dims (`empty`) |
| "Pour the liquor in. Every drop lights one more." | トクトク; the liquor streams into her (`pour`), and her pentagons light one by one to twelve across at least 4.8 s |
| "Twelve lit. Now go burn your cosmos." | カッ; her charge |

**The liquor.** A stream of the flask's gold falls from above into her core, a child of her live self, so it rides her float. A glow stands where it lands.

**Her words in the page's type.** Her Oct 24 ruling: Bodoni for the titles, DM Sans for the words. Her Oct 17 "anime text based... resident evil 4".
- No box: a subtitle centred under her, in DM Sans.
- The sting in Bodoni's italic gold.
- Her name, as typed in her making, over it in the society's gold caps.

**Proof.**
- `dl-lyssajudron.test.mjs` pins the lines in order, three lit first, the pour with トクトク, the nine lit one by one inside the pour's line (at least 4.8 s),
  twelve on カッ, his second person, the hold as read, the station playing `cosmos`, the stream riding her live self and her renderer's own charge.
- `app/*.test.mjs` and any-room: same 3 pre-existing fail.
- On the page in the preview at 1400x900, with kept colours and the name "Lumen":
  - her renderer's own lit count went 3, 3, 3, then 4 to 12 between 10.9 s and 15.1 s, then 12;
  - every line showed in order under LUMEN in DM Sans.
- Pictured mid-pour: her live self with her twelve, the liquor into her eye, トクトク, 7 of 12 lit, the others wireframe, the subtitle.

**Her flask fills.** His words, over the pour with her flask empty: "dude you gotta make her flask get filled with transparent liquid... it is not filling up".

**The cause.** Her renderer already holds her flask's liquid (room/unit0-liquid.mjs, her purse's tank on every glass), but her making's stage never set its level, so
her flask stood empty.

**What changed.**
- **The level.** Her making's stage gains `fuel(k)`, her renderer's own `fuel`, eased by the liquid's settle. The scene sets the level:
  - empty when "the other nine stay dark";
  - rising a ninth with each pentagon the pour lights;
  - full on twelve.
  - On an empty tank her flask stands empty, and on the fill it fills.
- **The look, on the mint's stage only.** The liquid is drawn see-through (opacity 0.5, its surface 0.62) and lit from within, so it reads behind her painted
  glass. His Oct 16 colours, teal and mint, are untouched, and every other glass draws it as before.
- **The stream** is that same liquid now (teal to mint, see-through), not gold.
- **Her pose.** While the liquor pours she comes near, large and almost still, so her flask is seen filling.

**Proof.**
- `dl-lyssajudron.test.mjs` pins the levels, the stage's fuel, the see-through and his colours untouched.
- `app/*.test.mjs` and any-room: same 3 pre-existing fail.
- On the page, her drawn liquid level went 0, then 0.22, 0.56 and 1 as the pentagons lit. Pictured at 800x560: dark glass at 0.33, mint glowing through her
  hexagons at 0.89.

**The scene ends at the tank.** His words, over her station's panel after her scene (STATION 0 / HARMONY / THE FIRST ENCOUNTER, its Enter this group, Point to a
target, and its Harmony and demo doors): "you cant get back here dude... i need you to fucking mint the thing".
- "Now go burn your cosmos." now lands on the one offer, the tank to fill (`#refuel`, the $WARM & SpaceRouter seat's card on lane/one-offer-fill-your-tank, queued
  after this lane). It never returns to the station's panel.
- His Oct 22 door to Harmony from that panel is no longer reached after her scene, by this word.
- **Proof.**
  - `dl-lyssajudron.test.mjs` pins the landing and the absence of the panel. `app/*.test.mjs` and any-room: same 3 pre-existing fail.
  - Not seen landing live: `#refuel` is not on this lane.
- **Seen on the page after main was merged in** (ae3e21618, which brought `#refuel`):
  - pressing her station on the open world called `#warm-world` to the top, then her scene, then `#refuel` (block start, smooth);
  - her station's panel stayed closed.
  - The smooth scroll itself was not watched: the Browser pane was hidden, which holds smooth scrolling.
  - Suite after the merge: 478 pass, and the same 3 pre-existing fail.

## Nothing floats after her making (app/dl-athena.js)

His words, Oct 30 2026, over the guide's bubble ("What happens in it?" / "Fill the tank") floating on the tank's card: "are you fucking kidding me? with all the
incredible games being vibecoded out there you just resort to floating over here?... have you got minimum idea of how much we worked in this page or not
porcoddio? do you see the quality standard or not?". The same hour: "who cares about the lyssajudron, it is just a dev mock of a technology that is being
opensourced".

**What changed.** THE GUIDE IS YOUR SWARMY (Oct 30 12:1x, the intro seat's lane) is undone.
- When her making's picture lands, Nefertiti still finishes her part, never cut short, and leaves with her egg. No second guide, no figure and no bubble takes
  her place over the page after it.
- Her layer, the one guide, is parked over her making, the world and the film (`LAW.ASIDE`).
- The Swarmy's live figure (`liven`, added earlier today) goes with it.

**Proof.**
- `dl-athena.test.mjs` pins it: no second guide, the one guide's handoff now a leave, and the one guide's parking.
- `app/*.test.mjs` and any-room: 477 pass, and the same 3 pre-existing fail.
- On the page, the picture's landing left one guide layer, Nefertiti's, and no live figure.

**What comes next.** His turn to the Solana Seeker and the spatial computing OS's MCP for Claude is being hypertraced before any page is rebuilt.

## The tank's card removed (app/warm.html)

His words, Oct 30 2026, the "Fill your tank." card struck through in red: "remove this shit dude start becoming kogima dude fucking use camera cuts and 3d real-time
engines using floating 3JS animations like there is rich lineage,... wdyt?". Then: "you can also, to avoid breking track, getting the code we had built for the place
there", over the freeze's picture (the genesis sphere, its flask, SPACE ROUTER and 1 $WARM). Then: "the more DND adjacent you put it the better".

- **`#refuel`**, the $WARM & SpaceRouter seat's one offer, is wrapped in `<template data-commented-out>` like the rest. Unwrapping brings it back.
  - Its deposit script rests without it (`if (door)`).
  - JOIN THE $WARM and her scene's landing now find no card.
- **`dl-paywall.test.mjs`** now pins no kit in the live page and the card kept inert.
- **The ending** is to be rebuilt as camera cuts on the freeze's own real-time engine (`warm-sphere.js`), D&D-adjacent, about the spatial OS's MCP for Claude and
  the Solana Seeker. His words on the Seeker and the MCP are being hypertraced first.
- **Proof.** `app/*.test.mjs` and any-room: 477 pass, and the same 3 pre-existing fail.

## Rule 8, after the lander's refusal (18:46:51 UTC)

The lander refused this lane under rule 8: it changes the mint's page, and the `dl-twelve` proofs were not among its proofs. Run on the served page (`tools/serve-range`):
- **`node --test app/dl-twelve.test.mjs`:** 21 of 21.
- **`nice -n 19 node app/dl-twelve.proof.mjs --url http://127.0.0.1:9058/intro/dyson-society/app/warm.html --tap button`:** at first FAIL.
  - The proof's window is 1280x1300. PAGE BREAKS had made the sphere one screen less its 89 px header, which put the hero's sound button at y 1327, under the fold.
  - The snap and ON TRACK hold the page there, so the tap hit nothing.
  - Main's own tree, served beside it, passed with the button at 1279.
- **The fix.** The hero keeps its sphere's own height (that one rule taken back). The page breaks still hold at 1400x900: the hero at 0 to 989, the film one
  screen at 989, and stops snap to 0 or 990.
- **After the fix,** both proofs PASS, 8 of 8 each:
  - `--tap button`: the film is never below its second at the tap (6.01 s), and the song is within 0.15 s.
  - `--tap sphere`: the same (6.05 s).
- **Main merged in** (24c3a73e4, the lanes to 18:51). `#refuel` stays inert over it.
- **Suite:** `app/*.test.mjs` and any-room: same 3 pre-existing fail.

## Her reel, looked at (app/dl-her-reel.js, app/dl-her-reel.mjs, room/birth-film.mjs, app/dl-her-colours.js)

His words, Oct 30 2026, over her reel's card (two of her stacked under a cream band): "u never checked if the video worked or was trash? because it could be among
the things that get us fly if it takes proper takeoff". His virality vector since Oct 13.

**What was wrong**, seen in the reel's own frames:
- **Two of her.** Her reel used Harmony's room reel pages (`FILM.reel_layouts`): one panel for her and one for his shadow in the room. The mint has no room, so
  both panels were her.
- **An empty band.** Those pages sit under the song's 320 px sticker band, and her making has no song since THE SONG LEFT HER MAKING, so the band was empty
  cream paper.
- **The card in a corner.** It stood in her making's first column, which HER CREATOR STANDS SYMMETRIC gave to "Give me my colours.", so it was small and over
  her words.
- **Soft close-ups.** The 1080 x 1920 frame was grown from her making's small canvas.

**What it is now.**
- **A reel names its own pages.** `birth-film.mjs` `reel.layouts`, checked by `pagesOk`; the room's pages stay as they were. Her reel's pages
  (`REEL.pages`) are her alone, the whole 9:16 frame, cut on every bar between close on her and the whole of her. The ドン and ドクン are as before.
- **The card** stands over the whole of her making, in its middle, on its own night, the reel up to 78% of the screen's height.
- **HER REEL SHARP.** While it films (about 10 s), her canvas is drawn tall enough for the reel's 1920 px (her making's stage `sharp(k)`, at most 3 device
  pixels a css pixel, `sharpOf`), then her glass's own pixels again.
- **`dl-her-reel.proof.mjs`** now also sheets six of the reel's own pictures (`--screenshot`'s `-frames.png`): what a friend sees.

**Proof.**
- `dl-her-reel.test.mjs` and `birth-film.test.mjs` pass: her pages, her own, close then whole, no shadow panel, and the room's pages untouched.
- `app/*.test.mjs`, `birth-film.test.mjs` and any-room: 495 pass, and the same 3 pre-existing fail.
- `nice -n 19 node app/dl-her-reel.proof.mjs --url <served warm.html> --screenshot <png>`: PASS, 18 of 18.
  - The film is 4 bars, 9.6 s, 30 pictures a second, 1080 x 1920 mp4.
  - Its frame sheet shows her alone, full frame, close and whole by turns, with ドン! and ドクン, crisp.
- Rule 8: `node --test app/dl-twelve.test.mjs` and `dl-twelve.proof.mjs --tap button` and `--tap sphere` both PASS.

## The sphere's camera (app/warm-sphere.js)

His words, Oct 30 2026: "start becoming kogima dude fucking use camera cuts and 3d real-time engines using floating 3JS animations like there is rich lineage"; "to avoid
breking track, getting the code we had built for the place there"; "the more DND adjacent you put it the better".

**What it is.** The freeze's own real-time engine, the genesis sphere, gains a camera over its projection:
- a zoom on its radius, its centre moved by shares of the canvas, a turn added to its pose, and a drift in radians a second;
- `camera(shot)` cuts (ms 0) or eases over ms (cubic), and `camera(null)` lets go;
- `cameraState()` says where it stands.

It is identity at rest: nothing of the sphere moves while no scene holds it. Its turn is added for a draw alone, so the film's pose and his hand's are kept. It
asks for a frame a frame only while it eases or drifts.

**Proof.**
- `warm-sphere-moment.test.mjs` pins it.
- `app/*.test.mjs`, `birth-film.test.mjs` and any-room: 496 pass, and the same 3 pre-existing fail.
- Rule 8: `dl-twelve.proof.mjs --tap button` and `--tap sphere` both PASS, and `node --test app/dl-twelve.test.mjs` 21/21.
- On the page, `genesisSphere.camera({zoom: 2.4, y: .08, pitch: -.9})` pushed in on the d12, tilted, drawn by the engine.
