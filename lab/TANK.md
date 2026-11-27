# THE TANK: the syrup glass as the MiniRouter tank (Oct 16 2026, a cloud seat, branch `claude/epic-hawking-qdjukt`)

## His words

Sept 7 2026: "money in vault / money lands in tank (fuel) / agents are getting paid". Sept 18: "i want you to turn the unit0 of every swarm as the
'tank fuel'". Sept 21 09:59: "every time we use tokens i wanna see like in league of legends the DPS or any number flashing to screen showing me how
much i spent". Sept 21 20:09: "why the fuck astra or anyone has demolished the fucking shit i had spent time building? the blobby at the center and
the gasoline and the mmo shit dps". Oct 11 11:12: "show the tankfuel there as well". Oct 16, over the syrup glass's picture (`syrup-glass-pictures/
3-gold-setting.png`): "you see that glass over there my man? can you please focus on what i had for minirouter please my dude? the fucking MMO-like
when tank-fuel is consumed by calling agents... come on please".

## The cost, first

| | before | after (this lane) |
|---|---|---|
| the pouch at rest | 0 draws (the law of rest) | **0 draws** (`tank.proof.mjs`: 60 frames at rest, 0 page draws) and one open stream to the Nest; no timer, no poll |
| a call through the purse door | nothing on this glass | one DOM node moved by a CSS animation on the compositor (1.8 s), 10 sparks on the page's own loop for 700 ms (in the beads' one instanced draw), a sip on the wave (a splat smaller than a bronze drop's); the balance's text written once |
| the wave's energy pass | 683 µs a call on NewMac's M4 Max, every 12 frames, with a fence and a readback (the page's costliest pass) | **never**: the pouch is still by the clock. A ripple's life is deterministic (240 Hz substeps, no readback needed): measured once through the old readback on this tree, a gold drop 5,183 ms, a bronze 3,783 ms, twice the same to the millisecond (`LIFE_MS`; `?rest=energy` measures it again) |
| the glass pass's far-cell backdrop | read three times a pixel (the chromatic fringe) | the same; `?dispersion=0` reads it once, for a glass that cannot pay for the fringe |
| measured here (SwiftShader, no GPU, 1280 x 720) | alive frame 333 ms median, p95 483 (the wave on a CPU); the energy pass alone 67.9 ms a call | the proof's 7 checks pass in a bounded headless Chromium; GPU numbers are NewMac's to read (`syrup-glass.bench.mjs`) |

## What stands

- `tank-law.mjs`, pure: what the glass takes from the Nest's `house/purse` (`tools/embertide-mesh/lib/house-purse.mjs` writes it on a cause: every
  call through the purse door, `minirouter-openai-shim.mjs`, lands in the burn book, the daemon's kqueue marks it, the ref moves) and `mint/drops`
  (the mint's sales). The level is the purse's. A burn row is taken once by its id; one on the Nest before this glass's first picture is history
  and flies nothing; a newer one is a cause. A number lives 1.8 s from the row's own time (the same flight on every glass). The rate under the
  balance is the last minute's cost as dollars a minute (his DPS). A reading no newer than the one held (its rev) moves nothing. A sale is a cause
  once by its id: a drop of its metal. `tank-law.test.mjs`: 9 tests.
- `syrup-glass.html`: the tank on by default (`?tank=0` leaves the pouch the lab's; in a bench, `?bench=1`, off unless `?tank=1`, so the bench
  stays hermetic; `?nest=` names the Nest, default this host's :8904). Reads the two refs once at load, then their stream. A call: the number flies
  from the syrup's surface with its cost, its lane and its tokens in; ten sparks rise from the surface toward the eye; the surface takes a sip; the
  level pours to the purse's; the balance pulses red. The balance and the rate stand under the pouch. Nothing of a purse the Nest does not hold.
  The seam for a proof: `window.__syrup.tank.take(ref, {value, rev})`, as the Nest's stream would hand a reading.
- `tank.proof.mjs`: a muted headless Chromium off every screen, the page served, the Nest a port that is not there, every reading handed in through
  the seam, pictures at each moment: no purse (nothing drawn), the tank at rest (the balance, no number), a call drinks (the number, the sparks, the
  sip, the level falling, the pulse), a sale falls, at rest again (0 draws). **7 of 7** here.

## What is not done

- **The live Nest.** Here no Nest answers; the page's road is the one the hero and the one page take (`${protocol}//${hostname}:8904`, the ref GET
  and `/nest/stream?types=ref&refs=`). The house proves the first real call rising on the glass. The Nest's CORS echo (doors.rs) lets a page on
  aiolos's door read it, as `one.mjs` does.
- **The sip's life** is measured now (full 3,600 ms, lean 5,000 ms, through the readback), as the drops' are in both qualities (`LIFE_MS`).
- **lysa's chip** is not measured; NewMac's GPU numbers for the changed page are owed (`syrup-glass.bench.mjs`).
- **The hero's liquor** is the local agent's port (his Oct 16 word); the page's header says what the port needs: no wave, mask or energy pass on
  the hero, the glass pass alone, `?dispersion=0` where the fringe is not worth a third of it, an analytic meniscus. `irradiance.js` is untouched
  by this lane.
