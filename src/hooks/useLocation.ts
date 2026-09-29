// Walk With Me - Custom Hook: useLocation
// Connects to centralized locationService with automatic unmount cleanup

import { useState, useEffect, useCallback, useRef } from 'react';
import { locationService, type LocationErrorType, type LocationServiceListeners } from '../services/locationService';
import type { GPSPoint } from '../types/journey';

export interface UseLocationReturn {
  location: GPSPoint | null;
  error: { type: LocationErrorType; message: string } | null;
  accuracyWarning: number | null;
  isTracking: boolean;
  startTracking: () => boolean;
  stopTracking: () => void;
  injectPoint: (point: GPSPoint) => void;
}

export const useLocation = (autoStart = false): UseLocationReturn => {
  const [location, setLocation] = useState<GPSPoint | null>(null);
  const [error, setError] = useState<{ type: LocationErrorType; message: string } | null>(null);
  const [accuracyWarning, setAccuracyWarning] = useState<number | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const isTrackingRef = useRef(false);
  // Store a stable reference to the listener object so we can remove it on unmount
  const listenerRef = useRef<LocationServiceListeners | null>(null);

  const handleLocationUpdate = useCallback((point: GPSPoint) => {
    setLocation(point);
    setError(null);
  }, []);

  const handleError = useCallback((type: LocationErrorType, message: string) => {
    setError({ type, message });
    setIsTracking(false);
    isTrackingRef.current = false;
  }, []);

  const handleAccuracyWarning = useCallback((accuracy: number) => {
    setAccuracyWarning(accuracy);
  }, []);

  const startTracking = useCallback(() => {
    setError(null);
    const listener: LocationServiceListeners = {
      onLocationUpdate: handleLocationUpdate,
      onError: handleError,
      onAccuracyWarning: handleAccuracyWarning,
    };
    listenerRef.current = listener;
    const started = locationService.startTracking(listener);
    setIsTracking(started);
    isTrackingRef.current = started;
    return started;
  }, [handleLocationUpdate, handleError, handleAccuracyWarning]);

  const stopTracking = useCallback(() => {
    if (listenerRef.current) {
      locationService.removeListener(listenerRef.current);
      listenerRef.current = null;
    }
    setIsTracking(false);
    isTrackingRef.current = false;
  }, []);

  const injectPoint = useCallback((point: GPSPoint) => {
    locationService.injectSimulatedPoint(point);
    setLocation(point);
  }, []);

  useEffect(() => {
    if (autoStart) {
      startTracking();
    }

    return () => {
      // Mandatory cleanup guarantee: remove this component's listener from the singleton
      if (listenerRef.current) {
        locationService.removeListener(listenerRef.current);
        listenerRef.current = null;
      }
      isTrackingRef.current = false;
    };
  }, [autoStart, startTracking]);

  return {
    location,
    error,
    accuracyWarning,
    isTracking,
    startTracking,
    stopTracking,
    injectPoint,
  };
};
