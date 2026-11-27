// fields-lines.mjs: THE LINES that put THE FIELDS (fields.js) on the hero, for unboxing.js, the unboxing session's file (one writer per page:
// nothing here edits it). Each line is a piece of main's unboxing.js found by its text (never by its line number, which moves) and what it
// becomes. heroLines() applies them to a text and says which applied and which were not found; fields.proof.mjs --hero serves the result from
// its own door, so the pictures are the hero with the lines, and FIELDS.md gives the same lines to the session to wire.
// THE CUBIST FIT is mounted on main by its own lane (unboxing.js herAt, her cut by uHerCut since d873ca46): her strands stand on her as it places
// her and take her cut (fields.athena(..., {cut: herCut})). The copies of its lines this file carried before that are gone.
// THE THREE SOURCE LAYERS (his Oct 15 2026 "isolate in separate layers", 4bf23542) gate her draw on the lab's one-layer view (unboxing.js
// layers(), 'all' unless hero-ab.html's Shot layers picks one): the draw's line is found as main holds it, and on 'all' she draws as before.
// What the lines do (fields.js mountFields, the shape the unboxing session asked for):
//   the light: one field from the cloth, its beams, core and motes at the cloth's centre each draw while the box is out and the cloth shown,
//              its flames on the cloth's own surface (an idle slice), its light on the box's faces (FIELD_GLSL in PANEL_FS), the aura raised by it;
//   the hair:  her strands on her (an idle slice before her compile), her game hair's long locks hidden under them and her cap in the film's
//              paint, clipped as she is, the flow read round her head on the screen each draw, wearing THE CUTS' look her body wears.
// The silhouette is not among them: its moment is his to pick (fields-plan.mjs DISSOLVE_CANDIDATES; FIELDS.md has the line for each).

/** THE FIELDS' lines: mountFields, the shape the unboxing session asked for (its message of Oct 14 2026 18:1x WEST), 8 lines in 7 places. Nothing
 *  here bends her body or her dress (she is Saori, 13; the coordinator at 19:05 WEST: the ripple on her strands only is right): the line that
 *  patched her looks with the ripple, given at 18:5x, is withdrawn. */
export const FIELDS_LINES = [
  {name: 'fields: import', find: "import {shotAt, columnWidthAt} from './braindance.mjs';",
    with: "import {shotAt, columnWidthAt} from './braindance.mjs';\n" +
      "import {mountFields, FIELD_GLSL} from './fields.js';   // THE FIELDS: the light from the armor, her strands (fields.js header, FIELDS.md)"},
  {name: 'fields: the faces take the field\'s light (declarations)', find: 'uniform vec3 uLight;\nvarying vec2 vDecal;',
    with: 'uniform vec3 uLight;\n${FIELD_GLSL}\nvarying vec2 vDecal;'},
  {name: 'fields: the faces take the field\'s light', find: '  vec3 col = mix(film, vec3(0.184, 0.2, 0.157), (1.0 - lit) * 0.5);     // the sphere\'s shade, #2f3328 at (1 - lit) / 2',
    with: '  vec3 col = mix(film, vec3(0.184, 0.2, 0.157), (1.0 - lit) * 0.5);     // the sphere\'s shade, #2f3328 at (1 - lit) / 2\n' +
      '  col += fieldLight(-vView, n);                                          // THE FIELDS: the cloth\'s light, from inside the box'},
  {name: 'fields: mounted before the faces (they share its uniforms)', find: '  const panels = faces.map(',
    with: '  // THE FIELDS (fields.js mountFields): its uniforms are the faces\' (FIELD_GLSL in PANEL_FS); the cloth\'s group is made below, so it is read at each draw\n' +
      '  const fields = mountFields({scene, camera, cloth: () => clothSpot}); Object.assign(shared, fields.uniforms);\n' +
      '  const panels = faces.map('},
  {name: 'fields: the flames on the cloth\'s own surface', find: '    clothSpot.add(holder);',
    with: '    clothSpot.add(holder);\n' +
      '    slice().then(() => timed(\'fields: the flames on the cloth\', () => { if (cloth?.holder === holder) fields.cloth(holder); }));   // THE FIELDS, an idle slice of its own'},
  {name: 'fields: her strands, before her compile', find: '      athenaSpot.add(holder);',
    with: '      athenaSpot.add(holder);\n' +
      "      await slice(); timed('fields: her strands', () => fields.athena(holder, athenaSpot, {cut: typeof herCut === 'undefined' ? null : herCut}));   // THE FIELDS: cut as she is, compiled with her looks below"},
  {name: 'fields: the cloth\'s aura rises with the field', find: '    if (cloth) { cloth.aura.uFill.value = 0.55 * c.glow * c.glow + 0.35 * c.glint; cloth.aura.uRim.value = 0.25 + 0.6 * c.glow + 0.5 * c.glint; }',
    with: '    if (cloth) { cloth.aura.uFill.value = 0.55 * c.glow * c.glow + 0.35 * c.glint; cloth.aura.uRim.value = 0.25 + 0.6 * c.glow + 0.5 * c.glint; }\n' +
      '    { const k = fields.glow(t); if (cloth && c.show && k > 0) { cloth.aura.uFill.value = Math.max(cloth.aura.uFill.value, 0.3 * k); cloth.aura.uRim.value = Math.max(cloth.aura.uRim.value, 0.25 + 0.6 * k); } }   // THE FIELDS'},
  {name: 'fields: each draw, once the box and Athena are placed', find: "    const her = athenaOn && layerView === 'all' && drawAthena(t, R);",
    with: "    const her = athenaOn && layerView === 'all' && drawAthena(t, R);\n" +
      '    fields.update(t, s, {height: canvas.height, px: dpr, box: Boolean(boxOut), rect});   // THE FIELDS: the light at the cloth while the box is out, her strands on her, her portal\'s ripple on her strands'},
];

/** The lines applied to unboxing.js's text, in order: {text, applied: [names], missing: [names]} (a missing one changes nothing). */
export function heroLines(text) {
  const applied = [], missing = [];
  for (const line of FIELDS_LINES) {
    const at = text.indexOf(line.find);
    if (at < 0 || text.indexOf(line.find, at + 1) >= 0) { missing.push(line.name); continue; }
    text = text.slice(0, at) + line.with + text.slice(at + line.find.length);
    applied.push(line.name);
  }
  return {text, applied, missing};
}
