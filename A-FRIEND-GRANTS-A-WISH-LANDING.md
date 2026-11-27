# A FRIEND GRANTS A WISH: every visitor's link carries her code, and each friend whose Swarmy is born grants the sharer a wish (Oct 29 2026, lane/a-friend-grants-a-wish, claude-16e5b1b6)

**His words** (UTC), to this seat:
- 18:33:04, over her making at 4/12: "how do we go from this to something that can go viral my dude? like socially shared... we have the chance to kickstart
  some cool shit here with $WARM rebates for users and $POOL for long term stakers..." The design that answered it had a step 4: "a friend's Swarmy born gives
  the sharer a wish (a Worker row: his word)". HER REEL built its steps 2 and 3 and landed as main a865af327 (19:54:37Z).
- 20:28:11, to "Build the referral next, a wish to the sharer for each friend whose Swarmy is born?": "Yes, build it".

**His lineage:** Sept 18 15:31 "why the fuck dont we make referral codes or invte codes"; Oct 16 07:3x "IT IS ALL ABOUT DECOMP AND SHARE AND INVITE GAMES MY
DUDE OMG"; Oct 17 03:19 "nefertiit comes and offers 3 wishes (aka: trial for 3 ai calls before quitting)"; Oct 29 17:31 "starting with 3 pentagons, using all 3
wishes and then unlocking a 4th pentagon and getting 4 wishes now and so on".

## What stood (main 269b7000e)

- **Her reel is shared at the ドン** (HER REEL). Its link, `#her=`, carries her paint, her rung and her song, never a person, and a friend who opens it lands on
  the sharer's her until their first stroke.
- **The mint's one referral loop** (`REFERRALS.md`) gives a code to a paid seat only, `?ref=` with 8 letters, frozen on an order at the checkout: "the free way
  has no code". A free visitor's link brought nothing back to them.
- **His ladder** (`dl-her-wishes.mjs`): a rung of n pentagons holds n wishes; when all n are spent the next pentagon comes in her slam. On the mint a fired
  chamber spends one.

## What changes

- **Her code** (`app/dl-her-friends.mjs`, the law, pure): 10 letters of the Society's alphabet (Crockford's base32, `dl-society-codes.mjs`), drawn in the
  visitor's browser at their first press of her reel's share. It is every visitor's, free.
  - A length no other code of the Society has (a seat's is 8, a claim's 12), so neither is ever read as the other.
  - It rides the link to her as its last field (`dl-her-reel.mjs` herLink): `#her=1.<light>.<five parts>.<painted>.<eyes' form>.<spent>.<song>.<her code>`.
    A link made before it, with no code, reads as it did.
  - It never rides `?ref=`: a code there that is no paid seat's refuses the order at the checkout.
