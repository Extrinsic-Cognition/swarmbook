# HER WORDS UNDER HER: her subtitles never cross her face, in larger type (Oct 27 2026)

Lane `lane/her-words-under-her`, cut from origin/main, Oct 27 2026 15:5x WET, seat claude-32dd11de on the new Mac.

## His words

Oct 27 2026 15:5x WET, over her line "That knight served my ancestor, Athena, and his golden armor is called Aiolos." running across her face in a
narrow window: "please position the text like normally... not in front of her face... make the font larger".

## Before

`app/dl-athena.js`: at 700 px or narrower the subtitle stood at `bottom:13%`, the window's full width (5 % to 95 %), over her portrait
(`height:min(44vh,360px)`, standing on the bottom edge), so the line crossed her face; the type was `clamp(15px,1.75vw,25px)` everywhere: 15 px there.

## The change

- Larger type: `clamp(19px,2.3vw,32px)` on a wide window (29.4 px at 1280); `clamp(20px,5.4vw,26px)` at 700 px or narrower (20.25 px at 375).
- A narrow window: the line in the black bar at the very bottom (`bottom:0`, `height:13%`, at least 3.2 em), centred as a film's subtitle; her
  portrait (`min(40vh,330px)`) stands on that bar's top edge (`bottom:max(13%,3.2em)`), so no line ever crosses her.
- A wide window keeps its place (the bottom bar, left of her portrait: `left:6%;right:36%`).

## Measured in a browser (the served lane, her line on at 120.67 s)

| window | the line | her portrait |
|---|---|---|
| 375 x 812 | y 706 to 812, x 19 to 356, 18 px (before the last bump), centred | y 382 to 706: ends where the line's bar begins |
| 1280 x 800 | y 709 to 786, x 77 to 741, 29.4 px | x 783 to 1254: 42 px clear of the line |

## Proofs (the new Mac, nice 19)

- `node --test app/dl-athena.test.mjs app/dl-twelve.test.mjs`: 32 of 32 (the athena test pins the larger type and the narrow window's law).
- Rule 8: `nice -n 19 node app/dl-twelve.proof.mjs --url http://127.0.0.1:8988/app/warm.html --tap button` PASS and `--tap sphere` PASS on this
  lane's tree served by `tools/serve-range`.
