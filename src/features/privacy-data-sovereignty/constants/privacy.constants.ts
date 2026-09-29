// SakhiShield — Privacy & Data Sovereignty Constants

import type { PrivacyPreferences } from '../types/privacy.types';

export const PRIVACY_STORAGE_KEYS = {
  PREFERENCES: 'sakhishield_privacy_preferences_v1',
  AUDIT_LOG: 'sakhishield_privacy_audit_events_v1',
  LAST_PURGE: 'sakhishield_privacy_last_purge_v1',
};

export const DEFAULT_PRIVACY_PREFERENCES: PrivacyPreferences = {
  userId: 'usr_default',
  gpsRetention: '24_HOURS',
  locationMode: 'PRECISE',
  evidenceRetention: '30_DAYS',
  localParsingEnforced: true,
  telemetryOptIn: false,
  notificationPrivacy: 'MINIMAL_DETAILS',
  lastPurgeTimestamp: undefined,
  updatedAt: new Date().toISOString(),
};

export const GPS_RETENTION_OPTIONS = [
  {
    id: 'SESSION_ONLY',
    label: 'Session Only',
    description: 'Purged automatically immediately when Walk With Me ends.',
  },
  {
    id: '24_HOURS',
    label: '24 Hours',
    description: 'Ephemeral 24-hour buffer for safety review, then auto-purged.',
  },
  {
    id: '7_DAYS',
    label: '7 Days',
    description: 'Preserved for 7 days to assist incident reporting, then deleted.',
  },
  {
    id: '30_DAYS',
    label: '30 Days',
    description: 'Extended corridor history for recurring commute safety analysis.',
  },
  {
    id: 'MANUAL_ONLY',
    label: 'Manual Only',
    description: 'Retained until explicitly purged via Data Deletion control.',
  },
] as const;

export const EVIDENCE_RETENTION_OPTIONS = [
  {
    id: '7_DAYS',
    label: '7 Days Auto-Purge',
    description: 'Cryptographic files purged 7 days after incident resolution.',
  },
  {
    id: '30_DAYS',
    label: '30 Days Standard',
    description: 'Standard 30-day evidence retention horizon.',
  },
  {
    id: '90_DAYS',
    label: '90 Days Extended',
    description: 'Preserved 90 days for pending disputes or official complaints.',
  },
  {
    id: 'MANUAL_DELETION',
    label: 'Manual Deletion Only',
    description: 'Permanent vault storage until owner explicitly deletes items.',
  },
] as const;

export const LOCATION_PRIVACY_OPTIONS = [
  {
    id: 'PRECISE',
    label: 'Precise GPS',
    description: 'Exact coordinates shared with guardians during active walks and SOS.',
  },
  {
    id: 'APPROXIMATE_1KM',
    label: 'Approximate Corridor (~1km)',
    description: 'Fuzzy coordinates for routine monitoring; reveals precise only on SOS.',
  },
  {
    id: 'EMERGENCY_ONLY',
    label: 'Emergency Only',
    description: 'Zero location transmission during regular walks; transmits ONLY on SOS.',
  },
] as const;

export const NOTIFICATION_PRIVACY_OPTIONS = [
  {
    id: 'MINIMAL_DETAILS',
    label: 'Minimal Details (Recommended)',
    description: 'Shows status ("Check-in required") without revealing destination or coordinates.',
  },
  {
    id: 'HIDE_SENSITIVE',
    label: 'Mask Sensitive Data',
    description: 'Displays generic "SakhiShield Notification" on system lock screen.',
  },
  {
    id: 'FULL_DETAILS',
    label: 'Full Details',
    description: 'Displays complete journey destination, route alerts, and guardian names.',
  },
] as const;
