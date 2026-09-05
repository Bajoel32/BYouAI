import type { Metadata } from "next";
import { DocPage } from "@/components/doc-page";

export const metadata: Metadata = {
  title: "Pemrosesan Data",
  description:
    "Ringkasan Adendum Pemrosesan Data BYouAI: peran, ruang lingkup, keamanan, subprocessor, dan hak audit.",
};

export default function PemrosesanDataPage() {
  return (
    <DocPage
      kicker="Legal"
      title="Adendum Pemrosesan Data"
      intro="Ringkasan ini menjelaskan bagaimana BYouAI memproses data klien dalam sebuah implementasi. Adendum lengkap dilampirkan pada perjanjian layanan dan berlaku mengikat."
      updated="September 2026"
    >
      <h2>1. Peran para pihak</h2>
      <p>
        Klien bertindak sebagai <strong>pengendali data</strong>; BYouAI sebagai{" "}
        <strong>pemroses data</strong> yang hanya memproses data pribadi atas
        instruksi terdokumentasi dari klien.
      </p>

      <h2>2. Ruang lingkup dan tujuan</h2>
      <p>
        Pemrosesan terbatas pada apa yang diperlukan untuk menyediakan layanan:
        ingest, pengindeksan (chunking dan embedding), retrieval, serta
        pembuatan jawaban dengan sitasi. Data tidak dipakai untuk tujuan lain dan
        tidak dipakai melatih model dasar pihak ketiga.
      </p>

      <h2>3. Keamanan</h2>
      <ul>
        <li>Enkripsi AES-256 saat transit dan saat diam.</li>
        <li>Isolasi per klien — tanpa pencampuran tenant.</li>
        <li>Kontrol akses berbasis peran (RBAC), SSO, dan audit log.</li>
        <li>Redaksi PII otomatis pada alur yang dikonfigurasi untuk itu.</li>
        <li>Opsi deployment on-prem atau di dalam VPC klien.</li>
      </ul>

      <h2>4. Subprocessor</h2>
      <p>
        BYouAI dapat memakai subprocessor (mis. penyedia infrastruktur dan
        penyedia model) dengan kewajiban perlindungan data yang setara. Daftar
        terkini dan pemberitahuan perubahan disediakan sesuai adendum.
      </p>

      <h2>5. Lokasi dan transfer data</h2>
      <p>
        Region penyimpanan dipilih klien. Transfer lintas yurisdiksi, bila ada,
        memakai mekanisme perlindungan yang sah.
      </p>

      <h2>6. Retensi dan pengembalian</h2>
      <p>
        Saat layanan berakhir, data klien dikembalikan atau dihapus sesuai
        instruksi klien dalam jangka waktu yang disepakati, kecuali penyimpanan
        diwajibkan hukum.
      </p>

      <h2>7. Bantuan dan audit</h2>
      <p>
        BYouAI membantu klien menanggapi permintaan subjek data dan insiden, serta
        menyediakan informasi yang wajar untuk membuktikan kepatuhan. Permintaan:{" "}
        <a href="mailto:privasi@byouai.com">privasi@byouai.com</a>.
      </p>
    </DocPage>
  );
}
