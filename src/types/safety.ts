// Walk With Me - Safety & Risk Engine Type Definitions (Hardened Schema)
import type { RiskLevel } from './journey';

export type RouteDeviationState =
  | 'ON_ROUTE'
  | 'MINOR_DEVIATION'
  | 'SIGNIFICANT_DEVIATION'
  | 'MAJOR_DEVIATION';

export type StopDetectionState =
  | 'MOVING'
  | 'POSSIBLY_STOPPED'
  | 'STOP_CONFIRMED'
  | 'LOCATION_UNCERTAIN';

export type RiskSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface RiskEvent {
  id: string;
  journey_id: string;
  event_type: string;
  severity: RiskSeverity;
  score_delta: number;
  reason: string;
  metadata?: Record<string, unknown>;
  timestamp: string;
}

export type SafetySignalType =
  | 'LATE_NIGHT'
  | 'ROUTE_DEVIATION'
  | 'UNEXPECTED_STOP'
  | 'ETA_EXCEEDED'
  | 'MISSED_CHECK_IN'
  | 'EMERGENCY_SOS';

export interface SafetySignal {
  signal_id: string;
  type: SafetySignalType;
  created_at: number;
  active: boolean;
  resolved_at?: number;
  score_contribution: number;
  reason: string;
}

export interface RiskEngineInputs {
  lateNight?: boolean;
  routeDeviation?: boolean;
  unexpectedStop?: boolean;
  etaExceeded?: boolean;
  missedCheckIn?: boolean;
  signals?: SafetySignal[];
}

export interface RiskEngineResult {
  score: number; // 0 to 100
  level: RiskLevel;
  reasons: string[];
  triggeredSignals: string[];
  activeSignals?: SafetySignal[];
}

export type SafePlaceCategory =
  | 'HOSPITAL'
  | 'POLICE'
  | 'PHARMACY'
  | 'CAFE'
  | 'PUBLIC_HAVEN'
  | 'FUEL_STATION';

export interface SafePlace {
  id: string;
  name: string;
  category: SafePlaceCategory;
  address: string;
  latitude: number;
  longitude: number;
  distanceMeters?: number;
  openNow?: boolean;
  phone?: string;
}

// ----------------------------------------------------
// Monitoring Health Engine Types (Section 4, 5)
// ----------------------------------------------------
export type GPSHealth = 'EXCELLENT' | 'GOOD' | 'DEGRADED' | 'POOR' | 'UNAVAILABLE';
export type NetworkHealth = 'ONLINE' | 'OFFLINE';
export type MapHealth = 'HEALTHY' | 'DEGRADED' | 'OFFLINE';
export type DatabaseHealth = 'HEALTHY' | 'BUFFERED_LOCAL' | 'OFFLINE' | 'AUTH_EXPIRED';
export type NotificationHealth = 'AVAILABLE' | 'DENIED' | 'UNSUPPORTED' | 'FAILED';
export type ServiceWorkerHealth = 'ACTIVE' | 'INACTIVE' | 'UNSUPPORTED';
export type AppVisibility = 'VISIBLE' | 'BACKGROUND';
export type DeviceCapability = 'MOBILE' | 'DESKTOP' | 'TABLET';

export type OverallMonitoringState =
  | 'FULL'
  | 'DEGRADED'
  | 'LIMITED'
  | 'OFFLINE'
  | 'UNAVAILABLE';

export interface MonitoringHealthStatus {
  overall: OverallMonitoringState;
  gps: GPSHealth;
  network: NetworkHealth;
  map: MapHealth;
  database: DatabaseHealth;
  notifications: NotificationHealth;
  serviceWorker: ServiceWorkerHealth;
  visibility: AppVisibility;
  device: DeviceCapability;
  userMessage: string;
  lastChecked: number;
}
