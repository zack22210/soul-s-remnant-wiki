import { ADSTERRA_BANNER_SLOTS, type AdsterraBannerSlot } from "./adsterra-slots";

export function AdsterraBanner({ slot }: { slot: AdsterraBannerSlot }) {
  const { width, height, html } = ADSTERRA_BANNER_SLOTS[slot];
  const src = `/ads/${html}`;

  return (
    <div className="flex justify-center">
      <iframe
        src={src}
        width={width}
        height={height}
        scrolling="no"
        style={{ border: "none" }}
        title="Advertisement"
      />
    </div>
  );
}
