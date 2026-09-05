-- 0005_create_auth_events.up.sql
-- Append-only audit trail for authentication activity: who, what action, from
-- where, and the outcome. `detail` must never contain tokens, OTP codes, or
-- full PII.

BEGIN;

CREATE TABLE auth_events (
  id         bigint      GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id    uuid        REFERENCES users (id) ON DELETE SET NULL,
  event_type text        NOT NULL,
  success    boolean     NOT NULL,
  ip         inet,
  user_agent text,
  detail     jsonb       NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT auth_events_event_type_check
    CHECK (event_type IN (
      'login_requested',
      'login_succeeded',
      'login_failed',
      'token_refreshed',
      'refresh_reuse_detected',
      'logout',
      'logout_all',
      'user_disabled'
    )),
  CONSTRAINT auth_events_detail_is_object_check
    CHECK (jsonb_typeof(detail) = 'object')
);

-- "Show me this user's recent auth activity".
CREATE INDEX auth_events_user_id_created_at_idx
  ON auth_events (user_id, created_at DESC);

-- "Show me all failed logins in the last hour" (alerting / dashboards).
CREATE INDEX auth_events_type_created_at_idx
  ON auth_events (event_type, created_at DESC);

COMMIT;
