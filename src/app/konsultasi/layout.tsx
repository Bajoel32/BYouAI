import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Konsultasi",
  description:
    "Ceritakan kebutuhan Anda ke asisten BYouAI — cakupan, data, dan estimasi biaya untuk AI kustom berbasis RAG di atas data Anda sendiri.",
};

export default function KonsultasiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
