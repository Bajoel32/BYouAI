-- 0006_consultation_helpers.down.sql
-- Left in place: other schemas may rely on `vector`. Drop manually if this is
-- the only consumer:
--   DROP EXTENSION IF EXISTS vector;

BEGIN;

SELECT 1;

COMMIT;
