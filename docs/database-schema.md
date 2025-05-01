# Up4It Database Schema

This document outlines the database schema implementation for the Up4It application using Appwrite as the backend service.

## Overview

The Up4It database consists of three primary collections:

1. **Users Collection**: Stores user profile information and location data
2. **Activities Collection**: Contains activity details with location and time information
3. **Matches Collection**: Manages relationships between users and activities

## Collections Structure

### Users Collection

Stores user data and their last known location for proximity matching.

| Attribute             | Type     | Description                                      |
| --------------------- | -------- | ------------------------------------------------ |
| userId                | string   | Unique user identifier (linked to Appwrite Auth) |
| email                 | string   | User's email address                             |
| name                  | string   | Display name                                     |
| profileImageUrl       | string   | URL to user's profile image                      |
| lastLocationLat       | float    | Last known latitude                              |
| lastLocationLng       | float    | Last known longitude                             |
| lastLocationTimestamp | datetime | When location was last updated                   |
| createdAt             | datetime | Account creation timestamp                       |
| updatedAt             | datetime | Last update timestamp                            |

**Indexes**:

- `idx_userId`: For quick lookup by user ID
- `idx_email`: For email queries
- `idx_location`: Compound index on lat/lng for location queries

**Permissions**:

- All users can read
- Users can only update/delete their own documents

### Activities Collection

Contains information about activities users can join.

| Attribute    | Type     | Description                                     |
| ------------ | -------- | ----------------------------------------------- |
| userId       | string   | Creator's user ID                               |
| title        | string   | Activity title                                  |
| description  | string   | Optional detailed description                   |
| activityType | string   | Category/type of activity                       |
| locationLat  | float    | Activity latitude                               |
| locationLng  | float    | Activity longitude                              |
| locationName | string   | Human-readable location name                    |
| radiusMeters | integer  | Proximity radius in meters                      |
| startTime    | datetime | When the activity starts                        |
| endTime      | datetime | When the activity ends (max 4 hours from start) |
| status       | string   | Activity status (active/expired)                |
| createdAt    | datetime | Creation timestamp                              |
| updatedAt    | datetime | Last update timestamp                           |

**Indexes**:

- `idx_userId`: For finding user's activities
- `idx_status`: For filtering by status
- `idx_activityType`: For filtering by type
- `idx_location`: For location-based queries
- `idx_status_endTime`: Compound index for finding expiring activities

**Permissions**:

- All users can read
- Only creator can update/delete

### Matches Collection

Connects users to activities they want to join.

| Attribute      | Type     | Description                                      |
| -------------- | -------- | ------------------------------------------------ |
| activityId     | string   | ID of the related activity                       |
| activityUserId | string   | ID of the activity creator                       |
| matchedUserId  | string   | ID of the user who wants to join                 |
| status         | string   | Match status (pending/accepted/rejected/expired) |
| shareCode      | string   | Random word pair for in-person verification      |
| createdAt      | datetime | Creation timestamp                               |
| updatedAt      | datetime | Last update timestamp                            |

**Indexes**:

- `idx_activity`: For finding matches for an activity
- `idx_activityUser`: For finding activity creator's matches
- `idx_matchedUser`: For finding a user's matches
- `idx_status`: For filtering by status
- `idx_unique_match`: Unique index preventing duplicate matches

**Permissions**:

- Activity creator and matched user can read
- Any user can create a match
- Both activity creator and matched user can update
- Only matched user can delete (cancel request)

## Utility Functions

### Geolocation Utilities

Located in `lib/utils/geo-utils.ts`, these functions handle location-based operations:

1. **calculateDistance**: Calculate the distance between two points using the Haversine formula
2. **findNearbyActivities**: Find activities near a user within a specified radius
3. **findPotentialMatches**: Find users who might be interested in an activity based on proximity

### Activity Expiry System

Located in `scripts/expire-activities.ts`, this script:

1. Finds active activities that have passed their end time
2. Updates their status to 'expired'
3. Updates any pending matches for those activities to 'expired'

Run this script periodically with: `npm run expire-activities`

## Setup

To set up the database structure, run:

```
npm run setup-database
```

This script creates the necessary database, collections, attributes, and indexes in your Appwrite project.

## Environment Variables

Add these to your `.env.local` file after running the setup script:

```
NEXT_PUBLIC_APPWRITE_DATABASE_ID=your_database_id
NEXT_PUBLIC_APPWRITE_USER_COLLECTION_ID=users
NEXT_PUBLIC_APPWRITE_ACTIVITY_COLLECTION_ID=activities
NEXT_PUBLIC_APPWRITE_MATCH_COLLECTION_ID=matches
```
