// src/lib/types.ts

// Define the structure of a User object as returned from the API
export interface UserData {
  _id: string;
  name: string;
  email: string;
  photoURL?: string;
  token?: string; // Token is usually only present on login/registration response
}

// Define the structure of an Event object
export interface EventData {
  _id: string;
  title: string;
  postedBy: string; // User ID of the poster
  postedByName: string; // Name of the user who posted the event
  date: string; // Can be string (ISO date) or Date object depending on usage
  time: string;
  location: string;
  description: string;
  attendeeCount: number;
  attendees: string[]; // Array of user IDs who have joined
  createdAt?: string; // Optional timestamps
  updatedAt?: string;
}

// Interface for API response messages
export interface ApiResponse {
  message: string;
  [key: string]: unknown; // Allow for other properties
}

// For form data types
export interface AddEventFormData {
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
}


export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  photoURL?: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}