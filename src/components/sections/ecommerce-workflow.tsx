import { Container, SectionHeading, Card } from "@/components/ui";
import { Icon, type IconName } from "@/components/icons";

/**
 * "Gambaran" alur kerja aplikasi agent AI untuk e-commerce — dari data toko
 * sampai jawaban + aksi di kanal pelanggan, dengan loop perbaikan. Statis
 * (server component); dipakai di /solusi/e-commerce.
 */

type Stage = {
  n: string;
  icon: IconName;
  title: string;
  body: string;
  items: string[];
};

const STAGES: Stage[] = [
  {
    n: "01",
    icon: "database",
    title: "Sumber data toko",
    body: "Semua yang jadi dasar jawaban ditarik dari sistem Anda, bukan diketik ulang.",
    items: [
      "Katalog, stok, harga, varian",
      "Riwayat & status order, resi",
      "Kebijakan retur, garansi, pengiriman",
      "Tiket CS & FAQ lama",
    ],
  },
  {
    n: "02",
    icon: "layers",
    title: "Sinkronisasi & indeks",
    body: "Data di-ingest, dibersihkan, lalu di-chunk dan di-embed. Indeks ikut berubah begitu stok atau harga berubah.",
    items: [
      "Konektor Shopify / Woo / marketplace",
      "Refresh inkremental (webhook / jadwal)",
      "Redaksi data pelanggan (PII)",
    ],
  },
  {
    n: "03",
    icon: "activity",
    title: "Agent AI — RAG + reasoning",
    body: "Retrieval hybrid (kata kunci + vektor) menyuplai konteks, LLM menyusun jawaban dan memutuskan aksi.",
    items: [
      "Jawab dari katalog & kebijakan, dengan sumber",
      "Rekomendasi & upsell kontekstual",
      "Aksi: cek resi, buat tiket retur, cek stok",
    ],
  },
  {
    n: "04",
    icon: "plug",
    title: "Kanal pelanggan",
    body: "Agent yang sama tampil di tempat pembeli sudah bertanya.",
    items: [
      "Widget web & halaman produk",
      "WhatsApp & Instagram DM",
      "Chat Tokopedia / Shopee",
    ],
  },
  {
    n: "05",
    icon: "monitor",
    title: "Handoff & analitik",
    body: "Kasus rumit naik ke manusia dengan konteks penuh; semuanya terukur.",
    items: [
      "Eskalasi mulus ke agen CS + ringkasan",
      "Dashboard akurasi, latency, biaya per jawaban",
      "CSAT & pertanyaan yang belum terjawab",
    ],
  },
];

const CAPABILITIES = [
  {
    icon: "shield" as IconName,
    title: "Guardrails toko",
    body: "Tidak menjanjikan stok/harga di luar data, tidak keluar dari kebijakan retur Anda.",
  },
  {
    icon: "bolt" as IconName,
    title: "Aksi, bukan cuma jawab",
    body: "Fungsi terhubung ke API toko: lacak paket, ubah alamat, mulai retur.",
  },
  {
    icon: "lock" as IconName,
    title: "Data tetap milik Anda",
    body: "Indeks per-tenant, PII diredaksi, LLM pilihan Anda — cloud atau privat.",
  },
];

export function EcommerceWorkflow() {
  return (
    <section className="py-16 md:py-24">
      <Container>
        <SectionHeading
          kicker="Gambaran Alur Kerja"
          title="Bagaimana agent e-commerce Anda bekerja"
          lead="Dari data toko yang selalu berubah menjadi jawaban dan aksi yang bisa diaudit — di setiap kanal tempat pembeli bertanya."
        />

        {/* Pipeline: horizontal di layar lebar, menumpuk di mobile. */}
        <ol className="mt-14 grid gap-4 lg:grid-cols-5">
          {STAGES.map((s, i) => (
            <li key={s.n} className="relative flex">
              <Card className="flex w-full flex-col">
                <div className="flex items-center gap-2.5">
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent/12 text-accent-strong">
                    <Icon name={s.icon} className="h-4 w-4" />
                  </span>
                  <span className="font-mono text-xs text-accent-strong">
                    {s.n}
                  </span>
                </div>
                <h3 className="mt-3 text-base font-semibold tracking-tight">
                  {s.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">
                  {s.body}
                </p>
                <ul className="mt-4 space-y-1.5 border-t border-line pt-4">
                  {s.items.map((it) => (
                    <li key={it} className="flex items-start gap-2 text-xs">
                      <Icon
                        name="check"
                        className="mt-0.5 h-3.5 w-3.5 text-accent-strong"
                      />
                      <span className="text-muted">{it}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              {i < STAGES.length - 1 ? (
                <span
                  aria-hidden
                  className="pointer-events-none absolute z-10 grid h-6 w-6 place-items-center rounded-full border border-line bg-bg text-muted left-1/2 -bottom-5 -translate-x-1/2 rotate-90 lg:left-auto lg:bottom-auto lg:top-1/2 lg:-right-5 lg:translate-x-0 lg:-translate-y-1/2 lg:rotate-0"
                >
                  <Icon name="arrowRight" className="h-3.5 w-3.5" />
                </span>
              ) : null}
            </li>
          ))}
        </ol>

        {/* Loop perbaikan. */}
        <p className="mt-6 flex items-center justify-center gap-2 text-center text-xs text-muted">
          <Icon name="activity" className="h-3.5 w-3.5 text-accent-strong" />
          Setiap percakapan yang lolos QA jadi contoh untuk mempertajam retrieval
          dan jawaban berikutnya.
        </p>

        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {CAPABILITIES.map((c) => (
            <Card key={c.title} className="bg-surface-2">
              <Icon name={c.icon} className="h-5 w-5 text-accent-strong" />
              <h4 className="mt-3 text-sm font-semibold tracking-tight">
                {c.title}
              </h4>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">
                {c.body}
              </p>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
