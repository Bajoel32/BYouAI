import type { Metadata } from "next";
import { SectionPage } from "@/components/section-page";
import { Solutions } from "@/components/sections/solutions";
import { getDictionary } from "@/dictionaries";

export async function generateMetadata(): Promise<Metadata> {
  const { meta } = await getDictionary();
  return meta.pages.solusi;
}

export default function SolusiPage() {
  return (
    <SectionPage>
      <Solutions />
    </SectionPage>
  );
}
