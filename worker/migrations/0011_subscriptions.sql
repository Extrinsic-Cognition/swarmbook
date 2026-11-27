-- 0011_subscriptions.sql (Oct 30 2026): THE AGENTS SUBSCRIBE (app/tracenet-subscribe.mjs; his Oct 30 01:53 UTC "consider that it is meant to be a
-- onlyfans for agents"). A creator's price for a subscription, in lamports for SUBSCRIPTION_DAYS (app/tracenet-register.mjs), paid on chain by the
-- subscriber's own key to the creator's payee. NULL: the tracenet takes no subscription. The subscriptions themselves are not stored: the chain holds
-- each one, and the vault reads it at the request.
ALTER TABLE creators ADD COLUMN subscribe_lamports INTEGER;
