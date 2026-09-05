-- 0010_consultation_actions.down.sql

BEGIN;

ALTER TABLE consultation_messages
  DROP COLUMN IF EXISTS actions;

ALTER TABLE consultation_leads
  DROP COLUMN IF EXISTS meeting_requested_at,
  DROP COLUMN IF EXISTS meeting_preferred_time,
  DROP COLUMN IF EXISTS desired_plan;

COMMIT;
