import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { Container, Kicker } from "@/components/ui";

/** Shell for the standalone content pages: solid nav, title block, prose, footer. */
export function DocPage({
  kicker,
  title,
  intro,
  updated,
  children,
}: {
  kicker: string;
  title: string;
  intro?: string;
  updated?: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <Nav solid />
      <main id="konten">
        <Container className="max-w-3xl pb-24 pt-32 md:pt-40">
          <Kicker>{kicker}</Kicker>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-[2.6rem] md:leading-[1.12]">
            {title}
          </h1>
          {intro ? (
            <p className="mt-4 text-base leading-relaxed text-muted md:text-lg">
              {intro}
            </p>
          ) : null}
          {updated ? (
            <p className="mt-3 font-mono text-xs text-muted">
              Terakhir diperbarui: {updated}
            </p>
          ) : null}
          <div className="doc-prose mt-10 border-t border-line pt-10">
            {children}
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
