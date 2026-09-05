import { Container, SectionHeading } from "@/components/ui";
import { Icon } from "@/components/icons";

const ITEMS = [
  "Enkripsi AES-256 saat transit dan saat diam",
  "Isolasi data per klien — tidak ada pencampuran tenant",
  "Opsi deployment on-prem atau di dalam VPC Anda",
  "Data Anda tidak dipakai melatih model pihak ketiga",
  "SSO, RBAC, dan audit log yang dapat diekspor",
  "Region penyimpanan data dapat dipilih",
  "Retensi dan penghapusan data yang dapat dikonfigurasi",
  "Selaras dengan UU PDP; sertifikasi SOC 2 dalam proses",
];

export function Security() {
  return (
    <section
      id="keamanan"
      className="border-t border-line bg-surface py-24 md:py-32"
    >
      <Container className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
        <SectionHeading
          kicker="Keamanan & Kepatuhan"
          title="Dibangun dengan standar keamanan enterprise"
          lead="Data yang Anda serahkan adalah aset paling sensitif Anda. Kami memperlakukannya seperti itu — dari infrastruktur sampai kontrak."
        />

        <ul className="reveal grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
          {ITEMS.map((item) => (
            <li
              key={item}
              className="flex items-start gap-3 bg-surface p-5 text-sm leading-relaxed"
            >
              <Icon
                name="check"
                className="mt-0.5 h-4 w-4 text-accent-strong"
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
