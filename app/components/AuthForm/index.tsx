'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

const AuthForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSignup, setIsSignup] = useState(false);

  // 🔴 DEBUG ONLY
  // const [signupAsAdmin, setSignupAsAdmin] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    if (isSignup) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          // // 🔴 DEBUG ONLY
          // data: signupAsAdmin ? { role: 'admin' } : {},
        },
      });

      if (error) setError(error.message) 
      else {
        router.push('/');
      };
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) setError(error.message)
      else {
        router.push('/');
      };
    }

    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 400, margin: '4rem auto' }}>
      <h2>{isSignup ? 'Sign Up' : 'Log In'}</h2>

      <input
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />

      {/* 🔴 DEBUG ADMIN SIGNUP
      {isSignup && (
        <label style={{ display: 'block', marginTop: '1rem', color: 'red' }}>
          <input
            type="checkbox"
            checked={signupAsAdmin}
            onChange={e => setSignupAsAdmin(e.target.checked)}
          />
          {' '}Sign up as admin (DEBUG ONLY)
        </label>
      )} */}

      <button onClick={handleSubmit} disabled={loading}>
        {loading ? 'Loading...' : isSignup ? 'Create Account' : 'Login'}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <p style={{ marginTop: '1rem' }}>
        {isSignup ? 'Already have an account?' : 'No account yet?'}{' '}
        <button onClick={() => setIsSignup(!isSignup)}>
          {isSignup ? 'Log in' : 'Sign up'}
        </button>
      </p>
    </div>
  );
};

export default AuthForm;
