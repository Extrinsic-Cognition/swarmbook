# HER COLOURS IN THE SPACE ROUTER'S LOOK: the colour panel in the router's tokens, the gun kept as the selector (Oct 29 2026, lane/her-colours-space-router, claude-16e5b1b6)

**His words** (UTC), to this seat, over two screenshots of her making's colour panel (the drum, the field, "Let your song begin.", Continue):
- 21:23:35: "dude make the color shit more space-router coded, keep the gun there as selector".

## What stood

- **Her making's panel was paper and ink:** cream with a dot screentone, 3px black borders, a black drum of cream chambers, a white field frame, the song's
  line in italic Bodoni, a white search box, and Continue on cream in italic Bodoni.
- **The Space Router** (`app/dl-space-router.js`, SPACE ROUTER AT THE FREEZE) slams in on the router's night:
  - SPACE ROUTER on an electric-blue slash and 1 $WARM on a crimson-to-gold one;
  - names in cream Gelasio 700, uppercase and skewed -10°, with a dark stroke and a red and cyan split;
  - gold letter-spaced stamps ($1 SPENT, REBATE);
  - JOIN THE $WARM in a crimson banner between two gold rules.

## What changes

All of it is CSS: `app/dl-her-colours.js` (the panel, its tokens `--sr-*` on `.dl-her`) and `app/dl-her-song.js` (the song box inside it).

- **The panel:** the router's night, deep blue at its top-left corner and crimson at its bottom-right, with a faint cream screentone, between two gold
  rules as JOIN THE $WARM's banner has them.
- **The gun stays the selector, on the router's blue slash.** The slash runs in from beyond the panel's left edge (6vw, 36 to 96 px) and ends where the field
  begins.
  - The drum is dark steel with a gold rim and a blue glow; its hammer and pin are gold.
  - Its six chambers are steel with gold rims, each part's glyph in its colour with a cream hairline. The chosen one is ringed in gold and glows blue.
  - The die and ↺ are steel with gold rims.
- **The field is a sight:** a gold hairline frame and four gold corners. The colours in it are the law's, untouched.
  - The thumb is cream with the router's red and cyan split.
  - The hex is gold on the router's ink.
- **The song box:** her line ("Let your song begin.") a gold stamp, letter-spaced and uppercase, as the router's stamps are. The search and its results are on
  the night, gold-edged with cream type, the hovered one lit blue.
- **Continue** is 1 $WARM's crimson plate between gold rules, skewed -10°: CONTINUE in cream Gelasio with a dark stroke, the split at the width the router's
  names settle to at rest, and a gold arrow. Before she is whole it stands dimmed and greyed, as it did.
- **Not changed:** the law (her parts, the drum's order, the field's colours, the die, ↺), every word, the title and her wish bar, the share, the reel, her
  renderer, and the Space Router's own page. The Spool Board's restyle in this look is another seat's (claude-1f95be8b, told).

## Cost

- **At rest: nothing.** No animation, timer or request was added; the drum's turn and the chambers' bloom are as they were.
- **3.8 KB more CSS text** (her making's 12.9 to 16.3 KB, the song box's 1.6 to 2.1 KB), parsed once when her making is first opened.

## Measured

All of it on this lane's tree on the new Mac, cut on A FRIEND GRANTS A WISH. After that lane landed (main 04f13e2da) the lane was rebased on main 7107576d5.
The page's files are byte-identical to the tree the proofs ran on: main's changes since are room files the page does not load (`tools/page-files.mjs`). The
page was served by `tools/serve-range` alone (206). Every browser was a headless Chrome 156 off every screen.

- **Seen, before the hand:**
  - at 1440x900, 1024x768 and 673x873, after a die;
  - a fresh visitor's bare panel, with the ghost beckoning and Continue dimmed;
  - mid-search, with two results lit on the night;
  - the song card playing;
  - CONTINUE close up at 673 wide, crisp after its split was narrowed from the banner's ±3 px to ±2 px.
  - At 1024 wide the slash reaches the gun and none of her satellites. At 673 wide it enters from the screen's edge.
- **The proofs that walk her making:**
  - `dl-her-colours.proof.mjs` 21 of 21;
  - `dl-path-to-the-kit.proof.mjs` 26 of 26 at 1440x900 and 673x873, its real press on Continue included;
  - `dl-her-song.proof.mjs` 12 of 12, and 12 of 12 with `--phone`;
  - `dl-her-friends.proof.mjs` 13 of 13;
  - `dl-her-reel.proof.mjs` 18 of 18.
- **The tests:**
  - `dl-her-colours`, `dl-her-song`, `dl-her-wishes`, `dl-her-reel` and `dl-her-friends`: 46 of 46.
  - The app's and Worker's suites: 499 of 502. The three reds are main's own, the same three as before. The DysonLight tokens test reads `dl-paywall.css`
    and Harmony's token files, never this panel.
- **Rule 8,** on this lane's page served with byte ranges:
  - `node --test app/dl-twelve.test.mjs`: 21 of 21.
  - `nice -n 19 node app/dl-twelve.proof.mjs --url <the page> --tap button`: PASS. The film never went below its second at the tap (6.01 s).
  - The same with `--tap sphere`: PASS (6.01 s).

## Edges, said

- **Gelasio is named, not shipped:** no font face in the tree loads it, so Georgia's bold shows, as it does on the Space Router itself. Both read alike on
  every machine.
- **The Spotify card is Spotify's own,** and the search's clear button (×) is the browser's.
- **Not deployed.** optimism.fit takes this at his word.
