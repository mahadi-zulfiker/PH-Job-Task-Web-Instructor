// src/app/(auth)/login/page.tsx
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { toast } from 'sonner';
import { LoginFormData } from '@/lib/types';
import { Mail, Lock } from "lucide-react"; // Icons for inputs

export default function LoginPage() {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  });
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const response = await api.post('/api/auth/login', formData);
      login(response.data);
      toast.success("Logged in successfully!");
      router.push('/events');
    } catch (err: unknown) {
      let errorMessage = 'Login failed. Please try again.';
      if (err && typeof err === 'object' && 'response' in err && err.response && typeof err.response === 'object' && 'data' in err.response && err.response.data && typeof err.response.data === 'object' && 'message' in err.response.data) {
        // @ts-expect-error: dynamic property access
        errorMessage = err.response.data.message || errorMessage;
      }
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="text-center">
      <h2 className="text-4xl font-extrabold mb-4 text-primary">Welcome Back!</h2> {/* Larger, bolder title */}
      <p className="text-muted-foreground mb-8">Sign in to your Eventify account.</p>

      <form onSubmit={handleSubmit} className="space-y-6"> {/* Increased space */}
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
          <Label htmlFor="email" className="sr-only">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email address"
            required
            className="pl-10 pr-4 py-2" // Space for icon
          />
        </div>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
          <Label htmlFor="password" className="sr-only">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            required
            className="pl-10 pr-4 py-2" // Space for icon
          />
        </div>
        {error && <p className="text-destructive text-sm mt-2">{error}</p>}
        <Button type="submit" className="w-full text-lg py-2 transition-transform hover:scale-[1.01]" disabled={isSubmitting}>
          {isSubmitting ? 'Logging In...' : 'Login'}
        </Button>
      </form>
      <p className="mt-6 text-sm text-muted-foreground">
        Do not have an account?{' '}
        <Link href="/register" className="text-primary hover:underline font-medium">
          Register Here
        </Link>
      </p>
    </div>
  );
}