"use client";

import { useState, useEffect } from "react";

/**
 * Computes the scale and offset that CSS `bg-cover bg-center` applies to an
 * image with the given natural dimensions. Use this to position/size elements
 * so they stay locked to specific image-space coordinates regardless of the
 * viewport size.
 */
export function useBackgroundCover(imgWidth: number, imgHeight: number) {
  const [metrics, setMetrics] = useState({
    scale: 1,
    offsetX: 0,
    offsetY: 0,
  });

  useEffect(() => {
    function compute() {
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      const scale = Math.max(vw / imgWidth, vh / imgHeight);

      const renderedWidth = imgWidth * scale;
      const renderedHeight = imgHeight * scale;

      const offsetX = (vw - renderedWidth) / 2;
      const offsetY = (vh - renderedHeight) / 2;

      setMetrics({
        scale,
        offsetX,
        offsetY,
      });
    }

    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, [imgWidth, imgHeight]);

  return metrics;
}
