# PANTHEON COGNITIO STAKE (Nov 26 2026)

Lane `lane/pantheon-cognitio-stake`, branched from `main` (`e40bf53397`).

## His words

- "dont start the video right away please... it just causes exhaustion... figure out how we can turn the pantheon visualization into the thing where people go and they wanna stake their SOL because they will get $POOL down the line (hypertrace the logic of it all)"
- "hypertrace the hexagons role diocane. also, only keep houses symbols, the names of the pentagons are fucked up leftovers mock data... lot of settled stuff not respected."
- "dude the hexagons are expandable... hypertrace the shit come on"
- "i love the visual, i am just not sure about the functionality of it... i wish you really would hypertrace the nature of it all... the visual is great, you can replace it for now, the shit below sucks... we are struggling because the pentagons are dyanmical... the entire point of the diving lyssajudron is that, by diving, wishing wells or tracenets contribute to the pile of cognitio salvata... u get me? ... all below there is frankly shit rn that is not intellectually smart"

## What changed

- **`app/pantheon.mjs`:**
  - Stripped all leftover `GODS` mock department names (`governance`, `custody`, `WebGPU`, `Space Router`, etc.) from the 12 pentagons; each dynamical throne renders its zodiac house symbol (`♈︎`–`♓︎`) alone (plus real seated sub-swarm name only when seated on-chain).
  - Replaced the static 30-hex floor and the four devnet debug cards (`The season clock`, `The throne`, `The challenger`, `The road`, `The ladder of fees`) with an interactive Goldberg-expandable hexagon floor (`GP(1,0)` 0 ⬡ through `GP(5,0)` 240 ⬡ → ∞), animated Light beams from the Oculus SOL pool, clickable dynamical zodiac thrones, SOL stake slider, Futarchy vs single-house Light aiming, and live asymmetric payoff readouts (`Your Light / mo`, `Cognitio Burn`, `Your $POOL %`).
- **`app/after-the-mint.html`:** Replaced the verbose `#stake` bullet wall and `#hall-side` debug card container with the compact interactive Pantheon staking instrument while preserving Nefertiti's `[data-film-door]` oculus button and `poleis/door`'s exact `[data-her-door]` / `#her-door` contract verbatim.
- **`app/after-the-mint-book.mjs`:** Calls `renderHall(doc)` immediately when the bar stands (before devnet responds) and updates with live chain seats on read.
- **`app/swarmbook-book.css`:** Scoped styling and reduced-motion-safe Light beam keyframes for `.hall`, meeting the 12/13 px font floor and 44 px touch target floor.
- **`app/after-the-mint.test.mjs`, `app/polis-rite.test.mjs`:** Updated assertions to pin symbols-only dynamical thrones, zero mock `GODS` department names, and the interactive Goldberg floor & SOL controls.

## Cost and gates

- **Compute at rest:** zero JS timers or loops; one redraw per interaction or chain read; CSS Light beam stops under `prefers-reduced-motion`.
- **Net JS + HTML lines:** `<= 0` (`pantheon.mjs` net -1; `after-the-mint.html` net 0; `after-the-mint-book.mjs` net 0).
- **Tests:**
  - `node --test app/after-the-mint.test.mjs app/polis-rite.test.mjs app/dl-twelve.test.mjs app/swarmbook-floor.test.mjs`: 58/58 PASS
  - `cargo test --manifest-path poleis/door/Cargo.toml --test the_pages`: 4/4 PASS
  - House gates (`the-javascript-only-shrinks`, `the-look-is-a-law`, `no-page-of-its-own`, `the-pixel-is-a-lookup`, `any-room`): 60/60 PASS
  - Rule 8 proofs (`dl-twelve.proof.mjs` on `http://127.0.0.1:18995/embertide-app/ui/intro/dyson-society/app/warm.html`): `--tap button` PASS (drift `-0.0138 s`), `--tap sphere` PASS (drift `-0.0139 s`).
- **Live browser visual check:** verified `#hall` at `http://127.0.0.1:18995/embertide-app/ui/intro/dyson-society/app/after-the-mint.html?side=pool` — Rung 2 → Rung 4 (`150 ⬡`), clicking `♌︎` re-aims the golden beam and lights its rider hexes, zero mock names, zero devnet debug cards, no auto-playing video popup.
