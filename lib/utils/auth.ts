import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { isUserAuthenticated } from '../services/appwrite';

/**
 * Middleware function to redirect authenticated users away from auth pages
 * @param request The incoming request
 */
export async function redirectIfAuthenticated(request: Request) {
  try {
    const isAuthenticated = await isUserAuthenticated();
    const url = new URL(request.url);
    
    // If user is logged in and trying to access auth pages, redirect to feed
    if (isAuthenticated && url.pathname.startsWith('/auth')) {
      return NextResponse.redirect(new URL('/feed', request.url));
    }
    
    return NextResponse.next();
  } catch (error) {
    // If there's an error checking auth status, continue as normal
    return NextResponse.next();
  }
}

/**
 * Middleware function to redirect unauthenticated users to login
 * @param request The incoming request
 */
export async function redirectIfUnauthenticated(request: Request) {
  try {
    const isAuthenticated = await isUserAuthenticated();
    const url = new URL(request.url);
    
    // Allow access to auth pages without authentication
    if (url.pathname.startsWith('/auth') || url.pathname === '/login') {
      return NextResponse.next();
    }
    
    // If user is not logged in and trying to access protected pages, redirect to login
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    return NextResponse.next();
  } catch (error) {
    // If there's an error checking auth status, redirect to login
    return NextResponse.redirect(new URL('/login', request.url));
  }
} 