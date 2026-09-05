import type { Metadata } from "next";
import { SectionPage } from "@/components/section-page";
import { Pricing } from "@/components/sections/pricing";

export const metadata: Metadata = {
  title: "Harga",
  description:
    "Paket Pilot, Growth, dan Enterprise. Mulai kecil, buktikan, lalu skalakan — semua paket termasuk sitasi sumber dan kontrol data penuh.",
};

export default function HargaPage() {
  return (
    <SectionPage>
      <Pricing />
    </SectionPage>
  );
}
