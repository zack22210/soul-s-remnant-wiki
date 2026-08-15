import { defineRouting } from "next-intl/routing";
import generated from "@/config/locales.generated.json";

/**
 * Single source of truth for supported locales.
 *
 * `wiki:approve` writes this generated locale list from workspace/languages.json.
 * English remains the default and is served without a URL prefix.
 */
export const routing = defineRouting({
  locales: generated.locales as ["en", ...string[]],
  defaultLocale: "en",
  // English is served without a `/en` prefix (e.g. `/codes`, `/guide/...`).
  localePrefix: "as-needed",
  localeDetection: true,
});

export type Locale = (typeof routing.locales)[number];
