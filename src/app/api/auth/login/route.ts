// src/app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { comparePassword, generateToken } from '@/lib/auth';
import mongoose from 'mongoose'; // Import mongoose for error handling

export async function POST(req: NextRequest) {
  console.log('--- Login API Route initiated ---'); // Start of request log

  try {
    await dbConnect();
    console.log('Database connected for login.');

    const { email, password } = await req.json();
    console.log('Received login attempt for email:', email);

    // --- Input Validation ---
    if (!email || !password) {
      console.warn('Validation failed: Missing email or password.');
      return NextResponse.json({ message: 'Please enter all fields' }, { status: 400 });
    }

    // --- Find User ---
    // IMPORTANT: Because password field is `select: false` in User model,
    // we must explicitly select it here to compare passwords.
    const user = await User.findOne({ email }).select('+password');
    console.log(user ? 'User found.' : 'User not found for email:', email);

    // --- Check User Existence and Password ---
    // Also, check if user.password exists before comparing, as it might be null/undefined if select() fails or for other reasons
    if (user && user.password && (await comparePassword(password, user.password))) {
      console.log('Password comparison successful for user:', user._id);

      // --- Generate JWT Token ---
      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        console.error('JWT_SECRET is not defined in environment variables.');
        return NextResponse.json({ message: 'Server configuration error: JWT Secret missing' }, { status: 500 });
      }
      const token = generateToken(user._id.toString()); // generateToken should use process.env.JWT_SECRET internally
      console.log('JWT token generated for user:', user._id);

      // --- Return Success Response ---
      // Do not return the hashed password
      const userResponse = {
        _id: user._id,
        name: user.name,
        email: user.email,
        photoURL: user.photoURL,
        token, // Send the token back
      };
      console.log('Login successful! Sending response.');
      return NextResponse.json(userResponse, { status: 200 });
    } else {
      // This covers both user not found AND incorrect password
      console.warn('Login failed: Invalid credentials for email:', email);
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 }); // 401 Unauthorized is more precise
    }

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    console.error('SERVER ERROR during login:', errorMessage);

    if (
      error instanceof mongoose.Error.CastError &&
      typeof (error as { path?: unknown }).path === 'string' &&
      (error as { path: string }).path === '_id'
    ) {
      // This might happen if an invalid ID is passed, though less likely for login
      console.error('Cast error (invalid ID format):', error.message);
      return NextResponse.json({ message: 'Invalid user ID format' }, { status: 400 });
    } else if (error instanceof Error) {
        console.error('Full error object:', error);
        console.error('Error stack:', error.stack);
    }

    // Generic server error
    return NextResponse.json({ message: 'Server error during login', error: errorMessage }, { status: 500 });
  } finally {
    console.log('--- Login API Route finished ---'); // End of request log
  }
}