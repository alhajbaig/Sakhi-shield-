// SakhiShield — Safety History & Telemetry Audit Data Models

export type HistoryCategory = 'ALL' | 'WALK_WITH_ME' | 'CHECK_IN' | 'SOS_ESCALATION' | 'CORRIDOR_ALERT';

export type HistoryStatus = 'SAFE_ARRIVAL' | 'RESOLVED_STAND_DOWN' | 'CHECK_IN_CONFIRMED' | 'ALERT_CLEARED';

export type TransitMode = 'Walking' | 'Metro / Transit' | 'Cab / Ride' | 'Automated Check-in' | 'Emergency Drill';

export interface CheckInLog {
  time: string;
  label: string;
  type: 'INITIATION' | 'SCHEDULED_CHECKIN' | 'SAFE_ZONE_ENTRY' | 'ANOMALY_CLEARED' | 'COMPLETION';
  status: 'VERIFIED' | 'SYSTEM_AUTO' | 'CLEARED';
  notes?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface GuardianNotificationReceipt {
  name: string;
  relationship: string;
  phone: string;
  status: 'Delivered' | 'Acknowledged' | 'Live Stream Viewed';
  timestamp: string;
}

export interface SafetyHistoryRecord {
  id: string;
  title: string;
  category: Exclude<HistoryCategory, 'ALL'>;
  status: HistoryStatus;
  startedAt: string; // ISO
  endedAt: string; // ISO
  dateFormatted: string; // e.g., "Sep 27, 2026"
  timeRange: string; // e.g., "23:42 – 00:18 IST"
  origin: string;
  destination: string;
  transitMode: TransitMode;
  distanceKm: number;
  durationMin: number;
  corridorScore: number; // 0 - 100
  corridorDetails: {
    illuminationPct: number;
    safeSpotsCount: number;
    cctvCoverage: 'High' | 'Medium' | 'Full';
    primaryCorridor: string;
  };
  guardiansNotified: GuardianNotificationReceipt[];
  checkIns: CheckInLog[];
  cryptographicHash: string; // SHA-256 for legal dossier audit
  telemetry: {
    avgBatteryPct: number;
    networkReliability: string;
    gpsPrecisionMeters: number;
    deviceModel?: string;
  };
  summary: string;
  isDemo?: boolean;
}

export interface SafetyHistoryFilterState {
  category: HistoryCategory;
  searchQuery: string;
  dateRange: 'ALL' | '7_DAYS' | '30_DAYS';
  status: 'ALL' | HistoryStatus;
}
