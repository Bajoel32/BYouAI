# Database schema

PostgreSQL (13+). Two areas:

- **Auth** (0001–0005) — passwordless login via magic link / OTP, sessions via
  stateless access JWT + persisted rotating refresh tokens.
- **Konsultasi** (0006–0010) — lead capture, chat transcripts, the embedded
  knowledge base (pgvector) that grounds the `/konsultasi` assistant, and the
  columns its tool calls write to. Needs the `vector` extension and the
  `set_updated_at()` fn from 0001.

## Migrations

Plain SQL, one logical change per file, each with a reversible `down`:

| #    | Up / Down                        | Adds                                            |
|------|----------------------------------|------------------------------------------------|
| 0001 | `auth_core_helpers`              | `citext` extension, `set_updated_at()` trigger fn |
| 0002 | `create_users`                   | `users`                                         |
| 0003 | `create_login_tokens`            | `login_tokens` (magic link + OTP)              |
| 0004 | `create_refresh_tokens`          | `refresh_tokens`                               |
| 0005 | `create_auth_events`             | `auth_events` (audit log)                      |
| 0006 | `consultation_helpers`          | `vector` extension                              |
| 0007 | `create_consultation_leads`     | `consultation_leads` (one row per email)       |
| 0008 | `create_consultation_messages`  | `consultation_messages` (transcript)           |
| 0009 | `create_knowledge_docs`         | `knowledge_docs` + `match_knowledge_docs()` RPC |
| 0010 | `consultation_actions`          | Lead columns for tool-call outcomes + `consultation_messages.actions` |

Apply in ascending order, roll back in descending order. Each file is wrapped in
its own transaction.

### Running

Runner-agnostic. With bare `psql`:

```bash
for f in migrations/0*_*.up.sql; do psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f "$f"; done
```

Or point a tool at this folder — [dbmate](https://github.com/amacneil/dbmate)
(`*.up.sql` / `*.down.sql` is its native layout), `node-pg-migrate`, `sqlx`,
Flyway, etc. Add whichever tool's version-tracking table separately; these files
don't assume one.

## Data model

```
users ─┬─< login_tokens      (ON DELETE CASCADE)
       ├─< refresh_tokens     (ON DELETE CASCADE; self-ref parent_id, family_id)
       └─< auth_events        (ON DELETE SET NULL — keep the trail)
```

- **users** — identity. No password column. `status` (`active` / `disabled` /
  `deleted`) fails closed: only `active` users may request tokens or refresh.
  `token_invalid_before` is the kill switch for outstanding **access** JWTs.
  `deleted_at` is a soft delete; the unique email index skips soft-deleted rows.
- **login_tokens** — one row per magic-link/OTP request. Stores only
  `SHA-256(raw)`. Short `expires_at`, single `consumed_at`, `attempts` /
  `max_attempts` for OTP lockout.
- **refresh_tokens** — one row per issued refresh token. Stores only
  `SHA-256(raw)`. `family_id` groups a login lineage; `parent_id` chains
  rotations; `used_at` + reuse check burns the family on replay.
- **auth_events** — append-only audit trail. `detail` jsonb carries context but
  **never** tokens, codes, or full PII.

## What the schema enforces vs. what the app must do

**Schema:** uniqueness (email, token hashes), FK integrity + cascade, `CHECK`
constraints (status/method/reason enums, hash length = 32 bytes, expiry ordering,
revoked_at/revoked_reason set together), `updated_at` trigger.

**Application (not enforceable in DDL):**

- Generate raw tokens with a CSPRNG: ≥ 256 bits for magic links / refresh
  tokens; 6–8 digits for OTP. Store only the SHA-256; compare in constant time.
- Set TTLs on insert: magic link ~15 min, OTP ~10 min, refresh token days–weeks,
  access JWT minutes.
- Consume atomically: `UPDATE login_tokens SET consumed_at = now() WHERE id = $1
  AND consumed_at IS NULL` — 0 rows affected ⇒ already used / invalid.
- Rotate atomically: revoke the presented refresh row `WHERE id = $1 AND used_at
  IS NULL`, stamp `used_at`, insert the child in the same family + transaction.
  0 rows affected ⇒ replay ⇒ revoke the whole `family_id`, log
  `refresh_reuse_detected`.
- Reject access JWTs whose `iat < users.token_invalid_before` (allow small clock
  skew). Bump that column on logout-all / disable / compromise.
- Rate-limit token requests per email and per IP; enforce OTP lockout via
  `attempts >= max_attempts`.
- Identical response and timing whether or not the email maps to an account — do
  not disclose account existence.
- On login, also check `users.status = 'active'`.

## Retention (cron)

```sql
DELETE FROM login_tokens   WHERE expires_at < now() - interval '1 day';
DELETE FROM refresh_tokens  WHERE expires_at < now() - interval '30 days'
                              OR (revoked_at IS NOT NULL
                                  AND revoked_at < now() - interval '30 days');
DELETE FROM auth_events     WHERE created_at < now() - interval '180 days';
```

Adjust `auth_events` retention to your compliance requirements; consider monthly
partitioning if volume is high.

## Konsultasi data model

```
consultation_leads ─< consultation_messages   (ON DELETE CASCADE)

knowledge_docs        (standalone; queried via match_knowledge_docs())
```

- **consultation_leads** — one row per email. The chat route upserts on
  `email` (`ON CONFLICT (email) DO UPDATE`), so a returning visitor keeps one
  lead and one growing transcript. `industry` is constrained to the
  `INDUSTRIES` ids in `src/lib/consultation.ts` — keep the two in sync.
  `desired_plan` / `meeting_requested_at` / `meeting_preferred_time` are set by
  the assistant's `build_estimate` / `request_consultation_call` tool calls
  (0010) — a quick way for a human follow-up to see what the bot already did.
- **consultation_messages** — append-only turns. The route writes the user turn
  then the assistant turn; `citations` holds the retrieval sources and
  `actions` (0010) the tool-call outcomes shown as action cards on that
  assistant answer.
- **knowledge_docs** — embedded knowledge-base chunks (`vector(1536)` =
  `text-embedding-3-small`). Populated by `npm run ingest` from
  `src/lib/knowledge.mts`; `(source, slug)` is unique so re-ingest upserts.
  `match_knowledge_docs(query_embedding, match_count, min_similarity)` returns
  the closest chunks by cosine similarity.

Written exclusively from the server with the **service role** key — no RLS
policies are defined and the anon key must never touch these tables.

### Retention (cron)

```sql
DELETE FROM consultation_leads
  WHERE updated_at < now() - interval '365 days';   -- cascades to messages
```
