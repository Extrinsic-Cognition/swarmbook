# THE OLD DEAL LEAVES THE PAGE (Nov 23 2026)

Lane `lane/the-old-deal-leaves-the-page`, seat claude-bd202a7f on the new Mac, cut from main and rebased on 55ad4db5b1 (THE DRINK'S FORM IS
HIS). The line at the top of her split, "$WARM pre-deposits: none yet · 10% shared at the close", told every visitor a deal that no longer
exists. It is deleted, with the door's count that fed it.

## His words (UTC, Nov 23 2026)

- 21:14:59, over the line: "this?"
- 21:17:05: "no. we no longer have those pre deposits... we had changed the rules... we should reason about it"
- 21:35:22, over the reasoning: "explain what are you talking about?"
- 21:37:21, to "show the mine's numbers, or delete it": "delete it"

## Why it was wrong

- The deal (his Oct 30 2026 12:54:22): "10% $WARM is sold until breakpoint begins to seed liquidity": pre-deposits until Breakpoint, the tenth
  of a fixed supply shared by the pre-depositors at the close (THE STATE OF $WARM, Nov 19, painted it; THE GENESIS SHARES THE TENTH, Nov 19,
  built its share).
- His ruling of Nov 21 2026 17:34:37: "it is supposed to be uncapped supply, prompt-2-mine; the issuance needs to be live and continuous based
  on the space-router utilization" (`poleis/program/warm_mine/WARM-IS-MINED-BY-USE-LANDING.md`): no premine, no sale, no share.
- The live mine door that evening (`/space-router/v1/mine`): opened Nov 15 (Breakpoint), 9.28 $WARM mined, 1 per $1 burned, halving May 15,
  2027. Her own line already says how $WARM comes: "Burn fuel, mine $WARM."

## The cost first

| | main | this lane |
|---|---|---|
| the split's top band | the line, 13 to 15 px | nothing |
| the page's one ask of the deposit door | its terms and the pre-deposits' sum (one `COUNT(DISTINCT payer), SUM(usd)` over `sr_deposits` a visit) | its terms |
| JavaScript | | +8 −31, net −23 in 6 files |

## What is deleted

- `app/warm.html`: the line's element, `<p class="dl-warm-state" data-warm-state hidden>`.
- `app/dl-kit-deposit.js`: its query and its painting at the terms' answer. The script stood null-safe, so a copy a browser keeps paints
  nothing where the element is gone.
- `app/dl-kit-deposit.mjs`: `stateLine` and `TENTH`, the line's words and the tenth's arithmetic ("$1 gets N $WARM").
- `app/dl-paywall.css`: the line's place, and its name in the rule that hides things while the flask waits.
- `worker/space-router-deposit.mjs`: `stateOf`, its query, and `state` in the door's GET terms (only the line read them).
- The tests of the line and of the count (`app/dl-kit-deposit.test.mjs`, `worker/space-router-deposit.test.mjs`); the markup pin of the
  split now holds the plates and the deposit button with nothing between.

## Proofs (the new Mac, nice 19, headless, off every screen; nothing paid, nothing sent)

- The 25 suites that read the page's moved files: 251 of 254, the 3 red red on main too (THE DEPTH, the public mint's ice tokens, her cut's
  pose); the door's 5 suites that read it: 33 of 33.
- Rule 8: `app/dl-twelve.test.mjs` green; `app/dl-twelve.proof.mjs --tap button` PASS and `--tap sphere` PASS on this tip's tree served with
  Range (206).
- The screens gate (`no-landing-adds-a-failing-screen.1.sh`, `.2.sh`): 48 cells, 0 new failing.
- The built site staged locally: the split at 760x930 and 390x844 shows the plates and her, the top band empty.

## What is left (named, not done here)

- `tools/warm-launch` still builds the fixed-supply genesis and the tenth's share; his Nov 21 ruling voids both, and `poleis/program/warm_mine`
  is the road his ruling took. Nothing on a page shows them.
- `app/dl-athena.mjs` COUNT ("PRE-DEPOSITS · FOR SPACE ROUTER · OPEN · UNTIL SOLANA BREAKPOINT"): no beat of her script plays it.
- A `SPACE_ROUTER_PRE_DEPOSITS_CLOSE` set on the live Worker, if any, now names nothing.

Live at his publish alone.
