
import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, username: string, phoneNumber?: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to clean up auth state
const cleanupAuthState = () => {
  // Remove standard auth tokens
  localStorage.removeItem('supabase.auth.token');
  // Remove all Supabase auth keys from localStorage
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      localStorage.removeItem(key);
    }
  });
  // Remove from sessionStorage if in use
  Object.keys(sessionStorage || {}).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      sessionStorage.removeItem(key);
    }
  });
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let hasShownWelcomeToast = false;

    // Set up the subscription first
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, currentSession) => {
      console.log('Auth event:', event, 'Has shown toast:', hasShownWelcomeToast);
      
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      // Only show welcome toast on SIGNED_IN event and only once per auth flow
      if (event === 'SIGNED_IN' && currentSession?.user && !hasShownWelcomeToast) {
        // Check if this is from a programmatic sign-in (not session restoration)
        const isFromSignIn = localStorage.getItem('auth_sign_in_triggered') === 'true';
        
        if (isFromSignIn) {
          toast({
            title: "Welcome back!",
            description: "You have successfully signed in."
          });
          hasShownWelcomeToast = true;
          localStorage.removeItem('auth_sign_in_triggered');
        }
      }
      
      // Clear flags on sign out
      if (event === 'SIGNED_OUT') {
        hasShownWelcomeToast = false;
        localStorage.removeItem('auth_sign_in_triggered');
        Object.keys(localStorage).forEach((key) => {
          if (key.startsWith('welcome_toast_')) {
            localStorage.removeItem(key);
          }
        });
      }
    });

    // Then get the current session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []); // Remove justSignedIn from dependencies

  const signUp = async (email: string, password: string, username: string, phoneNumber?: string): Promise<void> => {
    try {
      // Clean up existing state
      cleanupAuthState();
      
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            username,
            phone_number: phoneNumber,
          }
        }
      });
      
      if (error) throw error;
      
      // If user is created, create profile entry
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            username,
            phone_number: phoneNumber,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
          
        if (profileError) {
          console.error("Profile creation error:", profileError);
          // Don't throw here as the user account was created successfully
        }
      }
      
      toast({
        title: "Account created",
        description: "Please check your email to confirm your registration."
      });
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message
      });
      throw error;
    }
  };

  const signIn = async (email: string, password: string): Promise<void> => {
    try {
      // Clean up existing state
      cleanupAuthState();
      
      // Try global sign out first
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
      }
      
      // Set flag to indicate this is a programmatic sign-in
      localStorage.setItem('auth_sign_in_triggered', 'true');
      
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        localStorage.removeItem('auth_sign_in_triggered');
        throw error;
      }
      
      // Force page reload for clean state
      window.location.href = "/";
    } catch (error: any) {
      localStorage.removeItem('auth_sign_in_triggered');
      toast({
        title: "Sign in failed",
        description: error.message
      });
      throw error;
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      // Clean up auth state
      cleanupAuthState();
      
      // Clear welcome toast flags
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('welcome_toast_') || key === 'auth_sign_in_triggered') {
          localStorage.removeItem(key);
        }
      });
      
      // Attempt global sign out
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      if (error) throw error;
      
      // Force page reload for a clean state
      window.location.href = "/login";
    } catch (error: any) {
      toast({
        title: "Sign out failed",
        description: error.message
      });
      throw error;
    }
  };

  const value = {
    session,
    user,
    loading,
    signUp,
    signIn,
    signOut,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
