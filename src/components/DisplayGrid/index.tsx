"use client";

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
          className="rounded-xl overflow-hidden"
        >
          <img
            src={img_path}
            alt={title ?? ""}
            className={`w-full ${
              crop ? "h-full object-cover" : "h-auto object-contain"
            } ${imgClass}`}
            draggable={false}
          />
        </div>

        {title && (
          <p className="text-center text-lg font-medium">{title}</p>
        )}
      </div>
    </div>
  );
}
