import { SectionPage } from "@/components/section-page";
import { Container, Kicker } from "@/components/ui";
import { ClinicAdminSimulation } from "@/components/sections/clinic-admin-simulation";

export default function KlinikDokterPage() {
  return (
    <SectionPage>
      <section className="py-14 md:py-20">
        <Container>
          <div className="max-w-2xl">
            <Kicker>Solusi · Klinik &amp; Dokter</Kicker>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-[2.6rem] md:leading-[1.12]">
              Asisten administrasi klinik yang{" "}
              <span className="font-serif font-normal italic text-accent-strong">
                tahu jadwal, tarif, dan SOP Anda
              </span>
            </h1>
            <p className="mt-4 text-base leading-relaxed text-muted md:text-lg">
              Jadwal &amp; kuota dokter, cover asuransi, estimasi biaya MCU, dan
              prosedur — dijawab dari data klinik dengan jejak sumber, terhubung
              ke HIS/SIMRS. Cakupan murni administratif: setiap pertanyaan medis
              atau diagnosa otomatis dieskalasi ke dokter. Ini simulasi.
            </p>
          </div>

          <div className="mt-10">
            <ClinicAdminSimulation />
          </div>
        </Container>
      </section>
    </SectionPage>
  );
}
