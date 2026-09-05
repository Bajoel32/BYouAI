# BYouAI — Logo

Lettermark "B" untuk brand **BYouAI** (AI kustom / RAG untuk bisnis). Bentuk:
spine tegak + dua bowl geometris, dengan slit horizontal sebagai detail signature
(memisahkan bowl atas & bawah, membacakan "waist" huruf B).

## File

| File | Pakai untuk |
|------|-------------|
| `byouai-mark.svg` | Lettermark utama — tile gelap, glyph hijau. Default di hampir semua tempat. |
| `byouai-mark-inverse.svg` | Tile hijau, glyph gelap. Untuk area netral/terang yang butuh blok warna. |
| `byouai-mark-mono.svg` | Satu warna via `currentColor` (default ink). Untuk watermark, stempel, print 1 warna, atau di atas background berwarna. |
| `byouai-favicon.svg` | Versi detail-dikurangi (tanpa slit, counter dibesarkan) untuk 16–32px. |
| `byouai-lockup.svg` | Horizontal: mark + wordmark "BYouAI". |

## Design token

| Token | Nilai | Catatan |
|-------|-------|---------|
| `--ink` | `#0A0B0D` | Near-black mark tile, bukan `#000` polos. Token teks di app (`--color-ink`) `#14120F`. |
| `--surface` | `#FAF9F7` | Off-white — sama dengan `--color-bg` di `src/app/globals.css`. |
| `--accent` | `#00C48C` | "BYouAI Green". Kontras di atas `--ink` ≈ 10:1 (aman). |
| `--accent-strong` | `#00795A` | Untuk teks/ikon hijau di atas permukaan terang (AA). Cocokkan dengan `--color-accent-strong` di `globals.css`. `--accent` murni gagal AA untuk teks di atas putih. |
| radius tile | 21 / 96 ≈ 22% | Gaya "app icon" membulat. |

## Aturan pakai

- **Clear space**: minimal setinggi bowl atas glyph (≈ ¼ tinggi mark) di semua sisi.
- **Ukuran minimum**: mark 24px, lockup 120px lebar. Di bawah itu pakai `byouai-favicon.svg`.
- **Jangan**: rotasi, ubah proporsi mark vs wordmark, ganti warna di luar token, tambah shadow/gradient, letakkan mark hijau di atas background hijau.
- **Dark background**: `byouai-mark.svg` sudah cocok. Untuk lockup di background gelap, ganti `fill` teks jadi `#FAFAF9`.

## Wordmark

Nama di-set "BYouAI" — B kapital, "You" mixed-case, "AI" kapital. Jangan pisahkan
atau ganti spasi/casing.

## TODO sebelum produksi

- Wordmark pada `byouai-lockup.svg` masih memakai `<text>` dengan font stack
  (Inter → Helvetica Neue → Arial). **Outline ke path** setelah font brand final
  dikunci, supaya rendering konsisten lintas device/tanpa font terpasang.
- Export turunan raster: `favicon.ico` (16/32/48), PNG maskable 512×512 untuk PWA,
  OG image 1200×630.
