import { isValidAdKey } from "@/config/ad-keys";
import { AdBanner } from "./ad-banner";

export type SidebarAdType = "sidebar-160x600" | "sidebar-160x300";

export function SidebarAd({ type, adKey }: { type: SidebarAdType; adKey?: string }) {
  if (!isValidAdKey(adKey)) return null;
  return <AdBanner type={type} adKey={adKey} />;
}
