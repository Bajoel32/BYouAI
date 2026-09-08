import { Container, Button } from "@/components/ui";
import { getDictionary, getLocale } from "@/dictionaries";
import { localizedHref } from "@/lib/i18n";

export async function Cta() {
  const [dict, locale] = await Promise.all([getDictionary(), getLocale()]);
  const c = dict.cta;

  return (
    <section
      id="kontak"
      className="relative overflow-hidden bg-[#0A0B0D] text-[#F4F3F1]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[-40%] h-[420px] w-[720px] -translate-x-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle at center, rgba(0,196,140,0.2), transparent 60%)",
          filter: "blur(24px)",
        }}
      />
      <Container className="relative py-20 text-center md:py-28">
        <h2 className="mx-auto max-w-2xl text-3xl font-semibold tracking-tight md:text-5xl md:leading-[1.1]">
          {c.titleBefore}{" "}
          <span className="font-serif font-normal italic text-accent">
            {c.titleEmphasis}
          </span>{" "}
          {c.titleAfter}
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-white/60">{c.lead}</p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button
            href={localizedHref("/invoice", locale)}
            variant="primary"
            className="w-full sm:w-auto"
          >
            {c.primary}
          </Button>
          <Button
            href={localizedHref("/konsultasi", locale)}
            variant="ghostDark"
            className="w-full sm:w-auto"
          >
            {c.secondary}
          </Button>
        </div>
      </Container>
    </section>
  );
}
