// src/app/api/auth/me/route.ts
import { NextResponse } from 'next/server';
import { protect, AuthenticatedRequest } from '@/lib/auth'; // Ensure AuthenticatedRequest is imported

export async function GET(req: AuthenticatedRequest) {
  const authResult = await protect(req);
  if (authResult instanceof NextResponse) {
    return authResult; // Return early if authentication failed
  }

  // If protect passed, req.user is populated
  if (!req.user) {
    return NextResponse.json({ message: 'User data not found after authentication' }, { status: 500 });
  }

  return NextResponse.json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    photoURL: req.user.photoURL,
  }, { status: 200 });
}