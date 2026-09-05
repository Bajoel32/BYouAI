-- 0001_auth_core_helpers.up.sql
-- Shared building blocks for the authentication schema.
-- Requires PostgreSQL 13+ (core gen_random_uuid()).

BEGIN;

-- Case-insensitive text. Used for email so that uniqueness and lookups do not
-- depend on letter case.
CREATE EXTENSION IF NOT EXISTS citext;

-- Sets updated_at to the current time on every UPDATE. Attached per-table in
-- later migrations so application code never has to remember to touch it.
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

COMMIT;
