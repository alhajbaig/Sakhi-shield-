// Walk With Me - Journey Type Definitions (Hardened Production Schema)

export type JourneyStatus =
  | 'PLANNED'
  | 'ACTIVE'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'ESCALATED';

export type JourneyLifecycleState =
  | 'IDLE'
  | 'SETTING_UP'
  | 'ROUTE_READY'
  | 'STARTING'
  | 'ACTIVE'
  | 'CHECK_IN_REQUIRED'
  | 'SUSPICION'
  | 'FINAL_CHECK_IN'
  | 'UNCOMFORTABLE'
  | 'HELP_REQUESTED'
  | 'ESCALATING'
  | 'ARRIVED'
  | 'COMPLETING'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'ERROR';

export type JourneyEventType =
  | 'JOURNEY_STARTED'
  | 'JOURNEY_RESUMED'
  | 'LOCATION_UPDATE'
  | 'ROUTE_DEVIATION'
  | 'ROUTE_UPDATED'
  | 'UNEXPECTED_STOP'
  | 'ETA_EXCEEDED'
  | 'GPS_LOW_ACCURACY'
  | 'GPS_UNAVAILABLE'
  | 'GPS_RECOVERED'
  | 'LOCATION_GAP'
  | 'CHECK_IN_REQUESTED'
  | 'CHECK_IN_SAFE'
  | 'CHECK_IN_UNCOMFORTABLE'
  | 'HELP_REQUESTED'
  | 'LOCATION_SHARED'
  | 'TRUSTED_CONTACT_NOTIFIED'
  | 'SOS_TRIGGERED'
  | 'ARRIVAL_CANDIDATE'
  | 'ARRIVED'
  | 'JOURNEY_COMPLETED';

export type RiskLevel = 'SAFE' | 'ATTENTION' | 'HIGH_RISK' | 'CRITICAL';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export type LocationSource = 'BROWSER_GEOLOCATION' | 'SIMULATED' | 'NATIVE_PLUGIN';
export type LocationConfidence = 'EXCELLENT' | 'GOOD' | 'DEGRADED' | 'POOR' | 'UNAVAILABLE';

// Normalized Location Model (Architecture Rule: Standardized input for all engines)
export interface LocationSample extends Coordinates {
  accuracy: number;
  speed: number | null;
  heading: number | null;
  altitude: number | null;
  timestamp: number;
  source?: LocationSource;
  confidence?: LocationConfidence;
  isSuspicious?: boolean;
}

// GPSPoint backward compatible alias for LocationSample
export interface GPSPoint extends LocationSample {}

export interface RouteGeometry {
  type: 'LineString';
  coordinates: [number, number][]; // [longitude, latitude] per GeoJSON standard
}

export interface RouteStep {
  instruction: string;
  distance: number;
  duration: number;
}

export interface JourneyRoute {
  id?: string;
  version?: number;
  geometry: RouteGeometry;
  distanceMeters: number;
  durationSeconds: number;
  steps?: RouteStep[];
  created_at?: string;
}

export interface Journey {
  id: string;
  user_id: string;
  destination_name: string;
  destination_lat: number;
  destination_lng: number;
  start_lat: number;
  start_lng: number;
  route_geometry: RouteGeometry;
  distance_meters: number;
  expected_arrival: string; // ISO String
  estimated_arrival: string; // Dynamic updated ISO String
  status: JourneyStatus;
  risk_score: number; // 0 to 100
  risk_level: RiskLevel;
  route_version?: number;
  active_route_id?: string;
  monitoring_started_at?: string;
  started_at: string;
  ended_at?: string;
  created_at: string;
  updated_at: string;
}

export interface JourneyEvent {
  id: string;
  journey_id: string;
  user_id: string;
  event_type: JourneyEventType;
  timestamp: string;
  latitude?: number;
  longitude?: number;
  accuracy?: number;
  metadata?: Record<string, unknown>;
}

export type CheckInState =
  | 'NONE'
  | 'REQUESTED'
  | 'VISIBLE'
  | 'BACKGROUND'
  | 'RESPONDED'
  | 'TIMED_OUT'
  | 'ESCALATED'
  | 'CANCELLED';

export interface CheckInSession {
  id: string;
  journey_id: string;
  timestamp: string;
  started_at: number; // Monotonic / epoch millisecond
  deadline: number; // started_at + timeout (Resilient to background sleep)
  reason: string;
  state: CheckInState;
  status: 'PENDING' | 'SAFE' | 'UNCOMFORTABLE' | 'NEED_HELP' | 'TIMEOUT';
  response?: 'SAFE' | 'UNCOMFORTABLE' | 'NEED_HELP';
  response_time?: string;
  timeout_seconds: number;
  /** Two-stage check-in: FIRST = initial, FINAL = last warning before full alert */
  stage?: 'FIRST' | 'FINAL';
}

export type EscalationState =
  | 'NONE'
  | 'ATTENTION'
  | 'CHECK_IN_REQUESTED'
  | 'USER_SAFE'
  | 'USER_UNCOMFORTABLE'
  | 'HELP_REQUESTED'
  | 'ESCALATION_PENDING'
  | 'ESCALATION_SENT'
  | 'ESCALATION_CONFIRMED'
  | 'ESCALATION_FAILED'
  | 'RESOLVED';

export type EventSyncStatus = 'PENDING' | 'SYNCING' | 'SYNCED' | 'FAILED' | 'DEAD_LETTER';

export type QueueOperationType =
  | 'CREATE_JOURNEY'
  | 'UPDATE_JOURNEY'
  | 'CREATE_JOURNEY_EVENT'
  | 'CREATE_RISK_EVENT'
  | 'UPDATE_JOURNEY_STATUS'
  | 'CREATE_ALERT';

export type QueueEntityType = 'journey' | 'journey_event' | 'risk_event' | 'alert';

export interface QueuedSafetyEvent {
  event_id: string;
  operationType: QueueOperationType;
  eventType: JourneyEventType;
  entityType: QueueEntityType;
  entityId: string;
  journey_id: string;
  user_id: string;
  client_timestamp: number;
  payload: Record<string, unknown>;
  retry_count: number;
  created_at: string;
  sync_status: EventSyncStatus;
  idempotency_key?: string;
  error_message?: string | null;
  // Backward compatibility alias for legacy code
  event_type?: JourneyEventType;
}
