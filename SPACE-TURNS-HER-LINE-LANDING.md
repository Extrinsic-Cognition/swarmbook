# SPACE TURNS HER LINE

Nov 26 2026 UTC, seat claude-168f7fed, `lane/space-skips-her-line`. His words, ~01:0x UTC, over a still of her entrance on the mint page (her offer pose,
the egg in her hand, "Stake your SOL in me. You keep it." under her): "oressing spacebar should skip her lines like as if it was a game, like u know?"

## Before

- Her entrance is twelve lines (`dl-athena.mjs` STORY), each standing as long as it takes to read at 17 letters a second, at least 1.7 s, plus its rest:
  about 30 s from her first line to "Take this egg.".
- Space was one of the keys her entrance holds (it scrolls a page): pressed, it did nothing at all. Only her Skip (asked first) or a scroll down
  shortened her, and both end her whole entrance.
- Her beats were set at their times from her start (`ENTRANCE.forEach(... setTimeout(..., beat.at))`), so no beat could come sooner.

## What changes

- Space shows her next line at once, as a game's dialogue does. It ends nothing and asks nothing: her Skip still asks first and is the only way to
  end her entrance.
- Each beat now calls the next at its own gap (`dl-athena.js` play, ahead), so a press can bring the next one now (next).
- The rule is pure and tested, `dl-athena.mjs` `spaceStep`:
  - on her card's arrival, her first line;
  - on a line, the next line (a pose or hit still to come on it is left unsaid);
  - on "Take this egg.", the egg now: offered while the deposit door is open, let fall when a seat is held. She lands as the egg lands, its fall
    whole, never before;
  - after it, nothing.
- Once a press: a held key's repeats turn nothing. Never while her question asks, never on a focused button (Space is the button's own there), never
  after she has gone. Space still scrolls nothing under her.
- Every visit, the first included: Space reads her faster, it does not skip her (NO SKIP THE FIRST TIME stands).
- JavaScript +63 -63, net 0: her test file's adjacent assertions folded two to a line.

## Measured

- In a headless Chrome off every screen, the mint page (`app/warm.html`) served from this tree by `tools/serve-range`: the film's skip pressed, its
  question answered Skip, then Space every half second from her first line.
- Each press moved her one line, the new line read 120 ms after the press: beats 1 to 12, "There's no time." to "Take this egg." in 5.7 s, where she
  takes about 30 s on her own.
- The twelfth press offered the egg (`html[data-egg-offered]`); three more changed nothing. The page did not scroll (0 px throughout), her entrance
  kept running (no skip, no landing, no read), no error.
- `node --test app/dl-athena.test.mjs` 25 of 25: the new case was red first (no SPACE, no spaceStep). Its two pins of her timeline moved with it.
  `dl-athena-layer`, `-film`, `-purse` green: 43 of 43 with it.
- Rule 8, no sound touched: `node --test app/dl-twelve.test.mjs` and `app/dl-twelve.proof.mjs` on `warm.html` served by `tools/serve-range`, both taps
  (button, sphere): named in the commit.

## Owed

- Not seen on his own screen, and not on swarmbook.com until the site is deployed (his word).
- A tap on a phone does not turn her line: his word named the bar, and the Oct 29 rule keeps a stray press from doing anything to her entrance.
