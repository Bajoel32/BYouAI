/**
 * Source content for the /konsultasi assistant's knowledge base.
 *
 * Hand-curated from the site's own copy (hero, cara kerja, kemampuan, keamanan,
 * solusi, harga, FAQ) so retrieval answers stay on-message and reviewable in
 * git. Run `npm run ingest` after editing to (re)embed into `knowledge_docs`;
 * `(source, slug)` is the stable identity, so edits upsert.
 *
 * Plain data only — this file is imported by scripts/ingest.ts outside Next, so
 * no `@/` aliases and no server-only imports.
 */

export type KnowledgeEntry = {
  /** Logical group. */
  source: string;
  /** Stable id within the source. */
  slug: string;
  title: string;
  /** Deep link on byouai.com, if the chunk maps to a page. */
  url?: string;
  content: string;
};

export const KNOWLEDGE: KnowledgeEntry[] = [
  {
    source: "overview",
    slug: "what-byouai-does",
    title: "Apa itu BYouAI",
    url: "https://byouai.com",
    content:
      "BYouAI membangun asisten dan agent AI berbasis RAG (retrieval augmented generation) di atas data bisnis Anda sendiri — untuk e-commerce, firma hukum, praktik dokter, dan industri lain. Jawaban akurat, selalu menyertakan sitasi ke sumber, dan siap produksi. Kami tidak menjual chatbot generik; setiap solusi dibangun di atas data, aturan, dan alur kerja spesifik Anda.",
  },
  {
    source: "overview",
    slug: "positioning",
    title: "Posisi produk",
    content:
      "BYouAI adalah infrastruktur AI berbasis pengetahuan yang tidak perlu Anda bangun sendiri: pipeline RAG siap pakai, model-agnostik, dengan guardrails, observability, dan kontrol data dalam satu platform. Fokusnya satu use-case yang benar-benar jalan di produksi, bukan demo.",
  },
  {
    source: "cara-kerja",
    slug: "step-1-connect-data",
    title: "Cara kerja — 1. Hubungkan data",
    url: "https://byouai.com/cara-kerja",
    content:
      "Langkah 1: Hubungkan data. Dokumen, database, API, tiket, email, spreadsheet. Kami ingest, bersihkan, dan petakan strukturnya.",
  },
  {
    source: "cara-kerja",
    slug: "step-2-index",
    title: "Cara kerja — 2. Indeks & pahami",
    url: "https://byouai.com/cara-kerja",
    content:
      "Langkah 2: Indeks & pahami. Chunking, embedding, dan knowledge graph opsional. Indeks diperbarui otomatis saat data Anda berubah.",
  },
  {
    source: "cara-kerja",
    slug: "step-3-rag-reasoning",
    title: "Cara kerja — 3. RAG + reasoning",
    url: "https://byouai.com/cara-kerja",
    content:
      "Langkah 3: RAG + reasoning. Retrieval hybrid — kata kunci dan vektor — lalu LLM pilihan Anda menyusun jawaban. Setiap jawaban membawa sumbernya.",
  },
  {
    source: "cara-kerja",
    slug: "step-4-deploy-monitor",
    title: "Cara kerja — 4. Deploy & pantau",
    url: "https://byouai.com/cara-kerja",
    content:
      "Langkah 4: Deploy & pantau. Widget web, REST API, Slack, atau WhatsApp. Dashboard untuk akurasi, latency, dan biaya per jawaban. Pipeline RAG dapat diaudit dengan sitasi di setiap langkah — bukan kotak hitam.",
  },
  {
    source: "kemampuan",
    slug: "rag-function",
    title: "Kemampuan — RAG Function siap pakai",
    url: "https://byouai.com/fitur",
    content:
      "RAG Function siap pakai: satu endpoint — kirim pertanyaan, terima jawaban lengkap dengan sitasi ke dokumen sumbernya. Tanpa merakit pipeline sendiri.",
  },
  {
    source: "kemampuan",
    slug: "model-agnostic",
    title: "Kemampuan — Model-agnostik",
    url: "https://byouai.com/fitur",
    content:
      "Model-agnostik: Claude, GPT, Llama, atau model lokal. Ganti model kapan saja tanpa menulis ulang aplikasi Anda.",
  },
  {
    source: "kemampuan",
    slug: "guardrails-eval",
    title: "Kemampuan — Guardrails & evaluasi",
    url: "https://byouai.com/fitur",
    content:
      "Guardrails & evaluasi: uji regresi jawaban, deteksi halusinasi, dan redaksi PII otomatis. Opsi human-in-the-loop untuk kasus sensitif.",
  },
  {
    source: "kemampuan",
    slug: "integrations",
    title: "Kemampuan — Integrasi",
    url: "https://byouai.com/fitur",
    content:
      "Integrasi luas: Postgres, Notion, Google Drive, Shopify, WhatsApp, Slack, dan REST API.",
  },
  {
    source: "kemampuan",
    slug: "observability",
    title: "Kemampuan — Observability",
    url: "https://byouai.com/fitur",
    content:
      "Observability penuh: trace tiap retrieval, latency, dan biaya per jawaban dalam satu dashboard.",
  },
  {
    source: "kemampuan",
    slug: "data-control",
    title: "Kemampuan — Kontrol data",
    url: "https://byouai.com/fitur",
    content:
      "Kontrol data: region penyimpanan pilihan, retensi terkonfigurasi, ekspor dan hapus kapan saja.",
  },
  {
    source: "keamanan",
    slug: "security-summary",
    title: "Keamanan & kepatuhan",
    url: "https://byouai.com/keamanan",
    content:
      "Keamanan enterprise: enkripsi AES-256 saat transit dan saat diam; isolasi data per klien tanpa pencampuran tenant; opsi deployment on-prem atau di dalam VPC Anda; data Anda tidak dipakai melatih model pihak ketiga; SSO, RBAC, dan audit log yang dapat diekspor; region penyimpanan dapat dipilih; retensi dan penghapusan data terkonfigurasi; selaras dengan UU PDP, sertifikasi SOC 2 dalam proses.",
  },
  {
    source: "solusi",
    slug: "ecommerce",
    title: "Solusi — E-commerce",
    url: "https://byouai.com/solusi",
    content:
      "E-commerce: agent belanja & customer service yang menjawab dari katalog, stok, harga, dan kebijakan retur secara real-time. Sinkron katalog & inventori, handoff mulus ke agen manusia, rekomendasi & upsell kontekstual berbasis data toko.",
  },
  {
    source: "solusi",
    slug: "hukum",
    title: "Solusi — Firma Hukum",
    url: "https://byouai.com/solusi",
    content:
      "Firma hukum: riset & analisis dokumen yang menelusuri ribuan berkas kasus, meringkas kontrak, dan menarik klausul relevan. Ekstraksi & perbandingan klausul, ringkasan berjenjang, jejak sitasi penuh di setiap jawaban.",
  },
  {
    source: "solusi",
    slug: "kesehatan",
    title: "Solusi — Klinik & Dokter",
    url: "https://byouai.com/solusi",
    content:
      "Klinik & dokter: asisten triage & administrasi yang menjawab dari protokol dan SOP klinik Anda, menyusun ringkasan kunjungan, dan menangani pertanyaan pasien rutin dengan aman. Berbasis protokol internal, redaksi data pasien (PII), audit log lengkap.",
  },
  {
    source: "solusi",
    slug: "industri-lain",
    title: "Solusi — Industri lain",
    url: "https://byouai.com/solusi",
    content:
      "Industri lain yang sudah dilayani atau cocok: logistik, pendidikan, keuangan & asuransi, properti, SaaS B2B, manufaktur, pariwisata. Jika alur kerja Anda melibatkan banyak dokumen atau pertanyaan berulang di atas data internal, pola RAG BYouAI berlaku.",
  },
  {
    source: "harga",
    slug: "plan-pilot",
    title: "Paket — Pilot",
    url: "https://byouai.com/harga",
    content:
      "Paket Pilot, mulai dari Rp25.000.000. Satu use-case terbatas, hingga 3 sumber data, evaluasi akurasi awal. Durasi 2–3 minggu. Cocok untuk membuktikan nilai sebelum komitmen produksi.",
  },
  {
    source: "harga",
    slug: "plan-growth",
    title: "Paket — Growth",
    url: "https://byouai.com/harga",
    content:
      "Paket Growth, mulai dari Rp75.000.000. Satu use-case siap produksi: integrasi data & channel penuh, guardrails, dashboard observability, dan SLA. Implementasi umumnya 6–10 minggu tergantung kompleksitas integrasi.",
  },
  {
    source: "harga",
    slug: "plan-enterprise",
    title: "Paket — Enterprise",
    url: "https://byouai.com/harga",
    content:
      "Paket Enterprise, mulai dari Rp150.000.000. Multi use-case, deployment on-prem/VPC, SSO/RBAC/audit log, dan solutions engineer khusus. Harga final menyesuaikan ruang lingkup.",
  },
  {
    source: "harga",
    slug: "estimate-flow",
    title: "Harga — cara mendapat estimasi",
    url: "https://byouai.com/invoice",
    content:
      "Estimasi paket bisa dibuat sendiri dalam satu menit lewat generator di /invoice (pilih paket, isi data, dapat draf invoice yang bisa disunting dan dicetak). Semua harga adalah estimasi awal, belum termasuk PPN 11%, dan menyesuaikan ruang lingkup akhir.",
  },
  {
    source: "faq",
    slug: "data-aman",
    title: "FAQ — Apakah data kami aman dan privat?",
    url: "https://byouai.com/faq",
    content:
      "Ya. Data Anda terenkripsi, terisolasi per klien, dan tidak pernah dipakai untuk melatih model pihak ketiga. Tersedia opsi on-prem dan pemilihan region penyimpanan.",
  },
  {
    source: "faq",
    slug: "model-apa",
    title: "FAQ — Model AI apa yang dipakai?",
    url: "https://byouai.com/faq",
    content:
      "Model-agnostik. Anda bisa memakai Claude, GPT, Llama, atau model lokal — dan menggantinya kapan saja tanpa menulis ulang aplikasi.",
  },
  {
    source: "faq",
    slug: "lama-implementasi",
    title: "FAQ — Berapa lama implementasinya?",
    url: "https://byouai.com/faq",
    content:
      "Pilot biasanya 2–3 minggu. Versi produksi 6–10 minggu, tergantung jumlah dan kompleksitas integrasi data.",
  },
  {
    source: "faq",
    slug: "akurasi",
    title: "FAQ — Bagaimana akurasi jawaban dijaga?",
    url: "https://byouai.com/faq",
    content:
      "Retrieval hybrid, sitasi ke sumber pada setiap jawaban, uji regresi jawaban, deteksi halusinasi, serta opsi human-in-the-loop untuk kasus sensitif.",
  },
  {
    source: "faq",
    slug: "on-premise",
    title: "FAQ — Bisakah dijalankan on-premise?",
    url: "https://byouai.com/faq",
    content:
      "Bisa. Kami mendukung deployment di server Anda sendiri atau di dalam VPC Anda, termasuk dengan model bahasa lokal.",
  },
  {
    source: "faq",
    slug: "bahasa-indonesia",
    title: "FAQ — Apakah Bahasa Indonesia didukung penuh?",
    url: "https://byouai.com/faq",
    content:
      "Ya, termasuk teks campur kode Indonesia–Inggris dan istilah domain spesifik industri Anda.",
  },
  {
    source: "proses",
    slug: "cara-mulai",
    title: "Cara memulai dengan BYouAI",
    url: "https://byouai.com/konsultasi",
    content:
      "Mulai dari satu use-case. Ceritakan alur kerja dan data Anda lewat konsultasi (gratis, tanpa komitmen) — tim kembali dengan rancangan solusi. Untuk estimasi biaya cepat, gunakan generator paket di /invoice. Kontak langsung: halo@byouai.com.",
  },
];
