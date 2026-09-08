/**
 * Server-side dictionary access. The active locale comes from the `[lang]` root
 * segment via `next/root-params`, so pages, layouts, and shared server utilities
 * can call `getDictionary()` with no arguments and no prop drilling.
 *
 * `next/root-params` is Server-Component-only; it cannot run in Client
 * Components, Server Actions, or Route Handlers. Client components receive the
 * locale (and the slice of the dictionary they need) as props.
 */

import { lang } from "next/root-params";
import { DEFAULT_LOCALE, isLocale, type Locale } from "@/lib/i18n";
import type { Dictionary } from "./id";

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  id: () => import("./id").then((m) => m.id),
  en: () => import("./en").then((m) => m.en as Dictionary),
};

/** The active locale, falling back to the default for an unknown segment. */
export async function getLocale(): Promise<Locale> {
  const value = await lang();
  return isLocale(value) ? value : DEFAULT_LOCALE;
}

/** The dictionary for the active locale. */
export async function getDictionary(): Promise<Dictionary> {
  return dictionaries[await getLocale()]();
}

export type { Dictionary };
