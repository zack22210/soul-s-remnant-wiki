import { AdBanner } from "./ad-banner";

export function HomeBottomAd() {
  return (
    <div className="mx-auto max-w-4xl py-4">
      <div className="flex justify-center">
        <AdBanner type="banner-728x90" eager />
      </div>
    </div>
  );
}
