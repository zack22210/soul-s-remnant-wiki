import { AdBanner } from "./ad-banner";

export type SidebarAdType = "sidebar-160x600" | "sidebar-160x300";

export function SidebarAd({ type, adKey }: { type: SidebarAdType; adKey?: string }) {
  return <AdBanner type={type} adKey={adKey} />;
}
