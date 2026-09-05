# Catatan pemulihan (`/home/aswan/projects`)

Direkonstruksi 2026-09-06 setelah folder terhapus tak sengaja. Sumber:
transcript sesi Claude Code (`~/.claude/projects/-home-aswan-projects/*.jsonl`),
snapshot `~/.claude/file-history/`, dan build terakhir di `.next/` (prod 01:28 +
dev 03:39, tepat sebelum terhapus).

## Status verifikasi
- `npm install` → OK, `package-lock.json` diregenerasi, 0 vulnerability.
- `npx next build` → **lulus**, 20 route ter-generate, cocok persis dengan
  `app-path-routes-manifest.json` build terakhir. TypeScript bersih.
- 51 file identik byte-per-byte antara hasil rekonstruksi dan build terakhir.

## Yang TIDAK bisa dipulihkan
- **Riwayat git** (`.git/` ikut terhapus, tak ada remote). Hanya keadaan file
  terakhir yang direkonstruksi — repo di-`git init` ulang, satu commit awal.
- `src/app/_og/*.woff` (Inter 400/600, JetBrains Mono 400) — aset biner untuk OG
  image, hilang total, di-fetch ulang dari `@fontsource` (subset Latin). Bukan
  subset asli tapi fungsinya identik.

## Sengaja TIDAK dikembalikan (Anda `git rm` di sesi terakhir, 5 Sep ~18:03)
- `src/app/solusi/klinik-dokter/clinic-sim.tsx`
- `src/app/api/solusi/klinik-dokter/transcribe/route.ts`
- `src/app/api/solusi/klinik-dokter/ringkasan/route.ts`
- `src/lib/rate-limit.ts`, `src/lib/clinic.ts`
- `src/app/solusi/firma-hukum/simulator.tsx`, `src/lib/firma-hukum-sim.ts`
Snapshot sebelum penghapusan masih ada — minta bila mau dikembalikan.

## Catatan per-file
- `src/lib/knowledge.mts` — dulu `knowledge.ts`, di-`git mv` jadi `.mts`;
  `scripts/ingest.mts` sudah disesuaikan.
- `src/components/sections/trust.tsx`, `rag-sandbox.tsx` — diambil dari build dev
  terbaru (lebih baru dari transcript).
- `src/components/theme-toggle.tsx`, `sections/faq.tsx`,
  `solusi/e-commerce/lead-fields.ts`, `lead-form.tsx` — dipulihkan dari
  sourcemap `.next/dev` (tidak muncul utuh di transcript).
- `migrations/0001–0005*` — dari `~/.claude/file-history` (snapshot @v2 utuh).
- `migrations/0006–0010*` + sisa source — dari transcript.
- `AGENTS.md` ditulis ulang oleh `next dev` otomatis. `eslint.config.mjs`,
  `postcss.config.mjs`, `next-env.d.ts` = scaffold standar Next 16 / Tailwind v4.
- `.env.local` berisi SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, OPENAI_API_KEY
  dari transcript (4 Sep) — pastikan nilainya masih berlaku.
