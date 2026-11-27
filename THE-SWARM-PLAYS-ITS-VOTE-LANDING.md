# THE SWARM PLAYS ITS VOTE (Nov 23 2026, seat claude-41008c71)

His words, UTC: 11:58 "the truth is, the swarm deliberates and votes and that lands on solana"; 12:24 "literally the best fucking thing of them all
which is the voting resolution radial waves that proceed from the outermost leaf of the tree and then gets resolved down to unit0 and then the
resolution color backpropagates to the rest then resets in white bursts cycling... why the fuck you dont have that?"; ~12:4x "build all?". The
record: ec-workspace `docs/posiverses-and-neghiverses-hypertrace-2026-10-30.md`, its Nov 23 11:58 and 12:24 sections.

## What changed

The swarm's page on Swarmbook is `app/polis.html` (each well on `after-the-mint.html` opens it). Before this lane it played a vote only while
one was live, named no phase, and its quiet orbit spun while it said "At rest".

- **The record plays from the chain.** On open the society's latest ballots (up to 7) play one after another through tree.js `playNext`, the
  engine unchanged: the leaves seal first, the flash, the sphere from unit0 in the verdict's colour, the hold, every chamber's white burst. Then
  the page rests. A vote that lands ends the replay and plays as it lands. The button under the ball plays the record again (▷).
- **Nothing at rest costs anything.** Only a vote or a discussion moves the engine (`applyMotionPolicy`); at rest it is paused, drawn once.
  The page's 5 s chain clock no longer sets the scene again at rest, which had woken the engine's ticker once a tick.
- **The five phases**, named under the ball on the gold line from the engine's own `onAgentProgress` (`polis-state.js` `riteOf`): OTIUM,
  DISCUSSIO, SUFFRAGIUM, the verdict by its name (RATUM green, REIECTUM red, DISSENSIO cyan, the engine's colours), EXSECUTUM when the
  decision's `executed` flag stands on chain. A verdict holds until the next ballot. On a phone the five dots stand on the line and the lit
  phase is named under them.
- **The sealed talk.** The ballot that plays shows its plate under the phases: its place in the record and its hash in the Gold/Silver unowns
  (`glyphs`, drawn from the public id, never from words). A viewer the page already verifies as a holder reads the proposal's words instead:
  a seat or a chair on chain (`polis-access.js` `membershipForKey`) and the body's signed session for that key (`canReadPrivate`), each text
  checked against its hash on chain (`verifyPrivateText`). The talk between ballots (the discussion envelopes) has no store yet: DISCUSSIO lights
  only on a live discussion, and its cell says so.
- **The look.** The night, the gold line, DM Sans. The engine's FULGOR whitens its whole square at the seal; it was drawn for poleis.us's
  parchment, where that square's edge vanished. Here a round mask fades the square into the night past the orbit ring (CSS only, the motion untouched).
- **Paid for:** `scenes.js` `installSceneControls` and `throwSwitches`, and `poetry.js` `installPoetryReader` and `poemMarkup`, were called by
  nothing in this app (its poleis.us copy keeps its own).

## Numbers

| | before (main e745270635) | after |
|---|---|---|
| frames in 10 s at rest (rAF callbacks, THE SPLIT, 1440 by 1000) | 600 | 0 |
| record played on open | none | THE SPLIT 1 ballot: SUFFRAGIUM 0.9 s, DISSENSIO 15.2 s, rest 24.6 s; THE WORKSHOP 3 executed: SUFFRAGIUM, RATUM, EXSECUTUM x3, rest 48.4 s |
| phone (390 by 844) | | the same rite, rest 24.7 s, 0 frames |
| page errors | | 0 (two 404s of the static server: favicon.ico and the Space Router's portrait door, which this copy does not serve) |
| JavaScript (the gate's count) | | +61 -71, net -10 in 6 files |

Driven by `tools/house-mirror/spool/board/pw-cdp.mjs`: headless Chromium off every screen, on devnet (layout 8), the site served by `tools/serve-range`
from this tree, a press of ▷ at rest giving "Playing its record" again.

## Tests and gates

- `app/polis-rite.test.mjs`: red on main (`polis-state.js` has no `RITE`), 4 of 4 green here. With it, `after-the-mint`, `dl-mint-hexagon`,
  `polis-knock` and `riders`: 35 of 35.
- `the-javascript-only-shrinks` 31/31, `any-room` 12/12, `the-look-is-a-law` 2/2, `no-page-of-its-own` 3/3, `the-pixel-is-a-lookup` 3/3.
- `no-landing-adds-a-failing-screen` (both shards, on f214562752): 84 cells of the built site judged, 0 new failing, 0 to take out. The circle
  fix after it is one CSS line on the ball, which the gate's `polis` screen (no society chosen) does not draw.

## Not proven here

- A holder reading the words live: no devnet society serves a body (`?body=`) to this copy, so the words' path is the page's own, already
  proven road (`renderRoom` reads the same `body.texts`), pinned by the test, not driven.
- A live vote landing while the page plays its record: no ballot opened on devnet during the runs. `syncLive` hands the page to the live ballot
  as soon as `activityOf` reads one; not driven.
- The page's own 5 s clock (`tree.js` `watchClock`, a `setInterval`) still ticks at rest; it now draws nothing. Making it a subscription is the
  tree's lane, not this one.

No gate yet: the measure it waits for is a society page that shows a sealed verdict with no wave played for it, read at the walk (the 12:24 section's).

## Rule 8 on this tip

No film and no sound is touched; the law asks for both all the same: `node --test app/dl-twelve.test.mjs` 21 of 21, and
`nice -n 19 node app/dl-twelve.proof.mjs --url <this tree's warm.html, served by tools/serve-range> --tap button` PASS, `--tap sphere` PASS.

## The FULGOR without its veil (his "is the halo always on or a coincidence", over three stills taken at the seal)

The stills were taken at the verdict's first frame, which is the seal's flash: the halo shows only there (about 0.7 s of flash, then the 4.5 s wave and
the 0.9 s hold), never at rest. Its flat half, a white fill at half strength over the whole square, read on the night as a grey fog over her faces.
engine.js: that one fill now stands behind `t.veil !== false` (poleis.us keeps it; the motion, the core and the verdict's ring untouched); polis.js sets
`tree.inst.veil=false`. Same instant after: her faces under the verdict's glow, no fog. THE WORKSHOP still rests at 48.6 s, 0 frames; JS +1 net (+62 -71
over the lane, net -9). Rule 8 again on this tip: dl-twelve.test.mjs 21 of 21, dl-twelve.proof.mjs --tap button PASS, --tap sphere PASS.
