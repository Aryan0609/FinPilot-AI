-- =========================================================
-- FINPILOT BANKING PIN
-- =========================================================

ALTER TABLE users
    ADD COLUMN IF NOT EXISTS banking_pin_hash VARCHAR(255);

ALTER TABLE users
    ADD COLUMN IF NOT EXISTS pin_failed_attempts INTEGER NOT NULL DEFAULT 0;

ALTER TABLE users
    ADD COLUMN IF NOT EXISTS pin_locked_until TIMESTAMP;

UPDATE users
SET
    pin_failed_attempts = COALESCE(pin_failed_attempts, 0)
WHERE pin_failed_attempts IS NULL;

-- Default legacy PIN: 1234
-- BCrypt encoded value.
UPDATE users
SET
    banking_pin_hash =
        '$2a$10$dujxXmEJfv1.itJJ0NF5pu/zXxwwFsni.fXNoLb3aSnrPFBe7GoVK'
WHERE banking_pin_hash IS NULL;
