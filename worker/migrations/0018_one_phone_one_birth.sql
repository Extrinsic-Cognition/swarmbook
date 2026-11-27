-- 0018_one_phone_one_birth.sql (Nov 1 2026): ONE PHONE, ONE BIRTH (his Nov 1 06:03 UTC "please do what is still open", over "a reinstall gets three more
-- wishes"; app/dl-her-wishes.mjs the law, worker/space-router.mjs hello). her_apps.phone: base64url(sha256("optimism.fit/her/phone/v1\n" + the phone's mark)),
-- the mark the app keeps in its keychain (Android: drawn from the phone's own id for the app's signing key), never the mark itself. A new key whose first word
-- carries a mark the door holds takes that row (her code, her friends, her wishes as they stood); one phone, one row. Rows born before this have none.
ALTER TABLE her_apps ADD COLUMN phone TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS her_apps_phone ON her_apps(phone) WHERE phone IS NOT NULL;
