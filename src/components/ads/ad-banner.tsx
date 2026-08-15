import { isValidAdKey } from "@/config/ad-keys";
import { AD_BANNER_CONFIG, type AdBannerType } from "./ad-banner-types";

export function AdBanner({
  type,
  adKey,
  eager,
}: {
  type: AdBannerType;
  adKey?: string;
  eager?: boolean;
}) {
  if (!isValidAdKey(adKey)) return null;

  const { html, width, height } = AD_BANNER_CONFIG[type];
  const src = `/ads/${html}?key=${encodeURIComponent(adKey!.trim())}`;

  return (
    <div className="flex justify-center">
      <iframe
        src={src}
        width={width}
        height={height}
        scrolling="no"
        style={{ border: "none" }}
        title="Advertisement"
        loading={eager ? "eager" : "lazy"}
      />
    </div>
  );
}
