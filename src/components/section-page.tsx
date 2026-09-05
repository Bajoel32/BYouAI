import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";

/** Standalone page shell for a single landing-page section: solid nav + footer. */
export function SectionPage({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Nav solid />
      <main id="konten" className="pt-16">
        {children}
      </main>
      <Footer />
    </>
  );
}
