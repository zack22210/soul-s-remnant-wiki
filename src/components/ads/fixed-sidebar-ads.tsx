"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { getAdKey, isValidAdKey } from "@/config/ad-keys";
import { SidebarAd } from "./sidebar-ad";
import { sideAdInset } from "./side-ad-layout";

const leftAdKey = getAdKey("SIDEBAR_160X600");
const rightAdKey = getAdKey("SIDEBAR_160X300");

/** Tailwind needs a static arbitrary breakpoint class (matches SIDE_AD_MIN_VIEWPORT_PX). */
const sideAdVisibleClass = "hidden min-[1680px]:block";

export function FixedSidebarAds() {
  const [leftDismissed, setLeftDismissed] = useState(false);
  const [rightDismissed, setRightDismissed] = useState(false);

  if (!isValidAdKey(leftAdKey) && !isValidAdKey(rightAdKey)) return null;

  const inset = sideAdInset();

  return (
    <>
      {isValidAdKey(leftAdKey) && !leftDismissed ? (
        <aside
          className={`fixed top-20 z-10 w-40 ${sideAdVisibleClass}`}
          style={{ left: inset }}
        >
          <div className="relative pr-10">
            <button
              type="button"
              onClick={() => setLeftDismissed(true)}
              className="absolute right-0 top-0 z-10 rounded-md p-1 text-muted-foreground transition hover:bg-muted hover:text-foreground"
              aria-label="关闭广告"
            >
              <X className="h-4 w-4" />
            </button>
            <SidebarAd type="sidebar-160x600" adKey={leftAdKey} />
          </div>
        </aside>
      ) : null}
      {isValidAdKey(rightAdKey) && !rightDismissed ? (
        <aside
          className={`fixed top-20 z-10 w-40 ${sideAdVisibleClass}`}
          style={{ right: inset }}
        >
          <div className="relative pr-10">
            <button
              type="button"
              onClick={() => setRightDismissed(true)}
              className="absolute right-0 top-0 z-10 rounded-md p-1 text-muted-foreground transition hover:bg-muted hover:text-foreground"
              aria-label="关闭广告"
            >
              <X className="h-4 w-4" />
            </button>
            <SidebarAd type="sidebar-160x300" adKey={rightAdKey} />
          </div>
        </aside>
      ) : null}
    </>
  );
}
