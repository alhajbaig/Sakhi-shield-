// SakhiShield — Incident Vault Constants
// Defines limits, allowed MIME types, disclaimers, and storage bucket configuration.

import type { IncidentCategory, IncidentSeverity, IncidentStatus, EvidenceCategory } from '../types';

export const INCIDENT_VAULT_CONFIG = {
  // Storage settings
  storage: {
    bucketName: 'incident-evidence',
    maxFileSizeBytes: 25 * 1024 * 1024, // 25 MB max per evidence item
    allowedMimeTypes: [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/heic',
      'video/mp4',
      'video/webm',
      'video/quicktime',
      'audio/mpeg',
      'audio/ogg',
      'audio/wav',
      'audio/mp4',
      'audio/webm',
      'application/pdf',
      'text/plain',
    ],
    allowedExtensions: [
      '.jpg', '.jpeg', '.png', '.webp', '.heic',
      '.mp4', '.webm', '.mov',
      '.mp3', '.ogg', '.wav', '.m4a',
      '.pdf', '.txt',
    ],
  },

  // Sharing settings
  sharing: {
    defaultExpirationHours: 24,
    allowedExpirationHours: [1, 24, 72, 168], // 1 hour, 1 day, 3 days, 7 days
    tokenLengthBytes: 32,
  },

  // Offline queue settings
  offline: {
    storageKey: 'sakhishield_incident_vault_offline_queue_v1',
    maxRetries: 5,
    retryDelayMs: 2500,
  },
} as const;

export const INCIDENT_CATEGORIES_CONFIG: Record<
  IncidentCategory,
  { label: string; description: string; badgeColor: string }
> = {
  HARASSMENT: {
    label: 'Harassment',
    description: 'Verbal, physical, or behavioral intimidation in public or transit.',
    badgeColor: 'bg-red-50 text-red-700 border-red-200',
  },
  THREAT: {
    label: 'Direct Threat',
    description: 'Explicit verbal, digital, or physical threats to personal safety.',
    badgeColor: 'bg-red-100 text-red-800 border-red-300',
  },
  STALKING: {
    label: 'Stalking / Following',
    description: 'Repeated unwanted surveillance, tailing, or trailing across transit corridors.',
    badgeColor: 'bg-amber-50 text-amber-800 border-amber-300',
  },
  SUSPICIOUS_ACTIVITY: {
    label: 'Suspicious Activity',
    description: 'Unusual behavior, loitering, or anomalous actions in transit routes.',
    badgeColor: 'bg-yellow-50 text-yellow-800 border-yellow-200',
  },
  TRAVEL_INCIDENT: {
    label: 'Travel Incident',
    description: 'Vehicle breakdown, unauthorized route deviation, or cab dispute.',
    badgeColor: 'bg-stone-100 text-stone-800 border-stone-300',
  },
  EMERGENCY: {
    label: 'Emergency / SOS',
    description: 'High-severity safety crisis requiring guardian or authority intervention.',
    badgeColor: 'bg-red-600 text-white border-red-700',
  },
  PHYSICAL_SAFETY: {
    label: 'Physical Safety',
    description: 'Physical confrontation, assault attempt, or hazardous environment.',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
  },
  DIGITAL_SAFETY: {
    label: 'Digital Stalking / Cyber',
    description: 'Unsolicited messages, screenshot evidence of cyber harassment.',
    badgeColor: 'bg-purple-50 text-purple-800 border-purple-200',
  },
  OTHER: {
    label: 'Other Incident',
    description: 'General safety observations and documentation.',
    badgeColor: 'bg-stone-50 text-stone-700 border-stone-200',
  },
};

export const INCIDENT_SEVERITY_CONFIG: Record<
  IncidentSeverity,
  { label: string; level: number; color: string }
> = {
  LOW: { label: 'Low', level: 1, color: 'text-stone-600 bg-stone-100 border-stone-200' },
  MEDIUM: { label: 'Medium', level: 2, color: 'text-amber-800 bg-amber-50 border-amber-200' },
  HIGH: { label: 'High', level: 3, color: 'text-red-700 bg-red-50 border-red-200' },
  CRITICAL: { label: 'Critical', level: 4, color: 'text-white bg-red-600 border-red-700' },
};

export const INCIDENT_STATUS_CONFIG: Record<
  IncidentStatus,
  { label: string; description: string }
> = {
  DRAFT: { label: 'Draft', description: 'Pending user review before finalization.' },
  ACTIVE: { label: 'Active', description: 'Under ongoing documentation or review.' },
  DOCUMENTED: { label: 'Documented', description: 'Evidence verified and locked.' },
  RESOLVED: { label: 'Resolved', description: 'Safety confirmed and event closed.' },
  ARCHIVED: { label: 'Archived', description: 'Preserved for historical reference.' },
};

export const EVIDENCE_CATEGORIES_CONFIG: Record<
  EvidenceCategory,
  { label: string; icon: string }
> = {
  IMAGE: { label: 'Photograph', icon: 'Image' },
  AUDIO: { label: 'Audio Recording', icon: 'Mic' },
  VIDEO: { label: 'Video Clip', icon: 'Video' },
  DOCUMENT: { label: 'Document / PDF', icon: 'FileText' },
  SCREENSHOT: { label: 'Digital Screenshot', icon: 'ScanText' },
  OTHER: { label: 'File Attachment', icon: 'Paperclip' },
};

export const INCIDENT_VAULT_DISCLAIMERS = {
  INTEGRITY_NOTICE:
    'Integrity verification uses client and server SHA-256 cryptographic hashing to confirm evidence bytes match the uploaded original. This provides technical verification of data integrity, not legal or court certification.',
  STORAGE_PRIVACY:
    'All evidence files are stored in private, RLS-protected storage. Direct public file URLs are never exposed. Sharing occurs via time-limited, revocable cryptographically random access tokens.',
  ZERO_AI_INGESTION:
    'Evidence attached to your Incident Vault is never sent to third-party artificial intelligence models, cloud OCR engines, or advertising trackers without your explicit direction.',
};
