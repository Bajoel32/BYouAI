import type { Metadata } from "next";
import { SectionPage } from "@/components/section-page";
import { HowItWorks } from "@/components/sections/how-it-works";

export const metadata: Metadata = {
  title: "Cara Kerja",
  description:
    "Dari data mentah ke jawaban tepercaya: hubungkan data, indeks & pahami, RAG + reasoning, lalu deploy & pantau.",
};

export default function CaraKerjaPage() {
  return (
    <SectionPage>
      <HowItWorks />
    </SectionPage>
  );
}
