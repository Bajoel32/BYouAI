import type { Metadata } from "next";
import { getDictionary } from "@/dictionaries";

export async function generateMetadata(): Promise<Metadata> {
  const { meta } = await getDictionary();
  return {
    ...meta.pages.invoice,
    robots: { index: false, follow: false },
  };
}

export default function InvoiceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
