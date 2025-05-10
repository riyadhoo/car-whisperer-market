
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/data/types';

interface AuthContextType {
  currentUser: UserProfile | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: SignupData) => Promise<void>;
  logout: () => Promise<void>;
}

interface SignupData {
  email: string;
  password: string;
  name: string;
  isDealer?: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Set up the auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setIsAuthenticated(!!session);
        
        // Get user data if session exists
        if (session?.user) {
          try {
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();
              
            if (profile) {
              setCurrentUser({
                id: profile.id,
                name: profile.name,
                email: profile.email,
                avatar: profile.avatar_url,
                type: profile.is_dealer ? 'Shop' : 'Individual',
                bio: profile.bio,
                location: profile.location,
                website: profile.website,
                phone: profile.phone,
                joinDate: profile.join_date,
                ratingsGiven: profile.ratings_given,
                partsListed: profile.parts_listed
              });
            }
          } catch (error) {
            console.error("Error fetching user profile:", error);
          }
        } else {
          setCurrentUser(null);
        }
        
        setIsLoading(false);
      }
    );

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setIsAuthenticated(!!session);
        
        // Get user data if session exists
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          if (profile) {
            setCurrentUser({
              id: profile.id,
              name: profile.name,
              email: profile.email,
              avatar: profile.avatar_url,
              type: profile.is_dealer ? 'Shop' : 'Individual',
              bio: profile.bio,
              location: profile.location,
              website: profile.website,
              phone: profile.phone,
              joinDate: profile.join_date,
              ratingsGiven: profile.ratings_given,
              partsListed: profile.parts_listed
            });
          }
        }
      } catch (error) {
        console.error("Error getting initial session:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getInitialSession();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }
    } catch (error: any) {
      console.error("Error during login:", error.message);
      throw error;
    }
  };

  const signup = async ({ email, password, name, isDealer = false }: SignupData) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            is_dealer: isDealer
          }
        }
      });

      if (error) {
        throw error;
      }
    } catch (error: any) {
      console.error("Error during signup:", error.message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      setCurrentUser(null);
      setSession(null);
      setIsAuthenticated(false);
    } catch (error: any) {
      console.error("Error during logout:", error.message);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        session,
        isAuthenticated,
        isLoading,
        login,
        signup,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
