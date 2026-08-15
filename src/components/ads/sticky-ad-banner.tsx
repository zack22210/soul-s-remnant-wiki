"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { getAdKey, isValidAdKey } from "@/config/ad-keys";
import { AdBanner } from "./ad-banner";

const MOBILE_BANNER_KEY = getAdKey("MOBILE_320X50");

export function StickyAdBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (!isValidAdKey(MOBILE_BANNER_KEY) || dismissed) return null;

  return (
    <div className="sticky top-[calc(var(--header-height)+var(--safe-top))] z-20 py-2">
      <div className="mx-auto max-w-4xl">
        <div className="relative overflow-hidden pr-9">
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="absolute right-0 top-0 z-10 touch-target grid place-items-center rounded-md p-1 text-muted-foreground transition hover:bg-muted hover:text-foreground"
            aria-label="关闭广告"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="mx-auto w-full max-w-[320px] sm:max-w-none">
            <AdBanner type="banner-320x50" adKey={MOBILE_BANNER_KEY} eager />
          </div>
        </div>
      </div>
    </div>
  );
}
