# THE BOX TAKES THE BALL BACK (Nov 26 2026, claude-0f25b5e7)

**His words** (Nov 26 2026, this seat's chat), over two stills of the mint film on swarmbook.com, the anime on the ball's faces at its flat cuts: "who the fuck
changed this? who the fuck fucked up all the cuts where the anime was flat? this shit was edited diocane".

**Who and when** (a bisect of first-parent main from Oct 27, the box read at 108 s on each build): the last build that played the flat cuts is 3ddf7509ae
(Nov 24 22:09 UTC). The first that did not is **e7db936161, Nov 24 2026 22:41 UTC, `lane/the-mint-frame-on-the-gpu`, THE SHAPES ARE RUST'S**, handed by seat
claude-73a178b3 at 21:50 UTC on his "Yes, the whole frame" and "Yes, shapes in Rust", landed by the lander. Since it, on every glass with a graphics card,
swarmbook.com played no flat anime (the box's anime, its colony, Seiya's cosmos).

**The cause.** The film's flat cuts are the hero's box (`lab/unboxing.js`, unchanged since Oct 27). It takes over inside the ball's own frame through
orbit-kick.js THE HUSH: a prototype swapped onto the ball's 2D context. It watches for the frame's first `clearRect` and the skin's `lineJoin`, then asks the box
whether to draw. THE SHAPES ARE RUST'S draws the ball's frame on the graphics card's layers (`mint-glass.mjs`), so that context saw neither call. The box was
never asked, drew 0 frames, and its canvas stayed hidden.

**The cure** (`app/warm-sphere.js`, two lines in place): the ball draws on the glass only while its context wears its own prototype. While the kick hooks it,
through the film, the frame is drawn on the ball's own canvas as before Nov 24, and the box takes over at its cuts. At rest and outside the film the glass draws
as it did.

**Proofs.** Read off `window.hero.state()` and the box's canvas, the film sought and played muted, headless, off every screen:

| second | main (today) | this lane | Nov 24 22:09 (before the glass) |
|---|---|---|---|
| 56 | hidden, 0 draws | OUT, anime | OUT, anime |
| 101 | hidden | OUT, cosmos-charge | OUT, cosmos |
| 108 | hidden | OUT, anime-colony | OUT, anime-colony |
| 113 | hidden | OUT, anime-colony | OUT, anime |

Stills at 56 s and 110 s: the anime flat and full-screen again.
- Rule 8: `node --test app/dl-twelve.test.mjs` (with lab/one-page.test.mjs: 29 pass; the 2 red are main's own, red the same with main's warm-sphere.js);
  `node app/dl-twelve.proof.mjs --url <served lane>/dyson-society/app/warm.html --tap button` PASS, `--tap sphere` PASS.
- JavaScript +2 -2, net 0.

**Cost.** Through the film the ball's frame is drawn in 2D as before Nov 24 (THE SHAPES ARE RUST'S measured that path); outside the film the graphics card
draws it as since Nov 24. Nothing at rest changes.

**No gate yet** on the flat cuts: the measure it waits for is the box read at 56, 101, 108 and 113 s on the mint page in the lander's walks.
