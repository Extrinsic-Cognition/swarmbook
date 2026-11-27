// Public referral presentation only. No registry, registration, wallet or mint
// operation is implemented here. The current runtime has no referral registry.
// One load on mount; refresh is explicit. Nothing polls or writes at rest.
//
// load() contract (the caller unwraps the Nest ref's `value`):
// {
//   projection: null | { schema: 'society.referrals/1', state: 'unavailable' }
//     | { schema: 'society.referrals/1', state: 'ready', code, shareURL,
//         referrer, receipts: [{ state, network, program, receipt, originalBuyer }] },
//   wallet: { holder: <32-byte base58 address> | null, mintReady?: boolean }
// }
// A ready projection MUST come from an upstream authority which verified the
// canonical on-chain issuance AND its durable referral attribution. These
// browser checks validate presentation data; they do not verify chain evidence.
// The original buyer is required even for `confirmed` observations; the upstream
// projection obtains it from the immutable receipt, never the current NFT owner.
// Only confirmed/already-issued records count, deduplicated by chain/program/
// receipt. Other states (including paid, pending and customization) never count.
// Previously verified issuance still counts while new minting is unavailable.
// A share URL has exactly one query parameter: ?ref=<code>, or /referral?code=.
// No credentials, fragments, other query parameters or unapproved origins.
//
// mountReferralCard({root, load, clipboard?}) -> {ready, refresh, destroy}.
// clipboard is an object with writeText(text); defaults to navigator.clipboard.
// ready/refresh resolve to the rendered model. destroy invalidates late work.
export const REFERRAL_SCHEMA = 'society.referrals/1';
export const REFERRAL_PROGRAM = 'AJdsmjxQjHnBxDEdRxwEk2UMRW7bgNmvEMUwMziRTyab';
export const REFERRAL_NETWORK = 'solana-mainnet-beta';
const ORIGINS = new Set(['https://optimism.fit', 'https://www.optimism.fit', 'https://embertide.gg', 'https://www.embertide.gg']);
const ISSUED = new Set(['confirmed', 'already-issued']);
const BASE58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
const plain = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const unavailable = () => ({ state: 'unavailable' });
const invalid = () => ({ state: 'error' });

function address(value) {
  if (typeof value !== 'string' || value.length < 32 || value.length > 44) return false;
  let number = 0n;
  for (const char of value) {
    const digit = BASE58.indexOf(char);
    if (digit < 0) return false;
    number = number * 58n + BigInt(digit);
  }
  if (number === 0n) return false;
  let bytes = 0;
  while (number) { bytes++; number >>= 8n; }
  for (const char of value) { if (char !== '1') break; bytes++; }
  return bytes === 32;
}

function shareLink(value, code) {
  if (typeof value !== 'string' || value.length > 2048 || /[\s\u0000-\u001f\u007f]/.test(value) || !value.startsWith('https://')) return null;
  try {
    const url = new URL(value), entries = [...url.searchParams];
    if (!ORIGINS.has(url.origin) || url.username || url.password || url.hash || value.includes('#') || entries.length !== 1) return null;
    const [[name, supplied]] = entries;
    if (supplied !== code || !(name === 'ref' || (name === 'code' && url.pathname === '/referral'))) return null;
    return url.href;
  } catch { return null; }
}

export function referralModel(input) {
  if (!plain(input)) return invalid();
  const projection = input.projection;
  if (projection == null) return unavailable();
  if (!plain(projection) || projection.schema !== REFERRAL_SCHEMA) return invalid();
  if (projection.state === 'unavailable') return unavailable();
  if (projection.state !== 'ready' || typeof projection.code !== 'string' || !/^[A-Za-z0-9_-]{4,64}$/.test(projection.code) ||
      !address(projection.referrer) || !Array.isArray(projection.receipts) || projection.receipts.length > 10000) return invalid();
  if (!input.wallet || input.wallet.holder == null) return unavailable();
  if (!address(input.wallet.holder) || input.wallet.holder !== projection.referrer) return invalid();
  const shareURL = shareLink(projection.shareURL, projection.code);
  if (!shareURL) return invalid();
  const seen = new Map();
  for (const row of projection.receipts) {
    if (!plain(row) || typeof row.state !== 'string') return invalid();
    if (!ISSUED.has(row.state)) continue;
    if (row.network !== REFERRAL_NETWORK || row.program !== REFERRAL_PROGRAM || !address(row.receipt) ||
        !address(row.originalBuyer) || row.originalBuyer === projection.referrer) return invalid();
    const key = `${row.network}:${row.program}:${row.receipt}`;
    if (seen.has(key) && seen.get(key) !== row.originalBuyer) return invalid();
    seen.set(key, row.originalBuyer);
  }
  return Object.freeze({ state: 'ready', code: projection.code, shareURL, confirmedSeats: seen.size });
}

export function mountReferralCard({ root, load, clipboard = globalThis.navigator?.clipboard } = {}) {
  if (!root?.ownerDocument || typeof load !== 'function') throw new TypeError('A root element and referral loader are required');
  const document = root.ownerDocument;
  let revision = 0, destroyed = false;
  const element = (tag, className, text) => {
    const node = document.createElement(tag);
    node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  function render(model, ticket) {
    const card = element('section', 'referral-card');
    card.dataset.state = model.state;
    card.setAttribute('aria-label', 'Society referrals');
    const title = element('h3', 'referral-title', 'Invite friends');
    const status = element('p', 'referral-status');
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    card.append(title);
    if (model.state === 'ready') {
      const code = element('button', 'referral-code', model.code);
      code.type = 'button';
      code.setAttribute('aria-label', `Copy referral code ${model.code}`);
      const link = element('button', 'referral-link', 'Copy link');
      link.type = 'button';
      const copy = (button, value, label) => async () => {
        if (destroyed || ticket !== revision || button.disabled) return;
        button.disabled = true;
        try {
          if (typeof clipboard?.writeText !== 'function') throw new Error('clipboard unavailable');
          await clipboard.writeText(value);
          if (!destroyed && ticket === revision) status.textContent = `${label} copied.`;
        } catch {
          if (!destroyed && ticket === revision) status.textContent = `Couldn’t copy the ${label.toLowerCase()}. Try again.`;
        } finally { if (!destroyed && ticket === revision) button.disabled = false; }
      };
      code.addEventListener('click', copy(code, model.code, 'Code'));
      link.addEventListener('click', copy(link, model.shareURL, 'Link'));
      card.append(code, link, element('p', 'referral-count', `${model.confirmedSeats} confirmed ${model.confirmedSeats === 1 ? 'seat' : 'seats'}`));
    } else if (model.state === 'loading') {
      status.textContent = 'Loading referrals…';
    } else if (model.state === 'unavailable') {
      status.textContent = 'Referral codes aren’t available yet.';
    } else {
      status.textContent = 'Referrals couldn’t be loaded.';
      const retry = element('button', 'referral-retry', 'Try again');
      retry.type = 'button';
      retry.addEventListener('click', () => { void refresh(); });
      card.append(retry);
    }
    card.append(element('p', 'referral-criterion', 'A referral counts when your friend mints a Society seat.'), status);
    root.replaceChildren(card);
  }
  async function refresh() {
    if (destroyed) return { state: 'destroyed' };
    const ticket = ++revision;
    render({ state: 'loading' }, ticket);
    let model;
    try { model = referralModel(await load()); } catch { model = invalid(); }
    if (!destroyed && ticket === revision) render(model, ticket);
    return model;
  }
  const ready = refresh();
  return Object.freeze({ ready, refresh, destroy() { destroyed = true; revision++; root.replaceChildren(); } });
}
