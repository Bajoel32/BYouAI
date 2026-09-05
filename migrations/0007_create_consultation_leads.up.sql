-- 0007_create_consultation_leads.up.sql
-- One row per person who starts a consultation on /konsultasi, keyed by email.
-- A returning visitor (same email) updates the same row and keeps accumulating
-- messages (0008), which is what we want for follow-up.
--
-- Application contract:
--   * Written only from the server (service role) in the chat route handler.
--   * `industry` mirrors the INDUSTRIES ids in src/lib/consultation.ts.
--   * No RLS policies are defined: this table is never touched by the anon key.

BEGIN;

CREATE TABLE consultation_leads (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  email        citext      NOT NULL,
  name         text        NOT NULL,
  industry     text        NOT NULL,
  needs        text        NOT NULL DEFAULT '',

  request_ip   inet,
  user_agent   text,

  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT consultation_leads_email_shape_check
    CHECK (email::text ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'),
  CONSTRAINT consultation_leads_name_len_check
    CHECK (char_length(name) BETWEEN 1 AND 200),
  CONSTRAINT consultation_leads_industry_check
    CHECK (industry IN (
      'ecommerce', 'hukum', 'kesehatan', 'keuangan', 'pendidikan', 'lainnya'
    )),
  CONSTRAINT consultation_leads_needs_len_check
    CHECK (char_length(needs) <= 4000)
);

-- Upsert target: INSERT ... ON CONFLICT (email) DO UPDATE.
CREATE UNIQUE INDEX consultation_leads_email_unique
  ON consultation_leads (email);

-- "Newest leads first" for an internal review list.
CREATE INDEX consultation_leads_created_at_idx
  ON consultation_leads (created_at DESC);

CREATE TRIGGER consultation_leads_set_updated_at
  BEFORE UPDATE ON consultation_leads
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

COMMIT;
