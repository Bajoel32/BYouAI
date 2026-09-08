import type { Metadata } from "next";
import { SectionPage } from "@/components/section-page";
import { Features } from "@/components/sections/features";
import { getDictionary } from "@/dictionaries";

export async function generateMetadata(): Promise<Metadata> {
  const { meta } = await getDictionary();
  return meta.pages.fitur;
}

export default function FiturPage() {
  return (
    <SectionPage>
      <Features />
    </SectionPage>
  );
}
