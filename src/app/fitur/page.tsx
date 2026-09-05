import type { Metadata } from "next";
import { SectionPage } from "@/components/section-page";
import { Features } from "@/components/sections/features";

export const metadata: Metadata = {
  title: "Kemampuan",
  description:
    "Infrastruktur AI berbasis pengetahuan yang siap produksi — RAG siap pakai, model-agnostik, guardrails, observability, kontrol data.",
};

export default function FiturPage() {
  return (
    <SectionPage>
      <Features />
    </SectionPage>
  );
}
