import { Container, SectionHeading } from "@/components/ui";

const FAQS = [
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
];

export function Faq() {
  return (
    <section
      id="faq"
      className="border-t border-line bg-surface py-24 md:py-32"
    >
      <Container className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
        <SectionHeading
          kicker="FAQ"
          title="Pertanyaan yang sering muncul"
          lead="Belum terjawab? Tulis ke halo@byouai.com — kami balas dalam 1 hari kerja."
        />

        <div className="reveal divide-y divide-line border-y border-line">
          {FAQS.map((item) => (
            <details key={item.q} className="group py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-1 text-base font-medium marker:content-none">
                {item.q}
                <span
                  aria-hidden
                  className="ease-out-expo relative h-4 w-4 shrink-0 text-muted transition-transform duration-300 group-open:rotate-45"
                >
                  <span className="absolute left-1/2 top-1/2 h-px w-3.5 -translate-x-1/2 -translate-y-1/2 bg-current" />
                  <span className="absolute left-1/2 top-1/2 h-3.5 w-px -translate-x-1/2 -translate-y-1/2 bg-current" />
                </span>
              </summary>
              <p className="mt-2 max-w-2xl pr-8 text-sm leading-relaxed text-muted">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}
