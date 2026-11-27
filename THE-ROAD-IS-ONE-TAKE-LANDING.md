# THE ROAD IS ONE TAKE: from the film's stop to Enter the world, nothing snaps, nothing sits on the creator, nothing of the page shows under it, and she never holds the egg again (lane/the-road-is-one-take, Oct 30 2026)

Seat claude-fea81f3c, started by claude-1a67b2d3 ($WARM & SpaceRouter), which relayed his word and what it saw replaying main's page. Cut from main
495492cd9 (lane/the-egg-falls-into-the-creator is on it as 84fb0734a). Worked 08:1x to 09:xx UTC on the new Mac. Nothing is deployed: the deploy is
claude-1a67b2d3's, once, on his word. Her words are unchanged (docs/the-way-she-talks-hypertrace-2026-10-29.md read first).

## His word (UTC, as typed; the stamp is claude-1a67b2d3's transcript's)

- 08:09:46, over three screenshots from the preview (491 x 866 css px, 982 x 1732 at 2x): "idk man... i think it could be smoother...". The same
  message's "i think we should use "Space Router" as the github repo tbh" is claude-1a67b2d3's to answer, not this lane's.

## What his screenshots and main's road showed

Main's road filmed in headless Chrome at his size, 491 x 866: the film's skip, Skip, her entrance, the creator, the die, Enter. Each frame was read off
the page's own requestAnimationFrame, and the screencast was kept.

1. **The governance card on the creator.** "GOVERNANCE", ▶ and its × sat on the creator's top right, over the eyes socket. It opened on her landing,
   the moment her making opened, at z 2147483001 over her making's 2147483000.
2. **The page under Enter the world.** On a narrow screen the creator scrolled (58 px at 491 x 866). Its night, `.dl-her-veil` with `position:absolute`,
   scrolled away with it, so the bottom 58 px were bare: the page's next section ("Your spells: hold L2 and R2...") stood under the door.
3. **The bars "snap in".** They did close, over .7 s, but at the hit, under its white (.92 to 0 in .42 s) and under the card's slam. They were 80 %
   closed before the white had gone, so no one saw them close.
4. **The freeze with her holding the egg.** The road to it is Enter the world itself: 'made' slams the rebate in, and the rebate's picture of her is
   her offer pose with the egg in her hands (`assets/athena-offer.png`). Her small self on her perch (`assets/athena.png`) holds it too, and it was back
   on her perch once the flash was over.
5. **Not in his screenshots, found in the frames:** at the hit the egg went, and the old scene (the film's frame, the sphere) showed under the fading
   white for 300 ms. Then the creator faded in over it for 450 ms, the sphere seen through it. Her corner lyssajudron (the Goldberg ball she rides)
   stayed at her corner through the whole fall.
6. **The page moved under the creator:** four wheel ticks over it at 1440x900 scrolled the page under it 1600 px. Nothing showed through its night,
   but after Enter the freeze would open over a page scrolled away from its flask.

## What moved

**The bars close into her lines** (`app/dl-athena.js` INTRO_CSS):
- Her card stands on the whole picture: ドン, the white, NEFERTITI over NESTAL NYMPH.
- The letterbox closes as the card hands over to her first line. It moves in Harmony's own motion (`.dl-athena-lb`'s .7 s, boss-intro.mjs `.lb`), starting
  `SUBTITLE.card_ms - BARS_MS` (1.1 s) after the hit, and is closed as "There’s no time." comes in. Her Skip opens it at once, as before.
- On a phone her portrait stands on the screen's foot during the card and rises onto the bar as it closes, so no line ever crosses her.

**The egg falls into the creator in one take** (`TELEPORT` in `app/dl-athena.mjs`, `teleport()` and `leave()` in `app/dl-athena.js`):
- Where the egg hits, the white is whole (opacity 1) and stands over everything. Her layer is lifted one above her making for it, and all of her
  entrance but the white, the focus lines and ドン is hidden.
- His presses go through the white to her making (`.dl-athena-intro.teleport{pointer-events:none}`). The lane's first cut held them for the flash's
  0.7 s, and the kit's and the words' proofs caught it: their presses on the field and the die landed on the white.
