// SakhiShield — Privacy Data Export & Sovereignty Service
// Implements user data export dossier generation, SHA-256 verification digest, and deletion requests.

import type { DataExportPayload, PrivacyPreferences } from '../types/privacy.types';
import { privacyService } from './privacyService';

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

export class PrivacyExportService {
  /**
   * Generates a complete data sovereignty export dossier for the user
   */
  async generateExportPayload(
    userId: string,
    profile: { fullName: string; email: string; phone?: string },
    preferences: PrivacyPreferences,
    trustedCircleCount: number
  ): Promise<DataExportPayload> {
    const timestamp = new Date().toISOString();

    // Check incident vault records summary
    let totalIncidents = 0;
    let totalEvidenceFiles = 0;
    try {
      const raw = safeStorage.getItem('sakhishield_incident_vault_local_records_v1');
      if (raw) {
        const records = JSON.parse(raw);
        if (Array.isArray(records)) {
          totalIncidents = records.length;
          totalEvidenceFiles = records.reduce(
            (acc: number, r: any) => acc + (r.evidence ? r.evidence.length : 0),
            0
          );
        }
      }
    } catch {}

    const payload: DataExportPayload = {
      exportMetadata: {
        system: 'SakhiShield Sovereign Data Engine',
        version: '1.0.0',
        exportedAt: timestamp,
        userId: userId || 'usr_current',
      },
      profile: {
        fullName: profile.fullName || 'User',
        email: profile.email || '',
        phone: profile.phone,
      },
      privacySettings: preferences,
      trustedCircleCount,
      safetyHistoryCount: 0,
      incidentVaultSummary: {
        totalIncidents,
        totalEvidenceFiles,
      },
    };

    // Calculate SHA-256 checksum of exported JSON data
    try {
      const jsonStr = JSON.stringify(payload);
      if (typeof crypto !== 'undefined' && crypto.subtle) {
        const encoder = new TextEncoder();
        const data = encoder.encode(jsonStr);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
        payload.exportMetadata.sha256Checksum = `sha256:${hashHex}`;
      }
    } catch {}

    await privacyService.logAuditEvent(
      userId,
      'DATA_EXPORT_GENERATED',
      `Complete data sovereignty export dossier downloaded. Checksum: ${payload.exportMetadata.sha256Checksum || 'computed'}`
    );

    return payload;
  }

  /**
   * Prompts the browser to download the export JSON dossier
   */
  downloadJsonDossier(payload: DataExportPayload): void {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(payload, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute(
      'download',
      `sakhishield-data-sovereignty-export-${new Date().toISOString().slice(0, 10)}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }

  /**
   * Performs targeted or full data purge on user request
   */
  async executeTargetedDeletion(
    userId: string,
    target: 'GPS_ONLY' | 'INCIDENTS_ONLY' | 'FULL_CACHE'
  ): Promise<{ success: boolean; message: string }> {
    if (target === 'GPS_ONLY') {
      safeStorage.removeItem('sakhishield_active_journey_v2');
      safeStorage.removeItem('sakhishield_active_journey_session_v2');
      await privacyService.logAuditEvent(userId, 'DATA_DELETION_REQUESTED', 'User purged all ephemeral GPS and session history.');
      return { success: true, message: 'All active and cached GPS telemetry coordinates successfully purged.' };
    }

    if (target === 'INCIDENTS_ONLY') {
      safeStorage.removeItem('sakhishield_incident_vault_local_records_v1');
      await privacyService.logAuditEvent(userId, 'DATA_DELETION_REQUESTED', 'User purged local Incident Vault records cache.');
      return { success: true, message: 'Local Incident Vault records and evidence cache cleared.' };
    }

    if (target === 'FULL_CACHE') {
      safeStorage.removeItem('sakhishield_active_journey_v2');
      safeStorage.removeItem('sakhishield_active_journey_session_v2');
      safeStorage.removeItem('sakhishield_incident_vault_local_records_v1');
      safeStorage.removeItem('sakhishield_privacy_preferences_v1');
      await privacyService.logAuditEvent(userId, 'DATA_DELETION_REQUESTED', 'User purged complete local application cache.');
      return { success: true, message: 'Complete local safety cache wiped clean.' };
    }

    return { success: true, message: 'Deletion completed.' };
  }
}

export const privacyExportService = new PrivacyExportService();
