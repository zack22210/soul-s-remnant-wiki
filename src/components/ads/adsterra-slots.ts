import { getAdKey } from "@/config/ad-keys";

export const ADSTERRA_BANNER_SLOTS = {
  "728x90": {
    html: "banner-728x90.html",
    width: 728,
    height: 90,
    key: getAdKey("BANNER_728X90"),
  },
  "300x250": {
    html: "banner-300x250.html",
    width: 300,
    height: 250,
    key: getAdKey("BANNER_300X250"),
  },
  "468x60": {
    html: "banner-468x60.html",
    width: 468,
    height: 60,
    key: getAdKey("BANNER_468X60"),
  },
  "160x600": {
    html: "sidebar-160x600.html",
    width: 160,
    height: 600,
    key: getAdKey("SIDEBAR_160X600"),
  },
  "160x300": {
    html: "sidebar-160x300.html",
    width: 160,
    height: 300,
    key: getAdKey("SIDEBAR_160X300"),
  },
  "320x50": {
    html: "banner-320x50.html",
    width: 320,
    height: 50,
    key: getAdKey("MOBILE_320X50"),
  },
} as const;

export type AdsterraBannerSlot = keyof typeof ADSTERRA_BANNER_SLOTS;
