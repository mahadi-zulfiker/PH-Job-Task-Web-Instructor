// src/app/(auth)/layout.tsx
import React from 'react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Background with a subtle gradient or pattern, min-h-screen to cover full height
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-gradient-to-br from-primary/10 to-background"> {/* Added gradient */}
      <div className="w-full max-w-md p-8 space-y-6 bg-card shadow-2xl rounded-lg border border-primary/20 transform transition-all duration-300 hover:shadow-primary/30"> {/* More prominent shadow and border */}
        {children}
      </div>
    </div>
  );
}