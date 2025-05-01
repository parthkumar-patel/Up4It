import { NextRequest, NextResponse } from 'next/server';
import { checkUserHasProfile } from '@/lib/services/profile';

/**
 * Middleware to check if a user has a profile
 * If not, redirect them to the profile setup page
 */
export async function profileMiddleware(request: NextRequest) {
  // Skip auth routes and profile setup page
  const path = request.nextUrl.pathname;
  if (
    path === '/login' ||
    path === '/signup' ||
    path.startsWith('/auth/') ||
    path === '/profile-setup'
  ) {
    return NextResponse.next();
  }

  // Check if user is authenticated
  const sessionCookie = request.cookies.get('appwrite_session');
  if (!sessionCookie?.value) {
    return NextResponse.next();
  }

  try {
    // Check if user has a profile
    const hasProfile = await checkUserHasProfile(request);
    
    // If not, redirect to profile setup
    if (!hasProfile && path !== '/profile-setup') {
      return NextResponse.redirect(new URL('/profile-setup', request.url));
    }
    
    return NextResponse.next();
  } catch (error) {
    console.error('Profile middleware error:', error);
    return NextResponse.next();
  }
} 