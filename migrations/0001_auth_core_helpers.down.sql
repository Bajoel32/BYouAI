-- 0001_auth_core_helpers.down.sql

BEGIN;

DROP FUNCTION IF EXISTS set_updated_at();

-- Only succeeds if nothing outside this schema still uses citext. When down
-- migrations run in reverse order the auth tables are already gone by this point.
DROP EXTENSION IF EXISTS citext;

COMMIT;
