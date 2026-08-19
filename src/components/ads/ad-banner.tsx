import { getBannerConfig } from "@/config/ad-config";
import type { BannerFormat } from "@/config/ad-config";

type AdBannerType = `banner-${BannerFormat}` | "sidebar-160x600" | "sidebar-160x300" | "native-banner-4x1";

function resolveFormat(type: AdBannerType): BannerFormat | null {
  if (type === "native-banner-4x1") return null;
  if (type === "sidebar-160x600") return "160x600";
  if (type === "sidebar-160x300") return "160x300";
  return type.slice("banner-".length) as BannerFormat;
}

export function AdBanner({
  type,
  adKey,
  eager,
}: {
  type: AdBannerType;
  adKey?: string;
  eager?: boolean;
}) {
  const format = resolveFormat(type);
  const config = format ? getBannerConfig(format) : { htmlPath: "/ads/native-banner-4x1.html", width: 728, height: 182 };
  const src = type === "native-banner-4x1" && adKey
    ? `${config.htmlPath}?key=${encodeURIComponent(adKey.trim())}`
    : config.htmlPath;

  return (
    <div className="flex justify-center">
      <iframe
        src={src}
        width={config.width}
        height={config.height}
        scrolling="no"
        style={{ border: "none" }}
        title="Advertisement"
        loading={eager ? "eager" : "lazy"}
      />
    </div>
  );
}
