
-- =========================================================
-- BANKING PIN BACKFILL
-- Default PIN for legacy/seed users: 1234
-- Stored as BCrypt hash, NEVER plaintext.
-- =========================================================

UPDATE users
SET
    banking_pin_hash = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    pin_failed_attempts = 0,
    pin_locked_until = NULL
WHERE banking_pin_hash IS NULL;


-- =========================================================
-- BANKING PIN BACKFILL FOR LEGACY USERS
-- Default legacy banking PIN: 1234
-- Stored as BCrypt hash, never plaintext.
-- =========================================================

UPDATE users
SET
    banking_pin_hash = '$2a$10$dujxXmEJfv1.itJJ0NF5pu/zXxwwFsni.fXNoLb3aSnrPFBe7GoVK',
    pin_failed_attempts = 0,
    pin_locked_until = NULL
WHERE banking_pin_hash IS NULL;

