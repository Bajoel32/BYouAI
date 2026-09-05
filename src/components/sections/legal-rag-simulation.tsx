"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  BadgeCheck,
  Building2,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  FileSearch,
  FileText,
  ListChecks,
  Loader2,
  LockKeyhole,
  Scale,
  Search,
  SendHorizontal,
  ShieldAlert,
  Sparkles,
  TriangleAlert,
} from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Simulasi asisten riset hukum untuk halaman /solusi/firma-hukum.
 *
 * BUKAN produk sungguhan — tidak ada panggilan model, tidak ada jaringan.
 * Dokumen contoh membawa hasil analisis yang sudah dikurasi; dokumen yang
 * ditempel pengguna dianalisis dengan heuristik kata kunci sederhana di
 * browser. Tujuannya menunjukkan bentuk keluaran "Riset & analisis dokumen":
 * ringkasan eksekutif, temuan risiko bertingkat, ekstraksi klausul tersitasi,
 * dan tanya-jawab dengan jejak pasal.
 *
 * Dark-only dan berdiri sendiri (tidak membaca token tema situs).
 */

// ---- Types --------------------------------------------------------------

type RiskLevel = "red" | "yellow";
type Risk = { level: RiskLevel; title: string; detail: string; citation: string };
type Clause = { citation: string; title: string; excerpt: string };
type QA = { q: string; a: string };

type AnalysisResult = {
  latencyMs: number;
  matchScore: string;
  segments: number;
  summary: string;
  risks: Risk[];
  clauses: Clause[];
  qa: QA[];
};

type PracticeArea =
  | "korporasi"
  | "litigasi"
  | "ketenagakerjaan"
  | "properti"
  | "hki";
type DocType = "kontrak" | "putusan" | "peraturan" | "opini";
type Phase = "idle" | "processing" | "done";

type Preset = {
  id: string;
  label: string;
  practiceArea: PracticeArea;
  docType: DocType;
  text: string;
  result: AnalysisResult;
};

// ---- Select options ---------------------------------------------------

const PRACTICE_AREAS: { value: PracticeArea; label: string }[] = [
  { value: "korporasi", label: "Korporasi & M&A" },
  { value: "litigasi", label: "Litigasi" },
  { value: "ketenagakerjaan", label: "Ketenagakerjaan" },
  { value: "properti", label: "Properti" },
  { value: "hki", label: "Kekayaan Intelektual" },
];

const DOC_TYPES: { value: DocType; label: string }[] = [
  { value: "kontrak", label: "Perjanjian / Kontrak" },
  { value: "putusan", label: "Putusan Pengadilan" },
  { value: "peraturan", label: "Peraturan" },
  { value: "opini", label: "Legal Opinion" },
];

const MIN_CHARS = 120;

// ---- Sample documents + curated analysis -----------------------------

