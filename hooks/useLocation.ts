'use client';

import { useState, useEffect } from 'react';
import { LocationService } from '@/services/LocationService';

export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
  isLoading: boolean;
  error: GeolocationPositionError | Error | null;
}

interface UseLocationOptions {
  enableHighAccuracy?: boolean;
  maximumAge?: number;
  timeout?: number;
  watch?: boolean;
}

const defaultOptions: UseLocationOptions = {
  enableHighAccuracy: true,
  maximumAge: 30000, // 30 seconds
  timeout: 10000, // 10 seconds
  watch: false, // One-time request by default
};

/**
 * Custom hook for using geolocation in React components
 */
export function useLocation(options: UseLocationOptions = {}): LocationData {
  // Merge default options with provided options
  const mergedOptions = { ...defaultOptions, ...options };
  
  // State to store location data
  const [locationData, setLocationData] = useState<LocationData>({
    latitude: 0,
    longitude: 0,
    accuracy: 0,
    timestamp: 0,
    isLoading: true,
    error: null,
  });

  // Effect to request location permission and start tracking if needed
  useEffect(() => {
    // Check if geolocation is supported
    if (!LocationService.isGeolocationSupported()) {
      setLocationData(prevData => ({
        ...prevData,
        isLoading: false,
        error: new Error('Geolocation is not supported in this browser'),
      }));
      return;
    }

    // Handler for successful position
    const handleSuccess = (position: GeolocationPosition) => {
      setLocationData({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        timestamp: position.timestamp,
        isLoading: false,
        error: null,
      });
    };

    // Handler for position error
    const handleError = (error: GeolocationPositionError | Error) => {
      setLocationData(prevData => ({
        ...prevData,
        isLoading: false,
        error,
      }));
    };

    // Start loading
    setLocationData(prevData => ({ ...prevData, isLoading: true }));

    // Logic for watching or one-time request
    if (mergedOptions.watch) {
      // Start watching position
      LocationService.startWatchingPosition(handleSuccess)
        .catch(handleError);

      // Cleanup: stop watching position
      return () => {
        LocationService.stopWatchingPosition();
      };
    } else {
      // Get position once
      LocationService.getCurrentPosition()
        .then(handleSuccess)
        .catch(handleError);
    }
  }, [
    mergedOptions.enableHighAccuracy,
    mergedOptions.maximumAge,
    mergedOptions.timeout,
    mergedOptions.watch,
  ]);

  return locationData;
} 