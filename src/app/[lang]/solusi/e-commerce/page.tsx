import type { Metadata } from "next";
import { SectionPage } from "@/components/section-page";
import { Container, Kicker, SectionHeading } from "@/components/ui";
import { EcommerceWorkflow } from "@/components/sections/ecommerce-workflow";
import { EcommerceChatSandbox } from "@/components/sections/ecommerce-chat-sandbox";
import { getDictionary } from "@/dictionaries";
import { LeadForm } from "./lead-form";

export async function generateMetadata(): Promise<Metadata> {
  const { meta } = await getDictionary();
  return meta.pages.solusiEcommerce;
}

export default async function EcommerceSolutionPage() {
  const { solusiEcommerce: s } = await getDictionary();

  return (
    <SectionPage>
      <section className="py-14 md:py-20">
        <Container>
          <div className="max-w-2xl">
            <Kicker>{s.kicker}</Kicker>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-[2.6rem] md:leading-[1.12]">
              {s.titleBefore}{" "}
              <span className="font-serif font-normal italic text-accent-strong">
                {s.titleEmphasis}
              </span>
            </h1>
            <p className="mt-4 text-base leading-relaxed text-muted md:text-lg">
              {s.lead}
            </p>
          </div>
        </Container>
      </section>

      <EcommerceWorkflow />

      <section className="py-16 md:py-24">
        <Container>
          <SectionHeading
            kicker="Coba Langsung"
            title="Lihat cara agent menjawab dari data toko"
            lead="Pilih skenario — panel kanan membuka isi retrieval, skor kecocokan, guardrail, dan panggilan API di balik setiap jawaban. Semua data di sini contoh."
          />
          <div className="mt-10">
            <EcommerceChatSandbox />
          </div>
        </Container>
      </section>

      <section
        id="mulai"
        className="border-t border-line bg-surface py-16 md:py-24"
      >
        <Container>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_28rem] lg:gap-14">
            <div className="max-w-xl">
              <Kicker>Mulai</Kicker>
              <h2 className="mt-4 text-2xl font-semibold tracking-tight md:text-3xl">
                Minta rancangan untuk toko Anda
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted">
                Isi profil singkat toko Anda. Tim kami menyiapkan gambaran
                cakupan, kesiapan data, dan estimasi biaya — biasanya dalam
                1×24 jam kerja.
              </p>
              <ul className="mt-6 space-y-2.5 text-sm text-muted">
                <li>• Tanpa biaya, tanpa komitmen.</li>
                <li>• Kami tinjau platform dan volume order Anda dulu.</li>
                <li>• Anda dapat ringkasan tertulis, bukan sekadar panggilan.</li>
              </ul>
            </div>
            <LeadForm />
          </div>
        </Container>
      </section>
    </SectionPage>
  );
}
