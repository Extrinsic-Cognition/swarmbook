# THE POUR PAYS TO LAND (lane/the-pour-pays-to-land, Nov 20 2026, claude-1cd371e0)

## His words (UTC)

- Nov 20 ~06:0x, to "Which build first?" over the list of what stands before his 600 USDC goes through the door: "The priority fee".
- Before it, Nov 20 05:48: "hold on, that has to be the final last thing we do dude... before that we need to do so much more shit..." (the pour of his 600
  is the last step; this is one of the steps before it).

## What was so (main e1cf078fd4)

Every deposit the house sends (a flask's pour, relayed with the house paying the fee; the house's own pour of the fee wallet's USDC) asked for no compute
budget and offered no priority fee: Solana's default limit (200,000 units an instruction) and a price of 0. On a busy network such a transaction can wait
or never land, and the page then says "Pouring." over a deposit that did not happen.

## Measured (mainnet, by `simulateTransaction` only: sigVerify off, the blockhash replaced, nothing signed or sent)

| deposit | units used | limit asked | fee (lamports) |
|---|---|---|---|
| today's plain deposit | 23,323 (memo 23,218, transfer 105) | default | 5,000 |
| with the compute budget, plain memo | 23,623 | 30,000 | 35,000 at the floor, 605,000 at the cap |
| with the compute budget, a key's memo | 46,518 | 60,000 | 65,000 at the floor |

The memo costs about 350 units a byte, so the limit follows it. The fee wallet holds 0.05 SOL: at the floor a flask's deposit (two signatures) costs it
40,000 lamports, about 1,250 deposits.

## What is so

- **The law** (`app/space-router-deposit.mjs`): `depositMessage({..., price})` puts two compute budget instructions first: the limit by the memo
  (`depositUnits`: 30,000 plain, 60,000 with a key's commitment) and the price in micro-lamports a unit, between `PRICE_FLOOR` (1,000,000) and `PRICE_CAP`
  (20,000,000), both mine and his to change. `priceOf(fees)`: the 75th percentile of a node's recent fees, a fifth above it, held between floor and cap.
  Asked with no price, the message is the old one byte for byte (the law's tests compare it with the launch tool's compiler).
- **The door** (`worker/space-router-deposit.mjs`): the watch (`GET ?flask=`) says the price with the blockhash, once a flask holds 10 USDC; the relay
  writes the price the page signed back into the same bytes (a price past the cap is no deposit, 400); the house's own pour reads its price itself.
- **The page** (`app/dl-kit-deposit.js`): it signs the price the door said and sends it with the relay. A door that says no price gets the old deposit, so
  pages and doors of either age pour.

## The proofs

- `node --test` on the deposit law, the door and the page's test: 28 of 28 (new: the compute budget's bytes in both forms and both limits, the cap, `priceOf`,
  the watch's price, the relay sending the priced bytes the flask signed and refusing a price past the cap or left out).
- The neighbours (the X door, the grant, the Space Router, the link, premint, the launch tool's tests, rule 8's test, the laws): 134 of 134 together.
- `nice -n 19 node embertide-app/ui/intro/dyson-society/tools/flask-grant.proof.mjs`: 9 of 9, the real `warm.html` in a headless Chrome. New check 9: a
  stand-in door says a flask holds 10 USDC at 6,000,000 a unit; the page, after her egg's call, signs and relays: the price it sent is 6,000,000 and the flask's
  signature holds over the law's priced bytes, not the old ones, not another price. The proof's checks 1, 6 and 7 now follow THE EGG IS THE TICKET (Nov 19,
  another seat's lane, which opens the door on her egg): they failed on main the same way before this lane.
- Rule 8 (the lane touches the mint page's folder; the film and the song untouched): `node --test app/dl-twelve.test.mjs` passes; `nice -n 19 node
  app/dl-twelve.proof.mjs --url http://127.0.0.1:8989/app/warm.html --tap button` and `--tap sphere`, served by `tools/serve-range` (206): both PASS.
- The laws: any-room 13 of 13, no-page-of-its-own 3 of 3, the-look-is-a-law 2 of 2; the-javascript-only-shrinks red at +23 until his pass.

## Not done, said

- No priced deposit has landed on mainnet yet: the first real pour will be its proof (the simulation says it is valid and fits its limit).
- The price reads a node's recent fees, which say the minimum that landed (0 on Nov 20, everywhere): the floor carries it until fees rise above it.
- His: the JavaScript pass (+23); the site's press (no migration) after it lands.
