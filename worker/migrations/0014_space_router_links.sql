-- 0014_space_router_links.sql · A STAKE PAYS ITS TANK (Oct 30 2026, worker/space-router-link.mjs). A staker's own link of a stake account to their tank, signed
-- with the stake's withdraw authority and checked on chain when it is made. The epoch crank (tools/embertide-mesh/pool/crank.mjs epoch --edge) pours each linked
-- stake's reward into its tank; his hand writes. The signature is the link's receipt; nothing here is a key.
CREATE TABLE IF NOT EXISTS sr_links (
  stake TEXT PRIMARY KEY,
  authority TEXT NOT NULL,
  tank TEXT NOT NULL,
  cluster TEXT NOT NULL CHECK (cluster IN ('mainnet', 'devnet')),
  signed_at INTEGER NOT NULL,
  linked_at INTEGER NOT NULL,
  signature TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS sr_links_tank ON sr_links(tank);
