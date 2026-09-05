import { Container, Button } from "@/components/ui";
import { ScopeBackdrop } from "@/components/scope-backdrop";

const PIPELINE = ["Data Anda", "Indeks vektor", "RAG + LLM", "Jawaban + sitasi"];

export function Hero() {
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
      {/* Oscilloscope beam sweeping the band just under the navbar */}
      <ScopeBackdrop className="pointer-events-none absolute inset-x-0 top-0 h-36 [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]" />

      <Container className="relative pt-36 pb-24 md:pt-44 md:pb-32">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/5 px-3 py-1 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-white/70">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Platform AI Kustom
          </span>

          <h1 className="mt-6 text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            AI yang paham{" "}
            <span className="font-serif font-normal italic text-accent">
              domain
            </span>{" "}
            bisnis Anda.
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/65 md:text-lg">
            BYouAI membangun asisten dan agent AI berbasis RAG di atas data Anda
            sendiri — untuk e-commerce, firma hukum, praktik dokter, dan industri
            lain. Akurat, tersitasi, siap produksi.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              href="#kontak"
              variant="primary"
              className="w-full sm:w-auto"
            >
              Konsultasi gratis
            </Button>
            <Button
              href="/cara-kerja"
              variant="ghostDark"
              className="w-full sm:w-auto"
            >
              Lihat cara kerja →
            </Button>
          </div>

          <p className="mt-6 font-mono text-xs text-white/55">
            Enkripsi end-to-end · Data Anda tidak melatih model publik · Opsi
            on-prem
          </p>
        </div>

        {/* RAG pipeline at a glance */}
        <div className="reveal mx-auto mt-16 flex max-w-3xl flex-wrap items-center justify-center gap-3">
          {PIPELINE.map((step, i) => (
            <div key={step} className="flex items-center gap-3">
              <div className="rounded-full border border-white/12 bg-white/[0.04] px-4 py-2 font-mono text-xs text-white/80">
                <span className="text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>{" "}
                {step}
              </div>
              {i < PIPELINE.length - 1 ? (
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
