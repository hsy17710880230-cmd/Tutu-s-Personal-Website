"use client"

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

const Home = () => {
  const [photoUrl, setPhotoUrl] = useState<string>('');
  
    useEffect(() => {
      const fetchPhoto = async () => {
        const { data } = supabase.storage
          .from('files')   // bucket name
          .getPublicUrl('cover.png'); // file path at root
  
        // if (error) {
        //   console.error('Error fetching photo2:', error);
        //   return;
        // }
  
        setPhotoUrl(data.publicUrl);
      };
  
      fetchPhoto();
    }, []);
  
  return (
    <div className="home">
      <div className="hero" style={{ backgroundImage: `url(${photoUrl})` }}>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>Hi, I'm Tutu</h1>
          <p>Welcome to my creative space.</p>
          <Link href="/portfolio" className="btn">View My Work</Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
