import type { Metadata } from "next";
import { SectionPage } from "@/components/section-page";
import { Security } from "@/components/sections/security";
import { getDictionary } from "@/dictionaries";

export async function generateMetadata(): Promise<Metadata> {
  const { meta } = await getDictionary();
  return meta.pages.keamanan;
}

export default function KeamananPage() {
  return (
    <SectionPage>
      <Security />
    </SectionPage>
  );
}
