// SakhiShield — useSafetyContext Hook
// Continuously provides a live, reactive SafetyContext snapshot to Copilot components.

import { useState, useEffect, useCallback } from 'react';
import type { SafetyContext } from '../types/safetyCopilot.types';
import { safetyContextService } from '../services/safetyContextService';
import { useAuth } from '../../../lib/AuthContext';
import { useApp } from '../../../lib/AppContext';

export function useSafetyContext(): {
  context: SafetyContext;
  isLoading: boolean;
  refreshContext: () => Promise<void>;
} {
  const { user: authUser } = useAuth();
  const { user: appUser, sosActive } = useApp();
  const [context, setContext] = useState<SafetyContext>(() => ({
    user: {
      id: authUser?.id || 'usr_guest',
      name: authUser?.name || appUser?.name || 'User',
      email: authUser?.email,
      phone: authUser?.phone,
      isAuthenticated: Boolean(authUser?.id),
    },
    monitoring: {
      networkOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
      gpsStatus: 'SEARCHING',
      isLeaderTab: true,
    },
  }));
  const [isLoading, setIsLoading] = useState(false);

  const refreshContext = useCallback(async () => {
    try {
      setIsLoading(true);
      const gathered = await safetyContextService.gatherCurrentContext({
        user: {
          id: authUser?.id || 'usr_guest',
          name: authUser?.name || appUser?.name || 'User',
          email: authUser?.email,
          phone: authUser?.phone,
          isAuthenticated: Boolean(authUser?.id),
        },
        monitoring: {
          networkOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
          gpsStatus: 'LOCKED',
          isLeaderTab: true,
        },
        risk: sosActive
          ? {
              score: 95,
              level: 'CRITICAL',
              activeSignals: ['manual_sos'],
              explanationSummary: 'Emergency SOS is actively triggered.',
            }
          : undefined,
      });
      setContext(gathered);
    } finally {
      setIsLoading(false);
    }
  }, [authUser?.id, authUser?.name, authUser?.email, authUser?.phone, appUser?.name, sosActive]);

  useEffect(() => {
    refreshContext();

    // Listen to network transitions
    const handleOnline = () => refreshContext();
    const handleOffline = () => refreshContext();
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [refreshContext]);

  return { context, isLoading, refreshContext };
}
