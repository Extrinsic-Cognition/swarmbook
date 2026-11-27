# THE ROADS' PROOFS WALK TODAY: the mint page's two road proofs walk the road that stands (Nov 24 2026, lane/the-roads-proofs-walk-today-3)

No page file changes in this lane. Only the two proofs change, and one comment in a third.

## What stood

No gate runs either proof, and both were red on main. The run: 1440x900, on a stage that answers the deposit door (the built site behind the
Worker's own handler, with live's deposit terms).

- **`app/dl-athena-entrance.proof.mjs`** (426 lines, last touched Oct 30 2026): 12 checks red and 4 errors on main d95d1e111c, this lane's base.
  Its dyson-society tree is a7ae737569's.
  - Line 12's egg fall, the teleport flash, her making as "the creator", its song box, the freeze after Enter and the governance card: that road
    left the page. With no seat and the deposit door open, she offers her egg on "egg" and holds it (THE EGG WAITS FOR THE MINT, SHE HANDS BACK TO
    THE FLASK, dl-athena.js).
  - The skips walk: her Skip is hidden on a first visit (NO SKIP THE FIRST TIME).
  - The reads walks: ON TRACK holds a first visit's scroll, and `READ_ON.to` is not in the live page (below).
- **`app/dl-path-to-the-kit.proof.mjs`** (166 lines, Oct 29 2026): red at "her landing opens her making". Her making waits now: her egg is offered,
  and a side is chosen first.

## What changes

- **`app/dl-athena-entrance.proof.mjs`** keeps every check that still holds:
  - the film's skip asks first;
  - Stay keeps the film and its sound, with nothing sought;
  - Skip skips;
  - her twelve lines, each in her pose with its figures, no motion graphic and no sound-word;
  - the letterbox read off the page's own frames (THE ROAD IS ONE TAKE).

  Its main walk now ends at the offer:
  - on "egg" her egg is laid where her hands hold it and offered (`html[data-egg-offered]`): nothing falls, nothing flashes, her picture stays;
  - past the beat she would land on, she still holds it;
  - the split (`#dl-sides`) stands behind her;
  - both plates (`a.dl-stake-plate[data-side="pool"]`, `a.dl-flask-plate[data-side="flask"]`) are inside the screen, and the page's own
    `elementFromPoint` at each centre hits the plate;
  - nothing is pressed: her making waits, no side is taken, the page is where it was;
  - no error is thrown.

  The creator, teleport, freeze, governance card and topics half is deleted.
- **The skips and reads walks run as a return visit.** The page has one: `FILM_SEEN_KEY` (`dl.egg.minted`, dl-space-router.js) is set by an init
  script after the proof's storage clear and before the load. ON TRACK then holds nothing, and her Skip shows (NO-SKIP-THE-FIRST-TIME-LANDING.md
  names a first visit by the same key).
  - The read-on lands on `READ_ON.to` where the live page holds it. Where it doesn't, the walk checks only that the page comes to rest, never pulled back up, and says so
    in the check's own words.
  - "The scroll is his again" is now a wheel of a screen. warm-layout.css snaps the page to its two pages (`scroll-snap-type: y mandatory`), so a
    300 px wheel from the hero snaps back to the hero. Read with nothing of hers on the page: `scrollBy(0, 300)` lands at 916, the next page.
- **Her question is read as the page holds it.** The read targets `div.dl-athena-ask`, because her bubble's question buttons share the class. It
  waits until its slam animations have finished (`getAnimations({subtree: true})`, 5 s at most) instead of reading after a fixed 1.5 s.
  - The caller's run on 92da93413d read `seen` false. Every run here read it true at 1.5 s: opacity 1, the question's box [515,406,925,441] inside
    the box [487,375,953,525]. The read now cannot race a slam that started late.
- **Presses wait for their target.** A trusted press waits (bounded) until nothing covers its target's centre, then presses there, by CDP
  `Input.dispatchMouseEvent`.
- **Sizes and touch.** The default sizes are 1440x900 and 390x844. A size under 768 px wide gets touch emulation
  (`Emulation.setTouchEmulationEnabled`). Each tab clears the origin's storage of every type.
