// SakhiShield — File Validation & Sanitization Utility
// Protects against path traversal, oversized uploads, and unverified MIME types.

import { INCIDENT_VAULT_CONFIG } from '../constants/incidentVault.constants';
import type { EvidenceCategory } from '../types';

export interface FileValidationResult {
  valid: boolean;
  sanitizedName: string;
  category: EvidenceCategory;
  error?: string;
}

/**
 * Sanitizes a filename to prevent path traversal or shell exploits.
 * Strips "../", "..\\", null bytes, and non-printable characters.
 */
export function sanitizeFileName(rawName: string): string {
  if (!rawName) return 'unnamed_evidence';

  // 1. Remove path elements (directories)
  const baseName = rawName.split(/[/\\]/).pop() || 'unnamed_evidence';

  // 2. Remove null bytes and control chars
  let cleaned = baseName.replace(/[\x00-\x1F\x7F]/g, '');

  // 3. Remove dangerous characters
  cleaned = cleaned.replace(/[^a-zA-Z0-9._-]/g, '_');

  // 4. Prevent leading dots (hidden files) and excessive length
  cleaned = cleaned.replace(/^\.+/, '');
  if (cleaned.length > 100) {
    const ext = cleaned.substring(cleaned.lastIndexOf('.'));
    cleaned = `${cleaned.substring(0, 90)}${ext}`;
  }

  return cleaned || 'evidence_file';
}

/**
 * Derives evidence category from MIME type and file extension
 */
export function deriveEvidenceCategory(mimeType: string, fileName: string): EvidenceCategory {
  const lowerMime = (mimeType || '').toLowerCase();
  const lowerName = (fileName || '').toLowerCase();

  if (lowerMime.startsWith('image/')) {
    if (lowerName.includes('screenshot') || lowerName.includes('screen_shot')) {
      return 'SCREENSHOT';
    }
    return 'IMAGE';
  }

  if (lowerMime.startsWith('video/')) return 'VIDEO';
  if (lowerMime.startsWith('audio/')) return 'AUDIO';
  if (lowerMime.includes('pdf') || lowerMime.includes('text') || lowerName.endsWith('.pdf')) {
    return 'DOCUMENT';
  }

  return 'OTHER';
}

/**
 * Validates a file against allowed MIME types, extensions, and size limits
 */
export function validateEvidenceFile(file: File): FileValidationResult {
  if (!file) {
    return { valid: false, sanitizedName: '', category: 'OTHER', error: 'No file provided.' };
  }

  // 1. File size check
  if (file.size > INCIDENT_VAULT_CONFIG.storage.maxFileSizeBytes) {
    const maxMb = Math.round(INCIDENT_VAULT_CONFIG.storage.maxFileSizeBytes / (1024 * 1024));
    return {
      valid: false,
      sanitizedName: '',
      category: 'OTHER',
      error: `File size (${Math.round(file.size / 1024 / 1024)} MB) exceeds the ${maxMb} MB limit.`,
    };
  }

  if (file.size === 0) {
    return { valid: false, sanitizedName: '', category: 'OTHER', error: 'Empty files cannot be uploaded.' };
  }

  // 2. Extension check
  const sanitizedName = sanitizeFileName(file.name);
  const ext = sanitizedName.substring(sanitizedName.lastIndexOf('.')).toLowerCase();
  const allowedExts: readonly string[] = INCIDENT_VAULT_CONFIG.storage.allowedExtensions;

  if (!ext || !allowedExts.includes(ext)) {
    return {
      valid: false,
      sanitizedName,
      category: 'OTHER',
      error: `File type "${ext || 'unknown'}" is not supported. Permitted types: ${allowedExts.join(', ')}`,
    };
  }

  // 3. MIME type check
  const allowedMimes: readonly string[] = INCIDENT_VAULT_CONFIG.storage.allowedMimeTypes;
  if (file.type && !allowedMimes.includes(file.type.toLowerCase())) {
    // If browser reported a generic binary/octet-stream but extension is valid, allow with warning
    if (file.type !== 'application/octet-stream') {
      return {
        valid: false,
        sanitizedName,
        category: 'OTHER',
        error: `Unrecognized MIME type "${file.type}".`,
      };
    }
  }

  const category = deriveEvidenceCategory(file.type, sanitizedName);

  return {
    valid: true,
    sanitizedName,
    category,
  };
}
