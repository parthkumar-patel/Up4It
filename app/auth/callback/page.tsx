'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { account } from '@/lib/services/appwrite';
import { Loader2 } from 'lucide-react';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [debug, setDebug] = useState<any>(null);
  const [processing, setProcessing] = useState(true);
  
  useEffect(() => {
    const userId = searchParams.get('userId');
    const secret = searchParams.get('secret');
    const callbackUrl = searchParams.get('callbackUrl');
    const messageId = searchParams.get('message-id'); // Alternative param in some versions
    const secondSecret = searchParams.get('secondsecret'); // Alternative param in some versions
    
    console.log('Auth callback params:', {
      userId,
      secret: secret ? 'Present' : 'Not present',
      callbackUrl,
      'message-id': messageId,
      secondSecret: secondSecret ? 'Present' : 'Not present'
    });
    
    if (!userId || !secret) {
      const debugInfo = {
        params: Object.fromEntries(searchParams.entries()),
        missingParams: {
          userId: !userId,
          secret: !secret
        },
        possibleAlternatives: {
          messageId: messageId || null,
          secondSecret: secondSecret || null
        }
      };
      
      console.error('Missing required parameters', debugInfo);
      setError('Missing required parameters for authentication');
      setDebug(debugInfo);
      setProcessing(false);
      return;
    }
    
    async function verifyMagicURL() {
      try {
        console.log('Starting magic URL verification...');
        
        // Get all cookies before
        const cookiesBefore = document.cookie;
        console.log('Cookies before auth:', cookiesBefore);
        
        // Update the magic URL session
        const session = await account.updateMagicURLSession(
          userId,
          secret
        );
        
        console.log('Magic URL session created successfully:', session);
        
        // Get all cookies after
        const cookiesAfter = document.cookie;
        console.log('Cookies after auth:', cookiesAfter);
        
        // Navigate to the callback URL or default to feed
        if (callbackUrl) {
          console.log('Redirecting to callback URL:', callbackUrl);
          router.push(decodeURIComponent(callbackUrl));
        } else {
          console.log('No callback URL provided, redirecting to feed');
          router.push('/feed');
        }
      } catch (error: any) {
        console.error('Authentication error:', error);
        setError(error.message || 'Authentication failed');
        setDebug({
          errorType: error.constructor.name,
          errorCode: error.code,
          errorMessage: error.message,
          stack: error.stack
        });
        setProcessing(false);
      }
    }
    
    // Execute the authentication
    verifyMagicURL();
  }, [searchParams, router]);
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h1>
          <p className="text-gray-700 mb-4">{error}</p>
          
          {debug && (
            <div className="mt-4 border border-gray-200 rounded p-4">
              <h2 className="text-lg font-semibold mb-2">Debug Information</h2>
              <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
                {JSON.stringify(debug, null, 2)}
              </pre>
            </div>
          )}
          
          <div className="mt-6 flex flex-col space-y-2">
            <a
              href="/login"
              className="px-4 py-2 bg-blue-500 text-white rounded text-center hover:bg-blue-600"
            >
              Return to Login
            </a>
            <a
              href="/auth-debug"
              className="px-4 py-2 bg-gray-500 text-white rounded text-center hover:bg-gray-600"
            >
              Go to Debug Page
            </a>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="text-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
        <h1 className="text-2xl font-bold mt-4">Completing Authentication</h1>
        <p className="text-gray-600 mt-2">
          Please wait while we verify your login...
        </p>
      </div>
    </div>
  );
} 