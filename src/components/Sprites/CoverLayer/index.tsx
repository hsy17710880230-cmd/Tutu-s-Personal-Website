import { IMG_H, IMG_W, useBackgroundCover } from "@/src/lib/utils";
import { memo } from "react";

type CoverLayerProps = {
  src: string;
  alt?: string;
  zIndex?: number;
  fix?: { x: number; y: number; scale?: number };
  priority?: boolean;
  className?: string;
};

export const CoverLayer = memo<CoverLayerProps>(function CoverLayer({
  src,
  alt = "",
  zIndex = 0,
  fix,
  priority = false,
  className = "",
}) {
  const { scale, offsetX, offsetY, ready } = useBackgroundCover(fix);

  return (
    <img
      src={src}
      alt={alt}
      aria-hidden={!alt}
      draggable={false}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      className={`fixed top-0 left-0 pointer-events-none select-none ${className}`}
      style={{
        width: IMG_W * scale,
        height: IMG_H * scale,
        transform: `translate(${offsetX}px, ${offsetY}px)`,
        willChange: "transform",
        zIndex,
        visibility: ready ? "visible" : "hidden",
      }}
    />
  );
});
