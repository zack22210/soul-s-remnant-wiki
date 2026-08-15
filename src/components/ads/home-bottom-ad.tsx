import { getAdKey, isValidAdKey } from "@/config/ad-keys";
import { AdBanner } from "./ad-banner";

export function HomeBottomAd() {
  const adKey = getAdKey("BANNER_728X90");
  if (!isValidAdKey(adKey)) return null;

  return (
    <div className="mx-auto max-w-4xl py-4">
      <div className="flex justify-center">
        <AdBanner type="banner-728x90" adKey={adKey} eager />
      </div>
    </div>
  );
}
