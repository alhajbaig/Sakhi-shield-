// SakhiShield — usePrivacySettings Hook

import { useState, useEffect, useCallback } from 'react';
import type {
  PrivacyPreferences,
  PrivacyAuditEvent,
  PurgeTelemetryResult,
} from '../types/privacy.types';
import { DEFAULT_PRIVACY_PREFERENCES } from '../constants/privacy.constants';
import { privacyService } from '../services/privacyService';
import { privacyExportService } from '../services/privacyExportService';

export function usePrivacySettings(
  userId: string,
  userProfile?: { fullName: string; email: string; phone?: string },
  trustedCircleCount: number = 0
) {
  const [preferences, setPreferences] = useState<PrivacyPreferences>(DEFAULT_PRIVACY_PREFERENCES);
  const [auditEvents, setAuditEvents] = useState<PrivacyAuditEvent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isPurging, setIsPurging] = useState<boolean>(false);
  const [lastPurgeResult, setLastPurgeResult] = useState<PurgeTelemetryResult | null>(null);
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showFeedback = (message: string, type: 'success' | 'error' = 'success') => {
    setFeedback({ message, type });
    setTimeout(() => setFeedback(null), 4000);
  };

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const prefs = await privacyService.getPreferences(userId);
      setPreferences(prefs);
      const logs = privacyService.getAuditEvents(userId);
      setAuditEvents(logs);
    } catch {
      showFeedback('Unable to load privacy preferences. Using local defaults.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const updatePreferences = async (updates: Partial<PrivacyPreferences>) => {
    setIsSaving(true);
    // Optimistic local update
    const previous = { ...preferences };
    setPreferences((prev) => ({ ...prev, ...updates }));

    try {
      const res = await privacyService.updatePreferences(userId, updates);
      if (res.success && res.data) {
        setPreferences(res.data);
        setAuditEvents(privacyService.getAuditEvents(userId));
        showFeedback('Privacy policy updated successfully.', 'success');
      } else {
        // Rollback on failure
        setPreferences(previous);
        showFeedback(res.error || 'Failed to update preferences.', 'error');
      }
    } catch {
      setPreferences(previous);
      showFeedback('Network error while saving privacy settings.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const runPurge = async () => {
    setIsPurging(true);
    try {
      const result = await privacyService.runRetentionPurge(userId);
      setLastPurgeResult(result);
      setPreferences((prev) => ({
        ...prev,
        lastPurgeTimestamp: result.timestamp,
      }));
      setAuditEvents(privacyService.getAuditEvents(userId));
      showFeedback(
        `Purge complete: Cleared ${result.purgedSessions} sessions, ${result.purgedGpsPoints} GPS points, ${result.purgedEvidenceCount} vault files.`,
        'success'
      );
    } catch {
      showFeedback('Error executing telemetry purge.', 'error');
    } finally {
      setIsPurging(false);
    }
  };

  const exportData = async () => {
    try {
      const payload = await privacyExportService.generateExportPayload(
        userId,
        userProfile || { fullName: 'User', email: '' },
        preferences,
        trustedCircleCount
      );
      privacyExportService.downloadJsonDossier(payload);
      setAuditEvents(privacyService.getAuditEvents(userId));
      showFeedback('Data dossier exported with SHA-256 verification hash.', 'success');
    } catch {
      showFeedback('Error generating data export.', 'error');
    }
  };

  const deleteTargetedData = async (target: 'GPS_ONLY' | 'INCIDENTS_ONLY' | 'FULL_CACHE') => {
    try {
      const res = await privacyExportService.executeTargetedDeletion(userId, target);
      setAuditEvents(privacyService.getAuditEvents(userId));
      showFeedback(res.message, 'success');
    } catch {
      showFeedback('Error executing deletion request.', 'error');
    }
  };

  return {
    preferences,
    auditEvents,
    isLoading,
    isSaving,
    isPurging,
    lastPurgeResult,
    feedback,
    updatePreferences,
    runPurge,
    exportData,
    deleteTargetedData,
    refreshLogs: () => setAuditEvents(privacyService.getAuditEvents(userId)),
  };
}
