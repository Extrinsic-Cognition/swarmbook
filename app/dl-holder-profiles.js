// Public, read-only purchase profiles. No resolver requests, browser storage, signing or polling.
// A handle is the buyer's signed statement, not evidence they own the corresponding X account.
export const HOLDER_PROFILE_DESCRIPTION = 'X handle and picture supplied by the signing wallet; X account ownership is not verified.';
const MEMO_PROGRAM = 'MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr';
const MEMO_PREFIX = 'dl-harmony.v2 ';
const MAX_MEMO_BYTES = 600, HISTORY_LIMIT = 32, CONCURRENCY = 3, MAX_MEMBERS = 150;
const B58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
const utf8 = new TextEncoder(), decoder = new TextDecoder('utf-8', { fatal: true });

export function twitterName(input) {
  if (typeof input !== 'string' || input.length > 100) return null;
  const match = input.trim().match(/^(?:(?:https?:\/\/)?(?:www\.)?(?:x\.com|twitter\.com)\/)?@?([A-Za-z0-9_]{1,15})\/?$/i);
  return match ? match[1].toLowerCase() : null;
}
export const normalizeTwitterName = twitterName;

function githubName(input) {
  if (typeof input !== 'string' || input.length > 120) return null;
  const match = input.trim().match(/^(?:(?:https?:\/\/)?(?:www\.)?github\.com\/)?@?([A-Za-z0-9](?:[A-Za-z0-9-]{0,37}[A-Za-z0-9])?)\/?$/i);
  return match ? match[1].toLowerCase() : null;
}

