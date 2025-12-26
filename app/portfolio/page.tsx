"use client"

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
// import LazyImage from '../components/LazyImage';
import { supabase } from '../../lib/supabase';
import type { FileObject } from '@supabase/storage-js';


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
      // List all first-level folders in the 'portfolio' bucket
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

            const titleImage = images.find(img => img.filename === 'title.png');
            const cover = titleImage ? titleImage.url : images[0].url;

            projectsData[folder.name] = {
              images,
              cover,
              count: images.length - 1
            };
          })
      );

      setProjects(projectsData);
    };

    fetchProjects();
  }, []);

  return (
    <div className="container" style={{ paddingBottom: '4rem' }}>
      <h2 style={{ textAlign: 'center', margin: '3rem 0' }}>My Projects</h2>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '2rem', 
        padding: '2rem 0' 
      }}>
        {Object.entries(projects).map(([projectName, { cover, count }]) => (
          <div 
            key={projectName} 
            className="portfolio-item" 
            onClick={() => router.push(`/portfolio/${projectName}`)}
            style={{ 
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <div style={{ 
              width: '100%', 
              height: '300px', 
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#f5f5f5',
              borderRadius: '20px 20px 0 0'
            }}>
              <img 
                src={cover} 
                alt={projectName}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div style={{ padding: '1.5rem', textAlign: 'center' }}>
              <h3>{projectName.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</h3>
              <p style={{ color: '#888', marginTop: '0.5rem' }}>{count} images</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Portfolio;
