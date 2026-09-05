# BYouAI — landing page

Landing page untuk BYouAI: layanan yang membangun asisten & agent AI berbasis
RAG di atas data milik klien (e-commerce, firma hukum, klinik, dan industri
lain).

Dibangun dengan **Next.js 16** (App Router, Turbopack), **React 19**, dan
**Tailwind CSS v4**.

## Menjalankan

```bash
npm install
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

Titik masuk halaman ada di `src/app/page.tsx`; section-nya di
`src/components/sections/`.

## Skrip

| Perintah         | Fungsi                                              |
| ---------------- | -------------------------------------------------- |
| `npm run dev`    | Server pengembangan (Turbopack)                    |
| `npm run build`  | Build produksi                                     |
| `npm run start`  | Menjalankan hasil build                            |
| `npm run lint`   | ESLint                                             |
| `npm run ingest` | Embed `src/lib/knowledge.mts` ke `knowledge_docs`  |

## Asisten konsultasi (`/konsultasi`)

Chat berbasis RAG, respons streaming (SSE), dengan tool/function calling:
OpenAI untuk chat + embeddings, Supabase (pgvector) untuk retrieval dan
penyimpanan lead + transkrip.

1. **Env** — salin `.env.example` ke `.env.local`, isi `SUPABASE_URL`,
   `SUPABASE_SERVICE_ROLE_KEY`, `OPENAI_API_KEY`.
2. **Migrasi** — jalankan `migrations/0006`–`0010` (lihat `migrations/README.md`).
   Perlu ekstensi `vector` di Postgres.
3. **Ingest** — `npm run ingest` untuk mengisi basis pengetahuan dari
   `src/lib/knowledge.mts`. Ulangi setiap kali file itu berubah.

Route handler: `src/app/api/konsultasi/chat/route.ts` — protokol
`text/event-stream` (frame `citations` / `token` / `action` / `error` / `done`,
didokumentasikan di `src/lib/consultation.ts`). Tools yang bisa dipanggil model:
`build_estimate` (tautan draf `/invoice` terisi), `request_consultation_call`
(tandai lead minta dihubungi), `save_requirement_notes` (simpan ringkasan
kebutuhan) — masing-masing merender action card di klien
(`src/app/konsultasi/consultation.tsx`). Semua tulis-DB best effort: chat tetap
jalan walau Supabase/OpenAI belum dikonfigurasi atau sedang bermasalah.

## Catatan teknis

- **Font** dioptimalkan lewat `next/font/google`: Inter (sans), Instrument Serif
  (aksen), JetBrains Mono (label). Variabel CSS-nya dipetakan di
  `src/app/globals.css`.
- **Tema** terang/gelap/sistem — token warna di `src/app/globals.css`, toggle di
  `src/components/theme-toggle.tsx`. Skrip inline di `src/app/layout.tsx`
  menerapkan tema tersimpan sebelum paint untuk mencegah flash.
- **Design token** (warna, radius, shadow, easing) didefinisikan sekali di
  `src/app/globals.css` via `@theme`.
