import { AdBanner } from "./ad-banner";

export function ArticleFooterAds() {
  return (
    <div className="mx-auto max-w-4xl space-y-4 py-8">
      <div className="flex justify-center"><AdBanner type="banner-728x90" /></div>
    </div>
  );
}
