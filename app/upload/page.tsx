'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';
import FileManagerInner from './FileManagerInner';
import { useRouter } from 'next/navigation';

const ADMIN_ROLE = 'admin';
const MAX_AGE_HOURS = 24;

export default function FileManager() {
  const [user, setUser] = useState<User | null>(null);
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace('/auth');
        return;
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('last_login, role')
        .eq('id', user.id)
        .single();

      if (error || !profile?.last_login) {
        await supabase.auth.signOut();
        router.replace('/auth');
        return;
      }

      const expired =
        Date.now() - new Date(profile.last_login).getTime() >
        MAX_AGE_HOURS * 60 * 60 * 1000;

      if (expired) {
        await supabase.auth.signOut();
        router.replace('/auth');
        return;
      }

      setUser(user);
      setAuthorized(profile.role === ADMIN_ROLE);
      setLoading(false);
    };

    init();
  }, [router]);

  /* -------------------- UI STATES -------------------- */

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-sm text-gray-500">Checking authentication…</p>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-4 text-center">
          <p className="text-sm font-medium text-red-700">
            🚫 Access denied
          </p>
          <p className="mt-1 text-xs text-red-600">
            This section is restricted to administrators.
          </p>
        </div>
      </div>
    );
  }

  return (
    <section className="w-full max-w-6xl px-6 py-8">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">File Manager</h1>
          <p className="text-sm text-gray-500">
            Manage uploaded files and storage
          </p>
        </div>

        <button
          onClick={async () => {
            await supabase.auth.signOut();
            router.push('/auth');
          }}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-100"
        >
          Sign out
        </button>
      </header>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <FileManagerInner />
      </div>
    </section>
  );
}
