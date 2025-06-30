// src/components/PrivateRoute.tsx
"use client";

import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only redirect if not loading AND user is null (not logged in)
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  // Show a loading indicator while checking auth status, or if user is null (redirecting)
  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
        Loading or redirecting...
      </div>
    );
  }

  // If authenticated and not loading, render children
  return <>{children}</>;
};

export default PrivateRoute;