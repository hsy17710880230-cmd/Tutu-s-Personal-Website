"use client";

import { useState, useLayoutEffect, useCallback } from "react";
import { motion, useAnimation, TargetAndTransition } from "framer-motion";
import { IMG_H, IMG_W, useBackgroundCover } from "@/src/lib/utils";

export function SceneContainer({
  children,
  bgColor = "#000000",
}: {
  children: React.ReactNode;
  bgColor?: string;
}) {
  return (
    <div className="fixed inset-0" style={{ backgroundColor: bgColor }}>
      {children}
    </div>
  );
}

export function CoverLayer({
  src,
  alt = "",
  zIndex = 0,
  fix,
  className = "",
}: {
  src: string;
  alt?: string;
  zIndex?: number;
  fix?: { x: number; y: number; scale?: number };
  className?: string;
}) {
  const { scale, offsetX, offsetY, ready } = useBackgroundCover(fix);

  return (
    <img
      src={src}
      alt={alt}
      aria-hidden={!alt}
      draggable={false}
      className={`fixed top-0 left-0 pointer-events-none select-none ${className}`}
      style={{
        width: IMG_W * scale,
        height: IMG_H * scale,
        transform: `translate(${offsetX}px, ${offsetY}px)`,
        zIndex,
        visibility: ready ? "visible" : "hidden",
      }}
    />
  );
}

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
  fix?: { x: number; y: number; scale?: number };

  whileHover?: TargetAndTransition;
  whileTap?: TargetAndTransition;

  onClick?: () => void;
  onHover?: () => void;
  onHoverEnd?: () => void;
};

export default function FloatingSprite({
  src,
  alt = "",
  hitboxX,
  hitboxY,
  hitboxW,
  hitboxH,
  rotation = 0,
  zIndex = 10,
  debug = false,
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

  // Hitbox center in screen-space
  const pivotScreenX = screenX + screenW / 2;
  const pivotScreenY = screenY + screenH / 2;

  // Transform origin as pixel values relative to the wrapper's top-left (0,0)
  // The wrapper is fixed at 0,0 and sized to the viewport,
  // so screen coords are directly usable
  const originPx = `${pivotScreenX}px ${pivotScreenY}px`;

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

  const handleTap = useCallback(() => {
    spriteControls.start({ scale: 1 });
  }, [spriteControls]);

  return (
    <>
      {/*
        Wrapper div: fixed at 0,0, covers full viewport.
        transformOrigin is the hitbox center in screen-space.
        When Framer scales this div, it zooms from the hitbox pivot
        but the image inside stays at its normal fullscreen position.
      */}
      <motion.div
        animate={spriteControls}
        className="fixed top-0 left-0 w-screen h-screen pointer-events-none"
        style={{
          transformOrigin: originPx,
          zIndex,
          visibility: ready ? "visible" : "hidden",
        }}
      >
        <img
          src={src}
          alt={alt}
          aria-hidden={!alt}
          draggable={false}
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
        onTap={handleTap}
        onTapCancel={handleTap}
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