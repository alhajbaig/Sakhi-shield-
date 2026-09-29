// SakhiShield — useSettings Hook

import { useState, useEffect, useCallback } from 'react';
import type { UserSettings, PasskeyCredentialInfo, SessionInfo } from '../types/settings.types';
import { DEFAULT_USER_SETTINGS } from '../constants/settings.constants';
import { settingsService } from '../services/settingsService';
import { webAuthnService } from '../services/webAuthnService';
import { playNotificationChime, playEmergencySirenPreview } from '../utils/audioSynthesizer';

export function useSettings(userId: string, userName: string = 'User') {
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_USER_SETTINGS);
  const [passkeys, setPasskeys] = useState<PasskeyCredentialInfo[]>([]);
  const [sessionInfo, setSessionInfo] = useState<SessionInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showFeedback = (message: string, type: 'success' | 'error' = 'success') => {
    setFeedback({ message, type });
    setTimeout(() => setFeedback(null), 4000);
  };

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await settingsService.getSettings(userId);
      setSettings(data);
      const keys = webAuthnService.getRegisteredPasskeys(userId);
      setPasskeys(keys);
      setSessionInfo(settingsService.getCurrentSessionInfo());
    } catch {
      showFeedback('Unable to load settings. Using local defaults.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const updateSettings = async (updates: Partial<UserSettings>) => {
    setIsSaving(true);
    const previous = { ...settings };
    setSettings((prev) => ({ ...prev, ...updates }));

    try {
      const res = await settingsService.updateSettings(userId, updates);
      if (res.success && res.data) {
        setSettings(res.data);
        showFeedback('Preferences saved successfully.', 'success');
      } else {
        setSettings(previous);
        showFeedback(res.error || 'Failed to save settings.', 'error');
      }
    } catch {
      setSettings(previous);
      showFeedback('Network error while saving settings.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const registerNewPasskey = async (label: string) => {
    try {
      const res = await webAuthnService.registerPasskey(userId, userName, label);
      if (res.success && res.passkey) {
        setPasskeys(webAuthnService.getRegisteredPasskeys(userId));
        showFeedback(`Passkey "${res.passkey.name}" registered successfully.`, 'success');
        return { success: true };
      } else {
        showFeedback(res.error || 'Passkey registration cancelled.', 'error');
        return { success: false, error: res.error };
      }
    } catch (err: any) {
      showFeedback(err.message || 'Error creating passkey.', 'error');
      return { success: false, error: err.message };
    }
  };

  const removePasskey = (passkeyId: string) => {
    webAuthnService.removePasskey(userId, passkeyId);
    setPasskeys(webAuthnService.getRegisteredPasskeys(userId));
    showFeedback('Passkey removed from device.', 'success');
  };

  const updatePin = async (newPin: string): Promise<boolean> => {
    if (!/^\d{4,6}$/.test(newPin)) {
      showFeedback('Security PIN must be 4 to 6 numeric digits.', 'error');
      return false;
    }
    const success = await settingsService.setSecurityPin(userId, newPin);
    if (success) {
      showFeedback('Security PIN updated successfully.', 'success');
      return true;
    } else {
      showFeedback('Could not save PIN. Please retry.', 'error');
      return false;
    }
  };

  const testChime = () => {
    const played = playNotificationChime(settings.soundVolume);
    if (!played) {
      showFeedback('Audio context unavailable in current browser state.', 'error');
    }
  };

  const testSiren = () => {
    const played = playEmergencySirenPreview(settings.soundVolume);
    if (!played) {
      showFeedback('Audio context unavailable in current browser state.', 'error');
    }
  };

  return {
    settings,
    passkeys,
    sessionInfo,
    isLoading,
    isSaving,
    feedback,
    updateSettings,
    registerNewPasskey,
    removePasskey,
    updatePin,
    testChime,
    testSiren,
  };
}
