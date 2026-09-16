import { Container, Button } from "@/components/ui";
import { ScopeBackdrop } from "@/components/scope-backdrop";
import { getDictionary, getLocale } from "@/dictionaries";
import { localizedHref } from "@/lib/i18n";

export async function Hero() {
  const [dict, locale] = await Promise.all([getDictionary(), getLocale()]);
  const h = dict.hero;

  return (
    <section
      id="konten"
      className="relative overflow-hidden bg-[#0A0B0D] text-[#F4F3F1]"
    >
      {/* Hairline grid, masked to fade toward the edges */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.13]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage:
            "radial-gradient(ellipse 80% 60% at 50% 0%, #000 35%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 60% at 50% 0%, #000 35%, transparent 100%)",
        }}
      />
      {/* Accent glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[-12%] h-[520px] w-[840px] -translate-x-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle at center, rgba(0,196,140,0.26), transparent 62%)",
          filter: "blur(24px)",
        }}
      />
      {/* Oscilloscope beam: a band right below the navbar, centered horizontally */}
      <ScopeBackdrop className="pointer-events-none absolute inset-x-0 top-16 mx-auto h-28 max-w-3xl [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]" />

      <Container className="relative pt-36 pb-24 md:pt-44 md:pb-32">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/5 px-3 py-1 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-white/70">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            {h.badge}
          </span>

          <h1 className="mt-6 text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            {h.titleBefore}{" "}
            <span className="font-serif font-normal italic text-accent">
              {h.titleEmphasis}
            </span>{" "}
            {h.titleAfter}
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/65 md:text-lg">
            {h.lead}
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              href={localizedHref("/konsultasi", locale)}
              variant="primary"
              className="w-full sm:w-auto"
            >
              {h.ctaPrimary}
            </Button>
            <Button
              href={localizedHref("/cara-kerja", locale)}
              variant="ghostDark"
              className="w-full sm:w-auto"
            >
              {h.ctaSecondary}
            </Button>
          </div>

          <p className="mt-6 font-mono text-xs text-white/55">{h.fineprint}</p>
        </div>

        {/* RAG pipeline at a glance */}
        <div className="reveal mx-auto mt-16 flex max-w-3xl flex-wrap items-center justify-center gap-3">
          {h.pipeline.map((step, i) => (
            <div key={step} className="flex items-center gap-3">
              <div className="rounded-full border border-white/12 bg-white/[0.04] px-4 py-2 font-mono text-xs text-white/80">
                <span className="text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>{" "}
                {step}
              </div>
              {i < h.pipeline.length - 1 ? (
                <span aria-hidden className="text-white/25">
                  →
                </span>
              ) : null}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
