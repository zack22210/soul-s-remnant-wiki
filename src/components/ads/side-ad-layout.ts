/** Matches site `max-w-7xl` — side ads sit in viewport gutters outside this width. */
export const SIDE_AD_CONTENT_MAX = "80rem";

/** 160px (`w-40`) sidebar slot width. */
export const SIDE_AD_WIDTH_PX = 160;

/** Gap between ad edge and content container edge. */
export const SIDE_AD_GAP_PX = 16;

/** Show fixed side ads only when gutters can hold ad + gap without overlapping content. */
export const SIDE_AD_MIN_VIEWPORT_PX = 1680;

export function sideAdInset(): string {
  return `max(${SIDE_AD_GAP_PX}px, calc((100vw - min(100vw, ${SIDE_AD_CONTENT_MAX})) / 2 - ${SIDE_AD_WIDTH_PX + SIDE_AD_GAP_PX}px))`;
}
