# THE RIDER CROSSES TO SWARMBOOK: Swarmbook's stop 7 (lane/the-rider-crosses-to-swarmbook, Nov 24 2026)

## His words (UTC)

- Nov 24 2026 ~15:4x: "Build stop 7" (stop 7 of the stranger's road, ec-workspace
  `docs/swarmbook-is-the-new-poleis-us-and-the-claw-riders-hypertrace-2026-11-10.md` 25.4: "the rider's identity goes up to Swarmbook").
- Nov 22 2026 12:1x: "the identity is what is later uploaded into swarmbook... it is a shadow because the flask of the user is not registered into
  swarmbook claw riders yet".
- Nov 23 2026 11:30: "if a pentagon is a single signer, it is a person: in our default choices it is either nefertiti, dante, newly created pfp...
  lyssajudrons are hexagons, necromancers are pentagons".

## What was so (main b23cf2883b)

The choice in Harmony's opening ("who do you want to be": `embertide-scene/src/opening.rs` `who`, kept by `embertide-traces` as `character/warden`) never
left the person's house. On Swarmbook a pentagon one key holds always wore Nefertiti (`app/tree.js`, `personOf(NECROMANCER)`), and `?riders=` said a key
only once it had a minted, painted hexagon.

## What is so

1. **The Worker** (`worker/space-router-grant.mjs`, migration `0034_the_rider_says_its_person.sql`). `POST /space-router/v1/person {"person": <sha256>}`
   under a Harmony's own Space Router key. The key must be one a flask let spend (`sr_grants`, live, not ended): the flask signed that grant
   (A FLASK LETS ITS HARMONY SPEND), so the word is the flask's by the key it let in. Only a face the house carries is taken (`app/riders.mjs` `PERSONS`,
   the sha256 of its bytes, the file a page draws it from: today Nefertiti alone). It is kept on the person, the flask's tank (`sr_persons`, one row a
   tank), so every browser their X holds says the same. 201 `{person}` kept or changed; 200 the same again, nothing written; 401 no live key a flask let
   in; 400 not a face the house carries; 405; 429; 503.
2. **`?riders=`** (`worker/space-router-portrait.mjs`) says `person` for every key whose person chose, minted or not, beside its face; the key's person
   is the tank its X holds, else its own. A database behind 0034 answers the faces alone, as before.
3. **Harmony** (`embertide-traces/src/rider.rs`, `companion.rs`, `bin/traces-companion.rs`). Once the character is kept, its face crosses if the house
   carries it. One `/usr/bin/curl` sends it under `SPACE_ROUTER_TANK_KEY` (the environment, else `~/.embertide/keys.env`). The key rides curl's stdin,
   never an argv. Two causes send it: the keep, and the writer's start while what stands has not crossed. It is never sent on a timer and never retried
   in a loop. A refusal is said once, on the writer's own line, and marks nothing. An unchanged choice says nothing (the `crossed` file beside the cache).
   With no key, nothing crosses and nothing is said. A face from the person's own folder, or one their agent drew, never leaves the machine.
4. **The site** (`app/tree.js`, `app/riders.mjs`). A pentagon's key is asked with the hexagons' keys, once a registry. A pentagon one key holds wears the
   face its person chose, else Nefertiti, never blank. Hexagons are untouched: each still wears its rider's Lyssajudron, else her default.

## Why this road (SEAT)

The grant is the one place the Worker already knows which flask let which Harmony key in. Two other roads were read and not taken:
- **X** (`space-router-x.mjs`) names a browser, not a Harmony.
- **A seat proof** (`verifySeatProof`) needs the flask's own key. That key never leaves the browser, and Harmony does not hold it.

The record says "signed by the flask's key". Here the flask's signature is the grant's own text, kept in `sr_grants.signature`. The Harmony proves its key
by holding it, as every spend does. No second signing road was added.

## Cost

