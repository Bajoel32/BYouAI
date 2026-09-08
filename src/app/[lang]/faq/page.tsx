import type { Metadata } from "next";
import { SectionPage } from "@/components/section-page";
import { Faq } from "@/components/sections/faq";
import { getDictionary } from "@/dictionaries";

export async function generateMetadata(): Promise<Metadata> {
  const { meta } = await getDictionary();
  return meta.pages.faq;
}

export default function FaqPage() {
  return (
    <SectionPage>
      <Faq />
    </SectionPage>
  );
}
