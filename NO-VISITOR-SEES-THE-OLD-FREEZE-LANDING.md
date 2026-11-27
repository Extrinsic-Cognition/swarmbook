# NO VISITOR SEES THE OLD FREEZE (Nov 25 2026)

His words, Nov 25 2026 (UTC), over THE FIRST TRACENET · NOW LIVE · MINT YOUR HEXAGON on her landing: "why do i see this again? are you dumb? if a user
sees this shit?!!?". Before it, Nov 24: "how is it possible i still see this scene some times by accidnet?", and the walk that found why.

## The cause

At her landing beat she ended her entrance unless her egg was offered AND the deposit door's button was enabled (`app/dl-athena.js`). The button is
enabled by one GET of `/space-router/v1/deposit` at the page's load (`dl-kit-deposit.js`); when it failed (a dropped request on live; every time on a
copy with no door), she landed with no egg, and a landing with no egg opened the Oct 30 freeze (`app/dl-space-router.js`), its NOW LIVE and its
paused MINT YOUR HEXAGON. Her making's end opened it too.

## The fix

- her egg offered, she holds on "Take this egg." whether or not the door has answered; the split comes in when it does (`dl-paywall.css`, unchanged);
- the freeze opens on nothing she does: her landing and her making no longer open it; it still closes when her egg is given.

JavaScript: 2 lines changed in place, and their tests' lines (`dl-athena.test.mjs` 1, `dl-space-router.scene.test.mjs` 8), net 0.

## Proof

Her entrance walked headless with no deposit door (skip at 3 s, 75 s): on the lane before this fix the freeze opened at her landing
(`html[data-space-router="open"]`); with it, it never opens and she holds her egg out on "Take this egg.".

Tests: `dl-athena`, `dl-space-router.scene`, `dl-space-router`, `dl-paywall`, `dl-twelve`: 84 pass, the 2 red red on main too ("THE DEPTH rides the
engine and the corner", "the public mint keeps DysonLight Harmony ice and accent tokens"). Rule 8: `node --test app/dl-twelve.test.mjs` passes;
`dl-twelve.proof.mjs --url <served lane>/dyson-society/app/warm.html --tap button` and `--tap sphere`: PASS.
