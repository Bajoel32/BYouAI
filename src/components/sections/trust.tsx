import { Container } from "@/components/ui";

const INDUSTRIES = [
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
];

export function Trust() {
  return (
    <section className="border-y border-line bg-surface py-10">
      <Container>
        <p className="text-center font-mono text-xs uppercase tracking-[0.18em] text-muted">
          Dirancang untuk alur kerja spesifik industri
        </p>
      </Container>

      <div className="marquee-mask relative mt-6 overflow-hidden">
        {/* Two identical groups: translating the track by exactly -50% swaps the
            second group into the first's place, so the loop has no seam. The
            trailing `pe-3` on each group matches the inner `gap-3` so item
            spacing stays even across the boundary. */}
        <div className="marquee flex">
          {[0, 1].map((group) => (
            <ul
              key={group}
              className="flex shrink-0 gap-3 pe-3"
              aria-label={group === 0 ? "Industri yang dilayani" : undefined}
              aria-hidden={group === 1 || undefined}
            >
              {INDUSTRIES.map((name) => (
                <li
                  key={name}
                  className="whitespace-nowrap rounded-full border border-line bg-bg px-4 py-2 text-sm text-muted"
                >
                  {name}
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
