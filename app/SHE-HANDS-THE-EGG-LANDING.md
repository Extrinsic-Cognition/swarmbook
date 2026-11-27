# SHE HANDS THE EGG (Oct 27-28 2026, claude-cc7b2f4f)

## His words

- Oct 27 23:5x WET, over her stop on the mint ("Now Aiolos is a harness anyone can wear, built on Oh My Pi."): "she still has not updated the things
  she says... she should be handing over the apple of chaos as that apple should be called an egg of lyssajudron... swarmy hatches when dysonlight macOS
  opens up".
- The same night: "nefertiti appears, she introduces dysonlight as the spatial computing IDE for cross-platform multiplayer AR fully local... she has to
  turn 'BURN MY COSMOS' into a slogan"; "aiolos is the golden armor... burn my cosmos is when you have the agents doing shit".
- Oct 27 17:30 (the lore): "it would be lovely if nefertiti handed over the golden apple of chaos she is holding and that was the egg of the lyssajudron".
- Oct 28 01:xx, after the dodecahedron attempts: "it is broken... if the dodecahedron fucks up we can go back to the apple".
- Oct 28 01:4x WET, over her vow on the page ("And this is no apple. It’s a Lyssajudron egg."): "SHE GOT BROKEN HANDSSSSS".
- Oct 28 01:5x WET, over the first redraw: "its not how human hands work"; over the warm-mug hold: "this one looks good".

## What changed

Her twelve lines at the stop (dl-athena.mjs STORY; the comment above it holds his words): the family story; Aiolos the armor the agents wear, on Oh My
Pi; the Nest is DysonLight Harmony on your own machines; every screen and phone one scene shared in AR; the Canvas; the burn of the flask, never the
wallet; "Burn your cosmos."; the membrane; "And this is no apple. It's a Lyssajudron egg." (the vow pose, the apple cupped like a flame); "Swarmy hatches
the moment DysonLight opens on your Mac."; "Take it home." (the offer pose, the apple held out). Two pins moved with his word: the last line ("Take your
seat." since Oct 22) and the ban on the word Lyssajudron at her stop (Oct 22), in dl-athena.test.mjs and dl-harmony-doors.test.mjs.

Her poses are main's but one: she holds the golden apple of chaos, and the apple IS the egg (his Oct 27 17:30 lore). The dodecahedron lives where
the film already puts it: the twelve-faced vessel at the freeze, the liquor poured into it.

The one is the vow (`assets/athena-vow.png`, her pose for the egg line). Its hands, as main had them since Oct 22, were broken: the fingers drawn as
stripes running into the apple, no thumbs, a stray line across one palm.

Now she holds the apple against her chest the way a person holds a warm mug in winter: her palms toward her chest on its two sides, the backs of four
fingers from each hand across its front with the fingertips meeting in the middle, each thumb up on its top, so each thumb opposes its fingers as a hand's
does. Redrawn by Codex (gpt-6-astra, `tools/imagegen/codex-sprite.sh`) from main's vow, with her offer pose attached as the drawing of a correct hand in
this style; six candidates, two holds; this one his pick. Fitted as her poses are: box filter to 628x640, bottom-anchored, alpha whole or none,
160 colours, indexed. Her face sits within 7 px of the old vow's, less than the poses differ from each other. The prompt (main's vow first, the offer
pose second):

```
Generate one image with your image generation tool.

The first attached image (her.png) is the character in chunky pixel art, eyes closed, holding a small glowing golden apple at her chest. Keep EXACTLY everything in it except her hands: her face and closed eyes, her calm smile, the warm golden light on her chin, her platinum-white pigtails with lavender roots and one pink and one ice-blue tip, the small diamond mark under her eye, her platinum circlet, her frosted white chiton with its round snowflake clasp, the drifting snowflakes, and the golden apple with its glowing hexagon pattern, its stem and its one golden leaf, at the same place and size. Keep the same canvas, framing, scale and position of everything, the same pixel size, black outlines, flat cel shading with two or three tones per colour, and the transparent background.

Her hands in the first image are drawn wrong: do not copy them. The second attached image (hand-ref.png) shows how a hand is drawn correctly in this style: copy that drawing of a hand, its proportions, knuckles, fingers and thumb.

Redraw her two hands holding the apple against her chest the way a person holds a warm mug in winter:
- Her palms press against the left and right sides of the apple.
- Her fingers wrap around the front of the apple: we see the backs of her fingers lying across the lower front of the apple, four fingers from each side, curving toward the middle, where the fingertips of her two hands meet.
- Each thumb rests on the top of the apple, one on each side of its stem.
- Each forearm comes up from below on its own side and joins its own hand at the wrist; the two forearms are side by side and apart.
- Correct human anatomy: each hand has exactly one thumb and four fingers, and the thumb grows from the base of the palm on the index-finger side.
The upper half of the apple, with its stem and leaf, glows above her fingers.

No text, no letters, no frame, transparent background.
```

## Tried and dropped (the record, so no seat repeats it)

A dodecahedron in her hand, Oct 28 00:3x to 01:xx: (1) the image model asked in words drew cut gems with hexagon faces; (2) a computed regular
dodecahedron pasted over her looked pasted ("it is indecent"); (3) the model given the exact solid as a reference picture, two candidates a pose judged
close up, still drifted to gems and footballs at this size ("it is broken"); (4) snapping to a pixel grid muddied it. The commits stand in this
lane's history. Do not retry without a new road.

Her hands, Oct 28 01:4x to 01:5x: a hold asked as "cup the apple from below and from the sides" came back with the thumbs out of the middle and the
fingers round the outside, which turns the palms outward, and the wrists crossed ("its not how human hands work"). What worked: name a hold the way a
person would (a warm mug in winter), say where each palm, finger and thumb lies, attach a correct hand of hers as the drawing, and judge each hand by
which way its palm faces and which side its thumb is on before judging its fingers. A hand-on-heart vow (one palm under the apple, the other hand flat on
her chest) also drew correctly; kept as the second choice, not shipped.

## Checks

dl-athena, dl-harmony-doors, dl-twelve, dl-athena-layer tests green. Judged on the page (this lane served with byte ranges, ?debug&pour=12, the film to
her stop): the twelve lines read in order, each standing to be read; the apple in her hands; the vow's new hands at 3x and on the page.

Rule 8: dl-twelve.test.mjs green on this tree; dl-twelve.proof.mjs handed as the proof (warm.html, tap sphere).
