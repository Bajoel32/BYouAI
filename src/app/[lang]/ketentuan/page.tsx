import type { Metadata } from "next";
import { DocPage } from "@/components/doc-page";
import { getDictionary } from "@/dictionaries";

export async function generateMetadata(): Promise<Metadata> {
  const { meta } = await getDictionary();
  return meta.pages.ketentuan;
}

export default async function KetentuanPage() {
  const dict = await getDictionary();
  return <DocPage doc={dict.docs.ketentuan} />;
}
