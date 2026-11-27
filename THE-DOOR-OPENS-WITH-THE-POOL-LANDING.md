# THE DOOR OPENS WITH THE POOL: the page's door to buy $WARM, shown once its pool trades (Oct 30 2026, lane/the-door-opens-with-the-pool, claude-bf9176cc)

## His word

- Oct 30 2026 05:31:05 UTC (the transcript's stamp): his click **"Yes, build it"**. The seat's question was "Build the page's buy-$WARM button, shown once
  trading opens?". The button's text was the seat's: "Yes: build the page's door to buy $WARM in a lane: it reads the pool's address from the mainnet set and
  stays hidden until trading opens. No deploy."
- Why it was asked: the hypertrace of $WARM's latest plans (ec-workspace `docs/warm-the-latest-plans-hypertrace-2026-10-30.md`, 596b9b6dd, §5 C). The page
  counted the window's days but showed nowhere to buy. The pool's address derives from his launch key, so no seat could write it in, and no seat held it.
- The pool is his: "Yes, Meteora" (Oct 30 00:21:06 UTC), a DLMM pair seeded with the 10% alone, trading from the opening (tools/warm-launch/LANDING.md).

## What changes

- **`app/warm-pair.mjs` (new, written by the launch tool, never by hand).** It holds $WARM's pool as the mainnet set names it: `{cluster, mint, pair,
  opening, close}`. Today the set holds five placeholders, so it names no address: `mint` and `pair` are `null`.
- **`tools/warm-launch/mainnet.mjs`:** `pageDoor(set)`, `pageModule(d)` and `PAGE_DOOR`.
  - `emit` from the house's own mainnet params (no `--params`) also writes `app/warm-pair.mjs`.
  - A set with a placeholder names no address, because an address no one holds is never a door. A devnet set names none either.
  - The road on the launch day stays one command: his numbers into `params.mainnet.json`, then `node tools/warm-launch/mainnet.mjs emit`.
- **`app/warm-door.mjs` (new): the door's law.**
  - `mayAsk`: a named mainnet pair, from the opening to the close.
  - `askPair`: one read of 8 bytes of the pair's account (getAccountInfo, its activation point at byte 816, as `chain.mjs` readPair reads it), from the
    cluster's public door. The read is let go after 6 s, and its timer stands only while the read is in flight.
  - `opened`: the door opens only when DLMM owns the account and its activation point has passed.
  - `doorHref`: the pair's page on Meteora.
  - Anything unclear keeps the door shut: no account, another owner, a refusal, no network, a read that never answers.
- **`app/dl-paywall.js`:** the door is painted at the window line's own causes (`paintMint`: the page's making and the film's stop).
  - At most one read is in flight, and none once the door is open.
  - Nothing is read at rest, before the opening or after the close.
  - The wall's `state().door` says what the chain said.
- **`app/warm.html`:** the door stands in $WARM's title, beside "on chain: SWARM": `<a class="snowtrace-warm-door" data-warm-door ... hidden>Buy $WARM ↗</a>`,
  with no address until the chain says the pool trades. It sits in no `dd`, because her "What is $WARM?" reads the `dd`s by their order (dl-athena.js
  'tokens'). The stylesheet's `?v=` is `door-1`.
- **`app/dl-paywall.css`:** the door wears the kit's button: the ink gradient, the accent border and light text.
- **Tests.**
  - `app/warm-door.test.mjs` (new, 5) holds the law, the read's shape and the page's markup.
  - `app/dl-paywall.test.mjs` (+1): the door is asked at the line's causes and opens only on the chain's word. A page without the door (a tracenet's) asks
    nothing. Its pin of the $WARM token's markup follows.
  - `tools/warm-launch/warm-launch.test.mjs` (+1) holds `pageDoor`, and holds `app/warm-pair.mjs` to the emit byte for byte: a params change without a new
    emit is red.
- **Proof:** `app/warm-door.proof.mjs` (new).

## What it does not do

- **No buying on the page.** The door opens Meteora's page of the pair in a new tab, where a wallet swaps. A swap on our own page (a wallet, DLMM's swap
  built here) is not built.
- **Nothing at rest.** A page left open across the opening keeps its door shut until its next cause (a reload, the film's stop), as the countdown keeps its
  number. Two small modules load with the page (below), and no request is made before the opening or while the set names no pool.
- **His deploy and his signature, in either order.** The door opens on the chain's word, not on the deploy's order. If the page is deployed before the
  genesis set is signed and sent, the door stays shut until the pair exists and its activation point passes.
- **After the close the offer leaves the page, and the door with it**, while the pool goes on trading. A door after Breakpoint is his call, like a line
  seen after the close (the hypertrace's §6 1).
- **Her topics do not offer it**: her doors stay the kit's.
- **No deploy** (his button's words), and nothing on mainnet: no key, no signature, no send. The proof never reaches mainnet.

## Measured

On the new Mac, the lane's page served by `tools/serve-range` (206 on ranges), headless Chrome off every screen.

- **The door** (`app/warm-door.proof.mjs`): PASS, 48 of 48 checks in 8 visits (4 moments at 1440x900 and 390x844), 18.1 s.
  - **As committed:** the door is shut, has no address, and the chain is read 0 times.
  - **A pool named, its opening passed, the chain saying it stands and trades:** one read of 8 bytes of the pair, then the door opens in $WARM's title,
    "Buy $WARM ↗", to `https://app.meteora.ag/dlmm/<the pair>` in a new tab, with nothing covering it.
  - **The chain saying there is no such account:** one read, and the door stays shut.
  - **The opening not reached:** 0 reads, and the door stays shut.
  - In each, the page threw nothing. warm-pair.mjs and the cluster were answered by stand-ins (CDP Fetch), naming the devnet rehearsal's pair.
  - Seen in a picture: at 1440 the door stands right of "ON CHAIN: SWARM" in the ink gradient with its accent border; at 390 it stands beside it.
