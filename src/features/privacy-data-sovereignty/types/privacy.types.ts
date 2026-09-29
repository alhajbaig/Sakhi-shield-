// SakhiShield — Privacy & Data Sovereignty Type Contracts

export type GpsRetentionWindow =
  | 'SESSION_ONLY'
  | '24_HOURS'
  | '7_DAYS'
  | '30_DAYS'
  | 'MANUAL_ONLY';

export type LocationPrivacyMode =
  | 'PRECISE'
  | 'APPROXIMATE_1KM'
  | 'EMERGENCY_ONLY';

export type EvidenceRetentionHorizon =
  | '7_DAYS'
  | '30_DAYS'
  | '90_DAYS'
  | 'MANUAL_DELETION';

export type NotificationPrivacyLevel =
  | 'FULL_DETAILS'
  | 'MINIMAL_DETAILS'
  | 'HIDE_SENSITIVE';

export interface PrivacyPreferences {
  userId: string;
  gpsRetention: GpsRetentionWindow;
  locationMode: LocationPrivacyMode;
  evidenceRetention: EvidenceRetentionHorizon;
  localParsingEnforced: boolean;
  telemetryOptIn: boolean;
  notificationPrivacy: NotificationPrivacyLevel;
  lastPurgeTimestamp?: string;
  updatedAt: string;
}

export type PrivacyEventType =
  | 'RETENTION_POLICY_UPDATED'
  | 'LOCAL_PARSING_ENFORCED'
  | 'DATA_EXPORT_GENERATED'
  | 'EPHEMERAL_GPS_PURGED'
  | 'DATA_DELETION_REQUESTED'
  | 'LOCATION_MODE_CHANGED'
  | 'TELEMETRY_OPT_UPDATED';

export interface PrivacyAuditEvent {
  id: string;
  userId: string;
  eventType: PrivacyEventType;
  details: string;
  timestamp: string;
}

export interface PurgeTelemetryResult {
  purgedGpsPoints: number;
  purgedSessions: number;
  purgedEvidenceCount: number;
  timestamp: string;
  success: boolean;
}

export interface DataExportPayload {
  exportMetadata: {
    system: string;
    version: string;
    exportedAt: string;
    userId: string;
    sha256Checksum?: string;
  };
  profile: {
    fullName: string;
    email: string;
    phone?: string;
  };
  privacySettings: PrivacyPreferences;
  trustedCircleCount: number;
  safetyHistoryCount: number;
  incidentVaultSummary: {
    totalIncidents: number;
    totalEvidenceFiles: number;
  };
}