const PRESETS: Preset[] = [
  {
    id: "kerjasama-ti",
    label: "Perjanjian Kerja Sama Layanan TI",
    practiceArea: "korporasi",
    docType: "kontrak",
    text: `PERJANJIAN KERJA SAMA LAYANAN TEKNOLOGI INFORMASI

Pasal 1 - Definisi
Dalam Perjanjian ini "Deliverable" berarti setiap hasil kerja yang diserahkan Penyedia kepada Pemberi Kerja.

Pasal 2 - Ruang Lingkup
Penyedia menyediakan jasa pengembangan, pemeliharaan, dan dukungan aplikasi sesuai Lampiran A.

Pasal 3 - Jangka Waktu
(1) Perjanjian berlaku 12 (dua belas) bulan sejak Tanggal Efektif.
(2) Perjanjian diperpanjang otomatis untuk periode 12 bulan berikutnya kecuali salah satu Pihak memberi pemberitahuan tertulis paling lambat 30 hari sebelum berakhir.

Pasal 4 - Biaya dan Pembayaran
(1) Pemberi Kerja membayar biaya bulanan sebagaimana Lampiran B.
(2) Tagihan jatuh tempo dalam 30 hari kalender sejak tanggal invoice.
(3) Keterlambatan pembayaran dikenakan denda 2% per bulan dari nilai tertunggak.

Pasal 5 - Tingkat Layanan
Penyedia menjamin ketersediaan sistem 99,5% per bulan; kegagalan memberi hak kredit layanan sesuai Lampiran C.

Pasal 6 - Kekayaan Intelektual
(1) Seluruh Deliverable menjadi milik Pemberi Kerja setelah pelunasan.
(2) Perangkat dan pustaka milik Penyedia yang sudah ada sebelumnya tetap menjadi milik Penyedia.

Pasal 7 - Kerahasiaan
Kewajiban menjaga kerahasiaan berlaku selama Perjanjian dan 5 tahun setelah pengakhiran.

Pasal 8 - Batasan Tanggung Jawab
(1) Total tanggung jawab Penyedia atas klaim apa pun dibatasi maksimum senilai biaya 3 bulan terakhir.

Pasal 9 - Pengakhiran
Masing-masing Pihak dapat mengakhiri Perjanjian tanpa alasan dengan pemberitahuan 30 hari.

Pasal 10 - Hukum yang Berlaku dan Penyelesaian Sengketa
(1) Perjanjian tunduk pada hukum Republik Indonesia.
(2) Sengketa diselesaikan melalui arbitrase BANI di Jakarta, dalam Bahasa Indonesia.`,
    result: {
      latencyMs: 214,
      matchScore: "98.2%",
      segments: 14,
      summary:
        "Perjanjian layanan TI berjangka 12 bulan dengan perpanjangan otomatis. Struktur pembayaran dan SLA cukup standar, namun alokasi risiko condong ke Pemberi Kerja: batasan tanggung jawab sangat rendah dan tidak mengecualikan pelanggaran berat, serta perpanjangan otomatis tanpa pengingat.",
      risks: [
        {
          level: "red",
          title: "Batasan tanggung jawab terlalu rendah",
          detail:
            "Cap ganti rugi hanya senilai biaya 3 bulan dan tidak mengecualikan kelalaian berat, pelanggaran kerahasiaan, atau pelanggaran HKI. Disarankan menaikkan cap dan menambah carve-out.",
          citation: "Pasal 8 Ayat 1",
        },
        {
          level: "yellow",
          title: "Perpanjangan otomatis tanpa pengingat",
          detail:
            "Kontrak diperpanjang 12 bulan secara otomatis bila tidak ada pemberitahuan 30 hari sebelum berakhir. Tambahkan kewajiban notifikasi jatuh tempo dari Penyedia.",
          citation: "Pasal 3 Ayat 2",
        },
        {
          level: "yellow",
          title: "Denda keterlambatan bersifat sepihak",
          detail:
            "Denda 2%/bulan hanya membebani Pemberi Kerja; kegagalan SLA hanya diganti kredit layanan terbatas (Lampiran C). Pertimbangkan mekanisme timbal balik.",
          citation: "Pasal 4 Ayat 3",
        },
      ],
      clauses: [
        {
          citation: "Pasal 3 Ayat 1",
          title: "Jangka Waktu",
          excerpt: "Berlaku 12 bulan sejak Tanggal Efektif.",
        },
        {
          citation: "Pasal 4 Ayat 2",
          title: "Termin Pembayaran",
          excerpt: "Tagihan jatuh tempo 30 hari kalender sejak tanggal invoice.",
        },
        {
          citation: "Pasal 6 Ayat 1",
          title: "Kepemilikan Deliverable",
          excerpt: "Seluruh hasil kerja menjadi milik Pemberi Kerja setelah pelunasan.",
        },
        {
          citation: "Pasal 8 Ayat 1",
          title: "Batasan Tanggung Jawab",
          excerpt: "Total ganti rugi maksimum senilai biaya 3 bulan terakhir.",
        },
        {
          citation: "Pasal 10 Ayat 2",
          title: "Penyelesaian Sengketa",
          excerpt: "Arbitrase BANI, Jakarta, Bahasa Indonesia.",
        },
      ],
      qa: [
        {
          q: "Berapa lama jangka waktu kontrak ini?",
          a: "Jangka waktu awal 12 bulan sejak Tanggal Efektif (Pasal 3 Ayat 1), lalu diperpanjang otomatis 12 bulan berikutnya kecuali ada pemberitahuan tertulis 30 hari sebelum berakhir (Pasal 3 Ayat 2).",
        },
        {
          q: "Bagaimana ketentuan batasan tanggung jawab?",
          a: "Pasal 8 Ayat 1 membatasi total tanggung jawab Penyedia pada nilai biaya 3 bulan terakhir. Klausul ini tidak mengecualikan kelalaian berat, pelanggaran kerahasiaan, atau pelanggaran HKI — sebaiknya dinegosiasikan.",
        },
        {
          q: "Hukum mana yang mengatur perjanjian ini?",
          a: "Hukum Republik Indonesia (Pasal 10 Ayat 1), dengan sengketa diselesaikan melalui arbitrase BANI di Jakarta (Pasal 10 Ayat 2).",
        },
      ],
    },
  },
  {
    id: "sewa-kantor",
    label: "Perjanjian Sewa-Menyewa Ruang Kantor",
    practiceArea: "properti",
    docType: "kontrak",
    text: `PERJANJIAN SEWA-MENYEWA RUANG KANTOR

Pasal 1 - Objek Sewa
Pemberi Sewa menyewakan ruang kantor seluas 480 m2 di Lantai 9, kepada Penyewa.

Pasal 2 - Jangka Waktu
(1) Sewa berlaku 3 (tiga) tahun sejak tanggal serah terima.

Pasal 3 - Harga Sewa dan Eskalasi
(1) Harga sewa Rp 210.000 per m2 per bulan, dibayar di muka setiap triwulan.
(2) Harga sewa naik 10% pada setiap perpanjangan tahunan.

Pasal 4 - Uang Jaminan
(1) Penyewa menyetor uang jaminan setara 3 bulan harga sewa sebelum serah terima.
(3) Uang jaminan dikembalikan paling lambat 60 hari kerja setelah serah terima kembali ruangan dan pelunasan seluruh kewajiban, tanpa bunga.

Pasal 5 - Pemeliharaan
Penyewa menanggung pemeliharaan interior; Pemberi Sewa menanggung struktur dan sistem gedung.

Pasal 6 - Larangan Pengalihan
(1) Penyewa dilarang menyewakan kembali atau mengalihkan hak tanpa izin tertulis Pemberi Sewa.

Pasal 7 - Pengakhiran Dini
(1) Penyewa dapat mengakhiri sewa lebih awal dengan pemberitahuan 90 hari.
(2) Dalam hal pengakhiran dini, Penyewa wajib membayar penalti setara 6 bulan harga sewa berjalan.

Pasal 8 - Keadaan Kahar
Kewajiban tertunda selama keadaan kahar berlangsung dan tidak menjadi dasar ganti rugi.

Pasal 9 - Pajak
PPN dan PPh atas sewa ditanggung Penyewa.

Pasal 10 - Domisili Hukum
Para Pihak memilih domisili hukum tetap di Pengadilan Negeri Jakarta Selatan.`,
    result: {
      latencyMs: 198,
      matchScore: "97.5%",
      segments: 12,
      summary:
        "Sewa kantor 3 tahun dengan pembayaran di muka triwulanan. Ketentuan pemeliharaan dan pajak lazim, tetapi klausul komersial berat sebelah untuk Penyewa: penalti pengakhiran dini besar tanpa mitigasi, eskalasi tetap 10%, dan pengembalian jaminan lambat tanpa bunga.",
      risks: [
        {
          level: "red",
          title: "Penalti pengakhiran dini tidak proporsional",
          detail:
            "Penyewa wajib membayar 6 bulan sewa sebagai penalti tanpa pengurangan bila ruang berhasil disewakan ke pihak lain. Usulkan mekanisme re-letting / mitigasi kerugian.",
          citation: "Pasal 7 Ayat 2",
        },
        {
          level: "yellow",
          title: "Eskalasi sewa tetap 10% per tahun",
          detail:
            "Kenaikan majemuk yang tidak dikaitkan dengan indeks inflasi atau nilai pasar. Negosiasikan menjadi 'lebih rendah dari 10% atau CPI'.",
          citation: "Pasal 3 Ayat 2",
        },
        {
          level: "yellow",
          title: "Pengembalian jaminan 60 hari, tanpa bunga",
          detail:
            "Melebihi praktik umum 30 hari dan tidak ada kompensasi atas dana yang tertahan. Persempit jangka waktu dan atur konsekuensi keterlambatan.",
          citation: "Pasal 4 Ayat 3",
        },
      ],
      clauses: [
        {
          citation: "Pasal 2 Ayat 1",
          title: "Jangka Waktu Sewa",
          excerpt: "3 tahun sejak tanggal serah terima.",
        },
        {
          citation: "Pasal 3 Ayat 2",
          title: "Eskalasi Harga",
          excerpt: "Harga sewa naik 10% pada setiap perpanjangan tahunan.",
        },
        {
          citation: "Pasal 4 Ayat 1",
          title: "Uang Jaminan",
          excerpt: "Setara 3 bulan harga sewa, disetor sebelum serah terima.",
        },
        {
          citation: "Pasal 6 Ayat 1",
          title: "Larangan Pengalihan",
          excerpt: "Dilarang menyewakan kembali tanpa izin tertulis Pemberi Sewa.",
        },
        {
          citation: "Pasal 7 Ayat 2",
          title: "Penalti Pengakhiran Dini",
          excerpt: "Setara 6 bulan harga sewa berjalan.",
        },
      ],
      qa: [
        {
          q: "Berapa kenaikan sewa per tahun?",
          a: "10% secara majemuk pada setiap perpanjangan tahunan (Pasal 3 Ayat 2), tanpa kaitan dengan indeks inflasi. Layak dinegosiasikan menjadi batas atas 'lebih rendah dari 10% atau CPI'.",
        },
        {
          q: "Apa konsekuensi mengakhiri sewa lebih awal?",
          a: "Pasal 7 Ayat 2 mewajibkan Penyewa membayar penalti setara 6 bulan sewa berjalan, tanpa pengurangan meski ruang berhasil disewakan ke pihak lain.",
        },
        {
          q: "Kapan uang jaminan dikembalikan?",
          a: "Paling lambat 60 hari kerja setelah serah terima kembali ruangan dan pelunasan seluruh kewajiban, tanpa bunga (Pasal 4 Ayat 3).",
        },
      ],
    },
  },
  {
    id: "nda-lintas-batas",
    label: "Perjanjian Kerahasiaan (NDA) Lintas Batas",
    practiceArea: "korporasi",
    docType: "kontrak",
    text: `PERJANJIAN KERAHASIAAN (NON-DISCLOSURE AGREEMENT)

Pasal 1 - Definisi Informasi Rahasia
(1) Mencakup informasi tertulis yang ditandai rahasia dan informasi lisan yang dikonfirmasi tertulis dalam 15 hari.

Pasal 2 - Kewajiban Penerima
Penerima wajib menjaga Informasi Rahasia dengan tingkat kehati-hatian yang sama seperti melindungi informasinya sendiri.

Pasal 3 - Pengecualian
Kewajiban tidak berlaku atas informasi yang telah menjadi milik publik bukan karena pelanggaran Penerima.

Pasal 4 - Jangka Waktu
(1) Kewajiban kerahasiaan tetap mengikat 7 tahun sejak tanggal pengakhiran Perjanjian.

Pasal 5 - Pengembalian dan Pemusnahan
Atas permintaan, Penerima mengembalikan atau memusnahkan Informasi Rahasia dalam 10 hari.

Pasal 6 - Tidak Ada Lisensi
Perjanjian ini tidak memberikan lisensi atau hak kekayaan intelektual apa pun.

Pasal 7 - Ganti Rugi
(1) Setiap pelanggaran dikenakan ganti rugi tetap (liquidated damages) sebesar USD 250.000 per pelanggaran.

Pasal 8 - Hukum yang Berlaku
(1) Perjanjian tunduk pada hukum Republik Singapura.

Pasal 9 - Penyelesaian Sengketa
Sengketa diselesaikan melalui arbitrase SIAC di Singapura.

Pasal 10 - Transfer Data Pribadi Lintas Batas
(2) Setiap transfer data pribadi tunduk pada Personal Data Protection Act Singapura.`,
    result: {
      latencyMs: 231,
      matchScore: "98.9%",
      segments: 12,
      summary:
        "NDA dua arah dengan struktur standar, namun beberapa titik berisiko tinggi bagi pihak Indonesia: ganti rugi tetap yang berpotensi dianggap penalti, pilihan hukum dan forum asing yang menyulitkan eksekusi, kewajiban kerahasiaan 7 tahun, dan ketentuan transfer data yang belum merujuk UU PDP Indonesia.",
      risks: [
        {
          level: "red",
          title: "Ganti rugi tetap berpotensi tidak dapat dieksekusi",
          detail:
            "USD 250.000 per pelanggaran dapat dikategorikan sebagai penalti dan dimoderasi hakim Indonesia (Pasal 1309 KUHPerdata). Kaitkan dengan kerugian nyata atau tetapkan batas wajar.",
          citation: "Pasal 7 Ayat 1",
        },
        {
          level: "red",
          title: "Pilihan hukum dan forum asing",
          detail:
            "Hukum Singapura + arbitrase SIAC menyulitkan eksekusi terhadap aset pihak Indonesia. Pertimbangkan hukum Indonesia atau arbitrase BANI, atau klausul eksekusi timbal balik.",
          citation: "Pasal 8 & Pasal 9",
        },
        {
          level: "yellow",
          title: "Kewajiban kerahasiaan 7 tahun",
          detail:
            "Melampaui kelaziman 2–3 tahun untuk informasi komersial non-dagang. Persingkat, atau batasi hanya untuk kategori informasi tertentu.",
          citation: "Pasal 4 Ayat 1",
        },
        {
          level: "yellow",
          title: "Transfer data belum merujuk UU PDP Indonesia",
          detail:
            "Hanya menyebut PDPA Singapura; perlu penyesuaian dengan UU No. 27/2022 dan dasar transfer lintas batas yang sah.",
          citation: "Pasal 10 Ayat 2",
        },
      ],
      clauses: [
        {
          citation: "Pasal 1 Ayat 1",
          title: "Definisi Informasi Rahasia",
          excerpt: "Termasuk informasi lisan yang dikonfirmasi tertulis dalam 15 hari.",
        },
        {
          citation: "Pasal 4 Ayat 1",
          title: "Jangka Waktu Kewajiban",
          excerpt: "7 tahun sejak tanggal pengakhiran Perjanjian.",
        },
        {
          citation: "Pasal 7 Ayat 1",
          title: "Ganti Rugi",
          excerpt: "Liquidated damages USD 250.000 untuk setiap pelanggaran.",
        },
        {
          citation: "Pasal 8 Ayat 1",
          title: "Hukum yang Berlaku",
          excerpt: "Hukum Republik Singapura.",
        },
        {
          citation: "Pasal 10 Ayat 2",
          title: "Transfer Lintas Batas",
          excerpt: "Tunduk pada PDPA Singapura.",
        },
      ],
      qa: [
        {
          q: "Berapa masa berlaku NDA ini?",
          a: "Perjanjian berlaku selama kerja sama, namun kewajiban kerahasiaan tetap mengikat 7 tahun setelah pengakhiran (Pasal 4 Ayat 1) — lebih panjang dari kelaziman 2–3 tahun.",
        },
        {
          q: "Bagaimana ketentuan ganti rugi?",
          a: "Pasal 7 Ayat 1 menetapkan ganti rugi tetap USD 250.000 per pelanggaran. Risikonya klausul ini dapat dianggap penalti dan dimoderasi hakim Indonesia berdasarkan Pasal 1309 KUHPerdata.",
        },
        {
          q: "Hukum negara mana yang berlaku?",
          a: "Hukum Republik Singapura (Pasal 8 Ayat 1), dengan penyelesaian sengketa melalui SIAC di Singapura (Pasal 9). Untuk pihak Indonesia ini menyulitkan eksekusi.",
        },
      ],
    },
  },
];