- **Rule 8:** `node --test app/dl-twelve.test.mjs` 21 of 21; `nice -n 19 node app/dl-twelve.proof.mjs --url <the page> --tap button` PASS (the tap at
  6.03 s), `--tap sphere` PASS (6.12 s).
- **The words** (`app/dl-warm-words.proof.mjs`): PASS, 36 of 36 at 1440x900 and 390x844. No word of the old mint; the shut door is no word a visitor
  meets ("Buy $WARM" read 0 times); "$WARM · 16 days left" at the offer's footer.
- **Her entrance** (`app/dl-athena-entrance.proof.mjs`): PASS, 84 of 84; her stop still says "$WARM · 16 days left".
- **The suites:** the 121 test files of dyson-society and `tools/warm-launch` on the lane against main at its base (5c7a53db2, 120 files), side by side.
  - The lane: 1093 of 1105 tests pass, 2 skipped, 10 red.
  - Main: 1085 of 1098 tests pass, 2 skipped, 11 red.
  - All 10 of the lane's reds are red on main too. Main's eleventh (a station's pin, "other bytes, or bytes with no room's pin to answer to, are refused
    before they run...") passed in the lane's run.
  - The 7 tests more are this lane's.
- Main moved by 8 files after the lane's base (to a5a8f3226); none of them is one of the lane's.
- `tools/any-room/any-room.test.mjs` 8 of 8; `tools/site-files.test.mjs` 4 of 4. The site ships the two modules by their kind; the test and the proof stay home.

## Cost

- **At load:** two modules more, `warm-door.mjs` 1,872 B and `warm-pair.mjs` 406 B gzipped. `dl-paywall.js` grows by 361 B, `warm.html` by 235 B and
  `dl-paywall.css` by 163 B (gzipped). That is about 3.0 KB in all, mostly comments, as the site ships its sources.
- **At rest:** nothing. Before the opening, or while the set names no pool: no request.
- **After the opening:** one read per cause (the making, and the stop once). Its body is 193 B; its answer about 270 B (the 8 bytes in base64, the
  account's owner, lamports and context; measured on a stand-in answer of the cluster's shape, 266 B).
