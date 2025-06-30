// src/app/(auth)/register/page.tsx
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
import { RegisterFormData } from '@/lib/types';
import { User, Mail, Lock, Image as ImageIcon } from "lucide-react"; // Icons for inputs

export default function RegisterPage() {
  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    password: '',
    photoURL: ''
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
      const response = await api.post('/api/auth/register', formData);
      login(response.data);
      toast.success("Registration successful! Logged in.");
      router.push('/events');
    } catch (err: unknown) {
      if (err && typeof err === "object" && "response" in err && err.response && typeof err.response === "object" && "data" in err.response && err.response.data && typeof err.response.data === "object" && "message" in err.response.data) {
        setError((err.response as { data: { message?: string } }).data.message || 'Registration failed. Please try again.');
        toast.error((err.response as { data: { message?: string } }).data.message || 'Registration failed!');
      } else {
        setError('Registration failed. Please try again.');
        toast.error('Registration failed!');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="text-center">
      <h2 className="text-4xl font-extrabold mb-4 text-primary">Join Eventify!</h2>
      <p className="text-muted-foreground mb-8">Create your account to start managing events.</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
          <Label htmlFor="name" className="sr-only">Name</Label>
          <Input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your Name"
            required
            className="pl-10 pr-4 py-2"
          />
        </div>
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
            className="pl-10 pr-4 py-2"
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
            className="pl-10 pr-4 py-2"
          />
        </div>
        <div className="relative">
          <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
          <Label htmlFor="photoURL" className="sr-only">Photo URL</Label>
          <Input
            id="photoURL"
            name="photoURL"
            type="text"
            value={formData.photoURL}
            onChange={handleChange}
            placeholder="Photo URL (Optional)"
            className="pl-10 pr-4 py-2"
          />
        </div>
        {error && <p className="text-destructive text-sm mt-2">{error}</p>}
        <Button type="submit" className="w-full text-lg py-2 transition-transform hover:scale-[1.01]" disabled={isSubmitting}>
          {isSubmitting ? 'Registering...' : 'Register'}
        </Button>
      </form>
      <p className="mt-6 text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link href="/login" className="text-primary hover:underline font-medium">
          Login Here
        </Link>
      </p>
    </div>
  );
}