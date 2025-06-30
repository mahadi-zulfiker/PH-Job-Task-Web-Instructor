// src/app/api/events/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Event from '@/models/Event';
import { protect, AuthenticatedRequest } from '@/lib/auth';

// GET all events with search and filter
export async function GET(req: NextRequest) {
  await dbConnect();
  try {
    const { searchParams } = new URL(req.url);
    const title = searchParams.get('title');
    const date = searchParams.get('date');
    const dateRange = searchParams.get('dateRange');

    const query: Record<string, unknown> = {};

    if (title) {
      query.title = { $regex: title, $options: 'i' };
    }

    if (date === 'today') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      query.date = { $gte: today, $lt: tomorrow };
    }

    if (dateRange) {
      let startDate, endDate;
      const now = new Date();

      switch (dateRange) {
        case 'currentWeek':
          startDate = new Date(now.setDate(now.getDate() - now.getDay()));
          endDate = new Date(now.setDate(now.getDate() - now.getDay() + 6));
          break;
        case 'lastWeek':
          startDate = new Date(now.setDate(now.getDate() - now.getDay() - 7));
          endDate = new Date(now.setDate(now.getDate() - now.getDay() - 1));
          break;
        case 'currentMonth':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
          break;
        case 'lastMonth':
          startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
          endDate = new Date(now.getFullYear(), now.getMonth(), 0);
          break;
        default:
          break;
      }
      if (startDate && endDate) {
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
        query.date = { $gte: startDate, $lte: endDate };
      }
    }

    const events = await Event.find(query)
      .populate('postedBy', 'name email') // Populate to get poster's name
      .sort({ date: -1, time: -1 });

    return NextResponse.json(events, { status: 200 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ message: 'Server error', error: errorMessage }, { status: 500 });
  }
}

// POST new event
export async function POST(req: AuthenticatedRequest) {
  const authResult = await protect(req);
  if (authResult instanceof NextResponse) {
    return authResult;
  }
  await dbConnect();
  const { title, date, time, location, description, attendeeCount = 0 } = await req.json();

  if (!title || !date || !time || !location || !description) {
    return NextResponse.json({ message: 'Please include all required fields' }, { status: 400 });
  }

  try {
    const newEvent = await Event.create({
      title,
      postedBy: req.user!._id,
      postedByName: req.user!.name,
      date,
      time,
      location,
      description,
      attendeeCount,
    });
    return NextResponse.json(newEvent, { status: 201 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ message: 'Server error', error: errorMessage }, { status: 500 });
  }
}