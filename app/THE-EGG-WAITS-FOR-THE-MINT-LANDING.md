# THE EGG WAITS FOR THE MINT

His words, Nov 11 2026 UTC:

- 04:59: "so we can have the users mint the hexagon of the meta-swarm in optimism.fit... it could be that we let people get their lyssajudron after the mint..."
- ~05:45, over a QA sheet of the mint page: "u get that coloring lyssajudron now has to appear after the mint? the thing is, we gotta work surgically about where she is saying there's no time and then lyssajudron gets minted... because the thing is, we need to get the hexagon minted there dude"
- Later the same morning, relayed by the coordinator: the mint is a USDC deposit, "we could have people deposit USDC like min 10 USDC and uncapped max", "use hexagons and 10$ min usdc".

Her rules (Oct 22) stand: she points and never explains, one idea a moment, she never sells. She says nothing new here.

## What changed

- `dl-athena.js`
  - `seated(win)`: the one word for a seat, the wall's state `'open'` (a holder, the mint window closed, or `?paywall=off` on a house host).
  - On "egg": a seat lets the egg fall as before (`drop()`). With no seat, `offer()`: the egg is laid exactly over the egg in her offer pose (`eggAt()`, factored out of `drop()`), takes presses (`.dl-athena-egg.offered`), the root gets `data-egg-offered`, she says `tell('egg', {offered: true})`, her line stands, and the land beat does nothing (`waits`).
  - A press on the offered egg presses the page's own door (`LAW.COUNT.door`, `.snowtrace-kit [data-deposit]`); a paused (disabled) door presses nothing.
  - `dl-tank-filled` (document, from dl-kit-deposit.js after a deposit) or `dl-premint-paid` (window, the older seats) while the egg is offered: both ears come off, the egg falls, and `end('whole')` runs `DROP.fall_ms` later as before (the flash, her making with `egg: 'given'`). Any end of her entrance (her Skip, the film's skip, a scroll that reads on) takes both ears off and clears the mark.
  - A landing with no fall says `egg: 'seated'` when the wall is open, so a holder whose film plays on to its end still gets her making (today's road for a holder).
  - While her layer is parked (a modal dialog, the checkout, is open) her entrance holds no wheel or key: a scroll inside the checkout never reads on and ends her.
- `dl-her-colours.js`: her making opens on a landing only with an egg (`'given'`, cut under the flash, or `'seated'`).
- `dl-space-router.js`: a landing with no egg opens the freeze plate even while her making's claim stands `'waiting'` (the unseated road never waits on a making that will not come).
- `dl-paywall.css`: while `html[data-egg-offered]` stands, the kit's own deposit door is lifted under her line over her layer, as the page has it (words, gold, pause). Position only: no colour, no font.
- The file head of `dl-athena.js` rewrapped (the same words, checked word for word) to pay for the lines.
- Tests: the drop's pins hold the new law (a seat's egg falls; an unseated egg waits on the last line, pressable as the page's door; a fill or a seat lets it fall; both ears come off at any end; her making opens only on an egg; a landing with no egg opens the plate).

Left as it was: the starter kit's own door to her making (`#her-door`) and `?her`. New purchases stay paused; the deposit door stays as dl-kit-deposit.js sets it.

## What differs from the brief (the code, read)

1. **The door is not on the page.** The whole offer section of `warm.html` (`#dl-paywall-choice`, the kit, its deposit door, and `#her-door` with it) sits inside a `<template data-commented-out>` since his Oct 30 2026 "please comment out all this". The lane did not unwrap his commented-out section. So today the offered egg has no door under it, a press on it presses nothing, and an unseated visitor's egg waits until her Skip or a scroll. The lift in `dl-paywall.css` and the egg's press reach the door as soon as the deposit lane (lane/swarmbook-is-the-new-poleis) puts `.snowtrace-kit [data-deposit]` back on the live page.
2. **A seat never reaches the egg's turn through her entrance.** Her entrance plays only on a held stop, and the wall holds only viewers with no seat; a holder's film plays on to its own end and she lands with no entrance. So a "seated egg falls" happens only when the wall opens mid-entrance; the holder's own road is the landing with `egg: 'seated'`, which opens her making as before.
3. **A filled tank does not count as seated yet.** `seated()` reads the wall alone; the deposit's own read (a browser that already filled a tank) is the deposit lane's to add there.
4. A fill or a seat while the checkout is open lets the egg fall under the parked (hidden) layer; the making stands when the dialog closes.

## Cost

- JavaScript (`.js`, `.mjs`, `.html`, tests included): +66 -67, net -1 in 6 files (the gate's own count). CSS: +4 lines in `dl-paywall.css`.
- Nothing at rest: while the egg waits there is no timer, no frame, no poll; two event listeners, taken off at any end. The land beat's one timer fires once and does nothing.
- No media touched: nothing here seeks the film or the song (rule 8; the fall's pin still reads the drop's code for any of it).

## What was run (the new Mac, niced, in a scratch tree removed after)

- `node --test dl-athena.test.mjs`: 24 tests, 23 pass, 1 fail, the known red of main ("the shell's cursor is her look on a Mac").
- `node --test dl-her-colours.test.mjs`: 23/23. `dl-space-router.scene.test.mjs`: 5/5. `dl-twelve.test.mjs`: 21/21.
- `tools/embertide-mesh/tests/the-javascript-only-shrinks.test.mjs`: 13/13 (net -1). `the-look-is-a-law.test.mjs`: 2/2 (the commit hook: 0 new drift). `the-law-is-the-gate.test.mjs`: 7/7.
- Walks in a headless Chrome, 1440x900 at 2x, the tree served by `tools/serve-range` (206):
  - a stranger: the film skipped, her lines; at 23 s and again at 30 s the egg is still in her hands (`data-egg-offered`, the wall `held`, no making, no plate); a real press on the egg moves nothing (no door on the page); `dl-tank-filled` dispatched at 33 s: the egg falls, the flash, her making ("Give me my colours.") stands at 36 s;
  - a stranger who skips at the waiting egg: her Skip asks, Skip: the freeze plate opens (`data-space-router="open"`), no making;
  - a holder (`?paywall=off`, the wall `open`): no skip is offered, the film plays to its own end (about 150 s), she lands with no entrance and no egg offered, and her making stands at 160 s (`egg: 'seated'`); the film loops on under it, as before this lane.

## Owed

- The door on the page (the deposit lane): `.snowtrace-kit [data-deposit]` back on the live page; then a walk that the lifted door stands under her line and a press on the egg opens it.
- The deposit's own read of a seat in `seated()`.
- The hexagon choice on the sphere and the passkey wallet: not in this lane.
- The offered egg's box is computed once at "egg"; a window resized while it waits leaves it off her hands until the next take.

## Nov 11 ~06:2x UTC: the waiting egg is her own picture, never a layer over it

His word over a crop of the offered egg on main's art, the apple's leaf showing behind it: "this is so sloppy dude.. why dont you mask out the apple
from her hands before adding the egg slapped z index on?" He is right; two changes:

- This lane now carries `lane/she-holds-the-dodecahedron-egg` (merged): the apple is out of her hands in all seven poses, she holds the egg itself,
  and the falling egg is the same drawing lying exactly where her offer pose holds it (EGG.box 105, 354, 166, 225; the asset at twice its px).
- While the egg waits nothing is laid over her: the egg image stands invisible over her hands only to take his press (`.dl-athena-egg.offered`,
  opacity 0). It shows at the fall, in the same instant her picture goes, as on main.

## Rule 8 on this lane (Nov 11 2026 ~06:2x UTC, the other Mac, the tree at 9490af6062 served by tools/serve-range, Range answered 206)

- `node --test app/dl-twelve.test.mjs`: 21 of 21.
- `nice -n 19 node app/dl-twelve.proof.mjs --url <the served warm.html> --tap button`: PASS (the sound came in where the picture was, and the picture
  never went back; the song within 0.15 s of the picture at the end; both media can be sought past the tap).
- The same with `--tap sphere`: PASS.

The lane changes no line of the film's clock; it changes her pictures and the beat where her egg leaves her hands.

His word for the hand, Nov 11 2026 06:09 UTC: "merge".
