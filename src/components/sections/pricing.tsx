import { cn } from "@/lib/cn";
import { Container, SectionHeading, Button } from "@/components/ui";
import { Icon } from "@/components/icons";
import { type PlanId, planById, formatIDR } from "@/lib/plans";
import { getDictionary, getLocale } from "@/dictionaries";
import { localizedHref } from "@/lib/i18n";

const ORDER: { id: PlanId; featured: boolean }[] = [
  { id: "pilot", featured: false },
  { id: "growth", featured: true },
  { id: "enterprise", featured: false },
];

export async function Pricing() {
  const [dict, locale] = await Promise.all([getDictionary(), getLocale()]);
  const p = dict.pricing;

  return (
    <section id="harga" className="py-24 md:py-32">
      <Container>
        <SectionHeading kicker={p.kicker} title={p.title} lead={p.lead} />

        <div className="mt-14 grid gap-4 lg:grid-cols-3">
          {ORDER.map(({ id, featured }) => {
            const plan = planById(id)!;
            const tier = p.tiers[id];
            return (
              <div
                key={id}
                className={cn(
                  "flex flex-col rounded-2xl border p-7",
                  featured
                    ? "border-accent/40 bg-surface shadow-lift ring-1 ring-accent/20"
                    : "border-line bg-surface",
                )}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold tracking-tight">
                    {plan.name}
                  </h3>
                  {featured ? (
                    <span className="rounded-full bg-accent/12 px-2.5 py-1 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-accent-strong">
                      {p.popular}
                    </span>
                  ) : null}
                </div>
                <p className="mt-1 text-sm text-muted">{tier.tagline}</p>

                <p className="mt-4">
                  <span className="text-xs text-muted">{p.from}</span>{" "}
                  <span className="font-mono text-lg font-medium text-ink">
                    {formatIDR(plan.priceFrom)}
                  </span>
                </p>

                <ul className="mt-6 flex-1 space-y-3 border-t border-line pt-6">
                  {tier.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2 text-sm">
                      <Icon
                        name="check"
                        className="mt-0.5 h-4 w-4 text-accent-strong"
                      />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  href={localizedHref(`/invoice?plan=${id}`, locale)}
                  variant={featured ? "primary" : "outline"}
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
