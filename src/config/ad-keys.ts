/** Adsterra unit keys — env vars override these defaults when set. */
export const AD_KEYS = {
  BANNER_728X90: "0",
  BANNER_300X250: "0",
  BANNER_468X60: "0",
  SIDEBAR_160X600: "0",
  SIDEBAR_160X300: "0",
  MOBILE_320X50: "0",
} as const;

type AdKeyName = keyof typeof AD_KEYS;

export function isValidAdKey(key?: string | null): boolean {
  const trimmed = key?.trim();
  return Boolean(trimmed) && trimmed !== "0";
}

const ENV_BY_KEY: Record<AdKeyName, string | undefined> = {
  BANNER_728X90: process.env.NEXT_PUBLIC_AD_BANNER_728X90,
  BANNER_300X250: process.env.NEXT_PUBLIC_AD_BANNER_300X250,
  BANNER_468X60: process.env.NEXT_PUBLIC_AD_BANNER_468X60,
  SIDEBAR_160X600: process.env.NEXT_PUBLIC_AD_SIDEBAR_160X600,
  SIDEBAR_160X300: process.env.NEXT_PUBLIC_AD_SIDEBAR_160X300,
  MOBILE_320X50: process.env.NEXT_PUBLIC_AD_MOBILE_320X50,
};

export function getAdKey(name: AdKeyName): string {
  const trimmed = ENV_BY_KEY[name]?.trim();
  if (trimmed === "0") return "";
  if (trimmed) return trimmed;
  const fallback = AD_KEYS[name];
  return fallback === "0" ? "" : fallback;
}

export function getNativeAdKey(): string {
  const env = process.env.NEXT_PUBLIC_AD_NATIVE_BANNER?.trim();
  if (!env || env === "0") return "";
  return env;
}