- **`app/dl-path-to-the-kit.proof.mjs` becomes `app/dl-red-road.proof.mjs`** (`git mv`, then rewritten: git counts it as a delete and an add), the
  red road's proof. From the offer:
  1. A trusted press on the red plate.
  2. The stages go, in, deep and her (`window.dlHexagon.state().log`), each at its time from `PRESS` and `DIVE` (dl-hexagon.js), never sooner, and
     at most 1.5 s late. Her making opens in the hexagon with nothing made.
  3. The die (the first `.dl-her-tool`, pressed once her making's own entrance no longer covers it) colours her: her state changes, she is whole,
     and Enter the world opens.
  4. Enter the world (`.dl-her-go`): the stage is world at once, then rest. Her face is on the opened ball, with no 'made' and no freeze after it,
     and the page is given back.
  5. The 𝕏 plate's href is X's own compose door (`INTENT`), and its `text` parses back through `fromHerLink` (dl-her-reel.mjs) to her colours:
     painted parts, each part's hex, her light. It is never pressed, because it leaves the house.
  6. The ride stands. It is a span with no door, or, if it is ever a link, one of the downloads the served `nestos-release.json` names
     (`installLinks`).
  7. The page's own film and song are never sought, played or paused on the way (rule 8).
  8. No error is thrown.

  The old `--skip-at` walk (A SKIP THAT WAITS FOR THE FILM) leaves with the old road. Its law stands in `app/dl-twelve.test.mjs`: "a skip pressed
  before the film can be sought waits for its metadata, once, and lands there".
- **`app/dl-warm-words.proof.mjs`**: its one comment line names `dl-red-road.proof.mjs` for the Chrome it finds.

Both proofs exit 0 on PASS, 1 on FAIL and 2 when they could not run, and bound their own time: the entrance 420 s, the red road 360 s.

## Measured

Every run was headless Chrome for Testing 1243 at `nice -n 19`, off every screen. The site was built from this lane's tree
(`tools/build-optimism-fit.mjs`, with the two stand-in films). It was served behind the Worker's own handler (`worker/premint.mjs` over
`d1-on-sqlite`), with live's `GET /space-router/v1/deposit` answer, so the deposit door is live.

- **`nice -n 19 node app/dl-red-road.proof.mjs --url <the stage>/app/warm.html`**: 28 of 28 at 1440x900 and 390x844, run twice (2 min 37 s,
  then 2 min 34 s).
  - The stage logs at 1440x900: go 4 ms, in 1505, deep 2505, her 3239. After Enter: world, arrow, face, plates, then rest at 34.6 s.
  - The second run: her at 3237 and 3231 ms, rest at 34.1 s at both sizes.
  - `PASS: from her offer down red's road by real presses: the hexagon to her making on its times, the die, Enter the world, the ball opened to
    rest, her face on X read back to her colours, the ride standing, the page's film never sought, at 1440x900 and 390x844`
- **`nice -n 19 node app/dl-athena-entrance.proof.mjs --url <the stage>/app/warm.html`**: 137 of 137, in 2 min 15 s.
  - The main walk: 53 at 1440x900 and 53 at 390x844.
  - The return visit's skips at 1440x900: 14.
  - Its reads: 9 by wheel at 1440x900, 8 by finger at 390x844.
  - The offer at 1440x900: the split [0,117,1440,783]; the pool's plate [39,399,415,501]; the flask's plate [1027,399,1399,501]. Each was hit at
    its centre.
  - The offer at 390x844: the split [0,110,390,734]; the plates [2,207,193,299] and [207,207,378,299].
  - The letterbox at 1440x900: it moves from 1106 ms to 1556 ms, under no white, and is closed before her first line at 1800 ms.
  - `PASS: the skip asks first; her entrance, line by line with no motion graphic but the page's countdown; the letterbox closing where it is seen;
    on "egg" her egg offered where her hands hold it and held out, the split up behind her and both its plates in the screen and pressable,
    nothing pressed, at 1440x900 and 390x844; on a return visit no stray press or key skips her, Stay and Esc keep her, Skip ends her as before;
    a wheel down and a finger's pan up end her quietly, nothing sought`
  - The run before it was 136 of 137: its 300 px wheel stayed on the hero (the snap above). The same run with a wheel of a screen went from 0 to
    916.

