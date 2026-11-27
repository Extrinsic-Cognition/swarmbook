// dolbar-beats.js: THE BEATS OF DOLBAR'S ATTACK, the film's own measure, written by tools/dolbar-beats.mjs (do not edit by hand; run it again).
// The film's frames (30000/1001 fps) of each beat, found by the tool's rules over each frame's red (the faces' square), light and change
// (thousandths); the numbers of the frame are on its line. Read off saint-seiya.mp4.
export const BEATS = Object.freeze({
  orb: 115,      // 3.837 s, the orb lit in his hand (red 25, light 8, change 3)
  flood: 134,    // 4.471 s, the frame floods red over him: his halo, the charge begins (red 516, light 3, change 56)
  peak: 245,     // 8.175 s, the charge at its height: the focus lines close on his palm (red 980, light 0, change 9)
  release: 251,  // 8.375 s, THE BLAST LET GO: his hand thrust out of the frame in light (red 707, light 98, change 82)
  streaks: Object.freeze([256, 259, 261, 264, 266]),   // 8.542, 8.642, 8.709, 8.809, 8.876 s: the blue and red streaks, each flicker of their red
  hand: 267,     // 8.909 s, the giant hand of light (red 455, light 170, change 241)
  flash: 286,    // 9.543 s, the hand reaches Seiya in a red flash (red 888, light 3, change 101)
  sweep: 290,    // 9.676 s, the blast sweeps over Seiya (red 725, light 6, change 74)
  hit: 331,      // 11.044 s, the cut to the hit landing on the one who takes it: the hero's first burst (red 832, light 29, change 153)
});
