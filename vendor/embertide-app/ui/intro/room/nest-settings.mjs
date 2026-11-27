// nest-settings.mjs · THE NEST HOLDS THE SETTINGS (Oct 29 2026, lane/the-nest-holds-the-settings). His words (UTC): 02:1x, over Harmony's flask with her balance
// "$317.57" in it, "consider adding a global setting toggle for visibility of dollar amount here, just as you are adding it to the devices... i want nest-wide
// settigns so i dont go crazy phone by phone.."; then "also pelino etc etc... all pcs all screens everything".
//
// THE LAW. A setting of the house is ONE fact on the Nest, house/settings {schema, <key>: <value>, by, at_ms}, read by every glass that draws what it governs
// and moved only by his press (one compare-and-swap a press: the Chamber's settings sheet); no glass, phone or app keeps a setting of its own (C-2). A key the
// fact does not name, or names with a value it does not know, stands at its fallback. Each key names what obeys it:
// - money: the dollar amounts on every glass, shown or hidden: the flask's balance, what calls in flight hold, the numbers that rise from his feet
//   (room/lyssajudron-purse.mjs textsOf, the one painter every glass's flask is: one.mjs on the TVs, the laptop, pelino and the phones' well; one-corner and
//   dl-athena-purse in Harmony on the Macs; the phones' rooms).
// Pure: no DOM, no Nest; the hosts read and the Chamber writes.
export const SETTINGS_REF = 'house/settings', SETTINGS_SCHEMA = 'embertide.nest-settings/v1', SETTINGS_BY = 'harmony';
export const SETTINGS = Object.freeze({
  money: Object.freeze({ values: Object.freeze(['shown', 'hidden']), fallback: 'shown', title: 'Dollar amounts', says: 'the flask\'s balance, what calls hold, the numbers that rise' }),
});

const obj = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
/** settingsOf(value): every key at its value on the Nest, else its fallback -> { money: 'shown' | 'hidden' } */
export function settingsOf(value) {
  const v = obj(value) && value.schema === SETTINGS_SCHEMA ? value : {}, out = {};
  for (const [key, s] of Object.entries(SETTINGS)) out[key] = s.values.includes(v[key]) ? v[key] : s.fallback;
  return out;
}
/** moneyShown(value): the dollar amounts stand on the glass unless his word hid them */
export const moneyShown = (value) => settingsOf(value).money !== 'hidden';

/** settingsWith(current, rev, key, to, { now, by }): his press -> the compare-and-swap body { seat, value, expect } for house/settings, or { why } when the
 *  law refuses it (a key or a value it does not know). Every other key stands as the Nest holds it. */
export function settingsWith(current, rev, key, to, { now = Date.now(), by = SETTINGS_BY } = {}) {
  const s = SETTINGS[key];
  if (!s) return { why: `the Nest has no setting "${key}"` };
  if (!s.values.includes(to)) return { why: `${s.title} is ${s.values.join(' or ')}` };
  return { seat: by, value: { schema: SETTINGS_SCHEMA, ...settingsOf(current), [key]: to, by, at_ms: now }, expect: Number.isSafeInteger(rev) ? rev : 0 };
}
