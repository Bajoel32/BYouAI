import Link from "next/link";
import { Container } from "@/components/ui";
import { LogoMark } from "@/components/logo";
import { Year } from "@/components/year";

const COLUMNS = [
  {
    title: "Produk",
    links: [
      { label: "Cara Kerja", href: "/cara-kerja" },
      { label: "Kemampuan", href: "/fitur" },
      { label: "Keamanan", href: "/keamanan" },
      { label: "Harga", href: "/harga" },
      { label: "Estimasi", href: "/invoice" },
    ],
  },
  {
    title: "Solusi",
    links: [
      { label: "E-commerce", href: "/solusi" },
      { label: "Firma Hukum", href: "/solusi" },
      { label: "Klinik & Dokter", href: "/solusi" },
      { label: "Industri lain", href: "/#kontak" },
    ],
  },
  {
    title: "Perusahaan",
    links: [
      { label: "Tentang", href: "/tentang" },
      { label: "Konsultasi", href: "/konsultasi" },
      { label: "Kontak", href: "mailto:halo@byouai.com" },
      { label: "Karier", href: "mailto:karier@byouai.com" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Kebijakan Privasi", href: "/privasi" },
      { label: "Syarat Layanan", href: "/ketentuan" },
      { label: "Pemrosesan Data", href: "/pemrosesan-data" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-[#0A0B0D] text-[#F4F3F1]">
      <Container className="py-16">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_2fr]">
          <div>
            <span className="inline-flex items-center gap-2.5">
              <LogoMark className="h-8 w-8" />
              <span className="text-[1.05rem] font-semibold tracking-tight">
                BYouAI
              </span>
            </span>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/55">
              AI kustom berbasis RAG di atas data Anda sendiri. Akurat,
              tersitasi, siap produksi.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <h3 className="font-mono text-xs uppercase tracking-[0.16em] text-white/55">
                  {col.title}
                </h3>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      {l.href.startsWith("/") ? (
                        <Link
                          href={l.href}
                          className="text-sm text-white/65 transition-colors hover:text-white"
                        >
                          {l.label}
                        </Link>
                      ) : (
                        <a
                          href={l.href}
                          className="text-sm text-white/65 transition-colors hover:text-white"
                        >
                          {l.label}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <p suppressHydrationWarning>
            © <Year /> BYouAI. Semua hak dilindungi.
          </p>
          <p className="font-mono">Dibuat di Indonesia</p>
        </div>
      </Container>
    </footer>
  );
}