// ---- Heuristic fallback for pasted documents -------------------------

function countSegments(text: string): number {
  const m = text.match(/(?:^|\n)\s*(?:pasal|article|section|angka)\s+\d+/gi);
  return m?.length || Math.max(3, Math.round(text.length / 340));
}

/** Pull "Pasal N ..." heading lines and turn them into cited clauses. */
function extractClauses(text: string): Clause[] {
  const lines = text.split(/\n+/).map((l) => l.trim());
  const out: Clause[] = [];
  for (let i = 0; i < lines.length && out.length < 5; i += 1) {
    const head = lines[i].match(/^(Pasal\s+\d+(?:\s+Ayat\s+\d+)?)\s*[-–:]?\s*(.*)$/i);
    if (!head) continue;
    const body = head[2] || lines[i + 1] || "";
    out.push({
      citation: head[1].replace(/\s+/g, " "),
      title: (head[2] || "Ketentuan").slice(0, 48).trim() || "Ketentuan",
      excerpt: body.slice(0, 120).trim() || "(lihat teks pasal)",
    });
  }
  if (out.length === 0) {
    out.push(
      { citation: "Segmen 1", title: "Pembukaan / Para Pihak", excerpt: text.slice(0, 110).trim() },
      { citation: "Segmen 2", title: "Objek Perjanjian", excerpt: "Tidak ada penomoran pasal terdeteksi." },
    );
  }
  return out;
}

