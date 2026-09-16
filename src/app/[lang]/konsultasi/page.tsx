import { SectionPage } from "@/components/section-page";
import { getDictionary } from "@/dictionaries";
import { isIndustry } from "@/lib/consultation";
import { Consultation } from "./consultation";

export default async function KonsultasiPage(
  props: PageProps<"/[lang]/konsultasi">,
) {
  const [{ konsultasi: dict }, { industri }] = await Promise.all([
    getDictionary(),
    props.searchParams,
  ]);
  const initialIndustry = isIndustry(industri) ? industri : undefined;

  return (
    <SectionPage>
      <Consultation dict={dict} initialIndustry={initialIndustry} />
    </SectionPage>
  );
}
