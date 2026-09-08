import type { Metadata } from "next";
import { SectionPage } from "@/components/section-page";
import { HowItWorks } from "@/components/sections/how-it-works";
import { getDictionary } from "@/dictionaries";

export async function generateMetadata(): Promise<Metadata> {
  const { meta } = await getDictionary();
  return meta.pages.caraKerja;
}

export default function CaraKerjaPage() {
  return (
    <SectionPage>
      <HowItWorks />
    </SectionPage>
  );
}
