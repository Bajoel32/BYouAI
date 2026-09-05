"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { Container, Button } from "@/components/ui";
import { LogoMark } from "@/components/logo";
import { Icon } from "@/components/icons";
import { ThemeToggle } from "@/components/theme-toggle";

const LINKS = [
  { href: "/solusi", label: "Solusi" },
  { href: "/cara-kerja", label: "Cara Kerja" },
  { href: "/keamanan", label: "Keamanan" },
  { href: "/harga", label: "Harga" },
  { href: "/faq", label: "FAQ" },
  { href: "/invoice", label: "Estimasi" },
];

export function Nav({ solid = false }: { solid?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile panel once the layout crosses back to the desktop nav,
  // otherwise `open` would stay true and keep the body scroll locked.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = () => {
      if (mq.matches) setOpen(false);
    };
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Over the near-black hero the transparent bar uses a light-on-dark scheme,
  // then switches to theme tokens once it gets a background on scroll (or when
  // the mobile panel opens). Pages without a dark hero pass `solid`.
  const onHero = !solid && !scrolled && !open;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 ease-out-expo transition-[background-color,border-color,backdrop-filter] duration-300",
        solid || scrolled || open
          ? "border-b border-line bg-bg/80 backdrop-blur-md"
          : "border-b border-transparent",
      )}
    >
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="flex items-center gap-2.5"
          aria-label="BYouAI — beranda"
        >
          <LogoMark className="h-8 w-8" />
          <span
            className={cn(
              "text-[1.05rem] font-semibold tracking-tight transition-colors",
              onHero ? "text-white" : "text-ink",
            )}
          >
            BYouAI
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "rounded-full px-3 py-2 text-sm transition-colors",
                onHero
                  ? "text-white/75 hover:bg-white/10 hover:text-white"
                  : "text-muted hover:bg-surface-2 hover:text-ink",
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle tone={onHero ? "onDark" : "auto"} />
          <Button href="/konsultasi" variant="primary">
            Konsultasi
          </Button>
        </div>

        <button
          type="button"
          className={cn(
            "inline-flex h-9 w-9 items-center justify-center rounded-full border transition-colors md:hidden",
            onHero ? "border-white/20 text-white" : "border-line text-ink",
          )}
          aria-label={open ? "Tutup menu" : "Buka menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <Icon name={open ? "close" : "menu"} className="h-5 w-5" />
        </button>
      </Container>

      {open ? (
        <div className="border-t border-line bg-bg md:hidden">
          <Container className="flex flex-col gap-1 py-4">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-base text-ink transition-colors hover:bg-surface-2"
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-2 flex items-center gap-3">
              <ThemeToggle tone="auto" />
              <Button
                href="/konsultasi"
                variant="primary"
                className="flex-1"
                onClick={() => setOpen(false)}
              >
                Konsultasi gratis
              </Button>
            </div>
          </Container>
        </div>
      ) : null}
    </header>
  );
}
