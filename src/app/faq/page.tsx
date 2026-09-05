import type { Metadata } from "next";
import { SectionPage } from "@/components/section-page";
import { Faq } from "@/components/sections/faq";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Pertanyaan yang sering muncul seputar keamanan data, pilihan model, lama implementasi, dan cara akurasi jawaban dijaga.",
};

export default function FaqPage() {
  return (
    <SectionPage>
      <Faq />
    </SectionPage>
  );
}
