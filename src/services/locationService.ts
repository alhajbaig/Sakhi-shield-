// Walk With Me - Centralized Location Manager & Pipeline Service
// Guarantees ONE active hardware GPS watcher, delegating to normalized LocationProvider

import { BrowserLocationProvider } from './location/BrowserLocationProvider';
import type { LocationProvider } from './location/LocationProvider';
import type { GPSPoint, LocationSample } from '../types/journey';

export type LocationErrorType =
  | 'PERMISSION_DENIED'
  | 'POSITION_UNAVAILABLE'
  | 'TIMEOUT'
  | 'UNSUPPORTED'
  | 'LOW_ACCURACY';

export interface LocationServiceListeners {
  onLocationUpdate: (point: GPSPoint) => void;
  onError?: (type: LocationErrorType, message: string) => void;
  onAccuracyWarning?: (accuracy: number) => void;
  onVisibilityChange?: (visibility: 'VISIBLE' | 'BACKGROUND') => void;
}

class LocationService {
  private provider: LocationProvider;
  private lastAcceptedPoint: GPSPoint | null = null;
  private listeners: Set<LocationServiceListeners> = new Set();
  private isSimulatedMode = false;
  private isProviderStarted = false;

  constructor() {
    this.provider = new BrowserLocationProvider();
  }

  public isSimulated(): boolean {
    return this.isSimulatedMode;
  }

  public getLastAcceptedPoint(): GPSPoint | null {
    return this.lastAcceptedPoint;
  }

  // Start GPS tracking
  public startTracking(listeners: LocationServiceListeners): boolean {
    this.listeners.add(listeners);

    if (this.lastAcceptedPoint) {
      listeners.onLocationUpdate(this.lastAcceptedPoint);
    }

    if (this.isProviderStarted) {
      // Hardware watcher already active, listener attached
      return true;
    }

    this.isProviderStarted = true;
    this.provider.start({
      onLocationUpdate: (sample: LocationSample) => {
        this.lastAcceptedPoint = sample;
        this.listeners.forEach((l) => l.onLocationUpdate(sample));
      },
      onError: (type: string, message: string) => {
        this.listeners.forEach((l) => l.onError?.(type as LocationErrorType, message));
      },
      onAccuracyWarning: (accuracy: number) => {
        this.listeners.forEach((l) => l.onAccuracyWarning?.(accuracy));
      },
      onVisibilityChange: (visibility: 'VISIBLE' | 'BACKGROUND') => {
        this.listeners.forEach((l) => l.onVisibilityChange?.(visibility));
      },
    });

    return true;
  }

  // Stop GPS watching and cleanly release hardware resources
  public stopTracking(): void {
    this.provider.stop();
    this.lastAcceptedPoint = null;
    this.listeners.clear();
    this.isProviderStarted = false;
  }

  // Remove specific listener — stops hardware if no listeners remain
  public removeListener(listener: LocationServiceListeners): void {
    this.listeners.delete(listener);
    if (this.listeners.size === 0) {
      this.provider.stop();
      this.lastAcceptedPoint = null;
      this.isProviderStarted = false;
    }
  }

  // Inject point for simulation/test mode
  public injectSimulatedPoint(point: GPSPoint): void {
    this.isSimulatedMode = true;
    this.lastAcceptedPoint = point;
    this.listeners.forEach((l) => l.onLocationUpdate(point));
  }
}

// Global Singleton Instance
export const locationService = new LocationService();
