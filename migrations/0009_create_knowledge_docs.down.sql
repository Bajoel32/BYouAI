-- 0009_create_knowledge_docs.down.sql

BEGIN;

DROP FUNCTION IF EXISTS match_knowledge_docs (vector, int, float);
DROP TABLE IF EXISTS knowledge_docs;

COMMIT;
