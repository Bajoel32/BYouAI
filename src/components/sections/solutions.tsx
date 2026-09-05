import Link from "next/link";
import { Container, SectionHeading, Card, Button } from "@/components/ui";
import { Icon } from "@/components/icons";

type Solution = {
  tag: string;
  title: string;
  body: string;
  points: string[];
  /** When set, the card links to a dedicated solution page. */
  cta?: { href: string; label: string };
};

const SOLUTIONS: Solution[] = [
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
];

export function Solutions() {
  return (
    <section id="solusi" className="py-24 md:py-32">
      <Container>
        <SectionHeading
          kicker="Solusi per Industri"
          title="Satu platform, disesuaikan dengan cara kerja Anda"
          lead="Kami tidak menjual chatbot generik. Setiap solusi dibangun di atas data, aturan, dan alur kerja spesifik industri Anda."
        />

        <div className="mt-14 grid gap-4 lg:grid-cols-3">
          {SOLUTIONS.map((s) => (
            <Card key={s.tag} interactive className="flex flex-col">
              <span className="font-mono text-xs uppercase tracking-[0.16em] text-accent-strong">
                {s.tag}
              </span>
              <h3 className="mt-3 text-lg font-semibold tracking-tight">
                {s.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{s.body}</p>
              <ul className="mt-5 space-y-2 border-t border-line pt-5">
                {s.points.map((p) => (
                  <li key={p} className="flex items-start gap-2 text-sm">
                    <Icon
                      name="check"
                      className="mt-0.5 h-4 w-4 text-accent-strong"
                    />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
              {s.cta ? (
                <Link
                  href={s.cta.href}
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-accent-strong transition-colors hover:text-ink"
                >
                  {s.cta.label}
                  <Icon name="arrowRight" className="h-4 w-4" />
                </Link>
              ) : null}
            </Card>
          ))}

          <Card
            interactive
            className="flex flex-col justify-between bg-surface-2 lg:col-span-3"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="max-w-xl">
                <h3 className="text-lg font-semibold tracking-tight">
                  Industri Anda tidak ada di sini?
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  Punya data dan alur kerja yang unik — logistik, pendidikan,
                  manufaktur, layanan publik? Kami rancang solusinya dari nol.
                </p>
              </div>
              <Button href="/#kontak" variant="outline" className="shrink-0">
                Bicara dengan tim
              </Button>
            </div>
          </Card>
        </div>
      </Container>
    </section>
  );
}
