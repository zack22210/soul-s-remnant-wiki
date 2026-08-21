/** Adsterra unit keys — env vars override these defaults when set. */
export const AD_KEYS = {
  BANNER_728X90: "d332132ec9f105ad156af6793eb5431d",
  BANNER_300X250: "29d1feb2516cc2c68719a45fd33743e8",
  BANNER_468X60: "0",
  SIDEBAR_160X600: "4adaa15d99d3ffba57ceef07645b4251",
  SIDEBAR_160X300: "fc9e8195c51992ea4e876d35683229a0",
  MOBILE_320X50: "e9dc961eb3f3326e1d16d5ad3432d384",
  NATIVE_BANNER: "097a50cde275c0e88d5fc2943b8eddbd",
} as const;

export type AdKeyName = keyof typeof AD_KEYS;

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
