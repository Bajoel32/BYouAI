import { Container, SectionHeading } from "@/components/ui";

const STEPS = [
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
];

export function HowItWorks() {
  return (
    <section id="cara-kerja" className="border-t border-line bg-surface py-24 md:py-32">
      <Container>
        <SectionHeading
          kicker="Cara Kerja"
          title="Dari data mentah ke jawaban tepercaya"
          lead="Pipeline RAG dengan sitasi di setiap langkah — dapat diaudit, bukan kotak hitam."
        />

        <ol className="mt-14 divide-y divide-line border-y border-line">
          {STEPS.map((s) => (
            <li
              key={s.n}
              className="reveal grid gap-3 py-8 md:grid-cols-[7rem_1fr] md:gap-10 md:py-10"
            >
              <span className="font-mono text-2xl text-accent-strong md:text-3xl">
                {s.n}
              </span>
              <div className="max-w-2xl">
                <h3 className="text-lg font-semibold tracking-tight md:text-xl">
                  {s.t}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted md:text-base">
                  {s.d}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