const RISK_RULES: {
  re: RegExp;
  level: RiskLevel;
  title: string;
  detail: string;
}[] = [
  {
    re: /batas(an)?\s+tanggung\s+jawab|limitation of liability|dibatasi.*(tanggung jawab|ganti rugi)/i,
    level: "red",
    title: "Batasan tanggung jawab terdeteksi",
    detail:
      "Periksa besaran cap dan apakah pelanggaran berat / kerahasiaan / HKI dikecualikan.",
  },
  {
    re: /liquidated damages|ganti rugi tetap|denda\s+sebesar|penalti/i,
    level: "red",
    title: "Klausul ganti rugi tetap / penalti",
    detail:
      "Ganti rugi tetap berpotensi dianggap penalti dan dapat dimoderasi hakim (Pasal 1309 KUHPerdata).",
  },
  {
    re: /hukum\s+(negara\s+)?(singapura|inggris|new york|delaware)|governing law|tunduk pada hukum republik singapura/i,
    level: "red",
    title: "Pilihan hukum / forum asing",
    detail: "Menyulitkan eksekusi terhadap aset pihak Indonesia. Pertimbangkan hukum Indonesia / BANI.",
  },
  {
    re: /diperpanjang\s+otomatis|perpanjangan otomatis|auto[-\s]?renew/i,
    level: "yellow",
    title: "Perpanjangan otomatis",
    detail: "Tambahkan kewajiban pemberitahuan jatuh tempo sebelum perpanjangan berlaku.",
  },
  {
    re: /eskalasi|naik\s+\d+%|kenaikan\s+harga/i,
    level: "yellow",
    title: "Eskalasi harga terjadwal",
    detail: "Kaitkan kenaikan dengan indeks inflasi atau nilai pasar, jangan angka tetap.",
  },
  {
    re: /kerahasiaan.*(5|6|7|8|9|10)\s*tahun|(5|6|7|8|9|10)\s*tahun.*kerahasiaan/i,
    level: "yellow",
    title: "Jangka kerahasiaan panjang",
    detail: "Periode di atas 3 tahun untuk informasi komersial umumnya berlebihan.",
  },
];