- Her making opens under the white at once (`open_ms` 60): her landing says `egg: 'given'`, and her making opens with no fade (`.dl-her.cut`).
- The white and ドン leave over `reveal_ms` 450, starting `hold_ms` 240 after the hit and a frame after her making's own first frame, so the old scene
  is never between the egg and the creator.
- At the drop the lyssajudron she rides fades with her picture (`.dl-athena-layer.leaving`).

**She leaves with her egg:**
- Once the white has gone, her layer is let go for this page (`L.destroy()`): her small self, her bubbles, her engine. Every picture of her holds the
  egg, so none comes back after it has fallen.
- The freeze shows no picture of her once her landing has said `egg: 'given'` (`dl-space-router.js`), and JOIN THE $WARM stands under the flask, the
  freeze's own layout for a screen without her.
- Her Skip before the fall keeps the old road: she alights on her perch holding the egg, and the freeze shows her holding it out.
- A reload is a new take: her entrance and her egg again.

**Nothing sits on the creator** (`app/dl-athena-film.js`):
- While her making holds her landing (`data-her-making` 'waiting'), the governance card waits for her to be made: the rebate's own rule.
- It comes with 'made', unseen under the freeze as it always was there, and stands once the freeze is closed by its ×.

**The creator is a closed scene, Enter the world its floor** (`app/dl-her-colours.js`):
- Its night is fixed to the screen (`.dl-her-veil` `position:fixed`), wherever its own scroll stands.
- On a phone or a tall screen (`max-width:760px` or `max-aspect-ratio:4/5`, so an iPad held upright too) it is one column on one screen: her stage
  takes what the rest leaves (200 px at least), the drum and its field stand side by side, and the door is the floor.
- If a very short screen still scrolls, the door is held at the floor (`position:sticky`).
- At every size its scroll is its own (`overflow:auto;overscroll-behavior:contain`): a wheel or a finger over it moves nothing under it. The same four
  ticks now leave the page at 0.
- Wide: the side columns give a little (230 px at least) and the wish slots scale (24 to 36 px), so her stage keeps its room. The bar no longer runs
  into the door at 900 to 1024 px, as it did on main. The door's type scales down there too (14 to 22 px); on a phone it stays 17 px.

## Cost

| file | raw (main, then this lane) | gzip -9 |
| --- | --- | --- |
| `dl-athena.js` | 42,703 to 45,764 B | 14,761 to 15,629 B |
| `dl-athena.mjs` | 35,423 to 36,190 B | 14,427 to 14,707 B |
| `dl-her-colours.js` | 75,900 to 77,019 B | 24,875 to 25,326 B |
| `dl-athena-film.js` | 19,413 to 19,961 B | 6,904 to 7,108 B |
| `dl-space-router.js` | 21,757 to 22,081 B | 8,025 to 8,152 B |

- **The bars:** a transition-delay; no timer.
- **The flash:** the timers it had, one requestAnimationFrame and one more class; the white's leaving is one opacity transition on the compositor.
- **At rest after the road, less than before.** A scratch walk wraps the page's requestAnimationFrame from its first script and counts for 3 s after
  the freeze is closed:
  - the egg road (she leaves): 180 frames asked, all one loop (`warm-sphere.js` `tick`, which this lane does not touch), no animation running, no layer
    of hers, no picture of her;
  - her Skip before the fall (she stays on her perch, as she did after the egg on main): 360 frames asked, her layer's loop as well, and her float
    (`dl-athena-float`, infinite) running.
- The sphere's loop asks a frame every frame at rest; that is a finding for the sphere's lane, not this one.

## Proofs (the lane's tip; the page served by `tools/serve-range` on its tree)

**`app/dl-athena-entrance.proof.mjs`:** PASS, 172 of 172 checks, at 1440x900, 491x866 (his size, a walk of its own now) and 390x844, in headless Chrome by trusted
presses, wheels, drags and touches. New, read off the page's own frames from the skip to 'made':

