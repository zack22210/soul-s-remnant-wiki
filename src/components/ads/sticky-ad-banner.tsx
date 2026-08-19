"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { AdBanner } from "./ad-banner";

export function StickyAdBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="pointer-events-none fixed bottom-[max(0.5rem,var(--safe-bottom))] left-1/2 z-50 w-[320px] max-w-full -translate-x-1/2">
      <div className="pointer-events-auto relative w-full shadow-xl">
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="touch-target absolute right-0 top-0 z-10 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-background text-muted-foreground shadow-lg transition hover:text-foreground"
          aria-label="Close advertisement"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="overflow-hidden">
          <AdBanner type="banner-320x50" eager />
        </div>
      </div>
    </div>
  );
}
