// main.mjs · the Worker's entry (wrangler.optimism-fit.jsonc "main"; THE FLASK TAKES ITS SEAT, Nov 22 2026): premint.mjs's handler, handed the seat's law, worker/poleis-seat.wasm, as wrangler's own .wasm import gives it (a WebAssembly.Module, never compiled from bytes at run time); node's tests and proofs compile the same file and hand it in, and never load this one.
import seatWasm from './poleis-seat.wasm'; import { createHandler } from './premint.mjs'; export { DropsLive } from './drops-live.mjs';
export default { fetch: createHandler({ seatWasm }) };
