"use client";

import { useState, useLayoutEffect } from "react";

const IMG_W = 3300;
const IMG_H = 2550;
const IMG_ASPECT = IMG_W / IMG_H;

function getAdaptiveScale(): number {
  const viewportAspect = window.innerWidth / window.innerHeight;
  const delta = viewportAspect - IMG_ASPECT;
  if (delta <= 0) return 1;
  return Math.max(0.6, 1 - delta * 0.3);
}

function getAdaptiveFocalPoint(): { x: number; y: number } {
  const viewportAspect = window.innerWidth / window.innerHeight;
  const delta = viewportAspect - IMG_ASPECT;

  if (delta <= 0.1) return { x: 0.5, y: 0.5 };
  if (delta <= 0.5) return { x: 0.5, y: 0.75 };
  return { x: 0.5, y: 0.8 };
}

export function useBackgroundCover(
  fix?: { x: number; y: number; scale?: number }
) {
  const [layout, setLayout] = useState({
    scale: 1,
    offsetX: 0,
    offsetY: 0,
    ready: false,
  });

  useLayoutEffect(() => {
    function compute() {
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      const focal = fix ?? getAdaptiveFocalPoint();
      const adaptiveScale = fix?.scale ?? getAdaptiveScale();

      const baseScale = Math.max(vw / IMG_W, vh / IMG_H);
      const scale = baseScale * adaptiveScale;

      const renderedW = IMG_W * scale;
      const renderedH = IMG_H * scale;

      const overflowX = renderedW - vw;
      const overflowY = renderedH - vh;

      setLayout({
        scale,
        offsetX: -overflowX * focal.x,
        offsetY: -overflowY * focal.y,
        ready: true,
      });
    }
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, [fix?.x, fix?.y, fix?.scale]);

  return layout;
}