const U64_MAX = (1n << 64n) - 1n;
const uint = value => {
  if (typeof value === 'bigint') return value >= 0n && value <= U64_MAX ? value : null;
  if (typeof value === 'number') return Number.isSafeInteger(value) && value >= 0 ? BigInt(value) : null;
  if (typeof value === 'string' && /^(0|[1-9]\d*)$/.test(value)) {
    const number = BigInt(value); return number <= U64_MAX ? number : null;
  }
  return null;
};
const bytes32 = value => (value instanceof Uint8Array || Array.isArray(value)) && value.length === 32
  && Array.from(value).every(byte => Number.isInteger(byte) && byte >= 0 && byte <= 255);
const sameBytes = (a, b) => bytes32(a) && bytes32(b) && Array.from(a).every((byte, i) => byte === b[i]);
const base58Key = value => typeof value === 'string' && /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(value);
const sameRoot = (a, b) => uint(a) !== null && uint(b) !== null && uint(a) === uint(b);

/** Read only verified registry objects supplied by the chain reader. This does
 * not turn a browser flag or a body-provided member list into chain evidence. */
export function membershipForKey(registries, unitIds, key, {holderKeyKind = 1} = {}) {
  if (!(registries instanceof Map) || !Array.isArray(unitIds) || !bytes32(key)) return [];
  const result = [];
  for (const inputId of [...new Set(unitIds.map(String))]) {
    if (uint(inputId) === null) return [];
    const registry = registries.get(inputId);
    if (!registry || !Array.isArray(registry.holders) || registry.holders.length > 150
      || !Array.isArray(registry.pentagons) || registry.pentagons.length !== 12) return [];
    let count = 0n;
    for (const holder of registry.holders) {
      if (!holder || uint(holder.seats) === null) return [];
      if (holder.kind !== holderKeyKind) continue;
      if (!bytes32(holder.holder)) return [];
      if (sameBytes(holder.holder, key)) count += uint(holder.seats);
    }
    if (count > U64_MAX) return [];
    const chairs = [];
    for (let i = 0; i < registry.pentagons.length; i++) {
      const chair = registry.pentagons[i];
      if (!chair || chair.kind !== holderKeyKind) continue;
      if (!bytes32(chair.holder)) return [];
      if (!sameBytes(chair.holder, key)) continue;
      // The registry owns access. A term does not revoke a chair until the
      // protocol changes its holder; mirror the body's seat-or-chair rule.
      chairs.push(i);
    }
    if (count > 0n || chairs.length) result.push({id: inputId, seats: count, chairs});
  }
  return result;
}

/** Reject a socket's challenge before asking the selected key to sign it. */
export function bodyChallenge(message, {program, root} = {}) {
  if (!message || message.t !== 'challenge' || !base58Key(program) || message.program !== program
    || !sameRoot(message.root, root) || !base58Key(message.body)
    || typeof message.nonce !== 'string' || !/^[0-9a-f]{32}$/i.test(message.nonce)) return null;
  return {body: message.body, nonce: message.nonce,
    signingText: `poleis:hello:v1|${program}|${message.root}|${message.nonce}`};
}

/** UI eligibility requires two separate proofs: a current chain membership
 * read and an authenticated session bound to the same selected key and tree. */
export function canReadPrivate({membership, chainVerified, chainFresh, session, key, program, root} = {}) {
  if (chainVerified !== true || chainFresh !== true || !base58Key(key) || !base58Key(program)
    || !Array.isArray(membership) || !session || session.state !== 'in' || session.authenticated !== true
    || session.key !== key || session.program !== program || !sameRoot(session.root, root)) return false;
  return membership.some(entry => entry && uint(entry.id) !== null && uint(entry.seats) !== null
    && (uint(entry.seats) > 0n || (Array.isArray(entry.chairs) && entry.chairs.some(chair => Number.isInteger(chair) && chair >= 0 && chair < 12))));
}

/** Verify locally; the wire's `verified: true` field is not a proof. */
export async function verifyPrivateText(text, expectedHash) {
  if (typeof text !== 'string' || text.length > 1_048_576) return false;
  const expected = typeof expectedHash === 'string' && /^[0-9a-f]{64}$/i.test(expectedHash)
    ? Uint8Array.from(expectedHash.match(/../g), pair => parseInt(pair, 16)) : expectedHash;
  if (!bytes32(expected)) return false;
  try {
    const encoded = new TextEncoder().encode(text);
    if (encoded.length > 1_048_576) return false;
    const digest = new Uint8Array(await crypto.subtle.digest('SHA-256', encoded));
    return sameBytes(digest, expected);
  } catch { return false; }
}

/** Drop private UI material on key change, revocation, disconnect or stale
 * chain state. Already delivered information cannot be recalled from a reader. */
export function revokePrivateData(state = {}) {
  return {...state, state: 'closed', authenticated: false, key: null, pubkey: null,
    member: null, charter: null, texts: new Map(), messages: [], challenge: null};
}
