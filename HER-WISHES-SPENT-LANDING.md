# HER WISHES SPENT: a chamber fired spends a wish; her three spent, the fourth pentagon comes in her entrance's slam (Oct 29 2026, lane/her-wishes-unlock, claude-16e5b1b6)

**His word,** Oct 29 2026 17:31 UTC (to claude-1a67b2d3), right after "you should make that it starts with 3, the ones you can see that have a "wish charge" in
them... gamify this shit dude please" (17:29):
- "like gamify the dopamine from starting with 3 pentagons, using all 3 wishes and then unlocking a 4th pentagon and getting 4 wishes now and so on... you get
  what i mean or not?"

**The $WARM seat's ask** (claude-1a67b2d3, Oct 29 ~18:2x UTC; the seat's words, carrying his):
- "The dopamine is the unlock moment: make it felt, in the page's boss-card grammar (the slam, ドン), with no explaining text."
- "What spends a wish on the mint page is your design. His lore says a wish is an AI call, and that door isn't built."
- "Keep the count where the visitor's browser holds her making's refs, so a returning visitor keeps their level. Nothing on the Nest or the Worker for now."

**Beside it,** the governance seat's reading of his lines (§12 of `docs/governance-over-the-alien-technology-the-pedigree-hypertrace-2026-10-29.md`): a wish is one
real AI call the house sponsors through Space Router, as CAC, and the first visitors are Solana developers.

## What stood (main 1bf12abd8, HER THREE WISHES)

- Her making started with her three charged unit1s of twelve, the nine ghosts, and her wish bar at 3/12 with the 4th pentagon next.
- His ladder was law (`app/dl-her-wishes.mjs` `ladder`), but nothing on the page spent a wish, so it always stood on the first rung.

## What spends a wish here (my design, said)

**A chamber that fires.** That is one of her parts taking its first colour, by a press on the field or by the die. It is the nearest real act on her making,
and it is Harmony's own milestone: her eyes open once all six have fired. A chamber made bare again (↺) and fired again spends another wish.

- **Why it, not the others:**
  - A wish for every press on the field would be too cheap: one drag across the field fires the field dozens of times.
  - A wish for each roll of the die alone would leave out a visitor who paints by hand: they would never see a pentagon come.
  - Her making cannot be finished without firing all six chambers. So every visitor who makes her spends her three wishes and sees the fourth pentagon come.
    They leave her on the fourth rung with one wish left.
- **When the Space Router's door is built,** its AI call is the wish. The ladder, the bar and the slam stay; only `spend` gets called from the door instead of
  from the drum.

## What changes

- **The law** (`app/dl-her-wishes.mjs`):
  - `ladder(spent)` also says `lit`: the seats whose wish is still there (a rung spends its pentagons in order).
  - `keep(storage, spent)` and `kept(storage)` hold the wishes spent in this browser under `dl.her.wishes`, beside her two refs (`dl.her`). A broken or
    foreign keep reads as none spent. The count is never on the Nest or the Worker.
- **Her making** (`app/dl-her-colours.js`):
  - A fired chamber calls `spend(1)`; the die calls `spend(n)` for the n bare chambers it fires.
  - A spent wish's slot dims and its halo on her goes out.
  - When a rung's last wish is spent, the next pentagon comes:
    - **her entrance's slam** over her (dl-lyssajudron.js's grammar): the white, the focus lines and ドン, a radial burst from her centre;
    - **its slot slams in** (scale 2.6 to 1);
    - **the rest of the rung lights again,** one slot after another;
    - **the count turns** (3/12 to 4/12).
    No word anywhere: a sound glyph, a count and slots.
  - A visitor who comes back opens her making on the rung they reached, with no slam for it.
  - The slots' motion moved from CSS to the Web Animations API, so a slot's class changing never replays an animation.
- **The mint's mount of her** (`stageHer`): its option `wishes` is now the rung (`{seats, lit}`), and `charge(rung)` moves her to another rung:
  - a seat she reaches leaves its ghost, through the renderer's own seam, `place(seat, null)`;
  - the halos follow her lit wishes;
  - a third instanced draw puts her pentagon on every seat she has beyond the three eye seats. Her renderer draws `eyes` only on the three, so this is the same
    five-sided disc, set as her renderer sets an eye with no target, in her eyes' paint.
- **Not changed:** `room/lyssajudron.mjs`, her refs, the drum's law, the song, Continue and the kit. The kit's picture shows the rung she reached.

## Cost

