import Link from "next/link";
import { Container, SectionHeading, Card, Button } from "@/components/ui";
import { Icon } from "@/components/icons";
import { getDictionary, getLocale } from "@/dictionaries";
import { localizedHref } from "@/lib/i18n";

export async function Solutions() {
  const [dict, locale] = await Promise.all([getDictionary(), getLocale()]);
  const s = dict.solutions;

  return (
    <section id="solusi" className="py-24 md:py-32">
      <Container>
        <SectionHeading kicker={s.kicker} title={s.title} lead={s.lead} />

        <div className="mt-14 grid gap-4 lg:grid-cols-3">
          {s.items.map((item) => (
            <Card key={item.tag} interactive className="flex flex-col">
              <span className="font-mono text-xs uppercase tracking-[0.16em] text-accent-strong">
                {item.tag}
              </span>
              <h3 className="mt-3 text-lg font-semibold tracking-tight">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {item.body}
              </p>
              <ul className="mt-5 space-y-2 border-t border-line pt-5">
                {item.points.map((p) => (
                  <li key={p} className="flex items-start gap-2 text-sm">
                    <Icon
                      name="check"
                      className="mt-0.5 h-4 w-4 text-accent-strong"
                    />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
              {item.cta ? (
                <Link
                  href={localizedHref(item.cta.href, locale)}
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-accent-strong transition-colors hover:text-ink"
                >
                  {item.cta.label}
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
                  {s.other.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {s.other.body}
                </p>
              </div>
              <Button
                href={localizedHref("/#kontak", locale)}
                variant="outline"
                className="shrink-0"
              >
                {s.other.cta}
              </Button>
            </div>
          </Card>
        </div>
      </Container>
    </section>
  );
}
