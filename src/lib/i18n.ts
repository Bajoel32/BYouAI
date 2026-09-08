/**
 * Locale primitives shared by server and client code.
 *
 * This module must stay import-safe for Client Components, so it does NOT touch
 * `next/root-params` (server-only). Server code reads the active locale through
 * `getDictionary` / `getLocale` in `src/dictionaries`; client code receives the
 * locale as a prop and uses the helpers here to build links.
 *
 * URL model: Indonesian (the default) has no prefix — `/harga`. English is
 * prefixed — `/en/harga`. `src/proxy.ts` rewrites bare paths to the internal
 * `/id/...` route and redirects `/id/...` back to the bare form.
 */

export const LOCALES = ["id", "en"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "id";

/** Cookie the language switcher sets so the choice survives future visits. */
export const LOCALE_COOKIE = "NEXT_LOCALE";

/** `<html lang>` / Open Graph locale for each supported locale. */
export const OG_LOCALE: Record<Locale, string> = {
  id: "id_ID",
  en: "en_US",
};

/** Short label shown in the switcher. */
export const LOCALE_LABEL: Record<Locale, string> = {
  id: "ID",
  en: "EN",
};

/** Full name, used for the switcher's accessible label. */
export const LOCALE_NAME: Record<Locale, string> = {
  id: "Bahasa Indonesia",
  en: "English",
};

export function isLocale(value: string | undefined | null): value is Locale {
  return value != null && (LOCALES as readonly string[]).includes(value);
}

/**
 * Prefix an app-internal path for the given locale. The default locale is
 * returned unchanged; other locales get a `/<locale>` prefix.
 *
 * Only touches absolute in-app paths (`/...`). Hashes, query strings, `mailto:`,
 * and external URLs pass through untouched.
 */
export function localizedHref(href: string, locale: Locale): string {
  if (locale === DEFAULT_LOCALE) return href;
  if (!href.startsWith("/")) return href;
  if (href.startsWith(`/${locale}/`) || href === `/${locale}`) return href;
  // `/` -> `/en`; `/#x` / `/?x` -> `/en#x` / `/en?x`; `/path` -> `/en/path`
  if (href === "/") return `/${locale}`;
  if (href.startsWith("/#") || href.startsWith("/?")) {
    return `/${locale}${href.slice(1)}`;
  }
  return `/${locale}${href}`;
}

/**
 * Split a pathname into its locale (if any) and the remaining bare path.
 * `/en/harga` -> `{ locale: "en", path: "/harga" }`
 * `/harga`    -> `{ locale: "id", path: "/harga" }`
 */
function splitLocale(pathname: string): { locale: Locale; path: string } {
  const [, first, ...rest] = pathname.split("/");
  if (isLocale(first) && first !== DEFAULT_LOCALE) {
    const path = "/" + rest.join("/");
    return { locale: first, path: path === "/" ? "/" : path.replace(/\/$/, "") };
  }
  return { locale: DEFAULT_LOCALE, path: pathname };
}

/** Rewrite a full pathname to point at the same page in `target`. */
export function switchLocalePath(pathname: string, target: Locale): string {
  const { path } = splitLocale(pathname);
  return localizedHref(path || "/", target);
}
