'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import AuthForm from '../components/AuthForm';
import FileManagerInner from './FileManagerInner';

const ADMIN_ROLE = 'admin';

const FileManager = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getUser();
      const user = data.user;

      setUser(user);
      setAuthorized(user?.user_metadata?.role === ADMIN_ROLE);
      setLoading(false);
    };

    init();
  }, []);

  if (loading) return <p>Checking authentication...</p>;
  if (!user) return <AuthForm />;
  if (!authorized) return <p>Access denied. Admins only.</p>;

  return <FileManagerInner />;
};

export default FileManager;
