import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Event from '@/models/Event';
import { protect, AuthenticatedRequest } from '@/lib/auth';
import mongoose from 'mongoose';

// Use specific function parameter typing per Next.js 13+ App Router
type Context = {
  params: {
    id: string;
  };
};

// GET: Get single event by ID
export async function GET(req: NextRequest, context: Context) {
  await dbConnect();
  const { id } = context.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ message: 'Invalid Event ID' }, { status: 400 });
  }

  try {
    const event = await Event.findById(id).populate('postedBy', 'name email photoURL');
    if (!event) {
      return NextResponse.json({ message: 'Event not found' }, { status: 404 });
    }
    return NextResponse.json(event, { status: 200 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ message: 'Error retrieving event', error: errorMessage }, { status: 500 });
  }
}

// PUT: Update event by ID
export async function PUT(req: NextRequest, context: Context) {
  const authResult = await protect(req);
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  const authenticatedReq = req as AuthenticatedRequest;
  await dbConnect();
  const { id } = context.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ message: 'Invalid Event ID' }, { status: 400 });
  }

  try {
    const event = await Event.findById(id);
    if (!event) {
      return NextResponse.json({ message: 'Event not found' }, { status: 404 });
    }

    const user = authenticatedReq.user;
    if (event.postedBy.toString() !== user?._id?.toString()) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    const data = await req.json();
    const updated = await Event.findByIdAndUpdate(id, data, { new: true, runValidators: true });

    return NextResponse.json(updated, { status: 200 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ message: 'Error updating event', error: errorMessage }, { status: 500 });
  }
}

// DELETE: Delete event by ID
export async function DELETE(req: NextRequest, context: Context) {
  const authResult = await protect(req);
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  const authenticatedReq = req as AuthenticatedRequest;
  await dbConnect();
  const { id } = context.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ message: 'Invalid Event ID' }, { status: 400 });
  }

  try {
    const event = await Event.findById(id);
    if (!event) {
      return NextResponse.json({ message: 'Event not found' }, { status: 404 });
    }

    const user = authenticatedReq.user;
    if (event.postedBy.toString() !== user?._id?.toString()) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    await Event.deleteOne({ _id: id });
    return NextResponse.json({ message: 'Event deleted' }, { status: 200 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ message: 'Error deleting event', error: errorMessage }, { status: 500 });
  }
}
