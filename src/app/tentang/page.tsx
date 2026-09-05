import type { Metadata } from "next";
import { DocPage } from "@/components/doc-page";

export const metadata: Metadata = {
  title: "Tentang",
  description:
    "BYouAI membangun asisten dan agent AI berbasis RAG di atas data bisnis Anda sendiri — akurat, tersitasi, dan siap produksi.",
};

export default function TentangPage() {
  return (
    <DocPage
      kicker="Tentang"
      title="Kami membangun AI di atas data Anda, bukan menjual chatbot generik"
      intro="BYouAI adalah tim kecil yang fokus pada satu hal: menjadikan pengetahuan internal sebuah organisasi dapat ditanyakan, dengan jawaban yang bisa ditelusuri sampai ke sumbernya."
    >
      <h2>Yang kami kerjakan</h2>
      <p>
        Kami merancang, membangun, dan mengoperasikan asisten serta agent AI
        berbasis <strong>retrieval-augmented generation</strong> (RAG) di atas
        dokumen, basis data, dan sistem yang sudah Anda pakai. Setiap jawaban
        membawa sitasi ke dokumen sumbernya, sehingga tim Anda bisa memverifikasi,
        bukan sekadar mempercayai.
      </p>

      <h2>Prinsip</h2>
      <ul>
        <li>
          <strong>Dapat diaudit.</strong> Retrieval, sitasi, latency, dan biaya
          per jawaban terlihat — tidak ada kotak hitam.
        </li>
        <li>
          <strong>Data Anda tetap milik Anda.</strong> Tidak dipakai melatih
          model pihak ketiga; region penyimpanan, retensi, dan penghapusan Anda
          yang menentukan.
        </li>
        <li>
          <strong>Model-agnostik.</strong> Claude, GPT, Llama, atau model lokal —
          dapat diganti tanpa menulis ulang aplikasi.
        </li>
        <li>
          <strong>Mulai kecil.</strong> Satu use-case dibuktikan lebih dulu,
          baru diskalakan.
        </li>
      </ul>

      <h2>Hubungi kami</h2>
      <p>
        Tulis ke <a href="mailto:halo@byouai.com">halo@byouai.com</a> dengan
        gambaran alur kerja dan data Anda. Kami kembali dengan rancangan solusi
        dan estimasi, tanpa biaya. Untuk lamaran dan kolaborasi:{" "}
        <a href="mailto:karier@byouai.com">karier@byouai.com</a>.
      </p>
    </DocPage>
  );
}
