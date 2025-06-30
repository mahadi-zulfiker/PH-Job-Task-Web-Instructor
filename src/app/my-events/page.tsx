// src/app/my-events/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { api } from '@/lib/utils';

import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { EventData, AddEventFormData } from '@/lib/types'; // Import types
import PrivateRoute from '@/components/ui/PrivateRoute';
import EventCard from '@/components/ui/EventCard';

export default function MyEventsPage() {
  const [myEvents, setMyEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<EventData | null>(null);
  const [updatedFormData, setUpdatedFormData] = useState<AddEventFormData>({
    title: '',
    date: '',
    time: '',
    location: '',
    description: ''
  });

  const fetchMyEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/api/events/my-events'); // Use /api/ prefix
      setMyEvents(response.data);
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err && err.response && typeof err.response === 'object' && 'data' in err.response && err.response.data && typeof err.response.data === 'object' && 'message' in err.response.data) {
        setError((err.response as { data: { message?: string } }).data?.message || 'Failed to fetch your events');
        toast.error((err.response as { data: { message?: string } }).data?.message || 'Failed to fetch your events');
      } else {
        setError('Failed to fetch your events');
        toast.error('Failed to fetch your events');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMyEvents();
    }
  }, [user]);

  const handleDeleteEvent = async (eventId: string) => {
    if (!window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      return;
    }
    try {
      await api.delete(`/api/events/${eventId}`); // Use /api/ prefix
      toast.success('Event deleted successfully!');
      fetchMyEvents(); // Re-fetch events
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err && err.response && typeof err.response === 'object' && 'data' in err.response && err.response.data && typeof err.response.data === 'object' && 'message' in err.response.data) {
        toast.error((err.response as { data: { message?: string } }).data?.message || 'Failed to delete event');
      } else {
        toast.error('Failed to delete event');
      }
    }
  };

  const handleOpenUpdateModal = (event: EventData) => {
    setCurrentEvent(event);
    setUpdatedFormData({
      title: event.title,
      date: event.date.split('T')[0], // Format date for input type="date"
      time: event.time,
      location: event.location,
      description: event.description,
    });
    setIsUpdateModalOpen(true);
  };

  const handleUpdateChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setUpdatedFormData({ ...updatedFormData, [e.target.name]: e.target.value });
  };

  const handleUpdateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentEvent) return;

    try {
      await api.put(`/api/events/${currentEvent._id}`, updatedFormData); // Use /api/ prefix
      toast.success('Event updated successfully!');
      setIsUpdateModalOpen(false);
      fetchMyEvents(); // Re-fetch events
    } catch (err: unknown) {
      if (
        err &&
        typeof err === 'object' &&
        'response' in err &&
        err.response &&
        typeof err.response === 'object' &&
        'data' in err.response &&
        err.response.data &&
        typeof err.response.data === 'object' &&
        'message' in err.response.data
      ) {
        toast.error(
          (err.response as { data: { message?: string } }).data?.message ||
            'Failed to update event'
        );
      } else {
        toast.error('Failed to update event');
      }
    }
  };

  return (
    <PrivateRoute>
      <div className="p-4">
        <h1 className="text-4xl font-bold mb-6 text-center">My Events</h1>
        {loading && <p className="text-center">Loading your events...</p>}
        {error && <p className="text-destructive text-center">{error}</p>}
        {!loading && myEvents.length === 0 && <p className="text-center text-muted-foreground">You have not posted any events yet.</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myEvents.map((event) => (
            <EventCard
              key={event._id}
              event={event}
              onUpdate={handleOpenUpdateModal}
              onDelete={handleDeleteEvent}
              showActions={true}
              currentUserId={user?._id}
            />
          ))}
        </div>

        {/* Update Event Modal */}
        {currentEvent && (
          <Dialog open={isUpdateModalOpen} onOpenChange={setIsUpdateModalOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Update Event</DialogTitle>
                <DialogDescription>
                  Make changes to your event here. Click save when you are done.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleUpdateEvent} className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="updatedTitle" className="text-right">
                    Title
                  </Label>
                  <Input
                    id="updatedTitle"
                    name="title"
                    value={updatedFormData.title}
                    onChange={handleUpdateChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="updatedDate" className="text-right">
                    Date
                  </Label>
                  <Input
                    id="updatedDate"
                    name="date"
                    type="date"
                    value={updatedFormData.date}
                    onChange={handleUpdateChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="updatedTime" className="text-right">
                    Time
                  </Label>
                  <Input
                    id="updatedTime"
                    name="time"
                    type="time"
                    value={updatedFormData.time}
                    onChange={handleUpdateChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="updatedLocation" className="text-right">
                    Location
                  </Label>
                  <Input
                    id="updatedLocation"
                    name="location"
                    value={updatedFormData.location}
                    onChange={handleUpdateChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="updatedDescription" className="text-right">
                    Description
                  </Label>
                  <Textarea
                    id="updatedDescription"
                    name="description"
                    value={updatedFormData.description}
                    onChange={handleUpdateChange}
                    className="col-span-3"
                    rows={4}
                    required
                  />
                </div>
                <DialogFooter>
                  <Button type="submit">Save changes</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </PrivateRoute>
  );
}