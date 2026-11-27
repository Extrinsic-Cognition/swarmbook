// tracenet-drop-line.mjs: THE DROP IS SIGNED BY ITS CREATOR (Oct 25 2026, lane/the-drop-is-signed; the design: ec-workspace
// docs/beat-cosign-with-true-neutrality-2026-10-25.md, section 5 point 1). His words, WEST: "we gotta beat cosign by a16z with true neutrality"
// (Sept 28 02:45); "BASICALLY ANY SOLANA WALLET IS A IROH KEYPAIR SO WE CAN RETAIN IDENTITY 1:1" (Sept 14 12:14); "there is only a performance
// append-only signed log" (Sept 15 14:33). A creator's drop is a line their own wallet signs: whose tracenet, what (the bytes' sha256), when, and
// the hash of their signed line before it. The register of a tracenet is then the creator's own chain, checkable by anyone from its lines and
// its wallet alone, never on the word of the database that keeps them: D1 (worker/creators.mjs) is a cache of the chain, not its authority.
// One place for the signer (app/creator.js), the door (worker/creators.mjs) and the readers (app/tracenet.js, life-menu/tracenets.mjs):
//   dropId(published, title)        <yyyy-mm-dd>-<slug>, the publisher's name of a drop (here since this lane: the signer computes it too)
//   dropLineText(line)              the text the wallet shows and signs, one field a line, the title JSON-quoted (no field carries a line break)
//   lineHash(text)                  the sha256 hex of a line's text: the `prev` of the creator's next signed line
//   lastSigned(register)            the register's newest line whose signature verifies, or null (a row that only looks signed is skipped)
//   headOf(register)                that line's hash, NO_PREV when there is none: what the next drop names as `prev`, and what the door asks
//   walletSigned(wallet, sig, text) whether sig is wallet's Ed25519 signature over text (the drops' check, and the stamps', app/tracenet-stamp.mjs)
//   verifyDropLine(register, item)  whether item.sig is the register's wallet's Ed25519 signature over the item's line
//   proveItems(register)            the drops a reader may draw: each proven by the Nest's sanitization receipt (the house's own registers) or
//                                   by its creator's signature; `proof` says which, and `linked` whether a signed line names the signed line
//                                   before it (false: a line was taken out of the chain, which a reader can now see). Proven by neither: no drop.
// Pure: no clock, no storage; WebCrypto's SHA-256 and Ed25519, as the seat proof's (dl-direct-protocol.mjs). Nothing runs at rest.
import { decode58 } from './dl-direct-protocol.mjs';
import { NO_PREV, validReceipt } from './tracenet-register.mjs';

export { NO_PREV };                      // the prev of a creator's first signed line (the register's own word)
export const DROP_SCHEMA = 'optimism.tracenet/drop/1';
export const DROP_SKEW_MS = 600000;      // a creator's clock up to ten minutes off the door's (the seat proof's skew)
// the wallet shows this line (mine, his to reword; it lives inside every signed line, so a new line is a new schema)
export const DROP_STATEMENT = 'Sign this line to publish a drop of your tracenet. This sends no transaction and moves no funds.';
const enc = new TextEncoder();
const hexOf = (b) => Array.from(new Uint8Array(b), (x) => x.toString(16).padStart(2, '0')).join('');

/** dropId(published, title): <yyyy-mm-dd>-<slug>, as the publisher tool names a drop. */
export function dropId(published, title) {
  const slug = String(title).toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60) || 'drop';
  return `${published.slice(0, 10)}-${slug}`;
}
/** The text a creator's wallet signs for one drop, field by field; every field but the title is bounded by its own pattern (tracenet-register.mjs). */
export function dropLineText({ handle, wallet, id, title, kind = 'trace', file, bytes, sha256, published, prev = NO_PREV }) {
  return `A tracenet drop, signed by its creator:\n${wallet}\n\n${DROP_STATEMENT}\n\nHandle: ${handle}\nId: ${id}\nTitle: ${JSON.stringify(String(title))}\n` +
    `Kind: ${kind}\nFile: ${file}\nBytes: ${bytes}\nSHA-256: ${sha256}\nPublished: ${published}\nPrevious: ${prev}\nSchema: ${DROP_SCHEMA}`;
}
export async function lineHash(text) { return hexOf(await crypto.subtle.digest('SHA-256', enc.encode(text))); }
/** An item's line as its register's creator signed it (the register gives the handle and the wallet; a line's absent prev is NO_PREV). */
export const lineOf = (register, item) => dropLineText({ ...item, handle: register.handle, wallet: register.wallet, prev: item.prev ?? NO_PREV });
const oldestFirst = (items) => [...items].sort((a, b) => Date.parse(a.published) - Date.parse(b.published) || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));

/** The newest line of a register whose signature verifies (walking back from the newest: one verify when nothing was tampered with), or null. */
export async function lastSigned(register) {
  const signed = oldestFirst((register?.items ?? []).filter((i) => typeof i.sig === 'string'));
  for (let k = signed.length - 1; k >= 0; k--) if (await verifyDropLine(register, signed[k])) return signed[k];
  return null;   // a row that only looks signed (written past the door) is no link of the chain: the door and every reader skip it alike
}
/** The hash of the register's newest signed line that verifies, or NO_PREV: what the next drop names as prev (the door asks the same). */
export async function headOf(register) {
  const last = await lastSigned(register);
  return last ? lineHash(lineOf(register, last)) : NO_PREV;
}
/** Whether sig (base58, 64 bytes) is wallet's (base58, 32 bytes) Ed25519 signature over text: the one check of every line a wallet signs here (a drop,
 *  and a stamp and its countersign, app/tracenet-stamp.mjs). */
export async function walletSigned(wallet, sig, text) {
  if (typeof wallet !== 'string' || typeof sig !== 'string') return false;
  try {
    const key = await crypto.subtle.importKey('raw', decode58(wallet, 32), 'Ed25519', false, ['verify']);
    return await crypto.subtle.verify('Ed25519', key, decode58(sig, 64), enc.encode(text));
  } catch { return false; }
}
/** Whether item.sig (base58, 64 bytes) is the Ed25519 signature of the register's wallet over the item's line. */
export async function verifyDropLine(register, item) {
  if (typeof register?.wallet !== 'string' || typeof item?.sig !== 'string') return false;
  return walletSigned(register.wallet, item.sig, lineOf(register, item));
}
/** The register with only the drops a reader may draw, newest first as given, each with `proof` ('nest' | 'signed') and, when signed, `linked`. */
export async function proveItems(register) {
  if (!register || !Array.isArray(register.items)) return register;
  const proof = new Map();
  let before = NO_PREV;   // the hash of the last signed line that verified, walking the chain from its first line
  for (const item of oldestFirst(register.items)) {
    if (typeof item.sig === 'string') {
      if (!await verifyDropLine(register, item)) continue;   // a signature that does not verify is a forged line: not drawn
      proof.set(item, { proof: 'signed', linked: (item.prev ?? NO_PREV) === before });
      before = await lineHash(lineOf(register, item));
    } else if (validReceipt(item)) proof.set(item, { proof: 'nest' });
  }
  return { ...register, items: register.items.filter((i) => proof.has(i)).map((i) => ({ ...i, ...proof.get(i) })) };
}