| | before | predicted | measured |
|---|---|---|---|
| a person's word, Harmony to the Worker | none | 1 HTTPS POST, 77 bytes of body, one curl spawn | 77 bytes; two real curls to a loopback door inside the 0.16 s of `the_rider_crosses.rs` |
| the word at the Worker | none | 1 D1 read and 1 write; 0 writes when unchanged | 0.33 ms a first word, 0.14 ms the same again (100 of each, d1-on-sqlite, new Mac at load ~200) |
| `?riders=` (100 keys) | 1 D1 read | 2 reads side by side, 100 sha256s of a key | 2.3 ms for 100 keys, all said, 12,505 bytes |
| at rest, the writer and the site | 0 | 0 | 0: no timer, no loop (pinned by the tests) |
| JavaScript | | net 0 or less | +59 −247, net −188: `warm-flask.mjs` and its test leave the tree (SEAT: no page has loaded the tickets' flask law since YOUR PRESENCE IN THE MMO; its journey line went with it) |

Live before the deploy: `GET swarmbook.com/space-router/v1/portrait?riders=<a box key>` answered `{"riders":{}}` (13 B) in 0.17 to 0.22 s, and
`/space-router/v1/person` answered 404.

## Proofs

- `cargo test --locked` in embertide-traces: 148 of 148. `tests/the_rider_crosses.rs` (new) is 4 of 4:
  - a kept house face crosses once;
  - the same face again, and two starts, say nothing;
  - their own folder's face never leaves;
  - a refusal is said once and tried only at the next start;
  - with no key, nothing crosses;
  - the bytes on the wire match (POST, the bearer in a header, a 77-byte body).
- `node --test worker/space-router-grant.test.mjs` (a new test: refusals, the default, a choice crossing, the same choice writing nothing, a changed choice,
  one person over two browsers, an ended key, a database behind 0034), `app/riders.test.mjs` (a new test, and its pin of `tree.js` moved), with
  space-router, -portrait, -x, premint, polis-knock and swarmbook-board: 72 of 72. The riders test pins every PNG of `embertide-traces/avatars` to `PERSONS` by its bytes.
- `tools/journey-walks/walk.test.mjs` 9 of 9. `tools/any-room/any-room.test.mjs` 12 of 12. `the-javascript-only-shrinks` 31 of 31, net −188.
- `no-landing-adds-a-failing-screen` (both shards, on the slot road's Mac): the site 72 cells and Harmony 45 cells judged, 0 new failing, 0 to take out.
- `app/dl-twelve.test.mjs` 21 of 21 (rule 8: no dl-twelve file touched, so the browser proof was not owed).

## What is left, and whose

- **HIS:** deploying the Worker with migration 0034 (apply 0034 first; a Worker without it says the faces alone, as before).
- **HIS:** Harmony's signed image carrying the new `traces-companion` (the lander's road).
- **HIS (open call, Nov 23):** a second face a stranger's copy can carry, such as Dante. To add it, put its PNG in `embertide-traces/avatars`, `include_bytes`
  it beside `avatars::HOUSE` in `rider::carried`, and add it to `PERSONS` with its asset. The riders test reds until all three agree.
- **SEAT, his to strike:**
  - a pick crosses without a press of its own (the keep is the cause);
  - a face of their own folder or drawn by their agent stays home (no picture upload);
  - the writer's start retries once while no grant stands (one POST per Harmony start, answered 401);
  - the person is kept per tank (the person), not per flask.
- **Not seen:** a real grant on the live Worker, and a stranger's Harmony crossing to it.
- **No gate yet.** The measure it waits for: the count of pentagons on Swarmbook whose key's person chose, against the count of `sr_persons`, read at the
  after-work once the Worker is deployed.

## Rule 8 (this lane touches the mint's folder, app/)

`node --test app/dl-twelve.test.mjs`: 21 of 21. On the lane's tree served by `tools/serve-range` (206), `nice -n 19 node app/dl-twelve.proof.mjs --url <served>/intro/dyson-society/app/warm.html --tap button` PASS and `--tap sphere` PASS ("the sound came in where the picture was, and the picture never went back"). Run by claude-1c5e2855, Nov 24 2026 ~16:2x UTC.

## THE RIDER'S COLOURS CROSS (lane/the-riders-colours-cross, cut from bc0b91f150, Nov 24 2026)

**His words.** Nov 22 2026 14:08 UTC: "we should allow everyone to have their own colored face lyssajudron". The record (the swarmbook doc, end of
section 23): "a rider's colours kept by key without a mint, so a rider who coloured her and did not mint wears their own".

**Why this lane.** With `PERSONS` holding only Nefertiti, stop 7 changed nothing a visitor sees.

**What is so.**
- **Harmony.** The word is `{person?, colours?}`. Her six colours come off the person's own Nest: `golem-lyssajudron-paint`'s parts and
  `-light`'s colour, only where a hand coloured her (`painted` not empty, as `room/opening.mjs` `hers` reads it).
  - **When.** At the keep, at the writer's start while not crossed, and at a change of her two refs. There is no timer. `crossed` holds the
    whole word, so the same word says nothing.
  - **Mended here.** Lane 1 wired the word only into `traces-companion`. Harmony's own child is the `embertide-traces` program, so in
    Harmony nothing crossed. Both programs now carry it.
- **Worker.** Migration `0035_the_riders_colours_cross.sql` adds `sr_persons.colours`. The colours are checked by the portrait door's
  `coloursOf`. A word names what it names: colours alone keep the face, and a face alone keeps the colours (a row of colours alone holds
  person `''`). `?riders=` says `colours` for a key with no minted face. A database behind 0035 says the faces alone.
- **Site.** A key with colours and no painting wears her as her own painter draws her from the six colours: `riders.mjs` `drawOf`, which
  is `dl-her-portrait.js` `drawHers`, the drawing the wall and the board already use. No renderer was added.
  - **One staging.** Every key of one ask is drawn in one staging, and the renderer is let go after.
  - **No painter.** The key keeps the default and is asked again with its registry.
  - **`polis.html`.** It maps `three` as `index.html` does; without the map her painter could not stand there.
  - **Pentagons.** A pentagon still wears its person's picture (Nefertiti's pixel sprite). Her painter draws the Lyssajudron, not the
    sprite, so a pentagon's own colours would need a renderer the site does not have.