function analyze(text: string, docType: DocType): AnalysisResult {
  const clauses = extractClauses(text);
  const risks: Risk[] = [];
  for (const rule of RISK_RULES) {
    const hit = rule.re.exec(text);
    if (!hit) continue;
    const near = text.slice(Math.max(0, hit.index - 40), hit.index + 60);
    const cite = near.match(/Pasal\s+\d+(?:\s+Ayat\s+\d+)?/i)?.[0];
    risks.push({
      level: rule.level,
      title: rule.title,
      detail: rule.detail,
      citation: cite ? cite.replace(/\s+/g, " ") : clauses[0]?.citation ?? "Segmen 1",
    });
  }
  if (risks.length === 0) {
    risks.push({
      level: "yellow",
      title: "Tidak ada red flag umum terdeteksi",
      detail:
        "Heuristik tidak menemukan pola risiko lazim. Tinjauan manual tetap diperlukan untuk konteks komersial.",
      citation: clauses[0]?.citation ?? "Segmen 1",
    });
  }

  const segments = countSegments(text);
  const docLabel = DOC_TYPES.find((d) => d.value === docType)?.label ?? "dokumen";
  const reds = risks.filter((r) => r.level === "red").length;

  return {
    latencyMs: 180 + (text.length % 90),
    matchScore: `${(94 + ((text.length % 55) / 10)).toFixed(1)}%`,
    segments,
    summary: `${docLabel} dengan ${segments} segmen tersitasi. Heuristik menandai ${reds} temuan berisiko tinggi dan ${
      risks.length - reds
    } temuan sedang. Ekstraksi klausul diambil dari penomoran pasal pada teks.`,
    risks,
    clauses,
    qa: [
      {
        q: "Apa jangka waktu perjanjian ini?",
        a:
          text.match(/(?:berlaku|jangka waktu)[^.]*?\d+\s*(?:bulan|tahun)[^.]*\./i)?.[0]?.trim() ??
          "Tidak ditemukan ketentuan jangka waktu yang eksplisit pada teks — perlu tinjauan manual.",
      },
      {
        q: "Bagaimana ketentuan ganti rugi?",
        a:
          text.match(/(?:ganti rugi|denda|penalti|liquidated)[^.]*\./i)?.[0]?.trim() ??
          "Tidak ada klausul ganti rugi yang terdeteksi secara eksplisit.",
      },
      {
        q: "Hukum mana yang berlaku?",
        a:
          text.match(/(?:tunduk pada hukum|hukum yang berlaku)[^.]*\./i)?.[0]?.trim() ??
          "Klausul pilihan hukum tidak terdeteksi — pastikan diatur secara tegas.",
      },
    ],
  };
}

/** Answer a free-text question against the analysis result + raw text. */
function answerQuestion(q: string, result: AnalysisResult, text: string): string {
  const norm = q.trim().toLowerCase();
  const chip = result.qa.find(
    (item) => norm.includes(item.q.toLowerCase().slice(0, 14)) || item.q.toLowerCase().includes(norm),
  );
  if (chip) return chip.a;

  const bag: { kw: RegExp; pick: () => string | undefined }[] = [
    {
      kw: /waktu|berlaku|jangka|durasi|masa/,
      pick: () =>
        result.clauses.find((c) => /jangka|waktu|durasi/i.test(c.title))
          ? `${result.clauses.find((c) => /jangka|waktu|durasi/i.test(c.title))!.excerpt} (${
              result.clauses.find((c) => /jangka|waktu|durasi/i.test(c.title))!.citation
            })`
          : undefined,
    },
    {
      kw: /ganti rugi|denda|penalti|kompensasi/,
      pick: () => {
        const r = result.risks.find((x) => /ganti rugi|penalti/i.test(x.title));
        return r ? `${r.detail} (${r.citation})` : undefined;
      },
    },
    {
      kw: /hukum|yurisdiksi|forum|governing|sengketa|arbitrase/,
      pick: () => {
        const c = result.clauses.find((x) => /hukum|sengketa/i.test(x.title));
        return c ? `${c.excerpt} (${c.citation})` : undefined;
      },
    },
    {
      kw: /kerahasiaan|rahasia|nda/,
      pick: () => text.match(/kerahasiaan[^.]*\./i)?.[0]?.trim(),
    },
  ];
  for (const b of bag) {
    if (b.kw.test(norm)) {
      const hit = b.pick();
      if (hit) return hit;
    }
  }
  const firstCite = result.clauses[0]?.citation;
  return `Berdasarkan dokumen, saya tidak menemukan ketentuan yang langsung menjawab itu. Coba pertanyaan yang lebih spesifik${
    firstCite ? `, atau rujuk ${firstCite} sebagai titik awal` : ""
  }.`;
}

