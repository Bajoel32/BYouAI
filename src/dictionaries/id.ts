/**
 * Indonesian copy — the default locale and the source of truth for the
 * dictionary shape. `Dictionary = typeof id`; `en.ts` must satisfy it.
 *
 * Only the "core" surfaces are translated for now: nav, footer, home sections,
 * the standalone section/legal pages, and per-page metadata. The interactive
 * demos (rag-sandbox, legal-rag-simulation, clinic-admin-simulation, the
 * e-commerce sandbox, the invoice editor, the consultation chat) still carry
 * their own hardcoded Indonesian strings and render the same in every locale.
 */

const SITE = "https://byouai.com";

export const id = {
  site: SITE,

  common: {
    skipToContent: "Lewati ke konten",
    lastUpdated: "Terakhir diperbarui",
  },

  meta: {
    titleDefault: "BYouAI — AI kustom berbasis RAG untuk bisnis Anda",
    titleTemplate: "%s · BYouAI",
    description:
      "BYouAI membangun asisten dan agent AI berbasis RAG di atas data Anda sendiri — untuk e-commerce, firma hukum, praktik dokter, dan industri lain. Akurat, tersitasi, siap produksi.",
    keywords: [
      "AI kustom",
      "RAG",
      "retrieval augmented generation",
      "AI agent",
      "chatbot perusahaan",
      "AI untuk bisnis",
      "AI e-commerce",
      "AI firma hukum",
    ],
    ogTitle: "BYouAI — AI kustom berbasis RAG",
    ogDescription:
      "Asisten & agent AI di atas data Anda sendiri. Akurat, tersitasi, siap produksi.",
    twitterTitle: "BYouAI — AI kustom berbasis RAG",
    twitterDescription: "Asisten & agent AI di atas data Anda sendiri.",
    pages: {
      solusi: {
        title: "Solusi",
        description:
          "Agent AI kustom untuk e-commerce, firma hukum, klinik, dan industri lain — dibangun di atas data dan alur kerja Anda.",
      },
      caraKerja: {
        title: "Cara Kerja",
        description:
          "Dari data mentah ke jawaban tepercaya: hubungkan data, indeks & pahami, RAG + reasoning, lalu deploy & pantau.",
      },
      keamanan: {
        title: "Keamanan",
        description:
          "Enkripsi AES-256, isolasi per klien, opsi on-prem/VPC, SSO/RBAC/audit log — standar keamanan enterprise.",
      },
      harga: {
        title: "Harga",
        description:
          "Paket Pilot, Growth, dan Enterprise. Mulai kecil, buktikan, lalu skalakan — semua paket termasuk sitasi sumber dan kontrol data penuh.",
      },
      faq: {
        title: "FAQ",
        description:
          "Pertanyaan yang sering muncul seputar keamanan data, pilihan model, lama implementasi, dan cara akurasi jawaban dijaga.",
      },
      fitur: {
        title: "Kemampuan",
        description:
          "Infrastruktur AI berbasis pengetahuan yang siap produksi — RAG siap pakai, model-agnostik, guardrails, observability, kontrol data.",
      },
      tentang: {
        title: "Tentang",
        description:
          "BYouAI membangun asisten dan agent AI berbasis RAG di atas data bisnis Anda sendiri — akurat, tersitasi, dan siap produksi.",
      },
      konsultasi: {
        title: "Konsultasi",
        description:
          "Ceritakan kebutuhan Anda ke asisten BYouAI — cakupan, data, dan estimasi biaya untuk AI kustom berbasis RAG di atas data Anda sendiri.",
      },
      solusiEcommerce: {
        title: "Solusi E-commerce",
        description:
          "Agent AI untuk toko online — menjawab dari katalog, stok, harga, dan kebijakan retur Anda secara real-time, dengan aksi ke API toko dan handoff ke tim CS.",
      },
      privasi: {
        title: "Kebijakan Privasi",
        description:
          "Bagaimana BYouAI mengumpulkan, memakai, dan melindungi data pribadi di situs dan layanannya.",
      },
      ketentuan: {
        title: "Syarat Layanan",
        description:
          "Ketentuan penggunaan situs BYouAI dan kerangka umum untuk keterlibatan layanan.",
      },
      pemrosesanData: {
        title: "Pemrosesan Data",
        description:
          "Ringkasan Adendum Pemrosesan Data BYouAI: peran, ruang lingkup, keamanan, subprocessor, dan hak audit.",
      },
      invoice: {
        title: "Invoice",
        description: "Generator invoice internal BYouAI.",
      },
    },
  },

  nav: {
    home: "BYouAI — beranda",
    links: [
      { href: "/solusi", label: "Solusi" },
      { href: "/cara-kerja", label: "Cara Kerja" },
      { href: "/keamanan", label: "Keamanan" },
      { href: "/harga", label: "Harga" },
      { href: "/faq", label: "FAQ" },
      { href: "/invoice", label: "Estimasi" },
    ],
    cta: "Konsultasi",
    ctaMobile: "Konsultasi gratis",
    menuOpen: "Buka menu",
    menuClose: "Tutup menu",
    langLabel: "Ganti bahasa",
  },

  themeToggle: {
    label: "Tema",
    current: "Tema saat ini",
    switchTo: "Ganti ke",
    modes: {
      system: "sistem",
      light: "terang",
      dark: "gelap",
    },
  },

  footer: {
    tagline:
      "AI kustom berbasis RAG di atas data Anda sendiri. Akurat, tersitasi, siap produksi.",
    rights: "Semua hak dilindungi.",
    madeIn: "Dibuat di Indonesia",
    columns: [
      {
        title: "Produk",
        links: [
          { label: "Cara Kerja", href: "/cara-kerja" },
          { label: "Kemampuan", href: "/fitur" },
          { label: "Keamanan", href: "/keamanan" },
          { label: "Harga", href: "/harga" },
          { label: "Estimasi", href: "/invoice" },
        ],
      },
      {
        title: "Solusi",
        links: [
          { label: "E-commerce", href: "/solusi/e-commerce" },
          { label: "Firma Hukum", href: "/solusi/firma-hukum" },
          { label: "Klinik & Dokter", href: "/solusi/klinik-dokter" },
          { label: "Industri lain", href: "/konsultasi?industri=lainnya" },
        ],
      },
      {
        title: "Perusahaan",
        links: [
          { label: "Tentang", href: "/tentang" },
          { label: "Konsultasi", href: "/konsultasi" },
          { label: "Kontak", href: "mailto:halo@byouai.com" },
          { label: "Karier", href: "mailto:karier@byouai.com" },
        ],
      },
      {
        title: "Legal",
        links: [
          { label: "Kebijakan Privasi", href: "/privasi" },
          { label: "Syarat Layanan", href: "/ketentuan" },
          { label: "Pemrosesan Data", href: "/pemrosesan-data" },
        ],
      },
    ],
  },

  hero: {
    badge: "Platform AI Kustom",
    titleBefore: "AI yang paham",
    titleEmphasis: "domain",
    titleAfter: "bisnis Anda.",
    lead: "BYouAI membangun asisten dan agent AI berbasis RAG di atas data Anda sendiri — untuk e-commerce, firma hukum, praktik dokter, dan industri lain. Akurat, tersitasi, siap produksi.",
    ctaPrimary: "Konsultasi gratis",
    ctaSecondary: "Lihat cara kerja →",
    fineprint:
      "Enkripsi end-to-end · Data Anda tidak melatih model publik · Opsi on-prem",
    pipeline: ["Data Anda", "Indeks vektor", "RAG + LLM", "Jawaban + sitasi"],
  },

  trust: {
    caption: "Dirancang untuk alur kerja spesifik industri",
    ariaList: "Industri yang dilayani",
    industries: [
      "E-commerce",
      "Firma Hukum",
      "Klinik & Dokter",
      "Logistik",
      "Pendidikan",
      "Keuangan",
      "Properti",
      "SaaS B2B",
      "Manufaktur",
      "Pariwisata",
    ],
  },

  cta: {
    titleBefore: "Mulai dari satu use-case.",
    titleEmphasis: "Lihat hasilnya",
    titleAfter: "dalam 3 minggu.",
    lead: "Buat estimasi paket dalam satu menit, atau ceritakan alur kerja dan data Anda — kami kembali dengan rancangan solusi, tanpa biaya.",
    primary: "Buat estimasi paket",
    secondary: "Jadwalkan konsultasi",
  },

  features: {
    kicker: "Kemampuan Inti",
    title: "Infrastruktur AI yang tidak perlu Anda bangun sendiri",
    lead: "Semua yang dibutuhkan untuk menjalankan AI berbasis pengetahuan di produksi — dalam satu platform.",
    items: [
      {
        icon: "bolt",
        title: "RAG Function siap pakai",
        body: "Satu endpoint: kirim pertanyaan, terima jawaban lengkap dengan sitasi ke dokumen sumbernya. Tanpa merakit pipeline sendiri.",
        wide: true,
      },
      {
        icon: "layers",
        title: "Model-agnostik",
        body: "Claude, GPT, Llama, atau model lokal. Ganti kapan saja tanpa menulis ulang aplikasi Anda.",
        wide: true,
      },
      {
        icon: "shield",
        title: "Guardrails & evaluasi",
        body: "Uji regresi jawaban, deteksi halusinasi, dan redaksi PII otomatis.",
        wide: false,
      },
      {
        icon: "plug",
        title: "Integrasi luas",
        body: "Postgres, Notion, Google Drive, Shopify, WhatsApp, Slack, dan REST API.",
        wide: false,
      },
      {
        icon: "activity",
        title: "Observability penuh",
        body: "Trace tiap retrieval, latency, dan biaya per jawaban dalam satu dashboard.",
        wide: false,
      },
      {
        icon: "database",
        title: "Kontrol data",
        body: "Region penyimpanan pilihan, retensi terkonfigurasi, ekspor dan hapus kapan saja.",
        wide: false,
      },
    ],
  },

  howItWorks: {
    kicker: "Cara Kerja",
    title: "Dari data mentah ke jawaban tepercaya",
    lead: "Pipeline RAG dengan sitasi di setiap langkah — dapat diaudit, bukan kotak hitam.",
    steps: [
      {
        n: "01",
        t: "Hubungkan data",
        d: "Dokumen, database, API, tiket, email, spreadsheet. Kami ingest, bersihkan, dan petakan strukturnya.",
      },
      {
        n: "02",
        t: "Indeks & pahami",
        d: "Chunking, embedding, dan knowledge graph opsional. Indeks diperbarui otomatis saat data Anda berubah.",
      },
      {
        n: "03",
        t: "RAG + reasoning",
        d: "Retrieval hybrid — kata kunci dan vektor — lalu LLM pilihan Anda menyusun jawaban. Setiap jawaban membawa sumbernya.",
      },
      {
        n: "04",
        t: "Deploy & pantau",
        d: "Widget web, REST API, Slack, atau WhatsApp. Dashboard untuk akurasi, latency, dan biaya per jawaban.",
      },
    ],
  },

  security: {
    kicker: "Keamanan & Kepatuhan",
    title: "Dibangun dengan standar keamanan enterprise",
    lead: "Data yang Anda serahkan adalah aset paling sensitif Anda. Kami memperlakukannya seperti itu — dari infrastruktur sampai kontrak.",
    items: [
      "Enkripsi AES-256 saat transit dan saat diam",
      "Isolasi data per klien — tidak ada pencampuran tenant",
      "Opsi deployment on-prem atau di dalam VPC Anda",
      "Data Anda tidak dipakai melatih model pihak ketiga",
      "SSO, RBAC, dan audit log yang dapat diekspor",
      "Region penyimpanan data dapat dipilih",
      "Retensi dan penghapusan data yang dapat dikonfigurasi",
      "Selaras dengan UU PDP; sertifikasi SOC 2 dalam proses",
    ],
  },

  faq: {
    kicker: "FAQ",
    title: "Pertanyaan yang sering muncul",
    lead: "Belum terjawab? Tulis ke halo@byouai.com — kami balas dalam 1 hari kerja.",
    items: [
      {
        q: "Apakah data kami aman dan privat?",
        a: "Ya. Data Anda terenkripsi, terisolasi per klien, dan tidak pernah dipakai untuk melatih model pihak ketiga. Tersedia opsi on-prem dan pemilihan region penyimpanan.",
      },
      {
        q: "Model AI apa yang dipakai?",
        a: "Model-agnostik. Anda bisa memakai Claude, GPT, Llama, atau model lokal — dan menggantinya kapan saja tanpa menulis ulang aplikasi.",
      },
      {
        q: "Berapa lama implementasinya?",
        a: "Pilot biasanya 2–3 minggu. Versi produksi 6–10 minggu, tergantung jumlah dan kompleksitas integrasi data.",
      },
      {
        q: "Bagaimana akurasi jawaban dijaga?",
        a: "Retrieval hybrid, sitasi ke sumber pada setiap jawaban, uji regresi jawaban, deteksi halusinasi, serta opsi human-in-the-loop untuk kasus sensitif.",
      },
      {
        q: "Bisakah dijalankan on-premise?",
        a: "Bisa. Kami mendukung deployment di server Anda sendiri atau di dalam VPC Anda, termasuk dengan model bahasa lokal.",
      },
      {
        q: "Apakah Bahasa Indonesia didukung penuh?",
        a: "Ya, termasuk teks campur kode Indonesia–Inggris dan istilah domain spesifik industri Anda.",
      },
    ],
  },

  solutions: {
    kicker: "Solusi per Industri",
    title: "Satu platform, disesuaikan dengan cara kerja Anda",
    lead: "Kami tidak menjual chatbot generik. Setiap solusi dibangun di atas data, aturan, dan alur kerja spesifik industri Anda.",
    items: [
      {
        tag: "E-commerce",
        title: "Agent belanja & customer service",
        body: "Menjawab dari katalog, stok, harga, dan kebijakan retur Anda secara real-time. Rekomendasi produk berbasis data toko, bukan tebakan.",
        points: [
          "Sinkron katalog & inventori",
          "Handoff mulus ke agen manusia",
          "Rekomendasi & upsell kontekstual",
        ],
        cta: { href: "/solusi/e-commerce", label: "Lihat alur kerja & mulai" },
      },
      {
        tag: "Firma Hukum",
        title: "Riset & analisis dokumen",
        body: "Menelusuri ribuan berkas kasus, meringkas kontrak, dan menarik klausul relevan — setiap jawaban menyertakan sitasi ke sumbernya.",
        points: [
          "Ekstraksi & perbandingan klausul",
          "Ringkasan berjenjang",
          "Jejak sitasi penuh",
        ],
        cta: { href: "/solusi/firma-hukum", label: "Coba simulasi" },
      },
      {
        tag: "Klinik & Dokter",
        title: "Asisten triage & administrasi",
        body: "Menjawab dari protokol dan SOP klinik Anda. Menyusun ringkasan kunjungan dan menangani pertanyaan pasien rutin dengan aman.",
        points: [
          "Berbasis protokol internal",
          "Redaksi data pasien (PII)",
          "Audit log lengkap",
        ],
        cta: {
          href: "/solusi/klinik-dokter",
          label: "Coba simulasi suara ke teks",
        },
      },
    ],
    other: {
      title: "Industri Anda tidak ada di sini?",
      body: "Punya data dan alur kerja yang unik — logistik, pendidikan, manufaktur, layanan publik? Kami rancang solusinya dari nol.",
      cta: "Bicara dengan tim",
    },
  },

  pricing: {
    kicker: "Harga",
    title: "Mulai kecil, buktikan, lalu skalakan",
    lead: "Harga disesuaikan dengan ruang lingkup, volume, dan integrasi. Semua paket termasuk sitasi sumber dan kontrol data penuh.",
    popular: "Populer",
    from: "mulai dari",
    tiers: {
      pilot: {
        tagline: "Bukti nilai dalam 2–3 minggu",
        features: [
          "1 use-case terbatas",
          "Hingga 3 sumber data",
          "Evaluasi akurasi awal",
          "Laporan kelayakan & rekomendasi",
        ],
        cta: "Mulai pilot",
      },
      growth: {
        tagline: "Satu use-case, siap produksi",
        features: [
          "Integrasi data & channel penuh",
          "Guardrails & evaluasi kontinu",
          "Dashboard observability",
          "SLA dan dukungan prioritas",
        ],
        cta: "Ajukan penawaran",
      },
      enterprise: {
        tagline: "Multi use-case & on-prem",
        features: [
          "Deployment on-prem / VPC",
          "SSO, RBAC, audit log",
          "Model lokal / privat",
          "Solutions engineer khusus",
        ],
        cta: "Hubungi tim",
      },
    },
  },

  /** Headline block for /konsultasi. The rest of the page (form fields, chat UI)
   * is still hardcoded Indonesian — see the file header note. */
  konsultasi: {
    kicker: "Konsultasi",
    titleBefore: "Ceritakan kebutuhan Anda.",
    titleEmphasis: "Dapatkan arah solusi",
    titleAfter: "dalam hitungan menit.",
    lead: "Asisten ini menjawab dengan basis pengetahuan BYouAI. Isi data singkat, lalu tanyakan apa saja — dari cakupan, kesiapan data, hingga estimasi biaya.",
  },

  /** Headline block for /solusi/e-commerce. The rest of the page (sandbox demos,
   * lead form) is still hardcoded Indonesian — see the file header note. */
  solusiEcommerce: {
    kicker: "Solusi · E-commerce",
    titleBefore: "Agent belanja & customer service yang",
    titleEmphasis: "tahu isi toko Anda",
    lead: "Dibangun di atas katalog, inventori, dan kebijakan toko Anda — bukan chatbot generik. Setiap jawaban membawa sumbernya, setiap aksi terhubung ke sistem yang sudah Anda pakai.",
  },

  og: {
    title: "AI yang paham domain bisnis Anda.",
    description:
      "Asisten & agent AI berbasis RAG di atas data Anda sendiri — akurat, tersitasi, siap produksi.",
    footer: "E-commerce · Firma Hukum · Klinik & Dokter · dan lainnya",
  },

  /**
   * Standalone content pages. Bodies are trusted, author-written HTML rendered
   * into the `.doc-prose` container. In-page absolute links (`href="/..."`) are
   * re-prefixed per locale by `DocPage`.
   */
  docs: {
    tentang: {
      kicker: "Tentang",
      title:
        "Kami membangun AI di atas data Anda, bukan menjual chatbot generik",
      intro:
        "BYouAI adalah tim kecil yang fokus pada satu hal: menjadikan pengetahuan internal sebuah organisasi dapat ditanyakan, dengan jawaban yang bisa ditelusuri sampai ke sumbernya.",
      updated: "",
      body: `
        <h2>Yang kami kerjakan</h2>
        <p>Kami merancang, membangun, dan mengoperasikan asisten serta agent AI berbasis <strong>retrieval-augmented generation</strong> (RAG) di atas dokumen, basis data, dan sistem yang sudah Anda pakai. Setiap jawaban membawa sitasi ke dokumen sumbernya, sehingga tim Anda bisa memverifikasi, bukan sekadar mempercayai.</p>
        <h2>Prinsip</h2>
        <ul>
          <li><strong>Dapat diaudit.</strong> Retrieval, sitasi, latency, dan biaya per jawaban terlihat — tidak ada kotak hitam.</li>
          <li><strong>Data Anda tetap milik Anda.</strong> Tidak dipakai melatih model pihak ketiga; region penyimpanan, retensi, dan penghapusan Anda yang menentukan.</li>
          <li><strong>Model-agnostik.</strong> Claude, GPT, Llama, atau model lokal — dapat diganti tanpa menulis ulang aplikasi.</li>
          <li><strong>Mulai kecil.</strong> Satu use-case dibuktikan lebih dulu, baru diskalakan.</li>
        </ul>
        <h2>Hubungi kami</h2>
        <p>Tulis ke <a href="mailto:halo@byouai.com">halo@byouai.com</a> dengan gambaran alur kerja dan data Anda. Kami kembali dengan rancangan solusi dan estimasi, tanpa biaya. Untuk lamaran dan kolaborasi: <a href="mailto:karier@byouai.com">karier@byouai.com</a>.</p>
      `,
    },
    privasi: {
      kicker: "Legal",
      title: "Kebijakan Privasi",
      intro:
        "Kebijakan ini menjelaskan bagaimana BYouAI menangani data pribadi yang kami terima melalui situs ini dan saat menjajaki atau menjalankan sebuah proyek.",
      updated: "September 2026",
      body: `
        <h2>1. Data yang kami kumpulkan</h2>
        <ul>
          <li><strong>Data kontak</strong> yang Anda kirim lewat email atau formulir konsultasi: nama, alamat email, perusahaan, dan isi pesan.</li>
          <li><strong>Data teknis</strong> standar server web: alamat IP, jenis peramban, dan halaman yang diakses. Situs ini tidak memakai cookie pelacakan iklan.</li>
        </ul>
        <h2>2. Cara kami memakainya</h2>
        <p>Untuk menanggapi permintaan Anda, menyiapkan rancangan solusi dan penawaran, serta menjaga keamanan dan keandalan situs. Kami tidak menjual data pribadi.</p>
        <h2>3. Data proyek klien</h2>
        <p>Data yang Anda serahkan untuk sebuah implementasi (dokumen, basis data, rekaman) diatur oleh perjanjian layanan dan <a href="/pemrosesan-data">Adendum Pemrosesan Data</a>, bukan oleh kebijakan situs ini. Data tersebut terisolasi per klien dan tidak dipakai untuk melatih model pihak ketiga.</p>
        <h2>4. Berbagi dengan pihak ketiga</h2>
        <p>Kami memakai sejumlah pemroses (subprocessor) untuk hosting, email, dan analitik agregat. Mereka terikat kewajiban kerahasiaan dan hanya memproses data atas instruksi kami. Daftar terkini tersedia atas permintaan.</p>
        <h2>5. Penyimpanan dan retensi</h2>
        <p>Data kontak disimpan selama diperlukan untuk hubungan bisnis lalu dihapus atau dianonimkan. Anda dapat meminta penghapusan lebih awal kapan saja.</p>
        <h2>6. Hak Anda</h2>
        <p>Sesuai UU Perlindungan Data Pribadi, Anda berhak mengakses, memperbaiki, dan menghapus data pribadi Anda, serta menarik persetujuan. Ajukan lewat <a href="mailto:privasi@byouai.com">privasi@byouai.com</a>.</p>
        <h2>7. Perubahan</h2>
        <p>Kami dapat memperbarui kebijakan ini; tanggal &ldquo;terakhir diperbarui&rdquo; di atas selalu mencerminkan versi berlaku.</p>
      `,
    },
    ketentuan: {
      kicker: "Legal",
      title: "Syarat Layanan",
      intro:
        "Ketentuan ini mengatur penggunaan situs byouai.com. Setiap proyek berbayar diatur oleh perjanjian layanan (MSA/SOW) terpisah yang ditandatangani kedua pihak.",
      updated: "September 2026",
      body: `
        <h2>1. Penggunaan situs</h2>
        <p>Konten di situs ini disediakan untuk informasi umum. Anda setuju untuk tidak menyalahgunakan situs, mencoba mengakses sistem tanpa izin, atau mengganggu operasionalnya.</p>
        <h2>2. Bukan penawaran mengikat</h2>
        <p>Deskripsi produk, paket, dan estimasi waktu di situs ini bersifat indikatif dan tidak membentuk kontrak. Ruang lingkup, harga, SLA, dan jaminan yang mengikat hanya yang tercantum dalam SOW yang ditandatangani.</p>
        <h2>3. Kekayaan intelektual</h2>
        <p>Merek, logo, dan isi situs adalah milik BYouAI. Anda tetap memiliki seluruh data dan materi yang Anda serahkan dalam sebuah proyek; kepemilikan deliverable diatur dalam SOW terkait.</p>
        <h2>4. Tautan pihak ketiga</h2>
        <p>Situs dapat memuat tautan ke layanan pihak ketiga yang tidak kami kendali dan tidak kami jamin.</p>
        <h2>5. Batasan tanggung jawab</h2>
        <p>Sepanjang diizinkan hukum, BYouAI tidak bertanggung jawab atas kerugian tidak langsung atau konsekuensial yang timbul dari penggunaan situs ini.</p>
        <h2>6. Hukum yang berlaku</h2>
        <p>Ketentuan ini tunduk pada hukum Republik Indonesia. Pertanyaan: <a href="mailto:halo@byouai.com">halo@byouai.com</a>.</p>
      `,
    },
    pemrosesanData: {
      kicker: "Legal",
      title: "Adendum Pemrosesan Data",
      intro:
        "Ringkasan ini menjelaskan bagaimana BYouAI memproses data klien dalam sebuah implementasi. Adendum lengkap dilampirkan pada perjanjian layanan dan berlaku mengikat.",
      updated: "September 2026",
      body: `
        <h2>1. Peran para pihak</h2>
        <p>Klien bertindak sebagai <strong>pengendali data</strong>; BYouAI sebagai <strong>pemroses data</strong> yang hanya memproses data pribadi atas instruksi terdokumentasi dari klien.</p>
        <h2>2. Ruang lingkup dan tujuan</h2>
        <p>Pemrosesan terbatas pada apa yang diperlukan untuk menyediakan layanan: ingest, pengindeksan (chunking dan embedding), retrieval, serta pembuatan jawaban dengan sitasi. Data tidak dipakai untuk tujuan lain dan tidak dipakai melatih model dasar pihak ketiga.</p>
        <h2>3. Keamanan</h2>
        <ul>
          <li>Enkripsi AES-256 saat transit dan saat diam.</li>
          <li>Isolasi per klien — tanpa pencampuran tenant.</li>
          <li>Kontrol akses berbasis peran (RBAC), SSO, dan audit log.</li>
          <li>Redaksi PII otomatis pada alur yang dikonfigurasi untuk itu.</li>
          <li>Opsi deployment on-prem atau di dalam VPC klien.</li>
        </ul>
        <h2>4. Subprocessor</h2>
        <p>BYouAI dapat memakai subprocessor (mis. penyedia infrastruktur dan penyedia model) dengan kewajiban perlindungan data yang setara. Daftar terkini dan pemberitahuan perubahan disediakan sesuai adendum.</p>
        <h2>5. Lokasi dan transfer data</h2>
        <p>Region penyimpanan dipilih klien. Transfer lintas yurisdiksi, bila ada, memakai mekanisme perlindungan yang sah.</p>
        <h2>6. Retensi dan pengembalian</h2>
        <p>Saat layanan berakhir, data klien dikembalikan atau dihapus sesuai instruksi klien dalam jangka waktu yang disepakati, kecuali penyimpanan diwajibkan hukum.</p>
        <h2>7. Bantuan dan audit</h2>
        <p>BYouAI membantu klien menanggapi permintaan subjek data dan insiden, serta menyediakan informasi yang wajar untuk membuktikan kepatuhan. Permintaan: <a href="mailto:privasi@byouai.com">privasi@byouai.com</a>.</p>
      `,
    },
  },
};

/**
 * The dictionary shape. `id` is written without `as const`, so property types
 * widen to `string` / `string[]` and `en.ts` only has to match the structure,
 * not the exact Indonesian strings.
 */
export type Dictionary = typeof id;
