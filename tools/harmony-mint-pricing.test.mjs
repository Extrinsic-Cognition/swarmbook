import test from 'node:test';
import assert from 'node:assert/strict';
import { quoteMintPriceLamports as quote } from './harmony-mint-pricing.mjs';

// Synthetic arithmetic fixtures, not live sale parameters.
const base = { startLamports: '7', stepLamports: '3', mintedCount: '0' };
const MAX = '18446744073709551615';

test('the first mint has the starting price; each successful mint increases the next quote', () => {
  assert.equal(quote(base), '7');
  assert.equal(quote({ ...base, mintedCount: '1' }), '10');
  assert.equal(quote({ ...base, mintedCount: '2' }), '13');
  assert.deepEqual(base, { startLamports: '7', stepLamports: '3', mintedCount: '0' });
});

test('values beyond Number precision remain exact through JSON transport', () => {
  const input = JSON.parse('{"startLamports":"9007199254740993","stepLamports":"2","mintedCount":"3"}');
  const output = quote(input);
  assert.equal(output, '9007199254740999');
  assert.equal(JSON.parse(JSON.stringify({ priceLamports: output })).priceLamports, output);
});

test('all three inputs are mandatory canonical unsigned decimal strings', () => {
  assert.throws(() => quote(), TypeError);
  for (const field of Object.keys(base)) {
    for (const value of [undefined, null, 1, 1n, NaN, Infinity, true, {}, [], '', '01', '-1', '+1', '1.0', '1e3', ' 1', '1 ', '1\n', '0x10', '９', '1'.repeat(1000)]) {
      assert.throws(() => quote({ ...base, [field]: value }), TypeError, `${field} rejects noncanonical input`);
    }
  }
});

test('start and increment must both be positive; zero existing mints is valid', () => {
  assert.throws(() => quote({ ...base, startLamports: '0' }), RangeError);
  assert.throws(() => quote({ ...base, stepLamports: '0' }), RangeError);
  assert.equal(quote({ startLamports: '1', stepLamports: '1', mintedCount: '0' }), '1');
});

test('every input and the resulting price must fit u64', () => {
  for (const field of Object.keys(base)) {
    assert.throws(() => quote({ ...base, [field]: '18446744073709551616' }), RangeError);
  }
  assert.equal(quote({ startLamports: MAX, stepLamports: MAX, mintedCount: '0' }), MAX);
  assert.equal(quote({ startLamports: '1', stepLamports: '1', mintedCount: '18446744073709551614' }), MAX);
  assert.throws(() => quote({ startLamports: MAX, stepLamports: '1', mintedCount: '1' }), RangeError);
  assert.throws(() => quote({ startLamports: '1', stepLamports: '1', mintedCount: MAX }), RangeError);
  assert.throws(() => quote({ startLamports: '1', stepLamports: MAX, mintedCount: '2' }), RangeError);
});

test('non-unit increments accept the last representable quote and reject the next', () => {
  assert.equal(quote({ startLamports: '2', stepLamports: '3', mintedCount: '6148914691236517204' }), '18446744073709551614');
  assert.throws(() => quote({ startLamports: '2', stepLamports: '3', mintedCount: '6148914691236517205' }), RangeError);
});
