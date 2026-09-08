import type { Metadata } from "next";
import { DocPage } from "@/components/doc-page";
import { getDictionary } from "@/dictionaries";

export async function generateMetadata(): Promise<Metadata> {
  const { meta } = await getDictionary();
  return meta.pages.pemrosesanData;
}

export default async function PemrosesanDataPage() {
  const dict = await getDictionary();
  return <DocPage doc={dict.docs.pemrosesanData} />;
}
