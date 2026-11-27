# THE OFFERED EGG IS THE PRESS (lane/the-offered-egg-is-the-press, Nov 20 2026, claude-1cd371e0)

## His words (UTC)

- Nov 20 ~07:1x, "Yes, start it" to the new person's walk; then "Yes, fix it" to "Fix the loop so the egg opens its payment box?".
- Before it: Nov 19 "can we please make the minting of the swarmy egg be the entrance ticket to the MMO?" (THE EGG IS THE TICKET); Nov 12 ~06:38 "it gotta
  split based on what people click... the green stuff could be later" (THE SPLIT LEADS WHERE YOU CLICK: the two plates are links, the deposit door unseen).

## What a newcomer met on the live site (Nov 20 ~07:2x, a fresh headless Chrome, 1440 wide and 500 wide, no flask, no X)

The film (2 min 32 s, or "Skip to $WARM" and "Skip"), her lines, then "Take this egg." between the two plates. Her egg pressed nothing (her layer covers
it; her own egg's image, which presses the flask's plate, stays hidden there). The red plate ("your flask · from 10 USDC") opens Swarmbook's page; its
board's "Be the first rider · Mint your Swarmy egg" pointed at `warm.html#mint`, the mint page from its film again. Only the page's top "Prompt-2-mine
$WARM" opens the egg's call, and nothing on it says mint. A newcomer from the web never reached Connect X, the card or the deposit. The phone width met the same.

## What is so

- **Her offered egg presses** (`app/dl-kit-deposit.js`, on the line her events already arrive on). Once she offers the egg (`data-egg-offered`, the plates
  drawn), a press on her or her egg takes the page's own door, `warm.html?door=deposit` with the visit's query kept (a friend's `?ref=`): she lands at
  once and the egg's call opens beside her, on screen: "First, your X · Connect X · Mint your Swarmy egg · $10 · card, Apple Pay or a Solana wallet · with
  your X". The plates keep their links. Opening the call in place was tried first and left it off the screen (her landing places it; she has not landed
  at the offer), so the press goes through the door that lands her.
- **Swarmbook's board mints** (`app/after-the-mint.html`): "Be the first rider · Mint your Swarmy egg" goes to `warm.html?door=deposit`, as the front's board
  already does (`app/index.html`), never to the film again.

## The proofs

- `nice -n 19 node embertide-app/ui/intro/dyson-society/tools/flask-grant.proof.mjs`: 10 of 10. New check 10: a newcomer at `warm.html?ref=friend`, real
  presses on Skip and its confirm, waits for her offer with the plates, presses her: the page is at `?door=deposit&ref=friend` and the egg's call stands
  on screen with Connect X and the mint. Check 9 now presses the egg's call until the address stands (its press listens only once the card road answered:
  one early press did nothing in a run of this lane).
- `node --test` on the deposit page, Swarmbook's page (its pin of the doors to the deposit: three now), warm-entry, rule 8's test, the deposit door, the
  laws (any-room, no-page-of-its-own, the-look-is-a-law): 77 of 77.
- Rule 8 (the lane touches the mint page's folder; the film and the song untouched): `node --test app/dl-twelve.test.mjs` passes; `nice -n 19 node
  app/dl-twelve.proof.mjs --url http://127.0.0.1:8996/app/warm.html --tap button` and `--tap sphere`, served by `tools/serve-range` (206): both PASS.
- JavaScript: +6 -6, net 0 (no pass asked).

## Not done, said

- The money half of the walk (a real X sign-in, 10 USDC, Harmony spending) still waits on a real person's hands.
- The egg's own image in her layer (`dl-athena.js`, pressing the flask's plate) is left as it is; it is hidden at the offer.
- Live only at the site's next press.

## Nov 20 2026: only her egg presses (lane/only-her-egg-presses, claude-1cd371e0)

- claude-93958ebc's walk of the live page, ~08:33 UTC: at "Take this egg." a press anywhere opened the deposit door (the blue side, the $WARM line,
  the black bands, the subtitle); only the two plates and Skip escaped it. Cause: this lane's listener took `e.target.closest('.dl-athena-intro,
  .dl-athena-egg')`, and `.dl-athena-intro` covers the whole screen.
- Now the press point must lie in the box of her portrait or her egg as drawn and seen (opacity above 0), and never on a link or a button.
- Found on the way: at the offer her egg is laid out beside her at opacity 0 with `pointer-events:auto` (`dl-athena.js`, `.dl-athena-egg.offered`),
  its press clicking the red plate (Swarmbook's page). Once she slides to the centre it sits in empty space to her right (1013-1139 x 595-767
  against her 482-960, at 1440 x 813), so a press on nothing led to Swarmbook, the loop of his "Yes, fix it". At the offer it takes no press now;
  a press on her, the egg she holds included, opens the egg's call.
- Walked on a local copy (the tree with stand-in terms, a headless Chrome at 1440 x 900): at the offer the hidden egg's spot, the top band, the
  lower left and the upper right left the page at `warm.html?ref=friend`; a press on her went to `?door=deposit&ref=friend`, the call on screen
  ("First, your X", "Connect X", "Mint your Swarmy egg · $10").
- `tools/flask-grant.proof.mjs` check 10 aims once she has settled (aimed before her 0.6 s slide, one press "off her" landed on her), presses up
  to three spots off her, the hidden egg's first, and expects nothing; then presses her.
- Proofs: `nice -n 19 node embertide-app/ui/intro/dyson-society/tools/flask-grant.proof.mjs` 10 of 10 (check 10: the hidden egg's spot (1076, 681), the
  top band (720, 24) and the upper right (1354, 203) opened nothing; her press: `?door=deposit&ref=friend`, the call on screen). `node --test` on the
  page, Swarmbook's page, warm-entry, her layer's tests, the laws and the JavaScript gate: 136 of 137, the one red main's own (`dl-athena.test.mjs`
  "the shell's cursor is her look on a Mac", the same on main's tree). Rule 8: `node --test app/dl-twelve.test.mjs` 21 of 21; `nice -n 19 node
  app/dl-twelve.proof.mjs --url http://127.0.0.1:8996/app/warm.html --tap button` and `--tap sphere` on `tools/serve-range` (206): both PASS.
  JavaScript +4 -4, net 0. Live only at the site's next press (held until his pour lands).
