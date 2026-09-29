// SakhiShield — Privacy Validation Utilities

import type {
  PrivacyPreferences,
  GpsRetentionWindow,
  LocationPrivacyMode,
  EvidenceRetentionHorizon,
  NotificationPrivacyLevel,
} from '../types/privacy.types';

const VALID_GPS_RETENTIONS: Set<GpsRetentionWindow> = new Set([
  'SESSION_ONLY',
  '24_HOURS',
  '7_DAYS',
  '30_DAYS',
  'MANUAL_ONLY',
]);

const VALID_LOCATION_MODES: Set<LocationPrivacyMode> = new Set([
  'PRECISE',
  'APPROXIMATE_1KM',
  'EMERGENCY_ONLY',
]);

const VALID_EVIDENCE_RETENTIONS: Set<EvidenceRetentionHorizon> = new Set([
  '7_DAYS',
  '30_DAYS',
  '90_DAYS',
  'MANUAL_DELETION',
]);

const VALID_NOTIFICATION_PRIVACY: Set<NotificationPrivacyLevel> = new Set([
  'FULL_DETAILS',
  'MINIMAL_DETAILS',
  'HIDE_SENSITIVE',
]);

export function validatePrivacyPreferences(prefs: Partial<PrivacyPreferences>): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (prefs.gpsRetention && !VALID_GPS_RETENTIONS.has(prefs.gpsRetention)) {
    errors.push(`Invalid GPS retention window: ${prefs.gpsRetention}`);
  }

  if (prefs.locationMode && !VALID_LOCATION_MODES.has(prefs.locationMode)) {
    errors.push(`Invalid location privacy mode: ${prefs.locationMode}`);
  }

  if (prefs.evidenceRetention && !VALID_EVIDENCE_RETENTIONS.has(prefs.evidenceRetention)) {
    errors.push(`Invalid evidence retention horizon: ${prefs.evidenceRetention}`);
  }

  if (prefs.notificationPrivacy && !VALID_NOTIFICATION_PRIVACY.has(prefs.notificationPrivacy)) {
    errors.push(`Invalid notification privacy level: ${prefs.notificationPrivacy}`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