- **A friend's birth.** The friend who opens the link and makes her their own (the visit ends at their first stroke) keeps the sharer's code as their ref, in
  their browser. The latest link wins, as a paid seat's code does. None is kept when their own her was born before the link, when their birth is already told,
  or when the code is their own.
  - When her eyes open (all six chambers fired: her birth, the climax of Harmony's film of it), their browser tells the site once: `POST /api/her/born
    {ref, code}`, with their own her code, drawn then if they have none. It is the code they will share her with.
  - A word that fails (the Worker away, the database behind) is said again at the next open of her making, once an open. A 400 is never said again.
- **The wish it grants.** At each open of her making the sharer's browser asks how many friends were born from its code (`GET /api/her/friends?code=`) and
  spends a wish of theirs for each one not granted yet, as a fired chamber spends one. The bar moves; a slot whose wish went pops; a rung's last brings the next
  pentagon in her slam, on her renderer too. A wish granted is a wish used, in the genie's lore and on his ladder, where using her wishes is what brings the
  next pentagon.
  - The share carries the count of friends born: a gold number on its corner, no word ("Her reel. Friends: n" for the reader).
  - Kept in the browser beside her wishes (`dl.her.friends`): her code, the ref until her birth is told, whether it was, the friends granted. Never on the Nest.
- **The site's two doors** (`worker/her.mjs`, on optimism.fit's own Worker beside the song's; `/api/her/*` runs on it first):
  - `GET /api/her/friends?code=<her code>` answers `{code, born}`: one indexed count, read at its ask, never cached.
  - `POST /api/her/born {ref, code}` takes a birth from the site's own page only (its origin, JSON, at most 256 bytes). It keeps one birth a code, the first
    one counted, and refuses a code as its own ref.
  - One address asks at most 30 times a minute (held by the isolate, as the song's door). A database behind the migration answers 503.
- **Migration `0009_her_births.sql`:** `her_births(code PRIMARY KEY, ref, born_at)` and its index on `ref`. A row a birth: two codes a browser drew and the
  second it was told. No address, no wallet, no name.
- **Not changed:** her renderer (`room/lyssajudron.mjs`), her refs, his ladder's law, the reel, the paid seats' codes and checkout, `warm-entry.mjs`,
  `dl-athena.js`, `warm-galaxy-player.js`.

## Foundation 9

Read before this door: `docs/lituus-to-the-rooms-isa-hypertrace-2026-10-14.md` ("The wire is swarmclock over iroh: every process an endpoint... The 36 HTTP
doors and the six tunnels retire into it, one door at a time") and `docs/morpho-field-and-the-sleeping-engine-hypertrace-2026-10-14.md`. That law holds the
house's own processes: its daemons and its glasses. These two doors are on the public site's Worker, where a stranger's browser has only the site, beside the
song's door and the referral's. They carry no room and no person, and nothing of the house's wire moves.

## Cost

- **At rest: nothing.**
- **On the wire at page load:** one module more, `dl-her-friends.mjs` (6.0 KB). The Society's codes it reads (`dl-society-codes.mjs`) were already loaded by
  `warm-entry.mjs`.
- **A sharer:** one ask at an open of her making, for a browser that has shared her; its answer is about 40 bytes. On the Worker, one indexed count in D1.
- **A friend:** one word of 40 bytes, once, at her birth. On the Worker, one row of about 40 bytes.
- **The browser:** one write of about 90 bytes at each change of `dl.her.friends`.
- **The Worker's bundle:** `worker/her.mjs` (4.8 KB) and the law, whose Society codes the bundle already held.

## Measured

All of it on this lane's tree on the new Mac, cut from main 269b7000e, and all of it again after the rebase on main 4f0a8473f (18 landings, among them THE
TOKENS IN HIS WORDS on `warm.html`), with the same verdicts: the suites, every proof below and rule 8. The page was served by `tools/serve-range` alone (206), as
the lander's gate serves it. Every browser was a headless Chrome 156 off every screen.

- **Seen, before the hand.** The sharer back after a friend's birth at 1440x900 and 673x873: the bar at 5/12 with the fifth pentagon's five wishes, her five
  unit1s with their pentagons, the gold 1 on the share's corner, clear of the bar.
- **The friends' proof** (`app/dl-her-friends.proof.mjs`, new): 13 of 13 at 1440x900 and 13 of 13 at 673x873. One Chrome holds two browsers of its own, the
  sharer's and the friend's (two contexts: nothing of one in the other). The site's doors are the Worker's own code (`worker/her.mjs`) on a database every
  migration built (`node:sqlite`, as D1 applies them), answering the browsers' own requests.
  - The sharer: on `?her` the die brings the fourth pentagon and the share; its press films her reel; the link in its words carries her code, drawn at the
    press and kept; nothing has asked the doors.
  - The friend: the link opens her making on the sharer's her, the sharer's code with it; the first real press keeps it as their ref, and nothing is told while
    her eyes are shut.
  - The die opens her eyes: one `POST /api/her/born` from the page's own origin, `{ref: the sharer's, code: the friend's own new one}`, answered
    `{counted: true}`; one row. Told 216 ms after the press at 1440x900, 215 ms at 673x873, 223 ms after the rebase.
  - ↺ and a press open her eyes again: nothing more told.
  - The sharer back, in their own browser: one `GET /api/her/friends?code=`, `{born: 1}`, and the wish granted, the fourth rung's last: the fifth pentagon comes
    in her slam (5/12, her renderer drawing five), the share carrying 1 ("Her reel. Friends: 1"), kept `seen: 1` and seven wishes spent. Granted 441 ms after
    the page began to load at 1440x900, 323 ms at 673x873, 273 ms after the rebase.
  - A reload: one more ask, nothing granted twice.
  - No error on any page, and none in any console.
- **The reel's proof** (`app/dl-her-reel.proof.mjs`): 18 of 18. Its link now carries her code, and the friend keeps it as their ref beside `dl.her` and
  `dl.her.wishes`.
- **The tests** (`node --test`):
  - `dl-her-friends.test.mjs` 5 of 5, new: her code (alphabet, length, a byte a letter, the canonical form alone); kept and read back, anything broken none;
    a friend's arrival (the latest link wins; never their own code, never after their birth or its telling); her birth told once; the wishes granted.
  - `dl-her-reel.test.mjs` 11 of 11. One is new: the code as the link's last field, read back; a link without one as before; a last field that is no her
    code is no link.
  - `dl-her-colours.test.mjs` 15 of 15. Two are new:
    - the friend: the code kept at the first stroke; her eyes open, one word with their new code; never twice; a 503 said again at the next open, once an
      open; none from a her born before or from their own link;
    - the sharer: the code drawn at the press into the reel's link; one ask an open; two friends grant two wishes and the fifth pentagon's slam, the share
      carrying 2; nothing twice; a third friend one wish within the rung; the Worker away, nothing granted and the count as last seen; asked again, granted.
  - `worker/her.test.mjs` 4 of 4, new, through the Worker's own handler on every migration: births counted once a code, the count read; every refusal (another
    site, no origin, not JSON, too long, no codes, her own link, the wrong method, no such door); 503 behind the migration or with no database; thirty asks a
    minute an address.
  - `dl-her-wishes.test.mjs` 6 of 6; `dl-her-song.test.mjs` 9 of 9.
  - The Worker's suites: 74 of 74 (her, premint, ranges, tracenet-vault, creators, bronze, gold, song, the payee).
- **The suites,** `node --test` over the app's and the Worker's files: 499 of 502. The three reds are main's own, the same three as before this lane, in files it
  does not touch: dl-athena's THE DEPTH, warm-sphere-moment's "her cut", dl-paywall's Harmony ice and accent tokens.
- **The other proofs that walk her making:** `dl-her-colours.proof.mjs` 21 of 21; `dl-path-to-the-kit.proof.mjs` 26 of 26 at 1440x900 and 673x873;
  `dl-her-song.proof.mjs` 12 of 12, and 12 of 12 with `--phone`.
- **The site's build** (`tools/page-files.mjs` pageFiles) reaches `dl-her-friends.mjs`.
- **Rule 8,** on this lane's page served with byte ranges:
  - `node --test app/dl-twelve.test.mjs`: 21 of 21.
  - `nice -n 19 node app/dl-twelve.proof.mjs --url <the page> --tap button`: PASS. The film never went below its second at the tap (6.10 s; 6.00 s after the
    rebase).
  - The same with `--tap sphere`: PASS (6.02 s; 6.03 s after the rebase).

## His, before it reaches a visitor

- **The migration and the deploy.** Apply `0009_her_births.sql` before the deploy that carries the doors: `npx wrangler d1 migrations apply
  optimism-fit-premint --remote --config wrangler.optimism-fit.jsonc` (0005 to 0008 wait there too), then `node tools/build-optimism-fit.mjs` and `npx wrangler
  deploy --config wrangler.optimism-fit.jsonc`. A page ahead of its Worker, or a Worker ahead of its database, grants nothing and loses nothing: the page asks
  again at the next open.

## Edges, said

- **A birth is a browser's word.** A hand can make friends of itself: a cleared browser, a second browser, its own link in a private window. The reward is a
  wish on her bar, so it costs nobody but the bar. The day a $WARM rebate rides a birth, a birth needs more proof than that (a wallet, a paid seat): his call.
- **One birth a browser.** A friend who clears their browser is a new friend to the Worker.
- **A wish granted is a wish spent:** the bar moves the way a fired chamber moves it. When the Space Router's door spends wishes as AI calls, what a granted
  wish is there is his to say.
- **The count is read at the open**, not pushed: a friend born while the sharer's making is open is granted at the next open.
- **Not here:** $POOL stakers' gift links of wishes (the stake pool and the Space Router's door first: their seats'); a $WARM rebate share for the one who
  brought a friend (his call; none is authorized, `REFERRALS.md`); a picture of her per link on X (an HTTP door that renders: his ruling).
- **Not deployed.** optimism.fit takes this at his word.
