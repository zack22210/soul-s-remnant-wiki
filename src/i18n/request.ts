import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

import en from "@/locales/en.json";

type Messages = typeof en;

async function loadMessages(locale: string): Promise<Partial<Messages>> {
  if (locale === "en") return en;
  try {
    return (await import(`../locales/${locale}.json`)).default as Partial<Messages>;
  } catch {
    return {};
  }
}

/**
 * Recursively merge `override` onto `base`. Missing keys in a non-English
 * locale automatically fall back to the English value, so a partial
 * translation never throws a missing-message error.
 */
function deepMerge<T>(base: T, override: Partial<T>): T {
  if (
    typeof base !== "object" ||
    base === null ||
    typeof override !== "object" ||
    override === null
  ) {
    return (override as T) ?? base;
  }

  if (Array.isArray(base)) {
    return (Array.isArray(override) ? override : base) as T;
  }

  const result: Record<string, unknown> = { ...(base as Record<string, unknown>) };

  for (const key of Object.keys(override as Record<string, unknown>)) {
    const baseValue = (base as Record<string, unknown>)[key];
    const overrideValue = (override as Record<string, unknown>)[key];
    if (overrideValue === undefined) continue;
    result[key] = deepMerge(baseValue as never, overrideValue as never);
  }

  return result as T;
}

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  // Non-English locales are merged on top of English so untranslated keys
  // gracefully fall back instead of erroring.
  const messages = deepMerge(en, await loadMessages(locale));

  return { locale, messages };
});
