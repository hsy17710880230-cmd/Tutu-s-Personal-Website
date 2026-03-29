
/* ─── Floating Sprite (fullscreen image-space layer) ─── */

import { IMG_W, IMG_H } from "@/src/lib/utils";
import { motion, TargetAndTransition, useAnimation } from "framer-motion";
import { useCallback } from "react";
import { useBackgroundCover } from "..";

export type FloatingSpriteProps = {
  src: string;
  alt?: string;

  hitboxX: number;
  hitboxY: number;
  hitboxW: number;
  hitboxH: number;

  rotation?: number;
  zIndex?: number;
  debug?: boolean;
  priority?: boolean;
  fix?: { x: number; y: number; scale?: number };

  whileHover?: TargetAndTransition;
  whileTap?: TargetAndTransition;

  onClick?: () => void;
  onHover?: () => void;
  onHoverEnd?: () => void;
};
export function FloatingSprite({
  src,
  alt = "",
  hitboxX,
  hitboxY,
  hitboxW,
  hitboxH,
  rotation = 0,
  zIndex = 10,
  debug = false,
  priority = false,
  fix,
  whileHover = { scale: 1.05 },
  whileTap = { scale: 0.95 },
  onClick,
  onHover,
  onHoverEnd,
}: FloatingSpriteProps) {
  const { scale, offsetX, offsetY, ready } = useBackgroundCover(fix);
  const spriteControls = useAnimation();

  const screenX = hitboxX * scale + offsetX;
  const screenY = hitboxY * scale + offsetY;
  const screenW = hitboxW * scale;
  const screenH = hitboxH * scale;

  const imgW = IMG_W * scale;
  const imgH = IMG_H * scale;

  // Hitbox center in screen-space — used as transform origin
  // on the viewport-sized wrapper so scale radiates from the sprite
  const pivotScreenX = screenX + screenW / 2;
  const pivotScreenY = screenY + screenH / 2;

  const handleHoverStart = useCallback(() => {
    spriteControls.start(whileHover);
    onHover?.();
  }, [spriteControls, whileHover, onHover]);

  const handleHoverEnd = useCallback(() => {
    spriteControls.start({ scale: 1 });
    onHoverEnd?.();
  }, [spriteControls, onHoverEnd]);

  const handleTapStart = useCallback(() => {
    spriteControls.start(whileTap);
  }, [spriteControls, whileTap]);

  const handleTapEnd = useCallback(() => {
    spriteControls.start({ scale: 1 });
  }, [spriteControls]);

  return (
    <>
      {/*
        Viewport-sized wrapper handles the scale animation.
        transformOrigin is the hitbox center in screen coords.
        The image inside is positioned with plain CSS — no Framer
        involvement — so it never drifts.
      */}
      <motion.div
        animate={spriteControls}
        className="fixed top-0 left-0 w-screen h-screen pointer-events-none overflow-hidden"
        style={{
          transformOrigin: `${pivotScreenX}px ${pivotScreenY}px`,
          willChange: "transform",
          zIndex,
          visibility: ready ? "visible" : "hidden",
        }}
      >
        <img
          src={src}
          alt={alt}
          aria-hidden={!alt}
          draggable={false}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          className="absolute top-0 left-0 select-none"
          style={{
            width: imgW,
            height: imgH,
            transform: `translate(${offsetX}px, ${offsetY}px)`,
          }}
        />
      </motion.div>

      {/* Invisible hitbox */}
      <motion.button
        onClick={onClick}
        onHoverStart={handleHoverStart}
        onHoverEnd={handleHoverEnd}
        onTapStart={handleTapStart}
        onTap={handleTapEnd}
        onTapCancel={handleTapEnd}
        className="fixed outline-none"
        style={{
          left: screenX,
          top: screenY,
          width: screenW,
          height: screenH,
          transform: `rotate(${rotation}deg)`,
          transformOrigin: "center center",
          zIndex: zIndex + 1,
          visibility: ready ? "visible" : "hidden",
          background: debug ? "rgba(255,0,0,0.2)" : "transparent",
          border: debug ? "2px solid red" : "none",
          touchAction: "manipulation",
          padding: 0,
          cursor: onClick ? "pointer" : "default",
        }}
      />
    </>
  );
}

