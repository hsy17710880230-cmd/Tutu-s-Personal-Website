"use client";

import Image from "next/image";
import { useBackgroundCover } from "@/src/lib/utils";
import { motion, TargetAndTransition } from "framer-motion";

export type LooseSpriteProps = {
  imgX: number;
  imgY: number;
  imgW: number;
  imgH: number;

  src: string;
  alt?: string;

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

  children?: React.ReactNode;
};

export function LooseSprite({
  imgX,
  imgY,
  imgW,
  imgH,
  src,
  alt = "",
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
  children,
}: LooseSpriteProps) {
  const { scale, offsetX, offsetY, ready } = useBackgroundCover(fix);

  return (
    <motion.button
      onClick={onClick}
      onHoverStart={onHover}
      onHoverEnd={onHoverEnd}
      whileHover={whileHover}
      whileTap={whileTap}
      animate={{ rotate: rotation }}
      className="fixed outline-none"
      style={{
        left: imgX * scale + offsetX,
        top: imgY * scale + offsetY,
        width: imgW * scale,
        height: imgH * scale,
        // transform: `rotate(${rotation}deg)`,
        transformOrigin: "center center",
        willChange: "transform",
        zIndex,
        visibility: ready ? "visible" : "hidden",
        background: debug ? "rgba(255,0,0,0.2)" : "transparent",
        border: debug ? "2px solid red" : "none",
        touchAction: "manipulation",
        padding: 0,
        cursor: onClick ? "pointer" : "default",
      }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        style={{ objectFit: "contain", pointerEvents: "none", userSelect: "none" }}
        priority={priority}
        draggable={false}
      />
      {children}
    </motion.button>
  );
}
