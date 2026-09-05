-- 0003_create_login_tokens.up.sql
-- Single-use, short-lived credentials for passwordless login: magic-link tokens
-- and numeric OTP codes share this table.
--
-- Application contract:
--   * Raw token: >= 256 bits of CSPRNG entropy for magic links; 6-8 digit code
--     for OTP. The raw value is emailed to the user and NEVER stored.
--   * token_hash = SHA-256(raw). Verify by hashing the incoming value and doing
--     a constant-time comparison.
--   * TTL is short (magic link ~15 min, OTP ~10 min) via expires_at.
--   * Consume exactly once: set consumed_at inside the same transaction that
--     issues the session, guarded by "WHERE consumed_at IS NULL".
--   * Per-user and per-IP request rate limiting lives in the application.
--   * Never disclose whether the email belongs to a real account.

BEGIN;

CREATE TABLE login_tokens (
  id                 uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id            uuid        NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  token_hash         bytea       NOT NULL,
  method             text        NOT NULL,
  purpose            text        NOT NULL DEFAULT 'login',
  expires_at         timestamptz NOT NULL,
  consumed_at        timestamptz,

  -- OTP brute-force guard: the application increments attempts on each failed
  -- check and refuses the code once attempts >= max_attempts.
  attempts           smallint    NOT NULL DEFAULT 0,
  max_attempts       smallint    NOT NULL DEFAULT 5,

  request_ip         inet,
  request_user_agent text,
  created_at         timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT login_tokens_method_check
    CHECK (method IN ('magic_link', 'otp')),
  CONSTRAINT login_tokens_purpose_check
    CHECK (purpose IN ('login')),
  CONSTRAINT login_tokens_hash_len_check
    CHECK (octet_length(token_hash) = 32),
  CONSTRAINT login_tokens_attempts_check
    CHECK (attempts >= 0),
  CONSTRAINT login_tokens_max_attempts_check
    CHECK (max_attempts BETWEEN 1 AND 10),
  CONSTRAINT login_tokens_expiry_check
    CHECK (expires_at > created_at)
);

-- A presented raw token resolves to exactly one row.
CREATE UNIQUE INDEX login_tokens_token_hash_unique
  ON login_tokens (token_hash);

-- Count / inspect a user's recent requests (resend throttling, abuse checks).
CREATE INDEX login_tokens_user_id_created_at_idx
  ON login_tokens (user_id, created_at DESC);

-- Fast "does this user have a live token" lookups; stays small.
CREATE INDEX login_tokens_live_idx
  ON login_tokens (user_id)
  WHERE consumed_at IS NULL;

-- Supports the retention job that prunes spent / expired rows.
CREATE INDEX login_tokens_expires_at_idx
  ON login_tokens (expires_at);

COMMIT;