- **Her unit0 on the one page** (`lyssajudron-purse.mjs`, `fuel-fluid.mjs`) is untouched: this lane puts the MMO tank on the glass he pointed at.

## Benching it on lysa and on a cheap phone (Oct 16 2026, his "consider this will have to run on very cheap phones and all... can you start benchmarking it on lysa")

lysa (192.168.8.106, a 2019 laptop chip, Chrome 151) and the phones are on his LAN, out of a cloud seat's reach: no Nest, no ssh, no glass. What
this lane did is make the bench run there in one command from the Mac, or from one URL on the glass itself, and make the page cheap enough first.

**Two qualities** (`syrup-glass.html` QUALITY). `full` is the look as benched on the Macs. `lean` is the same look for a cheap glass: the sphere
map at a quarter of the texels (512 x 256) stepped at 120 Hz instead of 240 (the wave's speed per texel and step is unchanged, so a ripple crosses
the pouch at the same speed; its life in milliseconds is measured for each quality: lean gold 7,983, bronze 5,583, a sip 5,000, against full
5,183, 3,783 and 3,600, `LIFE_MS`), the backdrop read once a pixel in the glass pass
(no chromatic fringe), the canvas at one device pixel per css pixel. `?quality=lean|full` says; `auto` (the default outside a bench) takes lean on
a coarse pointer (a phone, a tablet) or four cores or fewer. A bench (`?bench=1`) is full unless told.

**Measured here** (no GPU: SwiftShader on 4 cores, so the numbers are the shaders' work on a CPU; only the ratio travels), the page's own bench at
1280 x 720, 240 frames alive with a drop every 24 and a gold every 96:

| quality | alive frame, median | p95 | each pass alone: energy, mask, frame | at rest, 120 frames |
|---|---|---|---|---|
| full | 183.3 ms | 233.3 ms | 74.9 ms, 150 µs, 20 µs | 0 draws |
| lean | **66.7 ms** | 83.4 ms | 21.5 ms, 43 µs, 10 µs | 0 draws |

(The Mac's bench harness over CDP, before this lane, read 333 ms median for full at the same size: a different harness, one Chrome and one tab
more; the two rows above are the same harness, the page's own.)

**On lysa, from the Mac** (the glass lane's road, `embertide-app/ui/glass/LANDING.md`; the gate refuses while lysa is loaded, low on memory or
deep in swap):

    embertide-app/ui/glass/tools/remote-chrome.sh lysa@192.168.8.106 150 --use-angle=gl-egl &        # a headless Chrome on lysa's GPU, DevTools at this Mac's 19333
    tools/serve-range/serve -p 8986 -b 192.168.8.164 -t 600 -q embertide-app/ui &                     # the page where lysa can fetch it (this Mac's LAN address)
    node embertide-app/ui/intro/dyson-society/lab/syrup-glass.bench.mjs --cdp http://127.0.0.1:19333 \
      --url http://192.168.8.164:8986/intro/dyson-society/lab/syrup-glass.html --sizes 1920x1080,1280x720 --out /tmp/syrup-lysa
    node ... --query quality=lean --out /tmp/syrup-lysa-lean                                          # the same, lean

`--cdp` attaches the bench to that Chrome and opens only the tab it needs (the kiosk is not touched); `--url` names the page; everything else
(the pictures, 240 frames alive, 240 at rest, each pass alone, the GPU timer when Chrome exposes it) is as on the Mac. Without `--use-angle=gl-egl`
a headless Chrome on Linux draws in software and says nothing about the glass.

**On a phone, or on lysa's own screen**: open the page with `?bench=auto` (and `&quality=lean` or `full`; the default is auto). The page benches
itself as the Mac's bench does and says the receipt on its panel, in its title (a picture of the glass carries it: `node
tools/embertide-mesh/glass-proof.mjs` or the glass's own shot word) and on the console (`syrup-bench {...}`); `window.__syrup.receipt` holds it;
`?report=<url>` posts it there by sendBeacon. The tank is off in a bench unless `?tank=1`.

**The budget to design to** (his hedonic reward, ANNEALED.md): the frame time on lysa and on the cheapest phone he holds, measured where he
stands. The numbers above are not those; they say lean is 2.7 times less shader work than full for the same look at rest (the energy pass alone,
never run now, was 3.5 times), and that the page at rest costs nothing on either.

## The wishes it touches

- *The one anamorphic thing on every glass*, partly: the purse's numbers now fly on the lab's glass pouch too, from the same two refs, by the same
  rule (once by id, from the row's own time), at no cost at rest.
- *Dyson Society mint page and $WARM mint*, not: a sale on `mint/drops` falls into this pouch as it falls into her fuel; the writer of
  `mint/drops` from the premint's sales is still owed (lane/fuel-fluid-land's note stands).
