'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { ChevronLeft, ChevronRight, ArrowLeft, LayoutGrid, Image as LucideImage } from 'lucide-react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase'; // Using the alias for consistency

interface ProjectImage {
  filename: string;
  url: string;
}

const ProjectDetail: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  // Extract category and decode URL spaces (%20)
  const category = pathname?.split('/').pop()?.replace(/%20/g, ' ') || '';
  
  const [viewMode, setViewMode] = useState<'waterfall' | 'pagination'>('waterfall');
  const [currentPage, setCurrentPage] = useState(0);
  const [projectImages, setProjectImages] = useState<ProjectImage[]>([]);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchProjectImages = async () => {
      if (!category) return;

      const { data: files, error } = await supabase
        .storage
        .from('files')
        .list(category, { limit: 1000 });

      if (error || !files) {
        console.error('Error fetching project files:', error);
        return;
      }

      const images: ProjectImage[] = files
        .filter(file => file.metadata !== null)
        .map(file => ({
          filename: file.name,
          url: supabase.storage.from('files').getPublicUrl(`${category}/${file.name}`).data.publicUrl
        }));
      
      setProjectImages(images);
    };

    fetchProjectImages();
  }, [category]);

  const totalPages = Math.ceil(projectImages.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const currentImages = projectImages.slice(startIndex, startIndex + itemsPerPage);

  const nextPage = () => setCurrentPage(prev => (prev + 1) % totalPages);
  const prevPage = () => setCurrentPage(prev => (prev - 1 + totalPages) % totalPages);

  const handleScreenClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (viewMode !== 'pagination') return;
    const clickX = e.clientX;
    const screenWidth = window.innerWidth;
    if (clickX < screenWidth * 0.3) prevPage();
    else if (clickX > screenWidth * 0.7) nextPage();
  };

  return (
    <div className="container mx-auto px-4 pb-16">
      {/* Navigation Header */}
      <div className="my-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
        <button 
          onClick={() => router.push('/portfolio')} 
          className="flex items-center gap-2 rounded-full bg-black px-6 py-2.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:shadow-md active:scale-95"
        >
          <ArrowLeft size={18} />
          Back to Projects
        </button>

        <div className="flex gap-3">
          <button 
            onClick={() => setViewMode('waterfall')} 
            className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition ${
              viewMode === 'waterfall' 
              ? 'bg-[#FFD1DC] text-[#5D4037]' 
              : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
            }`}
          >
            <LayoutGrid size={18} /> Waterfall
          </button>
          <button 
            onClick={() => setViewMode('pagination')} 
            className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition ${
              viewMode === 'pagination' 
              ? 'bg-[#FFD1DC] text-[#5D4037]' 
              : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
            }`}
          >
            <LucideImage size={18} /> Pagination
          </button>
        </div>
      </div>

      {/* Title */}
      <h2 className="my-8 text-center text-3xl font-bold capitalize text-[#5D4037]">
        {category.replace(/-/g, ' ')}
      </h2>

      {/* Content Area */}
      {viewMode === 'waterfall' ? (
        <div className="columns-1 gap-8 space-y-8 sm:columns-2 lg:columns-3">
          {projectImages.map((item, index) => (
            <div key={index} className="break-inside-avoid overflow-hidden rounded-2xl shadow-sm transition-transform hover:-translate-y-1">
              <Image
                src={item.url}
                alt={item.filename}
                width={500}
                height={500}
                className="h-auto w-full block"
              />
            </div>
          ))}
        </div>
      ) : (
        <div onClick={handleScreenClick} className="min-h-[60vh] cursor-pointer">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {currentImages.map((item, index) => (
              <div key={index} className="overflow-hidden rounded-2xl bg-white shadow-sm transition-transform hover:-translate-y-1">
                <div className="aspect-square relative overflow-hidden">
                  <Image 
                    src={item.url} 
                    alt={item.filename} 
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-8">
              <button 
                onClick={(e) => { e.stopPropagation(); prevPage(); }} 
                className="flex items-center gap-2 rounded-full bg-black px-6 py-2.5 text-sm font-bold text-white transition hover:shadow-md"
              >
                <ChevronLeft size={18} /> Previous
              </button>
              
              <span className="text-lg font-bold text-[#5D4037]">
                Page {currentPage + 1} of {totalPages}
              </span>
              
              <button 
                onClick={(e) => { e.stopPropagation(); nextPage(); }} 
                className="flex items-center gap-2 rounded-full bg-black px-6 py-2.5 text-sm font-bold text-white transition hover:shadow-md"
              >
                Next <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;