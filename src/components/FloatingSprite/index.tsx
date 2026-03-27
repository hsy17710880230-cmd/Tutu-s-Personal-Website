"use client";

import { useBackgroundCover } from "../../hooks/useBackgroundCover";

export type FloatingSpriteProps = {
  x: number;        // position in background image space (pixels)
  y: number;
  spriteW: number;  // natural width of the sprite image (pixels)
  spriteH: number;  // natural height of the sprite image (pixels)

  imgWidth?: number;
  imgHeight?: number;

  img_path: string;

  onClick?: () => void;
  onHover?: () => void;
  onHoverEnd?: () => void;

  hoverEffect?: string; // tailwind classes
  rotation?: number;    // rotation in degrees
  zIndex?: number;
};

export default function FloatingSprite({
  x,
  y,
  spriteW,
  spriteH,
  imgWidth = 2400,
  imgHeight = 1854,
  img_path,
  onClick,
  onHover,
  onHoverEnd,
  hoverEffect,
  rotation = 0,
  zIndex = 50,
}: FloatingSpriteProps) {
  const { scale, offsetX, offsetY } = useBackgroundCover(imgWidth, imgHeight);

  const screenX = Math.round(x * scale + offsetX);
  const screenY = Math.round(y * scale + offsetY);

  const screenW = spriteW * scale;
  const screenH = spriteH * scale;

  return (
    <button
      onClick={onClick}
      onMouseEnter={onHover}
      onMouseLeave={onHoverEnd}
      className={`fixed animate-float transition-transform ${hoverEffect ?? ""}`}
      style={{
        left: screenX,
        top: screenY,
        width: screenW,
        height: screenH,
        transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
        zIndex,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={img_path}
        alt="sprite"
        style={{
          width: "100%",
          height: "100%",
          display: "block",
          pointerEvents: "none",
        }}
        draggable={false}
      />
    </button>
  );
}
