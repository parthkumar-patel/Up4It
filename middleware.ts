import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { checkUserHasProfile } from './lib/services/profile';

export async function middleware(request: NextRequest) {
  // Get the path of the request
  const path = request.nextUrl.pathname;
  
  // Debug request path (for non-asset requests only)
  if (!path.includes('_next') && !path.includes('favicon')) {
    console.log(`[Middleware] Processing request for path: ${path}`);
  }
  
  // Define public paths that don't require authentication
  const isPublicPath = path === '/login' || 
                       path === '/signup' ||
                       path === '/auth-debug' ||
                       path === '/feed' ||  // TEMPORARY: Make feed accessible without auth
                       path.startsWith('/auth/');
                       
  // Skip middleware for public paths completely
  if (isPublicPath) {
    console.log(`[Middleware] Public path detected, skipping auth checks: ${path}`);
    return NextResponse.next();
  }
  
  // DEBUG: Log all cookies for troubleshooting
  const allCookies = Array.from(request.cookies.getAll());
  console.log(`[Middleware] Request cookies for ${path}:`, 
    allCookies.map(c => ({ name: c.name, hasValue: !!c.value }))
  );
  
  // Look for any Appwrite session cookies
  const appwriteCookies = allCookies.filter(cookie => 
    cookie.name.includes('appwrite') || cookie.name.includes('a_session')
  );
  
  console.log(`[Middleware] Found ${appwriteCookies.length} Appwrite related cookies`);
  
  // Check for authentication using multiple cookie patterns
  const isAuthenticated = appwriteCookies.some(cookie => 
    (cookie.name.includes('appwrite') && cookie.name.includes('session')) ||
    cookie.name === 'a_session'
  );
  
  console.log(`[Middleware] Authentication status for ${path}: ${isAuthenticated ? 'Authenticated' : 'Not authenticated'}`);
  
  // Redirect unauthenticated users to login
  if (!isAuthenticated) {
    // Create URL to redirect to after login
    const redirectUrl = new URL('/login', request.url);
    // Add the originally requested URL as a parameter
    redirectUrl.searchParams.set('callbackUrl', request.nextUrl.pathname);
    
    console.log(`[Middleware] Redirecting unauthenticated user to: ${redirectUrl.toString()}`);
    return NextResponse.redirect(redirectUrl);
  }
  
  // Handle profile check for authenticated users
  if (path !== '/profile-setup') {
    try {
      const hasProfile = await checkUserHasProfile(request);
      
      if (!hasProfile) {
        // Redirect to profile setup if user doesn't have a profile
        console.log(`[Middleware] User authenticated but no profile found, redirecting to profile setup`);
        return NextResponse.redirect(new URL('/profile-setup', request.url));
      }
    } catch (error) {
      console.error('[Middleware] Error in profile middleware:', error);
      // Continue with the request in case of an error
    }
  }
  
  // Allow the request to proceed
  return NextResponse.next();
}

// Define which routes to run the middleware on
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}; 