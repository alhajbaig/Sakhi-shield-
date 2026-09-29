// Walk With Me - Production Browser Location Provider
// Implements Screen Wake Lock, Visibility API, Teleportation 2.0 filtering, and EMA smoothing

import type { LocationProvider, LocationProviderListeners } from './LocationProvider';
import type { LocationSample, LocationConfidence } from '../../types/journey';
import { calculateDistanceMeters } from '../routeService';
import { SAFETY_THRESHOLDS } from '../../config/safetyThresholds';

export class BrowserLocationProvider implements LocationProvider {
  public readonly id = 'BROWSER_GEOLOCATION';
  private watchId: number | null = null;
  private pollingTimer: any = null;
  private lastPositionTimestamp: number = 0;
  private listeners: LocationProviderListeners | null = null;
  private lastAcceptedSample: LocationSample | null = null;
  private wakeLockSentinel: any = null;
  private visibilityHandler: (() => void) | null = null;

  public isAvailable(): boolean {
    return typeof window !== 'undefined' && 'geolocation' in navigator;
  }

  public async start(listeners: LocationProviderListeners): Promise<boolean> {
    this.listeners = listeners;

    if (!this.isAvailable()) {
      listeners.onError?.('UNSUPPORTED', 'Geolocation hardware API is not supported by your browser.');
      return false;
    }

    // 1. Request Screen Wake Lock to prevent mobile screen sleep during walk
    await this.acquireWakeLock();

    // 2. Attach Page Visibility Listener
    this.setupVisibilityListener();

    // 3. Immediate Fast-Lock: Fetch current position right away so map has position in ms
    this.getCurrentLocation().then((immediateSample) => {
      if (immediateSample && this.listeners) {
        this.lastPositionTimestamp = Date.now();
        this.lastAcceptedSample = immediateSample;
        this.listeners.onLocationUpdate(immediateSample);
      }
    });

    // 4. Start Geolocation Hardware Watcher
    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 8000,
      maximumAge: 2000, // 2-second cached fix allowed to prevent hardware thrashing and desktop timeout
    };

