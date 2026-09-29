// SakhiShield — useDigitalSafety Hook
// Provides reactive access to observable security state, password analysis, and URL heuristic checks.

import { useState, useEffect, useCallback } from 'react';
import type {
  DigitalSafetyState,
  PasswordAssessment,
  UrlSecurityAssessment,
} from '../types';
import { digitalSafetyService } from '../services/digitalSafetyService';
import { analyzePasswordLocally, checkPasswordBreachKAnonymity } from '../utils/passwordAnalyzer';
import { analyzeUrlSafety } from '../utils/urlAnalyzer';
import { useAuth } from '../../../lib/AuthContext';

export function useDigitalSafety() {
  const { user: authUser } = useAuth();

  const [state, setState] = useState<DigitalSafetyState>({
    score: {
      overall: 0,
      isComplete: false,
      status: 'INCOMPLETE',
      categoryBreakdown: {} as any,
      explanation: 'Running digital safety assessment...',
    },
    checks: [],
    findings: [],
    recommendations: [],
    session: {
      isAuthenticated: false,
      sessionState: 'UNAUTHENTICATED',
      authMethod: 'None',
      emailVerified: false,
      currentOrigin: '',
      isSecureContext: false,
      storageAvailability: { localStorage: false, sessionStorage: false, indexedDb: false },
      supportedBrowserCrypto: false,
    },
    privacy: {
      geolocationPermission: 'unavailable',
      notificationPermission: 'unavailable',
      trustedCircleCount: 0,
      hasEmergencyContacts: false,
      isPublicProfileExposed: false,
      cameraPermissionState: 'unavailable',
      microphonePermissionState: 'unavailable',
    },
    lastAssessedAt: new Date().toISOString(),
    isLoading: true,
  });

  // Password analyzer state (client-only, transient)
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [passwordResult, setPasswordResult] = useState<PasswordAssessment | null>(null);
  const [isCheckingBreach, setIsCheckingBreach] = useState<boolean>(false);

  // URL analyzer state
  const [urlInput, setUrlInput] = useState<string>('');
  const [urlResult, setUrlResult] = useState<UrlSecurityAssessment | null>(null);

  // Refresh assessment
  const refreshAssessment = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      const assessment = await digitalSafetyService.runFullAssessment(authUser);
      setState(assessment);
    } catch (err: any) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: err?.message || 'Assessment failed',
      }));
    }
  }, [authUser]);

  useEffect(() => {
    refreshAssessment();
  }, [refreshAssessment]);

  // Handler for analyzing password locally
  const handlePasswordChange = useCallback((raw: string) => {
    setPasswordInput(raw);
    if (!raw) {
      setPasswordResult(null);
      return;
    }
    const result = analyzePasswordLocally(raw);
    setPasswordResult(result);
  }, []);

  // Handler for k-anonymity breach check
  const handleCheckBreach = useCallback(async () => {
    if (!passwordInput || !passwordResult) return;
    setIsCheckingBreach(true);
    try {
      const { breachStatus, occurrences } = await checkPasswordBreachKAnonymity(passwordInput);
      setPasswordResult((prev) => (prev ? { ...prev, breachStatus, breachOccurrences: occurrences } : null));
    } catch {
      setPasswordResult((prev) => (prev ? { ...prev, breachStatus: 'SERVICE_UNAVAILABLE' } : null));
    } finally {
      setIsCheckingBreach(false);
    }
  }, [passwordInput, passwordResult]);

  // Clear password memory immediately
  const handleClearPassword = useCallback(() => {
    setPasswordInput('');
    setPasswordResult(null);
  }, []);

  // Handler for analyzing URL
  const handleAnalyzeUrl = useCallback((link: string) => {
    setUrlInput(link);
    if (!link.trim()) {
      setUrlResult(null);
      return;
    }
    const result = analyzeUrlSafety(link);
    setUrlResult(result);
  }, []);

  return {
    state,
    refreshAssessment,
    // Password Tool
    passwordInput,
    passwordResult,
    isCheckingBreach,
    handlePasswordChange,
    handleCheckBreach,
    handleClearPassword,
    // URL Tool
    urlInput,
    urlResult,
    handleAnalyzeUrl,
  };
}