const PROCESS_STEPS = (segments: number): string[] => [
  "Normalisasi & segmentasi dokumen",
  `Deteksi ${segments} segmen tersitasi (Pasal / Ayat)`,
  "Embedding segmen · text-embedding-3-large",
  "Vector match vs korpus preseden firma",
  "Ekstraksi klausul kunci & deteksi red flag",
  "Menyusun ringkasan eksekutif",
];

// ---- Component ---------------------------------------------------------

export function LegalRagsimulation() {
  const [firmName, setFirmName] = useState("");
  const [practiceArea, setPracticeArea] = useState<PracticeArea>("korporasi");
  const [docType, setDocType] = useState<DocType>("kontrak");
  const [text, setText] = useState("");
  const [activePreset, setActivePreset] = useState<string | null>(null);

  const [phase, setPhase] = useState<Phase>("idle");
  const [steps, setSteps] = useState<string[]>([]);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const [qaLog, setQaLog] = useState<QA[]>([]);
  const [qaDraft, setQaDraft] = useState("");

  const runRef = useRef(0);
  const timers = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());

  const wait = useCallback(
    (ms: number) =>
      new Promise<void>((resolve) => {
        const t = setTimeout(() => {
          timers.current.delete(t);
          resolve();
        }, ms);
        timers.current.add(t);
      }),
    [],
  );

  useEffect(() => {
    const pending = timers.current;
    return () => {
      runRef.current += 1;
      pending.forEach(clearTimeout);
      pending.clear();
    };
  }, []);

  const canRun = text.trim().length >= MIN_CHARS && phase !== "processing";

  const loadPreset = useCallback((preset: Preset) => {
    runRef.current += 1;
    setActivePreset(preset.id);
    setText(preset.text);
    setPracticeArea(preset.practiceArea);
    setDocType(preset.docType);
    setPhase("idle");
    setSteps([]);
    setResult(null);
    setQaLog([]);
    setQaDraft("");
  }, []);

  const runAnalysis = useCallback(async () => {
    if (text.trim().length < MIN_CHARS) return;
    const myRun = (runRef.current += 1);
    const alive = () => runRef.current === myRun;

    const preset = PRESETS.find((p) => p.id === activePreset && p.text === text);
    const analysis: AnalysisResult = preset ? preset.result : analyze(text, docType);

    setPhase("processing");
    setSteps([]);
    setResult(null);
    setQaLog([]);

    const script = PROCESS_STEPS(analysis.segments);
    for (let i = 0; i < script.length; i += 1) {
      await wait(i === 0 ? 260 : 320);
      if (!alive()) return;
      setSteps(script.slice(0, i + 1));
    }
    await wait(360);
    if (!alive()) return;

    setResult(analysis);
    setPhase("done");
  }, [text, docType, activePreset, wait]);

  const askQuestion = useCallback(
    (q: string) => {
      if (!result || !q.trim()) return;
      const a = answerQuestion(q, result, text);
      setQaLog((log) => [...log, { q: q.trim(), a }]);
      setQaDraft("");
    },
    [result, text],
  );

  const reset = useCallback(() => {
    runRef.current += 1;
    timers.current.forEach(clearTimeout);
    timers.current.clear();
    setFirmName("");
    setPracticeArea("korporasi");
    setDocType("kontrak");
    setText("");
    setActivePreset(null);
    setPhase("idle");
    setSteps([]);
    setResult(null);
    setQaLog([]);
    setQaDraft("");
  }, []);

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 text-zinc-100 shadow-2xl shadow-black/40">
      {/* Title bar */}
      <div className="flex items-center justify-between gap-3 border-b border-zinc-800 bg-zinc-900/50 px-4 py-3">
        <div className="flex items-center gap-2.5">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-emerald-500/15 text-emerald-400 ring-1 ring-inset ring-emerald-500/25">
            <Scale className="h-4 w-4" />
          </span>
          <div className="leading-tight">
            <p className="text-sm font-semibold">Asisten Riset Hukum · Simulasi</p>
            <p className="text-[11px] text-zinc-500">
              Analisis dokumen berjalan di browser — bukan nasihat hukum
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-800 px-2.5 py-1.5 text-xs font-medium text-zinc-400 transition-colors hover:border-zinc-700 hover:text-zinc-200"
        >
          Reset
        </button>
      </div>

      <div className="grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        {/* ============ LEFT: input & context ============ */}
        <div className="space-y-4 border-b border-zinc-800 p-4 lg:sticky lg:top-4 lg:self-start lg:border-b-0 lg:border-r">
          <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
            <FileText className="h-3.5 w-3.5" />
            Panel konten &amp; input dokumen
          </p>

          <Field label="Nama firma (opsional)">
            <div className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900 px-2.5 focus-within:border-emerald-500/40">
              <Building2 className="h-3.5 w-3.5 shrink-0 text-zinc-500" />
              <input
                value={firmName}
                onChange={(e) => setFirmName(e.target.value)}
                placeholder="mis. Wirjawan & Rekan"
                className="min-w-0 flex-1 bg-transparent py-2 text-sm text-zinc-100 outline-none placeholder:text-zinc-600"
              />
            </div>
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Bidang praktik">
              <SelectBox
                value={practiceArea}
                onChange={(v) => setPracticeArea(v as PracticeArea)}
                options={PRACTICE_AREAS}
              />
            </Field>
            <Field label="Jenis dokumen">
              <SelectBox
                value={docType}
                onChange={(v) => setDocType(v as DocType)}
                options={DOC_TYPES}
              />
            </Field>
          </div>

          <Field label="Dokumen contoh">
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => loadPreset(p)}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[11px] font-medium transition-colors",
                    activePreset === p.id
                      ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-300"
                      : "border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-zinc-700 hover:text-zinc-100",
                  )}
                >
                  <FileText className="h-3 w-3 text-emerald-400" />
                  {p.label}
                </button>
              ))}
            </div>
          </Field>

          <Field
            label="Teks dokumen"
            hint={
              <span
                className={cn(
                  text.trim().length >= MIN_CHARS ? "text-zinc-500" : "text-amber-400/80",
                )}
              >
                {text.length.toLocaleString("id-ID")} karakter
                {text.trim().length < MIN_CHARS ? ` · min. ${MIN_CHARS}` : ""}
              </span>
            }
          >
            <textarea
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                setActivePreset(null);
              }}
              rows={12}
              placeholder="Tempel teks perjanjian, putusan, atau peraturan di sini — atau pilih dokumen contoh di atas."
              className="w-full resize-y rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 font-mono text-[12px] leading-relaxed text-zinc-200 outline-none placeholder:font-sans placeholder:text-zinc-600 focus:border-emerald-500/40"
            />
          </Field>

          <button
            type="button"
            onClick={runAnalysis}
            disabled={!canRun}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-emerald-950 transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {phase === "processing" ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Menganalisis…
              </>
            ) : (
              <>
                <FileSearch className="h-4 w-4" />
                Jalankan Analisis
              </>
            )}
          </button>
        </div>

        {/* ============ RIGHT: legal research assistant ============ */}
        <div className="min-w-0 p-4">
          <p className="mb-3 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
            <Sparkles className="h-3.5 w-3.5" />
            Asisten riset hukum
          </p>

          {phase === "idle" ? (
            <IdlePlaceholder />
          ) : (
            <div className="space-y-4">
              <StatusHeader
                phase={phase}
                result={result}
                area={
                  PRACTICE_AREAS.find((a) => a.value === practiceArea)?.label ?? ""
                }
              />

              {phase === "processing" || !result ? (
                <ProcessLog steps={steps} />
              ) : (
                <>
                  <SummaryCard summary={result.summary} risks={result.risks} />
                  <RiskList risks={result.risks} />
                  <ClauseList clauses={result.clauses} />
                  <QaBox
                    suggestions={result.qa}
                    log={qaLog}
                    draft={qaDraft}
                    onDraft={setQaDraft}
                    onAsk={askQuestion}
                  />
                  <AuditFooter />
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ---- Left-panel primitives ------------------------------------------

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 flex items-center justify-between text-[11px] font-medium text-zinc-400">
        {label}
        {hint ? <span className="font-mono text-[10px]">{hint}</span> : null}
      </span>
      {children}
    </label>
  );
}

function SelectBox({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none rounded-lg border border-zinc-800 bg-zinc-900 px-2.5 py-2 pr-8 text-sm text-zinc-100 outline-none focus:border-emerald-500/40"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-zinc-900">
            {o.label}
          </option>
        ))}
      </select>
      <ChevronRight className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 rotate-90 text-zinc-500" />
    </div>
  );
}

