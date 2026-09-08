import { Container, SectionHeading } from "@/components/ui";
import { getDictionary } from "@/dictionaries";

export async function HowItWorks() {
  const { howItWorks } = await getDictionary();

  return (
    <section
      id="cara-kerja"
      className="border-t border-line bg-surface py-24 md:py-32"
    >
      <Container>
        <SectionHeading
          kicker={howItWorks.kicker}
          title={howItWorks.title}
          lead={howItWorks.lead}
        />

        <ol className="mt-14 divide-y divide-line border-y border-line">
          {howItWorks.steps.map((s) => (
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
