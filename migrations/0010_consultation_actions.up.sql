-- 0010_consultation_actions.up.sql
-- Columns for the assistant's function-calling actions:
--   * build_estimate            -> consultation_leads.desired_plan
--   * request_consultation_call -> consultation_leads.meeting_requested_at / meeting_preferred_time
--   * (all three tools)         -> consultation_messages.actions (client-rendered action cards)

BEGIN;

ALTER TABLE consultation_leads
  ADD COLUMN meeting_requested_at   timestamptz,
  ADD COLUMN meeting_preferred_time text,
  ADD COLUMN desired_plan           text;

ALTER TABLE consultation_leads
  ADD CONSTRAINT consultation_leads_desired_plan_check
    CHECK (desired_plan IS NULL OR desired_plan IN ('pilot', 'growth', 'enterprise')),
  ADD CONSTRAINT consultation_leads_meeting_preferred_time_len_check
    CHECK (meeting_preferred_time IS NULL OR char_length(meeting_preferred_time) <= 200);

ALTER TABLE consultation_messages
  ADD COLUMN actions jsonb NOT NULL DEFAULT '[]'::jsonb;

ALTER TABLE consultation_messages
  ADD CONSTRAINT consultation_messages_actions_is_array_check
    CHECK (jsonb_typeof(actions) = 'array');

COMMIT;
