-- 0008_create_consultation_messages.up.sql
-- Append-only transcript of a consultation. One row per turn.
--
-- Application contract:
--   * The route handler persists the incoming user turn, then the generated
--     assistant turn, in that order.
--   * `citations` carries the retrieval sources shown with an assistant answer;
--     it is always '[]' for user turns.

BEGIN;

CREATE TABLE consultation_messages (
  id          bigint      GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  lead_id     uuid        NOT NULL REFERENCES consultation_leads (id) ON DELETE CASCADE,
  role        text        NOT NULL,
  content     text        NOT NULL,
  citations   jsonb       NOT NULL DEFAULT '[]'::jsonb,
  created_at  timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT consultation_messages_role_check
    CHECK (role IN ('user', 'assistant')),
  CONSTRAINT consultation_messages_content_len_check
    CHECK (char_length(content) BETWEEN 1 AND 20000),
  CONSTRAINT consultation_messages_citations_is_array_check
    CHECK (jsonb_typeof(citations) = 'array')
);

-- Replay a conversation in order.
CREATE INDEX consultation_messages_lead_id_created_at_idx
  ON consultation_messages (lead_id, created_at);

COMMIT;
