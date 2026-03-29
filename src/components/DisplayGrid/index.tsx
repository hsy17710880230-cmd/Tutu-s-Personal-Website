"use client";

import Image from "next/image";
import { useState } from "react";

export type DisplayGridProps = {
  title?: string;
  img_path: string;
  onClick?: () => void;
  hoverEffect?: string;
  imgClass?: string;
  displaySize?: number;
  crop?: boolean;
};

export default function DisplayGrid({
  title,
  img_path,
  onClick,
  hoverEffect = "hover:scale-105",
  imgClass = "",
  displaySize = 256,
  crop = true,
}: DisplayGridProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div
      onClick={onClick}
      className={`cursor-pointer transition-transform ${hoverEffect} ${
        crop ? "" : "break-inside-avoid"
      }`}
      style={!crop ? { width: displaySize } : undefined}
    >
      <div className="flex flex-col items-center gap-3">
        <div
          style={
            crop
              ? { width: displaySize, height: displaySize }
              : { width: displaySize }
          }
          className={`rounded-xl overflow-hidden relative`}
        >
          {/* Skeleton placeholder */}
          {isLoading && (
            <div
              className={`absolute inset-0 animate-pulse bg-gray-300 dark:bg-gray-700`}
            />
          )}

          {crop ? (
            <Image
              src={img_path}
              alt={title ?? ""}
              fill
              className={`object-cover ${imgClass} ${isLoading ? "opacity-0" : "opacity-100"} transition-opacity`}
              draggable={false}
              sizes={`${displaySize}px`}
              onLoadingComplete={() => setIsLoading(false)}
            />
          ) : (
            <Image
              src={img_path}
              alt={title ?? ""}
              width={800}
              height={600}
              className={`w-full h-auto object-contain ${imgClass} ${isLoading ? "opacity-0" : "opacity-100"} transition-opacity`}
              draggable={false}
              sizes={`${displaySize}px`}
              onLoadingComplete={() => setIsLoading(false)}
            />
          )}
        </div>

        {title && <p className="text-center text-lg font-medium">{title}</p>}
      </div>
    </div>
  );
}
