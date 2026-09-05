-- 0004_create_refresh_tokens.up.sql
-- Persisted, revocable refresh tokens. Access tokens are stateless JWTs and are
-- NOT stored: they are bounded by their own short exp and by
-- users.token_invalid_before.
--
-- Application contract:
--   * Raw refresh token: >= 256 bits of CSPRNG entropy, opaque to the client.
--   * token_hash = SHA-256(raw); constant-time comparison on presentation.
--   * Rotation: every refresh call revokes the presented row (revoked_reason
--     'rotated'), stamps used_at, and inserts a child row in the same family
--     and transaction.
--   * Reuse detection: if a row with used_at IS NOT NULL is presented again,
--     revoke the entire family_id and force re-authentication.
--   * Rotation must be atomic: "UPDATE ... WHERE id = $1 AND used_at IS NULL"
--     and treat 0 rows affected as a replay.

BEGIN;

CREATE TABLE refresh_tokens (
  id             uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        uuid        NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  token_hash     bytea       NOT NULL,

  -- All tokens minted from one login share a family. Reuse of a rotated token
  -- burns the whole family.
  family_id      uuid        NOT NULL,

  -- The token this one replaced during rotation; NULL for the first in a family.
  parent_id      uuid        REFERENCES refresh_tokens (id) ON DELETE SET NULL,

  issued_at      timestamptz NOT NULL DEFAULT now(),
  expires_at     timestamptz NOT NULL,

  -- Set when the token is exchanged for its successor. A second exchange = reuse.
  used_at        timestamptz,

  revoked_at     timestamptz,
  revoked_reason text,

  client_ip      inet,
  user_agent     text,

  CONSTRAINT refresh_tokens_hash_len_check
    CHECK (octet_length(token_hash) = 32),
  CONSTRAINT refresh_tokens_expiry_check
    CHECK (expires_at > issued_at),
  CONSTRAINT refresh_tokens_revoked_reason_check
    CHECK (revoked_reason IS NULL OR revoked_reason IN (
      'rotated', 'logout', 'logout_all', 'reuse_detected',
      'user_disabled', 'expired', 'admin'
    )),
  -- revoked_at and revoked_reason are set together or not at all.
  CONSTRAINT refresh_tokens_revoked_consistency_check
    CHECK ((revoked_at IS NULL) = (revoked_reason IS NULL))
);

-- A presented raw token resolves to exactly one row.
CREATE UNIQUE INDEX refresh_tokens_token_hash_unique
  ON refresh_tokens (token_hash);

-- Active sessions for a user (device/session list, logout-all).
CREATE INDEX refresh_tokens_active_idx
  ON refresh_tokens (user_id)
  WHERE revoked_at IS NULL;

-- Revoke-the-family operation on reuse detection.
CREATE INDEX refresh_tokens_family_id_idx
  ON refresh_tokens (family_id);

-- Retention job for expired / long-revoked rows.
CREATE INDEX refresh_tokens_expires_at_idx
  ON refresh_tokens (expires_at);

COMMIT;