/** Restrict public pictures to Twitter's image CDN, never a buyer-selected tracking host. */
export function validateAvatarURL(input) {
  if (typeof input !== 'string' || input.length > 512 || /[\s\\%]/.test(input)) return null;
  try {
    const url = new URL(input);
    if (url.protocol !== 'https:' || url.hostname !== 'pbs.twimg.com' || url.username || url.password || url.port || url.hash) return null;
    // Reject explicit ports even when URL normalizes the default :443 away.
    if (!/^https:\/\/pbs\.twimg\.com\//.test(input)) return null;
    if (!/^\/profile_images\/[0-9]{1,32}\/[A-Za-z0-9_-]{1,200}(?:\.(?:jpe?g|png|webp|gif))?$/.test(url.pathname)) return null;
    const seen = new Set();
    for (const [key, value] of url.searchParams) {
      if (seen.has(key)) return null;
      seen.add(key);
      if (key === 'format' && /^(?:jpe?g|png|webp|gif)$/.test(value)) continue;
      if (key === 'name' && /^(?:normal|small|medium|large|orig)$/.test(value)) continue;
      if (key === 'name' && /^[1-9][0-9]{0,3}x[1-9][0-9]{0,3}$/.test(value) && value.split('x').every(n => Number(n) <= 4096)) continue;
      return null;
    }
    return url.href.length <= 512 ? url.href : null;
  } catch { return null; }
}

/** Optional profile: null preserves the existing GitHub-only memo. Invalid input fails closed. */
export function slotProfileMemo(github, profile = null) {
  const name = githubName(github);
  if (!name) return null;
  if (profile === null) return `dl-harmony · github.com/${name}`;
  const handle = twitterName(profile?.handle), picture = validateAvatarURL(profile?.avatarUrl);
  if (!handle || !picture) return null;
  const memo = MEMO_PREFIX + JSON.stringify({ github: name, twitter: handle, picture });
  return utf8.encode(memo).length <= MAX_MEMO_BYTES ? memo : null;
}

function memoProfile(text) {
  if (typeof text !== 'string' || !text.startsWith(MEMO_PREFIX) || utf8.encode(text).length > MAX_MEMO_BYTES) return null;
  try {
    const value = JSON.parse(text.slice(MEMO_PREFIX.length));
    if (!value || Array.isArray(value) || Object.keys(value).sort().join(',') !== 'github,picture,twitter') return null;
    // Exact canonical form rejects duplicate keys, unknown fields and ambiguous encodings.
    if (slotProfileMemo(value.github, { handle: value.twitter, avatarUrl: value.picture }) !== text) return null;
    return { handle: value.twitter, avatarUrl: value.picture };
  } catch { return null; }
}

function decode58(text, maxBytes) {
  if (typeof text !== 'string' || text.length > Math.ceil(maxBytes * 1.38) || !text.length) return null;
  let number = 0n;
  for (const char of text) {
    const digit = B58.indexOf(char);
    if (digit < 0) return null;
    number = number * 58n + BigInt(digit);
  }
  const bytes = [];
  while (number) { bytes.push(Number(number & 255n)); number >>= 8n; }
  for (const char of text) { if (char !== '1') break; bytes.push(0); }
  return bytes.length <= maxBytes ? Uint8Array.from(bytes.reverse()) : null;
}

function u64(value) {
  if (typeof value === 'number' && (!Number.isSafeInteger(value) || value < 0)) throw new Error('invalid integer');
  if (!['string', 'number', 'bigint'].includes(typeof value) || !/^(?:0|[1-9][0-9]{0,19})$/.test(String(value))) throw new Error('invalid integer');
  const result = BigInt(value);
  if (result > 18446744073709551615n) throw new Error('invalid integer');
  return result;
}

/**
 * Consume only members from the confirmed sale-account reader. A matching successful top-level
 * commit is required for every profile; a later memo, RPC history memo or local event is no proof.
 * RPC trust is the same as the existing confirmed membership reader, not a new cryptographic node.
 * Cost: <=32 history entries per uncached member, three concurrent jobs, no automatic retries.
 */
export function createHolderProfileReader({ conn, P, web3, root, sale = 0n, onProfiles = () => {} }) {
  root = u64(root); sale = u64(sale);
  const key = value => new web3.PublicKey(value).toBase58();
  const program = key(P.PROGRAM_ID);
  let current = new Map(), stopped = false, active = 0;
  const queue = [];
  const profiles = () => [...current.values()].flatMap(member => member.profile ? [{ ...member.profile }] : []);
  const emit = () => { if (!stopped) { try { onProfiles(profiles()); } catch { /* A view error cannot turn into an RPC retry. */ } } };
  const live = member => !stopped && current.get(member.id) === member;

  function normalize(input) {
    try {
      if (!input || typeof input.id !== 'string' || typeof input.bidder !== 'string') return null;
      const bidder = key(input.bidder), split = input.id.split(':');
      if (bidder !== input.bidder || split.length !== 2 || split[0] !== bidder) return null;
      const nonce = u64(split[1]);
      if (input.id !== `${bidder}:${nonce}` || (input.nonce !== undefined && u64(input.nonce) !== nonce)) return null;
      const publicKey = new web3.PublicKey(bidder), bidAccount = P.seatBidPda(root, sale, publicKey, nonce);
      if (input.bidAccount !== undefined && key(input.bidAccount) !== key(bidAccount)) return null;
      const expected = P.commitSeatBid(publicKey, root, sale, nonce, new Uint8Array(32));
      return { id: input.id, bidder, nonce, bidAccount, expected, settled: false, profile: null, job: null };
    } catch { return null; }
  }

  function purchase(tx, history, member) {
    try {
      if (!tx || tx.meta?.err !== null || tx.slot !== history.slot || !Number.isSafeInteger(tx.slot) || tx.slot < 0) return null;
      if (tx.transaction?.signatures?.[0] !== history.signature) return null;
      const message = tx.transaction.message;
      if (!Array.isArray(message?.instructions) || !Array.isArray(message.accountKeys)) return null;
      const bidder = message.accountKeys.find(account => key(account.pubkey) === member.bidder);
      if (bidder?.signer !== true || bidder?.writable !== true) return null;
      const bid = message.accountKeys.find(account => key(account.pubkey) === key(member.bidAccount));
      if (bid?.writable !== true) return null;
      const expectedKeys = member.expected.keys.map(account => key(account.pubkey));
      const commit = message.instructions.some(ix => {
        if (key(ix.programId) !== program || !Array.isArray(ix.accounts) || ix.accounts.length !== expectedKeys.length) return false;
        if (!ix.accounts.every((account, i) => key(account) === expectedKeys[i])) return false;
        const data = decode58(ix.data, 57);
        return data?.length === 57 && member.expected.data.slice(0, 25).every((byte, i) => byte === data[i]);
      });
      if (!commit) return null;
      const candidates = [];
      for (const ix of message.instructions) {
        if (key(ix.programId) !== MEMO_PROGRAM) continue;
        let text;
        if (typeof ix.parsed === 'string') {
          // jsonParsed omits Memo accounts. The verified bidder transaction signature covers
          // every top-level instruction, including the memo's exact contents.
          text = ix.parsed;
        } else {
          if (!Array.isArray(ix.accounts) || !ix.accounts.some(account => key(account) === member.bidder)) continue;
          const data = decode58(ix.data, MAX_MEMO_BYTES);
          if (!data) continue;
          try { text = decoder.decode(data); } catch { continue; }
        }
        if (text?.startsWith(MEMO_PREFIX)) candidates.push(memoProfile(text));
      }
      // A proven commit without exactly one valid profile is a cacheable absence.
      const profile = candidates.length === 1 ? candidates[0] : null;
      return { profile: profile && { id: member.id, bidder: member.bidder, ...profile,
        profileUrl: `https://x.com/${profile.handle}`, signature: history.signature } };
    } catch { return null; }
  }

  async function resolve(member) {
    const history = await conn.getSignaturesForAddress(member.bidAccount, { limit: HISTORY_LIMIT }, 'confirmed');
    if (!live(member) || !Array.isArray(history)) return;
    // History arrives newest first. Looking at the oldest bounded entry first normally finds
    // the initial commit before its reveal/claim/close transactions.
    for (const entry of history.slice(0, HISTORY_LIMIT).reverse()) {
      if (!live(member)) return;
      if (entry?.err !== null || !['confirmed', 'finalized'].includes(entry.confirmationStatus) || !Number.isSafeInteger(entry.slot) || entry.slot < 0) continue;
      if (decode58(entry.signature, 64)?.length !== 64) continue;
      let tx;
      try { tx = await conn.getParsedTransaction(entry.signature, { commitment: 'confirmed', maxSupportedTransactionVersion: 0 }); }
      catch { continue; }
      if (!live(member)) return;
      const proof = purchase(tx, entry, member);
      if (proof) {
        member.profile = proof.profile;
        member.settled = true;
        emit();
        return;
      }
    }
    // Unknown/pruned history, unavailable transactions and RPC errors remain retryable on
    // the next caller update. Nothing schedules its own retry.
  }

  function pump() {
    while (active < CONCURRENCY && queue.length) {
      const { member, done } = queue.shift();
      if (!live(member)) { member.job = null; done(); continue; }
      active++;
      resolve(member).catch(() => {}).finally(() => {
        member.job = null; active--; done(); pump();
      });
    }
  }

  return {
    async update(members) {
      if (stopped) return [];
      const next = new Map();
      for (const input of (Array.isArray(members) ? members : []).slice(0, MAX_MEMBERS)) {
        const member = normalize(input);
        if (member && !next.has(member.id)) next.set(member.id, current.get(member.id) || member);
      }
      current = next; // Removed jobs lose authority to publish, even if the same ID returns later.
      emit();
      const jobs = [];
      for (const member of current.values()) {
        if (member.settled) continue;
        if (!member.job) member.job = new Promise(done => queue.push({ member, done }));
        jobs.push(member.job);
      }
      pump();
      await Promise.all(jobs);
      return stopped ? [] : profiles();
    },
    dispose() {
      stopped = true; current.clear();
      for (const { member, done } of queue.splice(0)) { member.job = null; done(); }
      // web3 RPC requests cannot be aborted here. In-flight results are discarded by live().
    },
  };
}
