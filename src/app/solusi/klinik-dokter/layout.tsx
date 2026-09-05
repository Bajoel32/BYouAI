import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Simulasi Klinik & Dokter",
  description:
    "Coba asisten administrasi klinik BYouAI: jadwal & kuota dokter, cover asuransi, tarif MCU, dan SOP — dijawab dari data klinik dengan jejak sumber dan pemicu API HIS/SIMRS. Non-klinis: pertanyaan medis otomatis dieskalasi ke dokter.",
};

export default function KlinikDokterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
