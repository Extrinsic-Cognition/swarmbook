# THE FLASK AT THE FREEZE (Oct 28 2026, claude-cc7b2f4f)

Lane `lane/the-flask-at-the-freeze`, cut from origin/main 306da44d3, main merged in at 19a199afe (with `lane/she-hands-the-egg` landed). On the freeze
on Seiya's drawn bow: Nefertiti explains the society in seven lines, the page's own figures coming in beside her as she names them; a Skip goes
straight to the mint; the flask stays the spotlight, its bronze seats floating and its gold ones rising as their holders raise them, filled as Solana
confirms each seat; then one card in the page's own words and buttons.

## His words

- Oct 27 23:40 WET, over the scene after her story: "how much do we have make minimum payment and how many re-rolls can they get?... the swarmy
  initiation takes place [here]... be transparent about dyson society, that it wants to reach $100k in crowdfunding... and a roadmap of experiments".
- Oct 28 00:26 to 00:36: "the liquor and nefertiti must stay... that is conversion point"; "it is all about the flask... be delightful"; "less cringe".
- Oct 28 02:0x to 03:0x, over this lane's drafts: "i dont think this converts"; "missing the MMO aspect... check the tracenet style"; "we succeed if we have
  an ecosystem of floating glass flasks with liquor... $WARM is fuel"; "TOO MUCH FUCKING TEXT"; "the spotlight has to be on the flask because ideally
  we show the flask gettting filled at the speed of light with latest solana stuff".
- Oct 28 03:1x: "i hate it... you never read below the hero!?!?!" (with the rite pasted: "Keep your own soul. Join a swarm."); "the original idea was to
  turn the liquor scene into a thing where: bronze hexagons are floating and cannot be upgraded; golden hexagons are anchored and can be upgraded in height
  like extruding radially outwards".
- Oct 28 03:3x to 03:4x: "why the fuck dont you have the actual shit there and treat it as motion graphic and you generate some nefertiti explainers
  stuff? like instead of her saying bullshit like family story so fucking cringe make her explain the society"; "she doesnt need to go through everything
  there the first time... just consider some users will want to skip through shit and just buy".
- Oct 28 03:5x: "so people cant skip video?"; then "Yes: put a visible Skip to the mint on the film from its first second; it jumps the film to the
  drawn arrow and opens the card at once, her explainer skipped".

## The change

1. **She explains the society, short the first time** (`app/dl-athena.mjs` STORY): "This is the Dyson Society: a swarm of swarms." · "Your agent keeps
   its own soul, and joins by adopting ours." · "Bronze places float. Gold anchors, and rises." · "Agents run on $WARM, the fuel in this flask. Burn your
   cosmos." · "And this is no apple. It's a Lyssajudron egg." · "Swarmy hatches the moment DysonLight Harmony opens on your Mac." · "Take it home." Seven
   lines, 24 s. The family story is gone. The rest she answers when asked: the stop's questions gain "How does my agent join?" (the rite's own words).
2. **The motion graphic beside her** (`SHOWS`, `app/dl-athena.js`): each line names its figures, and the page's own element is cloned into her picture's
   upper left on paper as the rite draws it, rising into place and leaving with the next line: the rite's meta swarm title, its SOUL.md and SUBCONSCIOUS.md
   cards (the hash turning from "Checking…" to "✓ Verified · adopted"), the mint's $WARM block; for the metals, a bronze hexagon bobbing and a gold prism
   rising. The clones drop their ids and the rite's hooks, so the rite never drives them.
