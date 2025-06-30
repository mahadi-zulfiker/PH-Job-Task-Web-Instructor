// src/lib/utils.ts
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import axios from 'axios';
import { UserData } from './types'; // Import UserData type

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Create an Axios instance for making API requests
export const api = axios.create({
  // No baseURL needed as we're hitting Next.js API routes directly
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the authorization token
api.interceptors.request.use(
  (config) => {
    // Get user data from localStorage
    const userString = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    let user: UserData | null = null;
    if (userString) {
      try {
        user = JSON.parse(userString);
      } catch (e) {
        console.error("Failed to parse user from localStorage:", e);
        localStorage.removeItem('user'); // Clear corrupted data
      }
    }

    // If a user and token exist, add the Authorization header
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);