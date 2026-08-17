/** Adsterra unit keys — env vars override these defaults when set. */
export const AD_KEYS = {
  BANNER_728X90: "973ee7a0a3472bc16bc5bbc568a72881",
  BANNER_300X250: "043ea20f1be1a9d4e223ad20b273a7d2",
  BANNER_468X60: "0",
  SIDEBAR_160X600: "9b19c432b5164ea8bd172388f8223d2c",
  SIDEBAR_160X300: "8d5cf9e55b6e902bf4dd1754cdca7746",
  MOBILE_320X50: "351b9c416101556311a846beb84ef67a",
  NATIVE_BANNER: "097a50cde275c0e88d5fc2943b8eddbd",
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
  NATIVE_BANNER: process.env.NEXT_PUBLIC_AD_NATIVE_BANNER,
};

export function getAdKey(name: AdKeyName): string {
  const trimmed = ENV_BY_KEY[name]?.trim();
  if (trimmed === "0") return "";
  if (trimmed) return trimmed;
  const fallback: string = AD_KEYS[name];
  return fallback === "0" ? "" : fallback;
}

export function getNativeAdKey(): string {
  return getAdKey("NATIVE_BANNER");
}
