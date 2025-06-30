// src/models/User.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string; // Password is required after hashing
  photoURL?: string; // Optional if you want to allow it not to be present, but default can fill empty string
  createdAt: Date;
  updatedAt: Date;
}

const userSchema: Schema<IUser> = new Schema({ // Explicitly type the schema
  name: {
    type: String,
    required: [true, 'Name is required'], // Custom error message
    trim: true, // Trim whitespace
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true, // Crucial for unique emails
    lowercase: true, // Store emails in lowercase
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'], // Basic email regex validation
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'], // Minimum length for security
    select: false, // Prevents password from being returned in queries by default
  },
  photoURL: {
    type: String,
    default: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png', // A better default URL
  },
}, { timestamps: true });

// Optional: You can add pre-save hooks here if needed, e.g., for password hashing
// userSchema.pre('save', async function (next) { ... });

const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);
export default User;