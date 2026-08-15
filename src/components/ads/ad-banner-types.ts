export const AD_BANNER_CONFIG = {
  "banner-728x90": { html: "banner-728x90.html", width: 728, height: 90 },
  "banner-300x250": { html: "banner-300x250.html", width: 300, height: 250 },
  "banner-468x60": { html: "banner-468x60.html", width: 468, height: 60 },
  "sidebar-160x600": { html: "sidebar-160x600.html", width: 160, height: 600 },
  "sidebar-160x300": { html: "sidebar-160x300.html", width: 160, height: 300 },
  "banner-320x50": { html: "banner-320x50.html", width: 320, height: 50 },
  "native-banner-4x1": { html: "native-banner-4x1.html", width: 728, height: 182 },
} as const;

export type AdBannerType = keyof typeof AD_BANNER_CONFIG;
