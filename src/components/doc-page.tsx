import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { Container, Kicker } from "@/components/ui";
import { getDictionary, getLocale } from "@/dictionaries";
import { DEFAULT_LOCALE } from "@/lib/i18n";
import type { Dictionary } from "@/dictionaries/id";

type Doc = Dictionary["docs"][keyof Dictionary["docs"]];

/**
 * Shell for the standalone content pages: solid nav, title block, prose, footer.
 * `body` is trusted author-written HTML from the dictionary; in-page absolute
 * links (`href="/..."`) are re-prefixed for the active locale.
 */
export async function DocPage({ doc }: { doc: Doc }) {
  const [dict, locale] = await Promise.all([getDictionary(), getLocale()]);

  const body =
    locale === DEFAULT_LOCALE
      ? doc.body
      : doc.body.replace(/href="\/(?!\/)/g, `href="/${locale}/`);

  return (
    <>
      <Nav solid />
      <main id="konten">
        <Container className="max-w-3xl pb-24 pt-32 md:pt-40">
          <Kicker>{doc.kicker}</Kicker>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-[2.6rem] md:leading-[1.12]">
            {doc.title}
          </h1>
          {doc.intro ? (
            <p className="mt-4 text-base leading-relaxed text-muted md:text-lg">
              {doc.intro}
            </p>
          ) : null}
          {doc.updated ? (
            <p className="mt-3 font-mono text-xs text-muted">
              {dict.common.lastUpdated}: {doc.updated}
            </p>
          ) : null}
          <div
            className="doc-prose mt-10 border-t border-line pt-10"
            dangerouslySetInnerHTML={{ __html: body }}
          />
        </Container>
      </main>
      <Footer />
    </>
  );
}
