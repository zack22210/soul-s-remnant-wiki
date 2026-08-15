import { getAdKey, isValidAdKey } from "@/config/ad-keys";
import { AdBanner } from "./ad-banner";

export function InArticleMobileAd() {
  const adKey = getAdKey("BANNER_300X250");
  if (!isValidAdKey(adKey)) return null;

  return (
    <div className="mx-auto max-w-4xl py-4 md:hidden">
      <div className="flex justify-center">
        <AdBanner type="banner-300x250" adKey={adKey} />
      </div>
    </div>
  );
}
