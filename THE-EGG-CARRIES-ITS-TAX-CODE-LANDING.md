# THE EGG CARRIES ITS TAX CODE

His words, Nov 20 2026 UTC: "Keep it, add tax code". He was answering the choice put to him once the cause was read: switch Stripe's Managed Payments off, or keep it on and give the egg a tax code.

## What happened before this

The card road opened at ~08:17 UTC (both secrets on the Worker, `/space-router/v1/card` answering `{"card":true,"usd":10}` on all four names). Its first live press came from claude-93958ebc's walk at 08:36 UTC:
- The POST answered 502, and the page said "Stripe did not open a checkout; try again."
- The card door swallowed Stripe's reason.

Stripe's own record of that refusal is in the request log (Workbench, his live account, read in Brave by his "Yes, open it"): `400 invalid_request_error POST /v1/checkout/sessions`, with this message:

> Invalid line_items[0]: the product tax code is missing. Set the product's tax_code field to an eligible product tax code (…). Product tax code is required for Managed Payments, which is enabled by default on your account.

## The change (worker/space-router-card.mjs, net 0 lines)

- **Tax code.** The egg's line carries `product_data[tax_code] = txcd_10201000` (EGG_TAX_CODE). That code is "Video Games - downloaded - non subscription - with permanent rights", one of the tax codes Stripe's Managed Payments eligibility page lists. The egg is the MMO's entrance ticket (his Nov 19 words, line 2 of the file), bought once and kept.
- **Tax inside the price.** The line also carries `price_data[tax_behavior] = inclusive`. Without it, Managed Payments adds tax on top by default (Stripe's "Update a Checkout integration" page).
  - The buyer then pays exactly the $10 the stamp says.
  - `amount_total` stays 1000, so `eggPaid` pours the egg's price and never the tax: `usd = amount_total / 100` feeds `seatOfUsd` and the tank's fill.
  - The tax comes out of the house's share, as the card's fee already does (line 13).
- **Stripe's reason in the log.** A refusal from Stripe is now written once to the Worker's log (`console.error`, any key masked, 400 characters at most). The page still says only "Stripe did not open a checkout; try again."

## The numbers

- `node --test worker/space-router-card.test.mjs worker/bronze.test.mjs` on the lane gives 10 of 10 pass. The checkout test (line 51) asserts the two new parameters, `txcd_10201000` and `inclusive`.
- Live card presses before: 1 of 1 refused by Stripe (400). After: to be read on the live site once this is deployed (his yes), then on his own $10 egg.
- Cost: no new call. It is still one Stripe call per checkout, with two more form fields, and nothing at rest.

## What is not done

- The deploy to swarmbook.com and optimism.fit, which needs his yes.
- A real egg paid by card end to end. The webhook's pour under Managed Payments has not been seen live yet.
- Customers see "Sold through Link", and their statements read `LINK.COM* <descriptor>`, because Managed Payments makes Link the merchant of record.
