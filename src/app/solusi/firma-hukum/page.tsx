import type { Metadata } from "next";
import { SectionPage } from "@/components/section-page";
import { Container, Kicker } from "@/components/ui";
import { LegalRagsimulation } from "@/components/sections/legal-rag-simulation";

export const metadata: Metadata = {
  title: "Solusi Firma Hukum — Simulasi",
  description:
    "Coba simulasi asisten riset & analisis dokumen untuk firma hukum: ekstraksi klausul, temuan risiko bertingkat, ringkasan eksekutif, dan tanya-jawab dengan jejak pasal. Berjalan di browser Anda, bukan nasihat hukum.",
};

export default function FirmaHukumPage() {
  return (
    <SectionPage>
      <section className="py-14 md:py-20">
        <Container>
          <div className="max-w-2xl">
            <Kicker>Solusi · Firma Hukum</Kicker>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-[2.6rem] md:leading-[1.12]">
              Riset &amp; analisis dokumen yang{" "}
              <span className="font-serif font-normal italic text-accent-strong">
                selalu menyertakan sumbernya
              </span>
            </h1>
            <p className="mt-4 text-base leading-relaxed text-muted md:text-lg">
              Pilih dokumen contoh atau tempel teks Anda. Asisten menyusun
              ringkasan eksekutif, menandai klausul berisiko, mengekstraksi pasal
              krusial dengan sitasi, dan menjawab pertanyaan bebas — semua di
              browser Anda. Ini simulasi, bukan nasihat hukum.
            </p>
          </div>

          <div className="mt-10">
            <LegalRagsimulation />
          </div>
        </Container>
      </section>
    </SectionPage>
  );
}
