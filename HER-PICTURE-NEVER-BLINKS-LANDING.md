# HER PICTURE NEVER BLINKS (Nov 24 2026)

His words, Nov 24 2026: "there is unnerving flashing when here... fucking audit the code audit the performances, i see white flashes erratically over
the page here", over her entrance on swarmbook.com ("Solana is fast. It is not yet smart.").

## The cause, read off the page's own frames

Her entrance recorded headless on live (dark mode emulated, every painted frame by CDP screencast, each frame's brightness in 96 regions): at
a pose change her picture is missing for one frame, and the bright stage behind her shows where she stood (live: 10.4 s and 23.8 s of one walk).
`app/dl-athena.js` swapped `portrait.src` with `portrait.decoding = 'async'`, which lets Chrome paint the frame before the new pose is decoded.

## The fix

- her portrait and her egg are `decoding = 'sync'`: the swap paints the new pose in the same frame;
- `preload()` asks each pose's `decode()` ahead, so the sync swap finds it decoded (no work on the main thread at the swap).

JavaScript: 3 lines changed in place, net 0.

## Proof

The same walk (skip at 3 s, her entrance, 48 s, 1440 x 900, dark mode), main and this lane served side by side; a "blink" is a frame where her
region's brightness falls 15+ and comes back the next frame:

| | blinks before her landing |
|---|---|
| main | 3 (9.6 s, 11.8 s, 17.3 s) |
| this lane | 0 |

Rule 8: `node --test app/dl-twelve.test.mjs` passes; `dl-twelve.proof.mjs --url <served lane>/dyson-society/app/warm.html --tap button` and
`--tap sphere`: PASS. `app/dl-athena.test.mjs`: 23 of 24, its one red ("THE DEPTH rides the engine and the corner") red on main too.

Not changed here: the stage under her entrance is light by design (the page is light whatever the system's mode), and when the deposit
door does not answer at her landing the page still falls back to the Oct 30 freeze (his call, asked Nov 24).