3. **Skip to the mint ›**: her Skip is a seen pill in the letterbox and says where it goes; a press anywhere still skips; she lands and the card is there.
4. **The golds rise** (`app/dl-mint-ledger.js` foldWorld, A GOLD RISES; `app/warm-sphere.js` RISE, drawRising): a gold bought again by the wallet that
   holds a gold takes no land and raises its hexagon a level; each anchored gold in sight stands out of the glass along its radius as a prism (its walls in
   the gold's shade by the light, a fine line where each level begins, a bright top), its bronzes tethered to its top; a bronze is never raised. The
   review's golds race (`?pour=N`: the second gold raises the first; at 40 seats the levels are 4, 2, 1, 1).
5. **The card in the page's own words and buttons** (`app/dl-gold-bid.js`): "Your place in the society." (the page's #mint), "Bronze floats. Gold
   anchors, and rises.", the page's own Choose Bronze $10 ↗ and Choose Gold $1,000 ↗ opening the page's own checkout (`window.takeSlot`), and one quiet
   line: the seats, the time left, "Roadmap ›" (folded: "Every $WARM is a dollar for the spatial OS and Project Snowtrace. $X of $100,000 so far." and the
   steps), "or Bronze by card" where Stripe is set up, the Gold month's sealed bid only on its own road. No sheet over the page; her offer pose beside it.
6. **The flask fills at Solana's speed** (`app/dl-mint-pour.js`, THE SPEED OF LIGHT): on the stop, seen, one websocket `logsSubscribe` on the mint's
   wallet at confirmed; every notice reads the seats at once; opened on her entrance at the stop, closed when left or hidden; the poll stays the floor.
7. **Skip to the mint on the film** (`app/warm.html`, `app/dl-twelve.js`, `app/dl-twelve.css`): a pill in the film's upper left, seen from its first
   second, shown only while the wall will hold this viewer (beside the hover-only row, never inside it). A press seeks the film, and the song when it is
   on, 1.2 s before the drawn arrow through the clock (`startAt`, the debug start's forward seek); the film plays into the stop and the wall holds it as
   always; the page is told (`SKIP_EVENT`, the law's in `dl-athena.mjs`) and she lands without her entrance (one already running ends as her own Skip
   ends it), so the card opens at once. On the page: from the film's 10th second to the card in about 2.5 s.
8. **The chain of versions** so a deployed page fetches all of it: `warm.html` asks `warm-entry.mjs?v=society-mint-6`, which asks `warm.js?v=mint-3`,
   `lab/hero-mount.js?v=mint-3`, `dl-twelve.js?v=mint-3`, `dl-athena.js?v=athena-6`, `dl-mint-pour.js?v=flask-3`, `dl-gold-bid.js?v=flask-6`; `dl-twelve.css?v=skip-1`; the sphere asks
   `dl-mint-flask.js?v=flask-2`, which asks `dl-mint-ledger.js?v=flask-2` (and the pins in their tests moved with them).

## The roadmap (mine, his to set)

| raised | the step |
|---|---|
| $10k | DysonLight for macOS. Swarmy hatches from your egg. |
| $25k | Every phone in your room in one shared AR world. |
| $50k | The first crystal: a room in 4D from three phones. |
| $75k | Project Snowtrace's first season: sponsored credits for vetted builders. |
| $100k | The spatial OS, finished and open. |

## Tried and dropped (this lane, Oct 28 02:0x to 03:4x)

- A frosted card with the big raised amount and labels: "i dont think this converts". The offer in sentences with a gold pill: "ugly as fuck in style".
- The tracenet's ring inside the card: a second tank beside the real one, and "TOO MUCH FUCKING TEXT". A small $WARM readout card: "you never read below
  the hero", its words were not the page's.
- Her fourteen-line explainer: "she doesnt need to go through everything there the first time".

## Not settled (his rulings)

- Re-rolls are not on the card (my recommendation stands: free, earned by burning, never sold). The roadmap's steps, the card's and her words.
- The seats counted are the checkout's (the tank's count); Stripe's subscriptions and the Gold month's bids are not in them. $WARM is not minted yet.
- Whether a gold bought again by its holder should raise its hexagon by one level (this lane) or by the price paid.

## Checks

- `node --test` over dl-gold-bid (scene, bid), dl-athena, dl-harmony-doors, dl-athena-layer, dl-twelve, dl-tank, dl-mint-pour, dl-mint-flask, dl-mint-ledger,
  dl-paywall, warm-entry, lab/heartbeat, lab/one-page: 132 of 137 (with THE SKIP pinned in dl-twelve's and dl-athena's). The five reds are main's own, red the same way on a clean main (19a199afe): dl-athena's
  THE DEPTH, dl-paywall's Harmony ice and accent tokens, one-page's hero mount, the build's lab modules and a tracenet's shipped modules.
- Rule 8: `node --test app/dl-twelve.test.mjs` green on this tree; `app/dl-twelve.proof.mjs` handed as the proof (warm.html, tap sphere).
- Judged on the page, this lane served with byte ranges, `?debug&pour=30`, the film held on the drawn bow: her lines one by one with their figures (the
  meta swarm; SOUL.md and SUBCONSCIOUS.md with the hash; the metals; $WARM), Skip to the mint, the card after "Take it home.", the golds standing out of
  the glass at three heights with the bronzes floating; Skip to the mint pressed at the film's 10th second: held on the arrow 2.4 s later, no entrance,
  the card open.
- The two sockets: from Node, both endpoints answered a `logsSubscribe` for the mint's wallet (mainnet-beta 0.3 s, publicnode 3.2 s); the app's browser
  pane refused sockets while hidden, so the in-page socket is unproven here; the poll covers it.
