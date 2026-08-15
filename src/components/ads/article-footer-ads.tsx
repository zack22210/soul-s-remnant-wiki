import { getAdKey, isValidAdKey } from "@/config/ad-keys";
import { AdBanner } from "./ad-banner";

export function ArticleFooterAds() {
  const key728 = getAdKey("BANNER_728X90");
  const key468 = getAdKey("BANNER_468X60");

  if (!isValidAdKey(key728) && !isValidAdKey(key468)) return null;

  return (
    <div className="mx-auto max-w-4xl space-y-4 py-8">
      {isValidAdKey(key728) ? (
        <div className="flex justify-center">
          <AdBanner type="banner-728x90" adKey={key728} />
        </div>
      ) : null}
      {isValidAdKey(key468) ? (
        <div className="flex justify-center">
          <AdBanner type="banner-468x60" adKey={key468} />
        </div>
      ) : null}
    </div>
  );
}
