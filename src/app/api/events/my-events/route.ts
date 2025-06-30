// src/app/api/events/my-events/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Event from '@/models/Event';
import { protect, AuthenticatedRequest } from '@/lib/auth';

export async function GET(req: AuthenticatedRequest) {
  const authResult = await protect(req);
  if (authResult instanceof NextResponse) {
    return authResult;
  }
  await dbConnect();

  try {
    const myEvents = await Event.find({ postedBy: req.user!._id })
      .sort({ date: -1, time: -1 });
    return NextResponse.json(myEvents, { status: 200 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ message: 'Server error', error: errorMessage }, { status: 500 });
  }
}