// ---- Right-panel: idle + status ------------------------------------

function IdlePlaceholder() {
  return (
    <div className="grid place-items-center rounded-xl border border-dashed border-zinc-800 px-6 py-14 text-center">
      <FileSearch className="h-8 w-8 text-zinc-700" />
      <p className="mt-3 text-sm font-medium text-zinc-300">
        Belum ada dokumen dianalisis
      </p>
      <p className="mt-1 max-w-xs text-xs leading-relaxed text-zinc-500">
        Pilih salah satu dokumen contoh atau tempel teks Anda di panel kiri, lalu
        tekan <span className="text-zinc-300">Jalankan Analisis</span> untuk melihat
        ringkasan risiko, klausul tersitasi, dan tanya-jawab.
      </p>
    </div>
  );
}

function StatusHeader({
  phase,
  result,
  area,
}: {
  phase: Phase;
  result: AnalysisResult | null;
  area: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/50 px-3 py-2.5">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[11px] font-semibold text-emerald-300">
        <span
          className={cn(
            "h-1.5 w-1.5 rounded-full bg-emerald-400",
            phase === "processing" && "animate-pulse",
          )}
        />
        Simulasi Active
      </span>
      {area ? (
        <span className="rounded-full border border-zinc-800 px-2 py-0.5 text-[11px] text-zinc-400">
          {area}
        </span>
      ) : null}
      <span className="ml-auto flex items-center gap-3 font-mono text-[11px] text-zinc-400">
        <span>
          Latency{" "}
          <span className="text-zinc-200">
            {phase === "processing" || !result ? "…" : `${result.latencyMs} ms`}
          </span>
        </span>
        <span>
          Vector match{" "}
          <span className="text-emerald-400">
            {phase === "processing" || !result ? "…" : result.matchScore}
          </span>
        </span>
      </span>
    </div>
  );
}

function ProcessLog({ steps }: { steps: string[] }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-3" aria-live="polite">
      <ol className="space-y-1.5 font-mono text-[11px] leading-relaxed">
        {steps.map((s) => (
          <li key={s} className="flex gap-2 text-zinc-400">
            <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
            <span>{s}</span>
          </li>
        ))}
        <li className="flex items-center gap-2 text-zinc-600">
          <Loader2 className="h-3 w-3 animate-spin" />
          <span>memproses…</span>
        </li>
      </ol>
    </div>
  );
}

// ---- Right-panel: analysis result --------------------------------

function SummaryCard({ summary, risks }: { summary: string; risks: Risk[] }) {
  const reds = risks.filter((r) => r.level === "red").length;
  const yellows = risks.length - reds;
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-3.5">
      <p className="flex items-center gap-1.5 text-xs font-semibold text-zinc-200">
        <ListChecks className="h-3.5 w-3.5 text-emerald-400" />
        Ringkasan eksekutif
      </p>
      <p className="mt-2 text-[13px] leading-relaxed text-zinc-400">{summary}</p>
      <div className="mt-3 flex gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-md border border-rose-500/30 bg-rose-500/10 px-2 py-1 text-[11px] font-medium text-rose-300">
          <ShieldAlert className="h-3 w-3" />
          {reds} Red flag
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-md border border-amber-500/30 bg-amber-500/10 px-2 py-1 text-[11px] font-medium text-amber-300">
          <TriangleAlert className="h-3 w-3" />
          {yellows} Yellow flag
        </span>
      </div>
    </div>
  );
}

