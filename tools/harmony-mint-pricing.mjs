// Local quote arithmetic only. This does not authenticate a mint count, reserve
// a price, create a transaction or enforce a price on chain. The future mint
// instruction must enforce the same law against its authoritative successful-
// mint count. No live starting price or increment is chosen here.
const U64_MAX = (1n << 64n) - 1n;

function u64(value, name, positive = false) {
  // JSON transports canonical decimal strings, never rounded JS numbers.
  if (typeof value !== 'string' || value.length > 20 || value.trim() !== value || !/^(0|[1-9][0-9]*)$/.test(value)) {
    throw new TypeError(`${name} must be a canonical unsigned decimal string`);
  }
  const parsed = BigInt(value);
  if (parsed > U64_MAX || (positive && parsed === 0n)) {
    throw new RangeError(`${name} must be ${positive ? 'positive and ' : ''}within u64`);
  }
  return parsed;
}

/** Quote the next mint: startLamports + mintedCount * stepLamports.
 * mintedCount is the number of successful mints BEFORE this mint: 0 gives the
 * starting price. A production caller must supply the authoritative on-chain
 * count; this pure function cannot verify that input. All inputs and the output
 * are canonical decimal strings so JSON preserves every lamport exactly. */
export function quoteMintPriceLamports({ startLamports, stepLamports, mintedCount } = {}) {
  const start = u64(startLamports, 'startLamports', true);
  const step = u64(stepLamports, 'stepLamports', true);
  const count = u64(mintedCount, 'mintedCount');
  if (count > (U64_MAX - start) / step) {
    throw new RangeError('mint price exceeds u64');
  }
  return (start + count * step).toString();
}
