'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  
  const isActive = (path: string) => pathname === path;
  
  return (
    <div className="flex flex-col min-h-screen">
      <header className="p-4 border-b">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/feed" className="text-xl font-bold">Up4It</Link>
          <nav>
            <ul className="flex gap-4">
              <li>
                <Link 
                  href="/feed" 
                  className={`px-3 py-2 rounded-md transition-colors ${
                    isActive('/feed') 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'hover:bg-gray-100'
                  }`}
                >
                  Feed
                </Link>
              </li>
              <li>
                <Link 
                  href="/activities" 
                  className={`px-3 py-2 rounded-md transition-colors ${
                    isActive('/activities') 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'hover:bg-gray-100'
                  }`}
                >
                  Create
                </Link>
              </li>
              <li>
                <Link 
                  href="/profile" 
                  className={`px-3 py-2 rounded-md transition-colors ${
                    isActive('/profile') 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'hover:bg-gray-100'
                  }`}
                >
                  Profile
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto px-4 py-6">
        {children}
      </main>
      
      <footer className="p-4 border-t">
        <div className="container mx-auto text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Up4It
        </div>
      </footer>
    </div>
  );
} 