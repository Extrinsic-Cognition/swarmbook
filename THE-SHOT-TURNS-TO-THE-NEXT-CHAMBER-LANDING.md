# THE SHOT: a release on her field fires, and the drum turns on to the next bare chamber (Oct 30 2026, lane/the-shot-turns-to-the-next-chamber, claude-16e5b1b6)

**His words** (UTC), to claude-1a67b2d3 ($WARM & SpaceRouter), over a screenshot of her making on the mint page (the router's look, the drum, #52C0EE in the field):
- 04:00:16: "u lost the fucking gun effect that moves to next component to be colored on every one i let go of".

That seat handed the lane to this seat, whose file `app/dl-her-colours.js` is. His words were read in that seat's transcript at their stamp.

## What stood

- **Harmony's her making** (`tools/embertide-mesh/mac-onboarding.html`): the field's pointerup puts the colour (`setAt`) and fires (`fire`).
  - ドン lands where the release landed: the full one on the song's beat, a smaller one off it (`beatHit`, within a sixth of a beat).
  - The birth's film takes the shot.
  - `advance()` turns the drum forward, the way a revolver turns (`turnTo(p, forward)`), to the next bare chamber in the order they fire, or else to the
    next one.
  - On the sixth, her eyes open.
- **The mint's port** (`app/dl-her-colours.js`, since 28f8c4bd6 HER COLOURS ON THE MINT) carried the field, the drum, the die and ↺, but not the shot.
  - Its release only kept her refs: no ドン and no turn.
  - After every stroke the same chamber stayed under the hammer, and the next one had to be picked by hand.
  - Its `select` turned only the short way round.

## The change (`app/dl-her-colours.js`)

- **The release fires** (`fire`): when the chamber under the hammer is painted, ドン at the release point, then the turn.
- **ドン in her slam's grammar** (`bang`), at the release point, over the panel:
  - the slam's white, its focus lines and its letters: #161713 in a cream stroke, rotated and skewed;
  - 46 px on the song's beat or with no song, 0.72 of that off the beat (`beatHit`: Harmony's rule, on the song's grid);
  - two nodes a release, removed after 440 and 780 ms.
- **The drum turns on** (`advance`, `select(c, forward)`), always forward: to the next bare chamber in `LAW.CHAMBERS`' order (light, base, coat, gold,
  thruster, eyes), or else to the next one. A chamber his hand picks still comes the short way round.
- **Enter and Space fire** as a release does. A cancel keeps the paint and never fires, as in Harmony.
- **The wishes are as they were:** a chamber's first colour spends one wish, and the turn spends none.
- **Reduced motion:** no ドン, and the turn stays (the drum's transition is already off there).
- **Not ported:** the birth's film. The mint films her reel at the share's press instead (HER REEL).
- **For the proofs,** `state()` says the drum's turn (`turn`) and the shots fired (`bangs`).

## Cost

- **A release:** two DOM nodes and 780 ms of CSS animation, removed after, plus the drum's existing 420 ms transition.
- **Nothing at rest:** no new file, no new request.

## Proven (new Mac, Oct 30 2026 04:1x UTC)

The page was served by `tools/serve-range` on 127.0.0.1:9187, which answers Range with 206.

- **`node --test dl-her-colours.test.mjs`:** 16 of 16. The new test, against a stand-in document:
  - It pins Harmony's own release, `advance` and `turnTo` in its page.
  - Six press-drag-release strokes turn the drum base, coat, gold, thruster, eyes, then on to light. Each is one turn forward (`--turn` -360deg after
    six), with a ドン each and a wish for each first colour.
  - A seventh on her painted light turns on and spends no wish. A cancel never fires.
  - A chamber his hand picks comes the short way round (base to eyes is -2). Enter fires.
  - Under reduced motion: the turn, and no ドン. Half a beat off: the 0.72 ドン. On the beat: the full one.
- **Every her-making suite and dl-athena-film:** 57 of 57.
- **`dl-her-colours.proof.mjs`:** 26 of 26, in a headless Chrome with trusted input. The five new checks:
  - Each of six strokes turns the drum one chamber forward: base, coat, gold, thruster, eyes, light. Its `--turn` goes -60deg to -360deg.
  - Each fires ドン where it was let go. The ドン's anchor and its word's centre sat on the release point to the pixel: (1208, 353), (1236, 353) and on
    to (1349, 353).
  - Each first colour spends one wish and the turns none, so six spent and she is whole.
  - The drum stands a whole turn on at rest.
  - Under emulated reduced motion, a release turns the drum and fires no ドン.
  - The tab-a check that a release turns the drum on: after her light and her porcelain, the drum stands at coat, turn 2.
- **The other proofs that walk her making:**
  - `dl-path-to-the-kit.proof.mjs` 26 of 26 at 1440x900 and 673x873;
  - `dl-her-song.proof.mjs` 12 of 12, and 12 of 12 with `--phone`;
  - `dl-her-friends.proof.mjs` 13 of 13;
  - `dl-her-reel.proof.mjs` 18 of 18.
- **Rule 8:**
  - `node --test app/dl-twelve.test.mjs`: 21 of 21.
  - `nice -n 19 node app/dl-twelve.proof.mjs --url <the page> --tap button`: PASS, the film never below its second at the tap (6.09 s).
  - `--tap sphere`: PASS (6.03 s).
- **`tools/any-room/any-room.test.mjs`:** 8 of 8.
- **Main's own red, not this lane's:** dl-paywall.test.mjs's "the public mint keeps DysonLight Harmony ice and accent tokens" fails on main.
  - `harmony-accent.css`'s second `--harmony-orange`, #0d4769, stands against dl-paywall.css's #37b6d8.
  - This lane touches neither file.

## Not done here

- **Not deployed.** The deploy is claude-1a67b2d3's, on his word.
- **His eye on it.** He has not yet seen the shot back on the page.
