'use client';

import React, { useEffect, useState } from 'react';
import { Instagram } from 'lucide-react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';
const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);

const About: React.FC = () => {
  const [photoUrl, setPhotoUrl] = useState<string>('');

  useEffect(() => {
    const fetchPhoto = async () => {
      const { data } = supabase.storage
        .from('files')   // bucket name
        .getPublicUrl('photo2.png'); // file path at root

      // if (error) {
      //   console.error('Error fetching photo2:', error);
      //   return;
      // }

      setPhotoUrl(data.publicUrl);
    };

    fetchPhoto();
  }, []);

  return (
    <div className="container" style={{ paddingBottom: '4rem' }}>
      <div style={{ position: 'relative', width: '100%', maxWidth: '1200px', margin: '3rem auto' }}>
        {photoUrl && (
          <img
            src={photoUrl}
            alt="Tutu Shiyun Hou"
            style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '30px' }}
          />
        )}
        <div
          style={{
            position: 'absolute',
            top: '10%',
            left: '8%',
            maxWidth: '40%',
            background: 'rgba(255, 255, 255, 0.9)',
            padding: '2rem',
            borderRadius: '20px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
          }}
        >
          <h2 style={{ marginBottom: '1rem' }}>About Me</h2>
          <p style={{ margin: '1rem 0', lineHeight: '1.6' }}>
            This is TuTu! A human who loves illustration and handmade crafts. I am currently studying Illustration
            and Animation as an undergraduate at Kingston University, London.
          </p>
          <div className="social-links">
            <a
              href="https://www.instagram.com/tutushiyun?igsh=MWFnZmJjaTUwMTJmeg=="
              target="_blank"
              rel="noopener noreferrer"
              className="btn"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Instagram size={20} />
              Follow me on Instagram
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
