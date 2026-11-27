-- 0023_the_pour_holds.sql · THE HOUSE'S POUR HOLDS UNTIL IT LANDS (Nov 12 2026, worker/space-router-deposit.mjs `house`). His words that night, UTC,
-- over the live door that showed him a visitor's code and then nothing: "it is jumpign straight into the qr code", then "think... get good design
-- please". The row of a deposit the house sent keeps the last block height its transaction can still land at (the node's own word beside the
-- blockhash it was signed on). An ask with the same token by the same flask reads it: while that height is not past, the standing signature is
-- answered; once it is past and the transaction is not on the chain, the door signs again and this row takes the new signature and height.
-- Nullable: a row written before this column has none (the table was empty when this was written, read live Nov 12 2026).
ALTER TABLE sr_house_deposits ADD COLUMN valid_until INTEGER;
