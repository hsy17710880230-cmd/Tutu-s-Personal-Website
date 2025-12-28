'use client';

import React, { useEffect, useState } from 'react';
import { Instagram } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';

export default function About() {
  const [photoUrl, setPhotoUrl] = useState<string>('');

  useEffect(() => {
    const fetchPhoto = async () => {
      const { data } = supabase.storage
        .from('files')
        .getPublicUrl('photo2.jpg');

      setPhotoUrl(data.publicUrl);
    };

    fetchPhoto();
  }, []);

  return (
    <main className="mx-auto max-w-7xl px-6 pb-24">
      <section className="relative mx-auto mt-16 max-w-6xl">
        {/* Image Container */}
        <div className="relative overflow-hidden rounded-3xl">
          {photoUrl && (
            <Image
              src={photoUrl}
              alt="Tutu Shiyun Hou"
              width={1600}
              height={1000}
              className="h-auto w-full object-cover"
              priority
            />
          )}
        </div>

        {/* Info Card */}
        <div
          className="
            mx-auto
            mt-6
            max-w-[320px]
            rounded-2xl
            bg-white/90
            p-4
            shadow-lg
            backdrop-blur

            sm:absolute
            sm:left-6
            sm:top-6
            sm:mt-0
            sm:max-w-80
            sm:p-6

            md:left-10
            md:top-10
            md:p-8
          "
        >
          <h2 className="text-lg font-bold text-gray-900 sm:text-xl md:text-2xl">
            About Me
          </h2>

          <p className="mt-3 text-xs leading-relaxed text-gray-700 sm:mt-4 sm:text-sm">
            This is TuTu! A human who loves illustration and handmade crafts.
            I am currently studying Illustration and Animation as an
            undergraduate at Kingston University, London.
          </p>

          <a
            href="https://www.instagram.com/tutushiyun?igsh=MWFnZmJjaTUwMTJmeg=="
            target="_blank"
            rel="noopener noreferrer"
            className="
              mt-4
              inline-flex
              items-center
              gap-2
              rounded-full
              bg-pink-200
              px-4
              py-2
              text-xs
              font-semibold
              text-gray-800
              transition
              hover:-translate-y-0.5
              hover:shadow-md

              sm:mt-6
              sm:px-6
              sm:py-3
              sm:text-sm
            "
          >
            <Instagram size={16} className="sm:hidden" />
            <Instagram size={18} className="hidden sm:block" />
            Follow me on Instagram
          </a>
        </div>
      </section>
    </main>
  );
}
