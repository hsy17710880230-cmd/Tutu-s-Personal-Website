'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import type { User } from '@supabase/supabase-js';

const AuthForm = () => {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSignup, setIsSignup] = useState(false);

  const upsertProfile = async (user: User) => {
    const { error } = await supabase
      .from('profiles')
      .upsert(
        {
          id: user.id,
          last_login: new Date().toISOString(),
        },
        { onConflict: 'id' }
      );

    if (error) throw error;
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      if (isSignup) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;
        if (!data.user) throw new Error('Signup failed');

        await upsertProfile(data.user);
        router.push('/upload');
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        if (!data.user) throw new Error('Login failed');

        await upsertProfile(data.user);
        router.push('/upload');
      }
    } catch (err) {
      setError((err as Error).message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full mx-auto max-w-md px-4 text-center">
      <div className="w-full max-w-md rounded-2xl bg-transparent p-8 text-center">
        <h1 className="text-2xl font-semibold">
          {isSignup ? 'Create an account' : 'Welcome back'}
        </h1>

        <p className="mt-2 text-sm text-gray-600">
          If you need admin privileges, please contact the site administrator.
        </p>

        <div className="mt-6 space-y-4">
          <input
            type="email"
            placeholder="Email"
            maxLength={254}
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white/80 px-4 py-3 text-sm focus:border-black focus:outline-none focus:ring-0"
          />

          <input
            type="password"
            placeholder="Password"
            maxLength={72}
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white/80 px-4 py-3 text-sm focus:border-black focus:outline-none focus:ring-0"
          />

          {error && (
            <p className="text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full btn"
          >
            {loading
              ? 'Please wait…'
              : isSignup
              ? 'Create Account'
              : 'Log In'}
          </button>
        </div>

        <div className="mt-6 text-sm text-gray-600">
          {isSignup ? 'Already have an account?' : 'No account yet?'}{' '}
          <button
            onClick={() => setIsSignup(!isSignup)}
            className="btn"
          >
            {isSignup ? 'Log in' : 'Sign up'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
