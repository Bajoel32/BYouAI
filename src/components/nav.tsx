import { getDictionary, getLocale } from "@/dictionaries";
import { NavClient } from "@/components/nav-client";

/**
 * Server wrapper: resolves the locale + nav copy, then hands off to the
 * interactive client nav. `next/root-params` (used inside `getDictionary`)
 * cannot run in a Client Component, so the split is required.
 */
export async function Nav({ solid = false }: { solid?: boolean }) {
  const [dict, locale] = await Promise.all([getDictionary(), getLocale()]);
  return (
    <NavClient
      dict={dict.nav}
      themeToggleDict={dict.themeToggle}
      locale={locale}
      solid={solid}
    />
  );
}
