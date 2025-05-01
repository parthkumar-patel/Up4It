import { NextResponse } from 'next/server';
import { ExpiredActivitiesService } from '@/services/ExpiredActivitiesService';

/**
 * API route for scheduled task to process expired activities
 * This endpoint should be called by a cron job every 5 minutes
 */
export async function GET(request: Request) {
  try {
    // Verify authorization (for production, use a proper auth token)
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    // In production, this should be a proper auth check
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Process expired activities
    const processedCount = await ExpiredActivitiesService.processExpiredActivities();
    
    // Return success response
    return NextResponse.json({
      success: true,
      processedCount,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error processing expired activities:', error);
    
    // Return error response
    return NextResponse.json(
      { error: 'Failed to process expired activities' },
      { status: 500 }
    );
  }
} 