# PANTHEON STAKE TERMINAL (Nov 26 2026)

Lane `lane/pantheon-stake-terminal`, branched from `main` (`546f3b875f`).

## His words

- "i think this is fucked up? it is ugly to look at... what would even happen if someone decided to stake? you are not thinking dude... i would encourage you to run exhaustive traversal on what happens on marinade native or other solana staking UX journeys..."
- "you dont seem to understand that we need to get people staking and we need to do it in a way that uses staking yield resulting deposited into the vault that is handled by the meta-swarm's perfect recursive bicameral governance..."

## What changed

- **`app/after-the-mint.html`, `app/pantheon.mjs`, `app/swarmbook-book.css`:**
  - Stripped the toy calculator sliders and invented numbers from `#hall` (respecting the "Read from Solana — a person types only what is theirs: an amount" law).
  - Replaced `#stake` with a clean, conversion-grade Solana **Stake / Unstake** terminal: segmented `Stake` | `Unstake` tabs (`>= 44×44 px` at 320px), numeric `◎ SOL` input box pre-filling `#her-sol` when `[data-her-door]` opens, transparent 4-row protocol summary (`Principal: Kept in your wallet · zero custody`, `Staking yield: Deposited into unit0 Vault`, `Vault governance: Recursive bicameral · 12 ⬠ + ⬡ Floor`, `Staker reward: Accumulate $POOL · Unlocks Year 5`), verbatim `poleis/door` `[data-her-door]` contract, and links to `./rules.html` and `./index.html#wall`.
  - Left Pantheon wheel reads real chain `seats`/`cap` and `fund` vault balance from Solana, displays silent zodiac houses (`♈︎`–`♓︎` only, zero mock names), and lights golden yield rays into the clicked house or seated houses.
- **`app/after-the-mint-book.mjs`:** Bumped `pantheon.mjs?v=hall-3`.
- **`app/after-the-mint.test.mjs`, `app/polis-rite.test.mjs`:** Updated assertions for the real Stake/Unstake terminal and Meta-Swarm Vault wheel.

## Cost and gates

- **Compute at rest:** zero JS timers or loops; one redraw per click or chain read.
- **Net JS + HTML lines:** `0` (`pantheon.mjs` 19 → 19; `after-the-mint.html` 67 → 67; `after-the-mint-book.mjs` 16 → 16).
- **320px touch target floor:** every button, input, and link in `#hall` is `>= 44×44 px` (`stake-tabs` 2-col full-width, `hall-links` min `44×44`, `hall-sol` min-height `44px`).
- **Tests:** `after-the-mint.test.mjs`, `polis-rite.test.mjs`, `dl-twelve.test.mjs`, `swarmbook-floor.test.mjs`, `cargo test --manifest-path poleis/door/Cargo.toml --test the_pages`, `the-javascript-only-shrinks.test.mjs`, `the-look-is-a-law.test.mjs`, and Rule 8 (`dl-twelve.proof.mjs` `--tap button` & `--tap sphere`).
