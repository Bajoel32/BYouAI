import { Container, SectionHeading, Card } from "@/components/ui";
import { Icon, type IconName } from "@/components/icons";
import { getDictionary } from "@/dictionaries";

export async function Features() {
  const { features } = await getDictionary();

  return (
    <section id="fitur" className="py-24 md:py-32">
      <Container>
        <SectionHeading
          kicker={features.kicker}
          title={features.title}
          lead={features.lead}
        />

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.items.map((f) => (
            <Card
              key={f.title}
              interactive
              className={f.wide ? "lg:col-span-2" : undefined}
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent/12 text-accent-strong">
                <Icon name={f.icon as IconName} className="h-5 w-5" />
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
