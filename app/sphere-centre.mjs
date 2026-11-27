// sphere-centre.mjs: THE SPHERE STANDS CENTRED (his Oct 27 2026 17:3x WET, over the stop on a 676 px window: "see the polyhedron structure is
// off-centered... left is more distant than right check margins"). Measured: the shell 216 px in radius, its centre at 55 % across (372 px, not
// 338), so 155 px of margin on the left against 88 on the right; at 1440 x 900, 504 against 360. The 55 % was written into ten places in six
// files (the sphere, its flames, the colony, the flask's orbits, the satellites, the sacrifice), from when the title stood beside the sphere; the
// title is a bar above it now. One centre for every layer, here: a layer that draws round the sphere imports it, so they never split.
export const SPHERE_X = 0.5;   // the sphere's centre, a share of the stage's width (its height's half stays where it was)