- **No picture crosses.**

**Cost (the new Mac, d1-on-sqlite, 100 asks each).**
- The word: 196 bytes with both, 77 with the person alone.
- At the Worker: 0.46 ms for a first word, 0.20 ms for the same again.
- `?riders=` for 100 keys: 3.5 ms, 24,410 bytes.
- On a page: her painter stages once for an ask that holds coloured riders. In headless Chrome on SwiftShader (no GPU, the Mac at load
  about 200), two riders were drawn in 32 s, 256 px each, 434 and 450 distinct colours, the two pictures differing. At rest: nothing.

**Proofs.**
- `embertide-traces` `cargo test --locked`: 149 of 149. `the_rider_crosses.rs` 5 of 5, with a new test:
  - bare, nothing crosses;
  - coloured, the colours alone cross;
  - the same again says nothing;
  - their own face adds nothing;
  - the house's face crosses with the colours;
  - her light moved, the word goes again;
  - on the wire, 196 bytes with their quotes intact through curl's config.
- Node tests, 109 of 109: grant, portrait, riders, space-router, x, premint, polis-knock, swarmbook-board, one-name-for-her,
  dl-her-portrait, dl-twelve.
- `any-room` 12 of 12.
- Screens gate, both shards: the site 72 cells and Harmony 45 cells, 0 new failing.
- The real painter on the lane's tree, served by `tools/serve-range`: `drawOf` drew two riders' faces from colours alone, each distinct.
- Rule 8: `node --test app/dl-twelve.test.mjs` 21 of 21. `dl-twelve.proof.mjs` on `warm.html` served by `tools/serve-range` (206):
  `--tap button` PASS, `--tap sphere` PASS.

**Red: the JavaScript only shrinks.** This lane is +35 −24, net **+11**, over main with lane 1 in it. Two Worker tests' flasks now use
`stand-ins.mjs` `wallet` (−2). The other candidates read were not cut: `dl-voices.js` is his sealed talk, kept on purpose; the mint-freeze
files still ship. It needs his pass, or a further cut.

## THE WORKER BUILDS WITHOUT HER PAINTER (Nov 24 2026 ~16:55 UTC, claude-1c5e2855)

His deploy press at 16:55 UTC applied 0035 and then stopped at the Worker's build: `Could not resolve "three"` from `app/dl-her-colours.js`. The cause was
this receipt's second lane: `worker/space-router-grant.mjs` imports `PERSONS` from `app/riders.mjs`, and that lane put her painter's dynamic import
(`drawOf`) in the same file, so the Worker's bundle followed it into her 3D painter. Nothing went live: the live Worker stood as it was, with 0034 and 0035
applied (it reads neither).

