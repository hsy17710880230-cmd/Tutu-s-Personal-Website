"use client";

import { useRouter } from "next/navigation";
import HomeButton from "@/src/components/HomeButton";
import DisplayGrid from "@/src/components/DisplayGrid";
import { useEffect, useState } from "react";
import { underline2Capitalized } from "@/src/lib/utils";

type Project = {
  title: string;
  img_path: string;
};

export default function ProjectPage({
  page,
  api,
  title = true,
  layout = "masonry",
}: {
  page: string;
  api?: string;
  title?: boolean;
  layout?: "grid" | "masonry";
}) {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    async function loadProjects() {
      try {
        const res = await fetch(api ?? `/api/${page}`);
        const data = await res.json();
        setProjects(data);
      } catch (err) {
        console.error(err);
      }
    }

    loadProjects();
  }, [api, page]);

  return (
    <div className="relative w-full min-h-screen flex flex-col">
      <HomeButton />

      <div className="flex flex-1 flex-col items-center justify-center px-4 md:px-6 py-24">
        {/* Title */}
        <div className="w-full max-w-7xl mb-10 md:mb-16">
          <h1 className="text-3xl md:text-5xl font-bold text-center">
            {underline2Capitalized(page)}
          </h1>
        </div>

        {/* Content */}
        <div className="w-full max-w-7xl">
          {layout === "grid" ? (
            <div
              className="
              grid
              grid-cols-1
              sm:grid-cols-2
              md:grid-cols-3
              lg:grid-cols-4
              gap-6 md:gap-10
              justify-items-center
            "
            >
              {projects.map((it) => (
                <DisplayGrid
                  key={it.title}
                  title={title ? underline2Capitalized(it.title) : ""}
                  img_path={it.img_path}
                  onClick={() => router.push(`/${page}/${it.title}`)}
                  displaySize={256}
                  crop
                />
              ))}
            </div>
          ) : (
            <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6">
              {projects.map((it) => (
                <DisplayGrid
                  key={it.title}
                  title=""
                  img_path={it.img_path}
                  crop={false}
                  hoverEffect="hover:scale-[1.02]"
                  onClick={() => router.push(`/${page}/${it.title}`)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

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
