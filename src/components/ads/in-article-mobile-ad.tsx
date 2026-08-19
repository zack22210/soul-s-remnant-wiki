import { AdBanner } from "./ad-banner";

export function InArticleMobileAd() {
  return (
    <div className="mx-auto max-w-4xl py-4 md:hidden">
      <div className="flex justify-center">
        <AdBanner type="banner-300x250" />
      </div>
    </div>
  );
}
