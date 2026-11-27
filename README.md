# Swarmbook (`swarmbook.com` / `optimism.fit`)

The web social, economic, and Open-Traces surface for **Extrinsic Cognition** — built as a zero-framework Cloudflare Worker + D1 + R2 + Durable Objects application paired with Solana wallets and Stripe.

> **Status:** Standalone clean cut from `house/embertide-app/ui/intro/dyson-society` · **PRIVATE until public launch & licensing confirmation.**

## Architecture

- **Cloudflare Worker (`wrangler.optimism-fit.jsonc`, `worker/`):**
  - Custom domains: `optimism.fit`, `www.optimism.fit`, `swarmbook.com`, `www.swarmbook.com`
  - Bindings: D1 (`DB` / `optimism-fit-premint`, 37 SQL migrations in `worker/migrations/`), R2 (`VAULT` / `optimism-fit-vault`), Durable Object (`DROPS_LIVE` / `DropsLive`)
  - Routes: `/`, `/referral`, `/claim`, `/api/premint/*`, `/space-router/*`, `/wish`, `/.well-known/apple-app-site-association`, `/.well-known/assetlinks.json`, `/vault/*`
  - Large media assets (`.mp4`, `.m4a`, `.dmg`) are hosted in R2 `VAULT`, not stored in git.
- **Frontend (`app/`):**
  - Swarmbook views (`swarmbook-*.mjs`), TraceNet creator pages (`tracenet*.mjs`), Poleis/\$WARM UI, Phantom/Solflare/Backpack Solana flows, and Space Router billing.
- **Vendored Shared Modules (`vendor/`):**
  - Self-contained copies of shared 3D/orb/font/CSS/crypto modules (`der.mjs`, `attest.mjs`, `society-referrals.mjs`, `poleis/client/tests/permit-vector.json`, etc.) so this repository builds and tests cleanly outside the monorepo.

## Running Worker & App Tests (Standalone)

```bash
# Cloudflare Worker tests
node --test worker/*.test.mjs

# Standalone frontend tests
node --test app/swarmbook-*.test.mjs app/tracenet*.test.mjs
```

> Note: A small subset of cross-monorepo parity tests in `app/` inspect sibling desktop/iOS source trees (`harmony-clip`, `embertide-app/ui/intro/room`) when run inside the full monorepo.

## License

- Licensed under [AGPL-3.0](LICENSE) (see [NOTICE](NOTICE)). Commercial dual licensing is available from Extrinsic Cognition, Inc.