- A wish spent: one write of about 40 bytes to the browser's storage.
- A pentagon come: CSS and Web Animations for about a second (the slam's four nodes, built once with her making), one `place()` and three uniforms.
- While her making is open: one instanced draw more than HER THREE WISHES (her pentagons beyond the eye seats). Measured below.
- At rest: nothing new.

## Measured

All of it on this lane's tree over main b3afe2094 (HER THREE WISHES landed as 1bf12abd8), on the new Mac. Rebased since onto be231bbfe, whose one
landing (lane/the-membrane-on-tv3) touches no file of the page. The page was served by `tools/serve-range` alone (206), as the lander's gate serves it.
Every browser was a headless Chrome off every screen.

- **Seen, before the hand.** The moment a pentagon comes, at 1440x900 and at 673x873, 160 to 250 ms after the die:
  - over her, the white burst and the focus lines fading out from her centre, ドン at her shoulder;
  - on the bar, three spent slots dimmed, the 4th slammed in gold, the 5th next, and 4/12.
  After the slam the fourth unit1 stands out of its ghost with its pentagon, its halo the one lit. Her picture in the kit, after the walk from SKIP TO THE
  MINT, shows her rung, with eight ghosts in her gold. No error was thrown on the page at either size.
- **Her proof** (`app/dl-her-colours.proof.mjs`): 21 of 21. Five checks are new:
  - his two presses fire two chambers, so two wishes are spent (`sscneeeeeeee`, the halos on seat 2 only);
  - the die crosses the first rung: the slam on, ドン, its animation running;
  - the bar reads `ssscneeeeeee` and 4/12, six spent, one slam, and six kept in this browser;
  - her renderer's own state holds the chairs 4 to 11 as gone, so seat 3 is out of its ghost, with seats 0 to 3, lit [3], 8 ghosts, 1 halo and 1 pentagon
    beyond the eye seats;
  - a new page in the same browser opens her making at 4/12, with no slam.
- **The law and her making** (`node --test`):
  - `dl-her-wishes.test.mjs` 6 of 6. New: `lit` rung by rung; the count kept and read back, and every broken keep read as none spent.
  - `dl-her-colours.test.mjs` 11 of 11. New, on a bare DOM: a press fires a chamber once (a second press on it spends nothing); the die crosses the rung,
    tells her stand the new rung and slams; the die on her painted six spends nothing; a returning visitor's page is mounted on the rung reached.
- **The suites,** `node --test` over the app's 51 files: 403 of 407.
  - Three reds are main's own: dl-athena's THE DEPTH, warm-sphere-moment's "her cut", dl-paywall's Harmony ice and accent tokens.
  - The fourth, dl-lyssajudron-body's "she lives", is a CPU budget per frame ("14.85 ms a frame"), tripped while eight files ran at once. That file imports
    only `dl-lyssajudron-body.mjs`, which this lane does not touch, and alone it passed 3 of 3, three times.
- **The other proofs that walk her making:**
  - `dl-her-song.proof.mjs`: 12 of 12, and 12 of 12 with `--phone`.
  - `dl-path-to-the-kit.proof.mjs`: 26 of 26 at 1440x900 and 673x873. The slam, which lets every press through, held up none of its presses.
- **The cost, timed** (the same scratch bench as HER THREE WISHES, 300 frames driven by hand, 1800x1720 px, the median of 7 runs each). All three are the same
  within the runs' spread (0.19 to 0.34 ms):
  - her twelve as on every glass: 0.284 ms a frame;
  - the first rung (three, nine ghosts, three halos): 0.264 ms;
  - the fourth rung (four, eight ghosts, one halo, one pentagon of the mount's): 0.264 ms.
- **Rule 8,** on this lane's page served with byte ranges:
  - `node --test app/dl-twelve.test.mjs`: 21 of 21.
  - `nice -n 19 node app/dl-twelve.proof.mjs --url <the page> --tap button`: PASS. The film never went below its second at the tap (6.05 s).
  - The same with `--tap sphere`: PASS (6.04 s).

## Edges, said

- **Wishes can be farmed:** ↺ and fire again spends a wish, and 63 such wishes climb her to the twelfth. Until the Space Router's door, a wish costs the house
  nothing, so the toy is allowed to be a toy.
- **The count is this browser's.** Another browser, or cleared site data, starts at the first rung again. The key does not carry it to the Nest yet (the
  plan's lane 4).
- **After the twelfth** (her twelve, all twelve wishes spent): his to say.
- **The fourth rung brings the share** since lane/her-reel-share (`HER-REEL-LANDING.md`): her reel, filmed on her canvas at its press, and the link to her.
- **For a reader who asked for less motion,** no slam and no slot motion: the slots and the count change at once.
- **The slam has no sound.** The page's sound is the film's and the song's, and rule 8 keeps it that way.
- **Not deployed.** optimism.fit takes this at his word.
