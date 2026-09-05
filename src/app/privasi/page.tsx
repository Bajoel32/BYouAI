import type { Metadata } from "next";
import { DocPage } from "@/components/doc-page";

export const metadata: Metadata = {
  title: "Kebijakan Privasi",
  description:
    "Bagaimana BYouAI mengumpulkan, memakai, dan melindungi data pribadi di situs dan layanannya.",
};

export default function PrivasiPage() {
  return (
    <DocPage
      kicker="Legal"
      title="Kebijakan Privasi"
      intro="Kebijakan ini menjelaskan bagaimana BYouAI menangani data pribadi yang kami terima melalui situs ini dan saat menjajaki atau menjalankan sebuah proyek."
      updated="September 2026"
    >
      <h2>1. Data yang kami kumpulkan</h2>
      <ul>
        <li>
          <strong>Data kontak</strong> yang Anda kirim lewat email atau formulir
          konsultasi: nama, alamat email, perusahaan, dan isi pesan.
        </li>
        <li>
          <strong>Data teknis</strong> standar server web: alamat IP, jenis
          peramban, dan halaman yang diakses. Situs ini tidak memakai cookie
          pelacakan iklan.
        </li>
      </ul>

      <h2>2. Cara kami memakainya</h2>
      <p>
        Untuk menanggapi permintaan Anda, menyiapkan rancangan solusi dan
        penawaran, serta menjaga keamanan dan keandalan situs. Kami tidak menjual
        data pribadi.
      </p>

      <h2>3. Data proyek klien</h2>
      <p>
        Data yang Anda serahkan untuk sebuah implementasi (dokumen, basis data,
        rekaman) diatur oleh perjanjian layanan dan{" "}
        <a href="/pemrosesan-data">Adendum Pemrosesan Data</a>, bukan oleh
        kebijakan situs ini. Data tersebut terisolasi per klien dan tidak dipakai
        untuk melatih model pihak ketiga.
      </p>

      <h2>4. Berbagi dengan pihak ketiga</h2>
      <p>
        Kami memakai sejumlah pemroses (subprocessor) untuk hosting, email, dan
        analitik agregat. Mereka terikat kewajiban kerahasiaan dan hanya
        memproses data atas instruksi kami. Daftar terkini tersedia atas
        permintaan.
      </p>

      <h2>5. Penyimpanan dan retensi</h2>
      <p>
        Data kontak disimpan selama diperlukan untuk hubungan bisnis lalu
        dihapus atau dianonimkan. Anda dapat meminta penghapusan lebih awal
        kapan saja.
      </p>

      <h2>6. Hak Anda</h2>
      <p>
        Sesuai UU Perlindungan Data Pribadi, Anda berhak mengakses, memperbaiki,
        dan menghapus data pribadi Anda, serta menarik persetujuan. Ajukan lewat{" "}
        <a href="mailto:privasi@byouai.com">privasi@byouai.com</a>.
      </p>

      <h2>7. Perubahan</h2>
      <p>
        Kami dapat memperbarui kebijakan ini; tanggal &ldquo;terakhir
        diperbarui&rdquo; di atas selalu mencerminkan versi berlaku.
      </p>
    </DocPage>
  );
}
