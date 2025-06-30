// src/app/add-event/page.tsx
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';// Import type
import { AddEventFormData } from '@/lib/types';
import PrivateRoute from '@/components/ui/PrivateRoute';

export default function AddEventPage() {
  const [formData, setFormData] = useState<AddEventFormData>({
    title: '',
    date: '',
    time: '',
    location: '',
    description: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!formData.title || !formData.date || !formData.time || !formData.location || !formData.description) {
      setError('Please fill in all required fields.');
      setLoading(false);
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      await api.post('/api/events', formData); // Use /api/ prefix
      toast.success('Event added successfully!');
      router.push('/my-events'); // Redirect to my events page
    } catch (err: unknown) {
      let message = 'Failed to add event';
      if (err && typeof err === 'object' && 'response' in err && err.response && typeof err.response === 'object' && 'data' in err.response && err.response.data && typeof err.response.data === 'object' && 'message' in err.response.data) {
        // @ts-expect-error: dynamic error shape from axios or fetch
        message = err.response.data.message || message;
      }
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PrivateRoute>
      <div className="p-4 max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-center">Add New Event</h1>
        <form onSubmit={handleSubmit} className="space-y-6 bg-card p-6 rounded-lg shadow-md">
          <div>
            <Label htmlFor="title">Event Title</Label>
            <Input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                name="time"
                type="time"
                value={formData.time}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              name="location"
              type="text"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={5}
              required
            />
          </div>
          {error && <p className="text-destructive text-sm">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Adding Event...' : 'Add Event'}
          </Button>
        </form>
      </div>
    </PrivateRoute>
  );
}