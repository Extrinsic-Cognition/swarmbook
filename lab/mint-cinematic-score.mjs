// A brief camera traversal of Athena's frozen drawing. The original animated
// transformation then continues at the soundtrack's second, without stand-ins.
import {scoreAt} from './satellites-score.js';
export const CINEMATIC = Object.freeze({start:1111.5*1001/30000,duration:2.8});
// The fullscreen anime runs to the cut to Seiya in the gold cloth (frame 2307, 76.977 s, the rite), through Dolbar's shot after Athena's: his
// Oct 21 2026 WEST "please dont start the dodecahedron right away... i dont want to see dolbar in the dodecahedron" (it was frame 2247, the cut to
// Dolbar). The page's dodecahedron comes back with the rite's twelve (rite-unit1s.js).
export const SAGITTARIUS_END = 2307*1001/30000;
// THE TAIL (his Oct 21 2026 WEST "make the tranistion between dolbar and the dodecahedron smoother... idk like time the transition to the frame
// perfectly and add some ease-in/out"): from the cut's own frame the fullscreen picture eases down onto the page's dodecahedron and dissolves into it
// (unboxing.js drawAnime), landing on the soundtrack's first strong beat after the cut: the strongest onset in the second after it
// (satellites-score.js beat), frame 2326, 77.611 s, the bass's hit. A whole number of frames, so it ends on a frame; eased in and out (smootherstep).
export const TAIL_FRAMES = (() => { const cut = 2307; let at = cut + 1, top = -1;
  for (let n = cut + 1; n <= cut + 30; n++) { const b = scoreAt(n*1001/30000).beat; if (b > top) { top = b; at = n; } }
  return at - cut; })();
export const ANIME_TAIL = TAIL_FRAMES*1001/30000;
/** The tail's progress at the film's second t: 0 to the cut, 1 from the beat, smootherstep between (no speed at either end). */
export const tailEase = (t) => { const x = Math.max(0, Math.min(1, (t - SAGITTARIUS_END) / ANIME_TAIL)); return x >= 1 - 1e-9 ? 1 : x*x*x*(x*(6*x-15)+10); };
const smooth=(a,b,t)=>{const x=Math.max(0,Math.min(1,(t-a)/(b-a)));return x*x*(3-2*x);};
export function cinematicScore(seconds) {
  const t=Math.max(0,Math.min(CINEMATIC.duration,seconds));
  const spatial=smooth(.35,.85,t), phase=smooth(.35,2.55,t)*Math.PI*1.5;
  return {spatial,
    pan:[Math.sin(phase)*.012*spatial,(Math.cos(phase)-1)*.004*spatial],
    zoom:1+spatial*.035*Math.sin(Math.min(1,t/CINEMATIC.duration)*Math.PI),
    exit:smooth(2.5,2.8,t)};
}
