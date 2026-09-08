"use client";

import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import {
  LOCALES,
  LOCALE_COOKIE,
  LOCALE_LABEL,
  LOCALE_NAME,
  switchLocalePath,
  type Locale,
} from "@/lib/i18n";

// Module-level so the assignment isn't flagged as mutating outer state from
// inside the component (mirrors the pattern in theme-toggle.tsx).
function rememberLocale(target: Locale) {
  try {
    document.cookie = `${LOCALE_COOKIE}=${target}; path=/; max-age=31536000; samesite=lax`;
  } catch {
    /* cookies blocked — the URL prefix still carries the locale */
  }
}

/**
 * ID / EN toggle. Rewrites the current path to the same page in the other
 * locale and remembers the choice in the `NEXT_LOCALE` cookie so `proxy.ts`
 * keeps sending the visitor there on later visits.
 */
export function LangSwitcher({
  locale,
  label,
  tone = "auto",
}: {
  locale: Locale;
  label: string;
  tone?: "auto" | "onDark";
}) {
  const router = useRouter();
  const pathname = usePathname();

  function select(target: Locale) {
    if (target === locale) return;
    rememberLocale(target);
    router.push(switchLocalePath(pathname, target));
  }

  return (
    <div
      role="group"
      aria-label={label}
      className={cn(
        "inline-flex items-center rounded-full border p-0.5",
        tone === "onDark" ? "border-white/20" : "border-line",
      )}
    >
      {LOCALES.map((l) => {
        const active = l === locale;
        return (
          <button
            key={l}
            type="button"
            onClick={() => select(l)}
            aria-pressed={active}
            title={LOCALE_NAME[l]}
            className={cn(
              "rounded-full px-2 py-1 font-mono text-[0.7rem] uppercase tracking-[0.1em] transition-colors",
              active
                ? tone === "onDark"
                  ? "bg-white/15 text-white"
                  : "bg-surface-2 text-ink"
                : tone === "onDark"
                  ? "text-white/60 hover:text-white"
                  : "text-muted hover:text-ink",
            )}
          >
            {LOCALE_LABEL[l]}
          </button>
        );
      })}
    </div>
  );
}
