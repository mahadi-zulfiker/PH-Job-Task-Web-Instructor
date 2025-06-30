// src/components/Navbar.tsx
"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CalendarDays } from "lucide-react";

const Navbar = () => {
  const { user, logout, isLoading } = useAuth();

  if (isLoading) {
    return (
      <nav className="bg-primary text-primary-foreground p-4 shadow-md sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <CalendarDays className="h-7 w-7 text-primary-foreground" /> {/* Logo placeholder icon */}
            <span className="text-2xl font-bold">Eventify</span>
          </div>
          <div className="h-8 w-20 bg-primary-foreground/20 rounded-md animate-pulse"></div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-primary text-primary-foreground p-4 shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-6"> {/* Increased space-x */}
          <Link href="/" className="flex items-center space-x-2 text-primary-foreground hover:opacity-90 transition-opacity">
            <CalendarDays className="h-7 w-7" /> {/* Icon as part of logo */}
            <span className="text-2xl font-bold">Eventify</span>
          </Link>
          <div className="flex items-center space-x-4"> {/* Navigation links */}
            <Link href="/" className="hover:underline hover:scale-105 transition-transform">Home</Link>
            <Link href="/events" className="hover:underline hover:scale-105 transition-transform">Events</Link>
            {user && (
              <>
                <Link href="/add-event" className="hover:underline hover:scale-105 transition-transform">Add Event</Link>
                <Link href="/my-events" className="hover:underline hover:scale-105 transition-transform">My Events</Link>
              </>
            )}
          </div>
        </div>
        <div>
          {!user ? (
            <Link href="/login">
              <Button variant="secondary" className="hover:scale-105 transition-transform">Sign In</Button>
            </Link>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full transition-transform hover:scale-105"> {/* Slightly larger */}
                  <Avatar className="h-9 w-9"> {/* Slightly larger */}
                    <AvatarImage src={user.photoURL || "/default-avatar.png"} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="cursor-pointer">
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;