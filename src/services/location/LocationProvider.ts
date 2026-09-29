// Walk With Me - Normalized Location Provider Interface
// Decouples the safety engine from browser-specific navigator.geolocation for future native migration

import type { LocationSample } from '../../types/journey';

export interface LocationProviderListeners {
  onLocationUpdate: (sample: LocationSample) => void;
  onError?: (type: string, message: string) => void;
  onAccuracyWarning?: (accuracy: number) => void;
  onVisibilityChange?: (visibility: 'VISIBLE' | 'BACKGROUND') => void;
}

export interface LocationProvider {
  readonly id: string;
  start(listeners: LocationProviderListeners): Promise<boolean>;
  stop(): void;
  getCurrentLocation(): Promise<LocationSample | null>;
  isAvailable(): boolean;
}
