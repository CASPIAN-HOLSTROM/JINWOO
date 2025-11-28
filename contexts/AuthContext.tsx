import { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, username: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: true,
  signUp: async () => ({ error: null }),
  signIn: async () => ({ error: null }),
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      (async () => {
        setSession(session);
        setUser(session?.user ?? null);
      })();
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, username: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error || !data.user) {
      return { error };
    }

    const { error: profileError } = await supabase.from('hunters').insert({
      id: data.user.id,
      username,
      level: 1,
      current_xp: 0,
      total_xp: 0,
      rank: 'E',
      current_streak: 0,
      longest_streak: 0,
      penalty_mode: false,
    });

    if (profileError) {
      return { error: profileError };
    }

    await supabase.from('hunter_stats').insert({
      hunter_id: data.user.id,
      strength: 10,
      intelligence: 10,
      willpower: 10,
      discipline: 10,
      endurance: 10,
    });

    const { data: reawakened } = await supabase
      .from('titles')
      .select('id')
      .eq('name', 'The Reawakened One')
      .maybeSingle();

    if (reawakened) {
      await supabase.from('hunter_titles').insert({
        hunter_id: data.user.id,
        title_id: reawakened.id,
        is_active: true,
      });
    }

    return { error: null };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ session, user, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
