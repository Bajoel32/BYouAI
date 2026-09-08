import type { Metadata } from "next";
import { getDictionary } from "@/dictionaries";

export async function generateMetadata(): Promise<Metadata> {
  const { meta } = await getDictionary();
  return meta.pages.konsultasi;
}

export default function KonsultasiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
