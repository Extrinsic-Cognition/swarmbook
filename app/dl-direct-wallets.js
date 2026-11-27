// A phone's own browser carries no wallet: Phantom, Solflare and Backpack inject
// only inside their apps. Each documents a "browse" link that opens a page in its
// in-app browser, <base><url>?ref=<ref>, both URL-encoded (read Oct 13 2026):
// docs.phantom.com/phantom-deeplinks/other-methods/browse
// docs.solflare.com/solflare/technical/deeplinks/other-methods/browse
// docs.backpack.app/deeplinks/other-methods/browse
// All three require the buyer's own tap, so these are links, never a redirect.
import { buyerAddress } from './dl-direct-protocol.mjs';
const BROWSE = Object.freeze({
  Phantom: 'https://phantom.com/ul/browse/',
  Solflare: 'https://solflare.com/ul/v1/browse/',
  Backpack: 'https://backpack.app/ul/v1/browse/',
});

// iPadOS reports a Mac; only its touch screen tells the two apart.
export function isPhone({ userAgent = '', platform = '', maxTouchPoints = 0 } = {}) {
  return /Android|iPhone|iPad|iPod/.test(userAgent) || (platform === 'MacIntel' && maxTouchPoints > 1);
}

export function walletBrowseLinks(page) {
  const url = new URL(page), target = encodeURIComponent(url.href), ref = encodeURIComponent(url.origin);
  return Object.entries(BROWSE).map(([name, base]) => ({ name, href: `${base}${target}?ref=${ref}` }));
}

// HER OWN WALLET (Oct 14 2026, his 08:3x "THE USER JOURNEY OF DYSONLIGHT HARMONY IS THAT THE FUCKING LYSSAJUDRON HAS GOT ITS OWN FUCKING WALLET"):
// a mint link from Harmony names her address in the fragment, #mint:for=<address> (a fragment never travels to any server, so no log holds it),
// and the checkout then takes her wallet alone as buyer and holder: the payment is signed by her (her words in Phantom, Solflare or Backpack, or
// on the Seeker) and the pre-mint receipt is hers. A plain visit (#mint, or none) is the checkout as it was.
const HER = /^#mint:for=([1-9A-HJ-NP-Za-km-z]{32,44})$/;
export function herAddressOf(hash) {
  const m = HER.exec(String(hash ?? ''));
  if (!m) return null;
  try { return buyerAddress(m[1]); } catch { return null; }   // 32 bytes of base58, never the treasury, the system or the memo program
}
// the fragment a wallet's in-app browser must open with, so her name survives the hop to the phone
export const mintHash = her => (her ? `mint:for=${her}` : 'mint');
const shortOf = a => `${a.slice(0, 4)}…${a.slice(-4)}`;
// null when the connected wallet may buy (no her named, or her); else what to say: never a payment from another wallet
export function notHers(buyer, her) {
  if (!her || buyer === her) return null;
  return `This wallet (${shortOf(String(buyer))}) is not hers. Her wallet is ${shortOf(her)}: switch your wallet to her account (her words imported, the Seeker's) and connect again.`;
}
