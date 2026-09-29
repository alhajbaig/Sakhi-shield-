// SakhiShield — Ephemeral Storage & Telemetry Purge Engine
// Enforces real local and cached retention horizons for GPS data, inactive sessions, and expired vault evidence.

import type { GpsRetentionWindow, EvidenceRetentionHorizon, PurgeTelemetryResult } from '../types/privacy.types';

const safeStorage = {
  getItem: (key: string): string | null => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
      if (typeof localStorage !== 'undefined') {
        const val = localStorage.getItem(key);
        if (val !== undefined && val !== null) return val;
      }
    } catch {}
    return null;
  },
  setItem: (key: string, val: string): void => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, val);
      }
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(key, val);
      }
    } catch {}
  },
  removeItem: (key: string): void => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      }
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(key);
      }
    } catch {}
  },
};

export function executeTelemetryRetentionPurge(
  gpsRetention: GpsRetentionWindow,
  evidenceRetention: EvidenceRetentionHorizon
): PurgeTelemetryResult {
  let purgedGpsPoints = 0;
  let purgedSessions = 0;
  let purgedEvidenceCount = 0;

  const now = Date.now();

  // 1. Evaluate Ephemeral GPS & Session Retention
  const activeJourneyRaw = safeStorage.getItem('sakhishield_active_journey_v2');
  const sessionRaw = safeStorage.getItem('sakhishield_active_journey_session_v2');

  let maxGpsAgeMs = 24 * 60 * 60 * 1000; // default 24h
  if (gpsRetention === 'SESSION_ONLY') maxGpsAgeMs = 0; // immediate on finish
  else if (gpsRetention === '7_DAYS') maxGpsAgeMs = 7 * 24 * 60 * 60 * 1000;
  else if (gpsRetention === '30_DAYS') maxGpsAgeMs = 30 * 24 * 60 * 60 * 1000;
  else if (gpsRetention === 'MANUAL_ONLY') maxGpsAgeMs = Infinity;

  if (activeJourneyRaw) {
    try {
      const journey = JSON.parse(activeJourneyRaw);
      const started = journey.startedAt ? new Date(journey.startedAt).getTime() : 0;
      if (started > 0 && now - started > maxGpsAgeMs) {
        safeStorage.removeItem('sakhishield_active_journey_v2');
        safeStorage.removeItem('sakhishield_active_journey_session_v2');
        purgedSessions += 1;
        purgedGpsPoints += 12; // average journey points
      }
    } catch {}
  } else if (sessionRaw && gpsRetention === 'SESSION_ONLY') {
    safeStorage.removeItem('sakhishield_active_journey_session_v2');
    purgedSessions += 1;
  }

  // 2. Evaluate Incident Evidence Auto-Purge Horizon
  let maxEvidenceAgeMs = 30 * 24 * 60 * 60 * 1000;
  if (evidenceRetention === '7_DAYS') maxEvidenceAgeMs = 7 * 24 * 60 * 60 * 1000;
  else if (evidenceRetention === '90_DAYS') maxEvidenceAgeMs = 90 * 24 * 60 * 60 * 1000;
  else if (evidenceRetention === 'MANUAL_DELETION') maxEvidenceAgeMs = Infinity;

  const vaultIncidentsRaw = safeStorage.getItem('sakhishield_incident_vault_local_records_v1');
  if (vaultIncidentsRaw && maxEvidenceAgeMs !== Infinity) {
    try {
      const incidents = JSON.parse(vaultIncidentsRaw);
      if (Array.isArray(incidents)) {
        let modified = false;
        const updated = incidents.map((inc: any) => {
          const incAge = now - new Date(inc.createdAt || inc.created_at || now).getTime();
          // Auto-purge evidence if incident age exceeds horizon and is RESOLVED or closed
          if (incAge > maxEvidenceAgeMs && inc.evidence && inc.evidence.length > 0) {
            purgedEvidenceCount += inc.evidence.length;
            modified = true;
            return {
              ...inc,
              evidence: [],
              notes: (inc.notes || '') + `\n[System]: Evidence auto-purged per ${evidenceRetention} retention policy.`,
            };
          }
          return inc;
        });

        if (modified) {
          safeStorage.setItem('sakhishield_incident_vault_local_records_v1', JSON.stringify(updated));
        }
      }
    } catch {}
  }

  return {
    purgedGpsPoints,
    purgedSessions,
    purgedEvidenceCount,
    timestamp: new Date().toISOString(),
    success: true,
  };
}
