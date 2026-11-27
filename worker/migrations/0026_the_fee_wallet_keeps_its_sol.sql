-- 0026_the_fee_wallet_keeps_its_sol.sql · THE FEE WALLET KEEPS ITS SOL (Nov 20 2026, worker/space-router-deposit.mjs `relay`). His word that day, to the
-- audit's "Which do I fix first?": "The mint's door". The leak the audit read: the door paid the fee of any deposit a flask signed and kept no memory of
-- one in flight, so many relays of the same 10 USDC went out together, one landed, and the fee wallet was charged for every one that failed on the chain.
-- One row per flask whose deposit the door sent: the flask's address, the transaction's signature (the fee key's, known before the send) and when. It is
-- written before the send and stands for two minutes (RELAY_MS: a relayed deposit's blockhash lives about a minute, so by then it has landed or never
-- will); while it stands the door sends no other deposit for that flask. A send the node itself refused took nothing, and its row is taken back at once.
CREATE TABLE IF NOT EXISTS sr_relays (
  owner TEXT PRIMARY KEY,
  signature TEXT NOT NULL,
  at INTEGER NOT NULL
);
