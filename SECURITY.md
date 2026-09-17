# Security

## Melaporkan kerentanan

Email **halo@byouai.com** dengan detail langkah reproduksi. Jangan buka issue
publik untuk kerentanan yang belum diperbaiki.

---

## Guard rail yang sudah terpasang (lapisan aplikasi)

| Area | Mekanisme | Lokasi |
| --- | --- | --- |
| Response headers | CSP, HSTS, `X-Frame-Options: DENY`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, COOP/CORP, `X-Robots-Tag` untuk `/api` & `/invoice` | `next.config.ts` |
| Rate limiting (per IP) | 60 req/menit umum, 12 req/menit untuk `/api` + semua POST | `proxy.ts` |
| Rate limiting (chat) | 20 pesan / 10 menit per IP | `src/app/api/konsultasi/chat/route.ts` |
| Rate limiting (form lead) | 5 submit / 10 menit per IP | `src/app/[lang]/solusi/e-commerce/actions.ts` |
| Plafon biaya OpenAI | Global gate: maks 120 panggilan/menit + 8 konkuren untuk seluruh proses, tidak bergantung pada IP | `src/lib/rate-limit.ts` → `acquireGlobalSlot` |
| CSRF | Cek `Origin` / `Sec-Fetch-Site` untuk POST ke `/api/*`; Server Action pakai cek same-origin bawaan Next | `proxy.ts`, `next.config.ts` (`serverActions.allowedOrigins`) |
| Batas ukuran body | `/api/*` ditolak `413` bila `Content-Length` > 1 MB; Server Action dibatasi 64 KB; buffer proxy dibatasi 1 MB | `proxy.ts`, `next.config.ts` |
| Timeout | Klien OpenAI `timeout: 25s`, `maxRetries: 1`; route `maxDuration = 30` | `src/lib/openai.ts`, route chat |
| Method allow-list | Hanya `GET/HEAD/POST/OPTIONS` | `proxy.ts` |
| Validasi input | Zod + cap panjang di semua endpoint | route chat, `actions.ts` |
| Secrets | `SUPABASE_SERVICE_ROLE_KEY` / `OPENAI_API_KEY` hanya server-side, diakses lewat `src/lib/env.ts` | — |

Semua ambang bisa disetel lewat env tanpa ubah kode — lihat konstanta
`envInt(...)` di `proxy.ts`, route chat, dan `actions.ts` (mis.
`RL_GENERAL_PER_MIN`, `KONSULTASI_GLOBAL_PER_MIN`, `API_MAX_BODY_BYTES`).

---

## Batas lapisan aplikasi — WAJIB dilengkapi di edge sebelum produksi

Rate limiting di sini **in-memory dan per-proses**: state hilang tiap redeploy
dan tidak dibagi antar-instance bila di-scale horizontal. `x-forwarded-for` bisa
dipalsukan tanpa proxy tepercaya di depan (karena itu ada `acquireGlobalSlot`
sebagai backstop). **DDoS volumetrik (L3/L4) tidak bisa ditangani di kode.**

Sebelum go-live, pasang salah satu di depan origin:

- **Cloudflare** (paling mudah): DNS proxied (oranye), Rate Limiting Rules,
  Bot Fight Mode, "Under Attack" mode saat insiden, WAF managed rules. Batasi
  akses origin hanya dari IP Cloudflare.
- **Vercel**: aktifkan Vercel WAF / Attack Challenge Mode + rate limiting.
- **Self-host / Nginx**: `limit_req_zone` + `limit_conn_zone`, `client_max_body_size`,
  timeout ketat, fail2ban. Terminasi TLS + HSTS (header sudah disiapkan app).

Bila scale ke banyak instance, ganti store rate-limit ke Redis/Upstash
(interface `fixedWindow` / `acquireGlobalSlot` di `src/lib/rate-limit.ts` dibuat
supaya mudah ditukar).

---

## Supabase

- `SUPABASE_SERVICE_ROLE_KEY` **bypass RLS** — hanya dipakai server-side
  (`src/lib/supabase.ts`), jangan pernah diimpor ke Client Component.
- Pastikan anon key tidak dibundel ke klien dan tabel (`consultation_leads`,
  `consultation_messages`, `knowledge_docs`) tidak public-readable via anon role.
- Aktifkan RLS di semua tabel meski akses saat ini hanya lewat service role.

## Higiene env & dependensi

- `.env.local` tidak pernah di-commit (sudah di `.gitignore`).
- Rotasi `OPENAI_API_KEY` dan service-role key bila ada indikasi bocor
  (repo pernah direkonstruksi dari transcript — lihat `RECOVERY-NOTES.md`).
- CI menjalankan `npm audit --audit-level=high` di tiap PR.
