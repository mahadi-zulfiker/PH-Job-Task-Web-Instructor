// src/app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { hashPassword, generateToken } from '@/lib/auth'; // Ensure these are correctly implemented
import mongoose from 'mongoose'; // Import mongoose to check for specific error types

export async function POST(req: NextRequest) {
  console.log('--- Register API Route initiated ---'); // Start of request log

  try {
    await dbConnect();
    console.log('Database connected for registration.');

    const { name, email, password, photoURL } = await req.json();
    console.log('Received registration data:', { name, email, photoURL: photoURL ? 'provided' : 'not provided' });

    // --- Input Validation ---
    if (!name || !email || !password) {
      console.warn('Validation failed: Missing name, email, or password.');
      return NextResponse.json({ message: 'Please enter all required fields' }, { status: 400 });
    }

    // --- Check if user already exists ---
    const userExists = await User.findOne({ email });
    if (userExists) {
      console.warn(`User with email '${email}' already exists.`);
      return NextResponse.json({ message: 'User with this email already exists' }, { status: 400 });
    }

    // --- Password Hashing ---
    console.log('Hashing password...');
    const hashedPassword = await hashPassword(password);
    console.log('Password hashed successfully.');

    // --- Create New User ---
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      photoURL: photoURL || '', // If photoURL is empty string, Mongoose default will apply if specified
    });
    console.log('New user created in DB successfully:', user._id);

    // --- Generate JWT Token ---
    // Ensure JWT_SECRET is properly accessed and typed for generateToken
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('JWT_SECRET is not defined in environment variables.');
      return NextResponse.json({ message: 'Server configuration error: JWT Secret missing' }, { status: 500 });
    }
    const token = generateToken(user._id.toString()); // generateToken should use process.env.JWT_SECRET internally

    // --- Return Success Response ---
    // Do not return the hashed password
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      photoURL: user.photoURL,
      token,
    };
    console.log('Registration successful! Sending response.');
    return NextResponse.json(userResponse, { status: 201 });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    console.error('SERVER ERROR during registration:', errorMessage);

    if (error instanceof mongoose.Error.ValidationError) {
      // Mongoose validation errors (e.g., required field missing, invalid format)
      const errors = Object.keys(error.errors).map(key => error.errors[key].message);
      console.error('Mongoose Validation Error details:', errors);
      return NextResponse.json({ message: 'Validation failed', errors }, { status: 400 });
    } else if (
      error &&
      typeof error === 'object' &&
      'code' in error &&
      (error as { code: number }).code === 11000
    ) {
      // MongoDB duplicate key error (code 11000)
      const duplicateError = error as unknown as { keyValue: Record<string, unknown> };
      const field = Object.keys(duplicateError.keyValue)[0];
      const value = duplicateError.keyValue[field];
      console.error(`Duplicate key error: A user with this ${field} (${value}) already exists.`);
      return NextResponse.json({ message: `A user with this ${field} already exists.` }, { status: 409 }); // 409 Conflict is more appropriate
    } else if (error instanceof Error) {
        console.error('Full error object:', error);
        console.error('Error stack:', error.stack);
    }

    // Generic server error
    return NextResponse.json({ message: 'Server error during registration', error: errorMessage }, { status: 500 });
  } finally {
    console.log('--- Register API Route finished ---'); // End of request log
  }
}