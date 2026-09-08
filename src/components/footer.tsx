import Link from "next/link";
import { Container } from "@/components/ui";
import { LogoMark } from "@/components/logo";
import { Year } from "@/components/year";
import { getDictionary, getLocale } from "@/dictionaries";
import { localizedHref } from "@/lib/i18n";

export async function Footer() {
  const [dict, locale] = await Promise.all([getDictionary(), getLocale()]);
  const f = dict.footer;

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
              {f.tagline}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {f.columns.map((col) => (
              <div key={col.title}>
                <h3 className="font-mono text-xs uppercase tracking-[0.16em] text-white/55">
                  {col.title}
                </h3>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((l) => (
                    <li key={`${col.title}-${l.label}`}>
                      {l.href.startsWith("/") ? (
                        <Link
                          href={localizedHref(l.href, locale)}
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
            © <Year /> BYouAI. {f.rights}
          </p>
          <p className="font-mono">{f.madeIn}</p>
        </div>
      </Container>
    </footer>
  );
}
