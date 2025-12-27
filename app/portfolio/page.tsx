'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase'; // Adjusted path to @/lib usually preferred in Next.js
import type { FileObject } from '@supabase/storage-js';
import Image from 'next/image';

interface ProjectImage {
  filename: string;
  url: string;
}

interface Project {
  images: ProjectImage[];
  cover: string;
  count: number;
}

const Portfolio: React.FC = () => {
  const router = useRouter();
  const [projects, setProjects] = useState<Record<string, Project>>({});

  useEffect(() => {
    const fetchProjects = async () => {
      // List all first-level folders in the 'files' bucket
      const { data: folders, error: foldersError } = await supabase
        .storage
        .from('files')
        .list('', { limit: 100, offset: 0 }) as { data: FileObject[] | null, error: unknown };

      if (foldersError || !folders) {
        console.error('Error fetching folders:', foldersError);
        return;
      }
      console.log('Fetched folders:', folders);

      const projectsData: Record<string, Project> = {};

      await Promise.all(
        folders
          .filter(folder => folder.metadata === null) // Ensure it's a folder
          .map(async (folder) => {
            const { data: files, error: filesError } = await supabase
              .storage
              .from('files')
              .list(folder.name, { limit: 100, offset: 0 }) as { data: FileObject[] | null, error: unknown };

            if (filesError || !files || files.length === 0) return;

            const images: ProjectImage[] = files.map(file => ({
              filename: file.name.toLowerCase(),
              url: supabase.storage.from('files').getPublicUrl(`${folder.name}/${file.name}`).data.publicUrl
            }));

            // Find title.png or default to the first image
            const titleImage = images.find(img => img.filename === 'title.png');
            const cover = titleImage ? titleImage.url : images[0].url;

            projectsData[folder.name] = {
              images,
              cover,
              count: images.length - 1 // Excluding title image logic if applicable
            };
          })
      );

      setProjects(projectsData);
    };

    fetchProjects();
  }, []);

  return (
    <div className="container mx-auto px-4 pb-16">
      <h2 className="my-12 text-center text-3xl font-bold text-gray-800">
        My Projects
      </h2>
      
      {/* Grid Container */}
      <div className="grid grid-cols-1 gap-8 py-8 sm:grid-cols-2 lg:grid-cols-3">
        {Object.entries(projects).map(([projectName, { cover, count }]) => (
          <div
            key={projectName}
            onClick={() => router.push(`/portfolio/${projectName}`)}
            className="group flex cursor-pointer flex-col overflow-hidden rounded-[20px] bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-lg"
          >
            {/* Image Wrapper */}
            <div className="flex h-[300px] w-full items-center justify-center overflow-hidden bg-gray-100">
              <Image
                src={cover}
                alt={projectName}
                width={500}
                height={500}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            
            {/* Content Wrapper */}
            <div className="p-6 text-center">
              <h3 className="text-xl font-bold text-gray-800">
                {projectName.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
              </h3>
              <p className="mt-2 text-sm font-medium text-gray-500">
                {count} images
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Portfolio;