import { getNativeAdKey, isValidAdKey } from "@/config/ad-keys";
import { AdBanner } from "./ad-banner";

export function NativeBannerAd() {
  const adKey = getNativeAdKey();
  if (!isValidAdKey(adKey)) return null;

  return (
    <div className="mx-auto max-w-4xl py-4">
      <div className="flex justify-center">
        <AdBanner type="native-banner-4x1" adKey={adKey} />
      </div>
    </div>
  );
}
