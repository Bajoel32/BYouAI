import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/sections/hero";
import { Trust } from "@/components/sections/trust";
import { Cta } from "@/components/sections/cta";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Trust />
        <Cta />
      </main>
      <Footer />
    </>
  );
}
