// src/app/api/events/join/[id]/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Event from '@/models/Event';
import { protect, AuthenticatedRequest } from '@/lib/auth';
import mongoose from 'mongoose';

export async function PUT(req: AuthenticatedRequest, { params }: { params: { id: string } }) {
  const authResult = await protect(req);
  if (authResult instanceof NextResponse) {
    return authResult;
  }
  await dbConnect();
  const { id } = params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ message: 'Invalid Event ID' }, { status: 400 });
  }

  try {
    const event = await Event.findById(id);

    if (!event) {
      return NextResponse.json({ message: 'Event not found' }, { status: 404 });
    }

    if (event.attendees.includes(req.user!._id)) {
      return NextResponse.json({ message: 'You have already joined this event' }, { status: 400 });
    }

    event.attendees.push(req.user!._id);
    event.attendeeCount += 1;
    await event.save();
    return NextResponse.json({ message: 'Successfully joined event', event }, { status: 200 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ message: 'Server error', error: errorMessage }, { status: 500 });
  }
}