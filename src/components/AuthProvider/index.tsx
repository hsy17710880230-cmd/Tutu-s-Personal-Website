"use client";

import { supabase, User } from "@/src/lib/supabase";
import { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  user: User | null;
  session: string | null;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setSession(data.session?.access_token ?? null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, sessionData) => {
        setUser(sessionData?.user ?? null);
        setSession(sessionData?.access_token ?? null);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  }

  return (
    <AuthContext.Provider value={{ user, session, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
