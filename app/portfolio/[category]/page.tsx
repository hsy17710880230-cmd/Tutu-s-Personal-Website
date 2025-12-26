'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { ChevronLeft, ChevronRight, ArrowLeft, Grid, Image } from 'lucide-react';

import { supabase } from '../../../lib/supabase';

interface ProjectImage {
  filename: string;
  url: string;
}

const ProjectDetail: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname(); // e.g., '/portfolio/my-project'
  const category = pathname?.split('/').pop()?.replace('%20', ' ') || ''; // extract last segment, and url space is %20
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
        .filter(file => file.metadata !== null) // Ensure it's a file
        .map(file => ({
          filename: file.name,
          url: supabase.storage.from('files').getPublicUrl(`${category}/${file.name}`).data.publicUrl
        }));
      console.log('Fetched project images:', images, files);
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
    <div className="container" style={{ paddingBottom: '4rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '2rem 0' }}>
        <button 
          onClick={() => router.push('/portfolio')} 
          className="btn" 
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <ArrowLeft size={20} />
          Back to Projects
        </button>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            onClick={() => setViewMode('waterfall')} 
            className="btn"
            style={{ opacity: viewMode === 'waterfall' ? 1 : 0.5, display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Grid size={20} /> Waterfall
          </button>
          <button 
            onClick={() => setViewMode('pagination')} 
            className="btn"
            style={{ opacity: viewMode === 'pagination' ? 1 : 0.5, display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Image size={20} /> Pagination
          </button>
        </div>
      </div>

      <h2 style={{ textAlign: 'center', margin: '2rem 0' }}>
        {category.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
      </h2>

      {viewMode === 'waterfall' ? (
        <div className="portfolio-grid">
          {projectImages.map((item, index) => (
            <div key={index} className="portfolio-item">
              <div className="portfolio-img">
                <img src={item.url} alt={item.filename} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div onClick={handleScreenClick} style={{ cursor: 'pointer', minHeight: '60vh' }}>
          <div className="portfolio-grid">
            {currentImages.map((item, index) => (
              <div key={index} className="portfolio-item">
                <div className="portfolio-img">
                  <img src={item.url} alt={item.filename} />
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '2rem', marginTop: '2rem' }}>
              <button onClick={(e) => { e.stopPropagation(); prevPage(); }} className="btn" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ChevronLeft size={20} /> Previous
              </button>
              <span style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>
                Page {currentPage + 1} of {totalPages}
              </span>
              <button onClick={(e) => { e.stopPropagation(); nextPage(); }} className="btn" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                Next <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;
