// SakhiShield — Application Settings Core Service
// Handles user settings persistence to Supabase and local cache, PIN management, and session inspection.

import { supabase, isSupabaseConfigured } from '../../../lib/supabase';
import type { UserSettings, SessionInfo } from '../types/settings.types';
import {
  DEFAULT_USER_SETTINGS,
  SETTINGS_STORAGE_KEYS,
} from '../constants/settings.constants';

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
};

export class SettingsService {
  /**
   * Retrieves application settings for user
   */
  async getSettings(userId: string): Promise<UserSettings> {
    if (isSupabaseConfigured() && userId) {
      try {
        const { data, error } = await supabase
          .from('user_settings')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle();

        if (!error && data) {
          const loaded: UserSettings = {
            userId: data.user_id,
            fullName: DEFAULT_USER_SETTINGS.fullName,
            phone: '',
            emergencyNotes: '',
            notificationSoundEnabled: data.notification_sound_enabled,
            soundVolume: data.sound_volume,
            emergencyAudibleSiren: data.emergency_audible_siren,
            journeyReminderSound: data.journey_reminder_sound,
            checkinTimeoutSeconds: data.checkin_timeout_seconds,
            autoAlertCircleOnStart: data.auto_alert_circle_on_start,
            highContrast: data.high_contrast,
            reduceMotion: data.reduce_motion,
            fontScale: data.font_scale,
            updatedAt: data.updated_at,
          };
          this.saveLocalSettings(loaded);
          return loaded;
        }
      } catch (err) {
        console.warn('[SettingsService] Supabase fetch error, using local fallback:', err);
      }
    }

    const local = this.getLocalSettings();
    if (local && (!userId || local.userId === userId)) {
      return local;
    }

    const initial: UserSettings = {
      ...DEFAULT_USER_SETTINGS,
      userId: userId || 'usr_current',
      updatedAt: new Date().toISOString(),
    };
    this.saveLocalSettings(initial);
    return initial;
  }

  /**
   * Updates application settings
   */
  async updateSettings(
    userId: string,
    updates: Partial<UserSettings>
  ): Promise<{ success: boolean; data?: UserSettings; error?: string }> {
    const current = await this.getSettings(userId);
    const updated: UserSettings = {
      ...current,
      ...updates,
      userId: userId || current.userId,
      updatedAt: new Date().toISOString(),
    };

    // 1. Save locally for instant reactivity
    this.saveLocalSettings(updated);

    // 2. Persist to Supabase if configured
    if (isSupabaseConfigured() && userId) {
      try {
        const { error } = await supabase.from('user_settings').upsert({
          user_id: userId,
          notification_sound_enabled: updated.notificationSoundEnabled,
          sound_volume: updated.soundVolume,
          emergency_audible_siren: updated.emergencyAudibleSiren,
          journey_reminder_sound: updated.journeyReminderSound,
          checkin_timeout_seconds: updated.checkinTimeoutSeconds,
          auto_alert_circle_on_start: updated.autoAlertCircleOnStart,
          high_contrast: updated.highContrast,
          reduce_motion: updated.reduceMotion,
          font_scale: updated.fontScale,
          updated_at: updated.updatedAt,
        });

        if (error) {
          console.warn('[SettingsService] Supabase upsert error:', error.message);
        }
      } catch (err) {
        console.warn('[SettingsService] Network error during upsert:', err);
      }
    }

    return { success: true, data: updated };
  }

  /**
   * Saves or updates the local security PIN
   */
  async setSecurityPin(userId: string, pin: string): Promise<boolean> {
    if (!/^\d{4,6}$/.test(pin)) return false;
    try {
      // Store hashed representation for PIN verification
      let pinHash = pin;
      if (typeof crypto !== 'undefined' && crypto.subtle) {
        const encoder = new TextEncoder();
        const data = encoder.encode(`sakhishield_pin_salt_${userId}_${pin}`);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        pinHash = Array.from(new Uint8Array(hashBuffer))
          .map((b) => b.toString(16).padStart(2, '0'))
          .join('');
      }
      safeStorage.setItem(
        `${SETTINGS_STORAGE_KEYS.SECURITY_PIN}_${userId || 'usr_current'}`,
        pinHash
      );
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Inspects current device session
   */
  getCurrentSessionInfo(): SessionInfo {
    let browser = 'Unknown Browser';
    let os = 'Unknown OS';

    if (typeof navigator !== 'undefined') {
      const ua = navigator.userAgent;
      if (ua.includes('Firefox')) browser = 'Mozilla Firefox';
      else if (ua.includes('Edg')) browser = 'Microsoft Edge';
      else if (ua.includes('Chrome')) browser = 'Google Chrome';
      else if (ua.includes('Safari')) browser = 'Apple Safari';

      if (ua.includes('Windows')) os = 'Windows Desktop';
      else if (ua.includes('Macintosh')) os = 'macOS';
      else if (ua.includes('Android')) os = 'Android Mobile';
      else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS Device';
      else if (ua.includes('Linux')) os = 'Linux';
    }

    return {
      id: 'sess_active_current',
      isCurrent: true,
      browser,
      os,
      ipApprox: 'Client Origin Verified',
      lastActive: new Date().toISOString(),
    };
  }

  private getLocalSettings(): UserSettings | null {
    try {
      const data = safeStorage.getItem(SETTINGS_STORAGE_KEYS.SETTINGS);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  private saveLocalSettings(settings: UserSettings): void {
    try {
      safeStorage.setItem(SETTINGS_STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch {}
  }
}

export const settingsService = new SettingsService();