| | 1440x900 | 491x866 | 390x844 |
| --- | --- | --- | --- |
| the bars under the hit's white (scaleY at most) | 0 | 0 | 0 |
| the bars close (ms after the hit) | 1113 to 1563 | 1123 to 1573 | 1119 to 1570 |
| the white while they move | 0 | 0 | 0 |
| her first line | 1800 | 1800 | 1800 |
| frames from the egg's hit to the creator alone | 71 | 71 | 75 |
| the old scene's share of the screen, at most, in those frames | 0 | 0 | 0 |
| her making first seen (ms after the hit), the white then | 84, 1 | 102, 1 | 90, 1 |
| the white whole for (ms) | 266 | 299 | 266 |
| her corner figure, at most; her layer after; a card on the creator | 0; let go; none | 0; let go; none | 0; let go; none |
| frames where a press at the screen's centre missed her making once it was shown | 0 | 0 | 0 |
| three wheel ticks over the creator: the page, the creator's own scroll | still, 0 | still, 0 | still, 0 |
| the creator's stage (px), its scroll | 660 x 767, 0 | 459 x 430, 0 | 358 x 386, 0 |
| Enter the world (its box) | 1092,817 to 1408,864 | 12,796 to 479,840 | 12,774 to 378,818 |
| the freeze: her picture; any picture of her on the page | hidden; none | hidden; none | hidden; none |
| the governance card: up under the freeze, then seen after its × | yes, yes | yes, yes | yes, yes |

- The creator at eight more sizes, opened by `?her` (a scratch walk), was one screen with its night on every corner and the door its floor at:
  - 375x667, 820x1180 (one column), 768x1024 (one column), 900x700, 1024x768, 1280x720 and 1920x1080;
  - 360x640 scrolls 18 px, the door held at the floor.
- Everything else in the proof passes as before: her four lines in their poses; the egg leaving her hands within a pixel; the skips and the read-ons.

**Rule 8** (CLAUDE.md, The rule, 8; this lane changes the mint's page):
- `node --test app/dl-twelve.test.mjs`: 21 of 21.
- `nice -n 19 node app/dl-twelve.proof.mjs --url <the page> --tap button`: PASS, 7 of 7.
- The same with `--tap sphere`: PASS, 7 of 7.

**Tests:**
- `dl-athena.test.mjs` 20 of 21, with one new test, THE ROAD IS ONE TAKE: the bars' moment in Harmony's motion; the flash lifted over her making, whole
  until it stands; she leaves with her egg. The red is main's own THE DEPTH.
- `dl-her-colours.test.mjs` 19 of 19, with one new test: cut open under the egg's white, faded otherwise; the fixed night; the floor.
- `dl-athena-film.test.mjs` 11 of 11, with one new test: the card waits for 'made' while her making holds her landing.
- `dl-space-router.scene.test.mjs` 3 of 3: no picture of her once her egg is given; her egg held out on the old road.
- The app folder (`node --test app/*.test.mjs`): 445 of 448. The three reds are main's own: each fails the same way on main 495492cd9's own tree, and none reads a file this lane changes. They are THE DEPTH (`dl-athena.test.mjs`), her cut's pose (`warm-sphere-moment.test.mjs`, 29.563 against 29.5628667) and the public mint's Harmony accent (`dl-paywall.test.mjs`, harmony-orange #37b6d8 against #0d4769).
- `tools/any-room/any-room.test.mjs`: 8 of 8.

**The other proofs on the same page:**
- `dl-athena-film.proof.mjs` PASS, 20 of 20. It now proves the card after her making: nothing on the creator; the card up under the freeze, then pressed,
  played with its sound, tapped twice on Sound with the picture never going back, paused and closed.
- `dl-path-to-the-kit.proof.mjs` PASS, 26 of 26.
- `dl-her-colours.proof.mjs` PASS, 26 of 26.
- `dl-warm-words.proof.mjs` PASS, 36 of 36.
- `dl-her-reel.proof.mjs` PASS, 18 of 18.
- `dl-her-friends.proof.mjs` PASS, 13 of 13.

## His

- That she leaves the page with her egg (no small self on her perch for the rest of that visit, nothing of her in the freeze) is this seat's reading of
  "her holding the egg again after it fell breaks the story". No picture of her without the egg exists. His to reverse, or to give her one.
- The governance card is now seen only once the freeze is closed (on the egg road, every visitor's). Where it should stand in the take is his.
- The deploy is claude-1a67b2d3's, once, on his word.