function RiskList({ risks }: { risks: Risk[] }) {
  return (
    <div>
      <p className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
        <ShieldAlert className="h-3.5 w-3.5" />
        Identifikasi risiko
      </p>
      <ul className="space-y-2">
        {risks.map((r, i) => (
          <li
            key={`${r.citation}-${i}`}
            className={cn(
              "rounded-lg border p-2.5",
              r.level === "red"
                ? "border-rose-500/25 bg-rose-500/[0.06]"
                : "border-amber-500/25 bg-amber-500/[0.06]",
            )}
          >
            <div className="flex items-center justify-between gap-2">
              <span
                className={cn(
                  "flex items-center gap-1.5 text-xs font-semibold",
                  r.level === "red" ? "text-rose-300" : "text-amber-300",
                )}
              >
                {r.level === "red" ? (
                  <ShieldAlert className="h-3.5 w-3.5" />
                ) : (
                  <TriangleAlert className="h-3.5 w-3.5" />
                )}
                {r.title}
              </span>
              <span className="shrink-0 rounded border border-zinc-700 bg-zinc-900 px-1.5 py-0.5 font-mono text-[10px] text-zinc-400">
                [{r.citation}]
              </span>
            </div>
            <p className="mt-1.5 text-[12px] leading-relaxed text-zinc-400">{r.detail}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ClauseList({ clauses }: { clauses: Clause[] }) {
  return (
    <div>
      <p className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
        <Search className="h-3.5 w-3.5" />
        Ekstraksi klausul kunci
      </p>
      <ul className="divide-y divide-zinc-800 overflow-hidden rounded-lg border border-zinc-800">
        {clauses.map((c, i) => (
          <li key={`${c.citation}-${i}`} className="flex gap-3 bg-zinc-900/40 p-2.5">
            <span className="mt-0.5 shrink-0 rounded border border-emerald-500/30 bg-emerald-500/10 px-1.5 py-0.5 font-mono text-[10px] text-emerald-300">
              [{c.citation}]
            </span>
            <span className="min-w-0">
              <span className="block text-xs font-medium text-zinc-200">{c.title}</span>
              <span className="block text-[12px] leading-relaxed text-zinc-500">
                {c.excerpt}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function QaBox({
  suggestions,
  log,
  draft,
  onDraft,
  onAsk,
}: {
  suggestions: QA[];
  log: QA[];
  draft: string;
  onDraft: (v: string) => void;
  onAsk: (q: string) => void;
}) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-3.5">
      <p className="flex items-center gap-1.5 text-xs font-semibold text-zinc-200">
        <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
        Tanya dokumen ini
      </p>

      <div className="mt-2.5 flex flex-wrap gap-1.5">
        {suggestions.map((s) => (
          <button
            key={s.q}
            type="button"
            onClick={() => onAsk(s.q)}
            className="rounded-full border border-zinc-700 bg-zinc-900 px-2.5 py-1 text-[11px] text-zinc-300 transition-colors hover:border-emerald-500/40 hover:text-emerald-300"
          >
            {s.q}
          </button>
        ))}
      </div>

      {log.length > 0 ? (
        <div className="mt-3 space-y-2.5">
          {log.map((item, i) => (
            <div key={i} className="space-y-1.5">
              <p className="flex gap-2 text-[12px] font-medium text-zinc-200">
                <span className="shrink-0 text-emerald-400">Q</span>
                {item.q}
              </p>
              <p className="flex gap-2 text-[12px] leading-relaxed text-zinc-400">
                <span className="shrink-0 text-zinc-500">A</span>
                {item.a}
              </p>
            </div>
          ))}
        </div>
      ) : null}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onAsk(draft);
        }}
        className="mt-3 flex items-center gap-2"
      >
        <input
          value={draft}
          onChange={(e) => onDraft(e.target.value)}
          aria-label="Pertanyaan tentang dokumen"
          placeholder="Tulis pertanyaan Anda…"
          className="min-w-0 flex-1 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-emerald-500/40"
        />
        <button
          type="submit"
          aria-label="Kirim pertanyaan"
          disabled={!draft.trim()}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-emerald-500 text-emerald-950 transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          <SendHorizontal className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}

function AuditFooter() {
  const tags: { icon: LucideIcon; label: string }[] = [
    { icon: LockKeyhole, label: "PII Redacted" },
    { icon: ClipboardCheck, label: "Vector Indexing Complete" },
    { icon: BadgeCheck, label: "Citations Verified" },
  ];
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-3">
      <div className="flex flex-wrap gap-1.5">
        {tags.map((t) => (
          <span
            key={t.label}
            className="inline-flex items-center gap-1 rounded border border-emerald-500/25 bg-emerald-500/10 px-1.5 py-0.5 text-[11px] text-emerald-300"
          >
            <t.icon className="h-3 w-3" />
            {t.label}
          </span>
        ))}
      </div>
      <p className="mt-2.5 flex gap-2 text-[11px] leading-relaxed text-zinc-500">
        <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0 text-zinc-600" />
        Simulasi untuk demonstrasi. Analisis dihasilkan oleh heuristik/skrip, bukan
        oleh advokat, dan tidak menggantikan fungsi penasihat hukum resmi. Verifikasi
        setiap temuan sebelum digunakan.
      </p>
    </div>
  );
}
