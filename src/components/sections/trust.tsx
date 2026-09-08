import { Container } from "@/components/ui";
import { getDictionary } from "@/dictionaries";

export async function Trust() {
  const { trust } = await getDictionary();

  return (
    <section className="border-y border-line bg-surface py-10">
      <Container>
        <p className="text-center font-mono text-xs uppercase tracking-[0.18em] text-muted">
          {trust.caption}
        </p>
      </Container>

      <div className="marquee-mask relative mt-6 overflow-hidden">
        {/* Two identical groups: translating the track by exactly -50% swaps the
            second group into the first's place, so the loop has no seam. The
            trailing `pe-3` on each group matches the inner `gap-3` so item
            spacing stays even across the boundary. */}
        <div className="marquee flex">
          {[0, 1].map((group) => (
            <ul
              key={group}
              className="flex shrink-0 gap-3 pe-3"
              aria-label={group === 0 ? trust.ariaList : undefined}
              aria-hidden={group === 1 || undefined}
            >
              {trust.industries.map((name) => (
                <li
                  key={name}
                  className="whitespace-nowrap rounded-full border border-line bg-bg px-4 py-2 text-sm text-muted"
                >
                  {name}
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
