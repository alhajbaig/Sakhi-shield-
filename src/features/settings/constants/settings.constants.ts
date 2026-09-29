// SakhiShield — Settings Constants

import type { UserSettings } from '../types/settings.types';

export const SETTINGS_STORAGE_KEYS = {
  SETTINGS: 'sakhishield_user_settings_v1',
  PASSKEYS: 'sakhishield_registered_passkeys_v1',
  SECURITY_PIN: 'sakhishield_user_security_pin_v1',
};

export const DEFAULT_USER_SETTINGS: UserSettings = {
  userId: 'usr_default',
  fullName: 'SakhiShield User',
  phone: '',
  emergencyNotes: '',
  notificationSoundEnabled: true,
  soundVolume: 80,
  emergencyAudibleSiren: true,
  journeyReminderSound: true,
  checkinTimeoutSeconds: 45,
  autoAlertCircleOnStart: true,
  highContrast: false,
  reduceMotion: false,
  fontScale: 'NORMAL',
  updatedAt: new Date().toISOString(),
};

export const CHECKIN_TIMEOUT_OPTIONS = [
  { value: 30, label: '30 Seconds (Urgent Response)' },
  { value: 45, label: '45 Seconds (Standard Recommended)' },
  { value: 60, label: '60 Seconds (Extended Notice)' },
  { value: 90, label: '90 Seconds (Transit Friendly)' },
] as const;
