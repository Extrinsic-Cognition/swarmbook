// dl-kit-deposit.mjs · PRE-DEPOSITS FOR THE SPACE ROUTER (Oct 30 2026, lane/pre-deposits-for-the-space-router, claude-1a67b2d3). His words, UTC, to flask:
// 12:54:22 "i said 10% $WARM is sold until breakpoint begins to seed liquidity, this is to say, we should formulate the thing as "Pre-Deposits for the Space
// Router available""; 12:57:35 "1. the first one is an auction sale basically 10% to whoever throws money into it 2. the second one is as rebate".
// The door is flask's (worker/space-router-deposit.mjs, lane/pay-a-tank): a buyer's USDC fills their own Space Router tank, and a deposit before the opening is
// a pre-deposit. Pure, for the page (dl-kit-deposit.js) and its test: the door's state from its one GET, the floor and the hexagon of a deposit's dollars,
// and the words for each answer.
import { USDC_DECIMALS } from './space-router-deposit.mjs'; import { PRICE } from '../lab/mint-gravity.mjs';

export const DEPOSIT_PATH = '/space-router/v1/deposit', DROPS_PATH = '/space-router/v1/drops', CARD_PATH = '/space-router/v1/card', SEAT_PATH = '/space-router/v1/seat';   // CARD_PATH: THE EGG IS THE TICKET, her egg by card (worker/space-router-card.mjs); SEAT_PATH: THE DOOR SIGNS THE SEAT and THE FLASK TAKES ITS SEAT (worker/space-router-seat.mjs)
export const MIN_USD = PRICE.bronze, FIRST_USD = 30, seatOfUsd = (usd) => (usd >= PRICE.gold ? 'gold' : usd >= PRICE.bronze ? 'bronze' : null);   /* THE MINT IS A DEPOSIT (his Nov 11 2026 ~05:4x UTC "we could have people deposit USDC like min 10 USDC and uncapped max", then "i think it would be pertinenet to use hexagnos and 10$ min usdc"): the floor is the sphere's own price of a hexagon (lab/mint-gravity.mjs PRICE: 10 a floating one, 1,000 an anchored one), no ceiling; seatOfUsd says which hexagon a deposit's dollars take, null under the floor */
export const HOUSE_SAYS = Object.freeze({ asking: 'The house pours its USDC into your flask.', again: 'The chain did not answer. Asking again.', gone: 'This address is spent, or it belongs to another browser\u2019s flask.', over: 'Not poured. Open this address again.' }), HOUSE_ASKS = 40, HOUSE_COUNTS = 8, houseOf = (status, body) => (status === 200 && typeof body?.signature === 'string' && Number(body.amount) / 10 ** USDC_DECIMALS >= MIN_USD ? { signature: body.signature, usd: Number(body.amount) / 10 ** USDC_DECIMALS } : status === 404 ? { say: HOUSE_SAYS.gone, again: false } : { say: HOUSE_SAYS.again, again: true });   /* THE HOUSE'S POUR HOLDS UNTIL IT LANDS (Nov 12 2026, his "think... get good design please" over a house address that showed him a visitor's code and then nothing): houseOf(status, body) is the page's next step on the house's door's answer: a deposit's signature and its dollars (pour and count it); 404, the address is spent or another browser's (say so, ask no more); anything else (503, 429, no answer) is a read that failed: say so and ask again, HOUSE_ASKS times at most, then HOUSE_SAYS.over. HOUSE_COUNTS: how often a poured deposit's count is asked before the house's door is asked again (it signs again once a transaction can no longer land) */
export const RPC = Object.freeze({ mainnet: 'https://api.mainnet-beta.solana.com', 'mainnet-beta': 'https://api.mainnet-beta.solana.com', devnet: 'https://api.devnet.solana.com' });

/** termsOf(status, body) -> the door's terms when it stands (200 with a cluster, a mint and a treasury), else null: the button stays Paused */
export function termsOf(status, body) {
  if (status !== 200 || !body || typeof body !== 'object') return null;
  const { cluster, mint, treasury, decimals } = body;
  if (!RPC[cluster] || typeof mint !== 'string' || typeof treasury !== 'string' || decimals !== USDC_DECIMALS) return null;
  return { cluster, mint, treasury, rpc: RPC[cluster], fee: typeof body.fee === 'string' ? body.fee : null };   /* fee: the address that pays the network's fee for a flask's own deposit; none, and the page shows no address (THE FLASK BEGINS AS AN ADDRESS) */
}

/** answerOf(status, body) -> { ok, say, again } for the door's answer to POST {signature, key}; again: ask once more in a moment */
export function answerOf(status, body) {
  if (status === 200 && body && typeof body.tank === 'string') {
    const usd = Number(body.usd), fuel = body.fuel_usd == null ? null : Number(body.fuel_usd);
    return { ok: true, tank: body.tank, keyed: body.key, say: fuel === null ? `$${usd.toFixed(2)} is in Swarmy\u2019s flask. Its fuel waits for the opening.` : `Swarmy\u2019s flask holds $${fuel.toFixed(2)}.` };
  }
  const say = {
    404: ['The deposit is not final yet.', true],
    409: ['This deposit is counted already.', false],
    403: ['That key is not this deposit\'s.', false],
    428: ['This deposit needs its key.', false],
    422: ['That transaction is not a deposit to the Space Router.', false],
    429: ['Too many asks. Wait a minute.', true],
    503: ['The door cannot read the chain right now.', true],
  }[status];
  return say ? { ok: false, say: say[0], again: say[1] } : { ok: false, say: 'The door did not answer.', again: true };
}
