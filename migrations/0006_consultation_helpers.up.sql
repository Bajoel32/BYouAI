-- 0006_consultation_helpers.up.sql
-- Shared building blocks for the /konsultasi assistant: pgvector for retrieval,
-- and a citext-backed email type reused from the auth schema (0001).

BEGIN;

-- Similarity search over embedded knowledge-base chunks (0009).
CREATE EXTENSION IF NOT EXISTS vector;

COMMIT;
