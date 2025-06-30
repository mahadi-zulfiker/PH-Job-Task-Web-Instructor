// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/sonner";
import Link from "next/link"; // Import Link for footer
import Navbar from "@/components/ui/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Event Management App",
  description: "A MERN stack event management application built with Next.js and Shadcn UI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <Navbar />
          <main className="container mx-auto p-4 min-h-[calc(100vh-100px)] flex-grow"> {/* Added flex-grow */}
            {children}
          </main>
          {/* Footer Component */}
          <footer className="bg-primary text-primary-foreground py-8 mt-auto"> {/* Added mt-auto */}
            <div className="container mx-auto text-center">
              <div className="flex flex-col md:flex-row justify-center md:space-x-8 mb-4 space-y-2 md:space-y-0">
                <Link href="/events" className="hover:underline text-lg">Browse Events</Link>
                <Link href="/add-event" className="hover:underline text-lg">Create Event</Link>
              </div>
              <p className="text-sm">
                &copy; {new Date().getFullYear()} Eventify. All rights reserved.
              </p>
              <p className="text-xs text-primary-foreground/80 mt-1">
                Built with Next.js, MongoDB, and love.
              </p>
            </div>
          </footer>
          <Toaster richColors position="top-right" />
        </AuthProvider>
      </body>
    </html>
  );
}