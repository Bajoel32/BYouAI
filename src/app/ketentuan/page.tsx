import type { Metadata } from "next";
import { DocPage } from "@/components/doc-page";

export const metadata: Metadata = {
  title: "Syarat Layanan",
  description:
    "Ketentuan penggunaan situs BYouAI dan kerangka umum untuk keterlibatan layanan.",
};

export default function KetentuanPage() {
  return (
    <DocPage
      kicker="Legal"
      title="Syarat Layanan"
      intro="Ketentuan ini mengatur penggunaan situs byouai.com. Setiap proyek berbayar diatur oleh perjanjian layanan (MSA/SOW) terpisah yang ditandatangani kedua pihak."
      updated="September 2026"
    >
      <h2>1. Penggunaan situs</h2>
      <p>
        Konten di situs ini disediakan untuk informasi umum. Anda setuju untuk
        tidak menyalahgunakan situs, mencoba mengakses sistem tanpa izin, atau
        mengganggu operasionalnya.
      </p>

      <h2>2. Bukan penawaran mengikat</h2>
      <p>
        Deskripsi produk, paket, dan estimasi waktu di situs ini bersifat
        indikatif dan tidak membentuk kontrak. Ruang lingkup, harga, SLA, dan
        jaminan yang mengikat hanya yang tercantum dalam SOW yang ditandatangani.
      </p>

      <h2>3. Kekayaan intelektual</h2>
      <p>
        Merek, logo, dan isi situs adalah milik BYouAI. Anda tetap memiliki
        seluruh data dan materi yang Anda serahkan dalam sebuah proyek;
        kepemilikan deliverable diatur dalam SOW terkait.
      </p>

      <h2>4. Tautan pihak ketiga</h2>
      <p>
        Situs dapat memuat tautan ke layanan pihak ketiga yang tidak kami kendali
        dan tidak kami jamin.
      </p>

      <h2>5. Batasan tanggung jawab</h2>
      <p>
        Sepanjang diizinkan hukum, BYouAI tidak bertanggung jawab atas kerugian
        tidak langsung atau konsekuensial yang timbul dari penggunaan situs ini.
      </p>

      <h2>6. Hukum yang berlaku</h2>
      <p>
        Ketentuan ini tunduk pada hukum Republik Indonesia. Pertanyaan:{" "}
        <a href="mailto:halo@byouai.com">halo@byouai.com</a>.
      </p>
    </DocPage>
  );
}