The mend: the painter is the caller's. `tree.js` hands `mountRiders` its `draw`; `riders.mjs` imports nothing at run time (its default draws none), and a
test pins that. Measured: the Worker bundled by esbuild 0.17.19 (`worker/main.mjs`, as wrangler's own build) fails on main with the same error and bundles
on this lane, 287,358 bytes. JavaScript +5 -5, net 0. Tests: riders, polis-knock, polis-rite, dl-twelve, space-router-grant, -portrait, -x, premint: 83 of
83, the guard test after: riders 10 of 10. Rule 8: `node --test app/dl-twelve.test.mjs` 21 of 21; on this tree served by `tools/serve-range` (206),
`nice -n 19 node app/dl-twelve.proof.mjs --url <served>/intro/dyson-society/app/warm.html --tap button` PASS and `--tap sphere` PASS.

## THE RIDER SHOWS BY THEIR PRESS (lane/the-rider-shows-by-their-press, cut from main 84c7bb060b, Nov 24 2026)

**His words (UTC).**
- Nov 24 2026 ~17:2x: "Yes, fix both", over the audit of the crossing (`embertide-traces/src/rider.rs`). Its two findings: nothing asks the person,
  and a refused word repeats at every launch.
- The law under it, Oct 15 2026: "0 telemetry policy unless opted-in".

**What was so.**
- Every Harmony with a granted key sent its person's face and colours to Swarmbook at the keep and at every start, with no press of theirs.
- A word the site refused was tried again at each start.

**What is so.**
- **Their press.** One button in the rider panel of the Nucleus (`spool_glass.rs` `rider_chose`): "Show me on Swarmbook". Once shown, its
  undo: "Hide me". It sits beside the manifold's press, in the same row and the same plain style.
  - **Why there.** It is where the person meets their rider after the opening: their face, their name, "Swarm rider".
  - **Not in the opening's choice.** That is asked once and never again.
  - **Not in her chat's head.** Another seat is building that this hour.
  - **Owed.** The panel stands only until someone speaks in the house. After that the press has no place yet; a person who showed and then spoke
    cannot hide from the Nucleus. Where it lives for good is his call.
- **The fact.** The press writes one fact on their own Nest (`spool-strip.mjs`, the glass's own `fact`): `rider/shown`
  `{"schema": "embertide.rider-shown/1", "shown": true|false, "at", "glass"}`.
- **The writer.** `rider.rs` with `companion.rs` cross only while that fact says shown. They follow the fact, so the press is its own cause.
  - **Hide me.** If a word had crossed, one `{"forget": true}` goes up, then nothing more.
  - **Before this law.** A Harmony whose word crossed with no press of theirs says one forget at its next start, so those already up come down.
- **A refusal is said once.** A refused word (any answer but 200 or 201, or none) is kept in `refused`, beside `crossed`. It is kept with the
  sha256 of the key it went under (never the key itself) and the instant of their press. The same word under the same key and press is never
  said again. Another word, another key, or their press again, and it is said.
- **The Worker** (`space-router-grant.mjs`). `{"forget": true}` under a live granted key deletes the tank's row of `sr_persons`, so `?riders=`
  stops saying them. It answers 200 `{forgotten: true}`, and the same again. No migration.

**Cost.**
- The forget is 15 bytes; at the Worker, one D1 read and one delete.
- The press is one Nest write.
- A refused word costs nothing after its one try.
- At rest: nothing.
- The Worker bundle (esbuild, as the deploy builds it): 287,540 bytes (main's, after the mend: 287,358).
- JavaScript: +17 −17, net 0. The new lines are paid with test stand-ins: the card, x, grant and one-name tests now take a flask's key from
  `stand-ins.mjs` `wallet`, one copy where each made its own.

**Proofs.**
- `embertide-traces` `cargo test --locked`: 150 of 150. In `the_rider_crosses.rs`, 6 of 6:
  - nothing goes up before their press, and never-shown says not even a forget;
  - Show me on Swarmbook sends the word once;
  - Hide me sends one forget, then nothing at any cause;
  - shown again, the word again;
  - a word that crossed before this law sends one forget at the next start;
  - a refusal is said once, kept under the key's sha256 (the key is never written), and never again at any start or cause; another key, or
    their press again, gets one try; another word goes through and the record is let go.
- `embertide-scene` `cargo test --locked --no-fail-fast`: 992 of 994 at load 267 to 312. The two reds are the timing walls `game_place`
  `the_door_is_cheap` (2.3 ms against 2) and `room_found` `the_cost_of_a_list`. Run alone they pass, 4 of 4 and 11 of 11: 994 of 994.
  - `opening.rs` 5 of 5: the press reads "Show me on Swarmbook" with no fact, a fact that is not theirs, or shown false; "Hide me" only
    while their fact says shown.
- Node, 75 of 75: grant (the forget lets that person go, and only them; again, the same), x, card, one-name-for-her, portrait, riders,
  premint, space-router.
- The Spool's page tests: 36 of 37. The red is `tools/house-mirror/spool/board/board-page.test.mjs` ("one script", over an importmap). That
  page is not touched here: main's own.
- `any-room` 12 of 12. `the-javascript-only-shrinks` 32 of 32, net 0. `the-look-is-a-law` 2 of 2.
- Screens gate, both shards: Harmony 22 cells, 0 new failing.
- Rule 8 is not owed: the mint's folder (`app/`) is not touched.

## THE RIDER IS A HEXAGON: his correction, and what it struck (lane/the-rider-is-a-hexagon, cut from main 1ced585bda, Nov 24 2026)

**His words (UTC).**
- Nov 24 2026 ~18:1x: "i dont think they should have a saying... the lyssajudron is pretty anonymous... you are misunderstanding hexagons and
  pentagons", then "Yes, fix it" to "Fix it that way: no press, the rider's colours on their hexagon only?".
- The law it stands on:
  - Nov 22 14:33: "principal = pent = capital faucet / agent = hex = executor / swarm rider";
  - Nov 20: "lyssajudrons colored pfps are only hexagons";
  - Nov 23 12:10: "the pents must be the necromancers".

**Why it was wrong.** A Harmony user is a rider, and a rider is a hexagon. Stop 7 read his Nov 22 "identity" as the person's face on a
pentagon. It then added a press to guard that face. Both answered a question his law does not ask: the Lyssajudron is anonymous, and a
pentagon is a principal's.

**Struck.**
- **The person's face.** Harmony sends no `person`. The Worker's `/space-router/v1/person` takes `{colours}` alone (the path kept, the
  cheapest) and refuses `person`, `forget` and anything else with 400. `?riders=` says no `person`.
- **`PERSONS`.** It left `riders.mjs` (nothing else needed it), and with it the Worker's import of `riders.mjs`.
- **Pentagons.** A pentagon a key holds wears `personOf(NECROMANCER)`, Nefertiti, exactly as before stop 7. Its key is no longer asked of
  the house.
- **The press.** "Show me on Swarmbook" and "Hide me" are gone (`spool_glass.rs` and `spool-strip.mjs` back to main before d337490892,
  `opening.rs` with them), and so is the `rider/shown` fact and the gate on it.
- **The forget word.** It went too. No Harmony ever sent a `person`: no published image carried this code, so there is nothing to clean up.

**Kept.**
- Her six colours cross by themselves, on the same causes as before: a change of her two refs, and the writer's start while not crossed.
  Never on a timer.
- The refused-word memory, now under the key's sha256 alone.
- On the site, a key's held hexagon with no minted face wears her in their colours.
- `sr_persons` keeps its rows by tank, with `person` `''` and the colours. No migration.

**Cost.**
- The word is 120 bytes (`{"colours":{...}}`).
- The Worker bundle (esbuild from `dyson-society`, the whole intro tree present): 286,859 bytes. The lane before it: 287,540.
- JavaScript: +41 −56, net **−15**.

**Proofs.**
- `embertide-traces` `cargo test --locked`: 148 of 148. `embertide-scene` `cargo test --locked --no-fail-fast`: 994 of 994.
- `the_rider_crosses.rs`: 4 of 4.
  - Bare: nothing.
  - Coloured: the colours alone, by themselves.
  - The same colours again: nothing.
  - A keep of the house's face or of their own adds nothing.
  - Her light moved: the word again.
  - No word ever carries `person`.
  - A refusal is said once, under the key's sha256, never again under that key. Another key gets one try; another word goes through.
  - With no key: nothing.
  - On the wire: 120 bytes.
- Node, 111 of 111:
  - grant (a `person`, a `forget` or anything beside the colours refused; kept; the same again writes nothing; one rider over two browsers;
    changed colours kept anew; an ended key; a database behind 0034);
  - portrait, x, card, one-name-for-her, premint, space-router;
  - riders (the pentagon pin restored, and its key not asked);
  - polis-knock, polis-rite, swarmbook-board, dl-twelve.
- Rule 8: `node --test app/dl-twelve.test.mjs` 21 of 21. `dl-twelve.proof.mjs` on `warm.html` served by `tools/serve-range` (206):
  `--tap button` PASS, `--tap sphere` PASS.
- Gates: `the-javascript-only-shrinks` 32 of 32 (net −15), `any-room` 12 of 12.
- Screens gate, both shards: the site 72 cells and Harmony 57 cells, 0 new failing.
