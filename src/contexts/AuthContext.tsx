// src/contexts/AuthContext.tsx
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
// Update the import path below if your types file is located elsewhere
import { UserData } from '../lib/types'; // Import UserData type

interface AuthContextType {
  user: UserData | null;
  login: (userData: UserData) => void;
  logout: () => void;
  isLoading: boolean; // To indicate if initial auth check is in progress
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Tracks initial loading of user from localStorage
  const router = useRouter();

  useEffect(() => {
    // Attempt to load user from localStorage on initial render
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser: UserData = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Failed to parse user from localStorage", error);
        localStorage.removeItem('user'); // Clear corrupted data
      }
    }
    setIsLoading(false); // Done loading
  }, []);

  const login = (userData: UserData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    router.push('/login'); // Redirect to login page after logout
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
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