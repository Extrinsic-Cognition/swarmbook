// A material change, then a geometric change, on the same twelve-face seed.
// All tracks have zero velocity and acceleration at their endpoints.
export const ENTRY_SECONDS = 5.7;
export const CLEAR_AT = 1.8;
export const GROW_AT = 1.9;
export const silk = value => {
  const t = Math.max(0, Math.min(1, value));
  return Math.max(0,Math.min(1,t * t * t * (t * (t * 6 - 15) + 10)));
};
export function liquorEntry(seconds) {
  return {
    clarity: silk((seconds - .15) / (CLEAR_AT - .15)),
    growth: silk((seconds - GROW_AT) / (ENTRY_SECONDS - GROW_AT)),
    background: silk(seconds / CLEAR_AT),
  };
}
