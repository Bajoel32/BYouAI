import { Container, SectionHeading } from "@/components/ui";
import { Icon } from "@/components/icons";
import { getDictionary } from "@/dictionaries";

export async function Security() {
  const { security } = await getDictionary();

  return (
    <section
      id="keamanan"
      className="border-t border-line bg-surface py-24 md:py-32"
    >
      <Container className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
        <SectionHeading
          kicker={security.kicker}
          title={security.title}
          lead={security.lead}
        />

        <ul className="reveal grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
          {security.items.map((item) => (
            <li
              key={item}
              className="flex items-start gap-3 bg-surface p-5 text-sm leading-relaxed"
            >
              <Icon name="check" className="mt-0.5 h-4 w-4 text-accent-strong" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
