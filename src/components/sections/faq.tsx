import { Container, SectionHeading } from "@/components/ui";
import { getDictionary } from "@/dictionaries";

export async function Faq() {
  const { faq } = await getDictionary();

  return (
    <section id="faq" className="border-t border-line bg-surface py-24 md:py-32">
      <Container className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
        <SectionHeading kicker={faq.kicker} title={faq.title} lead={faq.lead} />

        <div className="reveal divide-y divide-line border-y border-line">
          {faq.items.map((item) => (
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