    try {
      this.watchId = navigator.geolocation.watchPosition(
        (pos) => this.handleRawPosition(pos),
        (err) => this.handleError(err),
        options
      );

      // 5. Active Continuous Polling Fallback (ensures smooth real-time stream if watchPosition pauses or user stops)
      if (this.pollingTimer) clearInterval(this.pollingTimer);
      this.pollingTimer = setInterval(async () => {
        if (!this.listeners) return;
        const now = Date.now();
        // If no update from watchPosition in the last 3.5 seconds, fetch fresh sample
        if (now - this.lastPositionTimestamp > 3500) {
          const fresh = await this.getCurrentLocation();
          if (fresh && this.listeners) {
            this.handleRawPosition({
              coords: {
                latitude: fresh.latitude,
                longitude: fresh.longitude,
                accuracy: fresh.accuracy,
                altitude: fresh.altitude,
                altitudeAccuracy: null,
                heading: fresh.heading,
                speed: fresh.speed,
              },
              timestamp: Date.now(),
            } as GeolocationPosition);
          }
        }
      }, 3000);

      return true;
    } catch {
      listeners.onError?.('POSITION_UNAVAILABLE', 'Failed to initialize geolocation hardware watcher.');
      return false;
    }
  }

  public stop(): void {
    if (this.watchId !== null && typeof window !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }

    if (this.pollingTimer) {
      clearInterval(this.pollingTimer);
      this.pollingTimer = null;
    }

    this.releaseWakeLock();

    if (this.visibilityHandler && typeof document !== 'undefined') {
      document.removeEventListener('visibilitychange', this.visibilityHandler);
      this.visibilityHandler = null;
    }

    this.lastAcceptedSample = null;
    this.listeners = null;
  }

  public async getCurrentLocation(): Promise<LocationSample | null> {
    if (!this.isAvailable()) return null;

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const sample = this.normalizePosition(pos);
          resolve(sample);
        },
        () => resolve(this.lastAcceptedSample),
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    });
  }

  // --- Internal Pipelines ---

  private handleRawPosition(position: GeolocationPosition): void {
    const rawSample = this.normalizePosition(position);
    const now = Date.now();

    // 1. Stale-point rejection (>60s old or from clock skew)
    if (Math.abs(now - rawSample.timestamp) > SAFETY_THRESHOLDS.GPS_QUALITY.STALE_THRESHOLD_MS) {
      return;
    }

    // 2. Teleportation 2.0 & Outlier Quarantine
    if (this.lastAcceptedSample) {
      const distance = calculateDistanceMeters(this.lastAcceptedSample, rawSample);
      const deltaTimeSeconds = Math.max(0.5, (rawSample.timestamp - this.lastAcceptedSample.timestamp) / 1000);
      const impliedSpeedMps = distance / deltaTimeSeconds;

      // Walking speed sanity threshold (~20 m/s = 72 km/h outlier)
      if (impliedSpeedMps > 20 && rawSample.accuracy > 25) {
        rawSample.isSuspicious = true;
        rawSample.confidence = 'POOR';
        // Quarantine point: notify accuracy warning, do not accept as movement baseline
        this.listeners?.onAccuracyWarning?.(rawSample.accuracy);
        return;
      }
    }

    // 3. Jitter Smoothing Filter (Exponential Moving Average)
    let smoothedLat = rawSample.latitude;
    let smoothedLng = rawSample.longitude;

    if (this.lastAcceptedSample && !rawSample.isSuspicious) {
      const alpha = rawSample.accuracy < 15 ? 0.90 : rawSample.accuracy < 35 ? 0.75 : 0.50;
      smoothedLat = alpha * rawSample.latitude + (1 - alpha) * this.lastAcceptedSample.latitude;
      smoothedLng = alpha * rawSample.longitude + (1 - alpha) * this.lastAcceptedSample.longitude;
    }

    const acceptedSample: LocationSample = {
      ...rawSample,
      latitude: smoothedLat,
      longitude: smoothedLng,
    };

    this.lastPositionTimestamp = now;
    this.lastAcceptedSample = acceptedSample;
    this.listeners?.onLocationUpdate(acceptedSample);
  }

  private normalizePosition(position: GeolocationPosition): LocationSample {
    const coords = position.coords;
    const accuracy = coords.accuracy;

    let confidence: LocationConfidence = 'GOOD';
    if (accuracy <= 20) confidence = 'EXCELLENT';
    else if (accuracy <= 50) confidence = 'GOOD';
    else if (accuracy <= 150) confidence = 'DEGRADED';
    else confidence = 'POOR';

    return {
      latitude: coords.latitude,
      longitude: coords.longitude,
      accuracy,
      speed: coords.speed !== null && coords.speed >= 0 ? coords.speed : null,
      heading: coords.heading !== null && coords.heading >= 0 ? coords.heading : null,
      altitude: coords.altitude,
      timestamp: position.timestamp || Date.now(),
      source: 'BROWSER_GEOLOCATION',
      confidence,
      isSuspicious: false,
    };
  }

  private async acquireWakeLock(): Promise<void> {
    if (typeof navigator !== 'undefined' && 'wakeLock' in navigator) {
      try {
        this.wakeLockSentinel = await (navigator as any).wakeLock.request('screen');
      } catch {
        // Silently continue if wake lock is denied
      }
    }
  }

  private releaseWakeLock(): void {
    if (this.wakeLockSentinel) {
      try {
        this.wakeLockSentinel.release();
      } catch {
        // Ignore
      }
      this.wakeLockSentinel = null;
    }
  }

  private setupVisibilityListener(): void {
    if (typeof document === 'undefined') return;

    this.visibilityHandler = async () => {
      const isVisible = document.visibilityState === 'visible';
      this.listeners?.onVisibilityChange?.(isVisible ? 'VISIBLE' : 'BACKGROUND');

      if (isVisible) {
        // Tab restored to foreground: re-acquire wake lock and trigger fresh position sync
        await this.acquireWakeLock();
        const fresh = await this.getCurrentLocation();
        if (fresh) {
          this.handleRawPosition({
            coords: {
              latitude: fresh.latitude,
              longitude: fresh.longitude,
              accuracy: fresh.accuracy,
              altitude: fresh.altitude,
              altitudeAccuracy: null,
              heading: fresh.heading,
              speed: fresh.speed,
            },
            timestamp: Date.now(),
          } as GeolocationPosition);
        }
      }
    };

    document.addEventListener('visibilitychange', this.visibilityHandler);
  }

  private handleError(error: GeolocationPositionError): void {
    let type = 'POSITION_UNAVAILABLE';
    let message = 'Location signal temporarily unavailable.';

    if (error.code === error.PERMISSION_DENIED) {
      type = 'PERMISSION_DENIED';
      message = 'Location access permission was denied. Please allow location to enable journey monitoring.';
    } else if (error.code === error.TIMEOUT) {
      type = 'TIMEOUT';
      message = 'Satellite signal acquisition timed out. Re-attempting lock...';
    }

    this.listeners?.onError?.(type, message);
  }
}
