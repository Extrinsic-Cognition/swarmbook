// space-router-deposit.fixture.mjs · a finalized deposit as a node answers getTransaction in jsonParsed, for the law's and the door's tests and nothing else.
import { DEPOSIT_TERMS, TOKEN_PROGRAM, USDC_MINT, USDC_DECIMALS } from './space-router-deposit.mjs';
import { MEMO, encode58 } from './dl-direct-protocol.mjs';

const address = () => encode58(crypto.getRandomValues(new Uint8Array(32)));
const bal = (accountIndex, owner, amount, mint = USDC_MINT, decimals = USDC_DECIMALS) => ({ accountIndex, mint, owner, uiTokenAmount: { amount: String(amount), decimals } });
/** a finalized transaction as a node answers it in jsonParsed: the payer, its account, the treasury; the balances before and after; its instructions */
export function parsedTx({ payer, owner, treasury, before = 100_000_000, paid = 30_000_000, raised = paid, memo = DEPOSIT_TERMS, extra = [], err = null, mint = USDC_MINT, signer = true, decimals }) {
  const source = address(), keys = [{ pubkey: payer, signer, writable: true }, { pubkey: source, signer: false, writable: true }, { pubkey: treasury, signer: false, writable: true }];
  const memos = (Array.isArray(memo) ? memo : memo === null ? [] : [memo]).map((m) => ({ program: 'spl-memo', programId: MEMO, parsed: m }));
  return { slot: 41, blockTime: 1_900_000_000, transaction: { signatures: [encode58(crypto.getRandomValues(new Uint8Array(64)))], message: { accountKeys: keys,
    instructions: [...extra, ...memos, { program: 'spl-token', programId: TOKEN_PROGRAM, parsed: { type: 'transferChecked' } }] } },
    meta: { err, preTokenBalances: [bal(1, payer, before, mint, decimals), bal(2, owner, 5_000_000, mint, decimals)],
      postTokenBalances: [bal(1, payer, before - paid, mint, decimals), bal(2, owner, 5_000_000 + raised, mint, decimals)] } };
}
