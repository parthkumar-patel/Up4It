'use client';

import { useAuth } from '@/lib/context/AuthContext';
import Link from 'next/link';

export default function FeedPage() {
  const { user, isAuthenticated } = useAuth();
  
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Feed Page</h1>
      
      <div className="p-4 bg-green-50 rounded mb-4">
        <h2 className="text-xl font-semibold">Authentication Status</h2>
        {isAuthenticated ? (
          <div className="mt-2 text-green-600">
            ✅ Authenticated as {user?.email}
          </div>
        ) : (
          <div className="mt-2 text-red-600">
            ❌ Not authenticated
          </div>
        )}
      </div>
      
      <div className="mt-4 flex space-x-4">
        <Link href="/auth-debug" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Go to Auth Debug
        </Link>
        <Link href="/profile-setup" className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600">
          Go to Profile Setup
        </Link>
      </div>
    </div>
  );
} 