## Net JavaScript

`git diff --numstat main...HEAD` over .js/.mjs/.cjs/.ts/.html: +263 -372, **net -109** in 4 files.

## The gates and rule 8

- `node --test tools/embertide-mesh/tests/the-javascript-only-shrinks.test.mjs`: 31 of 31. "this lane's JavaScript +263 -372, net -109 in 4 files".
- `node --test tools/embertide-mesh/tests/the-look-is-a-law.test.mjs`: 2 of 2.
- Rule 8, because the lane touches files under app/:
  - `node --test app/dl-twelve.test.mjs`: 21 of 21.
  - On the same build served by `tools/serve-range` (206 for ranges), `nice -n 19 node app/dl-twelve.proof.mjs --url <serve-range>/app/warm.html`:
    - `--tap button`: PASS, 7 of 7. "the sound came in where the picture was, and the picture never went back".
    - `--tap sphere`: PASS, 7 of 7. The same line.

## What the page shows that looks wrong (reported, not changed)

- **`READ_ON.to` is not in the live page.** `'#dl-paywall-choice'` (dl-athena.mjs) stands inside a `<template>` of warm.html. The template opens at
  character 11973 and does not close before the section, so `document.querySelector` finds nothing.
  - On a return visit, a wheel down or a finger's pan during her entrance ends it quietly (her moment 'read'). The wheel's own scroll is prevented,
    so the page goes nowhere. A finger's pan is not always: in the reviewing seat's run (claude-41008c71, 00:24 UTC) it carried the page to its second
    page (y 860), where the helper's run had it stay. The walk therefore checks that the page comes to rest, not where. Asserting "nowhere" asserted the
    fault, and it held only on some runs.
  - READ_ON's law says "the page goes to the offer". Its comment in dl-space-router.js says the offer "is inert since his 'please comment out all
    this'".
  - The reads walks check what the page does and name it. They will check the landing again, unchanged, once the page holds its anchor.

## THE RIDE STANDS DISABLED ON A PHONE (Nov 24 2026, lane/the-ride-stands-disabled-on-a-phone)

His "Mend it", to "Mend the red road proof's phone check here?", once Harmony was public.

**What stood.** A STRANGER DOWNLOADS HARMONY (0792e69709, landed 01:57 UTC) made the Ride plate `<a class="dl-flask-plate r" data-harmony-ride
aria-disabled="true">`, and `rideTo` gives it this desktop's installer only where a published release names one. The red road proof asked a plate with no
door to be a span, so it read every Ride with no installer as a fail. While the release was unpublished that was both sizes. After the publish it was the
phone: 27 of 28 on main's site, whose 390x844 plate was an `<a>`, aria-disabled, with no address.

**What changes.** Four lines of `app/dl-red-road.proof.mjs`, net JavaScript 0:
- The walk reads the plate's `aria-disabled`, and whether the page sees a Mac with no touch (`navigator.platform`, `maxTouchPoints`).
- On such a Mac, when the release names a macOS download, the Ride must be that link and not disabled.
- Any address the Ride holds must be a download the release names.
- With no address, the Ride must be a span or a plate marked aria-disabled.

**Measured.** On main e5339c0734's site (the two stand-in films), behind the Worker's own handler over an empty D1, `nice -n 19 node
app/dl-red-road.proof.mjs` ran 28 of 28 at 1440x900 and 390x844 in 2 min 30 s:
- At 1440x900: "the ride is a link, to a download the release names: this Mac's", to `https://swarmbook.com/app/DysonLight-Harmony.dmg`, not disabled.
- At 390x844: "the ride stands, with no door: its plate aria-disabled (the release published)".

**Rule 8.** `node --test app/dl-twelve.test.mjs`: 21 of 21. On the same build served by `tools/serve-range` (206), `dl-twelve.proof.mjs --tap button`
passes and `--tap sphere` passes.
