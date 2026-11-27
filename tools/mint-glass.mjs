#!/usr/bin/env node
// mint-glass.mjs: HIS HAND ON THE MINT'S GLASS (lab/glass-look.mjs). His words, Oct 17 2026 WEST: 20:4x "it must be a glass i. dont want to seethis it
// must be transparent"; 20:5x "are you kidding me? what do i gotta do to be able to edit this manually?"; 21:1x "it is a massive failure if i cant edit in
// my canvas-mcp my dude". The serving Mac's hands (tools/embertide-mesh/house-hands.mjs, "Mint glass: ...", pressed from the Canvas's hands bar) run
// this with one fixed word each:
//   none     the glass is transparent always: the film seen through its faces, no opaque pass (the default, with no word on the Nest)
//   cuts     THE CUTS' flash at a burst's first fifth of a second (the normals, then the gold matte), only while the film plays
//   status   reads only: what the Nest holds now
// It writes the Nest's ref mint/glass {pass, by, at} by compare-and-set (one write of about 150 B; the same word again writes nothing). The mint page
// reads it once at its load on his house's doors, so a page open now takes it at its next load. No text from the Nest reaches a shell; nothing runs on.
//   node mint-glass.mjs none|cuts|status [--nest http://127.0.0.1:8904]
import {realpathSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {GLASS_REF, PASSES, lookOf} from '../lab/glass-look.mjs';

export const SAYS = Object.freeze({none: 'transparent always', cuts: 'the CUTS flash at each burst while the film plays'});

/** The ref's value for a word: {pass, by, at}; a word other than none or cuts is refused. */
export function valueOf(word, {by = 'his press on the Canvas (house-hands, mint-glass.mjs)', at = Date.now()} = {}) {
  if (!PASSES.includes(word)) throw new Error(`mint-glass: a word of ${PASSES.join(', ')} or status`);
  return {pass: word, by, at};
}

/** One press: read the ref, and for none or cuts write it unless it already says that word. Returns the receipt's one line. */
export async function press(word, {nest = 'http://127.0.0.1:8904', seat = 'house-hands-oldmac', fetch = globalThis.fetch, now = Date.now} = {}) {
  const base = nest.replace(/\/$/, ''), url = `${base}/nest/ref/${GLASS_REF}`;
  const read = await fetch(url, {cache: 'no-store', signal: AbortSignal.timeout(5000)});
  if (!read.ok) throw new Error(`mint-glass: the Nest answered ${read.status} to the read`);
  const ref = (await read.json())?.ref ?? null, held = ref ? lookOf(ref.value).pass : null;
  if (word === 'status') return held ? `mint/glass says ${held} (${SAYS[held]}), rev ${ref.rev}` : 'no word on the Nest: the glass is transparent always';
  const value = valueOf(word, {at: now()});
  if (held === word) return `already ${word} (${SAYS[word]}), rev ${ref.rev}: nothing written`;
  const r = await fetch(url, {method: 'POST', headers: {'content-type': 'application/json'}, signal: AbortSignal.timeout(5000),
    body: JSON.stringify({seat, value, expect: ref ? ref.rev : 0, cause: []})});
  if (r.status === 409) return 'another hand wrote mint/glass meanwhile: press again to read it';
  if (!r.ok) throw new Error(`mint-glass: the Nest answered ${r.status} to the write`);
  const rev = (await r.json().catch(() => null))?.ref?.rev ?? (ref ? ref.rev + 1 : 1);
  return `the mint's glass is ${SAYS[word]} from its next load (mint/glass rev ${rev})`;
}

const isMain = (() => { try { return realpathSync(process.argv[1] || '') === realpathSync(fileURLToPath(import.meta.url)); } catch { return false; } })();
if (isMain) {
  const args = process.argv.slice(2), at = args.indexOf('--nest'), word = args.find((a, i) => !a.startsWith('--') && args[i - 1] !== '--nest');
  if (![...PASSES, 'status'].includes(word)) { console.log('mint-glass: say none, cuts or status'); process.exit(2); }
  press(word, {nest: at >= 0 ? args[at + 1] : process.env.NEST || 'http://127.0.0.1:8904', seat: process.env.HANDS_SEAT || 'house-hands-oldmac'})
    .then((line) => console.log(line))
    .catch((error) => { console.log(String(error.message || error).slice(0, 180)); process.exit(1); });
}
