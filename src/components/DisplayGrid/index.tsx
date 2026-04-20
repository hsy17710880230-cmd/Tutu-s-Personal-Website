"use client";

import Image from "next/image";
import { useState } from "react";

export type DisplayGridProps = {
  title?: string;
  img_path: string;
  onClick?: () => void;
  hoverEffect?: string;
  imgClass?: string;
  crop?: boolean;
};

const RESPONSIVE_SIZES =
  "(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw";

export default function DisplayGrid({
  title,
  img_path,
  onClick,
  hoverEffect = "hover:scale-105",
  imgClass = "",
  crop = true,
}: DisplayGridProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div
      onClick={onClick}
      className={`w-full cursor-pointer transition-transform ${hoverEffect} ${
        crop ? "" : "break-inside-avoid"
      }`}
    >
      <div className="flex flex-col items-center gap-3">
        <div
          className={`w-full rounded-xl overflow-hidden relative ${
            crop ? "aspect-square" : ""
          }`}
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
              sizes={RESPONSIVE_SIZES}
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
              sizes={RESPONSIVE_SIZES}
              onLoadingComplete={() => setIsLoading(false)}
            />
          )}
        </div>

        {title && <p className="text-center text-lg font-medium">{title}</p>}
      </div>
    </div>
  );
}
