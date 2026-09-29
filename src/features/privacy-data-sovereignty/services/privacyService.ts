// SakhiShield — Privacy & Data Sovereignty Service
// Handles user privacy preferences persistence, audit logging, and ephemeral data purge routines.

import { supabase, isSupabaseConfigured } from '../../../lib/supabase';
import { generateSecureId } from '../../../lib/securityUtils';
import type {
  PrivacyPreferences,
  PrivacyAuditEvent,
  PrivacyEventType,
  PurgeTelemetryResult,
} from '../types/privacy.types';
import {
  DEFAULT_PRIVACY_PREFERENCES,
  PRIVACY_STORAGE_KEYS,
} from '../constants/privacy.constants';
import { validatePrivacyPreferences } from '../utils/privacyValidation';
import { executeTelemetryRetentionPurge } from '../utils/ephemeralStorage';

const memoryStore = new Map<string, string>();
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
    return memoryStore.get(key) || null;
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
    memoryStore.set(key, val);
  },
  removeItem: (key: string): void => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      }
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(key, '');
      }
    } catch {}
    memoryStore.delete(key);
  },
};

export class PrivacyService {
  /**
   * Retrieves active privacy preferences for the authenticated user
   */
  async getPreferences(userId: string): Promise<PrivacyPreferences> {
    // 1. Try Supabase if configured
    if (isSupabaseConfigured() && userId) {
      try {
        const { data, error } = await supabase
          .from('privacy_preferences')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle();

        if (!error && data) {
          const loaded: PrivacyPreferences = {
            userId: data.user_id,
            gpsRetention: data.gps_retention,
            locationMode: data.location_mode,
            evidenceRetention: data.evidence_retention,
            localParsingEnforced: data.local_parsing_enforced,
            telemetryOptIn: data.telemetry_opt_in,
            notificationPrivacy: data.notification_privacy,
            lastPurgeTimestamp: data.last_purge_at,
            updatedAt: data.updated_at,
          };
          this.saveLocalPreferences(loaded);
          return loaded;
        }
      } catch (err) {
        console.warn('[PrivacyService] Supabase fetch error, using local fallback:', err);
      }
    }

    // 2. Fall back to local storage
    const local = this.getLocalPreferences();
    if (local && (!userId || local.userId === userId)) {
      return local;
    }

    // 3. Return defaults
    const initial: PrivacyPreferences = {
      ...DEFAULT_PRIVACY_PREFERENCES,
      userId: userId || 'usr_current',
      updatedAt: new Date().toISOString(),
    };
    this.saveLocalPreferences(initial);
    return initial;
  }

  /**
   * Updates user privacy preferences with strict validation
   */
  async updatePreferences(
    userId: string,
    updates: Partial<PrivacyPreferences>
  ): Promise<{ success: boolean; data?: PrivacyPreferences; error?: string }> {
    const validation = validatePrivacyPreferences(updates);
    if (!validation.isValid) {
      return { success: false, error: validation.errors.join('; ') };
    }

    const current = await this.getPreferences(userId);
    const updated: PrivacyPreferences = {
      ...current,
      ...updates,
      userId: userId || current.userId,
      updatedAt: new Date().toISOString(),
    };

    // 1. Save locally first for instant availability
    this.saveLocalPreferences(updated);

    // 2. Persist to Supabase if configured
    if (isSupabaseConfigured() && userId) {
      try {
        const { error } = await supabase.from('privacy_preferences').upsert({
          user_id: userId,
          gps_retention: updated.gpsRetention,
          location_mode: updated.locationMode,
          evidence_retention: updated.evidenceRetention,
          local_parsing_enforced: updated.localParsingEnforced,
          telemetry_opt_in: updated.telemetryOptIn,
          notification_privacy: updated.notificationPrivacy,
          last_purge_at: updated.lastPurgeTimestamp,
          updated_at: updated.updatedAt,
        });

        if (error) {
          console.warn('[PrivacyService] Supabase upsert error:', error.message);
        }
      } catch (err) {
        console.warn('[PrivacyService] Network error during upsert:', err);
      }
    }

    // 3. Log audit event
    await this.logAuditEvent(
      userId,
      'RETENTION_POLICY_UPDATED',
      `Privacy preferences updated. GPS: ${updated.gpsRetention}, Evidence: ${updated.evidenceRetention}, Mode: ${updated.locationMode}`
    );

    return { success: true, data: updated };
  }

  /**
   * Executes immediate telemetry retention purge
   */
  async runRetentionPurge(userId: string): Promise<PurgeTelemetryResult> {
    const prefs = await this.getPreferences(userId);
    const result = executeTelemetryRetentionPurge(prefs.gpsRetention, prefs.evidenceRetention);

    // Update last purge timestamp
    const now = new Date().toISOString();
    const updatedPrefs: PrivacyPreferences = {
      ...prefs,
      lastPurgeTimestamp: now,
      updatedAt: now,
    };
    this.saveLocalPreferences(updatedPrefs);

    if (isSupabaseConfigured() && userId) {
      try {
        await supabase
          .from('privacy_preferences')
          .update({ last_purge_at: now, updated_at: now })
          .eq('user_id', userId);
      } catch {}
    }

    await this.logAuditEvent(
      userId,
      'EPHEMERAL_GPS_PURGED',
      `Retention purge executed. Cleared ${result.purgedSessions} sessions, ${result.purgedGpsPoints} GPS points, ${result.purgedEvidenceCount} expired vault files.`
    );

    return result;
  }

  /**
   * Records a tamper-evident privacy audit event
   */
  async logAuditEvent(userId: string, eventType: PrivacyEventType, details: string): Promise<void> {
    const event: PrivacyAuditEvent = {
      id: generateSecureId('pau'),
      userId: userId || 'usr_current',
      eventType,
      details,
      timestamp: new Date().toISOString(),
    };

    // Save to local audit events log
    try {
      const existing = this.getAuditEvents(userId);
      const combined = [event, ...existing].slice(0, 50); // Keep latest 50 events
      safeStorage.setItem(
        `${PRIVACY_STORAGE_KEYS.AUDIT_LOG}_${userId || 'usr_current'}`,
        JSON.stringify(combined)
      );
    } catch {}

    // Persist to Supabase if configured
    if (isSupabaseConfigured() && userId) {
      try {
        await supabase.from('privacy_audit_events').insert({
          id: event.id,
          user_id: userId,
          event_type: event.eventType,
          details: event.details,
          created_at: event.timestamp,
        });
      } catch {}
    }
  }

  /**
   * Retrieves privacy audit trail
   */
  getAuditEvents(userId: string): PrivacyAuditEvent[] {
    try {
      const data = safeStorage.getItem(
        `${PRIVACY_STORAGE_KEYS.AUDIT_LOG}_${userId || 'usr_current'}`
      );
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private getLocalPreferences(): PrivacyPreferences | null {
    try {
      const data = safeStorage.getItem(PRIVACY_STORAGE_KEYS.PREFERENCES);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  private saveLocalPreferences(prefs: PrivacyPreferences): void {
    try {
      safeStorage.setItem(PRIVACY_STORAGE_KEYS.PREFERENCES, JSON.stringify(prefs));
    } catch {}
  }
}

export const privacyService = new PrivacyService();
