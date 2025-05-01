'use client';

import { useState, useEffect } from 'react';
import { account, getAuthState } from '@/lib/services/appwrite';
import Link from 'next/link';

export default function AuthDebugPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [cookies, setCookies] = useState([]);
  const [requestUrl, setRequestUrl] = useState('');
  const [sessionDetails, setSessionDetails] = useState(null);
  const [manuallyCheckedAuth, setManuallyCheckedAuth] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        // Get current URL for debugging request context
        setRequestUrl(window.location.href);
        
        // Try to get the current user
        const currentUser = await account.get();
        setIsAuthenticated(true);
        setUser(currentUser);
        
        // For demonstration only - show cookies present in document
        // This only works client-side
        setCookies(document.cookie.split(';').map(c => c.trim()));

        // Try to get the current sessions
        try {
          const sessions = await account.listSessions();
          setSessionDetails(sessions);
        } catch (sessionError) {
          console.error('Failed to get sessions:', sessionError);
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        setError(err.message || 'Failed to check authentication');
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    }
    
    checkAuth();
  }, [manuallyCheckedAuth]);

  const handleManualAuthCheck = async () => {
    setIsLoading(true);
    const authState = await getAuthState();
    console.log('Manual auth check result:', authState);
    setManuallyCheckedAuth(prev => !prev); // Toggle to trigger recheck
  };

  const handleCreateDummySession = async () => {
    try {
      // This is for testing only! Would never do this in production
      const dummySessionCookie = 'appwrite_session=test-session-cookie; path=/; secure; httponly';
      document.cookie = dummySessionCookie;
      alert('Created dummy session cookie. This is for testing only!');
      window.location.reload();
    } catch (err) {
      console.error('Failed to create dummy cookie:', err);
      alert('Failed to create dummy cookie: ' + err.message);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Authentication Debug Page</h1>
      
      {isLoading ? (
        <div className="p-4 bg-blue-50 rounded">Loading authentication status...</div>
      ) : (
        <div className={`p-4 rounded mb-4 ${isAuthenticated ? 'bg-green-50' : 'bg-red-50'}`}>
          <h2 className="text-xl font-semibold mb-2">
            {isAuthenticated 
              ? '✅ Authenticated' 
              : '❌ Not Authenticated'}
          </h2>
          
          {error && (
            <div className="mt-2 text-red-600 bg-red-50 p-3 rounded">
              Error: {error}
            </div>
          )}
          
          <div className="mt-4">
            <h3 className="font-medium mb-2">Request URL:</h3>
            <div className="bg-gray-100 p-2 rounded text-sm">{requestUrl}</div>
          </div>
          
          {isAuthenticated && user && (
            <div className="mt-4">
              <h3 className="font-medium mb-2">User Information:</h3>
              <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
                {JSON.stringify(user, null, 2)}
              </pre>
            </div>
          )}
          
          {sessionDetails && (
            <div className="mt-4">
              <h3 className="font-medium mb-2">Active Sessions:</h3>
              <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
                {JSON.stringify(sessionDetails, null, 2)}
              </pre>
            </div>
          )}
          
          <div className="mt-4">
            <h3 className="font-medium mb-2">Cookies:</h3>
            {cookies.length > 0 ? (
              <div className="bg-gray-100 p-4 rounded">
                <ul className="list-disc pl-5">
                  {cookies.map((cookie, idx) => (
                    <li key={idx} className="mb-1 text-sm font-mono">{cookie}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-red-500">No cookies found</p>
            )}
          </div>
          
          <div className="mt-6 flex flex-wrap gap-4">
            <Link 
              href="/feed" 
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Go to Feed
            </Link>
            
            <Link 
              href="/login" 
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Go to Login
            </Link>
            
            <button 
              onClick={handleManualAuthCheck}
              className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
            >
              Recheck Auth
            </button>
            
            {isAuthenticated && (
              <button 
                onClick={async () => {
                  try {
                    await account.deleteSessions();
                    window.location.reload();
                  } catch (err) {
                    console.error('Logout failed:', err);
                    alert('Failed to log out: ' + err.message);
                  }
                }}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Log Out
              </button>
            )}
            
            {!isAuthenticated && (
              <button
                onClick={handleCreateDummySession}
                className="px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600"
              >
                Create Test Cookie
              </button>
            )}
          </div>
        </div>
      )}
      
      <div className="mt-8 p-4 bg-gray-50 rounded">
        <h2 className="text-xl font-semibold mb-4">Troubleshooting Steps</h2>
        <ol className="list-decimal pl-5 space-y-2">
          <li>Make sure cookies are enabled in your browser</li>
          <li>Check if there are any CORS issues in the browser console</li>
          <li>Verify that your Appwrite project configuration is correct</li>
          <li>Try clearing browser cache and cookies</li>
          <li>Ensure the callback URL is properly configured</li>
          <li>Check the middleware logs for cookie detection issues</li>
          <li>Confirm that the magic link authentication is configured correctly</li>
        </ol>
      </div>
    </div>
  );
} 