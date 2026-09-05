import type { Metadata } from "next";
import { SectionPage } from "@/components/section-page";
import { Security } from "@/components/sections/security";

export const metadata: Metadata = {
  title: "Keamanan",
  description:
    "Enkripsi AES-256, isolasi per klien, opsi on-prem/VPC, SSO/RBAC/audit log — standar keamanan enterprise.",
};

export default function KeamananPage() {
  return (
    <SectionPage>
      <Security />
    </SectionPage>
  );
}
