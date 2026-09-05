-- 0009_create_knowledge_docs.up.sql
-- Embedded knowledge-base chunks that ground the /konsultasi assistant (RAG).
-- Populated by `npm run ingest` from src/lib/knowledge.ts.
--
--   * embedding dimension 1536 == OpenAI `text-embedding-3-small`. Changing the
--     embedding model means a new migration for the column width + a re-ingest.
--   * (source, slug) is the stable identity of a chunk so re-ingest upserts
--     rather than duplicating.

BEGIN;

CREATE TABLE knowledge_docs (
  id         bigint       GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  source     text         NOT NULL,
  slug       text         NOT NULL,
  title      text         NOT NULL,
  url        text,
  content    text         NOT NULL,
  embedding  vector(1536) NOT NULL,
  created_at timestamptz  NOT NULL DEFAULT now(),

  CONSTRAINT knowledge_docs_content_len_check
    CHECK (char_length(content) BETWEEN 1 AND 8000),
  CONSTRAINT knowledge_docs_source_slug_unique
    UNIQUE (source, slug)
);

-- Approximate nearest-neighbour search by cosine distance. HNSW builds without
-- a training set, unlike ivfflat.
CREATE INDEX knowledge_docs_embedding_idx
  ON knowledge_docs USING hnsw (embedding vector_cosine_ops);

-- Cosine-similarity search used by src/lib/rag.ts via supabase.rpc().
-- Returns the closest `match_count` chunks with similarity in [0, 1].
CREATE OR REPLACE FUNCTION match_knowledge_docs (
  query_embedding vector(1536),
  match_count     int   DEFAULT 5,
  min_similarity  float DEFAULT 0.0
)
RETURNS TABLE (
  id         bigint,
  title      text,
  url        text,
  content    text,
  similarity float
)
LANGUAGE sql
STABLE
AS $$
  SELECT
    kd.id,
    kd.title,
    kd.url,
    kd.content,
    1 - (kd.embedding <=> query_embedding) AS similarity
  FROM knowledge_docs AS kd
  WHERE 1 - (kd.embedding <=> query_embedding) >= min_similarity
  ORDER BY kd.embedding <=> query_embedding
  LIMIT match_count;
$$;

COMMIT;
