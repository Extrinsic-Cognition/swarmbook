# PANTHEON GVS TRUTH (Nov 26 2026)

Lane `lane/pantheon-gvs-truth`, branched from `main` (`dc9221d347`).

## His words

- "it looks not trustworthy. it is ugly. it is also not even functional right now... also hexagons silhouettes are fucked up and houses are clickable before even they are assigned... you have 0 understanding of the onchain program for the GVS dude..."

## Root causes fixed

1. **Misaligned hex silhouettes & double gold ring:** `assets/pantheon-hall.svg` bakes the stone floor lattice at `W = 13√3`, `row * 19.5`, `r = 11.5` (`128 <= d <= 246`) and its own `r = 114` gold oculus ring. `pantheon.mjs` now draws the exact `11.5` lattice (`0.0px` error) and `after-the-mint.html` removes the duplicate `r = 109` ring, dashed orbit ring, and fake `#hall-beams`.
2. **Clickable unassigned houses:** In `poleis_treasury` (`ix/fund.rs`, `lib.rs:180`), `Fund.chairs[k]` is `NO_ROOT` until a sub-swarm earns a throne by fees (`Twelve is the budget, never the roster`). Empty houses (`c === null`) are now rendered as non-interactive `<g class="throne is-empty">` (`pointer-events: none`) showing only their zodiac sign (`♈︎`–`♓︎`). Only seated houses (`c !== null`) render as `<a class="throne is-seated">` linked to `./polis.html?civ=<root>`.
3. **Non-functional fake Stake/Unstake input form:** Removed the dead `Stake | Unstake` tabs and dead `0.00 ◎ SOL` input box that did nothing pre-launch. Replaced `#stake` with an honest, trustworthy summary of the real on-chain SPL Stake Pool (`SPoo1Ku8…`) + `poleis_treasury` recursive Double Seal (`>50%` lit pentagons AND `>50%` active floor weight, or futarchy on a split), real Solana readout (`Thrones seated`, `Floor seats`, `Fund vault`), and the verbatim `poleis/door` `[data-her-door]` door (hidden until `POOL` exists on-chain).

## Cost and gates

- **Compute at rest:** zero JS timers, zero animations, zero click handlers on empty chairs; one redraw per chain read.
- **Net JS + HTML lines:** `-1` (`pantheon.mjs` 17 → 16; `after-the-mint.html` net 0; `after-the-mint-book.mjs` net 0).
- **Tests:** `after-the-mint.test.mjs`, `polis-rite.test.mjs`, `dl-twelve.test.mjs`, `swarmbook-floor.test.mjs`, `cargo test --manifest-path poleis/door/Cargo.toml --test the_pages`, `the-javascript-only-shrinks.test.mjs`, `the-look-is-a-law.test.mjs`, and Rule 8 (`dl-twelve.proof.mjs` `--tap button` & `--tap sphere`).
