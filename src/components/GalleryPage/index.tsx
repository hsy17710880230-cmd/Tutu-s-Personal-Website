"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import HomeButton from "@/src/components/HomeButton";
import { underline2Capitalized } from "@/src/lib/utils";
import DisplayGrid from "@/src/components/DisplayGrid";

type ProjectData = {
  images: string[];
};

export default function GalleryPage({
  page,
  api,
  title,
}: {
  page: string;
  api?: string;
  title?: boolean;
}) {
  const { project } = useParams();

  const [data, setData] = useState<ProjectData | null>(null);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  useEffect(() => {
    async function loadProject() {
      const res = await fetch(api ?? `/api/${page}/${project}`);
      const json = await res.json();
      setData(json);
    }

    loadProject();
  }, [project, page, api]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setZoomedImage(null);
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  if (!data) return null;

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center pt-24 pb-20 px-4">
      <HomeButton />

      {/* Title */}
      <div className="w-full max-w-7xl mb-12">
        <h1 className="text-3xl md:text-5xl font-bold text-center">
          {underline2Capitalized(project as string)}
        </h1>
      </div>

      {/* Masonry */}
      <div className="w-full max-w-7xl">
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6">
          {data.images.map((src, i) => (
            <DisplayGrid
              key={i}
              img_path={src}
              crop={false}
              hoverEffect="hover:scale-[1.02]"
              onClick={() => setZoomedImage(src)}
            />
          ))}
        </div>
      </div>

      {/* Zoom */}
      {zoomedImage && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center p-6"
          style={{ zIndex: 100 }}
          onClick={() => setZoomedImage(null)}
        >
          <img
            src={zoomedImage}
            alt="preview"
            className="max-w-full max-h-full object-contain"
            draggable={false}
          />
        </div>
      )}
    </div>
  );
}
