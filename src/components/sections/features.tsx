import { Container, SectionHeading, Card } from "@/components/ui";
import { Icon, type IconName } from "@/components/icons";

type Feature = {
  icon: IconName;
  title: string;
  body: string;
  wide?: boolean;
};

const FEATURES: Feature[] = [
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
  },
  {
    icon: "plug",
    title: "Integrasi luas",
    body: "Postgres, Notion, Google Drive, Shopify, WhatsApp, Slack, dan REST API.",
  },
  {
    icon: "activity",
    title: "Observability penuh",
    body: "Trace tiap retrieval, latency, dan biaya per jawaban dalam satu dashboard.",
  },
  {
    icon: "database",
    title: "Kontrol data",
    body: "Region penyimpanan pilihan, retensi terkonfigurasi, ekspor dan hapus kapan saja.",
  },
];

export function Features() {
  return (
    <section id="fitur" className="py-24 md:py-32">
      <Container>
        <SectionHeading
          kicker="Kemampuan Inti"
          title="Infrastruktur AI yang tidak perlu Anda bangun sendiri"
          lead="Semua yang dibutuhkan untuk menjalankan AI berbasis pengetahuan di produksi — dalam satu platform."
        />

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <Card
              key={f.title}
              interactive
              className={f.wide ? "lg:col-span-2" : undefined}
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent/12 text-accent-strong">
                <Icon name={f.icon} className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-base font-semibold tracking-tight">
                {f.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{f.body}</p>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
