"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

const Home = () => {
  const [photoUrl, setPhotoUrl] = useState<string>('');

  useEffect(() => {
    const fetchPhoto = async () => {
      const { data } = supabase.storage
        .from('files') 
        .getPublicUrl('cover.png');

      setPhotoUrl(data.publicUrl);
    };

    fetchPhoto();
  }, []);

  return (
    <div className="w-full px-4 py-12 md:px-10">
      {/* Hero Container */}
      <section 
        className="relative flex min-h-[80vh] items-center justify-center overflow-hidden rounded-[50px] bg-gray-200 bg-cover bg-center shadow-inner"
        style={{ backgroundImage: `url(${photoUrl})` }}
      >
        {/* Hero Overlay (Softens the background image) */}
        <div className="absolute inset-0 bg-white/30 backdrop-blur-[2px]"></div>

        {/* Hero Content Card */}
        <div className="relative z-10 mx-4 w-full max-w-2xl rounded-[30px] bg-white/80 p-8 text-center shadow-xl backdrop-blur-md md:p-16">
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-[#5D4037] md:text-6xl">
            Hi, I'm Tutu
          </h1>
          <p className="mb-8 text-lg text-[#5D4037]/80 md:text-xl">
            Welcome to my creative space.
          </p>
          <Link 
            href="/portfolio" 
            className="inline-block rounded-full bg-[#FFD1DC] px-8 py-4 text-lg font-bold text-[#5D4037] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg active:scale-95"
          >
            View My Work
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;