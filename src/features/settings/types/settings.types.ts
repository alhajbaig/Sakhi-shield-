// SakhiShield — Settings Type Contracts

export type FontScale = 'NORMAL' | 'LARGE';

export type CheckInTimeoutSeconds = 30 | 45 | 60 | 90;

export interface UserSettings {
  userId: string;
  fullName: string;
  phone: string;
  emergencyNotes?: string;
  notificationSoundEnabled: boolean;
  soundVolume: number; // 0 - 100
  emergencyAudibleSiren: boolean;
  journeyReminderSound: boolean;
  checkinTimeoutSeconds: CheckInTimeoutSeconds;
  autoAlertCircleOnStart: boolean;
  highContrast: boolean;
  reduceMotion: boolean;
  fontScale: FontScale;
  updatedAt: string;
}

export type PermissionType = 'geolocation' | 'notifications' | 'microphone' | 'camera';

export type PermissionStateValue = 'granted' | 'denied' | 'prompt' | 'unavailable';

export interface DevicePermissionState {
  permission: PermissionType;
  status: PermissionStateValue;
  label: string;
  description: string;
  isOptional: boolean;
}

export interface PasskeyCredentialInfo {
  id: string;
  name: string;
  createdAt: string;
  authenticatorType?: string;
  rawIdHex?: string;
}

export interface SessionInfo {
  id: string;
  isCurrent: boolean;
  browser: string;
  os: string;
  ipApprox: string;
  lastActive: string;
}
