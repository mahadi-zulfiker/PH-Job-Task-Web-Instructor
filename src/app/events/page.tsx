// src/app/events/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { api } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { EventData } from '@/lib/types';
import PrivateRoute from '@/components/ui/PrivateRoute';
import EventCard from '@/components/ui/EventCard';

export default function EventsPage() {
  const [events, setEvents] = useState<EventData[]>([]);
  const [searchTitle, setSearchTitle] = useState('');
  // Initialize with 'all' or 'none' instead of empty string
  const [filterDate, setFilterDate] = useState('all'); // Changed to 'all'
  const [filterDateRange, setFilterDateRange] = useState('all'); // Changed to 'all'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (searchTitle) params.append('title', searchTitle);
      // Only append if it's not 'all'
      if (filterDate !== 'all') params.append('date', filterDate);
      if (filterDateRange !== 'all') params.append('dateRange', filterDateRange);

      const response = await api.get(`/api/events?${params.toString()}`);
      setEvents(response.data);
    } catch (err: unknown) {
      if (
        typeof err === 'object' &&
        err !== null &&
        'response' in err &&
        typeof (err as { response?: { data?: { message?: string } } }).response === 'object'
      ) {
        const errorResponse = err as { response?: { data?: { message?: string } } };
        setError(errorResponse.response?.data?.message || 'Failed to fetch events');
        toast.error(errorResponse.response?.data?.message || 'Failed to fetch events');
      } else {
        setError('Failed to fetch events');
        toast.error('Failed to fetch events');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [searchTitle, filterDate, filterDateRange]);

  const handleJoinEvent = async (eventId: string) => {
    if (!user) {
      toast.error("Please login to join an event.");
      return;
    }
    try {
      await api.put(`/api/events/join/${eventId}`);
      toast.success("Successfully joined event!");
      fetchEvents();
    } catch (err: unknown) {
      if (
        typeof err === 'object' &&
        err !== null &&
        'response' in err &&
        typeof (err as { response?: { data?: { message?: string } } }).response === 'object'
      ) {
        const errorResponse = err as { response?: { data?: { message?: string } } };
        toast.error(errorResponse.response?.data?.message || 'Failed to join event');
      } else {
        toast.error('Failed to join event');
      }
    }
  };

  return (
    <PrivateRoute>
      <div className="p-4">
        <h1 className="text-4xl font-bold mb-6 text-center">All Events</h1>

        <div className="mb-6 flex flex-wrap gap-4 items-center justify-center">
          <Input
            placeholder="Search by title..."
            value={searchTitle}
            onChange={(e) => setSearchTitle(e.target.value)}
            className="w-full md:w-auto max-w-sm"
          />

          <Select onValueChange={setFilterDate} value={filterDate}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filter by Date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">No Date Filter</SelectItem> {/* Changed value to "all" */}
              <SelectItem value="today">Today</SelectItem>
            </SelectContent>
          </Select>

          <Select onValueChange={setFilterDateRange} value={filterDateRange}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filter by Date Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">No Date Range</SelectItem> {/* Changed value to "all" */}
              <SelectItem value="currentWeek">Current Week</SelectItem>
              <SelectItem value="lastWeek">Last Week</SelectItem>
              <SelectItem value="currentMonth">Current Month</SelectItem>
              <SelectItem value="lastMonth">Last Month</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={fetchEvents}>Apply Filters</Button>
          {/* Update clear filters logic to set to 'all' */}
          <Button variant="outline" onClick={() => { setSearchTitle(''); setFilterDate('all'); setFilterDateRange('all'); }}>Clear Filters</Button>
        </div>

        {loading && <p className="text-center">Loading events...</p>}
        {error && <p className="text-destructive text-center">{error}</p>}

        {!loading && events.length === 0 && <p className="text-center text-muted-foreground">No events found.</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard
              key={event._id}
              event={event}
              onJoin={handleJoinEvent}
              currentUserId={user?._id}
            />
          ))}
        </div>
      </div>
    </PrivateRoute>
  );
}