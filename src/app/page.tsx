// src/app/page.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] text-center px-4"> {/* Added px-4 for smaller screens */}
      <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-primary animate-fade-in-down"> {/* Added animation */}
        Welcome to Eventify
      </h1>
      <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl animate-fade-in-up delay-200"> {/* Added animation */}
        Your ultimate platform for discovering, creating, and managing events.
        Connect with like-minded individuals and never miss out on exciting happenings!
      </p>
      <div className="space-x-4 flex flex-col md:flex-row space-y-4 md:space-y-0"> {/* Responsive buttons */}
        <Link href="/events">
          <Button size="lg" className="w-full md:w-auto transition-transform hover:scale-105">Explore Events</Button>
        </Link>
        <Link href="/add-event">
          <Button size="lg" variant="outline" className="w-full md:w-auto transition-transform hover:scale-105">Create an Event</Button>
        </Link>
      </div>
      <div className="mt-12 text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} Eventify. All rights reserved.</p>
      </div>
    </div>
  );
}