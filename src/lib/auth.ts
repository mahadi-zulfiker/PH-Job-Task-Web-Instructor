// src/lib/auth.ts
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import User from '@/models/User';
import mongoose from 'mongoose';

// Extend NextRequest to include a 'user' property
export interface AuthenticatedRequest extends NextRequest {
  user?: {
    _id: mongoose.Types.ObjectId | string;
    name: string;
    email: string;
    photoURL?: string;
  };
}

export const generateToken = (_id: string): string => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }
  return jwt.sign({ _id }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
};

export const comparePassword = async (candidatePassword: string, hashedPassword: string): Promise<boolean> => {
  // Ensure bcryptjs is correctly imported and used in auth.ts
  // Assuming you have bcryptjs installed: npm install bcryptjs
  const bcrypt = await import('bcryptjs'); // Dynamic import for client/server separation if needed
  return bcrypt.compare(candidatePassword, hashedPassword);
};

export const hashPassword = async (password: string): Promise<string> => {
  const bcrypt = await import('bcryptjs');
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};


export const protect = async (req: NextRequest): Promise<NextResponse | true> => {
  let token;

  if (req.headers.get('authorization')?.startsWith('Bearer')) {
    token = req.headers.get('authorization')?.split(' ')[1];
  }

  if (!token) {
    return NextResponse.json({ message: 'Not authorized, no token' }, { status: 401 });
  }

  try {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined');
    }
    interface JwtPayload {
      _id: string;
      iat?: number;
      exp?: number;
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;

    // Find the user and attach it to the request object
    // Cast req to AuthenticatedRequest to add the user property
    const user = await User.findById(decoded._id).select('-password'); // Don't return password
    if (!user) {
        return NextResponse.json({ message: 'Not authorized, user not found' }, { status: 401 });
    }

    // Attach user information to the request for subsequent handlers
    // IMPORTANT: This specific way of attaching to 'req' might not persist
    // between middleware and route handlers in some Next.js setups
    // unless you're using a custom server. For App Router, it's safer
    // to return the user and pass it or use context/locals if available.
    // However, for typical direct API route protection, casting req is common.
    (req as AuthenticatedRequest).user = {
      _id: user._id,
      name: user.name,
      email: user.email,
      photoURL: user.photoURL,
      // Add other user properties you need
    };

    return true; // Indicate success
  } catch (error: unknown) {
    console.error('Token verification failed:', error);
    return NextResponse.json({ message: 'Not authorized, token failed' }, { status: 401 });
  }
};