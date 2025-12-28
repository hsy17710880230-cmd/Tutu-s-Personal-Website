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

          {/* Info Card INSIDE image */}
          <div
            className="
              absolute
              left-6
              top-6
              max-w-80
              rounded-2xl
              bg-white/90
              p-6
              shadow-lg
              backdrop-blur
              sm:left-10
              sm:top-10
              sm:p-8
            "
          >
            <h2 className="text-2xl font-bold text-gray-900">
              About Me
            </h2>

            <p className="mt-4 text-sm leading-relaxed text-gray-700">
              This is TuTu! A human who loves illustration and handmade crafts.
              I am currently studying Illustration and Animation as an
              undergraduate at Kingston University, London.
            </p>

            <a
              href="https://www.instagram.com/tutushiyun?igsh=MWFnZmJjaTUwMTJmeg=="
              target="_blank"
              rel="noopener noreferrer"
              className="
                mt-6
                inline-flex
                items-center
                gap-2
                rounded-full
                bg-pink-200
                px-6
                py-3
                text-sm
                font-semibold
                text-gray-800
                transition
                hover:-translate-y-0.5
                hover:shadow-md
              "
            >
              <Instagram size={18} />
              Follow me on Instagram
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
