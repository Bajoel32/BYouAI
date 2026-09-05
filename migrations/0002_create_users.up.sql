-- 0002_create_users.up.sql
-- Core identity record. Passwordless: there is no password/hash column because
-- login happens through single-use magic-link / OTP credentials (0003).

BEGIN;

CREATE TABLE users (
  id                   uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  email                citext      NOT NULL,
  email_verified_at    timestamptz,
  display_name         text,
  status               text        NOT NULL DEFAULT 'active',

  -- Stateless access tokens (JWT) are rejected when their "issued at" is older
  -- than this instant. Bump it to invalidate every outstanding access token at
  -- once: logout-everywhere, account disabled, or suspected compromise.
  token_invalid_before timestamptz NOT NULL DEFAULT now(),

  last_login_at        timestamptz,
  created_at           timestamptz NOT NULL DEFAULT now(),
  updated_at           timestamptz NOT NULL DEFAULT now(),
  deleted_at           timestamptz,

  CONSTRAINT users_status_check
    CHECK (status IN ('active', 'disabled', 'deleted')),

  -- Cheap sanity checks only; real address validation is the email round-trip.
  CONSTRAINT users_email_len_check
    CHECK (char_length(email) BETWEEN 3 AND 254),
  CONSTRAINT users_email_shape_check
    CHECK (email::text ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'),

  CONSTRAINT users_display_name_len_check
    CHECK (display_name IS NULL OR char_length(display_name) BETWEEN 1 AND 100)
);

-- One live account per email address, case-insensitive. Soft-deleted rows are
-- excluded so a released address can be registered again.
CREATE UNIQUE INDEX users_email_unique
  ON users (email)
  WHERE deleted_at IS NULL;

CREATE TRIGGER users_set_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

COMMIT;
