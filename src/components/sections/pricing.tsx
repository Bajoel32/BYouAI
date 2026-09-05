import { cn } from "@/lib/cn";
import { Container, SectionHeading, Button } from "@/components/ui";
import { Icon } from "@/components/icons";
import { type PlanId, planById, formatIDR } from "@/lib/plans";

const TIERS: {
  id: PlanId;
  tagline: string;
  features: string[];
  cta: string;
  featured: boolean;
}[] = [
  {
    id: "pilot",
    tagline: "Bukti nilai dalam 2–3 minggu",
    features: [
      "1 use-case terbatas",
      "Hingga 3 sumber data",
      "Evaluasi akurasi awal",
      "Laporan kelayakan & rekomendasi",
    ],
    cta: "Mulai pilot",
    featured: false,
  },
  {
    id: "growth",
    tagline: "Satu use-case, siap produksi",
    features: [
      "Integrasi data & channel penuh",
      "Guardrails & evaluasi kontinu",
      "Dashboard observability",
      "SLA dan dukungan prioritas",
    ],
    cta: "Ajukan penawaran",
    featured: true,
  },
  {
    id: "enterprise",
    tagline: "Multi use-case & on-prem",
    features: [
      "Deployment on-prem / VPC",
      "SSO, RBAC, audit log",
      "Model lokal / privat",
      "Solutions engineer khusus",
    ],
    cta: "Hubungi tim",
    featured: false,
  },
];

export function Pricing() {
  return (
    <section id="harga" className="py-24 md:py-32">
      <Container>
        <SectionHeading
          kicker="Harga"
          title="Mulai kecil, buktikan, lalu skalakan"
          lead="Harga disesuaikan dengan ruang lingkup, volume, dan integrasi. Semua paket termasuk sitasi sumber dan kontrol data penuh."
        />

        <div className="mt-14 grid gap-4 lg:grid-cols-3">
          {TIERS.map((tier) => {
            const plan = planById(tier.id)!;
            return (
            <div
              key={tier.id}
              className={cn(
                "flex flex-col rounded-2xl border p-7",
                tier.featured
                  ? "border-accent/40 bg-surface shadow-lift ring-1 ring-accent/20"
                  : "border-line bg-surface",
              )}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold tracking-tight">
                  {plan.name}
                </h3>
                {tier.featured ? (
                  <span className="rounded-full bg-accent/12 px-2.5 py-1 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-accent-strong">
                    Populer
                  </span>
                ) : null}
              </div>
              <p className="mt-1 text-sm text-muted">{tier.tagline}</p>

              <p className="mt-4">
                <span className="text-xs text-muted">mulai dari</span>{" "}
                <span className="font-mono text-lg font-medium text-ink">
                  {formatIDR(plan.priceFrom)}
                </span>
              </p>

              <ul className="mt-6 flex-1 space-y-3 border-t border-line pt-6">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Icon
                      name="check"
                      className="mt-0.5 h-4 w-4 text-accent-strong"
                    />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <Button
                href={`/invoice?plan=${tier.id}`}
                variant={tier.featured ? "primary" : "outline"}
                className="mt-8 w-full"
              >
                {tier.cta}
              </Button>
            </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
