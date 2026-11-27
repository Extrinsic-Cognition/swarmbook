// seiya-flight.mjs: THE TWELVE ON SEIYA, THE TWELVE's own law (sagittarius-flight.mjs twelveLaw) over the cut to Athena's shot.
// His words, Oct 21 2026 WEST, over the hero at the cut from Seiya's column of gold to Athena's shot over her hair (Seiya small on the ground at the
// picture's lower left, Dolbar on the rocks above): "you have to stay true to the storyline... so rigth after saint seya is done doing his golden
// column glow thing... as soon as athena is the scene maker i want to see the dodecahedron faces do the thing that was done on the sagyttarius when it
// appeared, meaning i want the faces to asseble around saint seya there... then when the frame moves to dolbar keep it like thatt"; then, over a first
// cut that had its own copy of the law and held the twelve through Dolbar's shot: "why are you not using the same exact formula used before? why this
// gay formation? we go back to the dodecahedron in the next scene after athena, so..."; then, over the page's dodecahedron back at the cut to Dolbar
// with Dolbar on its faces: "please dont start the dodecahedron right away... i dont want to see dolbar in the dodecahedron".
// So it is the same formula, the one function THE TWELVE fly by, over this span's own measure (tools/twelve-dct.mjs --span seiya, lab/twelve-seiya-dct.js):
//   THE BOOMERANG: as soon as Athena is the scene maker (the cut, 2172, 72.472 s), the twelve shoot in from beyond the picture's edge down the column of
//     gold still rising off him (the light's sectors about him over its frames), each on its own erratic path, and arrive round him as its gold is gone
//     (the first frame with a tenth of a unit or less: 2185).
//   THE GATHERING: from round him to the glory's seats as this shot's drawings move, over as many frames as THE TWELVE's gathering takes.
//   THE GLORY: about him, the light's place the measure holds on his figure once the column is gone; with no light left in the shot, the seats are
//     spread over the directions that stay in the picture (seatsOf), each face turned along its ray, flashing where the drawing moves, lifted by the score.
//   THE FINISHER: the twelve close into one glass on him a beat before the cut, the dodecahedron again, its hit and its shock ring; begun by the score's
//     climax after its floor (the quiet from 74.1 s and the rise into the cut), no later than THE TWELVE's finisher takes before its hit.
//   The cut to Dolbar (2247, 74.975 s): no flight; the anime alone through Dolbar's shot (the fullscreen anime runs to mint-cinematic-score.mjs
//     SAGITTARIUS_END); the page's dodecahedron comes back at the cut to the rite (2307, 76.977 s), Seiya in the gold cloth on its faces.
// What is not the Sagittarius's: no hole (its singularity is the star's, out of which the golden Sagittarius arises; on him it would eclipse him) and
// no return after the cut (the sky's glass comes home to the mint's hold; here the page's own dodecahedron takes the rite's scene).
// COST: THE TWELVE's (a sample is about 12 x 300 float ops, twice); this span's tracks (75 frames) are made once at the module's load.
import {TWELVE_SEIYA_DCT} from './twelve-seiya-dct.js';
import {twelveLaw, FINISH as SKY_FINISH, FIN_HIT as SKY_FIN_HIT, SKY_GATHER_FRAMES} from './sagittarius-flight.mjs';

const FPS = 30000 / 1001;
const [ATHENA, DOLBAR] = TWELVE_SEIYA_DCT.cuts;
export const SEIYA_FLIGHT_START = ATHENA / FPS;   // 72.472 s: the cut to Athena's shot
export const SEIYA_FLIGHT_END = DOLBAR / FPS;     // 74.975 s: the cut to Dolbar, the page's dodecahedron
const SEIYA = twelveLaw(TWELVE_SEIYA_DCT, {start: SEIYA_FLIGHT_START, cut: SEIYA_FLIGHT_END, after: 'none', hole: false,
  entry: [0, 11],   // the column rises from him: the light about him in every sector, not only below as the Sagittarius's beam
  // from the cut to the first frame whose gold has gone
  boom: ({LIGHT, F0, N}) => { let arrive = N - 1; for (let i = 1; i < N; i++) if (LIGHT[i] <= .1) { arrive = i; break; } return {beam: 0, arrive, from: F0}; },
  fullest: ({ARRIVE_I}) => ARRIVE_I + SKY_GATHER_FRAMES,
  // the score's floor read from its least after the gathering (the quiet before the cut), its climax the rise out of it
  finishFrom: ({F0, N, SWELL, GATHERED_N}) => { let at = GATHERED_N - F0; for (let i = at; i < N; i++) if (SWELL[i] < SWELL[at]) at = i; return F0 + at; },
  latestFinish: DOLBAR / FPS - .1 - (SKY_FIN_HIT - SKY_FINISH),
});
export const {SOURCE, BOOM_START, BOOM_END, ENTRY, GATHERED, FINISH, FIN_HIT} = SEIYA;
export const gatheredAt = SEIYA.gatheredAt, seatsAt = SEIYA.seatsAt, lightAt = SEIYA.lightAt;
/** The flight at the film's second t, or null outside the cut to Athena's shot to the cut to Dolbar: THE TWELVE's shape (twelveLaw, skyFlight). */
export const seiyaFlight = SEIYA.flight;
