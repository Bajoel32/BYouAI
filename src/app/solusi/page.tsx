import type { Metadata } from "next";
import { SectionPage } from "@/components/section-page";
import { Solutions } from "@/components/sections/solutions";

export const metadata: Metadata = {
  title: "Solusi",
  description:
    "Agent AI kustom untuk e-commerce, firma hukum, klinik, dan industri lain — dibangun di atas data dan alur kerja Anda.",
};

export default function SolusiPage() {
  return (
    <SectionPage>
      <Solutions />
    </SectionPage>
  );
}
