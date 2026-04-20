"use client";

import { useEffect, useState } from "react";
import TitleWithNav from "../Title";
import DisplayGrid from "../DisplayGrid";

type FolderData = {
  folder: string;
  images: string[];
};

export default function FolderArchivePage({
  api = "/api/illustration/archive",
  page = "Illustrations",
}: {
  api?: string;
  page?: string;
}) {
  const [data, setData] = useState<FolderData[]>([]);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      const res = await fetch(api);
      const json = await res.json();
      setData(json);
    }

    loadData();
  }, [api]);

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center pt-24 pb-20 px-4">

      {/* <HomeButton />
      <BackButton/> */}
      <TitleWithNav project={page}/>
      

      <div className="w-full max-w-7xl">
        {data.map((section) => (
          <div key={section.folder} className="mb-20">

            {/* Folder Header */}
            <div className="flex items-center gap-6 mb-10">
              <h2 className="text-2xl md:text-4xl font-bold">
                {section.folder.replaceAll("_", " ")}
              </h2>

              <div className="flex-1 h-[3px] bg-gradient-to-r from-pink-300 via-yellow-200 to-blue-200 rounded-full"></div>
            </div>


            {/* Waterfall Layout */}
            <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6">
              {section.images.map((src, i) => (
                <DisplayGrid
                  key={i}
                  img_path={src}
                  onClick={() => setZoomedImage(src)}
                  crop={false}
                  hoverEffect="hover:scale-[1.02]"
                  imgClass="transition-transform"
                />
              ))}
            </div>


          </div>
        ))}
      </div>

      {/* Zoom Preview */}
      {zoomedImage && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center p-6"
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

      {/* Background */}
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/assets/bg.png')",
        }}
      />
    </div>
  );
}
