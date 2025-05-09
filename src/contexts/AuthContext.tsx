
import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '@/data/types';
import { users } from '@/data/mockUsers';

interface AuthContextType {
  currentUser: UserProfile | null;
  login: (email: string, password: string) => Promise<UserProfile>;
  signup: (userData: Omit<UserProfile, 'id' | 'ratingsGiven' | 'partsListed' | 'joinDate'>) => Promise<UserProfile>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setCurrentUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('currentUser');
      }
    }
  }, []);

  // Login function (mock implementation)
  const login = async (email: string, password: string): Promise<UserProfile> => {
    return new Promise((resolve, reject) => {
      // Simulate API call delay
      setTimeout(() => {
        // Find user by email (in a real app, we'd also check password)
        const user = users.find((u) => u.email === email);
        
        if (user) {
          setCurrentUser(user);
          setIsAuthenticated(true);
          localStorage.setItem('currentUser', JSON.stringify(user));
          resolve(user);
        } else {
          reject(new Error('Invalid email or password'));
        }
      }, 1000);
    });
  };

  // Signup function (mock implementation)
  const signup = async (userData: Omit<UserProfile, 'id' | 'ratingsGiven' | 'partsListed' | 'joinDate'>): Promise<UserProfile> => {
    return new Promise((resolve) => {
      // Simulate API call delay
      setTimeout(() => {
        // Create new user with generated ID and default values
        const newUser: UserProfile = {
          ...userData,
          id: `user-${Date.now()}`,
          joinDate: new Date().toISOString(),
          ratingsGiven: 0,
          partsListed: 0
        };

        // In a real app, we would save to a database
        // For now, we'll just log it
        console.log('Created new user:', newUser);
        
        // Set as current user
        setCurrentUser(newUser);
        setIsAuthenticated(true);
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        
        resolve(newUser);
      }, 1000);
    });
  };

  // Logout function
  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, signup, logout, isAuthenticated }}>
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
