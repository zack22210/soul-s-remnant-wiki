import { getAdKey, isValidAdKey, type AdKeyName } from "@/config/ad-keys";

export type BannerFormat = "728x90" | "300x250" | "468x60" | "160x600" | "160x300" | "320x50";

export interface BannerConfig {
  width: number;
  height: number;
  htmlPath: string;
}

const BANNER_SPECS: Record<BannerFormat, BannerConfig> = {
  "728x90": { width: 728, height: 90, htmlPath: "/ads/banner-728x90.html" },
  "300x250": { width: 300, height: 250, htmlPath: "/ads/banner-300x250.html" },
  "468x60": { width: 468, height: 60, htmlPath: "/ads/banner-468x60.html" },
  "160x600": { width: 160, height: 600, htmlPath: "/ads/banner-160x600.html" },
  "160x300": { width: 160, height: 300, htmlPath: "/ads/banner-160x300.html" },
  "320x50": { width: 320, height: 50, htmlPath: "/ads/banner-320x50.html" },
};

const BANNER_KEY_BY_FORMAT: Record<BannerFormat, AdKeyName> = {
  "728x90": "BANNER_728X90",
  "300x250": "BANNER_300X250",
  "468x60": "BANNER_468X60",
  "160x600": "SIDEBAR_160X600",
  "160x300": "SIDEBAR_160X300",
  "320x50": "MOBILE_320X50",
};

/** Standard banner keys are embedded in public/ads/*.html during ads:sync. */
export function getBannerConfig(format: BannerFormat): BannerConfig {
  return BANNER_SPECS[format];
}

export function isBannerConfigured(format: BannerFormat): boolean {
  return isValidAdKey(getAdKey(BANNER_KEY_BY_FORMAT[format]));
}
