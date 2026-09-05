# `/konsultasi` — check results

Date: 2026-09-05
Scope: `src/app/konsultasi/*`, `src/app/api/konsultasi/chat/route.ts`, and the
libs they pull in (`src/lib/consultation.ts`, `env.ts`, `openai.ts`,
`supabase.ts`, `rag.ts`, `plans.ts`).

## Checks run

| Check | Result |
|---|---|
| `npm install` | `openai` and `@supabase/supabase-js` were declared in `package.json` / lockfile but not present in this worktree's `node_modules`. Ran `npm install` (9 packages added). No tracked files changed. |
| `tsc --noEmit` | Passes (after install). |
| `eslint` | Clean. |
| `next build` | Succeeds. `/konsultasi` is prerendered **static**; `/api/konsultasi/chat` is **dynamic** (`nodejs` runtime). |
| Page render (`curl` prod server) | 200. `<title>` = "Konsultasi · BYouAI", intake form renders. |
| API payload validation | Empty body → `422` with clear Zod issues. |
| Chat stream without credentials | `200 text/event-stream`: emits `citations: []` then an `error` frame `"Asisten sedang tidak tersedia. Coba lagi sebentar."` — degrades gracefully, no crash. |

## Runtime prerequisites

There is no `.env.local` in the repo (only `.env.example`, which is git-ignored
via the `.env*` pattern). To exercise the assistant end to end:

1. `cp .env.example .env.local` and fill in `SUPABASE_URL`,
   `SUPABASE_SERVICE_ROLE_KEY`, `OPENAI_API_KEY`.
2. Apply migrations `0006`–`0010` (pgvector, `knowledge_docs`,
   `match_knowledge_docs` RPC, `consultation_leads`, `consultation_messages`).
3. `npm run ingest` to populate the knowledge base for RAG.

## Observations (not bugs)

- `readSse` in `consultation.tsx` doesn't handle the `done` event explicitly.
  Harmless — the stream closing ends the read loop.
- The client-generated greeting (an assistant message) is replayed to OpenAI as
  history on every turn. Intended, slightly token-wasteful.
- `toCitations` falls back to `https://byouai.com` for retrieved chunks whose
  `url` is null.

## Assessment

Code is healthy: strict Zod validation, per-IP best-effort rate limiting, all DB
writes null-guarded and best-effort, mid-stream failures surfaced as an `error`
frame rather than an HTTP error. The only real issue found was the missing
installed dependencies in this worktree.
