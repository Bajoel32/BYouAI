import type { Metadata } from "next";
import { SectionPage } from "@/components/section-page";
import { Pricing } from "@/components/sections/pricing";
import { getDictionary } from "@/dictionaries";

export async function generateMetadata(): Promise<Metadata> {
  const { meta } = await getDictionary();
  return meta.pages.harga;
}

export default function HargaPage() {
  return (
    <SectionPage>
      <Pricing />
    </SectionPage>
  );
}
